import type { Metadata } from "next";
import { AboutSection } from "@/components/home/AboutSection";
import { FirstNote, Hero } from "@/components/home/Hero";
import { AreaSection, BlogSection, BusinessSection, CompanySection, FaqSection, FlowSection, InstagramSection } from "@/components/home/LocalSections";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WorksSection } from "@/components/home/WorksSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { keywordsFor } from "@/data/seo-keyword-map";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/**
 * トップページ
 * 役割：①何の会社か ②どんな工事ができるか ③実績 ④戸塚区を中心に対応していること ⑤信頼できる会社であること
 *       を伝え、⑥必要なサービスページへ送る。
 * 取りにいく検索語と検索意図は data/seo-keyword-map.ts に書く。
 * 書かないこと：個々の工事のくわしい説明（サービスページ）、地域のくわしい話（/area/totsuka）。
 *               トップですべてを説明し切ろうとしない。サービスの紹介は「事業内容」の1か所だけにし、同じ一覧を繰り返さない。
 * 問い合わせの案内は、ヘッダー・ページの最後・スマホ下部の固定ボタンだけ（冒頭や区画の途中には置かない）。
 */
export const metadata: Metadata = buildMetadata({
  // 社名から始める。「横浜市戸塚区の住宅設備・リフォーム」で始めると /area/totsuka の title と同じ文になり、同じ検索語を取り合うため
  title: `${siteConfig.shortName}｜横浜市戸塚区の住宅設備・リフォーム会社`,
  description:
    "横浜市戸塚区を中心に、給湯器・エコキュート・エアコン・トイレ・太陽光・蓄電池・外壁塗装・リフォーム・造園まで対応する株式会社 横浜総合住設。住まいの工事をまとめてご相談いただけます。見積もり・現地調査は無料です。",
  path: "/",
  keywords: keywordsFor("/"),
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <FirstNote />
      <ServicesSection />
      <WorksSection />
      <AboutSection />
      <AreaSection />
      <BusinessSection />
      <FlowSection />
      <InstagramSection />
      <BlogSection />
      <FaqSection />
      <CompanySection />
      <CtaBand />
    </>
  );
}
