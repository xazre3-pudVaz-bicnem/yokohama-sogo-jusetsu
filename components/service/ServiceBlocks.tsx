import type { ReactNode } from "react";
import Link from "next/link";
import { WorkCard, WorkFeature } from "@/components/cards/WorkCard";
import { SubsidyCaution, SubsidyNote } from "@/components/sections/SubsidyNote";
import { FieldNote } from "@/components/ui/FieldNote";
import { Icon } from "@/components/ui/Icon";
import { PhotoFill } from "@/components/ui/Photo";
import { Phrase } from "@/components/ui/Phrase";
import { SectionHeading, SectionSplit } from "@/components/ui/SectionHeading";
import type { Service } from "@/data/services";
import type { BlockPhoto, ServiceBlock, ServiceGuide } from "@/data/services/types";
import type { Subsidy } from "@/data/subsidies";
import type { Work } from "@/data/works";
import { img } from "@/lib/images";
import { reveal } from "@/lib/reveal";

/**
 * サービスページの本文の区画。
 *
 * どのサービスも同じ順番・同じ見せ方にならないよう、区画の種類と見せ方（variant）を用意し、
 * 並べ方は data/services/*.ts の layout で、サービスごとに決めている。
 * 枠つきのカードは使わず、見出し・細い線・写真で区切る。番号を付けるのは、順番のある工程（steps）だけ。
 */
type Tone = "white" | "tint";

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

