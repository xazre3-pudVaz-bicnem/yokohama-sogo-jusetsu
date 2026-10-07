import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostRow } from "@/components/cards/PostCard";
import { WorkCard } from "@/components/cards/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { SubsidyCaution, SubsidyNote } from "@/components/sections/SubsidyNote";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { FieldNote } from "@/components/ui/FieldNote";
import { Icon } from "@/components/ui/Icon";
import { PhotoHero } from "@/components/ui/PageHero";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading, SectionSplit } from "@/components/ui/SectionHeading";
import { getArea, publishedAreas, yokohamaWards } from "@/data/areas";
import { creditOf } from "@/data/company";
import { getService } from "@/data/services";
import { subsidies } from "@/data/subsidies";
import { worksByArea, worksSorted } from "@/data/works";
import { getPostsByArea, getPostsByCluster } from "@/lib/blog";
import { img } from "@/lib/images";
import { reveal } from "@/lib/reveal";
import { faqSchema } from "@/lib/schema";
import { buildMetadata, formatDateJa } from "@/lib/seo";
import { officeAddressWithPostal, officeMapUrl } from "@/lib/site";

/**
 * 地域ページ（data/areas.ts の1件が1ページになる）。
 * 役割：その地域で工事を頼む人に向けて、地域にしか当てはまらない内容（地形・住宅の成り立ち・制度）を伝える。
 * 地域名だけを差し替えた同じ文章にはしない。事実は公式の出典つき（ページの最後に一覧）。
 * 内部リンク：サービス × 地域の各項目からサービスページへ／その地域の施工事例／その地域のコラム。
 * 冒頭に問い合わせのボタンは置かない（ヘッダーとページの最後にある）。
 */
