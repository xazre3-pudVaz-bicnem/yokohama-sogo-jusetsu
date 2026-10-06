import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import matter from "gray-matter";
import { z } from "zod";
import { publishedAreas } from "@/data/areas";
import { services } from "@/data/services";
import { works } from "@/data/works";
import { BLOG_DIR, getAllPosts, type Post } from "@/lib/blog";
import { blogClusters, getCluster } from "@/lib/blog-clusters";
import { BASE_SECTIONS, loadFactSheet, type FactSheet } from "@/lib/blog-generator/facts";
import { diceBigram } from "@/lib/blog-generator/similarity";
import { topics, getTopic, type Topic } from "@/lib/blog-generator/topics";
import { BODY_MAX, BODY_MIN, validateArticle, type ArticleDraft } from "@/lib/blog-generator/validate";
import { siteConfig } from "@/lib/site";

/**
 * コラムの自動生成（1回の実行で1本）。
 *
 * 流れ
 *   1. 題材を選ぶ（lib/blog-generator/topics.ts。記事の少ないカテゴリから、既存の記事と重ならないもの）
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

export type GenerateResult =
  | { status: "published"; topic: Topic; draft: ArticleDraft; file: string; attempts: number; cost: number; log: string[] }
  | { status: "dry-run"; topic: Topic; draft: ArticleDraft; file: string; attempts: number; cost: number; log: string[] }
  | { status: "skipped"; reason: string; log: string[] }
  | { status: "rejected"; topic: Topic; reason: string; attempts: number; cost: number; log: string[]; lastDraft?: ArticleDraft };

/* ------------------------------------------------------------------ */
/* 題材選び                                                            */
/* ------------------------------------------------------------------ */
export function pickTopic(existing: Pick<Post, "slug" | "intent" | "category">[], override?: string): Topic | null {
  if (override) return getTopic(override) ?? null;
  const count = new Map<string, number>();
  for (const p of existing) count.set(p.category, (count.get(p.category) ?? 0) + 1);
  const candidates = topics
    .map((t, index) => ({ t, index }))
    .filter(({ t }) => !existing.some((e) => e.slug === t.slug))
    .filter(({ t }) => !existing.some((e) => diceBigram(e.intent, t.intent) >= 0.78));
  candidates.sort((a, b) => (count.get(a.t.cluster) ?? 0) - (count.get(b.t.cluster) ?? 0) || a.index - b.index);
  return candidates[0]?.t ?? null;
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
    ...services.map((s) => `- /service/${s.slug} … ${s.name}`),
    "### 地域ページ",
    ...publishedAreas.map((a) => `- /area/${a.slug} … ${a.name}の住宅設備・リフォーム`),
    "### 施工事例",
    ...works.map((w) => `- /works/${w.slug} … ${w.title}`),
  ].join("\n");
}

