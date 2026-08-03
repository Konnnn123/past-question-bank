import { RECENT_REVIEW_ITEM_JA, RECENT_REVIEW_ITEMS } from "./recent-review-items";

export type ReviewItemSubject =
  | "environment"
  | "construction"
  | "planning"
  | "history"
  | "mechanics";

export type ReviewItemTaskType =
  | "formula"
  | "numeric"
  | "comparison"
  | "image"
  | "concept"
  | "calculation"
  | "process";

export type ReviewItemPriority = "core" | "support";

export type ReviewItemMediaRole = "prompt" | "answer" | "reference";

export interface ReviewItemMedia {
  src: string;
  role: ReviewItemMediaRole;
  altZh: string;
  altJa: string;
  captionZh?: string;
  captionJa?: string;
}

export type ReviewItemSource =
  | {
      kind: "notion";
      label: string;
      href: string;
    }
  | {
      kind: "pdf";
      label: string;
      fileName: string;
      pages: number[];
    }
  | {
      kind: "site";
      label: string;
      href: string;
    }
  | {
      kind: "question";
      label: string;
      href: string;
      years?: number[];
    };

export interface ReviewItem {
  id: string;
  subject: ReviewItemSubject;
  topic: string;
  title: string;
  taskType: ReviewItemTaskType;
  priority: ReviewItemPriority;
  years: number[];
  prompt: string;
  minimumAnswer: string;
  sources: ReviewItemSource[];
  keywords?: string[];
  media?: ReviewItemMedia[];
}

export type ReviewLocale = "zh" | "ja";

export interface LocalizedReviewItemCopy {
  topic: string;
  title: string;
  prompt: string;
  minimumAnswer: string;
}

const notion = {
  history: "https://app.notion.com/p/3a4e961e469080ec8171fe62817a7047",
  construction: "https://app.notion.com/p/3a4e961e4690805a9386ee00567913f0",
  planning: "https://app.notion.com/p/3a4e961e469080dc9afbfe9a559ae349",
};

const environmentMemory: ReviewItemSource = {
  kind: "site",
  label: "環工記憶マップ",
  href: "/environment-memory",
};

const environmentPdf = (page: number): ReviewItemSource => ({
  kind: "pdf",
  label: `環工整理 P${page}`,
  fileName: "环境工学.pdf",
  pages: [page],
});

const constructionNotion: ReviewItemSource = {
  kind: "notion",
  label: "構法錯題",
  href: notion.construction,
};

const planningNotion: ReviewItemSource = {
  kind: "notion",
  label: "計畫錯題",
  href: notion.planning,
};

const historyNotion: ReviewItemSource = {
  kind: "notion",
  label: "建築史錯題",
  href: notion.history,
};

