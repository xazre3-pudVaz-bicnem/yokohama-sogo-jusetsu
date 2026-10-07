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

## デザインと文章

- **手本は SOLAR SHIFT（https://www.solarshift.jp/ ・`c:\projects\SOLAR SHIFT`）のデザインとイラストの使い方**（2026-10-07 に依頼者が指定）。
  クリーム地の帯、吹き出し型のラベル（`.pill`）、蛍光ペン（`.marker`）、白い角丸のパネル（`.card`・`.rows`）、色の板つきの写真（`.photo-frame`）、
  丸いボタン、人物のイラストと吹き出し。色だけ、このサイトの濃紺と青に置き換えている。
- 人物のイラストは、内容に合うものを区画ごとに1つ（冒頭・補足・ご相談の例・費用・よくある質問・工事の流れ・末尾の案内）。
  1つの区画で写真とイラストを混ぜない。補足のラベルは中身を表す言葉にする（「スタッフからひとこと」を全ページに置かない）。
- **トップの冒頭は、写真を一面に敷いて、文字を写真の上に直接載せる。白いパネルと人物のイラスト・吹き出しは置かない**
  （2026-10-07 に依頼者が指定）。文字の後ろだけ `.hero-veil` で淡くぼかす。隅に「写真はイメージです」と添える。
- **ページの冒頭に問い合わせのボタン・電話番号を置かない。** 案内は、ヘッダー／ページ末尾の `CtaBand`／スマホの固定ボタン／本文中に多くて1か所。
- 絵文字、サービスごとに色を変えたアイコン、飾りの連番（01・02）は使わない。番号は、順番のある工程にだけ。
- 見出しは内容をそのまま書く（「〜で、できること。」「こんなお悩みに」「もっと知る」のような型を作らない）。
  会社が掲げていない標語を、会社のことばとして書かない。「住まいのことなら、まとめてヨコジュウへ。」はトップの1か所だけ。
- サービスページは `data/services/*.ts` の `layout` で、サービスごとに区画の順番と見せ方を変える。同じ型を全サービスに当てはめない。
- 当社の現場の写真（`works/`）を優先し、「当社施工」と添える。生成したイメージ写真（`photos/`）には「写真はイメージです」と添え、
  施工事例のように見せない。
- 飾りの動きは数回で止め、画面内にあるあいだだけ動かす。左右から現れる動きは 1280px 以上だけ（狭い幅では横にはみ出すため）。
- 見た目を変えても、title・description・canonical・構造化データ・内部リンク・見出しの文言は変えない。変えたら、改修前後を比べて確かめる。

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
