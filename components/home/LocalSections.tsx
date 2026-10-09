import Link from "next/link";
import { PostCard, PostRow } from "@/components/cards/PostCard";
import { FaqList } from "@/components/ui/FaqList";
import { Icon } from "@/components/ui/Icon";
import { Illust, Photo, PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getArea, yokohamaWards } from "@/data/areas";
import { creditOf, flowSteps, instagramPosts } from "@/data/company";
import { pickupFaqs } from "@/data/faq";
import { greeting, representativeLabel } from "@/data/greeting";
import { getAllPosts } from "@/lib/blog";
import { reveal } from "@/lib/reveal";
import { siteConfig, primaryPhone, telHref, receptionHours, officeAddressWithPostal, officeMapUrl, type OfficeKey } from "@/lib/site";

/** 対応エリア（戸塚区が中心であることを、区の航空写真と町名で伝える） */
export function AreaSection() {
  const totsuka = getArea("totsuka")!;
  const credit = creditOf("area/totsuka-aerial");
  return (
    <section aria-labelledby="home-area" className="cv band band-cream deco-tr section">
      <div className="container-x grid items-center gap-x-14 gap-y-10 lg:grid-cols-2">
        <figure {...reveal(0, "left")}>
          <div className="photo-frame">
            <div className="photo-card relative aspect-[3/2] border-[5px] border-white">
              <PhotoFill image="area/totsuka-aerial" alt={totsuka.imageAlt} sizes="(min-width: 1024px) 44vw, 100vw" className="object-[50%_40%]" />
            </div>
          </div>
          {credit && (
            <figcaption className="mt-3 text-[0.6875rem] leading-relaxed text-ink-mute">
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

        <div>
          <SectionHeading
            id="home-area"
            eyebrow="戸塚区を中心に"
            title="対応エリア"
            lead="戸塚区深谷町にオフィスを置き、横浜を中心に神奈川・東京エリアで工事を行っています。戸塚区は、川沿いの低地と起伏のある台地に住宅地が広がる、横浜市でいちばん広い区です。敷地の条件が場所ごとに違うため、現地を見てからご提案しています。"
          />
          <dl className="card mt-7 px-5 py-1 text-[0.875rem] leading-[1.95] sm:px-7" {...reveal(80)}>
            <div className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[7.5rem_1fr]">
              <dt className="font-heading font-bold text-navy-900">横浜市戸塚区</dt>
              <dd>
                {totsuka.towns?.join("・")}
                <span className="mt-1 block text-ink-mute">区内の駅：{totsuka.stations?.map((s) => s.name).join("・")}</span>
              </dd>
            </div>
            <div className="grid gap-x-6 gap-y-1 border-t-2 border-dotted border-silver-300 py-4 sm:grid-cols-[7.5rem_1fr]">
              <dt className="font-heading font-bold text-navy-900">横浜市</dt>
              <dd>{yokohamaWards.join("・")}</dd>
            </div>
            <div className="grid gap-x-6 gap-y-1 border-t-2 border-dotted border-silver-300 py-4 sm:grid-cols-[7.5rem_1fr]">
              <dt className="font-heading font-bold text-navy-900">神奈川・東京</dt>
              <dd>神奈川県内・東京都内のエリアにも対応しています。対応できるかどうかは、ご住所をお知らせいただければお答えします。</dd>
            </div>
          </dl>
          <p className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3" {...reveal(120)}>
            <Link href="/area/totsuka" className="btn btn-navy">
              戸塚区の住宅設備・リフォーム
              <Icon name="arrowRight" className="btn-arrow size-4" />
            </Link>
            <Link href="/area/yokohama" className="link-arrow">
              横浜市の対応エリア
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

/** 法人・工務店向け（くわしくは /business） */
export function BusinessSection() {
  return (
    <section aria-labelledby="home-business" className="cv section bg-white">
      <div className="container-x grid items-center gap-x-14 gap-y-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            id="home-business"
            eyebrow="法人のお客様"
            color="navy"
            title="法人・工務店・ハウスメーカーの方へ"
            lead="個人のお客様だけでなく、法人・工務店・ハウスメーカーからのご依頼もお受けしています。住宅設備の取り付け、業務用エアコンの工事、空調配管の仕上げなど、現場の条件に合わせて対応します。"
          />
          <ul className="dash-list mt-6 grid gap-x-8 gap-y-2 text-[0.9375rem] font-bold text-navy-900 sm:grid-cols-2" {...reveal(80)}>
            {["住宅設備の設置・交換工事", "業務用エアコンの設置・交換", "空調配管・ラッキングカバー", "リフォームに伴う解体と設備工事"].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="mt-7" {...reveal(120)}>
            <Link href="/business" className="btn btn-outline">
              法人・工務店向けのご案内
              <Icon name="arrowRight" className="btn-arrow size-4" />
            </Link>
          </p>
        </div>
        <figure {...reveal(0, "right")}>
          <div className="photo-frame photo-frame-r">
            <div className="photo-card relative aspect-[4/3]">
              <PhotoFill image="works/lagging-3" alt="業務用の室外機の間を通る、ラッキングカバーを施工した空調配管" sizes="(min-width: 1024px) 44vw, 100vw" />
            </div>
          </div>
          <figcaption className="mt-3 text-xs leading-relaxed text-ink-mute">業務用空調の配管にラッキングカバーを施工した現場（当社施工）</figcaption>
        </figure>
      </div>
    </section>
  );
}

/** 工事の流れ（トップページでは5段階にまとめる。くわしくは /flow）。順番のある内容なので、番号を付ける */
const FLOW_PICK = ["contact", "survey", "estimate", "work", "handover"];

export function FlowSection() {
  const steps = FLOW_PICK.map((id) => flowSteps.find((s) => s.id === id)!);
  return (
    <section aria-labelledby="home-flow" className="cv band band-paper section">
      <div className="container-x">
        <SectionHeading id="home-flow" eyebrow="ご相談から完了まで" title="工事の流れ" align="center" lead="お見積もりまでは無料です。内容にご納得いただいてから、ご契約となります。" />

        <ol className="mt-10 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.id} className="card relative flex items-center gap-4 px-5 py-5 lg:block lg:px-4 lg:pb-6 lg:pt-7 lg:text-center" {...reveal(i * 80, "pop")}>
              <span className="num absolute -left-2 -top-2 grid size-8 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white shadow-card lg:left-3 lg:top-3">{i + 1}</span>
              <div className="grid size-20 shrink-0 place-items-end overflow-hidden rounded-full bg-cream lg:mx-auto lg:size-24">
                <Illust image={s.pose} width={96} className="mx-auto h-[88%] w-auto" />
              </div>
              <div className="lg:mt-4">
                <h3 className="text-[1.0625rem] font-bold leading-snug">{s.title}</h3>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-mute lg:mt-1.5">{s.lead}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-center" {...reveal()}>
          <Link href="/flow" className="btn btn-outline">
            工事の流れをくわしく
            <Icon name="arrowRight" className="btn-arrow size-4" />
          </Link>
        </p>
      </div>
    </section>
  );
}

/** Instagram（実際の投稿へのリンク。埋め込みスクリプトは使わず、写真とリンクだけを置く） */
export function InstagramSection() {
  const url = siteConfig.social.instagram;
  if (!url) return null;
  return (
    <section aria-labelledby="home-instagram" className="cv section bg-white">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <SectionHeading id="home-instagram" eyebrow="Instagram" color="sun" title="現場の写真（Instagram）" lead="施工の前後や作業中の様子を、Instagram に投稿しています。メッセージでのご相談もお受けしています。" />
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm shrink-0" {...reveal(80)}>
            <Icon name="instagram" className="size-4" />
            Instagram を開く
          </a>
        </div>
        <ul className="mt-9 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:mt-11 lg:grid-cols-6">
          {instagramPosts.map((p, i) => (
            <li key={p.url} {...reveal((i % 6) * 60, "zoom")}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="zoom-wrap group relative block aspect-square overflow-hidden rounded-2xl bg-silver-100 shadow-card" aria-label={`${p.caption}（Instagram の投稿を開く）`}>
                <PhotoFill image={p.image} alt={p.alt} sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" className="zoom-img" />
              </a>
              <p className="mt-2 text-xs leading-relaxed text-ink-mute">{p.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** コラム（新しい3本を写真つきで、続く2本を題名の行で） */
export function BlogSection() {
  const posts = getAllPosts().slice(0, 5);
  if (!posts.length) return null;
  const cards = posts.slice(0, 3);
  const rest = posts.slice(3);
  return (
    <section aria-labelledby="home-blog" className="cv band band-paper section">
      <div className="container-x">
        <SectionHeading id="home-blog" eyebrow="コラム" title="住宅設備コラム" align="center" lead="交換の時期、機種の選び方、費用の考え方などを、設備ごとにまとめています。" />
        <ul className="scroller mt-10 gap-6 sm:grid sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {cards.map((p, i) => (
            <li key={p.slug} className={i === 2 ? "sm:hidden lg:block" : ""} {...reveal(i * 90)}>
              <PostCard post={p} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 80vw" />
            </li>
          ))}
        </ul>
        {rest.length > 0 && (
          <ul className="rows rows-2 mt-6" {...reveal(60)}>
            {rest.map((p) => (
              <li key={p.slug}>
                <PostRow post={p} />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-10 text-center" {...reveal()}>
          <Link href="/blog" className="btn btn-outline">
            コラムの一覧
            <Icon name="arrowRight" className="btn-arrow size-4" />
          </Link>
        </p>
      </div>
    </section>
  );
}

/** よくある質問（/faq の抜粋。構造化データは /faq にだけ出すので、ここでは出さない） */
export function FaqSection() {
  return (
    <section aria-labelledby="home-faq" className="cv band band-cream deco-bl section">
      <div className="container-x grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <SectionHeading id="home-faq" eyebrow="ご相談の前に" title="よくある質問" lead="見積もりの費用、対応エリア、補助金のことなど、ご相談の前によくいただく質問です。" />
          <div className="mt-4 hidden lg:block" {...reveal(120, "pop")}>
            <Illust image="illust/people-woman-think" width={160} className="h-auto w-36 animate-float-slow" />
          </div>
          <p className="mt-6" {...reveal(80)}>
            <Link href="/faq" className="btn btn-outline">
              よくある質問の一覧
              <Icon name="arrowRight" className="btn-arrow size-4" />
            </Link>
          </p>
        </div>
        <div className="lg:col-span-8" {...reveal(60)}>
          <FaqList faqs={pickupFaqs} />
        </div>
      </div>
    </section>
  );
}

/**
 * 会社概要（表記は lib/site.ts から。未確認の項目は出ない）。
 * 代表者が設定されているときは、代表の写真と、代表挨拶の抜粋を添える（全文は会社案内ページ。文章は data/greeting.ts）。
 */
export function CompanySection() {
  const phone = primaryPhone();
  const hours = receptionHours();
  const offices: OfficeKey[] = ["head", "totsuka"];
  const c = siteConfig.company;
  const rep = representativeLabel();
  return (
    <section aria-labelledby="home-company" className="cv section bg-white">
      <div className="container-x grid gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="home-company" eyebrow="運営会社" color="navy" title="会社概要" />
          {rep ? (
            <figure className="mt-7 max-w-[13rem] pl-3 pt-3 lg:max-w-[15rem]" {...reveal(80)}>
              <div className="photo-frame">
                <div className="photo-card">
                  <Photo image={greeting.photo} alt={`${siteConfig.name} ${rep}`} sizes="(min-width: 1024px) 240px, 208px" />
                </div>
              </div>
              <figcaption className="mt-4 text-[0.8125rem] leading-snug text-ink-body">
                {c.representativeTitle}
                <span className="ml-2 font-heading text-base font-bold tracking-wider text-ink">{c.representative}</span>
              </figcaption>
            </figure>
          ) : (
            <figure className="mt-7 max-w-xs" {...reveal(80)}>
              <div className="photo-card-sm shadow-card">
                <Photo image="company/nameplate" alt="「株式会社 横浜総合住設」と書かれた表札" sizes="(min-width: 1024px) 24vw, 80vw" />
              </div>
              <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">事業所の表札</figcaption>
            </figure>
          )}
        </div>

        <div className="lg:col-span-8" {...reveal(60)}>
          {rep && (
            <div className="mb-9">
              <h3 className="text-sm font-bold tracking-wider text-brand-700">代表挨拶より</h3>
              <p className="mt-2.5 font-heading text-[1.1875rem] font-bold leading-[1.75] text-ink sm:text-[1.375rem]">
                <span className="marker">
                  <Phrase>{greeting.title}</Phrase>
                </span>
              </p>
              <div className="mt-4 space-y-2 text-[0.9375rem] leading-[2]">
                {greeting.excerpt.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
              <p className="mt-5">
                <Link href="/company#message" className="link-arrow">
                  代表挨拶の全文
                  <Icon name="arrowRight" className="size-4" />
                </Link>
              </p>
            </div>
          )}
          <dl className="dl-spec card card-line px-5 py-2 text-[0.9375rem] sm:px-8">
            <div>
              <dt>会社名</dt>
              <dd>
                {siteConfig.name}
                <span className="block text-sm text-ink-mute">{siteConfig.nameEn}</span>
              </dd>
            </div>
            {c.representative && (
              <div>
                <dt>{c.representativeTitle ?? "代表者"}</dt>
                <dd>{c.representative}</dd>
              </div>
            )}
            {offices.map((key) => (
              <div key={key}>
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
            {phone && (
              <div>
                <dt>電話</dt>
                <dd>
                  <a href={telHref(phone)} className="num text-lg font-semibold tracking-wider text-navy-900 hover:text-brand-700" data-cv="tel">
                    {phone}
                  </a>
                  {hours && <span className="ml-3 inline-block text-sm text-ink-mute">受付 {hours}</span>}
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
          <p className="mt-7">
            <Link href="/company" className="btn btn-outline">
              会社案内
              <Icon name="arrowRight" className="btn-arrow size-4" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