const REVIEW_ITEM_BASE: ReviewItem[] = [
  {
    id: "environment-sound-db",
    subject: "environment",
    topic: "音響",
    title: "dB 的三組速算",
    taskType: "calculation",
    priority: "core",
    years: [2013, 2018, 2019, 2024, 2025, 2026],
    prompt: "功率／強度、音壓、距離分別改變時，dB 如何換算？",
    minimumAnswer: "功率與強度用 10log₁₀；音壓用 20log₁₀；自由音場距離加倍約 −6 dB。",
    sources: [environmentMemory, environmentPdf(1)],
    keywords: ["sound", "音圧", "強度", "距離減衰"],
  },
  {
    id: "environment-sound-room",
    subject: "environment",
    topic: "音響",
    title: "殘響、吸音與遮音",
    taskType: "comparison",
    priority: "core",
    years: [2013, 2014, 2015, 2016, 2017, 2020, 2023],
    prompt: "等價吸音面積、Sabine 殘響時間與透過損失各在描述什麼？",
    minimumAnswer: "A=ΣαS；T≈0.161V/A；透過損失 R=10log₁₀(1/τ)，吸音不等於遮音。",
    sources: [environmentMemory, environmentPdf(1)],
    keywords: ["Sabine", "吸音率", "透過率", "残響"],
  },
  {
    id: "environment-light-quantities",
    subject: "environment",
    topic: "照明",
    title: "五個測光量",
    taskType: "comparison",
    priority: "core",
    years: [2014, 2015, 2024, 2025],
    prompt: "光束、光度、照度、光束發散度、輝度的符號與意義是什麼？",
    minimumAnswer: "Φ：總光量；I：單位立體角光束；E：入射面照度；M：出射光束密度；L：方向性的明亮程度。",
    sources: [environmentMemory, environmentPdf(3)],
    keywords: ["光束", "光度", "照度", "輝度", "測光量"],
  },
  {
    id: "environment-light-purkinje",
    subject: "environment",
    topic: "照明",
    title: "Purkinje 現象",
    taskType: "concept",
    priority: "support",
    years: [2019, 2024],
    prompt: "明處轉到暗處時，哪一類顏色相對看起來更亮？原因是什麼？",
    minimumAnswer: "視覺由錐狀細胞轉向桿狀細胞，感度峰值往短波側移，藍綠相對更亮、紅色更暗。",
    sources: [environmentMemory, environmentPdf(2)],
    keywords: ["薄明視", "暗所視", "色"],
  },
  {
    id: "environment-ventilation-stack",
    subject: "environment",
    topic: "換気",
    title: "煙突效應與中性帶",
    taskType: "concept",
    priority: "core",
    years: [2015, 2016, 2020, 2022],
    prompt: "冬季高層建築的煙突效應如何形成？中性帶上下的壓力關係如何？",
    minimumAnswer: "室內暖空氣密度較小而上升；中性帶處壓差為零，其下通常外氣流入、其上室內空氣流出。",
    sources: [environmentMemory, environmentPdf(3)],
    keywords: ["温度差換気", "圧力差", "中性帯"],
  },
  {
    id: "environment-heat-radiation",
    subject: "environment",
    topic: "伝熱",
    title: "放射四條底線",
    taskType: "formula",
    priority: "core",
    years: [2016, 2019, 2022, 2024, 2026],
    prompt: "黑體、Stefan–Boltzmann、Kirchhoff 與形態係數各自表達什麼？",
    minimumAnswer: "黑體 α=ε=1；放射量與絕對溫度四次方成正比；熱平衡時 α=ε；形態係數描述面與面之間的幾何放射比例。",
    sources: [environmentMemory, environmentPdf(2)],
    keywords: ["黒体", "Stefan-Boltzmann", "Kirchhoff", "形態係数"],
  },
  {
    id: "environment-moisture-dew",
    subject: "environment",
    topic: "湿気",
    title: "露點、飽和與結露",
    taskType: "concept",
    priority: "core",
    years: [2014, 2019, 2022, 2024],
    prompt: "露點溫度如何定義？表面結露在什麼條件下發生？",
    minimumAnswer: "在含濕量不變下冷卻至相對濕度 100% 的溫度是露點；表面溫度低於露點時結露。",
    sources: [environmentMemory, environmentPdf(3)],
    keywords: ["相対湿度", "飽和水蒸気圧", "結露"],
  },
  {
    id: "environment-system-trap",
    subject: "environment",
    topic: "設備",
    title: "排水存水彎的破封",
    taskType: "comparison",
    priority: "support",
    years: [2015, 2020],
    prompt: "自虹吸、反壓與毛細管作用分別怎樣破壞水封？",
    minimumAnswer: "自虹吸把封水吸走；反壓把封水推出；毛細管作用由垂入封水的纖維等把水帶走。",
    sources: [environmentMemory, environmentPdf(3)],
    keywords: ["トラップ", "封水", "サイホン", "逆圧"],
  },
  {
    id: "construction-slump-flow",
    subject: "construction",
    topic: "コンクリート",
    title: "スランプ試験 vs スランプフロー試験",
    taskType: "comparison",
    priority: "core",
    years: [2024, 2025],
    prompt: "兩種試驗分別量測什麼，主要適用於哪類混凝土？",
    minimumAnswer: "slump 量測圓錐體高度下降；slump flow 量測水平擴散直徑，常用於高流動混凝土。",
    sources: [constructionNotion, { kind: "site", label: "構法知識地圖", href: "/construction-methods-knowledge-map" }],
    keywords: ["コンクリート", "流動性", "試験"],
  },
  {
    id: "construction-fresh-concrete-properties",
    subject: "construction",
    topic: "コンクリート",
    title: "新拌混凝土四個近似概念",
    taskType: "comparison",
    priority: "core",
    years: [2013, 2014, 2015, 2024, 2025],
    prompt: "workability、consistency、材料分離抵抗性與 finishing 分別指什麼？",
    minimumAnswer: "workability 是施工操作綜合難易；consistency 是軟硬／流動程度；分離抵抗性是保持均勻；finishing 是表面整飾容易度。",
    sources: [constructionNotion, { kind: "site", label: "構法知識地圖", href: "/construction-methods-knowledge-map" }],
    keywords: ["ワーカビリティー", "コンシステンシー", "仕上げ性"],
  },
  {
    id: "construction-all-casing",
    subject: "construction",
    topic: "基礎・杭",
    title: "オールケーシング工法",
    taskType: "process",
    priority: "core",
    years: [2013, 2014, 2015, 2024, 2025],
    prompt: "全套管工法的基本施工順序與套管的作用是什麼？",
    minimumAnswer: "以套管保護孔壁並掘削，清孔後放入鋼筋籠、以導管澆置混凝土，同步拔出套管。",
    sources: [constructionNotion],
    keywords: ["場所打ち杭", "ケーシング", "孔壁"],
  },
  {
    id: "construction-water-cement-ratio",
    subject: "construction",
    topic: "コンクリート",
    title: "水セメント比",
    taskType: "concept",
    priority: "core",
    years: [2013, 2014, 2015, 2024, 2025],
    prompt: "水灰比提高時，強度、施工性與耐久性通常如何變化？",
    minimumAnswer: "水灰比提高通常使流動性增加，但硬化後強度與耐久性下降、乾燥收縮等風險增加。",
    sources: [constructionNotion],
    keywords: ["W/C", "強度", "耐久性"],
  },
  {
    id: "construction-engineered-wood",
    subject: "construction",
    topic: "木質材料",
    title: "NLT、CLT、LVL、DLT",
    taskType: "comparison",
    priority: "core",
    years: [2024, 2025],
    prompt: "四種工程木材的構成方向與接合方式有何差別？",
    minimumAnswer: "NLT 以釘接平行木材；DLT 以木栓接合；CLT 將層板交叉膠合；LVL 將薄單板大致平行膠合。",
    sources: [constructionNotion],
    keywords: ["木質パネル", "集成材", "直交集成板"],
  },
  {
    id: "construction-roof-truss",
    subject: "construction",
    topic: "木造",
    title: "和小屋與洋小屋",
    taskType: "comparison",
    priority: "core",
    years: [2013, 2014, 2015, 2024, 2025],
    prompt: "和小屋與洋小屋的主要受力方式及適用跨度有何差異？",
    minimumAnswer: "和小屋以柱束逐層支承、較適合較小跨度；洋小屋以三角桁架傳力，可跨越較大空間。",
    sources: [constructionNotion],
    keywords: ["小屋組", "トラス", "束"],
  },
  {
    id: "construction-wood-joints",
    subject: "construction",
    topic: "木造",
    title: "留め・矩接ぎ・本実",
    taskType: "comparison",
    priority: "support",
    years: [2013, 2014, 2015, 2024, 2025],
    prompt: "三種接合各自處理什麼方向或形狀的接縫？",
    minimumAnswer: "留め是轉角處斜切相接；矩接ぎ是構件端部直角相接；本実是舌槽嵌合以提高接縫連續性。",
    sources: [constructionNotion],
    keywords: ["継手", "仕口", "さね"],
  },
  {
    id: "construction-steel-heat-treatment",
    subject: "construction",
    topic: "鋼材",
    title: "焼入れ與焼戻し",
    taskType: "comparison",
    priority: "support",
    years: [2013, 2014, 2015, 2024, 2025],
    prompt: "淬火與回火分別改變鋼材的哪些性質？為何常配合使用？",
    minimumAnswer: "淬火提高硬度但增加脆性與內應力；回火在保留所需硬度下恢復韌性、降低脆性與內應力。",
    sources: [constructionNotion],
    keywords: ["鋼", "熱処理", "靭性"],
  },
  {
    id: "planning-stage-zones",
    subject: "planning",
    topic: "劇場",
    title: "舞台各區域名稱",
    taskType: "image",
    priority: "core",
    years: [2023, 2024, 2026],
    prompt: "能否由劇場剖面／平面指出主舞台、側舞台、後舞台、觀眾席與後台區？",
    minimumAnswer: "主舞台位於觀眾席正前；側舞台在其兩側；後舞台在主舞台後方；後台區服務演員、道具與舞台運作。",
    sources: [planningNotion, { kind: "site", label: "計畫知識地圖", href: "/planning-knowledge-map" }],
    keywords: ["舞台", "劇場", "断面"],
  },
  {
    id: "planning-elderly-facilities",
    subject: "planning",
    topic: "高齢者施設",
    title: "四種高齡者設施與數值",
    taskType: "numeric",
    priority: "core",
    years: [2023, 2024, 2026],
    prompt: "四種高齡者設施的服務對象、居住性質與核心數值如何區分？",
    minimumAnswer: "老健：療養室≤4人、每人≥8㎡；認知症 GH：每 unit 5–9人、個室≥7.43㎡；特養：原則個室、每人≥10.65㎡、unit 原則≤10人；小規模多機能：登記29／通所18／住宿9人。",
    sources: [planningNotion],
    keywords: ["高齢者", "介護", "施設基準", "数値"],
  },
  {
    id: "planning-proxemics",
    subject: "planning",
    topic: "行動・寸法",
    title: "Edward T. Hall 的 Proxemics",
    taskType: "concept",
    priority: "support",
    years: [2023, 2024, 2026],
    prompt: "Hall 將人際距離分成哪四類？由近至遠排列。",
    minimumAnswer: "密接 0–約45cm；個體約45–120cm；社會約1.2–3.6m；公眾約3.6m以上。",
    sources: [planningNotion],
    keywords: ["対人距離", "Hall", "プロクセミックス"],
  },
  {
    id: "planning-concert-hall-types",
    subject: "planning",
    topic: "音楽ホール",
    title: "音樂廳類型",
    taskType: "comparison",
    priority: "core",
    years: [2023, 2024, 2026],
    prompt: "shoebox 與 vineyard 音樂廳在座席配置及聲學傾向上有何差異？",
    minimumAnswer: "shoebox 是狹長矩形，舞台位於短邊、側向反射充足；vineyard 以分層座席環繞中央舞台，觀眾距舞台較近並由 terrace 側壁形成早期反射。",
    sources: [planningNotion, { kind: "site", label: "計畫類型學", href: "/planning-typology" }],
    keywords: ["シューボックス", "ヴィンヤード", "扇形"],
  },
  {
    id: "history-greek-imitation",
    subject: "history",
    topic: "建築理論",
    title: "ギリシア芸術模倣論",
    taskType: "concept",
    priority: "support",
    years: [2013],
    prompt: "作者、年代與它在近代建築史上的影響是什麼？",
    minimumAnswer: "Johann Joachim Winckelmann，1755 年；其古希臘藝術觀成為新古典主義的重要契機。",
    sources: [historyNotion, { kind: "site", label: "建築史知識地圖", href: "/architecture-history-knowledge-map" }],
    keywords: ["ヴィンケルマン", "新古典主義"],
  },
  {
    id: "history-four-elements",
    subject: "history",
    topic: "建築理論",
    title: "建築の4要素",
    taskType: "concept",
    priority: "core",
    years: [2013],
    prompt: "提出者、年代與四個要素是什麼？",
    minimumAnswer: "Semper，19 世紀；Hearth、Mound、Enclosure、Roof。",
    sources: [historyNotion, { kind: "site", label: "建築史知識地圖", href: "/architecture-history-knowledge-map" }],
    keywords: ["ゼムパー", "炉", "土台", "囲い", "屋根"],
  },
  {
    id: "history-five-orders",
    subject: "history",
    topic: "建築理論",
    title: "建築の5つのオーダーの規則",
    taskType: "concept",
    priority: "core",
    years: [2013],
    prompt: "作者、年代與這部著作整理的內容是什麼？",
    minimumAnswer: "Vignola，16 世紀文藝復興期；系統整理 Tuscan、Doric、Ionic、Corinthian、Composite 五種柱式比例。",
    sources: [historyNotion],
    keywords: ["ヴィニョーラ", "オーダー", "ルネサンス"],
  },
  {
    id: "history-japanese-style-match",
    subject: "history",
    topic: "日本建築",
    title: "日本建築的樣式辨認",
    taskType: "comparison",
    priority: "core",
    years: [2013, 2014],
    prompt: "室生寺金堂、浄土寺浄土堂、宇治上神社本殿、不動院金堂、大報恩寺本堂、曼殊院分別對應什麼？",
    minimumAnswer: "懸造／大仏様／流造／禅宗様／和様／書院造。",
    sources: [historyNotion, { kind: "site", label: "建築史時間軸", href: "/timeline" }],
    keywords: ["寺社", "様式", "日本"],
  },
  {
    id: "history-modern-japan-authors",
    subject: "history",
    topic: "近代日本",
    title: "日向別邸、丸善書店與聴竹居",
    taskType: "comparison",
    priority: "core",
    years: [2013, 2014],
    prompt: "三座建築分別對應哪位人物？",
    minimumAnswer: "日向別邸—Bruno Taut；丸善書店—佐野利器；聴竹居—藤井厚二。",
    sources: [historyNotion, { kind: "site", label: "建築史資料庫", href: "/history/library" }],
    keywords: ["近代日本", "建築家"],
  },
  {
    id: "history-majolica-house",
    subject: "history",
    topic: "近代西洋",
    title: "マジョリカ・ハウス",
    taskType: "image",
    priority: "support",
    years: [2013],
    prompt: "建築師、樣式與大致年代是什麼？",
    minimumAnswer: "Otto Wagner；Art Nouveau／維也納分離派背景；19 世紀末。",
    sources: [historyNotion, { kind: "site", label: "建築史資料庫", href: "/history/library" }],
    keywords: ["オットー・ワーグナー", "アール・ヌーヴォー"],
  },
  {
    id: "history-fagus-factory",
    subject: "history",
    topic: "近代西洋",
    title: "ファグス靴工場",
    taskType: "image",
    priority: "core",
    years: [2013],
    prompt: "建築師、年代及立面在近代建築史上的關鍵特徵是什麼？",
    minimumAnswer: "Walter Gropius（與 Adolf Meyer），20 世紀初；以非承重玻璃立面與角部玻璃預示 curtain wall。",
    sources: [historyNotion, { kind: "site", label: "建築史資料庫", href: "/history/library" }],
    keywords: ["グロピウス", "カーテンウォール", "近代建築"],
  },
  {
    id: "mechanics-composite-beam",
    subject: "mechanics",
    topic: "截面",
    title: "複合材料矩形梁",
    taskType: "calculation",
    priority: "core",
    years: [2015],
    prompt: "材料相同、E 不同、降伏應力不同時，中性軸與應力塊分別用什麼條件決定？",
    minimumAnswer: "同材可視為整體截面；彈性中性軸用 E 加權且滿足軸力平衡；塑性中性軸用降伏應力塊的合力平衡。",
    sources: [{ kind: "site", label: "力學：複合材料矩形梁", href: "/structural-learning/questions/composite-beam" }],
    keywords: ["中立軸", "E", "塑性", "接着面"],
  },
  {
    id: "mechanics-tapered-cantilever",
    subject: "mechanics",
    topic: "構件",
    title: "變截面懸臂塔",
    taskType: "calculation",
    priority: "core",
    years: [2014],
    prompt: "變截面構件的頂部位移應沿哪條公式鏈求得？",
    minimumAnswer: "先建立 I(x) 與 M(x)，由 κ(x)=M(x)/EI(x) 得局部曲率，再沿長度積分成轉角與位移。",
    sources: [{ kind: "site", label: "力學：變截面懸臂塔", href: "/structural-learning/questions/tapered-cantilever" }],
    keywords: ["I(x)", "M(x)", "曲率", "積分"],
  },
  {
    id: "mechanics-thermal-restraint",
    subject: "mechanics",
    topic: "系統",
    title: "溫度應變與彈性約束",
    taskType: "calculation",
    priority: "core",
    years: [2013],
    prompt: "自由熱伸長、完全固定與彈性約束三種情況各用什麼相容條件？",
    minimumAnswer: "自由時 ΔL=αΔTL；完全固定時總變形為零；彈性約束時自由熱伸長=桿件機械壓縮+約束系統位移。",
    sources: [{ kind: "site", label: "力學：溫度應變與彈性約束", href: "/structural-learning/questions/thermal-restraint" }],
    keywords: ["熱膨張", "ばね", "変形適合", "αΔT"],
  },
];

