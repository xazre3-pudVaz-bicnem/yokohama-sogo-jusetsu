import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { img, type ImageKey } from "@/lib/images";

/**
 * 下層ページの冒頭。
 *
 * <PageHero>  … 文字だけ（一覧・案内のページ）。
 * <PhotoHero> … 文字と写真1枚（サービス・地域のページ）。
 *               layout="wide"（既定）は見出しの下に横長の写真、layout="side" は見出しの横に写真を置く。
 *
 * 冒頭に置くのは「区分・見出し（h1）・短い説明・写真」だけ。
 * 問い合わせのボタン・電話番号・バッジは置かない（まず内容を読んでもらうため。連絡先はヘッダーとページの最後にある）。
 * 見出しは最初の描画でそのまま見せる（登場アニメーションを付けない）。LCP を遅らせないため。
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs: Crumb[];
  /** ページ内の案内（区分へのリンクなど）。問い合わせのボタンは入れない */
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-silver-200 bg-white">
      <div className="container-x pb-10 pt-4 lg:pb-14 lg:pt-5">
        <Breadcrumbs items={crumbs} />
        <div className="mt-7 max-w-3xl lg:mt-11">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className={`h-page text-balance ${eyebrow ? "mt-2" : ""}`}>
            <Phrase>{title}</Phrase>
          </h1>
          {lead && <p className="lead mt-5 text-pretty">{lead}</p>}
        </div>
        {children}
      </div>
    </div>
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
  layout = "wide",
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
  /** 写真の説明（当社の現場の写真のときに書く） */
  caption?: string;
  /** 写真の置き方。wide＝見出しの下に横長で／side＝見出しの横に */
  layout?: "wide" | "side";
  /** 写真の見せる位置（object-position のクラス） */
  imageClassName?: string;
}) {
  if (layout === "side") {
    const portrait = img(image).height > img(image).width;
    return (
      <div className="border-b border-silver-200 bg-white">
        <div className="container-x pb-10 pt-4 lg:pb-14 lg:pt-5">
          <Breadcrumbs items={crumbs} />
          <div className="mt-7 grid gap-x-14 gap-y-8 lg:mt-10 lg:grid-cols-12 lg:items-center">
            <div className={portrait ? "lg:col-span-7" : "lg:col-span-6"}>
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              <h1 className={`h-page text-balance ${eyebrow ? "mt-2" : ""}`}>
                <Phrase>{title}</Phrase>
              </h1>
              {lead && <p className="mt-5 text-pretty text-[0.9688rem] leading-[2.05] lg:mt-6">{lead}</p>}
              {children}
            </div>
            <figure className={portrait ? "lg:col-span-5" : "lg:col-span-6"}>
              <div className={`relative w-full overflow-hidden bg-silver-100 ${portrait ? "aspect-[4/3] sm:aspect-[3/2] lg:aspect-[5/6]" : "aspect-[4/3]"}`}>
                <PhotoFill image={image} alt={imageAlt} sizes="(min-width: 1280px) 584px, (min-width: 1024px) 46vw, 100vw" priority className={imageClassName} />
                {credit && <p className="absolute bottom-0 right-0 bg-navy-950/70 px-2 py-1 text-[0.625rem] leading-none text-white">{credit}</p>}
              </div>
              {caption && <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">{caption}</figcaption>}
            </figure>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container-x pt-4 lg:pt-5">
        <Breadcrumbs items={crumbs} />
        <div className="mt-7 grid gap-x-12 gap-y-5 lg:mt-11 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className={`h-page text-balance ${eyebrow ? "mt-2" : ""}`}>
              <Phrase>{title}</Phrase>
            </h1>
          </div>
          {lead && <p className="text-pretty text-[0.9688rem] leading-[2.05] lg:col-span-5">{lead}</p>}
        </div>
        {children}
      </div>
      {/* 写真：スマホでは画面の端まで、PC では本文と同じ幅 */}
      <figure className="mx-auto mt-8 max-w-[78rem] lg:mt-12 lg:px-[clamp(1.25rem,4vw,2.5rem)]">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-silver-100 sm:aspect-[2/1] lg:aspect-[5/2]">
          <PhotoFill image={image} alt={imageAlt} sizes="(min-width: 1280px) 1168px, 100vw" priority className={imageClassName} />
          {credit && <p className="absolute bottom-0 right-0 bg-navy-950/70 px-2 py-1 text-[0.625rem] leading-none text-white">{credit}</p>}
        </div>
        {caption && <figcaption className="mt-2 px-[clamp(1.25rem,4vw,2.5rem)] text-xs leading-relaxed text-ink-mute lg:px-0">{caption}</figcaption>}
      </figure>
    </div>
  );
}
