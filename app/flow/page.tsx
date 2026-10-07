import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Illust } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading, SectionSplit } from "@/components/ui/SectionHeading";
import { flowSteps } from "@/data/company";
import { reveal } from "@/lib/reveal";
import { buildMetadata } from "@/lib/seo";

/**
 * お問い合わせ〜工事完了までの流れ
 * 役割：はじめて工事を頼む人に、進め方と、各段階で用意するものを伝える（不安を減らし、問い合わせにつなげる）。
 * 担当する検索意図：リフォーム 流れ／給湯器 交換 流れ／見積もり 現地調査 何を見る
 * 順番のある内容なので、番号を付ける。人物のイラストは、手順を説明するこのページにだけ、小さく添えている。
 */
export const metadata: Metadata = buildMetadata({
  title: "工事の流れ｜お問い合わせから完了まで",
  description:
    "横浜総合住設にご相談いただいてから、工事が完了するまでの流れです。お問い合わせ、現地調査、お見積もり、ご契約、施工、お引き渡しまで。それぞれの段階で用意していただくものも合わせてご案内します。",
  path: "/flow",
  keywords: ["リフォーム 流れ", "給湯器 交換 流れ", "現地調査 見積もり 無料", "横浜総合住設 工事の流れ"],
});

const NOTES = [
  { title: "お見積もりまでは無料です", body: "現地調査とお見積もりに費用はかかりません。内容をご覧になってから、頼むかどうかをお決めください。" },
  { title: "写真があると、話が早く進みます", body: "機器の型番のシールと、設置場所の全体が分かる写真をお送りいただくと、現地調査の前に必要な工事の見当がつきます。" },
  { title: "補助金は、工事の前にご相談を", body: "制度によっては、契約や着工の前に申請が必要です。使いたい制度がある場合は、最初のご相談のときにお知らせください。" },
];

export default function FlowPage() {
  return (
    <>
      <PageHero
        title="工事の流れ"
        lead="ご相談から工事の完了までを8つの段階に分けて、それぞれで行うことと、ご用意いただくものをご案内します。"
        crumbs={[{ name: "工事の流れ", href: "/flow" }]}
      >
        <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-1 border-t border-silver-200 pt-4 text-[0.8125rem] font-bold">
          {flowSteps.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="inline-flex min-h-10 items-center gap-1.5 text-ink-body underline-offset-4 transition-colors hover:text-brand-700 hover:underline">
                <span className="num font-medium text-ink-mute">{i + 1}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </PageHero>

      <section aria-label="工事の流れ" className="section bg-white">
        <div className="container-x">
          <ol className="rows mx-auto max-w-[58rem]">
            {flowSteps.map((s, i) => (
              <li key={s.id} id={s.id} className="grid scroll-mt-28 grid-cols-[2.25rem_1fr] gap-x-4 py-8 sm:grid-cols-[3.5rem_1fr_6.5rem] sm:gap-x-7 lg:py-10" {...reveal()}>
                <p className="num text-[1.75rem] font-medium leading-none text-silver-500 sm:text-[2.25rem]">{i + 1}</p>
                <div>
                  <h2 className="text-[1.25rem] font-bold leading-snug sm:text-[1.375rem]">
                    <Phrase>{s.title}</Phrase>
                  </h2>
                  <p className="mt-1 text-[0.8125rem] font-bold tracking-wider text-ink-mute">{s.lead}</p>
                  <p className="mt-3 text-[0.9688rem] leading-[2.05]">{s.body}</p>
                  {s.prepare && (
                    <div className="mt-5 border-l-2 border-navy-900 pl-5">
                      <p className="text-[0.8125rem] font-bold tracking-wider text-ink">ご用意いただくとよいもの</p>
                      <ul className="dash-list mt-2 space-y-1 text-[0.9375rem]">
                        {s.prepare.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="hidden self-start sm:block" aria-hidden="true">
                  <Illust image={s.pose} width={104} className="ml-auto h-auto w-[5.5rem]" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="flow-notes" className="cv section bg-silver-50">
        <div className="container-x">
          <SectionSplit heading={<SectionHeading id="flow-notes" title="ご相談の前に" />}>
            <ul className="rows" {...reveal(60)}>
              {NOTES.map((n) => (
                <li key={n.title} className="grid gap-x-9 gap-y-1.5 py-5 md:grid-cols-[17rem_1fr]">
                  <h3 className="text-base font-bold leading-[1.75]">
                    <Phrase>{n.title}</Phrase>
                  </h3>
                  <p className="text-[0.9375rem] leading-[1.95]">{n.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-7 flex flex-wrap gap-x-9 gap-y-3">
              <Link href="/faq" className="link-arrow">
                よくある質問
                <Icon name="arrowRight" className="size-4" />
              </Link>
              <Link href="/service" className="link-arrow">
                サービス一覧
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </p>
          </SectionSplit>
        </div>
      </section>

      <CtaBand id="cta-flow" />
    </>
  );
}
