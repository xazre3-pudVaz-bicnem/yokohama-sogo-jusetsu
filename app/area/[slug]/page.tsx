import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostRow } from "@/components/cards/PostCard";
import { WorkCard } from "@/components/cards/WorkCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { SubsidyCaution, SubsidyNote } from "@/components/sections/SubsidyNote";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { Icon } from "@/components/ui/Icon";
import { LinkButton, PhoneButton } from "@/components/ui/Button";
import { PhotoHero } from "@/components/ui/PageHero";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaffTip } from "@/components/ui/StaffTip";
import { getArea, publishedAreas, yokohamaWards } from "@/data/areas";
import { creditOf } from "@/data/company";
import { getService } from "@/data/services";
import { subsidies } from "@/data/subsidies";
import { worksByArea, worksSorted } from "@/data/works";
import { ACCENT_SOFT } from "@/lib/accent";
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
      >
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton href="/contact" icon="document">
            無料見積もりを依頼する
          </LinkButton>
          <PhoneButton variant="white" />
        </div>
      </PhotoHero>

      {/* 基礎データ */}
      <section aria-label={`${a.shortName}の基礎データ`} className="border-b border-silver-200 bg-white">
        <div className="container-x py-8 lg:py-10">
          <dl className={`grid gap-x-8 gap-y-6 sm:grid-cols-2 ${a.facts.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
            {a.facts.map((f, i) => (
              <div key={f.label} className="border-l-2 border-brand-600 pl-4" {...reveal(i * 60)}>
                <dt className="text-xs font-bold tracking-wider text-ink-mute">{f.label}</dt>
                <dd className={`mt-1 font-semibold text-navy-900 ${/^[0-9]/.test(f.value) ? "num text-[1.6rem] leading-tight" : "text-[1.0625rem] leading-snug"}`}>
                  <Phrase>{f.value}</Phrase>
                </dd>
                {f.note && <dd className="mt-1 text-[0.6875rem] leading-snug text-ink-mute">{f.note}</dd>}
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* この地域にしか当てはまらない内容 */}
      {a.sections.map((sec, si) => (
        <section key={sec.id} aria-labelledby={sec.id} className={`${si > 0 ? "cv" : ""} section ${si % 2 === 0 ? "bg-white" : "bg-silver-50"}`}>
          <div className={`container-x grid gap-10 ${sec.items ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16" : ""}`}>
            <div className={sec.items ? "" : "mx-auto w-full max-w-[52rem]"}>
              <SectionHeading id={sec.id} eyebrow={si === 0 ? `${a.shortName}の住まいと工事` : undefined} title={sec.heading} />
              <div className="mt-6 space-y-5 text-[0.9688rem] leading-[2.05]" {...reveal(60)}>
                {sec.body.map((p) => (
                  <p key={p.slice(0, 16)}>{p}</p>
                ))}
              </div>
              {sec.id === "office" && (
                <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-silver-200 bg-white px-4 py-3 text-sm" {...reveal(100)}>
                  <Icon name="mapPin" className="size-4 text-brand-600" />
                  <span className="font-bold text-ink">戸塚オフィス</span>
                  <span>{officeAddressWithPostal("totsuka")}</span>
                  <a href={officeMapUrl("totsuka")} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1">
                    地図
                    <Icon name="arrowUpRight" className="size-3.5" />
                  </a>
                </p>
              )}
            </div>
            {sec.items && (
              <ol className="rows self-start">
                {sec.items.map((it, i) => (
                  <li key={it.title} className="flex gap-4 py-5 sm:gap-5" {...reveal(i * 70)}>
                    <span className="num w-9 shrink-0 pt-0.5 text-2xl font-semibold leading-none text-brand-600">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1">
                      <h3 className="text-[1.0625rem] font-extrabold leading-snug"><Phrase>{it.title}</Phrase></h3>
                      <p className="mt-2 text-[0.9375rem] leading-[1.95]">{it.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      ))}

      {/* 町名・駅（区のページ） */}
      {(a.towns || a.stations) && (
        <section aria-labelledby="towns" className="cv section-tight bg-navy-900 text-white">
          <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-14">
            <SectionHeading id="towns" onDark eyebrow="うかがう範囲" title={`${a.shortName}の全域に対応しています。`} />
            <div className="space-y-6" {...reveal(60)}>
              {a.towns && (
                <div>
                  <p className="text-xs font-bold tracking-widest text-sky-300">町名</p>
                  <p className="mt-2 text-[0.9375rem] leading-[2.1] text-silver-100">{a.towns.join("・")}</p>
                </div>
              )}
              {a.stations && (
                <div>
                  <p className="text-xs font-bold tracking-widest text-sky-300">区内の駅</p>
                  <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-silver-100">
                    {a.stations.map((s) => (
                      <li key={s.name} className="flex flex-wrap gap-x-3">
                        <span className="font-bold text-white">{s.name}</span>
                        <span className="text-sm text-silver-300">{s.lines}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {a.neighbors && (
                <div>
                  <p className="text-xs font-bold tracking-widest text-sky-300">隣り合う区・市</p>
                  <p className="mt-2 text-[0.9375rem] leading-[2.1] text-silver-100">{a.neighbors.join("・")}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 18区（市のページ） */}
      {isCity && (
        <section aria-labelledby="wards" className="cv section-tight bg-navy-900 text-white">
          <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-14">
            <SectionHeading id="wards" onDark eyebrow="うかがう範囲" title="横浜市の18区すべてに対応しています。" />
            <ul className="grid grid-cols-3 gap-2 self-start sm:grid-cols-6" {...reveal(60)}>
              {yokohamaWards.map((w) =>
                w === "戸塚区" ? (
                  <li key={w}>
                    <Link href="/area/totsuka" className="flex min-h-12 items-center justify-center rounded-md bg-sky-400 px-2 text-center text-sm font-extrabold text-navy-950 transition-colors hover:bg-white">
                      {w}
                    </Link>
                  </li>
                ) : (
                  <li key={w} className="flex min-h-12 items-center justify-center rounded-md border border-white/20 px-2 text-center text-sm font-bold text-silver-100">
                    {w}
                  </li>
                ),
              )}
            </ul>
          </div>
        </section>
      )}

      {/* サービス × 地域 */}
      <section aria-labelledby="area-services" className="cv section bg-white">
        <div className="container-x">
          <SectionHeading id="area-services" eyebrow={`${a.shortName} × 工事の種類`} title={`${a.shortName}で、この工事を頼むときに。`} lead="工事の種類ごとに、この地域ならではの確認点をまとめました。くわしい内容は、それぞれのサービスページでご案内しています。" />
          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {a.serviceNotes.map((n, i) => {
              const s = getService(n.service);
              if (!s) return null;
              return (
                <li key={n.service} {...reveal((i % 4) * 70)}>
                  <Link href={`/service/${s.slug}`} className="group flex h-full flex-col rounded-lg border border-silver-200 bg-white p-5 transition-shadow duration-300 hover:shadow-[var(--shadow-card)] sm:p-6">
                    <span className={`grid size-11 place-items-center rounded-md ${ACCENT_SOFT[s.accent]}`}>
                      <Icon name={s.icon} className="size-5" />
                    </span>
                    <h3 className="mt-4 text-[1.0625rem] font-extrabold leading-snug text-ink transition-colors group-hover:text-brand-700"><Phrase>{n.title}</Phrase></h3>
                    <p className="mt-2.5 flex-1 text-sm leading-[1.9] text-ink-body">{n.body}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
                      {s.shortName}のページへ
                      <Icon name="arrowRight" className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-10 lg:mt-12">
            <StaffTip pose="illust/people-staff-point-2">
              {isCity
                ? "市の制度には、工事の前に申請が必要なものがあります。「替えようかな」と思った段階でご相談いただくと、使える制度を逃さずに済みます。"
                : "戸塚区は、敷地ごとに条件がまったく違います。写真だけでは分からないことも多いので、まずは現地を見せてください。お見積もりは無料です。"}
            </StaffTip>
          </div>
        </div>
      </section>

      {/* 市の支援制度（市のページ） */}
      {localSubsidies.length > 0 && (
        <section aria-labelledby="subsidy" className="cv section bg-silver-50">
          <div className="container-x">
            <SectionHeading id="subsidy" eyebrow="横浜市の支援制度" title="横浜市で使える制度" lead="横浜市が行っている、住宅の省エネに関する事業です。公式ページで確認できた内容を、確認日つきで掲載しています。" />
            <div className="mt-9 grid gap-5 lg:grid-cols-2">
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
      <section aria-labelledby="area-works" className={`cv section ${localSubsidies.length > 0 ? "bg-white" : "bg-silver-50"}`}>
        <div className="container-x">
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
            <SectionHeading
              id="area-works"
              eyebrow="施工事例"
              title={areaWorks.length > 0 ? `${a.shortName}の施工事例` : "当社の施工事例"}
              lead={areaWorks.length > 0 ? `${a.name}で当社が施工した現場です。` : "当社が実際に施工した現場の写真です。地域ごとの事例は、順次追加していきます。"}
            />
            <Link href="/works" className="link-arrow shrink-0" {...reveal(80)}>
              施工事例をすべて見る
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <ul className="scroller mt-9 gap-x-5 gap-y-10 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {(areaWorks.length > 0 ? areaWorks : worksSorted).slice(0, 4).map((w, i) => (
              <li key={w.slug} {...reveal(i * 80)}>
                <WorkCard work={w} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* よくある質問 */}
      <section aria-labelledby="faq" className={`cv section ${localSubsidies.length > 0 ? "bg-silver-50" : "bg-white"}`}>
        <div className="container-narrow">
          <SectionHeading id="faq" eyebrow="よくある質問" title={`${a.shortName}での工事についての質問`} />
          <div className="mt-8" {...reveal(60)}>
            <FaqList faqs={a.faqs} />
          </div>
        </div>
      </section>

      {/* 関連コラム */}
      {posts.length > 0 && (
        <section aria-labelledby="area-columns" className="cv section-tight bg-white">
          <div className="container-narrow">
            <SectionHeading id="area-columns" eyebrow="関連コラム" title={`${a.shortName}の住まいに関するコラム`} />
            <ul className="rows mt-7" {...reveal(60)}>
              {posts.map((p) => (
                <li key={p.slug}>
                  <PostRow post={p} />
                </li>
              ))}
            </ul>
            <Link href={getPostsByCluster(a.slug).length > 0 ? `/blog/category/${a.slug}` : "/blog"} className="link-arrow mt-6">
              {getPostsByCluster(a.slug).length > 0 ? `「${a.shortName}」のコラム一覧` : "住宅設備コラムを見る"}
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* 出典 */}
      <section aria-labelledby="sources" className="cv border-t border-silver-200 bg-silver-50 py-10">
        <div className="container-narrow">
          <h2 id="sources" className="text-sm font-bold text-ink">
            このページの出典
          </h2>
          <p className="mt-1 text-xs text-ink-mute">
            地域の統計と制度の内容は、次の公式ページで <time dateTime={a.checkedAt}>{formatDateJa(a.checkedAt)}</time> に確認しました。人口・世帯数は毎月更新されます。
          </p>
          <ul className="mt-3 grid gap-x-6 gap-y-1 text-[0.8125rem] sm:grid-cols-2">
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
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
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
