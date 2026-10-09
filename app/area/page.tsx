import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { PhotoFill } from "@/components/ui/Photo";
import { SectionHeading, SectionSplit } from "@/components/ui/SectionHeading";
import { getArea, yokohamaWards } from "@/data/areas";
import { creditOf } from "@/data/company";
import { reveal } from "@/lib/reveal";
import { keywordsFor } from "@/data/seo-keyword-map";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, officeAddressWithPostal, officeMapUrl, type OfficeKey } from "@/lib/site";

/**
 * 対応エリア
 * 役割：どこまで来てもらえるかを示し、地域ページ（戸塚区・横浜市）へ送る。
 * 取りにいく検索語と検索意図は data/seo-keyword-map.ts に書く。
 * 書かないこと：地域ごとのくわしい話（/area/totsuka・/area/yokohama に任せる）。
 */
export const metadata: Metadata = buildMetadata({
  title: "対応エリア｜横浜市戸塚区を中心に神奈川・東京",
  description:
    "横浜総合住設の対応エリアです。横浜市戸塚区を中心に、横浜市の18区すべて、神奈川県・東京都のエリアで住宅設備の工事・リフォームを行っています。戸塚区深谷町にオフィスがあります。",
  path: "/area",
  keywords: keywordsFor("/area"),
});

export default function AreaIndexPage() {
  const totsuka = getArea("totsuka")!;
  const yokohama = getArea("yokohama")!;
  const credit = creditOf("area/totsuka-aerial");
  const offices: OfficeKey[] = ["totsuka", "head"];

  return (
    <>
      <PageHero
        illust="illust/people-staff-point"
        eyebrow="対応エリア"
        title={
          <>
            <span className="ib">戸塚区を中心に、</span>
            <span className="ib">横浜市全域・神奈川・東京へ。</span>
          </>
        }
        lead="横浜総合住設は、横浜市戸塚区にオフィスを置き、横浜を中心に神奈川・東京エリアで工事を行っています。お見積もりは無料で、現地調査にうかがいます。"
        crumbs={[{ name: "対応エリア", href: "/area" }]}
      />

      {/* 戸塚区 */}
      <section aria-labelledby="area-totsuka" className="section bg-white">
        <div className="container-x grid gap-x-12 gap-y-9 lg:grid-cols-12 lg:items-start">
          <figure className="lg:col-span-6" {...reveal(0, "wipe")}>
            <div className="photo-card relative aspect-[3/2]">
              <PhotoFill image={totsuka.image} alt={totsuka.imageAlt} sizes="(min-width: 1024px) 48vw, 100vw" priority className="object-[50%_40%]" />
            </div>
            {credit && (
              <figcaption className="mt-2 text-[0.6875rem] text-ink-mute">
                戸塚駅周辺。写真：
                <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {credit.author}
                </a>
                （
                <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {credit.license}
                </a>
                ）
              </figcaption>
            )}
          </figure>
          <div className="lg:col-span-6">
            <SectionHeading
              id="area-totsuka"
              title="横浜市戸塚区"
              lead="オフィスのある戸塚区が、いちばんの対応エリアです。戸塚区は横浜市でもっとも広い区で、川沿いの低地と起伏に富んだ台地に住宅地が広がっています。敷地の条件が場所ごとに違うため、現地を見てからご提案しています。"
            />
            <dl className="mt-6 grid grid-cols-2 gap-3" {...reveal(80)}>
              {totsuka.facts.slice(0, 2).map((f) => (
                <div key={f.label} className="rounded-2xl bg-mist px-4 py-3.5">
                  <dt className="text-xs font-bold text-ink-mute">{f.label}</dt>
                  <dd className="num mt-0.5 text-[1.5rem] font-medium text-navy-900">{f.value}</dd>
                  {f.note && <dd className="mt-0.5 text-[0.6875rem] leading-snug text-ink-mute">{f.note}</dd>}
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[0.8125rem] leading-[2] text-ink-body" {...reveal(100)}>
              <span className="font-bold text-ink">区内の町：</span>
              {totsuka.towns?.join("・")}
            </p>
            <p className="mt-7" {...reveal(140)}>
              <Link href="/area/totsuka" className="link-arrow">
                戸塚区の住宅設備・リフォーム
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 横浜市・神奈川・東京・拠点 */}
      <section aria-label="横浜市・神奈川県・東京都" className="cv section band band-cream deco-tr">
        <div className="container-x space-y-14 lg:space-y-16">
          <SectionSplit heading={<SectionHeading id="area-yokohama" title="横浜市" lead="横浜市の18区すべてにうかがいます。" />}>
            <p className="text-[0.9688rem] leading-[2.05]" {...reveal(60)}>
              {yokohama.lead}
            </p>
            <ul className="mt-6 grid grid-cols-3 border-l border-t border-silver-300 text-center text-sm font-bold text-ink sm:grid-cols-6" {...reveal(80)}>
              {yokohamaWards.map((w) => (
                <li key={w} className="border-b border-r border-silver-300 bg-white">
                  {w === totsuka.shortName ? (
                    <Link href="/area/totsuka" className="flex min-h-12 items-center justify-center bg-navy-900 px-2 text-white transition-colors hover:bg-navy-700">
                      {w}
                    </Link>
                  ) : (
                    <span className="flex min-h-12 items-center justify-center px-2">{w}</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-7" {...reveal(120)}>
              <Link href="/area/yokohama" className="link-arrow">
                横浜市の対応エリアと支援制度
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </p>
          </SectionSplit>

          <SectionSplit heading={<SectionHeading id="area-wide" title="神奈川県・東京都" />}>
            <div className="space-y-4 text-[0.9688rem] leading-[2.05]" {...reveal(60)}>
              <p>戸塚区と接する藤沢市・鎌倉市をはじめ、神奈川県内の各地、東京都内でも工事を行っています。本社は相模原市南区にあります。</p>
              <p>工事の内容と場所によって、うかがえる日程が変わります。対応できるかどうかは、ご住所をお知らせいただければお答えします。</p>
            </div>
          </SectionSplit>

          <SectionSplit heading={<SectionHeading title="拠点" />}>
            <dl className="dl-spec text-[0.9375rem]" {...reveal(60)}>
              {offices.map((key) => (
                <div key={key} className="sm:!grid-cols-[7.5rem_1fr]">
                  <dt>{siteConfig.offices[key].label}</dt>
                  <dd>
                    {officeAddressWithPostal(key)}
                    <a href={officeMapUrl(key)} target="_blank" rel="noopener noreferrer" className="text-link ml-3 inline-flex items-center gap-1 text-sm">
                      地図
                      <Icon name="arrowUpRight" className="size-3.5" />
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-mute">ご来社の際は、事前にお電話でご連絡ください。</p>
          </SectionSplit>
        </div>
      </section>

      <CtaBand id="cta-area" />
    </>
  );
}
