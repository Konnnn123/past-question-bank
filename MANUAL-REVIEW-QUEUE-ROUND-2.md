# Manual review queue — round 2

Only unresolved decisions are listed. `ready_for_human_recheck` means the requested revision is complete from repository evidence; it is **not** approval.

| ID | 修订后的事实 | relation | 三个具体干扰项 | 每项为何为假 | 来源 | 决定 |
|---|---|---|---|---|---|---|
| HR-001 | 2014/2018 Q5 的逐空答案映射尚无仓库答案索引，不能从语群本身推断。 | description → indexed answer | — | 没有逐空索引即不能证明任一项为假。 | `data/processed_questions/2014_専門1_建筑史_Q5.md`; `2018_専門1_建筑史_Q5.md`; targeted answer-file search found no index | missing_source_material |
| HR-002 | 2015 Q3 含多个空位；仓库没有该题的建筑—作者—年代—样式答案索引。 | building → architect/year/style | — | 冲突导入记录不能作为反证。 | `data/processed_questions/2015_専門1_建筑史_Q3.md`; `data/history-review-index.tsv`; targeted answer-file search found no index | missing_source_material |
| PL-001 | 设施不同不等于特征为假；安全白名单为空，因没有目标设施的明确否定/排他性来源。 | facility → has_feature | Forum building；Shizuoka Newspaper/Broadcasting building；Palace Side building | 三者只证明自身特征，不证明目标设施不具特征。 | `data/planning-facility-safe-distractor-whitelist.json` | blocked_no_safe_distractors |
| BC-002 | 2024 Q3 已拆为 a–t 共 20 个 slot，逐项记录答案、类型、来源和允许变体。 | inline_context → slot-specific answer | 豆板/透湿防水/逆打ち工法（仅在不匹配的 slot） | 分别为混凝土缺陷、防水材料/细部、地下施工法；不可跨类型回答。 | `data/construction-2024-q3-slot-review.json` | ready_for_human_recheck |
| EN-DEF-002 | 空气自进入室内起，到达室内某一点所经历的平均时间。 | phenomenon → 空気齢 | 空気の寿命；余命；換気効率 | 分别是离开/残留相关量或效率指标，不是到达平均时间。 | `data/建築環境工学_総合知識档案.md:862` | ready_for_human_recheck |
| EN-DEF-003 | 温度差换气中室内外压差为零的位置或高度。 | phenomenon → 中性帯 | 無風帯；緩衝帯；局所換気 | 均不表示温差换气的室内外等压位置。 | `data/建築環境工学_総合知識档案.md:258` | ready_for_human_recheck |
| EN-CS-002 | 短路流会降低有效换气效率。 | airflow pattern → ventilation effectiveness | 必要换气量只按室容积决定；第一种换气必然避免短路流；名义 ACH 高必然代表有效换气高 | 分别忽略污染发生量/允许浓度差、气流路径、换气效率。 | `data/correct-statement-prototypes.json:cs-environment-02`; `data/misconception-library.json:env-mis-002,env-mis-007` | ready_for_human_recheck |
| EN-CS-003 | 墙表面温度低于露点温度时发生表面结露。 | surface temperature → condensation condition | 室温高于露点即可排除所有结露；室内侧防湿层可完全防止内部结露；表面温度高于露点仍必然结露 | 分别混淆表面温度、将防湿层效果绝对化、直接否定露点判定。 | `data/correct-statement-prototypes.json:cs-environment-03`; `data/misconception-library.json:env-mis-005,env-mis-008` | ready_for_human_recheck |
