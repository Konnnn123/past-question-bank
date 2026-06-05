import * as fs from "fs";
import * as path from "path";

// 复制主脚本的所有函数和逻辑，但只处理指定文件
const RAW_MARKDOWN_DIR = path.resolve(__dirname, "../../data/raw_markdown");
const PROCESSED_DIR = path.resolve(__dirname, "../../data/processed_questions");
const RAW_API_BASE = process.env.LLM_API_BASE || "https://api.openai.com/v1";
const API_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || "";
const MODEL = process.env.LLM_MODEL || "gpt-4o";
const API_FORMAT = (process.env.LLM_API_FORMAT || "auto") as "openai" | "anthropic" | "auto";
const ALLOWED_SUBJECTS = ["建筑史", "建筑计划", "建筑构法", "建筑环境工学", "结构力学"];

// 只测试这些年份的文件
const TEST_YEARS = [2013, 2018];

// Turndown 类型定义
interface TurndownServiceInstance {
  use(plugin: any): void;
  turndown(html: string): string;
}

// 动态导入 Turndown
let TurndownServiceConstructor: any;
let turndownGfm: any;

try {
  TurndownServiceConstructor = require("turndown");
  turndownGfm = require("turndown-plugin-gfm");
} catch (e) {
  console.warn("Turndown 未安装，跳过 HTML 表格转换");
}

function normalizeApiBase(base: string): string {
  let url = base.trim().replace(/\/+$/, "");
  if (!url.endsWith("/v1")) {
    url = `${url}/v1`;
  }
  return url;
}

const API_BASE_URL = normalizeApiBase(RAW_API_BASE);

interface OpenAIResponse {
  choices: Array<{ message: { content: string } }>;
}

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
}

// 初始化 Turndown 服务（HTML -> Markdown 转换）
function createTurndownService(): TurndownServiceInstance | null {
  if (!TurndownServiceConstructor) {
    return null;
  }

  const turndownService = new TurndownServiceConstructor({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });

  if (turndownGfm && turndownGfm.gfm) {
    turndownService.use(turndownGfm.gfm);
  }

  return turndownService;
}

// 将 HTML 表格转换为 Markdown 表格
function convertHtmlTablesToMarkdown(content: string): string {
  if (!content.includes("<table") && !content.includes("<Table")) {
    return content;
  }

  console.log(`  [表格转换] 检测到 HTML 表格，进行转换...`);

  const turndownService = createTurndownService();
  if (!turndownService) {
    return content;
  }

  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  const convertedContent = content.replace(tableRegex, (tableHtml) => {
    try {
      const markdown = turndownService.turndown(tableHtml);
      console.log(`  [表格转换] 转换成功: ${markdown.substring(0, 50)}...`);
      return markdown;
    } catch (error: any) {
      console.error(`  [表格转换] 转换失败: ${error.message}`);
      return tableHtml;
    }
  });

  return convertedContent;
}

// 清洗内容（HTML 转 Markdown）
function sanitizeContent(content: string): string {
  let sanitized = content;
  sanitized = convertHtmlTablesToMarkdown(sanitized);
  return sanitized;
}

