# Common-Term Candidate Audit — Batch 1

Scope: first ten candidates from the construction Atomic Fact expansion queue. Evidence was limited to local `data/processed_questions/` and `data/construction-exam-answers.json`. A candidate is promoted only when Specialist 1 evidence supplies a standalone, unique definition and the relation can support a same-domain surplus rule.

| # | Candidate | Source evidence actually found | Independent definition? | Relation / distractor compatibility | Decision |
| ---: | --- | --- | --- | --- | --- |
| 1 | CFT造の柱の例 | `2022_専門1_建筑构法_Q3.md`: the prompt states that a structure with concrete filled inside a steel tube is called `(C)造`; answer index maps C to `CFT`. | Yes: “鋼管内部にコンクリートを充填する構造” uniquely identifies CFT. | Relation `structural_system`; compatible with construction-method/material-form word-bank terms, but not with the current RC-only seed pool without widening its declared domain. | **candidate — evidence sufficient, domain mismatch**. Do not promote to RC-only pool. |
| 2 | Pcaの方式 | No matching Specialist 1 prompt or answer-index entry was found by repository search. Only an Atomic Fact category/year record exists. | No. | Cannot determine relation or surplus compatibility. | **hold — missing source prompt and definition**. |
| 3 | PC造の特徴 | No matching Specialist 1 prompt or answer-index entry was found. The available fact is candidate-confidence only. | No. | No verified relation. | **reject for this pool — missing evidence**. |
| 4 | PCaとPCの違い | `construction-exam-answers.json` has a detailed explanation only for `2023_専門2-2_建筑构法_Q5.md`, not Specialist 1. It defines PCa factory fabrication/site erection and PC prestressing. | The concepts are independently definable, but available detailed evidence is excluded Specialist 2-2. | Comparison relation, not a single-term Specialist 1 common-word-bank slot. | **hold — wrong exam scope and relation shape**. |
| 5 | コールドジョイント | The Atomic Fact has Specialist 1 year evidence (2019/2024), but repository search found no local Specialist 1 sentence defining it. 2019 source describes a non-integrated construction defect but does not expose the indexed answer in the searchable text. | Not sufficiently from accessible local evidence. | Would be `construction_defect`; potentially compatible only after definition evidence and near-miss checks. | **hold — answer-index / definition evidence missing**. |
| 6 | 豆板（ジャンカ） | `2024_専門1_建筑构法_Q3.md`: “コンクリート打設時の充填不良部分を【豆板, 波板, 堰板, しぶ板】と呼ぶ。” Answer index also maps j to 豆板. | Yes. | Relation `construction_defect`; local four-choice evidence supplies near distractors, but it duplicates existing seed-pool term `豆板`. | **do not promote — duplicate of existing pool fact**. |
| 7 | タイル張り | Atomic Fact has 2024 appearance evidence, but no standalone Specialist 1 definition or indexed blank was found in local search. | No. | Too broad a method label; cannot make a unique blank without a narrower relation. | **hold — insufficiently atomic**. |
| 8 | コンクリート打放しの構法 | Atomic Fact has 2019/2024 appearance records, but local search found no source sentence or answer mapping. | No. | Topic label, not a unique term-definition relation. | **reject for this template — topic, not atomic answer**. |
| 9 | プレキャストコンクリート組立床構造 | Atomic Fact has 2023 appearance record. Detailed local definition exists only in `2023_専門2-2_建筑构法_Q5.md` for PCa, not this Specialist 1 candidate. | No Specialist 1 standalone definition found. | Broad system/topic; no verified common-bank slot. | **hold — missing Specialist 1 definition**. |
| 10 | PCa工法の製造・施工プロセスの要点 | Atomic Facts are candidate-confidence. The only detailed local PCa explanation is Specialist 2-2 2023, not Specialist 1. | No. | Process topic; would need decomposition into separately answerable terms. | **reject for this template — candidate confidence plus wrong scope**. |

## Batch outcome

