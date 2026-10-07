import Link from "next/link";
import { ServiceRow } from "@/components/cards/ServiceCard";
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
 * 13のサービスを、3つのまとまりに分けて見せる。それぞれ「短い説明＋サービスの一覧」で、くわしい内容は各サービスページに任せる。
 * 写真は、当社が施工した現場のものだけを使う（イメージ写真は使わない）。写真の無い「省エネ・創エネ設備」は、制度の情報を添える。
 * 同じサービスの一覧を、ページの中で繰り返さないこと。
 */
type Block = {
  id: string;
  title: string;
  body: string;
  categories: ServiceCategoryId[];
  photo?: { image: ImageKey; alt: string; caption: string; portrait?: boolean };
};

const BLOCKS: Block[] = [
  {
    id: "equipment",
    title: "住宅設備",
    body: "給湯器・エアコン・トイレ・コンロなど、毎日使う設備の交換と修理です。お湯の温度が安定しない、エアコンの効きが悪いといった段階でご相談いただければ、機種と日程を落ち着いて決められます。",
    categories: ["equipment"],
    photo: { image: "works/aircon-b-after-outdoor", alt: "取替後のエアコン室外機と、外壁に沿って立ち上げた配管カバー", caption: "エアコンの取替。配管を外壁に沿わせ、カバーに収めた現場（当社施工）", portrait: true },
  },
  {
    id: "energy",
    title: "省エネ・創エネ設備",
    body: "ハイブリッド給湯器、太陽光発電、蓄電池の設置です。屋根の向き、設置スペース、いまの電気とガスの使い方を確かめたうえで、合う機器をご提案します。",
    categories: ["energy"],
  },
  {
    id: "exterior",
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
        <div className="grid gap-x-12 gap-y-4 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="home-services" title="事業内容" className="lg:col-span-4" />
          <p className="text-[0.9688rem] leading-[2.05] lg:col-span-8" {...reveal(60)}>
            給湯器やエアコンの交換から、太陽光発電、外壁の塗り替え、リフォーム、庭の手入れまで、13の工事をお引き受けしています。どの工事も、現地で設置場所と使い方を確認してからご提案します。
          </p>
        </div>

        <div className="mt-10 space-y-12 lg:mt-14 lg:space-y-16">
          {BLOCKS.map((b, bi) => {
            const list = services.filter((s) => b.categories.includes(s.category));
            const photoRight = bi % 2 === 1 || b.id === "exterior";
            return (
              <div key={b.id} className="rule-top grid gap-x-12 gap-y-8 pt-8 lg:grid-cols-12 lg:pt-10">
                {/* 写真（当社の施工現場） */}
                {b.photo && (
                  <figure className={`lg:col-span-5 ${photoRight ? "lg:order-2" : ""}`} {...reveal(0, "wipe")}>
                    <div className={`relative bg-silver-100 ${b.photo.portrait ? "aspect-[4/3] lg:aspect-square" : "aspect-[4/3]"}`}>
                      <PhotoFill image={b.photo.image} alt={b.photo.alt} sizes="(min-width: 1024px) 40vw, 100vw" />
                    </div>
                    <figcaption className="mt-2.5 text-xs leading-relaxed text-ink-mute">{b.photo.caption}</figcaption>
                  </figure>
                )}

                <div className={b.photo ? "lg:col-span-7" : "lg:col-span-5"}>
                  <h3 className="h-sub">{b.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-[2]">{b.body}</p>
                  <ul className={`rows mt-6 ${b.photo && list.length > 4 ? "sm:grid sm:grid-cols-2 sm:gap-x-9 sm:[&>*:nth-child(2)]:border-t sm:[&>*:nth-child(2)]:border-silver-200" : ""}`} {...reveal(60)}>
                    {list.map((s) => (
                      <li key={s.slug}>
                        <ServiceRow service={s} headingLevel="h4" />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 写真の無いまとまりには、確認済みの制度の情報を添える */}
                {!b.photo && subsidy && (
                  <div className="bg-silver-50 p-6 sm:p-8 lg:col-span-7" {...reveal(80)}>
                    <p className="text-xs font-bold tracking-wider text-ink-mute">
                      使える制度の例（{subsidy.level}）<span className="ml-3 text-ink">{subsidy.status === "open" ? "受付中" : "受付終了"}</span>
                    </p>
                    <p className="mt-1.5 text-lg font-bold text-ink">{subsidy.name}</p>
                    <dl className="mt-5 grid gap-x-8 border-t border-navy-900 sm:grid-cols-3">
                      {subsidy.amounts.slice(0, 3).map((a) => (
                        <div key={a.label} className="border-b border-silver-300 py-3.5">
                          <dt className="text-[0.8125rem] text-ink-mute">{a.label}</dt>
                          <dd className="num mt-0.5 text-[1.375rem] font-medium text-navy-900">{a.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 text-[0.8125rem] leading-[1.9] text-ink-body">
                      性能の要件を満たす機種には加算があります。登録された事業者が申請する制度で、予算の上限に達すると期限の前でも終了します。
                      <span className="ib">（{formatDateJa(subsidy.checkedAt)}に公式サイトで確認）</span>
                    </p>
                    <Link href="/service/eco-one#subsidy" className="link-arrow mt-4 !text-sm">
                      補助金の条件
                      <Icon name="arrowRight" className="size-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-10 lg:mt-12" {...reveal()}>
          <Link href="/service" className="link-arrow">
            サービス一覧
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </p>
      </div>
    </section>
  );
}
