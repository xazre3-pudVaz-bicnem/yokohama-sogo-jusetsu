import type { Metadata } from "next";
import { ServicePhotoCard } from "@/components/cards/ServiceCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { StaffTip } from "@/components/ui/StaffTip";
import { serviceCategories, servicesByCategory, services } from "@/data/services";
import { reveal } from "@/lib/reveal";
import { itemListSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/**
 * 事業内容一覧
 * 役割：「この会社は何ができるのか」を分類ごとに見せ、各サービスページへ送る。
 * 担当する検索意図：横浜総合住設 事業内容／戸塚区 住宅設備 会社／住宅設備 工事 一覧
 * 書かないこと：個々の工事のくわしい説明（各サービスページに任せる）。
 */
export const metadata: Metadata = buildMetadata({
  title: "事業内容・サービス一覧｜住宅設備からリフォームまで",
  description:
    "横浜総合住設の事業内容です。給湯器・エアコン・トイレなどの住宅設備、太陽光発電・蓄電池、外壁塗装、住宅リフォーム、造園・解体まで、13のサービスを5つの分野に分けてご案内します。横浜市戸塚区を中心に対応しています。",
  path: "/service",
  keywords: ["横浜総合住設 事業内容", "戸塚区 住宅設備", "住宅設備 工事", "横浜 リフォーム 会社"],
});

export default function ServiceIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="事業内容"
        title={
          <>
            <span className="ib">住宅設備から、</span>
            <span className="ib">リフォーム・外まわりまで。</span>
          </>
        }
        lead="横浜総合住設は、住まいに関わる工事を幅広くお引き受けしています。毎日使う設備の交換から、家の外まわりの手入れまで、5つの分野・13のサービスをご用意しています。"
        crumbs={[{ name: "サービス", href: "/service" }]}
      >
        <ul className="mt-7 flex flex-wrap gap-2 text-[0.8125rem] font-bold">
          {serviceCategories.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/30 bg-white/5 px-4 transition-colors hover:bg-white hover:text-navy-900">
                <Icon name="chevronDown" className="size-3.5" />
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      {serviceCategories.map((cat, ci) => {
        const list = servicesByCategory(cat.id);
        return (
          <section key={cat.id} aria-labelledby={cat.id} className={`${ci > 0 ? "cv" : ""} section ${ci % 2 === 0 ? "bg-white" : "bg-silver-50"}`}>
            <div className="container-x">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between" {...reveal()}>
                <div>
                  <p className="num text-sm font-semibold tracking-[0.2em] text-brand-600">
                    {String(ci + 1).padStart(2, "0")} <span className="text-silver-400">/ {String(serviceCategories.length).padStart(2, "0")}</span>
                  </p>
                  <h2 id={cat.id} className="h-section mt-1">
                    {cat.name}
                  </h2>
                </div>
                <p className="max-w-xl text-[0.9375rem] leading-[1.9] lg:text-right">{cat.description}</p>
              </div>
              <ul className={`mt-9 grid gap-5 sm:grid-cols-2 ${list.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
                {list.map((s, i) => (
                  <li key={s.slug} {...reveal((i % 3) * 80)}>
                    <ServicePhotoCard service={s} sizes={list.length >= 3 ? "(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw" : "(min-width: 640px) 46vw, 100vw"} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <section aria-label="ご相談の前に" className="cv section-tight bg-white">
        <div className="container-narrow">
          <StaffTip pose="illust/people-staff-point">
            どのサービスに当てはまるか分からないときは、「こんなことで困っている」とそのままお伝えください。複数の工事にまたがるご相談も、ひとつの窓口でお受けします。
          </StaffTip>
        </div>
      </section>

      <CtaBand id="cta-service" />
      <JsonLd data={itemListSchema("横浜総合住設のサービス", services.map((s) => ({ name: s.name, href: `/service/${s.slug}` })))} />
    </>
  );
}
