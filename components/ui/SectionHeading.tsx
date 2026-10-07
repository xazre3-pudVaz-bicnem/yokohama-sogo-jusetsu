import type { ReactNode } from "react";
import { Phrase } from "@/components/ui/Phrase";
import { reveal } from "@/lib/reveal";

/**
 * 区画の見出し。
 *
 * - eyebrow は、吹き出し型のラベル（下に小さな三角）。区画が何の話かを一言で示す。
 * - 見出しは、内容が一目で分かる言葉にする（「対応工事」「交換時期の目安」「施工工程」など）。キャッチコピーにしない。
 * - mark に見出しの一部を渡すと、その部分に蛍光ペンを引く（画面に入ったときに左から引かれる）。
 * - align="center" は、カードを横に並べる区画の上に置くとき。文章が中心の区画は左寄せ。
 */
const PILL = { blue: "", navy: "pill-navy", sun: "pill-sun", white: "pill-white" } as const;

function Title({ title, mark }: { title: ReactNode; mark?: string }) {
  if (typeof title !== "string" || !mark || !title.includes(mark)) return <Phrase>{title}</Phrase>;
  const at = title.indexOf(mark);
  return (
    <>
      <Phrase>{title.slice(0, at)}</Phrase>
      <span className="marker">
        <Phrase>{mark}</Phrase>
      </span>
      <Phrase>{title.slice(at + mark.length)}</Phrase>
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  onDark = false,
  id,
  className = "",
  children,
  align = "left",
  color = "blue",
  mark,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  as?: "h1" | "h2" | "h3";
  onDark?: boolean;
  id?: string;
  className?: string;
  children?: ReactNode;
  align?: "left" | "center";
  /** ラベルの色 */
  color?: keyof typeof PILL;
  /** 見出しのうち、蛍光ペンを引く部分 */
  mark?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : ""} ${className}`} {...reveal()}>
      {eyebrow && (
        <p className={`mb-5 flex ${center ? "justify-center" : ""}`}>
          <span className={`pill ${center ? "pill-center" : ""} ${PILL[onDark && color === "blue" ? "white" : color]}`}>{eyebrow}</span>
        </p>
      )}
      <Tag id={id} className={`h-section text-balance ${onDark ? "!text-white" : ""}`}>
        <Title title={title} mark={mark} />
      </Tag>
      {lead && <p className={`lead mt-4 text-pretty ${center ? "mx-auto" : ""} ${onDark ? "text-silver-100" : ""}`}>{lead}</p>}
      {children}
    </div>
  );
}

/**
 * 見出しを左、内容を右に置く区画の組み方（PC）。スマホでは縦に並ぶ。
 * 文章や一覧が中心の区画で使う。
 */
export function SectionSplit({ heading, children, className = "" }: { heading: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`grid gap-x-12 gap-y-7 lg:grid-cols-12 ${className}`}>
      <div className="lg:col-span-4">{heading}</div>
      <div className="lg:col-span-8">{children}</div>
    </div>
  );
}
