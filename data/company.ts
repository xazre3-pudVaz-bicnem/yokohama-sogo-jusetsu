import type { IconName } from "@/components/ui/Icon";
import type { ImageKey } from "@/lib/images";

/**
 * 会社の強み・工事の流れ・Instagram の投稿など、会社紹介に使うデータ。
 * 根拠は、会社のチラシ・看板・既存ホームページのイメージ・公式 Instagram の投稿に書かれている内容。
 * 「地域No.1」「施工実績○件」「満足度○%」のような、根拠を示せない表現は書かない。
 */

/* ------------------------------------------------------------------ */
/* 強み                                                                */
/* ------------------------------------------------------------------ */
export type Strength = {
  id: string;
  icon: IconName;
  title: string;
  body: string;
  /** 根拠になる写真（実際の現場の写真だけ） */
  photo?: { key: ImageKey; alt: string; caption: string };
};

export const strengths: Strength[] = [
  {
    id: "range",
    icon: "home",
    title: "設備から外装・庭まで、ひとつの窓口で",
    body: "給湯器・エアコン・トイレ・コンロといった住宅設備から、太陽光発電、外壁塗装、リフォーム、造園まで対応します。工事ごとに会社を探し直す必要がありません。",
  },
  {
    id: "bundle",
    icon: "clipboardCheck",
    title: "複数の工事を、まとめて相談できる",
    body: "「給湯器と浴室乾燥機」「外壁塗装とエアコンの配管」のように、関係する工事をまとめてご相談いただけます。足場や養生、訪問を一度にまとめる段取りを組めます。",
  },
  {
    id: "survey",
    icon: "car",
    title: "見積もり無料、現地調査にうかがいます",
    body: "お見積もりは無料です。現地にうかがって設置場所と配管を確かめ、内訳の分かる見積書をお出しします。お電話でも、Instagram のメッセージでもご相談いただけます。",
  },
  {
    id: "difficult",
    icon: "shield",
    title: "他社で断られた工事も、まず見る",
    body: "高い位置でのエアコンの取替など、別の業者に断られたというご相談を受け、施工した例があります。できない理由を確かめ、できる方法を探します。",
    photo: { key: "works/aircon-high-place", alt: "住宅の外壁に長いはしごを掛けて作業するスタッフ", caption: "他社で断られた高所でのエアコン取替" },
  },
  {
    id: "finish",
    icon: "sparkle",
    title: "養生と仕上げを、手を抜かずに",
    body: "工事の前に床や浴槽を覆う養生、配管を収める化粧カバー、屋外配管のラッキング。完成後に目に入る部分も、見えなくなる部分も、丁寧に仕上げます。",
    photo: { key: "works/floor-protection", alt: "工事の前に、床一面を養生シートで覆った室内", caption: "工事の前の床の養生" },
  },
  {
    id: "business",
    icon: "building",
    title: "法人・工務店の案件にも対応",
    body: "個人のお客様だけでなく、法人・工務店・ハウスメーカーからのご依頼もお受けしています。業務用エアコンや空調配管の工事にも対応します。",
    photo: { key: "works/lagging-3", alt: "屋外の室外機の間を通る、ラッキングカバーを施工した空調配管", caption: "空調配管のラッキングカバー施工" },
  },
  {
    id: "subsidy",
    icon: "yen",
    title: "補助金の活用もサポート",
    body: "高効率給湯器や窓の断熱など、国や自治体の制度が使える工事があります。対象になるか、いつまでに何が必要かを確認し、申請の進め方をご案内します。",
  },
  {
    id: "local",
    icon: "mapPin",
    title: "戸塚区にオフィス。横浜を中心に",
    body: "横浜市戸塚区深谷町にオフィスを置き、横浜を中心に神奈川・東京エリアで工事を行っています。地域の住まいの事情を踏まえてご提案します。",
  },
];

/* ------------------------------------------------------------------ */
/* 工事の流れ                                                          */
/* ------------------------------------------------------------------ */
export type FlowStep = {
  id: string;
  title: string;
  /** 一言 */
  lead: string;
  body: string;
  /** お客様にお願いすること・用意するもの */
  prepare?: string[];
  pose: ImageKey;
};

