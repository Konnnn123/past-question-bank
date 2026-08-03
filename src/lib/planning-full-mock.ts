export type PlanningObjectiveItem = {
  id: string;
  prompt: string;
  answer: string;
  sourceFile: string;
  sourceLocation: string;
  sourceType: "past_exam_reconstruction";
  options?: string[];
  correctIndex?: number;
};

export type PlanningFullMockData = {
  pastPaperGroups: Array<{ sourceFile: string; items: PlanningObjectiveItem[] }>;
};

function seededShuffle<T>(items: T[], seed: number): T[] {
  const next = [...items];
  let state = seed >>> 0;
  for (let index = next.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const target = state % (index + 1);
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
}

function normalized(value: string) {
  return value.toLowerCase().replace(/[\s、・（）()]/g, "");
}

export function assemblePlanningFullMock(data: PlanningFullMockData, seed = 1): PlanningObjectiveItem[] {
  const viableGroups = data.pastPaperGroups.filter((group) => group.items.length === 20 && new Set(group.items.map((item) => normalized(item.answer))).size === 20);
  if (!viableGroups.length) throw new Error("Planning full mock requires at least one 20-item Specialist 1 reconstruction group.");
  const group = seededShuffle(viableGroups, seed)[0];
  // A full planning practice paper preserves one indexed past-paper group.
  // It deliberately does not replace source slots with generic numeric drills.
  const items = group.items;
  const ids = new Set(items.map((item) => item.id));
  const answers = new Set(items.map((item) => normalized(item.answer)));
  if (ids.size !== items.length) throw new Error("Planning full mock has duplicate item identifiers.");
  if (answers.size !== items.length) throw new Error("Planning full mock has duplicate answer facts in one paper.");
  return items;
}
