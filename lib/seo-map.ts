import { publishedAreas } from "@/data/areas";
import { normalizeKeyword, seoPages, type SeoPageEntry } from "@/data/seo-keyword-map";
import { getService, servicePath } from "@/data/services";
import { serviceSlugsWithWorkList, workListKeyword, workListPath, works, worksByArea, worksByService, worksOfMainService } from "@/data/works";
import { activeClusters, getAllPosts, getPostsByArea, getPostsByClusters, getPostsByService, getPostsForWork, getRelatedPosts, MIN_POSTS_TO_INDEX } from "@/lib/blog";
import { backlog } from "@/lib/blog-generator/backlog";
import { topics } from "@/lib/blog-generator/topics";

/**
 * 検索語の割り当ての全体（サーバー専用。fs を使う lib/blog.ts を読むため、クライアント側から import しない）。
 *
 * data/seo-keyword-map.ts の表（トップ・案内・地域・サービス）に、データから作られるページ
 * （施工事例・サービス別の事例一覧・コラムの記事・コラムのカテゴリ）を足して、1つの一覧にする。
 * 関連するサービス・施工事例・記事は、それぞれのデータのつながりから求める（表に二重に書かない）。
 *
 * この一覧と、これから書く題材（topics.ts）・候補（backlog.ts）を合わせて、
 * 同じ検索語を2つの URL が狙っていないかを確かめる（keywordConflicts）。npm run seo:audit が使う。
 */
export type SeoEntry = SeoPageEntry & {
  /** 関連するサービスのスラッグ */
  relatedServices: string[];
  /** 関連する施工事例のスラッグ */
  relatedWorks: string[];
  /** 関連するコラムの記事のスラッグ */
  relatedArticles: string[];
  /** 検索結果に出すページか（記事の少ないカテゴリは false） */
  index: boolean;
};

const slugs = <T extends { slug: string }>(list: T[]) => list.map((x) => x.slug);

export function fullKeywordMap(): SeoEntry[] {
  const posts = getAllPosts();
  const out: SeoEntry[] = [];

  /* 表に書いてあるページ */
  for (const p of seoPages) {
    let relatedServices: string[] = [];
    let relatedWorks: string[] = [];
    let relatedArticles: string[] = [];
    const service = p.url.startsWith("/service/") ? getService(p.url.split("/").pop() ?? "") : undefined;
    const area = p.url.startsWith("/area/") ? publishedAreas.find((a) => `/area/${a.slug}` === p.url) : undefined;
    if (service) {
      relatedServices = service.related;
      relatedWorks = slugs(worksByService(service.slug));
      relatedArticles = slugs([...getPostsByService(service.slug, 5), ...getPostsByClusters(service.blogClusters, 5)].filter((x, i, a) => a.findIndex((y) => y.slug === x.slug) === i).slice(0, 5));
    } else if (area) {
      relatedServices = area.serviceNotes.map((n) => n.service);
      relatedWorks = slugs(worksByArea(area.slug));
      relatedArticles = slugs(getPostsByArea(area.slug, 4));
    }
    out.push({ ...p, relatedServices, relatedWorks, relatedArticles, index: true });
  }

  /* 施工事例 */
  for (const w of works) {
    const main = getService(w.services[0]);
    const imageKeys = [w.cover.key, ...w.beforeAfter.flatMap((b) => [b.before.key, b.after.key]), ...w.gallery.map((g) => g.key)];
    out.push({
      url: `/works/${w.slug}`,
      primaryKeyword: w.keyword,
      secondaryKeywords: [],
      searchIntent: `「${w.title}」の工事の内容と、施工前後の写真を見たい`,
      contentType: "work",
      parentTopic: workListPath(w.services[0]) ?? "/works",
      relatedServices: w.services,
      relatedWorks: slugs(works.filter((x) => x.slug !== w.slug && x.services[0] === w.services[0])),
      relatedArticles: slugs(getPostsForWork({ slug: w.slug, services: w.services, relatedArticles: w.relatedArticles, imageKeys }, 3)),
      index: true,
    });
    void main;
  }

  /* サービス別の施工事例の一覧（事例が3件以上あるサービスだけ） */
  for (const slug of serviceSlugsWithWorkList()) {
    const s = getService(slug)!;
    out.push({
      url: `/works/service/${slug}`,
      primaryKeyword: workListKeyword(s.shortName),
      secondaryKeywords: [],
      searchIntent: `${s.shortName}の工事の実例を、まとめて見たい`,
      contentType: "works-list",
      parentTopic: "/works",
      relatedServices: [slug],
      relatedWorks: slugs(worksOfMainService(slug)),
      relatedArticles: slugs(getPostsByService(slug, 4)),
      index: true,
    });
  }

  /* コラムの記事 */
  for (const p of posts) {
    const main = p.relatedServices[0];
    out.push({
      url: `/blog/${p.slug}`,
      primaryKeyword: p.keywords[0],
      secondaryKeywords: p.keywords.slice(1),
      searchIntent: p.intent,
      contentType: "article",
      parentTopic: p.cluster.pillar.href,
      relatedServices: p.relatedServices,
      relatedWorks: slugs(main ? worksByService(main).slice(0, 3) : []),
      relatedArticles: slugs(getRelatedPosts(p, 3)),
      index: true,
    });
  }

  /* コラムのカテゴリ（記事が1本以上あるもの。3本未満は noindex） */
  for (const { cluster, count } of activeClusters()) {
    out.push({
      url: `/blog/category/${cluster.id}`,
      primaryKeyword: `${cluster.name} コラム`,
      secondaryKeywords: [],
      searchIntent: `${cluster.name}についての記事を、まとめて読みたい`,
      contentType: "blog-category",
      parentTopic: "/blog",
      relatedServices: cluster.pillar.href.startsWith("/service/") ? [cluster.pillar.href.replace("/service/", "")] : [],
      relatedWorks: [],
      relatedArticles: slugs(posts.filter((p) => p.category === cluster.id)),
      index: count >= MIN_POSTS_TO_INDEX,
    });
  }
  return out;
}

