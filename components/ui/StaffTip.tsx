import type { ReactNode } from "react";
import { Illust } from "@/components/ui/Photo";
import type { ImageKey } from "@/lib/images";
import { reveal } from "@/lib/reveal";

/**
 * 「スタッフからひとこと」。人物イラストと吹き出しで、ページの要点や実務の助言を添える。
 * 1ページに1〜2か所まで。本文の言い換えではなく、現場で役に立つ具体的な一言を書く。
 */
export function StaffTip({ pose, children, title = "スタッフからひとこと", className = "" }: { pose: ImageKey; children: ReactNode; title?: string; className?: string }) {
  return (
    <aside className={`flex items-end gap-3 sm:gap-5 ${className}`} aria-label={title}>
      <div className="w-[5.25rem] shrink-0 sm:w-28" {...reveal(0, "pop")}>
        <Illust image={pose} width={112} className="h-auto w-full" />
      </div>
      <div className="bubble bubble-left mb-3 flex-1 sm:mb-5" {...reveal(120, "left")}>
        <p className="text-xs font-bold tracking-widest text-brand-700">{title}</p>
        <p className="mt-1.5 text-[0.9688rem] font-medium leading-[1.85] text-ink-body">{children}</p>
      </div>
    </aside>
  );
}
