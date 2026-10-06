/**
 * 記事どうしの重複を見つけるための、文字列の近さの計算。
 *
 * - タイトル・検索意図 … 2文字の組（bigram）の重なり（Dice 係数）。短い文の比較に向く
 * - 本文 … 8文字の並び（シングル）の重なり率。日本語の長文では、2文字の組だと別の記事でも
 *   半分近くが重なってしまい区別できない。8文字にすると、同じ言い回しを使い回したときだけ値が上がる
 */
function clean(s: string): string {
  return s
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[\s　#>*_`|・、。「」（）()！？!?：:／/\-ー〜～]/g, "")
    .toLowerCase();
}

function grams(s: string, n: number): Set<string> {
  const t = clean(s);
  const out = new Set<string>();
  for (let i = 0; i + n <= t.length; i++) out.add(t.slice(i, i + n));
  return out;
}

/** 2文字の組の Dice 係数（0〜1）。タイトルや検索意図の比較に使う */
export function diceBigram(a: string, b: string): number {
  const A = grams(a, 2);
  const B = grams(b, 2);
  if (!A.size || !B.size) return 0;
  let hit = 0;
  for (const g of A) if (B.has(g)) hit += 1;
  return (2 * hit) / (A.size + B.size);
}

/** a の8文字の並びのうち、b にも出てくるものの割合（0〜1）。本文の比較に使う */
export function shingleOverlap(a: string, b: string, n = 8): number {
  const A = grams(a, n);
  const B = grams(b, n);
  if (!A.size || !B.size) return 0;
  let hit = 0;
  for (const g of A) if (B.has(g)) hit += 1;
  return hit / A.size;
}
