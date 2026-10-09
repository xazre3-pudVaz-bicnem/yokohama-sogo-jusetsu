import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import matter from "gray-matter";
import { z } from "zod";
import { publishedAreas } from "@/data/areas";
import { fixedKeywordOwners, normalizeKeyword, seoPageFor } from "@/data/seo-keyword-map";
import { servicePath, services } from "@/data/services";
import { serviceSlugsWithWorkList, works } from "@/data/works";
import { BLOG_DIR, getAllPosts, type Post } from "@/lib/blog";
import { getCluster } from "@/lib/blog-clusters";
import { BASE_SECTIONS, loadFactSheet, type FactSheet } from "@/lib/blog-generator/facts";
import { diceBigram, shingleOverlap } from "@/lib/blog-generator/similarity";
import { topics, getTopic, type Topic } from "@/lib/blog-generator/topics";
import { BODY_MAX, BODY_MIN, validateArticle, type ArticleDraft } from "@/lib/blog-generator/validate";
import { formatDateJa } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/**
 * コラムの自動生成（1回の実行で1本。新しい記事を書くか、公開済みの記事を1本見直すか、のどちらか）。
 *
 * 新しい記事を書く日と、見直す日
 *   - 公開済みの記事に「見直す理由」があるとき、BLOG_REFRESH_RATIO（既定 0.3）の割合の日を、見直しに使う。
 *     どの日が見直しの日になるかは、日付から決まる（ランダムではない。同じ日に実行し直しても同じ結果になる）。
 *   - 見直す理由（refreshReasons）：事実シートの節が確認し直された／親ページ・主なサービスページ・施工事例への
 *     リンクが本文に無い。理由のある記事が無ければ、新しい記事を書く。
 *   - 見直しでは、理由に対応した変更が本文に入ったときだけ保存し、updatedAt を今日にする。
 *     日付だけを新しくする更新はしない（変更が入らなければ、保存しない）。
 *
 * 新しい記事の流れ
 *   1. 題材を選ぶ（lib/blog-generator/topics.ts。優先度の高い順に、既存の記事・固定ページと重ならないもの）
 *   2. 書く … Claude に、事実シート（docs/VERIFIED_FACTS.md）と題材を渡して原稿を書かせる
 *   3. 機械の検査 … lib/blog-generator/validate.ts（決まり文句・数値・リンク・重複）
 *   4. 読み直し … 別の呼び出しで、原稿の主張を事実シートと1つずつ照らし合わせる
 *   5. 3 と 4 の両方に通ったときだけ、content/blog/<slug>.md に保存する
 *      通らなければ、指摘を渡して書き直させる（最大 MAX_ATTEMPTS 回）。それでも通らなければ、その日は公開しない
 *
 * 「毎日かならず公開する」より「基準を満たした日だけ公開する」を優先している。
 *
 * 環境変数
 *   ANTHROPIC_API_KEY       … 必須（DRY_RUN_FIXTURE を使うときは不要）
 *   ANTHROPIC_MODEL         … 書くモデル（既定 claude-opus-5-5）
 *   ANTHROPIC_REVIEW_MODEL  … 読み直すモデル（既定 claude-opus-5-5）
 *   ANTHROPIC_FALLBACKS     … "off" にすると、モデルが応答を断ったときの代替モデルへの切り替えを使わない
 *   TOPIC                   … 題材の slug を指定して書かせる（省略時は自動で選ぶ）
 *   BLOG_MODE               … "new"（新しい記事）か "refresh"（見直し）に固定する（省略時は日付から決める）
 *   BLOG_REFRESH_RATIO      … 見直しに使う日の割合（0〜1。既定 0.3）
 *   REFRESH                 … 見直す記事の slug を指定する（BLOG_MODE=refresh と合わせて使う）
 *   DRY_RUN=1               … 保存しない（生成と検査だけ行い、結果を表示する）
 *   DRY_RUN_FIXTURE=<path>  … API を呼ばず、JSON ファイルの原稿を検査に通す（仕組みの確認用）
 *   FORCE=1                 … 今日の記事がすでにあっても、もう1本書く
 */
export const WRITER_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
export const REVIEW_MODEL = process.env.ANTHROPIC_REVIEW_MODEL || "claude-opus-5-5";
const MAX_ATTEMPTS = 4;
const MAX_TOKENS = 64000;
const FALLBACK_BETA = "server-side-fallback-2026-07-01";

/** モデルに返させる原稿の形（slug・カテゴリ・日付などは、こちらで決めて足す） */
export const ArticleSchema = z.object({
  title: z.string().describe("記事の題名。全角22〜34字。検索する人の言葉を入れる。記号で飾らない"),
  description: z.string().describe("検索結果に出る説明文。70〜115字。記事で分かることを具体的に書く"),
  keywords: z.array(z.string()).describe("検索キーワード。3〜5個"),
  body: z.string().describe("本文（Markdown）。最初は導入の段落、見出しは ## から。# は使わない"),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).describe("この記事に関する質問と答え。3個。本文と同じ事実だけで答える"),
  relatedArticles: z.array(z.string()).describe("関連する既存の記事の slug。0〜3個。渡された一覧にあるものだけ"),
  sources: z.array(z.string()).describe("本文で使った事実の出典 URL。事実シートの「出典」にある URL だけ。数値や制度に触れたら必ず入れる"),
});
export type ArticleOutput = z.infer<typeof ArticleSchema>;

