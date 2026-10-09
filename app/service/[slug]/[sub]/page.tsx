import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageView, serviceMetadata } from "@/components/service/ServicePageView";
import { getService, services } from "@/data/services";

/**
 * 親を持つサービスのページ（/service/<親>/<slug>。例：/service/reform/kitchen）。
 * data/services/ のファイルに parent を書いたサービスが、ここに出る。中身は親を持たないサービスと同じ。
 *
 * ページを足す条件（docs/SEO_ROADMAP.md）：そのページだけで検索した人の疑問に答えられる内容
 * （対応範囲・当社の施工写真・工程・費用の考え方）がそろったものだけ。情報が足りないうちは作らない。
 */
export function generateStaticParams() {
  return services.filter((s) => s.parent).map((s) => ({ slug: s.parent as string, sub: s.slug }));
}

export const dynamicParams = false;

function find(slug: string, sub: string) {
  const s = getService(sub);
  return s && s.parent === slug ? s : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; sub: string }> }): Promise<Metadata> {
  const { slug, sub } = await params;
  const s = find(slug, sub);
  return s ? serviceMetadata(s) : {};
}

export default async function SubServicePage({ params }: { params: Promise<{ slug: string; sub: string }> }) {
  const { slug, sub } = await params;
  const s = find(slug, sub);
  if (!s) notFound();
  return <ServicePageView service={s} />;
}
