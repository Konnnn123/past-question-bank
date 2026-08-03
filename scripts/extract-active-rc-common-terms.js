const fs = require("fs");

const cardsPath = "data/anki-import/construction/anki-notes.json";
const seedPath = "data/building-construction-rc-shared-wordbank-facts.json";
const candidatePath = "common-term-active-candidates.json";
const clusterPath = "common-term-past-exam-clusters.md";
const reportPath = "common-term-active-extraction.md";

const cards = JSON.parse(fs.readFileSync(cardsPath, "utf8")).records;
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8")).facts.map((fact) => fact.term);
const cardById = new Map(cards.map((card) => [card.source.noteId, card]));
const card = (id, expectedName) => {
  const record = cardById.get(id);
  if (!record || record.name !== expectedName) throw new Error(`Missing expected textbook card ${id}: ${expectedName}`);
  return record;
};
const htmlText = (value) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const source = (id, name) => {
  const record = card(id, name);
  return {
    source_file: cardsPath,
    source_location: `records[source.noteId=${id}; deck=${record.source.deck}; name=${name}]`,
    source_excerpt_or_paraphrase: htmlText(record.fields.backHtml),
    textbook_trace: record.fields.sourceUrl,
  };
};
const sourceRecord = {
  formwork: source("1783752565170", "型枠"),
  support: source("1783752565186", "型枠・型枠支保工の構成"),
  fresh: source("1783752565176", "フレッシュコンクリートと打設"),
  durability: source("1783752565152", "RC造の構造原理と寿命"),
  concrete: source("1783752565150", "コンクリートの性質"),
  defect: source("1783752565178", "コンクリート施工不良"),
  reinforcement: source("1783752565180", "RC配筋の基本"),
  cover: source("1783752565172", "鉄筋のかぶり厚さ"),
  procedure: source("1783752565146", "RC造の標準的な施工手順"),
};

const clusters = [
  [2013, "Q2", "RC material / bond / fresh-concrete properties", "スランプ、付着、収縮を含む材料・施工語の文脈。", "data/processed_questions/2013_専門1_建筑构法_Q2.md"],
  [2014, "Q3", "fresh concrete and material properties", "ワーカビリティ、スランプ、ひび割れ・収縮に隣接。", "data/processed_questions/2014_専門1_建筑构法_Q3.md"],
  [2017, "Q3", "RC member/rebar relation", "あばら筋・帯筋・RC 梁／柱の関係。", "data/processed_questions/2017_専門1_建筑构法_Q3.md"],
  [2019, "Q3", "formwork component diagram", "セパレーター、フォームタイ、せき板を含む型枠図。", "data/processed_questions/2019_専門1_建筑构法_Q3.md"],
  [2020, "Q3", "RC composite action and durability", "鉄筋とコンクリートの付着・一体性・耐久性に隣接。", "data/processed_questions/2020_専門1_建筑构法_Q3.md"],
  [2022, "Q3", "construction word-bank", "スランプ、フーチング等の 20-slot word-bank。", "data/processed_questions/2022_専門1_建筑构法_Q3.md"],
  [2023, "Q3", "RC section identification", "主筋・あばら筋・かぶり厚さの図示群。", "data/processed_questions/2023_専門1_建筑构法_Q問題3.md"],
  [2024, "Q3", "RC placement/cover MCQ", "豆板、かぶり厚さを含む選択問題。", "data/processed_questions/2024_専門1_建筑构法_Q3.md"],
  [2026, "Q3", "formwork detailing comparison", "セパレーターとフォームタイの位置・役割の説明図。", "data/processed_questions/2026_専門1_建筑构法_Q3.md"],
];

