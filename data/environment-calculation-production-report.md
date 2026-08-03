# Environment Numerical Calculation — Production Report

**Phase 5A**

## Pilot Results

| Metric | Value | Target |
|--------|-------|--------|
| Questions generated | 12 | 12 |
| Avg structural similarity | 4.9 | ≥4.0 |
| Avg knowledge validity | 5.0 | 5.0 |
| Zero-issue questions | 12/12 | ≥10 |
| Keep | 12 | ≥10 |
| Revise | 0 | — |
| Reject | 0 | ≤1 |

## Status: Production ready

## Per-Family Breakdown

| Family | Questions | Avg Structural | Exams |
|--------|-----------|---------------|-------|
| dynamic_pressure | 2 | 4.6 | 2/13 |
| illuminance_point | 2 | 5.0 | 5/13 |
| reverberation | 2 | 5.0 | 5/13 |
| thermal_transmission | 3 | 5.0 | 5/13 |
| ventilation_co2 | 3 | 5.0 | 8/13 |

## Decision

**Environment numerical_calculation is production ready.**


## Smallest releasable subset

The following families are safe for Mock Exam release:
- **dynamic_pressure**: 動圧 (2/13 years, avg 4.6)
- **illuminance_point**: 点光源の照度 (5/13 years, avg 5.0)
- **reverberation**: 残響時間 (5/13 years, avg 5.0)
- **thermal_transmission**: 熱貫流率 (5/13 years, avg 5.0)
- **ventilation_co2**: 換気·CO2濃度 (8/13 years, avg 5.0)
