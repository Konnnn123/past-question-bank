import type { LineageLocalizedText } from "@/lib/japanese-person-lineages";

export type LineageEntityType = "person" | "building" | "term" | "event";
export type KnowledgeConfidence = "confirmed" | "approximate" | "traditional" | "disputed" | "research_required";
export type KnowledgeRelationType = "family" | "commissioned" | "promoted" | "reconstructed" | "contains" | "exemplifies" | "associated_with";
export type HistoricalPhaseType = "founded" | "constructed" | "burned" | "reconstructed" | "restored" | "current_structure" | "associated_event";

export interface LineageKnowledgeEntity {
  id: string;
  type: LineageEntityType;
  name: LineageLocalizedText;
  reading?: string;
  date?: LineageLocalizedText;
  location?: LineageLocalizedText;
  summary: LineageLocalizedText;
  confidence: KnowledgeConfidence;
  buildingId?: string;
}

export interface LineageKnowledgeRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: KnowledgeRelationType;
  label: LineageLocalizedText;
  description: LineageLocalizedText;
  confidence: KnowledgeConfidence;
  sourceRefs: string[];
}

export interface LineageHistoricalPhase {
  id: string;
  entityId: string;
  type: HistoricalPhaseType;
  displayDate: LineageLocalizedText;
  description: LineageLocalizedText;
  confidence: KnowledgeConfidence;
  sourceRefs: string[];
}

export interface LineageExamTrap {
  label: LineageLocalizedText;
  explanation: LineageLocalizedText;
}

export interface JapaneseLineageCaseStudy {
  id: string;
  lineageId: string;
  title: LineageLocalizedText;
  eyebrow: LineageLocalizedText;
  primaryEntityId: string;
  whyImportant: LineageLocalizedText;
  background: LineageLocalizedText;
  entities: LineageKnowledgeEntity[];
  relations: LineageKnowledgeRelation[];
  phases: LineageHistoricalPhase[];
  examFocus: LineageLocalizedText[];
  examTraps: LineageExamTrap[];
  sources: { id: string; label: LineageLocalizedText; href?: string }[];
}

