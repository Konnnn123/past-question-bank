from __future__ import annotations

import collections
import hashlib
import json
from pathlib import Path


def main() -> None:
    source = json.loads(Path("data/architecture-candidates.json").read_text(encoding="utf-8"))
    mapping = json.loads(Path("data/architecture-normalization-map.json").read_text(encoding="utf-8"))
    merges = mapping["nameMerges"]
    merge_by_id = {source_id: canonical for canonical, ids in merges.items() for source_id in ids}
    grouped: dict[str, dict] = {}
    alias_hits = collections.Counter()

    for building in source["buildings"]:
        original_id = building["id"]
        canonical_name = merge_by_id.get(original_id, building["name"]["ja"])
        target = grouped.setdefault(canonical_name, json.loads(json.dumps(building)))
        stable_id = hashlib.sha1(canonical_name.encode("utf-8")).hexdigest()[:12]
        target["id"] = f"building-{stable_id}"
        target["name"]["ja"] = canonical_name
        target["qualityFlags"] = list(dict.fromkeys(target.get("qualityFlags", [])))
        if original_id != target.get("id"):
            target.setdefault("mergedSourceIds", []).append(original_id)
        raw_style = building.get("rawAnki", {}).get("style", "")
        normalized_styles = []
        for style in [item.strip() for item in raw_style.replace("、", ",").split(",") if item.strip()]:
            normalized = mapping["styleAliases"].get(style, style)
            if normalized != style:
                alias_hits[f"{style} -> {normalized}"] += 1
            normalized_styles.append(normalized)
        target["normalizedStyleNames"] = sorted(set(target.get("normalizedStyleNames", []) + normalized_styles))
        topic_ids = [mapping.get("styleTopicIds", {}).get(style) for style in target["normalizedStyleNames"]]
        target["styleIds"] = sorted(set(item for item in topic_ids if item and item.startswith("style-")))
        target["movementIds"] = sorted(set(item for item in topic_ids if item and item.startswith("movement-")))
        target["typeIds"] = sorted(set(target.get("typeIds", []) + [item for item in topic_ids if item and item.startswith("type-")]))
        raw_people = [item.strip() for item in building.get("rawAnki", {}).get("people", "").replace("、", ",").split(",") if item.strip()]
        normalized_people = [mapping.get("personAliases", {}).get(person, person) for person in raw_people]
        target["normalizedPersonNames"] = sorted(set(target.get("normalizedPersonNames", []) + normalized_people))
        name = building.get("name", {}).get("ja", "")
        history = building.get("history", {}).get("ja", "")
        corpus = " ".join([name, history, raw_style])
        type_ids = set(target.get("typeIds", []))
        if any(word in corpus for word in ["神社", "本殿", "鳥居", "造"]):
            if any(style in target["normalizedStyleNames"] for style in ["流造", "春日造", "権現造"]):
                type_ids.add("type-shrine")
        if any(word in corpus for word in ["寺", "寺院", "金堂", "仏堂", "伽藍", "大仏"]):
            type_ids.add("type-buddhist-temple")
        if any(word in corpus for word in ["教会", "聖堂", "大聖堂", "チャペル", "バシリカ"]):
            type_ids.add("type-church")
        if any(word in corpus for word in ["寝殿", "書院", "茶室", "邸", "住宅", "自邸"]):
            type_ids.add("type-residential")
        if any(word in corpus for word in ["集合住宅", "アパート", "団地", "カプセルタワー"]):
            type_ids.add("type-collective-housing")
        if any(word in corpus for word in ["美術館", "博物館", "図書館", "劇場", "裁判所", "議事堂", "役所"]):
            type_ids.add("type-civic-cultural")
        if any(word in corpus for word in ["城", "城郭", "天守", "宮殿"]):
            type_ids.add("type-fortification" if any(word in corpus for word in ["城", "城郭", "天守"]) else "type-aristocratic-residence")
        if any(word in corpus for word in ["凱旋門", "記念堂", "記念碑", "陵墓", "ピラミッド"]):
            type_ids.add("type-monument-tomb")
        target["typeIds"] = sorted(type_ids)

    result = {
        "version": 1,
        "source": "architecture-candidates",
        "normalizationMap": "data/architecture-normalization-map.json",
        "buildings": list(grouped.values()),
        "stats": {
            "inputBuildings": len(source["buildings"]),
            "outputBuildings": len(grouped),
            "mergedBuildings": len(source["buildings"]) - len(grouped),
            "styleAliasHits": dict(alias_hits),
        },
    }
    Path("data/architecture-normalized-candidates.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    report = [
        "# 建筑规范化第一轮结果",
        "",
        f"- 输入建筑：{result['stats']['inputBuildings']}",
        f"- 输出实体：{result['stats']['outputBuildings']}",
        f"- 合并数量：{result['stats']['mergedBuildings']}",
        "",
        "## 样式别名命中",
        "",
    ]
    report.extend(f"- {name}: {count}" for name, count in alias_hits.items())
    report += ["", "## 合并实体", ""]
    for canonical, ids in merges.items():
        report.append(f"- {canonical}: {', '.join(ids)}")
    Path("data/architecture-normalization-result.md").write_text("\n".join(report) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
