import Link from "next/link";
import { WorkCard } from "@/components/cards/WorkCard";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getWork, worksSorted, type Work } from "@/data/works";
import { reveal } from "@/lib/reveal";

/**
 * 施工事例（実際の現場の写真だけ）。
 * 1件目を大きく、続く2件を縦長で並べる。写真の向き（横長・縦長）に合わせて、ここで並べる事例を決めている。
 * 事例が増えたら、PICK を入れ替える（1件目は横長の写真、2・3件目は縦長の写真が合う）。
 * 写真で出していない事例は、その下に文字だけの行で並べる（新しい順に5件まで）。
 */
const PICK = ["wood-deck-installation", "aircon-replace-decorative-cover", "cupboard-installation"];

export function WorksSection() {
  const picked = PICK.map(getWork).filter((w): w is Work => w !== undefined);
  const list = picked.length === 3 ? picked : worksSorted.slice(0, 3);
  const [first, ...rest] = list;
  const others = worksSorted.filter((w) => !list.some((x) => x.slug === w.slug)).slice(0, 5);

  return (
    <section aria-labelledby="home-works" className="cv section bg-silver-50">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <SectionHeading id="home-works" title="施工事例" lead="エアコンの取替、浴室暖房乾燥機、ウッドデッキ、外壁・屋根の塗装など、当社が施工した現場の写真です。" />
          <Link href="/works" className="link-arrow shrink-0" {...reveal(80)}>
            施工事例の一覧（{worksSorted.length}件）
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>

        <ul className="mt-9 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-12">
          <li className="sm:col-span-2 lg:col-span-6" {...reveal()}>
            <WorkCard work={first} sizes="(min-width: 1024px) 48vw, 100vw" aspect="aspect-[4/3]" />
          </li>
          {rest.map((w, i) => (
            <li key={w.slug} className="lg:col-span-3" {...reveal((i + 1) * 90)}>
              {/* 縦長の写真は、大きい1件目と高さがそろう比率にする（PC） */}
              <WorkCard work={w} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 100vw" aspect="aspect-[4/3] sm:aspect-[3/4] lg:aspect-[58/93]" />
            </li>
          ))}
        </ul>

        {others.length > 0 && (
          <div className="mt-12 lg:mt-14">
            <p className="eyebrow">そのほかの施工事例</p>
            <ul className="rows mt-3 sm:grid sm:grid-cols-2 sm:gap-x-12 sm:[&>*:nth-child(2)]:border-t sm:[&>*:nth-child(2)]:border-silver-200">
              {others.map((w) => (
                <li key={w.slug}>
                  <Link href={`/works/${w.slug}`} className="group flex items-center gap-4 py-3.5">
                    <div className="flex-1">
                      <p className="text-xs font-bold tracking-wider text-ink-mute">{w.category}</p>
                      <h3 className="mt-0.5 text-[0.9688rem] font-bold leading-relaxed text-ink transition-colors group-hover:text-brand-700">{w.title}</h3>
                    </div>
                    <Icon name="arrowRight" className="size-4 shrink-0 text-navy-900 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
