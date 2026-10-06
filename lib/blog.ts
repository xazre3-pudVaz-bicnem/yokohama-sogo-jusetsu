import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { postFrontmatterSchema, type PostFrontmatter } from "@/lib/blog-schema";
import { getCluster, type BlogCluster } from "@/lib/blog-clusters";

/**
 * コラム記事の読み込み（サーバー専用。content/blog/*.md）。
 * WordPress などの外部システムは使わず、記事はリポジトリ内の Markdown として持つ。
 * 毎日の自動投稿（scripts/generate-blog-post.ts）は、このフォルダに1ファイル足してコミットする。
 *
 * frontmatter が検査に通らない記事があると、ビルドを失敗させる（壊れた記事を公開しないため）。
 */
export const BLOG_DIR = path.join(process.cwd(), "content", "blog");
export const POSTS_PER_PAGE = 12;
/** カテゴリ別の一覧を検索結果に出すのに必要な記事数（これ未満は noindex） */
export const MIN_POSTS_TO_INDEX = 3;

export type Post = PostFrontmatter & {
  body: string;
  cluster: BlogCluster;
  /** 本文の文字数（空白・記号を除く目安） */
  length: number;
  headings: { level: 2 | 3; text: string; id: string }[];
};

/** 見出しの文字列から、ページ内リンク用の id を作る */
export function headingId(text: string): string {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[\s　]+/g, "-")
      .replace(/[^\p{L}\p{N}-]/gu, "")
      .slice(0, 60) || "section"
  );
}

function extractHeadings(body: string): Post["headings"] {
  const out: Post["headings"] = [];
  const seen = new Map<string, number>();
  let inCode = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^```/.test(line)) inCode = !inCode;
    if (inCode) continue;
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, "");
    let id = headingId(text);
    const n = seen.get(id) ?? 0;
    seen.set(id, n + 1);
    if (n > 0) id = `${id}-${n + 1}`;
    out.push({ level: m[1].length as 2 | 3, text, id });
  }
  return out;
}

/** Markdown の記号を除いた本文の文字数 */
export function bodyLength(body: string): number {
  return body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|\-]/g, "")
    .replace(/\s+/g, "").length;
}

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const posts: Post[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = postFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      const detail = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" / ");
      throw new Error(`[blog] ${file} の frontmatter が正しくありません → ${detail}`);
    }
    const fm = parsed.data;
    if (`${fm.slug}.md` !== file) throw new Error(`[blog] ${file}: ファイル名と slug（${fm.slug}）が一致していません`);
    const cluster = getCluster(fm.category);
    if (!cluster) throw new Error(`[blog] ${file}: カテゴリ ${fm.category} がありません`);
    const body = content.trim();
    posts.push({ ...fm, body, cluster, length: bodyLength(body), headings: extractHeadings(body) });
  }
  // 新しい順。同じ日は slug 順で固定する
  posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));
  // 今日より先の日付の記事は出さない（予約投稿）
  const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
  cache = posts.filter((p) => p.publishedAt <= today);
  return cache;
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCluster(id: string): Post[] {
  return getAllPosts().filter((p) => p.category === id);
}

/** 複数のカテゴリにまたがる関連記事（サービスページの「関連コラム」用）。先に挙げたカテゴリを優先 */
export function getPostsByClusters(ids: string[], limit = 4): Post[] {
  const all = getAllPosts();
  const out: Post[] = [];
  for (const id of ids) {
    for (const p of all) {
      if (p.category === id && !out.includes(p)) out.push(p);
    }
  }
  return out.slice(0, limit);
}

/** そのサービスを relatedServices に挙げている記事 */
export function getPostsByService(serviceSlug: string, limit = 4): Post[] {
  return getAllPosts()
    .filter((p) => p.relatedServices.includes(serviceSlug))
    .slice(0, limit);
}

export function getPostsByArea(areaSlug: string, limit = 4): Post[] {
  return getAllPosts()
    .filter((p) => p.relatedAreas.includes(areaSlug) || p.category === areaSlug)
    .slice(0, limit);
}

/** 記事の下に出す関連記事。指定があればそれを、足りなければ同じカテゴリ → 同じサービスの順に補う */
export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const all = getAllPosts().filter((p) => p.slug !== post.slug);
  const picked: Post[] = [];
  const add = (p?: Post) => {
    if (p && !picked.includes(p) && picked.length < limit) picked.push(p);
  };
  post.relatedArticles.forEach((slug) => add(all.find((p) => p.slug === slug)));
  all.filter((p) => p.category === post.category).forEach(add);
  all.filter((p) => p.relatedServices.some((s) => post.relatedServices.includes(s))).forEach(add);
  return picked;
}

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
}

export function paginate<T>(items: T[], page: number): T[] {
  return items.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
}

/** 記事が1本以上あるカテゴリ（一覧のタブ・サイトマップ用） */
export function activeClusters(): { cluster: BlogCluster; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([id, count]) => ({ cluster: getCluster(id)!, count }))
    .sort((a, b) => b.count - a.count || a.cluster.name.localeCompare(b.cluster.name, "ja"));
}
