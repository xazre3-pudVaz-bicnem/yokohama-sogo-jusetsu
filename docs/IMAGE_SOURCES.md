# 画像の出典と、AI で作ったイラストの記録

最後に直した日：2026-10-20。

## 1. 写真

- 当社の現場の写真（`works/`）… 公式 Instagram の投稿と、会社から LINE で受け取った写真。「当社施工」と添える。
  2026-10-20 に受け取ったアルバム「工事写真」15枚（代表の説明つき）は、`assets/line/2026-10-20/` に置き、`scripts/prepare-images.mjs` の
  `ALBUM_2026_10_20` で書き出す。お客様の持ち物・窓の外の街並み・人の手や映り込みが写った部分は切り落とした。どの写真がどの事例かは `data/works.ts`。
- イメージ写真（`photos/`）… 依頼者が用意した生成画像と、Codex の画像生成で作った写真（`photos/window-inner`。下の 2'）。
  「写真はイメージです」と添え、施工事例のように見せない。
- 出典の表示が必要な写真（`area/`）… `data/company.ts` の `photoCredits`（横浜市オープンデータなど）。
- 元の画像は `assets/`（Git に入れない）。`npm run images:prepare`（`scripts/prepare-images.mjs`）で `public/images/` に書き出す。

## 2. AI で作ったイラスト（`public/images/ai/`）

2026-10-16 に、依頼者の「Codex の画像生成機能で、もっとデザインをおしゃれに、わかりやすく」という依頼で作りました。

- 作り方：Codex（ChatGPT のアカウント・組み込みの画像生成）。Codex CLI の `exec` を、読み取り専用の砂場・空の作業フォルダで動かし、1回に1枚だけ作らせる。
  最初の1枚（エアコン）で絵柄を決め、残りはそれを参照画像として渡して、絵柄・線の太さ・配色をそろえた。
- 書き出し：白い地を透明にして（外周からつながる白だけ。器の中の白は残す）余白を詰め、WebP にする（`scripts/prepare-images.mjs` の 4'）。
  元の PNG は `assets/ai/`（Git に入れない）。
- 使ってよいもの：工事・設備・作業の様子を、記号のように簡単にした絵。製品は特定のメーカーの機種に見えない形にする。
- 作らないもの：文字・数字・ロゴの入った絵、金額や順位の入った絵、当社の施工事例・スタッフ・お客様・事務所の写真に見える絵。

### 共通のプロンプト（主題だけを入れ替えた）

```text
Flat vector spot illustration for a friendly, stylish Japanese home-services company website (house equipment, renovation, exterior painting, garden).
Style: clean modern flat illustration, slight 3/4 (isometric-lite) view, soft rounded shapes, consistent medium-thin dark-navy outlines, flat colour fills, a very subtle soft shadow under the main object. Simple and readable even when shown small (about 80px wide): bold shapes, not too many tiny details.
Colour palette — use ONLY these colours: dark navy #0f2f73, royal blue #0d57e6, light blue #8bb4ff, pale blue #e3edff, sky blue #45b4ff, warm yellow #ffbd3d, cream #fdf7e3, white #ffffff. Include one or two small warm-yellow accents (a light, a sparkle, a small sun or a highlight) so the picture feels warm.

Subject: （下の表の「主題」）

Composition: the subject centred, occupying about 75% of a square 1:1 canvas, with comfortable empty margin on all sides.

Background: plain pure white #ffffff, completely empty — no floor plane, no frame, no circle or blob behind the subject.
Absolutely no text, letters, numbers, logos, brand marks, signage or price tags. Equipment must look generic and simplified, not like any real manufacturer's product. Not a realistic photo.
```

### 一覧

