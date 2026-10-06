/**
 * ロゴ素材（assets/source/ の元画像）から、サイトで使う画像を作る。元画像は変更しない。
 *   node scripts/prepare-brand.mjs
 *
 * 背景が透明なロゴは提供されていないので、次の2つを元画像から切り出す。
 *   - logo-mark.png       … 白背景版から切り出したマーク。明るい背景（ヘッダーなど）用
 *   - logo-mark-dark.png  … 濃紺背景版から切り出したマーク。濃い背景（フッター・ヒーローなど）用
 * 社名の文字は画像にせず、HTML の文字として組む（拡大しても崩れず、読み上げにも対応できる）。
 * 正式な透過ロゴ（PNG / SVG）を受け取ったら、public/images/brand/ の同名ファイルを差し替える。
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "assets", "source");
const OUT = path.join(process.cwd(), "public", "images", "brand");
const APP = path.join(process.cwd(), "app");
fs.mkdirSync(OUT, { recursive: true });

const WHITE = path.join(SRC, "S__49709079_0.jpg"); // ロゴ（白背景）
const DARK = path.join(SRC, "S__49709080_0.jpg"); // ロゴ（濃紺背景）

/** 白背景のロゴを、外周からつながっている白だけ透明にする（マーク内部の白い光沢は残す） */
async function cutoutFromWhite(file, box) {
  const { data, info } = await sharp(file).extract(box).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const N = W * H;
  const light = (i) => Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
  // 1) 外周から、ほぼ白（240 以上）の画素をたどる
  const bg = new Uint8Array(N);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = y * W + x;
    if (bg[i] || light(i) < 240) return;
    bg[i] = 1;
    stack.push(i);
  };
  for (let x = 0; x < W; x++) {
    push(x, 0);
    push(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    push(0, y);
    push(W - 1, y);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % W;
    const y = (i - x) / W;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }
  // 2) 背景に接する帯（縁と落ち影）は、明るさから不透明度を決めて、白の混ざりを取り除く
  const R = 14;
  const near = new Uint8Array(N);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!bg[y * W + x]) continue;
      for (let dy = -R; dy <= R; dy += 2) {
        for (let dx = -R; dx <= R; dx += 2) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < W && ny < H) near[ny * W + nx] = 1;
        }
      }
    }
  }
  for (let i = 0; i < N; i++) {
    if (bg[i]) {
      data[i * 4 + 3] = 0;
      continue;
    }
    if (!near[i]) continue;
    const L = light(i);
    const a = Math.max(0, Math.min(1, (246 - L) / 60));
    if (a >= 1) continue;
    if (a <= 0.02) {
      data[i * 4 + 3] = 0;
      continue;
    }
    for (let k = 0; k < 3; k++) data[i * 4 + k] = Math.max(0, Math.min(255, Math.round((data[i * 4 + k] - (1 - a) * 255) / a)));
    data[i * 4 + 3] = Math.round(a * 255);
  }
  return sharp(data, { raw: { width: W, height: H, channels: 4 } });
}

/** 濃紺背景のロゴを、背景色との差から不透明度を決めて切り出す（濃い背景に置く前提） */
async function cutoutFromDark(file, box) {
  const { data, info } = await sharp(file).extract(box).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  // 背景は中央がわずかに明るいので、四隅と上下左右の辺の中央から背景色を補間する
  const sample = (x, y) => [data[(y * W + x) * 4], data[(y * W + x) * 4 + 1], data[(y * W + x) * 4 + 2]];
  const corners = [sample(2, 2), sample(W - 3, 2), sample(2, H - 3), sample(W - 3, H - 3)];
  const bgAt = (x, y) => {
    const u = x / (W - 1);
    const v = y / (H - 1);
    return [0, 1, 2].map((k) => corners[0][k] * (1 - u) * (1 - v) + corners[1][k] * u * (1 - v) + corners[2][k] * (1 - u) * v + corners[3][k] * u * v);
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const b = bgAt(x, y);
      const d = Math.max(data[i] - b[0], data[i + 1] - b[1], data[i + 2] - b[2]);
      const a = Math.max(0, Math.min(1, (d - 14) / 70));
      if (a <= 0.01) {
        data[i + 3] = 0;
        continue;
      }
      if (a < 1) for (let k = 0; k < 3; k++) data[i + k] = Math.max(0, Math.min(255, Math.round((data[i + k] - (1 - a) * b[k]) / a)));
      data[i + 3] = Math.round(a * 255);
    }
  }
  return sharp(data, { raw: { width: W, height: H, channels: 4 } });
}

// マークの範囲（元画像 1254×1254 の中での位置。scripts 内で実測した値）
const MARK_WHITE = { left: 262, top: 164, width: 800, height: 680 };
const MARK_DARK = { left: 282, top: 140, width: 834, height: 690 };

const light = await cutoutFromWhite(WHITE, MARK_WHITE);
await light.clone().trim().resize({ height: 240 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, "logo-mark.png"));

const dark = await cutoutFromDark(DARK, MARK_DARK);
await dark.clone().resize({ height: 240 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, "logo-mark-dark.png"));

// 構造化データ（Organization.logo）用：元のロゴ全体を正方形のまま縮小
await sharp(WHITE).resize(600, 600).png({ compressionLevel: 9 }).toFile(path.join(OUT, "logo-square.png"));

// ブラウザのタブ・ホーム画面のアイコン：切り出したマーク（文字は含めない）を、ロゴと同じ濃紺の正方形に載せる
const ICON_SIZE = 1024;
const iconMark = await dark.clone().resize({ width: 800 }).png().toBuffer();
const iconMeta = await sharp(iconMark).metadata();
const iconBg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_SIZE}" height="${ICON_SIZE}"><defs><radialGradient id="g" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#06163c"/><stop offset="1" stop-color="#010b24"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
);
const iconBase = await sharp(iconBg)
  .composite([{ input: iconMark, left: Math.round((ICON_SIZE - iconMeta.width) / 2), top: Math.round((ICON_SIZE - iconMeta.height) / 2) }])
  .png()
  .toBuffer();
await sharp(iconBase).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(APP, "icon.png"));
await sharp(iconBase).resize(180, 180).png({ compressionLevel: 9 }).toFile(path.join(APP, "apple-icon.png"));

for (const f of ["logo-mark.png", "logo-mark-dark.png", "logo-square.png"]) {
  const m = await sharp(path.join(OUT, f)).metadata();
  console.log(f, `${m.width}x${m.height}`, Math.round(fs.statSync(path.join(OUT, f)).size / 1024) + "KB");
}
