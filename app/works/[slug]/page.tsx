import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkCard } from "@/components/cards/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { Photo, PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getService } from "@/data/services";
import { getWork, works, worksSorted, type WorkImage } from "@/data/works";
import { img } from "@/lib/images";
import { reveal } from "@/lib/reveal";
import { workArticleSchema } from "@/lib/schema";
import { buildMetadata, formatDateJa } from "@/lib/seo";

/**
 * 施工事例の詳細ページ（data/works.ts の1件が1ページになる）。
 * 役割：経験・実績を、実際の現場の写真と施工のポイントで示す。
 * 表示する項目は、データに値があるものだけ（施工地域・時期・期間・メーカーは、未確認なら出ない）。
 * 内部リンク：該当するサービスページ／同じサービスのほかの事例／地域ページ（地域が分かっている場合）。
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
    title: `${w.title.replace(/ ── /g, "｜")}｜施工事例`,
    description: `${w.summary}横浜総合住設の施工事例です。`,
    path: `/works/${w.slug}`,
    type: "article",
    publishedTime: w.source.postedAt,
    modifiedTime: w.source.postedAt,
    section: "施工事例",
    image: { src: cover.src, width: cover.width, height: cover.height, alt: w.cover.alt },
  });
}

function Labeled({ image, sizes, portrait }: { image: WorkImage; sizes: string; portrait: boolean }) {
  return (
    <figure>
      <div className={`relative overflow-hidden rounded-lg bg-silver-100 ${portrait ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
        <PhotoFill image={image.key} alt={image.alt} sizes={sizes} />
        {image.label && <span className={`tag-slant absolute left-0 top-4 ${image.label === "施工後" ? "tag-slant-blue" : ""}`}>{image.label}</span>}
      </div>
    </figure>
  );
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

  // 概要の表（値のある項目だけ）
  const spec: { label: string; value: React.ReactNode }[] = [
    { label: "工事の種類", value: w.category },
    ...(w.area ? [{ label: "施工地域", value: w.area.areaSlug ? <Link href={`/area/${w.area.areaSlug}`} className="text-link">{w.area.label}</Link> : w.area.label }] : []),
    ...(w.completedAt ? [{ label: "施工時期", value: w.completedAt }] : []),
    ...(w.duration ? [{ label: "施工期間", value: w.duration }] : []),
    ...(w.products.length ? [{ label: "使用した商品", value: w.products.map((p) => (p.maker ? `${p.maker} ${p.name}` : p.name)).join("、") }] : []),
    ...(makers.length ? [{ label: "メーカー", value: makers.join("、") }] : []),
    {
      label: "関連サービス",
      value: (
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {relatedServices.map((s) => (
            <Link key={s.slug} href={`/service/${s.slug}`} className="text-link">
              {s.name}
            </Link>
          ))}
        </span>
      ),
    },
  ];

  return (
    <>
      <article>
        {/* 見出し */}
        <header className="bg-silver-soft border-b border-silver-200">
          <div className="container-x pb-10 pt-6 lg:pb-14 lg:pt-8">
            <Breadcrumbs
              items={[
                { name: "施工事例", href: "/works" },
                { name: w.title.split(" ── ")[0], href: `/works/${w.slug}` },
              ]}
            />
            <div className="mt-8 grid items-end gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
              <div>
                <p className="flex flex-wrap items-center gap-2.5">
                  <span className="tag-slant tag-slant-blue">施工事例</span>
                  <span className="chip chip-outline">
                    <Icon name={mainService.icon} className="size-3.5" />
                    {w.category}
                  </span>
                </p>
                <h1 className="h-page mt-4 text-balance"><Phrase>{w.title}</Phrase></h1>
                <p className="lead mt-5">{w.summary}</p>
              </div>
              <dl className="dl-spec text-[0.9375rem]">
                {spec.map((row) => (
                  <div key={row.label} className="!py-3 sm:!grid-cols-[7.5rem_1fr]">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </header>

        {/* 写真（主） */}
        <div className="bg-white">
          <div className={`mx-auto px-[clamp(1.25rem,4vw,2.5rem)] pt-10 lg:pt-14 ${coverPortrait ? "max-w-2xl" : "max-w-5xl"}`}>
            <figure className="overflow-hidden rounded-lg bg-silver-100">
              <Photo image={w.cover.key} alt={w.cover.alt} sizes={coverPortrait ? "(min-width: 768px) 640px, 100vw" : "(min-width: 1100px) 960px, 100vw"} priority />
            </figure>
            {w.photoNote && <p className="mt-2 text-xs text-ink-mute">{w.photoNote}</p>}
          </div>
        </div>

        <div className="section bg-white">
          <div className="container-narrow space-y-14 lg:space-y-20">
            {/* お悩み */}
            {w.worry && (
              <section aria-labelledby="worry">
                <SectionHeading id="worry" eyebrow="ご相談のきっかけ" title="お客様のお悩み" />
                <p className="bubble bubble-down mt-6 w-fit max-w-full text-[1.0313rem]" {...reveal(60)}>
                  {w.worry}
                </p>
              </section>
            )}

            {/* 施工内容 */}
            <section aria-labelledby="content">
              <SectionHeading id="content" eyebrow="施工内容" title="この現場で行ったこと" />
              <div className="mt-6 space-y-5 text-[0.9688rem] leading-[2.05]" {...reveal(60)}>
                {w.content.map((p) => (
                  <p key={p.slice(0, 16)}>{p}</p>
                ))}
              </div>
            </section>

            {/* 施工前後 */}
            {w.beforeAfter.length > 0 && (
              <section aria-labelledby="before-after">
                <SectionHeading id="before-after" eyebrow="施工前・施工後" title="写真で比べる" />
                <div className="mt-8 space-y-10">
                  {w.beforeAfter.map((pair) => {
                    const a = img(pair.after.key);
                    const portrait = a.height > a.width;
                    return (
                      <div key={pair.title} {...reveal()}>
                        <h3 className="mb-3 flex items-center gap-2 text-base font-extrabold">
                          <span aria-hidden="true" className="inline-block h-3 w-4 -skew-x-[24deg] bg-brand-600" />
                          {pair.title}
                        </h3>
                        <div className={`grid grid-cols-2 items-start gap-2 sm:gap-4 ${portrait ? "mx-auto max-w-2xl" : ""}`}>
                          <Labeled image={pair.before} portrait={portrait} sizes="(min-width: 900px) 420px, 50vw" />
                          <Labeled image={pair.after} portrait={portrait} sizes="(min-width: 900px) 420px, 50vw" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* そのほかの写真 */}
            {w.gallery.length > 0 && (
              <section aria-labelledby="gallery">
                <SectionHeading id="gallery" eyebrow="現場の写真" title={w.beforeAfter.length > 0 ? "作業の様子・仕上がり" : "写真で見る"} />
                <ul className={`mt-8 grid gap-3 sm:gap-4 ${w.gallery.length === 1 ? "" : "sm:grid-cols-2"}`}>
                  {w.gallery.map((g, i) => (
                    <li key={g.key} {...reveal((i % 2) * 80)}>
                      <figure>
                        <div className="relative overflow-hidden rounded-lg bg-silver-100">
                          <Photo image={g.key} alt={g.alt} sizes={w.gallery.length === 1 ? "(min-width: 900px) 832px, 100vw" : "(min-width: 900px) 410px, (min-width: 640px) 50vw, 100vw"} />
                          {g.label && <span className={`tag-slant absolute left-0 top-4 ${g.label === "施工後" ? "tag-slant-blue" : ""}`}>{g.label}</span>}
                        </div>
                        <figcaption className="mt-2 text-[0.8125rem] leading-relaxed text-ink-mute">{g.alt}</figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 施工のポイント */}
            {w.points.length > 0 && (
              <section aria-labelledby="points">
                <SectionHeading id="points" eyebrow="施工のポイント" title="この工事で大切にしたこと" />
                <ol className="rows mt-7">
                  {w.points.map((p, i) => (
                    <li key={p.title} className="flex gap-4 py-5 sm:gap-6" {...reveal(i * 60)}>
                      <span className="num w-9 shrink-0 pt-0.5 text-2xl font-semibold leading-none text-brand-600">{String(i + 1).padStart(2, "0")}</span>
                      <div className="flex-1">
                        <h3 className="text-[1.0625rem] font-extrabold leading-snug"><Phrase>{p.title}</Phrase></h3>
                        <p className="mt-2 text-[0.9375rem] leading-[1.95]">{p.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* コメント */}
            {w.comment && (
              <section aria-labelledby="comment">
                <SectionHeading id="comment" eyebrow="横浜総合住設から" title="担当からのコメント" />
                <figure className="mt-6 rounded-lg bg-navy-900 p-6 text-white sm:p-8" {...reveal(60)}>
                  <blockquote className="text-[1.0313rem] font-medium leading-[2]">「{w.comment}」</blockquote>
                  <figcaption className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/15 pt-4 text-xs text-silver-300">
                    <span>公式 Instagram の投稿より（{formatDateJa(w.source.postedAt)}）</span>
                    <a href={w.source.url} target="_blank" rel="noopener noreferrer" className="link-arrow link-arrow-on-dark !py-1 text-xs">
                      <Icon name="instagram" className="size-3.5" />
                      元の投稿を見る
                    </a>
                  </figcaption>
                </figure>
              </section>
            )}

            {/* サービスページへ */}
            <section aria-label="この工事について" className="rounded-lg border border-silver-200 bg-silver-50 p-6 sm:p-8" {...reveal()}>
              <p className="eyebrow">この工事について、くわしく</p>
              <p className="mt-2 text-xl font-extrabold text-ink">{mainService.name}</p>
              <p className="mt-2 text-[0.9375rem] leading-[1.9]">{mainService.summary}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <LinkButton href={`/service/${mainService.slug}`} variant="navy">
                  {mainService.shortName}のサービス内容
                </LinkButton>
                <LinkButton href="/contact" variant="outline" icon="document" arrow={false}>
                  同じ工事を相談する
                </LinkButton>
              </div>
            </section>
          </div>
        </div>
      </article>

      {/* ほかの事例 */}
      <section aria-labelledby="other-works" className="cv section bg-silver-50">
        <div className="container-x">
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
            <SectionHeading id="other-works" eyebrow="施工事例" title="ほかの事例も見る" />
            <Link href="/works" className="link-arrow shrink-0" {...reveal(80)}>
              施工事例の一覧へ
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <ul className="scroller mt-9 gap-x-6 gap-y-10 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o, i) => (
              <li key={o.slug} className={i === 2 ? "sm:hidden lg:block" : ""} {...reveal(i * 80)}>
                <WorkCard work={o} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand id={`cta-${w.slug}`} />
      <JsonLd data={workArticleSchema({ slug: w.slug, title: w.title, summary: w.summary, image: cover.src, postedAt: w.source.postedAt, serviceName: mainService.name, serviceSlug: mainService.slug })} />
    </>
  );
}
