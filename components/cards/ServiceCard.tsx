import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { servicePath, type Service } from "@/data/services";

/**
 * サービスへのリンク。
 *   ServiceTile     … 名称と一言を、1枚ずつ白い角丸のパネルにしたもの（トップページ・関連サービス）
 *   ServiceThumbRow … 小さな写真つきのパネル（サービス一覧ページ）
 * サービスごとの色分けやアイコンは使わない。
 */
type Level = "h3" | "h4";

export function ServiceTile({ service, headingLevel: H = "h3" }: { service: Service; headingLevel?: Level }) {
  return (
    <Link href={servicePath(service)} className="card card-line card-hover group flex h-full items-center gap-3 px-4 py-3.5 sm:px-5">
      <div className="flex-1">
        <H className="text-[0.9688rem] font-bold leading-snug transition-colors group-hover:text-brand-700">{service.name}</H>
        <p className="mt-1 text-xs leading-relaxed text-ink-mute">{service.catch}</p>
      </div>
      <span className="arrow-dot">
        <Icon name="arrowRight" className="size-4" />
      </span>
    </Link>
  );
}

export function ServiceThumbRow({ service, headingLevel: H = "h3" }: { service: Service; headingLevel?: "h2" | "h3" }) {
  return (
    <Link href={servicePath(service)} className="card card-line card-hover group grid grid-cols-[6.5rem_1fr] items-center gap-4 p-3 sm:grid-cols-[11rem_1fr_auto] sm:gap-6 sm:p-4">
      <div className="photo-card-sm zoom-wrap relative aspect-[4/3]">
        <PhotoFill image={service.image} alt="" sizes="(min-width: 640px) 176px, 104px" className="zoom-img" />
      </div>
      <div>
        <H className="text-[1.0625rem] font-bold leading-snug transition-colors group-hover:text-brand-700 sm:text-lg">
          <Phrase>{service.name}</Phrase>
        </H>
        <p className="mt-1.5 text-sm leading-[1.85] text-ink-body sm:mt-2 sm:text-[0.9375rem]">{service.summary}</p>
      </div>
      <span className="arrow-dot hidden sm:grid">
        <Icon name="arrowRight" className="size-4" />
      </span>
    </Link>
  );
}
