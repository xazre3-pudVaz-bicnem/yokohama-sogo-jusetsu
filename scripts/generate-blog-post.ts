/**
 * コラムを1本、自動で書いて content/blog/ に保存する。
 *   npm run blog:generate          … 生成して保存（ANTHROPIC_API_KEY が必要）
 *   npm run blog:dry-run           … 生成と検査だけ（保存しない）
 *   DRY_RUN_FIXTURE=scripts/fixtures/blog-good.json npm run blog:dry-run … API を呼ばずに仕組みだけ確かめる
 *   TOPIC=<slug> npm run blog:generate … 題材を指定する
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
    summary([
      result.status === "published" ? "### コラムを公開しました" : "### 試し書き（保存していません）",
      `- 題名：${result.draft.title}`,
      `- URL：/blog/${result.draft.slug}`,
      `- カテゴリ：${result.draft.category}`,
      `- 書き直しを含む試行：${result.attempts}回`,
      `- API の費用の目安：${cost}`,
    ]);
    output("published", result.status === "published" ? "true" : "false");
    output("title", result.draft.title);
    output("slug", result.draft.slug);
    return;
  }

  if (result.status === "skipped") {
    summary(["### 今日は書きませんでした", `- 理由：${result.reason}`]);
    output("published", "false");
    return;
  }

  summary([
    "### 基準を満たさなかったため、公開しませんでした",
    `- 題材：${result.topic.slug}`,
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
