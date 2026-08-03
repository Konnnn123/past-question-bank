const fs = require("fs");
const path = require("path");

const auditPath = "audit-common-terms.md";
const reportPath = "common-term-atomic-decomposition.md";
const factPath = "data/atomic-facts.json";
const poolPath = "data/building-construction-rc-shared-wordbank-facts.json";
const answerIndexPath = "data/construction-exam-answers.json";
const sourcesRoot = "data/processed_questions";
const audit = fs.readFileSync(auditPath, "utf8");
const facts = JSON.parse(fs.readFileSync(factPath, "utf8")).facts.filter((fact) => fact.subject === "construction");
const pool = JSON.parse(fs.readFileSync(poolPath, "utf8")).facts.map((fact) => fact.term);
const answerIndex = JSON.parse(fs.readFileSync(answerIndexPath, "utf8"));
const sources = fs.readdirSync(sourcesRoot)
  .filter((file) => file.endsWith(".md") && file.includes("専門1") && file.includes("建筑构法"))
  .map((file) => ({ path: `${sourcesRoot}/${file}`, text: fs.readFileSync(path.join(sourcesRoot, file), "utf8") }));

const originals = [...audit.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*`definition_not_atomic`/gm)]
  .map((match) => ({ number: Number(match[1]), term: match[2].trim() }));
if (originals.length !== 35) throw new Error(`Expected 35 definition_not_atomic candidates; found ${originals.length}.`);

// Only terms whose wording is explicitly present in a local S1 source or answer record are listed.
// A missing entry means that no source-supported atomic split is asserted.
const splits = new Map([
  [16, ["主筋", "あばら筋", "かぶり厚さ"]],
  [18, ["ウェブ"]],
  [26, ["マリオン"]],
  [28, ["マリオン"]],
  [39, ["豆板"]],
  [55, ["スランプ"]],
  [64, ["ガスケット"]],
  [65, ["巾木", "まわり縁"]],
  [66, ["透湿防水"]],
  [72, ["サウンディング", "フーチング", "山留"]],
  [77, ["セパレーター", "フォームタイ"]],
  [84, ["継ぎ手"]],
  [93, ["巾木", "まわり縁"]],
  [97, ["フレミッシュ"]],
  [98, ["エクスパンションジョイント"]],
  [102, ["サウンディング", "山留"]],
  [110, ["フーチング", "ハンチ"]],
  [111, ["棟木", "母屋", "垂木", "野地板"]],
  [127, ["本瓦葺き", "桟瓦葺き"]],
]);

const noSplitReason = new Map([
  [2, "仓库内没有 Specialist 1 原题或答案项把“Pcaの方式”拆成具体、可唯一作答的术语。"],
  [4, "本地可用的 PCa／PC 详细说明属于 Specialist 2-2；当前范围不能把它当作 Specialist 1 来源。"],
  [11, "“利点”是评价集合；本地 Specialist 1 资料未给出能独立归属给 PCa 的单一答案项。"],
  [12, "“特徴”是多属性主题；现有来源没有将其拆成可唯一作答且属于当前 RC 题域的术语。"],
  [13, "“構造原理と寿命”合并了原理与耐久性；本地资料未给出对应的单一答案槽。"],
  [14, "“施工手順”是顺序性过程；当前来源未提供可脱离步骤上下文的 RC 术语答案。"],
  [15, "“分類”是上位组织标签，不是原题中可定位的独立答案。"],
  [27, "“ファスナー例”未在 Specialist 1 原题中定位到可证明为 curtain-wall fastener 的单一答案。"],
  [29, "“支持方式”是关系主题；现有原题只支持部件名，不能推断具体支持方式。"],
  [30, "“用いる目的”是解释性命题，不是可作为词库答案的单项术语。"],
  [31, "“構成方式”需要多部件关系；当前资料没有可拆出的唯一答案项。"],
  [43, "“シェル・トラス・膜構造”将不同体系合并；本地 Specialist 1 没有逐项定义来源可安全拆分。"],
  [46, "“スケルトン・インフィルと工業化”是比较／发展主题，不能由题干出现推断出独立定义。"],
  [63, "“改修・工業化工法”是多个工法类别的上位集合，未找到可独立映射的 Specialist 1 答案。"],
  [87, "“湿式工法と乾式工法”是二分比较；现有资料未提供可进入当前 RC 词库的单一 relation。"],
  [94, "“床組・壁下地・天井下地”是三个部位集合，原题没有支持将其拆成当前 RC 模板的独立词项。"],
]);

