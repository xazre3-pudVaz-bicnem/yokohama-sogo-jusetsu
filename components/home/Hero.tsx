import { getImageProps } from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Illust } from "@/components/ui/Photo";
import { img } from "@/lib/images";
import { siteConfig } from "@/lib/site";

/**
 * トップページの最初の画面。写真を一面の背景に敷き、文字を写真の上に直接載せる。
 *
 * - **白いパネルと人物のイラスト・吹き出しは置かない**（2026-10-07 に依頼者が指定）。
 *   文字の後ろだけ、写真を淡くぼかす膜（.hero-veil）を敷いて読めるようにする。スマホは下から、PC は左から。
 * - **ここには問い合わせのボタン・電話番号・バッジ・チェックの列を置かない**
 *   （連絡先はヘッダーにあり、ページの最後にも案内がある）。
 * - h1 は「地域と業種（吹き出し型のラベル）＋社名」。大きく見せるのは会社のことば
 *   「住まいのことなら、まとめてヨコジュウへ。」（依頼時に指定されたメインコピー。サイトの中ではここだけに置く）。
 * - 写真は、PC は横長の1枚、スマホは建物が写る範囲だけを切り出した1枚を、<picture> で出し分ける
 *   （縦長の画面に横長の写真を敷くと、大きく引き伸ばされてぼやけるため）。読み込まれるのは片方だけ。
 *   最初の画面に入るので、それぞれ画面幅の条件つきで先読みする。
 *   遠景の街並みは、かすみに置き換えてある（scripts/prepare-images.mjs を参照）。
 * - 生成したイメージ写真なので、隅に「写真はイメージです」と添える。
 * - 動きは、文字が「最初に1回だけ」下から現れるものと、蛍光ペンが引かれるものだけ。
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

/** 説明文の1文目。工事の名前の途中で折り返さないように、「・」の後ろでだけ区切る */
const LEAD_WORKS = "給湯器・エアコン・トイレ・太陽光・蓄電池・外壁塗装・リフォーム・解体・造園まで。".split(/(?<=・)/);

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-silver-200">
      <div className="absolute inset-0 -z-10">
        <HeroPhoto />
      </div>

      <div className="container-x relative flex items-end pb-16 pt-52 sm:pb-24 sm:pt-64 lg:min-h-[36rem] lg:items-center lg:pb-24 lg:pt-16">
        <div className="relative w-full max-w-[36rem]">
          <div className="hero-veil" aria-hidden="true" />
          <div className="enter-rise">
            <h1 className="flex flex-wrap items-center gap-x-3.5 gap-y-3">
              <span className="pill !text-[0.8125rem] xs:!text-[0.875rem] sm:!text-[0.9375rem]">
                {siteConfig.primaryArea.city}
                {siteConfig.primaryArea.ward}の住宅設備・リフォーム
              </span>
              <span className="text-[0.875rem] font-bold tracking-[0.08em] text-navy-900">{siteConfig.name}</span>
            </h1>

            <p className="mt-6 font-heading text-[min(7.2vw,2.625rem)] font-black leading-[1.42] tracking-[0.02em] text-navy-900 sm:text-[2.625rem] lg:text-[2.75rem] xl:text-[3rem]">
              住まいのことなら、
              <br />
              <span className="marker marker-draw">まとめてヨコジュウ</span>へ。
            </p>

            <p className="mt-5 max-w-[31rem] text-[0.9375rem] font-medium leading-[2] text-ink sm:text-base">
              {LEAD_WORKS.map((s) => (
                <span key={s} className="ib">
                  {s}
                </span>
              ))}
              <span className="ib">横浜市戸塚区を中心に、</span>
              {/* 幅の狭いスマホでは1行に入りきらないので、「住まいの工事を」の後ろでも折り返せるようにする */}
              <span className="xs:inline-block xs:max-w-full">
                <span className="ib">住まいの工事を</span>
                <span className="ib">ワンストップで対応します。</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 生成したイメージ写真なので、注記を添える。スマホ・タブレットは膜の上（濃いグレーの字）、PC は写真の上（濃紺の地に白い字） */}
      <p className="absolute bottom-8 right-4 text-[0.6875rem] leading-none text-ink-body sm:bottom-14 sm:right-6 lg:bottom-16 lg:right-5 lg:rounded-full lg:bg-navy-950/70 lg:px-2.5 lg:py-1.5 lg:text-xs lg:leading-none lg:text-white">
        写真はイメージです
      </p>
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
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-3xl border-2 border-dashed border-sun-300 bg-cream/60 px-3.5 py-3.5 sm:gap-5 sm:px-7 sm:py-4">
          <Illust image="illust/pose-idea" width={64} className="h-auto w-12 shrink-0 animate-wiggle sm:w-14" />
          {/* 1文ずつまとめて折り返す。1行に入りきらない幅では、文の中の区切りで折り返す（文末の2文字だけが次の行に落ちないように） */}
          <p className="flex-1 text-sm leading-[1.8]">
            <strong className="font-heading text-navy-900">はじめてご相談の方へ。</strong>
            <span className="ib">
              <span className="ib">お見積もりと現地調査は</span>
              <span className="ib">無料です。</span>
            </span>
            <span className="ib">
              <span className="ib">ご相談から</span>
              <span className="ib">工事の完了までの</span>
              <span className="ib">進め方を</span>
              <span className="ib">まとめています。</span>
            </span>
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
