import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { LinkButton, PhoneButton } from "@/components/ui/Button";
import { PhotoFill } from "@/components/ui/Photo";
import { getService } from "@/data/services";
import { siteConfig } from "@/lib/site";

/**
 * トップページの最初の画面。3秒で「何の会社か・どこで対応しているか・何ができるか」を伝える。
 * - h1 は地域名と業種（検索の主キーワード）。視覚的に一番大きいのはブランドコピー。
 * - 写真は最初の描画で読み込む（priority）。文字には登場アニメーションを付けない（LCP を遅らせないため）。
 * - 写真の下に、主なサービスへの入口を並べる（すぐ下の「サービス」の区画へつながる）。
 */
const QUICK = ["water-heater", "air-conditioner", "toilet", "solar", "exterior-painting", "reform"] as const;

export function Hero() {
  return (
    <section className="relative isolate bg-navy-950 text-white">
      {/*
        写真。
        スマホ：縦長の画面に横長の写真を全面に敷くと、家がほとんど見えなくなる。
                上の帯にだけ写真を見せ、下へ向かって濃紺に溶かす（文字は濃い部分に載る）。
        タブレット以上：区画の全面に敷き、濃紺を重ねる。PC では左（文字側）を濃く、右は写真を見せる。
      */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[21.5rem] overflow-hidden sm:inset-0 sm:h-auto">
        <PhotoFill
          image="photos/hero-hillside-house"
          alt="丘の上に建つ住宅と、遠くに見える横浜の街並み"
          sizes="100vw"
          priority
          className="hero-settle object-[80%_50%] sm:object-[60%_50%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(2_11_36/0.28)_0%,rgb(2_11_36/0.42)_30%,rgb(2_11_36/0.9)_70%,rgb(2_11_36)_100%)] sm:hidden" />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-b from-navy-950/85 via-navy-950/70 to-navy-950/90 sm:block lg:bg-gradient-to-r lg:from-navy-950/95 lg:via-navy-900/72 lg:to-navy-900/5"
        />
        <div aria-hidden="true" className="absolute inset-y-0 left-[46%] hidden w-px -skew-x-[24deg] bg-gradient-to-b from-transparent via-sky-400/60 to-transparent lg:block" />
      </div>

      <div className="container-x pb-8 pt-[9.75rem] sm:pb-14 sm:pt-16 lg:pb-20 lg:pt-24">
        <div className="max-w-[46rem] [text-shadow:0_1px_14px_rgb(2_11_36/0.55)] sm:[text-shadow:none]">
          <h1 className="text-[0.9375rem] font-bold leading-relaxed tracking-[0.1em] !text-white sm:text-lg">
            <span className="eyebrow eyebrow-on-dark !text-[1em]">
              {siteConfig.primaryArea.city}
              {siteConfig.primaryArea.ward}の住宅設備・リフォームなら
            </span>
            <span className="mt-1 block text-[1.05em] tracking-[0.16em]">{siteConfig.name}</span>
          </h1>

          <p className="h-display mt-6 text-balance sm:mt-8">
            住まいのことなら、
            <br />
            まとめて<span className="text-sky-400">ヨコジュウ</span>へ。
          </p>

          <p className="mt-6 max-w-[34rem] text-[0.9688rem] leading-[2] text-silver-100 sm:text-[1.0313rem]">
            給湯器・エアコン・トイレ・太陽光・蓄電池・外壁塗装・リフォーム・解体・造園まで。
            <span className="ib">横浜市戸塚区を中心に、</span>
            <span className="ib">住まいの工事をワンストップで対応します。</span>
          </p>

          {/* スマホ：見積もりを横いっぱいに、電話とお問い合わせを2列に（縦に3つ積まない） */}
          <div className="mt-8 grid grid-cols-[1.2fr_1fr] gap-2.5 [text-shadow:none] sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            <LinkButton href="/contact" icon="document" className="col-span-2">
              無料見積もりを依頼する
            </LinkButton>
            <PhoneButton variant="white" className="max-sm:!gap-1.5 max-sm:!px-2.5" />
            <LinkButton href="/contact#form" variant="ghostDark" icon="mail" arrow={false} className="max-sm:!px-2.5 max-sm:[&>svg]:hidden">
              お問い合わせ
            </LinkButton>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[0.8438rem] font-bold tracking-wider text-silver-100">
            {["見積もり無料", "現地調査にうかがいます", "神奈川・東京エリア対応"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Icon name="check" className="size-4 text-sky-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/*
        主なサービスへの入口（区画の下端に半分だけ重ねる。次の区画は、その分の余白を上に取る）。
        スマホは行の高さを決め打ちにして、ちょうど1行分（7.25rem）だけ下へはみ出させる。
        タブレット以上は、高さの半分だけ下へずらす。
      */}
      <nav aria-label="主なサービス" className="container-x relative z-10">
        <ul className="-mb-[7.25rem] grid grid-cols-3 overflow-hidden rounded-lg bg-white shadow-[var(--shadow-lift)] sm:mb-0 sm:translate-y-1/2 lg:grid-cols-6">
          {QUICK.map((slug) => {
            const s = getService(slug)!;
            return (
              <li key={slug} className="border-b border-r border-silver-200 [&:nth-child(3n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(6n)]:!border-r-0 [&:nth-last-child(-n+3)]:border-b-0">
                <Link
                  href={`/service/${s.slug}`}
                  className="group flex h-[7.25rem] flex-col items-center justify-center gap-2 px-2 text-center transition-colors hover:bg-brand-50 sm:h-full sm:justify-start sm:py-5 lg:py-6"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-navy-900 text-white transition-colors group-hover:bg-brand-600 lg:size-12">
                    <Icon name={s.icon} className="size-5 lg:size-6" />
                  </span>
                  {/* 「・」の後ろでだけ折り返す（語の途中で切れないように） */}
                  <span className="text-[0.8125rem] font-extrabold leading-tight text-navy-900 sm:text-sm lg:text-[0.9375rem]">
                    {s.shortName.split("・").map((part, i, arr) => (
                      <span key={part} className="ib">
                        {part}
                        {i < arr.length - 1 ? "・" : ""}
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
