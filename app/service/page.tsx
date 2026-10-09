import type { Metadata } from "next";
import { ServiceThumbRow } from "@/components/cards/ServiceCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { FieldNote } from "@/components/ui/FieldNote";
import { PageHero } from "@/components/ui/PageHero";
import { mainServices, serviceCategories, servicePath, servicesByCategory } from "@/data/services";
import { reveal } from "@/lib/reveal";
import { itemListSchema } from "@/lib/schema";
import { keywordsFor } from "@/data/seo-keyword-map";
import { buildMetadata } from "@/lib/seo";

/**
 * 事業内容一覧
 * 役割：「この会社は何ができるのか」を分類ごとに見せ、各サービスページへ送る。
 * 取りにいく検索語と検索意図は data/seo-keyword-map.ts に書く。
 * 書かないこと：個々の工事のくわしい説明（各サービスページに任せる）。
 * 見せ方：分類名を左、サービスを右に、細い線で区切った行で並べる（カードにしない）。
 */
export const metadata: Metadata = buildMetadata({
  title: "事業内容・サービス一覧｜住宅設備からリフォームまで",
  description: `横浜総合住設の事業内容です。給湯器・エアコン・トイレなどの住宅設備、太陽光発電・蓄電池、外壁塗装、住宅リフォーム、造園・解体まで、${mainServices.length}のサービスを${serviceCategories.length}つの分野に分けてご案内します。横浜市戸塚区を中心に対応しています。`,
  path: "/service",
  keywords: keywordsFor("/service"),
});

export default function ServiceIndexPage() {
  return (
    <>
      <PageHero
        illust="illust/people-staff-woman"
        title="事業内容・サービス一覧"
        lead={`横浜総合住設は、住まいに関わる工事を幅広くお引き受けしています。毎日使う設備の交換から、家の外まわりの手入れまで、${serviceCategories.length}つの分野・${mainServices.length}のサービスがあります。`}
        crumbs={[{ name: "サービス", href: "/service" }]}
      >
        <ul className="mt-7 flex flex-wrap gap-2">
          {serviceCategories.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className="chip">
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      <div className="section bg-white">
        <div className="container-x space-y-14 lg:space-y-20">
          {serviceCategories.map((cat) => {
            const list = servicesByCategory(cat.id);
            return (
              <section key={cat.id} aria-labelledby={cat.id} className="grid scroll-mt-28 gap-x-12 gap-y-5 lg:grid-cols-12">
                <div className="lg:col-span-3" {...reveal()}>
                  <h2 id={cat.id} className="h-section">
                    {cat.name}
                  </h2>
                  <p className="mt-3 text-[0.9375rem] leading-[1.95]">{cat.description}</p>
                </div>
                <ul className="space-y-3 lg:col-span-9" {...reveal(60)}>
                  {list.map((s) => (
                    <li key={s.slug}>
                      <ServiceThumbRow service={s} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <FieldNote label="どのサービスに当てはまるか分からない場合" className="max-w-3xl">
            困っていることを、そのままお知らせください。複数の工事にまたがるご相談も、ひとつの窓口でお受けします。
          </FieldNote>
        </div>
      </div>

      <CtaBand id="cta-service" />
      <JsonLd data={itemListSchema("横浜総合住設のサービス", mainServices.map((s) => ({ name: s.name, href: servicePath(s) })))} />
    </>
  );
}
