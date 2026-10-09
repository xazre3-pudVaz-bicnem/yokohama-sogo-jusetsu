import type { Metadata } from "next";
import { BlogIndexView } from "@/components/blog/BlogIndexView";
import { keywordsFor } from "@/data/seo-keyword-map";
import { buildMetadata } from "@/lib/seo";

/**
 * 住宅設備コラム（一覧の1ページ目）
 * 役割：検索ニーズへの回答（1記事1検索意図）。記事はサービスページ・施工事例・地域ページへリンクする。
 * 記事は content/blog/*.md。毎日の自動投稿は scripts/generate-blog-post.ts が1本ずつ足す。
 */
export const metadata: Metadata = buildMetadata({
  title: "住宅設備コラム｜交換時期・選び方・費用の考え方",
  description:
    "横浜総合住設の住宅設備コラムです。給湯器・エコキュート・エアコン・トイレ・外壁塗装・太陽光・蓄電池・リフォームについて、交換の時期、機種の選び方、費用の考え方、補助金の情報をまとめています。",
  path: "/blog",
  keywords: keywordsFor("/blog"),
});

export default function BlogPage() {
  return <BlogIndexView page={1} />;
}
