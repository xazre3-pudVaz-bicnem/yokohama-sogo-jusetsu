import type { ReactNode } from "react";
import Link from "next/link";
import { WorkCard, WorkFeature } from "@/components/cards/WorkCard";
import { SubsidyCaution, SubsidyNote } from "@/components/sections/SubsidyNote";
import { FieldNote } from "@/components/ui/FieldNote";
import { Icon } from "@/components/ui/Icon";
import { Illust, PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading, SectionSplit } from "@/components/ui/SectionHeading";
import type { Service } from "@/data/services";
import type { BlockPhoto, ServiceBlock, ServiceGuide } from "@/data/services/types";
import type { Subsidy } from "@/data/subsidies";
import { workListPath, type Work } from "@/data/works";
import { isContactFormShown } from "@/lib/contact";
import { img, type ImageKey } from "@/lib/images";
import { reveal } from "@/lib/reveal";
import { lineUrl } from "@/lib/site";

/**
 * サービスページの本文の区画。
 *
 * どのサービスも同じ順番・同じ見せ方にならないよう、区画の種類と見せ方（variant）を用意し、
 * 並べ方は data/services/*.ts の layout で、サービスごとに決めている。
 * 見た目は「地色の帯に白い角丸パネル」。番号を付けるのは、順番のある工程（steps）だけ。
 * 人物のイラストは、ご相談の例・補足・費用の区画に添える（1つの区画の中で、写真とイラストを混ぜない）。
 */
export type Tone = "white" | "mist" | "cream" | "paper";

const BAND: Record<Tone, string> = {
  white: "bg-white",
  mist: "band band-mist deco-tr",
  cream: "band band-cream deco-bl",
  paper: "band band-paper",
};

/** 区画の目次用の名前（ページ内の案内に使う） */
export function blockLabel(block: ServiceBlock, service: Service): { id: string; label: string } | null {
  switch (block.type) {
    case "signs":
      return { id: "signs", label: block.heading };
    case "menu":
      return { id: "menu", label: "対応工事" };
    case "guide": {
      const g = service.guides.find((x) => x.id === block.id);
      return g ? { id: g.id, label: g.heading.replace(/（.*）$/, "") } : null;
    }
    case "scope":
      return { id: "scope", label: block.heading };
    case "cost":
      return { id: "cost", label: "費用の考え方" };
    case "subsidy":
      return { id: "subsidy", label: "補助金・支援制度" };
    case "works":
      return { id: "works", label: "施工事例" };
    case "local":
      return { id: "local", label: "戸塚区・横浜市での工事" };
    default:
      return null;
  }
}

