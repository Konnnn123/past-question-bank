# Environment Numerical Calculation — Pilot Questions (Fixed)

## env-calc-ventilation_co2-01 — ventilation_co2
**Structural:** 5.0/5 | **Exam:** 8/13年出題

### Question
室内のCO2発生量を 0.02 m³/h、室内許容濃度を 818.0 ppm、
外気濃度を 383.0 ppm とする。
定常状態における1人当たりの必要換気量 [m³/h] を求めなさい。

### Assumptions
- 定常状態
- 完全混合
- 室内CO2発生のみ

### Answer: 46.0 m³/h

### Worked Solution
Ci = 818.0 ppm = 0.000818
Co = 383.0 ppm = 0.000383
Q = G / (Ci − Co) = 0.02 / (0.000818 − 0.000383) = 0.02 / 0.000435 = 46.0 m³/h

**Validation:** PASS | **Steps:** 2

---

## env-calc-ventilation_co2-02 — ventilation_co2
**Structural:** 5.0/5 | **Exam:** 8/13年出題

### Question
室内のCO2発生量を 0.013 m³/h、室内許容濃度を 1316.0 ppm、
外気濃度を 503.0 ppm とする。
定常状態における1人当たりの必要換気量 [m³/h] を求めなさい。

### Assumptions
- 定常状態
- 完全混合
- 室内CO2発生のみ

### Answer: 16.0 m³/h

### Worked Solution
Ci = 1316.0 ppm = 0.001316
Co = 503.0 ppm = 0.000503
Q = G / (Ci − Co) = 0.013 / (0.001316 − 0.000503) = 0.013 / 0.000813 = 16.0 m³/h

**Validation:** PASS | **Steps:** 2

---

## env-calc-ventilation_co2-03 — ventilation_co2
**Structural:** 5.0/5 | **Exam:** 8/13年出題

### Question
室内のCO2発生量を 0.023 m³/h、室内許容濃度を 861.0 ppm、
外気濃度を 427.0 ppm とする。
定常状態における1人当たりの必要換気量 [m³/h] を求めなさい。

### Assumptions
- 定常状態
- 完全混合
- 室内CO2発生のみ

### Answer: 53.0 m³/h

### Worked Solution
Ci = 861.0 ppm = 0.000861
Co = 427.0 ppm = 0.000427
Q = G / (Ci − Co) = 0.023 / (0.000861 − 0.000427) = 0.023 / 0.000434 = 53.0 m³/h

**Validation:** PASS | **Steps:** 2

---

## env-calc-thermal_transmission-01 — thermal_transmission
**Structural:** 5.0/5 | **Exam:** 5/13年出題

### Question
外壁の熱伝達抵抗：外気側 0.03 m²·K/W、室内側 0.1 m²·K/W
断熱材：厚さ 0.126 m、熱伝導率 0.031 W/(m·K)
コンクリート：厚さ 0.12 m、熱伝導率 1.6 W/(m·K)
この壁の熱貫流率 U 値 [W/(m²·K)] を求めなさい。

### Assumptions
- 定常状態
- 一次元熱伝導
- 接触抵抗無視

### Answer: 0.23 W/(m²·K)

### Worked Solution
R1(断熱材) = d1/λ1 = 0.126/0.031 = 4.065 m²·K/W
R2(コンクリート) = d2/λ2 = 0.12/1.6 = 0.075 m²·K/W
R_total = ho + R1 + R2 + hi = 0.03 + 4.065 + 0.075 + 0.1 = 4.27 m²·K/W
U = 1 / R_total = 1 / 4.27 = 0.23 W/(m²·K)

**Validation:** PASS | **Steps:** 3

---

## env-calc-thermal_transmission-02 — thermal_transmission
**Structural:** 5.0/5 | **Exam:** 5/13年出題

### Question
外壁の熱伝達抵抗：外気側 0.05 m²·K/W、室内側 0.1 m²·K/W
断熱材：厚さ 0.138 m、熱伝導率 0.054 W/(m·K)
コンクリート：厚さ 0.101 m、熱伝導率 1.8 W/(m·K)
この壁の熱貫流率 U 値 [W/(m²·K)] を求めなさい。

### Assumptions
- 定常状態
- 一次元熱伝導
- 接触抵抗無視

### Answer: 0.36 W/(m²·K)

### Worked Solution
R1(断熱材) = d1/λ1 = 0.138/0.054 = 2.556 m²·K/W
R2(コンクリート) = d2/λ2 = 0.101/1.8 = 0.056 m²·K/W
R_total = ho + R1 + R2 + hi = 0.05 + 2.556 + 0.056 + 0.1 = 2.762 m²·K/W
U = 1 / R_total = 1 / 2.762 = 0.36 W/(m²·K)

**Validation:** PASS | **Steps:** 3

---

