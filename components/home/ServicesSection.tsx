import Link from "next/link";
import { ServiceTile } from "@/components/cards/ServiceCard";
import { SpecialtySiteBanner } from "@/components/sections/SpecialtySiteBanner";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getService, mainServices, servicePath, type ServiceCategoryId } from "@/data/services";
import { BOILER_PAGES } from "@/data/specialty";
import { getSubsidy } from "@/data/subsidies";
import { reveal } from "@/lib/reveal";
import { formatDateJa } from "@/lib/seo";

/**
 * 事業内容（トップページでサービスを紹介するのは、この区画の1か所だけ）。
 *
 * 最初に、家の断面のイラストで「家の中から外まわりまで頼める」ことを1枚で見せ、
 * そのあと、サービスを3つのまとまりに分けて「短い説明＋サービスへのリンク（工事のイラストつき）」で並べる。
 * くわしい内容は各サービスページに任せる。当社の現場の写真は、すぐ下の「施工事例」で見せる（この区画では使わない）。
 * 写真の無い「省エネ・創エネ設備」には、制度の情報を添える。給湯器のまとまりには、給湯器専門サイトの案内を添える。
 * 同じサービスの一覧を、ページの中で繰り返さないこと。
 */
type Block = {
  id: string;
  /** 題名の上の小さなラベル */
  tag: string;
  title: string;
  body: string;
  categories: ServiceCategoryId[];
};

const BLOCKS: Block[] = [
  {
    id: "equipment",
    tag: "毎日使う設備",
    title: "住宅設備",
    body: "給湯器・エアコン・トイレ・コンロなど、毎日使う設備の交換と修理です。お湯の温度が安定しない、エアコンの効きが悪いといった段階でご相談いただければ、機種と日程を落ち着いて決められます。",
    categories: ["equipment"],
  },
  {
    id: "energy",
    tag: "つくる・ためる",
    title: "省エネ・創エネ設備",
    body: "ハイブリッド給湯器、太陽光発電、蓄電池の設置です。屋根の向き、設置スペース、いまの電気とガスの使い方を確かめたうえで、合う機器をご提案します。",
    categories: ["energy"],
  },
  {
    id: "exterior",
    tag: "家の外まわり・内装",
    title: "外装・リフォーム・外構",
    body: "外壁・屋根の塗装、水まわりと内装のリフォーム、内窓の設置と窓の交換、畳・襖の張り替え、リフォームに伴う解体、庭木の手入れやウッドデッキの設置です。解体・設備・仕上げを同じ窓口でお受けするので、工程ごとに話を伝え直す手間がかかりません。",
    categories: ["exterior", "reform", "site"],
  },
];

/**
 * 家の断面のイラスト（ai/house-overview）の上に置く、工事の名前の札（広い画面だけ）。
 * 位置はイラストの中の場所（左上を 0%）。イラストを作り直したら、位置を合わせ直す。
 */
const PINS: { slug: string; label: string; x: number; y: number }[] = [
  { slug: "solar", label: "太陽光発電", x: 52, y: 13 },
  { slug: "exterior-painting", label: "外壁塗装", x: 13, y: 33 },
  { slug: "other", label: "浴室暖房乾燥機", x: 33, y: 24 },
  { slug: "reform", label: "リフォーム", x: 64, y: 30 },
  { slug: "window", label: "窓・内窓", x: 85, y: 24 },
  { slug: "kitchen-equipment", label: "コンロ・レンジフード", x: 30, y: 53 },
  { slug: "air-conditioner", label: "エアコン", x: 60, y: 47 },
  { slug: "toilet", label: "トイレ", x: 72, y: 62 },
  { slug: "water-heater", label: "給湯器", x: 83, y: 47 },
  { slug: "ecocute", label: "エコキュート", x: 91, y: 66 },
  { slug: "storage-battery", label: "蓄電池", x: 13, y: 70 },
  { slug: "garden", label: "造園・外構", x: 33, y: 82 },
];

