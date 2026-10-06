/**
 * コラムの検査（品質ゲート）が、意図どおりに働いているかを確かめる。API は呼ばない。
 *   npm run blog:selftest
 *
 * 確かめること
 *   1. 良い原稿（scripts/fixtures/blog-good.json）が合格する
 *   2. 悪い原稿（scripts/fixtures/blog-bad.json）が、狙った理由で不合格になる
 *      （決まり文句・事実シートに無い数値・根拠の無い売り文句・存在しないリンク・出典の誤り）
 *   3. 数値の取り出しと、題材選びが、同じ入力なら同じ結果になる
 * 検査の規則（lib/blog-generator/validate.ts）や事実シートを変えたら、これと npm run blog:audit を実行する。
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPosts } from "@/lib/blog";
import { loadFactSheet, numericTokens, unknownNumericTokens } from "@/lib/blog-generator/facts";
import { ArticleSchema, pickTopic, toDraft } from "@/lib/blog-generator/generate";
import { diceBigram, shingleOverlap } from "@/lib/blog-generator/similarity";
import { getTopic, topics } from "@/lib/blog-generator/topics";
import { validateArticle } from "@/lib/blog-generator/validate";
import { getCluster } from "@/lib/blog-clusters";
import { publishedAreas } from "@/data/areas";
import { getService } from "@/data/services";
import { getWork } from "@/data/works";

let failed = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "  ○" : "  ×"} ${name}${!ok && detail ? `\n      ${detail}` : ""}`);
  if (!ok) failed += 1;
}

const sheet = loadFactSheet();
const existing = getAllPosts();
const fixture = (name: string) => ArticleSchema.parse(JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "fixtures", name), "utf8")));
const topic = getTopic("water-heater-error-first-steps")!;

console.log("1. 良い原稿");
{
  const draft = toDraft(fixture("blog-good.json"), topic, sheet, "2026-10-07");
  const r = validateArticle(draft, { sheet, existing, factSections: topic.facts });
  check("合格する", r.ok, r.errors.join(" / "));
}

console.log("2. 悪い原稿");
{
  const draft = toDraft(fixture("blog-bad.json"), topic, sheet, "2026-10-07");
  const r = validateArticle(draft, { sheet, existing, factSections: topic.facts });
  const has = (word: string) => r.errors.some((e) => e.includes(word));
  const numeric = r.errors.find((e) => e.includes("事実シートに無い数値")) ?? "";
  check("不合格になる", !r.ok);
  check("決まり文句（徹底解説）を見つける", has("徹底解説"));
  check("決まり文句（いかがでしたか）を見つける", has("いかがでした"));
  check("記事自体に触れる前置きを見つける", has("この記事では"));
  check("事実シートに無い数値を見つける", numeric !== "", r.errors.join(" / "));
  check("15万円・15年・98%・5000件 を数値として拾う", ["15万円", "15年", "98%", "5000件"].every((t) => numeric.includes(t)), numeric);
  // 「3万円」は、給湯省エネ2026事業の節にある数字（加算額）。エラーの題材では、その節を使えないので通さない
  check("別の節の数値（3万円）を、文脈の違う話題に持ち込むと見つける", numeric.includes("3万円"), numeric);
  const whole = validateArticle(draft, { sheet, existing }).errors.find((e) => e.includes("事実シートに無い数値")) ?? "";
  check("節を絞らない検査では 3万円 が通ってしまう（絞る理由の確認）", !whole.includes("3万円"), whole);
  check("順位の表現（No.1）を見つける", has("順位・最上級"));
  check("件数の実績を見つける", has("件数・実績"));
  check("創業年・保証年数を見つける", has("創業年"));
  check("資格の名称を見つける", has("資格"));
  check("対応の速さの約束を見つける", has("速さ"));
  check("費用の相場を見つける", has("相場"));
  check("h1 の見出しを見つける", has("h1"));
  check("「まとめ」だけの見出しを見つける", has("まとめ"));
  check("存在しないページへのリンクを見つける", has("存在しないページ"));
  check("「こちら」というリンクの文言を見つける", has("リンクの文言"));
  check("親ページへのリンクが無いことを見つける", has("親ページ"));
  check("出典が事実シートに無いことを見つける", has("sources の URL"));
  check("存在しない関連記事を見つける", has("relatedArticles"));
  check("重ねた記号（！！）を見つける", has("重ねた記号"));
  check("本文が短いことを見つける", has("短すぎます"));
}

console.log("3. 数値の取り出し");
{
  const toks = numericTokens("補助額は７万円／台、割合は48％、期限は2026年12月31日。タンクは約400kg〜600kg、3つの理由と2回塗り。");
  check("全角の数字と単位を半角にそろえる", toks.includes("7万円") && toks.includes("48%"));
  check("日付を拾う", toks.includes("2026年") && toks.includes("12月31日"));
  check("範囲の両端を拾う", toks.includes("400kg") && toks.includes("600kg"));
  check("数え方（3つ・2回）は拾わない", !toks.some((t) => /つ|回/.test(t)));
  check("事実シートにある数値は通す", unknownNumericTokens("エコキュートは7万円／台、ハイブリッド給湯機は10万円／台。", sheet).length === 0);
  check("事実シートに無い数値は通さない", unknownNumericTokens("補助額は25万円です。", sheet).join() === "25万円");
  check("節を絞ると、その節の数値だけを通す", unknownNumericTokens("補助額は7万円／台。標準使用期間は10年。", sheet, ["ガス給湯器・エアコンの標準使用期間"]).join() === "7万円");
  check("節の確認日は、日付として書ける", unknownNumericTokens("2026年10月6日に確認した内容です。", sheet, []).length === 0);
}

console.log("4. 重複の判定");
{
  const a = existing[0];
  check("同じ本文は重なりが大きい", shingleOverlap(a.body, a.body) > 0.99);
  if (existing[1]) check("別の記事どうしは重なりが小さい", shingleOverlap(a.body, existing[1].body) < 0.12, String(shingleOverlap(a.body, existing[1].body)));
  check("近いタイトルを見つける", diceBigram("給湯器の交換時期はいつ？", "給湯器の交換時期の目安") > 0.6);
}

console.log("5. 題材");
{
  const slugs = new Set<string>();
  let ok = true;
  const problems: string[] = [];
  for (const t of topics) {
    if (slugs.has(t.slug)) problems.push(`slug の重複：${t.slug}`);
    slugs.add(t.slug);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t.slug)) problems.push(`slug の形：${t.slug}`);
    if (!getCluster(t.cluster)) problems.push(`カテゴリが無い：${t.slug}`);
    for (const s of t.services) if (!getService(s)) problems.push(`サービスが無い：${t.slug} → ${s}`);
    for (const f of t.facts) if (!sheet.sections.some((sec) => sec.title.startsWith(f))) problems.push(`事実シートに節が無い：${t.slug} → ${f}`);
    const pillar = getCluster(t.cluster)?.pillar.href ?? "";
    if (pillar.startsWith("/service/") && !t.services.includes(pillar.replace("/service/", ""))) problems.push(`親ページのサービスが services に無い：${t.slug} → ${pillar}`);
    // 題材の指示に書いた数値が、その題材で使える節に無いと、書きようのない題材になる
    const unwritable = unknownNumericTokens([t.titleHint, ...t.angle].join("\n"), sheet, t.facts);
    if (unwritable.length) problems.push(`題材の指示の数値が、使える節に無い：${t.slug} → ${unwritable.join("、")}`);
    for (const w of t.works ?? []) if (!getWork(w)) problems.push(`施工事例が無い：${t.slug} → ${w}`);
    for (const a of t.areas ?? []) if (!publishedAreas.some((x) => x.slug === a)) problems.push(`地域ページが無い：${t.slug} → ${a}`);
  }
  for (let i = 0; i < topics.length; i++) {
    for (let j = i + 1; j < topics.length; j++) {
      if (diceBigram(topics[i].intent, topics[j].intent) >= 0.78) problems.push(`検索意図が近い：${topics[i].slug} と ${topics[j].slug}`);
    }
  }
  ok = problems.length === 0;
  check(`題材 ${topics.length} 件の定義に誤りが無い`, ok, problems.join(" / "));
  const first = pickTopic(existing);
  const second = pickTopic(existing);
  check("同じ状態なら、同じ題材を選ぶ（ランダムにしない）", first?.slug === second?.slug);
  check("すでに記事のある題材は選ばない", !!first && !existing.some((e) => e.slug === first.slug));
  const remaining = topics.filter((t) => !existing.some((e) => e.slug === t.slug)).length;
  console.log(`      残りの題材：${remaining} 件／次に書く題材：${first?.slug ?? "なし"}`);
}

console.log(failed ? `\n${failed} 件の確認に失敗しました` : "\nすべての確認に合格しました");
process.exit(failed ? 1 : 0);
