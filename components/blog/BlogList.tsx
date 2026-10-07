import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import type { Post } from "@/lib/blog";
import type { BlogCluster } from "@/lib/blog-clusters";
import { reveal } from "@/lib/reveal";
import { formatDateDot } from "@/lib/seo";

/** カテゴリの切り替え（記事のあるカテゴリだけを並べる）。文字だけのリンクで、いま見ているカテゴリに下線を引く */
export function CategoryNav({ clusters, current }: { clusters: { cluster: BlogCluster; count: number }[]; current?: string }) {
  const base = "inline-flex min-h-11 items-center gap-1.5 border-b-2 text-sm font-bold transition-colors";
  const on = "border-navy-900 text-ink";
  const off = "border-transparent text-ink-mute hover:text-brand-700";
  return (
    <nav aria-label="カテゴリ" className="border-b border-silver-200">
      <ul className="-mb-px flex flex-wrap gap-x-7">
        <li>
          <Link href="/blog" className={`${base} ${current ? off : on}`} aria-current={current ? undefined : "page"}>
            すべて
          </Link>
        </li>
        {clusters.map(({ cluster, count }) => (
          <li key={cluster.id}>
            <Link href={`/blog/category/${cluster.id}`} className={`${base} ${current === cluster.id ? on : off}`} aria-current={current === cluster.id ? "page" : undefined}>
              {cluster.name}
              <span className="num text-xs font-medium text-ink-mute">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Meta({ post }: { post: Post }) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-3 text-xs tracking-wider text-ink-mute">
      <time dateTime={post.publishedAt} className="num">
        {formatDateDot(post.publishedAt)}
      </time>
      <span className="font-bold">{post.cluster.name}</span>
    </span>
  );
}

/**
 * 記事の一覧。
 * 先頭の1本だけ、写真を大きく・文章を横に置く。残りは、日付・題名・概要を1行ずつ線で区切って並べる
 * （同じ形の写真つきカードを、何段も並べない）。
 */
export function PostGrid({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return <p className="border-y border-silver-200 py-10 text-center text-[0.9375rem]">このカテゴリのコラムは準備中です。</p>;
  }
  const [first, ...rest] = posts;
  return (
    <>
      <article className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <Link href={`/blog/${first.slug}`} className="zoom-wrap relative block aspect-[16/9] bg-silver-100" tabIndex={-1} aria-hidden="true">
            <PhotoFill image={first.photo.image} alt="" sizes="(min-width: 1280px) 680px, (min-width: 1024px) 56vw, 100vw" className="zoom-img" priority />
          </Link>
          {first.photo.image.startsWith("photos/") && <p className="mt-2 text-xs text-ink-mute">写真はイメージです</p>}
        </div>
        <div className="lg:col-span-5">
          <Meta post={first} />
          <h2 className="h-sub mt-2">
            <Link href={`/blog/${first.slug}`} className="underline-offset-4 hover:underline">
              <Phrase>{first.title}</Phrase>
            </Link>
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-[1.95]">{first.description}</p>
        </div>
      </article>

      {rest.length > 0 && (
        <ul className="rows mt-12 lg:mt-14">
          {rest.map((p, i) => (
            <li key={p.slug} {...reveal((i % 4) * 50)}>
              <Link href={`/blog/${p.slug}`} className="group grid gap-x-10 gap-y-1.5 py-6 md:grid-cols-[10.5rem_1fr_auto] md:items-start">
                <div className="md:pt-1">
                  <Meta post={p} />
                </div>
                <div>
                  <h2 className="text-[1.0625rem] font-bold leading-[1.65] text-ink transition-colors group-hover:text-brand-700">
                    <Phrase>{p.title}</Phrase>
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-[1.9] text-ink-body">{p.description}</p>
                </div>
                <Icon name="arrowRight" className="mt-1.5 hidden size-4 text-ink-mute transition-transform group-hover:translate-x-0.5 md:block" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** ページ送り。basePath は1ページ目の URL（/blog や /blog/category/xxx） */
export function Pagination({ current, total, basePath }: { current: number; total: number; basePath: string }) {
  if (total <= 1) return null;
  const href = (n: number) => (n === 1 ? basePath : `${basePath}/page/${n}`);
  const pages = Array.from({ length: total }, (_, i) => i + 1).filter((n) => n === 1 || n === total || Math.abs(n - current) <= 1);
  const box = "num grid size-11 place-items-center border text-sm font-medium transition-colors";
  return (
    <nav aria-label="ページ送り" className="mt-14 flex items-center justify-center gap-2">
      {current > 1 && (
        <Link href={href(current - 1)} className={`${box} border-silver-300 text-ink hover:border-navy-900`} aria-label="前のページ" rel="prev">
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
            <Link href={href(n)} className={`${box} border-silver-300 text-ink hover:border-navy-900`}>
              {n}
            </Link>
          )}
        </span>
      ))}
      {current < total && (
        <Link href={href(current + 1)} className={`${box} border-silver-300 text-ink hover:border-navy-900`} aria-label="次のページ" rel="next">
          <Icon name="chevronRight" className="size-4" />
        </Link>
      )}
    </nav>
  );
}
