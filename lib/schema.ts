import { siteConfig, primaryPhone, telIntl, type OfficeKey } from "@/lib/site";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

/**
 * 構造化データ（JSON-LD）を組み立てる。
 *
 * - 値はすべて lib/site.ts と各データファイルから作る（画面の表示と食い違わないようにするため）。
 * - 未確認の項目（代表者・設立・許認可・営業時間など）は、値が入るまで出力しない。
 * - 会社の実体は2つに分けて表す。
 *     Organization               … 法人（本社の所在地）
 *     HomeAndConstructionBusiness … 戸塚オフィス（地域の事業所。対応エリア・提供サービスはこちらに持たせる）
 * - FAQPage は、そのページに実際に表示している質問だけを渡すこと。
 */

type Json = Record<string, unknown>;

const BASE = SITE_URL ?? "";
const url = (path = "/") => `${BASE}${path.startsWith("/") ? path : `/${path}`}`;

export const ORG_ID = url("/#organization");
export const OFFICE_ID = url("/#totsuka-office");
export const WEBSITE_ID = url("/#website");

/** undefined・null・空文字・空配列のキーを落とす */
function clean<T extends Json>(obj: T): T {
  const out: Json = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out as T;
}

function postalAddress(key: OfficeKey): Json {
  const o = siteConfig.offices[key];
  // 市区を「横浜市」「戸塚区深谷町…」のように分ける（addressLocality は市、streetAddress に区以下）
  const [city, ...rest] = o.city.split(/(?<=市)/);
  const ward = rest.join("");
  return {
    "@type": "PostalAddress",
    postalCode: o.postalCode,
    addressCountry: "JP",
    addressRegion: o.prefecture,
    addressLocality: city,
    streetAddress: `${ward}${o.street}`,
  };
}

const areaServed: Json[] = [
  { "@type": "AdministrativeArea", name: "神奈川県横浜市戸塚区" },
  { "@type": "City", name: "横浜市" },
  { "@type": "AdministrativeArea", name: "神奈川県" },
  { "@type": "AdministrativeArea", name: "東京都" },
];

function sameAs(): string[] {
  const s = siteConfig.social;
  const all: string[] = [s.instagram, s.threads, s.x, s.youtube, s.line];
  return all.filter(Boolean);
}

function logo(): Json {
  return { "@type": "ImageObject", url: url("/images/brand/logo-square.png"), width: 600, height: 600 };
}

function openingHours(): Json[] | undefined {
  const c = siteConfig.contact;
  if (!c.hoursConfirmed || !c.openDays.length) return undefined;
  return [{ "@type": "OpeningHoursSpecification", dayOfWeek: c.openDays, opens: c.opens, closes: c.closes }];
}

export function organizationSchema(): Json {
  const phone = primaryPhone();
  const c = siteConfig.company;
  return clean({
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    legalName: siteConfig.name,
    alternateName: [siteConfig.shortName, siteConfig.nickname, siteConfig.nameEn],
    url: url("/"),
    logo: logo(),
    image: url(DEFAULT_OG_IMAGE),
    description: siteConfig.description,
    telephone: telIntl(phone),
    email: siteConfig.contact.contactEmail,
    address: postalAddress("head"),
    foundingDate: c.founded ?? undefined,
    taxID: c.corporateNumber ?? undefined,
    founder: c.representative ? { "@type": "Person", name: c.representative, jobTitle: c.representativeTitle ?? undefined } : undefined,
    contactPoint: phone
      ? clean({
          "@type": "ContactPoint",
          telephone: telIntl(phone),
          contactType: "customer service",
          areaServed: "JP",
          availableLanguage: "Japanese",
          hoursAvailable: openingHours(),
        })
      : undefined,
    sameAs: sameAs(),
    subOrganization: { "@id": OFFICE_ID },
  });
}

export function localBusinessSchema(services: { name: string; slug: string; summary: string }[]): Json {
  const phone = primaryPhone();
  return clean({
    "@type": "HomeAndConstructionBusiness",
    "@id": OFFICE_ID,
    name: siteConfig.name,
    alternateName: [siteConfig.shortName, siteConfig.nickname],
    description: siteConfig.description,
    url: url("/"),
    logo: logo(),
    image: url(DEFAULT_OG_IMAGE),
    telephone: telIntl(phone),
    address: postalAddress("totsuka"),
    areaServed,
    parentOrganization: { "@id": ORG_ID },
    openingHoursSpecification: openingHours(),
    hasMap: siteConfig.gbp.mapsUrl || undefined,
    sameAs: sameAs(),
    knowsAbout: services.map((s) => s.name),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "住宅設備・リフォームのサービス",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.summary, url: url(`/service/${s.slug}`) },
      })),
    },
  });
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    alternateName: [siteConfig.shortName, siteConfig.nickname],
    url: url("/"),
    inLanguage: "ja",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(crumbs: { name: string; href: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: url(c.href) })),
  };
}

export function serviceSchema(s: { name: string; slug: string; summary: string; image: string; h1: string }): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": url(`/service/${s.slug}#service`),
    name: s.name,
    serviceType: s.name,
    description: s.summary,
    url: url(`/service/${s.slug}`),
    image: url(s.image),
    provider: { "@id": OFFICE_ID },
    areaServed,
  };
}

/** そのページに表示している質問だけを渡す */
export function faqSchema(faqs: { q: string; a: string }[]): Json | null {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function blogPostingSchema(p: {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  image?: string;
  category: string;
  keywords: string[];
}): Json {
  return clean({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url(`/blog/${p.slug}#article`),
    mainEntityOfPage: url(`/blog/${p.slug}`),
    headline: p.title,
    description: p.description,
    datePublished: p.publishedAt,
    dateModified: p.updatedAt,
    inLanguage: "ja",
    articleSection: p.category,
    keywords: p.keywords.join(", "),
    image: url(p.image ?? DEFAULT_OG_IMAGE),
    author: { "@type": "Organization", "@id": ORG_ID, name: p.author, url: url("/company") },
    publisher: { "@id": ORG_ID },
  });
}

/** 施工事例の詳細ページ（会社が書いた施工の記録として Article で表す） */
export function workArticleSchema(w: { slug: string; title: string; summary: string; image: string; postedAt: string; serviceName: string; serviceSlug: string }): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": url(`/works/${w.slug}#article`),
    mainEntityOfPage: url(`/works/${w.slug}`),
    headline: w.title,
    description: w.summary,
    image: url(w.image),
    datePublished: w.postedAt,
    dateModified: w.postedAt,
    inLanguage: "ja",
    articleSection: "施工事例",
    about: { "@type": "Service", name: w.serviceName, url: url(`/service/${w.serviceSlug}`) },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function itemListSchema(name: string, items: { name: string; href: string }[]): Json | null {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: url(it.href) })),
  };
}

/** 複数のノードを1つの @graph にまとめる */
export function graph(...nodes: (Json | null | undefined)[]): Json {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}