const variants = (term) => [...new Set([term, term.replaceAll("茸", "葺"), term.replaceAll("・", "·")])];
const matchingSources = (term) => sources.flatMap((source) => {
  const token = variants(term).find((variant) => source.text.includes(variant));
  if (!token) return [];
  const at = source.text.indexOf(token);
  return [{ path: source.path, line: source.text.slice(0, at).split("\n").length, excerpt: source.text.slice(Math.max(0, at - 72), at + token.length + 132).replace(/\s+/g, " ").replaceAll("|", "\\|") }];
});
const matchingIndex = (term) => answerIndex.records.filter((record) => record.fileName.includes("専門1")).flatMap((record) => record.items.flatMap((item) => {
  const answerToken = variants(term).find((variant) => item.answer.includes(variant));
  const promptToken = variants(term).find((variant) => item.prompt.includes(variant));
  if (!answerToken && !promptToken) return [];
  return [{ itemId: item.itemId, answer: item.answer.replace(/\s+/g, " ").replaceAll("|", "\\|"), answerMatch: Boolean(answerToken) }];
}));
const atomicFor = (term) => facts.filter((fact) => fact.entityName === term || fact.value === term);
const evidence = (term) => {
  const source = matchingSources(term);
  const index = matchingIndex(term);
  const atomic = atomicFor(term);
  return {
    source: source.length ? source.map((item) => `\`${item.path}:${item.line}\` — ${item.excerpt}`).join("<br>") : "未找到 Specialist 1 原题精确术语命中。",
    index: index.length ? index.map((item) => `\`${answerIndexPath}\` → ${item.itemId}: ${item.answer}`).join("<br>") : "未找到答案索引中的术语项。",
    atomic: atomic.length ? atomic.map((item) => `\`${factPath}\` → ${item.id} (${item.relation}; sourceId: ${item.sourceId || "none"})`).join("<br>") : "未找到以该术语为实体／值的 Atomic Fact。",
    supported: source.length > 0 || index.some((item) => item.answerMatch),
  };
};
const samePool = (term) => pool.find((seed) => seed === term || seed.includes(term) || term.includes(seed));
const rcCompatible = new Set(["主筋", "あばら筋", "かぶり厚さ", "豆板", "スランプ", "セパレーター", "フォームタイ"]);
const relationFor = (term) => ({
  "主筋": "reinforcement_role", "あばら筋": "reinforcement_role", "かぶり厚さ": "cover_dimension",
  "豆板": "construction_defect", "スランプ": "fresh_concrete_property", "セパレーター": "formwork_component",
  "フォームタイ": "formwork_component", "ハンチ": "joint_reinforcement",
})[term] || "term_definition";
const domainFor = (term) => rcCompatible.has(term) ? "rc_construction" : term === "サウンディング" || term === "山留" ? "underground_work" : term === "フーチング" ? "foundation_work" : term === "フレミッシュ" ? "masonry" : term === "本瓦葺き" || term === "桟瓦葺き" ? "roofing" : term === "継ぎ手" || ["棟木", "母屋", "垂木", "野地板"].includes(term) ? "timber_roof" : term === "マリオン" || term === "ガスケット" ? "curtain_wall_glazing" : term === "透湿防水" ? "external_envelope" : term === "ウェブ" ? "steel_member" : "interior_or_other";
const definitionFor = (term) => ({
  "主筋": "RC 断面标注；可读来源未单独展开定义。", "あばら筋": "RC 断面标注；可读来源未单独展开定义。",
  "かぶり厚さ": "钢筋表面至混凝土表面的最小尺寸。", "ウェブ": "H 形钢中连接两端板件的部分。",
  "マリオン": "幕墙中使用的纵长部件（方立）。", "豆板": "混凝土浇筑时的充填不良部位。",
  "スランプ": "测量生混凝土流动性的试验指标。", "ガスケット": "固定玻璃并确保水密、气密性的部件。",
  "巾木": "墙与地板交接处的收边部件。", "まわり縁": "墙与天花交接处的收边部件。",
  "透湿防水": "木造外墙断热材室外侧所用的透湿防水层属性。", "サウンディング": "户建住宅简易地盘调查的瑞典式试验名称。",
  "フーチング": "布基础底部加宽的部分。", "山留": "支撑根切侧面的地下施工术语。",
  "セパレーター": "保持左右模板间距恒定的部件。", "フォームタイ": "从外侧紧固模板并抵抗侧压的紧结金物。",
  "継ぎ手": "沿长度方向连接两根木材的部位。", "フレミッシュ": "砖砌中长手与小口交替出现的砌法。",
  "エクスパンションジョイント": "为防止地震时局部大力而使建筑结构分离的构件。",
  "ハンチ": "柱梁接合部的三角形补强部分；原题未限定为 RC。",
  "棟木": "小屋组图示标注；可读来源未单独展开定义。", "母屋": "小屋组图示标注；可读来源未单独展开定义。",
  "垂木": "小屋组图示标注；可读来源未单独展开定义。", "野地板": "小屋组图示标注；可读来源未单独展开定义。",
  "本瓦葺き": "屋面瓦铺法；原题要求与桟瓦葺き对照说明。", "桟瓦葺き": "屋面瓦铺法；原题要求与本瓦葺き对照说明。",
})[term] || "未建立独立定义。";

