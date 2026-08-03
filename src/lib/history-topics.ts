import type {
  HistoryTopic,
  HistoryTopicGroup,
  HistoryTopicKind,
} from "@/types/history-topic";

const l = (ja: string, zh: string) => ({ ja, zh });
const period = (display: string, ja: string, zh: string, startYear?: number, endYear?: number) => ({
  display, label: l(ja, zh), startYear, endYear,
});
const topic = (value: HistoryTopic): HistoryTopic => value;

export const HISTORY_TOPIC_GROUPS: HistoryTopicGroup[] = [
  { id: "types", kind: "building-type", name: l("建築類型", "建筑类型"), description: l("用途と空間構成から建築を横断的に比較する", "从功能与空间组织横向比较建筑") },
  { id: "styles", kind: "style", name: l("建築様式", "建筑样式"), description: l("時代・地域に共有された構成と表現", "时代与地域共同形成的构成和表达") },
  { id: "movements", kind: "movement", name: l("建築運動", "建筑运动"), description: l("共通の問題意識と主張をもつ活動", "具有共同问题意识和主张的活动") },
  { id: "theories", kind: "theory", name: l("思想・原則", "思想与原则"), description: l("設計や都市を導く概念・理論", "指导设计和城市的概念与理论") },
  { id: "institutions", kind: "institution", name: l("保存・制度", "保护与制度"), description: l("建築遺産の評価・保存・継承", "建筑遗产的评价、保护与传承") },
];

const EMPTY_RELATIONS = { relatedTopicIds: [], representativeBuildingIds: [], examEvidence: [] };

