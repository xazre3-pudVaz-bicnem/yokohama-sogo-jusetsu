import { Phrase } from "@/components/ui/Phrase";

/**
 * よくある質問の一覧（details / summary。JS なしで開閉できる）。
 * 1問ずつ、白い角丸のパネルにする。Q は青、A は濃紺の丸で示す。
 * 構造化データ（FAQPage）は、このコンポーネントでは出さない。
 * ページ側で、表示している質問だけを faqSchema() に渡して出すこと。
 */
export function FaqList({ faqs, openFirst = false }: { faqs: { q: string; a: string }[]; openFirst?: boolean }) {
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <details key={f.q} className="card card-line group px-4 sm:px-6" open={openFirst && i === 0}>
          <summary className="flex items-start gap-3 py-4 sm:gap-4 sm:py-5">
            <span className="num grid size-7 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-semibold leading-none text-white" aria-hidden="true">
              Q
            </span>
            <h3 className="flex-1 pt-0.5 text-base font-bold leading-[1.75]">
              <Phrase>{f.q}</Phrase>
            </h3>
            {/* 開閉の印（＋ → −） */}
            <span className="relative mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-cream text-navy-900" aria-hidden="true">
              <span className="absolute h-0.5 w-2.5 rounded bg-current" />
              <span className="absolute h-2.5 w-0.5 rounded bg-current transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <div className="flex items-start gap-3 border-t-2 border-dotted border-silver-300 py-4 sm:gap-4 sm:py-5">
            <span className="num grid size-7 shrink-0 place-items-center rounded-full bg-navy-900 text-sm font-semibold leading-none text-white" aria-hidden="true">
              A
            </span>
            <p className="flex-1 text-[0.9375rem] leading-[1.95]">{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
