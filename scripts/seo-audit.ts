/**
 * SEO の監査（ビルドした HTML と、検索語の割り当て表を突き合わせる）。
 *   npm run build && npm run seo:audit
 *
 * 確かめること
 *   - ページごとの title・description・canonical・robots・h1 の数・構造化データ・画像の alt・内部リンクの数
 *   - title・description の重複
 *   - 検索語の取り合い：同じ検索語を2つの URL が狙っていないか（data/seo-keyword-map.ts・記事・施工事例・題材・候補）
 *   - ページの種類ごとに、あるべき内部リンク（サービス ⇄ 施工事例 ⇄ コラム ⇄ 地域）がそろっているか
 *   - ページの一覧（lib/routes.ts）と、実際に出力されたページが食い違っていないか
 * 結果は docs/seo-audit-report.md に書き出す（割り当て表の全体・ページごとの一覧・これから書く題材の順番を含む）。
 * docs/SEO_ROADMAP.md の「これから書くコラムの順番」の表も、ここで書き直す。
 * 誤りが1件でもあれば、終了コード 1 で終わる（注意だけなら 0）。
 *
 * 本番 URL を仮に入れてビルドすると、canonical と index / noindex まで確かめられる：
 *   NEXT_PUBLIC_SITE_URL=https://www.example.jp npm run build && NEXT_PUBLIC_SITE_URL=https://www.example.jp npm run seo:audit
 */
import fs from "node:fs";
import path from "node:path";
import { normalizeKeyword } from "@/data/seo-keyword-map";
import { getAllPosts } from "@/lib/blog";
import { blogClusters, getCluster } from "@/lib/blog-clusters";
import { backlog, backlogCounts } from "@/lib/blog-generator/backlog";
import { pickTopic } from "@/lib/blog-generator/generate";
import { diceBigram } from "@/lib/blog-generator/similarity";
import { topics, type Topic } from "@/lib/blog-generator/topics";
import { allRoutes } from "@/lib/routes";
import { fullKeywordMap, keywordConflicts, type SeoEntry } from "@/lib/seo-map";
import { siteConfig } from "@/lib/site";

const ROOT = process.cwd();
const APP = path.join(ROOT, ".next", "server", "app");
const REPORT = path.join(ROOT, "docs", "seo-audit-report.md");
const ROADMAP = path.join(ROOT, "docs", "SEO_ROADMAP.md");
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");

if (!fs.existsSync(APP)) {
  console.error("ビルドの出力がありません。先に npm run build を実行してください。");
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* HTML の読み取り                                                     */
/* ------------------------------------------------------------------ */
type Page = {
  route: string;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  noindex: boolean;
  h1: string[];
  h2: number;
  ld: string[];
  imgNoAlt: number;
  imgCount: number;
  /** 本文（<main>）の中の、サイト内リンクの行き先 */
  mainLinks: string[];
  /** 本文の文字数（タグと空白を除く） */
  textLength: number;
};

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)));
const strip = (html: string) => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, "");
/** 文字の幅（全角を1、半角を0.5と数える） */
const width = (s: string) => [...s].reduce((n, ch) => n + (ch.charCodeAt(0) > 0xff ? 1 : 0.5), 0);

function collect(dir: string, base = ""): { file: string; route: string }[] {
  const out: { file: string; route: string }[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...collect(path.join(dir, e.name), rel));
    else if (e.name.endsWith(".html")) {
      const p = rel.replace(/\.html$/, "");
      out.push({ file: path.join(dir, e.name), route: p === "index" ? "/" : `/${p.replace(/\/index$/, "")}` });
    }
  }
  return out;
}

function read(file: string, route: string): Page {
  const html = fs.readFileSync(file, "utf8");
  const body = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  const main = /<main[\s\S]*?<\/main>/.exec(body)?.[0] ?? "";
  const robots = /<meta name="robots" content="([^"]*)"/.exec(html)?.[1] ?? "";
  const ld: string[] = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]) as { "@type"?: string; "@graph"?: { "@type"?: string }[] };
      for (const node of Array.isArray(data["@graph"]) ? data["@graph"] : [data]) if (node["@type"]) ld.push(node["@type"]);
    } catch {
      ld.push("（読めない JSON-LD）");
    }
  }
  const imgs = [...body.matchAll(/<img\s[^>]*>/g)].map((m) => m[0]);
  const links = [...main.matchAll(/<a\s[^>]*href="([^"]+)"/g)]
    .map((m) => decode(m[1]))
    .filter((h) => h.startsWith("/") && !h.startsWith("//"))
    .map((h) => h.split("#")[0].split("?")[0].replace(/\/$/, "") || "/");
  return {
    route,
    title: decode(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? ""),
    description: decode(/<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? ""),
    canonical: /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1] ?? "",
    robots,
    noindex: /noindex/.test(robots),
    h1: [...body.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)].map((m) => decode(m[0].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()),
    h2: [...main.matchAll(/<h2[\s>]/g)].length,
    ld: [...new Set(ld)].sort(),
    imgNoAlt: imgs.filter((t) => !/\salt="/.test(t)).length,
    imgCount: imgs.length,
    mainLinks: links,
    textLength: strip(main).length,
  };
}

