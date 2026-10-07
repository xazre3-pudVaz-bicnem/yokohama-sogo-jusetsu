import Link from "next/link";
import { PostRow } from "@/components/cards/PostCard";
import { FaqList } from "@/components/ui/FaqList";
import { Icon } from "@/components/ui/Icon";
import { Photo, PhotoFill } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getArea, yokohamaWards } from "@/data/areas";
import { creditOf, flowSteps, instagramPosts } from "@/data/company";
import { pickupFaqs } from "@/data/faq";
import { getAllPosts } from "@/lib/blog";
import { reveal } from "@/lib/reveal";
import { siteConfig, primaryPhone, telHref, receptionHours, officeAddressWithPostal, officeMapUrl, type OfficeKey } from "@/lib/site";

/** 対応エリア（戸塚区が中心であることを、区の航空写真と町名で伝える） */
export function AreaSection() {
  const totsuka = getArea("totsuka")!;
  const credit = creditOf("area/totsuka-aerial");
  return (
    <section aria-labelledby="home-area" className="cv section bg-white">
      <div className="container-x grid gap-x-12 gap-y-9 lg:grid-cols-12 lg:items-start">
        <figure className="lg:col-span-6" {...reveal(0, "wipe")}>
          <div className="relative aspect-[3/2] bg-silver-100">
            <PhotoFill image="area/totsuka-aerial" alt={totsuka.imageAlt} sizes="(min-width: 1024px) 48vw, 100vw" className="object-[50%_40%]" />
          </div>
          {credit && (
            <figcaption className="mt-2 text-[0.6875rem] leading-relaxed text-ink-mute">
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

        <div className="lg:col-span-6">
          <SectionHeading
            id="home-area"
            title="対応エリア"
            lead="戸塚区深谷町にオフィスを置き、横浜を中心に神奈川・東京エリアで工事を行っています。戸塚区は、川沿いの低地と起伏のある台地に住宅地が広がる、横浜市でいちばん広い区です。敷地の条件が場所ごとに違うため、現地を見てからご提案しています。"
          />
          <dl className="mt-7 border-t border-navy-900 text-[0.875rem] leading-[1.95]" {...reveal(80)}>
            <div className="grid gap-x-6 gap-y-1 border-b border-silver-200 py-4 sm:grid-cols-[7.5rem_1fr]">
              <dt className="font-bold text-ink">横浜市戸塚区</dt>
              <dd>
                {totsuka.towns?.join("・")}
                <span className="mt-1 block text-ink-mute">区内の駅：{totsuka.stations?.map((s) => s.name).join("・")}</span>
              </dd>
            </div>
            <div className="grid gap-x-6 gap-y-1 border-b border-silver-200 py-4 sm:grid-cols-[7.5rem_1fr]">
              <dt className="font-bold text-ink">横浜市</dt>
              <dd>{yokohamaWards.join("・")}</dd>
            </div>
            <div className="grid gap-x-6 gap-y-1 border-b border-silver-200 py-4 sm:grid-cols-[7.5rem_1fr]">
              <dt className="font-bold text-ink">神奈川・東京</dt>
              <dd>神奈川県内・東京都内のエリアにも対応しています。対応できるかどうかは、ご住所をお知らせいただければお答えします。</dd>
            </div>
          </dl>
          <p className="mt-7 flex flex-wrap gap-x-9 gap-y-3" {...reveal(120)}>
            <Link href="/area/totsuka" className="link-arrow">
              戸塚区の住宅設備・リフォーム
              <Icon name="arrowRight" className="size-4" />
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
    <section aria-labelledby="home-business" className="cv section bg-silver-50">
      <div className="container-x grid gap-x-12 gap-y-9 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <SectionHeading
            id="home-business"
            title="法人・工務店・ハウスメーカーの方へ"
            lead="個人のお客様だけでなく、法人・工務店・ハウスメーカーからのご依頼もお受けしています。住宅設備の取り付け、業務用エアコンの工事、空調配管の仕上げなど、現場の条件に合わせて対応します。"
          />
          <ul className="dash-list mt-6 grid gap-x-8 gap-y-2 text-[0.9375rem] font-bold text-ink sm:grid-cols-2" {...reveal(80)}>
            {["住宅設備の設置・交換工事", "業務用エアコンの設置・交換", "空調配管・ラッキングカバー", "リフォームに伴う解体と設備工事"].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="mt-7" {...reveal(120)}>
            <Link href="/business" className="link-arrow">
              法人・工務店向けのご案内
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </p>
        </div>
        <figure className="lg:col-span-6" {...reveal(0, "wipe")}>
          <div className="relative aspect-[4/3] bg-silver-100">
            <PhotoFill image="works/lagging-3" alt="業務用の室外機の間を通る、ラッキングカバーを施工した空調配管" sizes="(min-width: 1024px) 48vw, 100vw" />
          </div>
          <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">業務用空調の配管にラッキングカバーを施工した現場（当社施工）</figcaption>
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
    <section aria-labelledby="home-flow" className="cv section bg-white">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <SectionHeading id="home-flow" title="工事の流れ" lead="お見積もりまでは無料です。内容にご納得いただいてから、ご契約となります。" />
          <Link href="/flow" className="link-arrow shrink-0" {...reveal(80)}>
            工事の流れをくわしく
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
        <ol className="mt-9 grid border-t border-navy-900 sm:grid-cols-2 lg:mt-11 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.id} className="flex gap-4 border-b border-silver-200 py-5 lg:block lg:border-b-0 lg:border-r lg:px-6 lg:py-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0" {...reveal(i * 70)}>
              <p className="num w-7 shrink-0 text-xl font-medium leading-snug text-silver-500 lg:w-auto lg:text-2xl">{i + 1}</p>
              <div className="lg:mt-3">
                <h3 className="text-[1.0313rem] font-bold leading-snug">{s.title}</h3>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-mute lg:mt-2">{s.lead}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Instagram（実際の投稿へのリンク。埋め込みスクリプトは使わず、写真とリンクだけを置く） */
export function InstagramSection() {
  const url = siteConfig.social.instagram;
  if (!url) return null;
  return (
    <section aria-labelledby="home-instagram" className="cv section bg-silver-50">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <SectionHeading id="home-instagram" title="現場の写真（Instagram）" lead="施工の前後や作業中の様子を、Instagram に投稿しています。メッセージでのご相談もお受けしています。" />
          <a href={url} target="_blank" rel="noopener noreferrer" className="link-arrow shrink-0" {...reveal(80)}>
            Instagram を開く
            <Icon name="arrowUpRight" className="size-4" />
          </a>
        </div>
        <ul className="mt-9 grid grid-cols-2 gap-x-1.5 gap-y-5 sm:grid-cols-3 sm:gap-x-2 lg:mt-11 lg:grid-cols-6">
          {instagramPosts.map((p, i) => (
            <li key={p.url} {...reveal((i % 6) * 50)}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="zoom-wrap group relative block aspect-square bg-silver-100" aria-label={`${p.caption}（Instagram の投稿を開く）`}>
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

/** コラム（新しい順に、題名だけの一覧で） */
export function BlogSection() {
  const posts = getAllPosts().slice(0, 5);
  if (!posts.length) return null;
  return (
    <section aria-labelledby="home-blog" className="cv section bg-white">
      <div className="container-x grid gap-x-12 gap-y-7 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="home-blog" title="住宅設備コラム" lead="交換の時期、機種の選び方、費用の考え方などを、設備ごとにまとめています。" />
          <p className="mt-6" {...reveal(80)}>
            <Link href="/blog" className="link-arrow">
              コラムの一覧
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </p>
        </div>
        <ul className="rows lg:col-span-8" {...reveal(60)}>
          {posts.map((p) => (
            <li key={p.slug}>
              <PostRow post={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** よくある質問（/faq の抜粋。構造化データは /faq にだけ出すので、ここでは出さない） */
export function FaqSection() {
  return (
    <section aria-labelledby="home-faq" className="cv section bg-silver-50">
      <div className="container-x grid gap-x-12 gap-y-7 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="home-faq" title="よくある質問" lead="見積もりの費用、対応エリア、補助金のことなど、ご相談の前によくいただく質問です。" />
          <p className="mt-6" {...reveal(80)}>
            <Link href="/faq" className="link-arrow">
              よくある質問の一覧
              <Icon name="arrowRight" className="size-4" />
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

/** 会社概要（表記は lib/site.ts から。未確認の項目は出ない） */
export function CompanySection() {
  const phone = primaryPhone();
  const hours = receptionHours();
  const offices: OfficeKey[] = ["head", "totsuka"];
  return (
    <section aria-labelledby="home-company" className="cv section bg-white">
      <div className="container-x grid gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="home-company" title="会社概要" />
          <figure className="mt-6 max-w-xs" {...reveal(80)}>
            <div className="border border-silver-200">
              <Photo image="company/nameplate" alt="「株式会社 横浜総合住設」と書かれた表札" sizes="(min-width: 1024px) 24vw, 80vw" />
            </div>
            <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">事業所の表札</figcaption>
          </figure>
        </div>

        <div className="lg:col-span-8" {...reveal(60)}>
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
                  <a href={telHref(phone)} className="num text-lg font-medium tracking-wider text-navy-900 hover:text-brand-700" data-cv="tel">
                    {phone}
                  </a>
                  {hours && <span className="ml-3 text-sm text-ink-mute">受付 {hours}</span>}
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
            <Link href="/company" className="link-arrow">
              会社案内
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
