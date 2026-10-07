import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { strengths } from "@/data/company";
import { reveal } from "@/lib/reveal";
import { siteConfig } from "@/lib/site";

/**
 * 横浜総合住設の特徴。
 * 根拠の無い数字や順位は書かない。当社の現場の写真（Instagram に投稿されているもの）を、根拠として大きく見せる。
 * 特徴は、番号やアイコンを付けずに、見出しと文章だけで並べる（順番に意味が無いため）。
 */
export function AboutSection() {
  return (
    <section aria-labelledby="home-about" className="cv section bg-white">
      <div className="container-x">
        <div className="grid gap-x-12 gap-y-9 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <SectionHeading id="home-about" title={`${siteConfig.shortName}の特徴`} />
            <div className="mt-5 space-y-4 text-[0.9688rem] leading-[2.05]" {...reveal(60)}>
              <p>
                {siteConfig.name}は、住宅設備の工事を中心に、太陽光発電、外壁塗装、リフォーム、造園までをお引き受けしている会社です。
              </p>
              <p>
                工事の種類ごとに頼む先を探す必要がなく、関係する工事の順番と日程をまとめて組めます。現地を見てから、内訳の分かる見積書をお出しします。
              </p>
            </div>
            <p className="mt-7" {...reveal(100)}>
              <Link href="/company" className="link-arrow">
                会社案内
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </p>
          </div>

          {/* 現場の写真（横長1枚＋縦長1枚を、同じ高さで並べる） */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-[1.55fr_1fr] gap-2 sm:gap-3">
              <figure {...reveal(0, "wipe")}>
                <div className="relative h-[13.5rem] bg-silver-100 sm:h-[20rem] lg:h-[23rem]">
                  <PhotoFill image="works/lagging-2" alt="屋外の室外機につながる空調配管に、銀色のラッキングカバーを施工した様子" sizes="(min-width: 1024px) 35vw, 60vw" />
                </div>
                <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">空調配管のラッキングカバー施工</figcaption>
              </figure>
              <figure {...reveal(120, "wipe")}>
                <div className="relative h-[13.5rem] bg-silver-100 sm:h-[20rem] lg:h-[23rem]">
                  <PhotoFill image="works/bath-dryer-working" alt="養生した浴室で、天井の点検口から作業するスタッフ" sizes="(min-width: 1024px) 23vw, 40vw" />
                </div>
                <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">浴室暖房乾燥機の取替作業</figcaption>
              </figure>
            </div>
            <p className="mt-2 text-xs text-ink-mute">写真は、当社の施工現場で撮影したものです。</p>
          </div>
        </div>

        <ul className="mt-12 grid gap-x-12 border-t border-navy-900 sm:grid-cols-2 lg:mt-16">
          {strengths.map((s, i) => (
            <li key={s.id} className="border-b border-silver-200 py-6" {...reveal((i % 2) * 70)}>
              <h3 className="text-[1.0625rem] font-bold leading-snug">{s.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-[1.95]">{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
