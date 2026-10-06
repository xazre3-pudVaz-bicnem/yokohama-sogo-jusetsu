import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { JsonLd } from "@/components/seo/JsonLd";
import { services } from "@/data/services";
import { graph, organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/schema";
import { siteConfig, primaryPhone, telHref } from "@/lib/site";
import { SITE_URL, IS_PUBLIC } from "@/lib/seo";

/**
 * 書体の方針（スマホの表示速度を優先）
 * - 日本語は端末に入っている書体（ヒラギノ／游ゴシック／BIZ UDゴシックなど）をそのまま使う。
 *   日本語の Web フォントは 1 ページで数百 KB の読み込みになり、スマホの最初の描画を大きく遅らせるため使わない。
 * - 欧文・数字（ロゴの英字、電話番号、番号）だけ、ロゴの書体に近い Jost を next/font で読み込む（ラテン文字のみ・自前配信）。
 */
const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap" });

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title: {
    default: `横浜市戸塚区の住宅設備・リフォーム｜${siteConfig.name}`,
    template: "%s",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "住宅設備・リフォーム",
  robots: IS_PUBLIC ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { siteName: siteConfig.name, locale: "ja_JP", type: "website" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  // Search Console / Bing Webmaster Tools の所有権確認（環境変数に値があるときだけ出力する）
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020b24",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const phone = primaryPhone();
  return (
    <html lang="ja" data-scroll-behavior="smooth" className={jost.variable}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        >
          本文へ移動
        </a>
        <Header />
        {/*
          注意：ここで {children} を <Suspense> で囲まないこと。
          囲むと、静的生成した HTML で本文が <main> の外（<div hidden>）に回され、スクリプトで差し込む形になる。
          JS を実行しないクローラーから本文が見えなくなる。
        */}
        <main id="main">{children}</main>
        <Footer />
        <MobileCtaBar phone={phone} telHref={telHref(phone)} />
        <RevealObserver />
        <JsonLd data={graph(organizationSchema(), localBusinessSchema(services.map((s) => ({ name: s.name, slug: s.slug, summary: s.summary }))), websiteSchema())} />
      </body>
    </html>
  );
}