function writerSystem(sheet: FactSheet): Anthropic.TextBlockParam[] {
  const rules = `あなたは、${siteConfig.name}（神奈川県横浜市戸塚区を中心に住宅設備の工事・リフォームを行う会社）の公式サイトで、コラムを書く編集者です。

## 読む人と、この記事の役目
読むのは、自宅の設備や外まわりのことで困っている、または交換を考え始めた一般の方です。検索で1つの疑問を持ってこのページに来ます。記事の役目は、その1つの疑問に、工事を頼む前に知っておくべきことを具体的に答えることです。答えたあとで、関係するサービスページ・施工事例へ自然につなぎます。売り込みの文章ではありません。

## 書き方
- 1つの記事は、渡された「検索意図」1つだけに答える。関係の薄い話題を足して長くしない。
- 最初の段落で、読む人の状況と、この記事で分かることを2〜3文で示す。前置きや予告（「解説します」など）は書かない。
- 見出し（##）は4〜7個。見出しだけ読んでも流れが分かる、内容を表す言葉にする。「まとめ」「はじめに」という見出しは作らない。
- 「なぜそうなるのか」「現場では何を確かめるのか」「読む人は何をすればよいのか」を書く。「重要です」「おすすめです」で終わらせず、理由を書く。
- です・ます調。一文は60字以内を目安にする。箇条書きと表は、比べるときと手順のときだけ使う。
- 本文は ${BODY_MIN + 500}〜${BODY_MAX - 1200} 字を目安にする（${BODY_MIN} 字未満は不合格）。同じ内容の言い換えで増やさない。
- 最後は、読む人が次にできること（確かめること・伝えること）と、サービスページへの案内で締める。

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
    `- 答える検索意図：${topic.intent}`,
    `- 題名の方向（そのままでなくてよい）：${topic.titleHint}`,
    `- 書く内容：\n${topic.angle.map((a) => `  - ${a}`).join("\n")}`,
    `- 親ページ（必ずリンクする）：${cluster.pillar.href} … ${cluster.pillar.label}`,
    `- 関連サービス（1本以上リンクする）：${svc.map((s) => `/service/${s.slug}（${s.name}）`).join("、")}`,
    wk.length ? `- 関係する施工事例（文の流れに合えばリンクする）：${wk.map((w) => `/works/${w.slug}（${w.title}）`).join("、")}` : "",
    ar.length ? `- 関係する地域ページ（文の流れに合えばリンクする）：${ar.map((a) => `/area/${a.slug}（${a.name}）`).join("、")}` : "",
    `- 数値を使ってよい事実シートの節：${[...BASE_SECTIONS, ...topic.facts].join("、")}${topic.facts.length ? "" : "（この題材は、数値を伴わない仕組みの説明を中心に書く）"}`,
    `- sources に入れてよい出典：上の節の「出典」にある URL だけ`,
    `- 今日の日付：${today}`,
    ``,
    `## すでにある記事（内容が重ならないようにする。関係が深ければ本文からリンクし、relatedArticles に slug を入れる）`,
    existing.length ? existing.map((e) => `- /blog/${e.slug} … ${e.title}（検索意図：${e.intent}）`).join("\n") : "（まだありません）",
  ]
    .filter(Boolean)
    .join("\n");
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
export function toDraft(out: ArticleOutput, topic: Topic, sheet: FactSheet, today: string): ArticleDraft {
  const sources = [...new Set(out.sources)].map((url) => {
    const section = sheet.sections.find((s) => s.sources.includes(url));
    let host = url;
    try {
      host = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      /* 形の正しくない URL は、あとの検査で不合格になる */
    }
    return { title: section ? `${section.title}（${host}）` : host, url, checkedAt: section?.checkedAt || today };
  });
  return {
    title: out.title.trim(),
    slug: topic.slug,
    description: out.description.trim(),
    category: topic.cluster,
    keywords: out.keywords.map((k) => k.trim()).filter(Boolean).slice(0, 8),
    intent: topic.intent,
    publishedAt: today,
    updatedAt: today,
    author: siteConfig.editorial.author,
    faq: out.faq.map((f) => ({ q: f.q.trim(), a: f.a.trim() })),
    relatedServices: topic.services,
    relatedArticles: out.relatedArticles,
    relatedAreas: topic.areas ?? [],
    sources,
    generated: true,
    body: out.body.trim(),
  };
}

export function toMarkdown(draft: ArticleDraft): string {
  const { body, ...front } = draft;
  return matter.stringify(`\n${body}\n`, front);
}

