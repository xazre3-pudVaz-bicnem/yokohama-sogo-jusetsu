import type { Metadata } from "next";
import Link from "next/link";
import { WorkCard } from "@/components/cards/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { getService } from "@/data/services";
import { worksSorted, type Work } from "@/data/works";
import { reveal } from "@/lib/reveal";
import { itemListSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/**
 * 施工事例一覧
 * 役割：経験と実績を写真で示す。各事例から、該当するサービスページへ送る。
 * 担当する検索意図：横浜総合住設 施工事例／戸塚区 エアコン 取替 事例／外壁塗装 施工事例 横浜 など
 * 載せるのは、当社が実際に施工した現場だけ（イメージ写真は使わない）。
 */
export const metadata: Metadata = buildMetadata({
  title: "施工事例｜エアコン・浴室暖房乾燥機・外壁塗装・ウッドデッキ",
  description:
    "横浜総合住設の施工事例です。エアコンの取替、配管の化粧カバー仕上げ、浴室暖房乾燥機、ウッドデッキ、外壁・屋根の塗装など、実際の現場の写真を施工前後とポイントつきでご紹介します。",
  path: "/works",
  keywords: ["横浜総合住設 施工事例", "エアコン 取替 事例", "外壁塗装 施工事例", "ウッドデッキ 施工事例"],
});

/**
 * 1つのサービスで見出しを立てるのに必要な件数。
 * これより少ないサービスの事例は「そのほかの施工事例」にまとめる（1件だけの見出しが並ぶと、空きの多いページになるため）。
 * 事例が増えて、この件数に届いたサービスは、自動で独立した見出しになる。
 */
const GROUP_MIN = 3;

type Group = { id: string; title: string; link?: { href: string; label: string }; list: Work[] };

/** 件数に合わせた列数（PC）。2件・4件は2列で大きく見せ、それ以外は3列 */
function gridOf(count: number) {
  if (count <= 2 || count === 4) return { cls: "lg:grid-cols-2", cols: 2, sizes: "(min-width: 640px) 46vw, 100vw" };
  return { cls: "lg:grid-cols-3", cols: 3, sizes: "(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw" };
}

export default function WorksPage() {
  const byService = new Map<string, Work[]>();
  for (const w of worksSorted) byService.set(w.services[0], [...(byService.get(w.services[0]) ?? []), w]);
  const countOf = (slug: string) => byService.get(slug)?.length ?? 0;

  const groups: Group[] = [...byService.entries()]
    .filter(([, list]) => list.length >= GROUP_MIN)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([slug, list]) => {
      const s = getService(slug)!;
      return { id: `service-${slug}`, title: `${s.shortName}の施工事例`, link: { href: `/service/${s.slug}`, label: `${s.shortName}のサービス内容` }, list };
    });
  const rest = worksSorted.filter((w) => countOf(w.services[0]) < GROUP_MIN);
  if (rest.length) groups.push({ id: "service-others", title: groups.length ? "そのほかの施工事例" : "施工事例", list: rest });
  const anchorOf = (slug: string) => (countOf(slug) >= GROUP_MIN ? `#service-${slug}` : "#service-others");

  return (
    <>
      <PageHero
        title="施工事例"
        lead="当社が施工した現場の記録です。施工前と施工後の写真、工事で気をつけた点を、1件ずつ掲載しています。写真はすべて、現場で撮影したものです。"
        crumbs={[{ name: "施工事例", href: "/works" }]}
      >
        <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-1 border-t border-silver-200 pt-4 text-[0.8125rem] font-bold">
          {[...byService.entries()].map(([slug, list]) => {
            const s = getService(slug);
            if (!s) return null;
            return (
              <li key={slug}>
                <a href={anchorOf(slug)} className="inline-flex min-h-10 items-center gap-1.5 text-ink-body underline-offset-4 transition-colors hover:text-brand-700 hover:underline">
                  {s.shortName}
                  <span className="num font-medium text-ink-mute">{list.length}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </PageHero>

      <section aria-label="施工事例の一覧" className="section bg-white">
        <div className="container-x space-y-16 lg:space-y-20">
          {groups.map((g, gi) => {
            const grid = gridOf(g.list.length);
            return (
              <div key={g.id} id={g.id} className="scroll-mt-28">
                <div className="rule-top flex flex-wrap items-end justify-between gap-x-8 gap-y-2 pt-6" {...reveal()}>
                  <h2 className="h-section">{g.title}</h2>
                  {g.link && (
                    <Link href={g.link.href} className="link-arrow !text-sm">
                      {g.link.label}
                      <Icon name="arrowRight" className="size-3.5" />
                    </Link>
                  )}
                </div>
                <ul className={`mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 ${grid.cls}`}>
                  {g.list.map((w, i) => (
                    <li key={w.slug} {...reveal((i % grid.cols) * 80)}>
                      <WorkCard work={w} headingLevel="h3" sizes={grid.sizes} priority={gi === 0 && i === 0} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {siteConfig.social.instagram && (
            <p className="max-w-3xl border-l-2 border-navy-900 py-1 pl-5 text-[0.9375rem] leading-[1.95]" {...reveal()}>
              ここに載せている事例は、公式 Instagram に投稿した施工写真をもとにまとめたものです。新しい現場の様子は、
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-link">
                Instagram
              </a>
              でお伝えしています。施工地域や使用した機器など、くわしい情報は順次追加していきます。
            </p>
          )}
        </div>
      </section>

      <CtaBand id="cta-works" />
      <JsonLd data={itemListSchema("横浜総合住設の施工事例", worksSorted.map((w) => ({ name: w.title, href: `/works/${w.slug}` })))} />
    </>
  );
}
