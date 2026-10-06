import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import type { ImageKey } from "@/lib/images";

/**
 * 下層ページの冒頭。
 *
 * <PageHero>  … 文字だけ。濃紺の地に、ロゴの平行四辺形と同じ傾きの面を重ねる。
 * <PhotoHero> … 左に文字、右に写真（写真の左辺を斜めに切る）。サービス・地域のページで使う。
 *
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
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-navy-900 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-blueprint absolute inset-0" />
        <div className="absolute -right-[8%] top-0 h-full w-[46%] -skew-x-[24deg] bg-gradient-to-b from-brand-600/35 to-brand-600/0" />
        <div className="absolute right-[18%] top-0 h-full w-[7%] -skew-x-[24deg] bg-gradient-to-b from-sky-400/25 to-sky-400/0" />
      </div>
      <div className="container-x relative pb-12 pt-6 sm:pb-16 lg:pb-20 lg:pt-8">
        <Breadcrumbs items={crumbs} onDark />
        <div className="mt-8 max-w-3xl lg:mt-12">
          {eyebrow && <p className="eyebrow eyebrow-on-dark">{eyebrow}</p>}
          <h1 className={`h-page text-balance !text-white ${eyebrow ? "mt-3" : ""}`}>
            <Phrase>{title}</Phrase>
          </h1>
          {lead && <p className="lead mt-5 text-pretty text-silver-200">{lead}</p>}
          {children}
        </div>
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
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs: Crumb[];
  image: ImageKey;
  imageAlt: string;
  children?: ReactNode;
  /** 写真の出典（表示が必要な写真だけ） */
  credit?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-navy-900 text-white">
      <div aria-hidden="true" className="bg-blueprint pointer-events-none absolute inset-0" />
      <div className="relative lg:grid lg:min-h-[30rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* 写真：スマホでは上、PC では右 */}
        <div className="relative aspect-[16/10] w-full lg:order-2 lg:aspect-auto lg:h-full">
          <div className="absolute inset-0 lg:[clip-path:polygon(13%_0,100%_0,100%_100%,0_100%)]">
            <PhotoFill image={image} alt={imageAlt} sizes="(min-width: 1024px) 50vw, 100vw" priority />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-900/45 via-transparent to-transparent lg:bg-gradient-to-r lg:from-navy-900/35" />
          </div>
          {/* 写真の左辺に沿う青い線（PC） */}
          <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block">
            <line x1="13" y1="0" x2="0" y2="100" stroke="var(--color-sky-400)" strokeWidth="5" vectorEffect="non-scaling-stroke" />
          </svg>
          {credit && <p className="absolute bottom-1.5 right-2 text-[0.625rem] leading-none text-white/80 [text-shadow:0_1px_2px_rgb(0_0_0/0.7)]">{credit}</p>}
        </div>

        <div className="lg:order-1">
          <div className="mx-auto w-full max-w-[39rem] px-[clamp(1.25rem,4vw,2.5rem)] pb-12 pt-6 lg:ml-auto lg:mr-0 lg:pb-16 lg:pt-8">
            <Breadcrumbs items={crumbs} onDark />
            <div className="mt-7 lg:mt-10">
              {eyebrow && <p className="eyebrow eyebrow-on-dark">{eyebrow}</p>}
              <h1 className={`h-page text-balance !text-white ${eyebrow ? "mt-3" : ""}`}>
            <Phrase>{title}</Phrase>
          </h1>
              {lead && <p className="mt-5 text-pretty text-[0.9688rem] leading-[2] text-silver-200">{lead}</p>}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
