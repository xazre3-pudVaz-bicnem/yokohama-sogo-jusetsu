/**
 * コラムを1本、自動で書いて content/blog/ に保存する（新しい記事を書くか、公開済みの記事を1本見直すか、のどちらか）。
 *   npm run blog:generate          … 生成して保存（ANTHROPIC_API_KEY が必要）
 *   npm run blog:dry-run           … 生成と検査だけ（保存しない）
 *   DRY_RUN_FIXTURE=scripts/fixtures/blog-good.json npm run blog:dry-run … API を呼ばずに仕組みだけ確かめる
 *   TOPIC=<slug> npm run blog:generate … 題材を指定して、新しい記事を書く
 *   BLOG_MODE=refresh npm run blog:generate … 公開済みの記事の見直しに固定する（REFRESH=<slug> で記事を指定できる）
 *   BLOG_REFRESH_RATIO=0.3 … 見直しに使う日の割合（既定 0.3。0 にすると、新しい記事だけを書く）
 *
 * 終了コード
 *   0 … 公開した／今日は書くものが無い／基準を満たさなかったので公開しなかった（どれも正常）
 *   1 … 設定の誤りや通信の失敗など、仕組みの問題
 * 基準を満たさなかった日を「失敗」にしないのは、毎日かならず公開するより、質を優先する方針のため。
 */
import fs from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import { generatePost } from "@/lib/blog-generator/generate";

function summary(lines: string[]) {
  const text = lines.join("\n");
  console.log(`\n${text}`);
  // GitHub Actions の実行結果の画面に要約を出す
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`);
  // 次のステップ（コミットの文言）で使う値
  return text;
}

function output(key: string, value: string) {
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value.replace(/\r?\n/g, " ")}\n`);
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN && !process.env.DRY_RUN_FIXTURE) {
    console.error("ANTHROPIC_API_KEY が設定されていません。GitHub のリポジトリの Secrets に登録してください（README の「コラムの自動投稿」を参照）。");
    process.exit(1);
  }

  const result = await generatePost();
  const cost = "cost" in result ? `約 ${result.cost.toFixed(2)} USD` : "0";

  if (result.status === "published" || result.status === "dry-run") {
    const what = result.mode === "refresh" ? "コラムを見直しました" : "コラムを公開しました";
    summary([
      result.status === "published" ? `### ${what}` : "### 試し書き（保存していません）",
      `- 種類：${result.mode === "refresh" ? "公開済みの記事の見直し" : "新しい記事"}`,
      `- 題名：${result.draft.title}`,
      `- URL：/blog/${result.draft.slug}`,
      `- カテゴリ：${result.draft.category}`,
      `- 書き直しを含む試行：${result.attempts}回`,
      `- API の費用の目安：${cost}`,
    ]);
    output("published", result.status === "published" ? "true" : "false");
    output("title", result.draft.title);
    output("slug", result.draft.slug);
    // コミットの文言に使う（追加／更新）
    output("action", result.mode === "refresh" ? "更新" : "追加");
    return;
  }

  if (result.status === "skipped") {
    summary(["### 今日は書きませんでした", `- 理由：${result.reason}`]);
    output("published", "false");
    return;
  }

  summary([
    "### 基準を満たさなかったため、公開しませんでした",
    `- 種類：${result.mode === "refresh" ? "公開済みの記事の見直し" : "新しい記事"}`,
    `- 記事：${result.slug}`,
    `- 理由：${result.reason}`,
    `- 試行：${result.attempts}回`,
    `- API の費用の目安：${cost}`,
    "",
    "<details><summary>試行の記録</summary>",
    "",
    "```",
    ...result.log,
    "```",
    "",
    "</details>",
  ]);
  output("published", "false");
}

main().catch((e) => {
  if (e instanceof Anthropic.AuthenticationError) console.error("API キーが正しくありません（ANTHROPIC_API_KEY を確認してください）。");
  else if (e instanceof Anthropic.RateLimitError) console.error("API の利用上限に達しました。時間をおいて、もう一度実行してください。");
  else if (e instanceof Anthropic.APIConnectionError) console.error("API に接続できませんでした。");
  else if (e instanceof Anthropic.APIError) console.error(`API のエラー（${e.status}）：${e.message}`);
  else console.error(e);
  process.exit(1);
});
