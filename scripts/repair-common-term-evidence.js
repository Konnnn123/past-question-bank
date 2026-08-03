const fs = require("fs");
const path = require("path");

const auditPath = "audit-common-terms.md";
const resultPath = "common-term-repair-result.md";
const factPath = "data/atomic-facts.json";
const answerIndexPath = "data/construction-exam-answers.json";
const poolPath = "data/building-construction-rc-shared-wordbank-facts.json";
const sourceRoot = "data/processed_questions";

const audit = fs.readFileSync(auditPath, "utf8");
const facts = JSON.parse(fs.readFileSync(factPath, "utf8")).facts.filter((fact) => fact.subject === "construction");
const answerIndex = JSON.parse(fs.readFileSync(answerIndexPath, "utf8"));
const pool = JSON.parse(fs.readFileSync(poolPath, "utf8")).facts.map((fact) => fact.term);
const sources = fs.readdirSync(sourceRoot)
  .filter((name) => name.endsWith(".md") && name.includes("専門1") && name.includes("建筑构法"))
  .map((name) => ({ path: `${sourceRoot}/${name}`, text: fs.readFileSync(path.join(sourceRoot, name), "utf8") }));

const categories = new Set(["source_link_missing", "answer_index_missing", "recoverable_with_existing_sources"]);
const targets = [...audit.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|/gm)]
  .map((match) => ({ number: Number(match[1]), term: match[2].trim(), priorCategory: match[3] }))
  .filter((row) => categories.has(row.priorCategory));
if (targets.length !== 39) throw new Error(`Expected 39 repair targets, found ${targets.length}.`);

const variants = (term) => [...new Set([
  term,
  term.replaceAll("ポル卜", "ボルト"),
  term.replaceAll("茸", "葺"),
  term.replaceAll("·", "・"),
  term.replaceAll("調查", "調査"),
])];
const findInText = (text, term) => variants(term).find((variant) => text.includes(variant));
const sourceMatches = (term) => sources.flatMap((source) => {
  const matched = findInText(source.text, term);
  if (!matched) return [];
  const offset = source.text.indexOf(matched);
  const line = source.text.slice(0, offset).split("\n").length;
  const excerpt = source.text.slice(Math.max(0, offset - 80), offset + matched.length + 160).replace(/\s+/g, " ").replaceAll("|", "\\|");
  return [{ path: source.path, line, matched, excerpt }];
});
const indexMatches = (term) => answerIndex.records.flatMap((record) => record.items.flatMap((item) => {
  const promptMatch = findInText(item.prompt, term);
  const answerMatch = findInText(item.answer, term);
  if (!promptMatch && !answerMatch) return [];
  return [{
    file: `data/processed_questions/${record.fileName}`,
    itemId: item.itemId,
    prompt: item.prompt.replace(/\s+/g, " ").replaceAll("|", "\\|"),
    answer: item.answer.replace(/\s+/g, " ").replaceAll("|", "\\|"),
    answerMatch: Boolean(answerMatch),
  }];
}));
const atomicMatches = (term) => facts.filter((fact) => variants(term).includes(fact.entityName) || variants(term).includes(fact.value));
const flat = (parts) => parts.length ? parts.join("<br>") : "未找到";
const poolOverlap = (term) => pool.find((seed) => seed === term || seed.includes(term) || term.includes(seed));
const sourceLocation = (matches) => flat(matches.map((match) => `\`${match.path}:${match.line}\`（命中：${match.matched}）`));
const atomicLocation = (matches) => flat(matches.map((fact) => `\`${factPath}\` → ${fact.id} (${fact.relation}; sourceId: ${fact.sourceId || "none"})`));

const multiOrTopic = /・|と|の基本|の構法|構造の例|工事$|手順|性質|各部|方法|方式|構造$/;
const currentDomainIncompatible = /イギリス積み|フランス積み|ガラス|シェル|トラス|スペースフレーム|プラットフォーム|屋根|瓦|小屋|木造|木質|住宅ストック|張弦梁|鉄骨|膜構造|溶接|陸梁|合掌|真束|扠首|山留め|切り梁/;

