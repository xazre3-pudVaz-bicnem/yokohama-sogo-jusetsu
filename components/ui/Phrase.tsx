import { Fragment, type ReactNode } from "react";
import { loadDefaultJapaneseParser } from "budoux";

/**
 * 日本語の見出しを文節ごとに区切り、文節の途中では折り返さないようにする。
 *   「給湯器・エコキュートで、できること。」→「給湯器・」「エコキュートで、」「できる」「こと。」
 * 区切った1つずつを inline-block（.ib）にするので、折り返しは必ず文節の間で起きる。
 *
 * - 区切りは BudouX（文節を見分ける小さな辞書）で、サーバー側で行う。ブラウザに JS は送らない。
 *   このファイルを "use client" のコンポーネントから読み込まないこと（辞書がブラウザ側に入ってしまう）。
 * - 使うのは、見出しとカードの題名だけ。本文の段落には使わない。
 * - 文字列以外（すでに <span className="ib"> で区切ってある見出しなど）は、そのまま返す。
 */
const parser = loadDefaultJapaneseParser();

/**
 * 文節に分ける。
 * - 「・」と「──」の後ろでも区切る（BudouX はここで区切らないため）
 * - 数字や英字の途中（「昭和1｜4年」のような誤った区切り）、閉じ括弧・句読点の手前、開き括弧の後ろでは区切らない
 */
export function phrases(text: string): string[] {
  const chunks = parser
    .parse(text)
    .flatMap((chunk) => chunk.split(/(?<=・)|(?<=──\s)|(?<=[／/｜])/))
    .filter((c) => c !== "");

  // 途中で区切ってはいけない語の範囲（文字の位置）
  const keep: [number, number][] = [];
  for (const word of KEEP) {
    for (let at = text.indexOf(word); at !== -1; at = text.indexOf(word, at + 1)) keep.push([at, at + word.length]);
  }

  const out: string[] = [];
  let pos = 0; // いま見ている文節の、先頭の文字の位置
  for (const c of chunks) {
    const prev = out[out.length - 1];
    if (prev !== undefined) {
      const insideWord = /[0-9A-Za-z.,]$/.test(prev) && /^[0-9A-Za-z.,%]/.test(c);
      const badStart = /^[、。，．・）」』】〕？！ー〜％]/.test(c);
      const badEnd = /[（「『【〔]$/.test(prev);
      const insideKeep = keep.some(([from, to]) => from < pos && pos < to);
      if (insideWord || badStart || badEnd || insideKeep) {
        out[out.length - 1] = prev + c;
        pos += c.length;
        continue;
      }
    }
    out.push(c);
    pos += c.length;
  }
  return out;
}

/**
 * BudouX が途中で区切ってしまう語（住宅設備の用語が中心）。ここに挙げた語の途中では折り返さない。
 * 見出しを足したら npx tsx scripts/phrase-check.ts --show で区切りを確かめ、おかしな区切りがあれば足す。
 */
const KEEP = [
  "におい",
  "その他",
  "ひとまとめ",
  "見た目",
  "一体型",
  "立ち座り",
  "下塗り",
  "中塗り",
  "上塗り",
  "塗り替え",
  "切り替え",
  "張り替え",
  "取り替え",
  "入れ替え",
  "買い替え",
  "付け替え",
  "取り付け",
  "取り外し",
  "後付け",
  "追いだき",
  "お湯はり",
  "お湯切れ",
  "立ち消え",
  "組み合わせ",
  "お問い合わせ",
  "お見積もり",
  "見積もり",
  "お引き渡し",
  "仕上がり",
  "ひび割れ",
  "水まわり",
  "外まわり",
  "住まい",
  "はみ出",
];

export function Phrase({ children }: { children: ReactNode }) {
  if (typeof children !== "string") return <>{children}</>;
  const parts = phrases(children);
  if (parts.length <= 1) return <>{children}</>;
  return (
    <>
      {parts.map((part, i) => (
        // 空白は inline-block の外に出す（中の端にある空白は表示されないため）
        <Fragment key={i}>
          {/^\s/.test(part) ? " " : ""}
          <span className="ib">{part.trim()}</span>
          {/\s$/.test(part) ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}
