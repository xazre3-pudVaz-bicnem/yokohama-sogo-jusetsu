import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BrandMessageSection, StrengthsSection } from "@/components/home/BrandSections";
import { WorksSection, EquipmentSection, EnergySection, RenovationSection } from "@/components/home/ShowcaseSections";
import { AreaSection, BusinessSection, FlowSection, InstagramSection, BlogSection, FaqSection, CompanySection } from "@/components/home/LocalSections";
import { CtaBand } from "@/components/sections/CtaBand";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/**
 * トップページ
 * 役割：会社とサービス全体の理解（何の会社か・どこで対応しているか・何ができるか）と、各ページへの入口。
 * 担当する検索意図：横浜市戸塚区 住宅設備／戸塚区 住宅設備／戸塚区 リフォーム／横浜総合住設（指名）
 * 書かないこと：個々の工事のくわしい説明（サービスページ）、地域のくわしい話（/area/totsuka）。
 *               ここでは要点と入口だけを置き、文字数を増やすための説明はしない。
 */
export const metadata: Metadata = buildMetadata({
  title: `横浜市戸塚区の住宅設備・リフォーム｜${siteConfig.name}`,
  description:
    "横浜市戸塚区を中心に、給湯器・エコキュート・エアコン・トイレ・太陽光・蓄電池・外壁塗装・リフォーム・造園まで対応する株式会社 横浜総合住設。住まいの工事をまとめてご相談いただけます。見積もり・現地調査は無料です。",
  path: "/",
  keywords: ["横浜市戸塚区 住宅設備", "戸塚区 住宅設備", "戸塚区 リフォーム", "戸塚区 給湯器", "戸塚区 エアコン工事", "横浜総合住設"],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <BrandMessageSection />
      <StrengthsSection />
      <WorksSection />
      <EquipmentSection />
      <EnergySection />
      <RenovationSection />
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
