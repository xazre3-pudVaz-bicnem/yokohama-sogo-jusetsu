import type { ImageKey } from "@/lib/images";

/**
 * 施工事例
 *
 * いま載せている事例は、すべて公式 Instagram（@yokohamatotalhousingsolutions）の投稿が元。
 * 書いてよいのは、投稿文に書かれていることと、写真から確かに読み取れることだけ。
 *   - 施工地域・施工時期・施工期間・金額は、投稿に書かれていないので null（画面に出ない）
 *   - メーカー名は、投稿文・ハッシュタグに書かれているものだけ
 *   - comment は投稿文の言葉を、絵文字を除いてそのまま使う（言い換えない）
 * 情報が分かったら、該当の項目に値を入れるだけで、詳細ページと一覧に表示される。
 *
 * 事例を増やすとき
 *   1. 写真を assets/instagram/ か assets/source/ に置き、scripts/prepare-images.mjs の表に足して実行
 *   2. 下の配列に1件足す（services の先頭が、その事例の代表サービス）
 *   3. area.areaSlug に data/areas.ts の slug を入れると、地域ページにもその事例が出る
 */

export type WorkImage = {
  key: ImageKey;
  alt: string;
  /** 写真の左上に出すラベル（施工前・施工中・施工後 など） */
  label?: string;
};

export type Work = {
  slug: string;
  title: string;
  /** 関係するサービスのスラッグ（先頭が代表） */
  services: string[];
  /** 一覧に出す区分 */
  category: string;
  summary: string;
  cover: WorkImage;
  /** 施工地域。確認できたものだけ（例：{ areaSlug: "totsuka", label: "横浜市戸塚区" }） */
  area: { areaSlug?: string; label: string } | null;
  /** 施工時期（例："2026年8月"）。未確認なら null */
  completedAt: string | null;
  /** 施工期間（例："1日"）。未確認なら null */
  duration: string | null;
  /** 使用した商品・メーカー */
  products: { maker?: string; name: string }[];
  /** お客様のお悩み（投稿に書かれているものだけ） */
  worry: string | null;
  /** 施工内容 */
  content: string[];
  /** 施工のポイント */
  points: { title: string; body: string }[];
  /** 横浜総合住設からのコメント（Instagram の投稿文より） */
  comment: string | null;
  /** 施工前後の組 */
  beforeAfter: { title: string; before: WorkImage; after: WorkImage }[];
  /** そのほかの写真（工程順） */
  gallery: WorkImage[];
  /** 写真についての注記 */
  photoNote?: string;
  source: { url: string; postedAt: string };
};

