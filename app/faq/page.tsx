import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Illust } from "@/components/ui/Photo";
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
        eyebrow="よくある質問"
        title={
          <>
            <span className="ib">はじめての</span>
            <span className="ib">ご相談の前に。</span>
          </>
        }
        lead="お見積もりのこと、対応エリアのこと、工事の進め方のこと。よくいただく質問にお答えします。ここに無いことは、お電話かフォームでお気軽におたずねください。"
        crumbs={[{ name: "よくある質問", href: "/faq" }]}
      />

      <div className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          {/* 目次 */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav aria-label="質問の分類">
              <p className="eyebrow">質問の分類</p>
              <ul className="mt-3 flex flex-wrap gap-2 lg:block lg:space-y-0">
                {faqGroups.map((g) => (
                  <li key={g.id} className="lg:border-b lg:border-dashed lg:border-silver-300">
                    <a href={`#${g.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-silver-300 px-4 text-sm font-bold text-ink transition-colors hover:text-brand-700 lg:flex lg:rounded-none lg:border-0 lg:px-0">
                      {g.title}
                      <span className="num text-xs text-ink-mute">{g.items.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 hidden w-36 lg:block" {...reveal(100, "pop")}>
              <Illust image="illust/people-woman-think" width={200} className="h-auto w-full" />
            </div>
          </aside>

          <div className="space-y-14">
            {faqGroups.map((g) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-28">
                <h2 id={`${g.id}-title`} className="h-sub mb-5 flex items-center gap-2.5" {...reveal()}>
                  <span aria-hidden="true" className="inline-block h-3.5 w-5 -skew-x-[24deg] bg-brand-600" />
                  {g.title}
                </h2>
                <div {...reveal(60)}>
                  <FaqList faqs={g.items} />
                </div>
              </section>
            ))}

            {/* 工事ごとの質問 */}
            <section aria-labelledby="faq-services" className="rounded-lg bg-silver-50 p-6 sm:p-8" {...reveal()}>
              <h2 id="faq-services" className="h-sub">
                工事ごとの質問は、各サービスのページで
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-[1.9]">機種の選び方や工事にかかる時間など、工事の種類ごとの質問は、それぞれのページにまとめています。</p>
              <ul className="mt-5 grid gap-x-6 sm:grid-cols-2">
                {services.map((s) => (
                  <li key={s.slug} className="border-b border-dashed border-silver-300">
                    <Link href={`/service/${s.slug}#faq`} className="group flex min-h-12 items-center gap-2.5 py-2 text-[0.9375rem] font-bold text-ink transition-colors hover:text-brand-700">
                      <Icon name={s.icon} className="size-[1.1rem] text-brand-600" />
                      <span className="flex-1">{s.name}</span>
                      <Icon name="chevronRight" className="size-4 text-silver-400 transition-transform group-hover:translate-x-1" />
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
