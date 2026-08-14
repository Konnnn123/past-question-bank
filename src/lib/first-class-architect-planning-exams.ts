import examManifest from "../../data/first-class-architect-planning/manifest.json";
import questionData from "../../data/first-class-architect-planning/questions.json";

export type FirstClassArchitectPlanningExam = {
  year: number;
  eraLabel: string;
  questionHref: string;
  answerHref: string;
  answers: string[];
};

export type FirstClassArchitectPlanningQuestion = {
  id: string;
  year: number;
  eraLabel: string;
  number: number;
  sourcePage: number;
  prompt: string;
  options: string[];
  correctOption: string;
  questionHref: string;
  answerHref: string;
};

export const FIRST_CLASS_ARCHITECT_PLANNING_EXAMS = examManifest as FirstClassArchitectPlanningExam[];
export const FIRST_CLASS_ARCHITECT_PLANNING_QUESTIONS = questionData as FirstClassArchitectPlanningQuestion[];

export function officialPlanningSource(questionId: string) {
  const match = /^1k-(\d{4})-(\d{2})(?:-|$)/.exec(questionId);
  if (!match) return undefined;
  const exam = FIRST_CLASS_ARCHITECT_PLANNING_EXAMS.find((item) => item.year === Number(match[1]));
  const questionNo = Number(match[2]);
  if (!exam || questionNo < 1 || questionNo > exam.answers.length) return undefined;
  return { exam, questionNo, answer: exam.answers[questionNo - 1] };
}
