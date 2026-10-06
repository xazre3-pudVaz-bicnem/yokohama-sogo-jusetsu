/**
 * お問い合わせフォームの項目名・表示名・状態の型。
 * ブラウザ側（components/contact/ContactForm.tsx）からも読み込むので、ここには検査用のライブラリやデータを import しない。
 * 入力値の検査は lib/contact.ts（サーバー側）にある。
 */
export const INQUIRY_FIELDS = ["name", "tel", "email", "address", "topic", "message"] as const;
export type InquiryField = (typeof INQUIRY_FIELDS)[number];

export const inquiryLabels: Record<InquiryField, string> = {
  name: "お名前",
  tel: "電話番号",
  email: "メールアドレス",
  address: "ご住所",
  topic: "相談したい工事",
  message: "ご相談の内容",
};

export type InquiryState = {
  status: "idle" | "error" | "success" | "unavailable";
  /** 画面の上部に出すメッセージ */
  message?: string;
  errors?: Partial<Record<InquiryField, string>>;
  /** 入力し直しを防ぐため、検査に落ちたときは入力値を返す */
  values?: Partial<Record<InquiryField, string>>;
  /** 送信の回数（フォームを作り直して入力値を戻すための key に使う） */
  attempt: number;
};

export const initialInquiryState: InquiryState = { status: "idle", attempt: 0 };