export function generateStaticParams() {
  return publishedAreas.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArea(slug);
  if (!a) return {};
  const image = img(a.image);
  return buildMetadata({
    title: a.seo.title,
    description: a.seo.description,
    path: `/area/${a.slug}`,
    keywords: a.seo.keywords,
    image: { src: image.src, width: image.width, height: image.height, alt: a.imageAlt },
  });
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArea(slug);
  if (!a) notFound();

  const credit = creditOf(a.image);
  const areaWorks = worksByArea(a.slug);
  const posts = getPostsByArea(a.slug, 5);
  const isCity = a.kind === "city";
  const localSubsidies = isCity ? subsidies.filter((s) => s.level === "横浜市") : [];

  return (
    <>
      <PhotoHero
        eyebrow="対応エリア"
        title={a.h1}
        lead={a.lead}
        image={a.image}
        imageAlt={a.imageAlt}
        imageClassName="object-[50%_40%]"
        crumbs={[
          { name: "対応エリア", href: "/area" },
          { name: a.name, href: `/area/${a.slug}` },
        ]}
        credit={
          credit ? (
            <>
              写真：
              <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {credit.author}
              </a>
              （
              <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {credit.license}
              </a>
              ）
            </>
          ) : undefined
        }
      />

      {/* 基礎データ */}
      <section aria-label={`${a.shortName}の基礎データ`} className="bg-white">
        <div className="container-x py-8 lg:py-10">
          <dl className={`grid gap-x-9 gap-y-6 sm:grid-cols-2 ${a.facts.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
            {a.facts.map((f, i) => (
              <div key={f.label} className="card card-line px-4 py-3.5" {...reveal(i * 60)}>
                <dt className="text-xs font-bold tracking-wider text-ink-mute">{f.label}</dt>
                <dd className={`mt-1 text-navy-900 ${/^[0-9]/.test(f.value) ? "num text-[1.5rem] font-medium leading-tight" : "text-[1.0313rem] font-bold leading-snug"}`}>
                  <Phrase>{f.value}</Phrase>
                </dd>
                {f.note && <dd className="mt-1.5 text-[0.6875rem] leading-snug text-ink-mute">{f.note}</dd>}
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* この地域にしか当てはまらない内容 */}
      <div className="section bg-white">
        <div className="container-x space-y-14 lg:space-y-16">
          {a.sections.map((sec) => (
            <section key={sec.id} aria-labelledby={sec.id}>
              <SectionSplit heading={<SectionHeading id={sec.id} title={sec.heading} />}>
                <div className="space-y-5 text-[0.9688rem] leading-[2.05]" {...reveal(60)}>
                  {sec.body.map((p) => (
                    <p key={p.slice(0, 16)}>{p}</p>
                  ))}
                </div>
                {sec.id === "office" && (
                  <p className="mt-6 border-t-2 border-dotted border-silver-300 pt-4 text-sm leading-relaxed" {...reveal(100)}>
                    <span className="mr-3 font-bold text-ink">戸塚オフィス</span>
                    {officeAddressWithPostal("totsuka")}
                    <a href={officeMapUrl("totsuka")} target="_blank" rel="noopener noreferrer" className="text-link ml-3 inline-flex items-center gap-1">
                      地図
                      <Icon name="arrowUpRight" className="size-3.5" />
                    </a>
                  </p>
                )}
                {sec.items && (
                  <ul className="rows mt-8" {...reveal(80)}>
                    {sec.items.map((it) => (
                      <li key={it.title} className="grid gap-x-9 gap-y-1.5 py-5 md:grid-cols-[13.5rem_1fr]">
                        <h3 className="text-base font-bold leading-[1.75]">
                          <Phrase>{it.title}</Phrase>
                        </h3>
                        <p className="text-[0.9375rem] leading-[1.95]">{it.body}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </SectionSplit>
            </section>
          ))}
        </div>
      </div>

      {/* 町名・駅（区のページ） */}
      {(a.towns || a.stations) && (
        <section aria-labelledby="towns" className="cv section band band-mist deco-tr">
          <div className="container-x">
            <SectionSplit heading={<SectionHeading id="towns" title={`${a.shortName}の対応範囲`} lead={`${a.shortName}の全域にうかがいます。`} />}>
              <dl className="card px-5 pb-1 pt-5 text-[0.9375rem] leading-[2] sm:px-8" {...reveal(60)}>
                {a.towns && (
                  <div className="grid gap-x-9 gap-y-1 border-b-2 border-dotted border-silver-300 pb-5 last:border-b-0 md:grid-cols-[8rem_1fr]">
                    <dt className="font-bold text-ink">町名</dt>
                    <dd>{a.towns.join("・")}</dd>
                  </div>
                )}
                {a.stations && (
                  <div className="grid gap-x-9 gap-y-1 border-b-2 border-dotted border-silver-300 py-5 last:border-b-0 md:grid-cols-[8rem_1fr]">
                    <dt className="font-bold text-ink">区内の駅</dt>
                    <dd>
                      <ul className="space-y-1">
                        {a.stations.map((s) => (
                          <li key={s.name}>
                            <span className="font-bold text-ink">{s.name}</span>
                            <span className="ml-3 text-sm text-ink-mute">{s.lines}</span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
                {a.neighbors && (
                  <div className="grid gap-x-9 gap-y-1 border-b-2 border-dotted border-silver-300 py-5 last:border-b-0 md:grid-cols-[8rem_1fr]">
                    <dt className="font-bold text-ink">隣り合う区・市</dt>
                    <dd>{a.neighbors.join("・")}</dd>
                  </div>
                )}
              </dl>
            </SectionSplit>
          </div>
        </section>
      )}

      {/* 18区（市のページ） */}
      {isCity && (
        <section aria-labelledby="wards" className="cv section band band-mist deco-tr">
          <div className="container-x">
            <SectionSplit heading={<SectionHeading id="wards" title="横浜市の対応範囲" lead="横浜市の18区すべてにうかがいます。" />}>
              <ul className="grid grid-cols-3 border-l border-t border-silver-300 text-center text-sm font-bold text-ink sm:grid-cols-6" {...reveal(60)}>
                {yokohamaWards.map((w) => (
                  <li key={w} className="border-b border-r border-silver-300 bg-white">
                    {w === "戸塚区" ? (
                      <Link href="/area/totsuka" className="flex min-h-12 items-center justify-center bg-navy-900 px-2 text-white transition-colors hover:bg-navy-700">
                        {w}
                      </Link>
                    ) : (
                      <span className="flex min-h-12 items-center justify-center px-2">{w}</span>
                    )}
                  </li>
                ))}
              </ul>
            </SectionSplit>
          </div>
        </section>
      )}

      {/* サービス × 地域 */}
      <section aria-labelledby="area-services" className="cv section bg-white">
        <div className="container-x">
          <SectionHeading id="area-services" title={`${a.shortName}での工事と、確認すること`} lead="工事の種類ごとに、この地域で確認しておきたい点をまとめました。くわしい内容は、それぞれのサービスページでご案内しています。" />
          <ul className="mt-9 grid gap-4 md:grid-cols-2">
            {a.serviceNotes.map((n, i) => {
              const s = getService(n.service);
              if (!s) return null;
              return (
                <li key={n.service} className="card card-line p-5 sm:p-6" {...reveal((i % 2) * 70)}>
                  <h3 className="text-[1.0313rem] font-bold leading-snug">
                    <Phrase>{n.title}</Phrase>
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-[1.95]">{n.body}</p>
                  <p className="mt-3">
                    <Link href={`/service/${s.slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-900 underline decoration-silver-400 underline-offset-4 transition-colors hover:text-brand-700">
                      {s.name}
                      <Icon name="arrowRight" className="size-3.5" />
                    </Link>
                  </p>
                </li>
              );
            })}
          </ul>
          <FieldNote label={isCity ? "市の制度を使う場合の注意" : "現地調査について"} className="mt-10 max-w-3xl">
            {isCity
              ? "市の制度には、工事の前に申請が必要なものがあります。交換や設置を考え始めた段階でご相談いただくと、使える制度を逃さずに済みます。"
              : "戸塚区は、敷地ごとに条件が大きく違います。写真だけでは分からないことも多いので、現地を確認したうえでお見積もりします。現地調査とお見積もりは無料です。"}
          </FieldNote>
        </div>
      </section>

      {/* 市の支援制度（市のページ） */}
      {localSubsidies.length > 0 && (
        <section aria-labelledby="subsidy" className="cv section band band-cream deco-bl">
          <div className="container-x">
            <SectionHeading id="subsidy" title="横浜市の支援制度" lead="横浜市が行っている、住宅の省エネに関する事業です。公式ページで確認できた内容を、確認日つきで掲載しています。" />
            <div className="mt-9 grid gap-x-12 gap-y-12 lg:grid-cols-2">
              {localSubsidies.map((sub, i) => (
                <div key={sub.id} {...reveal(i * 80)}>
                  <SubsidyNote subsidy={sub} />
                </div>
              ))}
            </div>
            <SubsidyCaution />
          </div>
        </section>
      )}

      {/* 施工事例 */}
      <section aria-labelledby="area-works" className={`cv section ${localSubsidies.length > 0 ? "bg-white" : "band band-paper"}`}>
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <SectionHeading
              id="area-works"
              title={areaWorks.length > 0 ? `${a.shortName}の施工事例` : "施工事例"}
              lead={areaWorks.length > 0 ? `${a.name}で当社が施工した現場です。` : "当社が施工した現場の写真です。地域ごとの事例は、順次追加していきます。"}
            />
            <Link href="/works" className="link-arrow shrink-0" {...reveal(80)}>
              施工事例の一覧
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <ul className="scroller mt-9 gap-x-7 gap-y-10 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {(areaWorks.length > 0 ? areaWorks : worksSorted).slice(0, 4).map((w, i) => (
              <li key={w.slug} {...reveal(i * 80)}>
                <WorkCard work={w} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 46vw, 78vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* よくある質問・関連コラム */}
      <section aria-labelledby="faq" className={`cv section ${localSubsidies.length > 0 ? "band band-paper" : "bg-white"}`}>
        <div className="container-x space-y-14 lg:space-y-16">
          <SectionSplit heading={<SectionHeading id="faq" title={`${a.shortName}での工事のよくある質問`} />}>
            <div {...reveal(60)}>
              <FaqList faqs={a.faqs} />
            </div>
          </SectionSplit>

          {posts.length > 0 && (
            <SectionSplit heading={<SectionHeading id="area-columns" title="関連コラム" />}>
              <ul className="rows" {...reveal(60)}>
                {posts.map((p) => (
                  <li key={p.slug}>
                    <PostRow post={p} />
                  </li>
                ))}
              </ul>
              <p className="mt-7">
                <Link href={getPostsByCluster(a.slug).length > 0 ? `/blog/category/${a.slug}` : "/blog"} className="link-arrow">
                  {getPostsByCluster(a.slug).length > 0 ? `「${a.shortName}」のコラム一覧` : "住宅設備コラム"}
                  <Icon name="arrowRight" className="size-4" />
                </Link>
              </p>
            </SectionSplit>
          )}
        </div>
      </section>

      {/* 出典 */}
      <section aria-labelledby="sources" className="cv border-t border-silver-200 bg-white py-10">
        <div className="container-x">
          <h2 id="sources" className="text-sm font-bold text-ink">
            このページの出典
          </h2>
          <p className="mt-1 text-xs text-ink-mute">
            地域の統計と制度の内容は、次の公式ページで <time dateTime={a.checkedAt}>{formatDateJa(a.checkedAt)}</time> に確認しました。人口・世帯数は毎月更新されます。
          </p>
          <ul className="mt-3 grid gap-x-8 gap-y-1 text-[0.8125rem] sm:grid-cols-2 lg:grid-cols-3">
            {a.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1 py-1 !font-normal">
                  {s.label}
                  <Icon name="arrowUpRight" className="size-3" />
                </a>
              </li>
            ))}
          </ul>
          {publishedAreas.length > 1 && (
            <p className="mt-6 flex flex-wrap gap-x-9 gap-y-3">
              {publishedAreas
                .filter((x) => x.slug !== a.slug)
                .map((x) => (
                  <Link key={x.slug} href={`/area/${x.slug}`} className="link-arrow">
                    {x.name}の対応エリア
                    <Icon name="arrowRight" className="size-4" />
                  </Link>
                ))}
            </p>
          )}
        </div>
      </section>

      <CtaBand id={`cta-area-${a.slug}`} />
      <JsonLd data={faqSchema(a.faqs)} />
    </>
  );
}
