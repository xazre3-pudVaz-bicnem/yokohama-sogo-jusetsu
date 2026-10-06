import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { breadcrumbSchema } from "@/lib/schema";

export type Crumb = { name: string; href: string };

/**
 * パンくずリスト（画面の表示と、構造化データ BreadcrumbList の両方を出す）。
 * items には「ホーム」を含めない（自動で先頭に付く）。最後の要素が現在のページ。
 */
export function Breadcrumbs({ items, onDark = false, className = "" }: { items: Crumb[]; onDark?: boolean; className?: string }) {
  const all: Crumb[] = [{ name: "ホーム", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="パンくずリスト" className={className}>
        <ol className={`flex flex-wrap items-center gap-x-1.5 text-[0.8125rem] leading-relaxed ${onDark ? "text-silver-300" : "text-ink-mute"}`}>
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex min-h-10 items-center gap-1.5">
                {i > 0 && <Icon name="chevronRight" className="size-3.5 opacity-60" />}
                {last ? (
                  <span aria-current="page" className={onDark ? "text-white" : "text-ink"}>
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.href} className={`inline-flex min-h-10 items-center underline-offset-4 hover:underline ${onDark ? "hover:text-white" : "hover:text-brand-700"}`}>
                    {c.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  );
}
