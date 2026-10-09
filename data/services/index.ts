import type { Service, ServiceCategory, ServiceCategoryId } from "./types";
import { waterHeater } from "./water-heater";
import { ecocute } from "./ecocute";
import { eneFarm } from "./ene-farm";
import { ecoOne } from "./eco-one";
import { toilet } from "./toilet";
import { airConditioner } from "./air-conditioner";
import { exteriorPainting } from "./exterior-painting";
import { roofPainting } from "./roof-painting";
import { solar } from "./solar";
import { storageBattery } from "./storage-battery";
import { kitchenEquipment } from "./kitchen-equipment";
import { reform } from "./reform";
import { demolition } from "./demolition";
import { garden } from "./garden";
import { other } from "./other";

export type { Service, ServiceCategory, ServiceCategoryId, BlogClusterId, ServiceFaq } from "./types";

/**
 * サービスの一覧（この並びが、メニュー・一覧ページ・サイトマップの順番になる）。
 * サービスを増やすときは、data/services/ に1ファイル足して、ここに1行加える。
 * ページ・メニュー・サイトマップ・構造化データ・お問い合わせの選択肢に自動で反映される。
 *
 * ページを増やす前に、data/seo-keyword-map.ts に「そのページで取りにいく検索語」を1行足すこと。
 * すでにほかのページが担当している検索語のページは作らない（npm run seo:audit が重複を知らせる）。
 *
 * 親を持つサービス（parent を書いたもの）は、/service/<親>/<slug> のページになり、親のページから案内される。
 * メニューと一覧には、親を持たないサービス（mainServices）だけが並ぶ。
 */
export const services: Service[] = [
  waterHeater,
  ecocute,
  eneFarm,
  ecoOne,
  toilet,
  airConditioner,
  exteriorPainting,
  roofPainting,
  solar,
  storageBattery,
  kitchenEquipment,
  reform,
  demolition,
  garden,
  other,
];

/** 分類（「この会社は何屋なのか」が一目で分かるよう、5つにまとめる） */
export const serviceCategories: ServiceCategory[] = [
  { id: "equipment", name: "住宅設備", description: "給湯器・エアコン・トイレ・キッチンの機器。毎日使う設備の交換と修理。" },
  { id: "energy", name: "省エネ・創エネ設備", description: "太陽光発電・蓄電池・ハイブリッド給湯器。光熱費と停電への備え。" },
  { id: "exterior", name: "外装", description: "外壁・屋根の塗り替えと防水。住まいを雨と紫外線から守る工事。" },
  { id: "reform", name: "リフォーム", description: "水まわりから内装まで。解体・設備・仕上げを一貫して。" },
  { id: "site", name: "外構・解体", description: "庭木の手入れ、ウッドデッキ、リフォームに伴う解体工事。" },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** 親を持たないサービス（メニュー・一覧に並べるもの） */
export const mainServices: Service[] = services.filter((s) => !s.parent);

/** そのサービスの下のページ（親が parentSlug のもの） */
export function childServices(parentSlug: string): Service[] {
  return services.filter((s) => s.parent === parentSlug);
}

/**
 * サービスページの URL。サイトの中でサービスページへリンクするときは、必ずこの関数を通す
 * （親を持つサービスは /service/<親>/<slug> になるため、URL を直接組み立てない）。
 */
export function servicePath(service: Service | string): string {
  const s = typeof service === "string" ? getService(service) : service;
  if (!s) return "/service";
  return s.parent ? `/service/${s.parent}/${s.slug}` : `/service/${s.slug}`;
}

export function servicesByCategory(id: ServiceCategoryId): Service[] {
  return mainServices.filter((s) => s.category === id);
}

export function categoryOf(service: Service): ServiceCategory {
  return serviceCategories.find((c) => c.id === service.category)!;
}

/** お問い合わせフォームの「相談したい工事」の選択肢 */
export const inquiryTopics: string[] = [...mainServices.map((s) => s.name), "複数の工事をまとめて相談したい", "法人・工務店からの依頼", "その他・まだ決まっていない"];

// スラッグの重複と、親の指定の誤りは、ビルドの時点で止める（URL が食い違ったまま公開しないため）
{
  const seen = new Set<string>();
  for (const s of services) {
    if (seen.has(s.slug)) throw new Error(`[services] slug が重複しています：${s.slug}`);
    seen.add(s.slug);
    if (s.parent) {
      const p = services.find((x) => x.slug === s.parent);
      if (!p) throw new Error(`[services] ${s.slug} の parent（${s.parent}）というサービスはありません`);
      if (p.parent) throw new Error(`[services] ${s.slug} の parent（${s.parent}）は、すでに別のサービスの下にあります（2段まで）`);
    }
  }
}
