# `building-construction-full` 运行时逐题来源审计

审计对象：`assembleBuildingConstructionMock(data, 1)` 的完整运行结果（48 道自动题 + 3 道人工题）。实际读取链为：

`page.tsx` → `building-construction-shared-wordbank-generated-v1.json` + `building-construction-production-formats-v1.json` + `building-construction-numerical-pilot.json` → `assembleBuildingConstructionMock`。

它**没有读取** `building-construction-rc-shared-wordbank-facts.json`、`building-construction-rc-reviewed-facts.json` 或 `building-construction-rc-association-generated-v1.json`。因此这些独立模块的 fact-pool / projection / association 证据不能归入本完整卷。

## 分类判据与结果

- `past_exam_reconstruction`：仅屋架图 7 题。它使用 2016 专门1构法 Q2 已确认原图、七个原标签和答案索引。
- `question_bank_sampler`：其余 44 题。运行时只从预写 JSON 项目 shuffle、slice 或直接渲染；既不构造 facts，也不构造 relations 或 distractors。
- `parameterized_variant`：0。数值块的数据文件可能由离线脚本产出变体，但完整卷运行时仅抽取固定记录，不能以历史脚本取代运行时 Generator。
- `atomic_fact_generator`：0。

`*` 表示属于静态人工草案/预写题库，但在本审计指定的四分法中，运行时行为只能归为 `question_bank_sampler`。

## 逐题表（seed = 1）

字段顺序：`id｜调用/读取｜题干｜答案｜干扰项｜实际分类｜模板｜eligible facts｜运行时 relation｜运行时 distractor｜seed 作用｜新事实组合｜结构力学`

