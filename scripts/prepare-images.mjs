/**
 * 元画像（assets/ 以下。Git 管理外）を Web 用に最適化して public/images/ に出力し、
 * 画像の一覧（data/images.generated.json：パスと縦横のサイズ）を作り直す。
 *   node scripts/prepare-images.mjs
 *
 * 元画像の置き場所
 *   assets/source/photos/         … 受け取ったイメージ写真（ChatGPT 画像 …png）
 *   assets/source/illustrations/  … 受け取った人物イラスト（people-*.webp / pose-*.webp）
 *   assets/source/                … ロゴ・チラシ・看板・表札の写真（担当者の連絡先が載っているため公開しない）
 *   assets/instagram/             … 公式 Instagram の施工写真（index.json に投稿日とキャプション）
 *   assets/stock/                 … 出典の表示が必要な写真（横浜市オープンデータなど。data/credits.ts に出典）
 *
 * 写真を差し替えるときは、下の表の「元ファイル名」を新しいファイルに変えて、このスクリプトを実行する。
 * 表の3つ目に { left, top, width, height } を書くと、元画像のその範囲だけを切り出す
 * （遠景に実在しない街並みが写り込んでいる画像は、その部分を切り落とすか、かすみに置き換えて使う）。
 * public/ に元画像を直接置かないこと（置いたものはすべて公開される）。
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "images");
const manifest = {};

async function emit(key, pipeline, { quality = 84 } = {}) {
  const file = path.join(OUT, `${key}.webp`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const info = await pipeline.webp({ quality, effort: 5 }).toFile(file);
  manifest[key] = { src: `/images/${key}.webp`, width: info.width, height: info.height };
  return info;
}

/* ------------------------------------------------------------------ */
/* 1. イメージ写真（元ファイル名の時刻部分 → 出力名）                   */
/* ------------------------------------------------------------------ */
const PHOTOS = [
  ["17_30_52", "photos/toilet-wood"],
  ["17_31_14", "photos/kitchen-stove-hood"],
  // 元画像の右端に、実在しない高層ビル群の遠景が写っているため、左側だけを使う
  ["17_31_36-2", "photos/house-solar-roof", { left: 0, top: 0, width: 1200, height: 941 }],
  ["17_31_38-3", "photos/ecocute-side"],
  ["17_31_40-4", "photos/gas-water-heater-wall"],
  ["17_31_42-5", "photos/toilet-counter"],
  ["17_31_44-6", "photos/kitchen-open"],
  ["17_31_45-7", "photos/living-aircon"],
  ["17_31_48-8", "photos/house-modern-front"],
  ["17_31_50-9", "photos/garden-approach"],
  ["17_31_52-10", "photos/old-unit-and-tank"],
  ["17_34_36-2", "photos/house-solar-hill"],
  ["17_34_38-3", "photos/gas-water-heater-side"],
  ["17_34_40-4", "photos/ecocute-wall"],
  ["17_34_42-5", "photos/toilet-luxury"],
  ["17_34_44-6", "photos/kitchen-garden-view"],
  ["17_34_46-7", "photos/living-aircon-garden"],
  ["17_34_48-8", "photos/house-white-gray"],
  ["17_34_51-9", "photos/garden-entrance-stone"],
  ["17_34_52-10", "photos/garden-deck-terrace"],
  ["17_38_35-1", "photos/painting-scaffold"],
  ["17_38_37-2", "photos/painting-masking"],
  ["17_38_39-3", "photos/painting-roof-gutter"],
  ["17_38_41-4", "photos/house-dark-gray"],
  ["17_38_48-8", "photos/reform-ldk"],
  ["17_38_50-9", "photos/reform-bathroom"],
  ["17_38_51-10", "photos/reform-kitchen-wood"],
];
const photoDir = path.join(ROOT, "assets", "source", "photos");
const photoFiles = fs.readdirSync(photoDir);
for (const [stamp, key, region] of PHOTOS) {
  const file = photoFiles.find((f) => f.endsWith(`${stamp}.png`));
  if (!file) throw new Error(`写真が見つかりません: ${stamp}`);
  const source = sharp(path.join(photoDir, file));
  await emit(key, (region ? source.extract(region) : source).resize({ width: 1672, withoutEnlargement: true }), { quality: 86 });
}

