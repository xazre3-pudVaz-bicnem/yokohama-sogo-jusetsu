import Link from "next/link";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Phrase } from "@/components/ui/Phrase";
import { headingId } from "@/lib/blog";

/**
 * コラム本文（Markdown）を表示する。
 * - 見出し（h2・h3）には、目次から飛べるよう id を付ける（lib/blog.ts の extractHeadings と同じ作り方）
 * - サイト内のリンクは next/link、外部のリンクは別タブ＋ rel を付ける
 * - 表は、幅が足りないとき横にスクロールできる（app/globals.css の .prose-jp table）
 * 本文の h1 は使わない（ページの見出しが h1）。Markdown に # があっても h2 として出す。
 */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) return textOf((node as { props: { children?: ReactNode } }).props.children);
  return "";
}

/** 見出しの中身が文字だけなら、文字列にして返す（文節で区切れるように）。強調などを含むときは、そのまま返す */
function plain(children: ReactNode): ReactNode {
  const list = Array.isArray(children) ? children : [children];
  return list.every((c) => typeof c === "string" || typeof c === "number") ? list.join("") : children;
}

export function MarkdownBody({ body }: { body: string }) {
  // 同じ見出しが2回出たときに id が重ならないよう、出た回数を数える
  const seen = new Map<string, number>();
  const idFor = (children: ReactNode) => {
    const base = headingId(textOf(children));
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n > 0 ? `${base}-${n + 1}` : base;
  };

  return (
    <div className="prose-jp">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 id={idFor(children)} className="scroll-mt-28">
              <Phrase>{plain(children)}</Phrase>
            </h2>
          ),
          h2: ({ children }) => (
            <h2 id={idFor(children)} className="scroll-mt-28">
              <Phrase>{plain(children)}</Phrase>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={idFor(children)} className="scroll-mt-28">
              <Phrase>{plain(children)}</Phrase>
            </h3>
          ),
          a: ({ href = "", children }) => {
            if (href.startsWith("/") || href.startsWith("#")) return <Link href={href}>{children}</Link>;
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
