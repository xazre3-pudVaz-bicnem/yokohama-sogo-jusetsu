import Link from "next/link";
import { CategoryNav, Pagination, PostGrid } from "@/components/blog/BlogList";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { activeClusters, getAllPosts, getPostsByCluster, pageCount, paginate } from "@/lib/blog";
import type { BlogCluster } from "@/lib/blog-clusters";
import { itemListSchema } from "@/lib/schema";

/**
 * コラムの一覧（全体／カテゴリ別）。1ページ目と2ページ目以降で同じ見た目を使う。
 * カテゴリ別の一覧では、そのカテゴリの親ページ（サービスページ・地域ページ）への入口を必ず置く。
 */
export function BlogIndexView({ page, cluster }: { page: number; cluster?: BlogCluster }) {
  const all = cluster ? getPostsByCluster(cluster.id) : getAllPosts();
  const total = pageCount(all.length);
  const posts = paginate(all, page);
  const basePath = cluster ? `/blog/category/${cluster.id}` : "/blog";
  const crumbs = [{ name: "住宅設備コラム", href: "/blog" }, ...(cluster ? [{ name: cluster.name, href: basePath }] : [])];
  const pageNote = page > 1 ? <span className="ml-3 text-[0.55em] font-bold text-ink-mute">{page}ページ目</span> : null;

  return (
    <>
      <PageHero
        eyebrow={cluster ? "住宅設備コラム" : undefined}
        title={
          cluster ? (
            <>
              「{cluster.name}」のコラム{pageNote}
            </>
          ) : (
            <>
              住宅設備コラム{pageNote}
            </>
          )
        }
        lead={cluster ? cluster.description : "交換の時期、機種の選び方、費用の考え方など、住宅設備の工事を頼む前に確認しておきたいことを、設備ごと・地域ごとにまとめています。"}
        crumbs={crumbs}
      >
        {cluster && (
          <p className="mt-6">
            <Link href={cluster.pillar.href} className="link-arrow">
              {cluster.pillar.label}
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </p>
        )}
      </PageHero>

      <section aria-label="コラムの一覧" className="section bg-white">
        <div className="container-x">
          <CategoryNav clusters={activeClusters()} current={cluster?.id} />
          <div className="mt-10 lg:mt-12">
            <PostGrid posts={posts} />
          </div>
          <Pagination current={page} total={total} basePath={basePath} />
        </div>
      </section>

      <CtaBand id="cta-blog" />
      <JsonLd data={itemListSchema(cluster ? `${cluster.name}のコラム` : "住宅設備コラム", posts.map((p) => ({ name: p.title, href: `/blog/${p.slug}` })))} />
    </>
  );
}