| ファイル | 使う場所 | 主題（Subject） |
| --- | --- | --- |
| `public/images/ai/svc-water-heater.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A generic wall-mounted gas water heater (a simple rounded rectangular box with a small round front window) fixed on a slice of light exterior house wall, with neat pipes coming out of the bottom; beside it a small faucet pouring warm water with two gentle steam curls rising. A small warm-yellow glow accent on the heater. |
| `public/images/ai/svc-ecocute.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A generic heat-pump hot-water system: a tall, slim, rounded hot-water storage tank standing next to a small outdoor heat-pump unit with a round fan grille, beside a slice of house wall, connected by short neat pipes. A small warm-yellow crescent moon and a tiny star as accents (it heats water at night). |
| `public/images/ai/svc-ene-farm.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | Replacing an old home energy unit: on the left an older generic tall box unit drawn slightly faded in pale grey-blue, a bold curved arrow pointing to the right, and on the right a fresh new generic wall-mounted water heater unit on a slice of wall with a small warm-yellow sparkle. A simple, clear 'old to new' picture. |
| `public/images/ai/svc-eco-one.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A hybrid hot-water and heating system beside a slice of house wall: a small outdoor heat-pump unit with a round fan grille, a compact gas unit and a slim tank grouped together and joined by short pipes, with a small warm-yellow sun and a small blue flame as accents, showing two energy sources working together. |
| `public/images/ai/svc-toilet.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A clean modern toilet with a smooth rounded seat and a slim remote control panel on the wall beside it, on a light floor, with a small potted plant and a small warm-yellow sparkle. Simple, hygienic, calm. |
| `public/images/ai/svc-air-conditioner.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A wall-mounted room air conditioner on a light wall with three gentle curved airflow lines, and next to it a small outdoor condenser unit standing on two feet, connected by a neat pipe-cover duct running along the wall. A small warm-yellow sparkle. |
| `public/images/ai/svc-kitchen-equipment.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A built-in kitchen cooktop set into a light counter with a sleek modern range hood above it, a small pot on the cooktop with gentle steam, and a warm-yellow glow under the pot. |
| `public/images/ai/svc-solar.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | The pitched roof of a small house covered with dark-blue solar panels (grid lines), a bright warm-yellow sun with short rays in the top corner, and a small light-blue sparkle reflecting on the panels. |
| `public/images/ai/svc-storage-battery.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A generic home storage battery unit (a tall rounded box) standing beside a slice of house wall, with a simple lightning-bolt shape on its front panel in warm yellow and a short cable going into a small wall socket. Clean and modern. |
| `public/images/ai/svc-exterior-painting.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A slice of house exterior wall where the left half is freshly painted in light blue and the right half is the older pale cream colour, a paint roller on a long pole pressed against the wall leaving a fresh stroke, a small paint tray on the ground, and part of a simple scaffolding frame at the side. |
| `public/images/ai/svc-roof-painting.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A section of a pitched slate roof with a gutter along the edge, where half of the roof surface has been freshly repainted in deep navy blue and the other half is faded pale grey, with a paint roller resting on the roof and a small warm-yellow sparkle on the new paint. |
| `public/images/ai/svc-reform.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A freshly renovated modern kitchen and dining corner: a clean light counter with warm wooden lower cabinets, a pendant lamp with a warm-yellow glow above, and a small wooden dining table with one chair. Bright and stylish. |
| `public/images/ai/svc-demolition.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | Interior preparation for a renovation: a section of a room wall opened up to show the vertical wooden studs inside, the floor covered with a light-blue protective sheet, a tidy tool box with a hammer and a crowbar in front. Clean and safe, not destructive; only interior work, no building collapse. |
| `public/images/ai/svc-garden.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A small tidy garden: a neatly pruned round tree, a low rounded shrub, a short wooden deck with a few planks, a pair of pruning shears resting on the deck, and a small warm-yellow sun. |
| `public/images/ai/svc-other.webp` | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A bathroom scene: a flat rectangular heater-dryer panel in the ceiling blowing three gentle warm-air lines down over a simple bathtub, and in the foreground a modern single-lever faucet. A small warm-yellow accent in the warm air. |
| `public/images/ai/svc-window.webp`（2026-10-20） | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A sliding window set in a slice of light interior wall, with a second white inner window frame (double glazing) installed on the room side just inside the existing window; two short arrows show cold air blocked outside (light blue) and warm air kept inside (warm yellow). A small curtain tie at one side. Clean and simple. |
| `public/images/ai/svc-tatami.webp`（2026-10-20） | サービスのカード（トップの事業内容・関連サービス・記事の「関係するサービス」） | A corner of a Japanese-style room: a few tatami mats on the floor drawn in pale cream with fine woven texture lines and navy borders, one borderless square tatami mat (Ryukyu-style) in front, and a sliding fusuma door with a plain light-blue paper panel and a small round recessed pull at the side. A small warm-yellow sparkle on the new mat. |
| `public/images/ai/feat-range.webp` | トップの「横浜総合住設の特徴」 | A small house in the centre with four small round badges floating around it, each containing one simple object: a wrench, a paint roller, a small tree sprig, and a water drop — showing many kinds of home work handled by one company. |
| `public/images/ai/feat-bundle.webp` | トップの「横浜総合住設の特徴」 | A single clipboard checklist with four checkbox lines (lines only, no writing), three of them ticked, and a small desk calendar behind it with one day highlighted in warm yellow — several jobs planned together in one schedule. |
| `public/images/ai/feat-survey.webp` | トップの「横浜総合住設の特徴」 | An on-site survey kit: a retractable measuring tape with its tape pulled out, a clipboard with a simple outline sketch of a house, and a pencil, in front of a small house. No text, no numbers on the tape. |
| `public/images/ai/feat-difficult.webp` | トップの「横浜総合住設の特徴」 | A tall house wall with an outdoor air-conditioner unit mounted high up on a sturdy wall bracket near the eaves, a ladder leaning against the wall, and a safety helmet hanging on the ladder — a careful high-place installation. |
| `public/images/ai/feat-finish.webp` | トップの「横浜総合住設の特徴」 | A clean room corner where the floor is covered with a light-blue protective sheet held down by strips of masking tape, a roll of masking tape and a small soft broom nearby, and a small warm-yellow sparkle showing tidiness. |
| `public/images/ai/feat-business.webp` | トップの「横浜総合住設の特徴」 | A small modern apartment building and a neighbouring low office building side by side, with a rolled blueprint and a white hard hat in front of them. |
| `public/images/ai/feat-subsidy.webp` | トップの「横浜総合住設の特徴」 | A neat stack of application documents (only lines, no writing), a round approval-stamp mark with no characters on the top sheet, a pen, and a small house next to the documents with a small warm-yellow sparkle. No yen sign, no coins with numbers. |
| `public/images/ai/feat-local.webp` | トップの「横浜総合住設の特徴」 | A small friendly two-storey office building on a gentle light-blue hill, with a big map location pin above it (navy pin with a warm-yellow centre), and a few small houses and round trees around it in the distance. |
| `public/images/ai/flow-contact.webp` | 工事の流れ（トップ・/flow） | A smartphone showing a simple chat screen with two speech bubbles (no writing), and a small telephone handset beside it with two small call-wave lines. |
| `public/images/ai/flow-hearing.webp` | 工事の流れ（トップ・/flow） | A smartphone sending a photo: inside a chat bubble on the screen is a small picture of a wall-mounted unit, with a small camera beside the phone and a speech bubble with three dots. |
| `public/images/ai/flow-survey.webp` | 工事の流れ（トップ・/flow） | A clipboard and a measuring tape in front of a slice of house exterior wall where a generic wall-mounted unit is fixed, with a small magnifying glass looking at the unit. |
| `public/images/ai/flow-estimate.webp` | 工事の流れ（トップ・/flow） | A neatly itemised estimate sheet (only lines and boxes, no writing or numbers), a simple calculator with blank keys, and a small brochure showing simple pictures of equipment. |
| `public/images/ai/flow-contract.webp` | 工事の流れ（トップ・/flow） | A wall calendar page with one day circled in warm yellow (the calendar grid has no numbers), and a document with a signature squiggle and a pen beside it. |
| `public/images/ai/flow-work.webp` | 工事の流れ（トップ・/flow） | A tool box with a spanner and a screwdriver, a light-blue protective sheet on the floor, and a new generic unit being fixed onto a wall bracket with a small drill. |
| `public/images/ai/flow-handover.webp` | 工事の流れ（トップ・/flow） | A shiny new generic wall-mounted unit with warm-yellow sparkles around it, a small remote control and a closed instruction booklet (no writing) in front of it. |
| `public/images/ai/flow-after.webp` | 工事の流れ（トップ・/flow） | A small house with a heart shape and a chat bubble floating above it, and a small spanner beside the house — friendly after-service and support. |
| `public/images/ai/house-overview.webp` | トップの「事業内容」の家の断面図（広い画面では、工事の名前の札をのせる。位置は `components/home/ServicesSection.tsx` の PINS） | 下のプロンプト |

