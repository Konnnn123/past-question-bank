import type { ArchitectLearningCard } from "@/types/history-learning-card";

const l = (ja: string, zh: string, en: string) => ({ ja, zh, en });

type CoreArchitect = {
  id: string;
  ja: string;
  zh: string;
  years: string;
  summary: [string, string];
  principle: [string, string];
  feature: [string, string];
  buildingIds: string[];
  related: string[];
  regions?: string[];
  aliases?: string[];
};

type CoreArchitectEnglish = {
  name: string;
  summary: string;
  principle: string;
  feature: string;
  phaseDescription: string;
};

const CORE_ARCHITECT_ENGLISH: Record<string, CoreArchitectEnglish> = {
  "architect-donato-bramante": {
    name: "Donato Bramante",
    summary: "An architect who established the centralized plan and classical order of the High Renaissance and set a standard for monumental architecture in Rome.",
    principle: "Ancient Roman proportion and centrality adapted to Christian architecture.",
    feature: "Rigorous geometry, domes, and clearly layered classical orders.",
    phaseDescription: "The Tempietto at San Pietro in Montorio and the design for St. Peter's Basilica established a monumental High Renaissance language and influenced Michelangelo.",
  },
  "architect-michelangelo": {
    name: "Michelangelo Buonarroti",
    summary: "An architect and artist who transformed the High Renaissance toward Mannerism through sculptural mass, tension within classical elements, and urban space.",
    principle: "Classical orders treated as material for expressing force and movement rather than as fixed rules.",
    feature: "Giant orders, deep shadow, and sculptural stairs and piazzas.",
    phaseDescription: "The Laurentian Library, Piazza del Campidoglio, and the dome of St. Peter's Basilica reshaped Mannerist and monumental architecture.",
  },
  "architect-jules-hardouin-mansart": {
    name: "Jules Hardouin-Mansart",
    summary: "A French architect who spatialized the monarchy of Louis XIV through the axes, domes, and disciplined classicism of Versailles.",
    principle: "Palace, garden, and city integrated as a continuous representation of state power.",
    feature: "Long axes, regulated facades, and monumental domes.",
    phaseDescription: "The Hall of Mirrors and Grand Trianon at the Palace of Versailles, together with Les Invalides, defined French royal classicism.",
  },
  "architect-peter-behrens": {
    name: "Peter Behrens",
    summary: "A German architect who integrated corporate architecture, products, and graphic design, opening a junction between industrial design and modern architecture.",
    principle: "Industrial production unified with form, corporate identity, and architecture.",
    feature: "Long-span steel frames, massive facades, and lucid structural expression.",
    phaseDescription: "The AEG Turbine Factory and AEG corporate programme shaped industrial architecture and influenced Gropius, Mies van der Rohe, and Le Corbusier.",
  },
  "architect-william-van-alen": {
    name: "William Van Alen",
    summary: "An American architect whose Chrysler Building symbolized automotive-age industrial imagery and the competition to build New York skyscrapers.",
    principle: "Programme, corporate identity, and structural technology transformed into a vertical urban sign.",
    feature: "A stainless-steel spire, stepped setbacks, and repeated Art Deco ornament.",
    phaseDescription: "The Chrysler Building became a canonical Art Deco skyscraper and an emblem of the machine age.",
  },
  "architect-charles-rennie-mackintosh": {
    name: "Charles Rennie Mackintosh",
    summary: "An architect who combined Scottish tradition, Arts and Crafts ideals, and geometric abstraction in integrated early-modern interiors and furniture.",
    principle: "Architecture, furniture, lighting, and graphic pattern designed as a single spatial composition.",
    feature: "Heavy masonry contrasted with delicate iron, timber, and glass.",
    phaseDescription: "The Glasgow School of Art and the Willow Tea Rooms made the Glasgow Style influential within Art Nouveau and early modern design.",
  },
  "architect-auguste-perret": {
    name: "Auguste Perret",
    summary: "A French architect who treated the reinforced-concrete frame as a classical order and expressed structure and light with clarity.",
    principle: "New materials left visible, with architectural order derived from structural repetition.",
    feature: "Slender concrete frames, lattice screens, and even daylight.",
    phaseDescription: "The Church of Notre-Dame du Raincy demonstrated the architectural and luminous potential of exposed reinforced concrete.",
  },
  "architect-charles-garnier": {
    name: "Charles Garnier",
    summary: "A French architect who integrated theatrical circulation, urban monumentality, and sumptuous eclectic decoration in the Paris Opera.",
    principle: "Separate routes for audience, performers, and stage organized as an urban space of spectacle.",
    feature: "Grand staircases, a horseshoe auditorium, rich sculpture, and polychromy.",
    phaseDescription: "The Palais Garnier became the definitive Beaux-Arts opera house and a model for ceremonial public architecture.",
  },
  "architect-john-nash": {
    name: "John Nash",
    summary: "An architect who shaped Regency Britain by working across landscape, urban planning, and exotic revival styles.",
    principle: "Individual buildings composed within continuous sequences of gardens, streets, and views.",
    feature: "Picturesque silhouettes, domes and minarets, and curving urban streets.",
    phaseDescription: "Regent Street and Regent's Park reshaped London, while the Royal Pavilion at Brighton exemplified his picturesque exoticism.",
  },
  "architect-john-soane": {
    name: "Sir John Soane",
    summary: "A British architect who used daylight, mirrors, and fragmented classical elements to create complex, continuous interiors within urban buildings.",
    principle: "Space expanded on restricted sites through linked sequences of light and sightlines.",
    feature: "Top lighting, shallow domes, mirrors, and movable walls in layered interiors.",
    phaseDescription: "Sir John Soane's Museum and the Bank of England made light, spatial compression, and abstracted classicism central to his influence.",
  },
  "architect-claude-nicolas-ledoux": {
    name: "Claude-Nicolas Ledoux",
    summary: "An architect who gave simple geometric forms social and symbolic meaning while envisioning an ideal city and autonomous architecture in the Revolutionary era.",
    principle: "Architectural form used to make institutions, occupations, and ethics visible.",
    feature: "Strong contrasts among circles, cubes, colonnades, and rusticated masonry.",
    phaseDescription: "The Royal Saltworks at Arc-et-Senans and the ideal city of Chaux established a radical architecture parlante.",
  },
  "architect-etienne-louis-boullee": {
    name: "Etienne-Louis Boullee",
    summary: "An architect and theorist who advanced Revolutionary architecture parlante on paper through immense geometry and dramatic effects of light.",
    principle: "Form, light, and shadow alone communicate a building's purpose and emotional character.",
    feature: "Spheres, vast voids, axes of symmetry, and light contrasting day with night.",
    phaseDescription: "The unbuilt Cenotaph for Newton became a foundational image of visionary neoclassicism and monumental geometric architecture.",
  },
  "architect-karl-friedrich-schinkel": {
    name: "Karl Friedrich Schinkel",
    summary: "A Prussian architect who joined Greek classicism, urban order, and modern museum functions in public architecture.",
    principle: "Public institutions expressed through lucid facades and the ordering of urban squares.",
    feature: "Colonnades, planar walls, strict proportion, and openness to the city.",
    phaseDescription: "The Altes Museum and Neue Wache established a civic neoclassicism influential across nineteenth-century Germany.",
  },
  "architect-jacques-germain-soufflot": {
    name: "Jacques-Germain Soufflot",
    summary: "An architect who integrated Gothic lightness with classical order in large masonry spaces and designed the Pantheon in Paris.",
    principle: "Classical composition endowed with structural lightness and rationality.",
    feature: "Greek-cross plans, colonnades, domes, and luminous interiors.",
    phaseDescription: "The Pantheon in Paris united a classical monument with Gothic-derived structural ambitions and anticipated neoclassical rationalism.",
  },
  "architect-christopher-wren": {
    name: "Sir Christopher Wren",
    summary: "An architect who led church reconstruction after the Great Fire of London and established classicism and Baroque in English urban and religious architecture.",
    principle: "Urban reconstruction and religious symbolism joined through lucid structure and domes.",
    feature: "Double-shell domes, classical orders, and integration of towers with naves.",
    phaseDescription: "St Paul's Cathedral and the City churches transformed London's skyline and defined the English Baroque.",
  },
  "architect-gian-lorenzo-bernini": {
    name: "Gian Lorenzo Bernini",
    summary: "An artist and architect who integrated sculpture, architecture, and piazza design, embodying Roman Baroque through bodily movement and theatricality.",
    principle: "Architecture composed as a staging of sightlines, ritual, and urban space.",
    feature: "Ellipses, curving colonnades, sculptural detail, and dramatic light.",
    phaseDescription: "St Peter's Square, the Baldachin, and Sant'Andrea al Quirinale made architecture an immersive Baroque spectacle.",
  },
  "architect-carlo-maderno": {
    name: "Carlo Maderno",
    summary: "An architect who transformed High Renaissance centralized planning into the longitudinal churches of the early Baroque and set new standards for Roman ecclesiastical architecture.",
    principle: "Longitudinal planning for ritual reconciled with the monumentality of classical facades.",
    feature: "Extended naves, giant orders, and clearly composed fronts.",
    phaseDescription: "The facade and nave extension of St Peter's Basilica established an early-Baroque model later developed by Bernini.",
  },
  "architect-giulio-romano": {
    name: "Giulio Romano",
    summary: "An architect and painter who advanced Mannerism by deliberately displacing classical rules and integrating palace decoration, space, and painting.",
    principle: "Departures from classical convention transformed into intellectual surprise and spatial tension.",
    feature: "Rustication, slipped triglyphs, forceful walls, and illusionistic interiors.",
    phaseDescription: "Palazzo Te in Mantua became a canonical Mannerist ensemble of architecture, fresco, and witty classical disruption.",
  },
  "architect-sakuro-tanabe": {
    name: "Sakuro Tanabe",
    summary: "A Japanese civil engineer and designer who planned the Lake Biwa Canal, linking modern urban infrastructure with hydropower.",
    principle: "Canals, bridges, electricity generation, and urban sanitation integrated as regional infrastructure.",
    feature: "Brick arches, waterways, and continuous civil-engineering spaces following the terrain.",
    phaseDescription: "The Lake Biwa Canal and Keage Incline modernized Kyoto's water supply, transport, and hydroelectric infrastructure.",
  },
  "architect-tokuma-katayama": {
    name: "Tokuma Katayama",
    summary: "An architect of Japan's Imperial Household Ministry who represented modern state ceremony through Western historicist palaces and museums.",
    principle: "State institutions and ceremony translated into durable monumental architecture.",
    feature: "Bilateral symmetry, massive stone-and-brick envelopes, ornamental roofs, and domes.",
    phaseDescription: "The Akasaka Palace and Kyoto National Museum established monumental Western historicism in imperial Japan.",
  },
};

