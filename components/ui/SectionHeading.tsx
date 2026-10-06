import type { ReactNode } from "react";
import { Phrase } from "@/components/ui/Phrase";
import { reveal } from "@/lib/reveal";

/**
 * 区画の見出し。小見出し（青い平行四辺形つき）＋見出し＋導入文。
 * 見出しは左寄せが基本。中央にそろえるのは、区画全体が中央組みのときだけ。
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  align = "left",
  onDark = false,
  id,
  className = "",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  onDark?: boolean;
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`} {...reveal()}>
      {eyebrow && <p className={`eyebrow ${onDark ? "eyebrow-on-dark" : ""}`}>{eyebrow}</p>}
      <Tag id={id} className={`h-section text-balance ${eyebrow ? "mt-3" : ""} ${onDark ? "!text-white" : ""}`}>
        <Phrase>{title}</Phrase>
      </Tag>
      {lead && <p className={`lead mt-5 text-pretty ${align === "center" ? "mx-auto" : ""} ${onDark ? "text-silver-200" : ""}`}>{lead}</p>}
      {children}
    </div>
  );
}
