/**
 * 補助金・支援制度（変動する情報）
 *
 * 載せてよいのは、官公庁・自治体・事務局の公式ページを開いて確かめた内容だけ。
 * 1件ごとに「出典 URL」と「確認日」を持たせ、画面にも必ず確認日を出す。
 * 金額・期限・受付状況を書き換えるときは、公式ページを開き直して checkedAt を更新する。
 * 確認できない数字は書かない（空にする）。
 *
 * 更新の目安
 * - 国の3事業（給湯省エネ・窓リノベ・みらいエコ住宅）… 毎年、年度の切り替わり（11〜12月に翌年分の発表、3月末ごろ受付開始）
 * - 受付状況（statusText）… 予算の消化で早く終わることがある。月に1回は公式サイトを見る
 * - 神奈川県・横浜市 … 4〜6月に当年度の募集開始
 */

export type SubsidyStatus = "open" | "closed";

export type Subsidy = {
  id: string;
  /** 通称 */
  name: string;
  /** 正式名称 */
  officialName: string;
  level: "国" | "神奈川県" | "横浜市";
  operator: string;
  /** 何に使える制度か（1〜2文） */
  summary: string;
  status: SubsidyStatus;
  /** 確認日時点の受付状況 */
  statusText: string;
  amounts: { label: string; value: string; note?: string }[];
  /** だれが申請するか */
  applicant: string;
  /** 期間 */
  period: string;
  /** 主な条件・注意点 */
  conditions: string[];
  sources: { label: string; url: string }[];
  /** 公式ページで内容を確かめた日（YYYY-MM-DD） */
  checkedAt: string;
  /** 関係するサービスのスラッグ */
  services: string[];
};

