import { Icon } from "@/components/ui/Icon";
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
          <summary className="flex items-start gap-3 py-5 pr-1 sm:gap-4">
            <span className="num mt-0.5 grid size-7 shrink-0 place-items-center rounded-sm bg-navy-900 text-sm font-semibold text-white" aria-hidden="true">
              Q
            </span>
            <h3 className="flex-1 text-[1.0313rem] font-bold leading-relaxed text-ink">
              <Phrase>{f.q}</Phrase>
            </h3>
            <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-silver-300 text-brand-700 transition-transform duration-300 group-open:rotate-45">
              <Icon name="plus" className="size-3.5" />
            </span>
          </summary>
          <div className="flex items-start gap-3 pb-6 pr-1 sm:gap-4">
            <span className="num mt-0.5 grid size-7 shrink-0 place-items-center rounded-sm bg-brand-50 text-sm font-semibold text-brand-700" aria-hidden="true">
              A
            </span>
            <p className="flex-1 text-[0.9688rem] leading-[1.95]">{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
