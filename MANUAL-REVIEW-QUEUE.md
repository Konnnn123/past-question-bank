# Manual review queue — minimum full-release unblock package

> Archive of round 1. The active queue is the 8-item [round-2 queue](MANUAL-REVIEW-QUEUE-ROUND-2.md); it contains only decisions that still require human input.

This is a decision queue, not an approval record.  Every entry remains `pending_manual_review`; no fact, proposition, mapping, or rubric is promoted by this file.  It deliberately excludes pool-diversity expansion, Planning image work (not an S1 core input), and all non-core enhancements.

## Recorded human decisions (2026-07-18)

Approved: `HR-003`, `BC-001`, `EN-DEF-001`, `EN-DEF-004`–`EN-DEF-016`, `EN-CS-001`, `EN-CS-004`, `EN-CS-005` (19 decisions).  These are approved for the specific assertions recorded in the JSON queue; they are **not** an automatic promotion into any fact pool.

Requires revision before another decision: `HR-001`, `HR-002`, `PL-001`, `BC-002`, `EN-DEF-002`, `EN-DEF-003`, `EN-CS-002`, `EN-CS-003` (8 decisions).  The exact revision requirements are retained in the JSON under `manual_review_outcome.revisions`.

Priority is primarily the number of release-critical templates unlocked by one approval; ties use the earliest implementation dependency.  `MANUAL-REVIEW-QUEUE.json` is the authoritative machine-readable record and contains the required source, answer, relation, distractor, ambiguity, and release-gate fields for every item.

## History — 3 decisions; minimum approvals to resume automation: 3

| Priority | Review ID | Template(s) unlocked | Review item | Gate |
|---:|---|---|---|---|
| 1 | HR-001 | no-image word-bank pairing (2014/2018) | source-to-answer mapping pack | history_full_release.source_traceability |
| 2 | HR-002 | description-to-name / 2015 Q3 | resolve conflicting building/architect/year record | history_full_release.unique_answer |
| 3 | HR-003 | Q7 explanatory writing | three-dimension scoring rubric | history_full_release.subjective_rubric |

## Planning — 1 decision; minimum approvals to resume automation: 1

| Priority | Review ID | Template(s) unlocked | Review item | Gate |
|---:|---|---|---|---|
| 4 | PL-001 | facility fact recall (8 observed years) | closed-world `has_feature` distractor/exclusivity rule | planning_full_release.distractor_truth |

## Building Construction — 2 decisions; minimum approvals to resume automation: 2

| Priority | Review ID | Template(s) unlocked | Review item | Gate |
|---:|---|---|---|---|
| 5 | BC-001 | 2014 independent term fill | 20 answer-index mappings and term-definition relations | building_construction_full_release.source_traceability |
| 6 | BC-002 | 2024 inline fill / mixed answer format | a–t answer mapping, relation and distractor boundaries | building_construction_full_release.source_traceability |

## Environment — 21 decisions; minimum approvals to resume automation: 21

The first sixteen decisions are the minimum compatible `defined_as` facts for a 2022-style phenomenon-to-term word bank (7 answers + 9 surplus).  The final five audit existing correct-statement propositions, including every false option, before that core template can leave reconstruction/sampler status.

| Priority | Review ID | Template(s) unlocked | Review item | Gate |
|---:|---|---|---|---|
| 7–22 | EN-DEF-001 … EN-DEF-016 | phenomenon-to-term | sixteen source-backed term definitions | environment_full_release.defined_as_pool_minimum |
| 23–27 | EN-CS-001 … EN-CS-005 | correct-statement select | thermal / ventilation / condensation / radiation / sound proposition packs | environment_full_release.false_proposition_evidence |

## Operational action (not a semantic review)

| Action ID | Required action | Why it is separate | Blocks |
|---|---|---|---|
| OPS-LOCALHOST-001 | Stop or hand over the user-owned `next dev -p 3210` process, then run the controlled build and browser flow. | This is an execution-environment ownership issue, not a fact, relation, distractor, or rubric decision. | Browser end-to-end release verification for all four subjects. |

## Excluded on purpose

- RC shared-word-bank pool expansion beyond the current usable pool: diversity enhancement, not the minimum semantic blocker.
- Planning image material: no Specialist 1 source input establishes it as a required core template.
- Environment candidate expansion beyond the sixteen compatible definitions: required for production diversity later, but not to unblock the first guarded runtime implementation.
- Structural-mechanics material: explicitly outside `building_construction` scope.
