# 株式会社 横浜総合住設 公式サイト

横浜市戸塚区の住宅設備・リフォーム会社の公式サイト（愛称「ヨコジュウ」）。今後つくる専門サイトの親サイト。
全体の説明は [README.md](README.md)、未確認の情報は [docs/TODO.md](docs/TODO.md)。
`c:\projects\CLAUDE.md` のマスタールールも適用する。

## 守ること

- **確認できない内容を書かない。** 金額・施工件数・創業年・資格・保証年数・メーカー認定・「地域No.1」「満足度◯%」は、
  資料で確認できたものだけ。確認できない項目は `lib/site.ts` で `null` のままにし、`docs/TODO.md` に足す。
- **電話番号を勝手に確定しない。** 資料に複数ある。`lib/site.ts` の `companyPhone`（表示中・仮）／`companyMobile`（非表示）／
  `contactEmail`（空）を分けて持つ。担当者個人の番号・アドレスは載せない。
- **会社情報を各ファイルに直接書かない。** 会社名・住所・電話は `lib/site.ts`、サービスは `data/services/`、
  事例は `data/works.ts`、地域は `data/areas.ts`、制度は `data/subsidies.ts` から出す。
- **補助金・制度・統計の数値は、出典 URL と確認日つき**で `data/subsidies.ts` と `docs/VERIFIED_FACTS.md` の両方に書く。
  片方だけ直さない。
- **地域名だけを替えたページを作らない。** 地域ページは、その地域にしか当てはまらない内容が書けるものだけ（`data/areas.ts`）。
- **FAQPage の構造化データは、そのページに表示している質問だけ。**
- 解体工事は「リフォームに伴う解体のみ」。建物全体の解体の依頼は受けていない、と明記する。
- 会社について書ける範囲：`docs/VERIFIED_FACTS.md` の「会社」「施工事例」の節と、チラシ・看板・Instagram にある表現
  （見積もり無料・現地調査・補助金の申請サポート・メーカー正規品の取り扱い・法人や工務店にも対応・神奈川と東京に対応）。

## つくり

- Next.js 16（App Router）／TypeScript／Tailwind CSS v4。全ページ静的。お問い合わせは Server Action ＋ Resend。
- `NEXT_PUBLIC_SITE_URL`（＝`lib/site.ts` の `productionUrl`）が空のビルドは、全ページ noindex・sitemap は空。意図した動作。
- 見出しは `components/ui/Phrase.tsx`（BudouX）で文節ごとに区切る。サーバーコンポーネント専用（`"use client"` から読み込まない）。
  見出しの文言を大きく足したら `npx tsx scripts/phrase-check.ts --show` で区切りを見る。
- カスタムの CSS クラスは `app/globals.css` の `@layer components` の中に書く（外に書くとユーティリティを打ち消す）。
- 横にずらす登場アニメーションは、スマホでは縦の動きに変えてある（横スクロールが出るため）。`body` は `overflow-x: clip`。
- 写真は `components/ui/Photo.tsx`。`priority` は各ページで最初に大きく見える1枚だけ。
- 元の画像は `assets/`（Git に入れない）。`npm run images:prepare` で `public/images/` と `data/images.generated.json` を作る。

## コラムの自動投稿

- GitHub Actions（毎日 9:20 JST）→ `scripts/generate-blog-post.ts` → `content/blog/*.md` → main に push。
- 題材は `lib/blog-generator/topics.ts`（1題材＝1検索意図）。数値は、題材の `facts` に挙げた事実シートの節にあるものだけ通る。
- 検査の規則は `lib/blog-generator/validate.ts` の1か所。生成と点検（`blog:audit`）で同じ関数を使う。
- 規則・事実シート・題材を変えたら `npm run blog:selftest` と `npm run blog:audit`。

## 変更したら

```bash
npm run typecheck && npm run lint && npm run build && npm run site:check
```

画面を変えたときは、幅 360px・390px・1440px で横はみ出しと見出しの折り返しを確かめる。
