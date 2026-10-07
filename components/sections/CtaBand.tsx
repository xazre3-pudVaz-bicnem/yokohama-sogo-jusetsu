import type { ReactNode } from "react";
import Link from "next/link";
import { Phrase } from "@/components/ui/Phrase";
import { reveal } from "@/lib/reveal";
import { siteConfig, primaryPhone, telHref, receptionHours } from "@/lib/site";

/**
 * ページの最後に置く、お問い合わせの案内。
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
    <section aria-labelledby={`${id}-title`} data-cta-zone className="bg-navy-900 text-white">
      <div className="container-x section grid gap-x-12 gap-y-9 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5" {...reveal()}>
          <h2 id={`${id}-title`} className="h-section !text-white">
            <Phrase>{title}</Phrase>
          </h2>
          <p className="mt-4 text-[0.9375rem] leading-[2] text-silver-200">{lead}</p>
        </div>

        <dl className="rows-on-dark lg:col-span-7" {...reveal(100)}>
          {phone && (
            <div className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[9rem_1fr] sm:items-center">
              <dt className="text-[0.8125rem] font-bold tracking-wider text-silver-300">お電話</dt>
              <dd>
                <a href={telHref(phone)} className="num text-[1.9rem] font-medium leading-tight tracking-wider text-white transition-colors hover:text-sky-300 sm:text-[2.15rem]" data-cv="tel">
                  {phone}
                </a>
                {hours && <span className="mt-0.5 block text-[0.8125rem] text-silver-300">受付 {hours}</span>}
              </dd>
            </div>
          )}
          <div className="grid gap-x-8 gap-y-2.5 py-5 sm:grid-cols-[9rem_1fr] sm:items-center">
            <dt className="text-[0.8125rem] font-bold tracking-wider text-silver-300">フォーム</dt>
            <dd className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link href="/contact" className="btn btn-primary">
                お問い合わせフォーム
              </Link>
              <span className="text-[0.8125rem] text-silver-300">24時間受付</span>
            </dd>
          </div>
          {instagram && (
            <div className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[9rem_1fr] sm:items-center">
              <dt className="text-[0.8125rem] font-bold tracking-wider text-silver-300">Instagram</dt>
              <dd className="text-[0.9375rem]">
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-sky-300">
                  メッセージでもご相談いただけます
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
