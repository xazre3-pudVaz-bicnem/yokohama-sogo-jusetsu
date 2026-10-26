import { Icon } from "@/components/ui/Icon";
import { Illust } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import type { SpecialtyLink } from "@/data/specialty";
import { img, type ImageKey } from "@/lib/images";
import { siteConfig, type SpecialtySiteId } from "@/lib/site";

/**
 * 同じ会社が運営する専門サイトへの案内（lib/site.ts の specialtySites）。
 *
 * それぞれの専門サイトの目印（背景の絵・案内役のキャラクター・ボタンの色）をそのまま使い、移った先で
 * 「さっきの会社の専門サイト」だと分かるようにする。このサイトの青と紺の配色から、あえて外している。
 *   boiler      … 給湯器専門サイト。泡の背景・「ゆげまる」・赤のボタン
 *   solarNerima … 練馬区の太陽光発電・蓄電池のサイト。晴れた住宅地の絵・「ひなたまる」・青緑のボタン・墨色の線
 * 置く場所（data/specialty.ts の分担どおり、その分野の話をしているところだけ）：
 *   - その分野のサービスページ（data/services/*.ts の specialtySite。位置は layout の specialty）
 *   - トップの事業内容（給湯器は住宅設備、太陽光は省エネ・創エネ設備のまとまり）
 *   - 給湯器の記事の末尾（data/specialty.ts の boilerLinkForPost）
 * 見出しの要素（h2・h3）は使わない（ページの見出しの並びを変えないため）。
 */
type Mascot = "point" | "wave" | "ok" | "battery";

const THEMES: Record<SpecialtySiteId, { banner: string; compact: string; bg: string; bgImage: ImageKey; label: string; chip: string; button: string; mascots: Partial<Record<Mascot, ImageKey>> }> = {
  boiler: {
    banner: "boiler-banner",
    compact: "boiler-banner-compact",
    bg: "boiler-banner-bg",
    bgImage: "boiler/bubbles",
    label: "boiler-label",
    chip: "boiler-chip",
    button: "btn-boiler",
    mascots: { point: "boiler/mascot-point", wave: "boiler/mascot-wave", ok: "boiler/mascot-ok" },
  },
  solarNerima: {
    banner: "solar-banner",
    compact: "solar-banner-compact",
    bg: "solar-banner-bg",
    bgImage: "solar/town",
    label: "solar-label",
    chip: "solar-chip",
    button: "btn-solar",
    mascots: { point: "solar/mascot-point", wave: "solar/mascot-wave", ok: "solar/mascot-ok", battery: "solar/mascot-battery" },
  },
};

export function SpecialtySiteBanner({
  site: siteId,
  title,
  note,
  links = [],
  mascot = "point",
  compact = false,
  className = "",
}: {
  site: SpecialtySiteId;
  title: string;
  note: string;
  links?: SpecialtyLink[];
  /** 案内役のポーズ（battery は練馬区の太陽光発電・蓄電池のサイトだけ。無いポーズは point になる） */
  mascot?: Mascot;
  compact?: boolean;
  className?: string;
}) {
  const site = siteConfig.specialtySites[siteId];
  const t = THEMES[siteId];
  const mascotImage = t.mascots[mascot] ?? t.mascots.point!;
  return (
    <aside aria-label={`${site.label}のご案内`} className={`${t.banner} ${compact ? t.compact : ""} ${className}`}>
      {/* 専門サイトのトップと同じ絵。文字の側は白をかぶせて読みやすくする */}
      <span aria-hidden="true" className={t.bg} style={{ backgroundImage: `url(${img(t.bgImage).src})` }} />
      <div className="relative grid items-center gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
        <Illust image={mascotImage} width={compact ? 96 : 120} className={`mx-auto h-auto ${compact ? "w-20 sm:w-24" : "w-24 sm:w-[7.5rem]"}`} />
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className={t.label}>{site.label}</span>
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
                  <a href={l.url} className={t.chip} target="_blank" rel="noopener">
                    {l.label}
                    <Icon name="arrowUpRight" className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4">
            <a href={site.url} className={`btn ${t.button}`} target="_blank" rel="noopener">
              {/* 名前が長いとスマホで2行になるので、語の途中で折れないよう文節で区切る（WebKit は auto-phrase が効かない） */}
              <span>
                <Phrase>{`${site.label}を見る`}</Phrase>
              </span>
              <Icon name="arrowUpRight" className="size-4" />
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}