/* ------------------------------------------------------------------ */
/* 本体                                                                */
/* ------------------------------------------------------------------ */
export async function generatePost(): Promise<GenerateResult> {
  const today = todayJst();
  const existing = getAllPosts();
  const fixture = process.env.DRY_RUN_FIXTURE;
  // 確認用の原稿（fixture）は、公開する記事ではない。DRY_RUN を付け忘れても保存しない
  const dryRun = process.env.DRY_RUN === "1" || !!fixture;
  const session = new Session();

  if (!process.env.FORCE && !process.env.TOPIC && existing.some((p) => p.publishedAt === today)) {
    return { status: "skipped", reason: `今日（${today}）の記事はすでにあります（1日1本）`, log: session.log };
  }
  const topic = pickTopic(existing, process.env.TOPIC);
  if (!topic) {
    const reason = process.env.TOPIC ? `題材 ${process.env.TOPIC} が topics.ts にありません` : "書ける題材が残っていません（lib/blog-generator/topics.ts に題材を足してください）";
    return { status: "skipped", reason, log: session.log };
  }
  if (existing.some((p) => p.slug === topic.slug)) {
    return { status: "skipped", reason: `題材 ${topic.slug} の記事はすでにあります`, log: session.log };
  }

  const sheet = loadFactSheet();
  const ctx = { sheet, existing, factSections: topic.facts };
  const cluster = blogClusters.find((c) => c.id === topic.cluster)!;
  session.note(`題材：${topic.slug}（${cluster.name}）… ${topic.intent}`);
  session.note(fixture ? `確認用の原稿を使います：${fixture}` : `書くモデル：${WRITER_MODEL}／読み直すモデル：${REVIEW_MODEL}`);

  const brief = topicBrief(topic, existing, today);
  const system = writerSystem(sheet);
  const fixtures: ArticleOutput[] = fixture ? [JSON.parse(fs.readFileSync(fixture, "utf8"))].flat() : [];

  let draft: ArticleDraft | undefined;
  let problems: string[] = [];
  let attempts = 0;

  try {
    for (attempts = 1; attempts <= MAX_ATTEMPTS; attempts++) {
      /* 書く／書き直す */
      let out: ArticleOutput;
      if (fixture) {
        const f = fixtures[attempts - 1];
        if (!f) {
          attempts -= 1; // 確認用の原稿が尽きた（この回は書いていない）
          break;
        }
        out = ArticleSchema.parse(f);
      } else if (!draft) {
        out = await session.json({ model: WRITER_MODEL, system, user: `${brief}\n\n上の題材で、記事を書いてください。`, schema: ArticleSchema, effort: "high", label: `試行${attempts}（執筆）` });
      } else {
        const prev: ArticleOutput = {
          title: draft.title,
          description: draft.description,
          keywords: draft.keywords,
          body: draft.body,
          faq: draft.faq,
          relatedArticles: draft.relatedArticles,
          sources: draft.sources.map((s) => s.url),
        };
        out = await session.json({
          model: WRITER_MODEL,
          system,
          user: `${brief}\n\n## 前回の原稿\n\`\`\`json\n${JSON.stringify(prev, null, 2)}\n\`\`\`\n\n## 直してほしい点\n${problems.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n前回の原稿を、上の点だけ直してください。指摘されていない文は、一字も変えないでください（全体を書き直すと、別の場所に新しい誤りが入るためです）。数値を直すときは、事実シートの記述に合わせるか、その文を削ってください。`,
          schema: ArticleSchema,
          effort: "high",
          label: `試行${attempts}（書き直し）`,
        });
      }
      draft = toDraft(out, topic, sheet, today);

      /* 機械の検査 */
      const v = validateArticle(draft, ctx);
      if (!v.ok) {
        problems = v.errors;
        session.note(`試行${attempts}：機械の検査で不合格（${v.length}字）\n${v.errors.map((e) => `  - ${e}`).join("\n")}`);
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
          user: `## 題材\n- 答える検索意図：${topic.intent}\n- この記事で数値を使ってよい事実シートの節：${[...BASE_SECTIONS, ...topic.facts].join("、")}\n\n## 原稿\n### 題名\n${draft.title}\n\n### 説明文\n${draft.description}\n\n### 本文\n${draft.body}\n\n### 質問と答え\n${draft.faq.map((f) => `Q. ${f.q}\nA. ${f.a}`).join("\n\n")}\n\n### 出典として挙げた URL\n${draft.sources.map((s) => `- ${s.url}`).join("\n") || "（なし）"}\n\nこの原稿を確かめてください。`,
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
        return { status: "dry-run", topic, draft, file, attempts, cost: session.cost, log: session.log };
      }
      fs.mkdirSync(BLOG_DIR, { recursive: true });
      fs.writeFileSync(file, toMarkdown(draft), "utf8");
      session.note(`保存しました：content/blog/${draft.slug}.md`);
      return { status: "published", topic, draft, file, attempts, cost: session.cost, log: session.log };
    }
  } catch (e) {
    if (e instanceof StopError) {
      return { status: "rejected", topic, reason: e.message, attempts, cost: session.cost, log: session.log, lastDraft: draft };
    }
    throw e;
  }

  return {
    status: "rejected",
    topic,
    reason: `${Math.min(attempts, MAX_ATTEMPTS)}回書いても基準を満たさなかったため、今日は公開しません`,
    attempts: Math.min(attempts, MAX_ATTEMPTS),
    cost: session.cost,
    log: session.log,
    lastDraft: draft,
  };
}
