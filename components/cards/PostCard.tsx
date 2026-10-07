import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Phrase } from "@/components/ui/Phrase";
import type { Post } from "@/lib/blog";
import { formatDateDot } from "@/lib/seo";

/** 写真なしの1行（トップページ・サービスページの関連コラムなど）。呼び出し側で .rows を付ける */
export function PostRow({ post, headingLevel: H = "h3" }: { post: Post; headingLevel?: "h3" | "h4" }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[10.5rem_1fr_auto] sm:items-baseline">
      <span className="flex flex-wrap items-baseline gap-x-3 text-xs tracking-wider text-ink-mute">
        <time dateTime={post.publishedAt} className="num">
          {formatDateDot(post.publishedAt)}
        </time>
        <span className="font-bold">{post.cluster.name}</span>
      </span>
      <H className="text-[0.9688rem] font-bold leading-relaxed text-ink transition-colors group-hover:text-brand-700">
        <Phrase>{post.title}</Phrase>
      </H>
      <Icon name="arrowRight" className="hidden size-4 shrink-0 self-center text-navy-900 transition-transform duration-300 group-hover:translate-x-1 sm:block" />
    </Link>
  );
}
