import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import type { Work } from "@/data/works";

/**
 * 施工事例のカード。写真はすべて実際の現場の写真。
 * 施工地域・メーカーは、データに値があるときだけ出す。
 */
export function WorkCard({ work, sizes, headingLevel: H = "h3", priority = false }: { work: Work; sizes: string; headingLevel?: "h2" | "h3"; priority?: boolean }) {
  const maker = work.products.find((p) => p.maker)?.maker;
  return (
    <Link href={`/works/${work.slug}`} className="group flex h-full flex-col">
      <div className="zoom-wrap relative aspect-[4/3] overflow-hidden rounded-lg bg-silver-100">
        <PhotoFill image={work.cover.key} alt={work.cover.alt} sizes={sizes} className="zoom-img" priority={priority} />
        <span className="tag-slant absolute left-0 top-4">{work.category}</span>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <H className="text-[1.0625rem] font-extrabold leading-[1.55] text-ink transition-colors group-hover:text-brand-700">
          <Phrase>{work.title}</Phrase>
        </H>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.8] text-ink-body">{work.summary}</p>
        {(work.area || maker) && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {work.area && (
              <li className="chip chip-outline">
                <Icon name="mapPin" className="size-3.5" />
                {work.area.label}
              </li>
            )}
            {maker && <li className="chip chip-outline">{maker}</li>}
          </ul>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-bold text-brand-700">
          事例を見る
          <Icon name="arrowRight" className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}
