import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { LineIcon } from "@/components/ui/LineIcon";
import { PageHero } from "@/components/ui/PageHero";
import { inquiryTopics } from "@/data/services";
import { isContactFormEnabled, isContactFormShown } from "@/lib/contact";
import { img } from "@/lib/images";
import { keywordsFor } from "@/data/seo-keyword-map";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, primaryPhone, mobilePhone, telHref, lineUrl, contactWays, receptionHours } from "@/lib/site";

/**
 * お問い合わせ・無料見積もり
 * 役割：電話・LINE・フォーム・Instagram の連絡方法を示し、迷わず連絡できるようにする。
 * LINE は、スマホではボタンから友だち追加の画面を開く。パソコンの方には QR コードと ID を出す。
 * フォームは、メール送信の設定（RESEND_API_KEY・CONTACT_TO_EMAIL）が済んでいるときだけ出す。
 * 設定前の本番では、フォームの代わりに電話と LINE の案内を出す（送れないフォームを公開しないため）。
 * そのあいだは、説明文・冒頭の文・description からも「フォーム」の案内を外す（isContactFormShown）。
 * 設定前でも、手元やプレビューでは確認用にフォームを表示する。
 */
/** 連絡方法の並び（例：お電話・LINE・フォーム）。フォームが使えないあいだは、フォームを入れない */
const WAYS_SHORT = contactWays({ instagram: false, form: isContactFormShown() }).join("・").replace("お問い合わせフォーム", "フォーム");

export const metadata: Metadata = buildMetadata({
  title: "お問い合わせ・無料見積もり",
  description: `横浜総合住設へのお問い合わせ・無料見積もりのご依頼はこちらから。給湯器・エアコン・トイレ・外壁塗装・リフォームなど、住まいの工事のご相談を、${WAYS_SHORT}でお受けしています。お見積もりは無料、現地調査にうかがいます。`,
  path: "/contact",
  keywords: keywordsFor("/contact"),
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
  const line = lineUrl();
  const lineId = siteConfig.social.lineId;
  const qr = img("brand/line-qr");
  const enabled = isContactFormEnabled();
  const shown = isContactFormShown();
  const preview = !enabled && shown;

  return (
    <>
      <PageHero
        illust="illust/people-couple-talk"
        title="お問い合わせ・無料見積もり"
        lead={`ご相談とお見積もりは無料です。「交換したほうがよいのか知りたい」「おおよその費用を知りたい」という段階のご相談も、${contactWays({ instagram: false, form: shown }).join("・")}でお受けしています。`}
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
              {line && (
                <div className="border-b-2 border-dotted border-silver-300 py-5 last:border-b-0">
                  <dt className="text-[0.8125rem] font-bold tracking-wider text-ink-mute">LINE</dt>
                  <dd className="mt-1 text-[0.9375rem] leading-[1.9]">
                    公式アカウントを友だちに追加して、メッセージでご相談いただけます。機器の型番のシールや、設置場所の写真もお送りください。
                    <a href={line} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm mt-3 w-full" data-cv="line">
                      <LineIcon className="size-5" />
                      LINE で相談する
                    </a>
                    {/* パソコンで見ている方は、ボタンを押しても LINE を開けないことが多いので、スマホで読み取る QR コードを出す */}
                    <span className="mt-4 hidden items-center gap-4 md:flex">
                      <Image
                        src={qr.src}
                        width={112}
                        height={112}
                        alt="LINE 公式アカウントを友だちに追加する QR コード"
                        unoptimized
                        loading="lazy"
                        className="size-28 shrink-0 rounded-lg border border-silver-300 bg-white p-1"
                      />
                      <span className="text-[0.8125rem] leading-relaxed text-ink-mute">
                        パソコンでご覧の方は、スマートフォンの LINE で QR コードを読み取ってください。
                        {lineId && <span className="mt-1 block">ID 検索：{lineId}</span>}
                      </span>
                    </span>
                  </dd>
                </div>
              )}
              {instagram && (
                <div className="border-b-2 border-dotted border-silver-300 py-5 last:border-b-0">
                  <dt className="text-[0.8125rem] font-bold tracking-wider text-ink-mute">Instagram</dt>
                  <dd className="mt-1 text-[0.9375rem] leading-[1.9]">
                    メッセージでもご相談いただけます。
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-link mt-0.5 inline-flex items-center gap-1 break-all text-[0.875rem] tracking-normal">
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
            {/* フォームが使えないあいだは、「24時間お受けしています」と書かない（すぐ下の「準備中」と食い違う） */}
            {shown && (
              <p className="mt-3 text-[0.9375rem] leading-[1.95]">
                24時間お受けしています。必須の項目は4つだけです。機器の型番や写真は、ご連絡の際にあらためてうかがいますので、分かる範囲でご記入ください。
              </p>
            )}

            <div className="mt-8">
              {shown ? (
                <ContactForm topics={inquiryTopics} note={siteConfig.contact.formNote} preview={preview} />
              ) : (
                <div className="rounded-2xl bg-cream px-5 py-4">
                  <p className="text-lg font-bold text-ink">フォームは、ただいま準備中です。</p>
                  <p className="mt-2 text-[0.9375rem] leading-[1.95]">
                    お手数ですが、{contactWays({ form: false }).join("・")}でご連絡ください。お見積もりは無料で、現地調査にもうかがいます。
                  </p>
                  {phone && (
                    <a href={telHref(phone)} className="num mt-3 inline-block text-[1.75rem] font-medium tracking-wider text-navy-900" data-cv="tel">
                      {phone}
                    </a>
                  )}
                  {line && (
                    <p className="mt-3">
                      <a href={line} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" data-cv="line">
                        <LineIcon className="size-5" />
                        LINE で相談する
                      </a>
                    </p>
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