const SKIP = new Set(["/_not-found", "/_global-error"]);
const pages = collect(APP)
  .filter((p) => !SKIP.has(p.route))
  .map((p) => read(p.file, p.route))
  .sort((a, b) => a.route.localeCompare(b.route));
const pageOf = new Map(pages.map((p) => [p.route, p]));

/* ------------------------------------------------------------------ */
/* 検査                                                                */
/* ------------------------------------------------------------------ */
const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

const routes = allRoutes();
const routeOf = new Map(routes.map((r) => [r.path, r]));
const map = fullKeywordMap();
const entryOf = new Map(map.map((e) => [e.url, e]));

/* 1. ページの一覧と、出力されたページ */
for (const r of routes) if (!pageOf.has(r.path)) err(`ページの一覧（lib/routes.ts）にある ${r.path} が、出力されていません`);
for (const p of pages) if (!routeOf.has(p.route)) err(`出力されたページ ${p.route} が、ページの一覧（lib/routes.ts）にありません（サイトマップに入りません）`);

/* 2. ページごとの基本 */
const titles = new Map<string, string[]>();
const descriptions = new Map<string, string[]>();
for (const p of pages) {
  const r = routeOf.get(p.route);
  const indexable = SITE_URL ? !p.noindex : (r?.index ?? false);
  if (!p.title) err(`${p.route} … title がありません`);
  if (!p.description) err(`${p.route} … meta description がありません`);
  if (p.h1.length !== 1) err(`${p.route} … h1 が ${p.h1.length} 個あります（1個にする）`);
  if (p.imgNoAlt) err(`${p.route} … alt の無い画像が ${p.imgNoAlt} 枚あります`);
  if (p.title) titles.set(p.title, [...(titles.get(p.title) ?? []), p.route]);
  if (p.description) descriptions.set(p.description, [...(descriptions.get(p.description) ?? []), p.route]);
  if (indexable) {
    if (p.title && (width(p.title) > 40 || width(p.title) < 10)) warn(`${p.route} … title の長さ（全角換算 ${width(p.title)} 字）：${p.title}`);
    if (p.description && (width(p.description) < 50 || width(p.description) > 125)) warn(`${p.route} … description の長さ（全角換算 ${width(p.description)} 字）`);
    if (p.route !== "/" && !p.ld.includes("BreadcrumbList")) err(`${p.route} … パンくずの構造化データ（BreadcrumbList）がありません`);
    if (!entryOf.has(p.route)) err(`${p.route} … 検索語の割り当て（data/seo-keyword-map.ts など）がありません`);
    if (p.textLength < 500 && !["/contact"].includes(p.route)) warn(`${p.route} … 本文が短い（${p.textLength} 字）。内容の薄いページになっていないか確かめる`);
  }
  if (SITE_URL) {
    if (r && r.index === p.noindex) err(`${p.route} … ページの一覧では index=${r.index} ですが、出力は robots="${p.robots}" です`);
    if (!p.noindex) {
      const want = `${SITE_URL}${p.route === "/" ? "" : p.route}`;
      if (!p.canonical) err(`${p.route} … canonical がありません`);
      else if (p.canonical !== want) err(`${p.route} … canonical が自分自身を指していません（${p.canonical}）`);
    }
  }
}
for (const [t, rs] of titles) if (rs.length > 1) err(`title が重複しています：「${t}」 ${rs.join("、")}`);
for (const [d, rs] of descriptions) if (rs.length > 1) err(`description が重複しています：「${d.slice(0, 30)}…」 ${rs.join("、")}`);

/* 3. 検索語の取り合い */
for (const c of keywordConflicts(map)) (c.level === "error" ? err : warn)(c.message);

