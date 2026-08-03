# RC 共通語群：5 条人工判断候选的 Generator 压力测试

## Scope and decision rule

- Target candidates: the five entries with `status: manual_judgment_required` in `common-term-active-candidates.json`.
- Allowed vocabulary: the current 33 reviewed seed terms only.  The compatible-domain registry was checked, but its entries belong to underground work, timber, steel, roofing, or curtain-wall domains and therefore supplied **no** legal RC 躯体施工／納まり distractor.
- No unreviewed candidate was used as a distractor for another candidate.  This prevents circular promotion.
- A legal set must have the candidate as the sole answer plus three reviewed terms of the same answer grain and RC domain.  Each proposed term below is explicitly assessed rather than assumed to be a valid distractor.
- Result: each candidate produced **0 / 5 legal sets**.  All five are `template_incompatible`; none is promoted or retained as `limited_relation_candidate`.

## Candidate rc-active-004 — コンクリート側圧

- Definition: 未硬化コンクリートが型枠を外側へ押し開こうとして生じる圧力。
- Intended relation: `load_effect` → `formwork_resistance`.

| Attempt | Correct term / relation target | Three reviewed candidate distractors | Why each distractor is clearly not the answer | Failure check |
| ---: | --- | --- | --- | --- |
| 1 | コンクリート側圧 / `formwork_resistance` | 型枠・フォームタイ・セパレーター | 型枠 is a mould; フォームタイ is a tie; セパレーター fixes a spacing. None is a pressure/load. | All three are component nouns: grain mismatch and obvious. |
| 2 | コンクリート側圧 / `formwork_resistance` | 支保工・パイプサポート・せき板 | 支保工 and パイプサポート support temporary works; せき板 is a contact panel. None denotes lateral pressure. | All three are components: grain mismatch and obvious. |
| 3 | コンクリート側圧 / `formwork_resistance` | かぶり厚さ・定着長さ・重ね継手 | These are a distance, an anchorage length, and a splice; none is a fresh-concrete load. | Measurement/joint nouns: grain mismatch and obvious. |
| 4 | コンクリート側圧 / `formwork_resistance` | スランプ・ワーカビリティ・水セメント比 | These describe fresh-concrete properties or mix proportion, not the force acting on formwork. | Property nouns: grain mismatch and obvious. |
| 5 | コンクリート側圧 / `formwork_resistance` | ブリーディング・コールドジョイント・豆板 | These are a phenomenon or defects, not the lateral action before hardening. | Defect/phenomenon nouns: grain mismatch and obvious. |

No reviewed load/action term exists in the allowed RC pool.  The relation is source-supported, but a legal three-distractor set cannot be built without adding unreviewed facts.

## Candidate rc-active-005 — 打込み

- Definition: フレッシュコンクリートを型枠内へ入れる施工段階。
- Intended relation: `construction_stage` → `placement_sequence`.

| Attempt | Correct term / relation target | Three reviewed candidate distractors | Why each distractor is clearly not the answer | Failure check |
| ---: | --- | --- | --- | --- |
| 1 | 打込み / `placement_sequence` | 緊張・打継ぎ・ブリーディング | 緊張 is a PC operation; 打継ぎ is a boundary used when placement is interrupted; ブリーディング is a phenomenon after placement. | Only one is an operation, and not the same fresh-concrete stage. |
| 2 | 打込み / `placement_sequence` | スランプ・ワーカビリティ・水セメント比 | These are a test/property/mix ratio, not placing fresh concrete into a form. | Property nouns: grain mismatch and obvious. |
| 3 | 打込み / `placement_sequence` | 型枠・せき板・フォームタイ | These are temporary-work components, not work stages. | Component nouns: grain mismatch and obvious. |
| 4 | 打込み / `placement_sequence` | コールドジョイント・豆板・ひび割れ | These are defects/results, not placement operations. | Defect nouns: grain mismatch and obvious. |
| 5 | 打込み / `placement_sequence` | 支保工・パイプサポート・セパレーター | These support or space formwork; none puts concrete into the form. | Component nouns: grain mismatch and obvious. |

The reviewed pool contains no three independently reviewed fresh-concrete stage terms.  Using other pending terms such as 締固め or 養生 would make the audit circular, so no legal set exists.

## Candidate rc-active-006 — 締固め

- Definition: 打込み後のコンクリートから空隙を減らし、密実にする施工段階。
- Intended relation: `construction_stage` → `placement_sequence`.

| Attempt | Correct term / relation target | Three reviewed candidate distractors | Why each distractor is clearly not the answer | Failure check |
| ---: | --- | --- | --- | --- |
| 1 | 締固め / `placement_sequence` | 緊張・打継ぎ・ブリーディング | 緊張 is a PC operation; 打継ぎ is a construction boundary; ブリーディング is water rising after placement. None removes voids from fresh concrete. | No same-stage trio. |
| 2 | 締固め / `placement_sequence` | スランプ・ワーカビリティ・水セメント比 | These describe workability or mix proportion; they do not compact placed concrete. | Property nouns: grain mismatch and obvious. |
| 3 | 締固め / `placement_sequence` | 型枠・せき板・フォームタイ | These retain/shape concrete or tie the formwork; they do not perform compaction. | Component nouns: grain mismatch and obvious. |
| 4 | 締固め / `placement_sequence` | 豆板・コールドジョイント・ひび割れ | These are defects or results; 豆板 can result from inadequate compaction, but is not the operation itself. | Result-vs-operation mismatch; the causal relation would require inference. |
| 5 | 締固め / `placement_sequence` | 支保工・パイプサポート・セパレーター | These are support/spacing components and do not reduce fresh-concrete voids. | Component nouns: grain mismatch and obvious. |

