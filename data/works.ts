import type { ImageKey } from "@/lib/images";

/**
 * 施工事例
 *
 * 事例の元は2つ（source.type）。
 *   instagram … 公式 Instagram（@yokohamatotalhousingsolutions）の投稿
 *   line      … 会社から LINE で受け取った現場の写真と、代表の説明（2026-10-20 のアルバム「工事写真」など）
 * 書いてよいのは、投稿文・代表の説明に書かれていることと、写真から確かに読み取れることだけ。
 *   - 施工地域・施工時期・施工期間・金額は、どちらにも書かれていないので null（画面に出ない）
 *   - メーカー名は、投稿文・ハッシュタグに書かれているものだけ（写真に写っていても、新しい機器か外した機器か分からなければ書かない）
 *   - comment は Instagram の投稿文の言葉を、絵文字を除いてそのまま使う（言い換えない）。LINE の事例は null
 *   - 施工前・施工後のラベルは、写真と説明から確かに分かるものだけに付ける
 * 情報が分かったら、該当の項目に値を入れるだけで、詳細ページと一覧に表示される。
 *
 * 事例を増やすとき（Instagram の投稿や、現場で撮った写真から）
 *   1. 写真を assets/instagram/ か assets/line/ に置き、scripts/prepare-images.mjs の表に足して実行
 *      （ファイル名＝画像のキーは、内容が分かる英語にする。例：works/water-heater-wall-after）
 *   2. 下の配列に1件足す（services の先頭が、その事例の代表サービス）
 *   3. keyword に、その事例が代表になる検索語を書く（ほかのページと同じ語にしない。npm run seo:audit が重複を知らせる）
 *   4. area に地域を入れると、題名と title に地域名が付き、地域ページにもその事例が出る
 *      （市区まで。町名・番地など、お宅が特定される情報は書かない。確認できていない地域を、推測で入れない）
 * 足した事例は、何もしなくても次の場所に出る：
 *   施工事例の一覧／代表サービスのページ／サービス別の事例一覧（3件以上あるサービス）／地域ページ（area があるとき）／
 *   関係するコラムの記事の下／サイトマップ
 */

export type WorkImage = {
  key: ImageKey;
  alt: string;
  /** 写真の左上に出すラベル（施工前・施工中・施工後 など） */
  label?: string;
};

/** 機器（メーカー・型番は、投稿文や銘板の写真で確かめられたものだけ） */
export type WorkProduct = { maker?: string; name: string; model?: string };

export type Work = {
  slug: string;
  /** 題名。工事の内容が分かる言葉にする（「施工事例01」のような題名にしない）。地域名は area から自動で付くので、ここには書かない */
  title: string;
  /** この事例のページが代表になる検索語（例：エアコン 高所 取替 施工事例） */
  keyword: string;
  /** 関係するサービスのスラッグ（先頭が代表） */
  services: string[];
  /** 一覧に出す区分 */
  category: string;
  summary: string;
  cover: WorkImage;
  /**
   * 施工地域。確認できたものだけ（例：{ areaSlug: "totsuka", city: "横浜市", ward: "戸塚区", label: "横浜市戸塚区" }）。
   * 市区まで。町名・番地は書かない。areaSlug は、data/areas.ts に公開中の地域ページがあるときだけ入れる。
   */
  area: { areaSlug?: string; city?: string; ward?: string; label: string } | null;
  /** 施工時期（例："2026年8月"）。未確認なら null */
  completedAt: string | null;
  /** 施工期間（例："1日"）。未確認なら null */
  duration: string | null;
  /** 取り付けた機器・使用した商品 */
  products: WorkProduct[];
  /** 取り替える前の機器（分かるものだけ） */
  existing?: WorkProduct[];
  /** お客様のお悩み（投稿に書かれているものだけ） */
  worry: string | null;
  /** 工事で難しかった点（分かるものだけ。創作しない） */
  difficulty?: string;
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
  /** 関連するコラムの記事のスラッグ（省略すると、この事例にリンクしている記事と、同じサービスの記事から選ぶ） */
  relatedArticles?: string[];
  /**
   * 事例の元。postedAt は、Instagram の投稿日か、会社から写真を受け取った日（一覧の並び順と、構造化データの公開日に使う）。
   * LINE で受け取った写真には、公開されている元の投稿が無いので url を持たない
   */
  source: { type: "instagram"; url: string; postedAt: string } | { type: "line"; postedAt: string };
  /** 内容を最後に直した日（YYYY-MM-DD。省略時は投稿日）。sitemap.xml の lastmod と構造化データの dateModified に使う */
  updatedAt?: string;
};

