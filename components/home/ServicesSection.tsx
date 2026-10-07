import Link from "next/link";
import { ServiceTile } from "@/components/cards/ServiceCard";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services, type ServiceCategoryId } from "@/data/services";
import { getSubsidy } from "@/data/subsidies";
import type { ImageKey } from "@/lib/images";
import { reveal } from "@/lib/reveal";
import { formatDateJa } from "@/lib/seo";

/**
 * 事業内容（トップページでサービスを紹介するのは、この区画の1か所だけ）。
 *
 * 13のサービスを、3つのまとまりに分けて見せる。それぞれ「写真（色の板つき）＋短い説明＋サービスへのリンク」で、
 * くわしい内容は各サービスページに任せる。
 * 写真は、当社が施工した現場のものだけを使う（イメージ写真は使わない）。写真の無い「省エネ・創エネ設備」は、制度の情報を添える。
 * 同じサービスの一覧を、ページの中で繰り返さないこと。
 */
type Block = {
  id: string;
  /** 題名の上の小さなラベル */
  tag: string;
  title: string;
  body: string;
  categories: ServiceCategoryId[];
  photo?: { image: ImageKey; alt: string; caption: string };
};

const BLOCKS: Block[] = [
  {
    id: "equipment",
    tag: "毎日使う設備",
    title: "住宅設備",
    body: "給湯器・エアコン・トイレ・コンロなど、毎日使う設備の交換と修理です。お湯の温度が安定しない、エアコンの効きが悪いといった段階でご相談いただければ、機種と日程を落ち着いて決められます。",
    categories: ["equipment"],
    photo: { image: "works/aircon-b-after-outdoor", alt: "取替後のエアコン室外機と、外壁に沿って立ち上げた配管カバー", caption: "エアコンの取替。配管を外壁に沿わせ、カバーに収めた現場（当社施工）" },
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
    body: "外壁・屋根の塗装、水まわりと内装のリフォーム、リフォームに伴う解体、庭木の手入れやウッドデッキの設置です。解体・設備・仕上げを同じ窓口でお受けするので、工程ごとに話を伝え直す手間がかかりません。",
    categories: ["exterior", "reform", "site"],
    photo: { image: "works/wood-deck-4-top", alt: "建物の横に設置したウッドデッキを、上から見た様子", caption: "ウッドデッキの設置。整地と防草シートの上に組んだ現場（当社施工）" },
  },
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
          lead="給湯器やエアコンの交換から、太陽光発電、外壁の塗り替え、リフォーム、庭の手入れまで、13の工事をお引き受けしています。どの工事も、現地で設置場所と使い方を確認してからご提案します。"
        />

        <div className="mt-12 space-y-16 lg:mt-16 lg:space-y-24">
          {BLOCKS.map((b, bi) => {
            const list = services.filter((s) => b.categories.includes(s.category));
            const flip = bi % 2 === 1 || b.id === "exterior";
            return (
              <div key={b.id} className="grid items-center gap-x-14 gap-y-9 lg:grid-cols-2">
                {/* 写真（当社の施工現場）。後ろに色の板をずらして敷く */}
                {b.photo && (
                  <figure className={flip ? "lg:order-2" : ""} {...reveal(0, flip ? "right" : "left")}>
                    <div className={`photo-frame ${flip ? "photo-frame-r" : ""}`}>
                      <div className="photo-card relative aspect-[4/3]">
                        <PhotoFill image={b.photo.image} alt={b.photo.alt} sizes="(min-width: 1024px) 44vw, 100vw" />
                      </div>
                    </div>
                    <figcaption className="mt-3 text-xs leading-relaxed text-ink-mute">{b.photo.caption}</figcaption>
                  </figure>
                )}

                {/* 写真の無いまとまりには、確認済みの制度の情報を添える */}
                {!b.photo && subsidy && (
                  <div className="card-pop border-2 border-brand-200 p-6 sm:p-8 lg:order-2" {...reveal(0, "right")}>
                    <p className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-ink-mute">
                      <span className="tag">{subsidy.status === "open" ? "受付中" : "受付終了"}</span>
                      使える制度の例（{subsidy.level}）
                    </p>
                    <p className="mt-2 font-heading text-lg font-black text-navy-900">{subsidy.name}</p>
                    <dl className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                      {subsidy.amounts.slice(0, 3).map((a) => (
                        <div key={a.label} className="rounded-2xl bg-mist px-2 py-3 text-center">
                          <dt className="text-xs font-bold leading-snug text-navy-900">{a.label}</dt>
                          <dd className="num mt-1 whitespace-nowrap text-[1rem] font-semibold leading-tight text-brand-700 sm:text-[1.25rem]">{a.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 text-[0.8125rem] leading-[1.9] text-ink-body">
                      性能の要件を満たす機種には加算があります。登録された事業者が申請する制度で、予算の上限に達すると期限の前でも終了します。
                      <span className="ib">（{formatDateJa(subsidy.checkedAt)}に公式サイトで確認）</span>
                    </p>
                    <Link href="/service/eco-one#subsidy" className="link-arrow mt-2 !text-sm">
                      補助金の条件
                      <Icon name="arrowRight" className="size-3.5" />
                    </Link>
                  </div>
                )}

                <div {...reveal(100)}>
                  <p>
                    <span className="tag tag-blue">{b.tag}</span>
                  </p>
                  <h3 className="h-sub mt-3 !text-[1.5rem] sm:!text-[1.75rem]">{b.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-[2]">{b.body}</p>
                  <ul className={`mt-6 grid gap-2.5 ${list.length > 3 ? "sm:grid-cols-2" : ""}`}>
                    {list.map((s) => (
                      <li key={s.slug}>
                        <ServiceTile service={s} headingLevel="h4" />
                      </li>
                    ))}
                  </ul>
                </div>
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