const visual = (
  src: string,
  role: ReviewItemMediaRole,
  altZh: string,
  altJa: string,
  captionZh?: string,
  captionJa?: string,
): ReviewItemMedia => ({ src, role, altZh, altJa, captionZh, captionJa });

export const REVIEW_ITEM_MEDIA: Partial<Record<string, ReviewItemMedia[]>> = {
  "environment-sound-db": [
    visual("/review-media/environment/environment-notes-01.png", "reference", "環工整理第一頁：音響公式與速算", "環境工学まとめ1頁：音響公式と速算", "答案後對照 PDF 整理 P1", "解答後に PDF まとめ P1 と照合"),
  ],
  "environment-sound-room": [
    visual("/review-media/environment/environment-notes-01.png", "reference", "環工整理第一頁：殘響、吸音與遮音", "環境工学まとめ1頁：残響・吸音・遮音", "用同一頁確認三個概念沒有混在一起", "同じページで三概念を区別する"),
  ],
  "environment-light-quantities": [
    visual("/review-media/environment/environment-notes-03.png", "reference", "環工整理第三頁：測光量", "環境工学まとめ3頁：測光量", "答案後用符號與單位重新定位", "解答後に記号と単位を再確認"),
  ],
  "environment-light-purkinje": [
    visual("/review-media/environment/environment-notes-02.png", "reference", "環工整理第二頁：視覺與色彩", "環境工学まとめ2頁：視覚と色彩", "確認由明所視轉向暗所視的感度移動", "明所視から暗所視への感度移動を確認"),
  ],
  "environment-ventilation-stack": [
    visual("/review-media/environment/environment-notes-03.png", "reference", "環工整理第三頁：煙突效應與中性帶", "環境工学まとめ3頁：煙突効果と中性帯", "對照中性帶上下的流入／流出方向", "中性帯上下の流入・流出方向を照合"),
  ],
  "environment-heat-radiation": [
    visual("/review-media/environment/environment-notes-02.png", "reference", "環工整理第二頁：熱放射", "環境工学まとめ2頁：熱放射", "把四條規則放回同一張視覺框架", "四原則を一枚の枠組みに戻す"),
  ],
  "environment-moisture-dew": [
    visual("/review-media/environment/environment-notes-03.png", "reference", "環工整理第三頁：露點與結露", "環境工学まとめ3頁：露点と結露", "用溫度關係確認結露判定", "温度関係から結露判定を確認"),
  ],
  "environment-system-trap": [
    visual("/review-media/environment/environment-notes-03.png", "reference", "環工整理第三頁：排水存水彎", "環境工学まとめ3頁：排水トラップ", "答案後比較吸走、推出與毛細吸水", "吸出し・押出し・毛管吸水を比較"),
  ],
  "construction-slump-flow": [
    visual("/review-media/construction/slump-flow-memory.svg", "reference", "slump 與 slump flow 的量測方向示意", "スランプとスランプフローの測定方向", "用方向固定記憶：垂直下降／水平擴散", "方向で固定する：鉛直沈下／水平拡がり"),
  ],
  "construction-fresh-concrete-properties": [
    visual("/review-media/construction/fresh-concrete-memory.svg", "reference", "新拌混凝土四個近似概念關係圖", "フレッシュコンクリート四概念の関係図", "以 workability 為中心重新分辨四概念", "ワーカビリティーを中心に四概念を分ける"),
  ],
  "construction-all-casing": [
    visual("/review-media/construction/all-casing-1.png", "reference", "Notion 的全套管工法施工圖", "Notion のオールケーシング工法施工図", "按圖重述：掘削 → 鋼筋籠 → 混凝土 → 拔管", "図から掘削→鉄筋かご→打設→引抜きを説明"),
  ],
  "construction-water-cement-ratio": [
    visual("/review-media/construction/water-cement-ratio-memory.svg", "reference", "水灰比升高時各性質變化圖", "水セメント比上昇時の性質変化図", "記住流動性與強度、耐久性的方向相反", "流動性と強度・耐久性の向きが逆"),
  ],
  "construction-engineered-wood": [
    visual("/review-media/construction/engineered-wood-1.png", "reference", "Notion 的 NLT、CLT、LVL、DLT 比較圖", "Notion の NLT・CLT・LVL・DLT 比較図", "沿纖維方向與接合方法逐一辨認", "繊維方向と接合方法から識別"),
  ],
  "construction-roof-truss": [
    ...Array.from({ length: 7 }, (_, index) =>
      visual(
        `/review-media/construction/roof-systems-${index + 1}.png`,
        "reference",
        `Notion 的小屋組形式圖 ${index + 1}`,
        `Notion の小屋組形式図 ${index + 1}`,
      ),
    ),
    visual("/review-media/construction/roof-truss-1.png", "reference", "Notion 的洋小屋桁架形式圖", "Notion の洋小屋トラス形式図", "比較束支承與三角桁架的力流", "束支持と三角トラスの力の流れを比較"),
  ],
  "construction-wood-joints": [
    visual("/review-media/construction/wood-joints-reference.png", "reference", "Notion 的留め、矩接ぎ、本実圖解", "Notion の留め・矩接ぎ・本実図解", "逐張指出轉角、直角與舌槽", "角・直角接合・さねを図から指す"),
  ],
  "construction-steel-heat-treatment": [
    visual("/review-media/construction/heat-treatment-1.png", "reference", "Notion 的淬火圖解", "Notion の焼入れ図解"),
    visual("/review-media/construction/heat-treatment-2.png", "reference", "Notion 的回火圖解", "Notion の焼戻し図解", "一起比較硬度、脆性與韌性", "硬さ・脆さ・靭性を並べて比較"),
  ],
  "planning-stage-zones": [
    visual("/review-media/planning/stage-zones-prompt.svg", "prompt", "以 A–E 標示的舞台區域題圖", "A〜Eで示した舞台各部の問題図", "先回答 A–E，再揭答案", "A〜Eを答えてから解答を見る"),
    visual("/review-media/planning/stage-zones-memory.svg", "answer", "主舞台、側舞台、後舞台與觀眾席答案圖", "本舞台・側舞台・後舞台・客席の解答図", "A 客席／B 主舞台／C 側舞台／D 後舞台／E 後台與搬入", "A 客席／B 本舞台／C 側舞台／D 後舞台／E 楽屋・搬入"),
    visual("/review-media/planning/stage-zones-1.png", "reference", "Notion 收集的古希臘劇場區域圖", "Notion に保存した古代ギリシア劇場の区域図", "延伸比較：古希臘劇場的 orchestra、skene 與現代舞台分區並不相同", "発展比較：古代ギリシア劇場の orchestra・skene は現代舞台区分と同一ではない"),
  ],
  "planning-elderly-facilities": [
    visual("/review-media/planning/elderly-facilities-memory.svg", "reference", "四種高齡者設施與核心數值圖", "四つの高齢者施設と主要数値", "按設施本質而不是只背數字", "施設の性格と数値をセットで覚える"),
  ],
  "planning-proxemics": [
    visual("/review-media/planning/proxemics-memory.svg", "reference", "四種人際距離同心圓", "対人距離四区分の同心円", "由身體向外依序回想四層", "身体から外側へ四層を想起"),
  ],
  "planning-concert-hall-types": [
    ...Array.from({ length: 4 }, (_, index) =>
      visual(
        `/review-media/planning/concert-hall-${index + 1}.png`,
        "prompt",
        `Notion 的音樂廳形式圖 ${index + 1}`,
        `Notion の音楽ホール形式図 ${index + 1}`,
      ),
    ),
  ],
  "history-greek-imitation": [
    visual("/review-media/history/greek-imitation-1.png", "reference", "Notion 的《希臘藝術模仿論》視覺資料", "Notion の『ギリシア芸術模倣論』視覚資料", "把書名、人物、1755 與新古典主義綁在一起", "書名・人物・1755年・新古典主義を結ぶ"),
  ],
  "history-four-elements": [
    visual("/review-media/history/four-elements-1.png", "reference", "Notion 的建築四要素圖", "Notion の建築の4要素図", "由圖回想 Hearth、Mound、Enclosure、Roof", "図から四要素を再生する"),
  ],
  "history-five-orders": [
    visual("/review-media/history/five-orders-1.png", "reference", "Notion 的五種柱式圖", "Notion の五つのオーダー図", "從柱式圖回到 Vignola 與 16 世紀", "オーダー図から Vignola と16世紀へ戻る"),
  ],
  "history-japanese-style-match": [
    visual("/architecture-images/2b9e961e4690800fbbced7f42a75d21f_0.png", "prompt", "室生寺金堂", "室生寺金堂", "懸造", "懸造"),
    visual("/architecture-images/2bbe961e4690803383e7c5389dab7b43_0.png", "prompt", "浄土寺浄土堂", "浄土寺浄土堂", "大仏様", "大仏様"),
    visual("/architecture-images/2bae961e469080589188d6b9602bb42a.png", "prompt", "宇治上神社本殿", "宇治上神社本殿", "流造", "流造"),
    visual("/architecture-images/2bbe961e469080e89818e31d0a9aef88.png", "prompt", "不動院金堂", "不動院金堂", "禅宗様", "禅宗様"),
    visual("/architecture-images/2bbe961e46908051a8d7c1149ac6d68f_0.png", "prompt", "大報恩寺本堂", "大報恩寺本堂", "和様", "和様"),
    visual("/architecture-images/2e0e961e469080a68703f771a0c678d9.png", "prompt", "曼殊院", "曼殊院", "書院造", "書院造"),
  ],
  "history-modern-japan-authors": [
    visual("/review-media/history/modern-japan-hyuga-1.png", "prompt", "Notion 的日向別邸圖片", "Notion の日向別邸画像", "日向別邸", "日向別邸"),
    visual("/review-media/history/modern-japan-maruzen-1.png", "prompt", "Notion 的丸善書店圖片", "Notion の丸善書店画像", "丸善書店", "丸善書店"),
  ],
  "history-majolica-house": [
    visual("/review-media/history/majolica-house-1.png", "prompt", "Notion 的マジョリカ・ハウス圖片", "Notion のマジョリカ・ハウス画像"),
  ],
  "history-fagus-factory": [
    visual("/architecture-images/2e2e961e46908060887ac6b1bcdd5f87.png", "prompt", "ファグス靴工場的玻璃立面", "ファグス靴工場のガラス立面"),
  ],
  "mechanics-composite-beam": [
    visual("/structural-learning/originals/composite-beam-original.webp", "prompt", "複合材料矩形梁原題圖", "複合材料矩形梁の原題図", "先從截面辨認材料、尺寸與受力", "断面から材料・寸法・荷重を読む"),
  ],
  "mechanics-tapered-cantilever": [
    visual("/structural-learning/originals/tapered-cantilever-original.webp", "prompt", "變截面懸臂塔原題圖", "変断面片持ち塔の原題図", "先寫出 I(x) 與 M(x)", "まず I(x) と M(x) を置く"),
  ],
  "mechanics-thermal-restraint": [
    visual("/structural-learning/originals/thermal-restraint-original.webp", "prompt", "溫度變形與彈性約束原題圖", "温度変形と弾性拘束の原題図", "先辨認自由伸長被哪些變形吸收", "自由熱伸びをどの変形が吸収するか読む"),
  ],
};

