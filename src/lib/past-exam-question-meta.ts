import fs from "fs";
import path from "path";

export type PastExamQuestionMeta = {
  typeJa: string;
  typeZh: string;
  methodJa: string;
  methodZh: string;
};

function classifyQuestion(fileName: string): PastExamQuestionMeta {
  const filePath = path.join(process.cwd(), "data", "processed_questions", fileName);
  const source = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "";

  if (/A\s*[～~]\s*[A-Z][\s\S]{0,30}選び[、，]?[\s\S]{0,80}\(1\)/.test(source) || (/\(1\)[\s\S]{0,80}図/.test(source) && /\(2\)[\s\S]{0,80}構造/.test(source))) {
    return {
      typeJa: "選択記述・図示",
      typeZh: "选取建筑后记述／图示",
      methodJa: "指定された建築から選び、図示と構造・空間・歴史の説明を行う。",
      methodZh: "从指定建筑中选择，并以图示及结构、空间、历史说明作答。",
    };
  }
  if (/A\s*群|B\s*群|C\s*群|語群/.test(source)) {
    return {
      typeJa: "対応選択（語群）",
      typeZh: "对应选择（语群）",
      methodJa: "建築と、人物・構成要素・様式・年代などの語群との対応を選ぶ。",
      methodZh: "将建筑与人物、构成要素、样式、年代等语群进行对应选择。",
    };
  }
  if (/説明しなさい|述べなさい|記述しなさい/.test(source)) {
    return {
      typeJa: "記述",
      typeZh: "简答／论述",
      methodJa: "設問で指定された観点に沿って、根拠を示しながら説明する。",
      methodZh: "按照题目指定的角度，结合依据进行说明。",
    };
  }
  return {
    typeJa: "用語・知識確認",
    typeZh: "术语／知识确认",
    methodJa: "問題文と語群の文脈の中で、知識点の対応を判断する。",
    methodZh: "在题干与语群的语境中判断知识点的对应关系。",
  };
}

export function getPastExamQuestionMeta(fileNames: string[]) {
  return Object.fromEntries([...new Set(fileNames)].map((fileName) => [fileName, classifyQuestion(fileName)]));
}
