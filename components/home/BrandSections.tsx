import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Illust, PhotoFill } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { strengths } from "@/data/company";
import { serviceCategories, servicesByCategory } from "@/data/services";
import { img } from "@/lib/images";
import { reveal } from "@/lib/reveal";
import { siteConfig } from "@/lib/site";

/**
 * 03 「住まいのことならヨコジュウへ」
 * 困りごとが別々でも、相談先はひとつ、という会社の立ち位置を図で見せる。
 */
const WORRIES = ["給湯器のお湯が、ぬるい気がする…", "エアコンも、もう10年以上…", "外壁の色あせ、そろそろ？"];

export function BrandMessageSection() {
  const mark = img("brand/logo-mark-dark");
  return (
    <section aria-labelledby="home-brand" className="cv bg-silver-soft section">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:gap-16">
          {/* 困りごと（人物イラストと吹き出し） */}
          <div className="relative order-2 mx-auto w-full max-w-md lg:order-1 lg:max-w-none">
            <ul className="space-y-3">
              {WORRIES.map((w, i) => (
                <li key={w} className={`bubble bubble-down w-fit text-[0.9375rem] ${i === 1 ? "ml-auto" : i === 2 ? "ml-8" : ""}`} {...reveal(i * 140, i === 1 ? "right" : "left")}>
                  {w}
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-end justify-center" {...reveal(380, "pop")}>
              <Illust image="illust/people-couple-think" width={340} className="h-auto w-[70%] max-w-[21rem]" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              id="home-brand"
              eyebrow="住まいのことなら、ヨコジュウへ"
              title={
                <>
                  <span className="ib">困りごとが</span>
                  <span className="ib">いくつあっても、</span>
                  <br />
                  <span className="ib">相談する先は</span>
                  <span className="ib">
                    <span className="marker">ひとつ</span>でいい。
                  </span>
                </>
              }
            />
            <div className="mt-6 space-y-4 text-[0.9688rem] leading-[2.05]" {...reveal(80)}>
              <p>
                給湯器が壊れたら設備の会社、外壁が傷んだら塗装の会社、庭木が伸びたら植木屋さん。住まいの困りごとは、そのたびに頼む先を探すことになりがちです。
              </p>
              <p>
                {siteConfig.name}は、その窓口をひとつにまとめます。住宅設備の交換から、太陽光発電、外壁塗装、リフォーム、庭の手入れまで。関係する工事をまとめて見られるので、順番も日程も、無駄なく組めます。
              </p>
              <p className="text-sm text-ink-mute">
                「{siteConfig.nickname}」は、{siteConfig.shortName}の愛称です。住まいで困ったとき、まず思い出していただける名前を目指しています。
              </p>
            </div>
          </div>
        </div>

        {/* 5つの分野 → ひとつの窓口 */}
        <div className="mt-12 lg:mt-16" {...reveal()}>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {serviceCategories.map((cat) => {
              const list = servicesByCategory(cat.id);
              return (
                <li key={cat.id} className="relative rounded-lg border border-silver-200 bg-white p-4 lg:p-5 [&:last-child]:col-span-2 sm:[&:last-child]:col-span-1">
                  <p className="text-[0.9375rem] font-extrabold text-navy-900">{cat.name}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-mute">{list.map((s) => s.shortName).join("／")}</p>
                  <span aria-hidden="true" className="absolute -bottom-4 left-1/2 hidden h-4 w-px bg-navy-900 lg:block" />
                </li>
              );
            })}
          </ul>
          <div aria-hidden="true" className="mx-[10%] mt-4 hidden h-4 border-x border-b border-navy-900 lg:block" />
          <div aria-hidden="true" className="mx-auto h-5 w-px bg-navy-900" />
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-lg bg-navy-900 px-6 py-5 text-center text-white sm:flex-row sm:text-left">
            <Image src={mark.src} width={62} height={Math.round((mark.height / mark.width) * 62)} alt="" sizes="62px" quality={75} className="shrink-0" />
            <div>
              <p className="text-lg font-extrabold tracking-wider">
                窓口は、{siteConfig.shortName}（{siteConfig.nickname}）ひとつ。
              </p>
              <p className="mt-1 text-sm leading-relaxed text-silver-200">ご相談、現地調査、お見積もり、施工、工事のあとのご相談まで、同じ会社が担当します。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 04 横浜総合住設の特徴
 * 根拠の無い数字や順位は書かない。Instagram に載っている実際の現場の写真を、根拠として添える。
 */
export function StrengthsSection() {
  const photos = strengths.filter((s) => s.photo).map((s) => s.photo!);
  return (
    <section aria-labelledby="home-strengths" className="cv section bg-white">
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="home-strengths"
            eyebrow="横浜総合住設の特徴"
            title={
              <>
                できることの幅と、
                <br />
                現場の丁寧さ。
              </>
            }
            lead="「全部できます」と言うだけなら簡単です。大切なのは、ひとつひとつの工事をどう仕上げるか。私たちの仕事の進め方を、実際の現場の写真と一緒にご紹介します。"
          />
          <ul className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
            {photos.map((p, i) => (
              <li key={p.key} {...reveal(i * 100, "zoom")}>
                <figure>
                  <div className={`relative overflow-hidden rounded-md bg-silver-100 ${i === 1 ? "aspect-[3/4]" : "aspect-[3/4]"}`}>
                    <PhotoFill image={p.key} alt={p.alt} sizes="(min-width: 1024px) 14vw, 33vw" />
                  </div>
                  <figcaption className="mt-2 text-[0.6875rem] leading-snug text-ink-mute sm:text-xs">{p.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-mute">写真は、当社の施工現場で撮影したものです。</p>
        </div>

        <ol className="rows">
          {strengths.map((s, i) => (
            <li key={s.id} className="flex gap-4 py-6 sm:gap-6" {...reveal(Math.min(i, 3) * 60)}>
              <span className="num w-9 shrink-0 pt-0.5 text-2xl font-semibold leading-none text-brand-600 sm:w-11 sm:text-[1.75rem]">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1">
                <h3 className="flex items-center gap-2.5 text-[1.0938rem] font-extrabold leading-snug sm:text-lg">
                  <Icon name={s.icon} className="size-5 text-navy-700" />
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-[1.95]">{s.body}</p>
              </div>
            </li>
          ))}
          <li className="py-5">
            <Link href="/company" className="link-arrow">
              会社案内を見る
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </li>
        </ol>
      </div>
    </section>
  );
}
