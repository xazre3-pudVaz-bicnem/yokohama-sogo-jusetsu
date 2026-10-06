import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { FaqList } from "@/components/ui/FaqList";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { Illust, Photo, PhotoFill } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getArea, yokohamaWards } from "@/data/areas";
import { creditOf, flowSteps, instagramPosts } from "@/data/company";
import { pickupFaqs } from "@/data/faq";
import { getAllPosts } from "@/lib/blog";
import { reveal } from "@/lib/reveal";
import { siteConfig, primaryPhone, telHref, receptionHours, officeAddressWithPostal, officeMapUrl, type OfficeKey } from "@/lib/site";

/** 09 戸塚区を中心とした対応エリア */
export function AreaSection() {
  const totsuka = getArea("totsuka")!;
  const credit = creditOf("area/totsuka-aerial");
  return (
    <section aria-labelledby="home-area" className="cv relative isolate overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 -z-10">
        <PhotoFill image="area/totsuka-aerial" alt={totsuka.imageAlt} sizes="100vw" className="object-[50%_40%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/85 to-navy-900/55" />
      </div>
      <div className="container-x section grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="home-area"
            onDark
            eyebrow="対応エリア"
            title={
              <>
                <span className="ib">戸塚区を中心に、</span>
                <br />
                <span className="ib">横浜市の全域、</span>
                <span className="ib">神奈川・東京へ。</span>
              </>
            }
            lead="戸塚区は、横浜市でいちばん広い区です。川沿いの低地と、起伏に富んだ台地。敷地の条件は場所ごとに違い、同じ工事でも段取りが変わります。区内の深谷町にオフィスを置く私たちが、現地を見てご提案します。"
          />
          <div className="mt-8 flex flex-wrap gap-3" {...reveal(80)}>
            <LinkButton href="/area/totsuka" variant="white">
              戸塚区の住宅設備・リフォーム
            </LinkButton>
            <LinkButton href="/area/yokohama" variant="ghostDark">
              横浜市の対応エリア
            </LinkButton>
          </div>
        </div>

        <div className="space-y-5" {...reveal(120)}>
          <div className="rounded-lg border border-white/20 bg-navy-950/60 p-5 backdrop-blur-sm sm:p-6">
            <p className="flex items-center gap-2 text-sm font-extrabold tracking-wider text-sky-300">
              <Icon name="mapPin" className="size-4" />
              最重点エリア：横浜市戸塚区
            </p>
            <p className="mt-3 text-[0.8125rem] leading-[2] text-silver-200">{totsuka.towns?.join("・")}</p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-silver-300">
              {totsuka.stations?.map((s) => (
                <span key={s.name} className="inline-flex items-center gap-1">
                  <span className="inline-block size-1.5 rounded-full bg-sky-400" />
                  {s.name}
                </span>
              ))}
            </p>
          </div>
          <div className="rounded-lg border border-white/20 bg-navy-950/60 p-5 backdrop-blur-sm sm:p-6">
            <p className="text-sm font-extrabold tracking-wider text-sky-300">横浜市</p>
            <p className="mt-2 text-[0.8125rem] leading-[2] text-silver-200">{yokohamaWards.join("・")}</p>
            <p className="mt-3 border-t border-white/15 pt-3 text-[0.8125rem] leading-relaxed text-silver-200">そのほか、神奈川県内・東京都内のエリアにも対応しています。対応できるかどうかは、ご住所をお知らせいただければお答えします。</p>
          </div>
        </div>
      </div>
      {credit && (
        <p className="absolute bottom-1.5 right-3 text-[0.625rem] leading-none text-white/70">
          写真：
          <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {credit.author}
          </a>
          （
          <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {credit.license}
          </a>
          ）
        </p>
      )}
    </section>
  );
}

