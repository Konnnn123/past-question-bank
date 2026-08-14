export interface JapaneseBuildingChronologySource {
  period: { ja: string };
  history: { ja: string };
  regions: string[];
}

type Language = "ja" | "zh";

const ERA_RANGES = [
  { pattern: /弥生時代.*古墳時代/, ja: "紀元前9世紀頃–7世紀頃 CE", zh: "约公元前9世纪–公元7世纪" },
  { pattern: /飛鳥.*奈良時代/, ja: "6–8世紀頃 CE", zh: "约公元6–8世纪" },
  { pattern: /安土桃山時代.*江戸時代/, ja: "16世紀後半–17世紀初頭 CE", zh: "约公元16世纪后半–17世纪初" },
  { pattern: /戦国時代.*江戸|戦国時代.*近世/, ja: "15世紀後半–17世紀頃 CE", zh: "约公元15世纪后半–17世纪" },
  { pattern: /縄文時代/, ja: "紀元前14千年頃–紀元前4世紀頃", zh: "约公元前14000年–前4世纪" },
  { pattern: /弥生時代/, ja: "紀元前9世紀頃–3世紀頃 CE", zh: "约公元前9世纪–公元3世纪" },
  { pattern: /古墳時代/, ja: "3世紀中頃–7世紀頃 CE", zh: "约公元3世纪中叶–7世纪" },
  { pattern: /白鳳時代/, ja: "7世紀後半–8世紀初頭 CE", zh: "约公元7世纪后半–8世纪初" },
  { pattern: /飛鳥時代/, ja: "6世紀末–8世紀初頭 CE", zh: "约公元6世纪末–8世纪初" },
  { pattern: /奈良時代/, ja: "8世紀 CE", zh: "公元8世纪" },
  { pattern: /平安時代後期/, ja: "11–12世紀 CE", zh: "约公元11–12世纪" },
  { pattern: /平安時代/, ja: "8世紀末–12世紀末 CE", zh: "约公元8世纪末–12世纪末" },
  { pattern: /鎌倉時代前期/, ja: "12世紀末–13世紀前半 CE", zh: "约公元12世纪末–13世纪前半" },
  { pattern: /鎌倉時代後期|鎌倉時代末期/, ja: "13世紀後半–14世紀前半 CE", zh: "约公元13世纪后半–14世纪前半" },
  { pattern: /鎌倉時代/, ja: "12世紀末–14世紀前半 CE", zh: "约公元12世纪末–14世纪前半" },
  { pattern: /室町時代初期/, ja: "14世紀 CE", zh: "约公元14世纪" },
  { pattern: /室町時代中期/, ja: "15世紀 CE", zh: "约公元15世纪" },
  { pattern: /室町時代後期/, ja: "15世紀後半–16世紀 CE", zh: "约公元15世纪后半–16世纪" },
  { pattern: /室町時代/, ja: "14–16世紀 CE", zh: "约公元14–16世纪" },
  { pattern: /戦国時代/, ja: "15世紀後半–17世紀初頭 CE", zh: "约公元15世纪后半–17世纪初" },
  { pattern: /安土桃山時代|桃山時代/, ja: "16世紀後半 CE", zh: "约公元16世纪后半" },
  { pattern: /江戸時代初期/, ja: "17世紀 CE", zh: "约公元17世纪" },
  { pattern: /江戸時代前期/, ja: "17世紀–18世紀初頭 CE", zh: "约公元17世纪–18世纪初" },
  { pattern: /江戸時代中期.*後期/, ja: "18世紀–19世紀中頃 CE", zh: "约公元18世纪–19世纪中叶" },
  { pattern: /江戸時代後期/, ja: "18世紀後半–19世紀中頃 CE", zh: "约公元18世纪后半–19世纪中叶" },
  { pattern: /江戸時代/, ja: "17–19世紀 CE", zh: "约公元17–19世纪" },
  { pattern: /明治時代/, ja: "19世紀後半–20世紀初頭 CE", zh: "约公元19世纪后半–20世纪初" },
  { pattern: /大正時代/, ja: "20世紀初頭 CE", zh: "公元20世纪初" },
  { pattern: /昭和初期|大正末期.*昭和初期/, ja: "20世紀前半 CE", zh: "公元20世纪前半" },
  { pattern: /昭和中期/, ja: "20世紀中頃 CE", zh: "公元20世纪中叶" },
  { pattern: /昭和後期/, ja: "20世紀後半 CE", zh: "公元20世纪后半" },
  { pattern: /昭和時代/, ja: "20世紀 CE", zh: "公元20世纪" },
  { pattern: /古代/, ja: "6–8世紀頃 CE", zh: "约公元6–8世纪" },
  { pattern: /中世/, ja: "12世紀末–16世紀頃 CE", zh: "约公元12世纪末–16世纪" },
  { pattern: /近世/, ja: "16世紀後半–19世紀中頃 CE", zh: "约公元16世纪后半–19世纪中叶" },
] as const;

