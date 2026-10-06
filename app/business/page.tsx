import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LinkButton, PhoneButton } from "@/components/ui/Button";
import { PhotoHero } from "@/components/ui/PageHero";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaffTip } from "@/components/ui/StaffTip";
import { reveal } from "@/lib/reveal";
import { faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * 法人・工務店・ハウスメーカー向け
 * 役割：設備工事・リフォーム工事の協力先を探している事業者に、頼める内容と進め方を伝える。
 * 担当する検索意図：住宅設備 協力業者 横浜／設備工事 下請け 横浜／業務用エアコン 工事 横浜／空調配管 ラッキング 施工
 * 書かないこと：個人のお客様向けの機種選びの話（各サービスページ）。
 * 取引実績の社名・件数など、確認できていないことは書かない。
 */
export const metadata: Metadata = buildMetadata({
  title: "法人・工務店・ハウスメーカーの方へ｜設備工事の協力先",
  description:
    "横浜総合住設は、法人・工務店・ハウスメーカーからの住宅設備工事・リフォーム工事のご依頼をお受けしています。給湯器・エアコンの設置、業務用エアコン、空調配管のラッキング施工まで。横浜を中心に神奈川・東京エリアへうかがいます。",
  path: "/business",
  keywords: ["住宅設備 協力業者 横浜", "設備工事 協力会社 神奈川", "業務用エアコン 工事 横浜", "空調配管 ラッキング 施工", "工務店 設備工事 依頼"],
});

const SCOPE: { icon: IconName; title: string; body: string }[] = [
  { icon: "flame", title: "住宅設備の設置・交換", body: "給湯器・エコキュート・ハイブリッド給湯器、トイレ、ビルトインコンロ、レンジフード、浴室暖房乾燥機などの取り付けと交換。" },
  { icon: "aircon", title: "空調工事", body: "家庭用・業務用エアコンの設置と交換、冷媒配管の施工、化粧カバーや屋外配管のラッキングカバーの仕上げ。" },
  { icon: "reform", title: "リフォームの設備・内装", body: "水まわりの入れ替えに伴う、解体・配管・電気・設備の取り付け・内装の仕上げ。工程をまとめてお任せいただけます。" },
  { icon: "roller", title: "外壁・屋根の塗装", body: "外壁と屋根の塗り替え、破風や雨どいなどの付帯部の塗装、防水工事。" },
  { icon: "solar", title: "太陽光発電・蓄電池", body: "住宅用の太陽光発電システムと蓄電池の設置。" },
  { icon: "tree", title: "造園・外構", body: "庭木の剪定・伐採、雑草対策、ウッドデッキなどの外構工事。" },
];

const CASES = [
  { title: "設備工事を任せられる協力先がほしい", body: "新築やリフォームの現場で、給湯器・エアコンなどの設備工事を分けて発注したい工務店・ハウスメーカーの方。" },
  { title: "管理している物件の設備が故障した", body: "賃貸住宅やテナントの給湯器・エアコンの交換を、入居者の負担が少ない日程で進めたい管理会社・オーナーの方。" },
  { title: "店舗・事務所の空調を入れ替えたい", body: "業務用エアコンの交換と、取り外した機器の適正な処理まで、まとめて頼みたい事業者の方。" },
  { title: "難しい現場で、引き受け手が見つからない", body: "高所への設置、搬入の経路が限られる現場など、条件の厳しい工事の相談先を探している方。" },
];

const STEPS = [
  { title: "ご相談", body: "工事の内容、現場の場所、ご希望の時期をお知らせください。図面や現場の写真があると、話が早く進みます。" },
  { title: "現地の確認・お見積もり", body: "必要に応じて現地を確認し、内訳の分かる見積書をお出しします。お見積もりは無料です。" },
  { title: "工程の調整", body: "ほかの職種の工程に合わせて、入る日と作業の順番を決めます。" },
  { title: "施工", body: "現場の決まりに従って、養生・施工・清掃を行います。" },
  { title: "完了のご報告", body: "仕上がりをご確認いただきます。施工前後の写真が必要な場合は、ご相談ください。" },
];

const FAQS = [
  {
    q: "1件だけの依頼や、小規模な工事でも受けてもらえますか？",
    a: "お受けしています。給湯器1台の交換、エアコン1台の取り付けといったご依頼もご相談ください。",
  },
  {
    q: "対応エリアはどこまでですか？",
    a: "横浜を中心に、神奈川県・東京都のエリアで工事を行っています。現場の場所をお知らせいただければ、うかがえるかどうかをお答えします。",
  },
  {
    q: "業務用エアコンの入れ替えで、古い機器の処理はどうなりますか？",
    a: "業務用のエアコンは、フロン排出抑制法の対象です。廃棄のときは、冷媒のフロン類を、都道府県に登録された第一種フロン類充塡回収業者に引き渡すことが義務づけられており、引取証明書の保存も必要です。手続きの進め方も含めてご相談ください。",
  },
  {
    q: "リフォームの工事で、石綿の事前調査は必要ですか？",
    a: "建物の解体や改修を行うときは、工事の規模にかかわらず、石綿を含む建材の有無を事前に調査することが法令で定められています。設備の設置や撤去を伴う工事も、改修工事に含まれます。請負金額が税込100万円以上の改修工事などでは、調査結果の報告も必要です。",
  },
  {
    q: "見積もりだけの依頼でもよいですか？",
    a: "かまいません。お見積もりは無料です。図面や写真をもとにした概算のご相談もお受けしています。",
  },
];

export default function BusinessPage() {
  return (
    <>
      <PhotoHero
        eyebrow="法人・工務店・ハウスメーカーの方へ"
        title={
          <>
            <span className="ib">設備工事とリフォームの、</span>
            <span className="ib">頼れる協力先に。</span>
          </>
        }
        lead="横浜総合住設は、個人のお客様だけでなく、法人・工務店・ハウスメーカーからのご依頼もお受けしています。住宅設備の取り付けから、業務用エアコン、空調配管の仕上げまで。現場の条件に合わせて、柔軟に対応します。"
        image="works/lagging-1"
        imageAlt="屋外に並ぶ業務用の室外機と、ラッキングカバーを施工した空調配管（横浜総合住設の施工）"
        crumbs={[{ name: "法人・工務店の方へ", href: "/business" }]}
      >
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton href="/contact?topic=business" icon="document">
            お見積もり・ご相談
          </LinkButton>
          <PhoneButton variant="white" />
        </div>
      </PhotoHero>

      {/* こんなご相談に */}
      <section aria-labelledby="biz-cases" className="section bg-white">
        <div className="container-x">
          <SectionHeading id="biz-cases" eyebrow="こんなご相談に" title="このような事業者の方から、ご依頼をお受けします。" />
          <ul className="mt-9 grid gap-4 sm:grid-cols-2">
            {CASES.map((c, i) => (
              <li key={c.title} className="flex gap-4 rounded-lg border border-silver-200 bg-silver-50 p-5 sm:p-6" {...reveal((i % 2) * 80)}>
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-sm bg-navy-900 text-white">
                  <Icon name="check" className="size-4" strokeWidth={2.5} />
                </span>
                <div>
                  <h3 className="text-[1.0625rem] font-extrabold leading-snug"><Phrase>{c.title}</Phrase></h3>
                  <p className="mt-2 text-[0.9375rem] leading-[1.9]">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 対応できる工事 */}
      <section aria-labelledby="biz-scope" className="cv section bg-silver-50">
        <div className="container-x">
          <SectionHeading id="biz-scope" eyebrow="対応できる工事" title="設備から外装まで、分けても、まとめても。" lead="工事の一部だけのご依頼も、複数の工種をまとめたご依頼も、どちらもお受けします。" />
          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SCOPE.map((s, i) => (
              <li key={s.title} className="rounded-lg border border-silver-200 bg-white p-5 sm:p-6" {...reveal((i % 3) * 80)}>
                <span className="grid size-11 place-items-center rounded-md bg-brand-50 text-brand-700">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <h3 className="mt-4 text-[1.0625rem] font-extrabold leading-snug"><Phrase>{s.title}</Phrase></h3>
                <p className="mt-2 text-[0.9375rem] leading-[1.9]">{s.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.8125rem] leading-relaxed text-ink-mute" {...reveal()}>
            解体工事は、リフォームに伴うものに対応しています。建物全体の解体のみのご依頼は承っていません。
          </p>
        </div>
      </section>

      {/* 現場の写真 */}
      <section aria-labelledby="biz-works" className="cv section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <SectionHeading
              id="biz-works"
              eyebrow="施工の例"
              title={
                <>
                  <span className="ib">仕上がりを見て、</span>
                  <span className="ib">判断してください。</span>
                </>
              }
              lead="屋外に並ぶ室外機につながる空調配管に、ラッキングカバーを施工した現場です。直線の通り、曲がりの納まり、端部の処理まで、写真でご確認いただけます。"
            />
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-2" {...reveal(80)}>
              <Link href="/works/air-conditioning-pipe-lagging" className="link-arrow">
                この事例をくわしく見る
                <Icon name="arrowRight" className="size-4" />
              </Link>
              <Link href="/works" className="link-arrow">
                施工事例の一覧
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
            <StaffTip pose="illust/pose-trust" className="mt-9">
              現場ごとの決まりごと（入退場の時間、養生の範囲、写真の撮り方など）は、最初にお知らせください。それに合わせて段取りします。
            </StaffTip>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {(
              [
                { key: "works/lagging-2", alt: "室外機の間を通る、ラッキングカバーを施工した空調配管", span: true },
                { key: "works/lagging-4", alt: "配管の曲がりの部分。板を分けて曲がりに沿わせたラッキングカバー", span: false },
                { key: "works/lagging-5", alt: "配管が機器に入る部分の、ラッキングカバーの端部", span: false },
              ] as const
            ).map((p, i) => (
              <li key={p.key} className={p.span ? "col-span-2" : ""} {...reveal(i * 90, "zoom")}>
                <div className={`relative overflow-hidden rounded-lg bg-silver-100 ${p.span ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                  <PhotoFill image={p.key} alt={p.alt} sizes={p.span ? "(min-width: 1024px) 52vw, 100vw" : "(min-width: 1024px) 26vw, 50vw"} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 進め方 */}
      <section aria-labelledby="biz-flow" className="cv bg-blueprint text-white">
        <div className="container-x section">
          <SectionHeading id="biz-flow" onDark eyebrow="ご依頼の流れ" title="ご相談から、完了のご報告まで。" />
          <ol className="mt-9 grid gap-px overflow-hidden rounded-lg bg-white/15 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="bg-navy-900/90 p-5 sm:p-6" {...reveal(i * 70, "fade")}>
                <p className="num text-sm font-semibold tracking-[0.2em] text-sky-300">STEP {i + 1}</p>
                <h3 className="mt-1.5 text-[1.0625rem] font-extrabold leading-snug !text-white"><Phrase>{s.title}</Phrase></h3>
                <p className="mt-2 text-sm leading-[1.9] text-silver-200">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* よくある質問 */}
      <section aria-labelledby="biz-faq" className="cv section bg-white">
        <div className="container-narrow">
          <SectionHeading id="biz-faq" eyebrow="よくある質問" title="法人・工務店の方からの質問" />
          <div className="mt-8" {...reveal(60)}>
            <FaqList faqs={FAQS} />
          </div>
        </div>
      </section>

      <CtaBand
        id="cta-business"
        title={
          <>
            <span className="ib">現場のこと、</span>
            <span className="ib">まずはご相談ください。</span>
          </>
        }
        lead="工事の内容と現場の場所、ご希望の時期をお知らせください。図面や写真をお送りいただければ、概算のご相談もお受けします。お見積もりは無料です。"
      />
      <JsonLd data={faqSchema(FAQS)} />
    </>
  );
}
