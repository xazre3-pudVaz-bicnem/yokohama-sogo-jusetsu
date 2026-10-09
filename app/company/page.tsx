import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { LineIcon } from "@/components/ui/LineIcon";
import { PageHero } from "@/components/ui/PageHero";
import { Photo, PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading, SectionSplit } from "@/components/ui/SectionHeading";
import { photoCredits } from "@/data/company";
import { greeting, representativeLabel } from "@/data/greeting";
import { serviceCategories, servicePath, servicesByCategory } from "@/data/services";
import { reveal } from "@/lib/reveal";
import { keywordsFor } from "@/data/seo-keyword-map";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, primaryPhone, mobilePhone, telHref, lineUrl, receptionHours, officeAddressWithPostal, officeMapUrl, mapEmbedUrl, type OfficeKey } from "@/lib/site";

/**
 * 会社案内
 * 役割：会社の実在と信頼性を確かめてもらうページ（広告のページにしない）。
 *       代表挨拶・施工の姿勢・会社概要・事業所・対応工事・実際の現場の写真を、順に示す。
 * 取りにいく検索語と検索意図は data/seo-keyword-map.ts に書く。
 * 代表挨拶の文章と写真は data/greeting.ts（代表ご本人から受け取ったもの。ここで言い換えない）。
 * 会社概要の表は、lib/site.ts に値がある項目だけが出る（設立・許認可などは未確認のため空）。
 * 愛称（ヨコジュウ）は、1か所で紹介するだけにとどめる。
 */
export const metadata: Metadata = buildMetadata({
  title: "会社案内｜株式会社 横浜総合住設",
  description:
    "株式会社 横浜総合住設（YOKOHAMA Total Housing Solutions）の会社案内です。代表挨拶、会社概要、本社（相模原市南区）と戸塚オフィス（横浜市戸塚区深谷町）の所在地、対応工事、施工の姿勢を掲載しています。",
  path: "/company",
  keywords: keywordsFor("/company"),
});

/** 会社の資料（チラシ・Instagram）に書かれている、仕事の進め方 */
const POLICY = [
  { title: "見積もりは無料、現地調査にうかがいます", body: "現地で設置場所と配管を確かめてから、内訳の分かる見積書をお出しします。" },
  { title: "ご相談から施工まで、一貫して", body: "ご相談を受けた当社が、現地調査から工事の完了まで、責任を持って担当します。" },
  { title: "メーカーの正規品を取り扱います", body: "給湯器やエアコンなどの機器は、メーカーの正規品を取り扱っています。" },
  { title: "補助金の申請をサポートします", body: "使える制度があるかを調べ、申請の進め方までご案内します。" },
  { title: "工事のあとも、ご相談ください", body: "使い始めてから気になることがあれば、施工した当社が窓口になります。" },
  {
    title: "他社で断られた工事も、ご相談ください",
    body: "高い場所でのエアコンの取替のように、現地を確かめることで方法が見つかることがあります。できないときは、その理由をお伝えします。",
  },
];

/** 施工の姿勢を示す、当社の現場の写真 */
const SITE_PHOTOS = [
  { image: "works/floor-protection", alt: "工事の前に、床一面を養生シートで覆った室内", caption: "工事の前に、床を養生する" },
  { image: "works/bath-dryer-working", alt: "養生した浴室で、天井の点検口から作業するスタッフ", caption: "浴室暖房乾燥機の取替作業" },
  { image: "works/lagging-4", alt: "配管の曲がりの部分。板を分けて曲がりに沿わせたラッキングカバー", caption: "曲がりの部分まで形を合わせる" },
] as const;

