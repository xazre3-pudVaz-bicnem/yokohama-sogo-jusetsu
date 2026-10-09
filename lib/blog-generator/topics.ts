import type { BlogClusterId } from "@/data/services/types";

/**
 * コラムの題材の一覧（自動投稿はここから1日1本を選ぶ。ランダムには書かせない）。
 *
 * 1題材 ＝ 1検索意図 ＝ 1主キーワード。題材ごとに、カテゴリ（SEO クラスタ）・主キーワード・答える検索意図・
 * 書く内容・関連するサービス・使ってよい事実シートの節・優先度を決めておく。
 * ここにあるのは「すぐに書ける」題材だけ。まだ書けない候補（事実の確認が要るものなど）は backlog.ts に置く。
 *
 * 選び方（generate.ts の pickTopic）
 *   1. すでに記事がある題材（slug が同じ・主キーワードが同じ・検索意図が近い）は選ばない
 *   2. 優先度の高い順（P0 → P1 → P2）
 *   3. 同じ優先度の中では、記事の少ないカテゴリを先に（カテゴリの偏りをなくす）
 *   4. それも同じなら、この配列の上から順に
 *
 * 優先度の付け方（docs/SEO_ROADMAP.md）
 *   P0 … 親ページ（サービスページ）を直接支える題材、当社の施工事例にもとづいて書ける題材
 *   P1 … 公式の出典つきの事実で書ける、検索する人の多い疑問
 *   P2 … そのほか（数値を伴わない仕組みの説明など）
 *
 * 題材を足すとき
 *   - slug は半角の英小文字とハイフン。公開後は変えない（URL になる）
 *   - keyword は、ほかの題材・公開済みの記事・固定ページ（data/seo-keyword-map.ts）と同じ語にしない
 *     （npm run seo:audit と npm run blog:selftest が、重なりを知らせる）
 *   - 数値や制度に触れる題材は、先に docs/VERIFIED_FACTS.md に出典つきで事実を足し、facts にその節の名前を書く
 *   - 固定ページ（サービス・地域）と同じ検索意図の題材は作らない。そのページを直す
 */
export type TopicPriority = "P0" | "P1" | "P2";

export type Topic = {
  slug: string;
  cluster: BlogClusterId;
  /** 主キーワード（この記事が代表になる検索語。記事の keywords の先頭に入る） */
  keyword: string;
  /** この記事が答える検索意図（重複の判定にも使う） */
  intent: string;
  /** 書く順番の優先度 */
  priority: TopicPriority;
  /** タイトルの方向（そのまま使わなくてよい） */
  titleHint: string;
  /** 書く内容（見出しの候補・必ず触れる点） */
  angle: string[];
  /** 関連するサービス（先頭が親ページ） */
  services: string[];
  /** 関連する地域ページ */
  areas?: string[];
  /** 使ってよい事実シートの節（前方一致）。「会社」「施工事例」「設備の一般的な知識」は常に渡す */
  facts: string[];
  /** 本文からリンクする施工事例 */
  works?: string[];
};

