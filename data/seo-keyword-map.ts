/**
 * 検索語の割り当て表（どの検索語を、どの URL で取りにいくか）。
 *
 * 決まり
 *   - **1つの検索意図は、1つの URL だけが担当する。** 同じ検索語を2つのページに割り当てない。
 *   - ページを増やす前に、ここに1行足す。すでに担当のページがある検索語なら、新しいページは作らず、担当のページを直す。
 *   - コラムの記事と施工事例は、数が増えていくので、ここには書かない。記事は frontmatter の keywords（先頭が主キーワード）、
 *     施工事例は data/works.ts の keyword、これから書く題材は lib/blog-generator/topics.ts の keyword に書く。
 *     ここの表と合わせた全体は lib/seo-map.ts が組み立て、重複は npm run seo:audit が知らせる（重複があるとビルド後の検査が失敗する）。
 *   - 関連するサービス・施工事例・記事は、それぞれのデータのつながり（works の services、記事の relatedServices など）から
 *     自動で求める（ここに二重に書かない）。一覧は docs/seo-audit-report.md に出る。
 *
 * 項目
 *   url               … ページの URL
 *   primaryKeyword    … 代表の検索語（title と h1 に、この語の言葉が入っていること）
 *   secondaryKeywords … 同じページで拾う、近い検索語
 *   searchIntent      … 検索する人が知りたいこと・したいこと
 *   contentType       … ページの種類
 *   parentTopic       … 上位のページ（Topic Cluster の親）。トップは null
 *   cedes             … このページでは取りにいかない検索語と、その担当のページ（取り合いを避けた記録）
 *
 * このファイルは、クライアント側のコンポーネントからも読めるよう、fs などサーバー専用のモジュールを import しない。
 */
export type SeoContentType = "home" | "hub" | "service" | "area" | "company" | "support" | "blog-hub" | "works-hub" | "works-list" | "work" | "article" | "blog-category";

export type SeoPageEntry = {
  url: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  contentType: SeoContentType;
  parentTopic: string | null;
  cedes?: { keyword: string; to: string }[];
};

