import type { ArchitectLearningCard } from "@/types/history-learning-card";

type ArchitectEnglish = {
  name: string; period: string; summary: string; lifeSummary: string;
  designPrinciples: string[]; recurringFeatures: string[];
  careerPhases: [string, string][];
};
const l = (ja: string, zh: string, en?: string) => ({ ja, zh, ...(en ? { en } : {}) });
const ls = (items: [string, string][], english?: string[]) => items.map(([ja, zh], index) => l(ja, zh, english?.[index]));
const architect = (
  id: string, ja: string, zh: string, years: string, regions: string[], summary: [string, string], life: [string, string],
  principles: [string, string][], recurring: [string, string][],
  phases: [string, string, string, string][], related: string[], influencedBy: string[] = [], influenced: string[] = [], aliases: string[] = [], english?: ArchitectEnglish,
): ArchitectLearningCard => ({
  id, kind: "architect", name: l(ja, zh, english?.name), aliases, period: l(years, years, english?.period), regions,
  summary: l(summary[0], summary[1], english?.summary), lifeSummary: l(life[0], life[1], english?.lifeSummary), designPrinciples: ls(principles, english?.designPrinciples), recurringFeatures: ls(recurring, english?.recurringFeatures),
  careerPhases: phases.map(([a, b, c, d], index) => ({ label: l(a, b, english?.careerPhases?.[index]?.[0]), description: l(c, d, english?.careerPhases?.[index]?.[1]), buildingIds: [] })),
  keywords: [], relatedBuildingIds: [], relatedPersonIds: [], relatedCardIds: related,
  influencedByIds: influencedBy, influencedIds: influenced, examEvidence: [], reviewStatus: "draft",
});

