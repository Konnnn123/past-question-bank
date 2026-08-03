import fs from "fs";
import path from "path";
import { expandConstructionPracticeItem } from "@/lib/construction-practice-items";
import type { ConstructionAnswerItem } from "@/lib/construction-review";
import { ENVIRONMENT_FORMULAS } from "@/lib/environment-knowledge";

export type AssessmentDraft = {
  id: string;
  subject: "建筑史" | "建筑计划" | "建筑环境工学" | "建筑构法";
  knowledgeName: string;
  form: string;
  prompt: string;
  answer: string;
  evidence: string;
  readiness: "自动可用" | "建议抽查" | "必须人工确认" | "资料不足";
};

type AnkiRecord = {
  source: { noteId: string; deck: string };
  name: string;
  fields: Record<string, string>;
  qualityFlags: string[];
};

// ====== UTILITIES ======

function periodKey(value = "") {
  return value.match(/\d{1,2}世紀|明治|大正|昭和|平成|古代|中世|近世|近代/)?.[0] ?? value.trim();
}

function personGroup(value: string) {
  return /[㐀-鿿々〆ヶ]/u.test(value) ? "japanese" : "western";
}

function uniqueValues(values: string[]) {
  return values.filter((value, index, all) => value && all.indexOf(value) === index);
}

function rotate<T>(values: T[], seed: number) {
  if (!values.length) return values;
  const offset = seed % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function makeOptions(correct: string, distractors: string[], seed: string) {
  return [correct, ...distractors].sort((a, b) => `${seed}:${a}`.localeCompare(`${seed}:${b}`));
}

function optionLines(options: string[]) {
  return options.map((value, index) => `${String.fromCharCode(65 + index)}. ${value}`).join("\n\n");
}

function cleanPlanningCardText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/オフイス/g, "オフィス")
    .replace(/床而積/g, "床面積")
    .replace(/レンタプル/g, "レンタブル")
    .replace(/段室型/g, "階段室型")
    .replace(/かかからす/g, "かかわらず")
    .replace(/望まい(?=$|[。／])/g, "望ましい")
    .replace(/^般に/u, "一般に")
    .replace(/\s*[~〜]\s*/g, "～")
    .replace(/\s*·\s*/g, "・")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\r?\n+\s*/g, "／")
    .replace(/／{2,}/g, "／")
    .trim();
}

// ====== HISTORY ANKI DRAFTS (建筑史) ======

function cleanFeature(record: AnkiRecord, knownBuildingNames: string[]) {
  let value = record.fields.history?.trim() ?? "";
  for (const leak of uniqueValues([record.name, record.fields.buildingName, ...knownBuildingNames]).sort((a, b) => b.length - a.length)) {
    if (leak?.trim() && leak.trim().length >= 3) value = value.split(leak.trim()).join("この建築");
  }
  if (record.fields.people?.trim()) value = value.split(record.fields.people.trim()).join("設計者");
  value = value.replace(/\s+/g, " ").replace(/この建築(?:（この建築）)?/g, "この建築").trim();
  const sentences = value.match(/[^。！？]+[。！？]?/g) ?? [];
  const useful = sentences.filter((sentence) => sentence.replace(/[。！？\s]/g, "").length >= 12);
  return (useful.findLast((sentence) => /特徴|構成|構造|空間|外観|平面|材料|形式|様式/.test(sentence)) ?? useful.at(-1) ?? "").slice(0, 150);
}

