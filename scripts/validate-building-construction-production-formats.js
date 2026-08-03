const fs = require("fs");

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const shared = read("data/building-construction-shared-wordbank-generated-v1.json");
const source = read("data/building-construction-production-formats-v1.json");
const { families } = source;
const required = ["scoped_term_short_answer", "inline_four_choice_fill", "diagram_label_word_bank", "image_form_matching", "diagram_constrained_explanation", "diagram_comparison_explanation"];

if (source.scope.subject !== "building_construction" || !source.scope.excluded.includes("structural_mechanics")) throw new Error("subject boundary missing");
if (/buckling|structural_mechanics|second_moment/i.test(JSON.stringify({ shared, families }))) throw new Error("structural mechanics leakage");
if (shared.items.length !== 20 || shared.wordBank.length !== 27 || shared.prototype.blankCount !== 20 || shared.prototype.surplusCount !== 7) throw new Error("shared-bank prototype regression");
if (!shared.items.every((item) => shared.wordBank.includes(item.answer) && item.domain && item.prompt)) throw new Error("shared-bank fact or distractor failure");
if (new Set(shared.items.map((item) => item.answer)).size !== 20) throw new Error("shared-bank answer duplication");
for (const id of required) if (!families[id] || !families[id].status.startsWith("production_ready")) throw new Error(`release failure: ${id}`);
if (families.scoped_term_short_answer.items.length !== 20 || !families.scoped_term_short_answer.items.every((item) => item.accepted.includes(item.answer))) throw new Error("short answer rubric failure");
if (families.inline_four_choice_fill.items.length !== 20 || !families.inline_four_choice_fill.items.every((item) => item.choices.length === 4 && item.choices.includes(item.answer))) throw new Error("inline choice pool failure");
if (families.diagram_label_word_bank.items.length !== 7 || families.diagram_label_word_bank.wordBank.length !== 7 || !families.diagram_label_word_bank.asset.path.startsWith("/past-exams/")) throw new Error("diagram label asset failure");
if (families.image_form_matching.items.length !== 10 || !families.image_form_matching.items.every((item) => families.image_form_matching.wordBank.includes(item.answer))) throw new Error("image-form relation failure");
for (const id of ["diagram_constrained_explanation", "diagram_comparison_explanation"]) if (families[id].reviewMode !== "human" || !families[id].items.every((item) => item.rubric.length >= 2)) throw new Error(`human rubric failure: ${id}`);

console.log(JSON.stringify({ decision: "production_ready", formatFamilies: 7, generatedBlankItems: 67, writtenResponseTasks: 10, scope: source.scope, gates: { prototype: "pass", facts: "pass", distractors: "pass", assets: "pass", rubrics: "pass", subjectBoundary: "pass" } }, null, 2));
