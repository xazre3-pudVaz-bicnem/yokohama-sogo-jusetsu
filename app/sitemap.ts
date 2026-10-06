import type { MetadataRoute } from "next";
import { allRoutes } from "@/lib/routes";
import { SITE_URL } from "@/lib/seo";

/**
 * sitemap.xml（ページの一覧は lib/routes.ts から自動で作る）。
 * 本番 URL が決まっていないあいだ（公開前・プレビュー・手元のビルド）は、空のサイトマップを返す。
 * まだ存在しない本番 URL を検索エンジンに知らせないため。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL) return [];
  return allRoutes()
    .filter((r) => r.index)
    .map((r) => ({
      url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
      lastModified: r.lastModified,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    }));
}
