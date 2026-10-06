import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Illust } from "@/components/ui/Photo";
import { reveal } from "@/lib/reveal";
import { siteConfig, primaryPhone, telHref, receptionHours } from "@/lib/site";

/**
 * ページの最後に置く、お問い合わせの案内。
 * 3つの連絡方法（電話・フォーム・Instagram）を、同じ大きさの行で並べる。
 * 電話番号・Instagram は lib/site.ts に値があるときだけ出る。
 */
export function CtaBand({
  title = (
    <>
      住まいのことなら、
      <br />
      まとめて<span className="text-sky-400">ヨコジュウ</span>へ。
    </>
  ),
  lead = "給湯器の不調から、外壁の塗り替え、庭の手入れまで。どの工事から相談してよいか分からないときも、まずはお聞かせください。お見積もりは無料、現地調査にもうかがいます。",
  id = "contact-cta",
}: {
  title?: React.ReactNode;
  lead?: string;
  id?: string;
}) {
  const phone = primaryPhone();
  const hours = receptionHours();
  const instagram = siteConfig.social.instagram;

  return (
    <section aria-labelledby={`${id}-title`} className="bg-blueprint relative overflow-hidden text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -left-[10%] top-0 h-full w-[38%] -skew-x-[24deg] bg-gradient-to-b from-brand-600/30 to-transparent" />
      <div className="container-x section relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <div {...reveal()}>
          <p className="eyebrow eyebrow-on-dark">ご相談・無料見積もり</p>
          <h2 id={`${id}-title`} className="h-section mt-3 !text-white lg:!text-[2.6rem] lg:!leading-[1.35]">
            {title}
          </h2>
          <p className="lead mt-5 text-silver-200">{lead}</p>
          <ul className="mt-6 flex flex-wrap gap-2 text-[0.8125rem] font-bold">
            {["見積もり無料", "現地調査にうかがいます", "神奈川・東京エリア対応"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/5 px-3 py-1.5">
                <Icon name="check" className="size-3.5 text-sky-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative" {...reveal(120)}>
          <div className="relative rounded-lg bg-white p-5 text-ink shadow-[var(--shadow-lift)] sm:p-7">
            <ul className="rows">
              {phone && (
                <li>
                  <a href={telHref(phone)} className="group flex items-center gap-4 py-4" data-cv="tel">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-navy-900 text-white">
                      <Icon name="phone" className="size-5" />
                    </span>
                    <span className="flex-1 leading-tight">
                      <span className="block text-xs font-bold tracking-widest text-ink-mute">お電話でのご相談</span>
                      <span className="num mt-1 block text-[1.75rem] font-semibold tracking-wider text-navy-900 transition-colors group-hover:text-brand-600 sm:text-[2rem]">{phone}</span>
                      {hours && <span className="mt-0.5 block text-xs text-ink-mute">受付 {hours}</span>}
                    </span>
                  </a>
                </li>
              )}
              <li>
                <Link href="/contact" className="group flex items-center gap-4 py-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                    <Icon name="document" className="size-5" />
                  </span>
                  <span className="flex-1 leading-tight">
                    <span className="block text-xs font-bold tracking-widest text-ink-mute">フォームから（24時間受付）</span>
                    <span className="mt-1 block text-[1.0625rem] font-bold text-navy-900 transition-colors group-hover:text-brand-600 sm:text-lg">
                      <span className="ib">無料見積もり・</span>
                      <span className="ib">お問い合わせ</span>
                    </span>
                  </span>
                  <Icon name="arrowRight" className="size-5 text-brand-600 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
              {instagram && (
                <li>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 py-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-navy-900 text-navy-900">
                      <Icon name="instagram" className="size-5" />
                    </span>
                    <span className="flex-1 leading-tight">
                      <span className="block text-xs font-bold tracking-widest text-ink-mute">Instagram のメッセージでも</span>
                      <span className="mt-1 block text-[1.0625rem] font-bold text-navy-900 transition-colors group-hover:text-brand-600 sm:text-lg">公式 Instagram を開く</span>
                      <span className="mt-1 block break-all text-[0.6875rem] tracking-normal text-ink-mute sm:text-xs">@{siteConfig.social.instagramHandle}</span>
                    </span>
                    <Icon name="arrowUpRight" className="size-5 text-brand-600 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              )}
            </ul>
          </div>
          {/* スタッフのイラスト（白い丸の中に収めて、濃紺の背景でも輪郭が見えるようにする） */}
          <div
            className="pointer-events-none absolute -right-2 -top-14 hidden size-[6.5rem] overflow-hidden rounded-full bg-white shadow-[0_8px_20px_-6px_rgb(2_11_36/0.6)] ring-4 ring-sky-400 sm:block lg:-right-5 lg:-top-16 lg:size-28"
            {...reveal(300, "pop")}
          >
            <Illust image="illust/people-staff-ok" width={150} className="absolute left-1/2 top-2 h-auto w-[135%] max-w-none -translate-x-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
}
