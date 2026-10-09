"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { LineIcon } from "@/components/ui/LineIcon";

/**
 * スマホ下部の固定ボタン（電話・LINE・無料見積もり）。1024px 未満でだけ表示する。
 * - LINE の設定があるときは3つ並べる。幅 360px でも1行に収まるよう、文字を短くする（読み上げ用の名前は aria-label に書く）。
 * - ページの冒頭では出さない（まず内容を読んでもらう）。ある程度スクロールしてから出す。
 * - ページ末尾の問い合わせ案内（data-cta-zone）が見えているときは隠す（同じ案内が二重に並ばないように）。
 * - お問い合わせページでは出さない（フォームの送信ボタンと重なるため）。
 * 表示の切り替えは data 属性で行い、React の再描画を起こさない。
 */
export function MobileCtaBar({ phone, telHref, line }: { phone: string; telHref: string; line: string }) {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const hidden = pathname === "/contact";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const zone = document.querySelector<HTMLElement>("[data-cta-zone]");
      const inZone = zone ? zone.getBoundingClientRect().top < window.innerHeight - 64 : false;
      const show = window.scrollY > 520 && !inZone;
      el.dataset.show = show ? "1" : "0";
      el.inert = !show;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (hidden) return null;

  return (
    <aside
      ref={ref}
      aria-label="ご相談・お見積もり"
      data-show="0"
      className="no-print fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-silver-300 bg-white px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 transition-transform duration-300 data-[show='1']:translate-y-0 lg:hidden"
    >
      <div className="mx-auto flex max-w-lg gap-2">
        {phone && (
          <a href={telHref} className={`btn btn-outline btn-sm min-h-12 !px-2 ${line ? "flex-[0.9]" : "flex-1"}`} data-cv="tel" aria-label={`電話で相談する（${phone}）`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-[1.125rem] shrink-0" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{line ? "電話" : "電話で相談"}</span>
          </a>
        )}
        {line && (
          <a href={line} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm min-h-12 flex-[0.9] !px-2" data-cv="line" aria-label="LINE で相談する">
            <LineIcon className="size-5" />
            <span>LINE</span>
          </a>
        )}
        <Link href="/contact" className={`btn btn-primary btn-sm min-h-12 !px-2 ${line ? "flex-[1.3]" : "flex-1"}`}>
          <span>無料見積もり</span>
        </Link>
      </div>
    </aside>
  );
}
