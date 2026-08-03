export type SharedWordBankFact = { id: string; term: string; statement: string; relation: string; source: string };
export type SharedWordBankSet = { prototype: { source: string; blankCount: number; bankSize: number; surplusCount: number; reuseAllowed: boolean }; domain: string; items: Array<{ id: string; factId: string; prompt: string; answer: string; relation: string; source: string }>; wordBank: string[]; surplusTerms: string[]; validation: { sameDomain: boolean; uniqueAnswers: boolean; reuseAllowed: boolean; dynamicPromptComposition: boolean; constrainedSurplus: boolean } };

const ANSWER_COUNT = 20;
const SURPLUS_COUNT = 7;
const EXAM_BANK_SIZE = ANSWER_COUNT + SURPLUS_COUNT;

function shuffled<T>(items: T[], seed: number) { const next = [...items]; let state = seed >>> 0; for (let index = next.length - 1; index > 0; index -= 1) { state = (state * 1664525 + 1013904223) >>> 0; const target = state % (index + 1); [next[index], next[target]] = [next[target], next[index]]; } return next; }

export function generateRCSharedWordBank(facts: SharedWordBankFact[], seed = Date.now()): SharedWordBankSet {
  if (facts.length < EXAM_BANK_SIZE) throw new Error(`RC shared-word-bank requires at least ${EXAM_BANK_SIZE} unique reviewed facts; received ${facts.length}`);
  if (new Set(facts.map((fact) => fact.term)).size !== facts.length) throw new Error("RC shared-word-bank requires unique reviewed fact terms");
  if (new Set(facts.map((fact) => fact.id)).size !== facts.length) throw new Error("RC shared-word-bank requires unique reviewed fact ids");

  const answerFacts = shuffled(facts, seed).slice(0, ANSWER_COUNT);
  const answerIds = new Set(answerFacts.map((fact) => fact.id));
  const candidates = shuffled(facts.filter((fact) => !answerIds.has(fact.id)), seed + 401);
  const surplusFacts: SharedWordBankFact[] = [];
  const seenRelations = new Set<string>();
  for (const fact of candidates) if (!seenRelations.has(fact.relation) && surplusFacts.length < SURPLUS_COUNT) { surplusFacts.push(fact); seenRelations.add(fact.relation); }
  for (const fact of candidates) if (!surplusFacts.some((selected) => selected.id === fact.id) && surplusFacts.length < SURPLUS_COUNT) surplusFacts.push(fact);
  if (surplusFacts.length !== SURPLUS_COUNT) throw new Error("RC shared-word-bank could not construct seven constrained surplus terms");
  const selectedFacts = [...answerFacts, ...surplusFacts];
  return {
    prototype: { source: "2022 専門1 建築構法 Q3", blankCount: ANSWER_COUNT, bankSize: EXAM_BANK_SIZE, surplusCount: SURPLUS_COUNT, reuseAllowed: true },
    domain: "rc_construction",
    items: answerFacts.map((fact, index) => ({ id: `rcswb-${index + 1}`, factId: fact.id, prompt: `（　）とは、${fact.statement}。`, answer: fact.term, relation: fact.relation, source: fact.source })),
    wordBank: shuffled(selectedFacts.map((fact) => fact.term), seed + 101),
    surplusTerms: surplusFacts.map((fact) => fact.term),
    validation: { sameDomain: true, uniqueAnswers: new Set(answerFacts.map((fact) => fact.term)).size === ANSWER_COUNT, reuseAllowed: true, dynamicPromptComposition: true, constrainedSurplus: surplusFacts.every((fact) => !answerIds.has(fact.id)) }
  };
}