async function callOpenAI(prompt: string, systemPrompt?: string): Promise<string> {
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const endpoint = `${API_BASE_URL}/chat/completions`;
  console.log(`[DEBUG] OpenAI 格式请求: ${endpoint}`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.1,
      max_tokens: 16000,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    const statusText = response.statusText;
    let errorBody = "";
    try { errorBody = await response.text(); } catch (e) { errorBody = "(无法读取)"; }
    console.error(`[ERROR] Status: ${status} ${statusText}`);
    console.error(`[ERROR] Response:\n${errorBody}`);
    throw new Error(`OpenAI API 错误: ${status} ${statusText}`);
  }

  const data: OpenAIResponse = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(prompt: string, systemPrompt?: string): Promise<string> {
  const endpoint = `${API_BASE_URL}/messages`;
  console.log(`[DEBUG] Anthropic 格式请求: ${endpoint}`);

  const body: any = {
    model: MODEL,
    max_tokens: 16000,
    messages: [{ role: "user", content: prompt }],
  };

  if (systemPrompt) {
    body.system = systemPrompt;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const status = response.status;
    const statusText = response.statusText;
    let errorBody = "";
    try { errorBody = await response.text(); } catch (e) { errorBody = "(无法读取)"; }
    console.error(`[ERROR] Status: ${status} ${statusText}`);
    console.error(`[ERROR] Response:\n${errorBody}`);
    throw new Error(`Anthropic API 错误: ${status} ${statusText}`);
  }

  const data: AnthropicResponse = await response.json();
  return data.content[0].text;
}

async function callLLM(prompt: string, systemPrompt?: string): Promise<string> {
  if (!API_KEY) {
    throw new Error("请设置 LLM_API_KEY 环境变量");
  }

  console.log(`[DEBUG] API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`[DEBUG] Model: ${MODEL}`);
  console.log(`[DEBUG] API Format: ${API_FORMAT}`);

  if (API_FORMAT === "openai") {
    return callOpenAI(prompt, systemPrompt);
  }

  if (API_FORMAT === "anthropic") {
    return callAnthropic(prompt, systemPrompt);
  }

  console.log(`[DEBUG] 自动检测模式：先尝试 OpenAI 格式...`);
  try {
    const result = await callOpenAI(prompt, systemPrompt);
    console.log(`[DEBUG] OpenAI 格式成功`);
    return result;
  } catch (openaiError: any) {
    console.log(`[DEBUG] OpenAI 格式失败: ${openaiError.message}`);
    console.log(`[DEBUG] 尝试 Anthropic 格式...`);
    try {
      const result = await callAnthropic(prompt, systemPrompt);
      console.log(`[DEBUG] Anthropic 格式成功`);
      return result;
    } catch (anthropicError: any) {
      console.error(`[DEBUG] Anthropic 格式也失败: ${anthropicError.message}`);
      throw new Error(`两种 API 格式均失败\nOpenAI: ${openaiError.message}\nAnthropic: ${anthropicError.message}`);
    }
  }
}

function parseFileName(fileName: string): {
  year: number;
  subjectType: string;
  examType: string;
} | null {
  const match = fileName.match(/(\d{4})年度_建築(専門\d+(?:-\d+)?(?:\+\d+)?)_(.+)/);
  if (!match) return null;

  return {
    year: parseInt(match[1], 10),
    subjectType: match[2],
    examType: match[3].replace(/_\d+$/, ""),
  };
}

function validateSubject(subject: string): string {
  const normalized = subject.toLowerCase().replace(/[　\s]/g, "");
  for (const allowed of ALLOWED_SUBJECTS) {
    if (normalized.includes(allowed) || allowed.includes(normalized)) {
      return allowed;
    }
  }
  return subject;
}

function validateQuestion(
  question: {
    question_number: string;
    subject: string;
    category: string;
    tags: string[];
    content: string;
  },
  year: number
): { valid: boolean; reason?: string } {
  if (year === 2013 && question.category === "専門2-2") {
    return { valid: false, reason: "拦截：2013年不存在専門2-2，属于LLM幻觉" };
  }

  if (question.category === "専門2-2" &&
      (question.subject === "结构力学" || question.subject === "建筑环境工学")) {
    return { valid: false, reason: `拦截：専門2-2不可能出现${question.subject}，属于LLM幻觉` };
  }

  if (!ALLOWED_SUBJECTS.includes(question.subject)) {
    return { valid: false, reason: `拦截：科目"${question.subject}"不在允许列表中` };
  }

  if (question.category !== "専門1" && question.category !== "専門2-2") {
    return { valid: false, reason: `拦截：类别"${question.category}"不是専門1或専門2-2` };
  }

  if (question.tags.length === 0) {
    return { valid: false, reason: "拦截：标签为空" };
  }

  if (question.content.length < 50) {
    return { valid: false, reason: `拦截：内容太短（${question.content.length}字符）` };
  }

  return { valid: true };
}

function parseXMLResponse(response: string, fileHasExplicit2_2: boolean, year: number): Array<{
  question_number: string;
  subject: string;
  category: string;
  tags: string[];
  content: string;
}> {
  const questions: Array<{
    question_number: string;
    subject: string;
    category: string;
    tags: string[];
    content: string;
  }> = [];

  const questionRegex = /<question>([\s\S]*?)<\/question>/g;
  let match;

  while ((match = questionRegex.exec(response)) !== null) {
    const questionBlock = match[1];

    const numberMatch = questionBlock.match(/<question_number>([\s\S]*?)<\/question_number>/);
    const subjectMatch = questionBlock.match(/<subject>([\s\S]*?)<\/subject>/);
    const categoryMatch = questionBlock.match(/<category>([\s\S]*?)<\/category>/);
    const tagsMatch = questionBlock.match(/<tags>([\s\S]*?)<\/tags>/);
    const contentMatch = questionBlock.match(/<content>([\s\S]*?)<\/content>/);
    const analysisMatch = questionBlock.match(/<analysis>([\s\S]*?)<\/analysis>/);

    if (subjectMatch && contentMatch) {
      const subject = validateSubject(subjectMatch[1].trim());
      let category = categoryMatch ? categoryMatch[1].trim() : "専門1";

      if (!fileHasExplicit2_2 && category === "専門2-2") {
        console.log(`  [修正] 文件无専門2-2标识，将 ${subject} 题目修正为専門1`);
        category = "専門1";
      }

      const tagsStr = tagsMatch ? tagsMatch[1].trim() : "";
      const tags = tagsStr.split(/[,、]/).map(t => t.trim()).filter(t => t);

      const question = {
        question_number: numberMatch ? numberMatch[1].trim() : "1",
        subject,
        category,
        tags: tags.slice(0, 4),
        content: sanitizeContent(contentMatch[1].trim()),
      };

      const validation = validateQuestion(question, year);
      if (validation.valid) {
        if (analysisMatch) {
          const analysisShort = analysisMatch[1].trim().substring(0, 100).replace(/\n/g, " ");
          console.log(`  [分析] ${analysisShort}...`);
        }
        questions.push(question);
      } else {
        console.log(`  [拦截] ${validation.reason}`);
      }
    }
  }

  return questions;
}

async function analyzeAndSplitQuestions(
  content: string,
  fileName: string
): Promise<Array<{
  question_number: string;
  subject: string;
  category: string;
  tags: string[];
  content: string;
}>> {
  const parsed = parseFileName(fileName);
  if (!parsed) {
    console.error(`无法解析文件名: ${fileName}`);
    return [];
  }

  const hasExplicit2_2 =
    content.includes("専門2-2") ||
    content.includes("第2群") ||
    content.includes("計画・歴史") ||
    content.includes("計画·歴史") ||
    parsed.subjectType.includes("2-2");

  console.log(`  [检测] 文件専門2-2标识: ${hasExplicit2_2 ? "有" : "无"}`);

  const systemPrompt = `你是一个专业的建筑学考试题目分析专家。你的任务是分析日本东京大学建筑学考研的试卷Markdown文件，将每一道大题独立切分出来。

【绝对丢弃规则】
遇到以下内容，直接跳过，不要生成任何 <question> 数据：
- 包含「専門2-1」、「設計」、「第1群」的任何题目
- 包含「専門2-3」、「環境系」、「第3群」的任何题目
- 包含「専門2-4」或「第4群」的任何题目

【唯二允许提取的类别】
只有当题目属于以下两类时，才允许提取：
1. 専門1：综合基础题（涵盖环境、力学、计划、构法、历史）
2. 専門2-2：高级专门题（如果试卷上写的是「第2群（計画・歴史）」，也统一归类为 専門2-2）

【关于専門2-2的严格判断规则 - 极其重要】
- 只有试卷中明确出现「専門2-2」或「第2群（計画・歴史）」或「第2群」字样时，才能将题目归类为 専門2-2
- 如果试卷中没有任何关于「専門2-2」或「第2群」的明确标识，则所有题目必须归类为 専門1
- 绝对禁止根据题目内容推测其属于専門2-2
- 宁可漏提，也绝对不能将専門1的题目错误地标记为 専門2-2
- 2013年、2014年、2015年、2016年的合并版试卷中，如果没有明确的「第2群」标识，则所有题目都属于専門1

【严格限制的科目】
<subject> 字段只能从以下 5 个中选择，绝对禁止自己捏造：
- 建筑史
- 建筑计划
- 建筑构法
- 建筑环境工学
- 结构力学

（注：専門2-2 的题目，其 subject 通常只能是建筑史、建筑计划或建筑构法）

【标签生成规则】
- 禁止使用宽泛分类作为标签
- 必须使用具体知识点，例如：
  - 环境工学：熱伝導率、残響時間、CO2濃度、照度、相当外気温、熱貫流率
  - 结构力学：オイラー座屈、曲げモーメント、断面2次モーメント、せん断力、変形
  - 建筑史：ルネサンス建築、バロック建築、モダニズム、日本家屋
  - 建筑计划：動線計画、人体寸法、ユニバーサルデザイン
  - 建筑构法：鉄筋コンクリート、耐震構造、断熱材、ALC

【输出格式 - 必须包含 <analysis> 思维链】
每道题必须先进行自我推理（<analysis>），再输出最终结果。

<question>
<question_number>1</question_number>
<analysis>
第一步：分析题目核心意图（是在计算尺寸，还是在论述历史演变？是否涉及具体的力学公式？）
第二步：对照分类启发式规则，排除干扰项。
第三步：得出最终的 category 和 subject 结论，并提取 2-4 个极度精准的底层知识点作为 tag。
</analysis>
<category>専門1</category>
<subject>建筑计划</subject>
<tags>待ち行列理論, 窓口サービス</tags>
<content>
 Markdown 正文内容...
</content>
</question>

【重要】
- 2016年及以前的文件是合并版，包含専門1和専門2的所有题目，请务必遍历全文
- 2017年以后的文件是分开的，按文件内容切分
- 必须保留题目中的所有LaTeX公式（$...$ 或 $$...$$）
- 必须保留题目中的所有图片链接（![image](/past-exams/...)）
- 必须保留题目中的所有子问题编号和格式
- 如果题目中包含HTML表格（<table>标签），请在<content>中保留原始HTML，系统会自动转换`;

  const userPrompt = `请分析以下建筑学考研试卷，严格执行「绝对丢弃规则」，只提取専門1和専門2-2的题目。

文件名: ${fileName}
年份: ${parsed.year}
考试类型: ${parsed.subjectType}

试卷内容:
${content}

请遍历全文，找出所有属于専門1和専門2-2的题目，使用 XML 格式输出。每道题必须包含 <analysis> 思维链。`;

  try {
    const response = await callLLM(userPrompt, systemPrompt);

    console.log(`[DEBUG] LLM 响应长度: ${response.length} 字符`);
    console.log(`[DEBUG] LLM 响应前 500 字符:\n${response.substring(0, 500)}\n...`);

    const questions = parseXMLResponse(response, hasExplicit2_2, parsed.year);
    console.log(`[DEBUG] 解析到 ${questions.length} 道有效题目`);

    return questions;
  } catch (error: any) {
    console.error(`LLM分析失败: ${error.message}`);
    return [];
  }
}

function generateFrontmatter(data: {
  year: number;
  subject: string;
  category: string;
  tags: string[];
  question_number: string;
}): string {
  const tagsStr = data.tags.map((t) => `  - "${t}"`).join("\n");
  return `---
year: ${data.year}
subject: "${data.subject}"
category: "${data.category}"
tags:
${tagsStr}
question_number: "${data.question_number}"
---`;
}

async function processFile(filePath: string): Promise<number> {
  const fileName = path.basename(filePath);
  console.log(`\n处理文件: ${fileName}`);

  const content = fs.readFileSync(filePath, "utf-8");
  const parsed = parseFileName(fileName);

  if (!parsed) {
    console.error(`  跳过：无法解析文件名`);
    return 0;
  }

  console.log(`  年份: ${parsed.year}, 类型: ${parsed.subjectType}`);

  const questions = await analyzeAndSplitQuestions(content, fileName);

  if (questions.length === 0) {
    console.log(`  未找到有效题目`);
    return 0;
  }

  console.log(`  找到 ${questions.length} 道有效题目`);

  let savedCount = 0;
  for (const q of questions) {
    const frontmatter = generateFrontmatter({
      year: parsed.year,
      subject: q.subject,
      category: q.category,
      tags: q.tags,
      question_number: q.question_number,
    });

    const outputContent = `${frontmatter}\n\n${q.content}`;

    const subjectSlug = q.subject.replace(/[、\s\/\\]/g, "_").replace(/[<>:"|?*]/g, "_");
    const categorySlug = q.category.replace(/[、\s\/\\]/g, "_").replace(/[<>:"|?*]/g, "_");
    const outputFileName = `${parsed.year}_${categorySlug}_${subjectSlug}_Q${q.question_number}.md`;
    const outputPath = path.join(PROCESSED_DIR, outputFileName);

    fs.writeFileSync(outputPath, outputContent, "utf-8");
    console.log(`  保存: ${outputFileName}`);
    savedCount++;
  }

  return savedCount;
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  建筑学过去问题目切分工具 v3.1 TEST");
  console.log("  只测试 2013 和 2018 年份");
  console.log("  新增 HTML 表格转 Markdown 功能");
  console.log("═══════════════════════════════════════\n");

  if (!API_KEY) {
    console.error("错误：请设置 LLM_API_KEY 环境变量");
    process.exit(1);
  }

  console.log(`[配置] 原始 API Base: ${RAW_API_BASE}`);
  console.log(`[配置] 规范化后 URL: ${API_BASE_URL}`);
  console.log(`[配置] Model: ${MODEL}`);
  console.log(`[配置] API Format: ${API_FORMAT}`);
  console.log(`[配置] 输入目录: ${RAW_MARKDOWN_DIR}`);
  console.log(`[配置] 输出目录: ${PROCESSED_DIR}`);
  console.log(`[配置] 允许科目: ${ALLOWED_SUBJECTS.join(", ")}`);
  console.log(`[配置] 测试年份: ${TEST_YEARS.join(", ")}\n`);

  // 清空输出目录
  if (fs.existsSync(PROCESSED_DIR)) {
    const existingFiles = fs.readdirSync(PROCESSED_DIR);
    for (const file of existingFiles) {
      fs.unlinkSync(path.join(PROCESSED_DIR, file));
    }
    console.log(`[清理] 已清空输出目录 (${existingFiles.length} 个旧文件)\n`);
  } else {
    fs.mkdirSync(PROCESSED_DIR, { recursive: true });
  }

  const files = fs.readdirSync(RAW_MARKDOWN_DIR).filter((f) => {
    if (!f.endsWith(".md")) return false;
    const parsed = parseFileName(f);
    return parsed && TEST_YEARS.includes(parsed.year);
  });

  if (files.length === 0) {
    console.error("未找到测试文件");
    process.exit(1);
  }

  console.log(`找到 ${files.length} 个测试文件\n`);

  let totalQuestions = 0;

  for (const file of files) {
    const filePath = path.join(RAW_MARKDOWN_DIR, file);
    const count = await processFile(filePath);
    totalQuestions += count;
  }

  console.log("\n═══════════════════════════════════════");
  console.log(`  测试完成！`);
  console.log(`  总计: ${totalQuestions} 道有效题目`);
  console.log("═══════════════════════════════════════");
}

main().catch(console.error);
