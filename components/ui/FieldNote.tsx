import type { ReactNode } from "react";

/**
 * 現場の実務にもとづく補足（「施工前に確認すること」「お問い合わせの前にご用意いただくもの」など）。
 *
 * 人物のイラストや吹き出しは付けない。実名の担当者の言葉ではないので、「スタッフのひとこと」という見せ方はしない。
 * 見出し（label）は、内容が分かる実務的な言葉にする。
 */
export function FieldNote({ label, children, onDark = false, className = "" }: { label: string; children: ReactNode; onDark?: boolean; className?: string }) {
  return (
    <aside className={`border-l-2 py-1 pl-5 ${onDark ? "border-white/60" : "border-navy-900"} ${className}`}>
      <p className={`text-[0.8125rem] font-bold tracking-wider ${onDark ? "text-white" : "text-ink"}`}>{label}</p>
      <p className={`mt-2 text-[0.9375rem] leading-[1.95] ${onDark ? "text-silver-200" : ""}`}>{children}</p>
    </aside>
  );
}
