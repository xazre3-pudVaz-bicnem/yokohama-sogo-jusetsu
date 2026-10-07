import { Icon } from "@/components/ui/Icon";
import type { Subsidy } from "@/data/subsidies";
import { formatDateJa } from "@/lib/seo";

/**
 * 補助金・支援制度の案内。白い角丸のパネルに、受付状況・金額・条件・出典をまとめる。
 * 金額・期限・受付状況は data/subsidies.ts の確認済みの内容だけを出し、必ず「確認日」と「出典」を添える。
 * 制度は年度や予算の消化で変わるため、ここに数字を直接書かないこと。
 * wide … 横に広い場所（見出しの横）に1件だけ置くとき。金額を3列まで並べる。
 */
export function SubsidyNote({ subsidy, headingLevel: H = "h3", wide = false }: { subsidy: Subsidy; headingLevel?: "h3" | "h4"; wide?: boolean }) {
  const open = subsidy.status === "open";
  return (
    <article className="card h-full border-2 border-brand-200 p-5 sm:p-7">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-mute">
        <span className={`tag ${open ? "!bg-brand-600" : "!bg-silver-500"}`}>{open ? "受付中" : "受付終了"}</span>
        <span className="font-bold text-navy-900">{subsidy.level}</span>
        <span>{subsidy.operator}</span>
      </p>
      <H className="mt-2.5 text-lg font-black leading-snug">{subsidy.name}</H>
      <p className="mt-1.5 text-sm leading-[1.85] text-ink-body">{subsidy.summary}</p>

      <dl className={`mt-5 grid gap-2.5 sm:grid-cols-2 ${wide ? "lg:grid-cols-3" : ""}`}>
        {subsidy.amounts.map((a) => (
          <div key={a.label} className="rounded-2xl bg-mist px-4 py-3">
            <dt className="text-[0.8125rem] font-bold text-navy-900">{a.label}</dt>
            <dd className="mt-0.5">
              <span className="num text-[1.375rem] font-semibold leading-tight text-brand-700">{a.value}</span>
              {a.note && <span className="mt-0.5 block text-xs leading-relaxed text-ink-mute">{a.note}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <dl className="mt-5 text-sm leading-[1.85]">
        <div className="py-2.5 sm:flex sm:gap-4">
          <dt className="shrink-0 font-bold text-navy-900 sm:w-24">受付状況</dt>
          <dd>{subsidy.statusText}</dd>
        </div>
        <div className="border-t-2 border-dotted border-silver-300 py-2.5 sm:flex sm:gap-4">
          <dt className="shrink-0 font-bold text-navy-900 sm:w-24">申請する人</dt>
          <dd>{subsidy.applicant}</dd>
        </div>
        <div className="border-t-2 border-dotted border-silver-300 py-2.5 sm:flex sm:gap-4">
          <dt className="shrink-0 font-bold text-navy-900 sm:w-24">期間</dt>
          <dd>{subsidy.period}</dd>
        </div>
        <div className="border-t-2 border-dotted border-silver-300 py-2.5 sm:flex sm:gap-4">
          <dt className="shrink-0 font-bold text-navy-900 sm:w-24">主な条件</dt>
          <dd>
            <ul className="dash-list space-y-1">
              {subsidy.conditions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <footer className="mt-4 rounded-xl bg-paper-2 px-4 py-3 text-xs leading-relaxed text-ink-mute">
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
    <p className="mt-6 text-[0.8125rem] leading-[1.9] text-ink-mute">
      補助金・支援制度は、年度や予算の状況によって内容が変わり、期限の前に受付が終わることがあります。申請できる人や、工事を始めてよい時期も制度ごとに違います。最新の内容は各制度の公式ページでご確認ください。お見積もりの際に、その時点で使える制度をお調べしてご案内します。
    </p>
  );
}