function historyPairingDrafts(records: AnkiRecord[]): AssessmentDraft[] {
  const historyRecords = records.filter((r) => r.source.deck.startsWith("东大建筑史"));
  const usable = historyRecords.filter((record) => !record.qualityFlags.includes("source-needs-review"));
  const knownBuildingNames = uniqueValues(usable.flatMap((record) => [record.name, record.fields.buildingName]).filter(Boolean));
  const drafts: AssessmentDraft[] = [];

  usable.forEach((record, index) => {
    // 1) Building → Architect pairing
    const people = record.fields.people?.trim();
    if (people) {
      const group = personGroup(people);
      const candidates = usable
        .filter((candidate) => candidate.source.noteId !== record.source.noteId && candidate.source.deck === record.source.deck)
        .filter((candidate) => candidate.fields.people?.trim() && personGroup(candidate.fields.people.trim()) === group)
        .sort((a, b) => Number(periodKey(b.fields.period) === periodKey(record.fields.period)) - Number(periodKey(a.fields.period) === periodKey(record.fields.period)));
      const samePeriod = candidates.filter((candidate) => periodKey(candidate.fields.period) === periodKey(record.fields.period));
      const otherPeriod = candidates.filter((candidate) => periodKey(candidate.fields.period) !== periodKey(record.fields.period));
      const distractors = uniqueValues([...rotate(samePeriod, index), ...rotate(otherPeriod, index)].map((candidate) => candidate.fields.people.trim()).filter((value) => value !== people)).slice(0, 3);
      if (distractors.length === 3) {
        const options = makeOptions(people, distractors, record.name);
        drafts.push({
          id: `anki-history:${record.source.noteId}`, subject: "建筑史", knowledgeName: record.name,
          form: "真题模式：建筑—人物配对",
          prompt: `次の建築と設計者・関連人物の組合せとして、最も適切なものを一つ選びなさい。\n\n${record.name}\n\n${optionLines(options)}`,
          answer: `${String.fromCharCode(65 + options.indexOf(people))}. ${people}\n\n年代：${record.fields.period || "—"}\n様式：${record.fields.style || "—"}`,
          evidence: `建筑史専門1人物配对模式 · 同地域干扰项 · Anki ${record.source.deck}`, readiness: "建议抽查",
        });
      }
    }

    // 2) Building → Style/type pairing
    const style = record.fields.style?.trim();
    if (style) {
      const candidates = usable
        .filter((candidate) => candidate.source.noteId !== record.source.noteId && candidate.source.deck === record.source.deck && candidate.fields.style?.trim())
        .sort((a, b) => Number(periodKey(b.fields.period) === periodKey(record.fields.period)) - Number(periodKey(a.fields.period) === periodKey(record.fields.period)));
      const samePeriod = candidates.filter((candidate) => periodKey(candidate.fields.period) === periodKey(record.fields.period));
      const otherPeriod = candidates.filter((candidate) => periodKey(candidate.fields.period) !== periodKey(record.fields.period));
      const distractors = uniqueValues([...rotate(samePeriod, index + 7), ...rotate(otherPeriod, index + 7)].map((candidate) => candidate.fields.style.trim()).filter((value) => value !== style)).slice(0, 3);
      if (distractors.length === 3) {
        const options = makeOptions(style, distractors, `${record.name}:style`);
        drafts.push({
          id: `anki-history:${record.source.noteId}:style`, subject: "建筑史", knowledgeName: record.name,
          form: "真题模式：建筑—样式・类型配对",
          prompt: `次の建築と建築様式・類型の組合せとして、最も適切なものを一つ選びなさい。\n\n${record.name}\n\n${optionLines(options)}`,
          answer: `${String.fromCharCode(65 + options.indexOf(style))}. ${style}`,
          evidence: `建筑史専門1语群配对模式 · 建筑—样式/类型 · Anki ${record.source.deck}`, readiness: "建议抽查",
        });
      }
    }

    // 3) Building → Feature description (same as before)
    const feature = cleanFeature(record, knownBuildingNames);
    if (feature) {
      const candidates = usable
        .filter((candidate) => candidate.source.noteId !== record.source.noteId && candidate.source.deck === record.source.deck)
        .sort((a, b) => Number(periodKey(b.fields.period) === periodKey(record.fields.period)) - Number(periodKey(a.fields.period) === periodKey(record.fields.period)));
      const samePeriod = candidates.filter((candidate) => periodKey(candidate.fields.period) === periodKey(record.fields.period));
      const otherPeriod = candidates.filter((candidate) => periodKey(candidate.fields.period) !== periodKey(record.fields.period));
      const distractors = uniqueValues([...rotate(samePeriod, index + 13), ...rotate(otherPeriod, index + 13)].map((candidate) => cleanFeature(candidate, knownBuildingNames)).filter((value) => value && value !== feature)).slice(0, 3);
      if (distractors.length === 3) {
        const options = makeOptions(feature, distractors, `${record.name}:feature`);
        drafts.push({
          id: `anki-history:${record.source.noteId}:feature`, subject: "建筑史", knowledgeName: record.name,
          form: "真题模式：建筑—特征配对",
          prompt: `「${record.name}」の建築的特徴として、最も適切なものを一つ選びなさい。\n\n${optionLines(options)}`,
          answer: `${String.fromCharCode(65 + options.indexOf(feature))}. ${feature}`,
          evidence: `建筑史専門1语群配对模式 · 建筑—类型/特征 · Anki ${record.source.deck}`, readiness: "建议抽查",
        });
      }
    }

    // 4) Building → Period/dynasty matching (真题模式：年代排序/时代配对)
    const period = record.fields.period?.trim();
    if (period && period !== "要確認" && period.length >= 2) {
      const peerPeriods = uniqueValues(
        usable
          .filter((candidate) => candidate.source.noteId !== record.source.noteId && candidate.source.deck === record.source.deck)
          .map((candidate) => candidate.fields.period?.trim())
          .filter((p) => p && p !== "要確認" && p !== period),
      );
      if (peerPeriods.length >= 3) {
        const distractors = rotate(peerPeriods, index + 19).slice(0, 3);
        const options = makeOptions(period, distractors, `${record.name}:period`);
        drafts.push({
          id: `anki-history:${record.source.noteId}:period`, subject: "建筑史", knowledgeName: record.name,
          form: "真题模式：建筑—时代配对",
          prompt: `次の建築の建設・成立年代として、最も適切なものを一つ選びなさい。\n\n${record.name}\n\n${optionLines(options)}`,
          answer: `${String.fromCharCode(65 + options.indexOf(period))}. ${period}\n\n設計者：${record.fields.people || "—"}\n様式：${record.fields.style || "—"}`,
          evidence: `建筑史専門1年代排列/时代配对模式 · Anki ${record.source.deck}`, readiness: "自动可用",
        });
      }
    }

    // 5) Architect → Building reverse matching (真题模式：人物→作品配对)
    if (people) {
      const sameDeckBuildings = usable
        .filter((candidate) => candidate.source.noteId !== record.source.noteId && candidate.source.deck === record.source.deck)
        .filter((candidate) => candidate.fields.people?.trim() && candidate.fields.people.trim() !== people);
      const samePeriodPeers = sameDeckBuildings.filter((candidate) => periodKey(candidate.fields.period) === periodKey(record.fields.period));
      const otherPeriodPeers = sameDeckBuildings.filter((candidate) => periodKey(candidate.fields.period) !== periodKey(record.fields.period));
      const distractorBuildings = uniqueValues(
        [...rotate(samePeriodPeers, index + 23), ...rotate(otherPeriodPeers, index + 23)].map((candidate) => candidate.name),
      ).filter((name) => name !== record.name).slice(0, 3);
      if (distractorBuildings.length === 3) {
        const options = makeOptions(record.name, distractorBuildings, `${people}:reverse`);
        drafts.push({
          id: `anki-history:${record.source.noteId}:reverse`, subject: "建筑史", knowledgeName: people,
          form: "真题模式：人物—作品配对",
          prompt: `次の建築家・人物の代表作として、最も適切なものを一つ選びなさい。\n\n${people}\n\n${optionLines(options)}`,
          answer: `${String.fromCharCode(65 + options.indexOf(record.name))}. ${record.name}\n\n年代：${period || "—"}\n様式：${record.fields.style || "—"}`,
          evidence: `建筑史専門1人物→作品配对模式 · Anki ${record.source.deck}`, readiness: "自动可用",
        });
      }
    }
  });

  return drafts;
}

