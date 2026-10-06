import { z } from "zod";
import { inquiryTopics } from "@/data/services";

/**
 * お問い合わせフォームの入力値の検査（サーバー側）。
 * 入力項目は最小限にする（必須は お名前・電話番号・相談したい工事・相談内容 の4つ。メールと住所は任意）。
 * 項目名と表示名は lib/contact-fields.ts にある。
 */

/** 全角の数字・記号を半角にそろえる */
export function toHalfWidth(s: string): string {
  return s.replace(/[０-９Ａ-Ｚａ-ｚ＋]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/[ー－−‐―]/g, "-");
}

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください。").max(60, "お名前は60文字以内で入力してください。"),
  tel: z
    .string()
    .trim()
    .min(1, "電話番号を入力してください。")
    .transform(toHalfWidth)
    .refine((v) => /^[0-9+\-\s()]{10,18}$/.test(v) && v.replace(/[^0-9]/g, "").length >= 10, "電話番号を、市外局番から入力してください（例：045-000-0000）。"),
  email: z
    .string()
    .trim()
    .max(200, "メールアドレスが長すぎます。")
    .transform(toHalfWidth)
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "メールアドレスの形を確認してください。"),
  address: z.string().trim().max(200, "ご住所は200文字以内で入力してください。"),
  topic: z.string().refine((v) => inquiryTopics.includes(v), "相談したい工事を選んでください。"),
  message: z.string().trim().min(5, "ご相談の内容を、5文字以上で入力してください。").max(3000, "ご相談の内容は3,000文字以内で入力してください。"),
});

export type Inquiry = z.infer<typeof inquirySchema>;

/**
 * フォームから送信できる状態か（メール送信の設定が済んでいるか）。
 *   RESEND_API_KEY   … Resend の API キー
 *   CONTACT_TO_EMAIL … お問い合わせを受け取るメールアドレス（複数はカンマ区切り）
 */
export function isContactFormEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
}