export const topics: Topic[] = [
  /* ── 給湯器 ── */
  {
    slug: "water-heater-error-first-steps",
    cluster: "water-heater",
    keyword: "給湯器 エラー 対処",
    intent: "給湯器にエラーが出たときに最初にすることを知りたい",
    priority: "P0",
    titleHint: "給湯器にエラーが出たら。業者を呼ぶ前に確かめる3つのこと",
    angle: ["エラーの番号を控える", "リモコンの電源の入れ直しは1回まで", "音・におい・水漏れがあるときは使わない", "連絡するときに伝えること（型番・番号・症状・写真）"],
    services: ["water-heater"],
    facts: ["ガス給湯器・エアコンの標準使用期間"],
  },
  {
    slug: "water-heater-installation-types",
    cluster: "water-heater",
    keyword: "給湯器 設置タイプ 壁掛け 据置",
    intent: "給湯器の設置タイプの違いと交換時の注意を知りたい",
    priority: "P1",
    titleHint: "給湯器の設置タイプ（壁掛け・据置・パイプスペース）と交換のときの注意",
    angle: ["壁掛け・据置・パイプスペース設置の見分け方", "同じ形に入れ替えるのが基本", "マンションは管理規約と排気の向き", "型番のシールの見方"],
    services: ["water-heater"],
    facts: ["給湯器の号数"],
  },
  {
    slug: "water-heater-auto-vs-full-auto",
    cluster: "water-heater",
    keyword: "給湯器 オート フルオート 違い",
    intent: "給湯器のオートとフルオートの違いを知りたい",
    priority: "P1",
    titleHint: "給湯器のオートとフルオートの違い。追いだき配管で選べる機能が変わる",
    angle: ["給湯専用・オート・フルオートの違い", "自動たし湯と配管の自動洗浄", "いまの浴槽の配管で選べる範囲", "家族の入浴の時間で選ぶ"],
    services: ["water-heater"],
    facts: [],
  },

  /* ── エコキュート ── */
  {
    slug: "ecocute-how-it-works",
    cluster: "ecocute",
    keyword: "エコキュート 仕組み",
    intent: "エコキュートの仕組みをやさしく知りたい",
    priority: "P1",
    titleHint: "エコキュートはなぜ空気でお湯が沸くのか。仕組みと2つのユニット",
    angle: ["エアコンの暖房と同じ原理", "ヒートポンプユニットと貯湯ユニット", "ためて使うという考え方", "ガス給湯器との違い"],
    services: ["ecocute", "eco-one"],
    facts: ["エコキュートの設置"],
  },
  {
    slug: "ecocute-tank-capacity-choice",
    cluster: "ecocute",
    keyword: "エコキュート 容量 選び方",
    intent: "エコキュートのタンク容量の選び方を知りたい",
    priority: "P0",
    titleHint: "エコキュートのタンク容量の決め方。家族の人数とお湯の使い方から",
    angle: ["4人家族なら370リットルが一般的", "お湯を多く使う家の考え方", "タンクが大きいほど置き場所と重さが増える", "薄型・スリム型という選択"],
    services: ["ecocute"],
    facts: ["エコキュートの設置"],
  },
  {
    slug: "gas-to-ecocute-switch-work",
    cluster: "ecocute",
    keyword: "ガス給湯器 エコキュート 切り替え 工事",
    intent: "ガス給湯器からエコキュートに替える工事の内容を知りたい",
    priority: "P0",
    titleHint: "ガス給湯器からエコキュートへ。切り替え工事で行う5つのこと",
    angle: ["ガス給湯器の撤去とガス事業者への連絡", "基礎とアンカーボルト", "200Vの電源と専用ブレーカー", "排水の配管", "電気の契約の見直し"],
    services: ["ecocute", "water-heater"],
    facts: ["エコキュートの設置"],
  },

  /* ── エネファーム ── */
  {
    slug: "ene-farm-inspection-notice-choice",
    cluster: "ene-farm",
    keyword: "エネファーム 点検 案内",
    intent: "エネファームの点検の案内が届いたときの選択肢を知りたい",
    priority: "P0",
    titleHint: "エネファームの点検の案内が届いたら。使い続けるか、替えるか",
    angle: ["点検は発電を続けるために必要", "メーカーごとの年数（パナソニック・アイシン）", "点検費用と取り替え費用の見積もりを並べる", "取り替える場合の3つの選択肢"],
    services: ["ene-farm", "water-heater", "eco-one"],
    facts: ["エネファーム"],
  },
  {
    slug: "ene-farm-floor-heating-after-removal",
    cluster: "ene-farm",
    keyword: "エネファーム 撤去 床暖房",
    intent: "エネファームを撤去したあとも床暖房を使う方法を知りたい",
    priority: "P1",
    titleHint: "エネファームを撤去しても床暖房は使える？熱源機の選び方",
    angle: ["床暖房の温水をつくっているのは何か", "給湯だけの機種に替えると使えなくなる", "暖房に対応した熱源機とハイブリッド給湯器", "リモコンで確かめる方法"],
    services: ["ene-farm", "eco-one"],
    facts: ["エネファーム", "ECO ONE"],
  },

  /* ── ECO ONE ── */
  {
    slug: "eco-one-vs-ecocute",
    cluster: "eco-one",
    keyword: "ECO ONE エコキュート 違い",
    intent: "ECO ONE とエコキュートの違いを知りたい",
    priority: "P1",
    titleHint: "ECO ONE とエコキュートの違い。タンクの大きさとお湯切れで比べる",
    angle: ["電気だけか、電気とガスか", "タンクの大きさ（160リットル・70リットルと370リットル）", "お湯切れの心配", "暖房に使えるか", "向いている家"],
    services: ["eco-one", "ecocute"],
    facts: ["ECO ONE", "エコキュートの設置"],
  },
  {
    slug: "eco-one-during-power-outage",
    cluster: "eco-one",
    keyword: "ECO ONE 停電",
    intent: "ECO ONE は停電のときにお湯が使えるのか知りたい",
    priority: "P1",
    titleHint: "ECO ONE は停電のときに使える？必要な電源と、使えない場合",
    angle: ["別の電源につなげば使える", "ポータブル電源・太陽光の自立運転・蓄電池", "ガスが止まった場合・両方止まった場合", "断水のときのタンクの水"],
    services: ["eco-one", "storage-battery"],
    facts: ["ECO ONE"],
  },
  {
    slug: "eco-one-subsidy-2026-check",
    cluster: "eco-one",
    keyword: "ECO ONE 補助金 条件 2026",
    intent: "ECO ONE に使える補助金と条件を知りたい",
    priority: "P1",
    titleHint: "ECO ONE に使える補助金。給湯省エネ2026事業の額と確かめる点",
    angle: ["ハイブリッド給湯機の補助額（基本額と加算）", "対象かどうかは型番で決まる", "登録された事業者が申請する", "横浜市のポイント還元事業は対象外", "期限と予算"],
    services: ["eco-one"],
    areas: ["yokohama"],
    facts: ["給湯省エネ2026事業", "横浜市・神奈川県の制度", "ECO ONE"],
  },

  /* ── エアコン ── */
  {
    slug: "aircon-repair-or-replace",
    cluster: "air-conditioner",
    keyword: "エアコン 修理 交換 判断",
    intent: "エアコンを修理するか交換するかの判断の目安を知りたい",
    priority: "P1",
    titleHint: "エアコンは修理か交換か。使った年数と症状で考える",
    angle: ["メーカーが示す10年という目安の意味", "補修用の部品の保有期限", "効きが悪い・水漏れ・ランプの点滅", "点検で分かること"],
    services: ["air-conditioner"],
    facts: ["ガス給湯器・エアコンの標準使用期間"],
  },
  {
    slug: "aircon-outdoor-unit-placement",
    cluster: "air-conditioner",
    keyword: "エアコン 室外機 置き方",
    intent: "エアコンの室外機の置き方の種類を知りたい",
    priority: "P1",
    titleHint: "エアコンの室外機、置き方は5通り。置き場所で変わる工事の内容",
    angle: ["地面・ベランダ・壁面・屋根・天吊り", "置き方ごとに必要な金具と作業", "配管が長くなる場合", "高い場所は現地の確認が先"],
    services: ["air-conditioner"],
    facts: [],
    works: ["aircon-high-place-replacement", "aircon-replace-two-units"],
  },
  {
    slug: "aircon-work-refused-high-place",
    cluster: "air-conditioner",
    keyword: "エアコン 高所 断られた",
    intent: "エアコン工事を高所だからと断られたときの対処を知りたい",
    priority: "P0",
    titleHint: "エアコンの取替を「高所だから」と断られたら。相談の前に確かめること",
    angle: ["断られる理由（足場・安全・保険）", "写真で伝えること", "現地を見れば方法が見つかることがある", "当社の事例"],
    services: ["air-conditioner"],
    areas: ["totsuka"],
    facts: ["戸塚区・横浜市"],
    works: ["aircon-high-place-replacement"],
  },
  {
    slug: "old-aircon-disposal-yokohama",
    cluster: "air-conditioner",
    keyword: "エアコン 処分 横浜市",
    intent: "横浜市で古いエアコンを処分する方法を知りたい",
    priority: "P1",
    titleHint: "古いエアコンの処分、横浜市では粗大ごみに出せない。引き取りの流れ",
    angle: ["家電リサイクル法の対象", "横浜市では回収していない", "買い替えのときは新しい製品を買う店へ", "リサイクル料金と収集・運搬料金"],
    services: ["air-conditioner"],
    areas: ["yokohama"],
    facts: ["家電リサイクル法とフロン"],
  },
  {
    slug: "commercial-aircon-freon-recovery",
    cluster: "air-conditioner",
    keyword: "業務用エアコン フロン 回収",
    intent: "業務用エアコンを入れ替えるときのフロン回収の決まりを知りたい",
    priority: "P2",
    titleHint: "業務用エアコンの入れ替えとフロンの回収。廃棄のときの決まり",
    angle: ["家庭用とは別の法律", "登録された回収業者への引き渡し", "引取証明書の保存", "家庭用エアコンとの違い"],
    services: ["air-conditioner"],
    facts: ["家電リサイクル法とフロン"],
    works: ["air-conditioning-pipe-lagging"],
  },
  {
    slug: "aircon-pipe-lagging-cover",
    cluster: "air-conditioner",
    keyword: "空調配管 ラッキング とは",
    intent: "空調配管のラッキングカバーとは何かを知りたい",
    priority: "P0",
    titleHint: "空調配管のラッキングとは。屋外の配管を守る金属のカバー",
    angle: ["保温材を金属の板で覆う仕上げ", "雨と紫外線から守る", "曲がりの部分の納め方", "家庭用の化粧カバーとの違い"],
    services: ["air-conditioner"],
    facts: [],
    works: ["air-conditioning-pipe-lagging"],
  },

  /* ── トイレ ── */
  {
    slug: "toilet-types-three-kinds",
    cluster: "toilet",
    keyword: "便器 種類 違い",
    intent: "便器の種類の違いを知りたい",
    priority: "P1",
    titleHint: "便器は3種類。組み合わせ・一体型・タンクレスの違いと選び方",
    angle: ["組み合わせ便器は便座だけ交換できる", "一体型は掃除がしやすい", "タンクレスは水圧と手洗い器", "修理のしやすさで選ぶ視点"],
    services: ["toilet"],
    facts: [],
  },
  {
    slug: "toilet-floor-renewal-timing",
    cluster: "toilet",
    keyword: "トイレ交換 床 張り替え 同時",
    intent: "トイレ交換と床の張り替えを同時にするべきか知りたい",
    priority: "P1",
    titleHint: "トイレの床は、便器を替えるときに張り替える。同時にする理由",
    angle: ["便器を外したときしか張れない場所", "古い便器の跡", "床材の選び方", "壁紙も一緒にする場合"],
    services: ["toilet", "reform"],
    facts: [],
  },
  {
    slug: "toilet-tankless-water-pressure",
    cluster: "toilet",
    keyword: "タンクレストイレ 設置 条件",
    intent: "タンクレストイレが設置できる条件を知りたい",
    priority: "P1",
    titleHint: "タンクレストイレは、どの家にも付く？水圧と手洗いの確認",
    angle: ["水道の圧力で流す仕組み", "水圧が低いと設置できない機種がある", "手洗い器を別に付ける", "停電のときの流し方は機種で違う"],
    services: ["toilet"],
    facts: [],
  },

  /* ── キッチン ── */
  {
    slug: "builtin-stove-width-60-or-75",
    cluster: "kitchen",
    keyword: "ビルトインコンロ 60cm 75cm 違い",
    intent: "ビルトインコンロの幅60cmと75cmの違いを知りたい",
    priority: "P1",
    titleHint: "ビルトインコンロの幅、60cmと75cmの違い。替えられる条件",
    angle: ["天板の幅の違いと使い勝手", "本体が収まる開口は共通のことが多い", "左右の空きの確認", "ガスの種類を確かめる"],
    services: ["kitchen-equipment"],
    facts: [],
  },
  {
    slug: "gas-stove-safety-sensor-check",
    cluster: "kitchen",
    keyword: "ガスコンロ 安全装置 確認",
    intent: "古いガスコンロの安全装置を確かめる方法を知りたい",
    priority: "P1",
    titleHint: "そのガスコンロ、安全装置は全部の口に付いている？2008年が境目",
    angle: ["2008年10月以降は全口に義務", "調理油過熱防止装置と立ち消え安全装置", "約250℃で火力を下げる仕組み", "古いコンロの見分け方"],
    services: ["kitchen-equipment"],
    facts: ["ガスコンロの安全装置", "ガス給湯器・エアコンの標準使用期間"],
  },
  {
    slug: "cupboard-installation-checkpoints",
    cluster: "kitchen",
    keyword: "カップボード 設置 確認",
    intent: "カップボードを設置する前の確認点を知りたい",
    priority: "P0",
    titleHint: "カップボードを付ける前に。壁の下地・コンセント・寸法の確認",
    angle: ["吊り戸棚は壁の下地に固定する", "家電の置き場所とコンセント", "天井までの高さと梁", "搬入の経路"],
    services: ["reform", "kitchen-equipment"],
    facts: [],
    works: ["cupboard-installation"],
  },

  /* ── レンジフード ── */
  {
    slug: "range-hood-deep-or-slim",
    cluster: "range-hood",
    keyword: "レンジフード 深型 薄型 違い",
    intent: "レンジフードの深型と薄型の違いを知りたい",
    priority: "P1",
    titleHint: "レンジフードの深型と薄型の違い。替えるときに要る部材",
    angle: ["形の違いと掃除のしやすさ", "深型から薄型に替えるときの高さのすき間", "幅と排気の向きの確認", "吊り戸棚との取り合い"],
    services: ["kitchen-equipment"],
    facts: [],
  },
  {
    slug: "stove-and-range-hood-together",
    cluster: "range-hood",
    keyword: "コンロ レンジフード 同時交換",
    intent: "コンロとレンジフードを同時に交換する利点を知りたい",
    priority: "P1",
    titleHint: "コンロとレンジフードは同時に替える？連動機能と工事の回数",
    angle: ["点火に合わせて換気扇が動く連動", "同じメーカーの対応機種でそろえる", "工事と養生が1回で済む", "片方だけ替える場合の注意"],
    services: ["kitchen-equipment"],
    facts: [],
  },

  /* ── 外壁塗装 ── */
  {
    slug: "exterior-wall-chalking-check",
    cluster: "exterior-painting",
    keyword: "外壁 チョーキング",
    intent: "外壁のチョーキングの確かめ方と意味を知りたい",
    priority: "P0",
    titleHint: "外壁を触ると白い粉が付く。チョーキングの確かめ方と塗り替えの判断",
    angle: ["なぜ粉が出るのか", "自分で確かめる方法と面ごとの違い", "ほかの4つのサイン", "すぐに塗らないと危ないのか"],
    services: ["exterior-painting"],
    facts: [],
  },
  {
    slug: "exterior-painting-estimate-reading",
    cluster: "exterior-painting",
    keyword: "外壁塗装 見積書 見方",
    intent: "外壁塗装の見積書の見方を知りたい",
    priority: "P0",
    titleHint: "外壁塗装の見積書、どこを見る？「一式」に注意する理由",
    angle: ["工程ごとに行が分かれているか", "塗料の名前が書かれているか", "足場・洗浄・下地補修・付帯部", "比べるときは範囲をそろえる"],
    services: ["exterior-painting"],
    facts: [],
    works: ["exterior-roof-painting-process"],
  },
  {
    slug: "exterior-paint-types-choice",
    cluster: "exterior-painting",
    keyword: "外壁塗装 塗料 種類",
    intent: "外壁塗装の塗料の種類と選び方を知りたい",
    priority: "P1",
    titleHint: "外壁の塗料の選び方。次の塗り替えをいつにしたいかで決める",
    angle: ["シリコン系・ラジカル制御型・フッ素系・無機系", "耐久性と価格の関係", "足場を組みにくい家の考え方", "色選びの注意"],
    services: ["exterior-painting"],
    facts: [],
  },

  /* ── 屋根塗装 ── */
  {
    slug: "roof-and-wall-painting-together",
    cluster: "roof-painting",
    keyword: "屋根 外壁 塗装 同時",
    intent: "屋根と外壁の塗装を同時にする利点を知りたい",
    priority: "P0",
    titleHint: "屋根と外壁は一緒に塗る？足場が1回で済むという考え方",
    angle: ["足場は屋根にも外壁にも必要", "同時に行うと総額を抑えやすい", "屋根の傷みが軽い場合", "雨どい・破風も同じ足場で"],
    services: ["roof-painting", "exterior-painting"],
    facts: [],
    works: ["exterior-roof-painting-process"],
  },
  {
    slug: "roof-painting-before-solar-panels",
    cluster: "roof-painting",
    keyword: "太陽光パネル 屋根塗装 順番",
    intent: "太陽光パネルを載せる前に屋根を塗装すべきか知りたい",
    priority: "P1",
    titleHint: "太陽光パネルを載せる前に、屋根は塗るべき？順番の考え方",
    angle: ["載せたあとは屋根に手を入れにくい", "数年以内に塗装が必要なら先に塗る", "足場を共用する", "屋根材ごとの違い"],
    services: ["roof-painting", "solar"],
    facts: [],
  },

  /* ── 太陽光 ── */
  {
    slug: "solar-roof-direction-and-shadow",
    cluster: "solar",
    keyword: "太陽光 屋根 向き 影",
    intent: "太陽光発電に向く屋根の向きと影の影響を知りたい",
    priority: "P1",
    titleHint: "太陽光発電に向く屋根、向かない屋根。向きと影の見方",
    angle: ["南・東西・北の違い", "一部の影でも発電に響く", "屋根の形と載せられる枚数", "現地で確かめること"],
    services: ["solar"],
    areas: ["totsuka"],
    facts: ["戸塚区・横浜市"],
  },
  {
    slug: "solar-self-use-or-sell-2026",
    cluster: "solar",
    keyword: "太陽光 自家消費 売電 2026",
    intent: "太陽光発電の自家消費と売電の考え方を知りたい",
    priority: "P1",
    titleHint: "太陽光の電気は、使うか売るか。2026年度の買取価格から考える",
    angle: ["つくった電気はまず家で使われる", "2026年度の買取価格と期間", "5年目から価格が下がる仕組み", "昼に使う工夫と蓄電池"],
    services: ["solar", "storage-battery"],
    facts: ["太陽光の買取価格"],
  },

  /* ── 蓄電池 ── */
  {
    slug: "battery-whole-or-specific-load",
    cluster: "storage-battery",
    keyword: "蓄電池 全負荷 特定負荷 違い",
    intent: "蓄電池の全負荷型と特定負荷型の違いを知りたい",
    priority: "P1",
    titleHint: "蓄電池の全負荷型と特定負荷型。停電のときに何を動かしたいか",
    angle: ["家全体か、決めた回路だけか", "200Vの機器を使いたい場合", "動かしたい家電を書き出す", "機器と工事の違い"],
    services: ["storage-battery"],
    facts: [],
  },
  {
    slug: "battery-add-to-existing-solar",
    cluster: "storage-battery",
    keyword: "蓄電池 後付け 太陽光",
    intent: "すでにある太陽光発電に蓄電池を後付けできるか知りたい",
    priority: "P1",
    titleHint: "いまある太陽光に蓄電池は後付けできる？確かめる3つの点",
    angle: ["パワーコンディショナの型番と年数", "単機能型とハイブリッド型", "買取の期間が終わったあとの使い方", "置き場所と分電盤"],
    services: ["storage-battery", "solar"],
    facts: ["太陽光の買取価格"],
  },

  /* ── リフォーム ── */
  {
    slug: "reform-priority-order",
    cluster: "reform",
    keyword: "リフォーム 優先順位",
    intent: "リフォームの優先順位の付け方を知りたい",
    priority: "P1",
    titleHint: "リフォームはどこから手を付ける？優先順位の3つの段階",
    angle: ["放置できないもの（水漏れ・故障）", "壁や床を開けるときしかできない工事", "あとからでも替えられるもの", "まとめる工事と分ける工事"],
    services: ["reform"],
    facts: [],
  },
  {
    slug: "mansion-reform-rules-check",
    cluster: "reform",
    keyword: "マンション リフォーム 管理規約 確認",
    intent: "マンションのリフォームで先に確認することを知りたい",
    priority: "P1",
    titleHint: "マンションのリフォーム、最初に確かめる3つのこと",
    angle: ["管理規約と工事の申請", "共用部分と専有部分", "搬入の経路と作業できる時間", "内窓は専有部分の工事として行えることが多い"],
    services: ["reform", "other"],
    facts: [],
  },

  /* ── 解体 ── */
  {
    slug: "reform-asbestos-pre-survey",
    cluster: "demolition",
    keyword: "リフォーム 石綿 事前調査",
    intent: "リフォームでの石綿の事前調査の決まりを知りたい",
    priority: "P1",
    titleHint: "リフォームでも石綿の事前調査は必要？決まりと報告が要る工事",
    angle: ["規模にかかわらず事前調査が必要", "設備の工事も改修工事に含まれる", "報告が必要になる工事の規模", "調査する人の資格"],
    services: ["demolition", "reform"],
    facts: ["石綿の事前調査"],
  },
  {
    slug: "reform-demolition-how-far",
    cluster: "demolition",
    keyword: "リフォーム 解体 範囲",
    intent: "リフォームの解体でどこまで壊すのかを知りたい",
    priority: "P2",
    titleHint: "リフォームの解体は、どこまで壊す？取れる壁と取れない壁",
    angle: ["次に付けるものから逆算する", "建物を支える壁は取れない", "壁の中の配管と配線", "解体と設備工事を同じ会社が行う利点"],
    services: ["demolition", "reform"],
    facts: [],
  },

  /* ── 造園 ── */
  {
    slug: "garden-tree-pruning-season",
    cluster: "garden",
    keyword: "庭木 剪定 時期",
    intent: "庭木の剪定に向く時期を知りたい",
    priority: "P1",
    titleHint: "庭木の剪定はいつ頼む？落葉樹と常緑樹で違う時期",
    angle: ["落葉樹は葉を落としている冬", "常緑樹は春から初夏か秋", "頼みどきのサイン（電線・越境・高さ）", "伐採と剪定の違い"],
    services: ["garden"],
    facts: [],
  },
  {
    slug: "weed-control-sheet-and-gravel",
    cluster: "garden",
    keyword: "庭 雑草対策 防草シート 砂利",
    intent: "庭の雑草対策の方法を知りたい",
    priority: "P1",
    titleHint: "草むしりを減らす。防草シートと砂利の敷き方",
    angle: ["光をさえぎるという考え方", "シートの重ね方と端の留め方", "砂利を載せる理由", "デッキやタイルで覆う方法"],
    services: ["garden"],
    facts: [],
    works: ["wood-deck-installation"],
  },

  /* ── 住宅設備 ── */
  {
    slug: "bathroom-heater-dryer-replacement",
    cluster: "housing-equipment",
    keyword: "浴室暖房乾燥機 交換 目安",
    intent: "浴室暖房乾燥機の交換の目安と確認点を知りたい",
    priority: "P0",
    titleHint: "浴室暖房乾燥機の交換。10年の目安と、替える前に確かめること",
    angle: ["リンナイが示す10年という目安", "電気式とガス温水式", "天井の開口・ダクト・電源の確認", "リモコンも一緒に替える"],
    services: ["other", "reform"],
    facts: ["ガス給湯器・エアコンの標準使用期間"],
    works: ["bathroom-heater-dryer-rinnai"],
  },
  {
    slug: "housing-equipment-ten-year-check",
    cluster: "housing-equipment",
    keyword: "住宅設備 10年 点検",
    intent: "築10年前後で点検したい住宅設備を知りたい",
    priority: "P1",
    titleHint: "築10年で見直す住宅設備。給湯器・エアコン・コンロの目安",
    angle: ["メーカーが示す10年の意味", "給湯器・エアコン・コンロ・浴室暖房乾燥機", "まとめて点検する利点", "壊れる前に見積もりを取る"],
    services: ["water-heater", "air-conditioner", "kitchen-equipment"],
    facts: ["ガス給湯器・エアコンの標準使用期間"],
  },
  {
    slug: "inner-window-what-changes",
    cluster: "housing-equipment",
    keyword: "内窓 効果",
    intent: "内窓を付けると何が変わるのかを知りたい",
    priority: "P1",
    titleHint: "内窓を付けると何が変わる？結露・寒さ・音への効き方",
    angle: ["窓と窓の間の空気の層", "付けられる窓・付けられない窓", "工事は壁を壊さない", "国の補助の対象"],
    services: ["other", "reform"],
    facts: ["先進的窓リノベ2026事業・みらいエコ住宅2026事業"],
  },

  /* ── 補助金 ── */
  {
    slug: "inner-window-subsidy-2026",
    cluster: "subsidy",
    keyword: "内窓 補助金 2026",
    intent: "内窓の設置に使える補助金の額と条件を知りたい",
    priority: "P1",
    titleHint: "内窓の補助金。先進的窓リノベ2026事業の額と条件",
    angle: ["窓の大きさと性能で決まる定額", "戸建住宅の性能区分Sの額", "合計5万円以上という条件", "登録された事業者が申請する", "期限と予算"],
    services: ["other", "reform"],
    facts: ["先進的窓リノベ2026事業・みらいエコ住宅2026事業"],
  },
  {
    slug: "subsidy-who-applies-comparison",
    cluster: "subsidy",
    keyword: "住宅設備 補助金 誰が申請",
    intent: "住宅設備の補助金は誰が申請するのかを知りたい",
    priority: "P1",
    titleHint: "補助金は誰が申請する？国・神奈川県・横浜市で違う決まり",
    angle: ["国の事業は登録された事業者", "神奈川県は本人", "横浜市のポイント還元は本人が設置の前に", "工事を始めてよい時期の違い"],
    services: ["ecocute", "solar", "storage-battery"],
    areas: ["yokohama"],
    facts: ["給湯省エネ2026事業", "先進的窓リノベ2026事業・みらいエコ住宅2026事業", "横浜市・神奈川県の制度"],
  },
  {
    slug: "mirai-eco-2026-reform-conditions",
    cluster: "subsidy",
    keyword: "みらいエコ住宅2026 リフォーム 条件",
    intent: "みらいエコ住宅2026事業のリフォームの条件を知りたい",
    priority: "P1",
    titleHint: "みらいエコ住宅2026事業、給湯器の交換だけでは使えない理由",
    angle: ["窓の断熱改修を含む組み合わせが条件", "対象になる住宅の新築時期", "給湯省エネ事業との関係", "期限"],
    services: ["reform", "water-heater"],
    facts: ["先進的窓リノベ2026事業・みらいエコ住宅2026事業", "給湯省エネ2026事業"],
  },

  /* ── 横浜市 ── */
  {
    slug: "yokohama-energy-point-program-2026",
    cluster: "yokohama",
    keyword: "横浜グリーンエネルギーパートナーシップ ポイント還元",
    intent: "横浜市の太陽光・蓄電池のポイント還元事業の内容を知りたい",
    priority: "P1",
    titleHint: "横浜市のポイント還元事業。太陽光・蓄電池・エコキュートの条件",
    angle: ["補助金ではなくポイントの還元", "設備ごとの還元額と条件", "設置の前に本人が申請する", "買い替えは対象外", "受付の期間"],
    services: ["solar", "storage-battery", "ecocute"],
    areas: ["yokohama"],
    facts: ["横浜市・神奈川県の制度"],
  },
  {
    slug: "yokohama-insulation-renovation-support",
    cluster: "yokohama",
    keyword: "横浜市 断熱改修 補助",
    intent: "横浜市の断熱改修の補助制度の対象を知りたい",
    priority: "P1",
    titleHint: "横浜市の断熱改修の補助。対象になる工事、ならない工事",
    angle: ["戸建て住宅の断熱改修が対象", "最大の補助額", "窓だけ・設備だけの工事は対象外", "国の窓の補助との違い"],
    services: ["reform"],
    areas: ["yokohama"],
    facts: ["横浜市・神奈川県の制度", "先進的窓リノベ2026事業・みらいエコ住宅2026事業"],
  },

  /*
   * ── 戸塚区 ──
   * 「戸塚区の地形が工事に与える影響」「戸塚区の年数を重ねた住宅の設備の更新」の2題材は、外した。
   * どちらも地域ページ（/area/totsuka）の「起伏の多い地形と、戸塚の住まい」「昭和30年代から広がった住宅地」と
   * 同じ検索意図で、記事にすると地域ページと検索語を取り合うため。内容を足すときは、地域ページを直す。
   * 戸塚区の記事にするのは、「戸塚区 × 1つの工事 × 具体的な条件」まで絞れるものだけ（例：エコキュートの搬入経路）。
   */

  /* ── 給湯器（親ページ /service/water-heater を支える題材） ── */
  {
    slug: "ecojozu-difference-from-conventional",
    cluster: "water-heater",
    keyword: "エコジョーズとは 従来型 違い",
    intent: "エコジョーズと従来型のガス給湯器の違いを知りたい",
    priority: "P0",
    titleHint: "エコジョーズとは。従来型のガス給湯器と違う2つの点",
    angle: ["排気の熱を回収してお湯づくりに使う仕組み", "運転中にドレン水が出て、中和器を通って排水される", "ドレン配管の工事が要る", "設置の形（壁掛け・据置・パイプスペース）は従来型と同じ"],
    services: ["water-heater"],
    facts: ["エコジョーズのドレン排水"],
  },
  {
    slug: "water-heater-leak-first-response",
    cluster: "water-heater",
    keyword: "給湯器 水漏れ 対処",
    intent: "給湯器から水が漏れているときに最初にすることを知りたい",
    priority: "P0",
    titleHint: "給湯器の下が濡れている。水漏れのときに最初に確かめること",
    angle: ["濡れている場所（本体の下・配管の継ぎ目）を見る", "エコジョーズのドレン水は正常な排水", "水漏れが続くときは使用を控える", "連絡するときに伝えること（型番・濡れている場所・写真）"],
    services: ["water-heater"],
    facts: ["エコジョーズのドレン排水", "ガス給湯器・エアコンの標準使用期間"],
  },
  {
    slug: "mansion-water-heater-replacement-check",
    cluster: "water-heater",
    keyword: "マンション 給湯器 交換 注意",
    intent: "マンションの給湯器を交換するときの注意を知りたい",
    priority: "P0",
    titleHint: "マンションの給湯器交換。パイプスペースと管理規約で確かめること",
    angle: ["パイプスペースに収まる機種は、寸法と排気の方式で決まる", "型番のシールを控える", "管理規約（工事の届け出・作業できる時間）", "エコジョーズにする場合のドレン排水"],
    services: ["water-heater"],
    facts: ["エコジョーズのドレン排水"],
  },
  {
    slug: "water-heater-replacement-day-flow",
    cluster: "water-heater",
    keyword: "給湯器 交換 工事 流れ 当日",
    intent: "給湯器の交換工事の当日の流れを知りたい",
    priority: "P1",
    titleHint: "給湯器の交換工事の当日。取り外しから試運転までの流れ",
    angle: ["水とガスを止める", "古い機器を外し、配管と壁の状態を見る", "新しい機器の取り付けと配管・リモコンの接続", "試運転で確かめること", "当日までに用意しておくこと"],
    services: ["water-heater"],
    facts: [],
  },

  /* ── エコキュート（親ページ /service/ecocute を支える題材） ── */
  {
    slug: "ecocute-heat-pump-water-under-unit",
    cluster: "ecocute",
    keyword: "エコキュート ヒートポンプ 水漏れ 結露",
    intent: "エコキュートのヒートポンプの下が濡れているのは故障かを知りたい",
    priority: "P0",
    titleHint: "エコキュートのヒートポンプの下が濡れている。故障かどうかの見分け方",
    angle: ["運転中は結露した水が出る（三菱電機の説明）", "霜取りのときは一時的に水が増える", "運転していないときも濡れているなら点検", "タンクの排水口から出る膨張水は別のもの"],
    services: ["ecocute"],
    facts: ["エコキュートの結露水と水漏れ", "エコキュートの設置"],
  },
  {
    slug: "ecocute-night-noise-placement",
    cluster: "ecocute",
    keyword: "エコキュート 運転音 近所",
    intent: "エコキュートの運転音で近所に迷惑をかけない置き方を知りたい",
    priority: "P1",
    titleHint: "エコキュートの運転音。夜に動く機器の置き場所の決め方",
    angle: ["夜間に運転してお湯を沸かす", "ヒートポンプユニットを寝室から離す", "隣のお宅の窓との位置関係", "現地調査で候補の場所を確かめる"],
    services: ["ecocute"],
    facts: ["エコキュートの設置"],
  },
  {
    slug: "electric-water-heater-to-ecocute",
    cluster: "ecocute",
    keyword: "電気温水器 エコキュート 交換",
    intent: "電気温水器からエコキュートに替えるときの違いと確認点を知りたい",
    priority: "P0",
    titleHint: "電気温水器からエコキュートへ。入れ替えで確かめる3つのこと",
    angle: ["どちらもお湯をためて使う給湯機", "ヒートポンプユニットの置き場所が新しく要る", "基礎と電気の回路がそのまま使えるか", "国の補助には、電気温水器の撤去への加算（2万円／台）がある"],
    services: ["ecocute"],
    facts: ["エコキュートの設置", "給湯省エネ2026事業"],
  },

  /* ── 屋根塗装（親ページ /service/roof-painting を支える題材） ── */
  {
    slug: "roof-painting-engiri-taspacer",
    cluster: "roof-painting",
    keyword: "屋根塗装 縁切り タスペーサー",
    intent: "屋根塗装の縁切りとは何か、なぜ必要かを知りたい",
    priority: "P0",
    titleHint: "屋根塗装の縁切りとは。スレート屋根の重なり目をふさがない理由",
    angle: ["スレートの合わせ目に塗料が入ってふさがる", "毛細管現象で雨水が逆流し、雨漏りやふくれの原因になる", "塗膜に切れ目を入れる方法と、部材を差し込む方法", "見積書で縁切りの項目を確かめる"],
    services: ["roof-painting"],
    facts: ["屋根塗装とスレート屋根の維持管理"],
    works: ["exterior-roof-painting-process"],
  },
  {
    slug: "roof-leak-not-fixed-by-painting",
    cluster: "roof-painting",
    keyword: "雨漏り 屋根塗装 直らない",
    intent: "雨漏りが屋根の塗装で直るのかを知りたい",
    priority: "P0",
    titleHint: "雨漏りは屋根を塗っても直らない。先に確かめること",
    angle: ["屋根材メーカーも「雨漏りは再塗装では直らない」と案内している", "雨水の入り口を特定する", "屋根材の割れ、板金の釘の浮き、サビの穴", "塗装は、補修のあとで表面と美観を保つ工事"],
    services: ["roof-painting"],
    facts: ["屋根塗装とスレート屋根の維持管理"],
  },
  {
    slug: "roof-color-fading-urgent-or-not",
    cluster: "roof-painting",
    keyword: "屋根 色あせ 塗装 必要",
    intent: "屋根の色あせは急いで塗装すべきかを知りたい",
    priority: "P0",
    titleHint: "屋根の色あせは、すぐ塗らないと危ない？メーカーの説明から考える",
    angle: ["色が薄くなっても、屋根材の基本性能に問題は無い（ケイミュー）", "塗り替えは美観上必要に応じて", "急ぐべきなのは、割れ・ずれ・釘の浮き", "訪問業者に指摘されたときの確かめ方"],
    services: ["roof-painting"],
    facts: ["屋根塗装とスレート屋根の維持管理"],
    works: ["exterior-roof-painting-process"],
  },
  {
    slug: "roof-ridge-metal-nail-loose",
    cluster: "roof-painting",
    keyword: "棟板金 釘 浮き",
    intent: "屋根の棟の板金の釘の浮きを指摘されたときの判断を知りたい",
    priority: "P1",
    titleHint: "屋根のてっぺんの板金の釘が浮いていると言われたら",
    angle: ["釘やビスが抜けると、部材が飛ぶ・雨漏りする原因になる", "打ち直しと増し打ち", "サビと、下地の木材の傷み", "自分で屋根に上らない。写真で確かめる"],
    services: ["roof-painting"],
    facts: ["屋根塗装とスレート屋根の維持管理"],
  },
  {
    slug: "roof-check-without-climbing",
    cluster: "roof-painting",
    keyword: "屋根 点検 自分で",
    intent: "屋根の状態を自分で安全に確かめる方法を知りたい",
    priority: "P1",
    titleHint: "屋根に上らずに、屋根の状態を確かめる方法",
    angle: ["自分で屋根に上らない（落下の危険・屋根材が割れる）", "地上・ベランダ・2階の窓から見える範囲を見る", "色あせ・コケ・割れ・板金の浮き", "写真を撮って相談する"],
    services: ["roof-painting"],
    facts: ["屋根塗装とスレート屋根の維持管理"],
  },

  /* ── 外壁塗装（親ページ /service/exterior-painting を支える題材） ── */
  {
    slug: "exterior-wall-crack-repair-needed",
    cluster: "exterior-painting",
    keyword: "外壁 ひび割れ 補修",
    intent: "外壁のひび割れは補修が必要かを知りたい",
    priority: "P0",
    titleHint: "外壁のひび割れ。様子を見てよいひびと、補修が要るひび",
    angle: ["細いひびと、幅の広いひび", "幅の広いひびは雨水の入り口になる", "補修してから塗る", "現地でひびの幅と場所を確かめる"],
    services: ["exterior-painting"],
    facts: [],
  },
  {
    slug: "exterior-sealing-replace-or-add",
    cluster: "exterior-painting",
    keyword: "外壁 シーリング 打ち替え 増し打ち",
    intent: "外壁の目地のシーリングの打ち替えと増し打ちの違いを知りたい",
    priority: "P1",
    titleHint: "外壁の目地（シーリング）の打ち替えと増し打ちの違い",
    angle: ["目地は、サイディングの板と板の継ぎ目", "割れ・やせは雨水の入り口になる", "打ち替えは古い材料を取り除く、増し打ちは上から足す", "塗装の前に行う"],
    services: ["exterior-painting"],
    facts: [],
  },
  {
    slug: "exterior-accessory-parts-what",
    cluster: "exterior-painting",
    keyword: "外壁塗装 付帯部 破風 雨どい",
    intent: "外壁塗装の付帯部とはどこのことかを知りたい",
    priority: "P1",
    titleHint: "外壁塗装の「付帯部」とは。破風・軒天・雨どいを一緒に塗る理由",
    angle: ["付帯部は、外壁と屋根以外の部分", "木・金属・樹脂で、合う塗料が違う", "足場があるうちに塗る", "当社の現場の、破風の塗装前と塗装後"],
    services: ["exterior-painting", "roof-painting"],
    facts: [],
    works: ["exterior-roof-painting-process"],
  },

  /* ── エアコン（親ページ /service/air-conditioner を支える題材） ── */
  {
    slug: "aircon-installation-pre-check",
    cluster: "air-conditioner",
    keyword: "エアコン 取り付け 事前 確認",
    intent: "エアコンを取り付ける前に確認しておくことを知りたい",
    priority: "P0",
    titleHint: "エアコンを取り付ける前に確かめる4つのこと",
    angle: ["配管用の穴があるか", "専用のコンセントと電圧", "室外機の置き場所", "配管の経路と仕上げ", "写真で伝えると話が早い"],
    services: ["air-conditioner"],
    facts: [],
    works: ["aircon-replace-two-units"],
  },
  {
    slug: "aircon-indoor-unit-water-drip",
    cluster: "air-conditioner",
    keyword: "エアコン 室内機 水漏れ 原因",
    intent: "エアコンの室内機から水が落ちるときの原因と対処を知りたい",
    priority: "P1",
    titleHint: "エアコンの室内機から水が落ちる。原因と、連絡の前に見ること",
    angle: ["排水のホースの詰まりと勾配", "まず点検で直ることがある", "使用年数と合わせて考える", "連絡するときに伝えること"],
    services: ["air-conditioner"],
    facts: ["ガス給湯器・エアコンの標準使用期間"],
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}