export const JAPANESE_LINEAGE_CASE_STUDIES: JapaneseLineageCaseStudy[] = [
  {
    id: "case-higashi-sanjo-dono",
    lineageId: "heian-fujiwara",
    title: { ja: "東三条殿", zh: "东三条殿" },
    eyebrow: { ja: "寝殿造を空間語で読む", zh: "用空间术语理解寝殿造" },
    primaryEntityId: "case-building-higashi-sanjo-dono",
    whyImportant: {
      ja: "現存建物ではなく、文献・絵画・遺構から寝殿造を考える復元上の基準例。『寝殿造＝完全な左右対称』と暗記せず、寝殿・対・廊・庭の関係を読むために重要。",
      zh: "它并非现存建筑，而是依据文献、绘画与遗迹研究寝殿造的复原基准。重点不是死记“寝殿造＝完全左右对称”，而是理解寝殿、对屋、廊与庭院的关系。",
    },
    background: {
      ja: "平安貴族の邸宅は、居住だけでなく儀礼・政治・饗宴の場だった。東三条殿は藤原摂関家と深く結びつき、時期ごとの修造や利用を経ているため、単一の竣工年で扱わない。",
      zh: "平安贵族宅邸不仅用于居住，也承载礼仪、政治与宴飨。东三条殿与藤原摄关家关系密切，并经历不同时期的修造和使用，因此不能用一个竣工年份概括。",
    },
    entities: [
      { id: "case-building-higashi-sanjo-dono", type: "building", name: { ja: "東三条殿", zh: "东三条殿" }, reading: "とうさんじょうどの", date: { ja: "平安時代・複数段階", zh: "平安时代／多个阶段" }, location: { ja: "平安京左京三条三坊", zh: "平安京左京三条三坊" }, summary: { ja: "藤原摂関家の代表的邸宅として知られ、寝殿造の復元研究で参照される。", zh: "作为藤原摄关家的代表性宅邸而知名，是寝殿造复原研究的重要参照。" }, confidence: "confirmed", buildingId: "building-supplemental-higashi-sanjo-dono" },
      { id: "case-person-fujiwara-michinaga", type: "person", name: { ja: "藤原道長", zh: "藤原道长" }, date: { ja: "966–1028", zh: "966–1028" }, summary: { ja: "摂関家の権力と邸宅利用を考える主要人物。ただし人物の政治年を建物竣工年へ置き換えない。", zh: "理解摄关家权力与宅邸使用的主要人物，但不能把其政治生涯年份替换成建筑竣工年。" }, confidence: "confirmed" },
      { id: "term-shinden-zukuri", type: "term", name: { ja: "寝殿造", zh: "寝殿造" }, reading: "しんでんづくり", summary: { ja: "寝殿を中心に対・廊・庭園を組み、儀礼と生活を支えた平安貴族住宅の構成。", zh: "以寝殿为中心组织对屋、廊与庭园，支撑平安贵族礼仪和生活的住宅构成。" }, confidence: "confirmed" },
      { id: "term-higashi-no-tai", type: "term", name: { ja: "東対", zh: "东对" }, reading: "ひがしのたい", summary: { ja: "寝殿東側の対屋。単なる方位名ではなく、寝殿・渡殿・南庭との関係で読む空間単位。", zh: "位于寝殿东侧的对屋。它不只是方向标签，而是要结合寝殿、渡殿与南庭理解的空间单元。" }, confidence: "confirmed" },
      { id: "term-nishi-no-tai", type: "term", name: { ja: "西対", zh: "西对" }, reading: "にしのたい", summary: { ja: "寝殿西側の対屋。東西の対が常に同規模・同時に揃うとは限らない。", zh: "位于寝殿西侧的对屋。东西两面对屋并不一定总是同规模、同时存在。" }, confidence: "confirmed" },
      { id: "term-watadono", type: "term", name: { ja: "渡殿", zh: "渡殿" }, reading: "わたどの", summary: { ja: "寝殿と対屋などをつなぐ廊。建物群を儀礼動線として結ぶ。", zh: "连接寝殿与对屋等建筑的廊道，使建筑群形成礼仪动线。" }, confidence: "confirmed" },
      { id: "term-tsuridono", type: "term", name: { ja: "釣殿", zh: "钓殿" }, reading: "つりどの", summary: { ja: "池辺へ張り出す施設。庭園・水面・饗宴との関係を示す。", zh: "伸向池边的设施，体现建筑与庭园、水面及宴飨活动的联系。" }, confidence: "confirmed" },
      { id: "event-higashi-sanjo-1016", type: "event", name: { ja: "1016年という関連年", zh: "1016这一关联年份" }, date: { ja: "1016年", zh: "1016年" }, summary: { ja: "道長の摂政就任など政治史上の節目。現段階の資料では東三条殿の唯一の竣工年とは扱わない。", zh: "与道长出任摄政等政治史节点相关；按当前资料，不把它视为东三条殿唯一的竣工年。" }, confidence: "research_required" },
    ],
    relations: [
      { id: "higashi-sanjo-michinaga", sourceId: "case-person-fujiwara-michinaga", targetId: "case-building-higashi-sanjo-dono", type: "associated_with", label: { ja: "摂関家の邸宅利用", zh: "摄关家宅邸使用" }, description: { ja: "道長時代の藤原摂関家と東三条殿を結ぶが、設計者関係ではない。", zh: "把道长时代的藤原摄关家与东三条殿联系起来，但这不是设计者关系。" }, confidence: "confirmed", sourceRefs: ["kyoto-city-site", "project-building-record"] },
      { id: "higashi-sanjo-shinden", sourceId: "case-building-higashi-sanjo-dono", targetId: "term-shinden-zukuri", type: "exemplifies", label: { ja: "復元研究の基準例", zh: "复原研究基准案例" }, description: { ja: "寝殿造の空間構成を学ぶ代表的な復元例。", zh: "用于学习寝殿造空间构成的代表性复原案例。" }, confidence: "confirmed", sourceRefs: ["kyoto-archaeology", "project-building-record"] },
      ...["term-higashi-no-tai", "term-nishi-no-tai", "term-watadono", "term-tsuridono"].map((targetId, index) => ({ id: `higashi-sanjo-space-${index}`, sourceId: "case-building-higashi-sanjo-dono", targetId, type: "contains" as const, label: { ja: "空間構成", zh: "空间构成" }, description: { ja: "復元図を読むための構成要素。", zh: "阅读复原图所需的构成要素。" }, confidence: "confirmed" as const, sourceRefs: ["kyoto-archaeology"] })),
      { id: "higashi-sanjo-1016-relation", sourceId: "event-higashi-sanjo-1016", targetId: "case-building-higashi-sanjo-dono", type: "associated_with", label: { ja: "関連年・要再確認", zh: "关联年份／需复核" }, description: { ja: "人物・政治史の年を建物の完成年と混同しない。", zh: "不要把人物、政治史年份误当成建筑完成年份。" }, confidence: "research_required", sourceRefs: ["project-exam-context"] },
    ],
    phases: [
      { id: "higashi-sanjo-heian", entityId: "case-building-higashi-sanjo-dono", type: "constructed", displayDate: { ja: "平安時代", zh: "平安时代" }, description: { ja: "藤原氏邸宅として複数時期に利用・修造。単一の創建／完成年では示せない。", zh: "作为藤原氏宅邸在多个时期被使用和修造，不能用单一创建或完成年份表示。" }, confidence: "approximate", sourceRefs: ["kyoto-city-site", "project-building-record"] },
      { id: "higashi-sanjo-1016", entityId: "case-building-higashi-sanjo-dono", type: "associated_event", displayDate: { ja: "1016年（関連年）", zh: "1016年（关联年份）" }, description: { ja: "現時点では建築の竣工年として採用しない。", zh: "当前不把它作为建筑竣工年份。" }, confidence: "research_required", sourceRefs: ["project-exam-context"] },
      { id: "higashi-sanjo-reconstruction", entityId: "case-building-higashi-sanjo-dono", type: "current_structure", displayDate: { ja: "現存せず・復元研究", zh: "不存／复原研究" }, description: { ja: "現在の学習対象は現存建物ではなく、史料と研究に基づく空間復元。", zh: "目前的学习对象不是现存建筑，而是依据史料与研究形成的空间复原。" }, confidence: "confirmed", sourceRefs: ["kyoto-archaeology"] },
    ],
    examFocus: [
      { ja: "寝殿・対屋・渡殿・南庭を一つの空間システムとして対応させる。", zh: "把寝殿、对屋、渡殿与南庭作为同一个空间系统匹配。" },
      { ja: "東対／西対を単純な方位語ではなく寝殿造の構成語として読む。", zh: "把东对／西对作为寝殿造构成术语，而非普通方向词。" },
      { ja: "現存遺構ではなく復元上の基準例であることを押さえる。", zh: "确认它不是现存遗构，而是复原研究的基准案例。" },
    ],
    examTraps: [
      { label: { ja: "東西の対が常に完全対称", zh: "东西对屋始终完全对称" }, explanation: { ja: "寝殿造の模式図と個別邸宅の実態を混同している。東西が常に揃うとは限らない。", zh: "这是把寝殿造模式图与具体宅邸实际情况混为一谈，东西对屋并不一定总是同时齐备。" } },
      { label: { ja: "1016年＝東三条殿の竣工年", zh: "1016年＝东三条殿竣工年" }, explanation: { ja: "人物・政治史上の関連年としては重要でも、現資料だけでは建物の唯一の完成年にできない。", zh: "即使它是人物或政治史的重要关联年，现有资料也不足以把它当作建筑唯一完成年份。" } },
    ],
    sources: [
      { id: "project-building-record", label: { ja: "既存建築データ｜東三条殿", zh: "现有建筑数据｜东三条殿" } },
      { id: "project-exam-context", label: { ja: "既存過去問リンク資料", zh: "现有真题关联资料" } },
      { id: "kyoto-city-site", label: { ja: "京都市｜東三条殿址", zh: "京都市｜东三条殿址" }, href: "https://www2.city.kyoto.lg.jp/somu/rekishi/fm/ishibumi/html/na004.html" },
      { id: "kyoto-archaeology", label: { ja: "京都市考古資料館｜寝殿造研究", zh: "京都市考古资料馆｜寝殿造研究" }, href: "https://www.kyoto-arc.or.jp/News/s-kouza/kouza315.pdf" },
    ],
  },
  {
    id: "case-todaiji-bell-tower",
    lineageId: "medieval-monks",
    title: { ja: "東大寺鐘楼", zh: "东大寺钟楼" },
    eyebrow: { ja: "建物・梵鐘・復興人物を分ける", zh: "区分建筑、梵钟与复兴人物" },
    primaryEntityId: "case-building-todaiji-shoro",
    whyImportant: {
      ja: "奈良時代の梵鐘を吊るす鎌倉再建の建物で、大仏様を基調に禅宗様的要素を加える。異なる年代・人物・対象が一問に重なるため、試験で錯配が生じやすい。",
      zh: "它是悬挂奈良时代梵钟的镰仓重建建筑，以大佛样为基础并加入禅宗样因素。多个年代、人物和对象集中在同一题中，因此特别容易错配。",
    },
    background: {
      ja: "1180年の兵火後、重源が東大寺復興を主導した。重源没後に大勧進を継いだ栄西が、承元年間に現在の鐘楼を再建した。",
      zh: "1180年兵火后，重源主导东大寺复兴；重源去世后继任大劝进的荣西，在承元年间重建了现存钟楼。",
    },
    entities: [
      { id: "case-building-todaiji-shoro", type: "building", name: { ja: "東大寺鐘楼", zh: "东大寺钟楼" }, reading: "とうだいじしょうろう", date: { ja: "承元年間（1207–1210頃）", zh: "承元年间（约1207–1210）" }, location: { ja: "奈良・東大寺鐘楼ヶ丘", zh: "奈良／东大寺钟楼丘" }, summary: { ja: "栄西が再建した現存鐘楼。大仏様に禅宗様的要素を加味する。", zh: "荣西重建的现存钟楼，在大佛样基础上加入禅宗样因素。" }, confidence: "confirmed", buildingId: "building-aeb9da82ed0e" },
      { id: "case-object-todaiji-bonsho", type: "term", name: { ja: "東大寺梵鐘", zh: "东大寺梵钟" }, reading: "ぼんしょう", date: { ja: "奈良時代・752年頃", zh: "奈良时代／约752年" }, summary: { ja: "鐘楼に吊られる大鐘。現存鐘楼そのものとは別の対象・別の年代。", zh: "悬挂在钟楼中的大钟，与现存钟楼是不同对象、不同年代。" }, confidence: "confirmed" },
      { id: "case-person-chogen", type: "person", name: { ja: "重源", zh: "重源" }, date: { ja: "1121–1206", zh: "1121–1206" }, summary: { ja: "1180年焼失後の東大寺復興を主導した大勧進。現存鐘楼の直接の再建者ではない。", zh: "主导1180年烧毁后的东大寺复兴，但不是现存钟楼的直接重建者。" }, confidence: "confirmed" },
      { id: "case-person-eisai", type: "person", name: { ja: "栄西", zh: "荣西" }, reading: "ようさい", date: { ja: "1141–1215", zh: "1141–1215" }, summary: { ja: "重源の後に東大寺大勧進となり、承元年間に鐘楼を再建。", zh: "在重源之后担任东大寺大劝进，于承元年间重建钟楼。" }, confidence: "confirmed" },
      { id: "term-daibutsuyo", type: "term", name: { ja: "大仏様", zh: "大佛样" }, reading: "だいぶつよう", summary: { ja: "東大寺復興で採用された力強く合理的な架構。旧称は天竺様。", zh: "东大寺复兴采用的强劲、合理构架，旧称天竺样。" }, confidence: "confirmed" },
      { id: "term-zenshuyo", type: "term", name: { ja: "禅宗様", zh: "禅宗样" }, reading: "ぜんしゅうよう", summary: { ja: "宋代建築に由来する細部・架構体系。鐘楼では大仏様を基調に要素が加味される。", zh: "源于宋代建筑的细部与构架体系；钟楼是在大佛样基础上加入相关因素。" }, confidence: "confirmed" },
      { id: "event-todaiji-fire-1180", type: "event", name: { ja: "南都焼討", zh: "南都烧讨" }, date: { ja: "1180年", zh: "1180年" }, summary: { ja: "東大寺伽藍の大半が焼失し、鎌倉復興の契機となった。", zh: "东大寺伽蓝大半烧毁，成为镰仓复兴的契机。" }, confidence: "confirmed" },
    ],
    relations: [
      { id: "todaiji-chogen-revival", sourceId: "case-person-chogen", targetId: "case-building-todaiji-shoro", type: "promoted", label: { ja: "復興事業の前段", zh: "复兴事业前一阶段" }, description: { ja: "重源は東大寺復興全体を主導したが、現存鐘楼の直接再建者は栄西。", zh: "重源主导东大寺整体复兴，但现存钟楼的直接重建者是荣西。" }, confidence: "confirmed", sourceRefs: ["todaiji-history", "todaiji-shoro"] },
      { id: "todaiji-eisai-shoro", sourceId: "case-person-eisai", targetId: "case-building-todaiji-shoro", type: "reconstructed", label: { ja: "現存鐘楼を再建", zh: "重建现存钟楼" }, description: { ja: "承元年間（1207–1210頃）の再建。", zh: "于承元年间（约1207–1210）重建。" }, confidence: "confirmed", sourceRefs: ["todaiji-shoro"] },
      { id: "todaiji-shoro-bell", sourceId: "case-building-todaiji-shoro", targetId: "case-object-todaiji-bonsho", type: "contains", label: { ja: "梵鐘を吊る", zh: "悬挂梵钟" }, description: { ja: "奈良時代の梵鐘と鎌倉時代の鐘楼を別年代として扱う。", zh: "把奈良时代梵钟与镰仓时代钟楼作为不同年代的对象。" }, confidence: "confirmed", sourceRefs: ["todaiji-shoro"] },
      { id: "todaiji-shoro-daibutsuyo", sourceId: "case-building-todaiji-shoro", targetId: "term-daibutsuyo", type: "exemplifies", label: { ja: "様式の基調", zh: "样式基础" }, description: { ja: "鐘楼の架構は大仏様を基調とする。", zh: "钟楼构架以大佛样为基础。" }, confidence: "confirmed", sourceRefs: ["todaiji-shoro"] },
      { id: "todaiji-shoro-zenshuyo", sourceId: "case-building-todaiji-shoro", targetId: "term-zenshuyo", type: "exemplifies", label: { ja: "要素を加味", zh: "加入相关因素" }, description: { ja: "純粋な禅宗様建築とせず、禅宗様的要素を加味すると表現する。", zh: "不把它说成纯粹禅宗样建筑，而表述为加入禅宗样因素。" }, confidence: "confirmed", sourceRefs: ["todaiji-shoro"] },
    ],
    phases: [
      { id: "todaiji-bell-752", entityId: "case-object-todaiji-bonsho", type: "constructed", displayDate: { ja: "752年頃｜梵鐘", zh: "约752年｜梵钟" }, description: { ja: "奈良時代の大鐘の年代。現存鐘楼の年代ではない。", zh: "这是奈良时代大钟的年代，不是现存钟楼的年代。" }, confidence: "confirmed", sourceRefs: ["todaiji-shoro"] },
      { id: "todaiji-fire-1180", entityId: "event-todaiji-fire-1180", type: "burned", displayDate: { ja: "1180年｜伽藍焼失", zh: "1180年｜伽蓝烧毁" }, description: { ja: "南都焼討で伽藍の大半が焼失し、復興事業が始まる。", zh: "南都烧讨使伽蓝大半烧毁，随后开始复兴事业。" }, confidence: "confirmed", sourceRefs: ["todaiji-history"] },
      { id: "todaiji-chogen-1206", entityId: "case-person-chogen", type: "associated_event", displayDate: { ja: "1206年｜重源入滅", zh: "1206年｜重源去世" }, description: { ja: "復興事業の人物交代を理解する年。鐘楼完成年ではない。", zh: "用于理解复兴事业人物交替，不是钟楼完成年份。" }, confidence: "confirmed", sourceRefs: ["todaiji-history"] },
      { id: "todaiji-shoro-1207", entityId: "case-building-todaiji-shoro", type: "reconstructed", displayDate: { ja: "1207–1210頃｜現存鐘楼再建", zh: "约1207–1210｜重建现存钟楼" }, description: { ja: "大勧進を継いだ栄西が承元年間に再建。", zh: "继任大劝进的荣西于承元年间重建。" }, confidence: "confirmed", sourceRefs: ["todaiji-shoro"] },
    ],
    examFocus: [
      { ja: "建物＝鐘楼、内部の物＝梵鐘を分ける。", zh: "区分建筑“钟楼”与内部物件“梵钟”。" },
      { ja: "重源＝復興全体、栄西＝現存鐘楼再建と対応させる。", zh: "重源对应整体复兴，荣西对应现存钟楼重建。" },
      { ja: "大仏様を基調に禅宗様的要素を加味、と表現する。", zh: "应表述为以大佛样为基础、加入禅宗样因素。" },
    ],
    examTraps: [
      { label: { ja: "重源＝現存鐘楼の再建者", zh: "重源＝现存钟楼重建者" }, explanation: { ja: "重源は東大寺復興の中心人物なのでもっともらしいが、現存鐘楼の再建は後継の大勧進・栄西。", zh: "重源是东大寺复兴核心人物，因此很像正确答案；但现存钟楼由继任大劝进荣西重建。" } },
      { label: { ja: "752年＝現存鐘楼の建立年", zh: "752年＝现存钟楼建立年" }, explanation: { ja: "752年頃は奈良時代の梵鐘・大仏開眼背景と結びつく。現存鐘楼は鎌倉時代の再建。", zh: "约752年对应奈良时代梵钟及大佛开眼背景；现存钟楼是镰仓时代重建。" } },
      { label: { ja: "鐘楼＝純粋な禅宗様", zh: "钟楼＝纯粹禅宗样" }, explanation: { ja: "東大寺公式説明は、大仏様に禅宗様的要素を加味した建物としている。", zh: "东大寺官方说明是以大佛样为基础、加入禅宗样因素。" } },
    ],
    sources: [
      { id: "project-building-record", label: { ja: "既存建築データ｜南大門・鐘楼", zh: "现有建筑数据｜南大门与钟楼" } },
      { id: "todaiji-history", label: { ja: "東大寺｜歴史", zh: "东大寺｜历史" }, href: "https://www.todaiji.or.jp/history/" },
      { id: "todaiji-shoro", label: { ja: "東大寺｜鐘楼", zh: "东大寺｜钟楼" }, href: "https://www.todaiji.or.jp/information/shoro/" },
    ],
  },
];
