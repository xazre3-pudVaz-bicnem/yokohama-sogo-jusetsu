import { publishedAreas } from "@/data/areas";
import { services } from "@/data/services";
import { works } from "@/data/works";
import { bodyLength, type Post } from "@/lib/blog";
import { getCluster } from "@/lib/blog-clusters";
import { postFrontmatterSchema, type PostFrontmatter } from "@/lib/blog-schema";
import { BASE_SECTIONS, allowedSourceUrls, unknownNumericTokens, type FactSheet } from "@/lib/blog-generator/facts";
import { diceBigram, shingleOverlap } from "@/lib/blog-generator/similarity";

/**
 * 記事の品質の検査（機械で確かめられる部分）。
 *
 * 自動生成のときと、公開済みの記事の点検（npm run blog:audit）で、必ずこの同じ関数を使う。
 * 規則を2か所に書くと、生成では通ったのに点検で落ちる（またはその逆）が起きるため。
 * 規則を足したら、まず npm run blog:audit で手書きの記事が誤って落ちないかを確かめること。
 *
 * errors   … 1つでもあれば公開しない
 * warnings … 公開はできるが、読み直しのときに見てほしい点
 */
export type ArticleDraft = PostFrontmatter & { body: string };
export type ValidationResult = { ok: boolean; errors: string[]; warnings: string[]; length: number };

export const BODY_MIN = 1100;
export const BODY_MAX = 3800;

/** 中身の無い決まり文句・根拠を示せない売り文句（1つでもあれば不合格） */
const BANNED: { re: RegExp; why: string }[] = [
  { re: /徹底(?:解説|比較|ガイド)/, why: "「徹底解説」の類は使わない" },
  { re: /解説(?:します|していきます|いたします)/, why: "「解説します」と予告せず、すぐに中身を書く" },
  { re: /(?:ご紹介|紹介)していきます/, why: "「ご紹介していきます」と予告せず、すぐに中身を書く" },
  { re: /見ていきましょう|確認していきましょう|チェックしていきましょう/, why: "「〜していきましょう」は使わない" },
  { re: /いかがでした(?:でしょう)?か/, why: "「いかがでしたか」は使わない" },
  { re: /参考に(?:なれば幸い|していただければ|してみてください)/, why: "「参考になれば幸いです」の類は使わない" },
  { re: /ぜひ(?:ご検討|参考|チェック|お試し)/, why: "「ぜひ〜」の呼びかけは使わない" },
  { re: /と言えるでしょう|といえるでしょう|ではないでしょうか。.*ではないでしょうか。/s, why: "あいまいな言い切り（〜と言えるでしょう）は使わない" },
  { re: /この記事では|本記事では|今回の記事/, why: "「この記事では」と記事自体に触れる前置きは書かない" },
  { re: /まとめると、|結論から言うと|結論から申し上げ/, why: "決まり文句の前置きは使わない" },
  { re: /No\.?\s*1|ナンバーワン|ナンバー1|日本一|地域一番|地域最安|業界最安|最安値|業界初|圧倒的/, why: "順位・最上級の表現は使わない（根拠を示せない）" },
  { re: /満足度|リピート率|口コミ評価|星\s*[0-9０-９]/, why: "満足度・評価の数字は使わない（根拠を示せない）" },
  {
    re: /実績多数|豊富な実績|多数の実績|数多くの実績|(?:実績|件数|累計|年間)\s*(?:は|が|で)?\s*約?\s*[0-9０-９,，.]+\s*万?\s*件|[0-9０-９,，.]+\s*万?\s*件(?:以上|超)?の(?:実績|施工|工事)/,
    why: "施工の件数・実績の多さは書かない（確認できていない）",
  },
  { re: /創業\s*[0-9０-９]|[0-9０-９]+\s*年の(?:実績|歴史|経験)|[0-9０-９]+\s*年(?:間)?保証|保証\s*[0-9０-９]+\s*年/, why: "創業年・経験年数・保証年数は書かない（確認できていない）" },
  { re: /有資格者が|国家資格を持つ|資格を持ったスタッフ|[一二12]級(?:建築士|施工管理技士|塗装技能士|技能士)|第[一二]種電気工事士/, why: "当社の資格の名称は書かない（確認できていない）" },
  { re: /当社調べ|弊社調べ|独自調査/, why: "自社調べの数字は書かない" },
  { re: /絶対に|必ず(?:得|安く|お得)/, why: "断定的な約束は書かない" },
  { re: /最短\s*[0-9０-９]+\s*(?:分|時間|日)|即日(?:対応|工事|施工)|24時間(?:対応|受付|365)/, why: "対応の速さの約束は書かない（確認できていない）" },
  { re: /相場は|費用相場|平均(?:的な)?(?:費用|価格|金額)は/, why: "費用の相場は書かない（金額は見積もりで示す）" },
];