export const works: Work[] = [
  {
    slug: "aircon-replace-decorative-cover",
    title: "エアコン取替工事 ── 配管を化粧テープ仕上げから化粧カバー仕上げへ",
    services: ["air-conditioner"],
    category: "エアコン",
    summary: "古いエアコンを新しい機種に取り替え、屋外の配管をテープ巻きから化粧カバーの仕上げに変更しました。",
    cover: { key: "works/aircon-cover-after-outdoor", alt: "配管を白い化粧カバーで仕上げた、取替後のエアコン室外機", label: "施工後" },
    area: null,
    completedAt: null,
    duration: null,
    products: [{ maker: "東芝（TOSHIBA）", name: "ルームエアコン" }],
    worry: null,
    content: [
      "既存のエアコンを取り外し、室内機・室外機とも新しい機種に取り替えました。",
      "屋外の配管は、取替前はテープを巻いた仕上げでした。取替に合わせて配管を新しくし、樹脂製の化粧カバーに収めています。",
    ],
    points: [
      {
        title: "配管をカバーに収める",
        body: "テープ巻きの配管は、年数がたつとテープが傷み、中の断熱材が見えてきます。カバーに収めることで、日差しと雨が配管に直接当たらなくなります。",
      },
      {
        title: "外壁に沿ってまっすぐ通す",
        body: "室内機の穴から室外機まで、カバーを外壁に沿って垂直に通しました。配管の曲がりも部材で整え、外から見たときの線をそろえています。",
      },
    ],
    comment: "エアコン取替工事。化粧テープ仕上げから、化粧カバー仕上げへ。エアコン取替は横浜総合住設へご連絡下さい。",
    beforeAfter: [
      {
        title: "室内機",
        before: { key: "works/aircon-cover-before-indoor", alt: "取替前の、年数のたったエアコンの室内機", label: "施工前" },
        after: { key: "works/aircon-cover-after-indoor", alt: "取替後の、新しいエアコンの室内機", label: "施工後" },
      },
      {
        title: "室外機と配管",
        before: { key: "works/aircon-cover-before-outdoor", alt: "取替前の室外機と、テープを巻いた配管", label: "施工前" },
        after: { key: "works/aircon-cover-after-outdoor", alt: "取替後の室外機と、化粧カバーに収めた配管", label: "施工後" },
      },
    ],
    gallery: [],
    source: { url: "https://www.instagram.com/p/Ddi5h4wE-Zo/", postedAt: "2026-09-21" },
  },
  {
    slug: "aircon-high-place-replacement",
    title: "他社で断られた、高所でのエアコン取替",
    services: ["air-conditioner"],
    category: "エアコン",
    summary: "別の業者に断られたエアコンの取替を、ご相談を受けて施工しました。長いはしごを使った高所での作業です。",
    cover: { key: "works/aircon-high-place", alt: "住宅の外壁に長いはしごを掛け、高い位置で作業するスタッフ", label: "施工中" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: "別の業者にエアコンの取替を依頼したところ、断られてしまった。",
    content: [
      "エアコンの取替では、室外機や配管が高い位置にあり、高所での作業になることがよくあります。この現場も、道路より高い位置に建つ住宅で、長いはしごを掛けての作業になりました。",
      "他の業者で断られたとのことでご連絡をいただき、現地を確認したうえで取替を行いました。",
    ],
    points: [
      {
        title: "まず現地を見る",
        body: "「高所なのでできない」と言われた工事でも、足場になる場所と作業の手順を現地で確かめると、できる方法が見つかることがあります。",
      },
      {
        title: "安全に作業できる方法を選ぶ",
        body: "はしごを立てる位置、固定の方法、作業する人数。高所の作業は、段取りを決めてから始めます。",
      },
    ],
    comment: "他の業者様で断られてしまった内容でも、横浜総合住設へ、1度ご相談下さい。最大限を尽くします。",
    beforeAfter: [],
    gallery: [],
    photoNote: "写真は、建物が特定されないよう一部を加工しています。",
    source: { url: "https://www.instagram.com/p/Dd1IwHKTYlD/", postedAt: "2026-09-28" },
  },
  {
    slug: "aircon-replace-two-units",
    title: "エアコン取替工事（2台）── 室内機・室外機の入れ替え",
    services: ["air-conditioner"],
    category: "エアコン",
    summary: "2台のエアコンを、室内機・室外機とも新しい機種に取り替えました。取替前と取替後の写真を並べてご紹介します。",
    cover: { key: "works/aircon-b-after-outdoor", alt: "取替後のエアコン室外機と、外壁に沿って立ち上げた配管カバー", label: "施工後" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "2台のエアコンの取替工事の記録です。どちらも既存の機種を取り外し、室内機・室外機を新しい機種に入れ替えました。",
      "1台目はベランダに室外機を置く設置、2台目は建物の外の地面に近い位置に室外機を置く設置です。屋外の配管まわりも、取替に合わせて整えています。",
    ],
    points: [
      {
        title: "既存の穴と経路を活かす",
        body: "取替では、いま使っている配管用の穴と室外機の置き場所をそのまま使えるかが要点です。使える場合は、壁に新しい穴を開けずに済みます。",
      },
      {
        title: "室外機の据え付け",
        body: "室外機は水平に置き、運転中の振動で動かないよう据え付けます。配管は無理な曲げが無いよう、長さと向きを合わせます。",
      },
    ],
    comment: "エアコン取替工事。エアコン取替は横浜総合住設へご連絡下さい。お見積り無料で、現場調査に伺わせていただきます。",
    beforeAfter: [
      {
        title: "1台目：室内機",
        before: { key: "works/aircon-a-before-indoor", alt: "1台目の取替前の室内機", label: "施工前" },
        after: { key: "works/aircon-a-after-indoor", alt: "1台目の取替後の室内機", label: "施工後" },
      },
      {
        title: "1台目：室外機",
        before: { key: "works/aircon-a-before-outdoor", alt: "1台目の取替前の、ベランダに置かれた室外機と配管", label: "施工前" },
        after: { key: "works/aircon-a-after-outdoor", alt: "1台目の取替後の、ベランダに置いた室外機と配管", label: "施工後" },
      },
      {
        title: "2台目：室内機",
        before: { key: "works/aircon-b-before-indoor", alt: "2台目の取替前の室内機", label: "施工前" },
        after: { key: "works/aircon-b-after-indoor", alt: "2台目の取替後の室内機", label: "施工後" },
      },
      {
        title: "2台目：室外機",
        before: { key: "works/aircon-b-before-outdoor", alt: "2台目の取替前の、建物の外に置かれた室外機", label: "施工前" },
        after: { key: "works/aircon-b-after-outdoor", alt: "2台目の取替後の室外機と配管カバー", label: "施工後" },
      },
    ],
    gallery: [],
    source: { url: "https://www.instagram.com/p/Ddi6XETk-D9/", postedAt: "2026-09-21" },
  },
  {
    slug: "air-conditioning-pipe-lagging",
    title: "空調配管のラッキングカバー施工",
    services: ["air-conditioner"],
    category: "業務用空調",
    summary: "屋外に並ぶ室外機につながる空調配管に、金属製のラッキングカバーを施工しました。曲がりの部分まで形を合わせて仕上げています。",
    cover: { key: "works/lagging-2", alt: "屋外の室外機につながる空調配管に、銀色のラッキングカバーを施工した様子", label: "施工後" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "複数の室外機が並ぶ屋外の機械置き場で、空調配管にラッキングカバーを施工しました。",
      "ラッキングは、配管に巻いた保温材を金属の板で覆う仕上げです。雨と紫外線から保温材を守り、屋外の配管を長持ちさせます。",
    ],
    points: [
      {
        title: "曲がりの納まり",
        body: "配管が直角に曲がる部分は、板を細かく分けて扇のようにつなぎ、曲がりに沿わせます。継ぎ目のそろい方に、仕上げの丁寧さが出ます。",
      },
      {
        title: "壁との取り合い",
        body: "配管が壁や機器に入る部分は、すき間から水が入らないよう端部を処理します。",
      },
    ],
    comment: "空調配管のラッキングカバー施工です。キレイに仕上がっております。",
    beforeAfter: [
      {
        title: "機械置き場の配管",
        before: { key: "works/lagging-1", alt: "ラッキングカバーを施工する前の空調配管。保温材を巻いた状態", label: "施工前" },
        after: { key: "works/lagging-2", alt: "ラッキングカバーを施工したあとの空調配管", label: "施工後" },
      },
    ],
    gallery: [
      { key: "works/lagging-3", alt: "室外機の間を通る、ラッキングカバーを施工した配管" },
      { key: "works/lagging-4", alt: "配管の曲がりの部分。板を分けて曲がりに沿わせたラッキングカバー" },
      { key: "works/lagging-5", alt: "配管が機器に入る部分の、ラッキングカバーの端部" },
    ],
    source: { url: "https://www.instagram.com/p/DdnqvlSEz4N/", postedAt: "2026-09-23" },
  },
  {
    slug: "bathroom-heater-dryer-rinnai",
    title: "リンナイの浴室暖房乾燥機の施工",
    services: ["other", "reform"],
    category: "浴室暖房乾燥機",
    summary: "浴室の天井の暖房乾燥機を、リンナイの浴室暖房乾燥機に取り替えました。壁のリモコンも新しくしています。",
    cover: { key: "works/bath-dryer-after-unit", alt: "浴室の天井に取り付けた、新しい浴室暖房乾燥機", label: "施工後" },
    area: null,
    completedAt: null,
    duration: null,
    products: [{ maker: "リンナイ", name: "浴室暖房乾燥機" }],
    worry: null,
    content: [
      "浴室の天井に付いていた暖房乾燥機を取り外し、リンナイの浴室暖房乾燥機を取り付けました。壁のリモコンも、新しい機種に合わせて交換しています。",
      "作業の前に、浴槽と壁を養生シートで覆い、天井の点検口から天井裏の配線とダクトを確認しながら進めました。",
    ],
    points: [
      {
        title: "天井裏の確認",
        body: "浴室暖房乾燥機は、本体のほとんどが天井裏に隠れています。点検口を開け、ダクトの位置と電源、配管を確かめてから機種を決めます。",
      },
      {
        title: "浴室の養生",
        body: "天井の作業では、ほこりや部材が浴槽や床に落ちます。浴槽と壁を養生してから作業することで、設備を傷つけずに済みます。",
      },
    ],
    comment: "リンナイの浴室暖房乾燥機の施工です。これからの寒い季節はヒートショックが心配です。冬がやってくる前に備えましょう。",
    beforeAfter: [
      {
        title: "天井の本体",
        before: { key: "works/bath-dryer-before-unit", alt: "取替前の、浴室の天井の暖房乾燥機", label: "施工前" },
        after: { key: "works/bath-dryer-after-room", alt: "取替後の浴室。天井に新しい浴室暖房乾燥機が付いている", label: "施工後" },
      },
      {
        title: "壁のリモコン",
        before: { key: "works/bath-dryer-before-remote", alt: "取替前の浴室暖房乾燥機のリモコン", label: "施工前" },
        after: { key: "works/bath-dryer-after-remote", alt: "取替後の、新しい浴室暖房乾燥機のリモコン", label: "施工後" },
      },
    ],
    gallery: [
      { key: "works/bath-dryer-working", alt: "養生した浴室で、天井の点検口から作業するスタッフ", label: "施工中" },
      { key: "works/bath-dryer-after-unit", alt: "天井に取り付けた浴室暖房乾燥機の吹き出し口", label: "施工後" },
    ],
    source: { url: "https://www.instagram.com/p/Dd3kKouE_63/", postedAt: "2026-09-29" },
  },
  {
    slug: "wood-deck-installation",
    title: "ウッドデッキの設置 ── 整地から完成まで",
    services: ["garden"],
    category: "外構・ウッドデッキ",
    summary: "土のままだった建物の横のスペースに、ステップつきのウッドデッキを設置しました。整地から完成までの写真です。",
    cover: { key: "works/wood-deck-3-done", alt: "建物の横に完成した、ステップつきのウッドデッキ", label: "施工後" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "フェンスに囲まれた、土のままのスペースにウッドデッキを設置しました。",
      "まず地面をならし、全面に防草シートを敷きます。その上に束石を並べて高さをそろえ、床板を張って仕上げました。庭へ下りる側にはステップを設けています。",
    ],
    points: [
      {
        title: "デッキの下の雑草対策",
        body: "デッキの下は、完成すると手が入りません。先に防草シートを全面に敷いておくことで、後から草が伸びてくるのを防ぎます。",
      },
      {
        title: "束石で水平を出す",
        body: "床を支える足元の束石を、等しい間隔で並べて高さをそろえます。ここがそろっていないと、床が波打ったり、きしんだりします。",
      },
      {
        title: "排水ますの位置を確かめる",
        body: "デッキを置く場所に排水ますがある場合は、後から点検できるよう、位置を確かめてから計画します。",
      },
    ],
    comment: "ウッドデッキの設置までの様子になります。お客様のご希望を叶えるべく横浜総合住設は動きます。",
    beforeAfter: [
      {
        title: "施工前と完成後",
        before: { key: "works/wood-deck-1-ground", alt: "施工前の、土のままのスペース", label: "施工前" },
        after: { key: "works/wood-deck-3-done", alt: "完成したウッドデッキ", label: "施工後" },
      },
    ],
    gallery: [
      { key: "works/wood-deck-2-sheet", alt: "防草シートを敷き、束石を並べたところ", label: "施工中" },
      { key: "works/wood-deck-4-top", alt: "上から見た、完成後のウッドデッキの床板", label: "施工後" },
    ],
    source: { url: "https://www.instagram.com/p/DdvwRtrk-4n/", postedAt: "2026-09-26" },
  },
  {
    slug: "cupboard-installation",
    title: "キッチンのカップボード設置",
    services: ["reform", "kitchen-equipment"],
    category: "キッチン",
    summary: "キッチンの背面に、吊り戸棚とカウンターが一体になったカップボード（食器棚）を設置しました。",
    cover: { key: "works/cupboard", alt: "キッチンの背面に設置した、青い扉のカップボード", label: "施工後" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "キッチンの背面の壁に、カップボードを設置しました。上に吊り戸棚、下に引き出しの収納、その間が家電を置けるカウンターになっています。",
    ],
    points: [
      {
        title: "壁の下地に固定する",
        body: "吊り戸棚は、食器を入れると重くなります。壁の中の下地の位置を確かめ、しっかり固定することが欠かせません。",
      },
      {
        title: "コンセントと家電の位置",
        body: "カウンターに置く電子レンジや炊飯器のために、コンセントの位置と数を先に決めておきます。",
      },
    ],
    comment: "カップボード設置。大掃除のシーズンが近づくと、ガスコンロ、レンジフードの取替が増えてくるはず。",
    beforeAfter: [],
    gallery: [],
    source: { url: "https://www.instagram.com/p/DdtS3dmTOlS/", postedAt: "2026-09-25" },
  },
  {
    slug: "exterior-roof-painting-process",
    title: "外壁塗装・屋根塗装 ── 施工の工程をご紹介",
    services: ["exterior-painting"],
    category: "外壁・屋根塗装",
    summary: "当社で外壁と屋根を塗装した現場の記録です。施工前の屋根の状態から、塗装後の仕上がり、破風の様子、塗り重ねによる違いまで。",
    cover: { key: "works/painting-process-card", alt: "外壁塗装・屋根塗装の施工工程をまとめた画像。施工前の屋根と、塗装が完了した屋根", label: "工程の紹介" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "当社で外壁・屋根の塗装をした現場の写真を、工程ごとにまとめました。",
      "施工前の屋根は、長年の風雨で色あせや汚れが目立っていました。塗装後は美しく、耐久性もアップしました。破風などの細部まで丁寧に仕上げています。",
    ],
    points: [
      {
        title: "1. 施工前（屋根の状態）",
        body: "長年の風雨で、色あせや汚れが目立っていました。",
      },
      {
        title: "2. 屋根塗装 完了",
        body: "塗装後は美しく、耐久性もアップしました。",
      },
      {
        title: "3. 外観・破風の様子",
        body: "塗装前は塗膜のはがれが見られた破風も、細部まで丁寧に仕上げ、美しい外観になりました。",
      },
      {
        title: "4. 塗装の仕上がり比較",
        body: "1回塗りと2回塗りでは、色の乗りと艶が違います。下塗り・中塗り・上塗りで、しっかりとした仕上がりにしています。",
      },
    ],
    comment: "弊社にて外壁・屋根の塗装をさせていただいた現場になります。キレイに仕上がっております。",
    beforeAfter: [],
    gallery: [{ key: "works/painting-process", alt: "外壁塗装・屋根塗装の施工工程。施工前の屋根、屋根塗装の完了、破風の塗装前と塗装後、1回塗りと2回塗りの仕上がり比較" }],
    source: { url: "https://www.instagram.com/p/DeEXKZwzic1/", postedAt: "2026-10-04" },
  },
];

/** 新しい順（Instagram の投稿日） */
export const worksSorted: Work[] = [...works].sort((a, b) => b.source.postedAt.localeCompare(a.source.postedAt));

export function getWork(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}

/** そのサービスに関係する事例（代表サービスが一致するものを先に） */
export function worksByService(serviceSlug: string): Work[] {
  const primary = worksSorted.filter((w) => w.services[0] === serviceSlug);
  const secondary = worksSorted.filter((w) => w.services[0] !== serviceSlug && w.services.includes(serviceSlug));
  return [...primary, ...secondary];
}

/** その地域の事例（area.areaSlug が一致するもの） */
export function worksByArea(areaSlug: string): Work[] {
  return worksSorted.filter((w) => w.area?.areaSlug === areaSlug);
}

/** 一覧の絞り込みに使う区分 */
export const workCategories: string[] = Array.from(new Set(worksSorted.map((w) => w.category)));
