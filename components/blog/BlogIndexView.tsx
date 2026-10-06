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

  return (
    <>
      <PageHero
        eyebrow={cluster ? "住宅設備コラム" : "住宅設備コラム"}
        title={
          cluster ? (
            <>
              「{cluster.name}」のコラム{page > 1 && <span className="ml-3 text-[0.6em] font-bold text-silver-300">{page}ページ目</span>}
            </>
          ) : (
            <>
              <span className="ib">交換の時期、選び方、</span>
              <span className="ib">費用の考え方。</span>
              {page > 1 && <span className="ml-3 text-[0.6em] font-bold text-silver-300">{page}ページ目</span>}
            </>
          )
        }
        lead={cluster ? cluster.description : "「いつ替えるべきか」「何を基準に選ぶか」。住宅設備の工事を頼む前に知っておきたいことを、設備ごと・地域ごとにまとめています。"}
        crumbs={crumbs}
      >
        {cluster && (
          <Link href={cluster.pillar.href} className="link-arrow link-arrow-on-dark mt-5">
            {cluster.pillar.label}のページを見る
            <Icon name="arrowRight" className="size-4" />
          </Link>
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