| # | 逐题记录 |
| --- | --- |
| 1 | `building-const-strength-04`｜`numeric`→`seededShuffle(data.numeric)`｜预写 `building-construction-numerical-pilot.json`｜同记录 `correctAnswer`｜同记录 `options`｜`question_bank_sampler`｜2015/2018 S1 Q2/Q3 材料数值｜无 eligible pool；无 fact id｜否｜否｜4/18 固定记录改选｜否（基于过去问材料值）｜否 |
| 2 | `building-const-expansion-02`｜同上｜预写数值文件｜同记录｜同记录 options｜`question_bank_sampler`｜2020 S1 Q3 材料数值｜无 eligible pool｜否｜否｜同上｜否｜否 |
| 3 | `building-const-strength-02`｜同上｜预写数值文件｜同记录｜同记录 options｜`question_bank_sampler`｜2018 S1 Q3 材料数值｜无 eligible pool｜否｜否｜同上｜否｜否 |
| 4 | `building-const-expansion-03`｜同上｜预写数值文件｜同记录｜同记录 options｜`question_bank_sampler`｜2020 S1 Q3 材料数值｜无 eligible pool｜否｜否｜同上｜否｜否 |
| 5 | `swb-01`｜`shared.items` 直接渲染｜预写 shared JSON｜同记录 answer｜固定 27 词 bank｜`question_bank_sampler`｜2022 S1 Q3 共通语群原型｜无；文件仅 `source_audited` 标签｜否｜否；surplus 是固定余项｜seed 不变｜是，跨域静态组合｜否 |
| 6 | `swb-02`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 7 | `swb-03`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 8 | `swb-04`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 9 | `swb-05`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 10 | `swb-06`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 11 | `swb-07`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 12 | `swb-08`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 13 | `swb-09`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 14 | `swb-10`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 15 | `swb-11`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 16 | `swb-12`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 17 | `swb-13`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 18 | `swb-14`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 19 | `swb-15`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 20 | `swb-16`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 21 | `swb-17`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 22 | `swb-18`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 23 | `swb-19`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 24 | `swb-20`｜同上｜预写 shared JSON｜同记录｜固定 bank｜`question_bank_sampler`｜2022 S1 Q3｜无｜否｜否｜不变｜是｜否 |
| 25 | `sa15`｜`pickUnique(scoped_term_short_answer.items,6)`｜预写 production formats｜同记录 accepted｜无｜`question_bank_sampler`｜2014 S1 Q3 短答原型｜无 fact 字段/筛选｜否｜不适用｜从 20 静态项选择｜无法证明逐字原题；按预写项使用｜否 |
| 26 | `sa05`｜同上｜预写 formats｜同记录｜无｜`question_bank_sampler`｜2014 S1 Q3｜无｜否｜不适用｜同上｜同上｜否 |
| 27 | `sa11`｜同上｜预写 formats｜同记录｜无｜`question_bank_sampler`｜2014 S1 Q3｜无｜否｜不适用｜同上｜同上｜否 |
| 28 | `sa07`｜同上｜预写 formats｜同记录｜无｜`question_bank_sampler`｜2014 S1 Q3｜无｜否｜不适用｜同上｜同上｜否 |
| 29 | `sa18`｜同上｜预写 formats｜同记录｜无｜`question_bank_sampler`｜2014 S1 Q3｜无｜否｜不适用｜同上｜同上｜否；`降伏`是材料行为，非 Euler 座屈 |
| 30 | `sa02`｜同上｜预写 formats｜同记录｜无｜`question_bank_sampler`｜2014 S1 Q3｜无｜否｜不适用｜同上｜同上｜否 |
| 31 | `mc02`｜`pickUnique(inline_four_choice_fill.items,6)`｜预写 formats｜同记录 answer｜同记录 choices｜`question_bank_sampler`｜2024 S1 Q3 四选一原型｜无 fact 字段/筛选｜否｜否｜从 20 静态项选择｜无法证明逐字原题｜否 |
| 32 | `mc01`｜同上｜预写 formats｜同记录｜同记录 choices｜`question_bank_sampler`｜2024 S1 Q3｜无｜否｜否｜同上｜同上｜否 |
| 33 | `mc12`｜同上｜预写 formats｜同记录｜同记录 choices｜`question_bank_sampler`｜2024 S1 Q3｜无｜否｜否｜同上｜同上｜否 |
| 34 | `mc17`｜同上｜预写 formats｜同记录｜同记录 choices｜`question_bank_sampler`｜2024 S1 Q3｜无｜否｜否｜同上｜同上｜否 |
| 35 | `mc05`｜同上｜预写 formats｜同记录｜同记录 choices｜`question_bank_sampler`｜2024 S1 Q3｜无｜否｜否｜同上｜同上｜否 |
| 36 | `mc06`｜同上｜预写 formats｜同记录｜同记录 choices｜`question_bank_sampler`｜2024 S1 Q3｜无｜否｜否｜同上｜同上｜否 |
| 37 | `dl02`｜`diagram_label_word_bank.items` 直接渲染｜2016 S1 Q2 已确认源图和原标签｜源图答案索引/固定 record｜同一 7 标签 bank｜`past_exam_reconstruction`｜2016 S1 Q2 屋架图标签｜不使用 Atomic Facts；asset `source_asset_verified`｜否｜否；bank 固定且无 surplus｜seed 不变（整组 7 题）｜否｜否 |
| 38 | `dl04`｜同上｜同源图｜同答案索引｜同固定 bank｜`past_exam_reconstruction`｜2016 S1 Q2｜无｜否｜否｜不变｜否｜否 |
| 39 | `dl07`｜同上｜同源图｜同答案索引｜同固定 bank｜`past_exam_reconstruction`｜2016 S1 Q2｜无｜否｜否｜不变｜否｜否 |
| 40 | `dl06`｜同上｜同源图｜同答案索引｜同固定 bank｜`past_exam_reconstruction`｜2016 S1 Q2｜无｜否｜否｜不变｜否｜否 |
| 41 | `dl03`｜同上｜同源图｜同答案索引｜同固定 bank｜`past_exam_reconstruction`｜2016 S1 Q2｜无｜否｜否｜不变｜否｜否 |
| 42 | `dl01`｜同上｜同源图｜同答案索引｜同固定 bank｜`past_exam_reconstruction`｜2016 S1 Q2｜无｜否｜否｜不变｜否｜否 |
| 43 | `dl05`｜同上｜同源图｜同答案索引｜同固定 bank｜`past_exam_reconstruction`｜2016 S1 Q2｜无｜否｜否｜不变｜否｜否 |
| 44 | `im07`｜`pickUnique(image_form_matching.items,5)`｜预写 formats item；不是 source photograph｜固定 record answer｜固定 9 词 bank｜`question_bank_sampler`｜2020 S1 Q3 结构形式照合原型｜无 fact 字段/筛选｜否｜否｜从 10 静态项选 5，避免答案重复｜是，使用静态重写 relation｜否（仅结构形式/构法认知，无计算） |
| 45 | `im05`｜同上｜预写 formats｜固定 record｜固定 bank｜`question_bank_sampler`｜2020 S1 Q3｜无｜否｜否｜同上｜是｜否 |
| 46 | `im06`｜同上｜预写 formats｜固定 record｜固定 bank｜`question_bank_sampler`｜2020 S1 Q3｜无｜否｜否｜同上｜是｜否 |
| 47 | `im10`｜同上｜预写 formats｜固定 record｜固定 bank｜`question_bank_sampler`｜2020 S1 Q3｜无｜否｜否｜同上｜是｜否 |
| 48 | `im04`｜同上｜预写 formats｜固定 record｜固定 bank｜`question_bank_sampler`｜2020 S1 Q3｜无｜否｜否｜同上｜是｜否 |
| 49 | `ex01`｜`seededShuffle(written).slice(0,3)`｜固定人工草案 `diagram_constrained_explanation`｜人工量规（非客观答案）｜不适用｜`question_bank_sampler`*｜2015 S1 Q12/Q13 作图说明原型｜无｜否｜不适用｜从 2+8 静态草案选 3｜是，静态改写题干｜否 |
| 50 | `cp01`｜同上｜固定人工草案 `diagram_comparison_explanation`｜固定量规｜不适用｜`question_bank_sampler`*｜2026 S1 Q3 对比说明原型｜无｜否｜不适用｜同上｜是，静态改写题干｜否 |
| 51 | `ex02`｜同上｜固定人工草案 `diagram_constrained_explanation`｜固定量规｜不适用｜`question_bank_sampler`*｜2015 S1 Q12/Q13｜无｜否｜不适用｜同上｜是，静态改写题干｜否 |

