import { PhotoFill } from "@/components/ui/Photo";
import { siteConfig } from "@/lib/site";

/**
 * トップページの最初の画面。
 * 置くのは「写真・社名・地域と業種（h1）・会社のことば・短い説明」だけ。
 * 問い合わせのボタン、電話番号、バッジ、チェックの列、アイコンの並びは置かない
 * （連絡先はヘッダーにあり、ページの最後にも案内がある）。
 *
 * - いちばん大きく見せるのは h1（地域名と業種）。作ったキャッチコピーは置かない。
 *   「住まいのことなら、まとめてヨコジュウへ。」は会社のことば（チラシの表記）なので、1行だけ添える。
 * - h1 の文字の並びは「地域と業種 → 社名」。社名は、見た目だけ上に小さく出している（order-first）。
 * - 写真は最初の描画で読み込む（priority）。文字には登場アニメーションを付けない（LCP を遅らせないため）。
 * - PC は右側に写真、左側に文字。スマホ・タブレットは、上に写真の帯、下に文字。
 * - 写真は、遠景の街並みを切り落としたもの（scripts/prepare-images.mjs を参照）。
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div className="relative h-[15.5rem] overflow-hidden sm:h-[21rem] lg:absolute lg:inset-y-0 lg:left-[44%] lg:right-0 lg:h-auto">
        <PhotoFill image="photos/hero-house" alt="植栽に囲まれた2階建ての住宅の外観" sizes="(min-width: 1024px) 56vw, 100vw" priority className="hero-settle object-[50%_42%] lg:object-center" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(2_11_36/0)_52%,rgb(2_11_36)_100%)] lg:bg-[linear-gradient(to_right,rgb(2_11_36)_0%,rgb(2_11_36/0.55)_13%,rgb(2_11_36/0)_36%)]"
        />
      </div>

      <div className="container-x relative pb-12 pt-6 sm:pb-14 lg:flex lg:min-h-[34rem] lg:flex-col lg:justify-center lg:py-20">
        <div className="lg:max-w-[32rem]">
          <h1 className="flex flex-col !text-white">
            <span className="text-[1.75rem] font-bold leading-[1.38] tracking-[0.04em] sm:text-[2.25rem] lg:text-[2.75rem] xl:text-[3rem]">
              <span className="block">
                {siteConfig.primaryArea.city}
                {siteConfig.primaryArea.ward}の
              </span>
              <span className="block">住宅設備・リフォーム</span>
            </span>
            <span className="eyebrow eyebrow-on-dark order-first mb-4 lg:mb-5">{siteConfig.name}</span>
          </h1>

          <p className="mt-6 text-[1.0313rem] font-bold leading-relaxed tracking-[0.05em] lg:mt-7 lg:text-[1.0938rem]">{siteConfig.tagline}</p>

          <p className="mt-3 max-w-[31rem] text-[0.9375rem] leading-[2.05] text-silver-100">
            給湯器・エアコン・トイレ・太陽光・蓄電池・外壁塗装・リフォーム・解体・造園まで。
            <span className="ib">横浜市戸塚区を中心に、</span>
            <span className="ib">住まいの工事をワンストップで対応します。</span>
          </p>
        </div>
      </div>
    </section>
  );
}
