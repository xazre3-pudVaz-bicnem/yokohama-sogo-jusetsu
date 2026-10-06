import Image from "next/image";
import Link from "next/link";
import { img } from "@/lib/images";
import { siteConfig } from "@/lib/site";

/**
 * ロゴ。マーク（画像）＋社名（文字）で組む。
 * マークは背景ごとに画像を分けている（明るい背景：logo-mark ／ 濃い背景：logo-mark-dark）。
 * 社名を文字にしているのは、拡大しても崩れず、読み上げにも対応できるため。
 *
 * 幅 360px のスマホでも、右側のボタン（電話・メニュー）と並んで収まるように、
 * md サイズは画面幅に合わせて少し縮む（clamp）。大きさを変えるときは、幅 360px でのはみ出しを確かめること。
 */
export function Logo({ onDark = false, size = "md", priority = false }: { onDark?: boolean; size?: "md" | "lg"; priority?: boolean }) {
  const mark = img(onDark ? "brand/logo-mark-dark" : "brand/logo-mark");
  const h = size === "lg" ? 56 : 42;
  const w = Math.round((mark.width / mark.height) * h);
  const lg = size === "lg";
  return (
    <Link href="/" className={`group inline-flex min-w-0 items-center ${lg ? "gap-2.5" : "gap-2 xs:gap-2.5"}`}>
      <Image
        src={mark.src}
        width={w}
        height={h}
        alt=""
        sizes={`${w}px`}
        quality={75}
        // ヘッダーのロゴは最初から読み込む。ただし先読み（preload）はしない（ページの主役の写真と取り合わないように）
        loading={priority ? "eager" : "lazy"}
        className={`w-auto shrink-0 ${lg ? "h-11 xs:h-14" : "h-[2.125rem] xs:h-[2.625rem]"}`}
      />
      <span className="flex min-w-0 flex-col leading-none">
        <span className={`flex items-baseline gap-1 whitespace-nowrap font-bold tracking-[0.08em] xs:gap-1.5 ${onDark ? "text-white" : "text-navy-900"}`}>
          <span className={`${lg ? "text-[0.625rem] xs:text-xs" : "text-[0.5625rem] xs:text-[0.625rem]"} font-semibold tracking-[0.12em] opacity-80`}>株式会社</span>
          <span className={lg ? "text-[clamp(1.1875rem,5.3vw,1.5rem)]" : "text-[clamp(1.0625rem,4.6vw,1.3rem)]"}>{siteConfig.shortName}</span>
        </span>
        <span
          className={`mt-1.5 whitespace-nowrap font-[family-name:var(--font-display)] font-medium uppercase tracking-[0.12em] xs:tracking-[0.2em] ${lg ? "text-[clamp(0.4688rem,2.1vw,0.6875rem)]" : "text-[clamp(0.4063rem,1.8vw,0.5625rem)]"} ${onDark ? "text-silver-300" : "text-silver-600"}`}
        >
          Yokohama Total Housing Solutions
        </span>
      </span>
      {/* 読み上げ用。aria-label で上書きせず、見えている社名のあとに足す（見えている文字と読み上げをそろえるため） */}
      <span className="sr-only">（ホームへ）</span>
    </Link>
  );
}
