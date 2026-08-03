# Active RC Common-Term Audit

Scope: only the 11 records in `common-term-active-candidates.json`. Learning cards are accepted as this project's internal authoritative-textbook evidence layer; no URL or page-number requirement was applied.

## Summary

- `promoted`: **6**
- `manual_judgment_required`: **5**
- `rejected`: **0**
- `duplicate`: **0**
- `incompatible_domain`: **0**
- `seed_pool_before`: **27**
- `seed_pool_after`: **33**

## Item audit

| Candidate | Term | Evidence | Definition / unique answer | Relation & domain | Distractor check | Duplicate check | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| rc-active-001 | 型枠 | `high` | コンクリートを所定の形状・寸法に成形し、硬化まで側圧を受ける仮設の枠。 | 学习卡直接陈述定义与 relation；当前 RC 题域成立。 | 同じ型枠システムの部材名のみ（支保工・パイプサポート・せき板等）。型枠自体を満たす説明は除外。 | 原 27 条中无重复；本轮已作为新增 rcswb-28～33 写入。 | `promoted` |
| rc-active-002 | 支保工 | `high` | 打設時の荷重を下から支え、型枠を所定位置に保つ仮設支持系。 | 学习卡直接陈述定义与 relation；当前 RC 题域成立。 | 型枠支持の仮設部材のみ。側圧を直接受けるフォームタイや間隔保持のセパレーターとは役割を混同しない。 | 原 27 条中无重复；本轮已作为新增 rcswb-28～33 写入。 | `promoted` |
| rc-active-003 | パイプサポート | `high` | 型枠・支保工の構成で、打設時荷重を下方から支持する仮設支柱。 | 学习卡直接陈述定义与 relation；当前 RC 题域成立。 | 支保工系の部材名のみ。セパレーター、フォームタイ、せき板を正答にしない。 | 原 27 条中无重复；本轮已作为新增 rcswb-28～33 写入。 | `promoted` |
| rc-active-004 | コンクリート側圧 | `medium` | 未硬化コンクリートが型枠を外側へ押し開こうとして生じる圧力。 | 学习卡支持核心 relation；见人工判断缺口。 | 需人工确认：学习卡明确说明型枠承受侧压，但当前 pool 没有三个同粒度『荷重／作用』候选可稳定构成 surplus。 | 原 27 条中无重复或同义项。 | `manual_judgment_required` |
| rc-active-005 | 打込み | `medium` | フレッシュコンクリートを型枠内へ入れる施工段階。 | 学习卡支持核心 relation；见人工判断缺口。 | 需人工确认：学习卡明确支持打込み，但施工阶段词群的第三个同粒度干扰项尚未独立审核。 | 原 27 条中无重复或同义项。 | `manual_judgment_required` |
| rc-active-006 | 締固め | `medium` | 打込み後のコンクリートから空隙を減らし、密実にする施工段階。 | 学习卡支持核心 relation；见人工判断缺口。 | 需人工确认：学习卡明确支持締固め，但施工阶段词群的第三个同粒度干扰项尚未独立审核。 | 原 27 条中无重复或同义项。 | `manual_judgment_required` |
| rc-active-007 | 養生 | `medium` | 打設後、所要の硬化と性能を得るためにコンクリートの状態を管理する施工段階。 | 学习卡支持核心 relation；见人工判断缺口。 | 需人工确认：学习卡明确支持養生，但施工阶段词群的第三个同粒度干扰项尚未独立审核。 | 原 27 条中无重复或同义项。 | `manual_judgment_required` |
| rc-active-008 | 中性化 | `high` | コンクリートのアルカリ性が表面から低下して進行し、鉄筋の防錆環境を失わせる劣化現象。 | 学习卡直接陈述定义与 relation；当前 RC 题域成立。 | RC 劣化メカニズムのみ（中性化、腐食、収縮、ひび割れ）。施工部材名と混ぜない。 | 原 27 条中无重复；本轮已作为新增 rcswb-28～33 写入。 | `promoted` |
| rc-active-009 | 鉄筋腐食 | `high` | 中性化などで防錆環境が失われた後に生じ、RC の耐久性を損なう鉄筋の劣化。 | 学习卡直接陈述定义与 relation；当前 RC 题域成立。 | RC 劣化の原因／結果を分離し、施工工程名を干扰项にしない。 | 原 27 条中无重复；本轮已作为新增 rcswb-28～33 写入。 | `promoted` |
| rc-active-010 | 付着 | `medium` | 鉄筋とコンクリートが一体として力を伝達するための界面の結合関係。 | 学习卡支持核心 relation；见人工判断缺口。 | 需人工确认：学习卡明确支持钢筋—混凝土的付着关系；但与定着長さ、重ね継手等现有关系的唯一性边界需要人工确认。 | 原 27 条中无重复或同义项。 | `manual_judgment_required` |
| rc-active-011 | 乾燥収縮 | `high` | 硬化に伴ってコンクリートが徐々に収縮し、ひび割れの一因となる現象。 | 学习卡直接陈述定义与 relation；当前 RC 题域成立。 | 性状変化群のみ（収縮、硬化、ひび割れ）。欠陥名称や施工部材と混ぜない。 | 原 27 条中无重复；本轮已作为新增 rcswb-28～33 写入。 | `promoted` |

High candidates were promoted only where the learning card directly supports both definition and relation, the S1 cluster is explicit, and a stable same-domain distractor boundary exists. Medium candidates remain outside the seed pool.
