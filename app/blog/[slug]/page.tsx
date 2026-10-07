import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/blog/MarkdownBody";
import { PostRow } from "@/components/cards/PostCard";
import { ServiceTile } from "@/components/cards/ServiceCard";
import { WorkCard, WorkFeature } from "@/components/cards/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FaqList } from "@/components/ui/FaqList";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading, SectionSplit } from "@/components/ui/SectionHeading";
import { getArea } from "@/data/areas";
import { creditOf } from "@/data/company";
import { getService } from "@/data/services";
import { worksByService } from "@/data/works";
import { getAllPosts, getPost, getRelatedPosts } from "@/lib/blog";
import { img } from "@/lib/images";
import { reveal } from "@/lib/reveal";
import { blogPostingSchema, faqSchema } from "@/lib/schema";
import { buildMetadata, formatDateJa } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/**
 * コラムの記事ページ（content/blog/<slug>.md の1ファイルが1ページ）。
 * 役割：1つの検索意図に答える。答えたあと、サービスページ・施工事例・地域ページへ送る。
 * 構造化データ：BlogPosting、FAQPage（この記事に表示している質問だけ）、BreadcrumbList。
 * 問い合わせのボタンは本文に置かない（ヘッダーとページの最後にある）。
 */
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  const cover = img(p.photo.image);
  return buildMetadata({
    title: p.title,
    description: p.description,
    path: `/blog/${p.slug}`,
    keywords: p.keywords,
    type: "article",
    publishedTime: p.publishedAt,
    modifiedTime: p.updatedAt,
    section: p.cluster.name,
    tags: p.keywords,
    image: { src: cover.src, width: cover.width, height: cover.height, alt: p.title },
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  const relatedServices = p.relatedServices.map(getService).filter((s) => s !== undefined);
  const relatedAreas = p.relatedAreas.map(getArea).filter((a) => a !== undefined);
  const works = relatedServices.length ? worksByService(relatedServices[0].slug).slice(0, 3) : [];
  const relatedPosts = getRelatedPosts(p, 3);
  const cover = img(p.photo.image);
  const coverCredit = creditOf(p.photo.image);
  const toc = p.headings.filter((h) => h.level === 2);
  const updated = p.updatedAt !== p.publishedAt;

  return (
    <>
      <article>
        <header className="relative overflow-hidden bg-cream">
          <div className="container-x pb-9 pt-4 lg:pb-12 lg:pt-5">
            <Breadcrumbs
              items={[
                { name: "住宅設備コラム", href: "/blog" },
                { name: p.cluster.name, href: `/blog/category/${p.category}` },
                { name: p.title, href: `/blog/${p.slug}` },
              ]}
            />
            <div className="mx-auto mt-7 max-w-[50rem] lg:mt-11">
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs tracking-wider text-ink-mute">
                <Link href={`/blog/category/${p.category}`} className="chip">
                  {p.cluster.name}
                </Link>
                <span className="num">
                  公開 <time dateTime={p.publishedAt}>{formatDateJa(p.publishedAt)}</time>
                  {updated && (
                    <>
                      <span className="mx-2">／</span>更新 <time dateTime={p.updatedAt}>{formatDateJa(p.updatedAt)}</time>
                    </>
                  )}
                </span>
              </p>
              <h1 className="h-page mt-3 text-balance">
                <Phrase>{p.title}</Phrase>
              </h1>
              <p className="lead mt-5 max-w-none">{p.description}</p>
            </div>
          </div>
          <svg className="block h-6 w-full text-white sm:h-10" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
            <path fill="currentColor" d="M0 30c180 26 420 26 720 6s540-22 720 4v20H0z" />
          </svg>
        </header>

        <div className="bg-white">
          {/* 記事の写真。イメージ写真には「イメージ」と書き、出典の表示が必要な写真には出典を添える */}
          <figure className="mx-auto mt-4 max-w-[58rem] px-[clamp(1.25rem,4vw,2.5rem)] lg:mt-6">
            <div className="photo-card relative aspect-[16/9] sm:aspect-[21/9]">
              <PhotoFill image={p.photo.image} alt={p.photo.alt} sizes="(min-width: 1000px) 848px, 100vw" priority />
            </div>
            <figcaption className="mt-3 text-xs leading-relaxed text-ink-mute">
              {coverCredit ? (
                <>
                  写真：
                  <a href={coverCredit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    {coverCredit.author}
                  </a>
                  （{coverCredit.license}）
                </>
              ) : p.photo.image.startsWith("works/") ? (
                "写真は、当社の施工現場で撮影したものです。"
              ) : (
                "写真はイメージです"
              )}
            </figcaption>
          </figure>

          <div className="mx-auto max-w-[50rem] px-[clamp(1.25rem,4vw,2.5rem)] pb-[clamp(3rem,6vw,5rem)] pt-9">
            {/* 目次 */}
            {toc.length >= 3 && (
              <nav aria-label="この記事の目次" className="mb-10 border-y border-silver-300 py-5">
                <p className="eyebrow">この記事の内容</p>
                <ol className="mt-2">
                  {toc.map((h, i) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="group flex gap-3.5 py-1.5 text-[0.9375rem] leading-relaxed text-ink hover:text-brand-700">
                        <span className="num w-4 shrink-0 text-ink-mute">{i + 1}</span>
                        <span className="underline-offset-4 group-hover:underline">{h.text}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <MarkdownBody body={p.body} />

            {/* この記事の質問 */}
            {p.faq.length > 0 && (
              <section aria-labelledby="post-faq" className="mt-14">
                <h2 id="post-faq" className="h-sub mb-4">
                  この記事に関する質問
                </h2>
                <FaqList faqs={p.faq} />
              </section>
            )}

            {/* 出典 */}
            {p.sources.length > 0 && (
              <section aria-labelledby="post-sources" className="mt-12 rounded-2xl bg-paper-2 p-5 sm:p-6">
                <h2 id="post-sources" className="text-sm font-bold text-ink">
                  出典・参考にした公式情報
                </h2>
                <ul className="mt-3 space-y-1.5 text-[0.8125rem] leading-relaxed">
                  {p.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1 !font-normal">
                        {s.title}
                        <Icon name="arrowUpRight" className="size-3" />
                      </a>
                      <span className="ml-2 text-ink-mute">（{formatDateJa(s.checkedAt)}に確認）</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-ink-mute">制度の内容や受付状況は変わることがあります。最新の情報は、各公式ページでご確認ください。</p>
              </section>
            )}

            {/* 著者 */}
            <aside aria-label="この記事について" className="card card-line mt-10 px-5 py-5 sm:px-6">
              <p className="text-xs font-bold tracking-wider text-ink-mute">この記事を書いた人</p>
              <p className="mt-1 text-base font-bold text-ink">{p.author}</p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed">
                {siteConfig.name}は、横浜市戸塚区を中心に住宅設備の工事・リフォームを行っています。
                <Link href="/company" className="text-link ml-1">
                  会社案内
                </Link>
              </p>
            </aside>

            {/* 関連するサービス */}
            {relatedServices.length > 0 && (
              <section aria-labelledby="post-services" className="mt-12">
                <h2 id="post-services" className="h-sub">
                  この記事に関係するサービス
                </h2>
                <ul className="rows mt-4">
                  {relatedServices.map((s) => (
                    <li key={s.slug}>
                      <ServiceTile service={s} />
                    </li>
                  ))}
                </ul>
                {relatedAreas.length > 0 && (
                  <p className="mt-6 flex flex-wrap gap-x-9 gap-y-3">
                    {relatedAreas.map((a) => (
                      <Link key={a.slug} href={`/area/${a.slug}`} className="link-arrow !text-sm">
                        {a.name}の住宅設備・リフォーム
                        <Icon name="arrowRight" className="size-3.5" />
                      </Link>
                    ))}
                  </p>
                )}
              </section>
            )}
          </div>
        </div>
      </article>

      {/* 施工事例 */}
      {works.length > 0 && (
        <section aria-labelledby="post-works" className="cv section band band-mist deco-tr">
          {works.length === 1 ? (
            <div className="container-x">
              <WorkFeature work={works[0]} heading={<SectionHeading id="post-works" title={`${relatedServices[0].shortName}の施工事例`} />} />
            </div>
          ) : (
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <SectionHeading id="post-works" title={`${relatedServices[0].shortName}の施工事例`} />
              <Link href="/works" className="link-arrow shrink-0" {...reveal(80)}>
                施工事例の一覧
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
            <ul className={`scroller mt-9 gap-x-8 gap-y-10 sm:grid sm:grid-cols-2 ${works.length >= 3 ? "lg:grid-cols-3" : ""}`}>
              {works.map((w, i) => (
                <li key={w.slug} {...reveal(i * 80)}>
                  <WorkCard work={w} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw" />
                </li>
              ))}
            </ul>
          </div>
          )}
        </section>
      )}

      {/* 関連コラム */}
      {relatedPosts.length > 0 && (
        <section aria-labelledby="post-related" className={`cv section ${works.length > 0 ? "bg-white" : "band band-paper"}`}>
          <div className="container-x">
            <SectionSplit heading={<SectionHeading id="post-related" title="関連コラム" />}>
              <ul className="rows" {...reveal(60)}>
                {relatedPosts.map((r) => (
                  <li key={r.slug}>
                    <PostRow post={r} />
                  </li>
                ))}
              </ul>
              <p className="mt-7">
                <Link href={`/blog/category/${p.category}`} className="link-arrow">
                  「{p.cluster.name}」のコラム一覧
                  <Icon name="arrowRight" className="size-4" />
                </Link>
              </p>
            </SectionSplit>
          </div>
        </section>
      )}

      <CtaBand id={`cta-post-${p.slug}`} />
      <JsonLd
        data={blogPostingSchema({
          slug: p.slug,
          title: p.title,
          description: p.description,
          publishedAt: p.publishedAt,
          updatedAt: p.updatedAt,
          author: p.author,
          image: cover.src,
          category: p.cluster.name,
          keywords: p.keywords,
        })}
      />
      <JsonLd data={faqSchema(p.faq)} />
    </>
  );
}
