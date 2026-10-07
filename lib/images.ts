import manifest from "@/data/images.generated.json";

/**
 * 画像の一覧（scripts/prepare-images.mjs が作る data/images.generated.json）を型つきで引く。
 * キーは「フォルダ/名前」（例：photos/hero-wide）。存在しないキーはビルド時に型エラーになる。
 */
export type ImageKey = keyof typeof manifest;
export type ImageInfo = { src: string; width: number; height: number };

export function img(key: ImageKey): ImageInfo {
  return manifest[key];
}

export function hasImage(key: string): key is ImageKey {
  return key in manifest;
}
