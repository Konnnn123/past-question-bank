# `building-construction-full` Generator Audit

审计对象：`/exam/mock/building-construction-full`。本报告只描述当前实现；不把数据文件中写作 “production_ready” 的状态当作运行时 Generator 证据。

## 审计结论

当前页面是 **预写题目包的受限抽样／拼接器**，不是基于 Atomic Facts 的正式 Generator。页面只在 [`page.tsx`](../src/app/exam/mock/building-construction-full/page.tsx#L7)–[L9](../src/app/exam/mock/building-construction-full/page.tsx#L9) 读取三个固定 JSON；它没有导入或调用 `atomic-fact-store.ts`，也没有在运行时构造题干、数值、干扰项或语群。

因此下文中的 `Prompt Dynamic?`、`Fact Dynamic?` 和 `Distractor Dynamic?` 均按“运行时生成”而非“过去曾人工写过一个新题版本”判定。

## 1. Question Origin Audit

| Question Type | Past Exam Prototype | Prompt Dynamic? | Fact Dynamic? | Distractor Dynamic? | Only Shuffle? |
| --- | --- | --- | --- | --- | --- |
| 材料数值选择 | 2015 Q2；2017/2018/2020/2025 Q3 的数值题块 | 否。`building-construction-numerical-pilot.json` 的 `prompt` 固定 | 否。固定 `questions[]` | 否。每题 `options[]` 固定 | 否。每次从固定数组洗牌后取最多 4 个不同 `correctAnswer`；数值、题干、选项均不变 |
| 共通语群填空 | 2022 Q3（20 空、27 词、7 surplus）；题型家族也见 2013/2016/2019 | 否。20 个 `items[].prompt` 固定 | 否。固定 `items[]` | 否。27 个 `wordBank[]` 固定 | 是，且连顺序也不洗牌：全部固定 20 题、固定语群每次原样进入 |
| 用语短答 | 2014 Q3（20 独立术语） | 否。固定 `items[].prompt` | 否。固定 20 题数组 | 不适用（文本输入） | 否。运行时从固定数组洗牌后取 6 个，并按答案字符串排除已用答案 |
| 局部四选一填空 | 2024 Q3（20 空、每空 4 个局部选项） | 否。固定题干 | 否。固定 20 题数组 | 否。每题 `choices[]` 固定 | 否。运行时从固定数组洗牌后取 6 个；四个选项不重新构造 |
| 屋架图标签语群 | 2016 Q2 的 7 个屋架标签 | 否。固定 7 个定义题干及固定源图 | 否。固定 7 个标签事实 | 否。7 词语群固定 | 实质上是。候选正好为 7、要求也为 7，因此只改变显示顺序，题目集合不变 |
| 建筑师—结构形式照合 | 2020 Q3（10 对） | 否。固定关系提示 | 否。固定 10 对关系 | 否。固定 9 词语群 | 否。运行时从固定数组洗牌后取 5 个；词语群不重建 |
| 限定作图说明 | 2015 Q12/Q13（2 项） | 否。固定两份提示／量规 | 否。固定人工审核草案 | 不适用 | 否。与 2026 对比作图题合并后，固定 10 项中洗牌取 3 项 |
| 对比作图说明 | 2026 Q3（8 对术语） | 否。固定 8 对及量规 | 否。固定人工审核草案 | 不适用 | 否。与 2015 两项合并后，固定 10 项中洗牌取 3 项 |

固定来源分别是：

- [`data/building-construction-numerical-pilot.json`](../data/building-construction-numerical-pilot.json#L8) 的 `questions[]`；
- [`data/building-construction-shared-wordbank-generated-v1.json`](../data/building-construction-shared-wordbank-generated-v1.json#L6)–[L7](../data/building-construction-shared-wordbank-generated-v1.json#L7) 的 `wordBank[]` 与 `items[]`；
- [`data/building-construction-production-formats-v1.json`](../data/building-construction-production-formats-v1.json#L7)–[L71](../data/building-construction-production-formats-v1.json#L71) 的各 `items[]`、`choices[]` 和 `rubric[]`。

## 2. Full Mock Structure Audit

“48 道自动核对题 + 3 道作图题”不是来自单一年份的过去问统计比例，而是 `assembleBuildingConstructionMock()` 的人工 bundle：

| 当前块 | 当前数量 | 真实题块证据 | 对应程度 |
| --- | ---: | --- | --- |
| 材料数值 | 4 | 2018 Q3 为 9；2020 Q3 为 10；2025 Q3 为 6 | 任意截取，不是原题块大小 |
| 共通语群 | 20 | 2013 Q2 为 20；2016 Q2 为 23；2019 Q3 为 10；2022 Q3 为 20 | 与 2022 的数量一致 |
| 用语短答 | 6 | 2014 Q3 为 20 | 任意截取 |
| 局部四选一 | 6 | 2024 Q3 为 20 | 任意截取 |
| 屋架图标签 | 7 | 2016 Q2 为 7 | 与 2016 图题块一致 |
| 结构形式照合 | 5 | 2020 Q3 为 10 | 任意截取 |
| 作图说明 | 3 | 2015 Q12/Q13 为 2 个独立任务；2026 Q3 为 8 对 | 跨年份、跨原型合并后任意抽取 |

题型证据记录在 [`building-construction-s1-format-audit.json`](../data/building-construction-s1-format-audit.json#L5)–[L20](../data/building-construction-s1-format-audit.json#L20)。当前总数由代码的 `4 + 20 + 6 + 6 + 7 + 5 + 3` 直接决定，见 [`building-construction-mock.ts`](../src/lib/building-construction-mock.ts#L23)–[L29](../src/lib/building-construction-mock.ts#L29)，而非由频率矩阵、年份样本或某个真题总卷蓝图计算。

**正式标记：`practice_bundle`，不是 `full_mock_exam`。** 页面当前的 `full` 名称不应被理解为“过去问同构的完整模拟考试”。

## 3. Generator Pipeline Evidence

当前实际流水线如下。箭头后的“缺失”是审计结论，不是建议功能。

| Pipeline stage | 当前实际实现 | 证据 | 判定 |
| --- | --- | --- |
| Past Exam Template | 静态 JSON 中的 `prototype.source`／数量元数据 | formats 数据 L7、L32、L57、L61、L65、L71；shared 数据 L4 | 有静态原型引用 |
| Eligible Atomic Fact Pool | 无 | 完整页只读取三个 JSON（page L7–L9）；无 Atomic Fact Store 调用 | 缺失 |
| Domain Filtering | 无题域过滤函数；`domain` 未被组卷器读取 | `assembleBuildingConstructionMock()` L19–L29 | 缺失 |
| Fact Selection | 对预写 `items[]` 做 `seededShuffle()`／`pickUnique()` | `seededShuffle()` L8；`pickUnique()` L13；调用 L23–L29 | 题库抽样，不是事实选择 |
| Question Composition | 无。仅将既有 item 放入 `MockBlock` | L31–L38 | 缺失 |
| Distractor Construction | 无。直接携带固定 `options[]` 或固定 `wordBank[]` | L23 的 `choices: item.options`；L32 的 `wordBank: data.shared.wordBank` | 缺失 |
| Uniqueness Validation | 仅按标准化答案字符串排除部分抽样项；数值题按 `correctAnswer` 去重 | `pickUnique()` L13–L16；数值过滤 L23 | 有限的答案去重；非 Fact/关系/干扰项验证 |
| Output | `MockBlock[]`，前端展示；作答后调用 `saveAttempt()` | 组卷器 L19；客户端 L21–L24 | 有输出与作答记录 |

所以，没有任何当前题型满足完整的 “Past Exam Template → Eligible Atomic Fact Pool → Domain Filtering → Fact Selection → Question Composition → Distractor Construction → Uniqueness Validation → Output” 正式 Generator 流程。

### 逐类真实流程

- **数值／短答／四选一／结构形式／作图**：`固定题目数组 → seededShuffle/pickUnique → MockBlock → UI`。标记为 `question_bank_sampler`。
- **共通语群／屋架图标签**：`固定完整题组 → MockBlock → UI`；共通语群连洗牌也没有。标记为 `manual_draft`。
- **RC 语义关联独立页**：它读取 `building-construction-rc-association-generated-v1.json` 的固定题组；虽有离线 projection／reviewed-fact 文件，但完整卷没有调用它，运行时也没有 Atomic Fact 查询或组成函数。标记为 `manual_draft`，不应称为正式 Generator。
- **原题重建页**：`/exam/reconstruction/building-construction-association` 仅核验原题结构。标记为 `past_exam_reconstruction`。

## 4. Shared Word Bank Audit

| 检查项 | 结果 | 证据／说明 |
| --- | --- | --- |
| 题干是否由 Atomic Facts 运行时改写 | 否 | 固定 `items[].prompt` 由 page 直接读 JSON；无改写函数 |
| 每次是否从单一题域抽取 | 否 | 数据声明 `primaryDomain: building_construction_integrated`，且 20 项横跨 foundation、facade、concrete、masonry、timber、finish、life-cycle 等多个 `domain`；组卷器不读取这些字段 |
| word bank 是否动态建立 | 否 | 固定 27 词 `wordBank[]` 直接传给输出块（组卷器 L32） |
| surplus terms 来源 | 未实现为可追溯池 | 只有静态 27 词和 `surplusCount: 7`；没有 surplus-pool 查询、筛选或构造函数 |
| 是否执行复用规则 | 否 | JSON 的 `reuseAllowed: true` 只是元数据。UI 不限制重复选择，但组卷器也不按任何“某词须复用 N 次”的规则构造答案 |
| 是否验证每个空答案唯一 | 只在离线静态数据中验证 | JSON 的 `validation.uniqueAnswers: true` 表示当前 20 个预写答案唯一；运行时不验证。并且这与 2022 所声明的“允许复用”并不等价 |
| 2015 原型如何影响该块 | 不影响 | 2015 的原型是 grouped numeric／semantic association，不进入 shared block |
| 2017 原型如何影响该块 | 不影响 | 2017 的原型是 10 个 semantic association + 10 个数值题，不进入 shared block |
| 实际采用的原型 | 仅 2022 Q3 | 固定 20 空、27 词、7 surplus 的元数据 |

### 三个 seed 的实际比较

以下按当前 `assembleBuildingConstructionMock()` 的同一算法运行 seed 1、2、3：

| Block | Seed 1 | Seed 2 | Seed 3 | 实际变化 |
| --- | --- | --- | --- | --- |
| numeric | strength-04, expansion-02, strength-02, expansion-03 | strength-03, strength-06, modulus-03, density-03 | density-05, modulus-03, density-01, density-04 | 预写题目的抽样 |
| shared | swb-01…swb-20 | swb-01…swb-20 | swb-01…swb-20 | **无变化**：题干、答案、语群、顺序均固定 |
| short | sa15, sa05, sa11, sa07, sa18, sa02 | sa02, sa01, sa12, sa17, sa04, sa05 | sa19, sa15, sa07, sa11, sa13, sa02 | 预写题目的抽样 |
| inline | mc02, mc01, mc12, mc17, mc05, mc06 | mc19, mc15, mc07, mc11, mc13, mc06 | mc17, mc15, mc07, mc19, mc13, mc06 | 预写题目的抽样；选项不变 |
| diagram | 全部 dl01…dl07（顺序不同） | 全部 dl01…dl07（顺序不同） | 全部 dl01…dl07（顺序不同） | 仅顺序变化 |
| image | im07, im05, im06, im10, im04 | im01, im03, im02, im05, im10 | im02, im10, im06, im08, im01 | 预写题目的抽样 |
| written | ex01, cp01, ex02 | ex02, cp08, cp05 | ex01, cp01, cp08 | 预写人工审核草案的抽样 |

三个 seed 中 **没有** Atomic Fact 变化、题干文本变化、数值参数变化、干扰项变化或 word-bank 变化。

## 5. Classification

| 当前资产／题型 | 诚实分类 | 原因 |
| --- | --- | --- |
| 建筑构法原题关联重建页 | `past_exam_reconstruction` | 目的为原题结构核验，不生成新知识组合 |
| 数值选择（完整卷中的 4 题） | `question_bank_sampler` | 固定题干、答案、选项；仅取样 |
| 共通语群填空 | `manual_draft` | 一个固定的 20 空／27 词预写题组，每次原样输出 |
| 用语短答 | `question_bank_sampler` | 固定 20 项中取 6 项 |
| 局部四选一填空 | `question_bank_sampler` | 固定 20 项中取 6 项，固定四选项 |
| 屋架图标签 | `manual_draft` | 固定 7 标签与固定图；只改顺序 |
| 结构形式照合 | `question_bank_sampler` | 固定 10 对中取 5 对，固定语群 |
| 限定作图说明 | `question_bank_sampler` | 固定草案／量规中取题，人工评分 |
| 对比作图说明 | `question_bank_sampler` | 固定草案／量规中取题，人工评分 |
| RC 语义关联“generated-v1”独立页 | `manual_draft` | 离线可追溯事实已用于写出固定题组，但运行时没有事实池、组成或干扰项构造 |
| `parameterized_variant` | 无 | 当前完整卷不替换任何数值参数、实体、题干模板或选项 |
| `atomic_fact_generator` | 无 | 当前完整卷中没有该类型 |

## Required final answers

1. 当前是否可以正式称为“完整模拟卷”  
   **不可以。** 它应称为 `practice_bundle`。

2. 多少题是真正动态生成的  
   **0 题。**

3. 多少题只是预写题库抽样  
   **24 个输出槽位**：21 道自动题（4 数值 + 6 短答 + 6 四选一 + 5 照合）加 3 道人工题。另有 27 个固定预写槽位（20 共通语群 + 7 图标签），它们甚至不是抽样，只是固定草案／顺序洗牌。

4. 哪些题型已达到正式 Generator 标准  
   **没有。**

5. 下一步只修哪一个最高优先级缺口  
   **共通语群填空的 Atomic-Fact、单题域、受限 surplus-pool 正式生成链。** 它目前占 20/48 个自动核对题，却在不同 seed 间完全不变，且没有运行时事实选择或语群构造。
