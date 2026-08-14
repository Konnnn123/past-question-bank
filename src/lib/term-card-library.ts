export type TermCardStatus = "learning" | "remembered";

export interface TermCard {
  id: string;
  subjectId: string;
  category: string;
  termJa: string;
  readingJa: string;
  termEn: string;
  definitionJa: string;
  corePointJa: string;
  visualCluesJa: string[];
  confusionJa: string;
  exampleJa: string;
  examSentenceJa: string;
  memoZh: string;
  sourceNote: string;
  status: TermCardStatus;
  createdAt: string;
  updatedAt: string;
}

export type TermCardDraft = Pick<
  TermCard,
  | "category"
  | "termJa"
  | "readingJa"
  | "termEn"
  | "definitionJa"
  | "corePointJa"
  | "visualCluesJa"
  | "confusionJa"
  | "exampleJa"
  | "examSentenceJa"
  | "memoZh"
  | "sourceNote"
>;

export interface TermSubject {
  id: string;
  labelJa: string;
  short: string;
  color: string;
  softColor: string;
  categories: string[];
}

export interface TermApiSettings {
  endpoint: string;
  model: string;
  apiKey: string;
  rememberKey: boolean;
}

export const TERM_CARD_STORAGE_KEY = "past-question-term-cards-v1";
export const TERM_API_SETTINGS_KEY = "past-question-term-api-v1";
export const TERM_API_SESSION_KEY = "past-question-term-api-key-v1";
const TERM_CARD_REQUEST_TIMEOUT_MS = 180_000;

export const TERM_SUBJECTS: TermSubject[] = [
  {
    id: "history",
    labelJa: "建築史",
    short: "史",
    color: "#9a5336",
    softColor: "#f7eee9",
    categories: ["日本建築史", "西洋建築史", "近代建築史", "建築様式", "建築家・作品"],
  },
  {
    id: "planning",
    labelJa: "建築計画",
    short: "計",
    color: "#3d6d67",
    softColor: "#e9f3f1",
    categories: ["住宅", "学校・教育施設", "医療・福祉施設", "文化施設", "動線・寸法"],
  },
  {
    id: "environment",
    labelJa: "環境工学",
    short: "環",
    color: "#38729b",
    softColor: "#e9f2f8",
    categories: ["熱・湿気", "光・色彩", "音響", "空気・換気", "省エネルギー"],
  },
  {
    id: "structure",
    labelJa: "建築構造",
    short: "構",
    color: "#735c91",
    softColor: "#f0ecf5",
    categories: ["構造力学", "鉄筋コンクリート", "鉄骨構造", "木質構造", "耐震・基礎"],
  },
];

export const DEFAULT_API_SETTINGS: TermApiSettings = {
  endpoint: "https://api.deepseek.com/chat/completions",
  model: "deepseek-v4-flash",
  apiKey: "",
  rememberKey: false,
};

export const EMPTY_TERM_DRAFT: TermCardDraft = {
  category: "",
  termJa: "",
  readingJa: "",
  termEn: "",
  definitionJa: "",
  corePointJa: "",
  visualCluesJa: [],
  confusionJa: "",
  exampleJa: "",
  examSentenceJa: "",
  memoZh: "",
  sourceNote: "",
};

