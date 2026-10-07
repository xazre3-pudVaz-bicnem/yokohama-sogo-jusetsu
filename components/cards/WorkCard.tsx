import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import type { Work } from "@/data/works";

/**
 * 施工事例へのリンク。写真はすべて実際の現場の写真。
 * 写真の下に、区分・題名・概要を文字だけで置く（枠や影、写真に重ねるラベルは付けない）。
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
  const meta = [work.category, work.area?.label, maker].filter(Boolean).join("　／　");
  return (
    <Link href={`/works/${work.slug}`} className="group flex h-full flex-col">
      <div className={`zoom-wrap relative ${aspect} bg-silver-100`}>
        <PhotoFill image={work.cover.key} alt={work.cover.alt} sizes={sizes} className="zoom-img" priority={priority} />
      </div>
      <p className="mt-3.5 text-xs font-bold tracking-wider text-ink-mute">{meta}</p>
      <H className="mt-1.5 text-[1.0313rem] font-bold leading-[1.6] text-ink transition-colors group-hover:text-brand-700">
        <Phrase>{work.title}</Phrase>
      </H>
      <p className="mt-1.5 line-clamp-2 text-sm leading-[1.85] text-ink-body">{work.summary}</p>
    </Link>
  );
}

/**
 * 施工事例を1件だけ見せるとき。左に写真を大きく、右に区画の見出しと事例の概要を置く
 * （1件しか無いのに、複数の列の枠に1つだけ置いて横を空けない）。
 */
export function WorkFeature({ work, heading }: { work: Work; heading: ReactNode }) {
  const maker = work.products.find((p) => p.maker)?.maker;
  const meta = [work.category, work.area?.label, maker].filter(Boolean).join("　／　");
  return (
    <div className="grid gap-x-12 gap-y-7 lg:grid-cols-12 lg:items-center">
      <figure className="relative aspect-[4/3] bg-silver-100 lg:col-span-7">
        <PhotoFill image={work.cover.key} alt={work.cover.alt} sizes="(min-width: 1024px) 56vw, 100vw" />
      </figure>
      <div className="lg:col-span-5">
        {heading}
        <p className="mt-6 text-xs font-bold tracking-wider text-ink-mute">{meta}</p>
        <h3 className="h-sub mt-1.5">
          <Link href={`/works/${work.slug}`} className="underline-offset-4 hover:underline">
            <Phrase>{work.title}</Phrase>
          </Link>
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-[1.95]">{work.summary}</p>
        <p className="mt-6 flex flex-wrap gap-x-9 gap-y-3">
          <Link href={`/works/${work.slug}`} className="link-arrow">
            この事例の写真と内容
            <Icon name="arrowRight" className="size-4" />
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
