import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostRow } from "@/components/cards/PostCard";
import { WorkCard } from "@/components/cards/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading, SectionSplit } from "@/components/ui/SectionHeading";
import { getService, servicePath } from "@/data/services";
import { serviceSlugsWithWorkList, workListKeyword, workShortTitle, worksOfMainService } from "@/data/works";
import { getPostsByClusters, getPostsByService } from "@/lib/blog";
import { reveal } from "@/lib/reveal";
import { itemListSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * サービス別の施工事例の一覧（/works/service/<サービス>）。
 *
 * 役割：1つの工事について、当社が施工した現場をまとめて見せる。施工事例の詳細ページのパンくずの中段にもなる。
 * ページを作るのは、事例が3件以上あるサービスだけ（data/works.ts の MIN_WORKS_FOR_LIST）。
 * 1〜2件しか無いサービスの一覧は、中身の薄いページになるので作らない。事例が増えて3件に届くと、自動でページができる。
 * 絞り込みの条件を URL のパラメータで受ける形にはしない（同じ内容のページが無数にできるのを避けるため）。
 * 内部リンク：そのサービスのページ／各事例／関連するコラム。
 */
export function generateStaticParams() {
  return serviceSlugsWithWorkList().map((slug) => ({ slug }));
}

export const dynamicParams = false;

function load(slug: string) {
  const service = getService(slug);
  if (!service || !serviceSlugsWithWorkList().includes(slug)) return undefined;
  return { service, list: worksOfMainService(slug) };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = load(slug);
  if (!data) return {};
  const { service, list } = data;
  const names = list.map(workShortTitle).slice(0, 3).join("、");
  return buildMetadata({
    title: `${service.shortName}の施工事例（${list.length}件）`,
    description: `横浜総合住設が施工した、${service.shortName}の事例${list.length}件を、現場の写真つきで紹介します。${names}など。施工前と施工後の写真、工事で気をつけた点を1件ずつ掲載しています。`,
    path: `/works/service/${slug}`,
    keywords: [workListKeyword(service.shortName)],
  });
}

export default async function WorksByServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = load(slug);
  if (!data) notFound();
  const { service, list } = data;
  const posts = [...getPostsByService(service.slug, 4), ...getPostsByClusters(service.blogClusters.slice(0, 1), 4)].filter((p, i, a) => a.findIndex((x) => x.slug === p.slug) === i).slice(0, 4);
  const categories = Array.from(new Set(list.map((w) => w.category)));

  return (
    <>
      <PageHero
        eyebrow="施工事例"
        title={`${service.shortName}の施工事例`}
        lead={`当社が施工した、${service.shortName}の現場の記録です（${list.length}件）。${categories.join("・")}の工事を、施工前と施工後の写真、工事で気をつけた点とともに掲載しています。写真はすべて、現場で撮影したものです。`}
        crumbs={[
          { name: "施工事例", href: "/works" },
          { name: service.shortName, href: `/works/service/${slug}` },
        ]}
      />

      <section aria-label={`${service.shortName}の施工事例の一覧`} className="section bg-white">
        <div className="container-x">
          <ul className={`grid gap-x-8 gap-y-12 sm:grid-cols-2 ${list.length === 4 ? "" : "lg:grid-cols-3"}`}>
            {list.map((w, i) => (
              <li key={w.slug} {...reveal((i % 3) * 80)}>
                <WorkCard work={w} headingLevel="h2" sizes={list.length === 4 ? "(min-width: 640px) 46vw, 100vw" : "(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw"} priority={i === 0} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="works-service" className="cv section band band-mist deco-tr">
        <div className="container-x space-y-14 lg:space-y-16">
          <SectionSplit heading={<SectionHeading id="works-service" title={`${service.shortName}の工事について`} />}>
            <p className="text-lg font-bold text-ink">{service.name}</p>
            <p className="mt-2 text-[0.9375rem] leading-[1.95]">{service.summary}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link href={servicePath(service)} className="btn btn-navy btn-sm">
                {service.shortName}のサービス内容
                <Icon name="arrowRight" className="btn-arrow size-4" />
              </Link>
              <Link href="/works" className="link-arrow">
                すべての施工事例
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </p>
          </SectionSplit>

          {posts.length > 0 && (
            <SectionSplit heading={<SectionHeading id="works-posts" title={`${service.shortName}のコラム`} />}>
              <ul className="rows" {...reveal(60)}>
                {posts.map((p) => (
                  <li key={p.slug}>
                    <PostRow post={p} />
                  </li>
                ))}
              </ul>
            </SectionSplit>
          )}
        </div>
      </section>

      <CtaBand id={`cta-works-${slug}`} />
      <JsonLd data={itemListSchema(`横浜総合住設の${service.shortName}の施工事例`, list.map((w) => ({ name: w.title, href: `/works/${w.slug}` })))} />
    </>
  );
}