export default function CompanyPage() {
  const phone = primaryPhone();
  const mobile = mobilePhone();
  const hours = receptionHours();
  const c = siteConfig.company;
  const t = siteConfig.trust;
  const offices: OfficeKey[] = ["head", "totsuka"];
  const embed = mapEmbedUrl();
  const line = lineUrl();
  const rep = representativeLabel();

  // 会社概要（値のある項目だけ）
  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "会社名",
      value: (
        <>
          {siteConfig.name}
          <span className="block text-sm text-ink-mute">{siteConfig.nameEn}</span>
          <span className="block text-sm text-ink-mute">愛称：{siteConfig.nickname}</span>
        </>
      ),
    },
    ...(c.representative ? [{ label: c.representativeTitle ?? "代表者", value: c.representative }] : []),
    ...(c.founded ? [{ label: "設立", value: c.founded }] : []),
    ...(c.capital ? [{ label: "資本金", value: c.capital }] : []),
    ...(c.employees ? [{ label: "従業員数", value: c.employees }] : []),
    ...(c.corporateNumber ? [{ label: "法人番号", value: c.corporateNumber }] : []),
    ...offices.map((key) => ({ label: siteConfig.offices[key].label, value: officeAddressWithPostal(key) })),
    ...(phone
      ? [
          {
            label: "電話",
            value: (
              <>
                <a href={telHref(phone)} className="num text-lg font-medium tracking-wider text-navy-900 hover:text-brand-700" data-cv="tel">
                  {phone}
                </a>
                {hours && <span className="ml-3 inline-block text-sm text-ink-mute">受付 {hours}</span>}
              </>
            ),
          },
        ]
      : []),
    ...(mobile
      ? [
          {
            label: "携帯電話",
            value: (
              <a href={telHref(mobile)} className="num text-lg font-medium tracking-wider text-navy-900 hover:text-brand-700" data-cv="tel">
                {mobile}
              </a>
            ),
          },
        ]
      : []),
    ...(siteConfig.contact.contactEmail ? [{ label: "メール", value: siteConfig.contact.contactEmail }] : []),
    {
      label: "事業内容",
      value: (
        <ul className="dash-list space-y-1">
          {c.business.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      ),
    },
    { label: "対応エリア", value: "横浜市戸塚区を中心に、横浜市全域、神奈川県・東京都" },
    ...(t.licenses ? [{ label: "許認可", value: t.licenses }] : []),
    ...(t.qualifications ? [{ label: "有資格者", value: t.qualifications }] : []),
    ...(t.warranty ? [{ label: "保証", value: t.warranty }] : []),
    ...(t.insurance ? [{ label: "工事保険", value: t.insurance }] : []),
    ...(t.makers.length ? [{ label: "取扱メーカー", value: t.makers.join("、") }] : []),
    ...(line
      ? [
          {
            label: "LINE",
            value: (
              <>
                <a href={line} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1.5" data-cv="line">
                  <LineIcon className="size-[1.125rem]" />
                  LINE 公式アカウント（友だち追加）
                  <Icon name="arrowUpRight" className="size-3.5 shrink-0" />
                </a>
                {siteConfig.social.lineId && <span className="mt-0.5 block text-sm text-ink-mute">ID {siteConfig.social.lineId}</span>}
              </>
            ),
          },
        ]
      : []),
    ...(siteConfig.social.instagram
      ? [
          {
            label: "Instagram",
            value: (
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1 break-all">
                @{siteConfig.social.instagramHandle}
                <Icon name="arrowUpRight" className="size-3.5 shrink-0" />
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHero
        illust="illust/people-staff-ok"
        title="会社案内"
        lead={`${siteConfig.name}は、住宅設備の工事を軸に、住まいに関わる工事をお引き受けしている会社です。本社は相模原市南区、戸塚オフィスは横浜市戸塚区深谷町にあります。`}
        crumbs={[{ name: "会社案内", href: "/company" }]}
      />

      <div className="section bg-white">
        <div className="container-x space-y-14 lg:space-y-20">
          {/* 代表挨拶（代表ご本人の文章。data/greeting.ts） */}
          {rep && (
            <SectionSplit
              heading={
                <>
                  <SectionHeading id="message" title="代表挨拶" />
                  <figure className="mt-7 max-w-[15rem] pl-3 pt-3 lg:max-w-[17rem]" {...reveal(80)}>
                    <div className="photo-frame">
                      <div className="photo-card">
                        <Photo image={greeting.photo} alt={`${siteConfig.name} ${rep}`} sizes="(min-width: 1024px) 272px, 240px" />
                      </div>
                    </div>
                    <figcaption className="mt-4 leading-snug">
                      <span className="block text-xs text-ink-mute">{siteConfig.name}</span>
                      <span className="mt-1 block text-[0.8125rem] text-ink-body">
                        {c.representativeTitle}
                        <span className="ml-2 font-heading text-[1.125rem] font-bold tracking-wider text-ink">{c.representative}</span>
                      </span>
                    </figcaption>
                  </figure>
                </>
              }
            >
              <p className="font-heading text-[1.25rem] font-bold leading-[1.75] text-ink sm:text-[1.5rem]" {...reveal()}>
                <span className="marker">
                  <Phrase>{greeting.title}</Phrase>
                </span>
              </p>
              <div className="mt-7 space-y-5 text-[0.9688rem] leading-[2.1]" {...reveal(60)}>
                {greeting.blocks.map((b, i) =>
                  b.type === "p" ? (
                    <p key={i}>{b.text}</p>
                  ) : (
                    <ul key={i} className="space-y-2.5 py-1.5">
                      {b.items.map((v) => (
                        <li key={v} className="w-fit rounded-2xl rounded-bl-md bg-brand-50 px-4 py-2 text-[0.9375rem] font-bold leading-[1.75] text-navy-900 text-balance">
                          <Phrase>{`「${v}」`}</Phrase>
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
              <p className="mt-8 text-right leading-snug" {...reveal(60)}>
                <span className="block text-sm">{siteConfig.name}</span>
                <span className="mt-1.5 block text-sm">
                  {c.representativeTitle}
                  <span className="ml-3 font-heading text-[1.25rem] font-bold tracking-widest text-ink">{c.representative}</span>
                </span>
              </p>
            </SectionSplit>
          )}

          {/* 施工の姿勢 */}
          <SectionSplit heading={<SectionHeading id="policy" title="施工の姿勢" lead="見える部分も、完成後に見えなくなる部分も、同じように仕上げます。写真は、当社の施工現場で撮影したものです。" />}>
            <ul className="grid grid-cols-3 gap-2 sm:gap-3">
              {SITE_PHOTOS.map((p, i) => (
                <li key={p.image} {...reveal(i * 90, "wipe")}>
                  <figure>
                    <div className="photo-card-sm relative aspect-[3/4]">
                      <PhotoFill image={p.image} alt={p.alt} sizes="(min-width: 1024px) 20vw, 33vw" />
                    </div>
                    {/* 3枚を横に並べるので、スマホでは1行に 9 字ほどしか入らない。文節の切れ目で折り返す */}
                    <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">
                      <Phrase>{p.caption}</Phrase>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <ul className="rows mt-9" {...reveal(60)}>
              {POLICY.map((p) => (
                <li key={p.title} className="grid gap-x-9 gap-y-1.5 py-5 md:grid-cols-[17rem_1fr]">
                  <h3 className="text-base font-bold leading-[1.75]">{p.title}</h3>
                  <p className="text-[0.9375rem] leading-[1.95]">{p.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-7 flex flex-wrap gap-x-9 gap-y-3">
              <Link href="/works" className="link-arrow">
                施工事例
                <Icon name="arrowRight" className="size-4" />
              </Link>
              <Link href="/flow" className="link-arrow">
                工事の流れ
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </p>
          </SectionSplit>

          {/* 会社概要 */}
          <SectionSplit
            heading={
              <>
                <SectionHeading id="outline" title="会社概要" />
                <figure className="mt-6 max-w-xs" {...reveal(80)}>
                  <div className="photo-card-sm shadow-card">
                    <Photo image="company/nameplate" alt="「株式会社 横浜総合住設」と書かれた表札" sizes="(min-width: 1024px) 24vw, 80vw" />
                  </div>
                  <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">事業所の表札</figcaption>
                </figure>
              </>
            }
          >
            <dl className="dl-spec text-[0.9375rem]" {...reveal(60)}>
              {rows.map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
          </SectionSplit>

          {/* 事業所 */}
          <SectionSplit heading={<SectionHeading id="offices" title="本社・戸塚オフィス" />}>
            <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2" {...reveal(60)}>
              {offices.map((key) => (
                <li key={key} className="card card-line p-5">
                  <h3 className="text-base font-bold">{siteConfig.offices[key].label}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-[1.9]">{officeAddressWithPostal(key)}</p>
                  <p className="mt-2">
                    <a href={officeMapUrl(key)} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1 text-sm">
                      地図
                      <Icon name="arrowUpRight" className="size-3.5" />
                    </a>
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-mute">ご来社の際は、事前にお電話でご連絡ください。</p>
            {/* Googleビジネスプロフィールの埋め込み URL が設定されたときだけ地図を出す */}
            {embed && (
              <div className="photo-card mt-7">
                <iframe src={embed} title="横浜総合住設 戸塚オフィスの地図" loading="lazy" className="block aspect-[16/9] w-full" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
          </SectionSplit>

          {/* 対応工事 */}
          <SectionSplit heading={<SectionHeading id="services" title="対応工事" />}>
            <dl className="text-[0.9375rem] leading-[1.95]" {...reveal(60)}>
              {serviceCategories.map((cat, i) => (
                <div key={cat.id} className={`grid gap-x-9 gap-y-1 py-4 md:grid-cols-[11rem_1fr] ${i === 0 ? "" : "border-t-2 border-dotted border-silver-300"}`}>
                  <dt className="font-bold text-ink">{cat.name}</dt>
                  <dd className="flex flex-wrap gap-x-5 gap-y-1">
                    {servicesByCategory(cat.id).map((s) => (
                      <Link key={s.slug} href={servicePath(s)} className="text-link !font-normal">
                        {s.name}
                      </Link>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 flex flex-wrap gap-x-9 gap-y-3">
              <Link href="/service" className="link-arrow">
                サービス一覧
                <Icon name="arrowRight" className="size-4" />
              </Link>
              <Link href="/business" className="link-arrow">
                法人・工務店の方へ
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </p>
          </SectionSplit>
        </div>
      </div>

      {/* 写真について */}
      <section aria-labelledby="photos" className="cv bg-paper-2 py-10">
        <div className="container-x">
          <h2 id="photos" className="text-sm font-bold text-ink">
            このサイトの写真について
          </h2>
          <p className="mt-2 max-w-4xl text-[0.8125rem] leading-[1.95] text-ink-body">
            施工事例のページ、および「当社施工」「当社の現場」と記した写真は、当社の施工現場で撮影したものです。サービス紹介のページの冒頭などでは、設備や工事の内容をお伝えするためのイメージ写真も使用しています。地域のページの写真の出典は次のとおりです。
          </p>
          <ul className="mt-3 space-y-1 text-[0.8125rem] text-ink-body">
            {photoCredits.map((p) => (
              <li key={p.image}>
                「{p.title}」{p.author}（
                <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-link !font-normal">
                  {p.license}
                </a>
                ）／{p.changes}／
                <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-link !font-normal">
                  出典
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand id="cta-company" />
    </>
  );
}
