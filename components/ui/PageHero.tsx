import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Illust, PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { img, type ImageKey } from "@/lib/images";

/**
 * 下層ページの冒頭。クリーム地にパンくず・ラベル・h1・短い説明、下の端は波形で白に切り替える。
 *
 * <PageHero>  … 右に人物のイラストを添える（一覧・案内のページ）。イラストは内容に合うものを選ぶ。
 * <PhotoHero> … 右に写真を角丸のカードで添える（サービス・地域のページ）。
 *
 * 冒頭に置くのは「ラベル・見出し（h1）・短い説明・写真かイラスト」だけ。
 * 問い合わせのボタン・電話番号・バッジは置かない（連絡先はヘッダーとページの最後にある）。
 * 見出しは最初の描画でそのまま見せる（登場アニメーションを付けない）。LCP を遅らせないため。
 */
function Wave() {
  return (
    <svg className="block h-6 w-full text-white sm:h-10" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 30c180 26 420 26 720 6s540-22 720 4v20H0z" />
    </svg>
  );
}

function Dots() {
  return (
    <>
      <span className="absolute right-[6%] top-10 hidden size-3 animate-twinkle rounded-full bg-sun-400 sm:block" aria-hidden="true" />
      <span className="absolute right-[34%] top-24 hidden size-2 animate-twinkle rounded-full bg-brand-400 [animation-delay:1.4s] lg:block" aria-hidden="true" />
    </>
  );
}

function Heading({ eyebrow, title, lead }: { eyebrow?: string; title: ReactNode; lead?: ReactNode }) {
  return (
    <>
      {eyebrow && (
        <p className="mb-5 flex">
          <span className="pill">{eyebrow}</span>
        </p>
      )}
      <h1 className="h-page text-balance">
        <Phrase>{title}</Phrase>
      </h1>
      {lead && <p className="mt-5 max-w-3xl text-pretty text-[0.9688rem] leading-[2] sm:text-base sm:leading-[2]">{lead}</p>}
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
  illust,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs: Crumb[];
  /** ページ内の案内（区分へのリンクなど）。問い合わせのボタンは入れない */
  children?: ReactNode;
  /** 右に添える人物のイラスト */
  illust?: ImageKey;
}) {
  return (
    <header className="relative overflow-hidden bg-cream">
      <Dots />
      <div className="container-x relative pb-10 pt-4 sm:pb-14 lg:pt-5">
        <Breadcrumbs items={crumbs} />
        <div className={`mt-5 sm:mt-8 ${illust ? "grid items-center gap-x-12 gap-y-6 lg:grid-cols-[1fr_15rem]" : ""}`}>
          <div className="max-w-3xl">
            <Heading eyebrow={eyebrow} title={title} lead={lead} />
          </div>
          {illust && (
            <div className="mx-auto w-36 animate-float-slow sm:w-44 lg:mx-0 lg:w-full">
              <Illust image={illust} width={240} className="mx-auto h-auto w-full" />
            </div>
          )}
        </div>
        {children}
      </div>
      <Wave />
    </header>
  );
}

export function PhotoHero({
  eyebrow,
  title,
  lead,
  crumbs,
  image,
  imageAlt,
  children,
  credit,
  caption,
  imageClassName = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs: Crumb[];
  image: ImageKey;
  imageAlt: string;
  /** 見出しの下に置く補足（対応範囲の注記など）。問い合わせのボタンは入れない */
  children?: ReactNode;
  /** 写真の出典（表示が必要な写真だけ） */
  credit?: ReactNode;
  /** 写真の説明（当社の現場の写真なら「当社施工」、イメージ写真なら「写真はイメージです」） */
  caption?: string;
  /** 写真の見せる位置（object-position のクラス） */
  imageClassName?: string;
}) {
  const portrait = img(image).height > img(image).width;
  return (
    <header className="relative overflow-hidden bg-cream">
      <Dots />
      <div className="container-x relative pb-10 pt-4 sm:pb-14 lg:pt-5">
        <Breadcrumbs items={crumbs} />
        <div className={`mt-5 grid items-center gap-x-12 gap-y-9 sm:mt-8 ${portrait ? "lg:grid-cols-[1fr_22rem]" : "lg:grid-cols-[1.05fr_1fr]"}`}>
          <div>
            <Heading eyebrow={eyebrow} title={title} lead={lead} />
            {children}
          </div>
          <figure className={portrait ? "mx-auto w-full max-w-sm lg:max-w-none" : ""}>
            <div className="photo-frame photo-frame-r">
              <div className={`photo-card relative border-[5px] border-white ${portrait ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                <PhotoFill image={image} alt={imageAlt} sizes={portrait ? "(min-width: 1024px) 352px, 384px" : "(min-width: 1280px) 540px, (min-width: 1024px) 46vw, 100vw"} priority className={imageClassName} />
                {credit && <p className="absolute bottom-0 right-0 rounded-tl-lg bg-navy-950/70 px-2 py-1 text-[0.625rem] leading-none text-white">{credit}</p>}
              </div>
            </div>
            {caption && <figcaption className="mt-3 text-xs leading-relaxed text-ink-mute">{caption}</figcaption>}
          </figure>
        </div>
      </div>
      <Wave />
    </header>
  );
}
