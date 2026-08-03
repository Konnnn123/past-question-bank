export interface UrbanPlanningCard {
  id: string;
  name: { ja: string; zh: string };
  period: { ja: string; zh: string };
  regions: string[];
  summary: { ja: string; zh: string };
  planningLogic: { ja: string; zh: string }[];
  visualClues: { ja: string; zh: string }[];
  cases: { nameJa: string; nameZh: string; buildingId?: string; noteJa: string; noteZh: string }[];
}

const l = (ja: string, zh: string, en?: string) => ({ ja, zh, ...(en ? { en } : {}) });

export const URBAN_PLANNING_CARDS: UrbanPlanningCard[] = [
  {
    id: "urban-religious-autonomous-town",
    name: l("宗教自治都市・環濠集落", "宗教自治城市与环壕聚落", "Religious Autonomous Towns and Moated Settlements"),
    period: l("中世末～近世初期", "中世末至近世初期", "Late Medieval to Early Modern Period"),
    regions: ["japan"],
    summary: l("寺院を核に、信徒の居住・商業・防御を一体化した自治的都市形態。", "以寺院为核心，将信徒居住、商业与防御整合的自治城市形态。", "An autonomous urban form integrating worshippers' housing, commerce, and defense around a temple.") ,
    planningLogic: [l("寺院を中心に町家と街区を編成する。", "以寺院为中心组织町家与街区。", "Organizes machiya townhouses and blocks around the temple."), l("環濠・土塁・限定された出入口で防御する。", "通过环壕、土垒与限定出入口防御。", "Defends the settlement with moats, earthen ramparts, and controlled entrances.")],
    visualClues: [l("寺院、短冊形敷地、屈曲路、環濠", "寺院、长条宅地、曲折道路、环壕", "A temple, strip-shaped plots, bent streets, and encircling moats")],
    cases: [
      { nameJa: "寺内町", nameZh: "寺内町", buildingId: "building-supplemental-jinaicho", noteJa: "一向宗寺院を核とする自治都市の総称。", noteZh: "以一向宗寺院为核心的自治城市总称。" },
      { nameJa: "今井町", nameZh: "今井町", buildingId: "building-urban-case-imaicho", noteJa: "環濠と町家景観をよく残す。", noteZh: "保留完整的环壕与町家景观。" },
      { nameJa: "富田林寺内町", nameZh: "富田林寺内町", buildingId: "building-urban-case-tondabayashi", noteJa: "興正寺別院を中心とする近世町場。", noteZh: "以兴正寺别院为中心的近世城镇。" },
    ],
  },
  {
    id: "urban-ceremonial-capital",
    name: l("記念軸型首都計画", "纪念轴型首都规划", "Ceremonial Axial Capital Planning"),
    period: l("18世紀末～20世紀", "18世纪末至20世纪", "Late Eighteenth to Twentieth Century"),
    regions: ["western", "global"],
    summary: l("格子状街路に斜交する大道路と記念建築の視覚軸で国家の秩序を表現する。", "以方格道路、斜交大道与纪念建筑视觉轴线表达国家秩序。", "Represents national order through visual axes of monuments and diagonal avenues across a street grid."),
    planningLogic: [l("国会・大統領府・記念碑を視覚的に関係づける。", "将国会、总统府和纪念碑纳入视觉关系。", "Sets the legislature, presidential residence, and monuments into visual relationships."), l("日常交通の格子と象徴的大道路を重ねる。", "叠加日常交通方格与象征性大道。", "Overlays a functional traffic grid with symbolic grand avenues.")],
    visualClues: [l("方眼、斜線大通り、放射状交差点、長大なモール", "方格、斜向大道、放射状节点、长大绿地轴", "Grids, diagonal avenues, radial nodes, and long ceremonial malls")],
    cases: [
      { nameJa: "ワシントンDC", nameZh: "华盛顿 DC", buildingId: "building-supplemental-washington-dc", noteJa: "1791年のランファン計画。", noteZh: "1791年朗方方案。" },
      { nameJa: "キャンベラ", nameZh: "堪培拉", buildingId: "building-urban-case-canberra", noteJa: "グリフィンによる首都計画。", noteZh: "格里芬设计的首都规划。" },
      { nameJa: "ブラジリア", nameZh: "巴西利亚", buildingId: "building-urban-case-brasilia", noteJa: "コスタの軸線型計画。", noteZh: "科斯塔的轴线型新首都。" },
    ],
  },
  {
    id: "urban-modern-renovation",
    name: l("近代都市改造・インフラ整備", "近代城市改造与基础设施", "Modern Urban Renewal and Infrastructure"),
    period: l("19世紀中葉～20世紀初頭", "19世纪中叶至20世纪初", "Mid-Nineteenth to Early Twentieth Century"),
    regions: ["western"],
    summary: l("過密な旧市街に広幅員道路、公園、上下水道、統一的街路立面を導入する。", "在过密旧城引入宽阔道路、公园、给排水和统一街道立面。", "Introduces broad streets, parks, water and sewer systems, and coordinated street façades into overcrowded historic cores."),
    planningLogic: [l("衛生・交通・治安・不動産価値を一体的に更新する。", "同时改造卫生、交通、治安与地产价值。", "Renews sanitation, circulation, security, and real-estate value as a single project."), l("建築線・高さ・バルコニー位置を揃えて街景を統御する。", "通过建筑红线、高度和阳台位置统制街景。", "Controls the streetscape through aligned building lines, heights, and balcony levels.")],
    visualClues: [l("直線的なブールバール、放射状広場、連続する軲高線", "笔直林荫大道、放射状广场、连续檐口线", "Straight boulevards, radial plazas, and continuous cornice lines")],
    cases: [
      { nameJa: "パリ改造", nameZh: "巴黎改造", buildingId: "building-supplemental-haussmann-paris", noteJa: "ナポレオン3世とオスマンによる1853～70年の改造。", noteZh: "拿破仑三世与奥斯曼于1853—1870年实施。" },
      { nameJa: "ウィーンのリングシュトラーセ", nameZh: "维也纳环城大道", buildingId: "building-urban-case-ringstrasse", noteJa: "城壁撤去後の現代都市化。", noteZh: "拆除城墙后的现代城市化。" },
      { nameJa: "バルセロナのエンサンチェ", nameZh: "巴塞罗那扩展区", buildingId: "building-urban-case-eixample", noteJa: "セルダの八角形街区。", noteZh: "塞尔达的八角街块扩展规划。" },
    ],
  },
];
