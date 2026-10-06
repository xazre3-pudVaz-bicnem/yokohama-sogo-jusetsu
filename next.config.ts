import type { NextConfig } from "next";
import { siteConfig } from "./lib/site";

/**
 * 本番 URL の決め方（canonical・OGP・sitemap・robots・RSS・構造化データの基準）。
 *   1. 環境変数 NEXT_PUBLIC_SITE_URL（または SITE_URL）があれば、それを使う
 *   2. 無ければ、Vercel の本番デプロイ（VERCEL_ENV=production）のときだけ、lib/site.ts の productionUrl を使う
 *   3. それ以外（プレビューのデプロイ・手元のビルド・productionUrl が空）は空のまま
 *      → 全ページ noindex、canonical・sitemap は出さない（公開前のサイトやプレビューが検索結果に出るのを防ぐ）
 * NODE_ENV は見ない（プレビューも production ビルドのため、本番かどうかの判定には使えない）。
 * ここで決めた値を NEXT_PUBLIC_SITE_URL としてビルドに埋め込むので、サーバー側もブラウザ側も同じ値を見る。
 */
const resolvedSiteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  (process.env.VERCEL_ENV === "production" ? siteConfig.productionUrl : "")
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { NEXT_PUBLIC_SITE_URL: resolvedSiteUrl },
  poweredByHeader: false,
  // 親ディレクトリに別の lockfile があるため、ワークスペースのルートを明示する
  turbopack: { root: process.cwd() },
  images: {
    formats: ["image/avif", "image/webp"],
    // 用意する画像の幅を絞る（既定は16段階。srcset が長くなり HTML が大きくなるため）
    deviceSizes: [420, 640, 828, 1080, 1440, 1920],
    imageSizes: [64, 128, 256, 384],
    // 写真は 60（見た目の差はほぼ無く、転送量が 3〜4 割減る）。ロゴ・図は既定の 75
    qualities: [60, 75],
    // 最適化した画像を配信側で持つ期間（31日）。画像を差し替えるときは、ファイル名を変える
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    return [
      // 一覧の1ページ目は /blog（/blog/page/1 という URL は作らない）
      { source: "/blog/page/1", destination: "/blog", permanent: true },
      // 単数・複数の打ち間違いを正規の URL へ
      { source: "/services", destination: "/service", permanent: true },
      { source: "/services/:slug", destination: "/service/:slug", permanent: true },
      { source: "/work", destination: "/works", permanent: true },
      { source: "/areas", destination: "/area", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Vercel の URL（*.vercel.app）は、環境変数の設定に関係なく常に noindex。
        // 本番デプロイにも *.vercel.app の別名が付くが、検索結果に出すのは本番ドメインだけにする。
        source: "/:path*",
        has: [{ type: "host", value: "(?<sub>.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
