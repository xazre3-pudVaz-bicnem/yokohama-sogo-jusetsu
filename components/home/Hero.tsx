import { getImageProps } from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Illust } from "@/components/ui/Photo";
import { img } from "@/lib/images";
import { siteConfig } from "@/lib/site";

/**
 * トップページの最初の画面。写真を一面の背景に敷き、その上に白い角丸のパネルで見出しを載せる。
 *
 * - **ここには問い合わせのボタン・電話番号・バッジ・チェックの列を置かない**
 *   （連絡先はヘッダーにあり、ページの最後にも案内がある）。
 * - h1 は「地域と業種（吹き出し型のラベル）＋社名」。大きく見せるのは会社のことば
 *   「住まいのことなら、まとめてヨコジュウへ。」（依頼時に指定されたメインコピー。サイトの中ではここだけに置く）。
 * - 文字は写真に直接載せず、白いパネルに入れる（写真の明るさに関係なく読めるように）。
 * - 写真は、PC は横長の1枚、スマホは建物が写る範囲だけを切り出した1枚を、<picture> で出し分ける
 *   （縦長の画面に横長の写真を敷くと、大きく引き伸ばされてぼやけるため）。読み込まれるのは片方だけ。
 *   最初の画面に入るので、それぞれ画面幅の条件つきで先読みする。
 *   遠景の街並みは、かすみに置き換えてある（scripts/prepare-images.mjs を参照）。
 * - 動きは「最初に1回だけ」の登場と、画面内にあるあいだだけ動く飾り（ゆれるイラスト）。動き続けるものは置かない。
 */
function Wave() {
  return (
    <svg className="absolute inset-x-0 bottom-[-1px] block h-7 w-full text-white sm:h-12" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 42c200 34 440 34 720 8s520-30 720 2v28H0z" />
    </svg>
  );
}

/** 画面の幅がこれ未満なら、スマホ用の写真を使う */
const TALL_MEDIA = "(max-width: 767px)";
const WIDE_MEDIA = "(min-width: 768px)";
/** スマホでは、写真は高さに合わせて拡大される（幅は画面より広くなる）。その表示幅 */
const TALL_SIZES = "680px";
const WIDE_SIZES = "(max-width: 1100px) 1100px, 100vw";

function HeroPhoto() {
  const wide = img("photos/hero-wide");
  const tall = img("photos/hero-tall");
  const alt = "植栽に囲まれた2階建ての住宅の外観";
  const w = getImageProps({ src: wide.src, width: wide.width, height: wide.height, alt, sizes: WIDE_SIZES, quality: 60 }).props;
  const t = getImageProps({ src: tall.src, width: tall.width, height: tall.height, alt, sizes: TALL_SIZES, quality: 60 }).props;
  return (
    <>
      <link rel="preload" as="image" imageSrcSet={t.srcSet} imageSizes={TALL_SIZES} media={TALL_MEDIA} fetchPriority="high" />
      <link rel="preload" as="image" imageSrcSet={w.srcSet} imageSizes={WIDE_SIZES} media={WIDE_MEDIA} fetchPriority="high" />
      <picture>
        <source media={TALL_MEDIA} srcSet={t.srcSet} sizes={TALL_SIZES} />
        <source media={WIDE_MEDIA} srcSet={w.srcSet} sizes={WIDE_SIZES} />
        <img src={w.src} alt={alt} width={wide.width} height={wide.height} fetchPriority="high" loading="eager" decoding="async" className="absolute inset-0 size-full object-cover object-[58%_50%] md:object-[66%_46%] lg:object-[50%_44%]" />
      </picture>
    </>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-silver-200">
      <div className="absolute inset-0 -z-10">
        <HeroPhoto />
      </div>

      <div className="container-x relative flex items-end pb-14 pt-40 sm:pb-20 sm:pt-56 lg:min-h-[36rem] lg:items-center lg:pb-24 lg:pt-16">
        <div className="enter-rise card-pop relative w-full max-w-[34rem] px-5 pb-7 pt-7 sm:px-9 sm:pb-9 sm:pt-9">
          <h1 className="flex flex-wrap items-center gap-x-3.5 gap-y-3">
            <span className="pill !text-[0.8125rem] xs:!text-[0.875rem] sm:!text-[0.9375rem]">
              {siteConfig.primaryArea.city}
              {siteConfig.primaryArea.ward}の住宅設備・リフォーム
            </span>
            <span className="text-[0.875rem] font-bold tracking-[0.08em] text-navy-900">{siteConfig.name}</span>
          </h1>

          <p className="mt-6 font-heading text-[6.6vw] font-black leading-[1.42] tracking-[0.02em] text-navy-900 sm:text-[2.375rem] lg:text-[2.25rem] xl:text-[2.5rem]">
            住まいのことなら、
            <br />
            <span className="marker marker-draw">まとめてヨコジュウ</span>へ。
          </p>

          <p className="mt-5 text-[0.9375rem] leading-[2] sm:text-[0.9688rem]">
            給湯器・エアコン・トイレ・太陽光・蓄電池・外壁塗装・リフォーム・解体・造園まで。
            <span className="ib">横浜市戸塚区を中心に、</span>
            <span className="ib">住まいの工事をワンストップで対応します。</span>
          </p>

          {/* スマホ：パネルの右上に、家族のイラストを小さく重ねる */}
          <div className="enter-pop absolute -top-[4.25rem] right-3 w-[5.75rem] rounded-2xl bg-white p-1.5 shadow-pop [--enter-delay:500ms] sm:-top-20 sm:w-28 lg:hidden">
            <Illust image="illust/people-family" width={112} className="h-auto w-full" />
          </div>
        </div>

        {/* PC：写真の右下に、家族のイラストと吹き出し */}
        <div className="pointer-events-none absolute bottom-16 right-[clamp(1.25rem,5vw,4.5rem)] hidden items-end gap-3 lg:flex">
          <p className="enter-pop relative mb-10 origin-right rounded-2xl bg-white px-4 py-2.5 font-heading text-sm font-bold leading-[1.55] text-navy-900 shadow-pop [--enter-delay:850ms]" aria-hidden="true">
            給湯器もエアコンも、
            <br />
            まとめて相談できる？
            <span className="absolute -right-1.5 top-1/2 size-3 -translate-y-1/2 rotate-45 bg-white" />
          </p>
          <div className="enter-pop w-44 [--enter-delay:500ms]">
            <div className="animate-float-slow rounded-3xl bg-white p-2 shadow-pop">
              <Illust image="illust/people-family" width={176} className="h-auto w-full" />
            </div>
          </div>
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
