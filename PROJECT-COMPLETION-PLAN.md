# University of Tokyo Architecture Past Exam Generator — four-section completion plan

## Corrected target

Deliver four independently usable Specialist 1 mock systems: `history`, `planning`, `building_construction`, and `environment`. A construction-only full mock is not a project release. Overall state remains `INCOMPLETE` until all four section gates are verified.

## Scope

- Included: the four sections above, their Specialist 1 processed questions, reviewed facts, answer records, source maps, assembly, grading, attempts, review writeback, deterministic validation, and browser flows.
- Excluded: `structural_mechanics`, Specialist 2-2, and unreviewed fact promotion. Structural mechanics must not enter building construction.

## Execution order

1. Re-audit actual repository coverage and classify every existing section format.
2. Revalidate building construction against the stricter gate (closest existing full mock).
3. Build the nearest incomplete full section from existing verified/traceable content, with a minimal assembler, route, submission, and validation.
4. Repeat for the remaining sections. Do not claim a section complete until the per-section gate is verified.
5. Run the aggregate four-section release audit and static build.

## Completion checkpoint

`NEXT-TASK.json` is the resumable source of truth for the current bounded implementation task. `SYSTEM-STATUS.json` and `AUTONOMOUS-RUN-LOG.md` record evidence only after commands and browser execution.
