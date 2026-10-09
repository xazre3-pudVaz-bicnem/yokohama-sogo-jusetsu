"use server";

import { inquirySchema, isContactFormEnabled, type Inquiry } from "@/lib/contact";
import { INQUIRY_FIELDS, inquiryLabels, type InquiryField, type InquiryState } from "@/lib/contact-fields";
import { siteConfig, primaryPhone, lineUrl } from "@/lib/site";

/**
 * お問い合わせフォームの送信処理（Server Action）。
 *
 * - 送信先・API キーは環境変数から読む（README の「お問い合わせフォーム」を参照）。
 *     RESEND_API_KEY     … Resend の API キー（必須）
 *     CONTACT_TO_EMAIL   … 受け取るメールアドレス。複数はカンマ区切り（必須）
 *     CONTACT_FROM_EMAIL … 差出人（任意）。未設定なら、本番ドメインの noreply@（下の defaultFrom）。
 *                           Resend で、そのドメインを認証しておくこと（yokohama-sogo-jusetsu.com は 2026-10-09 に認証済み）
 *     CONTACT_AUTOREPLY  … "1" にすると、メールアドレスを入力した方へ受付のお知らせを送る（差出人のドメイン認証が必要）
 * - 迷惑送信の対策：人には見えない入力欄（honeypot）と、表示から送信までの時間。
 * - 検査に落ちたときは、入力値をそのまま返す（React 19 のフォームは送信後に入力欄を空にするため）。
 */
export async function submitInquiry(prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const attempt = prev.attempt + 1;
  const raw = Object.fromEntries(INQUIRY_FIELDS.map((k) => [k, String(formData.get(k) ?? "")])) as Record<InquiryField, string>;

  // 迷惑送信：見えない欄に値がある／表示から1.5秒未満の送信は、成功したふりをして何もしない
  const trap = String(formData.get("website") ?? "");
  const shownAt = Number(formData.get("shownAt") ?? 0);
  if (trap || (shownAt > 0 && Date.now() - shownAt < 1500)) {
    return { status: "success", attempt };
  }

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<InquiryField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as InquiryField;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { status: "error", message: "入力内容をご確認ください。", errors, values: raw, attempt };
  }

  if (!isContactFormEnabled()) {
    const phone = primaryPhone();
    return {
      status: "unavailable",
      message: `ただいまフォームからの送信を準備しています。お手数ですが、${phone ? `お電話（${phone}）` : "お電話"}${lineUrl() ? "または LINE " : ""}でご連絡ください。`,
      values: raw,
      attempt,
    };
  }

  try {
    await sendNotification(parsed.data);
    if (process.env.CONTACT_AUTOREPLY === "1" && parsed.data.email) {
      // 受付のお知らせは、失敗してもお問い合わせ自体は受け付ける
      await sendAutoReply(parsed.data).catch((e) => console.error("[contact] 受付メールの送信に失敗しました", e));
    }
    return { status: "success", attempt };
  } catch (e) {
    console.error("[contact] 送信に失敗しました", e);
    const phone = primaryPhone();
    return {
      status: "error",
      message: `送信できませんでした。時間をおいてもう一度お試しいただくか、${phone ? `お電話（${phone}）` : "お電話"}${lineUrl() ? "または LINE " : ""}でご連絡ください。`,
      values: raw,
      attempt,
    };
  }
}

/**
 * 差出人の既定。本番ドメイン（lib/site.ts の productionUrl）の noreply@ を使う（www は外す）。
 * 本番ドメインが未定のときは、Resend の試験用アドレス（Resend に登録した本人のアドレスにしか届かない）。
 */
function defaultFrom(): string {
  const url: string = siteConfig.productionUrl;
  const host = url ? new URL(url).hostname.replace(/^www\./, "") : "";
  return host ? `${siteConfig.shortName} お問い合わせフォーム <noreply@${host}>` : "お問い合わせフォーム <onboarding@resend.dev>";
}

async function sendMail(payload: { to: string[]; subject: string; text: string; replyTo?: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || defaultFrom(),
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

function inquiryText(d: Inquiry): string {
  const rows = INQUIRY_FIELDS.map((k) => `■ ${inquiryLabels[k]}\n${d[k] || "（未入力）"}`).join("\n\n");
  return rows;
}

async function sendNotification(d: Inquiry) {
  const to = (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  await sendMail({
    to,
    subject: `【お問い合わせ】${d.topic}｜${d.name} 様`,
    text: `${siteConfig.name}の公式サイトから、お問い合わせがありました。\n\n${inquiryText(d)}\n\n────────\n受付日時：${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
    replyTo: d.email || undefined,
  });
}

async function sendAutoReply(d: Inquiry) {
  const phone = primaryPhone();
  await sendMail({
    to: [d.email],
    subject: `【${siteConfig.name}】お問い合わせを受け付けました`,
    text: `${d.name} 様\n\nこのたびは、${siteConfig.name}にお問い合わせいただき、ありがとうございます。\n次の内容で受け付けました。担当者より、お電話またはメールでご連絡します。\n\n${inquiryText(d)}\n\n────────\n${siteConfig.name}${phone ? `\n電話：${phone}` : ""}\n※このメールは送信専用です。`,
  });
}