- Promoted: **0**
- Held for source evidence: **5** (#2, #4, #5, #7, #9)
- Rejected for this template: **3** (#3, #8, #10)
- Existing-pool duplicate: **1** (#6)
- Evidence sufficient but domain-incompatible with current RC-only pool: **1** (#1)

No candidate was added to the 27-fact seed pool. No RC semantic-association fact was merged.

## Batch 2 — Remaining candidates

This batch audits every remaining wide-screen candidate (#11 onward). `source hit` means an exact repository search hit in a Specialist 1 construction source or answer index; it is evidence of occurrence, not automatic promotion.

| # | Candidate | Atomic evidence | Repository-source hit | Seed-pool relation | Decision |
| ---: | --- | --- | --- | --- | --- |
| 11 | PCa造の利点 | appears_in_exam: 2023; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 12 | PC造の特徴 | appears_in_exam: 2023; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 13 | RC造の構造原理と寿命 | appears_in_exam: 2013, 2020; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 14 | RC造の標準的な施工手順 | appears_in_exam: 2016; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 15 | RC造の分類 | appears_in_exam: 2013, 2016, 2017; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 16 | RC配筋の基本 | appears_in_exam: 2013, 2017, 2023, 2024; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 17 | SSG構法 | appears_in_exam: 2022; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 18 | S造鋼材断面の基本 | appears_in_exam: 2017, 2019, 2022, 2024, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 19 | あばら筋（スターラップ） | appears_in_exam: 2013, 2017, 2023; all source facts unreviewed | none | overlaps 27-term seed pool | duplicate / do not promote |
| 20 | アンカーボルト（S造柱脚） | appears_in_exam: 2018, 2019, 2025; all source facts unreviewed | none | overlaps 27-term seed pool | duplicate / do not promote |
| 21 | アンカーボルト（木造土台） | appears_in_exam: 2018, 2019, 2025; all source facts unreviewed | none | overlaps 27-term seed pool | duplicate / do not promote |
| 22 | イギリス積み・フランス積み | appears_in_exam: 2015, 2022; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 23 | ウェルポイント | appears_in_exam: 2022; all source facts unreviewed | data\processed_questions\2022_専門1_建筑构法_Q3.md | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 24 | オープンジョイント | appears_in_exam: 2022, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 25 | カーテンウォール | appears_in_exam: 2015, 2019, 2022, 2026; all source facts unreviewed | data\processed_questions\2013_専門1_建筑构法_Q2.md<br>data\processed_questions\2016_専門1_建筑构法_Q2.md<br>data\processed_questions\2019_専門1_建筑构法_Q3.md<br>data\processed_questions\2022_専門1_建筑构法_Q3.md<br>data\processed_questions\2026_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 26 | カーテンウォール・外壁支持の基本 | appears_in_exam: 2013, 2015, 2016, 2019, 2022, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 27 | カーテンウォールのファスナー例 | appears_in_exam: 2015, 2019; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 28 | カーテンウォールの構成部材 | appears_in_exam: 2022, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 29 | カーテンウォールの支持方式 | appears_in_exam: 2015, 2019, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 30 | カーテンウォールを用いる目的 | appears_in_exam: 2013, 2015, 2019, 2022, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 31 | カーテンウォール構成方式 | appears_in_exam: 2015, 2019; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 32 | かぶり | appears_in_exam: 2023, 2024; all source facts unreviewed | data\processed_questions\2023_専門1_建筑构法_Q問題3.md<br>data\processed_questions\2024_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | overlaps 27-term seed pool | duplicate / do not promote |
| 33 | ガラスの固定方法 | appears_in_exam: 2015, 2022, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 34 | ガラスプロックによる壁 | appears_in_exam: 2013, 2015; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 35 | コールドジョイント | appears_in_exam: 2019, 2024; all source facts unreviewed | none | overlaps 27-term seed pool | duplicate / do not promote |
| 36 | コンクリートの性質 | appears_in_exam: 2013, 2014, 2015; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 37 | コンクリートブロック塀(CB塀) | appears_in_exam: 2013, 2022; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 38 | コンクリート杭 | appears_in_exam: 2022, 2025; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 39 | コンクリート施工不良 | appears_in_exam: 2019, 2024; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 40 | コンクリート打放しの構法 | appears_in_exam: 2019, 2024; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 41 | サンドドレーン | appears_in_exam: 2017; all source facts unreviewed | data\processed_questions\2017_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 42 | シェル・トラス・スペースフレーム | appears_in_exam: 2013, 2020; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 43 | シェル・トラス・膜構造の基本 | appears_in_exam: 2013, 2020, 2025; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 44 | シェル構造 | appears_in_exam: 2013, 2020, 2025; all source facts unreviewed | data\processed_questions\2013_専門1_建筑构法_Q2.md | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 45 | スケルトン・インフィル | appears_in_exam: 2020; all source facts unreviewed | data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 46 | スケルトン・インフィルと工業化 | appears_in_exam: 2016, 2017, 2020, 2022; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 47 | セパレーター | appears_in_exam: 2019, 2026; all source facts unreviewed | data\processed_questions\2019_専門1_建筑构法_Q3.md<br>data\processed_questions\2026_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | overlaps 27-term seed pool | duplicate / do not promote |
| 48 | せん断補強筋（あばら筋）の必要性 | appears_in_exam: 2013, 2017, 2023; all source facts unreviewed | none | overlaps 27-term seed pool | duplicate / do not promote |
| 49 | ダイアフラム | appears_in_exam: 2019, 2022, 2024; all source facts unreviewed | data\processed_questions\2017_専門1_建筑构法_Q3.md<br>data\processed_questions\2019_専門1_建筑构法_Q3.md<br>data\processed_questions\2022_専門1_建筑构法_Q3.md<br>data\processed_questions\2024_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 50 | タイル張り | appears_in_exam: 2024; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 51 | デッキプレート | appears_in_exam: 2019, 2022; all source facts unreviewed | data\processed_questions\2019_専門1_建筑构法_Q3.md<br>data\processed_questions\2022_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 52 | フォームタイ | appears_in_exam: 2019, 2026; all source facts unreviewed | data\processed_questions\2019_専門1_建筑构法_Q3.md<br>data\processed_questions\2026_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | overlaps 27-term seed pool | duplicate / do not promote |
| 53 | プラットフォーム構法 | appears_in_exam: 2013, 2015; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 54 | プレキャストコンクリート組立床構造 | appears_in_exam: 2023; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 55 | フレッシュコンクリートと打設 | appears_in_exam: 2013, 2014, 2022; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 56 | プレボーリング工法 | appears_in_exam: 2022; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 57 | ほぞ | appears_in_exam: 2013, 2022, 2024, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 58 | まぐさ | appears_in_exam: 2013, 2026, 2023; all source facts unreviewed | data\processed_questions\2013_専門1_建筑构法_Q2.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 59 | まぐさ・臥梁・キーストーン・目地 | appears_in_exam: 2013, 2022, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 60 | 曳家工事 | appears_in_exam: 2022; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 61 | 屋根防水・シーリング・雨仕舞 | appears_in_exam: 2015, 2016, 2024; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 62 | 加工樹種 | appears_in_exam: 2015, 2025; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 63 | 改修・工業化工法の基本 | appears_in_exam: 2016, 2017, 2020, 2022, 2024; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 64 | 開口部・ガラスの基本 | appears_in_exam: 2014, 2015, 2019, 2022, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 65 | 開口部の各部の名称 | appears_in_exam: 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 66 | 外壁・防水・雨仕舞の基本 | appears_in_exam: 2015, 2016, 2024; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 67 | 角形鋼管 | appears_in_exam: 2017, 2022; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 68 | 割〈り地業 | appears_in_exam: 2022, 2025; all source facts unreviewed | none | overlaps 27-term seed pool | duplicate / do not promote |
| 69 | 瓦茸 | appears_in_exam: 2014, 2024, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 70 | 瓦棒茸·立はぜ茸 | appears_in_exam: 2014, 2024, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 71 | 乾燥材 | appears_in_exam: 2015, 2025; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 72 | 基礎・地盤・地下工事の基本 | appears_in_exam: 2014, 2017, 2018, 2022, 2024, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 73 | 寄棟屋根の小屋組 | appears_in_exam: 2014; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 74 | 逆打ち工法 | appears_in_exam: 2024; all source facts unreviewed | data\processed_questions\2024_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 75 | 筋かい | appears_in_exam: 2013, 2025; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 76 | 型枠 | appears_in_exam: 2019, 2023, 2026; all source facts unreviewed | data\processed_questions\2026_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 77 | 型枠・型枠支保工の構成 | appears_in_exam: 2019, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 78 | 建具の開閉・ガラス固定・排水 | appears_in_exam: 2014, 2015, 2022, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 79 | 勾配屋根の構法 | appears_in_exam: 2014, 2016; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 80 | 杭地業 | appears_in_exam: 2022, 2025; all source facts unreviewed | data\processed_questions\2015_専門1_建筑构法_Q2.md<br>data\processed_questions\2018_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | overlaps 27-term seed pool | duplicate / do not promote |
| 81 | 高力ボルト接合 | appears_in_exam: 2013, 2016, 2019; all source facts unreviewed | data\processed_questions\2013_専門1_建筑构法_Q2.md<br>data\processed_questions\2016_専門1_建筑构法_Q2.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 82 | 合わせガラス・強化ガラス・複層ガラス | appears_in_exam: 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 83 | 根切り | appears_in_exam: 2022, 2024, 2026; all source facts unreviewed | data\processed_questions\2022_専門1_建筑构法_Q3.md | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 84 | 在来軸組構法の基本 | appears_in_exam: 2013, 2015, 2025; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 85 | 山留め工法 | appears_in_exam: 2024, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 86 | 山留め壁と切り梁 | appears_in_exam: 2026; all source facts unreviewed | data\processed_questions\2026_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 87 | 湿式工法と乾式工法 | appears_in_exam: 2016; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 88 | 主筋（RC） | appears_in_exam: 2013, 2017, 2023; all source facts unreviewed | none | overlaps 27-term seed pool | duplicate / do not promote |
| 89 | 集成材 | appears_in_exam: 2015, 2016, 2025, 2026; all source facts unreviewed | data\processed_questions\2015_専門1_建筑构法_Q2.md<br>data\processed_questions\2016_専門1_建筑构法_Q2.md<br>data\processed_questions\2019_専門1_建筑构法_Q3.md<br>data\processed_questions\2025_専門1_建筑构法_Q3.md<br>data\processed_questions\2026_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 90 | 住宅ストック | appears_in_exam: 2024, 2018, 6000; all source facts unreviewed | data\processed_questions\2024_専門1_建筑构法_Q3.md | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 91 | 小屋梁・小屋束・雲筋かい | appears_in_exam: 2014, 2018, 2019; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 92 | 小屋梁と軒桁 | appears_in_exam: 2014, 2018; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 93 | 床・天井・内装下地の基本 | appears_in_exam: 2016, 2019, 2025, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 94 | 床組・壁下地・天井下地 | appears_in_exam: 2019, 2025, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 95 | 真壁と大壁 | appears_in_exam: 2013, 2015; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 96 | 折板屋根 | appears_in_exam: 2014, 2024; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 97 | 組積造・タイル・瓦の基本 | appears_in_exam: 2013, 2014, 2015, 2022, 2024, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 98 | 耐震・制震・免震の違い | appears_in_exam: 2022, 2024; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 99 | 帯筋 | appears_in_exam: 2013, 2017, 2023; all source facts unreviewed | data/construction-exam-answers.json | overlaps 27-term seed pool | duplicate / do not promote |
| 100 | 帯筋（フープ） | appears_in_exam: 2013, 2017; all source facts unreviewed | none | overlaps 27-term seed pool | duplicate / do not promote |
| 101 | 地盤改良工法 | appears_in_exam: 2017, 2022; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 102 | 地盤調査・地盤改良・山留め | appears_in_exam: 2014, 2017, 2022, 2024, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 103 | 地盤調查 | appears_in_exam: 2022, 2024, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 104 | 柱と横架材 | appears_in_exam: 2025; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 105 | 張弦梁構造の例(東京国際空港) | appears_in_exam: 2020, 2025; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 106 | 通気構法 | appears_in_exam: 2024, 2026; all source facts unreviewed | data\processed_questions\2024_専門1_建筑构法_Q3.md | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 107 | 鉄筋のかぶり厚さ | appears_in_exam: 2023, 2024; all source facts unreviewed | none | overlaps 27-term seed pool | duplicate / do not promote |
| 108 | 鉄骨軸組構法 | appears_in_exam: 2013, 2019; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 109 | 土台 | appears_in_exam: 2013, 2025; all source facts unreviewed | data\processed_questions\2018_専門1_建筑构法_Q3.md<br>data\processed_questions\2019_専門1_建筑构法_Q3.md<br>data\processed_questions\2023_専門1_建筑构法_Q問題3.md<br>data\processed_questions\2025_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 110 | 土台・柱・横架材 | appears_in_exam: 2013, 2016, 2019, 2025; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 111 | 棟木・母屋・垂木・野地板 | appears_in_exam: 2014, 2016, 2019, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 112 | 豆板（ジャンカ） | appears_in_exam: 2024; all source facts unreviewed | none | overlaps 27-term seed pool | duplicate / do not promote |
| 113 | 独立フーチング基礎 | appears_in_exam: 2018, 2022; all source facts unreviewed | none | overlaps 27-term seed pool | duplicate / do not promote |
| 114 | 独立基礎・布基礎・べた基礎 | appears_in_exam: 2018, 2022; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 115 | 波板茸きの構法 | appears_in_exam: 2014, 2024; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 116 | 布基礎 | appears_in_exam: 2018, 2022, 2025; all source facts unreviewed | data\processed_questions\2018_専門1_建筑构法_Q3.md<br>data\processed_questions\2022_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 117 | 普通ボルト接合 | appears_in_exam: 2013, 2016, 2019; all source facts unreviewed | data\processed_questions\2013_専門1_建筑构法_Q2.md<br>data\processed_questions\2016_専門1_建筑构法_Q2.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 118 | 普通ポル卜接合 | appears_in_exam: 2013, 2016, 2019; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 119 | 平板載荷試験 | appears_in_exam: 2014; all source facts unreviewed | data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 120 | 壁式RC造 | appears_in_exam: 2017, 2024; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 121 | 方づえ | appears_in_exam: 2018, 2026; all source facts unreviewed | data\processed_questions\2016_専門1_建筑构法_Q2.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 122 | 本瓦茸 | appears_in_exam: 2014, 2024, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 123 | 膜構造・空気膜構造・テンセグリティ | appears_in_exam: 2020, 2025; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 124 | 免震レトロフィット | appears_in_exam: 2024; all source facts unreviewed | data\processed_questions\2024_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 125 | 免震化工事 | appears_in_exam: 2022; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 126 | 木質系構造材料 | appears_in_exam: 2015, 2016, 2019, 2025, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 127 | 木造小屋組・屋根の基本 | appears_in_exam: 2014, 2018, 2019, 2026; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 128 | 洋小屋 | appears_in_exam: 2018, 2019; all source facts unreviewed | data\processed_questions\2013_専門1_建筑构法_Q2.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 129 | 溶接継目と継手 | appears_in_exam: 2014, 2023; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 130 | 陸梁・合掌・真束・対束 | appears_in_exam: 2018, 2019; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |
| 131 | 和小屋 | appears_in_exam: 2014, 2018, 2019; all source facts unreviewed | data\processed_questions\2013_専門1_建筑构法_Q2.md<br>data\processed_questions\2014_専門1_建筑构法_Q3.md<br>data/construction-exam-answers.json | not eligible without independent definition | hold — occurrence evidence only; definition/relation/distractor review required |
| 132 | 扠首組（さすぐみ） | appears_in_exam: 2018; all source facts unreviewed | none | not eligible without independent definition | hold — no accessible exact source definition |

## Full-queue reconciliation

- Wide-screen candidate total: **132**
- Batch 1 audited: **10**
- Batch 2 audited: **122**
- Total audited: **132**
- New promotions in batch 2: **0**
- Holds in batch 2: **106**
- Seed-pool duplicates in batch 2: **16**
- RC semantic-association pack merged: **0**

All remaining candidates are held because the central Atomic Fact entries remain `unreviewed` and do not themselves provide the required standalone definition plus relation and constrained-distractor compatibility. No candidate was added to the 27-fact seed pool.

## Evidence-gap classification — 111 held candidates

范围：仅对前一轮标记为“待补独立定义证据”的 111 条候选做缺口分类；不重审、不晋升，也不修改 27 条 seed pool。每项只归入一个缺口类别。`source link` 检索范围为本仓库 `data/processed_questions/*専門1*建筑构法*.md`、`data/construction-exam-answers.json` 和对应 Atomic Facts。

| # | Candidate | gap_category | Actual repository evidence / search result | Reason |
| ---: | --- | --- | --- | --- |
| 2 | Pcaの方式 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “Pcaの方式”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2023，仍需拆分为独立事实。 |
| 4 | PCaとPCの違い | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “PCaとPCの違い”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2023，仍需拆分为独立事实。 |
| 5 | コールドジョイント | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565118 和出现年份 2019、2024，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 7 | タイル張り | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “タイル張り”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 9 | プレキャストコンクリート組立床構造 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565128 和出现年份 2023，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 11 | PCa造の利点 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “PCa造の利点”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2023，仍需拆分为独立事实。 |
| 12 | PC造の特徴 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “PC造の特徴”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2023，仍需拆分为独立事实。 |
| 13 | RC造の構造原理と寿命 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “RC造の構造原理と寿命”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2013、2020，仍需拆分为独立事实。 |
| 14 | RC造の標準的な施工手順 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “RC造の標準的な施工手順”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2016，仍需拆分为独立事实。 |
| 15 | RC造の分類 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “RC造の分類”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2013、2016、2017，仍需拆分为独立事实。 |
| 16 | RC配筋の基本 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “RC配筋の基本”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2013、2017、2023、2024，仍需拆分为独立事实。 |
| 17 | SSG構法 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565254 和出现年份 2022，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 18 | S造鋼材断面の基本 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “S造鋼材断面の基本”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2017、2019、2022、2024、2026，仍需拆分为独立事实。 |
| 22 | イギリス積み・フランス積み | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565492 和出现年份 2015、2022，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 23 | ウェルポイント | `term_not_answerable` | `data/processed_questions/2022_専門1_建筑构法_Q3.md` — 「ンプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン」 | “ウェルポイント”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 24 | オープンジョイント | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565258 和出现年份 2022、2026，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 25 | カーテンウォール | `template_relation_incompatible` | `data/processed_questions/2013_専門1_建筑构法_Q2.md` — 「 ・シェル構造とは, 荷重を主として (19) によらず面内応力によって処理する薄肉構造である. ・カーテンウォールと並んで代表的な（20）に ALC 版による壁があげられる。 【欄 A】 ヤング係数・線膨張係数・基準強度・剛性・スランプ値・1/5・1/2・1.0・1.5・2・2.5・4・5・8」<br>`data/processed_questions/2016_専門1_建筑构法_Q2.md` — 「td><td>U</td><td>層せん断力係数</td></tr><tr><td>V</td><td>カーテンウォール</td><td>W</td><td>外周壁</td><td>X</td><td>間仕切壁</td></tr><tr><td>Y</td><td>耐力壁</td><td>Z</td><」<br>`data/processed_questions/2019_専門1_建筑构法_Q3.md` — 「で隣接する層で直交するようにラミナを並べ積層した木質板を（d）と呼ぶ。 ・ 水平変位に追従させるため，カーテンウォールを躯体に対して回転させる方式を（e）方式と呼ぶ。 ・ 木㐀軸組構法住宅で基礎と土台の緊結には多くの場合（f）ボルトを用いる。 ・ 木材の敷居では通常，木（g）が上側になる。 ・ 」<br>`data/processed_questions/2022_専門1_建筑构法_Q3.md` — 「を測る試験に( H )試験がある。 ・壁などの塗装下地として貼り付ける網状のものを(Ⅰ)と呼ぶ。 ・カーテンウォールで用いられる縦長の部材を( J )と呼ぶ。 ・壁と床の取り合い部に設ける部材を( K )と呼ぶ。 - 建築の新築から修繕，解体までのプロセス全体にかかる費用のことを（L）と呼ぶ。 」<br>`data/processed_questions/2026_専門1_建筑构法_Q3.md` — 「にせよ。1つの図にまとめても2つの図を描いてもよい。答案用紙の行をまたいで図を描いてもよい。 例 1 カーテンウォールのロッキングとスウェイ ![image](/past-exams/2026年度_建築専門1_公開版_2062812433992134656_c103c7327270.jpg) 例」 | 现有原型限定 RC 躯体施工／纳まり；“カーテンウォール”的可定位证据属于木构、钢构、屋面、外墙或空间结构关系，不能与 RC seed pool 稳定构成同域 surplus。 |
| 26 | カーテンウォール・外壁支持の基本 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “カーテンウォール・外壁支持の基本”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2013、2015、2016、2019、2022、2026，仍需拆分为独立事实。 |
| 27 | カーテンウォールのファスナー例 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “カーテンウォールのファスナー例”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2015、2019，仍需拆分为独立事实。 |
| 28 | カーテンウォールの構成部材 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “カーテンウォールの構成部材”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2022、2026，仍需拆分为独立事实。 |
| 29 | カーテンウォールの支持方式 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “カーテンウォールの支持方式”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2015、2019、2026，仍需拆分为独立事实。 |
| 30 | カーテンウォールを用いる目的 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “カーテンウォールを用いる目的”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2013、2015、2019、2022、2026，仍需拆分为独立事实。 |
| 31 | カーテンウォール構成方式 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “カーテンウォール構成方式”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2015、2019，仍需拆分为独立事实。 |
| 33 | ガラスの固定方法 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565256 和出现年份 2015、2022、2026，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 34 | ガラスプロックによる壁 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565308 和出现年份 2013、2015，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 36 | コンクリートの性質 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565150 和出现年份 2013、2014、2015，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 37 | コンクリートブロック塀(CB塀) | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565488 和出现年份 2013、2022，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 38 | コンクリート杭 | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “コンクリート杭”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 39 | コンクリート施工不良 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “コンクリート施工不良”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2019、2024，仍需拆分为独立事实。 |
| 40 | コンクリート打放しの構法 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565126 和出现年份 2019、2024，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 41 | サンドドレーン | `term_not_answerable` | `data/processed_questions/2017_専門1_建筑构法_Q3.md` — 「と最も関連の深い用語を【用語群】の中から 1 つずつ選びなさい。 1) スランプ 2）挽板 3) サンドドレーン 4) クイーンポスト 5) バックドラフト 6) 单板 7) 帶筋 8) ウェブ 9) あばら筋 10) ダイアフラム 【用語群】 直交集成板、合板、コンクリート、」 | “サンドドレーン”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 42 | シェル・トラス・スペースフレーム | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565342 和出现年份 2013、2020，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 43 | シェル・トラス・膜構造の基本 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “シェル・トラス・膜構造の基本”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2013、2020、2025，仍需拆分为独立事实。 |
| 44 | シェル構造 | `template_relation_incompatible` | `data/processed_questions/2013_専門1_建筑构法_Q2.md` — 「達できる力の種類はせん断力と（17）である。 ・キングポストトラスは（18）の代表的な例である。 ・シェル構造とは, 荷重を主として (19) によらず面内応力によって処理する薄肉構造である. ・カーテンウォールと並んで代表的な（20）に ALC 版による壁があげられる。 【欄 A】 ヤ」 | 现有原型限定 RC 躯体施工／纳まり；“シェル構造”的可定位证据属于木构、钢构、屋面、外墙或空间结构关系，不能与 RC seed pool 稳定构成同域 surplus。 |
| 45 | スケルトン・インフィル | `template_relation_incompatible` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 仅原始字串出现，未建立可用题号映射。 | 现有原型限定 RC 躯体施工／纳まり；“スケルトン・インフィル”的可定位证据属于木构、钢构、屋面、外墙或空间结构关系，不能与 RC seed pool 稳定构成同域 surplus。 |
| 46 | スケルトン・インフィルと工業化 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “スケルトン・インフィルと工業化”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2016、2017、2020、2022，仍需拆分为独立事实。 |
| 49 | ダイアフラム | `template_relation_incompatible` | `data/processed_questions/2017_専門1_建筑构法_Q3.md` — 「ポスト 5) バックドラフト 6) 单板 7) 帶筋 8) ウェブ 9) あばら筋 10) ダイアフラム 【用語群】 直交集成板、合板、コンクリート、鉄筋コンクリート梁、鉄筋コンクリート柱、H形鋼、鋼管、トラス、液状化、火災 (2) 以下の材料の特性値 11)～20)について、それ」<br>`data/processed_questions/2019_専門1_建筑构法_Q3.md` — 「ト，スプライスプレート，母屋，下屋, 無目，垂木，蝶番，スチフナ，セパレーター，フォームタイ，マリオン，ダイアフラム，スパンドレル，スカラップ，ターンバックル」<br>`data/processed_questions/2022_専門1_建筑构法_Q3.md` — 「ト，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン」<br>`data/processed_questions/2024_専門1_建筑构法_Q3.md` — 「 ・ H 形鋼の断面で、主に曲げ応力を負担する両端の板をつなぐ部分を【m. フランジ, ブラケット, ダイアフラム, ウェブ】と呼ぶ。 ・ 地下部を上階から下階に向かって施工する工法を【n. 潜函工法, 逆打ち工法, 建て逃げ工法, セルフクライミング工法】と呼ぶ。 ・ 鉄筋コンクリート造の部」 | 现有原型限定 RC 躯体施工／纳まり；“ダイアフラム”的可定位证据属于木构、钢构、屋面、外墙或空间结构关系，不能与 RC seed pool 稳定构成同域 surplus。 |
| 50 | タイル張り | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “タイル張り”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 51 | デッキプレート | `term_not_answerable` | `data/processed_questions/2019_専門1_建筑构法_Q3.md` — 「建築構法」、市ヶ谷出版社、2014 年 # B 群 せき板，野地板，キープレート，ベースプレート，デッキプレート，スプライスプレート，母屋，下屋, 無目，垂木，蝶番，スチフナ，セパレーター，フォームタイ，マリオン，ダイアフラム，スパンドレル，スカラップ，ターンバックル」<br>`data/processed_questions/2022_専門1_建筑构法_Q3.md` — 「构法" category: "専門1" tags: - "鉄筋コンクリート， 耐震構造， ALC， デッキプレート" question_number: "3" --- # 【問題 3】 日本において建築物に用いられる材料や構法，施工法について書かれた以下の文章の空欄（A）～（T）を埋めるのに最」 | “デッキプレート”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 53 | プラットフォーム構法 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565464 和出现年份 2013、2015，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 54 | プレキャストコンクリート組立床構造 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565128 和出现年份 2023，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 55 | フレッシュコンクリートと打設 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “フレッシュコンクリートと打設”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2013、2014、2022，仍需拆分为独立事实。 |
| 56 | プレボーリング工法 | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “プレボーリング工法”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 57 | ほぞ | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “ほぞ”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 58 | まぐさ | `term_not_answerable` | `data/processed_questions/2013_専門1_建筑构法_Q2.md` — 「い・小さい・本実・留め・矧ぎ・洋小屋・和小屋・耐力壁・帳壁・小舞壁・破れ目地・芋目地・透かし目地・臥梁・まぐさ・幅木・台輪・スチフナ・添柱・管柱・通し柱」 | “まぐさ”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 59 | まぐさ・臥梁・キーストーン・目地 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565494 和出现年份 2013、2022、2026，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 60 | 曳家工事 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565372 和出现年份 2022，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 61 | 屋根防水・シーリング・雨仕舞 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565350 和出现年份 2015、2016、2024，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 62 | 加工樹種 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565408 和出现年份 2015、2025，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 63 | 改修・工業化工法の基本 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “改修・工業化工法の基本”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2016、2017、2020、2022、2024，仍需拆分为独立事实。 |
| 64 | 開口部・ガラスの基本 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “開口部・ガラスの基本”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2014、2015、2019、2022、2026，仍需拆分为独立事实。 |
| 65 | 開口部の各部の名称 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “開口部の各部の名称”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2026，仍需拆分为独立事实。 |
| 66 | 外壁・防水・雨仕舞の基本 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “外壁・防水・雨仕舞の基本”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2015、2016、2024，仍需拆分为独立事实。 |
| 67 | 角形鋼管 | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “角形鋼管”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 69 | 瓦茸 | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “瓦茸”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 70 | 瓦棒茸·立はぜ茸 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565312 和出现年份 2014、2024、2026，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 71 | 乾燥材 | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “乾燥材”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 72 | 基礎・地盤・地下工事の基本 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “基礎・地盤・地下工事の基本”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2014、2017、2018、2022、2024、2026，仍需拆分为独立事实。 |
| 73 | 寄棟屋根の小屋組 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565466 和出现年份 2014，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 74 | 逆打ち工法 | `term_not_answerable` | `data/processed_questions/2024_専門1_建筑构法_Q3.md` — 「ダイアフラム, ウェブ】と呼ぶ。 ・ 地下部を上階から下階に向かって施工する工法を【n. 潜函工法, 逆打ち工法, 建て逃げ工法, セルフクライミング工法】と呼ぶ。 ・ 鉄筋コンクリート造の部材において、鉄筋の表面からコンクリートの表面までの最小寸法を【o. 通り, かぶり, 見込み, 蹴上げ」 | “逆打ち工法”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 75 | 筋かい | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “筋かい”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 76 | 型枠 | `term_not_answerable` | `data/processed_questions/2026_専門1_建筑构法_Q3.md` — 「ar: 2026 subject: "建筑构法" category: "専門1" tags: - "型枠" - "仕上げ" - "継手" - "ガラス" question_number: "3" --- # 【問題3】 以下の（1）～（8）についてそれぞれ、下線部分の2つ」 | “型枠”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 77 | 型枠・型枠支保工の構成 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “型枠・型枠支保工の構成”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2019、2026，仍需拆分为独立事实。 |
| 78 | 建具の開閉・ガラス固定・排水 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565356 和出现年份 2014、2015、2022、2026，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 79 | 勾配屋根の構法 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565200 和出现年份 2014、2016，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 81 | 高力ボルト接合 | `template_relation_incompatible` | `data/processed_questions/2013_専門1_建筑构法_Q2.md` — 「t: "建筑构法" category: "専門1" tags: - "鉄筋コンクリート" - "高力ボルト接合" - "枠組み壁工法" - "木質構造" question_number: "2" --- # 【問題 2】 文章中の（番号）に適切な用語や数字を【欄A】から選択し，例え」<br>`data/processed_questions/2016_専門1_建筑构法_Q2.md` — 「れ急速に発達した。日本のように地震の多い国で、特に超高層を設計する場合は、15に配慮する必要がある。 高力ボルト接合は、普通ボルト接合がボルト軸の16によっているのに対し、17が非常に大きい高力ボルトを用い、接合すべき鋼材の18によって接合する。 合板は、厚さ約2～519の20を繊維方向が互いに2」 | 现有原型限定 RC 躯体施工／纳まり；“高力ボルト接合”的可定位证据属于木构、钢构、屋面、外墙或空间结构关系，不能与 RC seed pool 稳定构成同域 surplus。 |
| 82 | 合わせガラス・強化ガラス・複層ガラス | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565354 和出现年份 2026，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 83 | 根切り | `term_not_answerable` | `data/processed_questions/2022_専門1_建筑构法_Q3.md` — 「とを( Q )と呼ぶ。 - 柱梁接合部に設ける三角形状の補強部のことを(R)と呼ぶ。 - 地下工事で根切りの側面を支える壁を（S）壁と呼ぶ。 - 地震時に部分的に大きな力が働くのを防ぐため，建物に（T）を設けて，構造的に切り離す。 # 【用語群】 胴縁，山留，幅木，継ぎ手，マリオン，」 | “根切り”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 84 | 在来軸組構法の基本 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “在来軸組構法の基本”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2013、2015、2025，仍需拆分为独立事实。 |
| 85 | 山留め工法 | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “山留め工法”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 86 | 山留め壁と切り梁 | `recoverable_with_existing_sources` | `data/processed_questions/2026_専門1_建筑构法_Q3.md` — 「ぎ (4) ガラスの合わせガラスと複層ガラス (5) タイルのいも目地と馬目地 (6) 地下工事の山留め壁と切り梁 (7) 瓦葺きの本瓦葺きと桟瓦葺き (8) 木質系材料の CLT と集成材」 | 原题文字和本仓库答案索引均有可检索痕迹；下一步只需将该题干的限定条件、答案项和 Atomic Fact 的年份记录整理为一个独立定义卡，不需新增外部资料。 |
| 87 | 湿式工法と乾式工法 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “湿式工法と乾式工法”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2016，仍需拆分为独立事实。 |
| 89 | 集成材 | `term_not_answerable` | `data/processed_questions/2015_専門1_建筑构法_Q2.md` — 「ッシュ・ボンド (2) キングポスト (3) けらば (4) 2×4 (ツーバイフォー) 工法 (5) 集成材 (6) DPG (Dot Point Glazing) 構法 (7) マリオン (8) オールケーシング (9) 金輪 (10) 釘接合 【用語群】 ガラス、挽板、単板、煉瓦、杭地」<br>`data/processed_questions/2016_専門1_建筑构法_Q2.md` — 「 合板は、厚さ約2～519の20を繊維方向が互いに21になるように積層し接着した木質系材料の一種である。集成材は、厚さ約2～522の23を積層し接着したものである。 表 1 <table><tbody><tr><td>A</td><td>kN</td><td>B</td><td>N</」<br>`data/processed_questions/2019_専門1_建筑构法_Q3.md` — 「ら行う。 A 群 ロール，キャスト，フルコール，ダウン，プレス，スウェイ，アンカー，スタッド，押出，集成材，パーティクルボード，ハイテンション，CLT，ALC，LVL，コールド，ホット，表，裏，上，下，グレイジング，ロッキング，フロート,スライド (2) 下図の(k)～(t)に最もふさわ」<br>`data/processed_questions/2025_専門1_建筑构法_Q3.md` — 「e> 【B群】 直交集成板（CLT）、単板積層材（LVL）、配向性ストランドボード（OSB）、合板、集成材、板目板、柾目板、単板（ベニヤ）、挽板（ラミナ）、ストランド、製材 (3) 図中に示す o～y に最もふさわしい語を【C 群】から 1 つずつ選出しなさい。ただし、同じ語を何度使って」<br>`data/processed_questions/2026_専門1_建筑构法_Q3.md` — 「) 地下工事の山留め壁と切り梁 (7) 瓦葺きの本瓦葺きと桟瓦葺き (8) 木質系材料の CLT と集成材」 | “集成材”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 90 | 住宅ストック | `answer_index_missing` | `data/processed_questions/2024_専門1_建筑构法_Q3.md` — 「ar: 2024 subject: "建筑构法" category: "専門1" tags: - "住宅ストック" - "線膨張係数" - "免震レトロフィット" - "ツーバイフォー構法" question_number: "3" --- # 【問題3】 日本における建築物の状」 | 原题中可定位到“住宅ストック”，但现有答案索引不能以该术语证明它是独立答案；需先补题号—答案项映射，不能直接用题干出现作为答案证据。 |
| 91 | 小屋梁・小屋束・雲筋かい | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565416 和出现年份 2014、2018、2019，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 92 | 小屋梁と軒桁 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565470 和出现年份 2014、2018，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 93 | 床・天井・内装下地の基本 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “床・天井・内装下地の基本”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2016、2019、2025、2026，仍需拆分为独立事实。 |
| 94 | 床組・壁下地・天井下地 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “床組・壁下地・天井下地”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2019、2025、2026，仍需拆分为独立事实。 |
| 95 | 真壁と大壁 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565452 和出现年份 2013、2015，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 96 | 折板屋根 | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “折板屋根”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 97 | 組積造・タイル・瓦の基本 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “組積造・タイル・瓦の基本”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2013、2014、2015、2022、2024、2026，仍需拆分为独立事实。 |
| 98 | 耐震・制震・免震の違い | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “耐震・制震・免震の違い”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2022、2024，仍需拆分为独立事实。 |
| 101 | 地盤改良工法 | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “地盤改良工法”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 102 | 地盤調査・地盤改良・山留め | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “地盤調査・地盤改良・山留め”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2014、2017、2022、2024、2026，仍需拆分为独立事实。 |
| 103 | 地盤調查 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565292 和出现年份 2022、2024、2026，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 104 | 柱と横架材 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565478 和出现年份 2025，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 105 | 張弦梁構造の例(東京国際空港) | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565264 和出现年份 2020、2025，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 106 | 通気構法 | `term_not_answerable` | `data/processed_questions/2024_専門1_建筑构法_Q3.md` — 「免震【h. ガスケット, コルゲート, レトロフィット, ケーソン】工法と呼ぶ。 ・ 木造住宅の外壁に通気構法を採用した場合、断熱材の室外側に【i. 防水, 透湿, 防湿, 透湿防水】シートを施工するのが一般的である。 ・ コンクリート打設時の充填不良部分を【j. 豆板, 波板, 堰板, し」 | “通気構法”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 108 | 鉄骨軸組構法 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565276 和出现年份 2013、2019，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 109 | 土台 | `template_relation_incompatible` | `data/processed_questions/2018_専門1_建筑构法_Q3.md` — 「外側・杭地業・独立基礎・布基礎・挽き板・大引き・単板・柱・根太・真束・PC 鋼棒・溶接・方立・継手・火打土台・土台・垂木・妻面・梁・繋梁・ガラス・トラス」<br>`data/processed_questions/2019_専門1_建筑构法_Q3.md` — 「るため，カーテンウォールを躯体に対して回転させる方式を（e）方式と呼ぶ。 ・ 木㐀軸組構法住宅で基礎と土台の緊結には多くの場合（f）ボルトを用いる。 ・ 木材の敷居では通常，木（g）が上側になる。 ・ 鉄骨㐀の柱梁接合には多くの場合（h）ボルト接合が用いられる。 ・ コンクリートが打」<br>`data/processed_questions/2023_専門1_建筑构法_Q問題3.md` — 「接、完全溶け込み溶接、あばら筋、柱、段板、け込み板、突合せ継手、重ね継手、一面せん断、二面せん断、火打ち土台、土台、床梁」<br>`data/processed_questions/2025_専門1_建筑构法_Q3.md` — 「72_e8170aa48cce.jpg) 【C群】 天井、床、壁、枠組壁工法、木造軸組構法、基礎、土台、野縁、胴縁、胴差、ブレース、通し柱、管柱、火打土台、火打梁、桁、梁、クリップ、吊りボルト、アンカーボルト、天井板」 | 现有原型限定 RC 躯体施工／纳まり；“土台”的可定位证据属于木构、钢构、屋面、外墙或空间结构关系，不能与 RC seed pool 稳定构成同域 surplus。 |
| 110 | 土台・柱・横架材 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “土台・柱・横架材”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2013、2016、2019、2025，仍需拆分为独立事实。 |
| 111 | 棟木・母屋・垂木・野地板 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “棟木・母屋・垂木・野地板”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2014、2016、2019、2026，仍需拆分为独立事实。 |
| 114 | 独立基礎・布基礎・べた基礎 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565358 和出现年份 2018、2022，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 115 | 波板茸きの構法 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565262 和出现年份 2014、2024，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 116 | 布基礎 | `term_not_answerable` | `data/processed_questions/2018_専門1_建筑构法_Q3.md` — 「年 【B 群】 アンカーボルト・アルミサッシの詳細・鉄サッシの詳細・室内側・室外側・杭地業・独立基礎・布基礎・挽き板・大引き・単板・柱・根太・真束・PC 鋼棒・溶接・方立・継手・火打土台・土台・垂木・妻面・梁・繋梁・ガラス・トラス」<br>`data/processed_questions/2022_専門1_建筑构法_Q3.md` — 「と呼ぶ。 - プレストレスを導入するためにコンクリート中に埋設する管のことを( F )管と呼ぶ。 ・布基礎で底部の広がった部分のことを( G )と呼ぶ。 ・生コンクリートの流動性を測る試験に( H )試験がある。 ・壁などの塗装下地として貼り付ける網状のものを(Ⅰ)と呼ぶ。 ・カーテ」 | “布基礎”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 117 | 普通ボルト接合 | `template_relation_incompatible` | `data/processed_questions/2013_専門1_建筑构法_Q2.md` — 「普通コンクリート（4），木材（5）である。 ・一般に鋼材は，含まれる（6）によって強さが異なる。 ・普通ボルト接合はボルトの（7）によっているのに対し，高力ボルト接合は接合する鋼材を強く締め付けることにより生じる（8）によって接合する。 ・鉄筋コンクリートを構成する鋼材とコンクリートはよく付着し」<br>`data/processed_questions/2016_専門1_建筑构法_Q2.md` — 「日本のように地震の多い国で、特に超高層を設計する場合は、15に配慮する必要がある。 高力ボルト接合は、普通ボルト接合がボルト軸の16によっているのに対し、17が非常に大きい高力ボルトを用い、接合すべき鋼材の18によって接合する。 合板は、厚さ約2～519の20を繊維方向が互いに21になるように積層」 | 现有原型限定 RC 躯体施工／纳まり；“普通ボルト接合”的可定位证据属于木构、钢构、屋面、外墙或空间结构关系，不能与 RC seed pool 稳定构成同域 surplus。 |
| 118 | 普通ポル卜接合 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565202 和出现年份 2013、2016、2019，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 119 | 平板載荷試験 | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 仅原始字串出现，未建立可用题号映射。 | “平板載荷試験”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 120 | 壁式RC造 | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “壁式RC造”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 121 | 方づえ | `template_relation_incompatible` | `data/processed_questions/2016_専門1_建筑构法_Q2.md` — 「>g</td><td>梁</td><td>h</td><td>合掌</td><td>i</td><td>方づえ</td></tr><tr><td>j</td><td>真束</td><td>k</td><td>野地</td><td>l</td><td>敷居</td></tr></tbody></」 | 现有原型限定 RC 躯体施工／纳まり；“方づえ”的可定位证据属于木构、钢构、屋面、外墙或空间结构关系，不能与 RC seed pool 稳定构成同域 surplus。 |
| 122 | 本瓦茸 | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “本瓦茸”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 123 | 膜構造・空気膜構造・テンセグリティ | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565346 和出现年份 2020、2025，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 124 | 免震レトロフィット | `term_not_answerable` | `data/processed_questions/2024_専門1_建筑构法_Q3.md` — 「category: "専門1" tags: - "住宅ストック" - "線膨張係数" - "免震レトロフィット" - "ツーバイフォー構法" question_number: "3" --- # 【問題3】 日本における建築物の状況や材料、構法、施工法について書かれた文章の空欄【a～t」 | “免震レトロフィット”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 125 | 免震化工事 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565376 和出现年份 2022，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 126 | 木質系構造材料 | `term_not_answerable` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “木質系構造材料”目前只是材料、构件、工法名或上位名；现有记录没有把它绑定为一个唯一的“定义 → 术语”空格，因此不应仅凭名称进入共通语群答案。 |
| 127 | 木造小屋組・屋根の基本 | `definition_not_atomic` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | “木造小屋組・屋根の基本”是主题、比较或多步骤束，不能压缩成一个可唯一作答的术语—定义对；即使有年份 2014、2018、2019、2026，仍需拆分为独立事实。 |
| 128 | 洋小屋 | `template_relation_incompatible` | `data/processed_questions/2013_専門1_建筑构法_Q2.md` — 「・酸素量・せん断力・引抜き力・引張力・圧縮力・摩擦力・曲げモーメント・大きい・小さい・本実・留め・矧ぎ・洋小屋・和小屋・耐力壁・帳壁・小舞壁・破れ目地・芋目地・透かし目地・臥梁・まぐさ・幅木・台輪・スチフナ・添柱・管柱・通し柱」 | 现有原型限定 RC 躯体施工／纳まり；“洋小屋”的可定位证据属于木构、钢构、屋面、外墙或空间结构关系，不能与 RC seed pool 稳定构成同域 surplus。 |
| 129 | 溶接継目と継手 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565242 和出现年份 2014、2023，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 130 | 陸梁・合掌・真束・対束 | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565418 和出现年份 2018、2019，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |
| 131 | 和小屋 | `template_relation_incompatible` | `data/processed_questions/2013_専門1_建筑构法_Q2.md` — 「・せん断力・引抜き力・引張力・圧縮力・摩擦力・曲げモーメント・大きい・小さい・本実・留め・矧ぎ・洋小屋・和小屋・耐力壁・帳壁・小舞壁・破れ目地・芋目地・透かし目地・臥梁・まぐさ・幅木・台輪・スチフナ・添柱・管柱・通し柱」<br>`data/processed_questions/2014_専門1_建筑构法_Q3.md` — 「可能な接合部。 2) 上をかもいにはめ込み、下を敷居の溝にはめ落して建具などを建て込む方法。 3) 和小屋において、側柱の頂部に直接小屋梁を載せ、その上に軒桁を渡す架構法。 4) 和小屋において、側柱の上に軒桁を架け、その上に小屋梁を載せる架構法。 5) 階段の段板を受けるため、上辺を」 | 现有原型限定 RC 躯体施工／纳まり；“和小屋”的可定位证据属于木构、钢构、屋面、外墙或空间结构关系，不能与 RC seed pool 稳定构成同域 surplus。 |
| 132 | 扠首組（さすぐみ） | `source_link_missing` | 未找到：`data/processed_questions/*専門1*建筑构法*.md`；`data/construction-exam-answers.json` 的该术语精确检索结果为 无命中。 | Atomic Fact 留有 sourceId 1783752565458 和出现年份 2018，但没有连到本地 Specialist 1 原题／答案项的明确来源链接。 |

