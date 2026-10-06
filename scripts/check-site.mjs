/**
 * ビルドした HTML（.next/server/app/ 以下）を読み、ページごとの基本を確かめる。
 *   npm run build && npm run site:check
 *
 * 確かめること
 *   - title・meta description がある／長さが極端でない／ページ同士で重複していない
 *   - h1 が1つだけある
 *   - サイト内リンクが、実在するページ・ファイルを指している
 *   - 画像に alt がある（飾りの画像は alt="" で可）
 *   - JSON-LD が JSON として正しい／FAQPage は、ページに表示されている質問だけを含む
 *   - NEXT_PUBLIC_SITE_URL があるビルドでは canonical があり、無いビルドでは全ページが noindex
 * 1件でも誤りがあれば、終了コード 1 で終わる。
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP = path.join(ROOT, ".next", "server", "app");
const PUBLIC = path.join(ROOT, "public");

if (!fs.existsSync(APP)) {
  console.error("ビルドの出力がありません。先に npm run build を実行してください。");
  process.exit(1);
}

/** .next/server/app 以下の *.html を、URL のパスと一緒に集める */
function collect(dir, base = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...collect(path.join(dir, e.name), rel));
    else if (e.name.endsWith(".html")) out.push({ file: path.join(dir, e.name), route: toRoute(rel) });
  }
  return out;
}
function toRoute(rel) {
  const p = rel.replace(/\.html$/, "");
  if (p === "index") return "/";
  return `/${p.replace(/\/index$/, "")}`;
}

const SKIP = new Set(["/_not-found", "/_global-error"]);
const pages = collect(APP).filter((p) => !SKIP.has(p.route));
const routes = new Set(pages.map((p) => p.route));
// HTML を持たないルート（XML など）
for (const extra of ["/sitemap.xml", "/robots.txt", "/feed.xml", "/icon.png", "/apple-icon.png"]) routes.add(extra);

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
const text = (html) => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, "");
const width = (s) => [...s].reduce((n, c) => n + (c.charCodeAt(0) > 0xff ? 1 : 0.5), 0);

const errors = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();
let linkCount = 0;
let ldCount = 0;
const indexable = [];

for (const { file, route } of pages) {
  const html = fs.readFileSync(file, "utf8");
  const err = (m) => errors.push(`${route} … ${m}`);
  const warn = (m) => warnings.push(`${route} … ${m}`);
  const body = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");

  /* title・description */
  const title = decode(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "");
  const desc = decode(/<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? "");
  const robots = /<meta name="robots" content="([^"]*)"/.exec(html)?.[1] ?? "";
  const noindex = /noindex/.test(robots);
  const canonical = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1] ?? "";
  if (!title) err("title がありません");
  if (!desc) err("meta description がありません");
  if (!noindex) indexable.push(route);
  if (title && width(title) > 40) warn(`title が長い（全角換算 ${width(title)} 字）：${title}`);
  if (desc && (width(desc) < 50 || width(desc) > 125)) warn(`description の長さ（全角換算 ${width(desc)} 字）`);
  if (title) titles.set(title, [...(titles.get(title) ?? []), route]);
  if (desc) descriptions.set(desc, [...(descriptions.get(desc) ?? []), route]);

  /* h1 */
  const h1 = [...body.matchAll(/<h1[\s>]/g)].length;
  if (h1 !== 1) err(`h1 が ${h1} 個あります（1個にする）`);

  /* リンク */
  for (const m of body.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = decode(m[1]);
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    linkCount += 1;
    const p = href.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
    if (routes.has(p)) continue;
    if (fs.existsSync(path.join(PUBLIC, p))) continue;
    err(`リンク先がありません：${href}`);
  }

  /* 画像の alt */
  for (const m of body.matchAll(/<img\s[^>]*>/g)) {
    if (!/\salt="/.test(m[0])) err(`alt の無い画像があります：${m[0].slice(0, 100)}`);
  }

  /* JSON-LD */
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    ldCount += 1;
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch {
      err("JSON-LD が JSON として読めません");
      continue;
    }
    const nodes = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
    for (const node of nodes) {
      if (node["@type"] !== "FAQPage") continue;
      const visible = text(body);
      for (const q of node.mainEntity ?? []) {
        const name = String(q.name ?? "").replace(/\s+/g, "");
        if (!visible.includes(name)) err(`FAQPage の質問が、ページに表示されていません：${q.name}`);
      }
    }
    const s = JSON.stringify(data);
    if (/"(telephone|url|image|logo)":""/.test(s)) err("JSON-LD に空の値があります（telephone / url / image / logo）");
  }

  /* canonical と noindex */
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    if (!noindex && !canonical) err("canonical がありません");
    if (canonical && !canonical.startsWith(process.env.NEXT_PUBLIC_SITE_URL)) err(`canonical のドメインが違います：${canonical}`);
  } else {
    if (!noindex) err("NEXT_PUBLIC_SITE_URL が無いビルドなのに、noindex になっていません");
    if (canonical) err(`NEXT_PUBLIC_SITE_URL が無いビルドなのに、canonical があります：${canonical}`);
  }
}

for (const [t, rs] of titles) if (rs.length > 1) errors.push(`title が重複しています：「${t}」 ${rs.join("、")}`);
for (const [d, rs] of descriptions) if (rs.length > 1) errors.push(`description が重複しています：「${d.slice(0, 30)}…」 ${rs.join("、")}`);

console.log(`ページ：${pages.length}　サイト内リンク：${linkCount}　JSON-LD：${ldCount}　検索に載せるページ：${indexable.length}`);
console.log(process.env.NEXT_PUBLIC_SITE_URL ? `サイトの URL：${process.env.NEXT_PUBLIC_SITE_URL}` : "サイトの URL：未設定（全ページ noindex のビルド）");
for (const w of warnings) console.log(`  △ ${w}`);
for (const e of errors) console.log(`  × ${e}`);
console.log(errors.length ? `\n${errors.length} 件の誤りがあります` : "\n誤りはありません");
process.exit(errors.length ? 1 : 0);