// トップの冒頭の背景に使う、横長の写真。
// 元の写真の左側（遠景）に、実在しない高層ビル・塔・湾が写っているため、その帯だけを強くぼかして「かすみ」にする。
// ぼかした帯は、上下と右の端をなだらかに元の写真へつなぐ（境目が見えないように）。
{
  const file = photoFiles.find((f) => f.endsWith("17_34_34-1.png"));
  if (!file) throw new Error("写真が見つかりません: 17_34_34-1");
  const src = path.join(photoDir, file);
  const R = { left: 0, top: 418, width: 500, height: 176 };
  const hazy = await sharp(src).blur(30).extract(R).removeAlpha().toBuffer();
  // マスク：左は全面、右端 18% でなだらかに 0 へ。上 22%・下 16% もなだらかに
  const maskH = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${R.width}" height="${R.height}"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="0.8" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );
  const maskV = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${R.width}" height="${R.height}"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="0.22" stop-color="#fff"/><stop offset="0.84" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );
  const mask = await sharp(maskH)
    .composite([{ input: maskV, blend: "multiply" }])
    .removeAlpha()
    .extractChannel(0)
    .toBuffer();
  const patch = await sharp(hazy).joinChannel(mask).png().toBuffer();
  await emit("photos/hero-wide", sharp(src).composite([{ input: patch, left: R.left, top: R.top }]), { quality: 84 });
  // スマホ用：縦長の画面に横長の写真を敷くと大きく引き伸ばされるので、建物が写る右側だけを切り出したものを使う
  await emit("photos/hero-tall", sharp(src).extract({ left: 690, top: 0, width: 982, height: 941 }).resize({ width: 860 }), { quality: 82 });
}

