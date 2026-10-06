import type { IconName } from "@/components/ui/Icon";
import type { ImageKey } from "@/lib/images";

/** サービスの分類（トップページと一覧ページの並び） */
export type ServiceCategoryId = "equipment" | "energy" | "exterior" | "reform" | "site";

/** サービスごとの差し色（app/globals.css の --color-*） */
export type Accent = "brand" | "heat" | "leaf" | "sun" | "rose" | "violet" | "aqua";

/** コラムのカテゴリ（lib/blog-clusters.ts の id と同じ） */
export type BlogClusterId =
  | "water-heater"
  | "ecocute"
  | "ene-farm"
  | "eco-one"
  | "air-conditioner"
  | "toilet"
  | "kitchen"
  | "range-hood"
  | "exterior-painting"
  | "roof-painting"
  | "solar"
  | "storage-battery"
  | "reform"
  | "demolition"
  | "garden"
  | "housing-equipment"
  | "subsidy"
  | "yokohama"
  | "totsuka";

export type ServiceFaq = { q: string; a: string };

export type ServiceGuide = {
  /** ページ内リンク用の id */
  id: string;
  heading: string;
  intro?: string;
  items: { title: string; body: string }[];
};

export type ServiceTable = {
  caption: string;
  head: string[];
  rows: string[][];
  note?: string;
};

export type Service = {
  slug: string;
  category: ServiceCategoryId;
  /** ページ・カードに出す名称 */
  name: string;
  /** メニュー用の短い名称 */
  shortName: string;
  icon: IconName;
  accent: Accent;
  /** 主写真（イメージ写真）。実際の施工写真は施工事例のデータ側にある */
  image: ImageKey;
  imageAlt: string;
  /** 本文の途中に置く写真 */
  subImage?: ImageKey;
  subImageAlt?: string;
  /** カードの一言 */
  catch: string;
  /** 一覧ページの説明 */
  summary: string;
  seo: { title: string; description: string; keywords: string[] };
  h1: string;
  lead: string;
  /** 対応範囲についての注意書き（例：解体はリフォームに伴うものだけ） */
  scope?: string;
  /** こんなお悩みはありませんか */
  worries: string[];
  /** 対応している工事 */
  menu: { title: string; body: string }[];
  /** 選び方・交換時期などの解説（2〜3区画） */
  guides: ServiceGuide[];
  table?: ServiceTable;
  /** 費用の考え方（金額は書かない。何で変わるかを説明する） */
  cost: { intro: string; factors: { title: string; body: string }[] };
  /** スタッフからのひとこと（人物イラストつき） */
  staffTip: { pose: ImageKey; text: string };
  /** 戸塚区・横浜市でこの工事を頼むときの話（このページだけの内容） */
  local: { heading: string; body: string[] };
  faqs: ServiceFaq[];
  /** 関連サービスのスラッグ */
  related: string[];
  /** 関連コラムのカテゴリ */
  blogClusters: BlogClusterId[];
  /** 関連する補助金（data/subsidies.ts の id） */
  subsidyIds?: string[];
  /**
   * 将来つくる専門サイト。URL を入れると、ページに「専門サイトを見る」の案内が出る。
   * 公式サイトは会社全体・施工実績・信頼性を担い、専門サイトは分野を深掘りする（同じ文章を載せない）。
   */
  specialtySite: { name: string; url: string; note: string } | null;
};

export type ServiceCategory = {
  id: ServiceCategoryId;
  name: string;
  /** 分類の一言 */
  description: string;
};