const allCandidates = [];
const originalRows = originals.map((original) => {
  const output = (splits.get(original.number) || []).map((term) => {
    const found = evidence(term);
    if (!found.supported) return { term, found, disposition: "rejected", reason: "候选术语无法同时获得本地原题或答案索引支持；未把原候选的推断写成事实。" };
    const duplicate = samePool(term);
    const domain = domainFor(term);
    const compatible = domain === "rc_construction";
    const disposition = duplicate ? "duplicate" : compatible ? "promoted" : "incompatible_domain";
    const reason = duplicate ? `与 seed term「${duplicate}」重复，不能新增。` : compatible ? "满足来源、独立答案、RC 题域、relation 与同域干扰项门槛。" : `来源支持该术语，但 compatible_domain 为 ${domain}，不能放入当前 RC 躯体施工／纳まり模板。`;
    const candidate = { term, found, disposition, reason, domain, relation: relationFor(term), definition: definitionFor(term) };
    allCandidates.push(candidate);
    return candidate;
  });
  return { original, output, noSplit: noSplitReason.get(original.number) || (output.length ? null : "未找到可由本地来源明确支持的独立拆分项。") };
});

const counts = {
  generated_atomic_candidates: allCandidates.length,
  promoted: allCandidates.filter((candidate) => candidate.disposition === "promoted").length,
  rejected: originalRows.filter((row) => row.noSplit || row.output.some((candidate) => candidate.disposition === "rejected")).length,
  duplicate: allCandidates.filter((candidate) => candidate.disposition === "duplicate").length,
  incompatible_domain: allCandidates.filter((candidate) => candidate.disposition === "incompatible_domain").length,
};
const poolBefore = pool.length;
if (counts.promoted !== 0) throw new Error("Promotion requires an explicit fact payload and separate seed-pool write; no automatic promotion is allowed.");
const poolAfter = JSON.parse(fs.readFileSync(poolPath, "utf8")).facts.length;
if (poolBefore !== 27 || poolAfter !== 27) throw new Error(`Unexpected seed-pool change: ${poolBefore} -> ${poolAfter}.`);

const candidateTable = (row) => row.output.length ? row.output.map((candidate) => `
| ${candidate.term} | ${candidate.definition} | ${candidate.found.source} | ${candidate.found.index} | ${candidate.found.atomic} | ${candidate.relation} | ${candidate.domain} | ${candidate.domain === "rc_construction" ? "同一 RC 施工／纳まり relation 的未选术语；不得满足该 blank。" : "当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。"} | \`${candidate.disposition}\` — ${candidate.reason} |`).join("\n") : `
| — | — | — | — | ${row.noSplit} | — | — | — | \`rejected\` |`;
const sections = originalRows.map((row) => [
  `### ${row.original.number}. ${row.original.term}`,
  "",
  "| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  candidateTable(row),
].join("\n"));

