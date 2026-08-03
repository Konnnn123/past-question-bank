export type ParsedMultipleChoice = {
  prompt: string;
  options: string[];
  correctIndex: number;
};

const OPTION_MARKER = /(?:^|\n)[ \t]*([A-HＡ-Ｈ])[ \t]*[：:.．、・)）][ \t]*/gimu;

function asciiLetter(value: string) {
  const code = value.normalize("NFKC").toUpperCase().charCodeAt(0);
  return code >= 65 && code <= 72 ? String.fromCharCode(code) : "";
}

function comparable(value: string) {
  return value.normalize("NFKC").replace(/\s+/g, " ").replace(/[。．.]$/, "").trim().toLocaleLowerCase();
}

export function parseEmbeddedMultipleChoice(prompt: string, answer: string): ParsedMultipleChoice | null {
  const source = prompt.replace(/\r\n?/g, "\n");
  const markers = [...source.matchAll(OPTION_MARKER)];
  if (markers.length < 2) return null;

  const letters = markers.map((marker) => asciiLetter(marker[1]));
  if (letters.some((letter) => !letter) || new Set(letters).size !== letters.length) return null;

  const options = markers.map((marker, index) => {
    const start = (marker.index ?? 0) + marker[0].length;
    const end = markers[index + 1]?.index ?? source.length;
    return source.slice(start, end).trim();
  });
  if (options.some((option) => !option) || new Set(options.map(comparable)).size !== options.length) return null;

  const answerLetter = asciiLetter(answer.match(/^\s*([A-HＡ-Ｈ])(?:\s*[：:.．、・)）]|\s*$)/iu)?.[1] ?? "");
  let correctIndex = answerLetter ? letters.indexOf(answerLetter) : -1;
  if (correctIndex < 0) {
    const answerText = comparable(answer.replace(/^\s*[A-HＡ-Ｈ]\s*[：:.．、・)）]\s*/iu, ""));
    correctIndex = options.findIndex((option) => {
      const optionText = comparable(option);
      return answerText === optionText || answerText.startsWith(`${optionText} `) || answerText.includes(optionText);
    });
  }
  if (correctIndex < 0) return null;

  const questionText = source.slice(0, markers[0].index ?? 0).trim();
  if (!questionText) return null;
  return { prompt: questionText, options, correctIndex };
}