const WORLD_ERA_RANGES = [
  { pattern: /ウル第三王朝/, ja: "紀元前21世紀頃", zh: "约公元前21世纪" },
  { pattern: /エジプト古王国時代.*第3王朝/, ja: "紀元前27世紀頃", zh: "约公元前27世纪" },
  { pattern: /エジプト第4王朝/, ja: "紀元前26世紀頃", zh: "约公元前26世纪" },
  { pattern: /エジプト第11王朝.*第18王朝/, ja: "紀元前21–13世紀頃", zh: "约公元前21–13世纪" },
  { pattern: /アケメネス朝/, ja: "紀元前6–4世紀", zh: "公元前6–4世纪" },
  { pattern: /プトレマイオス朝/, ja: "紀元前4–1世紀", zh: "公元前4–1世纪" },
  { pattern: /古代ギリシア|古代ギリシャ/, ja: "紀元前8–1世紀頃", zh: "约公元前8–1世纪" },
  { pattern: /共和政ローマ末期.*帝政初期/, ja: "紀元前1世紀–1世紀 CE", zh: "公元前1世纪–公元1世纪" },
  { pattern: /ローマ帝国末期/, ja: "4–5世紀 CE", zh: "公元4–5世纪" },
  { pattern: /東ローマ帝国.*ユスティニアヌス朝/, ja: "6世紀 CE", zh: "公元6世纪" },
  { pattern: /ローマ帝国|古代ローマ/, ja: "紀元前1世紀–5世紀 CE", zh: "公元前1世纪–公元5世纪" },
  { pattern: /古代末期/, ja: "3–6世紀頃 CE", zh: "约公元3–6世纪" },
  { pattern: /中世ビザンツ帝国/, ja: "7–15世紀頃 CE", zh: "约公元7–15世纪" },
  { pattern: /カロリング朝/, ja: "8世紀後半–10世紀頃 CE", zh: "约公元8世纪后半–10世纪" },
  { pattern: /中世.*ロマネスク/, ja: "10–12世紀頃 CE", zh: "约公元10–12世纪" },
  { pattern: /中世盛期/, ja: "11–13世紀頃 CE", zh: "约公元11–13世纪" },
  { pattern: /中世/, ja: "5–15世紀頃 CE", zh: "约公元5–15世纪" },
  { pattern: /ゴシック末期/, ja: "15–16世紀頃 CE", zh: "约公元15–16世纪" },
  { pattern: /ルネサンス初期/, ja: "14–15世紀頃 CE", zh: "约公元14–15世纪" },
  { pattern: /ルネサンス期|イギリス・ルネサンス期/, ja: "14–16世紀頃 CE", zh: "约公元14–16世纪" },
  { pattern: /バロック時代|バロック期/, ja: "17–18世紀頃 CE", zh: "约公元17–18世纪" },
  { pattern: /ヴィクトリア朝/, ja: "19世紀 CE", zh: "公元19世纪" },
] as const;

const CONSTRUCTION_TERMS = /(建立|建設|創建|竣工|完成|造営|再建|改修|築造|建造|落成|開館)/;

