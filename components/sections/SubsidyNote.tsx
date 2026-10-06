import { Icon } from "@/components/ui/Icon";
import type { Subsidy } from "@/data/subsidies";
import { formatDateJa } from "@/lib/seo";

/**
 * 補助金・支援制度の案内。
 * 金額・期限・受付状況は data/subsidies.ts の確認済みの内容だけを出し、必ず「確認日」と「出典」を添える。
 * 制度は年度や予算の消化で変わるため、ここに数字を直接書かないこと。
 */
export function SubsidyNote({ subsidy, headingLevel: H = "h3" }: { subsidy: Subsidy; headingLevel?: "h3" | "h4" }) {
  const open = subsidy.status === "open";
  return (
    <article className="overflow-hidden rounded-lg border border-silver-200 bg-white">
      <header className="border-b border-silver-200 bg-silver-50 px-5 py-4 sm:px-7">
        <p className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider">
          <span className={`rounded-sm px-2 py-0.5 ${open ? "bg-brand-600 text-white" : "bg-silver-500 text-white"}`}>{open ? "受付中" : "受付終了"}</span>
          <span className="rounded-sm border border-silver-300 bg-white px-2 py-0.5 text-ink-body">{subsidy.level}</span>
          <span className="text-ink-mute">{subsidy.operator}</span>
        </p>
        <H className="mt-2 text-lg font-extrabold leading-snug text-ink">{subsidy.name}</H>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-body">{subsidy.summary}</p>
      </header>

      <div className="px-5 py-5 sm:px-7">
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {subsidy.amounts.map((a) => (
            <div key={a.label} className="border-b border-dashed border-silver-300 pb-3">
              <dt className="text-[0.8125rem] font-bold text-ink-mute">{a.label}</dt>
              <dd className="mt-0.5">
                <span className="num text-xl font-semibold text-navy-900">{a.value}</span>
                {a.note && <span className="mt-0.5 block text-xs leading-relaxed text-ink-mute">{a.note}</span>}
              </dd>
            </div>
          ))}
        </dl>

        <dl className="mt-5 space-y-3 text-sm leading-[1.85]">
          <div className="sm:flex sm:gap-4">
            <dt className="shrink-0 font-bold text-ink sm:w-24">受付状況</dt>
            <dd>{subsidy.statusText}</dd>
          </div>
          <div className="sm:flex sm:gap-4">
            <dt className="shrink-0 font-bold text-ink sm:w-24">申請する人</dt>
            <dd>{subsidy.applicant}</dd>
          </div>
          <div className="sm:flex sm:gap-4">
            <dt className="shrink-0 font-bold text-ink sm:w-24">期間</dt>
            <dd>{subsidy.period}</dd>
          </div>
          <div className="sm:flex sm:gap-4">
            <dt className="shrink-0 font-bold text-ink sm:w-24">主な条件</dt>
            <dd>
              <ul className="space-y-1">
                {subsidy.conditions.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span aria-hidden="true" className="mt-[0.7em] inline-block h-[0.4em] w-[0.55em] shrink-0 -skew-x-[24deg] bg-brand-600" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      <footer className="flex flex-col gap-2 border-t border-silver-200 bg-silver-50 px-5 py-3.5 text-xs text-ink-mute sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p>
          <time dateTime={subsidy.checkedAt}>{formatDateJa(subsidy.checkedAt)}</time>に公式ページで確認した内容です。
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {subsidy.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1 py-1">
                {s.label}
                <Icon name="arrowUpRight" className="size-3" />
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
}

/** 補助金の区画の末尾に置く注意書き */
export function SubsidyCaution() {
  return (
    <p className="mt-5 text-[0.8125rem] leading-[1.9] text-ink-mute">
      補助金・支援制度は、年度や予算の状況によって内容が変わり、期限の前に受付が終わることがあります。申請できる人や、工事を始めてよい時期も制度ごとに違います。最新の内容は各制度の公式ページでご確認ください。お見積もりの際に、その時点で使える制度をお調べしてご案内します。
    </p>
  );
}