const candidateDefinitions = [
  ["rc-active-001", "型枠", "コンクリートを所定の形状・寸法に成形し、硬化まで側圧を受ける仮設の枠。", "formwork", "formwork_function", "concrete_shape_and_side_pressure", sourceRecord.formwork, "2019専門1Q3・2023専門1Q3・2026専門1Q3", "型枠部材・施工図解を直接問う考点簇。", "同じ型枠システムの部材名のみ（支保工・パイプサポート・せき板等）。型枠自体を満たす説明は除外。"],
  ["rc-active-002", "支保工", "打設時の荷重を下から支え、型枠を所定位置に保つ仮設支持系。", "formwork", "temporary_support_role", "formwork_load_support", sourceRecord.support, "2019専門1Q3・2026専門1Q3", "型枠とその支持部材を区別する図解考点に隣接。", "型枠支持の仮設部材のみ。側圧を直接受けるフォームタイや間隔保持のセパレーターとは役割を混同しない。"],
  ["rc-active-003", "パイプサポート", "型枠・支保工の構成で、打設時荷重を下方から支持する仮設支柱。", "formwork", "temporary_support_component", "support_member", sourceRecord.support, "2019専門1Q3・2026専門1Q3", "型枠支保工の部材関係に隣接。", "支保工系の部材名のみ。セパレーター、フォームタイ、せき板を正答にしない。"],
  ["rc-active-004", "コンクリート側圧", "未硬化コンクリートが型枠を外側へ押し開こうとして生じる圧力。", "formwork", "load_effect", "formwork_resistance", sourceRecord.formwork, "2019専門1Q3・2026専門1Q3", "フォームタイが抵抗する荷重として原题・教材の部材関係に直接隣接。", "荷重・作用のみ（側圧、荷重、変形、間隔）。部材名との混在を避ける。"],
  ["rc-active-005", "打込み", "フレッシュコンクリートを型枠内へ入れる施工段階。", "fresh_concrete", "construction_stage", "placement_sequence", sourceRecord.fresh, "2013専門1Q2・2014専門1Q3・2022専門1Q3", "フレッシュコンクリートの施工性・打設考点に隣接。", "同一施工段階群（打込み、締固め、養生）から選び、完成後の脱型や配筋と混ぜない。"],
  ["rc-active-006", "締固め", "打込み後のコンクリートから空隙を減らし、密実にする施工段階。", "fresh_concrete", "construction_stage", "placement_sequence", sourceRecord.fresh, "2013専門1Q2・2014専門1Q3・2022専門1Q3", "ワーカビリティおよび施工不良防止に隣接。", "施工段階群のみ。『豆板』など結果・欠陥名を正答候補にしない。"],
  ["rc-active-007", "養生", "打設後、所要の硬化と性能を得るためにコンクリートの状態を管理する施工段階。", "fresh_concrete", "construction_stage", "post_placement_care", sourceRecord.fresh, "2013専門1Q2・2014専門1Q3", "フレッシュコンクリートの打込み後工程に隣接。", "打設後工程のみ。材料性質や型枠部材を混ぜない。"],
  ["rc-active-008", "中性化", "コンクリートのアルカリ性が表面から低下して進行し、鉄筋の防錆環境を失わせる劣化現象。", "rc_durability", "deterioration_mechanism", "reinforcement_corrosion_prevention", sourceRecord.durability, "2013専門1Q2・2020専門1Q3", "RC の一体性・耐久性・ひび割れに隣接する考点。", "RC 劣化メカニズムのみ（中性化、腐食、収縮、ひび割れ）。施工部材名と混ぜない。"],
  ["rc-active-009", "鉄筋腐食", "中性化などで防錆環境が失われた後に生じ、RC の耐久性を損なう鉄筋の劣化。", "rc_durability", "deterioration_effect", "durability_failure", sourceRecord.durability, "2013専門1Q2・2020専門1Q3", "かぶり厚さ・耐久性の考点に隣接。", "RC 劣化の原因／結果を分離し、施工工程名を干扰项にしない。"],
  ["rc-active-010", "付着", "鉄筋とコンクリートが一体として力を伝達するための界面の結合関係。", "rc_member_relation", "component_relation", "steel_concrete_composite_action", sourceRecord.durability, "2013専門1Q2・2020専門1Q3", "鋼材とコンクリートの一体性を問う原题に直接隣接。", "RC 構成要素間の関係語のみ。線膨張係数や中性化など性質語を混ぜない。"],
  ["rc-active-011", "乾燥収縮", "硬化に伴ってコンクリートが徐々に収縮し、ひび割れの一因となる現象。", "fresh_concrete", "material_change", "crack_prevention", sourceRecord.concrete, "2014専門1Q3", "コンクリート性質・ひび割れに隣接。", "性状変化群のみ（収縮、硬化、ひび割れ）。欠陥名称や施工部材と混ぜない。"],
];

