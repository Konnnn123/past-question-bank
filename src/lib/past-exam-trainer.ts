import type { Question } from "@/types/question";
import { buildLightPracticeQuestions, type LightPracticeQuestion } from "@/lib/light-practice";
import { getPlanningAnswerRecords } from "@/lib/planning-review";
import { getConstructionAnswerRecords } from "@/lib/construction-review";

export type TrainerSubject = "history" | "planning" | "building_construction" | "environment";
export type TrainerLevel = "A" | "B" | "C";

export type TrainerMetadata = {
  mode: "past_exam_reconstruction";
  surfaceFormat: string;
  cognitiveTask: string;
  knowledgeRelation: string;
  topicTags: string[];
  answerBasis: string;
  commonErrorTags: string[];
  confidence: "verified" | "draft" | "incomplete";
  optionAnalysis: Array<{ option: string; status: "correct" | "incorrect" | "unresolved"; reason: string; confidence: "verified" | "draft" | "incomplete" }>;
};

export type TrainerBlock = Question & {
  trainerSubject: TrainerSubject;
  level: TrainerLevel;
  metadata: TrainerMetadata;
  sourcePath: string;
  gradingStatus: "automatic" | "self_evaluation" | "missing_source_material";
};

export type TrainerUnit = LightPracticeQuestion & {
  trainerSubject: TrainerSubject;
  level: "A" | "B";
  metadata: TrainerMetadata;
  sourcePath: string;
};

const SUBJECTS: Array<[TrainerSubject, string, string]> = [
  ["history", "建筑史", "建筑史"],
  ["planning", "建筑计划", "建筑计划"],
  ["building_construction", "建筑构法", "建筑构法"],
  ["environment", "建筑环境工学", "建筑环境工学"],
];

export function trainerSubject(question: Pick<Question, "subject" | "fileName">): TrainerSubject | null {
  const source = `${question.subject} ${question.fileName}`;
  const match = SUBJECTS.find(([, chinese, japanese]) => source.includes(chinese) || source.includes(japanese));
  return match ? match[0] : null;
}

export function subjectLabel(subject: TrainerSubject) {
  return ({ history: "建筑史", planning: "建筑计划", building_construction: "建筑构法", environment: "环境工学" })[subject];
}

function topicTags(subject: TrainerSubject, text: string) {
  const haystack = text.toLowerCase();
  const tags: string[] = [subject];
  const add = (tag: string, terms: string[]) => { if (terms.some((term) => haystack.includes(term.toLowerCase()))) tags.push(tag); };
  if (subject === "planning") {
    add("住宅", ["住宅", "住居"]); add("集合住宅", ["集合住宅"]); add("医院", ["病院"]); add("高龄者设施", ["高齢", "老人"]);
    add("办公", ["事務所", "オフィス"]); add("剧场/文化设施", ["劇場", "文化施設"]); add("都市理论", ["都市"]); add("图面阅读", ["図", "平面", "断面"]);
    add("案例比较", ["比較", "事例"]); add("制度/标准", ["基準", "制度"]);
  }
  if (subject === "building_construction") {
    add("RC", ["rc", "鉄筋コンクリート", "コンクリート"]); add("钢结构", ["鉄骨", "鋼"]); add("木结构", ["木造", "木材"]);
    add("材料", ["材料", "強度"]); add("构件", ["部材", "梁", "柱"]); add("工序", ["施工", "工事"]); add("性能", ["性能", "耐"]);
    add("缺陷", ["ひび", "欠陥"]); add("原因/对策", ["原因", "対策"]);
  }
  if (subject === "environment") {
    add("换气", ["換気", "co₂", "co2"]); add("温热", ["温熱", "熱"]); add("光", ["照明", "採光", "光"]); add("声", ["音", "騒音"]);
    add("空气", ["空気"]); add("现象", ["現象", "結露"]); add("公式", ["計算", "ppm", "="]); add("正误判断", ["正しい", "誤"]);
  }
  if (subject === "history") {
    add("建筑名称", ["建築名"]); add("建筑师", ["建築家"]); add("年代", ["年代", "年"]); add("样式", ["様式"]);
    add("图片识别", ["図", "写真", "画像"]); add("论述/短答", ["論述", "説明"]);
  }
  return [...new Set(tags)];
}

