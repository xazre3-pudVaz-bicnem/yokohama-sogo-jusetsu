/**
 * 公開済みのコラム（content/blog/*.md）を、自動生成のときと同じ検査（lib/blog-generator/validate.ts）にかける。
 *   npm run blog:audit
 *
 * - 手書きの記事も、自動生成の記事も、同じ基準で確かめる。
 * - 1件でも不合格があれば、終了コード 1 で終わる（GitHub Actions は、この点検に通らないと push しない）。
 * - 検査の規則を変えたら、まずこれを実行して、良い記事が誤って落ちないかを確かめること。
 */
import { getAllPosts } from "@/lib/blog";
import { loadFactSheet } from "@/lib/blog-generator/facts";
import { getTopic } from "@/lib/blog-generator/topics";
import { validateArticle } from "@/lib/blog-generator/validate";

const sheet = loadFactSheet();
const posts = getAllPosts();
let failed = 0;

console.log(`事実シート：${sheet.sections.length}節・数値 ${sheet.tokens.size}種・出典 ${sheet.sourceUrls.size}件`);
console.log(`記事：${posts.length}本\n`);

for (const post of posts) {
  const { cluster: _cluster, length: _length, headings: _headings, ...draft } = post;
  void _cluster;
  void _length;
  void _headings;
  // 自動生成の記事は、生成のときと同じく、題材で決めた節の数値だけを通す
  const factSections = post.generated ? getTopic(post.slug)?.facts : undefined;
  const result = validateArticle(draft, { sheet, existing: posts.filter((p) => p.slug !== post.slug), factSections });
  const mark = result.ok ? "合格" : "不合格";
  console.log(`${mark}  ${post.slug}（${result.length}字・${post.generated ? "自動" : "手書き"}）`);
  for (const e of result.errors) console.log(`    × ${e}`);
  for (const w of result.warnings) console.log(`    △ ${w}`);
  if (!result.ok) failed += 1;
}

console.log(`\n${posts.length - failed}本が合格、${failed}本が不合格`);
process.exit(failed ? 1 : 0);