export const HISTORY_ARCHITECT_CARDS: ArchitectLearningCard[] = [
  architect(
    "architect-filippo-brunelleschi", "フィリッポ・ブルネレスキ", "菲利波·布鲁内莱斯基", "1377–1446", ["italy"],
    ["透視図法、古代ローマ研究、明快な幾何学によって初期ルネサンス建築を切り開いた建築家。", "以透视法、古罗马研究和清晰几何开创早期文艺复兴建筑的建筑师。"],
    ["フィレンツェの金工師・彫刻家として出発し、ローマ遺構の実測を経て、ドーム建設と教会・公共施設で新しい建築秩序を実現した。", "起初是佛罗伦萨金工与雕塑家，经测绘罗马遗迹后，在穹顶、教堂与公共设施中实现新的建筑秩序。"],
    [["正方形・円・立方体による比例秩序。", "以正方形、圆和立方体建立比例秩序。"], ["古典要素を構造と空間の明快な単位として用いる。", "将古典要素作为结构与空间的清晰单元。"]],
    [["灰色石材と白壁による構造単位の可視化。", "以灰色石材和白墙显现结构单元。"], ["反復する柱間と透視図的な奥行き。", "重复柱间与透视性纵深。"]],
    [["技術的形成期", "技术形成期", "金工・彫刻・透視図法とローマ研究。", "金工、雕塑、透视法与罗马研究。"], ["大ドーム", "大穹顶", "フィレンツェ大聖堂で二重殻ドームと施工体系を実現。", "在佛罗伦萨大教堂实现双层穹顶与施工体系。"], ["建築秩序の展開", "建筑秩序发展", "教会・孤児院で幾何学的な空間単位を反復。", "在教堂和育婴院中反复使用几何空间单元。"]],
    ["style-renaissance"], ["style-roman"], ["architect-leon-battista-alberti"], [],
    {
      name: "Filippo Brunelleschi", period: "1377-1446",
      summary: "An architect who launched early Renaissance architecture through linear perspective, study of ancient Rome, and lucid geometry.",
      lifeSummary: "Trained as a Florentine goldsmith and sculptor, Brunelleschi surveyed Roman ruins before establishing a new architectural order through the cathedral dome, churches, and civic works.",
      designPrinciples: ["A proportional order based on squares, circles, and cubes.", "Classical elements used as clear structural and spatial units."],
      recurringFeatures: ["Structural modules articulated in grey pietra serena against white walls.", "Repeated bays and perspectival depth."],
      careerPhases: [["Technical formation", "Goldsmithing, sculpture, perspective, and study of Rome."], ["The great dome", "The double-shell dome and construction system for Florence Cathedral."], ["Architectural order", "Geometric spatial modules repeated in churches and orphanages."]],
    }),
  architect(
    "architect-andrea-palladio", "アンドレーア・パッラーディオ", "安德烈亚·帕拉迪奥", "1508–1580", ["italy", "global"],
    ["古代ローマとルネサンスの比例原理を、邸宅・ヴィラ・教会へ明快に適用し、後世の古典主義を決定づけた建築家。", "将古罗马和文艺复兴比例原则清晰运用于宫邸、别墅和教堂，并深刻决定后世古典主义的建筑师。"],
    ["石工として出発し、トリッシノの支援で古典教育とローマ調査を経験した。作品と『建築四書』は欧州・北米へ広く伝播した。", "从石匠起步，在特里西诺支持下接受古典教育并考察罗马，其作品与《建筑四书》广泛传播至欧美。"],
    [["正方形・円・整数比による平面構成。", "以正方形、圆和整数比组织平面。"], ["神殿正面を住宅・教会のファサードへ転用。", "将神庙正面转用于住宅和教堂立面。"]],
    [["中央ホールと対称な室群。", "中央大厅与对称房间群。"], ["四面性、軸線、風景との幾何学的関係。", "四面性、轴线及与景观的几何关系。"]],
    [["ヴィチェンツァの公共建築", "维琴察公共建筑", "既存都市へ古典的ロッジアと秩序を挿入。", "向既有城市植入古典柱廊和秩序。"], ["ヴェネトのヴィラ", "威尼托别墅", "農業経営と貴族生活を対称構成で統合。", "以对称构图整合农业经营与贵族生活。"], ["教会と理論", "教堂与理论", "複合神殿正面と著作により古典主義を普及。", "通过复合神庙正面和著作传播古典主义。"]],
    ["style-renaissance", "style-neoclassical"], ["style-roman", "architect-leon-battista-alberti"], [], ["パッラーディオ"],
    { name: "Andrea Palladio", period: "1508-1580", summary: "An architect who applied ancient Roman and Renaissance proportional principles with exceptional clarity to palaces, villas, and churches, shaping later classicism.", lifeSummary: "Originally a stonemason, Palladio received classical training under Trissino and studied Rome. His buildings and The Four Books of Architecture circulated widely through Europe and North America.", designPrinciples: ["Plans ordered by squares, circles, and whole-number ratios.", "Temple fronts adapted for domestic and ecclesiastical facades."], recurringFeatures: ["A central hall with symmetrical room groups.", "Four-sided composition, axial order, and geometric relation to landscape."], careerPhases: [["Vicenza civic architecture", "Classical loggias and order inserted into the existing city."], ["Villas of the Veneto", "Symmetrical compositions integrating agricultural management and aristocratic life."], ["Churches and theory", "Composite temple fronts and publications disseminated classicism."]] }),
  architect(
    "architect-walter-gropius", "ヴァルター・グロピウス", "瓦尔特·格罗皮乌斯", "1883–1969", ["germany", "usa", "global"],
    ["工業生産、共同設計、教育改革を通じて近代建築とデザインの制度を形成した建築家。", "通过工业生产、协作设计与教育改革塑造现代建筑和设计制度的建筑师。"],
    ["ベーレンス事務所を経てファグス工場で透明な工業建築を提示し、バウハウス創設後は教育と標準化を推進。亡命後は米国で共同設計を展開した。", "曾任职贝伦斯事务所，并以法古斯工厂展现透明工业建筑；创立包豪斯后推动教育与标准化，流亡美国后发展协作设计。"],
    [["芸術・工芸・建築教育の統合。", "整合艺术、工艺与建筑教育。"], ["標準化、工業化、共同設計。", "标准化、工业化和协作设计。"]],
    [["ガラスのカーテンウォールと明快なヴォリューム。", "玻璃幕墙与清晰体量。"], ["建築を個人作品より生産・教育システムとして捉える。", "将建筑视为生产与教育体系而非个人作品。"]],
    [["工業建築", "工业建筑", "ファグス工場で構造から独立したガラス隅部を実験。", "在法古斯工厂实验脱离结构的玻璃转角。"], ["バウハウス", "包豪斯", "校舎と教育課程を近代デザインのモデルへ。", "将校舍和课程转化为现代设计模型。"], ["国際化", "国际化", "米国で教育と共同設計を展開。", "在美国发展教育和协作设计。"]],
    ["movement-bauhaus", "movement-modernism", "style-international"], ["person-peter-behrens", "movement-arts-crafts"], [],
    [],
    { name: "Walter Gropius", period: "1883-1969", summary: "An architect who shaped the institutions of modern architecture and design through industrial production, collaborative practice, and educational reform.", lifeSummary: "After working with Peter Behrens, Gropius demonstrated transparent industrial architecture at the Fagus Factory. He founded the Bauhaus, promoted education and standardization, and continued collaborative practice after emigrating to the United States.", designPrinciples: ["Integration of art, craft, and architectural education.", "Standardization, industrialization, and collaborative design."], recurringFeatures: ["Glass curtain walls and clear volumes.", "Architecture understood as a system of production and education rather than an individual artwork."], careerPhases: [["Industrial architecture", "The Fagus Factory experimented with a glass corner free of visible structural support."], ["Bauhaus", "School and curriculum became a model for modern design."], ["International practice", "Education and collaborative practice developed in the United States."]] }),
  architect(
    "architect-frank-lloyd-wright", "フランク・ロイド・ライト", "弗兰克·劳埃德·赖特", "1867–1959", ["usa", "global"],
    ["有機的建築を掲げ、水平に広がる住宅から連続空間、自然との一体化、独自の構造表現を生涯追求した建築家。", "倡导有机建筑，一生从水平住宅到连续空间、自然融合和独特结构表达持续探索。"],
    ["サリヴァンのもとで学び、プレーリー住宅を確立。日本での仕事と長い低迷を経て、落水荘、ジョンソン・ワックス、グッゲンハイムで再評価された。", "师从沙利文，确立草原住宅；经历日本项目与长期低潮后，凭流水别墅、约翰逊蜡业和古根海姆重获评价。"],
    [["建築を敷地、材料、生活と一体化する有機的建築。", "使建筑与场地、材料、生活融为一体的有机建筑。"], ["箱を壊し、連続する内部空間をつくる。", "打破盒子，创造连续室内空间。"]],
    [["低い水平線、深い軒、中心の暖炉。", "低矮水平线、深出檐与中心壁炉。"], ["幾何学的モチーフを平面・家具・装飾へ反復。", "将几何母题反复用于平面、家具与装饰。"]],
    [["プレーリー期", "草原时期", "中心暖炉から空間が十字形に広がる住宅。", "住宅空间从中心壁炉呈十字形展开。"], ["帝国ホテルと織物ブロック", "帝国饭店与织物砌块", "耐震・装飾・モジュールを統合。", "整合抗震、装饰与模数。"], ["後期代表作", "后期代表作", "自然、構造、連続空間を大胆な形態へ展開。", "将自然、结构和连续空间发展为大胆形态。"]],
    ["movement-modernism"], ["person-louis-sullivan", "japanese-architecture"], [],
    [],
    { name: "Frank Lloyd Wright", period: "1867-1959", summary: "An architect of organic architecture who pursued horizontal houses, flowing space, integration with nature, and distinctive structural expression throughout his career.", lifeSummary: "After learning in Louis Sullivan's office, Wright established the Prairie House. Work in Japan and a prolonged period of obscurity preceded renewed recognition through Fallingwater, the Johnson Wax Headquarters, and the Guggenheim Museum.", designPrinciples: ["Architecture integrated with site, materials, and life.", "Continuous interiors created by breaking open the box."], recurringFeatures: ["Low horizontal lines, deep eaves, and a central hearth.", "Geometric motifs repeated in plans, furniture, and ornament."], careerPhases: [["Prairie period", "Residential space expands cruciformly from a central hearth."], ["Imperial Hotel and textile block", "Earthquake resistance, ornament, and modular construction are integrated."], ["Late masterpieces", "Nature, structure, and continuous space develop into bold forms."]] }),
  architect(
    "architect-kenzo-tange", "丹下健三", "丹下健三", "1913–2005", ["japan", "global"],
    ["日本の伝統的構成と近代構造を統合し、戦後復興から巨大都市・国家プロジェクトまで展開した建築家。", "整合日本传统构成与现代结构，从战后重建发展到巨型城市和国家项目的建筑师。"],
    ["広島平和記念公園で戦後日本の公共建築を象徴化し、東京計画1960と代々木競技場で都市・構造・伝統を統合。後期は国際的巨大プロジェクトへ進んだ。", "以广岛和平纪念公园象征战后日本公共建筑，并通过东京计划1960和代代木竞技场整合城市、结构与传统；后期转向国际巨型项目。"],
    [["伝統を形の引用ではなく空間・構造原理として再解釈。", "不以形式引用，而以空间和结构原则重新解释传统。"], ["建築単体から都市・インフラへ尺度を拡張。", "从单体建筑扩展到城市与基础设施尺度。"]],
    [["軸線、広場、ピロティによる公共空間。", "以轴线、广场和底层架空形成公共空间。"], ["コンクリートの量塊と大スパン構造。", "混凝土体量与大跨度结构。"]],
    [["戦後公共建築", "战后公共建筑", "広島で記憶、都市軸、近代建築を統合。", "在广岛整合记忆、城市轴线与现代建筑。"], ["構造と都市", "结构与城市", "香川県庁舎、東京計画、代々木で伝統と技術を融合。", "在香川县厅舍、东京计划与代代木融合传统和技术。"], ["国際的モニュメント", "国际纪念性", "後期に超高層・文化施設・海外計画へ展開。", "后期发展至高层、文化设施和海外规划。"]],
    ["movement-modernism", "movement-metabolism"], ["architect-le-corbusier", "japanese-traditional-architecture"], ["architect-kiyonori-kikutake", "architect-kisho-kurokawa"], [],
    { name: "Kenzo Tange", period: "1913-2005", summary: "An architect who combined Japanese compositional traditions with modern structure, moving from postwar reconstruction to megastructures, urban plans, and national projects.", lifeSummary: "The Hiroshima Peace Memorial Park made Tange a symbol of postwar Japanese public architecture. Tokyo Plan 1960 and the Yoyogi National Gymnasium combined urban thought, structure, and tradition before his later international large-scale projects.", designPrinciples: ["Tradition reinterpreted as spatial and structural principle, not copied as form.", "Scale extended from the individual building to the city and infrastructure."], recurringFeatures: ["Public space organized by axes, plazas, and pilotis.", "Concrete massing and long-span structures."], careerPhases: [["Postwar public architecture", "Hiroshima integrated memory, urban axis, and modern architecture."], ["Structure and city", "Kagawa Prefectural Office, Tokyo Plan, and Yoyogi joined tradition and technology."], ["International monuments", "Later work expanded to high-rise, cultural, and overseas projects."]] }),
  architect(
    "architect-kiyonori-kikutake", "菊竹清訓", "菊竹清训", "1928–2011", ["japan"],
    ["更新可能な空間と成長する都市を構想し、メタボリズムの理論と実作を先導した建築家。", "构想可更新空间与成长城市，推动新陈代谢派理论与实践的建筑师。"],
    ["自邸スカイハウスで恒久的主体と可変的生活単位を実験し、海上都市や塔状都市へ拡張。ホテル・行政・博物館でも成長と交換の考えを展開した。", "在自宅天空住宅中实验永久主体与可变生活单元，并扩展至海上城市和塔状城市；在酒店、行政和博物馆中继续发展成长与替换理念。"],
    [["か・かた・かたちという設計方法論。", "‘构想—方法—形态’的设计方法论。"], ["恒久的構造と交換可能な部分の分離。", "分离永久结构与可替换部分。"]],
    [["高床の主空間と付加・交換される小空間。", "架空主体空间与可增设、替换的小空间。"], ["建築を完成品でなく時間的プロセスとして扱う。", "将建筑视为时间过程而非完成品。"]],
    [["スカイハウス", "天空住宅", "住宅で可変性と構造主体を実験。", "在住宅中实验可变性与结构主体。"], ["都市提案", "城市提案", "海上都市・塔状都市で国土と都市の成長を構想。", "以海上城市、塔状城市构想国土与城市成长。"], ["公共建築", "公共建筑", "メタボリズムの原理を大規模施設へ応用。", "将新陈代谢原则用于大型设施。"]],
    ["movement-metabolism"], ["architect-kenzo-tange"], ["architect-kisho-kurokawa"], [],
    { name: "Kiyonori Kikutake", period: "1928-2011", summary: "An architect who conceived renewable space and growing cities, pioneering the theory and practice of Metabolism.", lifeSummary: "Kikutake tested a permanent structural body and changeable living units in Sky House, then extended these ideas to marine cities and tower cities, as well as hotels, civic buildings, and museums.", designPrinciples: ["A design methodology of concept, method, and form.", "Separation of permanent structure from replaceable parts."], recurringFeatures: ["Elevated primary spaces with added or replaceable smaller rooms.", "Architecture treated as a temporal process rather than a finished object."], careerPhases: [["Sky House", "A house testing adaptability and structural autonomy."], ["Urban proposals", "Marine City and tower-city proposals imagined territorial and urban growth."], ["Public architecture", "Metabolist principles applied to large facilities."]] }),
  architect(
    "architect-kisho-kurokawa", "黒川紀章", "黑川纪章", "1934–2007", ["japan", "global"],
    ["カプセル、交換可能性、共生の思想を通じ、メタボリズムを建築・都市・国際理論へ展開した建築家。", "通过胶囊、可替换性与共生思想，将新陈代谢派扩展至建筑、城市和国际理论的建筑师。"],
    ["丹下研究室とメタボリズム運動を経て、中銀カプセルタワーで交換可能な住戸を実現。後期は『共生』を掲げ、文化施設・都市計画へ活動を広げた。", "经丹下研究室和新陈代谢运动后，以中银胶囊塔实现可替换住宅；后期提出‘共生’，扩展至文化设施与城市规划。"],
    [["恒久的コアと交換可能なカプセル。", "永久核心与可替换胶囊。"], ["異質な文化・歴史・技術の共生。", "异质文化、历史与技术的共生。"]],
    [["工業生産された単位を明確に表現。", "清晰表达工业生产单元。"], ["成長・更新の仕組みを外観へ可視化。", "将成长更新机制显现于外观。"]],
    [["カプセルとメタボリズム", "胶囊与新陈代谢", "交換可能な単位による都市生活を提案。", "以可替换单元提出城市生活模式。"], ["共生の建築", "共生建筑", "歴史と现代、地域と国際性を重ねる。", "叠加历史与现代、地域与国际性。"], ["国際活動", "国际实践", "文化施設と大規模都市計画へ展開。", "扩展至文化设施与大型城市规划。"]],
    ["movement-metabolism", "movement-postmodernism"], ["architect-kenzo-tange", "architect-kiyonori-kikutake"], [],
    [],
    { name: "Kisho Kurokawa", period: "1934-2007", summary: "An architect who developed Metabolism through capsules, replaceability, and symbiosis across architecture, urbanism, and international theory.", lifeSummary: "After Tange's laboratory and the Metabolist movement, Kurokawa realized replaceable dwelling units in the Nakagin Capsule Tower. Later he developed symbiosis through cultural buildings and urban planning.", designPrinciples: ["A permanent core with replaceable capsules.", "Symbiosis among different cultures, histories, and technologies."], recurringFeatures: ["Clearly expressed industrially produced units.", "Mechanisms of growth and renewal made visible on the exterior."], careerPhases: [["Capsules and Metabolism", "Replaceable units propose a model for urban life."], ["Architecture of symbiosis", "History and modernity, local and global, are layered together."], ["International practice", "Cultural buildings and large urban plans broadened his work."]] }),
  architect(
    "architect-tadao-ando", "安藤忠雄", "安藤忠雄", "1941–", ["japan", "global"],
    ["幾何学、打放しコンクリート、光、身体的動線によって、場所と自然を再認識させる空間をつくる建築家。", "以几何、清水混凝土、光线和身体动线创造让人重新感知场所与自然的空间的建筑师。"],
    ["独学で建築を学び、住吉の長屋で都市住宅の原型を提示。1980年代以降、教会・美術館・文化施設で幾何学と自然現象を結びつけ、国際的に活動した。", "自学建筑，以住吉长屋提出城市住宅原型；20世纪80年代后通过教堂、美术馆和文化设施连接几何与自然现象，并走向国际。"],
    [["自立した幾何学を場所へ衝突させる。", "使自律几何体与场所发生碰撞。"], ["光・風・水を建築材料として扱う。", "将光、风、水作为建筑材料。"]],
    [["滑らかな打放しコンクリート面。", "光滑清水混凝土墙面。"], ["壁、隙間、折れ曲がる動線による身体的体験。", "以墙、缝隙和转折动线形成身体体验。"]],
    [["都市住宅", "城市住宅", "閉鎖的外殻の内部に自然と生活を再構成。", "在封闭外壳内部重构自然与生活。"], ["宗教・文化空間", "宗教与文化空间", "光と幾何学で象徴的体験をつくる。", "以光和几何创造象征体验。"], ["場所の再生", "场所再生", "既存環境・遺産・島嶼景観へ介入。", "介入既有环境、遗产与岛屿景观。"]],
    ["movement-modernism", "critical-regionalism"], ["architect-le-corbusier", "japanese-spatial-tradition"], [],
    [],
    { name: "Tadao Ando", period: "Born 1941", summary: "An architect who uses geometry, exposed concrete, light, and bodily movement to make spaces that renew awareness of place and nature.", lifeSummary: "Self-taught as an architect, Ando established a prototype for urban housing with the Azuma House in Sumiyoshi. From the 1980s, churches, museums, and cultural projects connected geometry with natural phenomena and brought him international recognition.", designPrinciples: ["Autonomous geometry set in tension with the site.", "Light, wind, and water treated as architectural materials."], recurringFeatures: ["Smooth exposed concrete surfaces.", "Embodied experience shaped by walls, openings, and turning paths."], careerPhases: [["Urban houses", "Nature and daily life are reconstructed inside an enclosed urban shell."], ["Religious and cultural spaces", "Light and geometry create symbolic experience."], ["Regeneration of place", "Work intervenes in existing environments, heritage, and island landscapes."]] }),
];
