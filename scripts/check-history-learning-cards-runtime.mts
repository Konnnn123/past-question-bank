import { HISTORY_LEARNING_CARDS } from "../src/lib/history-learning-cards";

const cjk = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
const missing: Array<{ id: string; field: string; message: string }> = [];
const seen = new WeakSet<object>();

function walk(value: unknown, field: string, id: string): void {
  if (!value || typeof value !== "object" || seen.has(value)) return;
  seen.add(value);
  const localized = value as { ja?: unknown; zh?: unknown; en?: unknown };
  if (typeof localized.ja === "string" && typeof localized.zh === "string") {
    if (typeof localized.en !== "string" || !localized.en.trim()) {
      missing.push({ id, field, message: "missing runtime English value" });
    } else if (cjk.test(localized.en)) {
      missing.push({ id, field, message: "runtime English value contains CJK text" });
    }
    return;
  }
  for (const [key, child] of Object.entries(value)) walk(child, field ? `${field}.${key}` : key, id);
}

for (const card of HISTORY_LEARNING_CARDS) walk(card, "", card.id);
process.stdout.write(JSON.stringify(missing));
