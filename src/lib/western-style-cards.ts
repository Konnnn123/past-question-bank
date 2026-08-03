import type { StyleLearningCard } from "@/types/history-learning-card";

type EnglishCardContent = {
  name: string;
  period: string;
  summary: string;
  formationBackground: string;
  structuralFeatures: string[];
  spatialFeatures: string[];
  visualClues: string[];
  keywords: string[];
};

const l = (ja: string, zh: string, en?: string) => ({ ja, zh, ...(en ? { en } : {}) });
const card = (
  id: string, ja: string, zh: string, periodJa: string, periodZh: string,
  summaryJa: string, summaryZh: string, backgroundJa: string, backgroundZh: string,
  structure: [string, string][], space: [string, string][], clues: [string, string][],
  keywords: [string, string][], previous: string[] = [], next: string[] = [], comparison: string[] = [],
  english?: EnglishCardContent,
): StyleLearningCard => ({
  id, kind: "style", name: l(ja, zh, english?.name), aliases: [], period: l(periodJa, periodZh, english?.period), regions: ["western"],
  summary: l(summaryJa, summaryZh, english?.summary), formationBackground: l(backgroundJa, backgroundZh, english?.formationBackground),
  structuralFeatures: structure.map(([a, b], index) => l(a, b, english?.structuralFeatures[index])), spatialFeatures: space.map(([a, b], index) => l(a, b, english?.spatialFeatures[index])),
  visualClues: clues.map(([a, b], index) => l(a, b, english?.visualClues[index])), keywords: keywords.map(([a, b], index) => l(a, b, english?.keywords[index])),
  predecessorCardIds: previous, successorCardIds: next, comparisonCardIds: comparison,
  relatedBuildingIds: [], relatedPersonIds: [], relatedCardIds: [...new Set([...previous, ...next, ...comparison])],
  examEvidence: [], reviewStatus: "draft",
});

