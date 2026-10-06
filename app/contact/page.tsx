import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Illust } from "@/components/ui/Photo";
import { inquiryTopics } from "@/data/services";
import { isContactFormEnabled } from "@/lib/contact";
import { reveal } from "@/lib/reveal";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, primaryPhone, mobilePhone, telHref, receptionHours } from "@/lib/site";

/**
 * お問い合わせ・無料見積もり
 * 役割：電話・フォーム・Instagram の3つの連絡方法を示し、迷わず連絡できるようにする。
 * フォームは、メール送信の設定（RESEND_API_KEY・CONTACT_TO_EMAIL）が済んでいるときだけ出す。
 * 設定前の本番では、フォームの代わりに電話の案内を出す（送れないフォームを公開しないため）。
 * 設定前でも、手元やプレビューでは確認用にフォームを表示する。
 */
export const metadata: Metadata = buildMetadata({
  title: "お問い合わせ・無料見積もり",
  description:
    "横浜総合住設へのお問い合わせ・無料見積もりのご依頼はこちらから。給湯器・エアコン・トイレ・外壁塗装・リフォームなど、住まいの工事のご相談をお電話とフォームでお受けしています。お見積もりは無料、現地調査にうかがいます。",
  path: "/contact",
  keywords: ["横浜総合住設 お問い合わせ", "戸塚区 給湯器 見積もり", "住宅設備 無料見積もり 横浜"],
});

const AFTER = [
  { title: "内容を確認", body: "ご入力の内容を確認します。" },
  { title: "担当からご連絡", body: "お電話またはメールで、くわしい状況をうかがいます。" },
  { title: "現地調査・お見積もり", body: "ご都合のよい日時に現地へうかがい、見積書をお出しします。" },
];

export default function ContactPage() {
  const phone = primaryPhone();
  const mobile = mobilePhone();
  const hours = receptionHours();
  const instagram = siteConfig.social.instagram;
  const enabled = isContactFormEnabled();
  const preview = !enabled && process.env.VERCEL_ENV !== "production";

  return (
    <>
      <PageHero
        eyebrow="お問い合わせ・無料見積もり"
        title={
          <>
            <span className="ib">ご相談も、お見積もりも、</span>
            <span className="ib">無料です。</span>
          </>
        }
        lead="「交換したほうがよいのか知りたい」「おおよその費用を知りたい」。そんな段階のご相談で、かまいません。お電話でもフォームでも、お受けしています。"
        crumbs={[{ name: "お問い合わせ", href: "/contact" }]}
      />

      <div className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          {/* 連絡方法 */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {phone && (
              <div className="rounded-lg bg-navy-900 p-6 text-white sm:p-7">
                <p className="eyebrow eyebrow-on-dark">お急ぎの方は、お電話で</p>
                <a href={telHref(phone)} className="mt-3 flex items-center gap-3" data-cv="tel">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 text-sky-300">
                    <Icon name="phone" className="size-5" />
                  </span>
                  <span className="num text-[2rem] font-semibold leading-none tracking-wider sm:text-[2.25rem]">{phone}</span>
                </a>
                {mobile && (
                  <a href={telHref(mobile)} className="num mt-3 block text-lg font-medium tracking-wider text-silver-100" data-cv="tel">
                    携帯 {mobile}
                  </a>
                )}
                {hours && <p className="mt-3 text-sm text-silver-200">受付時間 {hours}</p>}
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-silver-300">お電話が混み合っているときは、折り返しのご連絡までお時間をいただく場合があります。</p>
              </div>
            )}

            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-lg border border-silver-200 p-5 transition-shadow hover:shadow-[var(--shadow-card)]">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-navy-900 text-navy-900">
                  <Icon name="instagram" className="size-5" />
                </span>
                <span className="flex-1 leading-tight">
                  <span className="block text-xs font-bold tracking-widest text-ink-mute">Instagram のメッセージでも</span>
                  <span className="mt-1 block text-base font-bold text-navy-900 group-hover:text-brand-600">公式 Instagram を開く</span>
                  <span className="mt-1 block break-all text-[0.6875rem] tracking-normal text-ink-mute">@{siteConfig.social.instagramHandle}</span>
                </span>
                <Icon name="arrowUpRight" className="size-5 text-brand-600" />
              </a>
            )}

            <div className="rounded-lg bg-silver-50 p-6">
              <p className="text-sm font-extrabold text-ink">送信のあとの流れ</p>
              <ol className="mt-4 space-y-4">
                {AFTER.map((a, i) => (
                  <li key={a.title} className="flex gap-3">
                    <span className="num grid size-7 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">{i + 1}</span>
                    <div>
                      <p className="text-[0.9375rem] font-bold text-ink">{a.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed">{a.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link href="/flow" className="link-arrow mt-4 text-sm">
                工事の流れをくわしく見る
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          </aside>

          {/* フォーム */}
          <div id="form" className="scroll-mt-28">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <p className="eyebrow">フォームから（24時間受付）</p>
                <h2 className="h-section mt-3">お問い合わせフォーム</h2>
              </div>
              <div className="hidden w-24 shrink-0 sm:block" {...reveal(100, "pop")}>
                <Illust image="illust/people-staff-woman" width={130} className="h-auto w-full" />
              </div>
            </div>
            <p className="mt-4 text-[0.9375rem] leading-[1.95]">必須の項目は4つだけです。機器の型番や写真は、ご連絡の際にあらためてうかがいますので、分かる範囲でご記入ください。</p>

            <div className="mt-8">
              {enabled || preview ? (
                <ContactForm topics={inquiryTopics} note={siteConfig.contact.formNote} preview={preview} />
              ) : (
                <div className="rounded-lg border-2 border-navy-900 p-7 sm:p-9">
                  <p className="text-lg font-extrabold text-ink">フォームは、ただいま準備中です。</p>
                  <p className="mt-3 text-[0.9375rem] leading-[1.95]">
                    お手数ですが、お電話{instagram ? "または Instagram のメッセージ" : ""}でご連絡ください。お見積もりは無料で、現地調査にもうかがいます。
                  </p>
                  {phone && (
                    <a href={telHref(phone)} className="btn btn-primary mt-5" data-cv="tel">
                      <Icon name="phone" className="size-5" />
                      <span className="num text-lg font-semibold tracking-wider">{phone}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
