import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import type { Work } from "@/data/works";

/**
 * 施工事例へのリンク。写真はすべて実際の現場の写真。
 * 白い角丸のパネルに、写真・区分のラベル・題名・概要を入れる。
 * 施工地域・メーカーは、データに値があるときだけ出す。
 */
export function WorkCard({
  work,
  sizes,
  headingLevel: H = "h3",
  priority = false,
  aspect = "aspect-[4/3]",
}: {
  work: Work;
  sizes: string;
  headingLevel?: "h2" | "h3";
  priority?: boolean;
  /** 写真の縦横比（大きく見せる1枚目だけ変える、など） */
  aspect?: string;
}) {
  const maker = work.products.find((p) => p.maker)?.maker;
  const meta = [work.area?.label, maker].filter(Boolean).join("　／　");
  return (
    <Link href={`/works/${work.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className={`zoom-wrap relative ${aspect} bg-silver-100`}>
        <PhotoFill image={work.cover.key} alt={work.cover.alt} sizes={sizes} className="zoom-img" priority={priority} />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="tag tag-blue">{work.category}</span>
          {meta && <span className="text-xs font-bold text-ink-mute">{meta}</span>}
        </p>
        <H className="mt-2.5 text-[1.0625rem] font-bold leading-[1.6] transition-colors group-hover:text-brand-700">
          <Phrase>{work.title}</Phrase>
        </H>
        <p className="mt-1.5 line-clamp-2 text-sm leading-[1.85] text-ink-body">{work.summary}</p>
        <p className="mt-auto flex items-center justify-end gap-2 pt-4 text-[0.8125rem] font-bold text-navy-900">
          事例を見る
          <span className="arrow-dot">
            <Icon name="arrowRight" className="size-4" />
          </span>
        </p>
      </div>
    </Link>
  );
}

/**
 * 施工事例を1件だけ見せるとき。左に写真を大きく、右に区画の見出しと事例の概要を置く
 * （1件しか無いのに、複数の列の枠に1つだけ置いて横を空けない）。
 */
export function WorkFeature({ work, heading }: { work: Work; heading: ReactNode }) {
  const maker = work.products.find((p) => p.maker)?.maker;
  const meta = [work.area?.label, maker].filter(Boolean).join("　／　");
  return (
    <div className="grid gap-x-14 gap-y-9 lg:grid-cols-12 lg:items-center">
      <figure className="photo-frame lg:col-span-7">
        <div className="photo-card relative aspect-[4/3]">
          <PhotoFill image={work.cover.key} alt={work.cover.alt} sizes="(min-width: 1024px) 56vw, 100vw" />
        </div>
      </figure>
      <div className="lg:col-span-5">
        {heading}
        <p className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="tag tag-blue">{work.category}</span>
          {meta && <span className="text-xs font-bold text-ink-mute">{meta}</span>}
        </p>
        <h3 className="h-sub mt-2.5">
          <Link href={`/works/${work.slug}`} className="underline-offset-4 hover:underline">
            <Phrase>{work.title}</Phrase>
          </Link>
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-[1.95]">{work.summary}</p>
        <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={`/works/${work.slug}`} className="btn btn-navy btn-sm">
            この事例の写真と内容
            <Icon name="arrowRight" className="btn-arrow size-4" />
          </Link>
          <Link href="/works" className="link-arrow">
            施工事例の一覧
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </p>
      </div>
    </div>
  );
}
