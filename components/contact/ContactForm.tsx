"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { submitInquiry } from "@/app/contact/actions";
import { initialInquiryState, inquiryLabels, type InquiryField } from "@/lib/contact-fields";

/**
 * お問い合わせフォーム（画面側）。
 * - 送信は Server Action（app/contact/actions.ts）。JS が動かない環境でも送信できる。
 * - React 19 は、フォームの action が終わると入力欄を空に戻す。検査に落ちたときに入力が消えないよう、
 *   サーバーから返ってきた値を defaultValue に入れ、送信のたびに key を変えてフォームを作り直す。
 * - URL に ?topic=business が付いていたら、「相談したい工事」を法人向けの選択肢にしておく。
 */
export function ContactForm({ topics, note, preview = false }: { topics: string[]; note: string; preview?: boolean }) {
  const [state, action, pending] = useActionState(submitInquiry, initialInquiryState);
  const formRef = useRef<HTMLFormElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const v = state.values ?? {};
  const err = state.errors ?? {};

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    // 表示した時刻（迷惑送信の判定に使う）
    const shownAt = form.elements.namedItem("shownAt") as HTMLInputElement | null;
    if (shownAt) shownAt.value = String(Date.now());
    // 法人向けページから来たときの初期選択
    const select = form.elements.namedItem("topic") as HTMLSelectElement | null;
    if (select && !select.value && new URLSearchParams(window.location.search).get("topic") === "business") {
      const opt = Array.from(select.options).find((o) => o.value.includes("法人"));
      if (opt) select.value = opt.value;
    }
  }, [state.attempt]);

  useEffect(() => {
    // 結果が返ってきたら、メッセージの位置まで戻す
    if (state.status !== "idle") topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state.status, state.attempt]);

  if (state.status === "success") {
    return (
      <div ref={topRef} className="rounded-lg border-2 border-brand-600 bg-brand-50 p-7 text-center sm:p-10" role="status">
        <p className="text-xl font-extrabold text-ink">お問い合わせを受け付けました。</p>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-[1.95]">内容を確認のうえ、担当者よりお電話またはメールでご連絡します。お急ぎの場合は、お電話でもお問い合わせください。</p>
        <Link href="/" className="link-arrow mt-5">
          トップページへ戻る
        </Link>
      </div>
    );
  }

  const field = (name: InquiryField) => ({
    id: `f-${name}`,
    name,
    defaultValue: v[name] ?? "",
    "aria-invalid": err[name] ? (true as const) : undefined,
    "aria-describedby": err[name] ? `e-${name}` : undefined,
    className: "field mt-2",
  });

  const label = (name: InquiryField, required = false, hint?: string) => (
    <label htmlFor={`f-${name}`} className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.9375rem] font-bold text-ink">
      {inquiryLabels[name]}
      <span className={`rounded-sm px-1.5 py-0.5 text-[0.6875rem] font-bold leading-none ${required ? "bg-heat text-white" : "bg-silver-200 text-ink-mute"}`}>{required ? "必須" : "任意"}</span>
      {hint && <span className="text-xs font-normal text-ink-mute">{hint}</span>}
    </label>
  );

  const errorOf = (name: InquiryField) =>
    err[name] ? (
      <p id={`e-${name}`} className="mt-1.5 text-sm font-bold text-heat">
        {err[name]}
      </p>
    ) : null;

  return (
    <div ref={topRef}>
      {preview && (
        <p className="mb-5 rounded-md border border-dashed border-silver-400 bg-silver-50 px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-mute">
          【確認用の表示】メール送信の設定（RESEND_API_KEY・CONTACT_TO_EMAIL）がまだのため、このフォームから送信しても届きません。本番では、設定が済むまでフォームの代わりに電話の案内が表示されます。
        </p>
      )}
      {state.message && (
        <p role="alert" className="mb-5 rounded-md border border-heat/40 bg-heat/5 px-4 py-3 text-[0.9375rem] font-bold leading-relaxed text-heat">
          {state.message}
        </p>
      )}

      <form key={state.attempt} ref={formRef} action={action} noValidate className="space-y-6">
        {/* 迷惑送信の対策（人には見えない欄）。値が入っていたら送信しない */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label>
            このまま空欄にしてください
            <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>
        <input type="hidden" name="shownAt" defaultValue="0" />

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            {label("name", true)}
            <input type="text" autoComplete="name" required placeholder="例：横浜 太郎" {...field("name")} />
            {errorOf("name")}
          </div>
          <div>
            {label("tel", true)}
            <input type="tel" inputMode="tel" autoComplete="tel" required placeholder="例：045-000-0000" {...field("tel")} />
            {errorOf("tel")}
          </div>
        </div>

        <div>
          {label("email", false, "メールでの返信をご希望の方")}
          <input type="email" inputMode="email" autoComplete="email" placeholder="例：name@example.com" {...field("email")} />
          {errorOf("email")}
        </div>

        <div>
          {label("address", false, "市区町村まででもかまいません")}
          <input type="text" autoComplete="street-address" placeholder="例：横浜市戸塚区○○町" {...field("address")} />
          {errorOf("address")}
        </div>

        <div>
          {label("topic", true)}
          <select required {...field("topic")}>
            <option value="">選んでください</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errorOf("topic")}
        </div>

        <div>
          {label("message", true)}
          <textarea rows={7} required placeholder="例：15年使っている給湯器から、お湯がぬるいことがあります。交換の見積もりをお願いします。" {...field("message")} className="field mt-2 resize-y" />
          {errorOf("message")}
        </div>

        <p className="text-[0.8125rem] leading-[1.9] text-ink-mute">
          ご入力いただいた内容は、お問い合わせへの回答とご連絡のためにのみ使用します。くわしくは
          <Link href="/privacy" className="text-link mx-0.5">
            プライバシーポリシー
          </Link>
          をご覧ください。{note}
        </p>

        <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-[18rem]">
          {pending ? "送信しています…" : "この内容で送信する"}
        </button>
      </form>
    </div>
  );
}