### Reconciliation

- `source_link_missing`: **37**
- `answer_index_missing`: **1**
- `definition_not_atomic`: **35**
- `term_not_answerable`: **27**
- `template_relation_incompatible`: **10**
- `recoverable_with_existing_sources`: **1**
- `requires_new_source`: **0**
- **Total: 111 / 111**

No seed-pool fact was changed. No RC semantic-association fact was merged.

## Evidence repair — 39 A/B/F candidates

Repair record is maintained in `common-term-repair-result.md`. It records source file, source location, original question, indexed answer, independent-definition test, relation/distractor compatibility, duplicate check, and failed gate for all 39 in-scope candidates.

| Result | Count | Seed pool before → after |
| --- | ---: | --- |
| `repaired_and_promoted` | 0 | 27 → 27 |
| `repaired_but_rejected` | 1 | 27 → 27 |
| `unresolved` | 38 | 27 → 27 |
| `duplicate` | 0 | 27 → 27 |
| **Total** | **39** | **27 → 27** |

All entries above cite concrete local paths when a hit exists; otherwise they record the exact Specialist 1 source glob and answer-index lookup that produced no match. No seed fact was added and the RC semantic-association pack remains untouched.

## Active RC manual-candidate Generator pressure test — final gate

The five active candidates formerly marked `manual_judgment_required` were inserted individually into actual calls of `generateRCSharedWordBank` and tested only against the current 33 reviewed RC seed terms and the compatible-domain registry.  The registry contributed no RC-compatible distractors; its listed terms remain in separate domains.