export const HISTORY_TOPICS: HistoryTopic[] = [
  // 建築類型：大分類と、過去問で比較・識別に必要な下位類型
  topic({ id:"type-religious", kind:"building-type", name:l("宗教建築","宗教建筑"), aliases:[], regions:["global"], period:period("古代〜現代","古代から現代","古代至现代"), summary:l("祭祀・礼拝・修行のための建築類型。","用于祭祀、礼拜和修行的建筑类型。"), keywords:[l("儀礼","仪式"),l("聖域","圣域")], ...EMPTY_RELATIONS, importance:3, status:"core" }),
  topic({ id:"type-shrine", kind:"building-type", parentId:"type-religious", name:l("神社建築","神社建筑"), aliases:["神社"], regions:["japan"], period:period("古代〜現代","古代から現代","古代至现代"), summary:l("本殿・拝殿・鳥居などで神域を構成する日本固有の宗教建築。","以本殿、拜殿和鸟居等构成神域的日本宗教建筑。"), keywords:[l("本殿","本殿"),l("式年遷宮","式年迁宫")], relatedTopicIds:["style-shinmei","style-taisha","style-kasuga","style-nagare","style-hachiman"], representativeBuildingIds:[], examEvidence:[], importance:3, status:"core" }),
  topic({ id:"type-buddhist-temple", kind:"building-type", parentId:"type-religious", name:l("仏教寺院","佛教寺院"), aliases:["寺院建築","仏教建築"], regions:["japan","east-asian"], period:period("6世紀〜現代","飛鳥時代から現代","飞鸟时代至现代",550), summary:l("伽藍配置と礼拝・修行空間をもつ仏教建築。","具有伽蓝配置及礼拜、修行空间的佛教建筑。"), keywords:[l("伽藍","伽蓝"),l("金堂・塔・講堂","金堂、塔、讲堂")], relatedTopicIds:["style-wayo","style-daibutsuyo","style-zenshuyo","type-pure-land-hall"], representativeBuildingIds:[], examEvidence:[], importance:3, status:"core" }),
  topic({ id:"type-church", kind:"building-type", parentId:"type-religious", name:l("キリスト教会堂","基督教教堂"), aliases:["教会建築","大聖堂"], regions:["western"], period:period("4世紀〜現代","初期キリスト教から現代","早期基督教至现代",300), summary:l("典礼と会衆のための教会堂。長堂式と集中式が主要系譜。","服务于礼仪和会众的教堂，以长堂式和集中式为主要谱系。"), keywords:[l("バシリカ","巴西利卡"),l("集中堂","集中式教堂")], relatedTopicIds:["style-byzantine","style-romanesque","style-gothic"], representativeBuildingIds:[], examEvidence:[], importance:3, status:"core" }),
  topic({ id:"type-residential", kind:"building-type", name:l("住宅建築","居住建筑"), aliases:["住居"], regions:["global"], period:period("古代〜現代","古代から現代","古代至现代"), summary:l("生活単位と社会構造を空間化する建築類型。","将生活单位和社会结构空间化的建筑类型。"), keywords:[l("生活様式","生活方式"),l("私的・共同空間","私人、共同空间")], ...EMPTY_RELATIONS, importance:3, status:"core" }),
  topic({ id:"type-aristocratic-residence", kind:"building-type", parentId:"type-residential", name:l("宮殿・貴族住宅","宫殿与贵族住宅"), aliases:["宮殿建築"], regions:["global"], period:period("古代〜近代","古代から近代","古代至近代"), summary:l("権力・儀礼・居住を統合した支配層の建築。","整合权力、仪式和居住的统治阶层建筑。"), keywords:[l("儀礼","仪式"),l("軸線","轴线")], relatedTopicIds:["style-shinden","style-shoin"], representativeBuildingIds:[], examEvidence:[], importance:2, status:"core" }),
  topic({ id:"type-detached-house", kind:"building-type", parentId:"type-residential", name:l("独立住宅","独立住宅"), aliases:["邸宅","戸建住宅"], regions:["global"], period:period("古代〜現代","古代から現代","古代至现代"), summary:l("一世帯を基本単位とする住宅。近代建築の実験の主要舞台。","以单户为基本单位的住宅，也是现代建筑实验的重要载体。"), keywords:[l("住居平面","住宅平面"),l("内外関係","内外关系")], relatedTopicIds:["movement-modernism"], representativeBuildingIds:[], examEvidence:[], importance:3, status:"core" }),
  topic({ id:"type-collective-housing", kind:"building-type", parentId:"type-residential", name:l("集合住宅","集合住宅"), aliases:["共同住宅","アパートメント"], regions:["global"], period:period("古代〜現代","古代ローマから現代","古罗马至现代"), summary:l("複数世帯を一棟または一団地に収容する住宅類型。","在一栋或一组建筑中容纳多户家庭的住宅类型。"), keywords:[l("住戸","户型"),l("共用空間","公共空间")], relatedTopicIds:["type-public-housing","theory-neighborhood-unit","movement-metabolism"], representativeBuildingIds:[], examEvidence:[], importance:3, status:"core" }),
  topic({ id:"type-public-housing", kind:"building-type", parentId:"type-collective-housing", name:l("公的集合住宅・団地","公共集合住宅与住宅团地"), aliases:["公営住宅","住宅団地"], regions:["japan","global"], period:period("20世紀〜","20世紀から","20世纪至今",1900), summary:l("住宅政策と都市計画により供給された集合住宅。","由住宅政策和城市规划供给的集合住宅。"), keywords:[l("標準設計","标准化设计"),l("団地計画","住区规划")], relatedTopicIds:["theory-neighborhood-unit","theory-radburn"], representativeBuildingIds:[], examEvidence:[], importance:3, status:"core" }),
  topic({ id:"type-civic-cultural", kind:"building-type", name:l("公共・文化建築","公共与文化建筑"), aliases:["公共建築"], regions:["global"], period:period("古代〜現代","古代から現代","古代至现代"), summary:l("行政・教育・文化・集会などの公共機能を担う建築。","承担行政、教育、文化和集会等公共功能的建筑。"), keywords:[l("公共性","公共性"),l("大空間","大空间")], ...EMPTY_RELATIONS, importance:2, status:"core" }),
  topic({ id:"type-theatre-arena", kind:"building-type", parentId:"type-civic-cultural", name:l("劇場・競技場","剧场与竞技场"), aliases:["劇場建築"], regions:["global"], period:period("古代〜現代","古代から現代","古代至现代"), summary:l("観覧・上演・競技の視線と動線を組織する大規模建築。","组织观看、表演、比赛视线和流线的大型建筑。"), keywords:[l("観客席","观众席"),l("大架構","大跨结构")], ...EMPTY_RELATIONS, importance:2, status:"extended" }),
  topic({ id:"type-museum-library", kind:"building-type", parentId:"type-civic-cultural", name:l("博物館・図書館","博物馆与图书馆"), aliases:["文化施設"], regions:["global"], period:period("近世〜現代","近世から現代","近世至现代",1500), summary:l("収集・保存・展示・閲覧によって知識を公共化する建築。","通过收藏、保存、展示和阅览使知识公共化的建筑。"), keywords:[l("展示動線","展示流线"),l("採光","采光")], ...EMPTY_RELATIONS, importance:2, status:"extended" }),
  topic({ id:"type-fortification", kind:"building-type", name:l("城郭・防御建築","城郭与防御建筑"), aliases:["城郭建築","城"], regions:["global"], period:period("古代〜近世","古代から近世","古代至近世"), summary:l("軍事防御と権力の象徴を兼ねる建築・都市類型。","兼具军事防御与权力象征的建筑和城市类型。"), keywords:[l("防御線","防御线"),l("天守・城壁","天守、城墙")], ...EMPTY_RELATIONS, importance:2, status:"core" }),
  topic({ id:"type-monument-tomb", kind:"building-type", name:l("記念建築・陵墓","纪念建筑与陵墓"), aliases:["モニュメント","墓廟"], regions:["global"], period:period("古代〜現代","古代から現代","古代至现代"), summary:l("死・記憶・国家的物語を象徴化する建築。","将死亡、记忆和国家叙事象征化的建筑。"), keywords:[l("象徴性","象征性"),l("永続性","永久性")], ...EMPTY_RELATIONS, importance:2, status:"extended" }),
  topic({ id:"type-urban-space", kind:"building-type", name:l("都市・街路・広場","城市、街道与广场"), aliases:["都市計画","都市改造"], regions:["global"], period:period("古代〜現代","古代から現代","古代至现代"), summary:l("建築群、街路、広場、インフラを統合する都市スケールの類型。","整合建筑群、街道、广场和基础设施的城市尺度类型。"), keywords:[l("都市軸","城市轴线"),l("街区","街区")], relatedTopicIds:["theory-garden-city","theory-neighborhood-unit","institution-heritage-district"], representativeBuildingIds:[], examEvidence:[], importance:3, status:"core" }),
  topic({ id:"type-industrial-commercial", kind:"building-type", name:l("産業・商業・交通建築","工业、商业与交通建筑"), aliases:["産業建築","駅舎","商業建築"], regions:["global"], period:period("18世紀〜","産業革命以降","工业革命以后",1750), summary:l("生産・流通・消費を支え、新材料と大架構を発展させた建築。","支撑生产、流通和消费，并推动新材料与大跨结构发展的建筑。"), keywords:[l("鉄とガラス","铁与玻璃"),l("大スパン","大跨度")], relatedTopicIds:["movement-modernism"], representativeBuildingIds:[], examEvidence:[], importance:2, status:"extended" }),

  // 日本建築様式
  ...[
    ["style-shinmei","神明造","神明造"],["style-taisha","大社造","大社造"],["style-kasuga","春日造","春日造"],["style-nagare","流造","流造"],["style-hachiman","八幡造","八幡造"],
    ["style-wayo","和様","和样"],["style-daibutsuyo","大仏様","大佛样"],["style-zenshuyo","禅宗様","禅宗样"],
    ["style-shinden","寝殿造","寝殿造"],["style-shoin","書院造","书院造"],["style-sukiya","数寄屋造・数寄屋建築","数寄屋造与数寄屋建筑"],
    ["style-gongen","権現造","权现造"],["style-teikan","帝冠様式","帝冠样式"],["style-giyofu","擬洋風建築","拟洋风建筑"]
  ].map(([id,ja,zh]) => topic({ id, kind:"style", name:l(ja,zh), aliases:[], regions:["japan"], period:period("日本建築史","日本建築史","日本建筑史"), summary:l(`${ja}の成立背景・構成・意匠を整理する。`, `整理${zh}的形成背景、构成与表现。`), keywords:[], ...EMPTY_RELATIONS, importance:["style-shinden","style-shoin","style-daibutsuyo","style-zenshuyo","style-giyofu"].includes(id)?3:2, status:"core" })),

  // 西洋・近現代様式
  ...[
    ["style-greek","古代ギリシア建築","古希腊建筑"],["style-roman","古代ローマ建築","古罗马建筑"],["style-byzantine","ビザンティン建築","拜占庭建筑"],
    ["style-romanesque","ロマネスク建築","罗马式建筑"],["style-gothic","ゴシック建築","哥特式建筑"],["style-renaissance","ルネサンス建築","文艺复兴建筑"],
    ["style-baroque","バロック建築","巴洛克建筑"],["style-rococo","ロココ","洛可可"],["style-neoclassical","新古典主義建築","新古典主义建筑"],
    ["style-historicism","歴史主義建築","历史主义建筑"],["style-art-nouveau","アール・ヌーヴォー","新艺术"],["style-art-deco","アール・デコ","装饰艺术"],
    ["style-expressionism","表現主義建築","表现主义建筑"],["style-international","インターナショナル・スタイル","国际主义风格"],
    ["style-high-tech","ハイテク建築","高技派建筑"],["style-postmodern","ポストモダン建築","后现代建筑"]
  ].map(([id,ja,zh]) => topic({ id, kind:"style", name:l(ja,zh), aliases:[], regions:["western","global"], period:period("西洋建築史","西洋建築史","西方建筑史"), summary:l(`${ja}の時代背景、構築、空間、表現を整理する。`, `整理${zh}的时代背景、建构、空间与表达。`), keywords:[], ...EMPTY_RELATIONS, importance:["style-greek","style-roman","style-byzantine","style-romanesque","style-gothic","style-renaissance","style-art-nouveau","style-international"].includes(id)?3:2, status:"core" })),

  // 運動
  topic({ id:"movement-arts-crafts", kind:"movement", name:l("アーツ・アンド・クラフツ運動","工艺美术运动"), aliases:["Arts and Crafts Movement"], regions:["western"], period:period("19世紀後半","ヴィクトリア朝後期","19世纪后半",1860,1910), summary:l("工業化による粗悪な量産品を批判し、手仕事と生活芸術の統一を唱えた運動。","批判工业化造成的粗劣量产品，主张手工艺与生活艺术统一的运动。"), background:l("産業革命、労働疎外、製品の質低下への反応。","回应工业革命、劳动异化与产品质量下降。"), characteristics:[l("素材と構法の誠実さ","材料与构造的诚实"),l("芸術と生活の統一","艺术与生活统一")], keywords:[l("ラスキン／モリス","拉斯金／莫里斯")], relatedTopicIds:["style-art-nouveau","movement-modernism"], representativeBuildingIds:[], examEvidence:[{year:2020,category:"専門2-2",questionNumber:"5",fileName:"2020_専門2-2_建筑史_Q5.md",relation:"direct"},{year:2025,category:"専門2-2",questionNumber:"4",fileName:"2025_専門2-2_建筑史_Q4.md",relation:"direct"}], importance:3, status:"core" }),
  ...[
    ["movement-vienna-secession","ウィーン分離派","维也纳分离派"],["movement-de-stijl","デ・ステイル","风格派"],["movement-constructivism","ロシア構成主義","俄国构成主义"],
    ["movement-bauhaus","バウハウス","包豪斯"],["movement-modernism","近代建築運動・モダニズム","现代建筑运动与现代主义"],
    ["movement-metabolism","メタボリズム","新陈代谢派"],["movement-postmodernism","ポストモダニズム","后现代主义"]
  ].map(([id,ja,zh]) => topic({ id, kind:"movement", name:l(ja,zh), aliases:[], regions:id==="movement-metabolism"?["japan"]:["western","global"], period:period("19〜20世紀","近現代","近现代"), summary:l(`${ja}の成立背景、主張、人物、代表作と影響を整理する。`, `整理${zh}的形成背景、主张、人物、代表作和影响。`), keywords:[], ...EMPTY_RELATIONS, importance:["movement-bauhaus","movement-modernism","movement-metabolism"].includes(id)?3:2, status:"core" })),

  // 思想・都市理論
  topic({ id:"theory-five-points", kind:"theory", name:l("近代建築の五原則","现代建筑五原则"), aliases:["新しい建築の5つの要点","Five Points of a New Architecture"], regions:["western","global"], period:period("1920年代","近代","现代",1920,1930), summary:l("ピロティ、屋上庭園、自由な平面、水平連続窓、自由な立面からなるル・コルビュジエの原則。","由底层架空、屋顶花园、自由平面、水平长窗和自由立面构成的勒·柯布西耶原则。"), keywords:[l("ル・コルビュジエ","勒·柯布西耶")], relatedTopicIds:["movement-modernism","style-international"], representativeBuildingIds:[], examEvidence:[{year:2020,category:"専門2-2",questionNumber:"5",fileName:"2020_専門2-2_建筑史_Q5.md",relation:"direct"},{year:2026,category:"専門2-2",questionNumber:"4",fileName:"2026_専門2-2_建筑史_Q4.md",relation:"direct"}], importance:3, status:"core" }),
  ...[
    ["theory-garden-city","田園都市","田园城市"],["theory-neighborhood-unit","近隣住区","邻里单位"],["theory-radburn","ラドバーン方式","雷德朋模式"],
    ["theory-pattern-language","パターン・ランゲージ","模式语言"],["theory-adaptive-reuse","アダプティブ・リユース","适应性再利用"],
    ["theory-authenticity","オーセンティシティ","真实性"],["theory-spolia","スポリア","构件再利用（Spolia）"]
  ].map(([id,ja,zh]) => topic({ id, kind:"theory", name:l(ja,zh), aliases:[], regions:["global"], period:period("近現代中心","建築・都市理論","建筑与城市理论"), summary:l(`${ja}の定義、成立背景、実践例を整理する。`, `整理${zh}的定义、形成背景和实践案例。`), keywords:[], ...EMPTY_RELATIONS, importance:["theory-neighborhood-unit","theory-adaptive-reuse","theory-authenticity"].includes(id)?3:2, status:"core" })),

  // 保存・文化財制度
  ...[
    ["institution-athens-charter","アテネ憲章（保存）","雅典宪章（文物保护）"],["institution-venice-charter","ヴェネツィア憲章","威尼斯宪章"],
    ["institution-world-heritage","世界遺産制度・顕著な普遍的価値","世界遗产制度与突出普遍价值"],
    ["institution-important-cultural-property","重要文化財","重要文化财"],["institution-registered-tangible","登録有形文化財","登录有形文化财"],
    ["institution-heritage-district","重要伝統的建造物群保存地区","重要传统建筑群保存地区"],
    ["institution-preservation-restoration","保存・修復・活用","保护、修复与利用"]
  ].map(([id,ja,zh]) => topic({ id, kind:"institution", name:l(ja,zh), aliases:[], regions:["japan","global"], period:period("20世紀〜","近現代","近现代",1900), summary:l(`${ja}の目的、適用対象、手法と論点を整理する。`, `整理${zh}的目的、适用对象、方法与争点。`), keywords:[], ...EMPTY_RELATIONS, importance:["institution-venice-charter","institution-registered-tangible","institution-heritage-district","institution-preservation-restoration"].includes(id)?3:2, status:"core" })),
];

export const HISTORY_TOPICS_BY_ID = new Map(HISTORY_TOPICS.map((item) => [item.id, item]));

export function getHistoryTopicsByKind(kind: HistoryTopicKind) {
  return HISTORY_TOPICS.filter((item) => item.kind === kind);
}

export function getHistoryTopic(id: string) {
  return HISTORY_TOPICS_BY_ID.get(id);
}
