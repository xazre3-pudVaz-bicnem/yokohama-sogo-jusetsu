import Link from "next/link";
import { ServiceFeatureCard } from "@/components/cards/ServiceCard";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredServiceSlugs, getService, serviceCategories, servicesByCategory } from "@/data/services";
import { ACCENT_TEXT } from "@/lib/accent";
import { reveal } from "@/lib/reveal";

/**
 * 02 主要サービス。
 * 上段：主力の6サービスを、大きさに差を付けた写真カードで見せる（先頭の2つが大きい）。
 * 下段：全サービスを5つの分類に整理して一覧にする（「結局、何屋なのか」が分かるように）。
 */
export function ServicesSection() {
  const [first, second, ...rest] = featuredServiceSlugs.map((slug) => getService(slug)!);

  return (
    <section aria-labelledby="home-services" className="bg-white pb-[clamp(3.5rem,7vw,6.5rem)] pt-[10.75rem] sm:pt-[11.5rem] lg:pt-36">
      <div className="container-x">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <SectionHeading
            id="home-services"
            eyebrow="横浜総合住設のサービス"
            title={
              <>
                <span className="ib">毎日使う設備から、</span>
                <span className="ib">家の外まわりまで。</span>
                <br className="hidden sm:block" />
                <span className="ib">住まいの工事を</span>
                <span className="ib">ひとつの窓口で。</span>
              </>
            }
            lead="給湯器やエアコンの交換のような「今日困っていること」から、外壁の塗り替えやリフォームのような「そろそろ考えたいこと」まで。どの工事も、設置場所と暮らし方を見たうえでご提案します。"
          />
          <Link href="/service" className="link-arrow shrink-0" {...reveal(100)}>
            サービス一覧を見る
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>

        {/* 主力サービス */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-12 lg:gap-5">
          <div className="col-span-2 lg:col-span-6" {...reveal()}>
            <ServiceFeatureCard service={first} tall sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <div className="col-span-2 lg:col-span-6" {...reveal(100)}>
            <ServiceFeatureCard service={second} tall sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          {rest.map((s, i) => (
            <div key={s.slug} className="col-span-1 lg:col-span-3" {...reveal(i * 80)}>
              <ServiceFeatureCard service={s} sizes="(min-width: 1024px) 25vw, 50vw" />
            </div>
          ))}
        </div>

        {/* すべてのサービス（分類ごと） */}
        {/* スマホでは分類の説明文を省き、行を詰める（一覧が長くなりすぎないように） */}
        <div className="mt-12 rounded-lg bg-silver-50 p-5 sm:p-9 lg:mt-20 lg:p-12">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1" {...reveal()}>
            <h3 className="h-sub">すべてのサービス</h3>
            <p className="text-sm text-ink-mute">5つの分野・{serviceCategories.reduce((n, c) => n + servicesByCategory(c.id).length, 0)}のサービス</p>
          </div>
          <div className="mt-6 grid gap-x-7 gap-y-7 sm:mt-7 sm:grid-cols-2 sm:gap-y-9 lg:grid-cols-[1.4fr_1fr_1.15fr_1fr_1fr]">
            {serviceCategories.map((cat, i) => (
              <div key={cat.id} {...reveal(i * 70)}>
                <p className="eyebrow">{cat.name}</p>
                <p className="mt-2 hidden text-[0.8125rem] leading-relaxed text-ink-mute sm:block">{cat.description}</p>
                <ul className="mt-2.5 border-t border-silver-300 sm:mt-3">
                  {servicesByCategory(cat.id).map((s) => (
                    <li key={s.slug} className="border-b border-silver-300">
                      <Link href={`/service/${s.slug}`} className="group flex min-h-11 items-center gap-2.5 py-2 text-[0.9375rem] font-bold leading-snug text-ink transition-colors hover:text-brand-700 sm:min-h-12 sm:py-2.5">
                        <Icon name={s.icon} className={`size-[1.15rem] ${ACCENT_TEXT[s.accent]}`} />
                        <span className="flex-1">{s.shortName}</span>
                        <Icon name="chevronRight" className="size-4 text-silver-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-600" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
