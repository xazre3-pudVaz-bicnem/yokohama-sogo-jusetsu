import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Icon } from "@/components/ui/Icon";
import { LineIcon } from "@/components/ui/LineIcon";
import { footerNav, footerAreaNav, serviceNav } from "@/lib/nav";
import { siteConfig, primaryPhone, telHref, lineUrl, receptionHours, officeAddressWithPostal, officeMapUrl, type OfficeKey } from "@/lib/site";

/**
 * フッター。会社名・所在地・電話番号（NAP）は lib/site.ts から出す。表記を全ページでそろえるため、ここに直接書かない。
 * スマホでは下部の固定ボタン（MobileCtaBar）に隠れないよう、最下部に余白を取っている。
 */
export function Footer() {
  const phone = primaryPhone();
  const hours = receptionHours();
  const line = lineUrl();
  const offices: OfficeKey[] = ["totsuka", "head"];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-silver-200">
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] lg:gap-16 lg:py-20">
        {/* 会社情報 */}
        <div>
          <Logo onDark size="lg" />
          <p className="mt-6 max-w-md text-sm leading-loose text-silver-300">
            {siteConfig.primaryArea.city}
            {siteConfig.primaryArea.ward}を中心に、住宅設備・リフォーム・外壁塗装・太陽光発電・造園の工事を行っています。
          </p>

          <dl className="mt-7 space-y-4 text-sm">
            {offices.map((key) => (
              <div key={key} className="flex gap-3">
                <dt className="w-[5.5rem] shrink-0 font-bold text-white">{siteConfig.offices[key].label}</dt>
                <dd>
                  <a href={officeMapUrl(key)} target="_blank" rel="noopener noreferrer" className="leading-relaxed underline-offset-4 hover:text-white hover:underline">
                    {officeAddressWithPostal(key)}
                  </a>
                </dd>
              </div>
            ))}
            {phone && (
              <div className="flex gap-3">
                <dt className="w-[5.5rem] shrink-0 font-bold text-white">電話</dt>
                <dd>
                  <a href={telHref(phone)} className="num text-lg font-semibold tracking-wider text-white hover:text-sky-300" data-cv="tel">
                    {phone}
                  </a>
                  {hours && <span className="block text-xs text-silver-400 sm:ml-2 sm:inline">受付 {hours}</span>}
                </dd>
              </div>
            )}
          </dl>

          {(line || siteConfig.social.instagram) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {line && (
                <a
                  href={line}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 border border-white/30 px-4 text-sm font-bold text-white transition-colors hover:bg-white hover:text-navy-900"
                  data-cv="line"
                >
                  <LineIcon onDark className="size-5" />
                  LINE で相談
                </a>
              )}
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 border border-white/30 px-4 text-sm font-bold text-white transition-colors hover:bg-white hover:text-navy-900"
                >
                  <Icon name="instagram" className="size-5" />
                  Instagram（施工写真）
                </a>
              )}
            </div>
          )}
        </div>

        {/* メニュー */}
        <nav aria-label="フッターメニュー" className="grid gap-10 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow eyebrow-on-dark border-b border-white/20 pb-2">サービス</p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-6">
              {serviceNav.map((cat) => (
                <div key={cat.id}>
                  <p className="text-xs font-bold tracking-widest text-silver-400">{cat.name}</p>
                  <ul className="mt-1">
                    {cat.links.map((s) => (
                      <li key={s.href}>
                        <Link href={s.href} className="inline-flex min-h-10 items-center text-sm leading-snug text-silver-200 underline-offset-4 hover:text-white hover:underline">
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-9">
            <div>
              <p className="eyebrow eyebrow-on-dark border-b border-white/20 pb-2">対応エリア</p>
              <ul className="mt-3">
                {footerAreaNav.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-10 items-center text-sm leading-snug text-silver-200 underline-offset-4 hover:text-white hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow eyebrow-on-dark border-b border-white/20 pb-2">サイトの案内</p>
              <ul className="mt-3">
                {footerNav.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-10 items-center text-sm leading-snug text-silver-200 underline-offset-4 hover:text-white hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 pb-24 pt-6 text-xs text-silver-400 sm:flex-row sm:items-center sm:justify-between lg:pb-6">
          <p>
            © {year} {siteConfig.name}
          </p>
          <p className="font-[family-name:var(--font-display)] uppercase tracking-[0.2em]">{siteConfig.nameEn}</p>
        </div>
      </div>
    </footer>
  );
}
