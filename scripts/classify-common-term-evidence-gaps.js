const fs = require("fs");
const path = require("path");

const auditPath = "audit-common-terms.md";
const summaryPath = "common-term-evidence-gap-summary.md";
const sourceRoot = "data/processed_questions";
const atomic = JSON.parse(fs.readFileSync("data/atomic-facts.json", "utf8")).facts
  .filter((fact) => fact.subject === "construction");
const answerIndexPath = "data/construction-exam-answers.json";
const answerIndexRaw = fs.readFileSync(answerIndexPath, "utf8");
const specialistSources = fs.readdirSync(sourceRoot)
  .filter((name) => name.endsWith(".md") && name.includes("専門1") && name.includes("建筑构法"))
  .map((name) => ({ path: `${sourceRoot}/${name}`, text: fs.readFileSync(path.join(sourceRoot, name), "utf8") }));

const initialHeld = [
  { number: 2, term: "Pcaの方式" },
  { number: 4, term: "PCaとPCの違い" },
  { number: 5, term: "コールドジョイント" },
  { number: 7, term: "タイル張り" },
  { number: 9, term: "プレキャストコンクリート組立床構造" },
];

const rawAudit = fs.readFileSync(auditPath, "utf8");
const batchRows = [...rawAudit.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|.*?\|\s*hold[^|]*\|$/gm)]
  .map((match) => ({ number: Number(match[1]), term: match[2].trim() }))
  .filter((row) => row.number >= 11);
const candidates = [...initialHeld, ...batchRows]
  .filter((row, index, rows) => rows.findIndex((other) => other.number === row.number) === index)
  .sort((a, b) => a.number - b.number);

if (candidates.length !== 111) {
  throw new Error(`Expected 111 held candidates, found ${candidates.length}.`);
}

const factsFor = (term) => atomic.filter((fact) => fact.entityName === term);
const sourceHitsFor = (term) => specialistSources.filter((source) => source.text.includes(term));
const snippet = (text, term) => {
  const at = text.indexOf(term);
  if (at < 0) return "";
  return text.slice(Math.max(0, at - 52), at + term.length + 92).replace(/\s+/g, " ").replaceAll("|", "\\|");
};

// These are broad subjects, comparisons, multi-part prompts, or process bundles.
const nonAtomicPattern = /基本|特徴|利点|分類|原理|寿命|手順|構成|目的|方式|例$|要点|施工不良|施工・|工業化|各部|違い|と打設|と乾式|と工業化|と外壁|・防水|・地盤|・天井|・壁下地|・屋根|・タイル|・瓦|・制震|・柱・横架材|・母屋/;
// A name alone does not establish the fact/relation a blank should ask for.
const bareTermPattern = /^(H形鋼|OSB（配向性ストランドボード）|S造鋼材断面の基本|コンクリート杭|角形鋼管|乾燥材|型枠|瓦茸|筋かい|デッキプレート|折板屋根|布基礎|壁式RC造|木質系構造材料|土台|本瓦茸|和小屋|洋小屋|シェル構造|集成材|まぐさ|ほぞ|カーテンウォール|タイル張り|通気構法|高力ボルト接合|普通ボルト接合|平板載荷試験|免震レトロフィット|ウェルポイント|サンドドレーン|ダイアフラム|プレボーリング工法|逆打ち工法|根切り|山留め工法|地盤調査|地盤改良工法)$/;
// The present shared word-bank prototype is explicitly RC-construction only.
const incompatiblePattern = /イギリス積み|フランス積み|カーテンウォール|ガラス|シェル|スケルトン|ダイアフラム|プラットフォーム|屋根|瓦|小屋|木造|木質|土台|方づえ|洋小屋|和小屋|扠首|膜構造|鉄骨|S造|高力ボルト|普通ボルト|溶接|張弦梁/;

