# 建筑计划完整模拟卷：逐题来源审计

审计对象：`/exam/mock/planning-full` 的当前 seed `1`，共 24 题。审计依据为 `src/app/exam/mock/planning-full/page.tsx`、`src/lib/planning-full-mock.ts`、`data/planning-exam-answers.json`、`data/processed_questions/2023_専門1_建筑计划_Q問題4.md`、`data/planning-numeric-pilot.json`、`scripts/planning-numeric-generator.py` 和 `data/atomic-facts.json`。

## 总结

- 题 1–20：逐项直接复现 2023 专门1建筑计划 Q4 的题干与 A–D 选项；**题目分类为 `past_exam_reconstruction`**。组卷器在可用的整组 20 小问原题之间做 seeded shuffle，这个行为只属于**组卷层的 `question_bank_sampler`**，不改变每题分类。
- 题 21–24：运行时只从 `data/planning-numeric-pilot.json` 的 12 条预写记录中 shuffle/slice；**当前运行时分类为 `question_bank_sampler`**，而不是 `atomic_fact_generator`。页面中的 `sourceType: "parameterized_variant"` 是静态标签，不是运行时的生成证据。
- 数值文件由 `scripts/planning-numeric-generator.py` 曾以 Atomic Facts 的 `standard_value` relation 离线写出；但运行时没有读取 Atomic Facts、没有重建 relation、没有动态选择带 provenance 的 distractor facts。故不得把这 4 题计入正式 Generator release gate。
- `eligible atomic facts`：四条数值题引用的 facts 都是 `reviewStatus: unreviewed` 且 `usableBlueprints: []`，因此四题均为 **否**。20 道原题重建也不从 eligible fact pool 取材。

## 逐题记录

| # / item id | 当前代码标签 | 实际分类 | 题干来源 | 答案来源 | 选项／干扰项来源 | Eligible Atomic Facts | Relation 动态建立 | 新题 | Past exam template |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 `light:planning:2023_専門1_建筑计划_Q問題4.md#s01` | `past_exam_reconstruction` | `past_exam_reconstruction` | `2023_専門1_建筑计划_Q問題4.md#s01` | `planning-exam-answers.json` 同 item（C：西山夘三） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 2 `...#s02` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s02` | 同答案索引（D：晴海高層アパート） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 3 `...#s03` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s03` | 同答案索引（A：コモンシティ星田） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 4 `...#s04` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s04` | 同答案索引（B：真野ふれあい住宅） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 5 `...#s05` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s05` | 同答案索引（B：30床） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 6 `...#s06` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s06` | 同答案索引（B：1.0m） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 7 `...#s07` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s07` | 同答案索引（C：神戸市立西神戸医療センター） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 8 `...#s08` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s08` | 同答案索引（C：特別養護老人ホーム） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 9 `...#s09` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s09` | 同答案索引（C：25㎡） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 10 `...#s10` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s10` | 同答案索引（B：3.5m） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 11 `...#s11` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s11` | 同答案索引（C：150cm） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 12 `...#s12` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s12` | 同答案索引（A：エドワード・ホール） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 13 `...#s13` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s13` | 同答案索引（A：西戸山小学校） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 14 `...#s14` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s14` | 同答案索引（A：笠原小学校） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 15 `...#s15` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s15` | 同答案索引（D：BDS） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 16 `...#s16` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s16` | 同答案索引（A：オルケストラ） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 17 `...#s17` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s17` | 同答案索引（B：シューボックス型） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 18 `...#s18` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s18` | 同答案索引（D：キンベル美術館） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 19 `...#s19` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s19` | 同答案索引（A：霞ヶ関ビル） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 20 `...#s20` | `past_exam_reconstruction` | `past_exam_reconstruction` | 同原题 `#s20` | 同答案索引（C：中央型） | 原题 A–D | 否 | 否 | 否 | `planning_facility_fact_recall` |
| 21 `plan-num-09` | `parameterized_variant` | `question_bank_sampler` | 预写 `planning-numeric-pilot.json` | `fact-11a6de79d629`（客席部分の床面積 = 0.5–0.7㎡/席；`unreviewed`） | 同预写记录的 3 个字符串；运行时没有 distractor fact id | 否 | 否 | 是，精确题干不在 past exam | `planning_inline_numeric_select`（2022 Q4 型） |
| 22 `plan-num-03` | `parameterized_variant` | `question_bank_sampler` | 同预写数值文件 | `fact-572dbf734e63`（保育室床面積；`unreviewed`） | 同预写记录的 3 个字符串；来源 id 已丢失 | 否 | 否 | 是 | `planning_inline_numeric_select` |
| 23 `plan-num-08` | `parameterized_variant` | `question_bank_sampler` | 同预写数值文件 | `fact-d45d23cf30e0`（増沢洵邸；`unreviewed`） | 同预写记录的 3 个字符串；其中有近重复文本，运行时不审计 | 否 | 否 | 是 | `planning_inline_numeric_select` |
| 24 `plan-num-07` | `parameterized_variant` | `question_bank_sampler` | 同预写数值文件 | `fact-9becb3ab9fbf`（視覚障害通路の床に段差がある場合；`unreviewed`） | 同预写记录的 3 个字符串；来源 id 已丢失 | 否 | 否 | 是 | `planning_inline_numeric_select` |

## Release-gate consequence

| Item class | Current count | Counts as formal atomic-fact generator? |
| --- | ---: | --- |
| 原题逐项重建 | 20 | 否 |
| 运行时预写数值池抽样 | 4 | 否 |
| 正式 `atomic_fact_generator` | 0 | — |

因此建筑计划目前只有“可作答的原题重建/题库抽样卷”，没有可计入正式 Generator release gate 的题目。不得以 seeded shuffle、年份切换、或离线脚本曾使用 Atomic Facts 为由把它称为运行时正式 Generator。
