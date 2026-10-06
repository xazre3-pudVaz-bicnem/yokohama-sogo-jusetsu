import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndexView } from "@/components/blog/BlogIndexView";
import { getAllPosts, pageCount } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

/** 住宅設備コラム（一覧の2ページ目以降）。1ページ目は /blog */
export function generateStaticParams() {
  const total = pageCount(getAllPosts().length);
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  return buildMetadata({
    title: `住宅設備コラム（${page}ページ目）`,
    description: `横浜総合住設の住宅設備コラムの一覧です（${page}ページ目）。給湯器・エアコン・外壁塗装・リフォームなどの交換時期や選び方をまとめています。`,
    path: `/blog/page/${page}`,
  });
}

export default async function BlogPagedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const n = Number(page);
  if (!Number.isInteger(n) || n < 2 || n > pageCount(getAllPosts().length)) notFound();
  return <BlogIndexView page={n} />;
}