export const TERM_CARD_SYSTEM_PROMPT = `あなたは日本の建築系試験を学ぶ学生のための、正確で簡潔な用語カード編集者です。

目的：単なる「単語＝翻訳」ではなく、問題文で認識し、図面・写真で見分け、答案で使えるカードを作ること。

執筆ルール：
1. 日本語を主言語にする。英語は標準的な専門語だけを補助として添える。
2. カタカナ語の場合も、可能なら元の英語を termEn に入れる。
3. definitionJa は1〜2文、corePointJa は最重要点を1文で書く。
4. visualCluesJa は写真・平面・断面・構造図で観察できる特徴を1〜3項目にする。視覚特徴が不適切な抽象語では、問題文や計算式での識別手掛かりを書く。
5. confusionJa は最も混同しやすい用語との差を、用語名を含めて短く説明する。
6. examSentenceJa はそのまま短答答案に使える、断定的で自然な1文にする。
7. 不確かな固有名詞・年代・数値を作らない。入力だけでは特定できない場合も、最も一般的な意味を採用し、sourceNote に確認事項を書く。
8. memoZh だけは、概念を直感的に理解するための短い簡体字中国語を1文だけ入れる。それ以外は日本語で書く。
9. Markdownを使わず、指定JSONだけを返す。

JSON schema:
{
  "category": "日本語の分類",
  "termJa": "日本語の正式用語",
  "readingJa": "ひらがなの読み（不要なら空文字）",
  "termEn": "標準英語（不明・不要なら空文字）",
  "definitionJa": "一言定義",
  "corePointJa": "理解の中心",
  "visualCluesJa": ["識別特徴1", "識別特徴2"],
  "confusionJa": "混同語との違い",
  "exampleJa": "代表的な建築・場面・適用例",
  "examSentenceJa": "答案用の短文",
  "memoZh": "简体中文理解锚点，仅一句话",
  "sourceNote": "要確認事項。なければ空文字"
}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(stringValue).filter(Boolean).slice(0, 4);
}

function messageContent(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (!Array.isArray(value)) return "";
  return value
    .map((part) => {
      if (typeof part === "string") return part;
      if (!isRecord(part)) return "";
      return stringValue(part.text) || stringValue(part.content);
    })
    .filter(Boolean)
    .join("")
    .trim();
}

function apiResponseMessage(payload: unknown): string {
  if (!isRecord(payload)) return typeof payload === "string" ? payload.trim() : "";
  const error = payload.error;
  if (typeof error === "string") return error.trim();
  if (isRecord(error)) {
    const nested = stringValue(error.message) || stringValue(error.msg) || stringValue(error.detail);
    if (nested) return nested;
  }
  const message = stringValue(payload.message) || stringValue(payload.msg) || stringValue(payload.detail);
  const code = typeof payload.code === "string" || typeof payload.code === "number" ? String(payload.code) : "";
  return [code && `code ${code}`, message].filter(Boolean).join("：");
}

export function normalizeTermDraft(value: unknown, fallbackCategory = ""): TermCardDraft {
  if (!isRecord(value)) throw new Error("APIから返された内容が有効なオブジェクトではありません。");
  const draft: TermCardDraft = {
    category: stringValue(value.category) || fallbackCategory,
    termJa: stringValue(value.termJa),
    readingJa: stringValue(value.readingJa),
    termEn: stringValue(value.termEn),
    definitionJa: stringValue(value.definitionJa),
    corePointJa: stringValue(value.corePointJa),
    visualCluesJa: stringArray(value.visualCluesJa),
    confusionJa: stringValue(value.confusionJa),
    exampleJa: stringValue(value.exampleJa),
    examSentenceJa: stringValue(value.examSentenceJa),
    memoZh: stringValue(value.memoZh),
    sourceNote: stringValue(value.sourceNote),
  };
  if (!draft.termJa || !draft.definitionJa || !draft.examSentenceJa) {
    throw new Error("APIの応答に用語・定義・答案用短文のいずれかが不足しています。もう一度生成してください。");
  }
  return draft;
}

export function parseTermDraftContent(content: string, fallbackCategory = ""): TermCardDraft {
  const cleaned = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return normalizeTermDraft(JSON.parse(cleaned), fallbackCategory);
  } catch (error) {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first >= 0 && last > first) {
      try {
        return normalizeTermDraft(JSON.parse(cleaned.slice(first, last + 1)), fallbackCategory);
      } catch {
        // Fall through to the more useful original error below.
      }
    }
    if (error instanceof Error && !(error instanceof SyntaxError)) throw error;
    throw new Error("APIのJSON応答を読み取れませんでした。JSON出力に対応したモデルか確認してください。");
  }
}

export function readTermCards(): TermCard[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(TERM_CARD_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter(isRecord).map((item): TermCard => {
      const status: TermCardStatus = item.status === "remembered" ? "remembered" : "learning";
      return {
        ...EMPTY_TERM_DRAFT,
        ...item,
        visualCluesJa: stringArray(item.visualCluesJa),
        id: stringValue(item.id),
        subjectId: stringValue(item.subjectId),
        status,
        createdAt: stringValue(item.createdAt),
        updatedAt: stringValue(item.updatedAt),
      };
    }).filter((item) => item.id && item.subjectId && item.termJa);
  } catch {
    return [];
  }
}

export function writeTermCards(cards: TermCard[]): void {
  window.localStorage.setItem(TERM_CARD_STORAGE_KEY, JSON.stringify(cards));
}

export function makeTermCard(draft: TermCardDraft, subjectId: string, previous?: TermCard): TermCard {
  const now = new Date().toISOString();
  return {
    ...draft,
    id: previous?.id ?? (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `term-${Date.now()}`),
    subjectId,
    status: previous?.status ?? "learning",
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };
}

export function readApiSettings(): TermApiSettings {
  if (typeof window === "undefined") return DEFAULT_API_SETTINGS;
  try {
    const saved = JSON.parse(window.localStorage.getItem(TERM_API_SETTINGS_KEY) ?? "{}") as Partial<TermApiSettings>;
    const remembered = saved.rememberKey ? stringValue(saved.apiKey) : "";
    const session = window.sessionStorage.getItem(TERM_API_SESSION_KEY) ?? "";
    return {
      endpoint: stringValue(saved.endpoint) || DEFAULT_API_SETTINGS.endpoint,
      model: stringValue(saved.model) || DEFAULT_API_SETTINGS.model,
      apiKey: remembered || session,
      rememberKey: Boolean(saved.rememberKey),
    };
  } catch {
    return DEFAULT_API_SETTINGS;
  }
}

export function writeApiSettings(settings: TermApiSettings): void {
  window.localStorage.setItem(TERM_API_SETTINGS_KEY, JSON.stringify({
    endpoint: settings.endpoint,
    model: settings.model,
    rememberKey: settings.rememberKey,
    apiKey: settings.rememberKey ? settings.apiKey : "",
  }));
  if (settings.rememberKey) window.sessionStorage.removeItem(TERM_API_SESSION_KEY);
  else window.sessionStorage.setItem(TERM_API_SESSION_KEY, settings.apiKey);
}

export async function generateTermCard(
  settings: TermApiSettings,
  input: { term: string; subject: TermSubject; category: string; context: string },
): Promise<TermCardDraft> {
  if (!settings.apiKey.trim()) throw new Error("先にAPI設定でAPIキーを入力してください。");
  if (!settings.endpoint.trim() || !settings.model.trim()) throw new Error("APIエンドポイントとモデル名は必須です。");

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), TERM_CARD_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(settings.endpoint.trim(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: settings.model.trim(),
        temperature: 0.2,
        // A term card is a structured extraction task; disabling thinking avoids
        // spending the output budget before the final JSON is produced.
        thinking: { type: "disabled" },
        max_tokens: 2000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: TERM_CARD_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              `学科：${input.subject.labelJa}`,
              `分類：${input.category || "モデルが判断"}`,
              `調べたい用語：${input.term}`,
              `出会った文脈・補足：${input.context || "なし"}`,
              "上の用語について、学科と文脈に合うカードをJSONで作成してください。",
            ].join("\n"),
          },
        ],
      }),
      signal: controller.signal,
    });
    const responseText = await response.text();
    let payload: unknown = null;
    if (responseText) {
      try { payload = JSON.parse(responseText); }
      catch { payload = responseText; }
    }
    const apiMessage = apiResponseMessage(payload);
    if (!response.ok) {
      throw new Error(apiMessage || `APIリクエストに失敗しました（HTTP ${response.status}）。`);
    }
    if (!isRecord(payload) || !Array.isArray(payload.choices)) {
      if (apiMessage) throw new Error(`APIからエラー応答が返されました：${apiMessage}`);
      const contentType = response.headers.get("content-type")?.split(";")[0] || "不明";
      throw new Error(`API応答が補完形式ではありません（HTTP ${response.status}、${contentType}）。エンドポイントまたは中継サービスを確認してください。`);
    }
    if (payload.choices.length === 0) throw new Error("API応答の choices が空でした。少し待ってから再生成してください。");
    const first = payload.choices[0];
    if (!isRecord(first) || !isRecord(first.message)) throw new Error("API応答に message がありません。");
    const content = messageContent(first.message.content);
    if (!content) {
      const finishReason = stringValue(first.finish_reason);
      if (finishReason === "length") throw new Error("モデルの出力上限に達し、カードJSONが完成しませんでした。もう一度生成してください。");
      const reasoningOnly = stringValue(first.message.reasoning_content);
      if (reasoningOnly) throw new Error("モデルが思考内容だけを返し、カードJSONを返しませんでした。もう一度生成してください。");
      throw new Error("モデルの応答は完了しましたが、カードJSONが空でした。少し待ってから再生成してください。");
    }
    return parseTermDraftContent(content, input.category);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw new Error("生成に3分以上かかったため、リクエストを停止しました。API側が混雑している可能性があります。少し待ってから再生成してください。");
    if (error instanceof TypeError) throw new Error("APIに接続できません。アドレス、ネットワーク、ブラウザからのCORS接続許可を確認してください。");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
