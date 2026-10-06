import type { Metadata } from "next";
import Link from "next/link";
import { WorkCard } from "@/components/cards/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
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

type Group = { id: string; title: string; icon: IconName; link?: { href: string; label: string }; list: Work[] };

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
      return { id: `service-${slug}`, title: `${s.name}の事例`, icon: s.icon, link: { href: `/service/${s.slug}`, label: `${s.shortName}のサービス内容` }, list };
    });
  const rest = worksSorted.filter((w) => countOf(w.services[0]) < GROUP_MIN);
  if (rest.length) groups.push({ id: "service-others", title: groups.length ? "そのほかの施工事例" : "施工事例", icon: "wrench", list: rest });
  const anchorOf = (slug: string) => (countOf(slug) >= GROUP_MIN ? `#service-${slug}` : "#service-others");

  return (
    <>
      <PageHero
        eyebrow="施工事例"
        title={
          <>
            <span className="ib">仕上がりは、</span>
            <span className="ib">写真で確かめてください。</span>
          </>
        }
        lead="当社が実際に施工した現場の記録です。施工前と施工後の写真、工事で気をつけたポイントを、ひとつずつ紹介しています。写真はすべて、現場で撮影したものです。"
        crumbs={[{ name: "施工事例", href: "/works" }]}
      >
        <ul className="mt-7 flex flex-wrap gap-2 text-[0.8125rem] font-bold">
          {[...byService.entries()].map(([slug, list]) => {
            const s = getService(slug);
            if (!s) return null;
            return (
              <li key={slug}>
                <a href={anchorOf(slug)} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/30 bg-white/5 px-4 transition-colors hover:bg-white hover:text-navy-900">
                  {s.shortName}
                  <span className="num text-sky-300">{list.length}</span>
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
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-navy-900 pb-3" {...reveal()}>
                  <h2 className="h-sub flex items-center gap-2.5">
                    <Icon name={g.icon} className="size-6 text-brand-600" />
                    {g.title}
                  </h2>
                  {g.link && (
                    <Link href={g.link.href} className="link-arrow text-sm">
                      {g.link.label}
                      <Icon name="arrowRight" className="size-4" />
                    </Link>
                  )}
                </div>
                <ul className={`mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:gap-x-8 ${grid.cls}`}>
                  {g.list.map((w, i) => (
                    <li key={w.slug} {...reveal((i % grid.cols) * 80)}>
                      <WorkCard work={w} headingLevel="h3" sizes={grid.sizes} priority={gi === 0 && i === 0} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="works-more" className="cv section-tight bg-silver-50">
        <div className="container-narrow text-center">
          <h2 id="works-more" className="h-sub" {...reveal()}>
            最新の現場は、Instagram でも
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[0.9375rem] leading-[1.95]" {...reveal(60)}>
            ここに載せている事例は、公式 Instagram に投稿した施工写真をもとにまとめたものです。新しい現場の様子は、Instagram で随時お伝えしています。施工地域や使用した機器など、くわしい情報は順次追加していきます。
          </p>
          {siteConfig.social.instagram && (
            <div className="mt-6" {...reveal(120)}>
              <LinkButton href={siteConfig.social.instagram} variant="outline" icon="instagram" external>
                Instagram を見る
              </LinkButton>
            </div>
          )}
        </div>
      </section>

      <CtaBand id="cta-works" />
      <JsonLd data={itemListSchema("横浜総合住設の施工事例", worksSorted.map((w) => ({ name: w.title, href: `/works/${w.slug}` })))} />
    </>
  );
}
