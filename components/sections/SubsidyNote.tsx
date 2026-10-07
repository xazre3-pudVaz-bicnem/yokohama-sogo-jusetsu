import { Icon } from "@/components/ui/Icon";
import type { Subsidy } from "@/data/subsidies";
import { formatDateJa } from "@/lib/seo";

/**
 * 補助金・支援制度の案内。
 * 金額・期限・受付状況は data/subsidies.ts の確認済みの内容だけを出し、必ず「確認日」と「出典」を添える。
 * 制度は年度や予算の消化で変わるため、ここに数字を直接書かないこと。
 * 枠で囲まず、上の1本の線と、項目ごとの細い線で組む。
 * wide … 横に広い場所（見出しの横）に1件だけ置くとき。上の線を省き、金額を3列まで並べる。
 */
export function SubsidyNote({ subsidy, headingLevel: H = "h3", wide = false }: { subsidy: Subsidy; headingLevel?: "h3" | "h4"; wide?: boolean }) {
  const open = subsidy.status === "open";
  return (
    <article className={wide ? "" : "rule-top pt-5"}>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-wider text-ink-mute">
        <span className={`tag ${open ? "" : "!bg-silver-500"}`}>{open ? "受付中" : "受付終了"}</span>
        <span className="font-bold text-ink">{subsidy.level}</span>
        <span>{subsidy.operator}</span>
      </p>
      <H className="mt-2.5 text-lg font-bold leading-snug text-ink">{subsidy.name}</H>
      <p className="mt-1.5 text-sm leading-[1.85] text-ink-body">{subsidy.summary}</p>

      <dl className={`mt-5 grid gap-x-9 border-t border-silver-300 sm:grid-cols-2 ${wide ? "lg:grid-cols-3" : ""}`}>
        {subsidy.amounts.map((a) => (
          <div key={a.label} className="border-b border-silver-200 py-3.5">
            <dt className="text-[0.8125rem] text-ink-mute">{a.label}</dt>
            <dd className="mt-0.5">
              <span className="num text-xl font-medium text-navy-900">{a.value}</span>
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
            <ul className="dash-list space-y-1">
              {subsidy.conditions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <footer className="mt-5 border-t border-silver-200 pt-3 text-xs leading-relaxed text-ink-mute">
        <p>
          <time dateTime={subsidy.checkedAt}>{formatDateJa(subsidy.checkedAt)}</time>に公式ページで確認した内容です。
        </p>
        <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
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
    <p className="mt-8 text-[0.8125rem] leading-[1.9] text-ink-mute">
      補助金・支援制度は、年度や予算の状況によって内容が変わり、期限の前に受付が終わることがあります。申請できる人や、工事を始めてよい時期も制度ごとに違います。最新の内容は各制度の公式ページでご確認ください。お見積もりの際に、その時点で使える制度をお調べしてご案内します。
    </p>
  );
}
