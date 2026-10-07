import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Illust, PhotoFill } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { strengths } from "@/data/company";
import { reveal } from "@/lib/reveal";
import { siteConfig } from "@/lib/site";

/**
 * 横浜総合住設の特徴。
 * 根拠の無い数字や順位は書かない。当社の現場の写真（Instagram に投稿されているもの）を、根拠として見せる。
 * 特徴は、番号を付けずに白いパネルで並べる（順番に意味が無いため）。
 */
export function AboutSection() {
  return (
    <section aria-labelledby="home-about" className="cv section bg-white">
      <div className="container-x">
        <div className="grid items-center gap-x-14 gap-y-10 lg:grid-cols-2">
          <div>
            <SectionHeading id="home-about" eyebrow={`${siteConfig.shortName}について`} title={`${siteConfig.shortName}の特徴`} mark="特徴" />
            <div className="mt-5 space-y-4 text-[0.9688rem] leading-[2.05]" {...reveal(60)}>
              <p>
                {siteConfig.name}は、住宅設備の工事を中心に、太陽光発電、外壁塗装、リフォーム、造園までをお引き受けしている会社です。
              </p>
              <p>
                工事の種類ごとに頼む先を探す必要がなく、関係する工事の順番と日程をまとめて組めます。現地を見てから、内訳の分かる見積書をお出しします。
              </p>
            </div>
            <div className="mt-6 flex items-end gap-5" {...reveal(100)}>
              <Link href="/company" className="btn btn-outline mb-2">
                会社案内
                <Icon name="arrowRight" className="btn-arrow size-4" />
              </Link>
              <Illust image="illust/pose-ok" width={96} className="h-auto w-20 animate-wiggle" />
            </div>
          </div>

          {/* 現場の写真（横長1枚＋縦長1枚） */}
          <div {...reveal(0, "right")}>
            <div className="photo-frame photo-frame-r">
              <div className="relative grid grid-cols-[1.55fr_1fr] gap-2 sm:gap-3">
                <div className="photo-card relative h-[13.5rem] sm:h-[19rem]">
                  <PhotoFill image="works/lagging-2" alt="屋外の室外機につながる空調配管に、銀色のラッキングカバーを施工した様子" sizes="(min-width: 1024px) 28vw, 60vw" />
                </div>
                <div className="photo-card relative h-[13.5rem] sm:h-[19rem]">
                  <PhotoFill image="works/bath-dryer-working" alt="養生した浴室で、天井の点検口から作業するスタッフ" sizes="(min-width: 1024px) 18vw, 40vw" />
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-mute">空調配管のラッキングカバー施工／浴室暖房乾燥機の取替作業（どちらも当社の施工現場）</p>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {strengths.map((s, i) => (
              <li key={s.id} className="card card-line p-5 sm:p-6" {...reveal((i % 4) * 70)}>
                <h3 className="text-[1.0313rem] font-bold leading-snug">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-[1.9]">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