## 统计与关键结论

| 分类 | 自动题 | 人工题 | 合计 |
| --- | ---: | ---: | ---: |
| `past_exam_reconstruction` | 7 | 0 | 7 |
| `question_bank_sampler` | 41 | 3 | 44 |
| `parameterized_variant` | 0 | 0 | 0 |
| `atomic_fact_generator` | 0 | 0 | 0 |
| 总计 | 48 | 3 | 51 |

### 被误标为 Generator 的项目

1. `building-construction-shared-wordbank-generated-v1.json` 标记 `production_ready` 和 `source_audited`，但完整卷直接渲染固定 20/27 集合；不读取 live 33-fact pool，不重新选答案或 surplus。
2. `building-construction-production-formats-v1.json` 多个 family 标记 `production_ready`，但完整卷只从静态 `items` 数组选择。
3. `building-construction-numerical-pilot.json` 是静态题库；完整卷不会在运行时改参数、提取 Atomic Fact、或构造新数值干扰项。
4. RC semantic association 的已审核 pack 有独立证据链，但**没有被此完整卷加载**；不得把它记入 `building-construction-full` 的 Generator 数量。

### Structural Mechanics 检查

对完整卷三份实际加载 JSON 和运行时组卷结果搜索：`Euler`、`Buckling`、`Pcr`、`EI`、`second_moment`、`断面二次`、`座屈`、`構件安定`，结果均为 0。没有 Euler 座屈荷重、有效座屈长度、断面二次矩或构件稳定计算混入。

`降伏`、`フランジ`、CFT、デッキプレート、ハンチ、Gerber/Vierendeel 等出现于材料、部件或结构形式认知；它们不是上述 Structural Mechanics 的计算题。但 `image_form_matching` 应在后续单独审查其是否应保留在构法的内容边界，不能借此称作 mechanics generator。

## 最小修复建议（本轮未实施）

1. 从完整卷 release gate 中移除“Generator 已完成”的叙述；当前计数为 0。
2. 将完整卷标记为 `practice_bundle` / 静态题库重组，直到每个声称的 generator 运行时实际读取 reviewed eligible facts、动态建立 relation、并记录干扰项 provenance。
3. 若要纳入 live RC 共通语群，只能由 `building-construction-shared-wordbank-generator.ts` 的 33 条 reviewed pool 生成；不得继续读取 `shared-wordbank-generated-v1.json` 冒充它。
4. 数值题要么诚实保持 static sampler，要么建立 fact-id、review status、relation、同粒度干扰项 fact-id 与运行时参数选择链。材料强度/允许应力度可留在构法，座屈/Pcr/EI/I 不得入池。
