/**
 * 見出しの文節区切り（components/ui/Phrase.tsx）が、数字や語の途中で切れていないかを確かめる。
 *   npx tsx scripts/phrase-check.ts
 *
 * サイトで実際に使っている見出し（サービス名・事例の題名・記事の題名・よくある質問・地域の数値）をすべて通し、
 * 「数字と数字の間」「英字の途中」「句読点・閉じ括弧の手前」で区切られているものがあれば表示する。
 * 見出しの文言を大きく足したとき・BudouX を更新したときに実行する。
 */
import { phrases } from "@/components/ui/Phrase";
import { publishedAreas } from "@/data/areas";
import { allFaqs } from "@/data/faq";
import { services } from "@/data/services";
import { works } from "@/data/works";
import { getAllPosts } from "@/lib/blog";

const texts = new Set<string>();
for (const s of services) {
  [s.name, s.shortName, s.h1, s.local.heading, ...s.worries, ...s.menu.map((m) => m.title), ...s.guides.flatMap((g) => [g.heading, ...g.items.map((i) => i.title)]), ...s.cost.factors.map((f) => f.title), ...s.faqs.map((f) => f.q)].forEach((t) => texts.add(t));
}
for (const w of works) [w.title, ...w.points.map((p) => p.title)].forEach((t) => texts.add(t));
for (const a of publishedAreas) [a.h1, ...a.facts.map((f) => f.value), ...a.sections.flatMap((sec) => [sec.heading, ...(sec.items ?? []).map((i) => i.title)]), ...a.serviceNotes.map((n) => n.title), ...a.faqs.map((f) => f.q)].forEach((t) => texts.add(t));
for (const f of allFaqs) texts.add(f.q);
for (const p of getAllPosts()) [p.title, ...p.headings.map((h) => h.text)].forEach((t) => texts.add(t));

let bad = 0;
for (const t of texts) {
  if (!t) continue;
  const parts = phrases(t);
  if (parts.join("") !== t) {
    bad += 1;
    console.log(`× 文字が変わっています：${t} → ${parts.join("")}`);
    continue;
  }
  for (let i = 1; i < parts.length; i++) {
    const prev = parts[i - 1];
    const cur = parts[i];
    if ((/[0-9A-Za-z]$/.test(prev) && /^[0-9A-Za-z]/.test(cur)) || /^[、。）」』？！ー]/.test(cur) || /[（「『]$/.test(prev)) {
      bad += 1;
      console.log(`× ${parts.join(" | ")}`);
      break;
    }
  }
}
console.log(`${texts.size} 件の見出しを確認。おかしな区切り：${bad} 件`);
if (process.argv.includes("--show")) for (const t of [...texts].slice(0, 400)) console.log(phrases(t).join(" | "));
process.exit(bad ? 1 : 0);