const duplicates = ["帯筋", "あばら筋", "主筋", "かぶり厚さ", "スランプ", "ワーカビリティ", "フォームタイ", "セパレーター", "コールドジョイント", "豆板", "打継ぎ"];
const incompatible = ["マリオン", "ガスケット", "ウェブ", "山留", "フーチング", "継ぎ手", "フレミッシュ", "本瓦葺き", "桟瓦葺き"];
const rejected = ["RC造の壁厚（数値）", "重ね継手長さ（数値）", "定着長さ（数値）", "RC造の標準施工手順（専門2-2のみ）", "大型パネル（原题・教材の定義不足）", "アルミ型枠・プラスチック型枠（原题关联不足）", "合板型枠（原题关联不足）", "壁式RC造（構造形式で共通语群relation不安定）"];

for (const candidate of candidateDefinitions) {
  const [, term,,,,,, sourceInfo] = candidate;
  if (seed.some((item) => item === term || item.includes(term) || term.includes(item))) throw new Error(`Candidate duplicates seed: ${term}`);
}
const output = candidateDefinitions.map(([candidate_id, term, independent_definition, domain, relation_type, relation_target, sourceInfo, related_past_exam, past_exam_relevance, distractor_constraints]) => ({
  candidate_id, term, independent_definition,
  source_file: sourceInfo.source_file, source_location: sourceInfo.source_location,
  source_excerpt_or_paraphrase: sourceInfo.source_excerpt_or_paraphrase,
  related_past_exam, past_exam_relevance, domain, relation_type, relation_target,
  distractor_constraints,
  distinction_from_existing_seed: "Not equal to or synonymous with any current 27 seed terms; it adds a distinct role, stage, load effect, or durability mechanism.",
  confidence: "medium",
  extraction_method: "past_exam_adjacent_textbook_fact",
  textbook_trace: sourceInfo.textbook_trace || "Repository imported learning card; bibliographic citation must be confirmed during manual audit.",
  status: "eligible_for_manual_audit",
}));
fs.writeFileSync(candidatePath, `${JSON.stringify({ version: 1, scope: "rc_construction_common_wordbank_candidates", seedPoolModified: false, candidates: output }, null, 2)}\n`, "utf8");

const clusterLines = ["# RC Common-Term Past-Exam Clusters", "", "Scope: Specialist 1 building-construction originals only; excluded domains are recorded but never supplied to the RC candidate pool.", "", "| Year | Question | Source | RC cluster | Existing seed | Adjacent textbook extraction |", "| ---: | --- | --- | --- | --- | --- |", ...clusters.map(([year, question, cluster, note, file]) => `| ${year} | ${question} | \`${file}\` | ${cluster} | Existing RC seed terms were checked before extraction. | ${note} |`), "", "The clusters drove the candidate list; they were not harvested merely by scanning answer terms."];
fs.writeFileSync(clusterPath, `${clusterLines.join("\n")}\n`, "utf8");

const counts = { past_exam_clusters: clusters.length, raw_extractions: 39, rejected_during_extraction: rejected.length, duplicate_with_seed: duplicates.length, incompatible_domain: incompatible.length, eligible_for_manual_audit: output.length, direct_past_exam: 0, past_exam_adjacent_textbook_fact: output.length, textbook_only: 0 };
const reportLines = ["# RC Common-Term Active Extraction", "", "This is an active-extraction candidate pool only. The 27-term seed pool and the independent RC semantic-association package were not modified.", "", "## Counts", "", ...Object.entries(counts).map(([key, value]) => `- \`${key}\`: **${value}**`), "", "## Source rule", "", "All eligible entries combine an S1 past-exam cluster with a repository learning-card definition. Where the imported card lacks a retained bibliographic URL, that absence is explicit in `textbook_trace`; these are `medium` confidence and require manual authority/source verification before promotion. No unsupported construction knowledge was added.", "", "## Readiness", "", `The pool contains ${output.length} eligible candidates, below the 30–50 retrieval target. The target was not forced: the remaining scanned material was excluded as duplicate, outside the RC domain, numeric-only, or insufficiently traceable.`, "", "Candidate records: `common-term-active-candidates.json`. Clusters: `common-term-past-exam-clusters.md`." ];
fs.writeFileSync(reportPath, `${reportLines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ counts, seedPool: `${seed.length}->${JSON.parse(fs.readFileSync(seedPath, "utf8")).facts.length}` }, null, 2));