function Shell({ id, tone, tight = false, lazy = true, children }: { id?: string; tone: Tone; tight?: boolean; lazy?: boolean; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className={`${lazy ? "cv" : ""} ${tight ? "section-tight" : "section"} ${tone === "tint" ? "bg-silver-50" : "bg-white"}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 部品                                                                */
/* ------------------------------------------------------------------ */
function Fig({ photo, sizes, aspect, still = false }: { photo: BlockPhoto; sizes: string; aspect?: string; still?: boolean }) {
  const info = img(photo.image);
  const ratio = aspect ?? (info.height > info.width ? "aspect-[3/4]" : "aspect-[4/3]");
  return (
    <figure {...(still ? {} : reveal(0, "wipe"))}>
      <div className={`relative ${ratio} bg-silver-100`}>
        <PhotoFill image={photo.image} alt={photo.alt} sizes={sizes} />
      </div>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-mute">{photo.caption ?? "写真はイメージです"}</figcaption>
    </figure>
  );
}

type Item = { title: string; body: string };

/** 見出しと説明を左右に置いた行 */
function ItemRows({ items, stacked = false }: { items: Item[]; stacked?: boolean }) {
  return (
    <ul className="rows" {...reveal(60)}>
      {items.map((it) => (
        <li key={it.title} className={`py-5 ${stacked ? "" : "grid gap-x-9 gap-y-1.5 md:grid-cols-[13.5rem_1fr]"}`}>
          <h3 className="text-base font-bold leading-[1.75] text-ink">
            <Phrase>{it.title}</Phrase>
          </h3>
          <p className={`text-[0.9375rem] leading-[1.95] ${stacked ? "mt-1.5" : ""}`}>{it.body}</p>
        </li>
      ))}
    </ul>
  );
}

/** 横に並べた列（列ごとに上の線を引く） */
function ItemColumns({ items }: { items: Item[] }) {
  const n = items.length;
  const cols = n === 2 ? "lg:grid-cols-2" : n === 4 ? "lg:grid-cols-4" : n === 5 ? "lg:grid-cols-5" : "lg:grid-cols-3";
  return (
    <ul className={`grid gap-x-9 gap-y-8 sm:grid-cols-2 ${cols}`}>
      {items.map((it, i) => (
        <li key={it.title} className="rule-top pt-4" {...reveal((i % 4) * 60)}>
          <h3 className="text-base font-bold leading-[1.7] text-ink">
            <Phrase>{it.title}</Phrase>
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-[1.95]">{it.body}</p>
        </li>
      ))}
    </ul>
  );
}

/** 工程ごとに写真を1枚ずつ付けた手順（写真の枚数が、工程の数と同じときに使う） */
function PhotoSteps({ items, photos }: { items: Item[]; photos: BlockPhoto[] }) {
  const cols = items.length === 2 ? "sm:grid-cols-2" : items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";
  return (
    <ol className={`grid gap-x-7 gap-y-10 ${cols}`}>
      {items.map((it, i) => (
        <li key={it.title} {...reveal((i % 4) * 70)}>
          <Fig photo={photos[i]} sizes="(min-width: 640px) 32vw, 100vw" aspect="aspect-[4/3]" still />
          <div className="mt-4 flex gap-4">
            <span className="num w-5 shrink-0 text-[1.375rem] font-medium leading-[1.4] text-silver-500">{i + 1}</span>
            <div>
              <h3 className="text-base font-bold leading-[1.75] text-ink">
                <Phrase>{it.title}</Phrase>
              </h3>
              <p className="mt-1.5 text-[0.9375rem] leading-[1.95]">{it.body}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** 番号つきの手順（順番のある工程だけに使う） */
function ItemSteps({ items }: { items: Item[] }) {
  return (
    <ol className="rows" {...reveal(60)}>
      {items.map((it, i) => (
        <li key={it.title} className="flex gap-5 py-5 sm:gap-7">
          <span className="num w-6 shrink-0 text-[1.375rem] font-medium leading-[1.4] text-silver-500">{i + 1}</span>
          <div>
            <h3 className="text-base font-bold leading-[1.75] text-ink">
              <Phrase>{it.title}</Phrase>
            </h3>
            <p className="mt-1.5 text-[0.9375rem] leading-[1.95]">{it.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function SignList({ items, rows = false }: { items: string[]; rows?: boolean }) {
  if (rows) {
    return (
      <ul className="rows text-[0.9688rem] font-bold leading-[1.8] text-ink" {...reveal(60)}>
        {items.map((w) => (
          <li key={w} className="py-3.5">
            <Phrase>{w}</Phrase>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="dash-list grid gap-x-10 gap-y-2.5 text-[0.9688rem] font-bold leading-[1.8] text-ink sm:grid-cols-2">
      {items.map((w) => (
        <li key={w}>
          <Phrase>{w}</Phrase>
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
      <p className="mb-2.5 text-sm font-bold text-ink">{t.caption}</p>
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

/* ------------------------------------------------------------------ */
/* 区画                                                                */
/* ------------------------------------------------------------------ */
function GuideBlock({ service, guide, block, tone, lazy }: { service: Service; guide: ServiceGuide; block: Extract<ServiceBlock, { type: "guide" }>; tone: Tone; lazy: boolean }) {
  const signs = block.signs ? (
    <div className="mt-8">
      <p className="mb-3 text-[0.8125rem] font-bold tracking-wider text-ink-mute">ご相談の例</p>
      <SignList items={service.worries} />
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
          <SectionHeading id={guide.id} title={guide.heading} lead={guide.intro} />
          <div className="mt-9">
            <PhotoSteps items={guide.items} photos={photos} />
          </div>
          {block.table && <SpecTable service={service} />}
        </Shell>
      );
    }
    return (
      <Shell id={guide.id} tone={tone} lazy={lazy}>
        <SectionHeading id={guide.id} title={guide.heading} lead={guide.intro} />
        <div className="mt-8 grid gap-x-12 gap-y-9 lg:grid-cols-12">
          <div className={photos.length ? "lg:col-span-7" : "lg:col-span-9"}>
            <ItemSteps items={guide.items} />
          </div>
          {photos.length > 0 && (
            <div className={`grid content-start gap-x-3 gap-y-5 lg:col-span-5 ${photos.length > 1 ? "grid-cols-2" : ""}`}>
              {photos.map((p) => (
                <Fig
                  key={p.image}
                  photo={p}
                  sizes={photos.length > 1 ? "(min-width: 1024px) 19vw, 50vw" : "(min-width: 1024px) 38vw, 100vw"}
                  aspect="aspect-[4/3]"
                />
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
        <div className="grid gap-x-12 gap-y-9 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <SectionHeading id={guide.id} title={guide.heading} lead={guide.intro} />
            <div className="mt-7">
              <ItemRows items={guide.items} stacked />
            </div>
            {signs}
          </div>
          <div className={`grid gap-3 lg:col-span-5 ${photos.length > 1 ? "grid-cols-2" : ""}`}>
            {photos.map((p) => (
              <Fig key={p.image} photo={p} sizes={photos.length > 1 ? "(min-width: 1024px) 19vw, 50vw" : "(min-width: 1024px) 38vw, 100vw"} />
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
      <div className="mt-8">
        <ItemColumns items={guide.items} />
      </div>
      {signs}
      {block.table && <SpecTable service={service} />}
    </Shell>
  );
}

function MenuBlock({ service, block, tone, lazy }: { service: Service; block: Extract<ServiceBlock, { type: "menu" }>; tone: Tone; lazy: boolean }) {
  const heading = <SectionHeading id="menu" title={block.heading} lead={service.summary} />;

  if (block.variant === "photo" && service.subImage) {
    const real = service.subImage.startsWith("works/");
    return (
      <Shell id="menu" tone={tone} lazy={lazy}>
        <div className="grid gap-x-12 gap-y-9 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <Fig photo={{ image: service.subImage, alt: service.subImageAlt ?? "", caption: real ? service.subImageAlt : undefined }} sizes="(min-width: 1024px) 38vw, 100vw" aspect="aspect-[4/3] lg:aspect-[4/5]" />
          </div>
          <div className="lg:col-span-7">
            {heading}
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
        {heading}
        <div className="mt-8">
          <ItemColumns items={service.menu} />
        </div>
      </Shell>
    );
  }

  return (
    <Shell id="menu" tone={tone} lazy={lazy}>
      <SectionSplit heading={heading}>
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
      return (
        <Shell id="signs" tone={tone} lazy={lazy}>
          <SectionSplit heading={<SectionHeading id="signs" title={block.heading} lead={block.lead} />}>
            <SignList items={service.worries} rows />
          </SectionSplit>
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
            <p className="text-[1.0625rem] font-bold leading-[1.95] text-ink sm:text-lg sm:leading-[1.95]">{service.scope}</p>
          </SectionSplit>
        </Shell>
      ) : null;

    case "photos":
      return (
        <Shell id="photos" tone={tone} lazy={lazy}>
          <SectionHeading id="photos" title={block.heading} lead={block.lead} />
          <div className={`mt-8 grid gap-x-4 gap-y-7 ${block.photos.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {block.photos.map((p) => (
              <Fig key={p.image} photo={p} sizes="(min-width: 640px) 32vw, 100vw" aspect="aspect-[4/3] sm:aspect-square" />
            ))}
          </div>
        </Shell>
      );

    case "note":
      // 直前の区画の続きとして読めるよう、上の余白を詰める（地色も直前の区画と同じ）
      return (
        <div className={`-mt-[clamp(0.5rem,1.6vw,1.5rem)] pb-[clamp(2.75rem,5vw,4.75rem)] ${tone === "tint" ? "bg-silver-50" : "bg-white"}`}>
          <div className="container-x">
            <FieldNote label={service.note.label} className="max-w-3xl">
              {service.note.text}
            </FieldNote>
          </div>
        </div>
      );

    case "cost":
      return (
        <Shell id="cost" tone={tone} lazy={lazy}>
          <SectionSplit heading={<SectionHeading id="cost" title="費用の考え方" lead={service.cost.intro} />}>
            <ul className="grid gap-x-9 sm:grid-cols-2" {...reveal(60)}>
              {service.cost.factors.map((f) => (
                <li key={f.title} className="border-b border-silver-200 py-5 first:pt-0 sm:[&:nth-child(2)]:pt-0">
                  <h3 className="text-base font-bold leading-[1.75] text-ink">
                    <Phrase>{f.title}</Phrase>
                  </h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-[1.95]">{f.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.9375rem] leading-[1.95]">
              お見積もりは無料です。現地調査にうかがい、内訳の分かる見積書をお出しします。ご依頼は
              <Link href="/contact" className="text-link">
                お問い合わせフォーム
              </Link>
              か、お電話でお受けしています。
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
            <SectionSplit heading={<SectionHeading id="subsidy" title="補助金・支援制度" lead={lead} />}>
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
          <SectionHeading id="subsidy" title="補助金・支援制度" lead={lead} />
          <div className="mt-9 grid gap-x-12 gap-y-12 lg:grid-cols-2">
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
            <WorkFeature work={works[0]} heading={<SectionHeading id="works" title={`${service.shortName}の施工事例`} />} />
          </Shell>
        );
      }
      return (
        <Shell id="works" tone={tone} lazy={lazy}>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <SectionHeading id="works" title={`${service.shortName}の施工事例`} lead="当社が施工した現場の写真です。" />
            <Link href="/works" className="link-arrow shrink-0" {...reveal(80)}>
              施工事例の一覧
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <ul className={`scroller mt-9 gap-x-7 gap-y-10 sm:grid sm:grid-cols-2 ${works.length >= 4 ? "lg:grid-cols-4" : works.length === 3 ? "lg:grid-cols-3" : ""}`}>
            {works.slice(0, 4).map((w, i) => (
              <li key={w.slug} {...reveal(i * 80)}>
                <WorkCard work={w} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 46vw, 78vw" />
              </li>
            ))}
          </ul>
        </Shell>
      );
    }

    case "local":
      return (
        <Shell id="local" tone={tone} lazy={lazy}>
          <SectionSplit heading={<SectionHeading id="local" title={service.local.heading} />}>
            <div className="space-y-5 text-[0.9688rem] leading-[2.05]" {...reveal(60)}>
              {service.local.body.map((p) => (
                <p key={p.slice(0, 16)}>{p}</p>
              ))}
            </div>
            <p className="mt-7 flex flex-wrap gap-x-9 gap-y-3" {...reveal(100)}>
              <Link href="/area/totsuka" className="link-arrow">
                横浜市戸塚区の住宅設備・リフォーム
                <Icon name="arrowRight" className="size-4" />
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
