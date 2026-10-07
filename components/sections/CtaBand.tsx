import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Illust } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { reveal } from "@/lib/reveal";
import { siteConfig, primaryPhone, telHref, receptionHours } from "@/lib/site";

/**
 * ページの最後に置く、お問い合わせの案内。
 * クリーム地に白い角丸のパネル、丸いボタン、スタッフのイラスト。
 *
 * 問い合わせの導線は、①ヘッダー ②このページ末尾の案内 ③スマホ下部の固定ボタン、の3か所にまとめている。
 * ページの冒頭や本文の途中に、同じ案内を繰り返さないこと。
 * data-cta-zone は、スマホ下部の固定ボタンを隠す目印（この案内が見えているときは、固定ボタンを出さない）。
 */
export function CtaBand({
  title = "お見積もり・ご相談",
  lead = "お見積もりは無料です。現地にうかがって設置場所や建物の状態を確かめ、内訳の分かる見積書をお出しします。どの工事から相談すればよいか分からない場合も、そのままお聞かせください。",
  id = "contact-cta",
}: {
  title?: ReactNode;
  lead?: string;
  id?: string;
}) {
  const phone = primaryPhone();
  const hours = receptionHours();
  const instagram = siteConfig.social.instagram;

  return (
    <section aria-labelledby={`${id}-title`} data-cta-zone className="band band-cream py-14 sm:py-20">
      <span className="absolute left-[8%] top-8 size-3 animate-twinkle rounded-full bg-sun-400" aria-hidden="true" />
      <span className="absolute bottom-10 right-[10%] size-4 animate-twinkle rounded-full bg-brand-300 [animation-delay:1s]" aria-hidden="true" />
      <div className="container-x">
        <div className="card-pop px-5 py-9 sm:px-12 sm:py-12" {...reveal(0, "zoom")}>
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto_10rem] lg:gap-10">
            <div>
              <p className="mb-5 flex">
                <span className="pill">お見積もり・現地調査は無料です</span>
              </p>
              <h2 id={`${id}-title`} className="h-section">
                <Phrase>{title}</Phrase>
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-[2]">{lead}</p>
            </div>

            <div className="flex min-w-0 flex-col gap-3 lg:w-[20.5rem]">
              <Link href="/contact" className="btn btn-primary min-h-14 w-full text-base">
                お問い合わせフォーム
                <Icon name="arrowRight" className="btn-arrow size-4" />
              </Link>
              {phone && (
                <a href={telHref(phone)} className="flex min-h-14 items-center justify-center gap-3 rounded-full border-2 border-navy-900 bg-white px-5 py-1.5 text-navy-900 transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-cream" data-cv="tel">
                  <Icon name="phone" className="size-5 shrink-0 text-brand-600" />
                  <span className="text-left leading-none">
                    <span className="block text-xs font-bold text-ink-mute">
                      お電話でのご相談
                      {hours && <span className="ml-1 font-normal">（受付 {hours}）</span>}
                    </span>
                    <span className="num mt-1 block text-[1.3125rem] font-semibold tracking-wider">{phone}</span>
                  </span>
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-1.5 text-sm font-bold text-brand-700 underline underline-offset-4">
                  <Icon name="instagram" className="size-4" />
                  Instagram のメッセージでもご相談いただけます
                </a>
              )}
            </div>

            <div className="hidden animate-float-slow lg:block">
              <Illust image="illust/pose-phone" width={160} className="mx-auto h-auto w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
