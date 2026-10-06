import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import type { Service } from "@/data/services";
import { ACCENT_BG, ACCENT_SOFT } from "@/lib/accent";

/**
 * サービスのカード。3つの大きさがある。
 *   feature … 写真を全面に敷き、下に文字を重ねる（トップページの主力サービス）
 *   photo   … 上に写真、下に文字（一覧ページ・関連サービス）
 *   row     … 写真なしの1行（その他のサービスを整理して並べるとき）
 */
export function ServiceFeatureCard({ service, sizes, tall = false, priority = false }: { service: Service; sizes: string; tall?: boolean; priority?: boolean }) {
  return (
    <Link
      href={`/service/${service.slug}`}
      className={`zoom-wrap group relative flex ${tall ? "min-h-[16.5rem] sm:min-h-[24rem] lg:min-h-[30rem]" : "min-h-[11.5rem] sm:min-h-[17rem]"} flex-col justify-end overflow-hidden rounded-lg bg-navy-900 text-white`}
    >
      <PhotoFill image={service.image} alt={service.imageAlt} sizes={sizes} priority={priority} className="zoom-img" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/45 to-navy-950/5" />
      <span aria-hidden="true" className={`absolute left-0 top-0 h-1.5 w-24 ${ACCENT_BG[service.accent]}`} />
      <div className={`relative ${tall ? "p-5 sm:p-8" : "p-3.5 sm:p-6"}`}>
        <span className={`items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wider backdrop-blur-sm ${tall ? "inline-flex" : "hidden sm:inline-flex"}`}>
          <Icon name={service.icon} className="size-4" />
          {service.shortName}
        </span>
        <h3 className={`text-balance font-extrabold leading-snug !text-white ${tall ? "mt-3 text-[1.4rem] sm:text-[1.9rem]" : "text-[0.9375rem] sm:mt-3 sm:text-[1.4rem]"}`}>
          <Phrase>{service.name}</Phrase>
        </h3>
        <p className={`mt-2 text-sm leading-relaxed text-silver-200 ${tall ? "max-w-md sm:text-[0.9375rem]" : "hidden sm:block"}`}>{service.catch}</p>
        <span className={`items-center gap-2 text-sm font-bold text-sky-300 ${tall ? "mt-4 inline-flex" : "mt-1.5 inline-flex text-xs sm:mt-4 sm:text-sm"}`}>
          くわしく見る
          <Icon name="arrowRight" className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}

export function ServicePhotoCard({ service, sizes, headingLevel: H = "h3" }: { service: Service; sizes: string; headingLevel?: "h2" | "h3" }) {
  return (
    <Link href={`/service/${service.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-silver-200 bg-white transition-shadow duration-300 hover:shadow-[var(--shadow-card)]">
      <div className="zoom-wrap relative aspect-[16/10]">
        <PhotoFill image={service.image} alt={service.imageAlt} sizes={sizes} className="zoom-img" />
        <span aria-hidden="true" className={`absolute left-0 top-0 h-1.5 w-20 ${ACCENT_BG[service.accent]}`} />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className={`grid size-10 shrink-0 place-items-center rounded-md ${ACCENT_SOFT[service.accent]}`}>
            <Icon name={service.icon} className="size-5" />
          </span>
          <H className="text-balance text-[1.0938rem] font-extrabold leading-snug text-ink transition-colors group-hover:text-brand-700">
            <Phrase>{service.name}</Phrase>
          </H>
        </div>
        <p className="mt-3 flex-1 text-sm leading-[1.85] text-ink-body">{service.summary}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
          くわしく見る
          <Icon name="arrowRight" className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}

export function ServiceRow({ service }: { service: Service }) {
  return (
    <Link href={`/service/${service.slug}`} className="group flex items-center gap-4 py-4">
      <span className={`grid size-11 shrink-0 place-items-center rounded-md ${ACCENT_SOFT[service.accent]}`}>
        <Icon name={service.icon} className="size-5" />
      </span>
      <span className="flex-1">
        <span className="block text-base font-extrabold leading-snug text-ink transition-colors group-hover:text-brand-700">{service.name}</span>
        <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-ink-mute">{service.catch}</span>
      </span>
      <Icon name="arrowRight" className="size-4 shrink-0 text-brand-600 transition-transform duration-300 group-hover:translate-x-1.5" />
    </Link>
  );
}
