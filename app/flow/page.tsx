import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Illust } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { flowSteps } from "@/data/company";
import { reveal } from "@/lib/reveal";
import { buildMetadata } from "@/lib/seo";

/**
 * お問い合わせ〜工事完了までの流れ
 * 役割：はじめて工事を頼む人に、進め方と、各段階で用意するものを伝える（不安を減らし、問い合わせにつなげる）。
 * 担当する検索意図：リフォーム 流れ／給湯器 交換 流れ／見積もり 現地調査 何を見る
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
        eyebrow="工事の流れ"
        title={
          <>
            <span className="ib">お問い合わせから、</span>
            <span className="ib">工事の完了まで。</span>
          </>
        }
        lead="はじめて工事を頼むときは、何から始めればよいのか分かりにくいものです。ご相談から完了までを8つの段階に分けて、それぞれで行うことと、用意していただくものをご案内します。"
        crumbs={[{ name: "工事の流れ", href: "/flow" }]}
      >
        <ol className="mt-7 flex flex-wrap gap-x-1.5 gap-y-2 text-[0.8125rem] font-bold">
          {flowSteps.map((s, i) => (
            <li key={s.id} className="flex items-center gap-1.5">
              <a href={`#${s.id}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/30 bg-white/5 px-3.5 transition-colors hover:bg-white hover:text-navy-900">
                <span className="num text-sky-300">{i + 1}</span>
                {s.title}
              </a>
              {i < flowSteps.length - 1 && <Icon name="chevronRight" className="size-3.5 text-silver-400" />}
            </li>
          ))}
        </ol>
      </PageHero>

      <section aria-label="工事の流れ" className="section bg-white">
        <div className="container-narrow">
          <ol className="relative">
            {/* 縦の線 */}
            <span aria-hidden="true" className="absolute bottom-10 left-[2.4rem] top-10 w-px bg-silver-300 sm:left-[3.4rem]" />
            {flowSteps.map((s, i) => (
              <li key={s.id} id={s.id} className="relative flex scroll-mt-28 gap-4 pb-10 last:pb-0 sm:gap-7" {...reveal()}>
                <div className="relative z-10 flex w-[4.8rem] shrink-0 flex-col items-center sm:w-[6.8rem]">
                  <span className="grid aspect-square w-full place-items-end overflow-hidden rounded-full border-2 border-white bg-brand-100 shadow-[0_0_0_1px_var(--color-silver-200)]">
                    <Illust image={s.pose} width={110} className="mx-auto h-auto w-[78%]" />
                  </span>
                  <span className="num tag-slant tag-slant-blue -mt-2.5 !px-3 text-xs">STEP {i + 1}</span>
                </div>
                <div className="flex-1 pt-1 sm:pt-3">
                  <p className="text-[0.8125rem] font-bold tracking-wider text-brand-700">{s.lead}</p>
                  <h2 className="mt-1 text-[1.35rem] font-extrabold leading-snug sm:text-2xl"><Phrase>{s.title}</Phrase></h2>
                  <p className="mt-3 text-[0.9688rem] leading-[2.05]">{s.body}</p>
                  {s.prepare && (
                    <div className="mt-4 rounded-md bg-silver-50 px-4 py-3.5">
                      <p className="text-xs font-bold tracking-widest text-ink-mute">ご用意いただくとスムーズなもの</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {s.prepare.map((p) => (
                          <li key={p} className="flex gap-2">
                            <Icon name="check" className="mt-1 size-3.5 text-brand-600" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="flow-notes" className="cv section bg-silver-50">
        <div className="container-x">
          <SectionHeading id="flow-notes" eyebrow="ご相談の前に" title="知っておくと安心な、3つのこと。" />
          <ul className="mt-9 grid gap-4 lg:grid-cols-3">
            {NOTES.map((n, i) => (
              <li key={n.title} className="rounded-lg border border-silver-200 bg-white p-6" {...reveal(i * 80)}>
                <p className="num text-sm font-semibold tracking-[0.2em] text-brand-600">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-lg font-extrabold leading-snug"><Phrase>{n.title}</Phrase></h3>
                <p className="mt-2.5 text-[0.9375rem] leading-[1.95]">{n.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2" {...reveal()}>
            <Link href="/faq" className="link-arrow">
              よくある質問を見る
              <Icon name="arrowRight" className="size-4" />
            </Link>
            <Link href="/service" className="link-arrow">
              サービス一覧を見る
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand id="cta-flow" />
    </>
  );
}
