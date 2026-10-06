import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Icon } from "@/components/ui/Icon";
import { LinkButton, PhoneBlock } from "@/components/ui/Button";
import { mainNav, subNav, serviceNav } from "@/lib/nav";
import { siteConfig, primaryPhone, telHref, receptionHours } from "@/lib/site";

/**
 * ヘッダー。
 * - 上段（PC のみ・スクロールで隠れる）：対応エリアの一言と補助メニュー
 * - 下段（常に上部に固定）：ロゴ／主メニュー／電話番号／無料見積もり
 * 「サービス」はホバー・フォーカスで全サービスの一覧が開く（JS なしで動く）。
 * スマホのメニューは MobileMenu（クライアントコンポーネント）。メニューの中身は props で渡し、
 * データファイルをブラウザ側のバンドルに含めない。
 */
export function Header() {
  const phone = primaryPhone();
  const hours = receptionHours();
  return (
    <>
      <div className="hidden bg-navy-950 text-white lg:block">
        <div className="container-x flex h-9 items-center justify-between text-xs tracking-wider">
          <p className="text-silver-200">
            {siteConfig.primaryArea.city}
            {siteConfig.primaryArea.ward}の住宅設備・リフォーム<span className="mx-2 text-silver-500">｜</span>神奈川・東京エリア対応
          </p>
          <ul className="flex items-center gap-6">
            {subNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex items-center gap-1 whitespace-nowrap py-2 text-silver-200 transition-colors hover:text-white">
                  <Icon name="chevronRight" className="size-3 text-sky-400" />
                  {l.label}
                </Link>
              </li>
            ))}
            {siteConfig.social.instagram && (
              <li>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-2 text-silver-200 transition-colors hover:text-white"
                >
                  <Icon name="instagram" className="size-4" />
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-silver-200 bg-white">
        <div className="container-x relative flex h-16 items-center justify-between gap-2 sm:gap-4 lg:h-[4.5rem]">
          <Logo priority />

          <nav aria-label="メインメニュー" className="hidden h-full lg:block">
            <ul className="flex h-full items-stretch">
              {mainNav.map((l) => {
                const isService = l.href === "/service";
                return (
                  <li key={l.href} className={`flex ${isService ? "group/mega" : ""}`}>
                    <Link
                      href={l.href}
                      className="relative flex items-center gap-1 whitespace-nowrap px-3 text-[0.9375rem] font-bold tracking-wider text-navy-900 transition-colors hover:text-brand-600 xl:px-4"
                    >
                      {l.label}
                      {isService && <Icon name="chevronDown" className="size-4 transition-transform duration-300 group-hover/mega:rotate-180" />}
                    </Link>
                    {isService && (
                      <div className="invisible absolute inset-x-0 top-full z-40 translate-y-1 px-[clamp(1.25rem,4vw,2.5rem)] opacity-0 transition-all duration-200 group-focus-within/mega:visible group-focus-within/mega:translate-y-0 group-focus-within/mega:opacity-100 group-hover/mega:visible group-hover/mega:translate-y-0 group-hover/mega:opacity-100">
                        <div className="grid grid-cols-5 gap-x-6 rounded-b-lg border border-t-0 border-silver-200 bg-white p-7 shadow-[var(--shadow-lift)]">
                          {serviceNav.map((cat) => (
                            <div key={cat.id}>
                              <p className="eyebrow text-[0.8125rem]">{cat.name}</p>
                              <ul className="mt-3 space-y-0.5">
                                {cat.links.map((s) => (
                                  <li key={s.href}>
                                    <Link
                                      href={s.href}
                                      className="flex items-center gap-2 rounded px-2 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
                                    >
                                      <Icon name={s.icon} className="size-4 text-brand-600" />
                                      {s.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <PhoneBlock className="hidden xl:inline-flex" />
            {phone && (
              <a
                href={telHref(phone)}
                className="grid size-11 place-items-center rounded-md border border-silver-300 text-navy-900 sm:hidden"
                aria-label={`電話で相談する（${phone}）`}
                data-cv="tel"
              >
                <Icon name="phone" className="size-5" />
              </a>
            )}
            <LinkButton href="/contact" small className="hidden sm:inline-flex" icon="document" arrow={false}>
              無料見積もり
            </LinkButton>
            <MobileMenu
              main={mainNav}
              sub={subNav}
              services={serviceNav.map((c) => ({ name: c.name, links: c.links.map((s) => ({ href: s.href, label: s.label })) }))}
              phone={phone}
              telHref={telHref(phone)}
              hours={hours}
              instagram={siteConfig.social.instagram}
            />
          </div>
        </div>
      </header>
    </>
  );
}
