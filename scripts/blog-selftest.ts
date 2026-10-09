/**
 * コラムの検査（品質ゲート）が、意図どおりに働いているかを確かめる。API は呼ばない。
 *   npm run blog:selftest
 *
 * 確かめること
 *   1. 良い原稿（scripts/fixtures/blog-good.json）が合格する
 *   2. 悪い原稿（scripts/fixtures/blog-bad.json）が、狙った理由で不合格になる
 *      （決まり文句・事実シートに無い数値・根拠の無い売り文句・存在しないリンク・出典の誤り）
 *   3. 数値の取り出しと、題材選びが、同じ入力なら同じ結果になる
 *   4. 題材の主キーワードが、固定ページ・公開済みの記事・ほかの題材と重なっていない
 *   5. 見直し（リライト）が、理由のあるときだけ行われ、日付だけの更新にならない
 * 検査の規則（lib/blog-generator/validate.ts）や事実シートを変えたら、これと npm run blog:audit を実行する。
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPosts } from "@/lib/blog";
import { loadFactSheet, numericTokens, unknownNumericTokens } from "@/lib/blog-generator/facts";
import { ArticleSchema, bodyChanged, dayFraction, decideMode, pickRefreshTarget, pickTopic, refreshReasons, toDraft, toMarkdown, toRefreshedDraft } from "@/lib/blog-generator/generate";
import { diceBigram, shingleOverlap } from "@/lib/blog-generator/similarity";
import { getTopic, topics } from "@/lib/blog-generator/topics";
import { validateArticle } from "@/lib/blog-generator/validate";
import { getCluster } from "@/lib/blog-clusters";
import { publishedAreas } from "@/data/areas";
import { fixedKeywordOwners, normalizeKeyword } from "@/data/seo-keyword-map";
import { getService, servicePath } from "@/data/services";
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
  const emptyHead = validateArticle({ ...draft, body: `${draft.body}\n\n| | 追いだきなし | 追いだきあり |\n| --- | --- | --- |\n| 配管 | 給湯だけ | ふろ配管が加わる |\n` }, { sheet, existing, factSections: topic.facts });
  check("表の見出しの空のセルを見つける", emptyHead.errors.some((e) => e.includes("表の見出しの行")), emptyHead.errors.join(" / "));
  const namedHead = validateArticle({ ...draft, body: `${draft.body}\n\n| 比べる点 | 追いだきなし | 追いだきあり |\n| --- | --- | --- |\n| 配管 | 給湯だけ | ふろ配管が加わる |\n` }, { sheet, existing, factSections: topic.facts });
  check("見出しに名前のある表は通す", !namedHead.errors.some((e) => e.includes("表の見出しの行")), namedHead.errors.join(" / "));
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
    if (pillar.startsWith("/service/") && !t.services.some((x) => servicePath(x) === pillar)) problems.push(`親ページのサービスが services に無い：${t.slug} → ${pillar}`);
    // 主キーワード：固定ページが担当している検索語・公開済みのほかの記事の主キーワードと同じにしない
    const kw = normalizeKeyword(t.keyword);
    const owner = fixedKeywordOwners().get(kw);
    if (owner) problems.push(`主キーワードが固定ページ（${owner}）と同じ：${t.slug} → ${t.keyword}`);
    const taken = existing.find((e) => e.slug !== t.slug && normalizeKeyword(e.keywords[0]) === kw);
    if (taken) problems.push(`主キーワードが公開済みの記事（${taken.slug}）と同じ：${t.slug} → ${t.keyword}`);
    // 題材の指示に書いた数値が、その題材で使える節に無いと、書きようのない題材になる
    const unwritable = unknownNumericTokens([t.titleHint, ...t.angle].join("\n"), sheet, t.facts);
    if (unwritable.length) problems.push(`題材の指示の数値が、使える節に無い：${t.slug} → ${unwritable.join("、")}`);
    for (const w of t.works ?? []) if (!getWork(w)) problems.push(`施工事例が無い：${t.slug} → ${w}`);
    for (const a of t.areas ?? []) if (!publishedAreas.some((x) => x.slug === a)) problems.push(`地域ページが無い：${t.slug} → ${a}`);
  }
  for (let i = 0; i < topics.length; i++) {
    for (let j = i + 1; j < topics.length; j++) {
      if (diceBigram(topics[i].intent, topics[j].intent) >= 0.78) problems.push(`検索意図が近い：${topics[i].slug} と ${topics[j].slug}`);
      if (normalizeKeyword(topics[i].keyword) === normalizeKeyword(topics[j].keyword)) problems.push(`主キーワードが同じ：${topics[i].slug} と ${topics[j].slug}`);
    }
  }
  ok = problems.length === 0;
  check(`題材 ${topics.length} 件の定義に誤りが無い`, ok, problems.join(" / "));
  const first = pickTopic(existing);
  const second = pickTopic(existing);
  check("同じ状態なら、同じ題材を選ぶ（ランダムにしない）", first?.slug === second?.slug);
  check("すでに記事のある題材は選ばない", !!first && !existing.some((e) => e.slug === first.slug));
  const open = topics.filter((t) => !existing.some((e) => e.slug === t.slug));
  const best = open.some((t) => t.priority === "P0") ? "P0" : open.some((t) => t.priority === "P1") ? "P1" : "P2";
  check(`優先度の高い題材から選ぶ（いまは ${best}）`, !first || first.priority === best, first ? `${first.slug} は ${first.priority}` : "");
  // 同じ主キーワードの記事がすでにあると、その題材は選ばれない
  if (first) {
    const blocked = pickTopic([...existing, { ...existing[0], slug: "dummy", intent: "まったく別の検索意図のダミー", keywords: [first.keyword, "x"] }]);
    check("主キーワードが同じ記事があると、その題材は選ばない", blocked?.slug !== first.slug, blocked?.slug);
  }
  const remaining = topics.filter((t) => !existing.some((e) => e.slug === t.slug)).length;
  console.log(`      残りの題材：${remaining} 件／次に書く題材：${first?.slug ?? "なし"}`);
}

console.log("6. 見直し（リライト）");
{
  const fracs = Array.from({ length: 365 }, (_, i) => dayFraction(new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10)));
  check("日付から決まる値は、同じ日なら同じ", dayFraction("2026-10-07") === dayFraction("2026-10-07"));
  const share = fracs.filter((x) => x < 0.3).length / fracs.length;
  check("1年のうち、見直しの日は約3割（0.3 のとき）", share > 0.26 && share < 0.34, String(share));
  const prevMode = process.env.BLOG_MODE;
  delete process.env.BLOG_MODE;
  check("見直す理由のある記事が無ければ、新しい記事を書く", decideMode("2026-10-07", false, true) === "new");
  check("書ける題材が無ければ、見直しをする", decideMode("2026-10-07", true, false) === "refresh");
  if (prevMode) process.env.BLOG_MODE = prevMode;

  const base = existing.find((p) => p.sources.length > 0) ?? existing[0];
  const pillar = getCluster(base.category)!.pillar.href;
  // 親ページへのリンクを消した記事 → 見直す理由になる。リンクを戻すと解消される
  const noPillar = { ...base, body: base.body.split(`](${pillar})`).join("](/faq)") };
  const r1 = refreshReasons(noPillar, sheet).filter((r) => r.instruction.includes("親ページ"));
  check("親ページへのリンクが無い記事は、見直す理由になる", r1.length === 1);
  check("リンクを入れると、その理由は解消される", r1.length === 1 && r1[0].resolved({ ...base, body: base.body }) && !r1[0].resolved({ ...noPillar }));
  // 事実シートの節が、記事の更新日より後に確認し直された → 見直す理由になる
  const sec = sheet.sections.find((x) => base.sources.some((src) => x.sources.includes(src.url)));
  if (sec) {
    const old = { ...base, updatedAt: "2020-01-01", publishedAt: "2020-01-01" };
    const r2 = refreshReasons(old, sheet).filter((r) => r.instruction.includes("確認し直されています"));
    check("出典の節が確認し直された記事は、見直す理由になる", r2.length >= 1, sec.title);
    check("記事の更新日のほうが新しければ、理由にならない", refreshReasons({ ...base, updatedAt: "2099-01-01" }, sheet).every((r) => !r.instruction.includes("確認し直されています")));
  }
  check("同じ本文は「変わっていない」", !bodyChanged(base.body, base.body));
  check("空白だけの違いは「変わっていない」", !bodyChanged(base.body, base.body.replace(/\n\n/g, "\n\n\n")));
  check("文を足すと「変わった」", bodyChanged(base.body, `${base.body}\n\n横浜総合住設では、現地調査で設置場所と配管を確認したうえで、工事の内容をご説明しています。`));
  // 見直した記事は、公開日・slug・主キーワード・検索意図を引き継ぎ、更新日だけが今日になる
  const out = ArticleSchema.parse({ title: base.title, description: base.description, keywords: [...base.keywords].reverse(), body: base.body, faq: base.faq, relatedArticles: base.relatedArticles, sources: base.sources.map((x) => x.url) });
  const refreshed = toRefreshedDraft(out, base, sheet, "2030-01-02");
  check("見直しでは、公開日・slug・検索意図を変えない", refreshed.publishedAt === base.publishedAt && refreshed.slug === base.slug && refreshed.intent === base.intent);
  check("見直しでも、主キーワードは先頭のまま", refreshed.keywords[0] === base.keywords[0], refreshed.keywords.join(" / "));
  check("見直しの保存形式に、値の無い項目を書き出さない", !/: undefined|: null\n/.test(toMarkdown(refreshed)));
  const target = pickRefreshTarget(existing, sheet, "2030-01-01");
  console.log(`      いま見直す理由のある記事：${target ? `${target.post.slug}（${target.reasons.length} 件）` : "なし"}`);
}

console.log(failed ? `\n${failed} 件の確認に失敗しました` : "\nすべての確認に合格しました");
process.exit(failed ? 1 : 0);
