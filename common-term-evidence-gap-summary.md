# Common-Term Evidence-Gap Summary

Scope: classification of the 111 candidates that remain pending independent-definition evidence in `audit-common-terms.md`. This is an evidence-gap audit only: it does not promote terms or alter the 27-fact seed pool.

## Counts

| gap_category | Count |
| --- | ---: |
| `source_link_missing` | 37 |
| `answer_index_missing` | 1 |
| `definition_not_atomic` | 35 |
| `term_not_answerable` | 27 |
| `template_relation_incompatible` | 10 |
| `recoverable_with_existing_sources` | 1 |
| `requires_new_source` | 0 |
| **Total** | **111** |

## F — recoverable_with_existing_sources (priority queue)

Each row names the exact existing source files that must be read together with its Atomic Fact occurrence record. These are candidates for a later, separate evidence-normalization pass; they are not approved facts.

| # | Candidate | Existing files to read | Why recoverable |
| ---: | --- | --- | --- |
| 86 | 山留め壁と切り梁 | `data/processed_questions/2026_専門1_建筑构法_Q3.md` — 「ぎ (4) ガラスの合わせガラスと複層ガラス (5) タイルのいも目地と馬目地 (6) 地下工事の山留め壁と切り梁 (7) 瓦葺きの本瓦葺きと桟瓦葺き (8) 木質系材料の CLT と集成材」 | 原题文字和本仓库答案索引均有可检索痕迹；下一步只需将该题干的限定条件、答案项和 Atomic Fact 的年份记录整理为一个独立定义卡，不需新增外部资料。 |

## Interpretation

F is deliberately limited to candidates with both a Specialist 1 source hit and a matching answer-index string. The other categories must not be treated as implicit promotion queues. In particular, a bare term or a multi-part topic is not repaired merely by finding another occurrence.