const deferred = [
  ["山留め壁と切り梁", "underground_work", "已有 2026 Specialist 1 原题及答案索引定义；当前 RC 词库不兼容，保留为地下工事候选。"],
  ["カーテンウォール", "curtain_wall_glazing", "E 类：外墙／玻璃题域。"],
  ["シェル構造", "long_span_structure", "E 类：大跨度结构题域。"],
  ["スケルトン・インフィル", "renovation_industrialization", "E 类：改修／工業化题域。"],
  ["ダイアフラム", "steel_member", "E 类：钢构部件题域。"],
  ["高力ボルト接合", "steel_connection", "E 类：钢构连接题域。"],
  ["土台", "timber_frame", "E 类：木构题域。"],
  ["普通ボルト接合", "steel_connection", "E 类：钢构连接题域。"],
  ["方づえ", "timber_frame", "E 类：木构题域。"],
  ["洋小屋", "timber_roof", "E 类：木构屋架题域。"],
  ["和小屋", "timber_roof", "E 类：木构屋架题域。"],
];
const report = [
  "# Common-Term Atomic Decomposition",
  "",
  "Scope: only the 35 `definition_not_atomic` candidates. A split is listed only when a local Specialist 1 question or the local answer index explicitly supports its term. No inference from a broad candidate label is treated as a source fact.",
  "",
  "## Results",
  "",
  ...Object.entries(counts).map(([key, value]) => `- \`${key}\`: **${value}**`),
  `- Seed pool: **${poolBefore} before → ${poolAfter} after**`,
  "",
  "No split item passed every gate in this pass, so the seed pool was not changed. Existing RC terms supported by sources were all already present in the 27-term seed pool; all other source-supported splits belong to a different domain.",
  "Because the seed pool remains below 40 (27), candidate repair stops here. The current word-bank mechanism remains limited fact recombination, not a healthy-randomized full mock; the next expansion path is active fact extraction from past questions and authoritative teaching sources.",
  "",
  "## Per-candidate decomposition",
  "",
  ...sections,
  "",
  "## Deferred compatible-domain registry (not seed-pool facts)",
  "",
  "These retain valid evidence as future domain-specific candidates. They must not be mixed into the current RC word bank, and none enables a new generator by itself.",
  "",
  "| Term | compatible_domain | Status |",
  "| --- | --- | --- |",
  ...deferred.map(([term, domain, note]) => `| ${term} | \`${domain}\` | ${note} |`),
];
fs.writeFileSync(reportPath, `${report.join("\n")}\n`, "utf8");

const marker = "\n## Atomic decomposition — 35 definition_not_atomic candidates\n";
const auditUpdate = [
  marker.trim(),
  "",
  "Detailed source-backed decomposition results are in `common-term-atomic-decomposition.md`. Each of the 35 original candidates is retained as an audit row; only explicit source-supported terms were considered as new atomic candidates.",
  "",
  "| generated_atomic_candidates | promoted | rejected | duplicate | incompatible_domain | seed pool before → after |",
  "| ---: | ---: | ---: | ---: | ---: | --- |",
  `| ${counts.generated_atomic_candidates} | ${counts.promoted} | ${counts.rejected} | ${counts.duplicate} | ${counts.incompatible_domain} | ${poolBefore} → ${poolAfter} |`,
  "",
  "No seed-pool write occurred. The independent RC semantic-association package was not read or modified. E-class terms and 山留め壁と切り梁 are retained only in the deferred compatible-domain registry.",
];
fs.writeFileSync(auditPath, audit.split(marker)[0] + "\n" + auditUpdate.join("\n") + "\n", "utf8");
console.log(JSON.stringify({ originals: originals.length, counts, pool: `${poolBefore}->${poolAfter}` }, null, 2));