export function ServicesSection() {
  const subsidy = getSubsidy("kyutou-shoene");

  return (
    <section aria-labelledby="home-services" className="section bg-white">
      <div className="container-x">
        <SectionHeading
          id="home-services"
          eyebrow="サービス"
          title="事業内容"
          align="center"
          lead={`給湯器やエアコンの交換から、太陽光発電、外壁の塗り替え、リフォーム、庭の手入れまで、${mainServices.length}の工事をお引き受けしています。どの工事も、現地で設置場所と使い方を確認してからご提案します。`}
        />

        {/* 家の断面のイラスト（家の中から外まわりまで、どこを頼めるか） */}
        <figure className="overview mx-auto mt-10 max-w-[64rem] lg:mt-12" {...reveal(60, "pop")}>
          <div className="relative">
            {/* 幅は画面に合わせて変わるので、写真と同じく sizes で必要な大きさだけ読む */}
            <Photo image="ai/house-overview" sizes="(min-width: 1104px) 1024px, calc(100vw - 2.5rem)" quality={75} alt="家の断面のイラスト。屋根の太陽光パネル、外壁の塗装の足場、浴室、寝室、キッチン、リビングのエアコン、トイレ、外の給湯器とエコキュート、蓄電池、庭とウッドデッキ" />
            <ul className="overview-pins" aria-label="イラストの中の工事">
              {PINS.map((p) => {
                const s = getService(p.slug);
                if (!s) return null;
                return (
                  <li key={p.slug} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                    <Link href={servicePath(s)} className="overview-pin">
                      {p.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <figcaption className="mt-3 text-center text-xs text-ink-mute">家の中から外まわりまで、住まいの工事をまとめてお受けしています（イラストはイメージです）</figcaption>
        </figure>

        <div className="mt-14 space-y-14 lg:mt-20 lg:space-y-20">
          {BLOCKS.map((b) => {
            const list = mainServices.filter((s) => b.categories.includes(s.category));
            return (
              <div key={b.id}>
                {/* まとまりの見出しと説明（広い画面では横に並べる） */}
                <div className="grid gap-x-14 gap-y-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-end" {...reveal(0)}>
                  <div>
                    <p>
                      <span className="tag tag-blue">{b.tag}</span>
                    </p>
                    <h3 className="h-sub mt-3 !text-[1.5rem] sm:!text-[1.75rem]">{b.title}</h3>
                  </div>
                  <p className="text-[0.9375rem] leading-[2]">{b.body}</p>
                </div>

                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3" {...reveal(80)}>
                  {list.map((s) => (
                    <li key={s.slug}>
                      <ServiceTile service={s} headingLevel="h4" />
                    </li>
                  ))}
                </ul>

                {/* 写真の無いまとまりには、確認済みの制度の情報を添える */}
                {b.id === "energy" && subsidy && (
                  <div className="card-pop mt-5 grid gap-x-8 gap-y-4 border-2 border-brand-200 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center" {...reveal(120)}>
                    <div>
                      <p className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-ink-mute">
                        <span className="tag">{subsidy.status === "open" ? "受付中" : "受付終了"}</span>
                        使える制度の例（{subsidy.level}）
                      </p>
                      <p className="mt-2 font-heading text-lg font-black text-navy-900">{subsidy.name}</p>
                      <p className="mt-3 text-[0.8125rem] leading-[1.9] text-ink-body">
                        性能の要件を満たす機種には加算があります。登録された事業者が申請する制度で、予算の上限に達すると期限の前でも終了します。
                        <span className="ib">（{formatDateJa(subsidy.checkedAt)}に公式サイトで確認）</span>
                      </p>
                      <Link href="/service/eco-one#subsidy" className="link-arrow mt-2 !text-sm">
                        補助金の条件
                        <Icon name="arrowRight" className="size-3.5" />
                      </Link>
                    </div>
                    {/* 幅 380px 未満では、3列に並べると金額が箱からはみ出すので、1行ずつ（項目名｜金額）に並べる */}
                    <dl className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-3 sm:gap-3">
                      {subsidy.amounts.slice(0, 3).map((a) => (
                        <div key={a.label} className="flex items-center justify-between gap-3 rounded-2xl bg-mist px-4 py-2.5 min-[380px]:block min-[380px]:px-2 min-[380px]:py-3 min-[380px]:text-center">
                          <dt className="text-xs font-bold leading-snug text-navy-900">
                            <Phrase>{a.label}</Phrase>
                          </dt>
                          <dd className="num whitespace-nowrap text-[1rem] font-semibold leading-tight text-brand-700 min-[380px]:mt-1 sm:text-[1.25rem]">{a.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {/* 給湯器は、機種・補助金をくわしく扱う専門サイトがある（data/specialty.ts） */}
                {b.id === "equipment" && (
                  <SpecialtySiteBanner
                    compact
                    className="mt-5"
                    mascot="wave"
                    title="給湯器の機種と補助金は、専門サイトでくわしく"
                    note="ガス給湯器・エコキュート・ハイブリッド給湯器の機種を、型番と仕様で比べられます。使える補助金もまとめています。"
                    links={[BOILER_PAGES.products, BOILER_PAGES.subsidy]}
                  />
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-12 text-center lg:mt-16" {...reveal()}>
          <Link href="/service" className="btn btn-outline">
            サービス一覧
            <Icon name="arrowRight" className="btn-arrow size-4" />
          </Link>
        </p>
      </div>
    </section>
  );
}