function baseMetadata(subject: TrainerSubject, question: Question, answerBasis: string, confidence: TrainerMetadata["confidence"]): TrainerMetadata {
  const source = `data/processed_questions/${question.fileName}`;
  const task = ({
    history: "保留原题结构，识别建筑、人物、年代、样式或依据题干完成短答。",
    planning: "在原题给定的设施、案例、制度或空间条件中判断对应答案。",
    building_construction: "依据原题给出的材料、构件、施工工序或性能条件作答。",
    environment: "依据原题给出的环境条件、公式、现象或判断条件作答。",
  })[subject];
  return {
    mode: "past_exam_reconstruction", surfaceFormat: "原题题块", cognitiveTask: task,
    knowledgeRelation: "原题题干条件与正式答案记录之间的关系；未建立逐选项负向证据。",
    topicTags: topicTags(subject, `${question.fileName} ${question.content}`), answerBasis,
    commonErrorTags: ["source-context", "original-wording"], confidence, optionAnalysis: [],
  };
}

export function buildTrainerBlocks(questions: Question[]): TrainerBlock[] {
  return questions.flatMap((question) => {
    const subject = trainerSubject(question);
    if (!subject || question.category !== "専門1") return [];
    const missingHistorySource = subject === "history" && ((question.year === 2014) || (question.year === 2015 && question.question_number === "3") || question.year === 2018);
    const sourcePath = `data/processed_questions/${question.fileName}`;
    const level: TrainerLevel = missingHistorySource ? "C" : "C";
    return [{ ...question, trainerSubject: subject, level, sourcePath,
      gradingStatus: missingHistorySource ? "missing_source_material" : "self_evaluation",
      metadata: baseMetadata(subject, question, missingHistorySource ? "missing_source_material：允许浏览原题，未建立自动评分依据。" : `原题题块：${sourcePath}`, "incomplete"),
    }];
  });
}

export function buildTrainerUnits(questions: Question[]): TrainerUnit[] {
  const base = buildLightPracticeQuestions(questions, getPlanningAnswerRecords(), getConstructionAnswerRecords());
  const byId = new Map(questions.map((question) => [question.id, question]));
  return base.flatMap((item) => {
    const source = item.sourceQuestionId ? byId.get(item.sourceQuestionId) : undefined;
    if (!source || source.category !== "専門1") return [];
    const subject = trainerSubject(source);
    if (!subject) return [];
    const level: "A" | "B" = "B";
    const metadata = baseMetadata(subject, source, `正式答案索引：${item.answer}；原题：data/processed_questions/${source.fileName}`, "draft");
    metadata.surfaceFormat = item.assessmentForm;
    metadata.cognitiveTask = item.skillLevel === "应用" ? "依据原题条件进行计算或应用判断。" : metadata.cognitiveTask;
    metadata.commonErrorTags = ["answer-index-reading", "original-context" ];
    return [{ ...item, trainerSubject: subject, level, metadata, sourcePath: `data/processed_questions/${source.fileName}` }];
  });
}

export function trainerCoverage(blocks: TrainerBlock[], units: TrainerUnit[]) {
  return (["history", "planning", "building_construction", "environment"] as TrainerSubject[]).map((subject) => ({
    subject, years: [...new Set(blocks.filter((block) => block.trainerSubject === subject).map((block) => block.year))].sort(),
    blocks: blocks.filter((block) => block.trainerSubject === subject).length,
    scorableUnits: units.filter((unit) => unit.trainerSubject === subject).length,
  }));
}
