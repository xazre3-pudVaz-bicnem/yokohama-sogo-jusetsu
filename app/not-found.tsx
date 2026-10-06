import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { LinkButton, PhoneButton } from "@/components/ui/Button";
import { Illust } from "@/components/ui/Photo";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "ページが見つかりません｜横浜総合住設",
  description: "お探しのページは見つかりませんでした。",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/service", label: "サービス一覧" },
  { href: "/works", label: "施工事例" },
  { href: "/area", label: "対応エリア" },
  { href: "/blog", label: "住宅設備コラム" },
  { href: "/faq", label: "よくある質問" },
  { href: "/company", label: "会社案内" },
];

/** 404 ページ。行き止まりにせず、主なページとサービスへの入口を置く */
export default function NotFound() {
  return (
    <div className="bg-blueprint relative overflow-hidden text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[8%] top-0 h-full w-[46%] -skew-x-[24deg] bg-gradient-to-b from-brand-600/30 to-transparent" />
      <div className="container-x relative py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div>
            <p className="num text-[5rem] font-semibold leading-none tracking-wider text-sky-400 sm:text-[7rem]">404</p>
            <h1 className="h-page mt-4 !text-white">
              <span className="ib">お探しのページが、</span>
              <span className="ib">見つかりませんでした。</span>
            </h1>
            <p className="lead mt-5 text-silver-200">ページが移動したか、URL が変わった可能性があります。下のメニューから、目的のページをお探しください。</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LinkButton href="/" variant="white" icon="home">
                トップページへ
              </LinkButton>
              <LinkButton href="/contact" variant="ghostDark" icon="document" arrow={false}>
                お問い合わせ
              </LinkButton>
              <PhoneButton variant="ghostDark" />
            </div>
          </div>
          <div className="hidden justify-self-center lg:block">
            <div className="relative grid size-64 place-items-end overflow-hidden rounded-full bg-white ring-8 ring-sky-400/40">
              <Illust image="illust/pose-think" width={220} className="mx-auto h-auto w-[72%]" />
            </div>
          </div>
        </div>

        <nav aria-label="主なページ" className="mt-14 grid gap-10 border-t border-white/15 pt-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]">
          <div>
            <p className="eyebrow eyebrow-on-dark">主なページ</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 lg:grid-cols-1">
              {LINKS.map((l) => (
                <li key={l.href} className="border-b border-white/15">
                  <Link href={l.href} className="group flex min-h-12 items-center justify-between gap-2 py-2 text-[0.9375rem] font-bold text-white hover:text-sky-300">
                    {l.label}
                    <Icon name="chevronRight" className="size-4 text-sky-400 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow eyebrow-on-dark">サービスから探す</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
              {services.map((s) => (
                <li key={s.slug} className="border-b border-white/15">
                  <Link href={`/service/${s.slug}`} className="group flex min-h-12 items-center gap-2.5 py-2 text-[0.9375rem] font-bold text-white hover:text-sky-300">
                    <Icon name={s.icon} className="size-[1.1rem] text-sky-400" />
                    <span className="flex-1">{s.shortName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