const ReviewSchema = z.object({
  verdict: z.enum(["pass", "fail"]).describe("issues が1件も無ければ pass"),
  issues: z
    .array(
      z.object({
        quote: z.string().describe("問題のある文（原稿からそのまま抜き出す）"),
        problem: z.string().describe("何が問題か（事実シートのどこと食い違うか、何が確認できないか）"),
        fix: z.string().describe("どう直すか（削る／事実シートのこの記述に合わせる、など）"),
      }),
    )
    .describe("直すべき点。問題が無ければ空"),
});
type ReviewOutput = z.infer<typeof ReviewSchema>;

export type GenerateMode = "new" | "refresh";
export type GenerateResult =
  | { status: "published"; mode: GenerateMode; slug: string; draft: ArticleDraft; file: string; attempts: number; cost: number; log: string[] }
  | { status: "dry-run"; mode: GenerateMode; slug: string; draft: ArticleDraft; file: string; attempts: number; cost: number; log: string[] }
  | { status: "skipped"; reason: string; log: string[] }
  | { status: "rejected"; mode: GenerateMode; slug: string; reason: string; attempts: number; cost: number; log: string[]; lastDraft?: ArticleDraft };

/* ------------------------------------------------------------------ */
/* 題材選び                                                            */
/* ------------------------------------------------------------------ */
const PRIORITY_ORDER = { P0: 0, P1: 1, P2: 2 } as const;

/**
 * 次に書く題材。
 * すでに記事がある題材、主キーワードが公開済みの記事・固定ページと同じ題材、検索意図が近い題材は選ばない
 * （同じ検索意図の記事を2本作らない。内容を足したいときは、既存の記事を見直す）。
 */
export function pickTopic(existing: Pick<Post, "slug" | "intent" | "category" | "keywords">[], override?: string): Topic | null {
  if (override) return getTopic(override) ?? null;
  const count = new Map<string, number>();
  for (const p of existing) count.set(p.category, (count.get(p.category) ?? 0) + 1);
  const taken = new Set(existing.map((e) => normalizeKeyword(e.keywords[0] ?? "")));
  const fixed = fixedKeywordOwners();
  const candidates = topics
    .map((t, index) => ({ t, index }))
    .filter(({ t }) => !existing.some((e) => e.slug === t.slug))
    .filter(({ t }) => !taken.has(normalizeKeyword(t.keyword)) && !fixed.has(normalizeKeyword(t.keyword)))
    .filter(({ t }) => !existing.some((e) => diceBigram(e.intent, t.intent) >= 0.78));
  candidates.sort(
    (a, b) => PRIORITY_ORDER[a.t.priority] - PRIORITY_ORDER[b.t.priority] || (count.get(a.t.cluster) ?? 0) - (count.get(b.t.cluster) ?? 0) || a.index - b.index,
  );
  return candidates[0]?.t ?? null;
}

/* ------------------------------------------------------------------ */
/* 見直し（リライト）                                                  */
/* ------------------------------------------------------------------ */
/** 日付から 0〜1 の値を決める（同じ日は同じ値。日ごとに均等に散らばる）。見直しの日かどうかの判定に使う */
export function dayFraction(iso: string): number {
  const days = Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);
  return (days * 0.6180339887) % 1;
}

/** 今日は、新しい記事を書く日か、見直しの日か */
export function decideMode(today: string, hasRefreshTarget: boolean, hasTopic: boolean): GenerateMode {
  const forced = process.env.BLOG_MODE;
  if (forced === "new" || forced === "refresh") return forced;
  if (!hasRefreshTarget) return "new";
  if (!hasTopic) return "refresh";
  // 変数が空のとき（GitHub Actions で未設定のとき）は既定の 0.3。0 を指定すると、見直しをしない
  const raw = Number(process.env.BLOG_REFRESH_RATIO || "0.3");
  const ratio = Number.isFinite(raw) ? Math.min(1, Math.max(0, raw)) : 0.3;
  return dayFraction(today) < ratio ? "refresh" : "new";
}

export type RefreshReason = {
  /** 何を直すか（モデルへの指示にも、記録にも使う） */
  instruction: string;
  /** 直した原稿で、この理由が解消されたか */
  resolved: (draft: ArticleDraft) => boolean;
};

/**
 * 公開済みの記事を見直す理由。1つも無ければ、その記事は見直さない（日付だけを新しくしない）。
 *   1. 記事が出典にしている事実シートの節が、記事の更新日より後に確認し直された
 *   2. カテゴリの親ページへのリンクが、本文に無い（親ページが分かれた・替わったとき）
 *   3. 主なサービスページへのリンクが、本文に無い
 *   4. そのサービスの施工事例があるのに、本文から1件もリンクしていない
 */
export function refreshReasons(post: Post, sheet: FactSheet): RefreshReason[] {
  const out: RefreshReason[] = [];
  const hasLink = (body: string, href: string) => body.includes(`](${href})`) || body.includes(`](${href}#`);

  for (const sec of sheet.sections) {
    if (!sec.checkedAt || sec.checkedAt <= post.updatedAt) continue;
    if (!post.sources.some((src) => sec.sources.includes(src.url))) continue;
    const date = formatDateJa(sec.checkedAt);
    out.push({
      instruction: `事実シートの「${sec.title}」の節が、${date}に確認し直されています。この節にもとづく数値・日付・条件を、いまの事実シートの記述に合わせてください。本文に書く確認日も「${date}」にしてください。`,
      resolved: (d) => d.body.includes(date.replace(/^\d+年/, "")),
    });
  }

  const cluster = getCluster(post.category);
  if (cluster && !hasLink(post.body, cluster.pillar.href)) {
    out.push({
      instruction: `このカテゴリの親ページ ${cluster.pillar.href}（${cluster.pillar.label}）へのリンクが本文にありません。文の流れに合う所に、リンク先の内容が分かる言葉で入れてください。`,
      resolved: (d) => hasLink(d.body, cluster.pillar.href),
    });
  }

  const main = services.find((x) => x.slug === post.relatedServices[0]);
  if (main && !hasLink(post.body, servicePath(main))) {
    out.push({
      instruction: `主なサービスページ ${servicePath(main)}（${main.name}）へのリンクが本文にありません。文の流れに合う所に入れてください。`,
      resolved: (d) => hasLink(d.body, servicePath(main)),
    });
  }

  const related = main ? works.filter((w) => w.services[0] === main.slug) : [];
  if (related.length && !related.some((w) => hasLink(post.body, `/works/${w.slug}`))) {
    out.push({
      instruction: `このサービスの施工事例があります（${related.map((w) => `/works/${w.slug} … ${w.title}`).join("、")}）。記事の内容に関係するものを1件、文の流れに合う所でリンクしてください。事例について書いてよいのは、事実シートの「施工事例」の節にあることだけです。関係する事例が無ければ、リンクしなくてかまいません。`,
      // 関係する事例が無い記事もあるので、これだけは「解消されなくてもよい理由」として扱う（下の REQUIRED で外す）
      resolved: (d) => related.some((w) => hasLink(d.body, `/works/${w.slug}`)),
    });
  }
  return out;
}