export type KeywordConflict = { level: "error" | "warning"; message: string };

/**
 * 同じ検索語を2つの URL が狙っていないかを確かめる。
 *   誤り（error）
 *     - 主キーワードが、ほかのページの主キーワード・副キーワードと同じ
 *     - 副キーワードが、ほかのページの副キーワードと同じ
 *     - これから書く題材・候補の主キーワードが、公開済みのページ・ほかの題材や候補と同じ
 *     - 親ページ（parentTopic）が一覧に無い
 *   注意（warning）
 *     - 「譲った」と書いた検索語（cedes）を、譲り先のページが担当していない
 */
export function keywordConflicts(map: SeoEntry[] = fullKeywordMap()): KeywordConflict[] {
  const out: KeywordConflict[] = [];
  const owner = new Map<string, { url: string; kind: "主" | "副"; raw: string }>();
  const urls = new Set(map.map((e) => e.url));

  for (const e of map) {
    for (const [kind, list] of [["主", [e.primaryKeyword]], ["副", e.secondaryKeywords]] as const) {
      for (const raw of list) {
        const k = normalizeKeyword(raw);
        if (!k) continue;
        const prev = owner.get(k);
        if (prev && prev.url !== e.url) {
          out.push({ level: "error", message: `検索語「${raw}」を、${prev.url}（${prev.kind}）と ${e.url}（${kind}）の両方が狙っています` });
        } else if (!prev) {
          owner.set(k, { url: e.url, kind, raw });
        }
      }
    }
    if (e.parentTopic && !urls.has(e.parentTopic)) out.push({ level: "error", message: `${e.url} の親ページ ${e.parentTopic} が、一覧にありません` });
    for (const c of e.cedes ?? []) {
      const o = owner.get(normalizeKeyword(c.keyword));
      if (!urls.has(c.to)) out.push({ level: "warning", message: `${e.url} が「${c.keyword}」を譲った先 ${c.to} が、一覧にありません` });
      else if (o && o.url !== c.to) out.push({ level: "warning", message: `${e.url} は「${c.keyword}」を ${c.to} に譲ったと書いていますが、実際に担当しているのは ${o.url} です` });
    }
  }
  // cedes は、すべてのページを登録し終えてから、もう一度確かめる（登録の順番に左右されないように）
  for (const e of map) {
    for (const c of e.cedes ?? []) {
      const o = owner.get(normalizeKeyword(c.keyword));
      if (urls.has(c.to) && !o) out.push({ level: "warning", message: `${e.url} が「${c.keyword}」を譲った先 ${c.to} は、その検索語を担当していません（表に足すか、cedes を直す）` });
    }
  }

  /* これから書く題材・候補 */
  const published = new Set(map.filter((e) => e.contentType === "article").map((e) => e.url.replace("/blog/", "")));
  const planned = new Map<string, string>();
  for (const t of topics) {
    if (published.has(t.slug)) continue; // すでに記事になっている題材は、記事の側で確かめている
    const k = normalizeKeyword(t.keyword);
    const o = owner.get(k);
    if (o) out.push({ level: "error", message: `題材 ${t.slug} の主キーワード「${t.keyword}」は、${o.url} が担当しています` });
    const dup = planned.get(k);
    if (dup) out.push({ level: "error", message: `題材 ${t.slug} と ${dup} の主キーワード「${t.keyword}」が同じです` });
    planned.set(k, `題材 ${t.slug}`);
  }
  for (const c of backlog) {
    const k = normalizeKeyword(c.keyword);
    const o = owner.get(k);
    if (o) out.push({ level: "error", message: `候補「${c.keyword}」（${c.cluster}）は、${o.url} が担当しています` });
    const dup = planned.get(k);
    if (dup) out.push({ level: "error", message: `候補「${c.keyword}」（${c.cluster}）は、${dup} と同じ検索語です` });
    planned.set(k, `候補「${c.keyword}」`);
  }
  return out;
}

/** サービスページへのパス → スラッグ（一覧の表示用） */
export function serviceLabel(slug: string): string {
  const s = getService(slug);
  return s ? `${s.shortName}（${servicePath(s)}）` : slug;
}
