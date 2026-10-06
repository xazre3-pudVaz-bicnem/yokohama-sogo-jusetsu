import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import type { Post } from "@/lib/blog";
import { formatDateDot } from "@/lib/seo";

/** コラム記事のカード。写真はカテゴリごとの既定の写真（lib/blog-clusters.ts） */
export function PostCard({ post, sizes, headingLevel: H = "h3" }: { post: Post; sizes: string; headingLevel?: "h2" | "h3" }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
      <div className="zoom-wrap relative aspect-[16/9] overflow-hidden rounded-lg bg-silver-100">
        <PhotoFill image={post.cluster.image} alt="" sizes={sizes} className="zoom-img" />
        <span className="tag-slant tag-slant-blue absolute left-0 top-4">{post.cluster.name}</span>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <time dateTime={post.publishedAt} className="num text-xs font-medium tracking-widest text-ink-mute">
          {formatDateDot(post.publishedAt)}
        </time>
        <H className="mt-1.5 text-[1.0313rem] font-extrabold leading-[1.6] text-ink transition-colors group-hover:text-brand-700">
          <Phrase>{post.title}</Phrase>
        </H>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.8] text-ink-body">{post.description}</p>
      </div>
    </Link>
  );
}

/** 写真なしの1行（サービスページの「関連コラム」など） */
export function PostRow({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex items-center gap-4 py-4">
      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="chip">{post.cluster.name}</span>
          <time dateTime={post.publishedAt} className="num tracking-widest text-ink-mute">
            {formatDateDot(post.publishedAt)}
          </time>
        </span>
        <span className="mt-1.5 block text-base font-bold leading-relaxed text-ink transition-colors group-hover:text-brand-700">
          <Phrase>{post.title}</Phrase>
        </span>
      </span>
      <Icon name="arrowRight" className="size-4 shrink-0 text-brand-600 transition-transform duration-300 group-hover:translate-x-1.5" />
    </Link>
  );
}