const resultFor = (target) => {
  const source = sourceMatches(target.term);
  const index = indexMatches(target.term);
  const atomic = atomicMatches(target.term);
  const appearanceYears = [...new Set(atomic.filter((fact) => fact.relation === "appears_in_exam").map((fact) => String(fact.value)))];
  const yearLinkedSources = sources.filter((source) => appearanceYears.some((year) => path.basename(source.path).startsWith(`${year}_`)));
  const indexedAnswer = index.length
    ? flat(index.map((match) => `\`${answerIndexPath}\` → ${match.itemId}: ${match.answer}`))
    : "未找到该术语的答案项；仅能确认题干／Atomic Fact 出现时，不把它当作独立答案。";
  const originalQuestion = source.length
    ? flat(source.map((match) => `\`${match.path}:${match.line}\`: ${match.excerpt}`))
    : yearLinkedSources.length
      ? `Atomic Fact 的 appears_in_exam 年份为 ${appearanceYears.join("、")}；已逐一检索 ${yearLinkedSources.map((item) => `\`${item.path}\``).join("、")}，未找到该候选的精确或规范化术语。`
      : "未在 `data/processed_questions/*専門1*建筑构法*.md` 找到可由 Atomic Fact 年份定位的原题文件。";
  const indexedAsAnswer = index.filter((match) => match.answerMatch);
  // The 2026 index defines the two terms separately, rather than repeating this
  // combined candidate label verbatim; it remains a traceable definition.
  const hasDefinition = target.term === "山留め壁と切り梁"
    ? index.some((match) => match.answer.includes("山留め壁") && match.answer.includes("切り梁"))
    : indexedAsAnswer.some((match) => match.answer.length > target.term.length + 12);
  const duplicate = poolOverlap(target.term);
  let status;
  let independentDefinition;
  let relationCompatibility;
  let distractorCompatibility;
  let failure;
  if (!source.length || (!indexedAsAnswer.length && !hasDefinition)) {
    status = "unresolved";
    independentDefinition = hasDefinition ? "答案文本存在定义性说明，但缺少对应 Specialist 1 原题定位。" : "未能同时建立原题与独立答案的可追溯链。";
    relationCompatibility = "未验证：来源链未闭合，不能推导稳定 slot relation。";
    distractorCompatibility = "未验证：没有可核对的唯一答案与同域干扰项边界。";
    failure = !source.length && !index.length
      ? "门槛 1 失败：现有 Specialist 1 原题和答案索引均不能定位该候选。"
      : !source.length
        ? "门槛 1 失败：答案索引有痕迹，但没有可追溯的 Specialist 1 原题位置。"
        : "门槛 1/2 失败：原题可定位，但答案索引不能证明该术语是独立答案。";
  } else if (!hasDefinition) {
    status = "repaired_but_rejected";
    independentDefinition = "来源链已补齐，但答案项没有给出可脱离上下文的定义；不能写成唯一 blank。";
    relationCompatibility = "不能确认：答案形态未构成 term-definition relation。";
    distractorCompatibility = "不能确认：无唯一答案，不能安全构造 surplus。";
    failure = "门槛 2 失败：虽已定位原题和索引，但未形成独立定义／独立答案。";
  } else if (currentDomainIncompatible.test(target.term) || multiOrTopic.test(target.term)) {
    status = "repaired_but_rejected";
    independentDefinition = "答案索引可提供定义性文本或术语对应，但候选本身是跨域组合／非 RC 躯体施工关系。";
    relationCompatibility = "失败：当前共通语群原型限定 RC 躯体施工与纳まり，该候选不能稳定落入其 relation slot。";
    distractorCompatibility = "失败：与 RC seed pool 混用会产生跨题域、可一眼排除的 surplus。";
    failure = "门槛 3/4 失败：与当前模板的单一题域和 relation／distractor 规则不兼容。";
  } else if (duplicate) {
    status = "duplicate";
    independentDefinition = "来源和定义门槛均可复核。";
    relationCompatibility = "可映射，但不允许重复占用现有 seed term。";
    distractorCompatibility = "可评估，但不构成新增池容量。";
    failure = `门槛 5 失败：与现有 27 条 seed pool 的「${duplicate}」重复或包含关系重叠。`;
  } else {
    status = "repaired_and_promoted";
    independentDefinition = "来源、索引和定义均已闭合，可作为独立答案。";
    relationCompatibility = "通过：可稳定映射至当前 RC 施工／纳まり relation。";
    distractorCompatibility = "通过：可从同一 RC 题域中建立非答案 surplus。";
    failure = "无。";
  }
  return {
    ...target, status,
    sourceFile: source.length ? sourceLocation(source) : yearLinkedSources.length
      ? `Atomic Fact 年份链：${yearLinkedSources.map((item) => `\`${item.path}\``).join("<br>")}（候选术语未命中）`
      : "未找到可定位的 Specialist 1 原题文件。",
    sourceLocation: originalQuestion,
    atomic: atomicLocation(atomic), originalQuestion, indexedAnswer, independentDefinition,
    relationCompatibility, distractorCompatibility, duplicateCheck: duplicate ? `重复：${duplicate}` : "与 27 条 seed term 无精确或包含关系重复。", failure,
  };
};

const results = targets.map(resultFor);
const counts = Object.fromEntries(["repaired_and_promoted", "repaired_but_rejected", "unresolved", "duplicate"].map((status) => [status, results.filter((result) => result.status === status).length]));
const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
if (total !== 39) throw new Error(`Result total ${total} does not equal 39.`);
if (counts.repaired_and_promoted !== 0) throw new Error("Promotion requires explicit human approval; no automatic seed-pool write is permitted.");
const beforePool = pool.length;
const afterPool = JSON.parse(fs.readFileSync(poolPath, "utf8")).facts.length;
if (beforePool !== 27 || afterPool !== 27) throw new Error(`Seed pool changed unexpectedly: ${beforePool} -> ${afterPool}.`);

const table = [
  "| # | Candidate | Prior gap | source_file | Atomic Fact | source_location / original_question | indexed_answer | independent_definition | relation_compatibility | distractor_compatibility | duplicate_check | Result / failed gate |",
  "| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...results.map((result) => `| ${result.number} | ${result.term.replaceAll("|", "\\|")} | \`${result.priorCategory}\` | ${result.sourceFile} | ${result.atomic} | ${result.originalQuestion} | ${result.indexedAnswer} | ${result.independentDefinition} | ${result.relationCompatibility} | ${result.distractorCompatibility} | ${result.duplicateCheck} | \`${result.status}\` — ${result.failure} |`),
];
const resultLines = [
  "# Common-Term Evidence Repair Result",
  "",
  "Scope: repair only the 39 rows previously labelled A `source_link_missing` (37), B `answer_index_missing` (1), and F `recoverable_with_existing_sources` (1). C/D/E candidates, the independent RC semantic-association pack, and the 27-fact seed pool were not altered.",
  "",
  "## Gate results",
  "",
  ...Object.entries(counts).map(([status, count]) => `- \`${status}\`: **${count}**`),
  `- Total: **${total} / 39**`,
  `- Seed pool: **${beforePool} before → ${afterPool} after**`,
  "",
  "No candidate met every source, definition, current-template, distractor, and duplicate gate at once; therefore no seed-pool write was permitted in this repair pass.",
  "",
  "## Item-by-item repair record",
  "",
  ...table,
];
fs.writeFileSync(resultPath, `${resultLines.join("\n")}\n`, "utf8");

const marker = "\n## Evidence repair — 39 A/B/F candidates\n";
const repairAudit = [
  marker.trim(),
  "",
  "Repair record is maintained in `common-term-repair-result.md`. It records source file, source location, original question, indexed answer, independent-definition test, relation/distractor compatibility, duplicate check, and failed gate for all 39 in-scope candidates.",
  "",
  "| Result | Count | Seed pool before → after |",
  "| --- | ---: | --- |",
  ...Object.entries(counts).map(([status, count]) => `| \`${status}\` | ${count} | 27 → 27 |`),
  `| **Total** | **${total}** | **27 → 27** |`,
  "",
  "All entries above cite concrete local paths when a hit exists; otherwise they record the exact Specialist 1 source glob and answer-index lookup that produced no match. No seed fact was added and the RC semantic-association pack remains untouched.",
];
fs.writeFileSync(auditPath, audit.split(marker)[0] + "\n" + repairAudit.join("\n") + "\n", "utf8");
console.log(JSON.stringify({ total, counts, seedPool: `${beforePool}->${afterPool}` }, null, 2));
