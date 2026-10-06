import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/blog/MarkdownBody";
import { PostCard } from "@/components/cards/PostCard";
import { ServiceRow } from "@/components/cards/ServiceCard";
import { WorkCard } from "@/components/cards/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FaqList } from "@/components/ui/FaqList";
import { Icon } from "@/components/ui/Icon";
import { LinkButton, PhoneButton } from "@/components/ui/Button";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getArea } from "@/data/areas";
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
 */
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  const cover = img(p.cluster.image);
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
  const cover = img(p.cluster.image);
  const toc = p.headings.filter((h) => h.level === 2);
  const updated = p.updatedAt !== p.publishedAt;

  return (
    <>
      <article>
        <header className="bg-silver-soft border-b border-silver-200">
          <div className="container-x pb-10 pt-6 lg:pb-12 lg:pt-8">
            <Breadcrumbs
              items={[
                { name: "住宅設備コラム", href: "/blog" },
                { name: p.cluster.name, href: `/blog/category/${p.category}` },
                { name: p.title, href: `/blog/${p.slug}` },
              ]}
            />
            <div className="mx-auto mt-8 max-w-[52rem] lg:mt-10">
              <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {/* タップしやすい高さを確保するため、リンクの中にラベルを入れる */}
                <Link href={`/blog/category/${p.category}`} className="inline-flex min-h-10 items-center">
                  <span className="tag-slant tag-slant-blue">{p.cluster.name}</span>
                </Link>
                <span className="num text-xs tracking-widest text-ink-mute">
                  公開 <time dateTime={p.publishedAt}>{formatDateJa(p.publishedAt)}</time>
                  {updated && (
                    <>
                      <span className="mx-2">／</span>更新 <time dateTime={p.updatedAt}>{formatDateJa(p.updatedAt)}</time>
                    </>
                  )}
                </span>
              </p>
              <h1 className="h-page mt-4 text-balance"><Phrase>{p.title}</Phrase></h1>
              <p className="lead mt-5 max-w-none">{p.description}</p>
            </div>
          </div>
        </header>

        <div className="bg-white">
          <div className="mx-auto max-w-[60rem] px-[clamp(1.25rem,4vw,2.5rem)] pt-8 lg:pt-12">
            <div className="relative aspect-[21/9] overflow-hidden rounded-lg bg-silver-100">
              <PhotoFill image={p.cluster.image} alt={p.cluster.imageAlt} sizes="(min-width: 1000px) 880px, 100vw" priority />
            </div>
          </div>

          <div className="mx-auto max-w-[52rem] px-[clamp(1.25rem,4vw,2.5rem)] pb-[clamp(3.5rem,7vw,6rem)] pt-10">
            {/* 目次 */}
            {toc.length >= 3 && (
              <nav aria-label="この記事の目次" className="mb-10 rounded-lg border border-silver-200 bg-silver-50 p-5 sm:p-6">
                <p className="eyebrow">この記事の内容</p>
                <ol className="mt-3 space-y-0.5">
                  {toc.map((h, i) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="group flex gap-3 py-1.5 text-[0.9375rem] font-bold leading-relaxed text-ink hover:text-brand-700">
                        <span className="num w-6 shrink-0 text-brand-600">{String(i + 1).padStart(2, "0")}</span>
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
                <h2 id="post-faq" className="h-sub mb-4 flex items-center gap-2.5">
                  <span aria-hidden="true" className="inline-block h-3.5 w-5 -skew-x-[24deg] bg-brand-600" />
                  この記事に関する質問
                </h2>
                <FaqList faqs={p.faq} />
              </section>
            )}

            {/* 出典 */}
            {p.sources.length > 0 && (
              <section aria-labelledby="post-sources" className="mt-12 rounded-lg bg-silver-50 p-5 sm:p-6">
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
            <aside aria-label="この記事について" className="mt-10 flex flex-col gap-4 border-y border-silver-200 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold tracking-widest text-ink-mute">この記事を書いた人</p>
                <p className="mt-1 text-base font-extrabold text-ink">{p.author}</p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed">
                  {siteConfig.name}は、横浜市戸塚区を中心に住宅設備の工事・リフォームを行っています。
                  <Link href="/company" className="text-link ml-1">
                    会社案内
                  </Link>
                </p>
              </div>
            </aside>

            {/* 関連するサービス */}
            {relatedServices.length > 0 && (
              <section aria-labelledby="post-services" className="mt-12">
                <h2 id="post-services" className="h-sub flex items-center gap-2.5">
                  <span aria-hidden="true" className="inline-block h-3.5 w-5 -skew-x-[24deg] bg-brand-600" />
                  この記事に関係するサービス
                </h2>
                <ul className="rows mt-4">
                  {relatedServices.map((s) => (
                    <li key={s.slug}>
                      <ServiceRow service={s} />
                    </li>
                  ))}
                </ul>
                {relatedAreas.length > 0 && (
                  <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
                    {relatedAreas.map((a) => (
                      <Link key={a.slug} href={`/area/${a.slug}`} className="link-arrow text-sm">
                        <Icon name="mapPin" className="size-4" />
                        {a.name}の住宅設備・リフォーム
                      </Link>
                    ))}
                  </p>
                )}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <LinkButton href="/contact" icon="document">
                    無料見積もりを依頼する
                  </LinkButton>
                  <PhoneButton variant="outline" />
                </div>
              </section>
            )}
          </div>
        </div>
      </article>

      {/* 施工事例 */}
      {works.length > 0 && (
        <section aria-labelledby="post-works" className="cv section bg-silver-50">
          <div className="container-x">
            <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
              <SectionHeading id="post-works" eyebrow="施工事例" title={`${relatedServices[0].shortName}の施工事例`} />
              <Link href="/works" className="link-arrow shrink-0" {...reveal(80)}>
                施工事例の一覧へ
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
            <ul className="scroller mt-9 gap-x-6 gap-y-10 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {works.map((w, i) => (
                <li key={w.slug} {...reveal(i * 80)}>
                  <WorkCard work={w} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 関連コラム */}
      {relatedPosts.length > 0 && (
        <section aria-labelledby="post-related" className={`cv section ${works.length > 0 ? "bg-white" : "bg-silver-50"}`}>
          <div className="container-x">
            <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
              <SectionHeading id="post-related" eyebrow="関連コラム" title="合わせて読みたい" />
              <Link href={`/blog/category/${p.category}`} className="link-arrow shrink-0" {...reveal(80)}>
                「{p.cluster.name}」のコラム一覧
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
            <ul className="scroller mt-9 gap-x-6 gap-y-10 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((r, i) => (
                <li key={r.slug} {...reveal(i * 80)}>
                  <PostCard post={r} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw" />
                </li>
              ))}
            </ul>
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
