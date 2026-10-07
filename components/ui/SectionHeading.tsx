import type { ReactNode } from "react";
import { Phrase } from "@/components/ui/Phrase";
import { reveal } from "@/lib/reveal";

/**
 * 区画の見出し。見出し（＋必要なら短い導入文）だけで組む。
 *
 * - 見出しは、内容が一目で分かる言葉にする（「対応工事」「交換時期の目安」「施工工程」など）。
 *   キャッチコピーにしない。
 * - eyebrow（見出しの上の小さな区分名）は、見出しだけでは区分が分からないときにだけ付ける。
 *   すべての区画に付けると、どのページも同じ型に見えるため。
 * - 左寄せが基本。
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  onDark = false,
  id,
  className = "",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  as?: "h1" | "h2" | "h3";
  onDark?: boolean;
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={className} {...reveal()}>
      {eyebrow && <p className={`eyebrow ${onDark ? "eyebrow-on-dark" : ""}`}>{eyebrow}</p>}
      <Tag id={id} className={`h-section text-balance ${eyebrow ? "mt-2" : ""} ${onDark ? "!text-white" : ""}`}>
        <Phrase>{title}</Phrase>
      </Tag>
      {lead && <p className={`lead mt-4 text-pretty ${onDark ? "text-silver-200" : ""}`}>{lead}</p>}
      {children}
    </div>
  );
}

/**
 * 見出しを左、内容を右に置く区画の組み方（PC）。スマホでは縦に並ぶ。
 * 文章や一覧が中心の区画で使う。カードで囲まず、見出しの上の1本の線で区切る。
 */
export function SectionSplit({ heading, children, className = "" }: { heading: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`rule-top grid gap-x-12 gap-y-7 pt-8 lg:grid-cols-12 lg:pt-10 ${className}`}>
      <div className="lg:col-span-4">{heading}</div>
      <div className="lg:col-span-8">{children}</div>
    </div>
  );
}