家の断面図のプロンプト：

```text
Flat vector spot illustration for a friendly, stylish Japanese home-services company website (house equipment, renovation, exterior painting, garden).
Style: clean modern flat illustration, slight 3/4 (isometric-lite) view, soft rounded shapes, consistent medium-thin dark-navy outlines, flat colour fills, a very subtle soft shadow under the main object. Simple and readable even when shown small (about 80px wide): bold shapes, not too many tiny details.
Colour palette — use ONLY these colours: dark navy #0f2f73, royal blue #0d57e6, light blue #8bb4ff, pale blue #e3edff, sky blue #45b4ff, warm yellow #ffbd3d, cream #fdf7e3, white #ffffff. Include one or two small warm-yellow accents (a light, a sparkle, a small sun or a highlight) so the picture feels warm.

Isometric cutaway illustration of a two-storey Japanese detached house, seen from the front-right at a 3/4 angle, with the front wall cut away so the rooms inside are visible. Show clearly and separately:
- on the roof: dark-blue solar panels;
- ground floor: a kitchen with a built-in cooktop and a range hood; a living room with a wall-mounted air conditioner; a small toilet room with a toilet;
- upstairs: a bathroom with a bathtub and a ceiling heater-dryer panel; a bedroom;
- outside on the right side wall: a generic wall-mounted gas water heater, and next to it a tall slim hot-water tank with a small heat-pump unit;
- outside on the left: a home storage battery box against the wall; part of the exterior wall covered by a light scaffolding with a paint roller (repainting);
- in front: a small garden with a neatly pruned round tree, shrubs and a wooden deck.
Bright, airy, friendly and tidy. Same flat style and palette as described. Landscape 3:2 canvas (wider than tall), the house centred with a little empty margin.
Background: plain pure white #ffffff with only a soft pale-blue (#e3edff) rounded ground shadow under the house.
Absolutely no text, labels, numbers, logos or people. Equipment generic and simplified.
```

