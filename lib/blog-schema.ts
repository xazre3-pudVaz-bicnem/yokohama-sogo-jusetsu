import { z } from "zod";
import { blogClusterIds } from "@/lib/blog-clusters";

/**
 * コラム記事の frontmatter の型（手書きの記事にも、自動生成の記事にも同じ検査をかける）。
 * サイト側（lib/blog.ts）と生成側（lib/blog-generator/）の両方がこれを使う。
 */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD の形で書く");

export const postFaqSchema = z.object({
  q: z.string().min(8).max(80),
  a: z.string().min(30).max(400),
});

export const postSourceSchema = z.object({
  /** 出典の名称（例：給湯省エネ2026事業 事務局） */
  title: z.string().min(2),
  url: z.string().url(),
  /** 出典を確認した日 */
  checkedAt: isoDate,
});

export const postFrontmatterSchema = z.object({
  title: z.string().min(12).max(48),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "半角の英小文字・数字・ハイフンだけ")
    .min(6)
    .max(80),
  description: z.string().min(60).max(130),
  /** カテゴリ（lib/blog-clusters.ts の id） */
  category: z.enum(blogClusterIds),
  /** 検索キーワード。**先頭が主キーワード**（この記事が代表になる検索語。ほかの記事・固定ページと同じ語にしない） */
  keywords: z.array(z.string().min(2)).min(2).max(8),
  /** この記事が答える検索意図（1記事1意図。重複の判定に使う） */
  intent: z.string().min(6).max(60),
  publishedAt: isoDate,
  updatedAt: isoDate,
  author: z.string().min(2),
  /** 質問と答え。本文で答えきれなかった関連する疑問があるときだけ書く（無くてよい） */
  faq: z.array(postFaqSchema).max(5).default([]),
  /** 関連するサービスのスラッグ（data/services）。先頭が親ページ */
  relatedServices: z.array(z.string()).min(1).max(4),
  /** 関連する記事のスラッグ（無ければ空配列。表示のときに同じカテゴリから補う） */
  relatedArticles: z.array(z.string()).max(4).default([]),
  /** 関連する地域ページのスラッグ（data/areas） */
  relatedAreas: z.array(z.string()).max(2).default([]),
  /** 制度・数値の出典（補助金などを書いた記事では必須） */
  sources: z.array(postSourceSchema).max(8).default([]),
  /** 自動生成の記事かどうか（手書きは false） */
  generated: z.boolean().default(false),
  /**
   * 記事の冒頭に出す写真（data/images.generated.json のキー。例：works/wood-deck-3-done）。
   * 省略すると、カテゴリの写真が出る。当社の現場の写真がある記事では、それを指定する。
   */
  cover: z.string().optional(),
  /** cover を指定したときの、写真の説明 */
  coverAlt: z.string().optional(),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
export type PostFaq = z.infer<typeof postFaqSchema>;
export type PostSource = z.infer<typeof postSourceSchema>;
