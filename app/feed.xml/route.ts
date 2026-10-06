import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/**
 * コラムの RSS（/feed.xml）。新しい順に30本。
 * 本番 URL が決まっていないあいだは 404 を返す（記事の URL を組み立てられないため）。
 */
export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  if (!SITE_URL) return new Response("Not Found", { status: 404 });
  const posts = getAllPosts().slice(0, 30);
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.publishedAt}T09:00:00+09:00`).toUTCString()}</pubDate>
      <category>${esc(p.cluster.name)}</category>
      <description>${esc(p.description)}</description>
    </item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${siteConfig.shortName} 住宅設備コラム`)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc("給湯器・エアコン・外壁塗装・リフォームなど、住宅設備の交換時期・選び方・費用の考え方をまとめたコラムです。")}</description>
    <language>ja</language>${posts[0] ? `\n    <lastBuildDate>${new Date(`${posts[0].updatedAt}T09:00:00+09:00`).toUTCString()}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
