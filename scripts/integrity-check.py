"""Integrity check for the architecture history knowledge base."""
from __future__ import annotations
import json, re
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parent.parent

# Card ID pattern: style-xxx, movement-xxx, architect-xxx, type-xxx
CARD_ID_RE = re.compile(r'"(style-[a-z][a-z0-9-]*)"')
MOVE_ID_RE = re.compile(r'"(movement-[a-z][a-z0-9-]*)"')
ARCH_ID_RE = re.compile(r'"(architect-[a-z][a-z0-9-]*)"')
TYPE_ID_RE  = re.compile(r'"(type-[a-z][a-z0-9-]*)"')

def extract_card_ids(text: str) -> set[str]:
    ids = set()
    for pat in (CARD_ID_RE, MOVE_ID_RE, ARCH_ID_RE, TYPE_ID_RE):
        ids.update(pat.findall(text))
    return ids

def main():
    issues = []

    # ── 1. Load card IDs from TypeScript definition files ──
    src_dir = ROOT / "src" / "lib"
    card_def_files = [
        "history-learning-card-examples.ts",
        "history-style-cards.ts",
        "western-style-cards.ts",
        "shrine-style-cards.ts",
        "supplementary-style-cards.ts",
        "additional-history-style-cards.ts",
        "building-type-learning-cards.ts",
        "japanese-special-style-cards.ts",
        "history-gap-cards.ts",
        "history-movement-cards.ts",
        "history-architect-cards.ts",
        "history-architect-cards-western.ts",
        "history-architect-cards-japan.ts",
    ]

    all_card_ids: set[str] = set()
    id_to_file: dict[str, str] = {}

    for fname in card_def_files:
        fpath = src_dir / fname
        if not fpath.exists():
            issues.append(f"MISSING FILE: {fname}")
            continue
        text = fpath.read_text(encoding="utf-8")
        ids = extract_card_ids(text)
        # Detect duplicates WITHIN the same file only (cross-file refs are normal)
        # Check for repeated id: "xxx" or base("xxx" patterns (definition sites only)
        def_ids = set()
        # Match definition patterns: id:"xxx", base("xxx", ...,), card("xxx", ...,), etc.
        def_pat = re.compile(r'(?:^|\s)id:\s*"([^"]+)"')
        for m in def_pat.finditer(text):
            cid = m.group(1)
            if cid in def_ids:
                issues.append(f"DUPLICATE DEFINITION in {fname}: {cid}")
            def_ids.add(cid)
        # For compressed files, check first arg of helper functions
        helper_pat = re.compile(r'\b(?:base|card|c|make|movement|architect)\s*\(\s*"([^"]+)"', re.DOTALL)
        for m in helper_pat.finditer(text):
            cid = m.group(1)
            if cid in def_ids:
                issues.append(f"DUPLICATE DEFINITION in {fname}: {cid}")
            def_ids.add(cid)

        # Only definition sites count as defined cards. Using every card-shaped
        # string here would incorrectly treat broken relationship targets as
        # definitions and make the relationship audit self-validating.
        for cid in def_ids:
            all_card_ids.add(cid)
            id_to_file[cid] = fname

    print(f"[OK] Loaded {len(all_card_ids)} unique card IDs from {len(card_def_files)} files")

    # ── 2. Read building data ──
    links = json.loads((ROOT / "data" / "building-learning-card-links.json").read_text(encoding="utf-8"))
    buildings_data = json.loads((ROOT / "data" / "architecture-normalized-candidates.json").read_text(encoding="utf-8"))

    # ── 3. Buildings → card refs ──
    card_building_counts = Counter()
    for b in links["buildings"]:
        for cid in b["learningCardIds"]:
            card_building_counts[cid] += 1

    linked_count = sum(1 for b in links["buildings"] if b["learningCardIds"])
    unlinked_count = sum(1 for b in links["buildings"] if not b["learningCardIds"])
    print(f"[OK] Building-card links: {linked_count} linked, {unlinked_count} unlinked of {len(links['buildings'])}")

    # ── 4. Invalid building→card refs ──
    invalid_refs = Counter()
    for b in buildings_data["buildings"]:
        for field in ["styleIds", "movementIds"]:
            for cid in b.get(field, []):
                if cid not in all_card_ids:
                    invalid_refs[cid] += 1

    if invalid_refs:
        print(f"\n[WARN] Invalid building->card refs: {len(invalid_refs)} unique missing IDs")
        for cid, count in invalid_refs.most_common():
            print(f"   {cid}: {count} buildings")

    # ── 5. Cards without buildings ──
    style_mv_type_defs = {c for c in all_card_ids if c.startswith(("style-", "movement-", "type-"))}
    orphan_cards = {c for c in style_mv_type_defs if card_building_counts[c] == 0}

    if orphan_cards:
        print(f"\n[INFO] Style/movement/type cards without buildings ({len(orphan_cards)}):")
        for c in sorted(orphan_cards):
            print(f"   - {c}")

    # ── 6. Architect cards with works (via name map) ──
    arch_names = json.loads((ROOT / "data" / "architect-card-name-map.json").read_text(encoding="utf-8"))
    building_arch_person_ids = set()
    for b in buildings_data["buildings"]:
        for pid in b.get("architectIds", []):
            if pid:
                building_arch_person_ids.add(pid)

    recognized = set(arch_names.keys())
    unrecognized_people = building_arch_person_ids - recognized

    if unrecognized_people:
        print(f"\n[INFO] Unrecognized person IDs in buildings ({len(unrecognized_people)}):")
        for p in sorted(unrecognized_people):
            print(f"   - {p}")

    # ── 7. Check card-to-card relationship IDs ──
    # All card-id-format strings in source files should exist
    all_refs = set()
    for fname in card_def_files:
        fpath = src_dir / fname
        if fpath.exists():
            all_refs.update(extract_card_ids(fpath.read_text(encoding="utf-8")))

    known_exceptions = {"contemporary-technology-architecture", "theory-five-points"}
    orphan_refs = all_refs - all_card_ids - known_exceptions
    if orphan_refs:
        print(f"\n[WARN] Card IDs referenced but not defined ({len(orphan_refs)}):")
        for r in sorted(orphan_refs):
            print(f"   - {r}")

    # ── 8. Normalization map validation ──
    norm_map = json.loads((ROOT / "data" / "architecture-normalization-map.json").read_text(encoding="utf-8"))
    map_topic_ids = set(norm_map.get("styleTopicIds", {}).values())
    missing_map_targets = map_topic_ids - all_card_ids
    if missing_map_targets:
        print(f"\n[WARN] Normalization map targets non-existent cards ({len(missing_map_targets)}):")
        for t in sorted(missing_map_targets):
            print(f"   - {t}")

    # ── 9. Architect-card-name-map validation ──
    arch_name_targets = set(arch_names.values())
    missing_arch_targets = arch_name_targets - all_card_ids
    if missing_arch_targets:
        print(f"\n[WARN] Architect name map targets non-existent cards ({len(missing_arch_targets)}):")
        for t in sorted(missing_arch_targets):
            print(f"   - {t}")

    # ── 10. Summary ──
    print(f"\n{'='*60}")
    print("INTEGRITY CHECK SUMMARY")
    print(f"{'='*60}")
    print(f"Card IDs defined:       {len(all_card_ids)}")
    print(f"Total buildings:        {len(links['buildings'])}")
    print(f"Connected buildings:    {linked_count}")
    print(f"Unconnected:            {unlinked_count}")
    print(f"Cards with >=1 building:{len(card_building_counts)}")
    print(f"Orphan cards (no bldg): {len(orphan_cards)}")
    print(f"Invalid bldg->card IDs: {len(invalid_refs)}")
    print(f"Undefined refs in code: {len(orphan_refs)}")
    print(f"Map target errors:      {len(missing_map_targets) + len(missing_arch_targets)}")

    critical = len([i for i in issues if "DUPLICATE" in i]) + len(orphan_refs) + len(missing_map_targets) + len(missing_arch_targets) + len(invalid_refs)
    print(f"Critical issues:        {critical}")

    if issues:
        print(f"\nIssues:")
        for i in issues:
            print(f"   {i}")

    # ── 11. Write report ──
    lines = [
        "# Integrity Check Report",
        "",
        f"- Card IDs defined: {len(all_card_ids)}",
        f"- Buildings: {len(links['buildings'])}",
        f"- Connected: {linked_count}",
        f"- Unconnected: {unlinked_count}",
        f"- Cards with >=1 building: {len(card_building_counts)}",
        f"- Orphan cards (no buildings): {len(orphan_cards)}",
        "",
        "## Unlinked Buildings",
        "",
    ]
    for b in links["buildings"]:
        if not b["learningCardIds"]:
            lines.append(f"- {b['buildingNameJa']} ({b['buildingId']})")

    lines += ["", "## Orphan Cards (no buildings)", ""]
    for c in sorted(orphan_cards):
        lines.append(f"- {c}")

    if invalid_refs:
        lines += ["", "## Invalid Building->Card References", ""]
        for cid, count in invalid_refs.most_common():
            lines.append(f"- {cid}: {count} buildings")

    if orphan_refs:
        lines += ["", "## Undefined Referenced Card IDs", ""]
        for r in sorted(orphan_refs):
            lines.append(f"- {r}")

    if missing_map_targets:
        lines += ["", "## Normalization Map→Missing Cards", ""]
        for t in sorted(missing_map_targets):
            lines.append(f"- {t}")

    if issues:
        lines += ["", "## Issues", ""]
        for i in issues:
            lines.append(f"- {i}")

    (ROOT / "data" / "integrity-check-report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"\nReport: data/integrity-check-report.md")

if __name__ == "__main__":
    main()
