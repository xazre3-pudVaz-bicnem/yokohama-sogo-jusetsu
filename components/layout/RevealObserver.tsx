"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 画面に入った要素に印を付ける（表示の切り替えは CSS 側）。
 *
 * 1. 登場アニメーション … data-reveal を付けた要素が画面に入ったら data-revealed を付ける。
 *    - 最初の判定が終わるまで html[data-reveal-on] を付けない。つまり「最初から画面内にある要素」は
 *      一度も隠れない（LCP を遅らせない・ちらつかない）。画面外の要素だけが隠れて、入ってきたときに現れる。
 *    - getBoundingClientRect を全要素に呼ぶと content-visibility:auto の区画まで強制レイアウトされるので、
 *      判定は IntersectionObserver の結果だけで行う。
 *
 * 2. ページ内リンク … 描画を後回しにしている区画（.cv）は、画面に入るまで仮の高さで置かれている。
 *    スクロールの途中で手前の区画が本当の高さに変わると着地点がずれるので、
 *    飛ぶ前に「行き先より手前にある区画」を先に描画させてから移動する。
 *
 * JS が動かなければ html[data-reveal-on] が付かないので、すべて表示されたままになる。
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    let first = true;

    const io = new IntersectionObserver(
      (entries) => {
        const vh = window.innerHeight;
        for (const e of entries) {
          const r = e.boundingClientRect;
          // 初回だけは「少しでも画面にかかっている」ものを全部表示済みにする
          const inView = e.isIntersecting || (first && r.height > 0 && r.top < vh && r.bottom > 0);
          if (inView) {
            (e.target as HTMLElement).dataset.revealed = "1";
            io.unobserve(e.target);
          }
        }
        first = false;
        root.dataset.revealOn = "1";
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 },
    );

    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();

    // ── ページ内リンク：行き先より手前（と、行き先を含む）区画を先に描画させる
    const showBefore = (target: Element) => {
      document.querySelectorAll<HTMLElement>(".cv").forEach((el) => {
        if (el.contains(target) || el.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) {
          el.style.contentVisibility = "visible";
        }
      });
    };
    const targetOf = (hash: string): Element | null => {
      if (hash.length < 2) return null;
      try {
        return document.getElementById(decodeURIComponent(hash.slice(1)));
      } catch {
        return null;
      }
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || !a.hash || a.pathname !== window.location.pathname) return;
      const target = targetOf(a.hash);
      if (target) showBefore(target);
    };
    document.addEventListener("click", onClick, true);

    // URL に # が付いた状態で開いたとき（他ページからのリンクなど）
    const initial = targetOf(window.location.hash);
    if (initial) {
      showBefore(initial);
      initial.scrollIntoView({ behavior: "instant", block: "start" });
    }

    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick, true);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