| Candidate | Intended relation | Legal 3-distractor sets / 5 attempts | Final status | Specific failed gate |
| --- | --- | ---: | --- | --- |
| コンクリート側圧 | `load_effect` → `formwork_resistance` | 0 / 5 | `template_incompatible` | No reviewed same-grain load/action terms; all available alternatives are components, properties, or defects. |
| 打込み | `construction_stage` → `placement_sequence` | 0 / 5 | `template_incompatible` | No three reviewed fresh-concrete stage terms; using other pending candidates would be circular. |
| 締固め | `construction_stage` → `placement_sequence` | 0 / 5 | `template_incompatible` | Available terms are properties/components/results; 豆板 is a result, so a peer relation would require inference. |
| 養生 | `construction_stage` → `post_placement_care` | 0 / 5 | `template_incompatible` | No reviewed post-placement-care peers; defect/durability terms are not same-grain distractors. |
| 付着 | `component_relation` → `steel_concrete_composite_action` | 0 / 5 | `template_incompatible` | 定着長さ and 重ね継手 are a length/joint, not interface relations; they create near-repeat ambiguity rather than legal peers. |

Actual execution: 25 calls (five deterministic seeds per candidate) each with a non-persistent 27-term test subset made of 26 reviewed facts plus the candidate.  Every call returned 20 unique answers, 27 unique bank terms, seven surplus terms, and no exception.  The current full 33-term seed input still throws `RC shared-word-bank requires 27 unique reviewed facts`, because the function has a fixed 27-fact guard.  This is recorded as an existing integration constraint, not solved in this audit.

