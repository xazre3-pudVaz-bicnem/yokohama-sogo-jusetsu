import Link from "next/link";
import { WorkCard } from "@/components/cards/WorkCard";
import { Icon } from "@/components/ui/Icon";
import { Illust } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getWork, worksSorted, type Work } from "@/data/works";
import { reveal } from "@/lib/reveal";

/**
 * 施工事例（実際の現場の写真だけ）。
 * 写真つきのパネルを3件。写真で出していない事例は、その下に文字だけの行で並べる（新しい順に5件まで）。
 * 事例が増えたら、PICK を入れ替える。
 */
const PICK = ["wood-deck-installation", "aircon-replace-decorative-cover", "cupboard-installation"];

export function WorksSection() {
  const picked = PICK.map(getWork).filter((w): w is Work => w !== undefined);
  const list = picked.length === 3 ? picked : worksSorted.slice(0, 3);
  const others = worksSorted.filter((w) => !list.some((x) => x.slug === w.slug)).slice(0, 5);

  return (
    <section aria-labelledby="home-works" className="cv band band-mist deco-tr deco-bl section">
      <div className="container-x">
        <div className="flex items-end justify-between gap-x-8">
          <SectionHeading id="home-works" eyebrow="当社の現場から" color="navy" title="施工事例" lead="エアコンの取替、浴室暖房乾燥機、ウッドデッキ、外壁・屋根の塗装など、当社が施工した現場の写真です。" />
          <div className="hidden shrink-0 sm:block" {...reveal(120, "pop")}>
            <Illust image="illust/people-couple-happy" width={176} className="h-auto w-36 animate-float-slow lg:w-44" />
          </div>
        </div>

        <ul className="scroller mt-9 gap-6 sm:grid sm:grid-cols-2 lg:mt-11 lg:grid-cols-3">
          {list.map((w, i) => (
            <li key={w.slug} {...reveal(i * 90)}>
              <WorkCard work={w} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 80vw" />
            </li>
          ))}
        </ul>

        {others.length > 0 && (
          <div className="mt-10 lg:mt-12" {...reveal(60)}>
            <p className="eyebrow">そのほかの施工事例</p>
            <ul className="rows rows-2 mt-3">
              {others.map((w) => (
                <li key={w.slug}>
                  <Link href={`/works/${w.slug}`} className="group flex items-center gap-4 py-3.5">
                    <div className="flex-1">
                      <p className="text-xs font-bold tracking-wider text-ink-mute">{w.category}</p>
                      <h3 className="mt-0.5 text-[0.9688rem] font-bold leading-relaxed transition-colors group-hover:text-brand-700">{w.title}</h3>
                    </div>
                    <span className="arrow-dot">
                      <Icon name="arrowRight" className="size-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-10 text-center" {...reveal()}>
          <Link href="/works" className="btn btn-outline">
            施工事例の一覧（{worksSorted.length}件）
            <Icon name="arrowRight" className="btn-arrow size-4" />
          </Link>
        </p>
      </div>
    </section>
  );
}
