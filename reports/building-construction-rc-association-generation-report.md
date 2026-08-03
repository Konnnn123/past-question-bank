# RC construction semantic-association generation report

## Output

One new Specialist 1 building-construction question was generated from the 2017 one-to-one shared-word-bank prototype.

| Check | Result |
| --- | --- |
| Primary domain | `rc_construction` only |
| Prompts | 10 |
| Word-bank terms | 10 |
| Surplus terms | 0 |
| Answer reuse | forbidden and unique |
| Fact provenance | 10 reviewed fact IDs |
| Structural mechanics | excluded |
| Source sentence reuse | none |

## Inputs

The item is generated from `data/building-construction-rc-association-projections.json`, whose ten projections point to the reviewed RC fact pack. Each projection now declares a new application context (for example, delivery acceptance, wall-thickness control, or lateral-pressure restraint). Its questions are not a reconstruction or near-paraphrase of the source sentences.

## Status

`production_ready`. Automated structure, provenance, uniqueness, and scope checks pass; the release audit also passes Japanese editorial review and one-to-one UI enforcement.
