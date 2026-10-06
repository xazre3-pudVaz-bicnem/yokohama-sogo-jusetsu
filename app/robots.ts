import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * robots.txt
 * - 本番 URL が決まっているとき … 全体を許可し、サイトマップの場所を知らせる
 * - 決まっていないとき（公開前・プレビュー・手元のビルド）… 全体を拒否する
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_URL) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