/** 使いすぎると中身が薄くなる言い回し（回数の上限） */
const LIMITED: { re: RegExp; max: number; label: string }[] = [
  { re: /重要です/g, max: 1, label: "重要です" },
  { re: /おすすめです/g, max: 1, label: "おすすめです" },
  { re: /大切です/g, max: 2, label: "大切です" },
  { re: /ポイントです/g, max: 1, label: "ポイントです" },
  { re: /一般的に/g, max: 2, label: "一般的に" },
  { re: /でしょう。/g, max: 2, label: "〜でしょう。" },
];

/** サイト内のリンク先として正しい URL の一覧 */
export function knownPaths(existingSlugs: string[]): Set<string> {
  return new Set<string>([
    "/",
    "/service",
    "/works",
    "/area",
    "/business",
    "/company",
    "/flow",
    "/faq",
    "/contact",
    "/blog",
    ...services.map((s) => `/service/${s.slug}`),
    ...publishedAreas.map((a) => `/area/${a.slug}`),
    ...works.map((w) => `/works/${w.slug}`),
    ...existingSlugs.map((s) => `/blog/${s}`),
  ]);
}

function markdownLinks(body: string): { text: string; href: string }[] {
  return [...body.matchAll(/(?<!!)\[([^\]]+)\]\(([^)\s]+)\)/g)].map((m) => ({ text: m[1], href: m[2] }));
}