/* ------------------------------------------------------------------ */
/* 2. 人物イラスト（緑の差し色を、ブランドの青に置き換える）            */
/* ------------------------------------------------------------------ */
const RECOLOR_GREEN_TO_BLUE = true;
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}
function hslToRgb(h, s, l) {
  h /= 360;
  const f = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [f(p, q, h + 1 / 3), f(p, q, h), f(p, q, h - 1 / 3)].map((v) => Math.round(v * 255));
}
const illustDir = path.join(ROOT, "assets", "source", "illustrations");
for (const file of fs.readdirSync(illustDir).filter((f) => f.endsWith(".webp"))) {
  const key = `illust/${file.replace(/\.webp$/, "")}`;
  const { data, info } = await sharp(path.join(illustDir, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (RECOLOR_GREEN_TO_BLUE) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
      if (s > 0.12 && h >= 125 && h <= 185) {
        // 緑（色相 150〜165°）→ ロゴの青（色相 218°）。明るさはそのまま、彩度は少しだけ上げる
        const [r, g, b] = hslToRgb(218, Math.min(1, s * 1.08), l);
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
    }
  }
  // 余白を切り詰めてから書き出す（大きい絵は横 720px まで）
  await emit(key, sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().resize({ width: 720, withoutEnlargement: true }), { quality: 88 });
}

/* ------------------------------------------------------------------ */
/* 3. Instagram の施工写真                                              */
/* ------------------------------------------------------------------ */
const IG = [
  // 外壁・屋根塗装（会社が作った工程紹介の画像）
  ["p01-1.jpg", "works/painting-process"],
  // エアコン取替（高所作業）
  ["p05-1.jpg", "works/aircon-high-place"],
  // 浴室暖房乾燥機
  ["p04-1.jpg", "works/bath-dryer-before-unit"],
  ["p04-2.jpg", "works/bath-dryer-before-remote"],
  ["p04-3.jpg", "works/bath-dryer-working"],
  ["p04-4.jpg", "works/bath-dryer-after-room"],
  ["p04-5.jpg", "works/bath-dryer-after-unit"],
  ["p04-6.jpg", "works/bath-dryer-after-remote"],
  // ウッドデッキ
  ["p06-1.jpg", "works/wood-deck-1-ground"],
  ["p06-2.jpg", "works/wood-deck-2-sheet"],
  ["p06-3.jpg", "works/wood-deck-3-done"],
  ["p06-4.jpg", "works/wood-deck-4-top"],
  // カップボード
  ["p07-1.jpg", "works/cupboard"],
  // 養生
  ["p08-1.jpg", "works/floor-protection"],
  // 空調配管のラッキングカバー
  ["p09-1.jpg", "works/lagging-1"],
  ["p09-2.jpg", "works/lagging-2"],
  ["p09-3.jpg", "works/lagging-3"],
  ["p09-4.jpg", "works/lagging-4"],
  ["p09-5.jpg", "works/lagging-5"],
  // エアコン取替（2台）
  ["p11-1.jpg", "works/aircon-a-before-indoor"],
  ["p11-2.jpg", "works/aircon-a-before-outdoor"],
  ["p11-3.jpg", "works/aircon-a-after-indoor"],
  ["p11-4.jpg", "works/aircon-a-after-outdoor"],
  ["p11-5.jpg", "works/aircon-b-before-indoor"],
  ["p11-6.jpg", "works/aircon-b-before-outdoor"],
  ["p11-7.jpg", "works/aircon-b-after-indoor"],
  ["p11-8.jpg", "works/aircon-b-after-outdoor"],
  // エアコン取替（化粧テープ → 化粧カバー）
  ["p12-1.jpg", "works/aircon-cover-before-indoor"],
  ["p12-2.jpg", "works/aircon-cover-before-outdoor"],
  ["p12-3.jpg", "works/aircon-cover-after-indoor"],
  ["p12-4.jpg", "works/aircon-cover-after-outdoor"],
  // Instagram の区画で使う画像
  ["p03-1.jpg", "instagram/banner-yokoju"],
];
const igDir = path.join(ROOT, "assets", "instagram");
for (const [file, key] of IG) {
  await emit(key, sharp(path.join(igDir, file)).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }));
}
// 工程紹介の画像の上の部分（一覧のカード用。題名と施工前の屋根の写真が入る範囲）
await emit("works/painting-process-card", sharp(path.join(igDir, "p01-1.jpg")).extract({ left: 112, top: 0, width: 1128, height: 846 }));
// 工程紹介の画像の中の写真（屋根：施工前・塗装後／破風：塗装前・塗装後）。文字のラベルが掛からない範囲だけを切り出す
await emit("works/painting-roof-before", sharp(path.join(igDir, "p01-1.jpg")).extract({ left: 520, top: 282, width: 312, height: 234 }));
await emit("works/painting-gable-before", sharp(path.join(igDir, "p01-1.jpg")).extract({ left: 260, top: 964, width: 344, height: 258 }));
await emit("works/painting-roof-after", sharp(path.join(igDir, "p01-1.jpg")).extract({ left: 676, top: 546, width: 332, height: 336 }));
await emit("works/painting-gable-after", sharp(path.join(igDir, "p01-1.jpg")).extract({ left: 656, top: 908, width: 350, height: 330 }));
// ステッカーの写真（ステッカーの部分だけを切り出す）
await emit("company/stickers", sharp(path.join(igDir, "p02-1.jpg")).extract({ left: 60, top: 230, width: 600, height: 450 }));

