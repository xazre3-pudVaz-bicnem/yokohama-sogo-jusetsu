import Image from "next/image";
import { img, type ImageKey } from "@/lib/images";

/**
 * 写真の表示（next/image）。画像のパスと縦横比は data/images.generated.json から引く。
 *
 * <Photo>     … 写真の縦横比のまま表示する。className は <img> に付く（幅いっぱい・高さは自動）。
 * <PhotoFill> … 親の枠いっぱいに敷き詰める。親に position: relative と高さ（aspect-ratio など）が必要。
 *               親の高さが 0 だと写真が見えなくなるので、必ず親で比率か高さを決めること。
 *
 * sizes は「画面幅に対して、この写真が占める幅」。必ず実際のレイアウトに合わせて渡す（転送量に直結する）。
 * 写真（JPEG 由来）は quality 60、線の細い図・ロゴは 75。
 *
 * priority … 最初の画面でいちばん大きく見える写真（各ページ1枚）にだけ付ける。
 *            先読み（preload）し、ほかの画像より先に取りに行く（fetchPriority="high"）。
 */
type CommonProps = {
  image: ImageKey;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  quality?: 60 | 75;
};

export function Photo({ image, alt, sizes, priority, className = "", quality = 60 }: CommonProps) {
  const info = img(image);
  return (
    <Image
      src={info.src}
      width={info.width}
      height={info.height}
      alt={alt}
      sizes={sizes}
      {...loadingProps(priority)}
      quality={quality}
      className={`h-auto w-full ${className}`}
    />
  );
}

export function PhotoFill({ image, alt, sizes, priority, className = "", quality = 60 }: CommonProps) {
  const info = img(image);
  return <Image src={info.src} alt={alt} fill sizes={sizes} {...loadingProps(priority)} quality={quality} className={`object-cover ${className}`} />;
}

function loadingProps(priority?: boolean) {
  return priority ? ({ preload: true, fetchPriority: "high", loading: "eager" } as const) : {};
}

/** 人物イラストなど、透過のある小さな絵 */
export function Illust({ image, alt = "", width, className = "" }: { image: ImageKey; alt?: string; width: number; className?: string }) {
  const info = img(image);
  const height = Math.round((info.height / info.width) * width);
  return <Image src={info.src} width={width} height={height} alt={alt} sizes={`${width}px`} quality={75} className={className} />;
}
