import type { ImageKey } from "@/lib/images";

/** サービスの分類（トップページと一覧ページの並び） */
export type ServiceCategoryId = "equipment" | "energy" | "exterior" | "reform" | "site";

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
  /** 内容が一目で分かる見出し（「交換時期の目安」「施工工程」など。キャッチコピーにしない） */
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

/** 本文に置く写真。caption を書かない写真は「イメージ」と表示される（当社の現場の写真には、その旨を caption に書く） */
export type BlockPhoto = { image: ImageKey; alt: string; caption?: string };

/**
 * ページ本文の区画。サービスごとに、置く順番と見せ方（variant）を決める。
 *
 * すべてのサービスを同じ順番・同じ見せ方にしないこと（どのページも同じ型に見えるため）。
 * 給湯器は交換の判断と機種の比較、外壁塗装は劣化の症状と工程、解体は対応範囲と事前の確認、というように、
 * その工事で読む人がまず知りたいことを先頭に置く。
 * 「よくある質問」「関連コラム」「関連するサービス」は、どのページでも最後に出る（ここには書かない）。
 */
export type ServiceBlock =
  /** 相談のきっかけ・症状の一覧（worries）。見出しはサービスごとに自然な言葉にする */
  | { type: "signs"; heading: string; lead?: string }
  /**
   * 対応工事（menu）
   *   rows    … 見出しを左、工事名と説明の行を右に
   *   photo   … 写真を横に置く（写真は subImage）
   *   columns … 2〜3列に並べる
   */
  | { type: "menu"; heading: string; variant: "rows" | "photo" | "columns" }
  /**
   * 解説（guides のうち id が一致する1件）
   *   columns … 項目を横に並べる（種類の違い・症状など、並べて比べるもの）
   *   rows    … 見出しを左、項目の行を右に（確認事項など）
   *   steps   … 番号つきの手順（順番のある工程だけ。順番の無い項目には使わない）
   *   photo   … 写真を横に置く
   * table: true で、比較表（table）をこの区画の下に出す。
   * signs: true で、相談のきっかけ（worries）をこの区画の中に添える（内容が重なるので、別の区画にしないとき）。
   */
  | { type: "guide"; id: string; variant: "columns" | "rows" | "steps" | "photo"; photos?: BlockPhoto[]; table?: boolean; signs?: boolean }
  /** 対応範囲の注記（scope） */
  | { type: "scope"; heading: string }
  /** 当社の施工現場の写真 */
  | { type: "photos"; heading: string; lead?: string; photos: BlockPhoto[] }
  /** 現場の実務にもとづく補足（note） */
  | { type: "note" }
  /** 費用の考え方（cost） */
  | { type: "cost" }
  /** 補助金・支援制度（subsidyIds） */
  | { type: "subsidy" }
  /** このサービスの施工事例（data/works.ts）。事例が無いサービスでは何も出ない */
  | { type: "works" }
  /** 戸塚区・横浜市での工事（local） */
  | { type: "local" };

export type Service = {
  slug: string;
  category: ServiceCategoryId;
  /** ページ・一覧に出す名称 */
  name: string;
  /** メニュー用の短い名称 */
  shortName: string;
  /** 主写真（イメージ写真）。実際の施工写真は施工事例のデータ側にある */
  image: ImageKey;
  imageAlt: string;
  /**
   * 冒頭の写真の置き方。省略すると、見出しの下に横長で大きく出す。
   * "side" は見出しの横に置く（当社の現場の写真や、縦長の写真に向く）。
   */
  heroLayout?: "wide" | "side";
  /** 冒頭の写真の説明（当社の現場の写真のときに書く。イメージ写真には書かない） */
  imageCaption?: string;
  /** 本文の途中に置く写真 */
  subImage?: ImageKey;
  subImageAlt?: string;
  /** 一覧に添える一言（工事の内容をそのまま書く。キャッチコピーにしない） */
  catch: string;
  /** 一覧ページの説明 */
  summary: string;
  seo: { title: string; description: string; keywords: string[] };
  h1: string;
  lead: string;
  /** 対応範囲についての注意書き（例：解体はリフォームに伴うものだけ） */
  scope?: string;
  /** 相談のきっかけ・症状 */
  worries: string[];
  /** 対応している工事 */
  menu: { title: string; body: string }[];
  /** 選び方・交換時期・工程などの解説 */
  guides: ServiceGuide[];
  table?: ServiceTable;
  /** 費用の考え方（金額は書かない。何で変わるかを説明する） */
  cost: { intro: string; factors: { title: string; body: string }[] };
  /**
   * 現場の実務にもとづく補足。label は内容が分かる見出しにする
   * （「お問い合わせの前にご用意いただくとよいもの」「施工前に確認すること」など）。
   */
  note: { label: string; text: string };
  /** 戸塚区・横浜市でこの工事を頼むときの話（このページだけの内容） */
  local: { heading: string; body: string[] };
  faqs: ServiceFaq[];
  /** 本文の区画の順番と見せ方 */
  layout: ServiceBlock[];
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
