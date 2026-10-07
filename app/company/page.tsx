import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Photo, PhotoFill } from "@/components/ui/Photo";
import { SectionHeading, SectionSplit } from "@/components/ui/SectionHeading";
import { photoCredits } from "@/data/company";
import { serviceCategories, servicesByCategory } from "@/data/services";
import { reveal } from "@/lib/reveal";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, primaryPhone, mobilePhone, telHref, receptionHours, officeAddressWithPostal, officeMapUrl, mapEmbedUrl, type OfficeKey } from "@/lib/site";

/**
 * 会社案内
 * 役割：会社の実在と信頼性を確かめてもらうページ（広告のページにしない）。
 *       会社の考え方・施工の姿勢・会社概要・事業所・対応工事・実際の現場の写真を、順に示す。
 * 担当する検索意図：横浜総合住設／株式会社横浜総合住設 会社概要／横浜総合住設 評判・所在地
 * 会社概要の表は、lib/site.ts に値がある項目だけが出る（代表者・設立・許認可などは未確認のため空）。
 * 愛称（ヨコジュウ）は、1か所で紹介するだけにとどめる。
 */
export const metadata: Metadata = buildMetadata({
  title: "会社案内｜株式会社 横浜総合住設",
  description:
    "株式会社 横浜総合住設（YOKOHAMA Total Housing Solutions）の会社案内です。本社は相模原市南区、オフィスは横浜市戸塚区深谷町。住宅設備工事・太陽光発電・外壁塗装・リフォーム・造園まで、住まいをトータルでサポートします。",
  path: "/company",
  keywords: ["横浜総合住設", "株式会社横浜総合住設", "横浜総合住設 会社概要", "ヨコジュウ"],
});

/** 会社の資料（チラシ・Instagram）に書かれている、仕事の進め方 */
const POLICY = [
  { title: "見積もりは無料、現地調査にうかがいます", body: "現地で設置場所と配管を確かめてから、内訳の分かる見積書をお出しします。" },
  { title: "ご相談から施工まで、一貫して", body: "ご相談を受けた当社が、現地調査から工事の完了まで、責任を持って担当します。" },
  { title: "メーカーの正規品を取り扱います", body: "給湯器やエアコンなどの機器は、メーカーの正規品を取り扱っています。" },
  { title: "補助金の申請をサポートします", body: "使える制度があるかを調べ、申請の進め方までご案内します。" },
  { title: "工事のあとも、ご相談ください", body: "使い始めてから気になることがあれば、施工した当社が窓口になります。" },
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

  // 会社概要（値のある項目だけ）
  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "会社名",
      value: (
        <>
          {siteConfig.name}
          <span className="block text-sm text-ink-mute">{siteConfig.nameEn}</span>
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
                {hours && <span className="ml-3 text-sm text-ink-mute">受付 {hours}</span>}
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
        title="会社案内"
        lead={`${siteConfig.name}は、住宅設備の工事を軸に、住まいに関わる工事をお引き受けしている会社です。本社は相模原市南区、戸塚オフィスは横浜市戸塚区深谷町にあります。`}
        crumbs={[{ name: "会社案内", href: "/company" }]}
      />

      <div className="section bg-white">
        <div className="container-x space-y-14 lg:space-y-20">
          {/* 会社の考え方 */}
          <SectionSplit heading={<SectionHeading id="about" title="会社の考え方" />}>
            {/* 会社が掲げていない標語や、作った言い回しは書かない。扱う工事と、仕事の進め方を書く */}
            <p className="text-[1.125rem] font-bold leading-[1.9] text-ink sm:text-[1.25rem]" {...reveal()}>
              住宅設備の工事を軸に、住まいに関わる工事を幅広くお引き受けしています。
            </p>
            <div className="mt-6 space-y-5 text-[0.9688rem] leading-[2.1]" {...reveal(60)}>
              <p>
                給湯器・エアコン・トイレ・コンロなどの設備の交換から、太陽光発電、外壁の塗り替え、リフォーム、庭の手入れまで。分野が違っても、進め方は同じです。現地を見て、できる方法を探し、仕上げまで担当します。
              </p>
              <p>別の業者に断られた工事でも、一度ご相談ください。高い場所でのエアコンの取替のように、現地を確かめることで方法が見つかることがあります。できないときは、その理由をお伝えします。</p>
              <p className="text-sm text-ink-mute">
                社名が長いため、「{siteConfig.nickname}」という愛称でも呼ばれています。
              </p>
            </div>
          </SectionSplit>

          {/* 施工の姿勢 */}
          <SectionSplit heading={<SectionHeading id="policy" title="施工の姿勢" lead="見える部分も、完成後に見えなくなる部分も、同じように仕上げます。写真は、当社の施工現場で撮影したものです。" />}>
            <ul className="grid grid-cols-3 gap-2 sm:gap-3">
              {SITE_PHOTOS.map((p, i) => (
                <li key={p.image} {...reveal(i * 90, "wipe")}>
                  <figure>
                    <div className="relative aspect-[3/4] bg-silver-100">
                      <PhotoFill image={p.image} alt={p.alt} sizes="(min-width: 1024px) 20vw, 33vw" />
                    </div>
                    <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">{p.caption}</figcaption>
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
                  <div className="border border-silver-200">
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
                <li key={key} className="rule-top pt-4">
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
              <div className="mt-7 border border-silver-200">
                <iframe src={embed} title="横浜総合住設 戸塚オフィスの地図" loading="lazy" className="block aspect-[16/9] w-full" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
          </SectionSplit>

          {/* 対応工事 */}
          <SectionSplit heading={<SectionHeading id="services" title="対応工事" />}>
            <dl className="text-[0.9375rem] leading-[1.95]" {...reveal(60)}>
              {serviceCategories.map((cat, i) => (
                <div key={cat.id} className={`grid gap-x-9 gap-y-1 border-b border-silver-200 py-4 md:grid-cols-[11rem_1fr] ${i === 0 ? "border-t border-t-navy-900" : ""}`}>
                  <dt className="font-bold text-ink">{cat.name}</dt>
                  <dd className="flex flex-wrap gap-x-5 gap-y-1">
                    {servicesByCategory(cat.id).map((s) => (
                      <Link key={s.slug} href={`/service/${s.slug}`} className="text-link !font-normal">
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
      <section aria-labelledby="photos" className="cv border-t border-silver-200 bg-silver-50 py-10">
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
