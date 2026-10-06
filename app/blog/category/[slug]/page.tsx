import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndexView } from "@/components/blog/BlogIndexView";
import { activeClusters, getPostsByCluster, MIN_POSTS_TO_INDEX } from "@/lib/blog";
import { getCluster } from "@/lib/blog-clusters";
import { buildMetadata } from "@/lib/seo";

/**
 * コラムのカテゴリ別一覧（記事が1本以上あるカテゴリだけページを作る）。
 * 記事が3本に満たないカテゴリは、内容が薄いため検索結果に出さない（noindex。lib/blog.ts の MIN_POSTS_TO_INDEX）。
 * 2ページ目以降は page/[page]/page.tsx。
 */

export function generateStaticParams() {
  return activeClusters().map(({ cluster }) => ({ slug: cluster.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cluster = getCluster(slug);
  if (!cluster) return {};
  const count = getPostsByCluster(slug).length;
  return buildMetadata({
    title: `「${cluster.name}」のコラム一覧｜住宅設備コラム`,
    description: `${cluster.description}横浜市戸塚区の横浜総合住設が書く、住宅設備コラム「${cluster.name}」の記事一覧（${count}本）。`,
    path: `/blog/category/${slug}`,
    noindex: count < MIN_POSTS_TO_INDEX,
  });
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cluster = getCluster(slug);
  if (!cluster || getPostsByCluster(slug).length === 0) notFound();
  return <BlogIndexView page={1} cluster={cluster} />;
}
