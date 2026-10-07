import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import type { Post } from "@/lib/blog";
import { formatDateDot } from "@/lib/seo";

/** 写真なしの1行（サービスページの関連コラムなど）。呼び出し側で .rows のパネルに入れる */
export function PostRow({ post, headingLevel: H = "h3" }: { post: Post; headingLevel?: "h3" | "h4" }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid gap-x-5 gap-y-1.5 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-mute">
          <time dateTime={post.publishedAt} className="num">
            {formatDateDot(post.publishedAt)}
          </time>
          <span className="tag tag-blue">{post.cluster.name}</span>
        </p>
        <H className="mt-1.5 text-[0.9688rem] font-bold leading-relaxed transition-colors group-hover:text-brand-700">
          <Phrase>{post.title}</Phrase>
        </H>
      </div>
      <span className="arrow-dot hidden sm:grid">
        <Icon name="arrowRight" className="size-4" />
      </span>
    </Link>
  );
}

/** 写真つきのパネル（トップページ・コラムの一覧）。写真は lib/blog.ts の photoOf で決まる */
export function PostCard({ post, sizes, headingLevel: H = "h3", priority = false }: { post: Post; sizes: string; headingLevel?: "h2" | "h3"; priority?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="zoom-wrap relative aspect-[16/9] bg-silver-100">
        <PhotoFill image={post.photo.image} alt="" sizes={sizes} className="zoom-img" priority={priority} />
        <span className="tag absolute right-3 top-3">{post.cluster.name}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <H className="text-[1.0313rem] font-bold leading-[1.6] transition-colors group-hover:text-brand-700">
          <Phrase>{post.title}</Phrase>
        </H>
        <p className="mt-2 line-clamp-3 text-sm leading-[1.85] text-ink-body">{post.description}</p>
        <p className="mt-auto pt-4 text-xs text-ink-mute">
          <time dateTime={post.publishedAt} className="num">
            {formatDateDot(post.publishedAt)}
          </time>
        </p>
      </div>
    </Link>
  );
}
