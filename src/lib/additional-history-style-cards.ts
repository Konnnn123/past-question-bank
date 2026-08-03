import type{StyleLearningCard}from"@/types/history-learning-card";
const l=(ja:string,zh:string,en?:string)=>({ja,zh,...(en?{en}:{})});
type EnglishAdditionalStyle={name:string;period:string;summary:string;formationBackground:string;structuralFeature:string;spatialFeature:string;visualClue:string};
const ENGLISH_BY_ID:Record<string,EnglishAdditionalStyle>={
  "style-ancient-egyptian":{
    name:"Ancient Egyptian Architecture",period:"Predynastic Period–Ptolemaic Kingdom",
    summary:"Architecture that expressed kingship, the afterlife, and solar worship through monumental stone construction and axial planning.",
    formationBackground:"Nile agriculture and a centralized monarchy supported long-term construction campaigns and the transport of stone.",
    structuralFeature:"Masonry construction, post-and-lintel systems, and massive walling",
    spatialFeature:"Pyramids, pylons, hypostyle halls, and strongly articulated central axes",
    visualClue:"Pyramids, pylons, hypostyle halls, and strongly articulated central axes",
  },
  "style-mesopotamian":{
    name:"Mesopotamian Architecture",period:"4th millennium BCE–6th century BCE",
    summary:"Architecture of cities, palaces, and ziggurats constructed primarily from mud brick and fired brick.",
    formationBackground:"City-states of the river plains and priestly kingship generated religious buildings at the center of urban life.",
    structuralFeature:"Thick brick walls, vaults, and stepped platforms",
    spatialFeature:"A centripetal urban composition organized around ziggurats and palaces",
    visualClue:"Massive platforms, glazed bricks, and city walls",
  },
  "style-ancient-persian":{
    name:"Ancient Persian Architecture",period:"6th–4th centuries BCE",
    summary:"Architecture that integrated techniques from many regions and expressed imperial ceremony through columned halls and monumental terraces.",
    formationBackground:"It emerged from the multiethnic Achaemenid Empire and the ceremonial practices of the royal court.",
    structuralFeature:"Stone columns, timber roofs, and large terraces",
    spatialFeature:"The vast Apadana audience hall and the stepped terrace composition at Persepolis",
    visualClue:"Double-animal capitals, monumental Apadanas, and stair reliefs",
  },
  "style-carolingian":{
    name:"Carolingian Architecture",period:"8th–9th centuries",
    summary:"Architecture that revived Roman and Early Christian precedents while reorganizing monastic and ecclesiastical institutions in Western Europe.",
    formationBackground:"Charlemagne promoted imperial integration and a revival of Christian learning and culture.",
    structuralFeature:"Basilicas, centralized chapels, and westworks",
    spatialFeature:"Regular planning centered on the cloister court of the monastery",
    visualClue:"Massive towered west fronts and ordered monastic plans",
  },
  "style-colonial":{
    name:"Colonial Architecture",period:"16th–20th centuries",
    summary:"Architecture that adapted or imposed metropolitan forms on local climates, materials, and labor practices in colonial territories.",
    formationBackground:"Trade, missionary activity, colonial administration, and migration brought metropolitan and local building cultures into contact.",
    structuralFeature:"Deep eaves, verandas, ventilation, and local materials",
    spatialFeature:"Climate-responsive plans linking interior and exterior through verandas and cross-ventilation",
    visualClue:"Western-style facades alongside regional roofs and open spaces",
  },
  "style-structural-expressionism":{
    name:"Structural Expressionism",period:"From the late 20th century onward",
    summary:"An architectural tendency that makes loads, frames, and joints visible, treating the structural system itself as expression.",
    formationBackground:"Advances in long-span engineering, calculation, and new materials encouraged the integration of structure and form.",
    structuralFeature:"Suspension systems, shells, trusses, and exoskeletons with legible paths of force",
    spatialFeature:"Structural frames create large interior volumes and enable flexible plans",
    visualClue:"Structural members determine both exterior form and interior space",
  },
};
const c=(id:string,ja:string,zh:string,pja:string,pzh:string,s:string,z:string,b:string,bz:string,f:string,fz:string,sf:string,sfz:string,v:string,vz:string):StyleLearningCard=>({id,kind:"style",name:l(ja,zh,ENGLISH_BY_ID[id]?.name),aliases:[],period:l(pja,pzh,ENGLISH_BY_ID[id]?.period),regions:["global"],summary:l(s,z,ENGLISH_BY_ID[id]?.summary),formationBackground:l(b,bz,ENGLISH_BY_ID[id]?.formationBackground),structuralFeatures:[l(f,fz,ENGLISH_BY_ID[id]?.structuralFeature)],spatialFeatures:[l(sf,sfz,ENGLISH_BY_ID[id]?.spatialFeature)],visualClues:[l(v,vz,ENGLISH_BY_ID[id]?.visualClue)],keywords:[],relatedBuildingIds:[],relatedPersonIds:[],relatedCardIds:[],comparisonCardIds:[],predecessorCardIds:[],successorCardIds:[],examEvidence:[],reviewStatus:"draft"});
export const ADDITIONAL_HISTORY_STYLE_CARDS:StyleLearningCard[]=[
c("style-ancient-egyptian","古代エジプト建築","古埃及建筑","前王朝期〜プトレマイオス朝","前王朝至托勒密王朝","王権・死後世界・太陽信仰を巨大石造建築と軸線で表現した建築。","以巨型石构和轴线表现王权、来世与太阳信仰的建筑。","ナイル農業と中央集権王朝が長期建設と石材運搬を支えた。","尼罗河农业与中央集权王朝支撑长期建造和石材运输。","組積造、柱梁式、巨大な壁体。","砌体、柱梁式和巨厚墙体。","ピラミッド、塔門、列柱室、強い中軸線。","金字塔、塔门、柱厅和强烈中轴线。","ピラミッド、塔門、列柱室、強い中軸線。","金字塔、塔门、柱厅和强烈中轴线。"),
c("style-mesopotamian","メソポタミア建築","美索不达米亚建筑","前4千年紀〜前6世紀","前4千纪至前6世纪","日乾煉瓦と焼成煉瓦で都市・宮殿・ジッグラトを構成した建築。","以土坯和烧砖构成城市、宫殿和塔庙的建筑。","河川平野の都市国家と神権・王権が都市中心の宗教建築を生んだ。","河流平原的城市国家及神权王权催生城市中心宗教建筑。","煉瓦の厚壁、ヴォールト、段状基壇。","砖厚墙、拱顶与阶梯台基。","ジッグラトと宮殿を中心とした求心的都市構成。","以塔庙和宫殿为中心的向心式城市构成。","巨大基壇、彩釉煉瓦、都市壁。","巨型台基、彩釉砖和城墙。"),
c("style-ancient-persian","古代ペルシア建築","古代波斯建筑","前6〜前4世紀","前6至前4世纪","諸地域の技術を統合し、列柱ホールと巨大基壇で帝国儀礼を表現した建築。","整合多地域技术，以柱厅和巨大台基表现帝国礼仪的建筑。","アケメネス朝の多民族帝国と朝貢儀礼を背景に成立。","形成于阿契美尼德多民族帝国与朝贡礼仪背景。","石柱と木造屋根、大規模な基壇。","石柱、木屋顶和大型台基。","広大なアパダナ（謁見の間）とペルセポリスの段状基壇構成。","宏大阿帕达纳（谒见厅）与波斯波利斯的阶梯台基构成。","双頭動物柱頭、広大なアパダナ、階段浮彫。","双头动物柱头、宏大阿帕达纳和阶梯浮雕。"),
c("style-carolingian","カロリング朝建築","加洛林建筑","8〜9世紀","8至9世纪","ローマ・初期キリスト教を復興し、西欧修道院・教会制度を再編した建築。","复兴罗马和早期基督教传统并重组西欧修道院、教堂制度的建筑。","カール大帝が帝国統合とキリスト教文化復興を推進した。","查理大帝推动帝国整合与基督教文化复兴。","バシリカ、集中式礼拝堂、西構え。","巴西利卡、集中式礼拜堂和西构。","修道院の回廊中庭を核とした規則的平面計画。","以修道院回廊中庭为核心的规则平面规划。","重厚な塔状西正面と規則的修道院計画。","厚重塔状西立面与规则修道院规划。"),
c("style-colonial","コロニアル建築","殖民地建筑","16〜20世紀","16至20世纪","宗主国の様式を現地の気候・材料・労働技術へ適応または強制した植民地建築。","将宗主国样式适应或强加于当地气候、材料和劳动技术的殖民地建筑。","交易・布教・行政支配・移民を通じて、宗主国と現地の建築文化が交錯した。","贸易、传教、行政统治与移民形成跨地域混合。","深い庇、ベランダ、通風と現地材料。","深出檐、外廊、通风与地方材料。","ベランダを介した内外連続と通風を重視した熱帯適応型プラン。","以外廊连接内外、重视通风的热带适应型平面。","西洋風の立面と地域的な屋根・開放空間が併存する。","西式立面与地域屋顶、开放空间并存。"),
c("style-structural-expressionism","構造表現主義","结构表现主义","20世紀後半以降","20世纪后半至今","荷重・架構・接合を可視化し、構造システムそのものを建築表現とする傾向。","将荷载、构架和节点可视化，以结构体系本身作为建筑表达的倾向。","大スパン工学、計算技術、新材料の発達が構造と造形の統合を促した。","大跨度工程、计算技术和新材料发展推动结构与造型融合。","吊り構造、シェル、トラス、外骨格など、力の流れが明快な構造を用いる。","悬索、壳体、桁架和外骨骼等清晰传力体系。","構造フレームが内部を大空間化し、自由な平面を可能にする。","结构框架使内部大空间化，实现自由平面。","構造部材が外形と内部空間を主導する。","構造部材が外形と内部空間を主導する。"),
];
