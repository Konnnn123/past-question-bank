import type { ConstructionAnswerItem } from "@/lib/construction-review";

export type ConstructionPracticeItem = {
  id: string;
  prompt: string;
  answer: string;
  options?: string[];
  correctIndex?: number;
  sourceItem: ConstructionAnswerItem;
};

function comparable(value: string) {
  const superscripts: Record<string, string> = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };
  return value
    .normalize("NFKC")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, (character) => superscripts[character] ?? character)
    .replace(/\\times|[×＊]/g, "x")
    .replace(/[−–—]/g, "-")
    .replace(/\^/g, "")
    .replace(/[$`*_{}\\]/g, "")
    .replace(/\s+/g, "")
    .replace(/,/g, "")
    .toLowerCase();
}

function answerMatchesText(answer: string, text: string) {
  const normalizedAnswer = comparable(answer).replace(/(?:n\/mm2|kg\/m3|\/k)$/i, "");
  return normalizedAnswer.length > 0 && comparable(text).includes(normalizedAnswer);
}

function lineForLabel(content: string, label: string, answer: string) {
  const labelPattern = label.toUpperCase() === "I"
    ? "(?:I|Ⅰ)"
    : label.toUpperCase() === "O"
      ? "(?:O|0)"
      : label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const explicitPatterns = [
    new RegExp(`[（(【]\\s*${labelPattern}(?:\\s*[.．])?\\s*[）)】]`, "i"),
    new RegExp(`【\\s*${labelPattern}(?:[.．]|\\s)`, "i"),
    new RegExp(`^\\s*${labelPattern}[.．]\\s*`, "i"),
  ];
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const explicitCandidates = lines.filter((line) => explicitPatterns.some((pattern) => pattern.test(line)));
  const fallbackPattern = new RegExp(`(?:^|[^0-9A-Za-z])${labelPattern}(?=[^0-9A-Za-z]|$)`, "i");
  const candidates = (explicitCandidates.length ? explicitCandidates : lines.filter((line) => fallbackPattern.test(line)))
    .sort((a, b) => a.length - b.length);
  return candidates.find((line) => answerMatchesText(answer, line)) ?? candidates[0];
}

function splitAnswerLines(answer: string) {
  return answer.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function splitChoices(value: string, commaDelimited = false) {
  const separator = commaDelimited
    ? /\s*[,、，；;]\s*/
    : /[、，；;]/.test(value) ? /\s*[、，；;]\s*/ : /\s+/;
  return value.split(separator).map((option) => option.trim()).filter(Boolean);
}

function inlineChoices(context: string) {
  const square = [...context.matchAll(/【\s*[A-Za-zⅠ0-9]+\s*[.．]\s*([^】]+)】/g)].at(-1);
  if (square) {
    const options = splitChoices(square[1], true);
    if (options.length >= 2) return { options, prompt: context.replace(square[0], "【　】") };
  }

  const groups = [...context.matchAll(/[（(]([^()（）]+)[）)]/g)];
  const choiceGroup = groups.reverse().find((match) => splitChoices(match[1]).length >= 2);
  if (!choiceGroup) return null;
  const options = splitChoices(choiceGroup[1]);
  return { options, prompt: context.replace(choiceGroup[0], "（　）") };
}

function htmlTableOptions(content: string) {
  const cells = [...content.matchAll(/<td>(.*?)<\/td>/gi)].map((match) => match[1].replace(/<[^>]+>/g, "").trim());
  const options: string[] = [];
  for (let index = 0; index + 1 < cells.length; index += 2) {
    if (/^[A-Z]{1,2}$/i.test(cells[index]) && cells[index + 1]) options.push(cells[index + 1]);
  }
  return options;
}

function sharedWordBank(content: string) {
  const htmlOptions = htmlTableOptions(content);
  if (htmlOptions.length >= 2) return htmlOptions;

  const heading = /(?:^|\n)\s*#{0,2}\s*【(?:用語群|欄\s*[A-Z]|構造形式)】\s*\n/imu.exec(content);
  if (!heading) return [];
  const bank = content.slice((heading.index ?? 0) + heading[0].length)
    .split(/\n\s*(?:#{1,3}\s*)?【|\n\s*[（(]?\d+[）)]?\s+(?:以下|次の)/u)[0]
    .replace(/<[^>]+>/g, " ")
    .trim();
  if (!bank) return [];

  const labelled = [...bank.matchAll(/[（(]\s*[A-Z]\s*[）)]\s*([^，（(\n]+(?:[（(][^）)]+[）)])?)/giu)]
    .map((match) => match[1].trim());
  if (labelled.length >= 2) return labelled;
  return bank.split(/[、，・,，\n]+/u).map((option) => option.trim()).filter((option) => option && !/^#+/.test(option));
}

function correctChoiceIndex(options: string[], answer: string) {
  const normalizedAnswer = comparable(answer).replace(/(?:n\/mm2|kg\/m3|\/k)$/i, "");
  return options.findIndex((option) => {
    const normalizedOption = comparable(option).replace(/[。.，,]$/u, "");
    return normalizedOption === normalizedAnswer
      || (Math.min(normalizedAnswer.length, normalizedOption.length) >= 4
        && (normalizedAnswer.startsWith(normalizedOption) || normalizedOption.startsWith(normalizedAnswer)));
  });
}

function sourceLineForTerm(content: string, term: string) {
  const normalizedTerm = comparable(term);
  return content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    .filter((line) => comparable(line).includes(normalizedTerm))
    .sort((a, b) => a.length - b.length)[0];
}

function withChoices(base: ConstructionPracticeItem, prompt: string, options: string[]) {
  const correctIndex = correctChoiceIndex(options, base.answer);
  return correctIndex >= 0 ? { ...base, prompt, options, correctIndex } : { ...base, prompt };
}

function topLevelSection(content: string, prompt: string) {
  const sectionNumber = prompt.match(/^\s*[（(]?(\d{1,2})[）).．\s]/)?.[1];
  if (!sectionNumber) return content;
  const lines = content.split(/\r?\n/);
  const marker = (line: string, number: number) => new RegExp(
    `^\\s*(?:[（(]${number}[）)]\\s*(?:以下|次の)|${number}[.．]\\s+|${number}\\s+(?:以下|次の))`,
  ).test(line);
  const start = lines.findIndex((line) => marker(line, Number(sectionNumber)));
  if (start < 0) return content;
  const endOffset = lines.slice(start + 1).findIndex((line) => marker(line, Number(sectionNumber) + 1));
  return lines.slice(start, endOffset < 0 ? undefined : start + 1 + endOffset).join("\n");
}

export function expandConstructionPracticeItem(item: ConstructionAnswerItem, content: string): ConstructionPracticeItem[] {
  const base = { id: item.itemId, prompt: item.prompt?.trim() ?? "", answer: item.answer.trim(), sourceItem: item };
  if (!base.prompt || /図中|図解/.test(base.prompt)) return [base];

  const bank = sharedWordBank(content);
  const scopedContent = topLevelSection(content, base.prompt);
  if (!item.answer.includes("\n")) {
    const itemNumber = item.itemId.match(/#s(\d{2})$/)?.[1]?.replace(/^0/, "");
    const context = sourceLineForTerm(scopedContent, base.prompt)
      ?? (itemNumber ? lineForLabel(scopedContent, itemNumber, base.answer) : undefined);
    if (!context) return [base];
    const inline = inlineChoices(context);
    if (inline) return [withChoices(base, `次の値・用語として最も適切なものを選びなさい。\n\n${inline.prompt}`, inline.options)];
    if (bank.length >= 2 && correctChoiceIndex(bank, base.answer) >= 0) {
      return [withChoices(base, `次の空欄・用語に入る最も適切なものを、原題の語群から選びなさい。\n\n${context}`, bank)];
    }
    return [{ ...base, prompt: context }];
  }

  const expanded = splitAnswerLines(item.answer).flatMap<ConstructionPracticeItem>((line, index) => {
    const relation = line.match(/^(.+?)[：→](.+)$/);
    if (relation && !/^[A-Za-z]$/.test(relation[1].trim())) {
      const term = relation[1].trim();
      const answer = relation[2].trim();
      const context = sourceLineForTerm(scopedContent, term) ?? `「${term}」`;
      const practiceItem = {
        id: `${item.itemId}:part-${index + 1}`,
        prompt: `次の用語・人物と最も関連の深いものを選びなさい。\n\n${context}`,
        answer,
        sourceItem: item,
      };
      return [bank.length >= 2 ? withChoices(practiceItem, practiceItem.prompt, bank) : practiceItem];
    }

    const labelled = line.match(/^(?:[（(](\d{1,2})[）)]|([A-Za-z])|(\d{1,2}))\s+(.+)$/);
    if (!labelled) return [];
    const label = labelled[1] || labelled[2] || labelled[3];
    const answer = labelled[4].trim();
    const context = lineForLabel(scopedContent, label, answer);
    if (!context) return [];
    const inline = inlineChoices(context);
    const practiceItem = {
      id: `${item.itemId}:part-${label}`,
      prompt: `次の文章の空欄${/^[A-Za-z]$/.test(label) ? `（${label}）` : label}に入る最も適切な語句・数値を答えなさい。\n\n${context}`,
      answer,
      sourceItem: item,
    };
    if (inline) return [withChoices(practiceItem, `次の文章の空欄${/^[A-Za-z]$/.test(label) ? `（${label}）` : label}に入る最も適切なものを選びなさい。\n\n${inline.prompt}`, inline.options)];
    const wordBankPrompt = `次の文章の空欄${/^[A-Za-z]$/.test(label) ? `（${label}）` : label}に入る最も適切なものを、原題の語群から選びなさい。\n\n${context}`;
    return [bank.length >= 2 ? withChoices(practiceItem, wordBankPrompt, bank) : practiceItem];
  });

  return expanded.length >= 2 ? expanded : [base];
}