const card = (item: CoreArchitect): ArchitectLearningCard => {
  const english = CORE_ARCHITECT_ENGLISH[item.id];
  return ({
  id: item.id,
  kind: "architect",
  name: l(item.ja, item.zh, english.name),
  aliases: item.aliases ?? [],
  period: l(item.years, item.years, item.years),
  regions: item.regions ?? ["western"],
  summary: l(item.summary[0], item.summary[1], english.summary),
  lifeSummary: l(item.summary[0], item.summary[1], english.summary),
  designPrinciples: [l(item.principle[0], item.principle[1], english.principle)],
  recurringFeatures: [l(item.feature[0], item.feature[1], english.feature)],
  careerPhases: [{
    label: l("代表作と影響", "代表作品与影响", "Representative works and influence"),
    description: l(item.summary[0], item.summary[1], english.phaseDescription),
    buildingIds: item.buildingIds,
  }],
  keywords: [],
  relatedBuildingIds: item.buildingIds,
  relatedPersonIds: [],
  relatedCardIds: item.related,
  influencedByIds: [],
  influencedIds: [],
  examEvidence: [],
  reviewStatus: "draft",
  });
};

// Names in this list are present in architecture-normalized-candidates.json and
// are intentionally limited to designers. Patrons, rulers, and artists remain
// related people rather than architect cards.
const CORE_ARCHITECTS: CoreArchitect[] = [
  {
    id: "architect-donato-bramante", ja: "ドナト・ブラマンテ", zh: "多纳托·布拉曼特", years: "1444–1514",
    summary: ["盛期ルネサンスの集中式・古典秩序を確立し、ローマで記念的建築の基準をつくった建築家。", "确立盛期文艺复兴的集中式与古典秩序，并在罗马奠定纪念性建筑基准的建筑师。"],
    principle: ["古代ローマの比例と中心性をキリスト教建築へ転用する。", "将古罗马的比例与中心性转用于基督教建筑。"],
    feature: ["厳密な幾何学、ドーム、オーダーの明快な重ね合わせ。", "严谨几何、穹顶与清晰叠置的柱式。"],
    buildingIds: ["building-ba42283edcef", "building-3b0bd854f756", "building-6b635fa0c07e"], related: ["style-renaissance", "architect-michelangelo"], aliases: ["Donato Bramante"],
  },
  {
    id: "architect-michelangelo", ja: "ミケランジェロ", zh: "米开朗基罗", years: "1475–1564",
    summary: ["彫刻的な量塊、緊張した古典要素、都市空間によって盛期ルネサンスをマニエリスムへ展開した建築家・芸術家。", "以雕塑性体量、紧张的古典元素与城市空间，将盛期文艺复兴发展为风格主义的建筑师和艺术家。"],
    principle: ["古典秩序を固定的な規範でなく、力と運動を表す素材として扱う。", "不把古典秩序视为固定规范，而作为表现力量与运动的素材。"],
    feature: ["巨大オーダー、深い陰影、彫刻的階段と広場。", "巨柱式、深阴影、雕塑性楼梯与广场。"],
    buildingIds: ["building-3b0bd854f756", "building-3a15d708c526", "building-471497368549"], related: ["style-mannerism", "architect-donato-bramante"], aliases: ["Michelangelo Buonarroti"],
  },
  {
    id: "architect-jules-hardouin-mansart", ja: "ジュール・アルドゥアン＝マンサール", zh: "儒勒·阿杜安-芒萨尔", years: "1646–1708",
    summary: ["ルイ14世期の王権を、ヴェルサイユの軸線・ドーム・均整ある古典主義で空間化したフランスの建築家。", "以凡尔赛的轴线、穹顶与均衡古典主义将路易十四王权空间化的法国建筑师。"],
    principle: ["宮殿・庭園・都市を連続する国家表象として統合する。", "将宫殿、园林与城市整合为连续的国家表征。"],
    feature: ["長大な軸線、規律的な立面、ドームを用いる記念性。", "长轴线、规整立面与穹顶构成的纪念性。"],
    buildingIds: ["building-e2b55d17d7c5", "building-3d611a6972a2"], related: ["style-baroque", "style-historicism"], aliases: ["Jules Hardouin-Mansart"],
  },
  {
    id: "architect-peter-behrens", ja: "ペーター・ベーレンス", zh: "彼得·贝伦斯", years: "1868–1940",
    summary: ["企業の建築・製品・広告を統合し、工業デザインと近代建築の接点を開いたドイツの建築家。", "整合企业建筑、产品与广告，打开工业设计与现代建筑交汇点的德国建筑师。"],
    principle: ["工業生産を造形・企業アイデンティティ・建築へ一体化する。", "将工业生产整合进造型、企业识别与建筑。"],
    feature: ["大スパン鉄骨、量塊的ファサード、構造の明快な表現。", "大跨度钢架、体量感立面与清晰的结构表达。"],
    buildingIds: ["building-56d521bb3c75", "building-f5c5481351e8"], related: ["movement-modernism", "style-industrial-iron-glass"], aliases: ["Peter Behrens"],
  },
  {
    id: "architect-william-van-alen", ja: "ウィリアム・ヴァン・アレン", zh: "威廉·范·艾伦", years: "1883–1954",
    summary: ["クライスラー・ビルで自動車時代の工業的意匠と摩天楼の競争を象徴化したアメリカの建築家。", "以克莱斯勒大厦象征汽车时代工业意象与摩天楼竞赛的美国建筑师。"],
    principle: ["用途・企業像・構造技術を垂直方向の都市的記号へ変換する。", "把用途、企业形象与结构技术转化为垂直的城市符号。"],
    feature: ["ステンレスの尖塔、段状後退、アール・デコの反復装飾。", "不锈钢尖塔、阶梯式退台与装饰艺术的重复装饰。"],
    buildingIds: ["building-68669d3b1704", "building-6e3ed8658b21"], related: ["style-art-deco", "style-high-tech"], aliases: ["William Van Alen"],
  },
  {
    id: "architect-charles-rennie-mackintosh", ja: "チャールズ・レニー・マッキントッシュ", zh: "查尔斯·雷尼·麦金托什", years: "1868–1928",
    summary: ["スコットランドの伝統、アーツ・アンド・クラフツ、幾何学的抽象を結び、初期近代の空間と家具を総合した建築家。", "结合苏格兰传统、工艺美术与几何抽象，综合早期现代空间和家具的建筑师。"],
    principle: ["建築・家具・照明・図案を一つの空間構成として設計する。", "将建筑、家具、照明和图案作为一个空间构成进行设计。"],
    feature: ["重厚な石壁と繊細な鉄・木・ガラスの対比。", "厚重石墙与细腻铁、木、玻璃的对比。"],
    buildingIds: ["building-supplemental-glasgow-school-art"], related: ["movement-arts-crafts", "movement-art-nouveau"], aliases: ["Charles Rennie Mackintosh"],
  },
  {
    id: "architect-auguste-perret", ja: "オーギュスト・ペレ", zh: "奥古斯特·佩雷", years: "1874–1954",
    summary: ["鉄筋コンクリートの骨組みを古典的秩序として扱い、構造と光を明快に表現したフランスの建築家。", "将钢筋混凝土框架视为古典秩序，清晰表达结构与光线的法国建筑师。"],
    principle: ["新材料を隠さず、構造の反復から建築的秩序をつくる。", "不遮蔽新材料，从结构的重复中建立建筑秩序。"],
    feature: ["細柱のラーメン、格子スクリーン、均質な採光。", "细柱框架、格栅屏幕与均质采光。"],
    buildingIds: ["building-supplemental-notre-dame-raincy"], related: ["movement-modernism", "style-industrial-iron-glass"], aliases: ["Auguste Perret"],
  },
  {
    id: "architect-charles-garnier", ja: "シャルル・ガルニエ", zh: "夏尔·加尼叶", years: "1825–1898",
    summary: ["パリ・オペラ座で劇場の動線、都市的記念性、豪華な折衷装飾を統合したフランスの建築家。", "在巴黎歌剧院整合剧场流线、城市纪念性与华丽折衷装饰的法国建筑师。"],
    principle: ["観客・出演者・舞台の異なる動線を、都市の祝祭空間として組織する。", "把观众、演出者与舞台的不同流线组织为城市庆典空间。"],
    feature: ["大階段、馬蹄形客席、豊かな彫刻と色彩。", "大楼梯、马蹄形观众厅与丰富雕塑色彩。"],
    buildingIds: ["building-e528f8fbec52"], related: ["style-historicism", "style-baroque"], aliases: ["Charles Garnier"],
  },
  {
    id: "architect-john-nash", ja: "ジョン・ナッシュ", zh: "约翰·纳什", years: "1752–1835",
    summary: ["風景・都市計画・異国趣味を横断し、リージェンシー期英国の都市景観を形づくった建築家。", "横跨景观、城市规划与异国情调，塑造摄政时期英国城市景观的建筑师。"],
    principle: ["建築単体を庭園・街路・眺望の連続のなかで構成する。", "在园林、街道与景观的连续关系中构成单体建筑。"],
    feature: ["ピクチャレスクな輪郭、ドームとミナレット、曲線的な都市街路。", "如画轮廓、穹顶与宣礼塔、曲线型城市街道。"],
    buildingIds: ["building-3f4d6bd24de7"], related: ["style-historicism", "style-colonial"], aliases: ["John Nash"],
  },
  {
    id: "architect-john-soane", ja: "サー・ジョン・ソーン", zh: "约翰·索恩爵士", years: "1753–1837",
    summary: ["採光、鏡、断片的な古典要素を用いて、都市住宅に複雑で連続的な内部世界をつくった英国の建築家。", "运用采光、镜面和碎片化古典元素，在城市住宅中创造复杂连续内部世界的英国建筑师。"],
    principle: ["小規模な敷地で光と視線の連鎖により空間を拡張する。", "在小尺度基地中通过光线与视线的连锁扩展空间。"],
    feature: ["トップライト、浅いドーム、鏡、可動壁による多層的な室内。", "天窗、浅穹顶、镜面与活动墙构成的多层室内。"],
    buildingIds: ["building-7cd159c61134"], related: ["style-neoclassical", "style-historicism"], aliases: ["Sir John Soane"],
  },
  {
    id: "architect-claude-nicolas-ledoux", ja: "クロード＝ニコラ・ルドゥー", zh: "克洛德-尼古拉·勒杜", years: "1736–1806",
    summary: ["幾何学的な単純形態に社会的・象徴的意味を与え、革命期の理想都市と建築の自律性を構想した建築家。", "赋予几何简单形态社会与象征意义，构想革命时期理想城市和建筑自主性的建筑师。"],
    principle: ["建築の形態を制度・職能・倫理の可視化として用いる。", "把建筑形态用于制度、职业与伦理的可视化。"],
    feature: ["円・立方体・柱廊と粗い石積みの強い対比。", "圆形、立方体、柱廊与粗石砌筑的强烈对比。"],
    buildingIds: ["building-b679fd510ab7"], related: ["style-neoclassical", "style-historicism"], aliases: ["Claude-Nicolas Ledoux"],
  },
  {
    id: "architect-etienne-louis-boullee", ja: "エティエンヌ＝ルイ・ブーレー", zh: "艾蒂安-路易·布雷", years: "1728–1799",
    summary: ["巨大な幾何学と光の演出によって、革命期の『語る建築』を紙上で推し進めた建築家・理論家。", "以巨大的几何体和光线效果，通过图纸推进革命时期“会说话的建筑”的建筑师、理论家。"],
    principle: ["形態・光・影だけで建築の用途と感情を伝える。", "只用形态、光和影传达建筑的用途与情感。"],
    feature: ["球体、巨大な空洞、対称軸、昼夜を対照させる光。", "球体、巨大空腔、对称轴与昼夜对照的光。"],
    buildingIds: ["building-22e4a0161d72"], related: ["style-neoclassical", "architect-claude-nicolas-ledoux"], aliases: ["Étienne-Louis Boullée"],
  },
  {
    id: "architect-karl-friedrich-schinkel", ja: "カール・フリードリヒ・シンケル", zh: "卡尔·弗里德里希·申克尔", years: "1781–1841",
    summary: ["プロイセンの公共建築にギリシア古典主義、都市性、近代的な博物館機能を結びつけた建築家。", "在普鲁士公共建筑中结合希腊古典主义、城市性与现代博物馆功能的建筑师。"],
    principle: ["公共制度を明快な立面と都市広場の秩序で表現する。", "以清晰立面与城市广场秩序表达公共制度。"],
    feature: ["列柱、平滑な壁面、厳格な比例、都市への開放性。", "柱廊、平滑墙面、严谨比例与面向城市的开放性。"],
    buildingIds: ["building-6096c419e800"], related: ["style-neoclassical", "style-historicism"], aliases: ["Karl Friedrich Schinkel"],
  },
  {
    id: "architect-jacques-germain-soufflot", ja: "ジャック＝ジェルマン・スフロ", zh: "雅克-热尔曼·苏夫洛", years: "1713–1780",
    summary: ["ゴシックの軽さと古典主義の秩序を石造大空間へ統合し、パリのパンテオンを設計した建築家。", "将哥特式的轻盈与古典主义秩序整合进石造大空间，并设计巴黎先贤祠的建筑师。"],
    principle: ["古典的構成に構造的軽快さと合理性を与える。", "赋予古典构成以结构轻盈感和理性。"],
    feature: ["ギリシア十字平面、列柱、ドーム、明るい内部。", "希腊十字平面、柱廊、穹顶与明亮内部。"],
    buildingIds: ["building-35a018aea663"], related: ["style-neoclassical", "style-gothic"], aliases: ["Jacques-Germain Soufflot"],
  },
  {
    id: "architect-christopher-wren", ja: "クリストファー・レン", zh: "克里斯托弗·雷恩", years: "1632–1723",
    summary: ["ロンドン大火後の教会再建を主導し、古典主義とバロックを英国の都市と宗教建築へ定着させた建築家。", "主导伦敦大火后的教堂重建，将古典主义与巴洛克扎根于英国城市和宗教建筑的建筑师。"],
    principle: ["都市の再建と宗教的象徴性を、明快な構造とドームで結びつける。", "以清晰结构和穹顶结合城市重建与宗教象征性。"],
    feature: ["二重殻ドーム、古典オーダー、塔と身廊の統合。", "双层穹顶、古典柱式以及塔楼与中殿的整合。"],
    buildingIds: ["building-cdd2b38f5e21"], related: ["style-baroque", "style-neoclassical"], aliases: ["Christopher Wren"],
  },
  {
    id: "architect-gian-lorenzo-bernini", ja: "ジャン・ロレンツォ・ベルニーニ", zh: "詹·洛伦佐·贝尼尼", years: "1598–1680",
    summary: ["彫刻・建築・広場を統合し、身体的な運動と劇性によってローマ・バロックを代表した芸術家・建築家。", "整合雕塑、建筑与广场，以身体性运动和戏剧性代表罗马巴洛克的艺术家、建筑师。"],
    principle: ["建築を視線・儀礼・都市空間の演出として構成する。", "将建筑构成为视线、仪礼与城市空间的演出。"],
    feature: ["楕円、曲線の列柱、彫刻的な細部、劇的な光。", "椭圆、曲线柱廊、雕塑性细部与戏剧化光线。"],
    buildingIds: ["building-3b0bd854f756"], related: ["style-baroque", "architect-carlo-maderno"], aliases: ["Gian Lorenzo Bernini"],
  },
  {
    id: "architect-carlo-maderno", ja: "カルロ・マデルノ", zh: "卡洛·马代尔诺", years: "1556–1629",
    summary: ["盛期ルネサンスの集中式をバロック初期の長軸的教会へ転換し、ローマの宗教建築に新しい基準を与えた建築家。", "将盛期文艺复兴的集中式转向巴洛克早期的纵向教堂，为罗马宗教建筑建立新标准的建筑师。"],
    principle: ["儀礼に対応する長軸性と、古典的立面の記念性を両立させる。", "兼顾适应仪礼的纵轴性与古典立面的纪念性。"],
    feature: ["伸長された身廊、巨大オーダー、明快な正面構成。", "延展中殿、巨柱式与清晰正面构成。"],
    buildingIds: ["building-3b0bd854f756"], related: ["style-baroque", "architect-gian-lorenzo-bernini"], aliases: ["Carlo Maderno"],
  },
  {
    id: "architect-giulio-romano", ja: "ジュリオ・ロマーノ", zh: "朱利奥·罗马诺", years: "1499–1546",
    summary: ["古典的な規則を意図的にずらし、宮殿の装飾・空間・絵画を統合してマニエリスムを推進した建築家・画家。", "有意错置古典规则，整合宫殿装饰、空间和绘画并推进风格主义的建筑师、画家。"],
    principle: ["古典要素の逸脱を、知的な驚きと空間的緊張へ変える。", "将古典元素的偏离转化为智性惊奇与空间张力。"],
    feature: ["粗面石、ずれたトリグリフ、強い壁面と幻想的な室内。", "粗面石、错位三联板、强烈墙面与幻想性室内。"],
    buildingIds: ["building-0b466f1d7e9f"], related: ["style-mannerism", "architect-michelangelo"], aliases: ["Giulio Romano"],
  },
  {
    id: "architect-sakuro-tanabe", ja: "田邉朔郎", zh: "田边朔郎", years: "1861–1944",
    summary: ["琵琶湖疏水を計画・設計し、近代日本の都市インフラと水力利用を結びつけた土木技術者・設計者。", "规划并设计琵琶湖疏水，将近代日本城市基础设施与水力利用结合起来的土木工程师、设计者。"],
    principle: ["水路・橋・発電・都市衛生を一つの地域インフラとして統合する。", "将水路、桥梁、发电与城市卫生整合为区域基础设施。"],
    feature: ["煉瓦アーチ、水路、地形に沿う連続的な土木空間。", "砖拱、水道与顺应地形的连续土木空间。"],
    buildingIds: ["building-29692e316552", "building-6bd3666d6dae"], related: ["style-industrial-iron-glass"], regions: ["japan"], aliases: ["田辺朔郎"],
  },
  {
    id: "architect-tokuma-katayama", ja: "片山東熊", zh: "片山东熊", years: "1854–1917",
    summary: ["宮内省で帝室建築を担い、近代日本の国家儀礼を西洋歴史主義の宮殿・博物館建築として表現した建築家。", "在宫内省负责皇室建筑，以西方历史主义的宫殿和博物馆建筑表达近代日本国家仪礼的建筑师。"],
    principle: ["国家的な制度と儀礼を、耐久性の高い記念的建築へ翻訳する。", "将国家制度与仪礼转译为耐久、纪念性的建筑。"],
    feature: ["左右対称、石・煉瓦の重厚な外皮、装飾的な屋根とドーム。", "左右对称、厚重的石砖外皮、装饰性屋顶与穹顶。"],
    buildingIds: ["building-80800e6fc2c4", "building-77cabbab5add"], related: ["style-historicism", "style-giyofu"], regions: ["japan"], aliases: ["Katayama Tokuma"],
  },
];

export const CORE_ARCHITECT_CARDS = CORE_ARCHITECTS.map(card);
