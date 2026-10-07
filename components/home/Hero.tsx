import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Illust, PhotoFill } from "@/components/ui/Photo";
import { siteConfig } from "@/lib/site";

/**
 * トップページの最初の画面。クリーム地に、左に見出し、右に写真のカードと家族のイラスト。
 *
 * - **ここには問い合わせのボタン・電話番号・バッジ・チェックの列を置かない**
 *   （連絡先はヘッダーにあり、ページの最後にも案内がある）。
 * - h1 は「地域と業種（吹き出し型のラベル）＋社名」。大きく見せるのは会社のことば
 *   「住まいのことなら、まとめてヨコジュウへ。」（依頼時に指定されたメインコピー。サイトの中ではここだけに置く）。
 * - 動きは「最初に1回だけ」の登場（文字は位置だけを動かす。透明から始めると、最初の描画が遅く数えられる）と、
 *   画面内にあるあいだだけ動く飾り（ゆれるイラスト・またたく点）。動き続けるものは置かない。
 * - 写真は、遠景の街並みを切り落としたもの（scripts/prepare-images.mjs を参照）。最初の画面に入るので先読みする。
 */
function Wave() {
  return (
    <svg className="block h-8 w-full text-white sm:h-14" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 42c200 34 440 34 720 8s520-30 720 2v28H0z" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <span className="absolute -left-24 -top-24 size-64 rounded-full bg-sun-100 sm:size-80" aria-hidden="true" />
      <span className="absolute right-[46%] top-[18%] hidden size-3 animate-twinkle rounded-full bg-brand-400 lg:block" aria-hidden="true" />
      <span className="absolute bottom-[22%] right-[4%] hidden size-4 animate-twinkle rounded-full bg-sun-400 [animation-delay:1.3s] lg:block" aria-hidden="true" />
      <span className="absolute right-[30%] top-[9%] hidden size-2 animate-twinkle rounded-full bg-sun-500 [animation-delay:0.6s] lg:block" aria-hidden="true" />

      <div className="container-x relative grid items-center gap-10 pb-9 pt-8 sm:pt-12 lg:grid-cols-[1.02fr_1fr] lg:gap-14 lg:pb-12 lg:pt-14">
        <div>
          <h1 className="enter-rise flex flex-wrap items-center gap-x-3.5 gap-y-3">
            <span className="pill !text-[0.875rem] xs:!text-[0.9375rem]">
              {siteConfig.primaryArea.city}
              {siteConfig.primaryArea.ward}の住宅設備・リフォーム
            </span>
            <span className="text-[0.875rem] font-bold tracking-[0.08em] text-navy-900">{siteConfig.name}</span>
          </h1>

          <p className="enter-rise mt-7 font-heading text-[7.2vw] font-black leading-[1.42] tracking-[0.02em] text-navy-900 [--enter-delay:90ms] sm:text-[2.625rem] lg:text-[2.25rem] xl:text-[2.75rem]">
            住まいのことなら、
            <br />
            <span className="marker marker-draw">まとめてヨコジュウ</span>へ。
          </p>

          <p className="enter-rise mt-6 max-w-xl text-[0.9688rem] leading-[2.05] [--enter-delay:180ms] sm:text-[1.0313rem]">
            給湯器・エアコン・トイレ・太陽光・蓄電池・外壁塗装・リフォーム・解体・造園まで。
            <span className="ib">横浜市戸塚区を中心に、</span>
            <span className="ib">住まいの工事をワンストップで対応します。</span>
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl pb-10 lg:max-w-none">
          <span className="absolute -right-3 -top-3 h-[calc(100%-2.5rem)] w-full rounded-[2.5rem] bg-brand-200" aria-hidden="true" />
          <div className="enter-slide relative aspect-[16/11] overflow-hidden rounded-[2.5rem] border-[6px] border-white bg-silver-100 shadow-pop">
            <PhotoFill image="photos/hero-house" alt="植栽に囲まれた2階建ての住宅の外観" sizes="(min-width: 1280px) 560px, (min-width: 1024px) 46vw, 100vw" priority className="object-[50%_45%]" />
          </div>
          <div className="enter-pop absolute -left-1 bottom-0 w-36 [--enter-delay:500ms] sm:w-48">
            <div className="animate-float-slow rounded-3xl bg-white p-2 shadow-pop">
              <Illust image="illust/people-family" width={192} className="h-auto w-full" />
            </div>
          </div>
          <p className="enter-pop absolute bottom-[4.25rem] left-36 origin-left rounded-2xl bg-white px-3.5 py-2 font-heading text-xs font-bold leading-[1.55] text-navy-900 shadow-card [--enter-delay:850ms] sm:bottom-24 sm:left-52 sm:text-sm" aria-hidden="true">
            給湯器もエアコンも、
            <br />
            まとめて相談できる？
            <span className="absolute -left-1.5 top-1/2 size-3 -translate-y-1/2 rotate-45 bg-white" />
          </p>
        </div>
      </div>
      <Wave />
    </section>
  );
}

/**
 * ヒーローのすぐ下に置く、はじめての方への案内（問い合わせではなく、進め方のページへ送る）。
 */
export function FirstNote() {
  return (
    <div className="bg-white">
      <div className="container-x pb-2 pt-6 sm:pt-8">
        <div className="mx-auto flex max-w-3xl items-center gap-4 rounded-3xl border-2 border-dashed border-sun-300 bg-cream/60 px-4 py-3.5 sm:gap-5 sm:px-7 sm:py-4">
          <Illust image="illust/pose-idea" width={64} className="h-auto w-12 shrink-0 animate-wiggle sm:w-14" />
          <p className="flex-1 text-sm leading-[1.8]">
            <strong className="font-heading text-navy-900">はじめてご相談の方へ。</strong>
            <span className="ib">お見積もりと現地調査は無料です。</span>
            <span className="ib">ご相談から工事の完了までの進め方をまとめています。</span>
          </p>
          <Link href="/flow" className="link-arrow hidden shrink-0 !text-sm sm:inline-flex">
            工事の流れ
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
