import Link from "next/link";
import { ServicePhotoCard, ServiceRow } from "@/components/cards/ServiceCard";
import { WorkCard } from "@/components/cards/WorkCard";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { PhotoFill } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaffTip } from "@/components/ui/StaffTip";
import { getService } from "@/data/services";
import { getSubsidy } from "@/data/subsidies";
import { worksSorted } from "@/data/works";
import { reveal } from "@/lib/reveal";
import { formatDateJa } from "@/lib/seo";

/** 05 施工事例（実際の現場の写真だけ） */
export function WorksSection() {
  const list = worksSorted.slice(0, 4);
  return (
    <section aria-labelledby="home-works" className="cv section bg-silver-50">
      <div className="container-x">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <SectionHeading
            id="home-works"
            eyebrow="施工事例"
            title={
            <>
              <span className="ib">仕上がりは、</span>
              <span className="ib">写真で確かめてください。</span>
            </>
          }
            lead="エアコンの取替、浴室暖房乾燥機、ウッドデッキ、外壁・屋根の塗装。当社が実際に施工した現場を、施工前後の写真とポイントつきで紹介しています。"
          />
          <Link href="/works" className="link-arrow shrink-0" {...reveal(100)}>
            施工事例をすべて見る（{worksSorted.length}件）
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
        <ul className="scroller mt-10 gap-x-5 gap-y-10 sm:grid sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {list.map((w, i) => (
            <li key={w.slug} {...reveal(i * 90)}>
              <WorkCard work={w} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 06 給湯器・住宅設備 */
const EQUIPMENT = ["water-heater", "ene-farm", "air-conditioner", "toilet", "kitchen-equipment", "other"] as const;

export function EquipmentSection() {
  return (
    <section aria-labelledby="home-equipment" className="cv section bg-white">
      <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:aspect-[5/6]" {...reveal(0, "wipe")}>
            <PhotoFill image="photos/gas-water-heater-side" alt="住宅の外壁に取り付けたガス給湯器と、きれいに納めた配管" sizes="(min-width: 1024px) 46vw, 100vw" />
          </div>
          <div className="absolute -bottom-6 right-3 w-[46%] overflow-hidden rounded-lg border-4 border-white shadow-[var(--shadow-lift)] sm:right-6 lg:-right-8 lg:bottom-10" {...reveal(200, "zoom")}>
            <div className="relative aspect-[4/3]">
              <PhotoFill image="works/aircon-cover-after-indoor" alt="取替後のエアコンの室内機（横浜総合住設の施工）" sizes="(min-width: 1024px) 22vw, 46vw" />
            </div>
          </div>
        </div>

        <div className="pt-4 lg:pt-0">
          <SectionHeading
            id="home-equipment"
            eyebrow="給湯器・住宅設備"
            title={
              <>
                お湯・空調・水まわり。
                <br />
                <span className="ib">止まる前の相談が、</span>
                <span className="ib">いちばん早い。</span>
              </>
            }
            lead="給湯器もエアコンも、壊れてから探すと選ぶ時間がありません。お湯の温度が安定しない、効きが悪い、音が変わった。そんな小さな変化の段階なら、機種も日程も落ち着いて決められます。"
          />
          <ul className="rows mt-7" {...reveal(80)}>
            {EQUIPMENT.map((slug) => (
              <li key={slug}>
                <ServiceRow service={getService(slug)!} />
              </li>
            ))}
          </ul>
          <StaffTip pose="illust/pose-idea" className="mt-8">
            型番のシールと設置場所の写真を送っていただければ、お電話の時点で、必要な工事の見当をお伝えできます。
          </StaffTip>
        </div>
      </div>
    </section>
  );
}

/** 07 省エネ設備（濃紺の区画）。補助金は data/subsidies.ts の確認済みの内容だけを、確認日つきで出す */
const ENERGY = ["eco-one", "solar", "storage-battery"] as const;

export function EnergySection() {
  const kyutou = getSubsidy("kyutou-shoene");
  return (
    <section aria-labelledby="home-energy" className="cv bg-blueprint relative overflow-hidden text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[12%] top-0 h-full w-[44%] -skew-x-[24deg] bg-gradient-to-b from-brand-600/25 to-transparent" />
      <div className="container-x section relative grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="home-energy"
            onDark
            eyebrow="省エネ・創エネ設備"
            title={
              <>
                <span className="ib">つくる、ためる、</span>
                <span className="ib">効率よく沸かす。</span>
                <br />
                <span className="ib">光熱費と、</span>
                <span className="ib">もしもへの備え。</span>
              </>
            }
            lead="ハイブリッド給湯器、太陽光発電、蓄電池。どれも「家に合うか」で結果が変わる設備です。屋根の向き、設置スペース、いまの電気とガスの使い方を確かめたうえで、合うものだけをご提案します。"
          />
          <ul className="mt-8 divide-y divide-white/15 border-y border-white/15">
            {ENERGY.map((slug, i) => {
              const s = getService(slug)!;
              return (
                <li key={slug} {...reveal(i * 80)}>
                  <Link href={`/service/${s.slug}`} className="group flex items-center gap-4 py-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-md bg-white/10 text-sky-300">
                      <Icon name={s.icon} className="size-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-base font-extrabold leading-snug text-white transition-colors group-hover:text-sky-300">{s.name}</span>
                      <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-silver-300">{s.catch}</span>
                    </span>
                    <Icon name="arrowRight" className="size-4 shrink-0 text-sky-300 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-5">
          <div className="cut-tr relative aspect-[16/10] overflow-hidden rounded-lg" {...reveal(0, "wipe")}>
            <PhotoFill image="photos/house-solar-bayview" alt="屋根に太陽光パネルを載せた住宅と、遠くに見える横浜の街並み" sizes="(min-width: 1024px) 46vw, 100vw" />
          </div>
          {kyutou && (
            <div className="rounded-lg border border-white/20 bg-white/[0.06] p-5 sm:p-6" {...reveal(120)}>
              <p className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-widest text-sky-300">
                <span className="rounded-sm bg-sky-400 px-2 py-0.5 text-navy-950">{kyutou.status === "open" ? "受付中" : "受付終了"}</span>
                使える制度の例（{kyutou.level}）
              </p>
              <p className="mt-2 text-lg font-extrabold">{kyutou.name}</p>
              <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                {kyutou.amounts.slice(0, 3).map((a) => (
                  <div key={a.label}>
                    <dt className="text-xs text-silver-300">{a.label}</dt>
                    <dd className="num mt-0.5 text-xl font-semibold">{a.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-silver-300">
                性能の要件を満たす機種には加算があります。登録された事業者が申請する制度で、予算の上限に達すると期限の前でも終了します。
                <span className="ib">（{formatDateJa(kyutou.checkedAt)}に公式サイトで確認）</span>
              </p>
              <Link href="/service/eco-one#subsidy" className="link-arrow link-arrow-on-dark mt-2 text-sm">
                補助金の条件を見る
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** 08 リフォーム・外壁・解体・造園 */
const RENOVATION = ["reform", "exterior-painting", "demolition", "garden"] as const;

export function RenovationSection() {
  return (
    <section aria-labelledby="home-renovation" className="cv section bg-white">
      <div className="container-x">
        <SectionHeading
          id="home-renovation"
          eyebrow="リフォーム・外壁・解体・造園"
          title={
            <>
              <span className="ib">家の内も、外も。</span>
              <span className="ib">大きな工事ほど、</span>
              <span className="ib">段取りで決まる。</span>
            </>
          }
          lead="リフォームは解体から、塗装は足場から、庭は下地から。完成後には見えなくなる最初の工程が、仕上がりと持ちを左右します。解体・設備・仕上げの窓口がひとつなので、工程ごとに話を伝え直す手間がかかりません。"
        />
        <ul className="scroller mt-10 gap-5 sm:grid sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {RENOVATION.map((slug, i) => (
            <li key={slug} {...reveal(i * 90)}>
              <ServicePhotoCard service={getService(slug)!} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center" {...reveal()}>
          <LinkButton href="/works" variant="outline">
            施工事例で仕上がりを見る
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
