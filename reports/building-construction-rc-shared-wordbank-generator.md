# RC 共通语群填空：Atomic-Fact 原型

本交付冻结 2022 专門1建筑构法 Q3 的结构：20 空、27 个同域词、7 个 surplus；答案复用规则为“允许但本版不强制”。它是有限 seed pool 原型，不是正式 Generator。

运行时链路：不少于 27 条审核 RC 构造 Atomic Facts → `generateRCSharedWordBank()` 按 seed 无重复抽取 27 条本卷事实 → 前 20 条作为答案事实、后 7 条作为同域 surplus → 从事实的 `statement` 和动态框架组成题干 → 重排 27 词语群 → 验证唯一答案与学科边界。

当前锁定状态为 `usable_with_limited_pool_diversity`：同一 seed 的抽样、surplus 和语群排序均可复现；不同 seed 会重新抽取本卷 27 条。surplus 仍是本卷 27 条内的答案余集；在池达到至少 60 条且实现独立 constrained selection 前，`production_ready=false`。Release gate 验证 seed 数量、27/20/7 结构、无重复、答案／surplus 分离、同 seed 确定性、完整池覆盖和 Generator 验证。运行：`npx --yes tsx scripts/validate-rc-shared-wordbank-generator.ts`。