/** 「施工事例へのリンク」の理由は、関係する事例が無いこともあるので、解消を必須にしない */
const isOptionalReason = (r: RefreshReason) => r.instruction.startsWith("このサービスの施工事例があります");

/** 見直す記事を選ぶ。理由の多い記事を先に、同じなら更新日の古い記事を先に。直近7日以内に更新した記事は選ばない */
export function pickRefreshTarget(posts: Post[], sheet: FactSheet, today: string, override?: string): { post: Post; reasons: RefreshReason[] } | null {
  if (override) {
    const post = posts.find((p) => p.slug === override);
    return post ? { post, reasons: refreshReasons(post, sheet) } : null;
  }
  const cooldown = new Date(Date.parse(`${today}T00:00:00Z`) - 7 * 86_400_000).toISOString().slice(0, 10);
  const candidates = posts
    .filter((p) => p.updatedAt <= cooldown)
    .map((post) => ({ post, reasons: refreshReasons(post, sheet) }))
    .filter((c) => c.reasons.some((r) => !isOptionalReason(r)));
  candidates.sort((a, b) => b.reasons.length - a.reasons.length || a.post.updatedAt.localeCompare(b.post.updatedAt) || a.post.slug.localeCompare(b.post.slug));
  return candidates[0] ?? null;
}

/** 本文が実際に変わったか（空白と記号の違いだけ・日付だけの違いは「変わっていない」とみなす） */
export function bodyChanged(before: string, after: string): boolean {
  const norm = (t: string) => t.replace(/[\s　]+/g, "");
  if (norm(before) === norm(after)) return false;
  // 8文字の並びで比べて、新しい本文のうち元の本文に無い部分が、ごくわずか（1%未満）なら変わっていないとみなす
  return shingleOverlap(after, before) < 0.99;
}

