import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { serviceCategories, servicesByCategory } from "@/data/services";

export const metadata: Metadata = {
  title: "ページが見つかりません｜横浜総合住設",
  description: "お探しのページは見つかりませんでした。",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/", label: "トップページ" },
  { href: "/service", label: "サービス一覧" },
  { href: "/works", label: "施工事例" },
  { href: "/area", label: "対応エリア" },
  { href: "/blog", label: "住宅設備コラム" },
  { href: "/faq", label: "よくある質問" },
  { href: "/company", label: "会社案内" },
  { href: "/contact", label: "お問い合わせ" },
];

/** 404 ページ。行き止まりにせず、主なページとサービスへの入口を置く */
export default function NotFound() {
  return (
    <div className="bg-white">
      <div className="container-x section">
        <p className="num text-sm font-medium tracking-[0.2em] text-ink-mute">404</p>
        <h1 className="h-page mt-2">ページが見つかりません</h1>
        <p className="lead mt-5">ページが移動したか、URL が変わった可能性があります。下の一覧から、目的のページをお探しください。</p>

        <nav aria-label="主なページ" className="mt-12 grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="eyebrow">主なページ</h2>
            <ul className="rows mt-3">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group flex min-h-12 items-center justify-between gap-2 py-2 text-[0.9375rem] font-bold text-ink transition-colors hover:text-brand-700">
                    {l.label}
                    <Icon name="arrowRight" className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <h2 className="eyebrow">サービスから探す</h2>
            <dl className="card card-line mt-3 px-5 text-[0.9375rem] leading-[1.95] sm:px-7">
              {serviceCategories.map((cat) => (
                <div key={cat.id} className="grid gap-x-9 gap-y-1 border-b-2 border-dotted border-silver-300 py-3.5 last:border-b-0 md:grid-cols-[11rem_1fr]">
                  <dt className="font-bold text-ink">{cat.name}</dt>
                  <dd className="flex flex-wrap gap-x-5 gap-y-1">
                    {servicesByCategory(cat.id).map((s) => (
                      <Link key={s.slug} href={`/service/${s.slug}`} className="inline-flex min-h-10 items-center text-link !font-normal">
                        {s.shortName}
                      </Link>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </nav>
      </div>
    </div>
  );
}
