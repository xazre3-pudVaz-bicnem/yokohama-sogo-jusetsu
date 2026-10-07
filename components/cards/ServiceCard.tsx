import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import type { Service } from "@/data/services";

/**
 * サービスへのリンク。枠つきのカードにはせず、細い線で区切った「行」として並べる（呼び出し側で .rows を付ける）。
 *   ServiceRow      … 名称と一言だけの行（トップページ・関連サービスなど）
 *   ServiceThumbRow … 小さな写真つきの行（サービス一覧ページ）
 * サービスごとの色分けやアイコンは使わない。
 */
export function ServiceRow({ service, onDark = false, headingLevel: H = "h3" }: { service: Service; onDark?: boolean; /** 名称の見出しの段。上の見出しが h3 のときは h4 にする */ headingLevel?: "h3" | "h4" }) {
  return (
    <Link href={`/service/${service.slug}`} className="group flex items-center gap-4 py-4">
      <div className="flex-1">
        <H className={`text-base font-bold leading-snug transition-colors ${onDark ? "!text-white group-hover:!text-sky-300" : "text-ink group-hover:text-brand-700"}`}>{service.name}</H>
        <p className={`mt-1 text-[0.8125rem] leading-relaxed ${onDark ? "text-silver-300" : "text-ink-mute"}`}>{service.catch}</p>
      </div>
      <Icon name="arrowRight" className={`size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${onDark ? "text-silver-300" : "text-navy-900"}`} />
    </Link>
  );
}

export function ServiceThumbRow({ service, headingLevel: H = "h3" }: { service: Service; headingLevel?: "h2" | "h3" }) {
  return (
    <Link href={`/service/${service.slug}`} className="group grid grid-cols-[6.5rem_1fr] items-start gap-4 py-5 sm:grid-cols-[11rem_1fr_auto] sm:items-center sm:gap-7 sm:py-6">
      <div className="zoom-wrap relative aspect-[4/3] bg-silver-100">
        <PhotoFill image={service.image} alt="" sizes="(min-width: 640px) 176px, 104px" className="zoom-img" />
      </div>
      <div>
        <H className="text-[1.0625rem] font-bold leading-snug text-ink transition-colors group-hover:text-brand-700 sm:text-lg">
          <Phrase>{service.name}</Phrase>
        </H>
        <p className="mt-1.5 text-sm leading-[1.85] text-ink-body sm:mt-2 sm:text-[0.9375rem]">{service.summary}</p>
      </div>
      <Icon name="arrowRight" className="hidden size-4 text-navy-900 transition-transform duration-300 group-hover:translate-x-1 sm:block" />
    </Link>
  );
}
