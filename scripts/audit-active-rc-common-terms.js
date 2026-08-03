const fs = require("fs");

const candidatePath = "common-term-active-candidates.json";
const seedPath = "data/building-construction-rc-shared-wordbank-facts.json";
const reportPath = "common-term-active-audit.md";
const auditPath = "audit-common-terms.md";
const highIds = new Set(["rc-active-001", "rc-active-002", "rc-active-003", "rc-active-008", "rc-active-009", "rc-active-011"]);
const mediumReasons = {
  "rc-active-004": "学习卡明确说明型枠承受侧压，但当前 pool 没有三个同粒度『荷重／作用』候选可稳定构成 surplus。",
  "rc-active-005": "学习卡明确支持打込み，但施工阶段词群的第三个同粒度干扰项尚未独立审核。",
  "rc-active-006": "学习卡明确支持締固め，但施工阶段词群的第三个同粒度干扰项尚未独立审核。",
  "rc-active-007": "学习卡明确支持養生，但施工阶段词群的第三个同粒度干扰项尚未独立审核。",
  "rc-active-010": "学习卡明确支持钢筋—混凝土的付着关系；但与定着長さ、重ね継手等现有关系的唯一性边界需要人工确认。",
};
const data = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
const pool = JSON.parse(fs.readFileSync(seedPath, "utf8")).facts;
if (pool.length !== 33) throw new Error(`Expected post-promotion seed count 33, found ${pool.length}.`);
const promotedTerms = new Set(["型枠", "支保工", "パイプサポート", "中性化", "鉄筋腐食", "乾燥収縮"]);
const now = data.candidates.map((candidate) => {
  const high = highIds.has(candidate.candidate_id);
  if (high && !promotedTerms.has(candidate.term)) throw new Error(`Unexpected high candidate ${candidate.term}`);
  const correctedExam = ["rc-active-008", "rc-active-009", "rc-active-010"].includes(candidate.candidate_id)
    ? "2013専門1Q2・2020専門1Q3"
    : candidate.related_past_exam;
  return {
    ...candidate,
    related_past_exam: correctedExam,
    confidence: high ? "high" : "medium",
    status: high ? "promoted" : "manual_judgment_required",
    audit_reason: high
      ? "学习卡直接定义该术语及其 relation；关联 Specialist 1 考点簇明确；不与原 27 条 seed 重复；当前 RC 题域与所列同域干扰项边界均成立。"
      : mediumReasons[candidate.candidate_id],
  };
});
const counts = {
  promoted: now.filter((candidate) => candidate.status === "promoted").length,
  manual_judgment_required: now.filter((candidate) => candidate.status === "manual_judgment_required").length,
  rejected: 0,
  duplicate: 0,
  incompatible_domain: 0,
  seed_pool_before: 27,
  seed_pool_after: pool.length,
};
if (counts.promoted !== 6 || counts.manual_judgment_required !== 5 || counts.seed_pool_after !== 33) throw new Error("Audit reconciliation failed.");
data.seedPoolModified = true;
data.audit = { scope: "11 active RC candidates only", ...counts };
data.candidates = now;
fs.writeFileSync(candidatePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

const rows = now.map((candidate) => {
  const poolCheck = candidate.status === "promoted"
    ? "原 27 条中无重复；本轮已作为新增 rcswb-28～33 写入。"
    : "原 27 条中无重复或同义项。";
  const relation = candidate.status === "promoted"
    ? "学习卡直接陈述定义与 relation；当前 RC 题域成立。"
    : "学习卡支持核心 relation；见人工判断缺口。";
  const distractor = candidate.status === "promoted"
    ? candidate.distractor_constraints
    : `需人工确认：${candidate.audit_reason}`;
  return `| ${candidate.candidate_id} | ${candidate.term} | \`${candidate.confidence}\` | ${candidate.independent_definition} | ${relation} | ${distractor} | ${poolCheck} | \`${candidate.status}\` |`;
});
const lines = [
  "# Active RC Common-Term Audit",
  "",
  "Scope: only the 11 records in `common-term-active-candidates.json`. Learning cards are accepted as this project's internal authoritative-textbook evidence layer; no URL or page-number requirement was applied.",
  "",
  "## Summary",
  "",
  ...Object.entries(counts).map(([key, value]) => `- \`${key}\`: **${value}**`),
  "",
  "## Item audit",
  "",
  "| Candidate | Term | Evidence | Definition / unique answer | Relation & domain | Distractor check | Duplicate check | Result |",
  "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ...rows,
  "",
  "High candidates were promoted only where the learning card directly supports both definition and relation, the S1 cluster is explicit, and a stable same-domain distractor boundary exists. Medium candidates remain outside the seed pool.",
];
fs.writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");

const marker = "\n## Active RC candidate audit — 11 candidates\n";
const auditSummary = [
  marker.trim(),
  "",
  "The active-extraction audit is recorded in `common-term-active-audit.md`; only the 11 active RC candidates were evaluated. No old 132-candidate item was reopened.",
  "",
  "| promoted | manual_judgment_required | rejected | duplicate | incompatible_domain | seed_pool_before | seed_pool_after |",
  "| ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  `| ${counts.promoted} | ${counts.manual_judgment_required} | ${counts.rejected} | ${counts.duplicate} | ${counts.incompatible_domain} | ${counts.seed_pool_before} | ${counts.seed_pool_after} |`,
];
const existingAudit = fs.readFileSync(auditPath, "utf8");
fs.writeFileSync(auditPath, existingAudit.split(marker)[0] + "\n" + auditSummary.join("\n") + "\n", "utf8");
console.log(JSON.stringify(counts, null, 2));