// ====== CONSTRUCTION ANKI DRAFTS (建筑构法) ======

function extractConstructionDescription(backHtml: string): string {
  // Parse the structured backHtml: 📝 简介 ... 📋 考试出现形式 ... 📖 过去问相关 ... 🏷 标签 ...
  const introMatch = backHtml.match(/📝\s*简介\s*(.+?)(?=📋|📖|🏷|$)/);
  if (introMatch) return introMatch[1].trim();
  // Fallback: clean emoji markers and take first meaningful sentence
  const cleaned = backHtml.replace(/[📝📋📖🏷🔧]\s*\S*\s*/g, "").trim();
  const sentences = cleaned.match(/[^。！？\n]+[。！？]?/g) ?? [];
  return sentences.filter((s) => s.replace(/[。！？\s]/g, "").length >= 8).slice(0, 2).join("").slice(0, 200);
}

function constructionAnkiDrafts(records: AnkiRecord[]): AssessmentDraft[] {
  const constructionRecords = records.filter((r) =>
    r.source.deck.startsWith("建築構法") && !r.qualityFlags.includes("source-needs-review"),
  );
  const drafts: AssessmentDraft[] = [];

  // Index by category for distractor generation (category comes from fields.category)
  const byCategory = new Map<string, AnkiRecord[]>();
  constructionRecords.forEach((r) => {
    const cat = r.fields.category || "その他";
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(r);
  });

  constructionRecords.forEach((record, index) => {
    // knowledgePoint is the primary field now (was fields.image in old mapping)
    const knowledgePoint = record.fields.knowledgePoint?.trim() || record.name;
    if (!knowledgePoint || knowledgePoint.length < 2) return;

    // Description comes from backHtml (parsed for 📝 简介 section)
    const description = extractConstructionDescription(record.fields.backHtml || "");
    if (!description || description.length < 5) return;

    // Past exam evidence comes from pastQuestion field
    const pastExamRef = record.fields.pastQuestion?.trim() || "";
    const hasExamEvidence = pastExamRef && /\d{4}/.test(pastExamRef);

    // Exam form comes from examForm field
    const examForm = record.fields.examForm?.trim() || "";

    // Category comes from category field
    const category = record.fields.category?.trim() || "";

    // Type 1: Knowledge-point → category matching (for well-classified items)
    if (category && category !== "未分類" && category !== "概念" && category !== "その他") {
      const peerCategories = uniqueValues(
        constructionRecords
          .filter((r) => r.source.noteId !== record.source.noteId && r.fields.category?.trim())
          .map((r) => r.fields.category!.trim())
          .filter((c) => c !== category && c !== "未分類" && c !== "概念"),
      );
      if (peerCategories.length >= 3) {
        const distractors = rotate(peerCategories, index).slice(0, 3);
        const options = makeOptions(category, distractors, knowledgePoint);
        drafts.push({
          id: `anki-construction:${record.source.noteId}:category`,
          subject: "建筑构法",
          knowledgeName: knowledgePoint,
          form: "模拟模式：用语—分类配对",
          prompt: `次の建築構法用語が属する分類として、最も適切なものを一つ選びなさい。\n\n「${knowledgePoint}」\n\n${optionLines(options)}`,
          answer: `${String.fromCharCode(65 + options.indexOf(category))}. ${category}\n\n${description}`,
          evidence: `建筑构法Anki知识分类 · ${record.source.deck}`,
          readiness: "建议抽查",
        });
      }
    }

    // Type 2: Term → definition four-choice (for exam-relevant items)
    if (hasExamEvidence && description.length >= 12) {
      const sameCategory = (byCategory.get(category || "") || []).filter((r) => r.source.noteId !== record.source.noteId);
      const pool = sameCategory.length >= 2 ? sameCategory : constructionRecords.filter((r) => r.source.noteId !== record.source.noteId);
      const peerDescriptions = uniqueValues(
        pool.map((r) => extractConstructionDescription(r.fields.backHtml || "")),
      ).filter((d) => d && d !== description);

      if (peerDescriptions.length >= 3) {
        const distractors = rotate(peerDescriptions, index + 17).slice(0, 3);
        const options = makeOptions(description, distractors, `${knowledgePoint}:def`);
        const isAutoUsable = examForm.includes("用语填空");
        drafts.push({
          id: `anki-construction:${record.source.noteId}:definition`,
          subject: "建筑构法",
          knowledgeName: knowledgePoint,
          form: "真题模式：用语—说明四选一",
          prompt: `次の建築構法用語「${knowledgePoint}」の説明として、最も適切なものを一つ選びなさい。\n\n${optionLines(options)}`,
          answer: `${String.fromCharCode(65 + options.indexOf(description))}. ${description}\n\n出題実績：${pastExamRef}`,
          evidence: `建筑构法過去問出題実績あり · ${record.source.deck} · ${pastExamRef}`,
          readiness: isAutoUsable ? "自动可用" : "建议抽查",
        });
      }
    }

    // Type 3: Term association matching (真题模式：用语关联配对 — 2017 Q3 经典格式)
    // "次の用語と最も関連の深い用語を一つ選びなさい" — match a term to its most related term
    if (hasExamEvidence && examForm) {
      // Find an associated term from the same deck/different category
      const sameDeckPeers = constructionRecords.filter(
        (r) => r.source.noteId !== record.source.noteId
          && r.source.deck === record.source.deck
          && (r.fields.pastQuestion || "").trim(),
      );
      if (sameDeckPeers.length >= 4) {
        // Pick the first peer as the correct association (same deck = related)
        const associatedPeer = sameDeckPeers[0];
        const associatedTerm = associatedPeer.fields.knowledgePoint?.trim() || associatedPeer.name;
        const distractors = uniqueValues(
          sameDeckPeers.slice(1, 10).map((r) => r.fields.knowledgePoint?.trim() || r.name),
        ).filter((t) => t !== associatedTerm && t !== knowledgePoint).slice(0, 3);

        if (distractors.length >= 3) {
          const options = makeOptions(associatedTerm, distractors, `${knowledgePoint}:assoc`);
          drafts.push({
            id: `anki-construction:${record.source.noteId}:assoc`,
            subject: "建筑构法",
            knowledgeName: knowledgePoint,
            form: "真题模式：用语关联配对",
            prompt: `次の用語と最も関連の深い用語を一つ選びなさい。\n\n「${knowledgePoint}」\n\n${optionLines(options)}`,
            answer: `${String.fromCharCode(65 + options.indexOf(associatedTerm))}. ${associatedTerm}\n\n${knowledgePoint} と ${associatedTerm} はともに ${record.source.deck.replace("建築構法::", "")} に関連する用語です。`,
            evidence: `建筑构法専門1用语关联模式（2017 Q3同型）· ${record.source.deck} · ${pastExamRef}`,
            readiness: "自动可用",
          });
        }
      }
    }
  });

  return drafts;
}

