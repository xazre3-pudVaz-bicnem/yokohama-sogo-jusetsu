import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Photo } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photoCredits } from "@/data/company";
import { reveal } from "@/lib/reveal";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, primaryPhone, mobilePhone, telHref, receptionHours, officeAddressWithPostal, officeMapUrl, mapEmbedUrl, type OfficeKey } from "@/lib/site";

/**
 * 会社案内
 * 役割：会社の実在と信頼性を示す（所在地・連絡先・事業内容・仕事の進め方・実際の写真）。
 * 担当する検索意図：横浜総合住設／株式会社横浜総合住設 会社概要／横浜総合住設 評判・所在地
 * 会社概要の表は、lib/site.ts に値がある項目だけが出る（代表者・設立・許認可などは未確認のため空）。
 */
export const metadata: Metadata = buildMetadata({
  title: "会社案内｜株式会社 横浜総合住設",
  description:
    "株式会社 横浜総合住設（YOKOHAMA Total Housing Solutions）の会社案内です。本社は相模原市南区、オフィスは横浜市戸塚区深谷町。住宅設備工事・太陽光発電・外壁塗装・リフォーム・造園まで、住まいをトータルでサポートします。",
  path: "/company",
  keywords: ["横浜総合住設", "株式会社横浜総合住設", "横浜総合住設 会社概要", "ヨコジュウ"],
});

