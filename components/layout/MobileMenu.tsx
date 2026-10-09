"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { LineIcon } from "@/components/ui/LineIcon";

type LinkItem = { href: string; label: string };

/**
 * スマホ・タブレット用のメニュー（1024px 未満）。
 * ヘッダーの下から画面いっぱいに開く。開いている間は背面のスクロールを止める。
 * メニュー内のリンクを押したとき・Esc キーで閉じる。
 */
export function MobileMenu({
  main,
  sub,
  services,
  phone,
  telHref,
  hours,
  instagram,
  line,
}: {
  main: LinkItem[];
  sub: LinkItem[];
  services: { name: string; links: LinkItem[] }[];
  phone: string;
  telHref: string;
  hours: string;
  instagram: string;
  line: string;
}) {
  const [open, setOpen] = useState(false);

  // メニュー内のリンクを押したら閉じる（同じページへのリンクでも閉じるよう、クリックで判定する）
  const closeOnLink = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        className="relative grid size-11 place-items-center rounded-sm bg-navy-900 text-white"
      >
        <span className="relative block h-3.5 w-5" aria-hidden="true">
          <span className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform duration-300 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
          <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-0 top-3 h-0.5 w-5 bg-current transition-transform duration-300 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
        </span>
      </button>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto overscroll-contain bg-white transition-[opacity,visibility] duration-200 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
        inert={!open}
        onClick={closeOnLink}
      >
        <nav aria-label="メニュー" className="container-x pb-28 pt-6">
          {/* 連絡先 */}
          <div className="grid grid-cols-2 gap-3">
            {phone && (
              <a href={telHref} className="btn btn-outline btn-sm flex-col !gap-0.5 !px-2 !py-2.5" data-cv="tel">
                <span className="text-xs font-semibold">電話で相談</span>
                {/* 幅 320px でも1行に収まる大きさにする（番号が2行に割れると読み違える） */}
                <span className="num whitespace-nowrap text-[1.0625rem] font-semibold tracking-wide">{phone}</span>
              </a>
            )}
            <Link href="/contact" className={`btn btn-primary btn-sm ${phone ? "" : "col-span-2"}`}>
              無料見積もり
            </Link>
            {line && (
              <a href={line} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm col-span-2" data-cv="line">
                <LineIcon className="size-5" />
                LINE で相談する
              </a>
            )}
          </div>
          {hours && <p className="mt-2 text-center text-xs text-ink-mute">電話受付 {hours}</p>}

          {/* サービス */}
          <p className="eyebrow mt-8">サービス</p>
          <div className="mt-3 space-y-5">
            {services.map((cat) => (
              <div key={cat.name}>
                <p className="text-xs font-bold tracking-widest text-ink-mute">{cat.name}</p>
                <ul className="mt-1 grid grid-cols-2 gap-x-4">
                  {cat.links.map((l) => (
                    <li key={l.href} className="border-b border-silver-200">
                      <Link href={l.href} className="flex min-h-12 items-center py-2 text-[0.9375rem] font-bold leading-snug text-navy-900 text-balance">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link href="/service" className="link-arrow mt-5 !text-sm">
            サービス一覧
          </Link>

          {/* そのほかのページ */}
          <p className="eyebrow mt-9">サイトの案内</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-4">
            {[...main.filter((l) => l.href !== "/service"), ...sub].map((l) => (
              <li key={l.href} className="border-b border-silver-200">
                <Link href={l.href} className="flex min-h-12 items-center py-2 text-[0.9375rem] font-bold leading-snug text-navy-900 text-balance">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="link-arrow mt-7 !text-sm">
              Instagram（施工写真）
            </a>
          )}
        </nav>
      </div>
    </div>
  );
}
