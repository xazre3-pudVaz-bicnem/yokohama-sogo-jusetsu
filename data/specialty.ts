import type { BlogClusterId } from "@/data/services/types";
import { boilerSiteUrl, siteConfig, solarSiteUrl, type SpecialtySiteId } from "@/lib/site";

/**
 * 同じ会社が運営する専門サイト（lib/site.ts の specialtySites）との分担と、案内のリンク先。
 *   1. 給湯器専門サイト（boiler）… 下の「給湯器」
 *   2. 練馬区の太陽光発電・蓄電池のサイト（solarNerima）… 下の「太陽光発電・蓄電池」
 * 専門サイトに任せた題材は、このサイトのコラムの自動投稿では書かない（isHandedOverTopic）。
 */

/* ------------------------------------------------------------------ */
/* 給湯器                                                              */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* 太陽光発電・蓄電池                                                  */
/* ------------------------------------------------------------------ */
/**
 * 練馬区の太陽光発電・蓄電池のサイト（https://www.yokoju-solar.com）との分担と、案内のリンク先（2026-10-26）。
 *
 * 専門サイトが受け持つもの：東京都練馬区の戸建て住宅の太陽光発電・蓄電池（「練馬区 太陽光発電」「練馬区 蓄電池」など）と、
 *   太陽光発電・蓄電池の一般的な疑問（しくみ・屋根の向きと影・自家消費と売電・蓄電池の種類と容量・寿命・売電価格など）。
 *   一般的な疑問は、専門サイトの柱のページと自動投稿のコラムがすでに書いている。
 * このサイトが受け持つもの：戸塚区・横浜市の太陽光発電・蓄電池（「戸塚区 太陽光発電」「戸塚区 蓄電池」）、
 *   横浜市・神奈川県の制度、戸塚区の地形に関わる話、屋根塗装などのほかの工事とまとめて頼む相談。
 *
 * - 太陽光・蓄電池のサービスページ（SOLAR_SERVICES）は、いまの検索語のまま残す（地域が違うので取り合わない）。
 *   専門サイトの案内は、ページの上の方ではなく、戸塚区の話（local）のあとに出す（layout の specialty）。
 *   読み手は戸塚区・横浜市の方なので、冒頭に練馬区の案内を出すと迷わせるため（専門サイトの docs/CORPORATE_LINK.md の指摘）。
 * - コラムの自動投稿は、太陽光・蓄電池の一般的な題材を書かない（isSolarTopic）。横浜・神奈川・戸塚に限った題材は、このサイトで書く。
 * - 専門サイトの URL を変えるときは、ここと lib/site.ts の specialtySites だけを直す。
 * 背景：専門サイトのリポジトリ（c:\projects\yokohama-sogo-jusetsu-solar-nerima）の docs/CORPORATE_LINK.md（2026-10-26 の提案）。
 */

/** 専門サイトと分担する工事（このサイトのサービスの slug。このサイトは戸塚区・横浜市を受け持つ） */
export const SOLAR_SERVICES: readonly string[] = ["solar", "storage-battery"];

/** 太陽光・蓄電池のコラムのカテゴリ */
export const SOLAR_CLUSTERS: readonly BlogClusterId[] = ["solar", "storage-battery"];

/** 横浜市・神奈川県・戸塚区に限った話（このサイトで書く） */
const LOCAL_WORDS = /横浜|神奈川|戸塚/;

/** 題材（または記事）が、専門サイトの受け持ちか（太陽光・蓄電池のカテゴリで、横浜・神奈川・戸塚に限らない一般的な話） */
export function isSolarTopic(cluster: string, keyword: string): boolean {
  return (SOLAR_CLUSTERS as readonly string[]).includes(cluster) && !LOCAL_WORDS.test(keyword);
}

/** 専門サイトのページ（ラベルは専門サイトの見出しに合わせる。2026-10-26 に確認） */
export const SOLAR_PAGES = {
  top: { label: siteConfig.specialtySites.solarNerima.label, url: solarSiteUrl("/") },
  solar: { label: "練馬区の住宅用太陽光発電", url: solarSiteUrl("/solar") },
  battery: { label: "練馬区の家庭用蓄電池", url: solarSiteUrl("/battery") },
  solarBattery: { label: "太陽光と蓄電池を組み合わせる", url: solarSiteUrl("/solar-battery") },
  subsidy: { label: "練馬区・東京都の補助金（2026年度）", url: solarSiteUrl("/subsidy") },
  price: { label: "太陽光発電・蓄電池の費用", url: solarSiteUrl("/price") },
  flow: { label: "太陽光発電の設置までの流れ", url: solarSiteUrl("/flow") },
} satisfies Record<string, SpecialtyLink>;

/* ------------------------------------------------------------------ */
/* 共通                                                                */
/* ------------------------------------------------------------------ */
/** 題材（または記事）を受け持つ専門サイト（このサイトで書く題材なら null） */
export function specialtySiteForTopic(cluster: string, keyword: string): SpecialtySiteId | null {
  if (isBoilerTopic(cluster, keyword)) return "boiler";
  if (isSolarTopic(cluster, keyword)) return "solarNerima";
  return null;
}

/** 専門サイトに任せた題材か（このサイトのコラムの自動投稿では書かない） */
export function isHandedOverTopic(cluster: string, keyword: string): boolean {
  return specialtySiteForTopic(cluster, keyword) !== null;
}

/** 外部（専門サイト）の URL か。検索語の割り当て表で、検索語を譲った先として使う */
export function isSpecialtySiteUrl(url: string): boolean {
  return Object.values(siteConfig.specialtySites).some((s) => url === s.url || url.startsWith(`${s.url}/`));
}
