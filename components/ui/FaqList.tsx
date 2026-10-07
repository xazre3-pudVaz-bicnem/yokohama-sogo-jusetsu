import { Phrase } from "@/components/ui/Phrase";

/**
 * よくある質問の一覧（details / summary。JS なしで開閉できる）。
 * 構造化データ（FAQPage）は、このコンポーネントでは出さない。
 * ページ側で、表示している質問だけを faqSchema() に渡して出すこと。
 */
export function FaqList({ faqs, openFirst = false }: { faqs: { q: string; a: string }[]; openFirst?: boolean }) {
  return (
    <div className="rows">
      {faqs.map((f, i) => (
        <details key={f.q} className="group" open={openFirst && i === 0}>
          <summary className="flex items-start gap-3.5 py-5 sm:gap-5">
            <span className="num w-4 shrink-0 text-base font-semibold leading-[1.9] text-ink-mute" aria-hidden="true">
              Q
            </span>
            <h3 className="flex-1 text-base font-bold leading-[1.8] text-ink">
              <Phrase>{f.q}</Phrase>
            </h3>
            {/* 開閉の印（＋ → −） */}
            <span className="relative mt-[0.55rem] size-3.5 shrink-0 text-navy-900" aria-hidden="true">
              <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
              <span className="absolute left-1/2 top-0 h-full w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <div className="flex items-start gap-3.5 pb-6 sm:gap-5">
            <span className="num w-4 shrink-0 text-base font-semibold leading-[1.95] text-ink-mute" aria-hidden="true">
              A
            </span>
            <p className="flex-1 text-[0.9375rem] leading-[1.95]">{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
