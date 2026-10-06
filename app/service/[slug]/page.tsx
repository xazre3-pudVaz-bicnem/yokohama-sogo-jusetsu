import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostRow } from "@/components/cards/PostCard";
import { ServicePhotoCard } from "@/components/cards/ServiceCard";
import { WorkCard } from "@/components/cards/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { SubsidyCaution, SubsidyNote } from "@/components/sections/SubsidyNote";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { Icon } from "@/components/ui/Icon";
import { LinkButton, PhoneButton } from "@/components/ui/Button";
import { PhotoHero } from "@/components/ui/PageHero";
import { Illust, PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaffTip } from "@/components/ui/StaffTip";
import { categoryOf, getService, services } from "@/data/services";
import { subsidiesByIds } from "@/data/subsidies";
import { worksByService } from "@/data/works";
import { ACCENT_BG } from "@/lib/accent";
import { getPostsByCluster, getPostsByClusters, getPostsByService } from "@/lib/blog";
import { getCluster } from "@/lib/blog-clusters";
import { img } from "@/lib/images";
import { reveal } from "@/lib/reveal";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * サービスの詳細ページ（data/services/*.ts の1件が1ページになる）。
 * 役割：その工事についての深い解説（お悩み → 対応工事 → 選び方 → 費用の考え方 → 事例 → 地域 → 質問）。
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

  const toc = [
    { id: "worries", label: "こんなお悩みに" },
    { id: "menu", label: "対応している工事" },
    ...s.guides.map((g) => ({ id: g.id, label: g.heading.split(" ── ")[0] })),
    { id: "cost", label: "費用の考え方" },
    ...(subsidies.length ? [{ id: "subsidy", label: "補助金・支援制度" }] : []),
    ...(works.length ? [{ id: "works", label: "施工事例" }] : []),
    { id: "local", label: "戸塚区・横浜市での工事" },
    { id: "faq", label: "よくある質問" },
  ];

  return (
    <>
      <PhotoHero
        eyebrow={category.name}
        title={s.h1}
        lead={s.lead}
        image={s.image}
        imageAlt={s.imageAlt}
        crumbs={[
          { name: "サービス", href: "/service" },
          { name: s.name, href: `/service/${s.slug}` },
        ]}
      >
        {s.scope && (
          <p className="mt-5 flex gap-2.5 rounded-md border border-sky-400/50 bg-white/[0.07] px-4 py-3 text-sm leading-relaxed text-white">
            <Icon name="question" className="mt-0.5 size-4 text-sky-300" />
            <span>{s.scope}</span>
          </p>
        )}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton href="/contact" icon="document">
            無料見積もりを依頼する
          </LinkButton>
          <PhoneButton variant="white" />
        </div>
      </PhotoHero>

      {/* ページ内の案内 */}
      <nav aria-label="このページの内容" className="border-b border-silver-200 bg-white">
        <div className="container-x">
          <ul className="-mx-1 flex gap-x-1 overflow-x-auto py-3 text-[0.8125rem] font-bold [scrollbar-width:none] sm:flex-wrap">
            {toc.map((t) => (
              <li key={t.id} className="shrink-0">
                <a href={`#${t.id}`} className="inline-flex min-h-11 items-center gap-1 rounded px-2.5 text-ink-body transition-colors hover:bg-brand-50 hover:text-brand-700">
                  <Icon name="chevronDown" className="size-3.5 text-brand-600" />
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* お悩み */}
      <section aria-labelledby="worries" className="section bg-silver-soft">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <div>
            <SectionHeading
              id="worries"
              eyebrow="こんなお悩みに"
              title={
                <>
                  <span className="ib">ひとつでも</span>
                  <span className="ib">当てはまったら、</span>
                  <span className="ib">ご相談ください。</span>
                </>
              }
            />
            <div className="mt-6 hidden w-52 lg:block" {...reveal(120, "pop")}>
              <Illust image="illust/people-couple-talk" width={260} className="h-auto w-full" />
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {s.worries.map((w, i) => (
              <li key={w} className="flex items-start gap-3 rounded-lg border border-silver-200 bg-white p-4 text-[0.9688rem] font-bold leading-relaxed text-ink" {...reveal((i % 2) * 70 + Math.floor(i / 2) * 60)}>
                <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-sm text-white ${ACCENT_BG[s.accent]}`}>
                  <Icon name="check" className="size-4" strokeWidth={2.5} />
                </span>
                <span>
                  <Phrase>{w}</Phrase>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 対応している工事 */}
      <section aria-labelledby="menu" className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <SectionHeading id="menu" eyebrow="対応している工事" title={`${s.shortName}で、できること。`} lead={s.summary} />
            <ol className="rows mt-8">
              {s.menu.map((m, i) => (
                <li key={m.title} className="flex gap-4 py-6 sm:gap-6" {...reveal(Math.min(i, 3) * 60)}>
                  <span className="num w-9 shrink-0 pt-0.5 text-2xl font-semibold leading-none text-brand-600 sm:w-11">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1">
                    <h3 className="text-[1.0938rem] font-extrabold leading-snug sm:text-lg"><Phrase>{m.title}</Phrase></h3>
                    <p className="mt-2 text-[0.9375rem] leading-[1.95]">{m.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {s.subImage && (
            <div className="lg:sticky lg:top-28 lg:self-start">
              <figure {...reveal(0, "wipe")}>
                <div className="cut-tr relative aspect-[4/3] overflow-hidden rounded-lg bg-silver-100 lg:aspect-[4/5]">
                  <PhotoFill image={s.subImage} alt={s.subImageAlt ?? ""} sizes="(min-width: 1024px) 38vw, 100vw" />
                </div>
                {s.subImageAlt && s.subImage.startsWith("works/") && <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">{s.subImageAlt}</figcaption>}
              </figure>
              <StaffTip pose={s.staffTip.pose} className="mt-8">
                {s.staffTip.text}
              </StaffTip>
            </div>
          )}
        </div>
      </section>

      {/* 選び方・交換時期などの解説 */}
      {s.guides.map((g, gi) => (
        <section key={g.id} aria-labelledby={g.id} className={`cv section ${gi % 2 === 0 ? "bg-silver-50" : "bg-white"}`}>
          <div className="container-x">
            <SectionHeading id={g.id} eyebrow={gi === 0 ? "知っておきたいこと" : undefined} title={g.heading} lead={g.intro} />
            <div className={`mt-9 grid gap-4 sm:grid-cols-2 ${g.items.length === 3 ? "lg:grid-cols-3" : g.items.length >= 5 ? "lg:grid-cols-3" : "lg:grid-cols-2 xl:grid-cols-4"}`}>
              {g.items.map((it, i) => (
                <div key={it.title} className={`relative rounded-lg border border-silver-200 p-5 sm:p-6 ${gi % 2 === 0 ? "bg-white" : "bg-silver-50"}`} {...reveal((i % 4) * 70)}>
                  <span aria-hidden="true" className={`absolute left-0 top-6 h-7 w-1 ${ACCENT_BG[s.accent]}`} />
                  <h3 className="text-[1.0625rem] font-extrabold leading-snug"><Phrase>{it.title}</Phrase></h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-[1.95]">{it.body}</p>
                </div>
              ))}
            </div>
            {/* 比較表は、最後の解説の下に置く */}
            {s.table && gi === s.guides.length - 1 && (
              <div className="mt-10" {...reveal()}>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-ink-mute sm:hidden">
                  <Icon name="arrowRight" className="size-3.5 text-brand-600" />
                  表は横にスクロールして比べられます
                </p>
                {/* 横にスクロールする領域は、キーボードでも動かせるようにフォーカスを受ける */}
                <div className="table-wrap" tabIndex={0} role="region" aria-label={s.table.caption}>
                  <table className="table-spec">
                    <caption className="sr-only">{s.table.caption}</caption>
                    <thead>
                      <tr>
                        {s.table.head.map((h, i) => (
                          <th key={i} scope="col">
                            {h || <span className="sr-only">項目</span>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((row) => (
                        <tr key={row[0]}>
                          {row.map((cell, i) =>
                            i === 0 ? (
                              <th key={i} scope="row">
                                {cell}
                              </th>
                            ) : (
                              <td key={i}>{cell}</td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm font-bold text-ink">{s.table.caption}</p>
                {s.table.note && <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-mute">{s.table.note}</p>}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* 費用の考え方 */}
      <section aria-labelledby="cost" className="cv bg-blueprint relative overflow-hidden text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] top-0 h-full w-[40%] -skew-x-[24deg] bg-gradient-to-b from-brand-600/25 to-transparent" />
        <div className="container-x section relative grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <SectionHeading id="cost" onDark eyebrow="費用の考え方" title="金額は、何で決まるのか。" lead={s.cost.intro} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row" {...reveal(100)}>
              <LinkButton href="/contact" variant="white" icon="document">
                無料で見積もりを依頼する
              </LinkButton>
            </div>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-silver-300">お見積もりは無料です。現地調査にうかがい、内訳の分かる見積書をお出しします。</p>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-lg bg-white/15 sm:grid-cols-2">
            {s.cost.factors.map((f, i) => (
              <li key={f.title} className="bg-navy-900/90 p-5 sm:p-6" {...reveal(i * 70, "fade")}>
                <p className="num text-sm font-semibold tracking-[0.2em] text-sky-300">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1.5 text-[1.0625rem] font-extrabold leading-snug !text-white"><Phrase>{f.title}</Phrase></h3>
                <p className="mt-2 text-sm leading-[1.9] text-silver-200">{f.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 補助金・支援制度 */}
      {subsidies.length > 0 && (
        <section aria-labelledby="subsidy" className="cv section bg-white">
          <div className="container-x">
            <SectionHeading
              id="subsidy"
              eyebrow="補助金・支援制度"
              title="この工事に関係する制度"
              lead="公式ページで確認できた内容を、確認日つきで掲載しています。対象になるかどうかは、機種・住宅・申請の時期によって変わります。"
            />
            <div className="mt-9 grid gap-5 lg:grid-cols-2">
              {subsidies.map((sub, i) => (
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
      {works.length > 0 && (
        <section aria-labelledby="works" className="cv section bg-silver-50">
          <div className="container-x">
            <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
              <SectionHeading id="works" eyebrow="施工事例" title={`${s.shortName}の施工事例`} lead="当社が実際に施工した現場の写真です。" />
              <Link href="/works" className="link-arrow shrink-0" {...reveal(100)}>
                施工事例をすべて見る
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
            <ul className="scroller mt-10 gap-x-5 gap-y-10 sm:grid sm:grid-cols-2 lg:grid-cols-4">
              {works.slice(0, 4).map((w, i) => (
                <li key={w.slug} {...reveal(i * 90)}>
                  <WorkCard work={w} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 戸塚区・横浜市での工事 */}
      <section aria-labelledby="local" className={`cv section ${works.length > 0 ? "bg-white" : "bg-silver-50"}`}>
        <div className="container-narrow">
          <SectionHeading id="local" eyebrow="戸塚区・横浜市での工事" title={s.local.heading} />
          <div className="mt-6 space-y-5 text-[0.9688rem] leading-[2.05]" {...reveal(60)}>
            {s.local.body.map((p) => (
              <p key={p.slice(0, 16)}>{p}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-2" {...reveal(100)}>
            <Link href="/area/totsuka" className="link-arrow">
              横浜市戸塚区の住宅設備・リフォーム
              <Icon name="arrowRight" className="size-4" />
            </Link>
            <Link href="/area" className="link-arrow">
              対応エリアを見る
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* よくある質問 */}
      <section aria-labelledby="faq" className={`cv section ${works.length > 0 ? "bg-silver-50" : "bg-white"}`}>
        <div className="container-narrow">
          <SectionHeading id="faq" eyebrow="よくある質問" title={`${s.shortName}についての質問`} />
          <div className="mt-8" {...reveal(60)}>
            <FaqList faqs={s.faqs} />
          </div>
          <Link href="/faq" className="link-arrow mt-6">
            そのほかの質問を見る
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
      </section>

      {/* 関連コラム */}
      {(
        <section aria-labelledby="columns" className="cv section-tight bg-white">
          <div className="container-narrow">
            <SectionHeading id="columns" eyebrow="関連コラム" title={`${s.shortName}について、もっと知る`} />
            {posts.length > 0 ? (
              <ul className="rows mt-7" {...reveal(60)}>
                {posts.map((p) => (
                  <li key={p.slug}>
                    <PostRow post={p} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-[0.9375rem] leading-[1.95]" {...reveal(60)}>
                このテーマのコラムは準備中です。住宅設備コラムでは、設備の選び方や交換の時期について、順次お伝えしていきます。
              </p>
            )}
            <Link href={mainCluster ? `/blog/category/${mainCluster.id}` : "/blog"} className="link-arrow mt-6">
              {mainCluster ? `「${mainCluster.name}」のコラム一覧` : "住宅設備コラムを見る"}
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* 専門サイトの案内（URL が設定されたときだけ出る） */}
      {s.specialtySite && (
        <section aria-label="専門サイトのご案内" className="cv section-tight bg-white">
          <div className="container-narrow">
            <div className="flex flex-col items-start gap-5 rounded-lg border-2 border-navy-900 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="eyebrow">専門サイトのご案内</p>
                <p className="mt-2 text-xl font-extrabold text-ink">{s.specialtySite.name}</p>
                <p className="mt-1.5 text-sm leading-relaxed">{s.specialtySite.note}</p>
              </div>
              <LinkButton href={s.specialtySite.url} variant="navy" external>
                専門サイトを見る
              </LinkButton>
            </div>
          </div>
        </section>
      )}

      {/* 関連サービス */}
      <section aria-labelledby="related" className="cv section bg-silver-50">
        <div className="container-x">
          <SectionHeading id="related" eyebrow="関連するサービス" title="合わせて相談されることの多い工事" />
          <ul className="scroller mt-9 gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r, i) => (
              <li key={r.slug} {...reveal(i * 80)}>
                <ServicePhotoCard service={r} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand id={`cta-${s.slug}`} />

      <JsonLd data={serviceSchema({ name: s.name, slug: s.slug, summary: s.summary, image: img(s.image).src, h1: s.h1 })} />
      <JsonLd data={faqSchema(s.faqs)} />
    </>
  );
}