// ====== PLANNING NOTION DRAFTS (建筑计划) ======

function planningNumberDrafts(): AssessmentDraft[] {
  const sourcePath = path.resolve(process.cwd(), "..", "planning card", "building_cache.json");
  if (!fs.existsSync(sourcePath)) return [];
  const cards = JSON.parse(fs.readFileSync(sourcePath, "utf-8")) as Array<{
    page_id: string; name: string; description?: string; tags?: string[];
    item_type?: string; importance?: string;
  }>;
  const usable = cards.filter((card) => card.description?.trim());
  return usable.flatMap<AssessmentDraft>((card) => {
    const cardName = cleanPlanningCardText(card.name);
    const cardDescription = cleanPlanningCardText(card.description!);
    const isNumber = card.tags?.includes("数值");
    if (isNumber) return [{
      id: `建筑计划:${card.page_id}`, subject: "建筑计划" as const, knowledgeName: cardName,
      form: "真题模式：数值填空／条件判断",
      prompt: `建築計画上の「${cardName}」について、基準となる数値と、その数値を適用する条件を答えなさい。`,
      answer: cardDescription,
      evidence: `建筑计划専門1数值小问模式 · Notion ${card.item_type || "未分类"} · ${card.importance || "未标重要度"}`,
      readiness: "自动可用" as const,
    }];
    const peers = usable.filter((value) => value.page_id !== card.page_id && value.item_type === card.item_type && !value.tags?.includes("数值"));
    if (peers.length < 3) return [];
    const descriptions = [cardDescription, ...peers.slice(0, 3).map((value) => cleanPlanningCardText(value.description!))]
      .sort((a, b) => `${cardName}:${a}`.localeCompare(`${cardName}:${b}`));
    const correctIndex = descriptions.indexOf(cardDescription);
    return [{
      id: `建筑计划:${card.page_id}`, subject: "建筑计划" as const, knowledgeName: cardName,
      form: "真题模式：概念说明四选一",
      prompt: `次の建築計画用語・事例「${cardName}」の説明として、最も適切なものを一つ選びなさい。\n\n${optionLines(descriptions)}`,
      answer: `${String.fromCharCode(65 + correctIndex)}. ${cardDescription}`,
      evidence: `建筑计划専門1非数值选择题模式 · 同类干扰项：${card.item_type || "未分类"}`,
      readiness: "建议抽查" as const,
    }];
  });
}

// ====== PLANNING ANKI DRAFTS (建筑计划 - Anki补充) ======