## env-calc-thermal_transmission-03 — thermal_transmission
**Structural:** 5.0/5 | **Exam:** 5/13年出題

### Question
外壁の熱伝達抵抗：外気側 0.05 m²·K/W、室内側 0.1 m²·K/W
断熱材：厚さ 0.073 m、熱伝導率 0.059 W/(m·K)
コンクリート：厚さ 0.134 m、熱伝導率 0.9 W/(m·K)
この壁の熱貫流率 U 値 [W/(m²·K)] を求めなさい。

### Assumptions
- 定常状態
- 一次元熱伝導
- 接触抵抗無視

### Answer: 0.65 W/(m²·K)

### Worked Solution
R1(断熱材) = d1/λ1 = 0.073/0.059 = 1.237 m²·K/W
R2(コンクリート) = d2/λ2 = 0.134/0.9 = 0.149 m²·K/W
R_total = ho + R1 + R2 + hi = 0.05 + 1.237 + 0.149 + 0.1 = 1.536 m²·K/W
U = 1 / R_total = 1 / 1.536 = 0.65 W/(m²·K)

**Validation:** PASS | **Steps:** 3

---

## env-calc-reverberation-01 — reverberation
**Structural:** 5.0/5 | **Exam:** 5/13年出題

### Question
室容積 284.0 m³、等価吸音面積 427.0 m² の室について、
Sabine の残響式を用いて残響時間 [s] を求めなさい。

### Assumptions
- 拡散音場
- Sabineの残響式適用可能

### Answer: 0.11 s

### Worked Solution
T₆₀ = 0.161 × V / A = 0.161 × 284.0 / 427.0 = 45.7 / 427.0 = 0.11 s

**Validation:** PASS | **Steps:** 2

---

## env-calc-reverberation-02 — reverberation
**Structural:** 5.0/5 | **Exam:** 5/13年出題

### Question
室容積 1247.0 m³、等価吸音面積 407.0 m² の室について、
Sabine の残響式を用いて残響時間 [s] を求めなさい。

### Assumptions
- 拡散音場
- Sabineの残響式適用可能

### Answer: 0.49 s

### Worked Solution
T₆₀ = 0.161 × V / A = 0.161 × 1247.0 / 407.0 = 200.8 / 407.0 = 0.49 s

**Validation:** PASS | **Steps:** 2

---

## env-calc-illuminance_point-01 — illuminance_point
**Structural:** 5.0/5 | **Exam:** 5/13年出題

### Question
光度 1514.0 cd の点光源が、光源から受照点までの直線距離 3.1 m、
入射角 58.0° で水平面を照らしている。反射を無視したとき、
水平面照度 [lx] を求めなさい。

### Assumptions
- 点光源
- 直射光のみ（反射無視）

### Answer: 83.0 lx

### Worked Solution
cos θ = cos(58.0°) = 0.53
E = I × cosθ / r² = 1514.0 × 0.53 / 3.1² = 802.4 / 9.610000000000001 = 83.0 lx

**Validation:** PASS | **Steps:** 2

---

## env-calc-illuminance_point-02 — illuminance_point
**Structural:** 5.0/5 | **Exam:** 5/13年出題

### Question
光度 881.0 cd の点光源が、光源から受照点までの直線距離 3.2 m、
入射角 50.0° で水平面を照らしている。反射を無視したとき、
水平面照度 [lx] を求めなさい。

### Assumptions
- 点光源
- 直射光のみ（反射無視）

### Answer: 55.0 lx

### Worked Solution
cos θ = cos(50.0°) = 0.643
E = I × cosθ / r² = 881.0 × 0.643 / 3.2² = 566.5 / 10.240000000000002 = 55.0 lx

**Validation:** PASS | **Steps:** 2

---

## env-calc-dynamic_pressure-01 — dynamic_pressure
**Structural:** 4.6/5 | **Exam:** 2/13年出題

### Question
空気密度 1.2 kg/m³、風速 13.2 m/s の気流の
動圧 [Pa] を求めなさい。

### Assumptions
- 非圧縮性流体
- 定常流

### Answer: 104.5 Pa

### Worked Solution
q = ρ × v² / 2 = 1.2 × 13.2² / 2 = 1.2 × 174.23999999999998 / 2 = 104.5 Pa

**Validation:** PASS | **Steps:** 2

---

## env-calc-dynamic_pressure-02 — dynamic_pressure
**Structural:** 4.6/5 | **Exam:** 2/13年出題

### Question
空気密度 1.2 kg/m³、風速 11.2 m/s の気流の
動圧 [Pa] を求めなさい。

### Assumptions
- 非圧縮性流体
- 定常流

### Answer: 75.3 Pa

### Worked Solution
q = ρ × v² / 2 = 1.2 × 11.2² / 2 = 1.2 × 125.43999999999998 / 2 = 75.3 Pa

**Validation:** PASS | **Steps:** 2

---