export const REVIEW_ITEMS: ReviewItem[] = [...REVIEW_ITEM_BASE, ...RECENT_REVIEW_ITEMS].map((item) => ({
  ...item,
  media: REVIEW_ITEM_MEDIA[item.id] ?? [],
}));

export const REVIEW_SUBJECT_META: Record<
  ReviewItemSubject,
  { label: string; labelJa: string; shortLabel: string; color: string }
> = {
  environment: { label: "環境工學", labelJa: "建築環境工学", shortLabel: "環工", color: "cyan" },
  construction: { label: "建築構法", labelJa: "建築構法", shortLabel: "構法", color: "orange" },
  planning: { label: "建築計畫", labelJa: "建築計画", shortLabel: "計畫", color: "violet" },
  history: { label: "建築史", labelJa: "建築史", shortLabel: "歷史", color: "amber" },
  mechanics: { label: "結構力學", labelJa: "構造力学", shortLabel: "力學", color: "emerald" },
};

export const REVIEW_TASK_TYPE_LABELS: Record<ReviewItemTaskType, string> = {
  formula: "公式",
  numeric: "數值",
  comparison: "辨析",
  image: "圖片",
  concept: "概念",
  calculation: "計算",
  process: "流程",
};

export const REVIEW_TASK_TYPE_LABELS_JA: Record<ReviewItemTaskType, string> = {
  formula: "公式",
  numeric: "数値",
  comparison: "比較・識別",
  image: "画像",
  concept: "概念",
  calculation: "計算",
  process: "手順",
};

