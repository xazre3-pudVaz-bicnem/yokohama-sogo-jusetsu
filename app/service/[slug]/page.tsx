import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageView, serviceMetadata } from "@/components/service/ServicePageView";
import { getService, mainServices } from "@/data/services";

/**
 * サービスの詳細ページ（親を持たないサービス。data/services/*.ts の1件が1ページになる）。
 * 中身は components/service/ServicePageView.tsx。親を持つサービスは [sub]/page.tsx。
 */
export function generateStaticParams() {
  return mainServices.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  return s && !s.parent ? serviceMetadata(s) : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s || s.parent) notFound();
  return <ServicePageView service={s} />;
}
