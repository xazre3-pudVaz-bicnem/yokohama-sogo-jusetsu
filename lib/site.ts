/**
 * サイト全体の基本情報（会社名・所在地・連絡先・SNS）を一元管理する。
 *
 * ここを書き換えれば、ヘッダー・フッター・各ページ・お問い合わせ・構造化データ（JSON-LD）の
 * すべてに反映される。ページやコンポーネントに電話番号や住所を直接書かないこと。
 *
 * 記入のルール
 * - 資料（チラシ・看板・Instagram）で確認できた内容だけを書く。
 * - 確認できていない項目は null / 空文字のままにする。空の項目は画面にも構造化データにも出ない。
 * - 未確認の項目の一覧は docs/TODO.md にある。
 */

/** 事業所（NAP の「A」）。表記はこの形にそろえる */
export type Office = {
  /** 画面に出す名称（本社／戸塚オフィス） */
  label: string;
  postalCode: string;
  prefecture: string;
  /** 市区（例：横浜市戸塚区） */
  city: string;
  /** 町名（「戸塚区深谷町のオフィス」のような文章に使う） */
  town: string;
  /** 町名から先（例：深谷町1665-159） */
  street: string;
};

export const siteConfig = {
  /** 正式な社名 */
  name: "株式会社 横浜総合住設",
  /** 社名（株式会社を除いた呼び方） */
  shortName: "横浜総合住設",
  /** 愛称。看板・チラシ・Instagram で使われている */
  nickname: "ヨコジュウ",
  nameEn: "YOKOHAMA Total Housing Solutions",

  /** ブランドコピー */
  tagline: "住まいのことなら、まとめてヨコジュウへ。",
  subTagline: "暮らしをもっと快適に。もっと安心に。",
  /** 会社の説明（Organization.description・既定の meta description） */
  description:
    "横浜市戸塚区を中心に、給湯器・エコキュート・エアコン・トイレ・太陽光発電・蓄電池・外壁塗装・リフォーム・造園まで対応する株式会社 横浜総合住設の公式サイトです。住まいの工事をまとめてご相談いただけます。",

  /**
   * 本番ドメイン（2026-10-09 に決定。www あり）。変えるときは "https://www.example.jp" の形で書く（末尾のスラッシュは付けない）。
   * canonical・OGP・sitemap.xml・robots.txt・RSS・構造化データの URL は、すべてここから作る。
   * この値が使われるのは、Vercel の本番デプロイだけ。手元のビルドとプレビューは、全ページ noindex のまま（next.config.ts を参照）。
   * www なしの URL は、www ありへ転送する（Vercel のドメイン設定と、next.config.ts の両方）。
   * 空にすると、本番も全ページ noindex になり、検索結果には出ない。
   */
  productionUrl: "https://www.yokohama-sogo-jusetsu.com",

  /** 最重要エリア（Local SEO の軸。data/areas.ts と一致させる） */
  primaryArea: {
    prefecture: "神奈川県",
    city: "横浜市",
    ward: "戸塚区",
  },

  /**
   * 連絡先 ── 資料に複数の電話番号があるため、役割ごとに分けてある。
   *
   * 資料に載っていた番号（どれを代表番号にするかは未確定。docs/TODO.md を参照）
   *   045-392-6959 … 看板のデザイン2種・会社のステッカー・Instagram の投稿（2026-09-30）
   *   080-4162-0448 … 既存ホームページのイメージ画像（受付時間 8:00-18:00 平日 の記載つき）
   *   チラシ3種には、担当者2名の携帯番号が載っている。担当者個人の番号のため、サイトにもこのファイルにも書いていない
   */
  contact: {
    /** 固定電話（代表番号として、ヘッダー・固定ボタン・各ページの電話ボタンに使う） */
    companyPhone: "045-392-6959",
    /** 携帯電話。値を入れても、showMobile が false のあいだは画面に出ない */
    companyMobile: "080-4162-0448",
    /** 携帯電話も会社案内・お問い合わせページに併記するか */
    showMobile: false,
    /** 画面に出すメールアドレス。空なら出さない（チラシのアドレスは担当者個人のものなので入れていない） */
    contactEmail: "",
    /**
     * 電話の受付時間。既存ホームページのイメージ画像に「受付時間 8:00-18:00（平日）」とある。
     * hoursConfirmed が false のあいだは、画面には出すが、構造化データ（営業時間）には出さない。
     */
    hours: "8:00〜18:00",
    hoursDays: "平日",
    hoursConfirmed: false,
    /** 構造化データ用の曜日と時刻（hoursConfirmed を true にしたときに使われる） */
    openDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as string[],
    opens: "08:00",
    closes: "18:00",
    formNote: "送信後、内容を確認のうえ、担当者よりお電話またはメールでご連絡します。",
  },

  /** 事業所。チラシ（2種）に「本社」「戸塚オフィス」として記載されている */
  offices: {
    head: {
      label: "本社",
      postalCode: "252-0335",
      prefecture: "神奈川県",
      city: "相模原市南区",
      town: "下溝",
      street: "下溝324番地10",
    } satisfies Office,
    totsuka: {
      label: "戸塚オフィス",
      postalCode: "245-0067",
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      town: "深谷町",
      street: "深谷町1665-159",
    } satisfies Office,
  },

  /**
   * 会社概要。値を入れると会社案内ページと構造化データに出る（null の項目は出ない）。
   * 代表者は、代表ご本人から受け取った代表挨拶の署名（2026-10-09）で確認した。読みがなは未確認なので書かない。
   * 代表挨拶の文章と写真は data/greeting.ts。
   */
  company: {
    representative: "加太 駆" as string | null,
    representativeTitle: "代表取締役" as string | null,
    founded: null as string | null,
    capital: null as string | null,
    employees: null as string | null,
    corporateNumber: null as string | null,
    /** 事業内容（チラシ・看板・Instagram に書かれている工事と、代表から載せてよいと連絡を受けた工事。窓・内窓・畳・襖は 2026-10-20 に LINE で） */
    business: [
      "給湯器・エコキュート・ハイブリッド給湯器の設置・交換",
      "エネファームからの給湯器交換",
      "エアコン（家庭用・業務用）の設置・交換・修理",
      "トイレの交換・リフォーム",
      "ビルトインコンロ・レンジフードの設置・交換",
      "太陽光発電・蓄電池の設置",
      "外壁塗装・屋根塗装",
      "住宅リフォーム（リフォームに伴う解体工事を含む）",
      "内窓の設置・窓の交換",
      "畳・襖の張り替え",
      "造園・外構工事",
    ],
  },

  /**
   * 信頼性に関わる情報。書面（許可証・保険証券・資格者証・保証書の様式など）で確認できたものだけを書く。
   * null の項目は画面にも構造化データにも出ない。推測で埋めないこと。
   *   記入例  licenses: "建設業許可 神奈川県知事（般-◯）第◯◯◯◯◯号"
   *           qualifications: "第二種電気工事士 ◯名／ガス機器設置スペシャリスト ◯名"
   *           warranty: "工事保証◯年（施工に起因する不具合）。機器の保証はメーカーの保証書のとおり"
   */
  trust: {
    licenses: null as string | null,
    qualifications: null as string | null,
    warranty: null as string | null,
    insurance: null as string | null,
    afterService: null as string | null,
    /** 取扱メーカー（正式な一覧を受け取ったら配列で入れる）。空なら「取扱メーカー」の欄は出ない */
    makers: [] as string[],
  },

  social: {
    instagram: "https://www.instagram.com/yokohamatotalhousingsolutions/",
    instagramHandle: "yokohamatotalhousingsolutions",
    threads: "",
    /**
     * LINE 公式アカウントの「友だち追加」の URL。会社から受け取った QR コード（2026-10-09）の中身。
     * QR コードの画像は assets/line/ → public/images/brand/line-qr.png（お問い合わせページで、パソコンの方向けに出す）。
     * 空にすると、サイトのどこにも LINE の案内は出ない。
     */
    line: "https://lin.ee/RIQLO6n",
    /** LINE の ID（上の URL の転送先 line.me/R/ti/p/@… で確認）。お問い合わせページに、ID 検索用として出す */
    lineId: "@326qvkdi",
    x: "",
    youtube: "",
  },

  /**
   * Googleビジネスプロフィール（取得後に記入）。
   * - mapsUrl   … プロフィールの共有リンク。入れると「Googleマップで見る」のリンク先がプロフィールになる
   * - embedUrl  … 「共有 → 地図を埋め込む」で出る iframe の src（https://www.google.com/maps/embed?pb=... の形）
   * - reviewUrl … 口コミ投稿ページの URL。入れると口コミの導線が出る
   * 住所の文字列だけで地図を埋め込むと、建物の名称のカードが出てしまうため、embedUrl が入るまで地図は埋め込まない。
   */
  gbp: {
    mapsUrl: "",
    embedUrl: "",
    reviewUrl: "",
  },

  /**
   * 同じ会社が運営する専門サイト（どちらで何を扱うかは data/specialty.ts）。会社の構造化データの @id は共通。
   *   name … 正式な名前／label … リンク・メニュー・案内に出す名前／about … 何があるかの一言（フッター・会社案内・スマホのメニュー）
   *   navLabel … ヘッダーの上の帯に出す短い名前（帯の幅に収めるため）
   *
   * boiler … 給湯器専門サイト（2026-10-16 に依頼者から「給湯器専門サイトも作った」）。リポジトリは
   *   c:\projects\yokohamatotalhousingsolutions-boiler（別の Vercel）。給湯器の機種・価格の考え方・補助金・地域ごとの案内を受け持つ。
   * solarNerima … 練馬区の太陽光発電・蓄電池のサイト（2026-10-26 に依頼者から「太陽光専門ページも作ったから給湯器のページみたいに繋げて」）。
   *   リポジトリは c:\projects\yokohama-sogo-jusetsu-solar-nerima（別の Vercel）。東京都練馬区の戸建て住宅に向けたサイトで、
   *   このサイトの太陽光・蓄電池のページ（戸塚区・横浜市）とは地域が違う。行き先が練馬区のサイトだと分かるよう、
   *   リンクの文字には「練馬区」を入れる（専門サイトの docs/CORPORATE_LINK.md の提案どおり）。
   */
  specialtySites: {
    boiler: {
      name: "横浜総合住設 給湯器専門サイト",
      label: "給湯器専門サイト",
      navLabel: "給湯器専門サイト",
      about: "ガス給湯器・エコキュート・ハイブリッド給湯器の機種と補助金",
      url: "https://www.yokoju-boiler.com",
    },
    solarNerima: {
      name: "横浜総合住設 練馬区の太陽光発電・蓄電池",
      label: "練馬区の太陽光発電・蓄電池",
      navLabel: "練馬区の太陽光",
      about: "東京都練馬区の戸建て住宅の太陽光発電・蓄電池と、練馬区・東京都の補助金",
      url: "https://www.yokoju-solar.com",
    },
  },

  /** サイトの文章を最後に見直した日（sitemap.xml の lastmod に使う） */
  contentUpdatedAt: "2026-10-06",

  /** コラムの著者表記（「監修」とは書かない。資格のある第三者の監修ではないため） */
  editorial: {
    author: "横浜総合住設 編集部",
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type OfficeKey = keyof typeof siteConfig.offices;

/* ------------------------------------------------------------------ */
/* 連絡先                                                              */
/* ------------------------------------------------------------------ */

export type SpecialtySiteId = keyof typeof siteConfig.specialtySites;

/** 同じ会社の専門サイトのページの URL（例：specialtySiteUrl("boiler", "/ecocute")）。トップは末尾のスラッシュを付けない */
export function specialtySiteUrl(id: SpecialtySiteId, path = "/"): string {
  const base = siteConfig.specialtySites[id].url;
  return path === "/" || path === "" ? base : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** 給湯器専門サイトのページの URL（例：boilerSiteUrl("/ecocute")） */
export function boilerSiteUrl(path = "/"): string {
  return specialtySiteUrl("boiler", path);
}

/** 練馬区の太陽光発電・蓄電池のサイトのページの URL（例：solarSiteUrl("/subsidy")） */
export function solarSiteUrl(path = "/"): string {
  return specialtySiteUrl("solarNerima", path);
}

/** 画面に出す代表番号。固定電話が空なら携帯電話を使う。どちらも空なら空文字 */
export function primaryPhone(): string {
  return siteConfig.contact.companyPhone || siteConfig.contact.companyMobile || "";
}

/** tel: リンク用（数字のみ） */
export function telHref(display: string = primaryPhone()): string {
  return display ? `tel:${display.replace(/[^0-9+]/g, "")}` : "";
}

/** 構造化データ用（国番号つき。例：+81-45-392-6959） */
export function telIntl(display: string = primaryPhone()): string {
  return display ? `+81-${display.replace(/^0/, "")}` : "";
}

/** 携帯電話を画面に併記するときだけ番号を返す */
export function mobilePhone(): string {
  const c = siteConfig.contact;
  return c.showMobile && c.companyMobile && c.companyMobile !== primaryPhone() ? c.companyMobile : "";
}

/** LINE 公式アカウントの友だち追加の URL。LINE の URL の形をしているときだけ返す（それ以外は空文字） */
export function lineUrl(): string {
  const url: string = siteConfig.social.line;
  return /^https:\/\/(?:lin\.ee|line\.me|page\.line\.me)\//.test(url) ? url : "";
}

/**
 * 連絡方法の一覧（設定があるものだけ）。文章の中で連絡方法を並べるときは、ここから作る
 * （LINE や Instagram の設定を外したときに、文章だけが残らないようにするため）。
 *   contactWays().join("、") → 「お電話、LINE、お問い合わせフォーム、Instagram のメッセージ」
 */
export function contactWays({ form = true, instagram = true }: { form?: boolean; instagram?: boolean } = {}): string[] {
  return [primaryPhone() ? "お電話" : "", lineUrl() ? "LINE" : "", form ? "お問い合わせフォーム" : "", instagram && siteConfig.social.instagram ? "Instagram のメッセージ" : ""].filter(Boolean);
}

/** 受付時間の表記（例：8:00〜18:00（平日））。未設定なら空文字 */
export function receptionHours(): string {
  const c = siteConfig.contact;
  if (!c.hours) return "";
  return c.hoursDays ? `${c.hours}（${c.hoursDays}）` : c.hours;
}

/* ------------------------------------------------------------------ */
/* 所在地                                                              */
/* ------------------------------------------------------------------ */

/** 住所（例：神奈川県横浜市戸塚区深谷町1665-159） */
export function officeAddress(key: OfficeKey): string {
  const o = siteConfig.offices[key];
  return `${o.prefecture}${o.city}${o.street}`;
}

/** 郵便番号つきの住所（例：〒245-0067 神奈川県横浜市戸塚区深谷町1665-159） */
export function officeAddressWithPostal(key: OfficeKey): string {
  return `〒${siteConfig.offices[key].postalCode} ${officeAddress(key)}`;
}

/** Googleマップのリンク。ビジネスプロフィールの URL があればそれを、無ければ住所での検索 URL を返す */
export function officeMapUrl(key: OfficeKey): string {
  if (key === "totsuka" && siteConfig.gbp.mapsUrl) return siteConfig.gbp.mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress(key))}`;
}

/** 会社案内ページに埋め込む地図の URL。Googleマップの埋め込み用 URL の形をしているときだけ返す */
export function mapEmbedUrl(): string {
  const url: string = siteConfig.gbp.embedUrl;
  return /^https:\/\/www\.google\.com\/maps\/embed\?/.test(url) ? url : "";
}
