import type { ArchitectLearningCard } from "@/types/history-learning-card";

const l = (ja: string, zh: string, en: string) => ({ ja, zh, en });

type Seed = [string, string, string, string, string, string, string, string, string[], string[], string[]?];

type BatchTwoEnglish = {
  name: string;
  summary: string;
  principle: string;
  feature: string;
  phaseDescription: string;
};

const BATCH_TWO_ENGLISH: Record<string, BatchTwoEnglish> = {
  "architect-alvar-aalto": {
    name: "Alvar Aalto",
    summary: "Finnish modernist architect and designer who tempered functionalism with human scale, regional landscape, natural light, and tactile materials.",
    principle: "Translate function into humane settings through carefully modulated light, acoustics, landscape, and material character.",
    feature: "Free-form plans, undulating surfaces, warm timber, brick, and spatial sequences responsive to the body and site.",
    phaseDescription: "Saynatsalo Town Hall exemplifies Aalto's civic humanism and material sensitivity; his work broadened modernism toward organic form and critical regionalism.",
  },
  "architect-antoni-gaudi": {
    name: "Antoni Gaudi",
    summary: "Catalan architect who fused structural experiment, craft, religious symbolism, and geometries derived from nature into an individual form of Catalan Modernisme.",
    principle: "Derive structure, ornament, and spatial form together from loads, ruled geometry, and organic growth.",
    feature: "Catenary arches, branching columns, hyperboloids, polychrome surfaces, integrated craftwork, and continuous sculptural envelopes.",
    phaseDescription: "The Basilica of the Sagrada Familia synthesizes Gaudi's structural and liturgical investigations and became a major bridge from Gothic precedent and Art Nouveau to organic architecture.",
  },
  "architect-antonin-raymond": {
    name: "Antonin Raymond",
    summary: "Czech-born American architect who adapted international modernism to Japanese climate, construction, materials, and domestic life, shaping architectural practice in prewar and postwar Japan.",
    principle: "Translate modern structure into regional materials, climate-responsive planning, and local patterns of habitation.",
    feature: "Exposed structure, deep eaves, natural ventilation, open plans, and details informed by Japanese timber construction.",
    phaseDescription: "The Reader's Digest Tokyo Building demonstrated a light, open postwar modernism; Raymond's office and teaching strongly influenced successive generations of architects in Japan.",
  },
  "architect-erich-mendelsohn": {
    name: "Erich Mendelsohn",
    summary: "German-born architect who translated speed, light, and technology into dynamic masses, moving from Expressionism to streamlined commercial and institutional architecture.",
    principle: "Express scientific and metropolitan forces as continuous, energetic architectural form.",
    feature: "Streamlined profiles, rounded corners, emphatic horizontal bands, sculpted massing, and dramatic circulation.",
    phaseDescription: "The Einstein Tower is a canonical work of architectural Expressionism; Mendelsohn later carried its dynamic formal language into department stores and modern urban buildings.",
  },
  "architect-eero-saarinen": {
    name: "Eero Saarinen",
    summary: "Finnish-American architect who gave postwar American institutions and corporations distinctive identities through sculptural structure, movement, and expressive enclosure.",
    principle: "Develop the strongest spatial and symbolic identity appropriate to each building program rather than impose a single style.",
    feature: "Sweeping concrete shells, fluid circulation, expressive structural profiles, and total coordination of furniture, interiors, and corporate image.",
    phaseDescription: "The TWA Flight Center at John F. Kennedy International Airport turned passenger movement and the imagery of flight into a continuous shell, becoming a landmark of postwar structural expressionism.",
  },
  "architect-hector-guimard": {
    name: "Hector Guimard",
    summary: "French architect and designer who united vegetal curves with industrial ironwork and became the leading architectural figure of Parisian Art Nouveau.",
    principle: "Design structure, furnishings, hardware, graphics, and ornament as one continuous organic language.",
    feature: "Whiplash curves, asymmetrical facades, plant-like cast iron, polychromy, and bespoke decorative ensembles.",
    phaseDescription: "Castel Beranger established Guimard's mature Art Nouveau vocabulary and led to the standardized yet organic entrances of the Paris Metro.",
  },
  "architect-carlo-scarpa": {
    name: "Carlo Scarpa",
    summary: "Italian architect who joined conservation and modern intervention through exacting details, layered materials, water, and choreographed movement.",
    principle: "Make the junction between old and new the central subject of architectural experience.",
    feature: "Expressed joints, crafted metal and concrete, calibrated level changes, water elements, and carefully framed views.",
    phaseDescription: "The Castelvecchio Museum renovation established an influential model for inserting contemporary exhibition architecture into historic fabric without erasing its accumulated history.",
  },
  "architect-bruno-taut": {
    name: "Bruno Taut",
    summary: "German architect and theorist who linked glass, color, and collective life to Expressionist utopianism and later contributed to the international reassessment of Japanese architecture.",
    principle: "Use transparency, colored light, and communal form as agents of social and cultural transformation.",
    feature: "Prismatic glass, vivid color, crystalline geometry, housing ensembles, and idealized communal imagery.",
    phaseDescription: "The Glass Pavilion at the 1914 Werkbund Exhibition embodied Taut's utopian glass architecture; his housing work and writings later connected Expressionism, social modernism, and Japanese architectural discourse.",
  },
  "architect-gerrit-rietveld": {
    name: "Gerrit Rietveld",
    summary: "Dutch architect and designer who extended De Stijl abstraction into furniture and housing by separating walls, slabs, and furnishings into independent spatial planes.",
    principle: "Compose space through the dynamic relation of decomposed planes, lines, primary colors, and movable elements.",
    feature: "Intersecting horizontal and vertical planes, primary-color accents, open corners, transformable partitions, and continuity between furniture and architecture.",
    phaseDescription: "The Rietveld Schroder House is the definitive architectural realization of De Stijl and an early landmark of flexible, flowing domestic space.",
  },
  "architect-herzog-de-meuron": {
    name: "Herzog & de Meuron",
    summary: "Swiss architectural practice founded by Jacques Herzog and Pierre de Meuron, known for transforming material surfaces and existing structures into culturally resonant contemporary buildings.",
    principle: "Renew use and urban public life while preserving and reinterpreting the material memory of a site.",
    feature: "Experimental envelopes, material transformation, adaptive reuse, monumental interior voids, and context-specific imagery.",
    phaseDescription: "Tate Modern converted Bankside Power Station and its Turbine Hall into a new public museum, making adaptive reuse a central strategy of contemporary cultural architecture.",
  },
  "architect-i-m-pei": {
    name: "I. M. Pei",
    summary: "Chinese-American modernist architect who used lucid geometry and structural clarity to place contemporary civic institutions within historically charged urban settings.",
    principle: "Read inherited axes, circulation, and civic scale, then translate them into precise modern geometry.",
    feature: "Platonic volumes, triangulated grids, stone and glass, monumental circulation, and carefully controlled natural light.",
    phaseDescription: "The Louvre Pyramid reorganized the museum around a luminous underground entrance while creating a deliberate dialogue between modern glass geometry and the Louvre Palace.",
  },
  "architect-som": {
    name: "Skidmore, Owings & Merrill (SOM)",
    summary: "American architecture and engineering practice that integrated structure, building services, and urban scale to systematize the postwar high-rise office building.",
    principle: "Coordinate structural grids, services, facade modules, and planning as a repeatable yet site-responsive building system.",
    feature: "Steel frames, glass curtain walls, rational grids, integrated engineering, open office floors, and disciplined corporate detailing.",
    phaseDescription: "Lever House became an early canonical glass-curtain-wall office tower and helped establish SOM's model of interdisciplinary practice and International Style corporate architecture.",
  },
  "architect-henri-labrouste": {
    name: "Henri Labrouste",
    summary: "French architect who introduced exposed iron and controlled daylight into public reading rooms, advancing a new architectural expression for nineteenth-century institutions.",
    principle: "Use modern structure to produce luminous, rational interiors whose construction is both legible and ornamental.",
    feature: "Slender cast-iron columns, exposed arches, vaulted reading rooms, roof lighting, and a dialogue between masonry enclosure and metal structure.",
    phaseDescription: "The Bibliotheque Nationale's Labrouste Reading Room, following the Bibliotheque Sainte-Genevieve, made iron structure central to modern library architecture and influenced later public interiors.",
  },
  "architect-gottfried-semper": {
    name: "Gottfried Semper",
    summary: "German architect and theorist who connected civic monuments with a theory of material, craft, cladding, and ritual in works such as theaters and museums.",
    principle: "Understand architecture as the synthesis of enclosure, material technique, ritual, and civic institution.",
    feature: "Polychrome historicism, tectonic articulation, richly modeled envelopes, ceremonial planning, and explicit correspondence between material and ornament.",
    phaseDescription: "The Burgtheater in Vienna exemplifies Semper's influence on nineteenth-century civic architecture, while his theory of the four elements and Bekleidung shaped later debates on tectonics and cladding.",
  },
  "architect-carl-gotthard-langhans": {
    name: "Carl Gotthard Langhans",
    summary: "Prussian architect who adapted the Greek propylaeum into a modern ceremonial city gate and helped establish Neoclassicism as an emblem of Berlin.",
    principle: "Translate an ancient prototype into a modern conjunction of urban passage, ceremony, and state representation.",
    feature: "Doric colonnades, restrained massing, axial passageways, and archaeological reference deployed at metropolitan scale.",
    phaseDescription: "The Brandenburg Gate recast the Propylaea of the Athenian Acropolis as a civic threshold and became a defining monument of Prussian Neoclassicism and modern Berlin.",
  },
  "architect-charles-barry": {
    name: "Charles Barry",
    summary: "British architect who organized the Gothic Revival language of the Palace of Westminster within the complex planning and monumental scale of a modern parliamentary institution.",
    principle: "Join historical style to clear circulation, institutional hierarchy, and a coherent urban river frontage.",
    feature: "Axial planning, picturesque towers, long river facades, ceremonial sequences, and coordinated Perpendicular Gothic ornament.",
    phaseDescription: "At the Palace of Westminster, Barry directed the overall design and planning while Augustus Welby Northmore Pugin developed much of its Gothic detail, defining Victorian parliamentary architecture.",
  },
  "architect-augustus-pugin": {
    name: "Augustus Welby Northmore Pugin",
    summary: "English architect, designer, and polemicist who argued for Gothic architecture as an ethical expression of truthful construction, social order, and Christian culture.",
    principle: "Unify construction, use, and ornament according to lessons drawn from medieval Gothic architecture.",
    feature: "Constructionally expressive Gothic detail, integrated furnishings and metalwork, vertical composition, heraldic color, and liturgical specificity.",
    phaseDescription: "Pugin's interiors and decorative program for the Palace of Westminster complemented Charles Barry's planning and made the complex a touchstone of the Victorian Gothic Revival; his writings, including Contrasts, supplied its moral theory.",
  },
  "architect-george-gilbert-scott": {
    name: "George Gilbert Scott",
    summary: "English architect who expanded the Gothic Revival across churches, civic buildings, and railway architecture, shaping the urban image of industrial Britain.",
    principle: "Combine the scale and program of modern institutions with the vertical and picturesque capacities of historical Gothic form.",
    feature: "Polychrome masonry, pointed arches, towers and spires, richly articulated silhouettes, and Gothic envelopes coordinated with large modern interiors.",
    phaseDescription: "The Midland Grand Hotel and train-station frontage at St Pancras made High Victorian Gothic a monumental counterpart to the iron train shed and a lasting image of the railway city.",
  },
  "architect-joseph-paxton": {
    name: "Joseph Paxton",
    summary: "English designer and horticulturist who transferred greenhouse technology and industrial production to monumental exhibition architecture.",
    principle: "Assemble vast enclosures rapidly through standardized, prefabricated, repeatable components.",
    feature: "Modular cast-iron frames, plate glass, repetitive bays, lightweight enclosure, rapid dry assembly, and adaptable interior volume.",
    phaseDescription: "The Crystal Palace for the Great Exhibition of 1851 demonstrated prefabricated iron-and-glass construction at unprecedented scale and became a foundational precedent for modern industrial architecture.",
  },
  "architect-gustave-eiffel": {
    name: "Gustave Eiffel",
    summary: "French civil engineer and constructor who developed wrought-iron and steel lattice systems for bridges and towers, turning exposed engineering structure into a metropolitan symbol.",
    principle: "Make load paths, wind resistance, fabrication, and erection legible in a light and efficient metal framework.",
    feature: "Open lattice construction, tapered profiles, prefabricated members, riveted connections, and forms calibrated to structural forces.",
    phaseDescription: "The Eiffel Tower, built for the 1889 Exposition Universelle, made large-scale iron engineering an emblem of modern Paris and a decisive monument of industrial-age construction.",
  },
};

