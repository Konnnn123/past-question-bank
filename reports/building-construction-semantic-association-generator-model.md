# Building construction semantic-association Generator Model

## Layer separation

- `Past Exam Reconstruction`: reproduces the 2015 and 2017 source structure only. It proves that the format was understood; it does not produce new questions.
- `Knowledge Pool`: supplies reviewed, relation-tagged atomic facts.
- `Generator Model`: constrains how reviewed facts enter a new shared-word-bank question.

## Frozen source parameters

| Prototype | Prompts | Bank | Surplus | Reuse |
| --- | ---: | ---: | ---: | --- |
| 2015 Q2 | 10 | 18 | 8 | allowed |
| 2017 Q3 | 10 | 10 | 0 | forbidden |

## Generation contract

The default generated set has one declared building-construction domain. It selects only reviewed facts with an explicit term-to-related-term relation and source evidence. Its surplus terms come from the same domain and answer role. Cross-domain sets require a separately reviewed prototype; structural mechanics is excluded.

## Current gate

The initial scan finds 13 matching atomic facts for the 2017 exemplar terms, but all 13 are `unreviewed`. Therefore the Generator Model is specified but cannot legitimately produce a new mock question yet.
