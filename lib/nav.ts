import { mainServices, serviceCategories, servicePath } from "@/data/services";

/**
 * メニュー（ヘッダー・スマホのメニュー・フッター）の定義。
 * ページを増やしたら、ここに足す。サービスは data/services から自動で並ぶ。
 * このファイルはクライアントコンポーネントからも読み込まれるので、fs などサーバー専用のモジュールを import しないこと。
 */
export type NavLink = { href: string; label: string; note?: string };

/** ヘッダーの主メニュー */
export const mainNav: NavLink[] = [
  { href: "/service", label: "サービス" },
  { href: "/works", label: "施工事例" },
  { href: "/area", label: "対応エリア" },
  { href: "/company", label: "会社案内" },
  { href: "/blog", label: "コラム" },
];

/** ヘッダー上段の補助メニュー */
export const subNav: NavLink[] = [
  { href: "/flow", label: "工事の流れ" },
  { href: "/business", label: "法人・工務店の方へ" },
  { href: "/faq", label: "よくある質問" },
];

/** サービスのメニュー（分類ごと） */
export const serviceNav = serviceCategories.map((c) => ({
  id: c.id,
  name: c.name,
  description: c.description,
  links: mainServices.filter((s) => s.category === c.id).map((s) => ({ href: servicePath(s), label: s.shortName })),
}));

/** フッターの「サイトの案内」 */
export const footerNav: NavLink[] = [
  { href: "/company", label: "会社案内" },
  { href: "/works", label: "施工事例" },
  { href: "/flow", label: "工事の流れ" },
  { href: "/business", label: "法人・工務店の方へ" },
  { href: "/blog", label: "住宅設備コラム" },
  { href: "/faq", label: "よくある質問" },
  { href: "/contact", label: "お問い合わせ・無料見積もり" },
  { href: "/privacy", label: "プライバシーポリシー" },
];

/** フッターの「対応エリア」 */
export const footerAreaNav: NavLink[] = [
  { href: "/area", label: "対応エリア" },
  { href: "/area/totsuka", label: "横浜市戸塚区" },
  { href: "/area/yokohama", label: "横浜市" },
];
