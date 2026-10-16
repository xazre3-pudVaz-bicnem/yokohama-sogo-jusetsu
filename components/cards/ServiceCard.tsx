import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Illust, PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { servicePath, type Service } from "@/data/services";
import { hasImage, type ImageKey } from "@/lib/images";

/**
 * サービスへのリンク。
 *   ServiceTile     … 名称と一言に、工事の小さなイラストを添えた白い角丸のパネル（トップページ・関連サービス）
 *   ServiceThumbRow … 小さな写真つきのパネル（サービス一覧ページ）
 * イラストは、全サービスで同じ絵柄・同じ配色（Codex の画像生成で作った ai/svc-<slug>。docs/IMAGE_SOURCES.md）。
 * サービスごとに色を変えたアイコンは使わない。イラストの無いサービス（下のページなど）は、文字だけで出す。
 */
type Level = "h3" | "h4";

/** サービスのイラスト（無ければ undefined） */
export function serviceSpot(service: Pick<Service, "slug">): ImageKey | undefined {
  const key = `ai/svc-${service.slug}`;
  return hasImage(key) ? key : undefined;
}

export function ServiceTile({ service, headingLevel: H = "h3" }: { service: Service; headingLevel?: Level }) {
  const spot = serviceSpot(service);
  return (
    <Link href={servicePath(service)} className="card card-line card-hover group flex h-full items-center gap-3 px-4 py-3.5 sm:px-5">
      {spot && (
        <span className="spot-tile" aria-hidden="true">
          <Illust image={spot} width={64} className="spot-img transition-transform duration-300 group-hover:-translate-y-0.5" />
        </span>
      )}
      <div className="flex-1">
        {/* イラストの分だけ幅が狭いので、名前は文節で折り返す（「ガ｜ス」のように語の途中で切らない） */}
        <H className="text-[0.9688rem] font-bold leading-snug transition-colors group-hover:text-brand-700">
          <Phrase>{service.name}</Phrase>
        </H>
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
