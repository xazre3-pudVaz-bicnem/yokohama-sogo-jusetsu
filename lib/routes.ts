import { publishedAreas } from "@/data/areas";
import { services, servicePath } from "@/data/services";
import { serviceSlugsWithWorkList, workUpdatedAt, works, worksOfMainService } from "@/data/works";
import { activeClusters, getAllPosts, MIN_POSTS_TO_INDEX, pageCount } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

/**
 * サイトの全ページの一覧（サイトマップ・リンク検査・SEO の点検が、同じ一覧を使う）。
 * ページを増やしたら、ここに足す。データから作られるページ（サービス・事例・地域・コラム）は自動で入る。
 *   index … 検索結果に出すページか（false のページはサイトマップに入れない）
 *
 * lastModified は「そのページの内容を、実際に最後に直した日」。全ページを同じ日付にしない。
 *   - サービス … data/services/*.ts の updatedAt
 *   - 地域     … data/areas.ts の updatedAt
 *   - 施工事例 … data/works.ts の updatedAt（無ければ投稿日）
 *   - コラム   … 記事の updatedAt
 *   - 固定ページ … 下の FIXED_UPDATED（文章や構成を直したら、そのページの日付を直す）
 *   - 一覧のページ … 自分の日付と、載せている事例・記事のいちばん新しい日付の、新しいほう
 */
export type RouteEntry = {
  path: string;
  lastModified: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  index: boolean;
};

/** 固定ページの内容を最後に直した日 */
const FIXED_UPDATED: Record<string, string> = {
  "/": "2026-10-09",
  "/service": "2026-10-07",
  "/works": "2026-10-07",
  "/area": "2026-10-06",
  "/business": "2026-10-06",
  "/company": "2026-10-09",
  "/flow": "2026-10-09",
  "/faq": "2026-10-09",
  "/contact": "2026-10-09",
  "/privacy": "2026-10-09",
  "/blog": "2026-10-06",
};

export function allRoutes(): RouteEntry[] {
  const fallback = siteConfig.contentUpdatedAt;
  const fixedDate = (path: string) => FIXED_UPDATED[path] ?? fallback;
  const posts = getAllPosts();
  const max = (...dates: string[]) => dates.reduce((a, b) => (a > b ? a : b));
  const latestPost = posts.length ? max(...posts.map((p) => p.updatedAt)) : fixedDate("/blog");
  const latestWork = works.length ? max(...works.map(workUpdatedAt)) : fixedDate("/works");

  const fixed: RouteEntry[] = [
    { path: "/", lastModified: max(fixedDate("/"), latestPost, latestWork), priority: 1, changeFrequency: "weekly", index: true },
    { path: "/service", lastModified: max(fixedDate("/service"), ...services.map((s) => s.updatedAt)), priority: 0.9, changeFrequency: "monthly", index: true },
    { path: "/works", lastModified: max(fixedDate("/works"), latestWork), priority: 0.8, changeFrequency: "weekly", index: true },
    { path: "/area", lastModified: max(fixedDate("/area"), ...publishedAreas.map((a) => a.updatedAt)), priority: 0.8, changeFrequency: "monthly", index: true },
    { path: "/business", lastModified: fixedDate("/business"), priority: 0.7, changeFrequency: "monthly", index: true },
    { path: "/company", lastModified: fixedDate("/company"), priority: 0.7, changeFrequency: "monthly", index: true },
    { path: "/flow", lastModified: fixedDate("/flow"), priority: 0.6, changeFrequency: "yearly", index: true },
    { path: "/faq", lastModified: fixedDate("/faq"), priority: 0.6, changeFrequency: "monthly", index: true },
    { path: "/contact", lastModified: fixedDate("/contact"), priority: 0.7, changeFrequency: "yearly", index: true },
    { path: "/privacy", lastModified: fixedDate("/privacy"), priority: 0.2, changeFrequency: "yearly", index: true },
    { path: "/blog", lastModified: max(fixedDate("/blog"), latestPost), priority: 0.7, changeFrequency: "daily", index: true },
  ];

  const serviceRoutes: RouteEntry[] = services.map((s) => ({ path: servicePath(s), lastModified: s.updatedAt, priority: s.parent ? 0.8 : 0.9, changeFrequency: "monthly", index: true }));
  const areaRoutes: RouteEntry[] = publishedAreas.map((a) => ({ path: `/area/${a.slug}`, lastModified: a.updatedAt, priority: 0.9, changeFrequency: "monthly", index: true }));
  const workRoutes: RouteEntry[] = works.map((w) => ({ path: `/works/${w.slug}`, lastModified: workUpdatedAt(w), priority: 0.6, changeFrequency: "yearly", index: true }));
  // サービス別の事例一覧（事例が3件以上あるサービスだけ、ページがある）
  const workListRoutes: RouteEntry[] = serviceSlugsWithWorkList().map((slug) => ({
    path: `/works/service/${slug}`,
    lastModified: max(...worksOfMainService(slug).map(workUpdatedAt)),
    priority: 0.6,
    changeFrequency: "monthly" as const,
    index: true,
  }));
  const postRoutes: RouteEntry[] = posts.map((p) => ({ path: `/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.6, changeFrequency: "monthly", index: true }));

  // 一覧の2ページ目以降・記事の少ないカテゴリは、たどれるようにはするが、サイトマップには入れない
  const blogPages: RouteEntry[] = Array.from({ length: Math.max(0, pageCount(posts.length) - 1) }, (_, i) => ({
    path: `/blog/page/${i + 2}`,
    lastModified: latestPost,
    priority: 0.3,
    changeFrequency: "daily" as const,
    index: false,
  }));
  const categoryRoutes: RouteEntry[] = activeClusters().flatMap(({ cluster, count }) => {
    const latest = max(...posts.filter((p) => p.category === cluster.id).map((p) => p.updatedAt));
    return [
      { path: `/blog/category/${cluster.id}`, lastModified: latest, priority: 0.5, changeFrequency: "weekly" as const, index: count >= MIN_POSTS_TO_INDEX },
      ...Array.from({ length: Math.max(0, pageCount(count) - 1) }, (_, i) => ({
        path: `/blog/category/${cluster.id}/page/${i + 2}`,
        lastModified: latest,
        priority: 0.3,
        changeFrequency: "weekly" as const,
        index: false,
      })),
    ];
  });

  return [...fixed, ...serviceRoutes, ...areaRoutes, ...workRoutes, ...workListRoutes, ...postRoutes, ...categoryRoutes, ...blogPages];
}
