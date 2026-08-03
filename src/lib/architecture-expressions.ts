import { planningReadingCards } from "./architecture-planning-reading";

export type ExpressionCategory = "建筑计划" | "建筑史" | "建筑构法";
export type ExpressionSkill = "描述" | "比较" | "原因" | "结果" | "评价";
export type ObservationAxis = "使用者与活动" | "空间单元" | "配置关系" | "动线" | "边界关系" | "环境" | "行为与运营结果";
export type EntryType = "表达" | "Pattern" | "结果";
export type InferenceStrength = "直接观察" | "较强推论" | "需要背景知识";
export type FacilityType = "住宅" | "教育" | "医疗・福祉" | "商业・办公" | "文化・公共" | "都市";

export type ArchitectureExpression = {
  id: number | string;
  meaning: string;
  japanese: string;
  category: ExpressionCategory;
  axis?: ObservationAxis;
  secondaryAxes?: ObservationAxis[];
  entryType?: EntryType;
  visualCues?: string[];
  recognition?: string;
  effects?: string[];
  inference?: InferenceStrength;
  facilities?: FacilityType[];
  relatedPatternIds?: string[];
  scene?: string;
  example: string;
  related: string[];
  skills: ExpressionSkill[];
  difficulty: 1 | 2 | 3;
};

export const architectureExpressions: ArchitectureExpression[] = [
  ...planningReadingCards,

  { id: 11, meaning: "建于……时期", japanese: "〜時代に建てられた", category: "建筑史", scene: "交代建筑物的时代背景", example: "この寺院は鎌倉時代に建てられた。", related: ["時代", "建立"], skills: ["描述"], difficulty: 1 },
  { id: 12, meaning: "由……设计", japanese: "〜によって設計された", category: "建筑史", scene: "说明建筑师或设计主体", example: "この建築はル・コルビュジエによって設計された。", related: ["建築家", "設計"], skills: ["描述"], difficulty: 1 },
  { id: 13, meaning: "以……为特征", japanese: "〜を特徴とする", category: "建筑史", scene: "概括样式、作品或时代特征", example: "ゴシック建築は尖頭アーチを特徴とする。", related: ["特徴", "様式"], skills: ["描述"], difficulty: 1 },
  { id: 14, meaning: "可以看到……", japanese: "〜が見られる", category: "建筑史", scene: "从图像或作品中指出具体特征", example: "正面には左右対称の構成が見られる。", related: ["外観", "構成"], skills: ["描述"], difficulty: 1 },
  { id: 15, meaning: "受到……的影响", japanese: "〜の影響を受けている", category: "建筑史", scene: "说明样式、人物或地域间的影响", example: "この建築は西洋建築の影響を受けている。", related: ["影響", "受容"], skills: ["原因"], difficulty: 1 },
  { id: 16, meaning: "从……发展而来", japanese: "〜から発展した", category: "建筑史", scene: "说明建筑类型或样式的演变", example: "この形式は伝統的な住宅から発展した。", related: ["発展", "変化"], skills: ["原因", "结果"], difficulty: 2 },
  { id: 17, meaning: "从……转向……", japanese: "〜から〜へ移行した", category: "建筑史", scene: "概括时代或设计思想的变化", example: "装飾中心の表現から機能重視の設計へ移行した。", related: ["移行", "近代化"], skills: ["比较", "结果"], difficulty: 2 },
  { id: 18, meaning: "与……形成对照", japanese: "〜と対照的である", category: "建筑史", scene: "比较两个作品、样式或立面", example: "簡素な外観は華やかな内部空間と対照的である。", related: ["対照", "内外"], skills: ["比较"], difficulty: 2 },
  { id: 19, meaning: "在……方面具有重要意义", japanese: "〜という点で重要である", category: "建筑史", scene: "评价作品的历史地位", example: "近代建築の成立を示すという点で重要である。", related: ["意義", "評価"], skills: ["评价"], difficulty: 2 },
  { id: 20, meaning: "对后来的……产生了影响", japanese: "後の〜に影響を与えた", category: "建筑史", scene: "说明作品、思想或技术的后续影响", example: "この思想は後の都市計画に影響を与えた。", related: ["継承", "影響"], skills: ["结果", "评价"], difficulty: 2 },

  { id: 21, meaning: "使用……", japanese: "〜を用いる", category: "建筑构法", scene: "说明材料、构件或施工方法", example: "柱と梁に鉄筋コンクリートを用いる。", related: ["材料", "部材"], skills: ["描述"], difficulty: 1 },
  { id: 22, meaning: "由……支撑", japanese: "〜によって支えられる", category: "建筑构法", scene: "说明荷载与支承关系", example: "屋根は複数の柱によって支えられる。", related: ["支持", "荷重"], skills: ["描述"], difficulty: 1 },
  { id: 23, meaning: "将……传递到……", japanese: "〜を〜に伝える", category: "建筑构法", scene: "说明力或荷载的传递路径", example: "梁は床の荷重を柱に伝える。", related: ["荷重", "伝達"], skills: ["描述", "结果"], difficulty: 1 },
  { id: 24, meaning: "通过……固定", japanese: "〜によって固定する", category: "建筑构法", scene: "说明构件的连接与固定方法", example: "接合部をボルトによって固定する。", related: ["接合", "ボルト"], skills: ["描述"], difficulty: 1 },
  { id: 25, meaning: "可以抵抗……", japanese: "〜に抵抗することができる", category: "建筑构法", scene: "说明结构或构件的性能", example: "耐力壁は水平力に抵抗することができる。", related: ["水平力", "耐力壁"], skills: ["结果", "评价"], difficulty: 1 },
  { id: 26, meaning: "为了防止……", japanese: "〜を防ぐために", category: "建筑构法", scene: "说明防水、防火、腐蚀等措施的目的", example: "雨水の侵入を防ぐために、防水層を設ける。", related: ["防水", "保護"], skills: ["原因"], difficulty: 1 },
  { id: 27, meaning: "通过……，能够……", japanese: "〜ことにより、〜ことができる", category: "建筑构法", scene: "连接构造措施与其效果", example: "断熱材を入れることにより、熱損失を減らすことができる。", related: ["手段", "効果"], skills: ["原因", "结果"], difficulty: 2 },
  { id: 28, meaning: "……越大，……也越大", japanese: "〜ほど、〜が大きくなる", category: "建筑构法", scene: "说明尺寸、跨度与性能之间的关系", example: "スパンが長いほど、梁のたわみが大きくなる。", related: ["比例", "たわみ"], skills: ["比较", "结果"], difficulty: 2 },
  { id: 29, meaning: "与……相比，……性能更高", japanese: "〜よりも〜性能が高い", category: "建筑构法", scene: "比较材料或构法的性能", example: "鉄筋コンクリート造は木造よりも耐火性能が高い。", related: ["性能", "耐火"], skills: ["比较", "评价"], difficulty: 1 },
  { id: 30, meaning: "适合于……", japanese: "〜に適している", category: "建筑构法", scene: "评价材料或结构形式的适用范围", example: "この構法は大きな空間をつくるのに適している。", related: ["適用", "大空間"], skills: ["评价"], difficulty: 1 },
];