export const flowSteps: FlowStep[] = [
  {
    id: "contact",
    title: "お問い合わせ",
    lead: "電話・フォーム・Instagram から",
    body: "お電話、お問い合わせフォーム、Instagram のメッセージのいずれかでご連絡ください。「何から聞けばよいか分からない」という段階でかまいません。困っていることを、そのままお聞かせください。",
    prepare: ["気になっている場所と症状", "ご住所（市区町村まででも可）", "ご希望の連絡方法と時間帯"],
    pose: "illust/pose-phone",
  },
  {
    id: "hearing",
    title: "ヒアリング",
    lead: "状況をうかがい、写真を確認",
    body: "いまの設備の種類、使っている年数、症状をうかがいます。機器の型番や設置場所の写真をお送りいただくと、現地調査の前に、おおよその内容をお伝えできます。",
    prepare: ["機器の型番が書かれたシール（銘板）の写真", "設置場所の全体が分かる写真"],
    pose: "illust/pose-laptop",
  },
  {
    id: "survey",
    title: "現地調査",
    lead: "無料でうかがいます",
    body: "ご都合のよい日時に現地へうかがい、設置場所の寸法、配管や配線の状態、搬入の経路を確認します。この段階で、取り付けられる機種と必要な工事が決まります。",
    prepare: ["工事する場所のまわりの片付け（可能な範囲で）", "マンションの場合は管理規約"],
    pose: "illust/pose-idea",
  },
  {
    id: "estimate",
    title: "お見積もり・ご提案",
    lead: "内訳の分かる見積書を",
    body: "調査の結果をもとに、機器と工事の内訳が分かる見積書をお出しします。複数の機種で迷う場合は、それぞれの違いをご説明します。補助金が使える工事は、その条件もご案内します。",
    pose: "illust/pose-calc",
  },
  {
    id: "contract",
    title: "ご契約・日程の調整",
    lead: "内容に納得してから",
    body: "見積もりの内容にご納得いただけたら、ご契約となります。機器の手配にかかる日数を確認し、工事の日時を決めます。補助金を使う場合は、申請の順番に合わせて日程を組みます。",
    pose: "illust/pose-chart",
  },
  {
    id: "work",
    title: "施工",
    lead: "養生してから、工事へ",
    body: "作業する場所と通路を養生してから、工事に入ります。既存の機器の取り外し、新しい機器の取り付け、配管・配線の接続を行い、動作を確認します。",
    pose: "illust/pose-fist",
  },
  {
    id: "handover",
    title: "お引き渡し",
    lead: "使い方をご説明",
    body: "仕上がりを一緒にご確認いただき、機器の使い方をご説明します。取扱説明書などの書類をお渡しして、工事は完了です。",
    pose: "illust/pose-ok",
  },
  {
    id: "after",
    title: "工事のあとも",
    lead: "気になることは、いつでも",
    body: "使い始めてから気になることが出てきたら、ご連絡ください。施工した当社が窓口になります。別の場所の工事のご相談も、同じ窓口でお受けします。",
    pose: "illust/pose-trust",
  },
];

/* ------------------------------------------------------------------ */
/* Instagram（トップページの区画に出す投稿）                            */
/* ------------------------------------------------------------------ */
export type InstagramPost = {
  url: string;
  postedAt: string;
  image: ImageKey;
  alt: string;
  caption: string;
};

export const instagramPosts: InstagramPost[] = [
  {
    url: "https://www.instagram.com/p/DeEXKZwzic1/",
    postedAt: "2026-10-04",
    image: "works/painting-process-card",
    alt: "外壁塗装・屋根塗装の施工工程をまとめた画像",
    caption: "外壁・屋根塗装の施工工程",
  },
  {
    url: "https://www.instagram.com/p/Dd8vP0jTeQb/",
    postedAt: "2026-10-01",
    image: "company/stickers",
    alt: "横浜総合住設のロゴと電話番号が入ったステッカー",
    caption: "会社のステッカーが届きました",
  },
  {
    url: "https://www.instagram.com/p/Dd6HcfPzjrh/",
    postedAt: "2026-09-30",
    image: "instagram/banner-yokoju",
    alt: "「住宅のことならヨコジュウへ」と書かれた、横浜総合住設のイラストバナー",
    caption: "住宅のことならヨコジュウへ",
  },
  {
    url: "https://www.instagram.com/p/Dd3kKouE_63/",
    postedAt: "2026-09-29",
    image: "works/bath-dryer-after-unit",
    alt: "浴室の天井に取り付けた浴室暖房乾燥機",
    caption: "リンナイの浴室暖房乾燥機",
  },
  {
    url: "https://www.instagram.com/p/Dd1IwHKTYlD/",
    postedAt: "2026-09-28",
    image: "works/aircon-high-place",
    alt: "長いはしごを使った高所でのエアコン取替",
    caption: "高所でのエアコン取替",
  },
  {
    url: "https://www.instagram.com/p/DdvwRtrk-4n/",
    postedAt: "2026-09-26",
    image: "works/wood-deck-3-done",
    alt: "完成したステップつきのウッドデッキ",
    caption: "ウッドデッキの設置",
  },
  {
    url: "https://www.instagram.com/p/DdtS3dmTOlS/",
    postedAt: "2026-09-25",
    image: "works/cupboard",
    alt: "キッチンに設置した青い扉のカップボード",
    caption: "カップボードの設置",
  },
  {
    url: "https://www.instagram.com/p/DdnqvlSEz4N/",
    postedAt: "2026-09-23",
    image: "works/lagging-2",
    alt: "ラッキングカバーを施工した屋外の空調配管",
    caption: "空調配管のラッキングカバー",
  },
];

/* ------------------------------------------------------------------ */
/* 写真の出典（出典の表示が必要なもの）                                 */
/* ------------------------------------------------------------------ */
export type PhotoCredit = {
  image: ImageKey;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  /** 加工の内容（CC BY は、変更した場合にその旨を示す必要がある） */
  changes: string;
};

export const photoCredits: PhotoCredit[] = [
  {
    image: "area/totsuka-aerial",
    title: "戸塚駅周辺3",
    author: "横浜市（横浜市オープンデータポータル）",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/deed.ja",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Totsuka_station_area.jpg",
    changes: "サイズを縮小し、一部を切り出して使用",
  },
  {
    image: "area/yokohama-minatomirai",
    title: "Minato Mirai In Blue",
    author: "akumach",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/deed.ja",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Minato_Mirai_In_Blue.jpg",
    changes: "サイズを縮小し、上下を切り出して使用",
  },
];

export function creditOf(image: ImageKey): PhotoCredit | undefined {
  return photoCredits.find((c) => c.image === image);
}