/** 10 法人・工務店向け */
export function BusinessSection() {
  return (
    <section aria-labelledby="home-business" className="cv section bg-white">
      <div className="container-x">
        <div className="grid overflow-hidden rounded-lg bg-silver-50 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative min-h-[15rem] lg:min-h-full" {...reveal(0, "wipe")}>
            <PhotoFill image="works/lagging-1" alt="屋外に並ぶ業務用の室外機と、ラッキングカバーを施工した空調配管（横浜総合住設の施工）" sizes="(min-width: 1024px) 42vw, 100vw" />
            <span className="tag-slant absolute left-0 top-5">空調配管のラッキング施工</span>
          </div>
          <div className="p-6 sm:p-10 lg:p-12">
            <SectionHeading
              id="home-business"
              eyebrow="法人・工務店の皆さまへ"
              title={
                <>
                  <span className="ib">設備工事の協力先を、</span>
                  <span className="ib">お探しですか。</span>
                </>
              }
              lead="個人のお客様だけでなく、法人・工務店・ハウスメーカーからのご依頼もお受けしています。住宅設備の取り付けから、業務用エアコン、空調配管の仕上げまで。現場の条件に合わせて柔軟に対応します。"
            />
            <ul className="mt-6 grid gap-x-6 gap-y-2.5 text-[0.9375rem] font-bold text-ink sm:grid-cols-2" {...reveal(80)}>
              {["住宅設備の設置・交換工事", "業務用エアコンの設置・交換", "空調配管・ラッキングカバー", "リフォームに伴う解体と設備工事"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Icon name="check" className="mt-1 size-4 text-brand-600" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8" {...reveal(140)}>
              <LinkButton href="/business" variant="navy">
                法人・工務店向けのご案内
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 11 工事の流れ（トップページでは5段階にまとめる。くわしくは /flow） */
const FLOW_PICK = ["contact", "survey", "estimate", "work", "handover"];

export function FlowSection() {
  const steps = FLOW_PICK.map((id) => flowSteps.find((s) => s.id === id)!);
  return (
    <section aria-labelledby="home-flow" className="cv section bg-silver-soft">
      <div className="container-x">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <SectionHeading id="home-flow" eyebrow="工事の流れ" title={
              <>
                <span className="ib">お問い合わせから、</span>
                <span className="ib">工事の完了まで。</span>
              </>
            } lead="はじめての方にも分かるよう、進め方をあらかじめお伝えします。お見積もりまでは無料です。内容にご納得いただいてから、ご契約となります。" />
          <Link href="/flow" className="link-arrow shrink-0" {...reveal(100)}>
            くわしい流れを見る
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
        <ol className="mt-10 grid gap-x-3 gap-y-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.id} className="relative" {...reveal(i * 90)}>
              <div className="flex items-end gap-3 lg:block">
                <div className="relative w-20 shrink-0 lg:mx-auto lg:w-24">
                  <span className="absolute inset-x-0 bottom-0 mx-auto aspect-square w-full rounded-full bg-brand-100" aria-hidden="true" />
                  <Illust image={s.pose} width={96} className="relative mx-auto h-auto w-[82%]" />
                </div>
                <div className="flex-1 lg:mt-4 lg:text-center">
                  <p className="num text-xs font-semibold tracking-[0.2em] text-brand-600">STEP {i + 1}</p>
                  <h3 className="mt-0.5 text-lg font-extrabold">{s.title}</h3>
                  <p className="mt-1 text-[0.8125rem] font-bold text-navy-700">{s.lead}</p>
                </div>
              </div>
              {i < steps.length - 1 && <Icon name="chevronRight" className="absolute -right-3.5 top-9 hidden size-5 text-silver-400 lg:block" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 12 Instagram（実際の投稿へのリンク。埋め込みスクリプトは使わず、写真とリンクだけを置く） */
export function InstagramSection() {
  const url = siteConfig.social.instagram;
  if (!url) return null;
  return (
    <section aria-labelledby="home-instagram" className="cv section bg-white">
      <div className="container-x">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <SectionHeading
            id="home-instagram"
            eyebrow="Instagram"
            title={
              <>
                <span className="ib">現場の様子を、</span>
                <span className="ib">Instagram で発信しています。</span>
              </>
            }
            lead="施工の前後、作業中の一枚、日々のこと。いちばん新しい現場の写真は Instagram でご覧いただけます。メッセージでのご相談もお受けしています。"
          />
          <div {...reveal(100)}>
            <LinkButton href={url} variant="outline" icon="instagram" external small>
              Instagram を見る
            </LinkButton>
          </div>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:mt-12">
          {instagramPosts.map((p, i) => (
            <li key={p.url} {...reveal((i % 4) * 70, "zoom")}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="zoom-wrap group relative block aspect-square overflow-hidden rounded-md bg-silver-100">
                <PhotoFill image={p.image} alt={p.alt} sizes="(min-width: 640px) 25vw, 50vw" className="zoom-img" />
                <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-navy-950/90 to-transparent px-3 pb-2.5 pt-8 text-xs font-bold leading-snug text-white">
                  <Icon name="instagram" className="size-3.5" />
                  {p.caption}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 13 最新ブログ */
export function BlogSection() {
  const posts = getAllPosts().slice(0, 3);
  if (!posts.length) return null;
  return (
    <section aria-labelledby="home-blog" className="cv section bg-silver-50">
      <div className="container-x">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <SectionHeading id="home-blog" eyebrow="住宅設備コラム" title={
              <>
                <span className="ib">交換の時期、選び方、</span>
                <span className="ib">費用の考え方。</span>
              </>
            } lead="「いつ替えるべきか」「何を基準に選ぶか」。工事を頼む前に知っておきたいことを、設備ごとにまとめています。" />
          <Link href="/blog" className="link-arrow shrink-0" {...reveal(100)}>
            コラムの一覧を見る
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
        <ul className="scroller mt-10 gap-x-6 gap-y-10 sm:grid sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {posts.map((p, i) => (
            <li key={p.slug} className={i === 2 ? "sm:hidden lg:block" : ""} {...reveal(i * 90)}>
              <PostCard post={p} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 14 FAQ（/faq の抜粋。構造化データは /faq にだけ出すので、ここでは出さない） */
export function FaqSection() {
  return (
    <section aria-labelledby="home-faq" className="cv section bg-white">
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <SectionHeading id="home-faq" eyebrow="よくある質問" title={
              <>
                <span className="ib">はじめての</span>
                <span className="ib">ご相談の前に。</span>
              </>
            } lead="見積もりの費用、対応エリア、補助金のこと。よくいただく質問にお答えします。" />
          <div className="mt-6 hidden w-40 lg:block" {...reveal(120, "pop")}>
            <Illust image="illust/people-woman-think" width={220} className="h-auto w-full" />
          </div>
        </div>
        <div {...reveal(80)}>
          <FaqList faqs={pickupFaqs} />
          <Link href="/faq" className="link-arrow mt-6">
            よくある質問をすべて見る
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** 15 会社情報（表記は lib/site.ts から。未確認の項目は出ない） */
export function CompanySection() {
  const phone = primaryPhone();
  const hours = receptionHours();
  const offices: OfficeKey[] = ["head", "totsuka"];
  return (
    <section aria-labelledby="home-company" className="cv section bg-silver-50">
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <SectionHeading id="home-company" eyebrow="会社情報" title={siteConfig.name} lead="快適で安心できる住まいづくりを、これからも。住まいの「困った」に、確かな技術と丁寧な対応でお応えします。" />
          <div className="mt-7 grid grid-cols-[1.25fr_1fr] gap-3" {...reveal(80)}>
            <figure>
              <div className="overflow-hidden rounded-md border border-silver-200 bg-white">
                <Photo image="company/stickers" alt="横浜総合住設のロゴと電話番号が入ったステッカー" sizes="(min-width: 1024px) 24vw, 55vw" />
              </div>
              <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">自社で施工した現場に貼るステッカー</figcaption>
            </figure>
            <figure>
              <div className="overflow-hidden rounded-md border border-silver-200 bg-white">
                <Photo image="instagram/banner-yokoju" alt="「住宅のことならヨコジュウへ」と書かれた、横浜総合住設のイラストバナー" sizes="(min-width: 1024px) 19vw, 44vw" />
              </div>
              <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">住宅のことなら、ヨコジュウへ</figcaption>
            </figure>
          </div>
        </div>

        <div {...reveal(120)}>
          <dl className="dl-spec text-[0.9375rem]">
            <div>
              <dt>会社名</dt>
              <dd>
                {siteConfig.name}
                <span className="block text-sm text-ink-mute">{siteConfig.nameEn}</span>
              </dd>
            </div>
            {offices.map((key) => (
              <div key={key}>
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
            {phone && (
              <div>
                <dt>電話</dt>
                <dd>
                  <a href={telHref(phone)} className="num text-xl font-semibold tracking-wider text-navy-900 hover:text-brand-600" data-cv="tel">
                    {phone}
                  </a>
                  {hours && <span className="ml-2 text-sm text-ink-mute">受付 {hours}</span>}
                </dd>
              </div>
            )}
            <div>
              <dt>事業内容</dt>
              <dd>住宅設備工事、太陽光発電・蓄電池、外壁・屋根塗装、住宅リフォーム、造園・外構工事</dd>
            </div>
            <div>
              <dt>対応エリア</dt>
              <dd>横浜市戸塚区を中心に、横浜市全域、神奈川県・東京都</dd>
            </div>
          </dl>
          <div className="mt-7">
            <LinkButton href="/company" variant="outline">
              会社案内を見る
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
