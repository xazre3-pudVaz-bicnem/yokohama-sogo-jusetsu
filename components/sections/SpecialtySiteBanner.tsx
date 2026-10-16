import { Icon } from "@/components/ui/Icon";
import { Illust } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import type { SpecialtyLink } from "@/data/specialty";
import { img } from "@/lib/images";
import { siteConfig } from "@/lib/site";

/**
 * 給湯器専門サイト（同じ会社が運営。https://www.yokoju-boiler.com）への案内。
 *
 * 専門サイトの目印（泡の背景・案内役の「ゆげまる」・赤のボタン）をそのまま使い、移った先で
 * 「さっきの会社の給湯器のサイト」だと分かるようにする。このサイトの青と紺の配色から、あえて外している。
 * 置く場所（data/specialty.ts の分担どおり、給湯器の話をしているところだけ）：
 *   - 給湯器まわりのサービスページの上の方（data/services/*.ts の specialtySite）
 *   - トップの事業内容（住宅設備のまとまり）
 *   - 給湯器の記事の末尾（data/specialty.ts の boilerLinkForPost）
 * 見出しの要素（h2・h3）は使わない（ページの見出しの並びを変えないため）。
 */
export function SpecialtySiteBanner({
  title,
  note,
  links = [],
  mascot = "point",
  compact = false,
  className = "",
}: {
  title: string;
  note: string;
  links?: SpecialtyLink[];
  mascot?: "point" | "wave" | "ok";
  compact?: boolean;
  className?: string;
}) {
  const site = siteConfig.specialtySites.boiler;
  return (
    <aside aria-label={`${site.label}のご案内`} className={`boiler-banner ${compact ? "boiler-banner-compact" : ""} ${className}`}>
      {/* 泡の背景（専門サイトのトップと同じ絵）。文字の側は白をかぶせて読みやすくする */}
      <span aria-hidden="true" className="boiler-banner-bg" style={{ backgroundImage: `url(${img("boiler/bubbles").src})` }} />
      <div className="relative grid items-center gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
        <Illust image={`boiler/mascot-${mascot}`} width={compact ? 96 : 120} className={`mx-auto h-auto ${compact ? "w-20 sm:w-24" : "w-24 sm:w-[7.5rem]"}`} />
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="boiler-label">{site.label}</span>
            <span className="text-xs text-ink-mute">同じ横浜総合住設が運営しています</span>
          </p>
          <p className={`mt-2 font-heading font-black leading-snug text-navy-900 ${compact ? "text-[1.0625rem] sm:text-[1.1875rem]" : "text-[1.1875rem] sm:text-[1.375rem]"}`}>
            <Phrase>{title}</Phrase>
          </p>
          <p className="mt-1.5 text-[0.875rem] leading-[1.9] text-ink-body sm:text-[0.9375rem]">{note}</p>
          {links.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} className="boiler-chip" target="_blank" rel="noopener">
                    {l.label}
                    <Icon name="arrowUpRight" className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4">
            <a href={site.url} className="btn btn-boiler" target="_blank" rel="noopener">
              {site.label}を見る
              <Icon name="arrowUpRight" className="size-4" />
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}