export const subsidies: Subsidy[] = [
  {
    id: "kyutou-shoene",
    name: "給湯省エネ2026事業",
    officialName: "高効率給湯器導入促進による家庭部門の省エネルギー推進事業費補助金（給湯省エネ2026事業）",
    level: "国",
    operator: "経済産業省（資源エネルギー庁）",
    summary: "エコキュート・ハイブリッド給湯機・エネファームなど、高効率給湯器の導入に対する国の補助です。",
    status: "open",
    statusText: "受付中。予算に対する申請額の割合は48％（2026年10月6日午前0時時点の事務局の表示）",
    amounts: [
      { label: "エコキュート", value: "7万円／台", note: "性能の要件を満たす機種は3万円／台を加算（合計10万円／台）" },
      { label: "ハイブリッド給湯機", value: "10万円／台", note: "性能の要件を満たす機種は2万円／台を加算（合計12万円／台）" },
      { label: "エネファーム", value: "17万円／台", note: "性能による加算はありません" },
      { label: "電気蓄熱暖房機の撤去", value: "4万円／台", note: "2台まで。撤去の加算は、専用の予算に達し次第終了" },
      { label: "電気温水器の撤去", value: "2万円／台", note: "補助を受ける給湯器と同じ台数まで" },
    ],
    applicant: "登録された事業者（給湯省エネ事業者）が申請します。お客様ご自身が直接申請することはできません。",
    period: "2025年11月28日以降に着手した工事が対象。交付申請は遅くとも2026年12月31日まで（予約は2026年11月16日まで）",
    conditions: [
      "補助対象製品として登録された機種であること",
      "戸建住宅は2台まで、共同住宅等は1台まで",
      "機器をご自身で購入し、取り付けだけを依頼する工事（施主支給）は対象外",
      "予算の上限に達した時点で、期限の前でも受付が終了します",
    ],
    sources: [
      { label: "給湯省エネ2026事業（事務局）", url: "https://kyutou-shoene2026.meti.go.jp/" },
      { label: "事業概要", url: "https://kyutou-shoene2026.meti.go.jp/about/" },
      { label: "撤去加算について", url: "https://kyutou-shoene2026.meti.go.jp/about_tekkyo_kasan/" },
    ],
    checkedAt: "2026-10-06",
    services: ["water-heater", "eco-one", "ene-farm"],
  },
  {
    id: "mado-reno",
    name: "先進的窓リノベ2026事業",
    officialName: "断熱窓への改修促進等による住宅の省エネ・省CO2加速化支援事業（先進的窓リノベ2026事業）",
    level: "国",
    operator: "環境省",
    summary: "内窓の設置、ガラスの交換、外窓の交換など、窓の断熱改修に対する国の補助です。",
    status: "open",
    statusText: "受付中。予算に対する申請額の割合は27％（2026年10月6日午前0時時点の事務局の表示）",
    amounts: [
      { label: "上限", value: "1戸あたり100万円" },
      { label: "内窓の設置（戸建住宅・性能区分S）", value: "1か所あたり22,000円〜76,000円", note: "窓の大きさ（小〜特大）で決まる定額" },
      { label: "内窓の設置（戸建住宅・性能区分P）", value: "1か所あたり36,000円〜140,000円", note: "窓の大きさ（小〜特大）で決まる定額" },
    ],
    applicant: "登録された事業者（施工業者など）が申請します。お客様ご自身が直接申請することはできません。",
    period: "2025年11月28日以降に着手した工事が対象。交付申請は遅くとも2026年12月31日まで（予約は2026年11月16日まで）",
    conditions: [
      "1回の申請の合計補助額が5万円以上であること",
      "工事の前の写真が必要（提出できない箇所は補助を受けられません）",
      "過去の窓リノベ事業で補助を受けた窓は対象外",
      "予算の上限に達した時点で、期限の前でも受付が終了します",
    ],
    sources: [
      { label: "先進的窓リノベ2026事業（事務局）", url: "https://window-renovation2026.env.go.jp/" },
      { label: "内窓設置の対象と補助額", url: "https://window-renovation2026.env.go.jp/construction/inner-window.html" },
    ],
    checkedAt: "2026-10-06",
    services: ["other", "reform"],
  },
  {
    id: "mirai-eco",
    name: "みらいエコ住宅2026事業（リフォーム）",
    officialName: "みらいエコ住宅2026事業（Me住宅2026）",
    level: "国",
    operator: "国土交通省",
    summary: "窓や壁の断熱改修と、高効率給湯器・高効率エアコンなどの設置を組み合わせた省エネリフォームに対する国の補助です。",
    status: "open",
    statusText: "受付中（リフォーム）。予算に対する申請額の割合は8％（2026年10月6日午前0時時点の事務局の表示）",
    amounts: [
      { label: "上限（1戸あたり）", value: "40万円〜100万円", note: "住宅の新築時期と、工事の内容によって決まります" },
      { label: "エコキュート・ハイブリッド給湯機", value: "45,000円／戸" },
      { label: "エコジョーズ", value: "30,000円／戸" },
      { label: "高効率エアコン", value: "52,000円／箇所" },
      { label: "節水型トイレ", value: "31,500円〜34,500円／箇所" },
      { label: "高断熱浴槽", value: "48,000円／戸" },
    ],
    applicant: "登録された事業者（工事施工業者）が申請します。お客様ご自身が直接申請することはできません。",
    period: "2025年11月28日以降に着手した工事が対象。交付申請は遅くとも2026年12月31日まで",
    conditions: [
      "原則、平成28年12月31日以前に新築された住宅が対象",
      "窓などの開口部の断熱改修を含む、決められた工事の組み合わせで行うこと（給湯器やエアコンの交換だけでは使えません）",
      "1回の申請の合計補助額が5万円以上であること",
      "同じ給湯器に、給湯省エネ2026事業と重ねて補助を受けることはできません",
    ],
    sources: [
      { label: "みらいエコ住宅2026事業（事務局）", url: "https://mirai-eco2026.mlit.go.jp/" },
      { label: "リフォームの対象要件", url: "https://mirai-eco2026.mlit.go.jp/reform/" },
    ],
    checkedAt: "2026-10-06",
    services: ["reform", "toilet", "air-conditioner"],
  },
  {
    id: "yokohama-gep",
    name: "横浜グリーンエネルギーパートナーシップ事業",
    officialName: "横浜グリーンエネルギーパートナーシップ事業（令和8年度。略称 YGrEP）",
    level: "横浜市",
    operator: "横浜市（脱炭素・GREEN×EXPO推進局）",
    summary: "太陽光発電・蓄電池・エコキュート・エネファームなどを導入した横浜市民に、キャッシュレスポイント等を還元する事業です（補助金ではありません）。",
    status: "open",
    statusText: "受付中（先着順）。申請の進み具合は70〜75％（2026年9月30日更新の特設サイトの表示）",
    amounts: [
      { label: "太陽光発電設備", value: "15,000円分／kW", note: "上限4kW。蓄電池・エコキュート・電気自動車のいずれかを同時に設置するか、すでに設置していること" },
      { label: "蓄電池", value: "120,000円分／件", note: "太陽光発電設備を同時に設置するか、すでに設置していること" },
      { label: "エコキュート", value: "20,000円分／件", note: "太陽光発電設備があること。新しく設置する場合のみ" },
      { label: "燃料電池（エネファーム）", value: "30,000円分／件" },
    ],
    applicant: "設備を導入する市民の方ご自身が申請します。",
    period: "受付期間は2026年6月15日〜12月25日。予算額に達した時点で終了",
    conditions: [
      "設置の前に申請が必要です（設置後の申請はできません）",
      "買い替えは対象外（エコキュートからエコキュートへの交換、蓄電池の買い替えなど）",
      "それぞれの設備について、1戸につき1回まで",
      "ハイブリッド給湯機は対象設備に含まれていません",
    ],
    sources: [
      { label: "横浜市：横浜グリーンエネルギーパートナーシップ事業", url: "https://www.city.yokohama.lg.jp/kurashi/machizukuri-kankyo/ondanka/hojo-sien/YGrEP.html" },
      { label: "申請の特設サイト", url: "https://ygrep2026.city.yokohama.lg.jp/" },
    ],
    checkedAt: "2026-10-06",
    services: ["solar", "storage-battery", "water-heater"],
  },
  {
    id: "kanagawa-solar",
    name: "神奈川県 住宅用太陽光発電・蓄電池導入費補助金",
    officialName: "令和8年度神奈川県住宅用太陽光発電・蓄電池導入費補助金",
    level: "神奈川県",
    operator: "神奈川県（環境農政局 脱炭素戦略本部室）",
    summary: "県内の住宅に、太陽光発電設備と蓄電システムを同時に導入する場合の補助です。",
    status: "closed",
    statusText: "令和8年度は受付終了（第1期は5月12日、第2期は9月7日に、申請額が予算額に達して締め切り）",
    amounts: [
      { label: "太陽光発電設備", value: "1kWあたり7万円", note: "設置容量は1kW以上10kW未満" },
      { label: "蓄電システム", value: "1台あたり15万円" },
    ],
    applicant: "申請者ご本人が申請します。施工業者による代行申請はできません。",
    period: "令和8年度の第1期・第2期の募集は終了（追加の募集があるかどうかは、県のページに記載がなく未確認）",
    conditions: [
      "太陽光発電と蓄電システムの両方を同時に導入する場合のみ対象",
      "交付決定を受ける前に工事を始めると対象外",
      "先着順で、受付開始から短い期間で締め切られています",
    ],
    sources: [
      { label: "神奈川県：住宅用太陽光発電・蓄電池導入費補助金", url: "https://www.pref.kanagawa.jp/docs/ap4/solar_home/taiyoukouchikudenchi.html" },
      { label: "かながわ脱炭素ポータルサイト（補助金一覧）", url: "https://www.pref.kanagawa.jp/osirase/0502/kanagawa-datsutanso-portal/supports/" },
    ],
    checkedAt: "2026-10-06",
    services: ["solar", "storage-battery"],
  },
  {
    id: "yokohama-dannetsu",
    name: "横浜市 既存住宅断熱改修補助制度",
    officialName: "令和8年度 既存住宅断熱改修補助制度（横浜市既存住宅断熱改修補助金）",
    level: "横浜市",
    operator: "横浜市（建築局 住宅政策課）",
    summary: "戸建ての既存住宅を、断熱性能の高い省エネ住宅へ改修する工事に対する横浜市の補助です。",
    status: "open",
    statusText: "受付期間内（本申請の締め切りは2026年11月30日）。予算の残りは市のページに記載がなく未確認",
    amounts: [
      { label: "子育て世代の住替え", value: "最大150万円" },
      { label: "定住世帯", value: "最大120万円", note: "住宅の一部を改修する場合は最大100万円" },
    ],
    applicant: "市の制度に登録された事業者が申請します。個人の方が直接申請することはできません。",
    period: "本申請の締め切りは2026年11月30日",
    conditions: [
      "外壁、屋根・天井、床に一定量以上の断熱材を使う断熱改修であること",
      "窓の改修だけ、外壁塗装だけ、浴室・トイレの改修だけの工事は対象外",
    ],
    sources: [
      { label: "横浜市：既存住宅断熱改修補助制度", url: "https://www.city.yokohama.lg.jp/kurashi/sumai-kurashi/jutaku/sien/shoene/event/r8kizondannetuhojo.html" },
    ],
    checkedAt: "2026-10-06",
    services: ["reform"],
  },
];

export function getSubsidy(id: string): Subsidy | undefined {
  return subsidies.find((s) => s.id === id);
}

export function subsidiesByIds(ids: string[] | undefined): Subsidy[] {
  if (!ids) return [];
  return ids.map(getSubsidy).filter((s): s is Subsidy => Boolean(s));
}

/** 補助金の情報をまとめて見直した日（一番新しい確認日） */
export const subsidyInfoDate: string = subsidies.map((s) => s.checkedAt).sort().at(-1) ?? "";
