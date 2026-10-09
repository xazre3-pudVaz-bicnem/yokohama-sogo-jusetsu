import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostRow } from "@/components/cards/PostCard";
import { WorkCard } from "@/components/cards/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { Illust, Photo, PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading, SectionSplit } from "@/components/ui/SectionHeading";
import { getService, servicePath } from "@/data/services";
import { getWork, workDisplayTitle, workListPath, workShortTitle, workUpdatedAt, works, worksSorted, type WorkImage, type WorkProduct } from "@/data/works";
import { getPostsForWork } from "@/lib/blog";
import { img } from "@/lib/images";
import { reveal } from "@/lib/reveal";
import { workArticleSchema } from "@/lib/schema";
import { buildMetadata, formatDateJa } from "@/lib/seo";

/**
 * 施工事例の詳細ページ（data/works.ts の1件が1ページになる）。
 * 役割：経験・実績を、実際の現場の写真と施工のポイントで示す。
 * 表示する項目は、データに値があるものだけ（施工地域・時期・期間・メーカーは、未確認なら出ない）。
 * 内部リンク：該当するサービスページ／サービス別の事例一覧（あるサービスだけ）／関連するコラム／同じサービスのほかの事例／
 *            地域ページ（地域が分かっている場合）。
 * title と見出しには、地域が分かっている事例だけ、先頭に地域名が付く（data/works.ts の area）。
 * 問い合わせのボタンは本文に置かない（ヘッダーとページの最後にある）。
 */
export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const w = getWork(slug);
  if (!w) return {};
  const cover = img(w.cover.key);
  return buildMetadata({
    title: `${workDisplayTitle(w).replace(/ ── /g, "｜")}｜施工事例`,
    description: `${w.summary}横浜総合住設の施工事例です。`,
    path: `/works/${w.slug}`,
    keywords: [w.keyword],
    type: "article",
    publishedTime: w.source.postedAt,
    modifiedTime: workUpdatedAt(w),
    section: "施工事例",
    image: { src: cover.src, width: cover.width, height: cover.height, alt: w.cover.alt },
  });
}

