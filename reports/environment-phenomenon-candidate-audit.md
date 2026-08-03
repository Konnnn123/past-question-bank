# Environment phenomenon candidate audit

Source pool: `data/environment-phenomenon-defined-as-candidates.json`.

| Audit result | Count | Detail |
| --- | ---: | --- |
| candidates retained | 44 | Every candidate has a source document, line pointer, excerpt, domain, condition, confusables, and candidate status. None has been approved. |
| unresolved original reconstruction targets | 13 | Preserved in `reports/environment-phenomenon-unresolved-source-list.md`; no past-exam phrase was auto-approved. `代謝量` and `着衣量` now also have separate dossier-backed candidates, but their original reconstruction trace stays unresolved. |
| duplicate canonical terms | 0 | Exact canonical-term deduplication passed. |
| duplicate descriptions | 0 | Normalized descriptions are distinct. |
| direct ambiguity / condition review | 2 | `COP` is numeric-condition adjacent; `コインシデンス効果` requires its frequency/material conditions to be retained. |
| semantic confusable-term review | 44 | All candidates list same-domain or near-domain confusables for human review. |
| conflict with approved Environment `defined_as` facts | 0 | The current approved/confirmed Environment pool has no `defined_as` facts. |

| Domain | Candidate count |
| --- | ---: |
| acoustics | 12 |
| ventilation | 4 |
| systems | 5 |
| solar | 8 |
| thermal | 5 |
| human_comfort | 5 |
| moisture | 1 |
| plumbing | 3 |

## Minimal human review queue

All 44 candidates require semantic approval. The smallest useful first review batch is the
seven candidates already marked `templateCompatibility: compatible` with the clearest
one-to-one definitions and distinct domains: `env-phen-001` PMV, `002` 空気齢, `004` 局所換気,
`006` 露点温度, `007` 回折, `008` フラッターエコー, and `014` 雑排水. This is only a review
order, not an approval recommendation.

No candidate has been added to `data/atomic-facts.json`, and no candidate has been promoted.

Detailed, audit-system-ready records for the seven priority candidates are in
`reports/environment-phenomenon-priority-review-queue.md`. COP and コインシデンス効果
remain candidates and are explicitly excluded from that priority queue.