The pool lacks three reviewed alternatives at the `fresh-concrete operation` grain.  The one tempting contrast, 豆板, is a consequence rather than an operation; using it as if it were a peer would violate the relation rule.

## Candidate rc-active-007 — 養生

- Definition: 打設後、所要の硬化と性能を得るためにコンクリートの状態を管理する施工段階。
- Intended relation: `construction_stage` → `post_placement_care`.

| Attempt | Correct term / relation target | Three reviewed candidate distractors | Why each distractor is clearly not the answer | Failure check |
| ---: | --- | --- | --- | --- |
| 1 | 養生 / `post_placement_care` | 緊張・打継ぎ・ブリーディング | 緊張 is PC work; 打継ぎ is a joint boundary; ブリーディング is a phenomenon. None is post-placement condition management. | No same-stage trio. |
| 2 | 養生 / `post_placement_care` | スランプ・ワーカビリティ・水セメント比 | These are fresh-concrete properties/mix ratio, not management after placement. | Property nouns: grain mismatch and obvious. |
| 3 | 養生 / `post_placement_care` | 型枠・せき板・フォームタイ | These are temporary-work components, not a post-placement process. | Component nouns: grain mismatch and obvious. |
| 4 | 養生 / `post_placement_care` | 乾燥収縮・ひび割れ・鉄筋腐食 | These are deterioration/defect terms; they are not the care process. | Effect-vs-process mismatch; the inverse prevention relation would need inference. |
| 5 | 養生 / `post_placement_care` | 支保工・パイプサポート・セパレーター | These are support/spacing components and do not manage curing conditions. | Component nouns: grain mismatch and obvious. |

No reviewed post-placement care terms exist in the allowed pool.  The defect terms cannot be treated as peer distractors because doing so turns the answer into a causal inference rather than a direct relation.

## Candidate rc-active-010 — 付着

- Definition: 鉄筋とコンクリートが一体として力を伝達するための界面の結合関係。
- Intended relation: `component_relation` → `steel_concrete_composite_action`.

| Attempt | Correct term / relation target | Three reviewed candidate distractors | Why each distractor is clearly not the answer | Failure check |
| ---: | --- | --- | --- | --- |
| 1 | 付着 / `steel_concrete_composite_action` | 定着長さ・重ね継手・スタッド | 定着長さ is a required length, 重ね継手 is a splice, and スタッド is a connector. None is the steel–concrete interface relation itself. | Grain mismatch; 定着長さ is also near enough to invite a relation-by-inference ambiguity. |
| 2 | 付着 / `steel_concrete_composite_action` | 主筋・帯筋・あばら筋 | These are reinforcement members; they do not name the interface condition that makes composite action possible. | Component-versus-relation mismatch and obvious. |
| 3 | 付着 / `steel_concrete_composite_action` | かぶり厚さ・中性化・鉄筋腐食 | These are cover distance and durability mechanism/effect; none names load transfer at the interface. | Measurement/durability mismatch and obvious. |
| 4 | 付着 / `steel_concrete_composite_action` | 型枠・フォームタイ・セパレーター | These belong to formwork, not steel–concrete composite action. | Cross-relation component mismatch and obvious. |
| 5 | 付着 / `steel_concrete_composite_action` | CFT・PC鋼材・シース | CFT is a system, PC鋼材 a material, and シース a duct; none is the RC interface bond relation. | System/material/component mismatch and obvious. |

The only close reviewed terms, 定着長さ and 重ね継手, are not peer relation nouns.  They make a prompt about force transfer less uniquely answerable rather than forming legal distractors.  Therefore the candidate cannot enter this template under the current pool.

## Actual Generator execution

Command actually run:

```powershell
npx --yes tsx scripts/run-rc-common-term-pressure-test.ts
```

The test invoked `generateRCSharedWordBank` in `src/lib/building-construction-shared-wordbank-generator.ts` five times for each candidate (seeds 101, 202, 303, 404, 505): **25 runs total**.  Each non-persistent test input consisted of 26 reviewed seed facts plus the candidate, because the function currently rejects any pool other than exactly 27 facts.

| Check | Result |
| --- | --- |
| Candidate appears as an answer in every candidate/seed test | 25 / 25 |
| Item count | 20 / 20 in every run |
| Word-bank count | 27 / 27 in every run |
| Surplus count | 7 / 7 in every run |
| Duplicate answer terms | 0 in every run |
| Duplicate word-bank terms | 0 in every run |
| Generation exceptions for 27-term test subsets | 0 / 25 |
| Current full reviewed 33-term seed pool | **Fails** with `RC shared-word-bank requires 27 unique reviewed facts` |

These runs confirm that inserting each term into the function does not itself cause a duplicate or runtime error **when a valid 27-term subset is supplied**.  They do not turn the attempted triples into valid distractors: the current function only shuffles a 27-term bank and takes its complement as surplus; it does not select three constrained distractors for an individual blank.

## Final classification

| Result | Count |
| --- | ---: |
| `promoted` | 0 |
| `limited_relation_candidate` | 0 |
| `template_incompatible` | 5 |
| Seed pool before → after | **33 → 33** |

No seed fact was added.  The independent RC semantic-association package was not modified.
