import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Icon } from "@/components/ui/Icon";
import { mainNav, subNav, serviceNav } from "@/lib/nav";
import { siteConfig, primaryPhone, telHref, receptionHours } from "@/lib/site";

/**
 * ヘッダー。
 * - 上段（PC のみ・スクロールで隠れる）：対応エリアの一言と補助メニュー
 * - 下段（常に上部に固定）：ロゴ／主メニュー／電話番号／お問い合わせ
 * 「サービス」はホバー・フォーカスで全サービスの一覧が開く（JS なしで動く）。
 * スマホのメニューは MobileMenu（クライアントコンポーネント）。メニューの中身は props で渡し、
 * データファイルをブラウザ側のバンドルに含めない。
 *
 * サービスの一覧（メガメニュー）の組み方
 * - 文字と細い線だけで組む（アイコンや色分けは使わない）。
 * - サービスの数は分類ごとに違う（6・3・1・1・2）。列の高さをそろえるため、
 *   数の多い「住宅設備」は2列に分け、数の少ない「外装」と「リフォーム」は1つの列に重ねる。
 */
const MEGA_COLUMNS: string[][] = [["equipment"], ["energy"], ["exterior", "reform"], ["site"]];

export function Header() {
  const phone = primaryPhone();
  const hours = receptionHours();
  const category = (id: string) => serviceNav.find((c) => c.id === id);

  return (
    <>
      <div className="hidden bg-navy-950 text-white lg:block">
        <div className="container-x flex h-9 items-center justify-between text-xs tracking-wider">
          <p className="text-silver-200">
            {siteConfig.primaryArea.city}
            {siteConfig.primaryArea.ward}の住宅設備・リフォーム<span className="mx-2 text-silver-500">｜</span>神奈川・東京エリア対応
          </p>
          <ul className="flex items-center gap-7">
            {subNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex items-center whitespace-nowrap py-2 text-silver-200 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            {siteConfig.social.instagram && (
              <li>
                <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 py-2 text-silver-200 transition-colors hover:text-white">
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
                      className="relative flex items-center gap-1 whitespace-nowrap px-3 text-[0.9375rem] font-bold tracking-wider text-navy-900 transition-colors hover:text-brand-700 xl:px-4"
                    >
                      {l.label}
                      {isService && <Icon name="chevronDown" className="size-3.5 text-silver-500 transition-transform duration-300 group-hover/mega:rotate-180" />}
                    </Link>
                    {isService && (
                      <div className="invisible absolute inset-x-0 top-full z-40 px-[clamp(1.25rem,4vw,2.5rem)] opacity-0 transition-[opacity,visibility] duration-200 group-focus-within/mega:visible group-focus-within/mega:opacity-100 group-hover/mega:visible group-hover/mega:opacity-100">
                        <div className="mx-auto max-w-[64rem] border border-t-0 border-silver-300 bg-white px-8 pb-5 pt-7 shadow-[0_18px_30px_-22px_rgb(6_21_55/0.45)]">
                          <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr] gap-x-9">
                            {MEGA_COLUMNS.map((ids) => (
                              <div key={ids.join("-")} className="space-y-6">
                                {ids.map((id) => {
                                  const cat = category(id);
                                  if (!cat) return null;
                                  const wide = cat.links.length > 4;
                                  return (
                                    <div key={cat.id}>
                                      <p className="border-b border-navy-900 pb-2 text-[0.75rem] font-bold tracking-[0.14em] text-ink-mute">{cat.name}</p>
                                      <ul className={wide ? "grid grid-cols-2 gap-x-7" : ""}>
                                        {cat.links.map((s) => (
                                          <li key={s.href} className="border-b border-silver-200">
                                            <Link href={s.href} className="block py-2.5 text-[0.9375rem] font-bold leading-snug text-navy-900 transition-colors hover:text-brand-700">
                                              {s.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                          <p className="mt-5 text-right">
                            <Link href="/service" className="inline-flex items-center gap-1.5 text-[0.8125rem] font-bold tracking-wider text-navy-900 transition-colors hover:text-brand-700">
                              サービス一覧
                              <Icon name="arrowRight" className="size-3.5" />
                            </Link>
                          </p>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            {phone && (
              <a href={telHref(phone)} className="hidden whitespace-nowrap text-right leading-tight xl:block" data-cv="tel">
                <span className="num block text-[1.375rem] font-medium tracking-wider text-navy-900">{phone}</span>
                {hours && <span className="block text-[0.6875rem] tracking-wider text-ink-mute">受付 {hours}</span>}
              </a>
            )}
            {phone && (
              <a
                href={telHref(phone)}
                className="grid size-11 place-items-center rounded-sm border border-silver-300 text-navy-900 sm:hidden"
                aria-label={`電話で相談する（${phone}）`}
                data-cv="tel"
              >
                <Icon name="phone" className="size-5" />
              </a>
            )}
            <Link href="/contact" className="btn btn-primary btn-sm hidden sm:inline-flex">
              お問い合わせ
            </Link>
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
