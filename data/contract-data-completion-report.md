# Contract Data Completion Report

**Generated:** 2026-07-17 23:00:03

## 1. Peer Scoring

### architect_to_work (0→2)
+2 同地域 · +2 同建筑类型 · +2 同流派 · +1 年代相近 · +1 同用途

### component_to_function (0→2)
+3 同knowledgeFamily · +2 同entityGranularity · +1 同材料体系

## 2. Construction has_function Facts

Created 72 function facts from 149 definitions.

Families: {}

## 3. Environment Formula Audit

5 issues found in formula_text facts:
- `fact-91f60e0fcf86`: 非定常濃度減衰 — criterion_marked_as_calculation → suggest change expressionType
  domain=general etype=conservation_relation value=`C(t) − Cₒ = (C₀ − Cₒ)e⁻Qᵗ⁄ⱽ`
- `fact-37150a9adef3`: 定常温度差 — criterion_marked_as_calculation → suggest change expressionType
  domain=thermal etype=conservation_relation value=`ΔT = q / (ρcₚQ)`
- `fact-2b5e7827a402`: 表面結露判定 — quantity_name_as_formula_value → suggest entityName (already correct)
  domain=moisture etype=criterion value=`θₛᵢ < θdp → 結露`
- `fact-4999562d1f9a`: 内部結露判定 — quantity_name_as_formula_value → suggest entityName (already correct)
  domain=moisture etype=criterion value=`f(x) > fₛ[θ(x)] → 内部結露`
- `fact-1ced34a3b68d`: 放射の収支 — criterion_marked_as_calculation → suggest change expressionType
  domain=thermal etype=conservation_relation value=`α + ρ + τ = 1`

## 4. Round 3B Sample (12 questions)

### r3b-arch-01 — architect_to_work

**Prompt:** 次の建築家の代表作として最も適切なものを選びなさい。

ハンス・ペルツィヒ
**Answer Field:** value · **SemanticType:** building_name

**Distractor Peer Scores:**
- アインシュタイン塔: score=5 (region:europe, style_overlap:{'ドイツ表現主義'}, period_close:20世紀初頭~20世紀初頭)
- ガラスの家 Glaspavillon: score=5 (region:europe, style_overlap:{'ドイツ表現主義'}, period_close:20世紀初頭~20世紀初頭)
- ウィーン王立劇場ブルク劇場: score=4 (region:europe, period_close:20世紀初頭~19世紀後半, use:{'劇場'})

---

### r3b-arch-02 — architect_to_work

**Prompt:** 次の建築家の代表作として最も適切なものを選びなさい。

ル・コルビュジエ
**Answer Field:** value · **SemanticType:** building_name

**Distractor Peer Scores:**
- ソーン自邸: score=4 (region:japan, style_overlap:{'新古典主義建築'})
- 琵琶湖疏水運河橋: score=2 (region:japan)
- マルケルス劇場: score=2 (region:japan)

---

### r3b-arch-03 — architect_to_work

**Prompt:** 次の建築家の代表作として最も適切なものを選びなさい。

サン＝ベルナール（クレルヴォーのベルナール）
**Answer Field:** value · **SemanticType:** building_name

**Distractor Peer Scores:**
- オルシヴァルのノートル＝ダム教会堂: score=5 (region:europe, style_overlap:{'ロマネスク建築'}, use:{'教会'})
- モンマジュール修道会教会堂: score=5 (region:europe, style_overlap:{'ロマネスク建築'}, use:{'教会'})
- カルドナのサン ヴィセンス参事会教会堂: score=5 (region:europe, style_overlap:{'ロマネスク建築'}, use:{'教会'})

---

### r3b-comp-01 — component_to_function

**Prompt:** 次の建築構法部材の主な機能として最も適切なものを選びなさい。

アンカーボルト（S造柱脚）
**Answer Field:** value · **SemanticType:** function_description

**Distractor Peer Scores:**
- 高力ボルト接合: score=3 (granularity:component, material:{'ボルト'})
- 普通ボルト接合: score=3 (granularity:component, material:{'ボルト'})

---

### r3b-comp-02 — component_to_function

**Prompt:** 次の建築構法部材の主な機能として最も適切なものを選びなさい。

平板載荷試験
**Answer Field:** value · **SemanticType:** function_description

**Distractor Peer Scores:**
- Pcaの方式: score=2 (granularity:component)
- タイル張り: score=2 (granularity:component)
- 帯筋: score=2 (granularity:component)

---

### r3b-comp-03 — component_to_function

**Prompt:** 次の建築構法部材の主な機能として最も適切なものを選びなさい。

セパレーター
**Answer Field:** value · **SemanticType:** function_description

**Distractor Peer Scores:**
- Pcaの方式: score=2 (granularity:component)
- タイル張り: score=2 (granularity:component)
- 帯筋: score=2 (granularity:component)

---

### r3b-plan-01 — description_to_pattern

**Prompt:** 次の空間的特徴に該当するパターンを選びなさい。

オイルショック後の価値観見直しを背景に、地域性を生かした公共住宅計画を目指した。 地域ごとの需要に応じた住宅供給策定計画として画期的。 具体例：続き間、開放的な土間玄関、バルコニーアクセス、通風配慮、積雪地のサンルームや雁木など。 景観形成：建築高、
**Answer Field:** entityName · **SemanticType:** pattern_name

**Peer Basis:** shared useType=housing, conceptLevel=spatial_pattern

---

### r3b-plan-02 — description_to_pattern

**Prompt:** 次の空間的特徴に該当するパターンを選びなさい。

ニュー・アーバニズム を代表する 計画都市 。 歩行圏 、 混合用途 、 街路と広場 、 伝統的な街区・建築コード を重視する。
**Answer Field:** entityName · **SemanticType:** pattern_name

**Peer Basis:** shared useType=urban, conceptLevel=spatial_pattern

---

### r3b-plan-03 — description_to_pattern

**Prompt:** 次の空間的特徴に該当するパターンを選びなさい。

廊下の長さを短くするために べッドの向きを斜めにしてある
**Answer Field:** entityName · **SemanticType:** pattern_name

**Peer Basis:** shared useType=hospital, conceptLevel=spatial_pattern

---

### r3b-env-01 — quantity_to_calculation_formula

**Prompt:** 「等価吸音面積」を計算する式として最も適切なものを選びなさい。
**Answer Field:** value · **SemanticType:** formula_string

**Distractor Sources:**
- A: correct
- B: verified_peer:室間音圧レベル差
- C: mutated:sign_flip
- D: verified_peer

---

### r3b-env-02 — quantity_to_calculation_formula

**Prompt:** 「直列開口の有効開口面積」を計算する式として最も適切なものを選びなさい。
**Answer Field:** value · **SemanticType:** formula_string

**Distractor Sources:**
- A: correct
- B: verified_peer:風圧差
- C: mutated:square_root
- D: verified_peer

---

### r3b-env-03 — quantity_to_calculation_formula

**Prompt:** 「相当外気温度」を計算する式として最も適切なものを選びなさい。
**Answer Field:** value · **SemanticType:** formula_string

**Distractor Sources:**
- A: correct
- B: verified_peer:黒体放射
- C: mutated:sign_flip
- D: verified_peer

---

