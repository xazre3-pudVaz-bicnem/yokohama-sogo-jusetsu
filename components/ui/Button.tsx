import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { primaryPhone, telHref, receptionHours } from "@/lib/site";

type Variant = "primary" | "navy" | "white" | "outline" | "ghostDark";

const VARIANT: Record<Variant, string> = {
  primary: "btn-primary",
  navy: "btn-navy",
  white: "btn-white",
  outline: "btn-outline",
  ghostDark: "btn-ghost-dark",
};

/** リンクの形をしたボタン。既定で右に矢印が付く */
export function LinkButton({
  href,
  children,
  variant = "primary",
  icon,
  arrow = true,
  small,
  className = "",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: IconName;
  arrow?: boolean;
  small?: boolean;
  className?: string;
  external?: boolean;
}) {
  const cls = `btn ${VARIANT[variant]} ${small ? "btn-sm" : ""} ${className}`;
  const inner = (
    <>
      {icon && <Icon name={icon} className="size-5" />}
      <span>{children}</span>
      {arrow && <Icon name={external ? "arrowUpRight" : "arrowRight"} className="btn-arrow size-4" />}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/**
 * 電話ボタン。番号は lib/site.ts の代表番号。番号が未設定なら何も出さない。
 * showNumber … ボタンの文字を番号そのものにする（PC 向け）。false なら「電話で相談する」
 */
export function PhoneButton({
  variant = "white",
  showNumber = true,
  small,
  className = "",
  label = "電話で相談する",
}: {
  variant?: Variant;
  showNumber?: boolean;
  small?: boolean;
  className?: string;
  label?: string;
}) {
  const phone = primaryPhone();
  if (!phone) return null;
  return (
    <a href={telHref(phone)} className={`btn ${VARIANT[variant]} ${small ? "btn-sm" : ""} ${className}`} data-cv="tel">
      <Icon name="phone" className="size-5" />
      {showNumber ? <span className="num text-[1.15em] font-semibold tracking-wider">{phone}</span> : <span>{label}</span>}
    </a>
  );
}

/**
 * 電話番号と受付時間を2行で見せる（ヘッダー用）。
 * 表示のしかた（inline-flex・hidden xl:inline-flex など）は className で必ず渡す。
 * ここで inline-flex を付けると、呼び出し側の hidden と打ち消し合って、隠したい幅でも表示されてしまう。
 */
export function PhoneBlock({ onDark = false, className = "inline-flex" }: { onDark?: boolean; className?: string }) {
  const phone = primaryPhone();
  if (!phone) return null;
  const hours = receptionHours();
  return (
    <a href={telHref(phone)} className={`group items-center gap-2.5 whitespace-nowrap ${className}`} data-cv="tel">
      <span className={`grid size-11 place-items-center rounded-full ${onDark ? "bg-white/10 text-sky-300" : "bg-brand-50 text-brand-700"}`}>
        <Icon name="phone" className="size-5" />
      </span>
      <span className="leading-tight">
        <span className={`num block text-[1.5rem] font-semibold tracking-wider ${onDark ? "text-white" : "text-navy-900"}`}>{phone}</span>
        {hours && <span className={`block text-xs ${onDark ? "text-silver-300" : "text-ink-mute"}`}>受付 {hours}</span>}
      </span>
    </a>
  );
}
