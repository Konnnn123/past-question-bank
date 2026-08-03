# Building construction semantic-association audit

## Scope

Specialist 1 only. This audit covers 2015 Q2 and 2017 Q3, and excludes Specialist 2-2 and structural mechanics.

## Evidence found

- 2015 Q2: 10 term-to-related-term pairs; the instructions explicitly allow repeated use of one bank term.
- 2017 Q3: 10 term-to-related-term pairs; the source bank is a one-to-one matching set.
- The 20 mappings are recorded in `data/building-construction-semantic-association-audit.json` with their source, domain, and source reuse behavior.

## Generator rule

This is a shared-word-bank fill format, not default MCQ. A reconstruction uses its original source-year bank. Any later generated subset must draw answers from one declared domain only, and must declare whether reuse is permitted.

## Gate

The current answer evidence is `card_supported_draft`. Do not create a live generator until these 20 pair facts are promoted to reviewed status.

## Review prototype

The source-bank reconstruction is available at `/exam/reconstruction/building-construction-association`. It preserves the 2015 and 2017 source banks and their different reuse policies, but remains a review prototype rather than a production generator. The separate Generator Model is in `data/building-construction-semantic-association-generator-model.json`.

## Source-text correction

The 2015 source text confirms `DPG (Dot Point Glazing) 構法`. The prior `Dot Point Gluing` spelling in the processed question was corrected. This confirms that transcription only; it does not promote the full pair set beyond `card_supported_draft`.