| Result | Count | Seed pool before → after |
| --- | ---: | --- |
| `promoted` | 0 | 33 → 33 |
| `limited_relation_candidate` | 0 | 33 → 33 |
| `template_incompatible` | 5 | 33 → 33 |

Detailed attempted term sets and the run evidence are in `common-term-manual-pressure-test.md`. No seed-pool fact was added and the independent RC semantic-association pack was not modified.

## Atomic decomposition — 35 definition_not_atomic candidates

Detailed source-backed decomposition results are in `common-term-atomic-decomposition.md`. Each of the 35 original candidates is retained as an audit row; only explicit source-supported terms were considered as new atomic candidates.

| generated_atomic_candidates | promoted | rejected | duplicate | incompatible_domain | seed pool before → after |
| ---: | ---: | ---: | ---: | ---: | --- |
| 32 | 0 | 16 | 9 | 23 | 27 → 27 |

No seed-pool write occurred. The independent RC semantic-association package was not read or modified. E-class terms and 山留め壁と切り梁 are retained only in the deferred compatible-domain registry.

## Active RC candidate audit — 11 candidates

The active-extraction audit is recorded in `common-term-active-audit.md`; only the 11 active RC candidates were evaluated. No old 132-candidate item was reopened.

| promoted | manual_judgment_required | rejected | duplicate | incompatible_domain | seed_pool_before | seed_pool_after |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 6 | 5 | 0 | 0 | 0 | 27 | 33 |