/* 4. 検索語が、title と h1 に入っているか（サービス・地域のページ） */
const BRAND = [siteConfig.shortName, siteConfig.name, siteConfig.nickname].map((x) => x.replace(/\s/g, ""));
for (const e of map) {
  const p = pageOf.get(e.url);
  if (!p) continue;
  const tokens = e.primaryKeyword.split(/[\s　]+/).filter(Boolean);
  const has = (text: string, tok: string) => text.replace(/\s/g, "").toLowerCase().includes(tok.toLowerCase());
  if (e.contentType === "service" || e.contentType === "area") {
    const missT = tokens.filter((t) => !has(p.title, t));
    const missH = tokens.filter((t) => !BRAND.includes(t) && !has(p.h1.join(" "), t));
    if (missT.length) warn(`${e.url} … 主キーワード「${e.primaryKeyword}」の語（${missT.join("・")}）が、title に入っていません：${p.title}`);
    if (missH.length) warn(`${e.url} … 主キーワード「${e.primaryKeyword}」の語（${missH.join("・")}）が、h1 に入っていません：${p.h1.join(" / ")}`);
  }
}

/* 5. title が近すぎるページ（検索結果で取り合う可能性） */
const idx = pages.filter((p) => (SITE_URL ? !p.noindex : (routeOf.get(p.route)?.index ?? false)));
const core = (t: string) => t.replace(new RegExp(`[｜|]\\s*(?:${BRAND.join("|")}|株式会社 横浜総合住設)\\s*$`), "");
for (let i = 0; i < idx.length; i++) {
  for (let j = i + 1; j < idx.length; j++) {
    const s = diceBigram(core(idx[i].title), core(idx[j].title));
    if (s >= 0.8) warn(`title が近いページ（${s.toFixed(2)}）：${idx[i].route}「${idx[i].title}」と ${idx[j].route}「${idx[j].title}」`);
  }
}

/* 6. 内部リンク（本文の中のリンク） */
const inbound = new Map<string, Set<string>>();
for (const p of pages) for (const to of new Set(p.mainLinks)) if (to !== p.route) inbound.set(to, new Set([...(inbound.get(to) ?? []), p.route]));
const linksTo = (p: Page, prefix: string, except?: string) => [...new Set(p.mainLinks)].filter((h) => h.startsWith(prefix) && h !== except && h !== p.route);
for (const e of map) {
  const p = pageOf.get(e.url);
  if (!p) continue;
  switch (e.contentType) {
    case "service":
      if (!linksTo(p, "/area/").length) err(`${e.url} … 本文から地域ページへのリンクがありません`);
      if (!linksTo(p, "/service/").length) err(`${e.url} … 本文からほかのサービスページへのリンクがありません`);
      if (e.relatedWorks.length && !linksTo(p, "/works/").length) err(`${e.url} … 施工事例があるのに、本文からリンクしていません`);
      if (e.relatedArticles.length && !linksTo(p, "/blog/").length) err(`${e.url} … 関連するコラムがあるのに、本文からリンクしていません`);
      break;
    case "area":
      if (linksTo(p, "/service/").length < 3) err(`${e.url} … 本文からサービスページへのリンクが3本未満です`);
      break;
    case "work": {
      const main = e.relatedServices[0];
      if (main && !p.mainLinks.some((h) => h.startsWith("/service/") && h.endsWith(`/${main}`))) err(`${e.url} … 代表サービスのページへのリンクがありません`);
      if (!p.mainLinks.includes("/works")) err(`${e.url} … 施工事例の一覧へのリンクがありません`);
      if (e.relatedArticles.length && !linksTo(p, "/blog/").length) err(`${e.url} … 関連するコラムがあるのに、本文からリンクしていません`);
      break;
    }
    case "article":
      if (e.parentTopic && !p.mainLinks.includes(e.parentTopic)) err(`${e.url} … 親ページ ${e.parentTopic} へのリンクがありません`);
      if (!linksTo(p, "/service/").length) err(`${e.url} … 本文からサービスページへのリンクがありません`);
      if (linksTo(p, "/blog/").filter((h) => !h.startsWith("/blog/category/")).length < 2) warn(`${e.url} … ほかの記事へのリンクが2本未満です（記事が増えたら、関連記事を足す）`);
      break;
    case "works-list":
      if (!linksTo(p, "/service/").length) err(`${e.url} … サービスページへのリンクがありません`);
      break;
    default:
      break;
  }
  if (e.index && e.url !== "/" && !(inbound.get(e.url)?.size ?? 0)) warn(`${e.url} … ほかのページの本文から、1本もリンクされていません（ヘッダー・フッターのリンクだけ）`);
}

