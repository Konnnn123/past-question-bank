# RC 共通语群 33 条 seed：术语类型与 Relation 分布审计

## Scope

- Input: `data/building-construction-rc-shared-wordbank-facts.json` 的 33 条 reviewed seed。
- This is an audit overlay only: it does not alter seed facts, the RC semantic-association pack, or Generator logic.
- `term_type` describes the answer noun's granularity. `relation_type` reproduces the stored `relation` value, without retroactively changing it.

## Term-type distribution

| Term type | Count | Share | Terms |
| --- | ---: | ---: | --- |
| `formwork_temporary_work_component` | 6 | 18.2% | フォームタイ、セパレーター、せき板、型枠、支保工、パイプサポート |
| `reinforcement_member` | 4 | 12.1% | 帯筋、あばら筋、主筋、フープ |
| `concrete_defect_or_phenomenon` | 4 | 12.1% | 豆板、コールドジョイント、ブリーディング、ひび割れ |
| `dimensional_or_joint_specification` | 3 | 9.1% | かぶり厚さ、定着長さ、重ね継手 |
| `fresh_concrete_property_or_mix_metric` | 3 | 9.1% | スランプ、ワーカビリティ、水セメント比 |
| `foundation_component_or_method` | 3 | 9.1% | フーチング、地業、捨てコンクリート |
| `durability_mechanism_or_effect` | 3 | 9.1% | 中性化、鉄筋腐食、乾燥収縮 |
| `connection_component` | 2 | 6.1% | スタッド、アンカーボルト |
| `construction_boundary_or_operation` | 2 | 6.1% | 打継ぎ、緊張 |
| `pc_component_or_material` | 2 | 6.1% | シース、PC鋼材 |
| `composite_structural_system` | 1 | 3.0% | CFT |

The pool is component-heavy: temporary/formwork components alone are 6/33, and reinforcement plus connection components add another 6/33.  That is useful for the 2019-style component vocabulary, but it cannot supply homogeneous distractors for construction-stage, load/action, or interface-relation prompts.

## Stored relation-type distribution

| Relation type | Count | Share |
| --- | ---: | ---: |
| `component_role` | 6 | 18.2% |
| `formwork_component_role` | 6 | 18.2% |
| `defined_as` | 5 | 15.2% |
| `construction_defect` | 4 | 12.1% |
| `construction_method` | 2 | 6.1% |
| `foundation_method` | 2 | 6.1% |
| `indicates` | 1 | 3.0% |
| `material_role` | 1 | 3.0% |
| `structural_system` | 1 | 3.0% |
| `foundation_component` | 1 | 3.0% |
| `connection_component` | 1 | 3.0% |
| `deterioration_mechanism` | 1 | 3.0% |
| `deterioration_effect` | 1 | 3.0% |
| `material_change` | 1 | 3.0% |

`component_role` + `formwork_component_role` account for 12/33 (36.4%).  This confirms that the current pool is structurally skewed toward identifying components rather than describing process actions or component-interface relations.

## Per-fact audit

| Fact | Term | Term type | Stored relation type |
| --- | --- | --- | --- |
| rcswb-01 | 帯筋 | `reinforcement_member` | `component_role` |
| rcswb-02 | あばら筋 | `reinforcement_member` | `component_role` |
| rcswb-03 | 主筋 | `reinforcement_member` | `component_role` |
| rcswb-04 | フープ | `reinforcement_member` | `component_role` |
| rcswb-05 | かぶり厚さ | `dimensional_or_joint_specification` | `defined_as` |
| rcswb-06 | 定着長さ | `dimensional_or_joint_specification` | `defined_as` |
| rcswb-07 | 重ね継手 | `dimensional_or_joint_specification` | `defined_as` |
| rcswb-08 | スタッド | `connection_component` | `component_role` |
| rcswb-09 | フォームタイ | `formwork_temporary_work_component` | `formwork_component_role` |
| rcswb-10 | セパレーター | `formwork_temporary_work_component` | `formwork_component_role` |
| rcswb-11 | せき板 | `formwork_temporary_work_component` | `formwork_component_role` |
| rcswb-12 | スランプ | `fresh_concrete_property_or_mix_metric` | `indicates` |
| rcswb-13 | ワーカビリティ | `fresh_concrete_property_or_mix_metric` | `defined_as` |
| rcswb-14 | 水セメント比 | `fresh_concrete_property_or_mix_metric` | `defined_as` |
| rcswb-15 | 豆板 | `concrete_defect_or_phenomenon` | `construction_defect` |
| rcswb-16 | コールドジョイント | `concrete_defect_or_phenomenon` | `construction_defect` |
| rcswb-17 | ブリーディング | `concrete_defect_or_phenomenon` | `construction_defect` |
| rcswb-18 | ひび割れ | `concrete_defect_or_phenomenon` | `construction_defect` |
| rcswb-19 | 打継ぎ | `construction_boundary_or_operation` | `construction_method` |
| rcswb-20 | シース | `pc_component_or_material` | `component_role` |
| rcswb-21 | PC鋼材 | `pc_component_or_material` | `material_role` |
| rcswb-22 | 緊張 | `construction_boundary_or_operation` | `construction_method` |
| rcswb-23 | CFT | `composite_structural_system` | `structural_system` |
| rcswb-24 | フーチング | `foundation_component_or_method` | `foundation_component` |
| rcswb-25 | 地業 | `foundation_component_or_method` | `foundation_method` |
| rcswb-26 | 捨てコンクリート | `foundation_component_or_method` | `foundation_method` |
| rcswb-27 | アンカーボルト | `connection_component` | `connection_component` |
| rcswb-28 | 型枠 | `formwork_temporary_work_component` | `formwork_component_role` |
| rcswb-29 | 支保工 | `formwork_temporary_work_component` | `formwork_component_role` |
| rcswb-30 | パイプサポート | `formwork_temporary_work_component` | `formwork_component_role` |
| rcswb-31 | 中性化 | `durability_mechanism_or_effect` | `deterioration_mechanism` |
| rcswb-32 | 鉄筋腐食 | `durability_mechanism_or_effect` | `deterioration_effect` |
| rcswb-33 | 乾燥収縮 | `durability_mechanism_or_effect` | `material_change` |

## Second-round targeted extraction brief

This audit narrows—not broadens—the next extraction.  It must only seek source-supported RC 躯体施工／納まり facts in the following three missing cells:

| Priority | Missing term type / relation | Current reviewed count | Why it is first |
| ---: | --- | ---: | --- |
| P0 | `fresh_concrete_process_stage` with `construction_stage` / `post_placement_care` | 0 | The pressure test blocked 打込み、締固め、養生 because there were no three same-grain reviewed distractors. |
| P0 | `formwork_load_or_action` with `load_effect` | 0 | コンクリート側圧 has no same-grain reviewed load/action alternatives. |
| P1 | `rc_interface_relation` with `component_relation` | 0 | 付着 has no peer interface-relation terms; 定着長さ and 重ね継手 are not peer relation nouns. |

The extraction target is not a generic count.  Each P0 cell needs enough source-backed facts to produce a correct term plus three same-grain distractors; candidates remain outside the seed pool until the existing audit gates pass.
