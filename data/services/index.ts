import type { Service, ServiceCategory, ServiceCategoryId } from "./types";
import { waterHeater } from "./water-heater";
import { eneFarm } from "./ene-farm";
import { ecoOne } from "./eco-one";
import { toilet } from "./toilet";
import { airConditioner } from "./air-conditioner";
import { exteriorPainting } from "./exterior-painting";
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
 * ページ（/service/[slug]）・メニュー・サイトマップ・構造化データ・お問い合わせの選択肢に自動で反映される。
 */
export const services: Service[] = [
  waterHeater,
  eneFarm,
  ecoOne,
  toilet,
  airConditioner,
  exteriorPainting,
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

export function servicesByCategory(id: ServiceCategoryId): Service[] {
  return services.filter((s) => s.category === id);
}

export function categoryOf(service: Service): ServiceCategory {
  return serviceCategories.find((c) => c.id === service.category)!;
}

/** お問い合わせフォームの「相談したい工事」の選択肢 */
export const inquiryTopics: string[] = [...services.map((s) => s.name), "複数の工事をまとめて相談したい", "法人・工務店からの依頼", "その他・まだ決まっていない"];