export const WESTERN_STYLE_CARDS: StyleLearningCard[] = [
  card(
    "style-greek", "古代ギリシア建築", "古希腊建筑", "前8〜前1世紀", "公元前8至前1世纪",
    "神殿とオーダーを中心に、比例・調和・視覚補正を体系化した石造建築。", "以神庙和柱式为中心，系统化比例、和谐与视觉校正的石构建筑。",
    "ポリスと市民宗教の発達により、守護神を祀る神殿と公共空間が都市の象徴となった。", "随着城邦和市民宗教发展，供奉守护神的神庙与公共空间成为城市象征。",
    [["柱と梁による直線的な架構。", "柱梁式直线构架。"], ["ドリス・イオニア・コリントのオーダー。", "多立克、爱奥尼和科林斯柱式。"]],
    [["神殿内部より外周列柱と周囲からの見え方を重視。", "较内部而言更重视外周柱廊及环绕观看。"], ["アゴラ・劇場・ストアが公共生活を支える。", "广场、剧场和柱廊支撑公共生活。"]],
    [["ペディメント、エンタブラチュア、列柱。", "山花、檐部与列柱。"], ["エンタシスや隅部収縮などの視覚補正。", "柱身收分与角部收缩等视觉校正。"]],
    [["オーダー", "柱式"], ["比例", "比例"], ["エンタシス", "柱身收分"]], [], ["style-roman", "style-renaissance", "style-neoclassical"], ["style-roman"], {
      name: "Ancient Greek Architecture",
      period: "8th century BCE–1st century BCE",
      summary: "Stone architecture centered on temples and the classical orders, systematizing proportion, harmony, and optical refinements.",
      formationBackground: "The development of the polis and civic religion made temples to patron deities and public spaces enduring symbols of the city.",
      structuralFeatures: ["Trabeated construction using columns and beams", "The Doric, Ionic, and Corinthian orders"],
      spatialFeatures: ["Emphasis on the exterior colonnade and the building's perception from its surroundings", "Agoras, theaters, and stoas supporting civic life"],
      visualClues: ["Pediments, entablatures, and colonnades", "Optical refinements such as entasis and corner contraction"],
      keywords: ["classical orders", "proportion", "entasis"],
    }),
  card(
    "style-roman", "古代ローマ建築", "古罗马建筑", "前1世紀〜4世紀", "公元前1世纪至公元4世纪",
    "ギリシアのオーダーとアーチ・ヴォールト・コンクリートを統合し、帝国規模の内部空間と都市施設を実現した建築。", "融合希腊柱式、拱券、拱顶与混凝土，实现帝国尺度的室内空间和城市设施。",
    "領土拡大、都市人口、皇帝権力を背景に、道路・浴場・闘技場・バシリカなど標準化された公共建築が各地へ展開した。", "在领土扩张、城市人口与皇权背景下，道路、浴场、竞技场和巴西利卡等标准化公共建筑遍布帝国。",
    [["アーチ、筒形・交差ヴォールト、ドーム。", "拱券、筒形与交叉拱顶、穹顶。"], ["ローマン・コンクリートと煉瓦型枠。", "罗马混凝土与砖模。"]],
    [["パンテオンの集中空間、バシリカの長堂空間。", "万神庙的集中空间与巴西利卡的长堂空间。"], ["軸線・連続室・巨大内部空間を組織。", "组织轴线、连续房间和巨大内部空间。"]],
    [["半円アーチ、厚い壁、オーダーの重層。", "半圆拱、厚墙及柱式叠层。"], ["コンクリート躯体と石材仕上げの分離。", "混凝土结构与石材饰面分离。"]],
    [["ローマン・コンクリート", "罗马混凝土"], ["アーチ", "拱券"], ["ドーム", "穹顶"]], ["style-greek"], ["style-early-christian", "style-byzantine", "style-romanesque"], ["style-greek"], {
      name: "Ancient Roman Architecture",
      period: "1st century BCE–4th century CE",
      summary: "Architecture that combined Greek orders with arches, vaults, domes, and concrete to create imperial-scale interiors and urban infrastructure.",
      formationBackground: "Territorial expansion, urban population growth, and imperial power fostered standardized public works such as roads, baths, amphitheaters, and basilicas throughout the empire.",
      structuralFeatures: ["Arches, barrel vaults, groin vaults, and domes", "Roman concrete and brick-faced construction"],
      spatialFeatures: ["The centralized space of the Pantheon and the longitudinal hall of the basilica", "Organized axes, sequences of rooms, and vast interior volumes"],
      visualClues: ["Round arches, massive walls, and superimposed orders", "A distinction between the concrete structural body and its stone facing"],
      keywords: ["Roman concrete", "arch", "dome"],
    }),
  card(
    "style-byzantine", "ビザンティン建築", "拜占庭建筑", "4〜15世紀", "4至15世纪",
    "集中式平面とドーム、光とモザイクによって天上世界を表現した東ローマ帝国のキリスト教建築。", "以集中式平面、穹顶、光线和马赛克表现天国世界的东罗马帝国基督教建筑。",
    "コンスタンティノープルを中心に、ローマ構造技術と東方の集中式礼拝空間、キリスト教典礼が融合した。", "以君士坦丁堡为中心，罗马结构技术、东方集中式礼拜空间与基督教礼仪融合。",
    [["ペンデンティブで正方形平面上にドームを架ける。", "以帆拱在方形平面上架设穹顶。"], ["煉瓦・モルタルによる軽量な曲面構造。", "砖与砂浆构成轻质曲面结构。"]],
    [["中央ドームの下に礼拝空間を統合。", "在中央穹顶下整合礼拜空间。"], ["半ドームを連鎖させ中心空間を拡張。", "通过半穹顶连锁扩展中心空间。"]],
    [["外観は量塊的、内部は金色モザイクと採光。", "外观体量厚重，内部以金色马赛克和采光营造氛围。"], ["ドームが浮遊するような光の演出。", "光线使穹顶呈现漂浮效果。"]],
    [["ペンデンティブ", "帆拱"], ["モザイク", "马赛克"], ["集中式", "集中式"]], ["style-roman", "style-early-christian"], [], ["style-romanesque"], {
      name: "Byzantine Architecture",
      period: "4th–15th centuries",
      summary: "Eastern Roman Christian architecture using centralized plans, domes, light, and mosaics to evoke the heavenly realm.",
      formationBackground: "Roman structural techniques, Eastern centralized worship spaces, and Christian liturgy converged around Constantinople, the capital of the Eastern Roman Empire.",
      structuralFeatures: ["Pendentives carrying a dome over a square plan", "Lightweight curved construction in brick and mortar"],
      spatialFeatures: ["A liturgical space integrated beneath a central dome", "Half-domes extending the central space in sequence"],
      visualClues: ["A weighty exterior mass with gold mosaics and filtered light inside", "Light that makes the dome appear to float"],
      keywords: ["pendentive", "mosaic", "centralized plan"],
    }),
  card(
    "style-romanesque", "ロマネスク建築", "罗马式建筑", "10〜12世紀", "10至12世纪",
    "修道院・巡礼路の発達とともに西欧各地へ広がった、厚い石壁、半円アーチ、ヴォールトを特徴とする中世建築。", "随修道院和朝圣路线发展遍布西欧，以厚石墙、半圆拱和拱顶为特征的中世纪建筑。",
    "封建社会の安定、修道院改革、聖遺物巡礼の拡大により、大人数を収容し耐火性を備えた石造教会が求められた。", "封建社会趋稳、修道院改革及圣遗物朝圣扩大，推动能容纳大量信徒且耐火的石造教堂。",
    [["厚い組積壁、半円アーチ、筒形・交差ヴォールト。", "厚砌体墙、半圆拱、筒形和交叉拱顶。"], ["壁と柱を一体化した重い支持構造。", "墙柱一体的厚重支撑结构。"]],
    [["長い身廊、側廊、翼廊、内陣、周歩廊。", "长中殿、侧廊、耳堂、内陣和环廊。"], ["巡礼者と聖職者の動線を分離。", "分离朝圣者与神职人员流线。"]],
    [["小さな窓、厚い壁、半円アーチ、重厚な塔。", "小窗、厚墙、半圆拱和厚重塔楼。"], ["柱頭や門口の象徴的彫刻。", "柱头和入口的象征性雕刻。"]],
    [["半円アーチ", "半圆拱"], ["巡礼教会", "朝圣教堂"], ["交差ヴォールト", "交叉拱顶"]], ["style-roman", "style-early-christian"], ["style-gothic"], ["style-gothic", "style-byzantine"], {
      name: "Romanesque Architecture", period: "10th–12th centuries",
      summary: "Medieval architecture of thick stone walls, round arches, and vaults that spread across Western Europe with monasticism and pilgrimage.",
      formationBackground: "Stabilizing feudal societies, monastic reform, and relic pilgrimage called for fire-resistant stone churches able to receive large congregations.",
      structuralFeatures: ["Massive masonry walls, round arches, barrel vaults, and groin vaults", "Heavy integrated supports of walls and piers"],
      spatialFeatures: ["Long naves, aisles, transepts, choirs, and ambulatories", "Separate circulation for pilgrims and clergy"],
      visualClues: ["Small openings, thick walls, round arches, and stout towers", "Symbolic carving on capitals and portals"],
      keywords: ["round arch", "pilgrimage church", "groin vault"],
    }),
  card(
    "style-gothic", "ゴシック建築", "哥特式建筑", "12〜15世紀", "12至15世纪",
    "尖頭アーチ、リブ・ヴォールト、フライング・バットレスにより壁を開放し、高さと光を追求した中世都市の教会建築。", "以尖拱、肋架拱顶和飞扶壁解放墙体，追求高度与光线的中世纪城市教堂建筑。",
    "王権・都市・司教座の成長と光の神学を背景に、競争的に巨大な大聖堂が建設された。", "在王权、城市和主教座发展以及光之神学背景下，各城市竞相建造大型主教座堂。",
    [["尖頭アーチ、リブ・ヴォールト、フライング・バットレス。", "尖拱、肋架拱顶和飞扶壁。"], ["荷重を骨組へ集中し、壁を薄くする。", "将荷载集中到骨架，使墙体变薄。"]],
    [["身廊の垂直性と入口から内陣への軸線。", "中殿垂直性及由入口通向内陣的轴线。"], ["高窓とステンドグラスによる象徴的な光。", "高侧窗与彩色玻璃形成象征性光线。"]],
    [["尖塔、尖頭アーチ、薔薇窓、飛梁。", "尖塔、尖拱、玫瑰窗与飞扶壁。"], ["細い束ね柱と上昇感の強い立面。", "细长束柱与强烈上升感立面。"]],
    [["尖頭アーチ", "尖拱"], ["リブ・ヴォールト", "肋架拱顶"], ["フライング・バットレス", "飞扶壁"]], ["style-romanesque"], ["style-historicism"], ["style-romanesque", "style-renaissance"], {
      name: "Gothic Architecture", period: "12th–15th centuries",
      summary: "Medieval urban church architecture that opened the wall through pointed arches, rib vaults, and flying buttresses in pursuit of height and light.",
      formationBackground: "The growth of monarchies, towns, and bishoprics, together with a theology of light, fostered competitive cathedral building.",
      structuralFeatures: ["Pointed arches, rib vaults, and flying buttresses", "Loads concentrated in a skeletal frame, allowing thinner walls"],
      spatialFeatures: ["Vertical naves and a processional axis from entrance to choir", "Symbolic light through clerestories and stained glass"],
      visualClues: ["Spires, pointed arches, rose windows, and flying buttresses", "Slender clustered shafts and strongly upward elevations"],
      keywords: ["pointed arch", "rib vault", "flying buttress"],
    }),
  card(
    "style-renaissance", "ルネサンス建築", "文艺复兴建筑", "15〜16世紀", "15至16世纪",
    "古代ローマ建築を研究し、比例・幾何学・オーダーによって人間中心の秩序を再構成した建築。", "研究古罗马建筑，以比例、几何和柱式重建人本秩序的建筑。",
    "都市国家の富、人文主義、古典文献と遺構の再発見、透視図法の発達を背景にフィレンツェから広がった。", "在城市国家财富、人文主义、古典文献与遗迹再发现以及透视法发展背景下，由佛罗伦萨扩散。",
    [["オーダー、円柱、半円アーチ、ドームを比例体系で構成。", "以比例体系组织柱式、圆柱、半圆拱与穹顶。"], ["壁面を柱形と水平帯で分節。", "以壁柱和水平线脚划分墙面。"]],
    [["正方形・円・集中式など明快な幾何学。", "正方形、圆形和集中式等清晰几何。"], ["左右対称と透視図的な軸線。", "左右对称及透视性的轴线。"]],
    [["水平性、整然とした開口、古典オーダー。", "水平感、整齐开口与古典柱式。"], ["人間的尺度と数学的比例。", "人体尺度与数学比例。"]],
    [["人文主義", "人文主义"], ["透視図法", "透视法"], ["比例", "比例"]], ["style-greek", "style-roman"], ["style-mannerism", "style-baroque", "style-neoclassical"], ["style-gothic", "style-baroque"], {
      name: "Renaissance Architecture", period: "15th–16th centuries",
      summary: "Architecture that reconstituted a humanist order through the study of ancient Rome, proportion, geometry, and the classical orders.",
      formationBackground: "It spread from Florence through the wealth of city-states, humanism, renewed study of classical texts and ruins, and the development of perspective.",
      structuralFeatures: ["Orders, columns, round arches, and domes organized by proportional systems", "Wall planes articulated with pilasters and horizontal stringcourses"],
      spatialFeatures: ["Clear geometries based on squares, circles, and centralized plans", "Bilateral symmetry and perspectival axes"],
      visualClues: ["Horizontality, regular openings, and classical orders", "Human scale and mathematical proportion"],
      keywords: ["humanism", "perspective", "proportion"],
    }),
  card(
    "style-baroque", "バロック建築", "巴洛克建筑", "17〜18世紀前半", "17至18世纪前半",
    "曲線、光、軸線、連続空間を用い、宗教・王権の力を劇的に体験させる建築。", "运用曲线、光线、轴线和连续空间，使宗教与王权力量转化为戏剧性体验的建筑。",
    "対抗宗教改革、絶対王政、科学的な空間認識を背景に、教会・宮殿・都市を統合する演出的建築が発達した。", "在反宗教改革、绝对王权及科学空间认识背景下，发展出整合教堂、宫殿与城市的戏剧性建筑。",
    [["楕円、曲面壁、複合ドーム、巨大オーダー。", "椭圆、曲面墙、复合穹顶与巨柱式。"], ["構造と装飾を連続させ、境界を曖昧にする。", "使结构与装饰连续并模糊边界。"]],
    [["入口から祭壇・中心へ視線と運動を誘導。", "由入口向祭坛或中心引导视线与运动。"], ["光、絵画、彫刻を統合した総合芸術空間。", "整合光线、绘画和雕塑的总体艺术空间。"]],
    [["波打つファサード、楕円平面、強い明暗。", "波动立面、椭圆平面与强烈明暗。"], ["都市軸・広場・階段までを一体的に演出。", "将城市轴线、广场和阶梯统一设计。"]],
    [["対抗宗教改革", "反宗教改革"], ["楕円", "椭圆"], ["総合芸術", "总体艺术"]], ["style-renaissance", "style-mannerism"], ["style-rococo", "style-neoclassical"], ["style-renaissance", "style-neoclassical"], {
      name: "Baroque Architecture", period: "17th–early 18th centuries",
      summary: "Architecture that uses curves, light, axes, and continuous space to make religious and royal power a dramatic experience.",
      formationBackground: "The Counter-Reformation, absolutist monarchy, and new conceptions of space encouraged theatrical architecture integrating churches, palaces, and cities.",
      structuralFeatures: ["Ovals, curved walls, compound domes, and giant orders", "A continuity of structure and ornament that blurs their boundary"],
      spatialFeatures: ["Sightlines and movement directed from the entrance toward altar or center", "A total spatial work integrating light, painting, and sculpture"],
      visualClues: ["Undulating facades, oval plans, and dramatic chiaroscuro", "Urban axes, squares, and stairs composed as one spectacle"],
      keywords: ["Counter-Reformation", "oval", "total work of art"],
    }),
  card(
    "style-neoclassical", "新古典主義建築", "新古典主义建筑", "18世紀後半〜19世紀", "18世纪后半至19世纪",
    "考古学的に理解されたギリシア・ローマ建築を、啓蒙思想と公共性の象徴として再構成した建築。", "将考古学意义上的希腊罗马建筑重构为启蒙思想与公共性的象征。",
    "啓蒙思想、ポンペイ等の発掘、建築教育、革命と近代国家の成立を背景に、バロック・ロココの過剰への反動として発展した。", "以启蒙思想、庞贝等考古发现、建筑教育、革命与近代国家形成为背景，作为对巴洛克和洛可可繁饰的反动发展。",
    [["明快な幾何学、独立列柱、古典オーダー。", "清晰几何、独立列柱与古典柱式。"], ["単純な立体と記念碑的構成。", "简洁体块与纪念碑性构图。"]],
    [["軸線、対称、中心性により公共的秩序を表現。", "通过轴线、对称和中心性表达公共秩序。"], ["博物館・議会・銀行など新しい公共建築へ適用。", "用于博物馆、议会和银行等新公共建筑。"]],
    [["神殿正面、列柱廊、低い装飾密度。", "神庙式正面、柱廊与较低装饰密度。"], ["白色または石質感の強い厳格な外観。", "白色或石质感强烈的严整外观。"]],
    [["啓蒙思想", "启蒙思想"], ["考古学", "考古学"], ["公共性", "公共性"]], ["style-greek", "style-roman", "style-baroque"], ["style-historicism"], ["style-baroque", "style-renaissance"], {
      name: "Neoclassical Architecture", period: "Late 18th–19th centuries",
      summary: "Architecture that recast archaeologically understood Greek and Roman forms as symbols of Enlightenment thought and public order.",
      formationBackground: "Enlightenment thought, excavations such as Pompeii, architectural education, revolutions, and modern state formation fueled a reaction to Baroque and Rococo excess.",
      structuralFeatures: ["Clear geometry, freestanding colonnades, and classical orders", "Simple volumes and monumental composition"],
      spatialFeatures: ["Axes, symmetry, and centrality expressing civic order", "Applied to new public institutions including museums, parliaments, and banks"],
      visualClues: ["Temple fronts, colonnades, and restrained ornament", "Severe white or stone-like exteriors"],
      keywords: ["Enlightenment", "archaeology", "public order"],
    }),
];
