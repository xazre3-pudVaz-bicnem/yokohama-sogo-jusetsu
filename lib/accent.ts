import type { Accent } from "@/data/services/types";

/**
 * サービスごとの差し色のクラス。
 * Tailwind はクラス名を文字列として検出するので、組み立てずに完成形を書いておく。
 * 差し色は小さな面積（帯・アイコンの地・ラベル）にだけ使い、全体は濃紺と青でまとめる。
 */
export const ACCENT_BG: Record<Accent, string> = {
  brand: "bg-brand-600",
  heat: "bg-heat",
  leaf: "bg-leaf",
  sun: "bg-sun",
  rose: "bg-rose",
  violet: "bg-violet",
  aqua: "bg-aqua",
};

export const ACCENT_TEXT: Record<Accent, string> = {
  brand: "text-brand-700",
  heat: "text-heat",
  leaf: "text-leaf",
  sun: "text-sun",
  rose: "text-rose",
  violet: "text-violet",
  aqua: "text-aqua",
};

export const ACCENT_SOFT: Record<Accent, string> = {
  brand: "bg-brand-50 text-brand-700",
  heat: "bg-heat/10 text-heat",
  leaf: "bg-leaf/10 text-leaf",
  sun: "bg-sun/10 text-sun",
  rose: "bg-rose/10 text-rose",
  violet: "bg-violet/10 text-violet",
  aqua: "bg-aqua/10 text-aqua",
};