/** 会社の資料（チラシ・Instagram）に書かれている、仕事の進め方 */
const PROMISES = [
  { icon: "car" as const, title: "見積もりは無料、現地調査にうかがいます", body: "現地で設置場所と配管を確かめてから、内訳の分かる見積書をお出しします。" },
  { icon: "users" as const, title: "ご相談から施工まで、一貫して", body: "ご相談を受けた当社が、現地調査から工事の完了まで、責任を持って担当します。" },
  { icon: "shield" as const, title: "メーカーの正規品を取り扱います", body: "給湯器やエアコンなどの機器は、メーカーの正規品を取り扱っています。" },
  { icon: "yen" as const, title: "補助金の申請をサポートします", body: "使える制度があるかを調べ、申請の進め方までご案内します。" },
  { icon: "message" as const, title: "工事のあとも、ご相談ください", body: "使い始めてから気になることがあれば、施工した当社が窓口になります。" },
];

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
    ...offices.map((key) => ({
      label: siteConfig.offices[key].label,
      value: (
        <>
          {officeAddressWithPostal(key)}
          <a href={officeMapUrl(key)} target="_blank" rel="noopener noreferrer" className="text-link ml-2 inline-flex items-center gap-1 text-sm">
            地図
            <Icon name="arrowUpRight" className="size-3.5" />
          </a>
        </>
      ),
    })),
    ...(phone
      ? [
          {
            label: "電話",
            value: (
              <>
                <a href={telHref(phone)} className="num text-xl font-semibold tracking-wider text-navy-900 hover:text-brand-600" data-cv="tel">
                  {phone}
                </a>
                {hours && <span className="ml-2 text-sm text-ink-mute">受付 {hours}</span>}
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
              <a href={telHref(mobile)} className="num text-lg font-semibold tracking-wider text-navy-900 hover:text-brand-600" data-cv="tel">
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
        <ul className="space-y-1">
          {c.business.map((b) => (
            <li key={b} className="flex gap-2">
              <span aria-hidden="true" className="mt-[0.75em] inline-block h-[0.4em] w-[0.55em] shrink-0 -skew-x-[24deg] bg-brand-600" />
              {b}
            </li>
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
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1">
                @{siteConfig.social.instagramHandle}
                <Icon name="arrowUpRight" className="size-3.5" />
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHero
        eyebrow="会社案内"
        title={
          <>
            <span className="ib">快適で安心できる</span>
            <span className="ib">住まいづくりを、これからも。</span>
          </>
        }
        lead={`${siteConfig.name}は、住宅設備の工事を軸に、住まいに関わる工事を幅広くお引き受けしている会社です。「住まいのことなら、ヨコジュウへ」と思い出していただける存在を目指しています。`}
        crumbs={[{ name: "会社案内", href: "/company" }]}
      />

      {/* 私たちについて */}
      <section aria-labelledby="about" className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div>
            <SectionHeading
              id="about"
              eyebrow="私たちについて"
              title={
                <>
                  <span className="ib">「これ、できませんか？」に、</span>
                  <span className="ib">まず動く会社です。</span>
                </>
              }
            />
            <div className="mt-6 space-y-5 text-[0.9688rem] leading-[2.1]" {...reveal(60)}>
              <p>
                給湯器、エアコン、トイレ、コンロ。住まいの設備は、毎日あたりまえに動いているからこそ、止まったときに困ります。私たちの仕事は、その「あたりまえ」を取り戻すことです。
              </p>
              <p>
                住宅設備の交換から、太陽光発電、外壁の塗り替え、リフォーム、庭の手入れまで。分野は違っても、やっていることは同じです。現地を見て、できる方法を探し、丁寧に仕上げる。お客様のご希望をかなえるために、まず動く。それが横浜総合住設の進め方です。
              </p>
              <p>
                別の業者に断られた工事でも、一度ご相談ください。高い場所でのエアコンの取替のように、現地を確かめることで道が開けることがあります。できないときは、その理由を正直にお伝えします。
              </p>
              <p>
                「{siteConfig.shortName}」は少し長い名前なので、「{siteConfig.nickname}」と呼んでください。住まいのことで困ったら、まず{siteConfig.nickname}へ。そう思っていただけるよう、一件ずつ積み重ねていきます。
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 self-start">
            <figure className="col-span-2" {...reveal(0, "wipe")}>
              <div className="overflow-hidden rounded-lg border border-silver-200">
                <Photo image="instagram/banner-yokoju" alt="「住宅のことならヨコジュウへ」と書かれた、横浜総合住設のイラストバナー" sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            </figure>
            <figure {...reveal(100, "zoom")}>
              <div className="overflow-hidden rounded-lg border border-silver-200">
                <Photo image="company/stickers" alt="横浜総合住設のロゴと電話番号が入ったステッカー" sizes="(min-width: 1024px) 20vw, 50vw" />
              </div>
              <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">自社で施工した現場に貼るステッカー</figcaption>
            </figure>
            <figure {...reveal(180, "zoom")}>
              <div className="overflow-hidden rounded-lg border border-silver-200 bg-silver-100">
                <Photo image="works/floor-protection" alt="工事の前に、床一面を養生シートで覆った室内" sizes="(min-width: 1024px) 20vw, 50vw" className="aspect-[4/3] object-cover" />
              </div>
              <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">工事の前の、床の養生</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 仕事の進め方 */}
      <section aria-labelledby="promise" className="cv section bg-silver-50">
        <div className="container-x">
          <SectionHeading id="promise" eyebrow="仕事の進め方" title="横浜総合住設が、大切にしていること。" />
          <ol className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PROMISES.map((p, i) => (
              <li key={p.title} className="rounded-lg border border-silver-200 bg-white p-5" {...reveal(i * 70)}>
                <span className="grid size-11 place-items-center rounded-md bg-navy-900 text-white">
                  <Icon name={p.icon} className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold leading-snug"><Phrase>{p.title}</Phrase></h3>
                <p className="mt-2 text-sm leading-[1.9]">{p.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2" {...reveal()}>
            <Link href="/works" className="link-arrow">
              施工事例を見る
              <Icon name="arrowRight" className="size-4" />
            </Link>
            <Link href="/flow" className="link-arrow">
              工事の流れを見る
              <Icon name="arrowRight" className="size-4" />
            </Link>
            <Link href="/business" className="link-arrow">
              法人・工務店の方へ
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 会社概要 */}
      <section aria-labelledby="outline" className="cv section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <SectionHeading id="outline" eyebrow="会社概要" title="会社概要" />
            <figure className="mt-7 max-w-sm" {...reveal(80)}>
              <div className="overflow-hidden rounded-lg border border-silver-200">
                <Photo image="company/nameplate" alt="「株式会社 横浜総合住設」と書かれた表札" sizes="(min-width: 1024px) 24vw, 80vw" />
              </div>
              <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">事業所の表札</figcaption>
            </figure>
          </div>
          <dl className="dl-spec text-[0.9375rem]" {...reveal(60)}>
            {rows.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* アクセス（Googleビジネスプロフィールの埋め込み URL が設定されたときだけ地図を出す） */}
      {embed && (
        <section aria-labelledby="access" className="cv section-tight bg-silver-50">
          <div className="container-x">
            <SectionHeading id="access" eyebrow="アクセス" title="戸塚オフィスの地図" />
            <div className="mt-7 overflow-hidden rounded-lg border border-silver-200">
              <iframe src={embed} title="横浜総合住設 戸塚オフィスの地図" loading="lazy" className="block aspect-[16/9] w-full" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </section>
      )}

      {/* 写真について */}
      <section aria-labelledby="photos" className="cv border-t border-silver-200 bg-silver-50 py-10">
        <div className="container-narrow">
          <h2 id="photos" className="text-sm font-bold text-ink">
            このサイトの写真について
          </h2>
          <p className="mt-2 text-[0.8125rem] leading-[1.95] text-ink-body">
            施工事例のページに掲載している写真は、すべて当社の施工現場で撮影したものです。サービス紹介のページでは、設備や工事の内容をお伝えするためのイメージ写真も使用しています。地域のページの写真の出典は次のとおりです。
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
