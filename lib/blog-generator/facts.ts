import fs from "node:fs";
import path from "node:path";

/**
 * 事実シート（docs/VERIFIED_FACTS.md）の読み込みと、数値の突き合わせ。
 *
 * 記事に書いてよい数値は、事実シートに書かれているものだけ。
 * 記事の中の「数字＋単位」を取り出し、事実シートの中に同じものがあるかを機械で確かめる。
 * これで、存在しない金額・割合・年数・仕様の数字が記事に入るのを防ぐ。
 *
 * 自動生成の記事は、さらに「その題材で使ってよい節」の数値だけに絞る（scope）。
 * 事実シートのどこかにある数字なら何でも通す、という検査では、
 * 補助金の「3万円」を修理費として書くような、文脈の違う使い方を止められないため。
 */
export const FACTS_PATH = path.join(process.cwd(), "docs", "VERIFIED_FACTS.md");

export type FactSection = {
  title: string;
  /** 出典の URL（会社の資料で確認した節は空） */
  sources: string[];
  checkedAt: string;
  body: string;
  /** この節に出てくる「数字＋単位」（確認日の日付を含む） */
  tokens: Set<string>;
};

/** どの題材でも使ってよい節（前方一致） */
export const BASE_SECTIONS = ["会社", "施工事例", "設備の一般的な知識"];

export type FactSheet = {
  raw: string;
  sections: FactSection[];
  /** 事実シートに出てくる「数字＋単位」（正規化済み） */
  tokens: Set<string>;
  /** 出典として認められている URL */
  sourceUrls: Set<string>;
  /** 出典として認められているホスト名 */
  sourceHosts: Set<string>;
};

export function loadFactSheet(file: string = FACTS_PATH): FactSheet {
  const raw = fs.readFileSync(file, "utf8");
  const sections: FactSection[] = [];
  for (const chunk of raw.split(/^## /m).slice(1)) {
    const [head, ...rest] = chunk.split(/\r?\n/);
    const lines = rest.join("\n");
    const sources = [...lines.matchAll(/^出典:\s*(https?:\/\/\S+)\s*$/gm)].map((m) => m[1]);
    const checkedAt = /^確認日:\s*(\d{4}-\d{2}-\d{2})/m.exec(lines)?.[1] ?? "";
    sections.push({ title: head.trim(), sources, checkedAt, body: lines.trim(), tokens: new Set([...numericTokens(lines), ...dateTokens(checkedAt)]) });
  }
  const sourceUrls = new Set(sections.flatMap((s) => s.sources));
  const sourceHosts = new Set([...sourceUrls].map((u) => new URL(u).hostname));
  const tokens = new Set([...numericTokens(raw), ...sections.flatMap((s) => [...s.tokens])]);
  return { raw, sections, tokens, sourceUrls, sourceHosts };
}

/** 確認日（2026-10-06）を、記事に書く形（2026年・10月6日）にする */
function dateTokens(iso: string): string[] {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? [`${m[1]}年`, `${Number(m[2])}月${Number(m[3])}日`] : [];
}

/** 全角の英数字・記号を半角にし、数字の中のカンマを取る */
export function normalize(text: string): string {
  return text
    .replace(/[０-９Ａ-Ｚａ-ｚ．，％]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/(\d),(?=\d{3})/g, "$1")
    .replace(/〜|～/g, "〜")
    .replace(/／/g, "/");
}

/**
 * 突き合わせの対象にする単位。
 * 「3つ」「2回」「1日」のような、説明の中でふつうに使う数え方は対象にしない（誤検知が増えるだけなので）。
 * 金額・割合・年・重さ・量・長さ・電気・温度・号数・人口のように、事実として確かめられる数字だけを見る。
 */
const UNIT =
  "(?:億円|万円|円分|円|%|割|倍|年度|年|か月|ヶ月|kg|キログラム|cc|ml|リットル|㎡|平方メートル|平方キロメートル|km|メートル|cm|mm|kWh|kW|V|℃|度|号|世帯|人|戸|件|区|駅|番目|里)";
const TOKEN_RE = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${UNIT})`, "g");

/** 数え方として扱い、突き合わせをしない組み合わせ（小さな数＋ありふれた単位） */
function isCounting(num: number, unit: string): boolean {
  if (unit === "人" || unit === "件" || unit === "戸") return num < 100;
  if (unit === "度") return num < 10; // 「一度」「2度塗り」の類
  if (unit === "倍" || unit === "割") return false;
  if (unit === "か月" || unit === "ヶ月") return num <= 3;
  return false;
}

/** 文章から「数字＋単位」を取り出す（正規化して返す） */
export function numericTokens(text: string): string[] {
  const t = normalize(text)
    // URL と、Markdown のリンク先は数字の対象にしない
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\]\([^)]*\)/g, "]");
  const out: string[] = [];
  for (const m of t.matchAll(TOKEN_RE)) {
    const num = Number(m[1]);
    const unit = m[2].replace("ヶ月", "か月").replace("キログラム", "kg").replace("平方メートル", "㎡");
    if (isCounting(num, unit)) continue;
    out.push(`${m[1]}${unit}`);
  }
  // 日付（2026年12月31日 → 12月31日 も別に持つ）
  for (const m of t.matchAll(/(\d{1,2})月(\d{1,2})日/g)) out.push(`${m[1]}月${m[2]}日`);
  return out;
}

/**
 * 題材で使ってよい節の数値。
 * scope を渡さないとき（手書きの記事の点検）は、事実シート全体の数値を返す。
 */
export function allowedTokens(sheet: FactSheet, scope?: string[]): Set<string> {
  if (!scope) return sheet.tokens;
  return new Set(sectionsFor(sheet, [...BASE_SECTIONS, ...scope]).flatMap((s) => [...s.tokens]));
}

/** 題材で使ってよい節の出典 URL */
export function allowedSourceUrls(sheet: FactSheet, scope?: string[]): Set<string> {
  if (!scope) return sheet.sourceUrls;
  return new Set(sectionsFor(sheet, [...BASE_SECTIONS, ...scope]).flatMap((s) => s.sources));
}

/** 記事の文章の中で、事実シート（scope を渡したときは、その節）に無い「数字＋単位」を返す */
export function unknownNumericTokens(text: string, sheet: FactSheet, scope?: string[]): string[] {
  const allowed = allowedTokens(sheet, scope);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tok of numericTokens(text)) {
    if (allowed.has(tok) || seen.has(tok)) continue;
    seen.add(tok);
    out.push(tok);
  }
  return out;
}

/** 題材に関係する節だけを取り出して、プロンプト用の文章にする（title は前方一致） */
export function sectionsFor(sheet: FactSheet, titles: string[]): FactSection[] {
  return sheet.sections.filter((s) => titles.some((t) => s.title.startsWith(t)));
}
