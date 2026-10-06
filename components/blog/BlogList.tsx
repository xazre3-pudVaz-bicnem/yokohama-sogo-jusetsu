import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { Icon } from "@/components/ui/Icon";
import type { Post } from "@/lib/blog";
import type { BlogCluster } from "@/lib/blog-clusters";
import { reveal } from "@/lib/reveal";

/** カテゴリの切り替え（記事のあるカテゴリだけを並べる） */
export function CategoryNav({ clusters, current }: { clusters: { cluster: BlogCluster; count: number }[]; current?: string }) {
  const chip = "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-bold transition-colors";
  const on = "border-navy-900 bg-navy-900 text-white";
  const off = "border-silver-300 bg-white text-ink hover:border-brand-600 hover:text-brand-700";
  return (
    <nav aria-label="カテゴリ">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href="/blog" className={`${chip} ${current ? off : on}`} aria-current={current ? undefined : "page"}>
            すべて
          </Link>
        </li>
        {clusters.map(({ cluster, count }) => (
          <li key={cluster.id}>
            <Link href={`/blog/category/${cluster.id}`} className={`${chip} ${current === cluster.id ? on : off}`} aria-current={current === cluster.id ? "page" : undefined}>
              {cluster.name}
              <span className={`num text-xs ${current === cluster.id ? "text-sky-300" : "text-ink-mute"}`}>{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** 記事の一覧（カード） */
export function PostGrid({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return <p className="rounded-lg bg-silver-50 p-8 text-center text-[0.9375rem]">このカテゴリのコラムは準備中です。</p>;
  }
  return (
    <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <li key={p.slug} {...reveal((i % 3) * 80)}>
          <PostCard post={p} headingLevel="h2" sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw" />
        </li>
      ))}
    </ul>
  );
}

/** ページ送り。basePath は1ページ目の URL（/blog や /blog/category/xxx） */
export function Pagination({ current, total, basePath }: { current: number; total: number; basePath: string }) {
  if (total <= 1) return null;
  const href = (n: number) => (n === 1 ? basePath : `${basePath}/page/${n}`);
  const pages = Array.from({ length: total }, (_, i) => i + 1).filter((n) => n === 1 || n === total || Math.abs(n - current) <= 1);
  const box = "num grid size-11 place-items-center rounded-md border text-sm font-semibold transition-colors";
  return (
    <nav aria-label="ページ送り" className="mt-14 flex items-center justify-center gap-2">
      {current > 1 && (
        <Link href={href(current - 1)} className={`${box} border-silver-300 text-ink hover:border-brand-600`} aria-label="前のページ" rel="prev">
          <Icon name="chevronRight" className="size-4 rotate-180" />
        </Link>
      )}
      {pages.map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          {i > 0 && pages[i - 1] !== n - 1 && <span className="text-silver-400">…</span>}
          {n === current ? (
            <span className={`${box} border-navy-900 bg-navy-900 text-white`} aria-current="page">
              {n}
            </span>
          ) : (
            <Link href={href(n)} className={`${box} border-silver-300 text-ink hover:border-brand-600`}>
              {n}
            </Link>
          )}
        </span>
      ))}
      {current < total && (
        <Link href={href(current + 1)} className={`${box} border-silver-300 text-ink hover:border-brand-600`} aria-label="次のページ" rel="next">
          <Icon name="chevronRight" className="size-4" />
        </Link>
      )}
    </nav>
  );
}
