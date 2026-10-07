import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata, formatDateJa } from "@/lib/seo";
import { siteConfig, primaryPhone, officeAddressWithPostal } from "@/lib/site";

/**
 * プライバシーポリシー
 * サイトの運営のしかた（フォーム・アクセス解析・広告の有無）が変わったら、内容を見直すこと。
 * 制定日・改定日は下の ENACTED / REVISED を書き換える。
 */
export const metadata: Metadata = buildMetadata({
  title: "プライバシーポリシー",
  description: "株式会社 横浜総合住設の公式サイトにおける、個人情報の取り扱いについての方針です。お問い合わせフォームで取得する情報、利用の目的、安全管理、開示などのご請求の窓口を定めています。",
  path: "/privacy",
});

const ENACTED = "2026-10-06";
const REVISED: string | null = null;

export default function PrivacyPage() {
  const phone = primaryPhone();
  const email = siteConfig.contact.contactEmail;

  const sections: { title: string; body: React.ReactNode }[] = [
    {
      title: "1. 基本的な考え方",
      body: (
        <p>
          {siteConfig.name}（以下「当社」）は、お客様からお預かりする個人情報の大切さを認識し、個人情報の保護に関する法律その他の法令を守って、適切に取り扱います。
        </p>
      ),
    },
    {
      title: "2. 取得する情報",
      body: (
        <>
          <p>当社は、このサイトのお問い合わせフォーム、お電話、Instagram のメッセージなどを通じて、次の情報を取得します。</p>
          <ul>
            <li>お名前、電話番号、メールアドレス、ご住所</li>
            <li>ご相談の内容（工事の種類、設備の状況、お送りいただいた写真など）</li>
            <li>現地調査や工事の際に確認した、設置場所や設備に関する情報</li>
          </ul>
        </>
      ),
    },
    {
      title: "3. 利用の目的",
      body: (
        <>
          <p>取得した個人情報は、次の目的のために利用します。</p>
          <ul>
            <li>お問い合わせへの回答、ご連絡</li>
            <li>現地調査、お見積もりの作成、ご提案</li>
            <li>工事の実施、機器の手配、工事後のご連絡</li>
            <li>補助金・支援制度の申請に必要な手続き（お客様のご依頼がある場合）</li>
            <li>当社のサービスに関するご案内</li>
          </ul>
        </>
      ),
    },
    {
      title: "4. 第三者への提供",
      body: (
        <>
          <p>当社は、次の場合を除き、ご本人の同意なく個人情報を第三者に提供しません。</p>
          <ul>
            <li>法令にもとづく場合</li>
            <li>人の生命、身体または財産を守るために必要で、ご本人の同意を得ることが難しい場合</li>
            <li>機器の手配、メーカーの保証登録、補助金の申請など、ご依頼の工事を行うために必要な範囲で、メーカー・事務局などへ提供する場合</li>
          </ul>
        </>
      ),
    },
    {
      title: "5. 業務の委託",
      body: <p>当社は、利用の目的の達成に必要な範囲で、個人情報の取り扱いを外部に委託することがあります（お問い合わせフォームの送信に使うメール配信サービス、サイトの配信サービスなど）。委託先は適切に選び、必要な監督を行います。</p>,
    },
    {
      title: "6. 安全管理",
      body: <p>当社は、個人情報の漏えい、紛失、き損を防ぐために、必要かつ適切な安全管理の措置を講じます。利用の目的を達成し、保管の必要がなくなった個人情報は、適切な方法で消去します。</p>,
    },
    {
      title: "7. アクセス情報の取り扱い",
      body: (
        <p>
          このサイトでは、利用の状況を把握してサイトを改善するために、アクセス解析の仕組みを利用する場合があります。その場合に取得するのは、閲覧したページ、利用している端末やブラウザの種類などの情報で、個人を特定するものではありません。利用する場合は、このページでお知らせします。
        </p>
      ),
    },
    {
      title: "8. 開示・訂正・利用停止などのご請求",
      body: <p>ご本人から、個人情報の開示、訂正、追加、削除、利用の停止などのご請求があった場合は、ご本人であることを確認したうえで、法令に従って対応します。下記の窓口までご連絡ください。</p>,
    },
    {
      title: "9. 写真の掲載について",
      body: (
        <p>
          施工事例として掲載する写真は、お住まいが特定されないよう配慮して使用します。掲載している写真について、削除や修正のご希望がある場合は、下記の窓口までご連絡ください。
        </p>
      ),
    },
    {
      title: "10. この方針の変更",
      body: <p>当社は、法令の改正やサイトの運営の変更に合わせて、この方針を見直すことがあります。変更した場合は、このページでお知らせします。</p>,
    },
    {
      title: "11. お問い合わせの窓口",
      body: (
        <>
          <p>個人情報の取り扱いについてのお問い合わせは、次の窓口までお願いします。</p>
          <dl className="not-prose mt-4 bg-silver-50 p-5 text-[0.9375rem] leading-[1.9]">
            <dt className="font-bold text-ink">{siteConfig.name}</dt>
            <dd>{officeAddressWithPostal("head")}</dd>
            {phone && <dd className="num">電話：{phone}</dd>}
            {email && <dd>メール：{email}</dd>}
            <dd>
              <Link href="/contact" className="text-link">
                お問い合わせフォーム
              </Link>
            </dd>
          </dl>
        </>
      ),
    },
  ];

  return (
    <>
      <PageHero title="プライバシーポリシー" lead="このサイトでの、個人情報の取り扱いについての方針です。" crumbs={[{ name: "プライバシーポリシー", href: "/privacy" }]} />
      <div className="section bg-white">
        <div className="container-narrow">
          <div className="prose-jp">
            {sections.map((s) => (
              <section key={s.title}>
                <h2>{s.title}</h2>
                {s.body}
              </section>
            ))}
            <p className="!mt-12 text-sm text-ink-mute">
              制定日：<time dateTime={ENACTED}>{formatDateJa(ENACTED)}</time>
              {REVISED && (
                <>
                  ／最終改定日：<time dateTime={REVISED}>{formatDateJa(REVISED)}</time>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