/* ------------------------------------------------------------------ */
/* これから書く題材の順番（自動投稿が選ぶ順に並べる）                  */
/* ------------------------------------------------------------------ */
function planNewArticles(limit: number): Topic[] {
  const existing = getAllPosts().map((p) => ({ slug: p.slug, intent: p.intent, category: p.category, keywords: p.keywords }));
  const out: Topic[] = [];
  for (let i = 0; i < limit; i++) {
    const t = pickTopic(existing);
    if (!t) break;
    out.push(t);
    existing.push({ slug: t.slug, intent: t.intent, category: t.cluster, keywords: [t.keyword] });
  }
  return out;
}
const plan = planNewArticles(90);
const planTable = [
  "| 順 | 優先度 | カテゴリ | 主キーワード | 題名の方向 | 親ページ |",
  "| --- | --- | --- | --- | --- | --- |",
  ...plan.map((t, i) => `| ${i + 1} | ${t.priority} | ${getCluster(t.cluster)?.name ?? t.cluster} | ${t.keyword} | ${t.titleHint} | ${getCluster(t.cluster)?.pillar.href ?? ""} |`),
].join("\n");

/* ------------------------------------------------------------------ */
/* 書き出し                                                            */
/* ------------------------------------------------------------------ */
const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const cell = (s: string) => s.replace(/\|/g, "｜").replace(/\n/g, " ");
const TYPE: Record<SeoEntry["contentType"], string> = {
  home: "トップ",
  hub: "一覧・案内",
  service: "サービス",
  area: "地域",
  company: "会社",
  support: "案内",
  "blog-hub": "コラム一覧",
  "works-hub": "施工事例一覧",
  "works-list": "サービス別の事例一覧",
  work: "施工事例",
  article: "コラム",
  "blog-category": "コラムのカテゴリ",
};
const order: SeoEntry["contentType"][] = ["home", "hub", "works-hub", "blog-hub", "company", "support", "area", "service", "works-list", "work", "article", "blog-category"];
const sorted = [...map].sort((a, b) => order.indexOf(a.contentType) - order.indexOf(b.contentType) || a.url.localeCompare(b.url));

const topicCount = new Map<string, number>();
for (const t of topics) topicCount.set(t.cluster, (topicCount.get(t.cluster) ?? 0) + 1);
const postCount = new Map<string, number>();
for (const p of getAllPosts()) postCount.set(p.category, (postCount.get(p.category) ?? 0) + 1);
const candidateCount = backlogCounts();

