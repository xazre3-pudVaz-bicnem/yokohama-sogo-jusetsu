import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { inquiryTopics } from "@/data/services";
import { isContactFormEnabled } from "@/lib/contact";
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
        illust="illust/people-couple-talk"
        title="お問い合わせ・無料見積もり"
        lead="ご相談とお見積もりは無料です。「交換したほうがよいのか知りたい」「おおよその費用を知りたい」という段階のご相談も、お電話とフォームでお受けしています。"
        crumbs={[{ name: "お問い合わせ", href: "/contact" }]}
      />

      <div className="section bg-white">
        <div className="container-x grid gap-x-12 gap-y-12 lg:grid-cols-12">
          {/* 連絡方法 */}
          <aside className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <dl className="card card-line px-5 sm:px-6">
              {phone && (
                <div className="border-b-2 border-dotted border-silver-300 py-5 last:border-b-0">
                  <dt className="text-[0.8125rem] font-bold tracking-wider text-ink-mute">お電話</dt>
                  <dd className="mt-1">
                    <a href={telHref(phone)} className="num text-[1.9rem] font-medium leading-tight tracking-wider text-navy-900 transition-colors hover:text-brand-700" data-cv="tel">
                      {phone}
                    </a>
                    {mobile && (
                      <a href={telHref(mobile)} className="num mt-1 block text-lg font-medium tracking-wider text-navy-900" data-cv="tel">
                        携帯 {mobile}
                      </a>
                    )}
                    {hours && <span className="mt-1 block text-sm text-ink-mute">受付 {hours}</span>}
                    <span className="mt-2 block text-[0.8125rem] leading-relaxed text-ink-mute">お電話が混み合っているときは、折り返しのご連絡までお時間をいただく場合があります。</span>
                  </dd>
                </div>
              )}
              {instagram && (
                <div className="border-b-2 border-dotted border-silver-300 py-5 last:border-b-0">
                  <dt className="text-[0.8125rem] font-bold tracking-wider text-ink-mute">Instagram</dt>
                  <dd className="mt-1 text-[0.9375rem] leading-[1.9]">
                    メッセージでもご相談いただけます。
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-link mt-0.5 inline-flex items-center gap-1 break-all">
                      @{siteConfig.social.instagramHandle}
                      <Icon name="arrowUpRight" className="size-3.5 shrink-0" />
                    </a>
                  </dd>
                </div>
              )}
              <div className="py-5">
                <dt className="text-[0.8125rem] font-bold tracking-wider text-ink-mute">送信のあとの流れ</dt>
                <dd className="mt-2">
                  <ol className="space-y-3">
                    {AFTER.map((a, i) => (
                      <li key={a.title} className="flex gap-3.5">
                        <span className="num w-4 shrink-0 text-base font-medium leading-[1.7] text-silver-500">{i + 1}</span>
                        <div>
                          <p className="text-[0.9375rem] font-bold text-ink">{a.title}</p>
                          <p className="mt-0.5 text-sm leading-relaxed">{a.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4">
                    <Link href="/flow" className="link-arrow !text-sm">
                      工事の流れ
                      <Icon name="arrowRight" className="size-3.5" />
                    </Link>
                  </p>
                </dd>
              </div>
            </dl>
          </aside>

          {/* フォーム */}
          <div id="form" className="scroll-mt-28 lg:col-span-8">
            <h2 className="h-section">お問い合わせフォーム</h2>
            <p className="mt-3 text-[0.9375rem] leading-[1.95]">
              24時間お受けしています。必須の項目は4つだけです。機器の型番や写真は、ご連絡の際にあらためてうかがいますので、分かる範囲でご記入ください。
            </p>

            <div className="mt-8">
              {enabled || preview ? (
                <ContactForm topics={inquiryTopics} note={siteConfig.contact.formNote} preview={preview} />
              ) : (
                <div className="rounded-2xl bg-cream px-5 py-4">
                  <p className="text-lg font-bold text-ink">フォームは、ただいま準備中です。</p>
                  <p className="mt-2 text-[0.9375rem] leading-[1.95]">
                    お手数ですが、お電話{instagram ? "または Instagram のメッセージ" : ""}でご連絡ください。お見積もりは無料で、現地調査にもうかがいます。
                  </p>
                  {phone && (
                    <a href={telHref(phone)} className="num mt-3 inline-block text-[1.75rem] font-medium tracking-wider text-navy-900" data-cv="tel">
                      {phone}
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