/** サービス別の事例一覧のページを作るのに必要な件数（これ未満のサービスは、一覧のページを作らない） */
export const MIN_WORKS_FOR_LIST = 3;

export const works: Work[] = [
  /*
   * ここから8件は、会社から LINE で受け取ったアルバム「工事写真」（2026-10-20）が元。題名は代表の説明の言葉
   * （ユニットバスリフォーム／畳→琉球畳へ／煙突付きの給湯器交換／ガスエアコンからの取り替え／特殊な形のエアコンからの取り替え／
   * 洗面所作成／マンションベランダ高圧洗浄／屋根裏配線通し工事）。本文は、その説明と写真から読み取れることだけ。
   * 同じ日に受け取った事例は、この並びで一覧に出る。
   */
  {
    slug: "tatami-ryukyu-replacement",
    title: "縁のある畳から、琉球畳への張り替え",
    keyword: "琉球畳 張り替え 施工事例",
    services: ["tatami", "reform"],
    category: "畳",
    summary: "和室の縁のある畳を、縁の無い正方形の琉球畳に替えました。張り替える前と、張り替えたあとの写真です。",
    cover: { key: "works/tatami-ryukyu-after", alt: "琉球畳に張り替えた和室。縁の無い正方形の畳が、市松模様に並んでいる", label: "施工後" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "和室の畳を、琉球畳に替えました。張り替える前は、黒い縁の付いた長方形の畳で、表面のあちこちが、すり切れて白っぽくなっていました。",
      "張り替えたあとは、縁の無い正方形の畳が、市松模様に並んでいます。",
    ],
    points: [
      {
        title: "縁の無い畳で、和室をすっきりと",
        body: "琉球畳は、縁の無い正方形（半畳）の畳です。縁の線が無くなるので、和室がすっきりした印象になります。",
      },
      {
        title: "部屋の寸法に合わせて作る",
        body: "畳は、部屋の寸法に合わせて1枚ずつ作ります。琉球畳は半畳の大きさなので、同じ広さの部屋でも、縁のある畳の倍の枚数になります。",
      },
    ],
    comment: null,
    beforeAfter: [
      {
        title: "和室の床",
        before: { key: "works/tatami-before", alt: "張り替える前の、黒い縁の付いた畳。表面がすり切れて白っぽくなっている", label: "施工前" },
        after: { key: "works/tatami-ryukyu-after", alt: "張り替えたあとの、縁の無い琉球畳", label: "施工後" },
      },
    ],
    gallery: [],
    source: { type: "line", postedAt: "2026-10-20" },
  },
  {
    slug: "washroom-creation",
    title: "洗面所をつくる工事 ── 木のカウンターと角形の洗面ボウル",
    keyword: "洗面所 新設 施工事例",
    services: ["reform"],
    category: "洗面所",
    summary: "洗面所を新しくつくりました。木のカウンターに角形の洗面ボウルを載せた洗面台で、壁には鏡の付いた収納と照明があります。",
    cover: { key: "works/washroom-done", alt: "完成した洗面所。木のカウンターに白い角形の洗面ボウルが載り、壁に鏡の付いた収納と照明がある", label: "施工後" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "洗面所を新しくつくる工事です。完成した洗面所には、木のカウンターに載せた白い角形の洗面ボウル、鏡の扉が付いた収納、壁の照明があります。",
      "洗面台は、カウンターの下を空けた形です。水とお湯の管と排水の管が、床からまっすぐ立ち上がっています。",
    ],
    points: [
      {
        title: "床から立ち上げる配管",
        body: "カウンターの下を空けた洗面台は、配管が見えます。床から管をまっすぐ立ち上げ、位置をそろえておくと、見た目が整い、床の掃除もしやすくなります。",
      },
      {
        title: "カウンターと収納は、壁の下地に固定する",
        body: "洗面ボウルを載せるカウンターや、壁に掛ける収納は、重さを支えられるよう、壁の中の下地に固定します。",
      },
    ],
    comment: null,
    beforeAfter: [],
    gallery: [{ key: "works/washroom-sink-plumbing", alt: "洗面ボウルの下。床から立ち上がる水とお湯の管と、排水の管", label: "施工後" }],
    source: { type: "line", postedAt: "2026-10-20" },
  },
  {
    slug: "aircon-ceiling-unit-replacement",
    title: "特殊な形のエアコンからの取り替え ── 天井に付いた室内機を、壁掛けに",
    keyword: "天井 エアコン 壁掛け 取り替え 施工事例",
    services: ["air-conditioner"],
    category: "エアコン",
    summary: "天井に付いていた、横に長い室内機のエアコンを、壁掛けのエアコンに取り替えました。",
    cover: { key: "works/aircon-ceiling-after", alt: "取り替えたあとの、壁掛けのエアコンの室内機", label: "施工後" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "取り替える前のエアコンは、室内機が天井に付いている、一般的な壁掛けのエアコンとは形の違う機種でした。",
      "新しいエアコンは壁掛けの機種にし、配管は壁に沿わせて通しています。",
    ],
    points: [
      {
        title: "取り付ける位置を決め直す",
        body: "形の違うエアコンに替えるときは、室内機を付ける位置と、配管の穴や通り道が変わることがあります。壁の強さと配管の経路を確かめてから、取り付ける位置を決めます。",
      },
    ],
    comment: null,
    beforeAfter: [
      {
        title: "室内機",
        before: { key: "works/aircon-ceiling-before", alt: "取り替える前の、天井に付いた横に長い室内機", label: "施工前" },
        after: { key: "works/aircon-ceiling-after", alt: "取り替えたあとの、壁掛けの室内機", label: "施工後" },
      },
    ],
    gallery: [],
    source: { type: "line", postedAt: "2026-10-20" },
  },
  {
    slug: "gas-aircon-replacement",
    title: "ガスエアコンからの取り替え",
    keyword: "ガスエアコン 取り替え 施工事例",
    services: ["air-conditioner"],
    category: "エアコン",
    summary: "ガスを使って動くエアコン（ガスエアコン）を、新しいエアコンに取り替えました。取り替える前と、取り替えたあとの室外機の写真です。",
    cover: { key: "works/gas-aircon-after-outdoor", alt: "取り替えたあとの、新しいエアコンの室外機。配管は化粧カバーに収めて、外壁に沿わせている", label: "施工後" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "ガスエアコンを、新しいエアコンに取り替えた工事です。取り替える前の室外機には、ガスの配管がつながっていました。",
      "新しいエアコンの室外機は、建物の外の地面に近い位置に置き、配管は化粧カバーに収めて、外壁に沿わせています。",
    ],
    points: [
      {
        title: "電源を確かめる",
        body: "ガスエアコンから取り替えるときは、新しいエアコンに合う専用のコンセントがあるか、電圧が合うかを、取り付けの前に確かめます。",
      },
      {
        title: "配管を化粧カバーに収める",
        body: "室外機から室内機までの配管をカバーに収めると、日差しと雨が配管に直接当たらなくなり、外から見たときの線もそろいます。",
      },
    ],
    comment: null,
    beforeAfter: [
      {
        title: "室外機",
        before: { key: "works/gas-aircon-before-outdoor", alt: "取り替える前の、ガスエアコンの室外機。横にガスの配管がつながっている", label: "施工前" },
        after: { key: "works/gas-aircon-after-outdoor", alt: "取り替えたあとの、新しいエアコンの室外機と配管のカバー", label: "施工後" },
      },
    ],
    gallery: [{ key: "works/gas-aircon-gas-cock", alt: "取り替える前の室外機につながっていた、ガスの配管のガス栓", label: "施工前" }],
    source: { type: "line", postedAt: "2026-10-20" },
  },
  {
    slug: "unit-bath-reform",
    title: "ユニットバスリフォーム ── 壁と天井を外し、新しい浴槽を据えるまで",
    keyword: "ユニットバス リフォーム 施工事例",
    services: ["reform"],
    category: "浴室",
    summary: "浴室を新しいユニットバスに入れ替える工事の、途中の写真です。もとの浴室の壁と天井を外し、新しいユニットバスの床と浴槽を据えたところです。",
    cover: { key: "works/unit-bath-tub-set", alt: "新しいユニットバスの床と浴槽を据えたところ。床は保護のシートで覆われ、壁はまだ下地の板が見えている", label: "施工中" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "浴室を、新しいユニットバスに入れ替える工事です。写真は工事の途中で、もとの浴室の壁と天井を外し、新しいユニットバスの床と浴槽を据えたところです。",
      "壁と天井を外すと、柱や下地の板、換気扇のダクト、配管と配線が見えるようになります。このあと、壁と天井のパネルを組み立てていきます。",
    ],
    points: [
      {
        title: "壁の中を確かめられる機会",
        body: "壁と天井を外したときは、ふだん見えない柱や下地、配管の状態を確かめられる機会です。傷みが見つかったときは、ユニットバスを組む前に直しておくのが基本です。",
      },
      {
        title: "配管と換気の位置を合わせる",
        body: "新しいユニットバスの水栓や排水口、換気扇の位置に合わせて、配管とダクトをつなぎ直します。",
      },
    ],
    comment: null,
    beforeAfter: [],
    gallery: [{ key: "works/unit-bath-walls-open", alt: "壁と天井を外した浴室。下地の板と、換気扇のダクト、窓が見える", label: "施工中" }],
    source: { type: "line", postedAt: "2026-10-20" },
  },
  {
    slug: "balcony-high-pressure-washing",
    title: "マンションのベランダの高圧洗浄",
    keyword: "マンション ベランダ 高圧洗浄 施工事例",
    services: ["exterior-painting"],
    category: "高圧洗浄",
    summary: "マンションのベランダの床と壁の汚れを、高圧洗浄で落としました。洗浄の前と、洗浄したあとの写真です。",
    cover: { key: "works/balcony-wash-after", alt: "高圧洗浄のあとのベランダ。床の黒ずみと、壁のコケが落ちている", label: "施工後" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "マンションのベランダを、高圧洗浄で掃除しました。洗浄の前は、床一面に黒ずみが広がり、壁の下のほうにはコケが付いていました。",
      "洗浄したあとは、床の黒ずみと壁のコケが落ち、床のもとの色が見えるようになりました。",
    ],
    points: [
      {
        title: "水の流れる先を確かめる",
        body: "マンションのベランダは、排水の溝や排水口で、となりの住戸とつながっていることがあります。洗浄の前に、水の流れる先を確かめておきます。",
      },
      {
        title: "排水口に汚れを残さない",
        body: "洗い流した汚れは、排水口に集まります。最後に排水口のまわりまで洗い、詰まりの原因を残さないことが大切です。",
      },
    ],
    comment: null,
    beforeAfter: [
      {
        title: "ベランダの床",
        before: { key: "works/balcony-wash-before", alt: "洗浄の前のベランダ。床に黒ずみが広がり、壁の下にコケが付いている", label: "施工前" },
        after: { key: "works/balcony-wash-after", alt: "高圧洗浄のあとの、ベランダの床と壁", label: "施工後" },
      },
    ],
    gallery: [],
    source: { type: "line", postedAt: "2026-10-20" },
  },
  {
    slug: "water-heater-flue-replacement",
    title: "煙突（排気筒）付きの給湯器の交換",
    keyword: "給湯器 煙突 交換 施工事例",
    services: ["water-heater"],
    category: "給湯器",
    summary: "屋内に設置された、煙突（排気筒）付きのガス給湯器の交換です。屋内に置く給湯器は、燃やしたあとの空気を、上につながる排気筒から外へ出します。",
    cover: { key: "works/water-heater-flue", alt: "上に煙突（排気筒）がつながる、屋内に設置されたガス給湯器" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "屋内に設置された、ガス給湯器の交換工事です。写真の給湯器は、壁に囲まれた屋内の場所に設置され、本体の上から煙突（排気筒）が伸びています。",
    ],
    points: [
      {
        title: "排気筒のつなぎ目と経路を確かめる",
        body: "屋内の給湯器の交換では、本体だけでなく、排気筒のつなぎ目と、外までの経路も確かめます。排気が漏れると、一酸化炭素中毒の危険があるためです。",
      },
    ],
    comment: null,
    beforeAfter: [],
    gallery: [],
    source: { type: "line", postedAt: "2026-10-20" },
  },
  {
    slug: "attic-wiring",
    title: "屋根裏に配線を通す工事",
    keyword: "屋根裏 配線 施工事例",
    services: ["other"],
    category: "配線工事",
    summary: "屋根裏（天井の上）を通して、配線を通す工事です。屋根裏を通すと、部屋の壁や天井を大きくはがさずに、離れた場所まで配線できる場合があります。",
    cover: { key: "works/attic-wiring", alt: "屋根裏の様子。屋根を支える骨組みの下に、断熱材が敷かれている" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "屋根裏を通して、配線を必要な場所まで引く工事です。写真は、配線を通す屋根裏の様子で、屋根を支える骨組みの下に、断熱材が敷かれています。",
    ],
    points: [
      {
        title: "天井を踏み抜かない",
        body: "屋根裏の床は、下の部屋の天井の板です。梁の上を伝って動き、天井の板を踏み抜かないようにすることが欠かせません。",
      },
      {
        title: "断熱材を元に戻す",
        body: "屋根裏には、断熱材が敷かれています。配線のために動かした断熱材は、すき間ができないよう元に戻すことが大切です。",
      },
    ],
    comment: null,
    beforeAfter: [],
    gallery: [],
    source: { type: "line", postedAt: "2026-10-20" },
  },
  {
    slug: "aircon-replace-decorative-cover",
    title: "エアコン取替工事 ── 配管を化粧テープ仕上げから化粧カバー仕上げへ",
    keyword: "エアコン 取替 化粧カバー 施工事例",
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
    source: { type: "instagram", url: "https://www.instagram.com/p/Ddi5h4wE-Zo/", postedAt: "2026-09-21" },
  },
  {
    slug: "aircon-high-place-replacement",
    title: "他社で断られた、高所でのエアコン取替",
    keyword: "エアコン 高所 取替 施工事例",
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
    source: { type: "instagram", url: "https://www.instagram.com/p/Dd1IwHKTYlD/", postedAt: "2026-09-28" },
  },
  {
    slug: "aircon-replace-two-units",
    title: "エアコン取替工事（2台）── 室内機・室外機の入れ替え",
    keyword: "エアコン 2台 取替 施工事例",
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
    source: { type: "instagram", url: "https://www.instagram.com/p/Ddi6XETk-D9/", postedAt: "2026-09-21" },
  },
  {
    slug: "air-conditioning-pipe-lagging",
    title: "空調配管のラッキングカバー施工",
    keyword: "空調配管 ラッキングカバー 施工事例",
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
    source: { type: "instagram", url: "https://www.instagram.com/p/DdnqvlSEz4N/", postedAt: "2026-09-23" },
  },
  {
    slug: "bathroom-heater-dryer-rinnai",
    title: "リンナイの浴室暖房乾燥機の施工",
    keyword: "リンナイ 浴室暖房乾燥機 交換 施工事例",
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
    source: { type: "instagram", url: "https://www.instagram.com/p/Dd3kKouE_63/", postedAt: "2026-09-29" },
  },
  {
    slug: "wood-deck-installation",
    title: "ウッドデッキの設置 ── 整地から完成まで",
    keyword: "ウッドデッキ 設置 施工事例",
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
    source: { type: "instagram", url: "https://www.instagram.com/p/DdvwRtrk-4n/", postedAt: "2026-09-26" },
  },
  {
    slug: "cupboard-installation",
    title: "キッチンのカップボード設置 ── 施工前から完成まで",
    keyword: "カップボード 設置 施工事例",
    services: ["reform", "kitchen-equipment"],
    category: "キッチン",
    summary: "キッチンの背面に、吊り戸棚とカウンターが一体になったカップボード（食器棚）を設置しました。施工前から完成までの写真です。",
    cover: { key: "works/cupboard", alt: "キッチンの背面に設置した、青い扉のカップボード", label: "施工後" },
    area: null,
    completedAt: null,
    duration: null,
    products: [],
    worry: null,
    content: [
      "キッチンの背面の壁に、カップボードを設置しました。上に吊り戸棚、下に引き出しの収納、その間が家電を置けるカウンターになっています。",
      "床に養生のマットを敷き、まず端の背の高い収納を据えました。壁に取り付け位置の印を付けてから、吊り戸棚、下の引き出し収納、カウンターの天板の順に取り付けています。",
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
    // 施工前と工程の写真は、会社から受け取ったもの（2026-10-09。LINE のアルバム「カップボード完成まで」）。冒頭の写真は Instagram の投稿
    beforeAfter: [
      {
        title: "施工前と設置後",
        before: { key: "works/cupboard-before-wall", alt: "カップボードを設置する前の、何も置かれていないキッチン背面の壁", label: "施工前" },
        after: { key: "works/cupboard-counter-fitted", alt: "カウンターの天板まで取り付けた、設置後のカップボード", label: "施工後" },
      },
    ],
    gallery: [
      { key: "works/cupboard-step-tall-unit", alt: "端に背の高い収納を据え、壁に取り付け位置の印を付けたところ", label: "施工中" },
      { key: "works/cupboard-step-wall-cabinets", alt: "壁に吊り戸棚を取り付けたところ。下の収納は、これから据える", label: "施工中" },
      { key: "works/cupboard-step-base-cabinets", alt: "下の引き出し収納を据えたところ。カウンターの天板を載せる前", label: "施工中" },
    ],
    source: { type: "instagram", url: "https://www.instagram.com/p/DdtS3dmTOlS/", postedAt: "2026-09-25" },
    updatedAt: "2026-10-09",
  },
  {
    slug: "exterior-roof-painting-process",
    title: "外壁塗装・屋根塗装 ── 施工の工程をご紹介",
    keyword: "外壁塗装 屋根塗装 施工事例",
    services: ["exterior-painting", "roof-painting"],
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
    source: { type: "instagram", url: "https://www.instagram.com/p/DeEXKZwzic1/", postedAt: "2026-10-04" },
  },
];

/** 新しい順（Instagram の投稿日・写真を受け取った日。同じ日の事例は、配列の順） */
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

/** 代表サービスがそのサービスの事例（サービス別の事例一覧のページに出すもの） */
export function worksOfMainService(serviceSlug: string): Work[] {
  return worksSorted.filter((w) => w.services[0] === serviceSlug);
}

/** サービス別の事例一覧のページを持つサービスのスラッグ（事例が MIN_WORKS_FOR_LIST 件以上あるもの） */
export function serviceSlugsWithWorkList(): string[] {
  const count = new Map<string, number>();
  for (const w of works) count.set(w.services[0], (count.get(w.services[0]) ?? 0) + 1);
  return [...count.entries()].filter(([, n]) => n >= MIN_WORKS_FOR_LIST).map(([slug]) => slug);
}

/** サービス別の事例一覧のページの URL（ページが無いサービスでは undefined） */
export function workListPath(serviceSlug: string): string | undefined {
  return serviceSlugsWithWorkList().includes(serviceSlug) ? `/works/service/${serviceSlug}` : undefined;
}

/** サービス別の事例一覧のページの検索語（例：エアコン 施工事例） */
export function workListKeyword(serviceShortName: string): string {
  return `${serviceShortName} 施工事例`;
}

/** 題名の主な部分（「 ── 」より前） */
export function workShortTitle(w: Work): string {
  return w.title.split(" ── ")[0];
}

/** 画面の見出し・一覧に出す題名（地域が分かっている事例は、先頭に地域名を付ける。例：横浜市戸塚区｜給湯器交換） */
export function workDisplayTitle(w: Work): string {
  return w.area ? `${w.area.label}｜${w.title}` : w.title;
}

/** 内容を最後に直した日 */
export function workUpdatedAt(w: Work): string {
  return w.updatedAt ?? w.source.postedAt;
}

/** 一覧の絞り込みに使う区分 */
export const workCategories: string[] = Array.from(new Set(worksSorted.map((w) => w.category)));
