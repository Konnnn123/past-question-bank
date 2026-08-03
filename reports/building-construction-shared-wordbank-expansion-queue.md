# 共通语群事实池扩容审核队列

## 当前状态

- mechanism: `atomic_fact_based`
- readiness: `prototype`
- seed pool: 27 reviewed facts
- target: at least 60 approved facts; preferred 80–120
- distractor mode: `complement_only` (not production-ready)

RC 语义关联的 12 条事实不在本队列中，且未被合并。

## 资格门槛

候选必须同时满足：`subject=construction`、过去问出现证据、可独立作为术语答案、与共通语群允许 relation 兼容、可写成无上下文依赖的单空陈述、答案唯一、同域 surplus 兼容。任何一项不明即保持 candidate。

## 自动发现结果

从 528 条 construction Atomic Facts 中，按“有 `belongs_to` 与 `appears_in_exam` 记录”的宽筛条件发现 132 个术语候选。宽筛不是批准：中央 Atomic Fact 数据的 `reviewStatus` 仍主要为 `unreviewed`，且多数只有分类／年份事实，没有可直接出题的定义陈述。

优先人工审核队列（均为候选，未进入 seed pool）：

| 候选术语／主题 | 过去问证据年份 | 需要人工确认 |
| --- | --- | --- |
| 型枠 | 2019, 2023, 2026 | 是否能拆成单一、唯一的用语定义 |
| 鉄筋のかぶり厚さ | 2023, 2024 | 与现有「かぶり厚さ」去重／同义规则 |
| フレッシュコンクリートと打設 | 2013, 2014, 2022 | 主题必须拆成可答术语，不可整项入池 |
| コンクリート施工不良 | 2019, 2024 | 必须拆为具体且唯一的缺陷术语 |
| RC配筋の基本 | 2013, 2017, 2023, 2024 | 主题项，不可直接作为答案 |
| 独立フーチング基礎 | 2018, 2022 | 与 RC／基础题域边界及 relation 适配 |
| 布基礎 | 2018, 2022, 2025 | 同上；需独立陈述与混淆测试 |
| 根切り | 2022, 2024, 2026 | 施工阶段 relation 与 surplus 兼容性 |
| 山留め工法 | 2024, 2026 | 不得混入结构力学概念 |
| コンクリート杭 | 2022, 2025 | 题域可否与 RC 构造单域共存 |

## 晋升流程

`candidate → 人工核对来源与定义 → relation/slot 标注 → surplus compatibility 审核 → approved pool`。

达到至少 60 条 approved facts 前，不能将当前实现标记为正式 Generator；达到后还必须把 surplus 从“余集”改为独立的 constrained selection。

## 本轮审核结论

本轮对 132 个宽筛候选执行了第一道硬门槛：候选必须在现有 Atomic Fact 记录中同时具有可独立呈现的定义／关系陈述，而不能只有术语、分类和出现年份。当前 132 项均未通过这一门槛：记录提供的是 `belongs_to` 与 `appears_in_exam`，不足以证明一个唯一、无上下文依赖的填空陈述。

因此本轮晋升数为 **0**，approved seed pool 维持 **27**。这不是候选被否定，而是保持 `candidate`，等待逐条补入原题句、答案索引或可核对的教材证据后再审。RC 语义关联 12 条仍保持隔离。