const ERA_YEAR_BOUNDS = [
  { pattern: /縄文時代/, start: -14000, end: -300 },
  { pattern: /弥生時代/, start: -900, end: 300 },
  { pattern: /古墳時代/, start: 250, end: 710 },
  { pattern: /白鳳時代/, start: 645, end: 710 },
  { pattern: /飛鳥時代/, start: 592, end: 710 },
  { pattern: /奈良時代/, start: 710, end: 794 },
  { pattern: /平安時代後期/, start: 1000, end: 1185 },
  { pattern: /平安時代/, start: 794, end: 1185 },
  { pattern: /鎌倉時代前期/, start: 1185, end: 1250 },
  { pattern: /鎌倉時代後期|鎌倉時代末期/, start: 1250, end: 1336 },
  { pattern: /鎌倉時代/, start: 1185, end: 1336 },
  { pattern: /室町時代初期/, start: 1336, end: 1400 },
  { pattern: /室町時代中期/, start: 1400, end: 1500 },
  { pattern: /室町時代後期/, start: 1467, end: 1573 },
  { pattern: /室町時代/, start: 1336, end: 1573 },
  { pattern: /戦国時代/, start: 1467, end: 1603 },
  { pattern: /安土桃山時代|桃山時代/, start: 1573, end: 1603 },
  { pattern: /江戸時代初期/, start: 1603, end: 1650 },
  { pattern: /江戸時代前期/, start: 1603, end: 1750 },
  { pattern: /江戸時代中期/, start: 1700, end: 1800 },
  { pattern: /江戸時代後期/, start: 1750, end: 1868 },
  { pattern: /江戸時代/, start: 1603, end: 1868 },
  { pattern: /明治時代/, start: 1868, end: 1912 },
  { pattern: /大正時代/, start: 1912, end: 1926 },
  { pattern: /昭和初期/, start: 1926, end: 1945 },
  { pattern: /昭和中期/, start: 1945, end: 1965 },
  { pattern: /昭和後期/, start: 1965, end: 1989 },
  { pattern: /昭和時代/, start: 1926, end: 1989 },
  { pattern: /古代/, start: 592, end: 794 },
  { pattern: /中世/, start: 1185, end: 1603 },
  { pattern: /近世/, start: 1573, end: 1868 },
] as const;

function exactYearLabel(year: number, lang: Language) {
  const century = Math.ceil(year / 100);
  return lang === "ja" ? `${year}年 · ${century}世紀 CE` : `公元${year}年 · ${century}世纪`;
}

function periodNotation(period: string, lang: Language) {
  const bceYearRange = period.match(/^紀元前\s*(\d{1,4})\s*[〜～–—-]\s*(\d{1,4})(?:年)?/);
  if (bceYearRange) {
    return lang === "ja"
      ? `${bceYearRange[1]}–${bceYearRange[2]}年 BCE`
      : `公元前${bceYearRange[1]}–${bceYearRange[2]}年`;
  }

  const bceCentury = period.match(/^紀元前\s*(\d{1,2})世紀(.*?)(?:（|$)/);
  if (bceCentury) {
    const qualifier = bceCentury[2].trim();
    const qualifierZh = qualifier
      .replaceAll("初頭", "初")
      .replaceAll("中頃", "中叶")
      .replaceAll("後半", "后半");
    return lang === "ja"
      ? `${bceCentury[1]}世紀${qualifier} BCE`
      : `公元前${bceCentury[1]}世纪${qualifierZh}`;
  }

  const extantYear = period.match(/現存.*?(\d{3,4})年/);
  if (extantYear) return exactYearLabel(Number(extantYear[1]), lang);

  const parentheticalYear = period.match(/（(\d{3,4})年/);
  if (parentheticalYear) return exactYearLabel(Number(parentheticalYear[1]), lang);

  const yearRange = period.match(/^(\d{1,4})\s*[〜～–—-]\s*(\d{1,4})年/);
  if (yearRange) {
    const start = Number(yearRange[1]);
    const end = Number(yearRange[2]);
    const centuries = Math.ceil(start / 100) === Math.ceil(end / 100)
      ? `${Math.ceil(start / 100)}`
      : `${Math.ceil(start / 100)}–${Math.ceil(end / 100)}`;
    return lang === "ja"
      ? `${start}–${end}年 · ${centuries}世紀 CE`
      : `公元${start}–${end}年 · ${centuries}世纪`;
  }

  const exactYear = period.match(/^(\d{3,4})年/);
  if (exactYear) return exactYearLabel(Number(exactYear[1]), lang);

  const centuryRange = period.match(/^(\d{1,2})\s*[〜～–—-]\s*(\d{1,2})世紀/);
  if (centuryRange) {
    return lang === "ja"
      ? `${centuryRange[1]}–${centuryRange[2]}世紀 CE`
      : `公元${centuryRange[1]}–${centuryRange[2]}世纪`;
  }

  const century = period.match(/^(\d{1,2})世紀(.*?)(?:（|$)/);
  if (century) {
    const qualifier = century[2].trim();
    const qualifierZh = qualifier
      .replaceAll("初頭", "初")
      .replaceAll("中葉", "中叶")
      .replaceAll("中頃", "中叶")
      .replaceAll("後半", "后半")
      .replaceAll("以降", "以后");
    return lang === "ja"
      ? `${century[1]}世紀${qualifier} CE`
      : `公元${century[1]}世纪${qualifierZh}`;
  }
  return null;
}

