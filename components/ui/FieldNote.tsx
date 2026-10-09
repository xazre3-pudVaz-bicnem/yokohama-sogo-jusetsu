import type { ReactNode } from "react";
import { Illust } from "@/components/ui/Photo";
import type { ImageKey } from "@/lib/images";
import { reveal } from "@/lib/reveal";

/**
 * 現場の実務にもとづく補足を、スタッフのイラストと吹き出しで添える
 * （「施工前に確認すること」「お問い合わせの前にご用意いただくもの」など）。
 *
 * - ラベル（label）は、中身が分かる実務的な言葉にする。「スタッフからひとこと」のような、
 *   どのページでも同じになる題は付けない。
 * - イラストは装飾（alt は空）。吹き出しの中身が本文。
 * - イラストは、内容に合うポーズを選ぶ（ひらめき＝pose-idea、電卓＝pose-calc、電話＝pose-phone など）。
 */
export function FieldNote({
  label,
  children,
  className = "",
  pose = "illust/pose-idea",
  side = "left",
}: {
  label: string;
  children: ReactNode;
  className?: string;
  /** 添えるイラスト */
  pose?: ImageKey;
  /** イラストを置く側 */
  side?: "left" | "right";
}) {
  const right = side === "right";
  return (
    <aside aria-label={label} className={`flex items-end gap-3 sm:gap-5 ${right ? "flex-row-reverse" : ""} ${className}`} {...reveal(0, right ? "right" : "left")}>
      <Illust image={pose} width={112} className="h-auto w-[4.75rem] shrink-0 sm:w-28" />
      <div className={`bubble flex-1 px-4 py-3.5 sm:px-6 sm:py-4 ${right ? "bubble-r" : ""}`}>
        <p className="mb-1.5">
          <span className="inline-block rounded-full bg-brand-600 px-3 py-0.5 text-xs font-bold leading-[1.7] text-white">{label}</span>
        </p>
        <p className="text-[0.9375rem] leading-[1.9] text-ink">{children}</p>
      </div>
    </aside>
  );
}