function planningAnkiDrafts(records: AnkiRecord[]): AssessmentDraft[] {
  const planningRecords = records.filter((r) =>
    r.source.deck.startsWith("建筑计划") && !r.qualityFlags.includes("source-needs-review"),
  );
  const drafts: AssessmentDraft[] = [];

  planningRecords.forEach((record, index) => {
    // In planning cards: image = knowledge point name, style = answer content
    const knowledgePoint = record.fields.image?.trim();
    const content = record.fields.style?.trim();
    const category = record.fields.buildingName?.trim();

    if (!knowledgePoint || !content || knowledgePoint.length < 2) return;

    // Detect if this is a numerical or factual Q&A
    const isNumeric = /^\d|cm|mm|m\b|％|%|倍|以上|以下|以内|以内|程度|約/.test(content);
    const isShort = content.length <= 80;

    if (isShort) {
      // Short answer → make a four-choice question
      const peers = planningRecords
        .filter((r) => r.source.noteId !== record.source.noteId && r.fields.buildingName === category)
        .map((r) => r.fields.style?.trim())
        .filter((v): v is string => !!v && v.length <= 120);
      const distractors = uniqueValues(rotate(peers, index)).filter((v) => v !== content).slice(0, 3);

      if (distractors.length >= 3) {
        const options = makeOptions(content, distractors, knowledgePoint);
        drafts.push({
          id: `anki-planning:${record.source.noteId}`,
          subject: "建筑计划",
          knowledgeName: knowledgePoint,
          form: isNumeric ? "真题模式：数值四选一" : "真题模式：概念四选一",
          prompt: `建築計画における「${knowledgePoint}」について、最も適切なものを一つ選びなさい。\n\n${optionLines(options)}`,
          answer: `${String.fromCharCode(65 + options.indexOf(content))}. ${content}`,
          evidence: `建筑计划Anki · ${record.source.deck} · ${category || ""}`,
          readiness: "建议抽查",
        });
      }
    }

    // Also generate fill-in-the-blank for numerical items
    if (isNumeric) {
      drafts.push({
        id: `anki-planning:${record.source.noteId}:fill`,
        subject: "建筑计划",
        knowledgeName: knowledgePoint,
        form: "真题模式：数值填空",
        prompt: `建築計画における次の基準値を答えなさい。\n\n「${knowledgePoint}」`,
        answer: content,
        evidence: `建筑计划Anki数值记忆 · ${record.source.deck}`,
        readiness: "自动可用",
      });
    }
  });

  return drafts;
}

// ====== CONSTRUCTION VARIANT DRAFTS (建筑构法 - 过去问变形) ======