/** 日本時間の今日（YYYY-MM-DD） */
export function todayJst(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------ */
/* プロンプト                                                          */
/* ------------------------------------------------------------------ */
function linkCatalog(): string {
  const fixed = [
    ["/service", "サービス一覧"],
    ["/works", "施工事例の一覧"],
    ["/area", "対応エリア"],
    ["/flow", "工事の流れ"],
    ["/faq", "よくある質問"],
    ["/contact", "お問い合わせ・無料見積もり"],
    ["/business", "法人・工務店の方へ"],
    ["/company", "会社案内"],
  ];
  return [
    "### 固定ページ",
    ...fixed.map(([p, l]) => `- ${p} … ${l}`),
    "### サービスページ",
    ...services.map((s) => `- ${servicePath(s)} … ${s.name}`),
    "### 地域ページ",
    ...publishedAreas.map((a) => `- /area/${a.slug} … ${a.name}の住宅設備・リフォーム`),
    "### 施工事例",
    ...serviceSlugsWithWorkList().map((slug) => `- /works/service/${slug} … ${services.find((x) => x.slug === slug)?.shortName ?? slug}の施工事例の一覧`),
    ...works.map((w) => `- /works/${w.slug} … ${w.title}`),
  ].join("\n");
}

function writerSystem(sheet: FactSheet): Anthropic.TextBlockParam[] {
  const rules = `あなたは、${siteConfig.name}（神奈川県横浜市戸塚区を中心に住宅設備の工事・リフォームを行う会社）の公式サイトで、コラムを書く編集者です。

## 読む人と、この記事の役目
読むのは、自宅の設備や外まわりのことで困っている、または交換を考え始めた一般の方です。検索で1つの疑問を持ってこのページに来ます。記事の役目は、その1つの疑問に、工事を頼む前に知っておくべきことを具体的に答えることです。答えたあとで、関係するサービスページ・施工事例へ自然につなぎます。売り込みの文章ではありません。

## 書き方
- 1つの記事は、渡された「検索意図」1つだけに答える。関係の薄い話題を足して長くしない。
- **最初の段落の1〜2文で、検索意図への答えを言い切る**（「〜かどうかは、〜で決まります」「〜は、故障ではありません」のように）。そのあとで、理由とくわしい説明に入る。前置きや予告（「解説します」など）は書かない。
- 記事の流れの目安：答え → くわしい説明 → 具体的な例 → 現場で確かめること → （当てはまる記事だけ）戸塚区・横浜市での事情 → 関係する施工事例 → 関連するサービス。題材に合わない部分は入れない。どの記事も同じ見出しの並びにしない。
- 見出し（##）は4〜7個。見出しだけ読んでも流れが分かる、内容を表す言葉にする。「まとめ」「はじめに」という見出しは作らない。
- 質問の形の見出しを使ったら、その直後の1〜2文で答えを書く。2つ以上のものを比べるときは表、順番のある手順は番号つきの箇条書き、条件や確認点は箇条書きにする。それ以外は文章で書く。表の見出しの行は、左上のセルも含めて、すべての列に名前を入れる。
- 当社の施工事例が題材に渡されているときは、事実シートの「施工事例」の節にある範囲で、当社が実際に行った工事として触れる（一般論だけの記事にしない）。渡されていない事例や、書かれていない細部を作らない。
- 「なぜそうなるのか」「現場では何を確かめるのか」「読む人は何をすればよいのか」を書く。「重要です」「おすすめです」で終わらせず、理由を書く。
- です・ます調。一文は60字以内を目安にする。箇条書きと表は、比べるときと手順のときだけ使う。
- 本文は ${BODY_MIN + 500}〜${BODY_MAX - 1200} 字を目安にする（${BODY_MIN} 字未満は不合格）。同じ内容の言い換えで増やさない。
- 最後は、読む人が次にできること（確かめること・伝えること）と、サービスページへの案内で締める。
- 題名には、渡された「主キーワード」の言葉を自然な形で入れる。ただし「固定ページが担当している検索語」だけで題名を作らない（そのページと検索語を取り合うため）。
- 質問と答え（faq）は、本文で答えきれなかった関連する疑問があるときだけ書く（0〜3個）。無理に作らない。本文の言い換えにしない。

## 事実の扱い（もっとも大切な決まり）
このサイトは、確認できた事実だけを載せる方針です。記事に間違った数字や制度が1つでもあると、会社の信用を傷つけます。
- 金額・割合・年数・重さ・寸法・日付などの数値は、下の「事実シート」のうち、題材で渡された「数値を使ってよい節」に書かれているものだけを、単位も同じ形で使う。そこに無い数値は、どれだけ一般的に知られていても書かない（機械の検査で不合格になる）。
- 事実シートのほかの節にある数値は、この記事では使わない。別の話題の数値を持ち込むと、文脈が変わって誤りになるため（例：補助金の額を、工事の費用として書いてしまう）。ほかの節は、書いてはいけないことを知るために読む。
- 工事の費用の金額・相場は書かない。「何によって費用が変わるか」を書く。
- 制度（補助金など）に触れるときは、事実シートの確認日を添えて「◯年◯月◯日に公式サイトで確認した内容」であることを本文に書き、sources にその出典 URL を入れる。
- メーカーや自治体の説明を使うときは、「リンナイの説明では」「横浜市の決まりでは」のように、だれの説明かを文の中に書く。
- 会社について書いてよいのは、事実シートの「会社」「施工事例」の節にあることだけ。施工の件数、創業年、保証の年数、資格、料金、対応の速さ、「地域No.1」のような順位は書かない。お客様の声や、架空の事例も書かない。
- 事実シートの「設備の一般的な知識」の節にある内容は、出典を示さずに書いてよい。そこに無い技術的な説明は、数値を伴わない、広く知られた仕組みの説明にとどめる。

## リンクの決まり
- 本文に、サイト内のリンクを3〜6本入れる。リンク先は下の「リンクできるページ」にある URL だけ。
- 渡された「親ページ」へのリンクは必ず入れる。関連サービスのページへのリンクも1本以上入れる。
- 関係する施工事例があれば、文の流れの中でリンクする。
- リンクの文言は、リンク先の内容が分かる言葉にする（「こちら」は使わない）。見出しの中にはリンクを入れない。
- 外部サイトへのリンクは本文に入れない（出典は sources に入れる）。

## 使わない言葉
徹底解説／解説します／ご紹介していきます／見ていきましょう／いかがでしたか／参考になれば幸いです／ぜひ／と言えるでしょう／この記事では／結論から言うと／圧倒的／業界最安／満足度／実績多数。絵文字と「！！」も使わない。`;

  return [
    { type: "text", text: rules },
    { type: "text", text: `## リンクできるページ\n${linkCatalog()}` },
    // ここまでが毎回同じ内容。事実シートの終わりにキャッシュの区切りを置く（書き直しの呼び出しで再利用される）
    { type: "text", text: `## 事実シート\n\n${sheet.raw}`, cache_control: { type: "ephemeral" } },
  ];
}

function topicBrief(topic: Topic, existing: Post[], today: string): string {
  const cluster = getCluster(topic.cluster)!;
  const svc = topic.services.map((s) => services.find((x) => x.slug === s)!).filter(Boolean);
  const wk = (topic.works ?? []).map((s) => works.find((x) => x.slug === s)!).filter(Boolean);
  const ar = (topic.areas ?? []).map((s) => publishedAreas.find((x) => x.slug === s)!).filter(Boolean);
  return [
    `## 今回の題材`,
    `- カテゴリ：${cluster.name}`,
    `- 主キーワード（題名と keywords の先頭に入れる）：${topic.keyword}`,
    `- 答える検索意図：${topic.intent}`,
    `- 題名の方向（そのままでなくてよい）：${topic.titleHint}`,
    `- 書く内容：\n${topic.angle.map((a) => `  - ${a}`).join("\n")}`,
    `- 親ページ（必ずリンクする）：${cluster.pillar.href} … ${cluster.pillar.label}`,
    pillarKeywords(cluster.pillar.href),
    `- 関連サービス（1本以上リンクする）：${svc.map((s) => `${servicePath(s)}（${s.name}）`).join("、")}`,
    wk.length ? `- 関係する施工事例（文の流れに合えばリンクする）：${wk.map((w) => `/works/${w.slug}（${w.title}）`).join("、")}` : "",
    ar.length ? `- 関係する地域ページ（文の流れに合えばリンクする）：${ar.map((a) => `/area/${a.slug}（${a.name}）`).join("、")}` : "",
    `- 数値を使ってよい事実シートの節：${[...BASE_SECTIONS, ...topic.facts].join("、")}${topic.facts.length ? "" : "（この題材は、数値を伴わない仕組みの説明を中心に書く）"}`,
    `- sources に入れてよい出典：上の節の「出典」にある URL だけ`,
    `- 今日の日付：${today}`,
    ``,
    `## すでにある記事（内容が重ならないようにする。関係が深ければ本文からリンクし、relatedArticles に slug を入れる）`,
    existing.length ? existing.map((e) => `- /blog/${e.slug} … ${e.title}（主キーワード：${e.keywords[0]}／検索意図：${e.intent}）`).join("\n") : "（まだありません）",
  ]
    .filter(Boolean)
    .join("\n");
}

/** 親ページが担当している検索語（記事がこれらの語だけを狙わないように、書き手に知らせる） */
function pillarKeywords(href: string): string {
  const page = seoPageFor(href);
  return page ? `- 固定ページが担当している検索語（この記事の主題にしない）：${[page.primaryKeyword, ...page.secondaryKeywords].join("、")}` : "";
}

const REVIEW_SYSTEM_RULES = `あなたは、住宅設備会社の公式サイトに載せる記事の、事実確認の担当者です。書き手とは別の立場で、原稿を1文ずつ読み、下の「事実シート」と照らし合わせます。

## 確かめること
1. 数値・制度・固有名詞を含む文が、事実シートの記述と一致しているか。数字、単位、条件（「〜の場合」「〜まで」）、だれの説明か、が食い違っていないか。事実シートにある数字でも、別の話題の数字として使われていれば誤り（例：補助金の額を工事の費用として書く、ある機器の年数を別の機器の年数として書く）。
2. 事実シートに無い主張が、事実として書かれていないか。ただし、事実シートの「設備の一般的な知識」の節にある内容と、数値を伴わない広く知られた仕組みの説明は、問題にしない。
3. 会社について、事実シートの「会社」「施工事例」の節に無いこと（件数・年数・保証・資格・料金・速さ・順位・お客様の声・架空の事例）が書かれていないか。
4. 事実シートが「書かない」としていることを書いていないか。
5. 誤字、不自然な日本語、意味の通らない文、文の途中で終わっている箇所が無いか。
6. リンクの文言と、リンク先のページの内容が合っているか。
7. 制度に触れているのに、確認日が本文に書かれていない、ということが無いか。

## 判定
- 上の1〜7に当たる箇所を、issues に1件ずつ挙げる。quote には、原稿の文をそのまま抜き出す。
- 言い回しの好みや、「もっと詳しく書ける」という指摘はしない。事実と日本語の誤りだけを挙げる。
- 1件も無ければ verdict は pass、1件でもあれば fail。`;

/* ------------------------------------------------------------------ */
/* API の呼び出し                                                      */
/* ------------------------------------------------------------------ */
/** 1M トークンあたりの料金（USD）。費用の目安の表示に使う */
const PRICES: Record<string, { input: number; output: number }> = {
  "claude-opus-5-5": { input: 4, output: 20 },
  "claude-sonnet-5-5": { input: 2, output: 10 },
  "claude-haiku-4-5": { input: 1, output: 5 },
};

class Session {
  client = new Anthropic();
  useFallbacks = process.env.ANTHROPIC_FALLBACKS !== "off";
  cost = 0;
  log: string[] = [];

  note(line: string) {
    this.log.push(line);
    console.log(line);
  }

  private addCost(model: string, usage: { input_tokens: number; output_tokens: number; cache_creation_input_tokens?: number | null; cache_read_input_tokens?: number | null }) {
    const p = PRICES[model] ?? PRICES["claude-opus-5-5"];
    const write = usage.cache_creation_input_tokens ?? 0;
    const read = usage.cache_read_input_tokens ?? 0;
    this.cost += (usage.input_tokens * p.input + write * p.input * 1.25 + read * p.input * 0.1 + usage.output_tokens * p.output) / 1_000_000;
  }

  /**
   * 決まった形（schema）の JSON を返させる。長い出力に備えて、ストリーミングで受ける。
   * モデルが安全上の理由で応答を断った場合に備えて、既定では代替モデルへの切り替え（fallbacks）を有効にしている。
   * 切り替えの指定が受け付けられない環境では、指定を外して1回だけやり直す。
   */
  async json<T>(args: { model: string; system: Anthropic.TextBlockParam[]; user: string; schema: z.ZodType<T>; effort: "medium" | "high" | "xhigh"; label: string }): Promise<T> {
    const base = {
      model: args.model,
      max_tokens: MAX_TOKENS,
      system: args.system,
      messages: [{ role: "user" as const, content: args.user }],
    };

    let message: { stop_reason: string | null; usage: Anthropic.Usage | Anthropic.Beta.BetaUsage; parsed_output: T | null; model: string };
    if (this.useFallbacks) {
      try {
        message = await this.client.beta.messages
          .stream({ ...base, betas: [FALLBACK_BETA], fallbacks: "default", output_config: { effort: args.effort, format: betaZodOutputFormat(args.schema) } })
          .finalMessage();
      } catch (e) {
        if (!(e instanceof Anthropic.BadRequestError)) throw e;
        this.note(`  （代替モデルへの切り替えの指定が受け付けられなかったため、指定を外してやり直します：${e.message.slice(0, 120)}）`);
        this.useFallbacks = false;
        message = await this.client.messages.stream({ ...base, output_config: { effort: args.effort, format: zodOutputFormat(args.schema) } }).finalMessage();
      }
    } else {
      message = await this.client.messages.stream({ ...base, output_config: { effort: args.effort, format: zodOutputFormat(args.schema) } }).finalMessage();
    }

    this.addCost(args.model, message.usage);
    if (message.model && message.model !== args.model) this.note(`  （${args.label}：${args.model} が応答を断ったため、${message.model} が応答しました）`);
    if (message.stop_reason === "refusal") throw new StopError(`${args.label}：モデルが応答を断りました（refusal）`);
    if (message.stop_reason === "max_tokens") throw new StopError(`${args.label}：出力が上限（max_tokens）で途中で切れました`);
    if (!message.parsed_output) throw new StopError(`${args.label}：決まった形の JSON を受け取れませんでした（stop_reason=${message.stop_reason}）`);
    return message.parsed_output;
  }
}

/** 書き直しでは解決しない止まり方（応答を断られた・途中で切れた） */
class StopError extends Error {}

/* ------------------------------------------------------------------ */
/* 原稿 → 記事                                                          */
/* ------------------------------------------------------------------ */
/** 原稿が挙げた出典の URL を、事実シートの節の名前と確認日つきの形にする */
function toSources(urls: string[], sheet: FactSheet, today: string): ArticleDraft["sources"] {
  return [...new Set(urls)].map((url) => {
    const section = sheet.sections.find((s) => s.sources.includes(url));
    let host = url;
    try {
      host = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      /* 形の正しくない URL は、あとの検査で不合格になる */
    }
    return { title: section ? `${section.title}（${host}）` : host, url, checkedAt: section?.checkedAt || today };
  });
}

/** 主キーワードを必ず先頭にした keywords */
function withPrimary(primary: string, rest: string[]): string[] {
  return [primary, ...rest.map((k) => k.trim()).filter((k) => k && normalizeKeyword(k) !== normalizeKeyword(primary))].slice(0, 8);
}

/** 新しい記事：原稿に、題材で決めた項目（slug・カテゴリ・主キーワード・日付など）を足す */
export function toDraft(out: ArticleOutput, topic: Topic, sheet: FactSheet, today: string): ArticleDraft {
  return {
    title: out.title.trim(),
    slug: topic.slug,
    description: out.description.trim(),
    category: topic.cluster,
    keywords: withPrimary(topic.keyword, out.keywords),
    intent: topic.intent,
    publishedAt: today,
    updatedAt: today,
    author: siteConfig.editorial.author,
    faq: out.faq.map((f) => ({ q: f.q.trim(), a: f.a.trim() })),
    relatedServices: topic.services,
    relatedArticles: out.relatedArticles,
    relatedAreas: topic.areas ?? [],
    sources: toSources(out.sources, sheet, today),
    generated: true,
    body: out.body.trim(),
  };
}

/**
 * 見直し：公開済みの記事の項目（slug・カテゴリ・主キーワード・検索意図・公開日・写真など）はそのままに、
 * 題名・説明文・本文・質問と答え・関連記事・出典だけを原稿のものに替え、更新日を今日にする。
 */
export function toRefreshedDraft(out: ArticleOutput, post: Post, sheet: FactSheet, today: string): ArticleDraft {
  const { body: _body, cluster: _cluster, photo: _photo, length: _length, headings: _headings, ...front } = post;
  void _body;
  void _cluster;
  void _photo;
  void _length;
  void _headings;
  return {
    ...front,
    title: out.title.trim(),
    description: out.description.trim(),
    keywords: withPrimary(post.keywords[0], out.keywords),
    faq: out.faq.map((f) => ({ q: f.q.trim(), a: f.a.trim() })),
    relatedArticles: out.relatedArticles,
    sources: toSources(out.sources, sheet, today),
    updatedAt: today,
    body: out.body.trim(),
  };
}

export function toMarkdown(draft: ArticleDraft): string {
  const { body, ...front } = draft;
  // 値の無い項目（cover を指定していない記事など）は書き出さない
  const data = Object.fromEntries(Object.entries(front).filter(([, v]) => v !== undefined));
  return matter.stringify(`\n${body}\n`, data);
}

function toOutput(d: { title: string; description: string; keywords: string[]; body: string; faq: { q: string; a: string }[]; relatedArticles: string[]; sources: { url: string }[] }): ArticleOutput {
  return { title: d.title, description: d.description, keywords: d.keywords, body: d.body, faq: d.faq, relatedArticles: d.relatedArticles, sources: d.sources.map((x) => x.url) };
}

/* ------------------------------------------------------------------ */
/* 本体                                                                */
/* ------------------------------------------------------------------ */
/** 1回の実行で行う作業（新しい記事／見直し）。書く → 検査 → 読み直し → 保存 の流れは、どちらも同じ */
type Job = {
  mode: GenerateMode;
  slug: string;
  /** 記録に出す1行 */
  headline: string;
  /** モデルに渡す、作業の説明 */
  brief: string;
  /** 最初の依頼の締めの一文 */
  ask: string;
  /** 原稿を、保存する形の記事にする */
  build: (out: ArticleOutput) => ArticleDraft;
  /** 検査で数値を使ってよい節（undefined は、事実シート全体と突き合わせる） */
  factSections: string[] | undefined;
  /** 重複の判定に使う、ほかの記事 */
  others: Post[];
  /** 読み直しの担当に伝える、作業の説明 */
  reviewNote: string;
  /** 検査に通った原稿に、さらに求める条件。満たさないときは、直してほしい点を返す */
  extraCheck?: (draft: ArticleDraft) => string[];
};

function newJob(topic: Topic, existing: Post[], sheet: FactSheet, today: string): Job {
  const cluster = getCluster(topic.cluster)!;
  return {
    mode: "new",
    slug: topic.slug,
    headline: `新しい記事：${topic.slug}（${cluster.name}・${topic.priority}）… ${topic.intent}`,
    brief: topicBrief(topic, existing, today),
    ask: "上の題材で、記事を書いてください。",
    build: (out) => toDraft(out, topic, sheet, today),
    factSections: topic.facts,
    others: existing,
    reviewNote: `- 答える検索意図：${topic.intent}\n- この記事で数値を使ってよい事実シートの節：${[...BASE_SECTIONS, ...topic.facts].join("、")}`,
  };
}

function refreshJob(post: Post, reasons: RefreshReason[], existing: Post[], sheet: FactSheet, today: string): Job {
  const cluster = getCluster(post.category)!;
  const topic = getTopic(post.slug);
  // 数値を使ってよい節：自動生成の記事は、題材で決めた節。手書きの記事は、事実シート全体（公開済みの記事の点検と同じ基準）
  const bySource = sheet.sections.filter((sec) => post.sources.some((src) => sec.sources.includes(src.url))).map((sec) => sec.title);
  const factSections = post.generated ? (topic?.facts ?? bySource) : undefined;
  const scope = factSections ? [...BASE_SECTIONS, ...factSections].join("、") : "事実シートの全体（記事の話題に合う節の数値だけを使う）";
  const others = existing.filter((p) => p.slug !== post.slug);
  const brief = [
    "## 今回の作業：公開済みの記事の見直し（新しい記事は書かない）",
    `- 記事：/blog/${post.slug} … ${post.title}`,
    `- カテゴリ：${cluster.name}`,
    `- 主キーワード（変えない）：${post.keywords[0]}`,
    `- 答える検索意図（変えない）：${post.intent}`,
    `- 親ページ：${cluster.pillar.href} … ${cluster.pillar.label}`,
    pillarKeywords(cluster.pillar.href),
    `- 数値を使ってよい事実シートの節：${scope}`,
    `- 今日の日付：${today}`,
    "",
    "## 見直す理由（すべてに対応する）",
    ...reasons.map((r, i) => `${i + 1}. ${r.instruction}`),
    "",
    "## 見直しの決まり",
    "- 上の理由に関係する箇所だけを直す。関係のない文は、一字も変えない（全体を書き直すと、別の場所に新しい誤りが入るため）。",
    "- 題名と説明文は、内容が変わって合わなくなったときだけ直す。",
    "- 直す所が無いと判断したら、いまの記事をそのまま返す。日付だけを新しくするための書き換えはしない。",
    "",
    "## ほかの記事（内容が重ならないようにする）",
    others.length ? others.map((e) => `- /blog/${e.slug} … ${e.title}（主キーワード：${e.keywords[0]}／検索意図：${e.intent}）`).join("\n") : "（ありません）",
    "",
    "## いまの記事",
    "```json",
    JSON.stringify(toOutput(post), null, 2),
    "```",
  ]
    .filter((line) => line !== undefined)
    .join("\n");
  return {
    mode: "refresh",
    slug: post.slug,
    headline: `見直し：${post.slug}（${cluster.name}）… 理由 ${reasons.length} 件\n${reasons.map((r) => `  - ${r.instruction}`).join("\n")}`,
    brief,
    ask: "上の理由に沿って、いまの記事を見直してください。",
    build: (out) => toRefreshedDraft(out, post, sheet, today),
    factSections,
    others,
    reviewNote: `- 公開済みの記事の見直し\n- 答える検索意図：${post.intent}\n- この記事で数値を使ってよい事実シートの節：${scope}`,
    extraCheck: (draft) => {
      const problems = reasons.filter((r) => !isOptionalReason(r) && !r.resolved(draft)).map((r) => `見直す理由に対応できていません：${r.instruction}`);
      if (!problems.length && !bodyChanged(post.body, draft.body)) problems.push("本文が変わっていません。見直す理由に対応する変更を、本文に入れてください（日付だけの更新はしません）。");
      return problems;
    },
  };
}

export async function generatePost(): Promise<GenerateResult> {
  const today = todayJst();
  const existing = getAllPosts();
  const fixture = process.env.DRY_RUN_FIXTURE;
  // 確認用の原稿（fixture）は、公開する記事ではない。DRY_RUN を付け忘れても保存しない
  const dryRun = process.env.DRY_RUN === "1" || !!fixture;
  const session = new Session();
  const skipped = (reason: string): GenerateResult => ({ status: "skipped", reason, log: session.log });

  const forced = process.env.FORCE || process.env.TOPIC || process.env.REFRESH;
  if (!forced && existing.some((p) => p.publishedAt === today || p.updatedAt === today)) {
    return skipped(`今日（${today}）は、すでに記事を公開または更新しています（1日1本）`);
  }

  const sheet = loadFactSheet();
  const topic = process.env.REFRESH ? null : pickTopic(existing, process.env.TOPIC);
  const target = process.env.TOPIC ? null : pickRefreshTarget(existing, sheet, today, process.env.REFRESH);
  const mode: GenerateMode = process.env.TOPIC ? "new" : process.env.REFRESH ? "refresh" : decideMode(today, !!target, !!topic);

  let job: Job;
  if (mode === "refresh") {
    if (!target) return skipped(process.env.REFRESH ? `記事 ${process.env.REFRESH} がありません` : "見直す理由のある記事がありません（日付だけの更新はしません）");
    if (!target.reasons.length) return skipped(`記事 ${target.post.slug} には、見直す理由がありません（日付だけの更新はしません）`);
    job = refreshJob(target.post, target.reasons, existing, sheet, today);
  } else {
    if (!topic) {
      return skipped(process.env.TOPIC ? `題材 ${process.env.TOPIC} が topics.ts にありません` : "書ける題材が残っていません（lib/blog-generator/topics.ts に題材を足してください）");
    }
    if (existing.some((p) => p.slug === topic.slug)) return skipped(`題材 ${topic.slug} の記事はすでにあります`);
    job = newJob(topic, existing, sheet, today);
  }

  const ctx = { sheet, existing: job.others, factSections: job.factSections };
  session.note(job.headline);
  session.note(fixture ? `確認用の原稿を使います：${fixture}` : `書くモデル：${WRITER_MODEL}／読み直すモデル：${REVIEW_MODEL}`);

  const system = writerSystem(sheet);
  const fixtures: ArticleOutput[] = fixture ? [JSON.parse(fs.readFileSync(fixture, "utf8"))].flat() : [];
  const base = { mode: job.mode, slug: job.slug };

  let draft: ArticleDraft | undefined;
  let problems: string[] = [];
  let attempts = 0;

  try {
    for (attempts = 1; attempts <= MAX_ATTEMPTS; attempts++) {
      /* 書く／書き直す */
      let out: ArticleOutput;
      if (fixture) {
        const fx = fixtures[attempts - 1];
        if (!fx) {
          attempts -= 1; // 確認用の原稿が尽きた（この回は書いていない）
          break;
        }
        out = ArticleSchema.parse(fx);
      } else if (!draft) {
        out = await session.json({ model: WRITER_MODEL, system, user: `${job.brief}\n\n${job.ask}`, schema: ArticleSchema, effort: "high", label: `試行${attempts}（執筆）` });
      } else {
        out = await session.json({
          model: WRITER_MODEL,
          system,
          user: `${job.brief}\n\n## 前回の原稿\n\`\`\`json\n${JSON.stringify(toOutput(draft), null, 2)}\n\`\`\`\n\n## 直してほしい点\n${problems.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n前回の原稿を、上の点だけ直してください。指摘されていない文は、一字も変えないでください（全体を書き直すと、別の場所に新しい誤りが入るためです）。数値を直すときは、事実シートの記述に合わせるか、その文を削ってください。`,
          schema: ArticleSchema,
          effort: "high",
          label: `試行${attempts}（書き直し）`,
        });
      }
      draft = job.build(out);

      /* 機械の検査 */
      const v = validateArticle(draft, ctx);
      const extra = v.ok ? (job.extraCheck?.(draft) ?? []) : [];
      if (!v.ok || extra.length) {
        problems = v.ok ? extra : v.errors;
        session.note(`試行${attempts}：機械の検査で不合格（${v.length}字）\n${problems.map((e) => `  - ${e}`).join("\n")}`);
        continue;
      }
      v.warnings.forEach((w) => session.note(`  注意：${w}`));

      /* 読み直し */
      if (fixture) {
        session.note(`試行${attempts}：機械の検査に合格（${v.length}字）。確認用のため、読み直しは行いません`);
      } else {
        const review: ReviewOutput = await session.json({
          model: REVIEW_MODEL,
          system: [
            { type: "text", text: REVIEW_SYSTEM_RULES },
            { type: "text", text: `## 事実シート\n\n${sheet.raw}`, cache_control: { type: "ephemeral" } },
          ],
          user: `## 題材\n${job.reviewNote}\n\n## 原稿\n### 題名\n${draft.title}\n\n### 説明文\n${draft.description}\n\n### 本文\n${draft.body}\n\n### 質問と答え\n${draft.faq.map((q) => `Q. ${q.q}\nA. ${q.a}`).join("\n\n") || "（なし）"}\n\n### 出典として挙げた URL\n${draft.sources.map((x) => `- ${x.url}`).join("\n") || "（なし）"}\n\nこの原稿を確かめてください。`,
          schema: ReviewSchema,
          effort: "high",
          label: `試行${attempts}（読み直し）`,
        });
        if (review.verdict === "fail" && review.issues.length) {
          problems = review.issues.map((i) => `「${i.quote}」… ${i.problem} → ${i.fix}`);
          session.note(`試行${attempts}：読み直しで不合格\n${problems.map((p) => `  - ${p}`).join("\n")}`);
          continue;
        }
        session.note(`試行${attempts}：機械の検査と読み直しに合格（${v.length}字）`);
      }

      /* 保存 */
      const file = path.join(BLOG_DIR, `${draft.slug}.md`);
      if (dryRun) {
        session.note(`（DRY_RUN のため保存しません）\n----- 原稿 -----\n${toMarkdown(draft)}`);
        return { status: "dry-run", ...base, draft, file, attempts, cost: session.cost, log: session.log };
      }
      fs.mkdirSync(BLOG_DIR, { recursive: true });
      fs.writeFileSync(file, toMarkdown(draft), "utf8");
      session.note(`保存しました：content/blog/${draft.slug}.md`);
      return { status: "published", ...base, draft, file, attempts, cost: session.cost, log: session.log };
    }
  } catch (e) {
    if (e instanceof StopError) {
      return { status: "rejected", ...base, reason: e.message, attempts, cost: session.cost, log: session.log, lastDraft: draft };
    }
    throw e;
  }

  const tried = Math.min(attempts, MAX_ATTEMPTS);
  return {
    status: "rejected",
    ...base,
    reason: job.mode === "refresh" ? `${tried}回直しても基準を満たさなかったため、記事は元のままにします（日付も更新しません）` : `${tried}回書いても基準を満たさなかったため、今日は公開しません`,
    attempts: tried,
    cost: session.cost,
    log: session.log,
    lastDraft: draft,
  };
}
