import type { CSSProperties } from "react";

/**
 * スクロールで現れるアニメーション用の属性を返す（サーバーコンポーネントからそのまま使える）。
 *   <div {...reveal()}>            … 下からふわっと
 *   <li {...reveal(120, "left")}>  … 120ms 遅らせて左から
 *
 * 実際に表示へ切り替えるのは components/layout/RevealObserver.tsx。
 * li や dt を div で包まずに済むよう、ラッパーコンポーネントではなく属性で付ける。
 *   up   … 下から（既定）      left / right … 横から      zoom … 少し拡大しながら
 *   fade … その場で            wipe … 写真が左から開く     pop  … 人物イラストが小さく跳ねる
 */
export type RevealKind = "up" | "left" | "right" | "zoom" | "fade" | "wipe" | "pop";

export function reveal(delayMs = 0, kind: RevealKind = "up"): { "data-reveal": string; style?: CSSProperties } {
  const attr = { "data-reveal": kind === "up" ? "" : kind };
  if (!delayMs) return attr;
  return { ...attr, style: { "--reveal-delay": `${delayMs}ms` } as CSSProperties };
}