function Shell({ id, tone, lazy = true, children }: { id?: string; tone: Tone; lazy?: boolean; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className={`${lazy ? "cv" : ""} section ${BAND[tone]}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 部品                                                                */
/* ------------------------------------------------------------------ */
function Fig({ photo, sizes, aspect, frame }: { photo: BlockPhoto; sizes: string; aspect?: string; frame?: "l" | "r" }) {
  const info = img(photo.image);
  const ratio = aspect ?? (info.height > info.width ? "aspect-[3/4]" : "aspect-[4/3]");
  const card = (
    <div className={`photo-card relative ${ratio}`}>
      <PhotoFill image={photo.image} alt={photo.alt} sizes={sizes} />
    </div>
  );
  return (
    <figure>
      {frame ? <div className={`photo-frame ${frame === "r" ? "photo-frame-r" : ""}`}>{card}</div> : card}
      <figcaption className="mt-2.5 text-xs leading-relaxed text-ink-mute">{photo.caption ?? "写真はイメージです"}</figcaption>
    </figure>
  );
}

type Item = { title: string; body: string };

/** 1枚の白いパネルの中に、見出しと説明の行を点線で区切って並べる */
function ItemRows({ items, stacked = false }: { items: Item[]; stacked?: boolean }) {
  return (
    <ul className="rows" {...reveal(60)}>
      {items.map((it) => (
        <li key={it.title} className={`py-5 ${stacked ? "" : "grid gap-x-8 gap-y-1.5 md:grid-cols-[13rem_1fr]"}`}>
          <h3 className="text-base font-bold leading-[1.75]">
            <Phrase>{it.title}</Phrase>
          </h3>
          <p className={`text-[0.9375rem] leading-[1.95] ${stacked ? "mt-1.5" : ""}`}>{it.body}</p>
        </li>
      ))}
    </ul>
  );
}

/** 白い角丸パネルを横に並べる */
function ItemCards({ items }: { items: Item[] }) {
  const n = items.length;
  const cols = n === 2 ? "lg:grid-cols-2" : n === 4 ? "lg:grid-cols-4" : n === 5 ? "lg:grid-cols-5" : "lg:grid-cols-3";
  return (
    <ul className={`grid gap-4 sm:grid-cols-2 ${cols}`}>
      {items.map((it, i) => (
        <li key={it.title} className="card card-line border-t-4 !border-t-brand-500 p-5 sm:p-6" {...reveal((i % 5) * 70)}>
          <h3 className="text-[1.0313rem] font-bold leading-[1.6]">
            <Phrase>{it.title}</Phrase>
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-[1.9]">{it.body}</p>
        </li>
      ))}
    </ul>
  );
}

/** 工程ごとに写真を1枚ずつ付けた手順（写真の枚数が、工程の数と同じときに使う） */
function PhotoSteps({ items, photos }: { items: Item[]; photos: BlockPhoto[] }) {
  const cols = items.length === 2 ? "sm:grid-cols-2" : items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";
  return (
    <ol className={`grid gap-6 ${cols}`}>
      {items.map((it, i) => (
        <li key={it.title} className="card relative overflow-hidden" {...reveal((i % 4) * 90)}>
          <div className="relative aspect-[4/3] bg-silver-100">
            <PhotoFill image={photos[i].image} alt={photos[i].alt} sizes="(min-width: 640px) 32vw, 100vw" />
            <span className="num absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-brand-600 text-base font-semibold text-white shadow-card">{i + 1}</span>
          </div>
          <div className="p-5 sm:p-6">
            <h3 className="text-[1.0625rem] font-bold leading-[1.6]">
              <Phrase>{it.title}</Phrase>
            </h3>
            <p className="mt-2 text-[0.9375rem] leading-[1.9]">{it.body}</p>
            <p className="mt-3 text-xs leading-relaxed text-ink-mute">{photos[i].caption ?? "写真はイメージです"}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** 番号つきの手順（順番のある工程だけに使う）。番号の丸を、縦の線でつなぐ */
function ItemSteps({ items }: { items: Item[] }) {
  return (
    <ol className="relative" {...reveal(60)}>
      {items.map((it, i) => (
        <li key={it.title} className="relative flex gap-4 pb-4 last:pb-0 sm:gap-5">
          {i < items.length - 1 && <span className="absolute bottom-0 left-[1.0625rem] top-9 w-0.5 bg-brand-200" aria-hidden="true" />}
          <span className="num relative grid size-9 shrink-0 place-items-center rounded-full bg-brand-600 text-base font-semibold text-white shadow-card">{i + 1}</span>
          <div className="card card-line flex-1 px-5 py-4">
            <h3 className="text-base font-bold leading-[1.7]">
              <Phrase>{it.title}</Phrase>
            </h3>
            <p className="mt-1 text-[0.9375rem] leading-[1.9]">{it.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** チェックの印が付いた一覧（ご相談の例） */
function CheckList({ items, cols = false }: { items: string[]; cols?: boolean }) {
  return (
    <ul className={cols ? "grid gap-x-8 sm:grid-cols-2" : ""}>
      {items.map((w, i) => (
        <li key={w} className={`flex items-center gap-3 border-silver-300 py-3 text-[0.9688rem] font-bold leading-[1.7] text-navy-900 sm:text-base ${i > 0 ? "border-t-2 border-dotted" : ""} ${cols && i === 1 ? "sm:border-t-0" : ""}`}>
          <span className="grid size-6 shrink-0 place-items-center rounded-md border-[2.5px] border-brand-500 text-brand-600" aria-hidden="true">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d="m3 8.5 3.2 3.2L13 4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>
            <Phrase>{w}</Phrase>
          </span>
        </li>
      ))}
    </ul>
  );
}

function SpecTable({ service }: { service: Service }) {
  const t = service.table;
  if (!t) return null;
  return (
    <div className="mt-10" {...reveal()}>
      <p className="mb-3 font-heading text-[0.9375rem] font-bold text-navy-900">{t.caption}</p>
      <p className="mb-2 text-xs text-ink-mute sm:hidden">表は横にスクロールできます</p>
      {/* 横にスクロールする領域は、キーボードでも動かせるようにフォーカスを受ける */}
      <div className="table-wrap" tabIndex={0} role="region" aria-label={t.caption}>
        <table className="table-spec">
          <caption className="sr-only">{t.caption}</caption>
          <thead>
            <tr>
              {t.head.map((h, i) => (
                <th key={i} scope="col">
                  {h || <span className="sr-only">項目</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={i}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {t.note && <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-mute">{t.note}</p>}
    </div>
  );
}

/** 補足に添えるイラストを、題に合わせて選ぶ */
function poseFor(label: string): ImageKey {
  if (/補助金|費用|容量/.test(label)) return "illust/pose-calc";
  if (/ご用意|お知らせ|ご相談|お問い合わせ/.test(label)) return "illust/pose-phone";
  if (/養生|足場|床/.test(label)) return "illust/pose-trust";
  if (/型番|一覧/.test(label)) return "illust/pose-chart";
  return "illust/pose-idea";
}

/* ------------------------------------------------------------------ */
/* 区画                                                                */
/* ------------------------------------------------------------------ */
function GuideBlock({ service, guide, block, tone, lazy }: { service: Service; guide: ServiceGuide; block: Extract<ServiceBlock, { type: "guide" }>; tone: Tone; lazy: boolean }) {
  const signs = block.signs ? (
    <div className="card mt-6 border-2 border-brand-200 px-5 py-4 sm:px-7" {...reveal(80)}>
      <p className="mb-1">
        <span className="tag tag-blue">ご相談の例</span>
      </p>
      <CheckList items={service.worries} cols />
    </div>
  ) : null;

  if (block.variant === "rows") {
    return (
      <Shell id={guide.id} tone={tone} lazy={lazy}>
        <SectionSplit heading={<SectionHeading id={guide.id} title={guide.heading} lead={guide.intro} />}>
          <ItemRows items={guide.items} stacked />
          {signs}
          {block.table && <SpecTable service={service} />}
        </SectionSplit>
      </Shell>
    );
  }

  if (block.variant === "steps") {
    const photos = block.photos ?? [];
    // 写真が工程と同じ枚数あるときは、工程ごとに写真を付ける
    if (photos.length === guide.items.length) {
      return (
        <Shell id={guide.id} tone={tone} lazy={lazy}>
          <SectionHeading id={guide.id} eyebrow="施工の順番" title={guide.heading} lead={guide.intro} align="center" />
          <div className="mt-10">
            <PhotoSteps items={guide.items} photos={photos} />
          </div>
          {block.table && <SpecTable service={service} />}
        </Shell>
      );
    }
    return (
      <Shell id={guide.id} tone={tone} lazy={lazy}>
        <SectionHeading id={guide.id} eyebrow="施工の順番" title={guide.heading} lead={guide.intro} />
        <div className="mt-9 grid gap-x-12 gap-y-9 lg:grid-cols-12">
          <div className={photos.length ? "lg:col-span-7" : "lg:col-span-9"}>
            <ItemSteps items={guide.items} />
          </div>
          {photos.length > 0 && (
            <div className={`grid content-start gap-x-4 gap-y-5 lg:col-span-5 ${photos.length > 1 ? "grid-cols-2" : ""}`} {...reveal(100, "right")}>
              {photos.map((p) => (
                <Fig key={p.image} photo={p} sizes={photos.length > 1 ? "(min-width: 1024px) 19vw, 50vw" : "(min-width: 1024px) 38vw, 100vw"} aspect="aspect-[4/3]" />
              ))}
            </div>
          )}
        </div>
        {block.table && <SpecTable service={service} />}
      </Shell>
    );
  }

  if (block.variant === "photo") {
    const photos = block.photos ?? (service.subImage ? [{ image: service.subImage, alt: service.subImageAlt ?? "" }] : []);
    return (
      <Shell id={guide.id} tone={tone} lazy={lazy}>
        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <SectionHeading id={guide.id} title={guide.heading} lead={guide.intro} />
            <div className="mt-7">
              <ItemRows items={guide.items} stacked />
            </div>
            {signs}
          </div>
          <div className={`grid gap-4 lg:col-span-5 ${photos.length > 1 ? "grid-cols-2" : ""}`} {...reveal(100, "right")}>
            {photos.map((p) => (
              <Fig key={p.image} photo={p} frame={photos.length === 1 ? "r" : undefined} sizes={photos.length > 1 ? "(min-width: 1024px) 19vw, 50vw" : "(min-width: 1024px) 38vw, 100vw"} />
            ))}
          </div>
        </div>
        {block.table && <SpecTable service={service} />}
      </Shell>
    );
  }

  return (
    <Shell id={guide.id} tone={tone} lazy={lazy}>
      <SectionHeading id={guide.id} title={guide.heading} lead={guide.intro} />
      <div className="mt-9">
        <ItemCards items={guide.items} />
      </div>
      {signs}
      {block.table && <SpecTable service={service} />}
    </Shell>
  );
}

function MenuBlock({ service, block, tone, lazy }: { service: Service; block: Extract<ServiceBlock, { type: "menu" }>; tone: Tone; lazy: boolean }) {
  if (block.variant === "photo" && service.subImage) {
    const real = service.subImage.startsWith("works/");
    return (
      <Shell id="menu" tone={tone} lazy={lazy}>
        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5" {...reveal(0, "left")}>
            <Fig photo={{ image: service.subImage, alt: service.subImageAlt ?? "", caption: real ? service.subImageAlt : undefined }} frame="l" sizes="(min-width: 1024px) 38vw, 100vw" aspect="aspect-[4/3] lg:aspect-[4/5]" />
          </div>
          <div className="lg:col-span-7">
            <SectionHeading id="menu" eyebrow="対応工事" title={block.heading} lead={service.summary} />
            <div className="mt-7">
              <ItemRows items={service.menu} stacked />
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (block.variant === "columns") {
    return (
      <Shell id="menu" tone={tone} lazy={lazy}>
        <SectionHeading id="menu" eyebrow="対応工事" title={block.heading} lead={service.summary} align="center" />
        <div className="mt-10">
          <ItemCards items={service.menu} />
        </div>
      </Shell>
    );
  }

  return (
    <Shell id="menu" tone={tone} lazy={lazy}>
      <SectionSplit heading={<SectionHeading id="menu" eyebrow="対応工事" title={block.heading} lead={service.summary} />}>
        <ItemRows items={service.menu} />
      </SectionSplit>
    </Shell>
  );
}

export function ServiceBlockView({
  block,
  service,
  tone,
  lazy,
  works,
  subsidies,
}: {
  block: ServiceBlock;
  service: Service;
  tone: Tone;
  /** 画面外にあるうちは描画を後回しにするか（ページの先頭の区画では false） */
  lazy: boolean;
  works: Work[];
  subsidies: Subsidy[];
}) {
  switch (block.type) {
    case "signs":
      // ご相談の例：人物のイラストと、チェックの印の一覧を、1枚の白いパネルに入れる
      return (
        <Shell id="signs" tone={tone} lazy={lazy}>
          <SectionHeading id="signs" title={block.heading} lead={block.lead} align="center" />
          <div className="card-pop mx-auto mt-9 max-w-4xl px-5 pb-5 pt-6 sm:px-10 sm:pt-8" {...reveal(80)}>
            <div className="grid items-end gap-x-8 gap-y-2 sm:grid-cols-[13rem_1fr]">
              <Illust image="illust/people-couple-think" width={208} className="mx-auto h-auto w-36 sm:-mb-5 sm:w-full" />
              <div className="pb-2">
                <CheckList items={service.worries} />
              </div>
            </div>
          </div>
        </Shell>
      );

    case "menu":
      return <MenuBlock service={service} block={block} tone={tone} lazy={lazy} />;

    case "guide": {
      const guide = service.guides.find((g) => g.id === block.id);
      return guide ? <GuideBlock service={service} guide={guide} block={block} tone={tone} lazy={lazy} /> : null;
    }

    case "scope":
      return service.scope ? (
        <Shell id="scope" tone={tone} lazy={lazy}>
          <SectionSplit heading={<SectionHeading id="scope" title={block.heading} />}>
            <div className="card-pop border-2 border-brand-300 px-6 py-6 sm:px-9 sm:py-8" {...reveal(60)}>
              <p className="font-heading text-[1.0625rem] font-bold leading-[1.95] text-navy-900 sm:text-lg sm:leading-[1.95]">{service.scope}</p>
            </div>
          </SectionSplit>
        </Shell>
      ) : null;

    case "photos":
      return (
        <Shell id="photos" tone={tone} lazy={lazy}>
          <SectionHeading id="photos" eyebrow="当社の現場から" color="navy" title={block.heading} lead={block.lead} align="center" />
          {block.compact ? (
            /* 元の写真が小さいとき：引き伸ばされてぼやけないよう、幅を抑えて2枚を横に並べる */
            <div className="mx-auto mt-10 grid max-w-[44rem] grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6">
              {block.photos.map((p, i) => (
                <div key={p.image} {...reveal(i * 90, "zoom")}>
                  <Fig photo={p} sizes="(min-width: 768px) 340px, 50vw" aspect="aspect-[4/3]" />
                </div>
              ))}
            </div>
          ) : (
            <div className={`mt-10 grid gap-x-5 gap-y-7 ${block.photos.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {block.photos.map((p, i) => (
                <div key={p.image} {...reveal(i * 90, "zoom")}>
                  <Fig photo={p} sizes="(min-width: 640px) 32vw, 100vw" aspect="aspect-[4/3] sm:aspect-square" />
                </div>
              ))}
            </div>
          )}
        </Shell>
      );

    case "note":
      // 直前の区画の続きとして読めるよう、上の余白を詰める（地色も直前の区画と同じ）
      return (
        <div className={`-mt-[clamp(1rem,2.6vw,2.5rem)] pb-[clamp(3rem,6vw,5rem)] ${tone === "white" ? "bg-white" : tone === "mist" ? "bg-mist" : tone === "cream" ? "bg-cream" : "bg-paper-2"}`}>
          <div className="container-x relative">
            <FieldNote label={service.note.label} pose={poseFor(service.note.label)} className="max-w-3xl">
              {service.note.text}
            </FieldNote>
          </div>
        </div>
      );

    case "cost":
      return (
        <Shell id="cost" tone={tone} lazy={lazy}>
          <SectionSplit
            heading={
              <>
                <SectionHeading id="cost" eyebrow="お見積もりの前に" color="sun" title="費用の考え方" lead={service.cost.intro} />
                <div className="mt-3 hidden lg:block" {...reveal(120, "pop")}>
                  <Illust image="illust/pose-calc" width={112} className="h-auto w-24 animate-float-slow" />
                </div>
              </>
            }
          >
            <ul className="grid gap-4 sm:grid-cols-2">
              {service.cost.factors.map((f, i) => (
                <li key={f.title} className="card card-line p-5 sm:p-6" {...reveal((i % 2) * 80)}>
                  <h3 className="text-base font-bold leading-[1.7]">
                    <Phrase>{f.title}</Phrase>
                  </h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-[1.9]">{f.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-white/70 px-5 py-4 text-[0.9375rem] leading-[1.95]">
              お見積もりは無料です。現地調査にうかがい、内訳の分かる見積書をお出しします。
              {isContactFormShown() ? (
                <>
                  ご依頼は
                  <Link href="/contact" className="text-link">
                    お問い合わせフォーム
                  </Link>
                  ・お電話{lineUrl() ? "・LINE" : ""}でお受けしています。
                </>
              ) : (
                <>
                  ご依頼は、お電話{lineUrl() ? "・LINE" : ""}でお受けしています（
                  <Link href="/contact" className="text-link">
                    お問い合わせ先
                  </Link>
                  ）。
                </>
              )}
            </p>
          </SectionSplit>
        </Shell>
      );

    case "subsidy": {
      if (subsidies.length === 0) return null;
      const lead = "公式ページで確認できた内容を、確認日つきで掲載しています。対象になるかどうかは、機種・住宅・申請の時期によって変わります。";
      // 1件だけのときは、見出しの横に置く（2列の片側だけが空かないように）
      if (subsidies.length === 1) {
        return (
          <Shell id="subsidy" tone={tone} lazy={lazy}>
            <SectionSplit heading={<SectionHeading id="subsidy" eyebrow="使える制度" title="補助金・支援制度" lead={lead} />}>
              <div {...reveal(60)}>
                <SubsidyNote subsidy={subsidies[0]} wide />
              </div>
              <SubsidyCaution />
            </SectionSplit>
          </Shell>
        );
      }
      return (
        <Shell id="subsidy" tone={tone} lazy={lazy}>
          <SectionHeading id="subsidy" eyebrow="使える制度" title="補助金・支援制度" lead={lead} align="center" />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {subsidies.map((sub, i) => (
              <div key={sub.id} {...reveal(i * 80)}>
                <SubsidyNote subsidy={sub} />
              </div>
            ))}
          </div>
          <SubsidyCaution />
        </Shell>
      );
    }

    case "works": {
      if (works.length === 0) return null;
      if (works.length === 1) {
        return (
          <Shell id="works" tone={tone} lazy={lazy}>
            <WorkFeature work={works[0]} heading={<SectionHeading id="works" eyebrow="当社の現場から" color="navy" title={`${service.shortName}の施工事例`} />} />
          </Shell>
        );
      }
      return (
        <Shell id="works" tone={tone} lazy={lazy}>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <SectionHeading id="works" eyebrow="当社の現場から" color="navy" title={`${service.shortName}の施工事例`} lead="当社が施工した現場の写真です。" />
            <Link href={workListPath(service.slug) ?? "/works"} className="link-arrow shrink-0" {...reveal(80)}>
              {workListPath(service.slug) ? `${service.shortName}の施工事例の一覧` : "施工事例の一覧"}
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <ul className={`scroller mt-9 gap-5 sm:grid sm:grid-cols-2 ${works.length >= 4 ? "lg:grid-cols-4" : works.length === 3 ? "lg:grid-cols-3" : ""}`}>
            {works.slice(0, 4).map((w, i) => (
              <li key={w.slug} {...reveal(i * 80)}>
                <WorkCard work={w} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 46vw, 80vw" />
              </li>
            ))}
          </ul>
        </Shell>
      );
    }

    case "local":
      return (
        <Shell id="local" tone={tone} lazy={lazy}>
          <SectionSplit heading={<SectionHeading id="local" eyebrow="戸塚区・横浜市" title={service.local.heading} />}>
            <div className="card space-y-5 px-6 py-6 text-[0.9688rem] leading-[2.05] sm:px-9 sm:py-8" {...reveal(60)}>
              {service.local.body.map((p) => (
                <p key={p.slice(0, 16)}>{p}</p>
              ))}
            </div>
            <p className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3" {...reveal(100)}>
              <Link href="/area/totsuka" className="btn btn-navy btn-sm">
                横浜市戸塚区の住宅設備・リフォーム
                <Icon name="arrowRight" className="btn-arrow size-4" />
              </Link>
              <Link href="/area" className="link-arrow">
                対応エリア
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </p>
          </SectionSplit>
        </Shell>
      );
  }
}