/** 施工前・施工後などのラベルを添えた写真 */
function Labeled({ image, sizes, portrait }: { image: WorkImage; sizes: string; portrait: boolean }) {
  return (
    <figure>
      <div className={`photo-card-sm relative ${portrait ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
        <PhotoFill image={image.key} alt={image.alt} sizes={sizes} />
      </div>
      {image.label && <figcaption className="mt-2 text-xs font-bold tracking-wider text-ink">{image.label}</figcaption>}
    </figure>
  );
}

/** 機器の表記（メーカー・名称・型番を、あるものだけつなぐ） */
function productLabel(p: WorkProduct): string {
  return [p.maker, p.name, p.model].filter(Boolean).join(" ");
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = getWork(slug);
  if (!w) notFound();

  const mainService = getService(w.services[0])!;
  const relatedServices = w.services.map(getService).filter((s) => s !== undefined);
  const others = [...worksSorted.filter((x) => x.slug !== w.slug && x.services[0] === w.services[0]), ...worksSorted.filter((x) => x.slug !== w.slug && x.services[0] !== w.services[0])].slice(0, 3);
  const cover = img(w.cover.key);
  const coverPortrait = cover.height > cover.width;
  const makers = Array.from(new Set(w.products.map((p) => p.maker).filter(Boolean)));
  const listPath = workListPath(mainService.slug);
  const imageKeys = Array.from(new Set([w.cover.key, ...w.beforeAfter.flatMap((b) => [b.before.key, b.after.key]), ...w.gallery.map((g) => g.key)]));
  const posts = getPostsForWork({ slug: w.slug, services: w.services, relatedArticles: w.relatedArticles, imageKeys }, 3);

  // 概要の表（値のある項目だけ）
  const spec: { label: string; value: React.ReactNode }[] = [
    { label: "工事の種類", value: w.category },
    ...(w.area ? [{ label: "施工地域", value: w.area.areaSlug ? <Link href={`/area/${w.area.areaSlug}`} className="text-link">{w.area.label}</Link> : w.area.label }] : []),
    ...(w.completedAt ? [{ label: "施工時期", value: w.completedAt }] : []),
    ...(w.duration ? [{ label: "施工期間", value: w.duration }] : []),
    ...(w.existing?.length ? [{ label: "取り替える前の機器", value: w.existing.map(productLabel).join("、") }] : []),
    ...(w.products.length ? [{ label: "使用した商品", value: w.products.map(productLabel).join("、") }] : []),
    ...(makers.length ? [{ label: "メーカー", value: makers.join("、") }] : []),
    {
      label: "関連サービス",
      value: (
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {relatedServices.map((s) => (
            <Link key={s.slug} href={servicePath(s)} className="text-link">
              {s.name}
            </Link>
          ))}
        </span>
      ),
    },
  ];

  const heading = (
    <>
      <p className="mb-4 flex">
        <span className="pill pill-navy">施工事例　／　{w.category}</span>
      </p>
      <h1 className="h-page text-balance">
        {w.area && <span className="mb-1 block text-[0.6em] font-bold tracking-[0.04em] text-brand-700">{w.area.label}</span>}
        <Phrase>{w.title}</Phrase>
      </h1>
      <p className="lead mt-5">{w.summary}</p>
    </>
  );
  const specList = (
    <dl className="dl-spec text-[0.9375rem]">
      {spec.map((row) => (
        <div key={row.label} className="!py-3 sm:!grid-cols-[7.5rem_1fr]">
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <>
      <article>
        {/* 見出しと概要 */}
        <header className="relative overflow-hidden bg-cream">
          <div className="container-x pb-9 pt-4 lg:pb-12 lg:pt-5">
            <Breadcrumbs
              items={[
                { name: "施工事例", href: "/works" },
                ...(listPath ? [{ name: mainService.shortName, href: listPath }] : []),
                { name: workShortTitle(w), href: `/works/${w.slug}` },
              ]}
            />
            {coverPortrait ? (
              /* 縦長の写真：見出しと概要の横に置く（スマホでは 見出し → 写真 → 概要 の順） */
              <div className="mt-7 grid gap-x-14 gap-y-8 lg:mt-11 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
                <div className="lg:col-span-7">{heading}</div>
                <figure className="self-start lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
                  <div className="photo-frame photo-frame-r">
                    <div className="photo-card border-[5px] border-white">
                      <Photo image={w.cover.key} alt={w.cover.alt} sizes="(min-width: 1280px) 470px, (min-width: 1024px) 40vw, 100vw" priority />
                    </div>
                  </div>
                  {w.photoNote && <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">{w.photoNote}</figcaption>}
                </figure>
                <div className="lg:col-span-7 lg:col-start-1">{specList}</div>
              </div>
            ) : (
              <div className="mt-7 grid gap-x-12 gap-y-7 lg:mt-11 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-7">{heading}</div>
                <div className="lg:col-span-5">{specList}</div>
              </div>
            )}
          </div>
          <svg className="block h-6 w-full text-white sm:h-10" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
            <path fill="currentColor" d="M0 30c180 26 420 26 720 6s540-22 720 4v20H0z" />
          </svg>
        </header>

        {/* 写真（主）：横長の写真は、見出しの下に大きく */}
        {!coverPortrait && (
          <div className="bg-white">
            <figure className="container-x pt-2">
              <div className="photo-card">
                <Photo image={w.cover.key} alt={w.cover.alt} sizes="(min-width: 1280px) 1168px, 100vw" priority />
              </div>
              {w.photoNote && <figcaption className="mt-3 text-xs leading-relaxed text-ink-mute">{w.photoNote}</figcaption>}
            </figure>
          </div>
        )}

        <div className="section bg-white">
          <div className="container-x space-y-14 lg:space-y-16">
            {/* ご相談の内容 */}
            {w.worry && (
              <SectionSplit heading={<SectionHeading id="worry" title="ご相談の内容" />}>
                <p className="text-[1.0313rem] font-bold leading-[1.95] text-ink" {...reveal(60)}>
                  {w.worry}
                </p>
              </SectionSplit>
            )}

            {/* 工事で難しかった点（データにあるときだけ） */}
            {w.difficulty && (
              <SectionSplit heading={<SectionHeading id="difficulty" title="この現場で難しかった点" />}>
                <p className="text-[0.9688rem] leading-[2.05]" {...reveal(60)}>
                  {w.difficulty}
                </p>
              </SectionSplit>
            )}

            {/* 施工内容 */}
            <SectionSplit heading={<SectionHeading id="content" title="施工内容" />}>
              <div className="space-y-5 text-[0.9688rem] leading-[2.05]" {...reveal(60)}>
                {w.content.map((p) => (
                  <p key={p.slice(0, 16)}>{p}</p>
                ))}
              </div>
            </SectionSplit>

            {/* 施工前後 */}
            {w.beforeAfter.length > 0 && (
              <SectionSplit heading={<SectionHeading id="before-after" title="施工前・施工後" />}>
                <div className="space-y-10">
                  {w.beforeAfter.map((pair) => {
                    const a = img(pair.after.key);
                    const portrait = a.height > a.width;
                    return (
                      <div key={pair.title} {...reveal()}>
                        <h3 className="mb-3 text-base font-bold">{pair.title}</h3>
                        <div className={`grid grid-cols-2 items-start gap-2 sm:gap-4 ${portrait ? "max-w-2xl" : ""}`}>
                          <Labeled image={pair.before} portrait={portrait} sizes="(min-width: 1024px) 380px, 50vw" />
                          <Labeled image={pair.after} portrait={portrait} sizes="(min-width: 1024px) 380px, 50vw" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionSplit>
            )}

            {/* そのほかの写真 */}
            {w.gallery.length > 0 && (
              <SectionSplit heading={<SectionHeading id="gallery" title={w.beforeAfter.length > 0 ? "作業の様子・仕上がり" : "現場の写真"} />}>
                <ul className={`grid gap-x-4 gap-y-7 ${w.gallery.length === 1 ? "" : "sm:grid-cols-2"}`}>
                  {w.gallery.map((g, i) => (
                    <li key={g.key} {...reveal((i % 2) * 80)}>
                      <figure>
                        <div className="photo-card-sm">
                          <Photo image={g.key} alt={g.alt} sizes={w.gallery.length === 1 ? "(min-width: 1024px) 760px, 100vw" : "(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw"} />
                        </div>
                        {/* 説明文は写真の代替テキストと同じ文なので、読み上げでは1回だけ読まれるようにする */}
                        <figcaption className="mt-2 text-[0.8125rem] leading-relaxed text-ink-mute">
                          {g.label && <span className="mr-2 font-bold text-ink">{g.label}</span>}
                          <span aria-hidden="true">{g.alt}</span>
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </SectionSplit>
            )}

            {/* 施工のポイント（順番の無い項目なので、番号は付けない） */}
            {w.points.length > 0 && (
              <SectionSplit heading={<SectionHeading id="points" title="施工のポイント" />}>
                <ul className="rows" {...reveal(60)}>
                  {w.points.map((p) => (
                    <li key={p.title} className="py-5">
                      <h3 className="text-base font-bold leading-[1.75]">
                        <Phrase>{p.title}</Phrase>
                      </h3>
                      <p className="mt-1.5 text-[0.9375rem] leading-[1.95]">{p.body}</p>
                    </li>
                  ))}
                </ul>
              </SectionSplit>
            )}

            {/* コメント（公式 Instagram の投稿文） */}
            {w.comment && (
              <SectionSplit heading={<SectionHeading id="comment" title="横浜総合住設からのコメント" />}>
                <figure {...reveal(60)}>
                  <div className="flex items-end gap-3 sm:gap-5">
                    <Illust image="illust/pose-ok" width={112} className="h-auto w-[4.75rem] shrink-0 sm:w-28" />
                    <blockquote className="bubble flex-1 px-5 py-4 text-[1.0313rem] font-medium leading-[2] text-ink sm:px-7 sm:py-5">{w.comment}</blockquote>
                  </div>
                  <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-mute">
                    <span>公式 Instagram の投稿より（{formatDateJa(w.source.postedAt)}）</span>
                    <a href={w.source.url} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1">
                      元の投稿
                      <Icon name="arrowUpRight" className="size-3" />
                    </a>
                  </figcaption>
                </figure>
              </SectionSplit>
            )}

            {/* サービスページへ */}
            <SectionSplit heading={<SectionHeading title="この工事について" />}>
              <p className="text-lg font-bold text-ink">{mainService.name}</p>
              <p className="mt-2 text-[0.9375rem] leading-[1.95]">{mainService.summary}</p>
              <p className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
                <Link href={servicePath(mainService)} className="link-arrow">
                  {mainService.shortName}のサービス内容
                  <Icon name="arrowRight" className="size-4" />
                </Link>
                {listPath && (
                  <Link href={listPath} className="link-arrow">
                    {mainService.shortName}の施工事例の一覧
                    <Icon name="arrowRight" className="size-4" />
                  </Link>
                )}
              </p>
            </SectionSplit>

            {/* 関連するコラム（この事例にリンクしている記事・同じ工事を扱う記事） */}
            {posts.length > 0 && (
              <SectionSplit heading={<SectionHeading id="work-posts" title="この工事に関するコラム" />}>
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
        </div>
      </article>

      {/* ほかの事例 */}
      <section aria-labelledby="other-works" className="cv section band band-mist deco-tr">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <SectionHeading id="other-works" title="ほかの施工事例" />
            <Link href="/works" className="link-arrow shrink-0" {...reveal(80)}>
              施工事例の一覧
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <ul className="scroller mt-9 gap-x-8 gap-y-10 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o, i) => (
              <li key={o.slug} className={i === 2 ? "sm:hidden lg:block" : ""} {...reveal(i * 80)}>
                <WorkCard work={o} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand id={`cta-${w.slug}`} />
      <JsonLd
        data={workArticleSchema({
          slug: w.slug,
          title: workDisplayTitle(w),
          summary: w.summary,
          images: imageKeys.map((k) => img(k).src),
          postedAt: w.source.postedAt,
          updatedAt: workUpdatedAt(w),
          serviceName: mainService.name,
          serviceSlug: mainService.slug,
          areaLabel: w.area?.label,
          keyword: w.keyword,
        })}
      />
    </>
  );
}