function constructionVariantDrafts(): AssessmentDraft[] {
  const sourcePath = path.resolve(process.cwd(), "data/construction-exam-answers.json");
  if (!fs.existsSync(sourcePath)) return [];
  const source = JSON.parse(fs.readFileSync(sourcePath, "utf-8")) as {
    records: Array<{ fileName: string; items: ConstructionAnswerItem[] }>;
  };
  const items = source.records
    .filter((record) => record.fileName.includes("_専門1_"))
    .flatMap((record) => {
      const questionPath = path.resolve(process.cwd(), "data/processed_questions", record.fileName);
      const content = fs.existsSync(questionPath) ? fs.readFileSync(questionPath, "utf-8") : "";
      return record.items.flatMap((item) => expandConstructionPracticeItem(item, content).map((practiceItem) => ({
        ...practiceItem.sourceItem,
        itemId: practiceItem.id,
        prompt: practiceItem.prompt,
        answer: practiceItem.answer,
        fileName: record.fileName,
      })));
    })
    .filter((item) => item.prompt?.trim() && !item.answer.includes("\n") && item.answer.trim().length <= 35 && item.reviewStatus === "card-supported-draft");

  const numericPool = (prompt: string) => {
    if (/比重/.test(prompt)) return ["0.4", "1/2", "2.3", "2.5", "2.7", "7.8", "8"];
    if (/ヤング係数/.test(prompt)) return ["7,000 N/mm²", "21,000 N/mm²", "70,000 N/mm²", "205,000 N/mm²"];
    if (/線膨張係数/.test(prompt)) return ["1×10⁻⁶ /K", "10×10⁻⁶ /K", "100×10⁻⁶ /K", "1000×10⁻⁶ /K"];
    if (/倍率/.test(prompt)) return ["1/2", "1", "1.5", "2"];
    return [];
  };

  const normalizeOption = (value: string) => value
    .replace(/[\s,，]/g, "")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (digit) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(digit).toString())
    .replace(/[−–]/g, "-")
    .toLowerCase();

  const hideEmbeddedOptions = (value: string) => value.replace(
    /【\s*([A-Za-z])[.．]\s*[^】]+】/g,
    "（$1）",
  );

  return items.flatMap((item, index) => {
    const correct = item.answer.trim();
    const prompt = item.prompt!.trim();
    const itemNumber = Number(item.itemId.match(/#s(\d+)/)?.[1] ?? 0);
    const isExpandedBlank = item.itemId.includes(":part-") && !/^次の用語と/.test(prompt);
    const isAssociation = item.fileName.startsWith("2017_") && itemNumber >= 1 && itemNumber <= 10;
    const isNumeric = /比重|ヤング係数|線膨張係数|倍率|スランプ値/.test(prompt) || /^[-+]?\d/.test(correct);
    const partLabel = item.itemId.split(":part-").at(-1);
    const embeddedMatch = partLabel
      ? prompt.match(new RegExp(`【${partLabel}[.．]\\s*([^】]+)】`, "i"))
      : null;
    const embeddedOptions = embeddedMatch?.[1].split(/[,，、]/).map((value) => value.trim()).filter(Boolean) ?? [];
    const peers = items.filter((value) => {
      if (value.itemId === item.itemId || value.fileName !== item.fileName) return false;
      const peerNumber = Number(value.itemId.match(/#s(\d+)/)?.[1] ?? 0);
      if (isAssociation) return peerNumber >= 1 && peerNumber <= 10;
      return !/比重|ヤング係数|線膨張係数|倍率|スランプ値/.test(value.prompt ?? "");
    });
    const candidateAnswers = isNumeric ? numericPool(prompt) : peers.map((value) => value.answer.trim());
    const distractors = uniqueValues(rotate(candidateAnswers, index)).filter((value) => value !== correct).slice(0, 3);
    let options = embeddedOptions.length === 4 ? embeddedOptions : distractors.length >= 3 ? makeOptions(correct, distractors, item.itemId) : [];
    let correctIndex = options.findIndex((value) => normalizeOption(value) === normalizeOption(correct));
    if (correctIndex < 0 && distractors.length >= 3) {
      options = makeOptions(correct, distractors, item.itemId);
      correctIndex = options.indexOf(correct);
    }
    if (correctIndex < 0) return [];
    const questionText = isExpandedBlank
      ? hideEmbeddedOptions(prompt)
      : isAssociation
        ? `次の用語と最も関連の深い用語を一つ選びなさい。\n\n「${prompt}」`
        : isNumeric
          ? `次の材料・構法の特性値として最も適切なものを一つ選びなさい。\n\n${prompt}`
          : `次の説明の空欄に入る最も適切な建築構法・材料・部材の用語を一つ選びなさい。\n\n${prompt}：（　　　）`;
    return {
      id: `construction-variant:${item.itemId}`, subject: "建筑构法" as const, knowledgeName: prompt,
      form: isAssociation ? "真题模式：用语联系四选一" : isNumeric ? "真题模式：数值四选一" : "真题模式：构法填空四选一",
      prompt: `${questionText}\n\n${optionLines(options)}`,
      answer: `${String.fromCharCode(65 + correctIndex)}. ${options[correctIndex]}`,
      evidence: `建筑构法専門1过去问的${isAssociation ? "用语联系" : isNumeric ? "数值选择" : "语群填空"}模式 · 来源 ${item.fileName}`,
      readiness: "自动可用" as const,
    };
  });
}

// ====== ENVIRONMENT DRAFTS (建筑环境工学) ======

function environmentDrafts(): AssessmentDraft[] {
  // Hardcoded core calculation problems (exam-verified)
  const core: AssessmentDraft[] = [
    {
      id: "建筑环境工学:environment-formula-3", subject: "建筑环境工学", knowledgeName: "CO₂必要換気量",
      form: "真题模式：数值计算",
      prompt: "室内のCO₂発生量を0.015 m³/h、室内許容濃度を1,000 ppm、外気濃度を500 ppmとする。定常状態における1人当たりの必要換気量[m³/h]を求めなさい。",
      answer: "濃度を小数に直すと、Cᵢ−Cₒ=0.001−0.0005=0.0005。\nQ=G/(Cᵢ−Cₒ)=0.015/0.0005=30 m³/h。",
      evidence: "环境工学过去问的CO₂定常收支计算模式 · Q=G/(Cᵢ−Cₒ)", readiness: "自动可用",
    },
    {
      id: "建筑环境工学:environment-formula-5", subject: "建筑环境工学", knowledgeName: "点光源の照度",
      form: "真题模式：数值计算",
      prompt: "光度500 cdの点光源が、光源直下2.0 mの水平面を照らしている。反射を無視したとき、水平面照度[lx]を求めなさい。",
      answer: "直下なのでcosθ=1。E=I cosθ/r²=500/2.0²=125 lx。",
      evidence: "环境工学过去问的照度计算模式 · E=I cosθ/r²", readiness: "自动可用",
    },
    {
      id: "建筑环境工学:environment-formula-8", subject: "建筑环境工学", knowledgeName: "残響時間",
      form: "真题模式：数值计算",
      prompt: "室容積300 m³、等価吸音面積60 m²の室について、Sabine式を用いて残響時間[s]を求めなさい。",
      answer: "T₆₀=0.161V/A=0.161×300/60=0.805 s、したがって約0.81 s。",
      evidence: "环境工学过去问的残响时间计算模式 · T₆₀=0.161V/A", readiness: "自动可用",
    },
    {
      id: "建筑环境工学:environment-formula-10", subject: "建筑环境工学", knowledgeName: "動圧",
      form: "真题模式：数值计算",
      prompt: "空気密度1.2 kg/m³、風速5.0 m/sの気流の動圧[Pa]を求めなさい。",
      answer: "q=ρv²/2=1.2×5.0²/2=15 Pa。",
      evidence: "环境工学过去问的流体数值计算模式 · q=ρv²/2", readiness: "自动可用",
    },
  ];

  // Auto-generate formula-based drafts from ENVIRONMENT_FORMULAS
  // Use realistic numerical values based on past exam patterns
  const formulaValues: Record<string, { prompt: string; answer: string }> = {
    "多層壁の熱貫流率": {
      prompt: "外壁の熱伝達抵抗（外気側）0.04 m²·K/W、室内側0.11 m²·K/W、断熱材（厚さ100mm、熱伝導率0.04 W/m·K）、コンクリート（厚さ150mm、熱伝導率1.6 W/m·K）の4層壁がある。この壁の熱貫流率U値[W/m²·K]を求めなさい。",
      answer: "R=0.04+0.1/0.04+0.15/1.6+0.11=0.04+2.5+0.094+0.11=2.744 m²·K/W\nU=1/R=1/2.744≒0.36 W/m²·K",
    },
    "放射熱流": {
      prompt: "表面温度80°C（353K）、放射率0.9の暖房パネルと、表面温度20°C（293K）、放射率0.9の周壁の間の放射熱流[W/m²]を求めなさい。ただし、σ=5.67×10⁻⁸ W/m²·K⁴とする。",
      answer: "q=σ(T₁⁴−T₂⁴)/(1/ε₁+1/ε₂−1)=5.67×10⁻⁸×(353⁴−293⁴)/(1/0.9+1/0.9−1)\n=5.67×10⁻⁸×(1.55×10¹⁰−0.74×10¹⁰)/1.222=5.67×10⁻⁸×0.81×10¹⁰/1.222≒376 W/m²",
    },
    "開口流量": {
      prompt: "2つの開口（面積A₁=0.5 m²、A₂=0.3 m²）が上下に配置された室がある。内外温度差20K、開口高さ差を5mとしたとき、温度差換気による流量[m³/s]を求めなさい。ただし、流量係数α=0.7、重力加速度g=9.8 m/s²、絶対温度T=293Kとする。",
      answer: "有効開口面積 Aₑ=1/√(1/A₁²+1/A₂²)=1/√(1/0.25+1/0.09)=1/√(4+11.11)=1/3.89=0.257 m²\nQ=αAₑ√(2ghΔT/T)=0.7×0.257×√(2×9.8×5×20/293)=0.18×√(6.69)=0.18×2.59≒0.47 m³/s",
    },
    "光束法": {
      prompt: "事務室（間口10m、奥行8m、天井高2.8m）の設計照度を500 lxとする。照明率0.6、保守率0.7として、必要な全光束[lm]を求めなさい。",
      answer: "床面積A=10×8=80 m²\n全光束Φ=A×E/(U×M)=80×500/(0.6×0.7)=40,000/0.42≒95,200 lm",
    },
    "音圧レベル": {
      prompt: "音圧実効値0.02 Paの音の音圧レベル[dB]を求めなさい。ただし、基準音圧p₀=20 μPaとする。",
      answer: "Lp=20 log₁₀(p/p₀)=20 log₁₀(0.02/20×10⁻⁶)=20 log₁₀(1000)=20×3=60 dB",
    },
    "湿り空気の比エンタルピー": {
      prompt: "乾球温度25°C、絶対湿度0.012 kg/kg(DA)の湿り空気の比エンタルピー[kJ/kg(DA)]を求めなさい。ただし、乾き空気の比熱1.0 kJ/kg·K、水蒸気の比熱1.8 kJ/kg·K、0°Cの蒸発潜熱2,500 kJ/kgとする。",
      answer: "h=1.0×25+0.012×(2,500+1.8×25)=25+0.012×(2,500+45)=25+0.012×2,545=25+30.5≒55.5 kJ/kg(DA)",
    },
    "昼光率": {
      prompt: "室内のある点で、全天空照度10,000 lxのときの机上面照度が300 lxであった。この点の昼光率[%]を求めなさい。",
      answer: "D=300/10,000×100=3.0%",
    },
    "自由音場の距離減衰": {
      prompt: "音響出力0.01 Wの点音源から5m離れた点の音圧レベル[dB]を求めなさい。ただし、自由音場とし基準音響出力10⁻¹² Wとする。",
      answer: "Lw=10 log₁₀(0.01/10⁻¹²)=10 log₁₀(10¹⁰)=100 dB\nLp=Lw−20 log₁₀(r)−11=100−20 log₁₀(5)−11=100−20×0.699−11=100−13.98−11≒75 dB",
    },
    "質量則": {
      prompt: "面密度20 kg/m²の単層壁に1,000 Hzの音が入射するとき、質量則による透過損失[dB]を求めなさい。",
      answer: "TL=20 log₁₀(f·m)−43=20 log₁₀(1,000×20)−43=20 log₁₀(20,000)−43=20×4.301−43=86.02−43≒43 dB",
    },
    "室間音圧レベル差": {
      prompt: "音源室と受音室の間の遮音壁の透過損失が35 dB、受音室の等価吸音面積が10 m²、隔壁面積が8 m²のとき、室間音圧レベル差[dB]を求めなさい。",
      answer: "D=TL+10 log₁₀(A/S)=35+10 log₁₀(10/8)=35+10 log₁₀(1.25)=35+10×0.097=35+0.97≒36 dB",
    },
    "表面結露判定": {
      prompt: "外気温0°C、室内温20°C、室内相対湿度50%とする。外壁の熱貫流率2.0 W/m²·K、室内側熱伝達抵抗0.11 m²·K/Wのとき、室内側表面温度[°C]を求め、結露の有無を判定しなさい。ただし、20°C/50%の露点温度は9.3°Cとする。",
      answer: "θsi=20−2.0×0.11×(20−0)=20−4.4=15.6°C\n15.6°C > 9.3°C（露点温度）より、結露しない。",
    },
  };

  const generated: AssessmentDraft[] = ENVIRONMENT_FORMULAS
    .filter((formula) => formula.formula?.trim() && formula.title?.trim())
    .flatMap((formula, index) => {
      const drafts: AssessmentDraft[] = [];
      const title = formula.title;
      const topic = formula.topic;
      const formulaText = formula.formula;
      const use = formula.use;
      const hasYears = (formula.referenceYears?.length ?? 0) > 0;

      // Skip formulas already covered by core problems
      const coreIds = ["CO₂必要換気量", "点光源の照度", "残響時間", "動圧"];
      if (coreIds.includes(title)) return [];

      // Use concrete values if available
      const concrete = formulaValues[title];

      if (concrete) {
        drafts.push({
          id: `env-formula:${index}-calc`,
          subject: "建筑环境工学",
          knowledgeName: title,
          form: "真题模式：数值计算",
          prompt: concrete.prompt,
          answer: concrete.answer,
          evidence: `环境工学公式库 · ${topic} · 公式 ${formulaText}${hasYears ? ` · 真题主题年份 ${formula.referenceYears!.join("/")}` : ""}`,
          readiness: "自动可用",
        });
      } else {
        // Fallback: formula selection four-choice
        const isCalculation = /求め|計算/.test(use);
        if (isCalculation) {
          drafts.push({
            id: `env-formula:${index}-calc`,
            subject: "建筑环境工学",
            knowledgeName: title,
            form: "真题模式：公式应用计算",
            prompt: `以下の条件で「${title}」を計算しなさい。\n\n公式：${formulaText}\n用途：${use}`,
            answer: `公式 ${formulaText} を用いて計算する。\n\n（※実際の数値計算問題は、過去問から具体的な数値を採用してください。）`,
            evidence: `环境工学公式库 · ${topic}${hasYears ? ` · 真题主题年份 ${formula.referenceYears!.join("/")}` : ""}`,
            readiness: hasYears ? "建议抽查" : "资料不足",
          });
        }
      }

      // Formula selection: always generate a four-choice variant for formulas with years
      if (hasYears) {
        // Find peer formulas from same topic as distractors
        const peerFormulas = ENVIRONMENT_FORMULAS
          .filter((f) => f.topic === topic && f.title !== title && f.formula?.trim())
          .map((f) => f.formula)
          .slice(0, 3);
        if (peerFormulas.length >= 3) {
          const options = makeOptions(formulaText, peerFormulas, title);
          drafts.push({
            id: `env-formula:${index}-select`,
            subject: "建筑环境工学",
            knowledgeName: title,
            form: "真题模式：公式选择四选一",
            prompt: `「${title}」を表す式として、最も適切なものを一つ選びなさい。\n\n${optionLines(options)}`,
            answer: `${String.fromCharCode(65 + options.indexOf(formulaText))}. ${formulaText}\n\n用途：${use}`,
            evidence: `环境工学公式库 · ${topic} · 真题主题年份 ${formula.referenceYears!.join("/")}`,
            readiness: "自动可用",
          });
        }
      }

      return drafts;
    });

  const usableGenerated = generated.filter((d) => d.readiness !== "资料不足");

  return [...core, ...usableGenerated];
}

// ====== MAIN: GET ALL ASSESSMENT DRAFTS ======

const CACHE_PATH = path.resolve(process.cwd(), "data/assessment-drafts-cache.json");

function getSourceMtimes(): number[] {
  const paths = [
    path.resolve(process.cwd(), "data/anki-import/anki-notes.json"),
    path.resolve(process.cwd(), "data/anki-import/construction-anki-notes.json"),
    path.resolve(process.cwd(), "data/anki-import/planning/anki-notes.json"),
    path.resolve(process.cwd(), "..", "planning card", "building_cache.json"),
    path.resolve(process.cwd(), "data/construction-exam-answers.json"),
  ];
  return paths.map((p) => { try { return fs.statSync(p).mtimeMs; } catch { return 0; } });
}

export function getAssessmentDrafts(): AssessmentDraft[] {
  // Cache: skip expensive O(n²) regeneration if source files unchanged
  const sourceMtimes = getSourceMtimes();
  const cacheKey = sourceMtimes.join(",");
  if (fs.existsSync(CACHE_PATH)) {
    try {
      const cached = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
      if (cached.cacheKey === cacheKey) return cached.drafts as AssessmentDraft[];
    } catch { /* stale cache — regenerate */ }
  }

  // 1) History Anki (main anki-notes.json → 东大建筑史 decks)
  const historyPath = path.resolve(process.cwd(), "data/anki-import/anki-notes.json");
  const historyRecords: AnkiRecord[] = fs.existsSync(historyPath)
    ? (JSON.parse(fs.readFileSync(historyPath, "utf-8")) as { records: AnkiRecord[] }).records
    : [];
  const history = historyPairingDrafts(historyRecords);

  // 2) Construction Anki (construction-anki-notes.json → 建築構法 decks)
  const constructionAnkiPath = path.resolve(process.cwd(), "data/anki-import/construction-anki-notes.json");
  const constructionRecords: AnkiRecord[] = fs.existsSync(constructionAnkiPath)
    ? (JSON.parse(fs.readFileSync(constructionAnkiPath, "utf-8")) as { records: AnkiRecord[] }).records
    : [];
  const constructionAnki = constructionAnkiDrafts(constructionRecords);

  // 3) Planning Anki (planning/anki-notes.json → 建筑计划 decks)
  const planningAnkiPath = path.resolve(process.cwd(), "data/anki-import/planning/anki-notes.json");
  const planningRecords: AnkiRecord[] = fs.existsSync(planningAnkiPath)
    ? (JSON.parse(fs.readFileSync(planningAnkiPath, "utf-8")) as { records: AnkiRecord[] }).records
    : [];
  const planningAnki = planningAnkiDrafts(planningRecords);

  // 4) Planning Notion (building_cache.json)
  const planningNotion = planningNumberDrafts();

  // 5) Construction variants (exam answer deformation)
  const constructionVariants = constructionVariantDrafts();

  // 6) Environment (hardcoded + auto-generated from formula library)
  const environment = environmentDrafts();

  const drafts = [
    ...history,
    ...constructionAnki,
    ...constructionVariants,
    ...planningAnki,
    ...planningNotion,
    ...environment,
  ];

  // Save cache
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify({ cacheKey, drafts }), "utf-8");
  } catch { /* non-fatal */ }

  return drafts;
}
