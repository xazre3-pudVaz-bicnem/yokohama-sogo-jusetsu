import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { PhotoFill } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getArea, yokohamaWards } from "@/data/areas";
import { creditOf } from "@/data/company";
import { reveal } from "@/lib/reveal";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, officeAddressWithPostal, officeMapUrl, type OfficeKey } from "@/lib/site";

/**
 * 対応エリア
 * 役割：どこまで来てもらえるかを示し、地域ページ（戸塚区・横浜市）へ送る。
 * 担当する検索意図：横浜総合住設 対応エリア／戸塚区 住宅設備 業者 など
 * 書かないこと：地域ごとのくわしい話（/area/totsuka・/area/yokohama に任せる）。
 */
export const metadata: Metadata = buildMetadata({
  title: "対応エリア｜横浜市戸塚区を中心に神奈川・東京",
  description:
    "横浜総合住設の対応エリアです。横浜市戸塚区を中心に、横浜市の18区すべて、神奈川県・東京都のエリアで住宅設備の工事・リフォームを行っています。戸塚区深谷町にオフィスがあります。",
  path: "/area",
  keywords: ["横浜総合住設 対応エリア", "戸塚区 住宅設備", "横浜市 住宅設備 業者", "神奈川 リフォーム"],
});

export default function AreaIndexPage() {
  const totsuka = getArea("totsuka")!;
  const yokohama = getArea("yokohama")!;
  const credit = creditOf("area/totsuka-aerial");
  const offices: OfficeKey[] = ["totsuka", "head"];

  return (
    <>
      <PageHero
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

      {/* 最重点エリア：戸塚区 */}
      <section aria-labelledby="area-totsuka" className="section bg-white">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <figure {...reveal(0, "wipe")}>
            <div className="cut-tr relative aspect-[4/3] overflow-hidden rounded-lg bg-silver-100">
              <PhotoFill image={totsuka.image} alt={totsuka.imageAlt} sizes="(min-width: 1024px) 46vw, 100vw" priority />
              <span className="tag-slant tag-slant-blue absolute left-0 top-5">最重点エリア</span>
            </div>
            {credit && (
              <figcaption className="mt-2 text-[0.6875rem] text-ink-mute">
                写真：
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
          <div>
            <SectionHeading id="area-totsuka" eyebrow="横浜市戸塚区" title="オフィスのある戸塚区が、いちばんの対応エリアです。" lead="戸塚区は横浜市でもっとも広い区で、川沿いの低地と起伏に富んだ台地に住宅地が広がっています。敷地の条件が場所ごとに違う地域だからこそ、現地を見てから提案することを大切にしています。" />
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-silver-200 py-5" {...reveal(80)}>
              {totsuka.facts.slice(0, 2).map((f) => (
                <div key={f.label}>
                  <dt className="text-xs font-bold text-ink-mute">{f.label}</dt>
                  <dd className="num mt-0.5 text-2xl font-semibold text-navy-900">{f.value}</dd>
                  {f.note && <dd className="mt-0.5 text-[0.6875rem] leading-snug text-ink-mute">{f.note}</dd>}
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[0.8125rem] leading-[2] text-ink-body" {...reveal(100)}>
              <span className="font-bold text-ink">区内の町：</span>
              {totsuka.towns?.join("・")}
            </p>
            <div className="mt-7" {...reveal(140)}>
              <LinkButton href="/area/totsuka">戸塚区の住宅設備・リフォーム</LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* 横浜市 */}
      <section aria-labelledby="area-yokohama" className="cv section bg-silver-50">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <SectionHeading id="area-yokohama" eyebrow="横浜市" title="横浜市の18区すべてに、うかがいます。" lead={yokohama.lead} />
            <div className="mt-7" {...reveal(80)}>
              <LinkButton href="/area/yokohama" variant="navy">
                横浜市の対応エリアと支援制度
              </LinkButton>
            </div>
          </div>
          <ul className="grid grid-cols-3 gap-2 self-start sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-6" {...reveal(100)}>
            {yokohamaWards.map((w) =>
              w === totsuka.shortName ? (
                <li key={w}>
                  <Link href="/area/totsuka" className="flex min-h-12 items-center justify-center rounded-md bg-brand-600 px-2 text-center text-sm font-extrabold text-white transition-colors hover:bg-brand-700">
                    {w}
                  </Link>
                </li>
              ) : (
                <li key={w} className="flex min-h-12 items-center justify-center rounded-md border border-silver-200 bg-white px-2 text-center text-sm font-bold text-ink">
                  {w}
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* 神奈川・東京／拠点 */}
      <section aria-labelledby="area-wide" className="cv section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading id="area-wide" eyebrow="神奈川県・東京都" title="横浜市の外へも、ご相談ください。" />
            <div className="mt-6 space-y-4 text-[0.9688rem] leading-[2.05]" {...reveal(60)}>
              <p>戸塚区と接する藤沢市・鎌倉市をはじめ、神奈川県内の各地、東京都内でも工事を行っています。本社は相模原市南区にあります。</p>
              <p>工事の内容と場所によって、うかがえる日程が変わります。対応できるかどうかは、ご住所をお知らせいただければお答えします。</p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm font-bold" {...reveal(100)}>
              {["横浜市", "藤沢市", "鎌倉市", "相模原市", "神奈川県内", "東京都内"].map((t) => (
                <li key={t} className="chip chip-outline !text-sm">
                  <Icon name="mapPin" className="size-3.5 text-brand-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="拠点" title="2つの拠点から、うかがいます。" />
            <dl className="dl-spec mt-6 text-[0.9375rem]" {...reveal(60)}>
              {offices.map((key) => (
                <div key={key} className="sm:!grid-cols-[7.5rem_1fr]">
                  <dt>{siteConfig.offices[key].label}</dt>
                  <dd>
                    {officeAddressWithPostal(key)}
                    <a href={officeMapUrl(key)} target="_blank" rel="noopener noreferrer" className="text-link ml-2 inline-flex items-center gap-1 text-sm">
                      地図
                      <Icon name="arrowUpRight" className="size-3.5" />
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-mute">ご来社の際は、事前にお電話でご連絡ください。</p>
          </div>
        </div>
      </section>

      <CtaBand id="cta-area" />
    </>
  );
}
