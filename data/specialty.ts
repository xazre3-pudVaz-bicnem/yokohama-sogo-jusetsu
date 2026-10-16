import type { BlogClusterId } from "@/data/services/types";
import { boilerSiteUrl, siteConfig } from "@/lib/site";

/**
 * 給湯器専門サイト（https://www.yokoju-boiler.com）との分担と、案内のリンク先。
 *
 * 専門サイトが受け持つもの：給湯器（ガス給湯器・エコジョーズ・エコキュート・ハイブリッド給湯器・エネファームからの交換）の
 *   機種・価格の考え方・補助金・故障の症状・地域ごとの給湯器の案内（「戸塚区 給湯器交換」など）。
 * このサイトが受け持つもの：会社全体の紹介・給湯器以外の工事・給湯器と「ほかの工事」をまとめて頼む相談。
 *
 * - 給湯器のサービスページ（BOILER_SERVICES）は残し、ページの上の方に専門サイトの案内を出す（data/services/*.ts の specialtySite）。
 *   主な検索語は「横浜総合住設 給湯器」のように会社名つきにし、地域＋給湯器の検索語は専門サイトに譲る（data/seo-keyword-map.ts の cedes）。
 * - コラムの自動投稿は、給湯器の題材を書かない（専門サイトの自動投稿が書く。isBoilerTopic）。
 *   公開済みの給湯器の記事は残し、末尾に専門サイトのくわしいページの案内を出す（boilerLinkForPost）。
 * - 専門サイトの URL を変えるときは、ここと lib/site.ts の specialtySites だけを直す。
 * 背景：専門サイトのリポジトリの docs/CORPORATE_SITE_LINKS.md（2026-10-14 の提案）。
 */

/** 専門サイトが受け持つ工事（このサイトのサービスの slug） */
export const BOILER_SERVICES: readonly string[] = ["water-heater", "ecocute", "ene-farm", "eco-one"];

/** 専門サイトが受け持つコラムのカテゴリ */
export const BOILER_CLUSTERS: readonly BlogClusterId[] = ["water-heater", "ecocute", "ene-farm", "eco-one"];

/** 給湯器の話かどうかを見分ける語 */
const BOILER_WORDS = /給湯|エコキュート|エコジョーズ|エネファーム|ECO\s?ONE|エコワン|ハイブリッド給湯/i;

/** 題材（または記事）が、専門サイトの受け持ちか（カテゴリが給湯器まわり、または主キーワードに給湯器の語がある） */
export function isBoilerTopic(cluster: string, keyword: string): boolean {
  return (BOILER_CLUSTERS as readonly string[]).includes(cluster) || BOILER_WORDS.test(keyword);
}

export type SpecialtyLink = { label: string; url: string };

/** 専門サイトのページ（ラベルは専門サイトの見出しに合わせる。2026-10-16 に確認） */
export const BOILER_PAGES = {
  top: { label: siteConfig.specialtySites.boiler.label, url: boilerSiteUrl("/") },
  gas: { label: "ガス給湯器の交換", url: boilerSiteUrl("/gas-water-heater") },
  ecoJozu: { label: "エコジョーズの交換", url: boilerSiteUrl("/eco-jozu") },
  ecocute: { label: "エコキュートの交換", url: boilerSiteUrl("/ecocute") },
  hybrid: { label: "ハイブリッド給湯器（ECO ONE）", url: boilerSiteUrl("/hybrid") },
  eneFarm: { label: "エネファームから替えるとき", url: boilerSiteUrl("/ene-farm") },
  capacity: { label: "給湯器の号数の選び方", url: boilerSiteUrl("/guide/capacity") },
  timing: { label: "給湯器の交換時期の目安", url: boilerSiteUrl("/guide/timing") },
  subsidy: { label: "給湯器の補助金", url: boilerSiteUrl("/subsidy") },
  subsidyKyutou: { label: "給湯省エネ2026事業", url: boilerSiteUrl("/subsidy/kyutou-shoene-2026") },
  subsidyEcocute: { label: "エコキュートの補助金", url: boilerSiteUrl("/subsidy/ecocute") },
  subsidyEneFarm: { label: "エネファームから交換するときの補助金", url: boilerSiteUrl("/subsidy/ene-farm") },
  subsidyEcoOne: { label: "ECO ONE の補助金", url: boilerSiteUrl("/subsidy/eco-one") },
  totsuka: { label: "戸塚区の給湯器交換", url: boilerSiteUrl("/area/totsuka") },
  yokohama: { label: "横浜市の給湯器交換", url: boilerSiteUrl("/area/yokohama") },
  photo: { label: "写真でかんたん見積もり", url: boilerSiteUrl("/contact/photo") },
  products: { label: "給湯器を条件から探す", url: boilerSiteUrl("/products") },
} satisfies Record<string, SpecialtyLink>;

/** 公開済みの記事ごとの、専門サイトのくわしいページ */
const POST_LINKS: Record<string, SpecialtyLink> = {
  "water-heater-capacity-guide": BOILER_PAGES.capacity,
  "water-heater-replacement-signs": BOILER_PAGES.timing,
  "kyutou-shoene-2026-outline": BOILER_PAGES.subsidyKyutou,
  "ecojozu-drain-water-yokohama": BOILER_PAGES.ecoJozu,
  "ecocute-tank-capacity-choice": BOILER_PAGES.ecocute,
  "ene-farm-replacement-checkpoints": BOILER_PAGES.eneFarm,
  "totsuka-ecocute-carry-in-route": BOILER_PAGES.totsuka,
};

/** カテゴリごとの既定（記事ごとの指定が無いとき） */
const CLUSTER_LINKS: Partial<Record<BlogClusterId, SpecialtyLink>> = {
  "water-heater": BOILER_PAGES.gas,
  ecocute: BOILER_PAGES.ecocute,
  "ene-farm": BOILER_PAGES.eneFarm,
  "eco-one": BOILER_PAGES.hybrid,
};

/** 記事の末尾に出す、専門サイトのくわしいページ（給湯器の記事でなければ null） */
export function boilerLinkForPost(p: { slug: string; category: string; keywords: string[] }): SpecialtyLink | null {
  if (POST_LINKS[p.slug]) return POST_LINKS[p.slug];
  if (!isBoilerTopic(p.category, p.keywords[0] ?? "")) return null;
  return CLUSTER_LINKS[p.category as BlogClusterId] ?? BOILER_PAGES.top;
}

/** 地域ページの給湯器の項目から案内する、専門サイトの地域のページ */
export function boilerLinkForArea(areaSlug: string): SpecialtyLink | null {
  if (areaSlug === "totsuka") return BOILER_PAGES.totsuka;
  if (areaSlug === "yokohama") return BOILER_PAGES.yokohama;
  return null;
}

/** 外部（専門サイト）の URL か。検索語の割り当て表で、検索語を譲った先として使う */
export function isSpecialtySiteUrl(url: string): boolean {
  return Object.values(siteConfig.specialtySites).some((s) => url === s.url || url.startsWith(`${s.url}/`));
}