export const seoPages: SeoPageEntry[] = [
  /* ── トップ・案内のページ ── */
  {
    url: "/",
    primaryKeyword: "横浜総合住設",
    secondaryKeywords: ["ヨコジュウ", "株式会社横浜総合住設", "横浜 総合住宅設備会社"],
    searchIntent: "会社を名前で探している／戸塚区で、住まいの工事をまとめて頼める会社かどうかを知りたい",
    contentType: "home",
    parentTopic: null,
    cedes: [
      { keyword: "戸塚区 住宅設備", to: "/area/totsuka" },
      { keyword: "戸塚区 リフォーム", to: "/service/reform" },
      { keyword: "戸塚区 給湯器交換", to: "/service/water-heater" },
      { keyword: "戸塚区 エアコン工事", to: "/service/air-conditioner" },
    ],
  },
  {
    url: "/service",
    primaryKeyword: "横浜総合住設 事業内容",
    secondaryKeywords: ["横浜総合住設 サービス一覧", "住宅設備工事 種類"],
    searchIntent: "この会社に何を頼めるのかを、一覧で知りたい",
    contentType: "hub",
    parentTopic: "/",
  },
  {
    url: "/works",
    primaryKeyword: "横浜総合住設 施工事例",
    secondaryKeywords: ["住宅設備 施工事例 横浜", "横浜総合住設 実績"],
    searchIntent: "この会社が実際にどんな工事をしているのかを、写真で確かめたい",
    contentType: "works-hub",
    parentTopic: "/",
  },
  {
    url: "/area",
    primaryKeyword: "横浜総合住設 対応エリア",
    secondaryKeywords: ["住宅設備工事 対応エリア 神奈川 東京"],
    searchIntent: "自分の住んでいる地域に来てもらえるかを知りたい",
    contentType: "hub",
    parentTopic: "/",
  },
  {
    url: "/business",
    primaryKeyword: "住宅設備 協力業者 横浜",
    secondaryKeywords: ["設備工事 協力会社 神奈川", "工務店 設備工事 依頼", "ハウスメーカー 設備工事 外注"],
    searchIntent: "工務店・法人として、設備工事を任せられる協力先を探している",
    contentType: "support",
    parentTopic: "/",
  },
  {
    url: "/company",
    primaryKeyword: "横浜総合住設 会社概要",
    secondaryKeywords: ["横浜総合住設 所在地", "横浜総合住設 戸塚オフィス", "横浜総合住設 代表", "横浜総合住設 代表挨拶"],
    searchIntent: "会社の所在地・連絡先・事業内容と、代表の考えを確かめたい",
    contentType: "company",
    parentTopic: "/",
  },
  {
    url: "/flow",
    primaryKeyword: "住宅設備 工事の流れ",
    secondaryKeywords: ["現地調査 見積もり 流れ", "横浜総合住設 工事の流れ"],
    searchIntent: "問い合わせてから工事が終わるまで、何がどの順に進むのかを知りたい",
    contentType: "support",
    parentTopic: "/",
  },
  {
    url: "/faq",
    primaryKeyword: "横浜総合住設 よくある質問",
    secondaryKeywords: ["住宅設備工事 見積もり 無料 質問"],
    searchIntent: "見積もり・対応エリア・補助金など、頼む前の疑問を確かめたい",
    contentType: "support",
    parentTopic: "/",
  },
  {
    url: "/contact",
    primaryKeyword: "横浜総合住設 問い合わせ",
    secondaryKeywords: ["横浜総合住設 見積もり 依頼", "横浜総合住設 LINE"],
    searchIntent: "見積もり・相談を、電話・LINE・フォームで申し込みたい",
    contentType: "support",
    parentTopic: "/",
  },
  {
    url: "/privacy",
    primaryKeyword: "横浜総合住設 プライバシーポリシー",
    secondaryKeywords: [],
    searchIntent: "個人情報の取り扱いを確かめたい",
    contentType: "support",
    parentTopic: "/",
  },
  {
    url: "/blog",
    primaryKeyword: "住宅設備 コラム",
    secondaryKeywords: ["横浜総合住設 コラム"],
    searchIntent: "設備の選び方・交換の時期・制度について、読みものを探している",
    contentType: "blog-hub",
    parentTopic: "/",
  },

  /* ── 地域 ── */
  {
    url: "/area/totsuka",
    primaryKeyword: "戸塚区 住宅設備",
    secondaryKeywords: ["横浜市戸塚区 住宅設備", "戸塚区 住宅設備工事", "戸塚区 住宅設備 業者"],
    searchIntent: "戸塚区で、住宅設備の工事を頼める地元の会社と、この地域の住まいならではの注意点を知りたい",
    contentType: "area",
    parentTopic: "/area",
    cedes: [
      { keyword: "戸塚区 リフォーム", to: "/service/reform" },
      { keyword: "戸塚区 給湯器交換", to: "/service/water-heater" },
      { keyword: "戸塚区 エコキュート", to: "/service/ecocute" },
      { keyword: "戸塚区 エアコン工事", to: "/service/air-conditioner" },
      { keyword: "戸塚区 外壁塗装", to: "/service/exterior-painting" },
    ],
  },
  {
    url: "/area/yokohama",
    primaryKeyword: "横浜市 住宅設備",
    secondaryKeywords: ["横浜市 住宅設備工事", "横浜市 住宅設備 補助制度", "横浜市 省エネ設備 ポイント還元"],
    searchIntent: "横浜市で住宅設備の工事を頼める会社と、市の支援制度を知りたい",
    contentType: "area",
    parentTopic: "/area",
    cedes: [
      { keyword: "横浜市 給湯器交換", to: "/service/water-heater" },
      { keyword: "横浜市 外壁塗装", to: "/service/exterior-painting" },
      { keyword: "横浜市 エコキュート", to: "/service/ecocute" },
    ],
  },

  /* ── サービス（Pillar） ── */
  {
    url: "/service/water-heater",
    primaryKeyword: "戸塚区 給湯器交換",
    secondaryKeywords: ["戸塚区 給湯器", "横浜市 給湯器交換", "ガス給湯器 交換", "エコジョーズ 交換", "戸塚区 給湯器 交換 費用"],
    searchIntent: "戸塚区・横浜市で、ガス給湯器（エコジョーズを含む）の交換を頼める会社と、交換の判断材料を知りたい",
    contentType: "service",
    parentTopic: "/service",
    cedes: [
      { keyword: "戸塚区 エコキュート", to: "/service/ecocute" },
      { keyword: "エネファーム 交換", to: "/service/ene-farm" },
      { keyword: "給湯器 交換時期", to: "/blog/water-heater-replacement-signs" },
      { keyword: "給湯器 号数", to: "/blog/water-heater-capacity-guide" },
    ],
  },
  {
    url: "/service/ecocute",
    primaryKeyword: "戸塚区 エコキュート",
    secondaryKeywords: ["戸塚区 エコキュート交換", "横浜市 エコキュート", "エコキュート 交換", "エコキュート 設置場所", "エコキュート 費用", "エコキュート 故障", "エコキュート 補助金"],
    searchIntent: "戸塚区・横浜市で、エコキュートの交換・新設を頼める会社と、設置できる条件・補助金を知りたい",
    contentType: "service",
    parentTopic: "/service",
    cedes: [
      { keyword: "エコキュート 搬入経路", to: "/blog/totsuka-ecocute-carry-in-route" },
      { keyword: "給湯省エネ2026事業", to: "/blog/kyutou-shoene-2026-outline" },
    ],
  },
  {
    url: "/service/ene-farm",
    primaryKeyword: "エネファーム 交換",
    secondaryKeywords: ["エネファーム 撤去", "エネファーム 給湯器 交換", "横浜 エネファーム 撤去", "戸塚区 エネファーム", "エネファーム やめる"],
    searchIntent: "エネファームをやめて、別の給湯器に取り替えたい。撤去まで頼める会社を探している",
    contentType: "service",
    parentTopic: "/service",
  },
  {
    url: "/service/eco-one",
    primaryKeyword: "ECO ONE 設置",
    secondaryKeywords: ["エコワン 交換", "ハイブリッド給湯器 横浜", "戸塚区 エコワン", "ECO ONE 補助金", "リンナイ ハイブリッド給湯器 設置"],
    searchIntent: "ECO ONE（ハイブリッド給湯器）の仕組みと、自分の家に向くか、設置を頼める会社を知りたい",
    contentType: "service",
    parentTopic: "/service",
  },
  {
    url: "/service/toilet",
    primaryKeyword: "戸塚区 トイレ交換",
    secondaryKeywords: ["戸塚区 トイレリフォーム", "横浜市 トイレ交換", "トイレ 交換 費用", "トイレ 水漏れ 交換"],
    searchIntent: "戸塚区・横浜市で、便器の交換やトイレのリフォームを頼める会社を探している",
    contentType: "service",
    parentTopic: "/service",
    cedes: [{ keyword: "トイレ 排水芯", to: "/blog/toilet-drain-position-check" }],
  },
  {
    url: "/service/air-conditioner",
    primaryKeyword: "戸塚区 エアコン工事",
    secondaryKeywords: ["戸塚区 エアコン取り付け", "戸塚区 エアコン交換", "横浜市 エアコン工事", "エアコン 高所 工事", "業務用エアコン 横浜"],
    searchIntent: "戸塚区・横浜市で、エアコンの取り付け・交換（高所や取り付けにくい場所を含む）を頼める会社を探している",
    contentType: "service",
    parentTopic: "/service",
    cedes: [{ keyword: "エアコン 化粧カバー", to: "/blog/aircon-pipe-tape-or-cover" }],
  },
  {
    url: "/service/exterior-painting",
    primaryKeyword: "戸塚区 外壁塗装",
    secondaryKeywords: ["横浜市戸塚区 外壁塗装", "横浜市 外壁塗装", "戸塚区 外壁 塗り替え", "戸塚区 外壁塗装 見積もり"],
    searchIntent: "戸塚区・横浜市で、外壁の塗り替えを頼める会社と、塗り替えの判断材料を知りたい",
    contentType: "service",
    parentTopic: "/service",
    cedes: [
      { keyword: "戸塚区 屋根塗装", to: "/service/roof-painting" },
      { keyword: "外壁塗装 3回塗り", to: "/blog/exterior-painting-three-coats" },
    ],
  },
  {
    url: "/service/roof-painting",
    primaryKeyword: "戸塚区 屋根塗装",
    secondaryKeywords: ["横浜市 屋根塗装", "戸塚区 屋根 塗り替え", "屋根塗装 費用", "屋根塗装 時期", "スレート屋根 塗装"],
    searchIntent: "戸塚区・横浜市で、屋根の塗り替えを頼める会社と、塗装が要るかどうかの判断材料を知りたい",
    contentType: "service",
    parentTopic: "/service",
    cedes: [{ keyword: "戸塚区 外壁塗装", to: "/service/exterior-painting" }],
  },
  {
    url: "/service/solar",
    primaryKeyword: "戸塚区 太陽光発電",
    secondaryKeywords: ["戸塚区 太陽光", "横浜市 太陽光発電 設置", "戸塚区 太陽光パネル 設置"],
    searchIntent: "戸塚区・横浜市で、太陽光発電の設置を頼める会社と、屋根の条件・制度を知りたい",
    contentType: "service",
    parentTopic: "/service",
  },
  {
    url: "/service/storage-battery",
    primaryKeyword: "戸塚区 蓄電池",
    secondaryKeywords: ["横浜市 蓄電池 設置", "戸塚区 家庭用蓄電池", "蓄電池 設置 工事"],
    searchIntent: "戸塚区・横浜市で、家庭用蓄電池の設置を頼める会社と、選び方・制度を知りたい",
    contentType: "service",
    parentTopic: "/service",
  },
  {
    url: "/service/kitchen-equipment",
    primaryKeyword: "戸塚区 ビルトインコンロ 交換",
    secondaryKeywords: ["戸塚区 レンジフード 交換", "横浜市 ガスコンロ 交換", "レンジフード 交換 費用", "ビルトインコンロ 交換 費用"],
    searchIntent: "戸塚区・横浜市で、ビルトインコンロやレンジフードの交換を頼める会社を探している",
    contentType: "service",
    parentTopic: "/service",
  },
  {
    url: "/service/reform",
    primaryKeyword: "戸塚区 リフォーム",
    secondaryKeywords: ["横浜市戸塚区 リフォーム会社", "戸塚区 キッチンリフォーム", "戸塚区 浴室リフォーム", "戸塚区 水まわりリフォーム", "戸塚区 内装リフォーム"],
    searchIntent: "戸塚区で、水まわりや内装のリフォームをまとめて頼める会社を探している",
    contentType: "service",
    parentTopic: "/service",
    cedes: [
      { keyword: "戸塚区 トイレリフォーム", to: "/service/toilet" },
      { keyword: "リフォーム 解体工事", to: "/service/demolition" },
    ],
  },
  {
    url: "/service/demolition",
    primaryKeyword: "リフォーム 解体工事",
    secondaryKeywords: ["内装解体 横浜", "戸塚区 解体 リフォーム", "キッチン 浴室 解体 撤去", "戸塚区 解体工事"],
    searchIntent: "リフォームに伴う解体（内装・設備の撤去）を、工事と合わせて頼みたい。※建物をまるごと壊す解体は対応していないことを、ページの冒頭で伝える",
    contentType: "service",
    parentTopic: "/service",
  },
  {
    url: "/service/garden",
    primaryKeyword: "戸塚区 外構工事",
    secondaryKeywords: ["戸塚区 外構", "戸塚区 造園", "戸塚区 庭木 剪定", "戸塚区 ウッドデッキ", "横浜市 庭木 伐採"],
    searchIntent: "戸塚区・横浜市で、庭木の手入れや外構の工事を頼める会社を探している",
    contentType: "service",
    parentTopic: "/service",
  },
  {
    url: "/service/other",
    primaryKeyword: "浴室暖房乾燥機 交換 横浜",
    secondaryKeywords: ["戸塚区 浴室暖房乾燥機", "内窓 設置 戸塚区", "カップボード 設置 横浜", "水栓 交換 戸塚区"],
    searchIntent: "浴室暖房乾燥機・内窓・水栓など、専用のページが無い設備の工事を頼めるかを知りたい",
    contentType: "service",
    parentTopic: "/service",
    cedes: [{ keyword: "戸塚区 住宅設備工事", to: "/area/totsuka" }],
  },
];

/** 比べるために、検索語をそろえる（空白の違い・語の順番の違いを同じものとして扱う） */
export function normalizeKeyword(k: string): string {
  return k
    .toLowerCase()
    .replace(/[\s　]+/g, " ")
    .trim()
    .split(" ")
    .sort()
    .join(" ");
}

/** 固定ページが担当している検索語（そろえた形）→ 担当の URL。記事や題材が同じ語を狙っていないかの判定に使う */
export function fixedKeywordOwners(): Map<string, string> {
  const map = new Map<string, string>();
  for (const p of seoPages) for (const k of [p.primaryKeyword, ...p.secondaryKeywords]) map.set(normalizeKeyword(k), p.url);
  return map;
}

export function seoPageFor(url: string): SeoPageEntry | undefined {
  return seoPages.find((p) => p.url === url);
}

/** そのページの検索語（meta keywords 用。先頭が主キーワード）。表に無いページは undefined */
export function keywordsFor(url: string): string[] | undefined {
  const p = seoPageFor(url);
  return p ? [p.primaryKeyword, ...p.secondaryKeywords] : undefined;
}