export function validateArticle(
  draft: ArticleDraft,
  ctx: {
    sheet: FactSheet;
    /** 公開済みの記事（重複の判定に使う）。点検のときは自分自身を除いて渡す */
    existing: Pick<Post, "slug" | "title" | "intent" | "body">[];
    /**
     * この記事で数値・出典を使ってよい事実シートの節（題材の facts）。
     * 渡すと、「会社」「施工事例」「設備の一般的な知識」と、ここに挙げた節の数値だけを通す。
     * 渡さないとき（手書きの記事の点検）は、事実シート全体と突き合わせる。
     */
    factSections?: string[];
  },
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  /* 1. 形式 */
  const { body, ...front } = draft;
  const parsed = postFrontmatterSchema.safeParse(front);
  if (!parsed.success) {
    for (const i of parsed.error.issues) errors.push(`形式: ${i.path.join(".")} … ${i.message}`);
  }
  const cluster = getCluster(draft.category);
  if (!cluster) errors.push(`カテゴリ ${draft.category} がありません`);

  /* 2. 長さ・見出し */
  const length = bodyLength(body);
  if (length < BODY_MIN) errors.push(`本文が短すぎます（${length}字。${BODY_MIN}字以上にする。水増しではなく、読者が知りたい内容を足す）`);
  if (length > BODY_MAX) errors.push(`本文が長すぎます（${length}字。${BODY_MAX}字以内にする）`);
  const lines = body.split(/\r?\n/);
  const h1 = lines.filter((l) => /^#\s/.test(l));
  const h2 = lines.filter((l) => /^##\s/.test(l));
  if (h1.length) errors.push("本文に # の見出し（h1）を使わない（ページの題名が h1）。見出しは ## から始める");
  if (h2.length < 4) errors.push(`## の見出しが${h2.length}個しかありません（4個以上にする）`);
  for (const h of lines.filter((l) => /^#{2,3}\s/.test(l))) {
    if (/\]\(/.test(h)) errors.push(`見出しの中にリンクを入れない：${h}`);
    if (/^#{2,3}\s*(?:まとめ|はじめに|おわりに|最後に|さいごに)\s*$/.test(h)) errors.push(`「まとめ」「はじめに」だけの見出しは使わない（内容を表す見出しにする）：${h}`);
  }
  if (/^\s*##\s/.test(body.trimStart().split(/\r?\n/)[0] ?? "")) warnings.push("本文が見出しから始まっています（最初に導入の段落を置く）");

  /* 3. 決まり文句・売り文句 */
  const allText = [draft.title, draft.description, body, ...draft.faq.flatMap((f) => [f.q, f.a])].join("\n");
  for (const b of BANNED) {
    const m = b.re.exec(allText);
    if (m) errors.push(`使えない表現「${m[0].slice(0, 20)}」… ${b.why}`);
  }
  for (const l of LIMITED) {
    const n = (allText.match(l.re) ?? []).length;
    if (n > l.max) errors.push(`「${l.label}」が${n}回あります（${l.max}回まで。言い換えるのではなく、理由や具体例を書く）`);
  }

  /* 4. 数値（事実シートに無い「数字＋単位」は書けない） */
  const unknown = unknownNumericTokens(allText, ctx.sheet, ctx.factSections);
  if (unknown.length) {
    const scope = ctx.factSections ? `この題材で数値を使える節は「${[...BASE_SECTIONS, ...ctx.factSections].join("」「")}」だけ。` : "";
    errors.push(`事実シートに無い数値があります：${unknown.join("、")}（${scope}事実シートの数値だけを、単位も同じ形で使う。書けない数値は削る）`);
  }

  /* 5. リンク */
  const links = markdownLinks(body);
  const paths = knownPaths(ctx.existing.map((e) => e.slug));
  const internal = links.filter((l) => l.href.startsWith("/"));
  const external = links.filter((l) => /^https?:\/\//.test(l.href));
  for (const l of internal) {
    const p = l.href.split("#")[0].replace(/\/$/, "") || "/";
    if (!paths.has(p)) errors.push(`存在しないページへのリンクです：${l.href}`);
    if (/^(?:こちら|ここ|詳細|このページ|リンク)$/.test(l.text.trim())) errors.push(`リンクの文言が「${l.text}」です（リンク先の内容が分かる言葉にする）`);
  }
  for (const l of external) {
    let host = "";
    try {
      host = new URL(l.href).hostname;
    } catch {
      errors.push(`URL の形が正しくありません：${l.href}`);
      continue;
    }
    if (!ctx.sheet.sourceHosts.has(host)) errors.push(`事実シートの出典に無いサイトへのリンクです：${l.href}`);
  }
  if (links.some((l) => !l.href.startsWith("/") && !/^https?:\/\//.test(l.href) && !l.href.startsWith("#"))) errors.push("リンク先は / から始まるサイト内のパスか、https:// から始まる URL にする");
  const distinctInternal = new Set(internal.map((l) => l.href.split("#")[0]));
  if (distinctInternal.size < 2) errors.push(`サイト内のリンクが${distinctInternal.size}本しかありません（親ページを含めて2本以上にする）`);
  if (links.length > 9) errors.push(`リンクが${links.length}本あります（9本まで）`);
  if (cluster && !distinctInternal.has(cluster.pillar.href)) errors.push(`親ページ（${cluster.pillar.href} ${cluster.pillar.label}）へのリンクがありません`);

  /* 6. 関連サービス・地域・記事 */
  for (const s of draft.relatedServices) if (!services.some((x) => x.slug === s)) errors.push(`relatedServices の ${s} というサービスはありません`);
  for (const a of draft.relatedAreas ?? []) if (!publishedAreas.some((x) => x.slug === a)) errors.push(`relatedAreas の ${a} という地域ページはありません`);
  for (const r of draft.relatedArticles ?? []) if (!ctx.existing.some((e) => e.slug === r)) errors.push(`relatedArticles の ${r} という記事はありません`);
  if (draft.relatedServices.length && !draft.relatedServices.some((s) => distinctInternal.has(`/service/${s}`))) errors.push("relatedServices に挙げたサービスページへのリンクが、本文に1本もありません");

  /* 7. 出典 */
  const sourceUrls = allowedSourceUrls(ctx.sheet, ctx.factSections);
  for (const s of draft.sources ?? []) {
    if (!ctx.sheet.sourceUrls.has(s.url)) errors.push(`sources の URL が事実シートの出典にありません：${s.url}`);
    else if (!sourceUrls.has(s.url)) errors.push(`sources の URL が、この題材で使う節の出典ではありません：${s.url}`);
  }
  const needsSource = draft.category === "subsidy" || /[0-9]\s*(?:万円|円|%)/.test(allText.replace(/[０-９％]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)));
  if (needsSource && !(draft.sources ?? []).length) errors.push("金額・割合・制度に触れているのに、sources（出典）が空です");

  /* 8. 重複（1記事1検索意図） */
  for (const e of ctx.existing) {
    if (e.slug === draft.slug) {
      errors.push(`同じ slug の記事がすでにあります：${e.slug}`);
      continue;
    }
    const t = diceBigram(draft.title, e.title);
    if (t >= 0.72) errors.push(`タイトルが既存の記事「${e.title}」と近すぎます（${t.toFixed(2)}）`);
    const i = diceBigram(draft.intent, e.intent);
    if (i >= 0.78) errors.push(`検索意図が既存の記事「${e.title}」と重なっています（${i.toFixed(2)}）`);
    const b = shingleOverlap(body, e.body);
    if (b >= 0.2) errors.push(`本文が既存の記事「${e.title}」と重なっています（重なり ${b.toFixed(2)}）`);
    else if (b >= 0.12) warnings.push(`本文が既存の記事「${e.title}」とやや近い（重なり ${b.toFixed(2)}）`);
  }

  /* 9. そのほか */
  if (draft.updatedAt < draft.publishedAt) errors.push("updatedAt が publishedAt より前になっています");
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(allText)) errors.push("絵文字は使わない");
  if (/！！|！？|!!|\?\?/.test(allText)) errors.push("「！！」などの重ねた記号は使わない");

  return { ok: errors.length === 0, errors, warnings, length };
}