/* ------------------------------------------------------------------ */
/* 4. 会社の写真・出典の表示が必要な写真                                */
/* ------------------------------------------------------------------ */
// 表札（下の段の「株式会社 横浜総合住設」の部分）
await emit("company/nameplate", sharp(path.join(ROOT, "assets", "source", "S__49709077_0.jpg")).rotate().extract({ left: 120, top: 880, width: 820, height: 200 }));
// 戸塚駅周辺の空撮（横浜市オープンデータ・CC BY 4.0）
await emit("area/totsuka-aerial", sharp(path.join(ROOT, "assets", "stock", "totsuka-station-area.jpg")).resize({ width: 2000 }), { quality: 80 });
// みなとみらいの夜景（akumach・CC BY 2.0）
await emit("area/yokohama-minatomirai", sharp(path.join(ROOT, "assets", "stock", "minato-mirai-in-blue.jpg")).extract({ left: 0, top: 560, width: 3840, height: 2011 }).resize({ width: 2000 }), { quality: 80 });

/* ------------------------------------------------------------------ */
/* 5. SNS 共有用の画像（1200×630）                                      */
/* ------------------------------------------------------------------ */
const ogBase = await sharp(path.join(photoDir, photoFiles.find((f) => f.endsWith("17_34_34-1.png"))))
  .resize(1200, 630, { fit: "cover", position: "right" })
  .toBuffer();
const mark = await sharp(path.join(OUT, "brand", "logo-mark-dark.png")).resize({ height: 132 }).toBuffer();
const FONT = "'Yu Gothic UI','Yu Gothic','Meiryo','Hiragino Sans',sans-serif";
const ogOverlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#020b24" stop-opacity="0.96"/>
      <stop offset="0.55" stop-color="#071a45" stop-opacity="0.86"/>
      <stop offset="1" stop-color="#071a45" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <polygon points="0,612 1200,612 1200,630 0,630" fill="#0d57e6"/>
  <text x="250" y="124" font-family="'Century Gothic','Segoe UI',sans-serif" font-size="46" letter-spacing="9" fill="#ffffff">YOKOHAMA</text>
  <text x="252" y="160" font-family="'Century Gothic','Segoe UI',sans-serif" font-size="21" letter-spacing="4" fill="#c9d3e6">Total Housing Solutions</text>
  <text x="80" y="318" font-family="${FONT}" font-size="64" font-weight="700" fill="#ffffff">住まいのことなら、</text>
  <text x="80" y="404" font-family="${FONT}" font-size="64" font-weight="700" fill="#ffffff">まとめて<tspan fill="#4db8ff">ヨコジュウ</tspan>へ。</text>
  <text x="82" y="486" font-family="${FONT}" font-size="29" font-weight="700" fill="#ffffff">株式会社 横浜総合住設</text>
  <text x="82" y="534" font-family="${FONT}" font-size="25" fill="#d5ddec">横浜市戸塚区の住宅設備・リフォーム</text>
</svg>`);
await sharp(ogBase)
  .composite([
    { input: ogOverlay, left: 0, top: 0 },
    { input: mark, left: 76, top: 56 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(ROOT, "public", "og-image.jpg"));

/* ------------------------------------------------------------------ */
/* 6. 一覧を書き出す                                                    */
/* ------------------------------------------------------------------ */
// ロゴ（scripts/prepare-brand.mjs が作る）も一覧に入れる
for (const f of ["logo-mark", "logo-mark-dark", "logo-square"]) {
  const m = await sharp(path.join(OUT, "brand", `${f}.png`)).metadata();
  manifest[`brand/${f}`] = { src: `/images/brand/${f}.png`, width: m.width, height: m.height };
}
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "data", "images.generated.json"), JSON.stringify(sorted, null, 2) + "\n");
const total = Object.keys(sorted).length;
let bytes = 0;
for (const v of Object.values(sorted)) bytes += fs.statSync(path.join(ROOT, "public", v.src)).size;
console.log(`${total} 枚を書き出しました（合計 ${(bytes / 1024 / 1024).toFixed(1)} MB）`);