const make = ([id, ja, zh, years, summaryJa, summaryZh, principleJa, principleZh, buildingIds, related, regions = ["western"]]: Seed): ArchitectLearningCard => {
  const english = BATCH_TWO_ENGLISH[id];
  return {
    id, kind: "architect", name: l(ja, zh, english.name), aliases: [], period: l(years, years, years), regions,
    summary: l(summaryJa, summaryZh, english.summary), lifeSummary: l(summaryJa, summaryZh, english.summary),
    designPrinciples: [l(principleJa, principleZh, english.principle)],
    recurringFeatures: [l("代表作を通じて構造・空間・表現を統合する。", "通过代表作整合结构、空间与表达。", english.feature)],
    careerPhases: [{ label: l("代表作", "代表作", "Representative works and influence"), description: l(summaryJa, summaryZh, english.phaseDescription), buildingIds }],
    keywords: [], relatedBuildingIds: buildingIds, relatedPersonIds: [], relatedCardIds: related,
    influencedByIds: [], influencedIds: [], examEvidence: [], reviewStatus: "draft",
  };
};

const SEEDS: Seed[] = [
  ["architect-alvar-aalto", "アルヴァ・アアルト", "阿尔瓦·阿尔托", "1898–1976", "自然、材料、人の行為を近代建築の合理性へ結びつけ、フィンランドの公共建築を刷新した建築家。", "将自然、材料和人的活动融入现代建筑理性，革新芬兰公共建筑的建筑师。", "機能を人間的な尺度、光、素材の感覚で具体化する。", "以人性尺度、光和材料感将功能具体化。", ["building-33ee6654afec"], ["movement-modernism", "movement-critical-regionalism"]],
  ["architect-antoni-gaudi", "アントニ・ガウディ", "安东尼·高迪", "1852–1926", "構造実験、自然の幾何学、工芸を統合し、カタルーニャ近代主義を独自に展開した建築家。", "整合结构实验、自然几何和工艺，独自发展加泰罗尼亚现代主义的建筑师。", "荷重と自然形態から装飾・構造・空間を同時に導く。", "从荷载与自然形态同时导出装饰、结构和空间。", ["building-60680a538837"], ["movement-art-nouveau", "style-gothic"]],
  ["architect-antonin-raymond", "アントニン・レーモンド", "安东宁·雷蒙德", "1888–1976", "近代建築を日本の気候、木造、施工条件へ適応させ、戦前・戦後の建築教育と実務に影響した建築家。", "将现代建筑适应日本气候、木构和施工条件，影响战前战后建筑教育与实践的建筑师。", "近代的な構造を地域の材料・気候・生活へ翻訳する。", "将现代结构转译到地域材料、气候与生活。", ["building-d1fbe34c55dd"], ["movement-modernism"], ["japan", "global"]],
  ["architect-erich-mendelsohn", "エーリヒ・メンデルゾーン", "埃里希·门德尔松", "1887–1953", "速度、光、技術を流動的な量塊に変換し、表現主義から商業建築までを横断した建築家。", "将速度、光和技术转化为流动体量，横跨表现主义与商业建筑的建筑师。", "科学技術と都市の動きを、連続する建築形態として表す。", "将科学技术与城市运动表现为连续的建筑形态。", ["building-79933ef41720"], ["style-expressionism", "movement-modernism"]],
  ["architect-eero-saarinen", "エーロ・サーリネン", "埃罗·沙里宁", "1910–1961", "構造・流線・企業像を彫塑的な屋根と空間へ統合し、戦後アメリカの公共建築を更新した建築家。", "将结构、流线和企业形象整合为雕塑性屋顶和空间，革新战后美国公共建筑的建筑师。", "用途ごとに最も強い空間的アイデンティティを与える。", "为不同用途赋予最鲜明的空间身份。", ["building-fec1dfa16358"], ["movement-modernism", "style-structural-expressionism"]],
  ["architect-hector-guimard", "エクトール・ギマール", "埃克托·吉马尔", "1867–1942", "植物的曲線と工業素材を結び、パリのアール・ヌーヴォーを代表した建築家・デザイナー。", "结合植物性曲线和工业材料，代表巴黎新艺术运动的建筑师、设计师。", "構造、家具、金物、文字までを連続する有機的表現として設計する。", "将结构、家具、五金和文字设计为连续的有机表达。", ["building-2030ac61e27f"], ["movement-art-nouveau"]],
  ["architect-carlo-scarpa", "カルロ・スカルパ", "卡洛·斯卡帕", "1906–1978", "既存建築に精密なディテール、水、素材、動線を重ね、保存と現代性を接続した建築家。", "在既有建筑上叠加精密细部、水、材料和动线，连接保护与现代性的建筑师。", "新旧の接合部を空間体験の中心として設計する。", "将新旧接合部设计为空间体验的核心。", ["building-eb9edb68e1c5"], ["movement-critical-regionalism"]],
  ["architect-bruno-taut", "ブルーノ・タウト", "布鲁诺·陶特", "1880–1938", "ガラス、色彩、共同体を通して表現主義的な建築像を示し、日本建築の再評価にも寄与した建築家。", "通过玻璃、色彩和共同体呈现表现主义建筑观，并推动日本建筑再评价的建筑师。", "材料の透明性と光を社会的な建築の象徴として扱う。", "将材料透明性和光视作社会性建筑的象征。", ["building-217da880d8e4"], ["style-expressionism", "movement-modernism"], ["germany", "japan", "global"]],
  ["architect-gerrit-rietveld", "ヘリット・トーマス・リートフェルト", "赫里特·里特维尔德", "1888–1964", "デ・ステイルの抽象構成を住宅・家具へ展開し、壁・床・家具を独立した平面として再編した建築家。", "将风格派抽象构成发展至住宅和家具，把墙、楼板与家具重组为独立平面的建筑师。", "構成要素を分解し、色と平面の関係で空間を組み立てる。", "分解构成要素，以色彩和平面关系组织空间。", ["building-da66ceebcc71"], ["movement-de-stijl", "movement-modernism"]],
  ["architect-herzog-de-meuron", "ヘルツォーク＆ド・ムーロン", "赫尔佐格与德梅隆", "1978–", "既存の発電所を文化施設へ転用し、素材・外皮・都市の記憶を現代建築へ接続した建築事務所。", "将既有发电站改造为文化设施，把材料、表皮和城市记忆连接至当代建筑的建筑事务所。", "既存の物質性を保存しながら、用途と都市的公共性を更新する。", "在保留既有物质性的同时更新用途与城市公共性。", ["building-7d68f935b2b0"], ["movement-postmodernism", "movement-critical-regionalism"], ["global"]],
  ["architect-i-m-pei", "I・M・ペイ", "贝聿铭", "1917–2019", "幾何学的な構成と明快な構造によって、歴史的都市と現代的公共施設を結びつけた建築家。", "以几何构成和清晰结构连接历史城市与现代公共设施的建筑师。", "古い都市の軸線・動線を読み、現代的な幾何学へ変換する。", "读取古老城市的轴线和动线，并转化为现代几何。", ["building-2321465d2631"], ["movement-modernism", "style-high-tech"], ["usa", "global"]],
  ["architect-som", "SOM（スキッドモア・オーウィングズ・アンド・メリル）", "SOM（斯基德莫尔、奥因斯与美林）", "1936–", "構造技術、設備、都市スケールを統合し、戦後の高層オフィス建築を体系化した設計事務所。", "整合结构技术、设备与城市尺度，系统化战后高层办公建筑的设计事务所。", "構造グリッドと設備を反復可能な高層建築システムとして組織する。", "将结构网格和设备组织为可重复的高层建筑系统。", ["building-a6f56a900576"], ["style-international", "movement-modernism"], ["usa", "global"]],
  ["architect-henri-labrouste", "アンリ・ラブルースト", "亨利·拉布鲁斯特", "1801–1875", "鉄と光を公共図書館の読書空間へ導入し、19世紀の新材料建築を先導した建築家。", "将铁与光引入公共图书馆阅览空间，引领19世纪新材料建筑的建筑师。", "新しい構造を公共施設の明るく合理的な内部空間へ用いる。", "将新结构用于公共设施明亮而理性的室内空间。", ["building-1a84c81136b0"], ["style-industrial-iron-glass", "style-historicism"]],
  ["architect-gottfried-semper", "ゴットフリート・ゼンパー", "戈特弗里德·森珀", "1803–1879", "劇場・博物館を通じて都市の公共性と装飾・材料の理論を結びつけた建築家・理論家。", "通过剧院和博物馆连接城市公共性与装饰、材料理论的建筑师、理论家。", "建築を被覆、素材、儀礼、都市制度の総合として理解する。", "将建筑理解为表皮、材料、仪礼和城市制度的综合。", ["building-da08295af934"], ["style-historicism"]],
  ["architect-carl-gotthard-langhans", "カール・ゴットハルト・ラングハンス", "卡尔·戈特哈德·朗汉斯", "1732–1808", "ギリシア建築のプロピュライアを近代国家の都市門へ翻案し、ベルリンの新古典主義を象徴した建築家。", "将希腊建筑山门改编为近代国家城市门，象征柏林新古典主义的建筑师。", "古典的な原型を都市の記念性と通過の経験へ転用する。", "将古典原型转用于城市纪念性与通行体验。", ["building-cac929072731"], ["style-neoclassical"]],
  ["architect-charles-barry", "チャールズ・バリー", "查尔斯·巴里", "1795–1860", "英国国会議事堂でゴシック・リヴァイヴァルを近代議会の大規模な制度建築へ組織した建築家。", "在英国国会大厦中将哥特复兴组织为近代议会大型制度建筑的建筑师。", "歴史様式を都市・制度・平面計画と結びつける。", "将历史样式与城市、制度和平面规划连接。", ["building-39901e377630"], ["style-gothic", "style-historicism"]],
  ["architect-augustus-pugin", "オーガスタス・ピュージン", "奥古斯塔斯·普金", "1812–1852", "ゴシックを倫理的・構法的に再評価し、英国国会議事堂の装飾と内部を担った建築家・デザイナー。", "从伦理和构造角度重新评价哥特式，负责英国国会大厦装饰与内部的建筑师、设计师。", "構法・用途・装飾の一致を中世ゴシックから学ぶ。", "从中世纪哥特式学习构造、用途与装饰的一致。", ["building-39901e377630"], ["style-gothic", "architect-charles-barry"]],
  ["architect-george-gilbert-scott", "ジョージ・ギルバート・スコット", "乔治·吉尔伯特·斯科特", "1811–1878", "ゴシック・リヴァイヴァルを駅舎や公共建築へ展開し、鉄道時代の都市景観を形づくった建築家。", "将哥特复兴发展至车站和公共建筑，塑造铁路时代城市景观的建筑师。", "近代的な大空間と歴史的な垂直性を重ねる。", "叠加现代大空间与历史性垂直感。", ["building-a9672f12096b"], ["style-gothic", "style-historicism"]],
  ["architect-joseph-paxton", "ジョセフ・パクストン", "约瑟夫·帕克斯顿", "1803–1865", "温室技術と工場生産を用い、水晶宮で組立式の鉄・ガラス大空間を実現した設計者。", "运用温室技术和工厂生产，在水晶宫实现装配式钢铁玻璃大空间的设计者。", "標準部材と反復によって短期間に大空間を組み立てる。", "通过标准构件和重复在短期内组装大空间。", ["building-b7685f6d8bea"], ["style-industrial-iron-glass"]],
  ["architect-gustave-eiffel", "ギュスターヴ・エッフェル", "古斯塔夫·埃菲尔", "1832–1923", "鉄骨技術を大規模な塔と橋へ展開し、構造そのものを都市の象徴へ変えた技術者・設計者。", "将钢结构技术发展至大型塔和桥梁，把结构本身转化为城市象征的工程师、设计者。", "荷重・風・施工を可視化する軽量な鉄骨構造を追求する。", "追求可视化荷载、风和施工的轻型钢结构。", ["building-a2ebd9afe093"], ["style-industrial-iron-glass"]],
];

export const BATCH_TWO_ARCHITECT_CARDS = SEEDS.map(make);
