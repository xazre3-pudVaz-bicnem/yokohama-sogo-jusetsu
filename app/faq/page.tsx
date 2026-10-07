import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { PageHero } from "@/components/ui/PageHero";
import { faqGroups, allFaqs } from "@/data/faq";
import { services } from "@/data/services";
import { reveal } from "@/lib/reveal";
import { faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * よくある質問
 * 役割：はじめて相談する人の不安（費用・対応エリア・進め方・補助金）に、まとめて答える。
 * 構造化データ（FAQPage）：このページに表示している共通の質問だけ。
 * 工事ごとの質問は各サービスページにあり、ここからリンクする（同じ質問を2か所でマークアップしない）。
 */
export const metadata: Metadata = buildMetadata({
  title: "よくある質問｜見積もり・対応エリア・補助金",
  description:
    "横浜総合住設によくいただく質問をまとめました。見積もりは無料か、対応エリアはどこまでか、小さな工事や他社で断られた工事も頼めるか、補助金は使えるか。はじめてのご相談の前にご覧ください。",
  path: "/faq",
  keywords: ["横浜総合住設 よくある質問", "住宅設備 見積もり 無料", "戸塚区 リフォーム 相談", "給湯器 補助金 申請"],
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        illust="illust/people-staff-point-3"
        title="よくある質問"
        lead="お見積もり、対応エリア、工事の進め方について、よくいただく質問にお答えします。ここに無いことは、お電話かフォームでおたずねください。"
        crumbs={[{ name: "よくある質問", href: "/faq" }]}
      />

      <div className="section bg-white">
        <div className="container-x grid gap-x-12 gap-y-9 lg:grid-cols-12">
          {/* 目次 */}
          <aside className="lg:sticky lg:top-28 lg:col-span-3 lg:self-start">
            <nav aria-label="質問の分類">
              <p className="eyebrow">質問の分類</p>
              <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                {faqGroups.map((g) => (
                  <li key={g.id}>
                    <a href={`#${g.id}`} className="chip">
                      {g.title}
                      <span className="num text-xs font-semibold text-brand-700">{g.items.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="space-y-14 lg:col-span-9">
            {faqGroups.map((g) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-28">
                <h2 id={`${g.id}-title`} className="h-sub mb-4" {...reveal()}>
                  {g.title}
                </h2>
                <div {...reveal(60)}>
                  <FaqList faqs={g.items} />
                </div>
              </section>
            ))}

            {/* 工事ごとの質問 */}
            <section aria-labelledby="faq-services" {...reveal()}>
              <h2 id="faq-services" className="h-sub">
                工事ごとの質問
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-[1.95]">機種の選び方や工事にかかる時間など、工事の種類ごとの質問は、それぞれのサービスページにまとめています。</p>
              <ul className="rows rows-2 mt-5">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/service/${s.slug}#faq`} className="flex min-h-12 items-center py-2 text-[0.9375rem] font-bold text-ink transition-colors hover:text-brand-700">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      <CtaBand id="cta-faq" />
      <JsonLd data={faqSchema(allFaqs)} />
    </>
  );
}
