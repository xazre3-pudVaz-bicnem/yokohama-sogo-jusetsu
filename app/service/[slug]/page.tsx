import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostRow } from "@/components/cards/PostCard";
import { ServiceRow } from "@/components/cards/ServiceCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceBlockView, blockLabel } from "@/components/service/ServiceBlocks";
import { FaqList } from "@/components/ui/FaqList";
import { Icon } from "@/components/ui/Icon";
import { PhotoHero } from "@/components/ui/PageHero";
import { SectionHeading, SectionSplit } from "@/components/ui/SectionHeading";
import { categoryOf, getService, services } from "@/data/services";
import { subsidiesByIds } from "@/data/subsidies";
import { worksByService } from "@/data/works";
import { getPostsByCluster, getPostsByClusters, getPostsByService } from "@/lib/blog";
import { getCluster } from "@/lib/blog-clusters";
import { img } from "@/lib/images";
import { reveal } from "@/lib/reveal";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * サービスの詳細ページ（data/services/*.ts の1件が1ページになる）。
 *
 * 役割：その工事についての公式の案内（読みもの）。
 * 冒頭は「区分・見出し・短い説明・写真」だけ。問い合わせのボタンは置かない（ヘッダーとページの最後にある）。
 * 本文の区画の順番と見せ方は、サービスごとに data/services/*.ts の layout で決める（全ページを同じ型にしない）。
 * 「よくある質問」「関連コラム」「関連するサービス」だけは、どのページでも最後に同じ順で出す。
 *
 * 内部リンク：施工事例（同じサービス）／関連コラム（同じクラスタ）／地域ページ／関連サービス。
 * 構造化データ：Service、BreadcrumbList（パンくず内）、FAQPage（このページに表示している質問だけ）。
 */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  const image = img(s.image);
  return buildMetadata({
    title: s.seo.title,
    description: s.seo.description,
    path: `/service/${s.slug}`,
    keywords: s.seo.keywords,
    image: { src: image.src, width: image.width, height: image.height, alt: s.imageAlt },
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const category = categoryOf(s);
  const works = worksByService(s.slug);
  const subsidies = subsidiesByIds(s.subsidyIds);
  const posts = [...getPostsByService(s.slug, 5), ...getPostsByClusters(s.blogClusters, 5)].filter((p, i, a) => a.findIndex((x) => x.slug === p.slug) === i).slice(0, 5);
  const related = s.related.map(getService).filter((x) => x !== undefined);
  // カテゴリの一覧ページは、記事が1本以上あるときだけ存在する
  const mainCluster = s.blogClusters.map(getCluster).find((c) => c && getPostsByCluster(c.id).length > 0);

  // 出すものが無い区画（事例の無いサービスの「施工事例」など）は、先に外す
  const blocks = s.layout.filter((b) => {
    if (b.type === "works") return works.length > 0;
    if (b.type === "subsidy") return subsidies.length > 0;
    if (b.type === "scope") return Boolean(s.scope);
    if (b.type === "guide") return s.guides.some((g) => g.id === b.id);
    return true;
  });
  const toc = [...blocks.map((b) => blockLabel(b, s)).filter((x) => x !== null), { id: "faq", label: "よくある質問" }];

  // 区画の地色は、白と淡いグレーを交互に（補足だけの短い区画は、直前の区画と同じ色にする）
  const counts = blocks.reduce<number[]>((acc, b) => [...acc, (acc.at(-1) ?? 0) + (b.type === "note" ? 0 : 1)], []);
  const tones = counts.map((c) => (c % 2 === 1 ? ("white" as const) : ("tint" as const)));
  const total = counts.at(-1) ?? 0;
  const tail = (k: number) => ((total + k) % 2 === 1 ? "bg-white" : "bg-silver-50");

  return (
    <>
      <PhotoHero
        eyebrow={category.name}
        title={s.h1}
        lead={s.lead}
        image={s.image}
        imageAlt={s.imageAlt}
        layout={s.heroLayout}
        caption={s.imageCaption ?? (s.image.startsWith("photos/") ? "写真はイメージです" : undefined)}
        crumbs={[
          { name: "サービス", href: "/service" },
          { name: s.name, href: `/service/${s.slug}` },
        ]}
      />

      {/* ページ内の案内（文字だけ） */}
      <nav aria-label="このページの内容" className="border-b border-silver-200 bg-white">
        <div className="container-x">
          <ul className="flex gap-x-6 overflow-x-auto py-3 text-[0.8125rem] font-bold [scrollbar-width:none] lg:flex-wrap">
            {toc.map((t) => (
              <li key={t.id} className="shrink-0">
                <a href={`#${t.id}`} className="inline-flex min-h-10 items-center text-ink-body underline-offset-4 transition-colors hover:text-brand-700 hover:underline">
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {blocks.map((b, i) => (
        <ServiceBlockView key={`${b.type}-${"id" in b ? b.id : i}`} block={b} service={s} tone={tones[i]} lazy={i > 0} works={works} subsidies={subsidies} />
      ))}

      {/* よくある質問 */}
      <section aria-labelledby="faq" className={`cv section ${tail(1)}`}>
        <div className="container-x">
          <SectionSplit heading={<SectionHeading id="faq" title={`${s.shortName}のよくある質問`} />}>
            <div {...reveal(60)}>
              <FaqList faqs={s.faqs} />
            </div>
            <p className="mt-7">
              <Link href="/faq" className="link-arrow">
                よくある質問の一覧
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </p>
          </SectionSplit>
        </div>
      </section>

      {/* 関連コラム・関連するサービス */}
      <section aria-labelledby="columns" className={`cv section ${tail(2)}`}>
        <div className="container-x space-y-14 lg:space-y-16">
          <SectionSplit heading={<SectionHeading id="columns" title="関連コラム" />}>
            {posts.length > 0 ? (
              <ul className="rows" {...reveal(60)}>
                {posts.map((p) => (
                  <li key={p.slug}>
                    <PostRow post={p} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[0.9375rem] leading-[1.95]" {...reveal(60)}>
                このテーマのコラムは準備中です。住宅設備コラムでは、設備の選び方や交換の時期について、順次お伝えしていきます。
              </p>
            )}
            <p className="mt-7">
              <Link href={mainCluster ? `/blog/category/${mainCluster.id}` : "/blog"} className="link-arrow">
                {mainCluster ? `「${mainCluster.name}」のコラム一覧` : "住宅設備コラム"}
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </p>
          </SectionSplit>

          {/* 専門サイトの案内（URL が設定されたときだけ出る） */}
          {s.specialtySite && (
            <SectionSplit heading={<SectionHeading title="専門サイトのご案内" />}>
              <p className="text-lg font-bold text-ink">{s.specialtySite.name}</p>
              <p className="mt-1.5 text-[0.9375rem] leading-[1.95]">{s.specialtySite.note}</p>
              <p className="mt-5">
                <a href={s.specialtySite.url} target="_blank" rel="noopener noreferrer" className="link-arrow">
                  専門サイトを見る
                  <Icon name="arrowUpRight" className="size-4" />
                </a>
              </p>
            </SectionSplit>
          )}

          <SectionSplit heading={<SectionHeading id="related" title="関連するサービス" />}>
            <ul className="rows sm:grid sm:grid-cols-2 sm:gap-x-9 sm:[&>*:nth-child(2)]:border-t sm:[&>*:nth-child(2)]:border-silver-200" {...reveal(60)}>
              {related.map((r) => (
                <li key={r.slug}>
                  <ServiceRow service={r} />
                </li>
              ))}
            </ul>
          </SectionSplit>
        </div>
      </section>

      <CtaBand id={`cta-${s.slug}`} />

      <JsonLd data={serviceSchema({ name: s.name, slug: s.slug, summary: s.summary, image: img(s.image).src, h1: s.h1 })} />
      <JsonLd data={faqSchema(s.faqs)} />
    </>
  );
}
