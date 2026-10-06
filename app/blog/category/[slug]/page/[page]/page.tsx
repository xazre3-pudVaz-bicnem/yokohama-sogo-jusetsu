import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndexView } from "@/components/blog/BlogIndexView";
import { activeClusters, getPostsByCluster, pageCount } from "@/lib/blog";
import { getCluster } from "@/lib/blog-clusters";
import { buildMetadata } from "@/lib/seo";

/** コラムのカテゴリ別一覧（2ページ目以降）。記事が13本以上あるカテゴリにだけページができる */
export function generateStaticParams() {
  return activeClusters().flatMap(({ cluster, count }) => Array.from({ length: Math.max(0, pageCount(count) - 1) }, (_, i) => ({ slug: cluster.id, page: String(i + 2) })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string; page: string }> }): Promise<Metadata> {
  const { slug, page } = await params;
  const cluster = getCluster(slug);
  if (!cluster) return {};
  return buildMetadata({
    title: `「${cluster.name}」のコラム一覧（${page}ページ目）`,
    description: `${cluster.description}横浜市戸塚区の横浜総合住設が書く、住宅設備コラム「${cluster.name}」の記事一覧の${page}ページ目。`,
    path: `/blog/category/${slug}/page/${page}`,
  });
}

export default async function BlogCategoryPagedPage({ params }: { params: Promise<{ slug: string; page: string }> }) {
  const { slug, page } = await params;
  const cluster = getCluster(slug);
  const n = Number(page);
  if (!cluster || !Number.isInteger(n) || n < 2 || n > pageCount(getPostsByCluster(slug).length)) notFound();
  return <BlogIndexView page={n} cluster={cluster} />;
}
