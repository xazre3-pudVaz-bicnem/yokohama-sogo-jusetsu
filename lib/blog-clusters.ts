import type { BlogClusterId } from "@/data/services/types";
import type { ImageKey } from "@/lib/images";

/**
 * コラムのカテゴリ（SEO クラスタ）。
 *
 * 記事は必ずどれか1つのクラスタに属し、そのクラスタの「親ページ」（サービスページか地域ページ）へリンクする。
 * 親ページ側は、同じクラスタの記事を「関連コラム」として一覧にする。これで
 *   サービスページ ⇄ コラム ⇄ 施工事例 ⇄ 地域ページ
 * が相互につながる（トピッククラスター）。
 *
 * クラスタを増やすときは、data/services/types.ts の BlogClusterId にも id を足す。
 * このファイルはクライアント側からも読めるよう、fs を使わない。
 */
export type BlogCluster = {
  id: BlogClusterId;
  name: string;
  /** カテゴリページの説明 */
  description: string;
  /** 親ページ（このクラスタの記事が必ずリンクするページ） */
  pillar: { href: string; label: string };
  /** 記事の既定のカバー写真 */
  image: ImageKey;
  imageAlt: string;
};

export const blogClusters: BlogCluster[] = [
  {
    id: "water-heater",
    name: "給湯器",
    description: "ガス給湯器の交換時期、故障のサイン、号数や機能の選び方など、給湯器まわりの疑問に答えます。",
    pillar: { href: "/service/water-heater", label: "給湯器・エコキュート" },
    image: "photos/gas-water-heater-side",
    imageAlt: "住宅の外壁に取り付けたガス給湯器",
  },
  {
    id: "ecocute",
    name: "エコキュート",
    description: "エコキュートの仕組み、タンク容量の決め方、設置スペースと搬入、ガスからの切り替えについて。",
    pillar: { href: "/service/water-heater", label: "給湯器・エコキュート" },
    image: "photos/ecocute-side",
    imageAlt: "住宅の横に設置したエコキュート",
  },
  {
    id: "ene-farm",
    name: "エネファーム",
    description: "エネファームからの取り替え、撤去のときの確認点、次の給湯器の選び方について。",
    pillar: { href: "/service/ene-farm", label: "エネファームからの交換" },
    image: "photos/old-unit-and-tank",
    imageAlt: "屋外に設置された年数のたった機器と、新しい給湯タンク",
  },
  {
    id: "eco-one",
    name: "ECO ONE",
    description: "リンナイのハイブリッド給湯・暖房システム ECO ONE の仕組み、向いている家、補助金について。",
    pillar: { href: "/service/eco-one", label: "ECO ONE・ハイブリッド給湯暖房" },
    image: "photos/ecocute-wall",
    imageAlt: "住宅の外壁沿いに設置したタンクユニットとヒートポンプユニット",
  },
  {
    id: "air-conditioner",
    name: "エアコン",
    description: "エアコンの取り付け・交換、配管の仕上げ、室外機の置き方、修理か交換かの判断について。",
    pillar: { href: "/service/air-conditioner", label: "エアコン設置・交換・修理" },
    image: "photos/living-aircon-garden",
    imageAlt: "壁掛けエアコンのあるリビング",
  },
  {
    id: "toilet",
    name: "トイレ",
    description: "便器の種類、排水芯の確認、床や壁紙の同時張り替えなど、トイレ交換の前に知っておきたいこと。",
    pillar: { href: "/service/toilet", label: "トイレ交換・トイレリフォーム" },
    image: "photos/toilet-luxury",
    imageAlt: "洗面カウンターのあるトイレ空間",
  },
  {
    id: "kitchen",
    name: "キッチン",
    description: "ビルトインコンロの交換、天板やグリルの選び方、IH への変更、キッチンまわりの収納について。",
    pillar: { href: "/service/kitchen-equipment", label: "ビルトインコンロ・レンジフード" },
    image: "photos/kitchen-garden-view",
    imageAlt: "庭の見えるキッチン",
  },
  {
    id: "range-hood",
    name: "レンジフード",
    description: "レンジフードの交換時期、深型と薄型の違い、サイズと排気方向の確認、コンロとの連動について。",
    pillar: { href: "/service/kitchen-equipment", label: "ビルトインコンロ・レンジフード" },
    image: "photos/kitchen-open",
    imageAlt: "薄型のレンジフードがある対面キッチン",
  },
  {
    id: "exterior-painting",
    name: "外壁塗装",
    description: "塗り替えのサイン、工程、塗料の選び方、見積書の見方など、外壁塗装の判断材料をまとめます。",
    pillar: { href: "/service/exterior-painting", label: "外壁塗装・屋根塗装" },
    image: "photos/painting-masking",
    imageAlt: "窓を養生した、塗装工事中の住宅",
  },
  {
    id: "roof-painting",
    name: "屋根塗装",
    description: "屋根材ごとの塗装の要否、塗り替えの時期、外壁や太陽光パネルと足場をまとめる考え方について。",
    pillar: { href: "/service/exterior-painting", label: "外壁塗装・屋根塗装" },
    image: "photos/painting-roof-gutter",
    imageAlt: "塗装を終えた外壁と軒先・雨どい",
  },
  {
    id: "solar",
    name: "太陽光",
    description: "屋根の向きと影、自家消費と売電、屋根塗装との順番など、太陽光発電の検討に必要な知識。",
    pillar: { href: "/service/solar", label: "太陽光発電" },
    image: "photos/house-solar-hill",
    imageAlt: "屋根に太陽光パネルを載せた住宅",
  },
  {
    id: "storage-battery",
    name: "蓄電池",
    description: "容量の決め方、全負荷型と特定負荷型の違い、太陽光への後付け、停電時の使い方について。",
    pillar: { href: "/service/storage-battery", label: "家庭用蓄電池" },
    image: "photos/house-white-gray",
    imageAlt: "白と濃いグレーの外壁の住宅",
  },
  {
    id: "reform",
    name: "リフォーム",
    description: "水まわり・内装のリフォームの進め方、優先順位、まとめて頼むときの考え方について。",
    pillar: { href: "/service/reform", label: "住宅リフォーム" },
    image: "photos/reform-kitchen-wood",
    imageAlt: "木の質感を生かしたキッチンとダイニング",
  },
  {
    id: "demolition",
    name: "解体",
    description: "リフォームに伴う解体の範囲、石綿の事前調査、廃材の処理など、解体の前に知っておきたいこと。",
    pillar: { href: "/service/demolition", label: "解体工事" },
    image: "works/floor-protection",
    imageAlt: "工事の前に、床一面を養生シートで覆った室内",
  },
  {
    id: "garden",
    name: "造園",
    description: "庭木の剪定と伐採の時期、雑草対策、ウッドデッキの下地づくりなど、庭と外構の手入れについて。",
    pillar: { href: "/service/garden", label: "造園・外構工事" },
    image: "photos/garden-entrance-stone",
    imageAlt: "植栽と自然石のある玄関アプローチ",
  },
  {
    id: "housing-equipment",
    name: "住宅設備",
    description: "浴室暖房乾燥機、内窓、水栓、電気まわりなど、住まいの設備全般の選び方と手入れについて。",
    pillar: { href: "/service", label: "サービス一覧" },
    image: "photos/house-modern-front",
    imageAlt: "モダンな外観の2階建て住宅",
  },
  {
    id: "subsidy",
    name: "補助金",
    description: "給湯器・窓・省エネリフォームに使える国や自治体の制度を、公式情報と確認日つきで紹介します。",
    pillar: { href: "/area/yokohama", label: "横浜市の対応エリアと支援制度" },
    image: "photos/house-dark-gray",
    imageAlt: "濃いグレーと白の外壁の住宅",
  },
  {
    id: "yokohama",
    name: "横浜市",
    description: "横浜市で住宅設備の工事やリフォームをするときに役立つ、制度や地域の情報。",
    pillar: { href: "/area/yokohama", label: "横浜市の住宅設備・リフォーム" },
    image: "area/yokohama-minatomirai",
    imageAlt: "みなとみらいの街並み",
  },
  {
    id: "totsuka",
    name: "戸塚区",
    description: "起伏の多い戸塚区の住まいならではの、設備工事・塗装・庭の手入れの注意点。",
    pillar: { href: "/area/totsuka", label: "戸塚区の住宅設備・リフォーム" },
    image: "area/totsuka-aerial",
    imageAlt: "戸塚駅周辺の街並み",
  },
];

export function getCluster(id: string): BlogCluster | undefined {
  return blogClusters.find((c) => c.id === id);
}

export const blogClusterIds = blogClusters.map((c) => c.id) as [BlogClusterId, ...BlogClusterId[]];