const lines: string[] = [
  "# SEO 監査の結果",
  "",
  `このファイルは \`npm run seo:audit\` が書き出します（手で直さない）。作成日：${today}`,
  "",
  `- 調べたページ：${pages.length}（検索結果に出すページ：${idx.length}）`,
  `- ビルドの種類：${SITE_URL ? `本番 URL あり（${SITE_URL}）。canonical と index / noindex まで確認` : "本番 URL なし（全ページ noindex のビルド）。canonical と index / noindex は、ページの一覧（lib/routes.ts）の設定で代用"}`,
  `- 検索語の割り当て：${map.length} ページ／これから書く題材 ${topics.length} 件／候補 ${backlog.length} 件`,
  `- **誤り：${errors.length} 件**／注意：${warnings.length} 件`,
  "",
  "## 誤り（直すまで公開しない）",
  "",
  ...(errors.length ? errors.map((e) => `- ${e}`) : ["ありません。"]),
  "",
  "## 注意（確かめて、必要なら直す）",
  "",
  ...(warnings.length ? warnings.map((w) => `- ${w}`) : ["ありません。"]),
  "",
  "## 検索語の割り当て（どの検索語を、どの URL で取りにいくか）",
  "",
  "1つの検索意図は、1つの URL だけが担当します。表の元は `data/seo-keyword-map.ts`（トップ・案内・地域・サービス）、",
  "`data/works.ts` の keyword（施工事例）、記事の frontmatter の keywords（コラム）です。",
  "",
  "| URL | 種類 | 主キーワード | 副キーワード | 検索意図 | 親ページ | 関連サービス | 関連する事例 | 関連する記事 |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...sorted.map(
    (e) =>
      `| ${e.url}${e.index ? "" : "（noindex）"} | ${TYPE[e.contentType]} | ${cell(e.primaryKeyword)} | ${cell(e.secondaryKeywords.join("、"))} | ${cell(e.searchIntent)} | ${e.parentTopic ?? "—"} | ${e.relatedServices.join("、") || "—"} | ${e.relatedWorks.length || "—"} | ${e.relatedArticles.length || "—"} |`,
  ),
  "",
  "### 取り合いを避けるために、譲った検索語",
  "",
  "| ページ | 取りにいかない検索語 | 担当のページ |",
  "| --- | --- | --- |",
  ...sorted.flatMap((e) => (e.cedes ?? []).map((c) => `| ${e.url} | ${c.keyword} | ${c.to} |`)),
  "",
  "## ページごとの一覧",
  "",
  "「本文のリンク」は、本文（ヘッダー・フッターを除く）からサイト内へ出しているリンクの行き先の数。「被リンク」は、ほかのページの本文からリンクされている数。",
  "",
  "| URL | index | title（全角換算の字数） | description の字数 | h1 | h2 | 構造化データ | 本文のリンク | 被リンク | 画像（alt なし） | 本文の字数 |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...pages.map((p) => {
    const r = routeOf.get(p.route);
    const indexable = SITE_URL ? !p.noindex : (r?.index ?? false);
    const ld = p.ld.filter((t) => !["Organization", "HomeAndConstructionBusiness", "WebSite"].includes(t)).join("、") || "（共通のみ）";
    return `| ${p.route} | ${indexable ? "○" : "noindex"} | ${cell(p.title)}（${width(p.title)}） | ${width(p.description)} | ${cell(p.h1.join(" / "))} | ${p.h2} | ${ld} | ${new Set(p.mainLinks).size} | ${inbound.get(p.route)?.size ?? 0} | ${p.imgCount}（${p.imgNoAlt}） | ${p.textLength} |`;
  }),
  "",
  "全ページ共通の構造化データ：Organization（法人）、HomeAndConstructionBusiness（戸塚オフィス）、WebSite。",
  "",
  "## コラムのクラスター（カテゴリごとの本数）",
  "",
  "「題材」は、すぐに書ける形で決めてあるもの（`lib/blog-generator/topics.ts`）。「候補」は、検索意図だけを洗い出してあるもの（`lib/blog-generator/backlog.ts`）。",
  "",
  "| カテゴリ | 親ページ | 公開済み | 題材（未公開） | 候補 | 合計 |",
  "| --- | --- | --- | --- | --- | --- |",
  ...blogClusters.map((c) => {
    const posted = postCount.get(c.id) ?? 0;
    const open = topics.filter((t) => t.cluster === c.id && !getAllPosts().some((p) => p.slug === t.slug)).length;
    const cand = candidateCount.get(c.id) ?? 0;
    return `| ${c.name} | ${c.pillar.href} | ${posted} | ${open} | ${cand} | ${posted + open + cand} |`;
  }),
  "",
  "## これから書くコラムの順番",
  "",
  "自動投稿が題材を選ぶ順番です（優先度 → 記事の少ないカテゴリ → 題材の並び）。公開済みの記事に見直す理由があるときは、",
  "およそ3割の日が見直しに回るので、日付は前後します。",
  "",
  planTable,
  "",
];
fs.writeFileSync(REPORT, `${lines.join("\n")}\n`, "utf8");

/* docs/SEO_ROADMAP.md の表を書き直す（目印の間だけ） */
if (fs.existsSync(ROADMAP)) {
  const src = fs.readFileSync(ROADMAP, "utf8");
  const re = /(<!-- seo:plan:start -->)[\s\S]*?(<!-- seo:plan:end -->)/;
  if (re.test(src)) fs.writeFileSync(ROADMAP, src.replace(re, `$1\n${planTable}\n$2`), "utf8");
}

console.log(`ページ：${pages.length}（検索結果に出すページ：${idx.length}）　検索語の割り当て：${map.length}　題材：${topics.length}　候補：${backlog.length}`);
console.log(SITE_URL ? `サイトの URL：${SITE_URL}` : "サイトの URL：未設定（canonical と index / noindex は、ページの一覧の設定で確認）");
for (const w of warnings) console.log(`  △ ${w}`);
for (const e of errors) console.log(`  × ${e}`);
console.log(`\n結果を docs/seo-audit-report.md に書き出しました`);
console.log(errors.length ? `${errors.length} 件の誤りがあります` : `誤りはありません（注意 ${warnings.length} 件）`);
// normalizeKeyword は、検索語をそろえる規則を1か所にするために読み込んでいる（規則を変えたら、ここでも同じ結果になる）
void normalizeKeyword;
process.exit(errors.length ? 1 : 0);
