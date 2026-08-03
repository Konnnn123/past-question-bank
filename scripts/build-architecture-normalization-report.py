from __future__ import annotations

import collections
import json
from pathlib import Path


def split_values(value: str) -> list[str]:
    value = value.replace("、", ",").replace("；", ",").replace(";", ",")
    return [item.strip() for item in value.split(",") if item.strip()]


def main() -> None:
    source = json.loads(Path("data/architecture-candidates.json").read_text(encoding="utf-8"))
    buildings = source["buildings"]
    styles = collections.Counter()
    people = collections.Counter()
    periods = collections.Counter()
    names = collections.defaultdict(list)
    for building in buildings:
        raw = building["rawAnki"]
        styles.update(split_values(raw.get("style", "")))
        people.update(split_values(raw.get("people", "")))
        periods[building["period"]["ja"]] += 1
        names[building["name"]["ja"]].append(building["id"])

    lines = [
        "# 建筑实体规范化工作台",
        "",
        "此报告只统计候选库，不自动判定事实。样式、人物和重复名称需要结合建筑史资料逐项确认。",
        "",
        f"- 建筑候选：{len(buildings)}",
        f"- 唯一建筑名称：{len(names)}",
        f"- 重复名称：{sum(1 for ids in names.values() if len(ids) > 1)}",
        "",
        "## 重复建筑名称",
        "",
    ]
    for name, ids in sorted(names.items(), key=lambda item: (-len(item[1]), item[0])):
        if len(ids) > 1:
            lines.append(f"- {name}: {', '.join(ids)}")
    lines += ["", "## 样式／运动原始值（按频率）", ""]
    lines.extend(f"- {name}: {count}" for name, count in styles.most_common())
    lines += ["", "## 人物原始值（按频率）", ""]
    lines.extend(f"- {name}: {count}" for name, count in people.most_common())
    lines += ["", "## 年代原始值（按频率）", ""]
    lines.extend(f"- {name or '(空)'}: {count}" for name, count in periods.most_common())
    Path("data/architecture-normalization-report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