作り直すときは、同じプロンプトと参照画像（同じ絵柄の1枚）を渡し、出来上がりを目で確かめてから `assets/ai/` を差し替える。
家の断面図を作り直したら、札の位置（PINS）を合わせ直す。

## 2'. Codex の画像生成で作ったイメージ写真（`public/images/photos/`）

当社の現場の写真が無いサービスの、ページの冒頭に使う。画面には「写真はイメージです」と出る（`photos/` の写真は自動でそうなる）。
元の PNG は `assets/source/photos-gen/`（Git に入れない）。書き出しは `scripts/prepare-images.mjs` の `PHOTOS_GEN`。

| ファイル | 使う場所 | 作った日 |
| --- | --- | --- |
| `public/images/photos/window-inner.webp` | 内窓の設置・窓の交換のページ（`/service/window`）の冒頭 | 2026-10-20 |

```text
Photorealistic interior photograph for a Japanese home-renovation company website (it will be labelled "image for illustration").
Subject: a bright, tidy Japanese living room window seen from inside: an existing aluminium sliding window with a newly installed white resin inner window (secondary sliding window) fitted just inside it, creating a double window. Soft natural daylight, a sheer curtain gathered at one side, a light wooden floor and a little of a sofa edge. Calm, clean, modern.
Composition: landscape 3:2, the window centred and clearly showing the two layers of sashes; eye-level, natural perspective, no fisheye.
Absolutely no people, no text, no logos, no brand marks, no signage, no price tags. Nothing that identifies a real house or address.
```

作らないもの：当社の施工事例・スタッフ・お客様・事務所に見える写真、実在の家や住所が分かる写真、特定のメーカーの製品に見える写真。

## 3. 給湯器専門サイトの素材（`public/images/boiler/`）

同じ会社の給湯器専門サイト（https://www.yokoju-boiler.com ・リポジトリ `yokohamatotalhousingsolutions-boiler`）の
`public/images/ai/` から写したもの。専門サイトで Codex の画像生成で作った絵（2026-10-15）。記録は専門サイトの `docs/IMAGE_SOURCES.md`。

| ファイル | 内容 | 使う場所 |
| --- | --- | --- |
| `boiler/mascot-wave`・`mascot-point`・`mascot-ok` | 専門サイトの案内役「ゆげまる」（湯気の妖精。専門サイトのために作ったオリジナル） | 給湯器専門サイトへの案内（`components/sections/SpecialtySiteBanner.tsx`）だけ |
| `boiler/bubbles` | 泡の背景（専門サイトのトップの背景と同じ絵） | 同上 |