export const REVIEW_ITEM_JA: Record<string, LocalizedReviewItemCopy> = {
  ...RECENT_REVIEW_ITEM_JA,
  "environment-sound-db": {
    topic: "音響",
    title: "dB の三つの速算",
    prompt: "パワー／インテンシティ、音圧、距離が変化するとき、dB はどう換算するか。",
    minimumAnswer: "パワーとインテンシティは 10log₁₀、音圧は 20log₁₀。自由音場では距離が2倍になると約 −6 dB。",
  },
  "environment-sound-room": {
    topic: "音響",
    title: "残響・吸音・遮音",
    prompt: "等価吸音面積、Sabine の残響時間、透過損失はそれぞれ何を表すか。",
    minimumAnswer: "A=ΣαS、T≈0.161V/A、透過損失 R=10log₁₀(1/τ)。吸音と遮音は同じではない。",
  },
  "environment-light-quantities": {
    topic: "照明",
    title: "五つの測光量",
    prompt: "光束、光度、照度、光束発散度、輝度の記号と意味を答える。",
    minimumAnswer: "Φ：全光量、I：単位立体角当たりの光束、E：入射面の照度、M：出射光束密度、L：特定方向から見た明るさ。",
  },
  "environment-light-purkinje": {
    topic: "照明",
    title: "プルキンエ現象",
    prompt: "明所から暗所へ移ると、どの色が相対的に明るく見えるか。なぜか。",
    minimumAnswer: "錐体中心の視覚から桿体中心へ移り、感度のピークが短波長側へずれるため、青緑は明るく、赤は暗く見える。",
  },
  "environment-ventilation-stack": {
    topic: "換気",
    title: "煙突効果と中性帯",
    prompt: "冬季の高層建築で煙突効果はなぜ生じるか。中性帯の上下では空気はどう流れるか。",
    minimumAnswer: "暖かい室内空気は密度が小さく上昇する。中性帯では圧力差がゼロで、一般に下部では外気が流入し、上部では室内空気が流出する。",
  },
  "environment-heat-radiation": {
    topic: "伝熱",
    title: "放射の四原則",
    prompt: "黒体、Stefan–Boltzmann、Kirchhoff、形態係数はそれぞれ何を表すか。",
    minimumAnswer: "黒体は α=ε=1、放射量は絶対温度の4乗に比例、熱平衡では α=ε、形態係数は面同士の幾何学的な放射割合を表す。",
  },
  "environment-moisture-dew": {
    topic: "湿気",
    title: "露点・飽和・結露",
    prompt: "露点温度とは何か。表面結露はどの条件で発生するか。",
    minimumAnswer: "含湿量を変えずに冷却し、相対湿度が100%になる温度が露点。表面温度が露点温度を下回ると表面結露が生じる。",
  },
  "environment-system-trap": {
    topic: "設備",
    title: "排水トラップの破封",
    prompt: "自己サイホン、逆圧、毛管作用はそれぞれどのように封水を破るか。",
    minimumAnswer: "自己サイホンは封水を吸い出し、逆圧は封水を押し出す。毛管作用は封水に垂れた繊維などが水を吸い上げる。",
  },
  "construction-slump-flow": {
    topic: "コンクリート",
    title: "スランプ試験とスランプフロー試験",
    prompt: "二つの試験は何を測り、主にどのようなコンクリートに用いるか。",
    minimumAnswer: "スランプはコーン頂部の沈下量、スランプフローは水平に広がった直径を測る。後者は高流動コンクリートなどに用いる。",
  },
  "construction-fresh-concrete-properties": {
    topic: "コンクリート",
    title: "フレッシュコンクリートの四つの近接概念",
    prompt: "ワーカビリティー、コンシステンシー、材料分離抵抗性、仕上げ性を区別する。",
    minimumAnswer: "ワーカビリティーは施工操作の総合的な容易さ、コンシステンシーは軟らかさ・流動性、分離抵抗性は均一性を保つ性質、仕上げ性は表面仕上げのしやすさ。",
  },
  "construction-all-casing": {
    topic: "基礎・杭",
    title: "オールケーシング工法",
    prompt: "基本的な施工順序と、ケーシングの役割を答える。",
    minimumAnswer: "ケーシングで孔壁を保護しながら掘削し、孔底処理後に鉄筋かごを建て込み、トレミー管でコンクリートを打設しながらケーシングを引き抜く。",
  },
  "construction-water-cement-ratio": {
    topic: "コンクリート",
    title: "水セメント比",
    prompt: "水セメント比が高くなると、施工性・強度・耐久性は一般にどう変わるか。",
    minimumAnswer: "流動性は高まりやすいが、硬化後の強度と耐久性は低下し、乾燥収縮などのリスクが増える。",
  },
  "construction-engineered-wood": {
    topic: "木質材料",
    title: "NLT・CLT・LVL・DLT",
    prompt: "四つのエンジニアードウッドを、繊維方向と接合方法から区別する。",
    minimumAnswer: "NLT は平行材を釘で接合、DLT は木ダボで接合、CLT はひき板を直交積層接着、LVL は単板をほぼ平行に積層接着する。",
  },
  "construction-roof-truss": {
    topic: "木造",
    title: "和小屋と洋小屋",
    prompt: "主な力の流れと適するスパンはどう異なるか。",
    minimumAnswer: "和小屋は束で段階的に支持し、比較的小スパン向き。洋小屋は三角形のトラスで力を伝え、より大きな空間を架け渡せる。",
  },
  "construction-wood-joints": {
    topic: "木造",
    title: "留め・矩接ぎ・本実",
    prompt: "三つの接合は、どのような方向・形の継ぎ目を処理するか。",
    minimumAnswer: "留めは角部を斜めに切って合わせ、矩接ぎは材端を直角に接合し、本実は凹凸の実をかみ合わせて連続性を高める。",
  },
  "construction-steel-heat-treatment": {
    topic: "鋼材",
    title: "焼入れと焼戻し",
    prompt: "それぞれ鋼材の性質をどう変えるか。なぜ組み合わせて行うか。",
    minimumAnswer: "焼入れは硬さを高める一方で脆さと残留応力を増やす。焼戻しは必要な硬さを残しながら靭性を回復し、脆さと残留応力を低減する。",
  },
  "planning-stage-zones": {
    topic: "劇場",
    title: "舞台各部の名称",
    prompt: "劇場の断面・平面から、本舞台、側舞台、後舞台、客席、楽屋・裏方部分を指し示せるか。",
    minimumAnswer: "本舞台は客席正面、側舞台はその両側、後舞台は本舞台の後方。裏方部分は出演者・大道具・舞台運営を支える。",
  },
  "planning-elderly-facilities": {
    topic: "高齢者施設",
    title: "四つの高齢者施設と数値",
    prompt: "四施設の対象者・居住形態・主要数値を区別する。",
    minimumAnswer: "老健：療養室4人以下・1人8㎡以上。認知症GH：1ユニット5～9人・個室7.43㎡以上。特養：原則個室・1人10.65㎡以上・ユニット原則10人以下。小規模多機能：登録29・通い18・宿泊9人。",
  },
  "planning-proxemics": {
    topic: "行動・寸法",
    title: "Edward T. Hall のプロクセミックス",
    prompt: "対人距離の四区分を近い順に答える。",
    minimumAnswer: "密接距離0～約45cm、個体距離約45～120cm、社会距離約1.2～3.6m、公衆距離約3.6m以上。",
  },
  "planning-concert-hall-types": {
    topic: "音楽ホール",
    title: "音楽ホールの形式",
    prompt: "シューボックス型とワインヤード型は、客席配置と音響傾向がどう異なるか。",
    minimumAnswer: "シューボックス型は細長い矩形で舞台が短辺側にあり、側方反射を得やすい。ワインヤード型は段状客席が中央舞台を囲み、客席を舞台に近づけ、テラス側壁から初期反射を得る。",
  },
  "history-greek-imitation": {
    topic: "建築理論",
    title: "ギリシア芸術模倣論",
    prompt: "著者、年代、近代建築史への影響を答える。",
    minimumAnswer: "Johann Joachim Winckelmann、1755年。古代ギリシア芸術の評価を通して新古典主義の重要な契機となった。",
  },
  "history-four-elements": {
    topic: "建築理論",
    title: "建築の4要素",
    prompt: "提唱者、年代、四つの要素を答える。",
    minimumAnswer: "Semper、19世紀。Hearth、Mound、Enclosure、Roof。",
  },
  "history-five-orders": {
    topic: "建築理論",
    title: "建築の5つのオーダーの規則",
    prompt: "著者、年代、整理された内容を答える。",
    minimumAnswer: "Vignola、16世紀ルネサンス期。Tuscan、Doric、Ionic、Corinthian、Composite の五つのオーダーの比例を体系化した。",
  },
  "history-japanese-style-match": {
    topic: "日本建築",
    title: "日本建築の様式識別",
    prompt: "室生寺金堂、浄土寺浄土堂、宇治上神社本殿、不動院金堂、大報恩寺本堂、曼殊院を様式・形式と対応させる。",
    minimumAnswer: "懸造／大仏様／流造／禅宗様／和様／書院造。",
  },
  "history-modern-japan-authors": {
    topic: "近代日本",
    title: "日向別邸・丸善書店・聴竹居",
    prompt: "三つの建築を人物と対応させる。",
    minimumAnswer: "日向別邸—Bruno Taut、丸善書店—佐野利器、聴竹居—藤井厚二。",
  },
  "history-majolica-house": {
    topic: "近代西洋",
    title: "マジョリカ・ハウス",
    prompt: "建築家、様式、おおよその年代を答える。",
    minimumAnswer: "Otto Wagner、アール・ヌーヴォー／ウィーン分離派の背景、19世紀末。",
  },
  "history-fagus-factory": {
    topic: "近代西洋",
    title: "ファグス靴工場",
    prompt: "建築家、年代、近代建築史上重要な立面の特徴を答える。",
    minimumAnswer: "Walter Gropius と Adolf Meyer、20世紀初頭。非耐力のガラス面とガラスのコーナーによってカーテンウォールを先取りした。",
  },
  "mechanics-composite-beam": {
    topic: "断面",
    title: "複合材料矩形梁",
    prompt: "同一材料、異なるE、異なる降伏応力度の場合、中立軸と応力ブロックは何を条件に決めるか。",
    minimumAnswer: "同一材料なら一体断面として扱う。弾性中立軸はEで重み付けし軸力の釣合いを満たす。塑性中立軸は降伏応力ブロックの合力釣合いで決める。",
  },
  "mechanics-tapered-cantilever": {
    topic: "部材",
    title: "変断面片持ち塔",
    prompt: "変断面部材の頂部変位は、どの式の流れで求めるか。",
    minimumAnswer: "I(x) と M(x) を定め、κ(x)=M(x)/EI(x) から局所曲率を求め、材長方向に積分して回転角と変位へ進む。",
  },
  "mechanics-thermal-restraint": {
    topic: "システム",
    title: "温度ひずみと弾性拘束",
    prompt: "自由熱伸び、完全拘束、弾性拘束では、それぞれどの変形適合条件を使うか。",
    minimumAnswer: "自由時は ΔL=αΔTL、完全拘束時は全変形がゼロ。弾性拘束時は自由熱伸び＝部材の機械的圧縮＋拘束系の変位。",
  },
};

export function getLocalizedReviewItem(
  item: ReviewItem,
  locale: ReviewLocale,
): LocalizedReviewItemCopy {
  if (locale === "ja" && REVIEW_ITEM_JA[item.id]) return REVIEW_ITEM_JA[item.id];
  return {
    topic: item.topic,
    title: item.title,
    prompt: item.prompt,
    minimumAnswer: item.minimumAnswer,
  };
}
