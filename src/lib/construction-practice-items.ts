import type { ConstructionAnswerItem } from "@/lib/construction-review";

export type ConstructionPracticeItem = {
  id: string;
  prompt: string;
  answer: string;
  sourceItem: ConstructionAnswerItem;
};

function lineForLabel(content: string, label: string) {
  const labelPattern = label.toUpperCase() === "I"
    ? "(?:I|Ⅰ)"
    : label.toUpperCase() === "O"
      ? "(?:O|0)"
      : label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`[（(]\\s*${labelPattern}\\s*[）)]`, "i"),
    new RegExp(`【\\s*${labelPattern}(?:[.．]|\\s)`, "i"),
    new RegExp(`^\\s*${labelPattern}[.．]\\s*`, "i"),
  ];
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines
    .filter((line) => patterns.some((pattern) => pattern.test(line)))
    .sort((a, b) => a.length - b.length)[0];
}

function splitAnswerLines(answer: string) {
  return answer.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

export function expandConstructionPracticeItem(item: ConstructionAnswerItem, content: string): ConstructionPracticeItem[] {
  const base = { id: item.itemId, prompt: item.prompt?.trim() ?? "", answer: item.answer.trim(), sourceItem: item };
  if (!base.prompt || !item.answer.includes("\n") || /図中|図解/.test(base.prompt)) return [base];

  const expanded = splitAnswerLines(item.answer).flatMap<ConstructionPracticeItem>((line, index) => {
    const relation = line.match(/^(.+?)[：→](.+)$/);
    if (relation && !/^[A-Za-z]$/.test(relation[1].trim())) {
      const term = relation[1].trim();
      return [{
        id: `${item.itemId}:part-${index + 1}`,
        prompt: `次の用語と最も関連の深い用語を答えなさい。\n\n「${term}」`,
        answer: relation[2].trim(),
        sourceItem: item,
      }];
    }

    const labelled = line.match(/^(?:[（(](\d{1,2})[）)]|([A-Za-z])|(\d{1,2}))\s+(.+)$/);
    if (!labelled) return [];
    const label = labelled[1] || labelled[2] || labelled[3];
    const answer = labelled[4].trim();
    const context = lineForLabel(content, label);
    if (!context) return [];
    return [{
      id: `${item.itemId}:part-${label}`,
      prompt: `次の文章の空欄${/^[A-Za-z]$/.test(label) ? `（${label}）` : label}に入る最も適切な語句・数値を答えなさい。\n\n${context}`,
      answer,
      sourceItem: item,
    }];
  });

  return expanded.length >= 2 ? expanded : [base];
}