const classify = (candidate) => {
  const facts = factsFor(candidate.term);
  const years = [...new Set(facts.filter((fact) => fact.relation === "appears_in_exam").map((fact) => fact.value))];
  const sourceHits = sourceHitsFor(candidate.term);
  const indexHit = answerIndexRaw.includes(candidate.term);
  const locator = sourceHits.length
    ? sourceHits.map((source) => `\`${source.path}\` — 「${snippet(source.text, candidate.term)}」`).join("<br>")
    : `未找到：\`${sourceRoot}/*専門1*建筑构法*.md\`；\`${answerIndexPath}\` 的该术语精确检索结果为 ${indexHit ? "仅原始字串出现，未建立可用题号映射" : "无命中"}。`;

  let category;
  let reason;
  if (nonAtomicPattern.test(candidate.term)) {
    category = "definition_not_atomic";
    reason = `“${candidate.term}”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 ${years.join("、") || "记录"}，仍需拆分为独立事实。`;
  } else if (incompatiblePattern.test(candidate.term) && (sourceHits.length || indexHit)) {
    category = "template_relation_incompatible";
    reason = `现有原型限定 RC 躯体施工／纳まり；“${candidate.term}”的可定位证据属于木构、钢构、屋面、外墙或空间结构关系，不能与 RC seed pool 稳定构成同域 surplus。`;
  } else if (bareTermPattern.test(candidate.term)) {
    category = "term_not_answerable";
    reason = `“${candidate.term}”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。`;
  } else if (sourceHits.length && indexHit) {
    category = "recoverable_with_existing_sources";
    reason = `原题文字和本仓库答案索引均有可检索痕迹；下一步只需将该题干的限定条件、答案项和 Atomic Fact 的年份记录整理为一个独立定义卡，不需新增外部资料。`;
  } else if (sourceHits.length) {
    category = "answer_index_missing";
    reason = `原题中可定位到“${candidate.term}”，但现有答案索引不能以该术语证明它是独立答案；需先补题号—答案项映射，不能直接用题干出现作为答案证据。`;
  } else if (facts.some((fact) => fact.sourceId || fact.evidenceText)) {
    category = "source_link_missing";
    reason = `Atomic Fact 留有 ${facts.find((fact) => fact.sourceId)?.sourceId ? `sourceId ${facts.find((fact) => fact.sourceId).sourceId}` : "evidenceText"} 和出现年份 ${years.join("、") || "记录"}，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。`;
  } else {
    category = "requires_new_source";
    reason = `仓库内既没有 Specialist 1 原题命中，也没有可追溯的 Atomic Fact 证据；补齐独立定义必须引入新的可信资料。`;
  }
  return { ...candidate, category, reason, locator, years: years.join("、") || "未记录" };
};

const results = candidates.map(classify);
const totals = Object.fromEntries(["source_link_missing", "answer_index_missing", "definition_not_atomic", "term_not_answerable", "template_relation_incompatible", "recoverable_with_existing_sources", "requires_new_source"].map((category) => [category, results.filter((result) => result.category === category).length]));
const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
if (total !== 111) throw new Error(`Category total is ${total}, expected 111.`);

const auditMarker = "\n## Evidence-gap classification — 111 held candidates\n";
const auditLines = [
  auditMarker.trim(),
  "",
  "范围：仅对前一轮标记为“待补独立定义证据”的 111 条候选做缺口分类；不重审、不晋升，也不修改 27 条 seed pool。每项只归入一个缺口类别。`source link` 检索范围为本仓库 `data/processed_questions/*専門1*建筑构法*.md`、`data/construction-exam-answers.json` 和对应 Atomic Facts。",
  "",
  "| # | Candidate | gap_category | Actual repository evidence / search result | Reason |",
  "| ---: | --- | --- | --- | --- |",
  ...results.map((result) => `| ${result.number} | ${result.term.replaceAll("|", "\\|")} | \`${result.category}\` | ${result.locator} | ${result.reason} |`),
  "",
  "### Reconciliation",
  "",
  ...Object.entries(totals).map(([category, count]) => `- \`${category}\`: **${count}**`),
  `- **Total: ${total} / 111**`,
  "",
  "No seed-pool fact was changed. No RC semantic-association fact was merged.",
];
fs.writeFileSync(auditPath, rawAudit.split(auditMarker)[0] + "\n" + auditLines.join("\n") + "\n", "utf8");

const recoverable = results.filter((result) => result.category === "recoverable_with_existing_sources");
const summaryLines = [
  "# Common-Term Evidence-Gap Summary",
  "",
  "Scope: classification of the 111 candidates that remain pending independent-definition evidence in `audit-common-terms.md`. This is an evidence-gap audit only: it does not promote terms or alter the 27-fact seed pool.",
  "",
  "## Counts",
  "",
  "| gap_category | Count |",
  "| --- | ---: |",
  ...Object.entries(totals).map(([category, count]) => `| \`${category}\` | ${count} |`),
  `| **Total** | **${total}** |`,
  "",
  "## F — recoverable_with_existing_sources (priority queue)",
  "",
  "Each row names the exact existing source files that must be read together with its Atomic Fact occurrence record. These are candidates for a later, separate evidence-normalization pass; they are not approved facts.",
  "",
  "| # | Candidate | Existing files to read | Why recoverable |",
  "| ---: | --- | --- | --- |",
  ...(recoverable.length ? recoverable.map((result) => `| ${result.number} | ${result.term.replaceAll("|", "\\|")} | ${result.locator} | ${result.reason} |`) : ["| — | None | — | No candidate met the existing-source recovery condition. |"]),
  "",
  "## Interpretation",
  "",
  "F is deliberately limited to candidates with both a Specialist 1 source hit and a matching answer-index string. The other categories must not be treated as implicit promotion queues. In particular, a bare term or a multi-part topic is not repaired merely by finding another occurrence.",
];
fs.writeFileSync(summaryPath, `${summaryLines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ candidates: results.length, totals, recoverable: recoverable.length }, null, 2));