function constructionYears(history: string) {
  const sentences = history.split("。").filter(Boolean);
  const constructionSentences = sentences.filter((sentence) => CONSTRUCTION_TERMS.test(sentence));

  // Prefer the date of the extant/current building when the record distinguishes
  // it from an earlier foundation.
  const currentSentence = constructionSentences.find((sentence) => /(現在の|現存する|現存建物|現在地)/.test(sentence));
  const candidates: number[] = [];
  for (const sentence of currentSentence ? [currentSentence, ...constructionSentences] : constructionSentences) {
    const years = Array.from(sentence.matchAll(/(\d{3,4})年(?!前)/g), (match) => Number(match[1]));
    const ordered = /(現在の|現存する|現存建物)/.test(sentence) && years.length > 1 ? [...years].reverse() : years;
    for (const year of ordered) if (!candidates.includes(year)) candidates.push(year);
  }
  return candidates;
}

export function getJapaneseBuildingChronology(
  building: JapaneseBuildingChronologySource,
  lang: Language
) {
  if (!building.regions.includes("japan")) return null;

  const era = ERA_RANGES.find(({ pattern }) => pattern.test(building.period.ja));
  const bounds = ERA_YEAR_BOUNDS.find(({ pattern }) => pattern.test(building.period.ja));

  // An explicit year/century in the normalized period is the card's intended
  // dating and takes precedence over later repairs mentioned in its history.
  // For an era-labelled record, however, a parenthetical restoration or
  // designation year must not replace the historical period of the subject.
  const directNotation = periodNotation(building.period.ja, lang);
  const periodYears = [...new Set(Array.from(
    building.period.ja.matchAll(/(?<!\d)(\d{3,4})年/g),
    (match) => Number(match[1])
  ))];
  const directYearMatchesEra = !bounds || periodYears.length === 0 ||
    periodYears.length === 1 && periodYears[0] >= bounds.start && periodYears[0] <= bounds.end;
  if (directNotation && directYearMatchesEra) return directNotation;

  const year = constructionYears(building.history.ja).find((candidate) =>
    !bounds || candidate >= bounds.start && candidate <= bounds.end
  );
  if (year) return exactYearLabel(year, lang);

  if (!era) return null;
  return lang === "ja" ? `時代範囲：${era.ja}` : `时代范围：${era.zh}`;
}

export function getBuildingChronology(
  building: JapaneseBuildingChronologySource,
  lang: Language
) {
  const japaneseChronology = getJapaneseBuildingChronology(building, lang);
  if (japaneseChronology) return japaneseChronology;

  const directNotation = periodNotation(building.period.ja, lang);
  if (directNotation) return directNotation;

  // Some normalized records use Japanese era labels even when their region was
  // imported as "global". Keep their dating consistent with Japan records.
  const japaneseEra = ERA_RANGES.find(({ pattern }) => pattern.test(building.period.ja));
  if (japaneseEra) {
    return lang === "ja" ? `時代範囲：${japaneseEra.ja}` : `时代范围：${japaneseEra.zh}`;
  }

  const worldEra = WORLD_ERA_RANGES.find(({ pattern }) => pattern.test(building.period.ja));
  if (!worldEra) return null;
  return lang === "ja" ? `時代範囲：${worldEra.ja}` : `时代范围：${worldEra.zh}`;
}
