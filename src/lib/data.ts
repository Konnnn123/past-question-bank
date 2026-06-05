"use server";

import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Question {
  year: number;
  subject: string;
  category: string;
  tags: string[];
  question_number: string;
  content: string;
  images: string[];
  fileName: string;
}

// 从内容中提取图片路径
function extractImages(content: string): string[] {
  const imageRegex = /!\[[^\]]*\]\((\/past-exams\/[^)]+)\)/g;
  const images: string[] = [];
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    images.push(match[1]);
  }
  return images;
}

// 解析单个 processed question 文件
function parseQuestionFile(filePath: string): Question | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    // 提取图片
    const images = extractImages(content);

    return {
      year: data.year || 0,
      subject: data.subject || "其他",
      category: data.category || "其他",
      tags: Array.isArray(data.tags) ? data.tags : [],
      question_number: data.question_number || "1",
      content: content.trim(),
      images,
      fileName: path.basename(filePath),
    };
  } catch (error) {
    console.error(`解析文件失败: ${filePath}`, error);
    return null;
  }
}

// 主函数：读取所有 processed questions 并返回 Question 数组
export async function getAllQuestions(): Promise<Question[]> {
  const processedDir = path.resolve(process.cwd(), "data/processed_questions");

  if (!fs.existsSync(processedDir)) {
    console.warn(`Processed questions directory not found: ${processedDir}`);
    return [];
  }

  const files = fs.readdirSync(processedDir).filter((f) => f.endsWith(".md"));
  const allQuestions: Question[] = [];

  for (const file of files) {
    const filePath = path.join(processedDir, file);
    const question = parseQuestionFile(filePath);
    if (question) {
      allQuestions.push(question);
    }
  }

  // 按年份和题号排序
  allQuestions.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.question_number.localeCompare(b.question_number);
  });

  return allQuestions;
}

// 获取所有唯一的年份
export async function getAllYears(): Promise<number[]> {
  const questions = await getAllQuestions();
  const years = new Set(questions.map((q) => q.year));
  return Array.from(years).sort();
}

// 获取所有唯一的科目
export async function getAllSubjects(): Promise<string[]> {
  const questions = await getAllQuestions();
  const subjects = new Set(questions.map((q) => q.subject));
  return Array.from(subjects).sort();
}

// 获取所有唯一的考试类别
export async function getAllCategories(): Promise<string[]> {
  const questions = await getAllQuestions();
  const categories = new Set(questions.map((q) => q.category));
  return Array.from(categories).sort();
}

// 获取按科目分组的标签频次统计
export async function getTagFrequencyBySubject(): Promise<
  Record<string, Record<string, number>>
> {
  const questions = await getAllQuestions();
  const result: Record<string, Record<string, number>> = {};

  for (const q of questions) {
    if (!result[q.subject]) {
      result[q.subject] = {};
    }
    for (const tag of q.tags) {
      result[q.subject][tag] = (result[q.subject][tag] || 0) + 1;
    }
  }

  // 按频次排序
  for (const subject of Object.keys(result)) {
    const sorted: Record<string, number> = {};
    const entries = Object.entries(result[subject]).sort(
      ([, a], [, b]) => b - a
    );
    for (const [tag, count] of entries) {
      sorted[tag] = count;
    }
    result[subject] = sorted;
  }

  return result;
}
