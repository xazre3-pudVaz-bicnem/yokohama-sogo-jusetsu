import { publishedAreas } from "@/data/areas";
import { services } from "@/data/services";
import { works } from "@/data/works";
import { activeClusters, getAllPosts, MIN_POSTS_TO_INDEX, pageCount } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

/**
 * サイトの全ページの一覧（サイトマップ・リンク検査・SEO の点検が、同じ一覧を使う）。
 * ページを増やしたら、ここに足す。データから作られるページ（サービス・事例・地域・コラム）は自動で入る。
 *   index … 検索結果に出すページか（false のページはサイトマップに入れない）
 */
export type RouteEntry = {
  path: string;
  lastModified: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  index: boolean;
};

export function allRoutes(): RouteEntry[] {
  const updated = siteConfig.contentUpdatedAt;
  const posts = getAllPosts();
  const latestPost = posts[0]?.updatedAt ?? updated;
  const latestWork = works.map((w) => w.source.postedAt).sort().at(-1) ?? updated;
  const max = (a: string, b: string) => (a > b ? a : b);

  const fixed: RouteEntry[] = [
    { path: "/", lastModified: max(updated, latestPost), priority: 1, changeFrequency: "weekly", index: true },
    { path: "/service", lastModified: updated, priority: 0.9, changeFrequency: "monthly", index: true },
    { path: "/works", lastModified: max(updated, latestWork), priority: 0.8, changeFrequency: "weekly", index: true },
    { path: "/area", lastModified: updated, priority: 0.8, changeFrequency: "monthly", index: true },
    { path: "/business", lastModified: updated, priority: 0.7, changeFrequency: "monthly", index: true },
    { path: "/company", lastModified: updated, priority: 0.7, changeFrequency: "monthly", index: true },
    { path: "/flow", lastModified: updated, priority: 0.6, changeFrequency: "yearly", index: true },
    { path: "/faq", lastModified: updated, priority: 0.6, changeFrequency: "monthly", index: true },
    { path: "/contact", lastModified: updated, priority: 0.7, changeFrequency: "yearly", index: true },
    { path: "/privacy", lastModified: updated, priority: 0.2, changeFrequency: "yearly", index: true },
    { path: "/blog", lastModified: latestPost, priority: 0.7, changeFrequency: "daily", index: true },
  ];

  const serviceRoutes: RouteEntry[] = services.map((s) => ({ path: `/service/${s.slug}`, lastModified: updated, priority: 0.9, changeFrequency: "monthly", index: true }));
  const areaRoutes: RouteEntry[] = publishedAreas.map((a) => ({ path: `/area/${a.slug}`, lastModified: max(updated, a.checkedAt), priority: 0.9, changeFrequency: "monthly", index: true }));
  const workRoutes: RouteEntry[] = works.map((w) => ({ path: `/works/${w.slug}`, lastModified: w.source.postedAt, priority: 0.6, changeFrequency: "yearly", index: true }));
  const postRoutes: RouteEntry[] = posts.map((p) => ({ path: `/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.6, changeFrequency: "monthly", index: true }));

  // 一覧の2ページ目以降・記事の少ないカテゴリは、たどれるようにはするが、サイトマップには入れない
  const blogPages: RouteEntry[] = Array.from({ length: Math.max(0, pageCount(posts.length) - 1) }, (_, i) => ({
    path: `/blog/page/${i + 2}`,
    lastModified: latestPost,
    priority: 0.3,
    changeFrequency: "daily" as const,
    index: false,
  }));
  const categoryRoutes: RouteEntry[] = activeClusters().flatMap(({ cluster, count }) => [
    { path: `/blog/category/${cluster.id}`, lastModified: latestPost, priority: 0.5, changeFrequency: "weekly" as const, index: count >= MIN_POSTS_TO_INDEX },
    ...Array.from({ length: Math.max(0, pageCount(count) - 1) }, (_, i) => ({
      path: `/blog/category/${cluster.id}/page/${i + 2}`,
      lastModified: latestPost,
      priority: 0.3,
      changeFrequency: "weekly" as const,
      index: false,
    })),
  ]);

  return [...fixed, ...serviceRoutes, ...areaRoutes, ...workRoutes, ...postRoutes, ...categoryRoutes, ...blogPages];
}
