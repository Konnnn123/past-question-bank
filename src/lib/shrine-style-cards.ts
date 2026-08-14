import type { StyleLearningCard } from "@/types/history-learning-card";
const l=(ja:string,zh:string,en?:string)=>({ja,zh,...(en?{en}:{})});
type EnglishStyleContent={
  name:string; period:string; summary:string; formationBackground:string;
  structuralFeatures:string[]; spatialFeatures:string[]; visualClues:string[]; keywords:string[];
};
const ENGLISH_BY_ID:Record<string,EnglishStyleContent>={
  "style-shinmei":{
    name:"Shinmei-zukuri", period:"Attested from the 7th century; archaic form transmitted into later periods",
    summary:"A shrine main-hall form based on granary-like raised floors, a gabled roof, and hirairi orientation, retaining a plain rectilinear composition.",
    formationBackground:"Its archaic form has been repeatedly transmitted through the rites and periodic rebuilding of Ise Jingū.",
    structuralFeatures:["Post-in-ground construction, raised floor, gabled roof, and hirairi orientation", "Munamochibashira ridge-supporting posts carrying the ridge directly"],
    spatialFeatures:["A simple arrangement entering a single inner sanctum from the center of the front"],
    visualClues:["Chigi finials, katsuogi billets, straight thatched roofs, and unfinished timber"],
    keywords:["hirairi", "munamochibashira"],
  },
  "style-taisha":{
    name:"Taisha-zukuri", period:"Attested from the 7th century; archaic form transmitted into later periods",
    summary:"A shrine main-hall form of raised-floor, gabled, tsumairi construction that evokes ancient dwellings and palaces.",
    formationBackground:"It was preserved as a distinctive, strongly vertical form within Izumo belief and the worship of Ōkuninushi.",
    structuralFeatures:["Gabled tsumairi construction, raised floor, and a central shin-no-mihashira post", "An entrance stair placed at the front or side"],
    spatialFeatures:["The interior is articulated by the central post and walls, with the sacred seat placed deep within"],
    visualClues:["A gable-end front, steep stair, chigi finials, and katsuogi billets"],
    keywords:["tsumairi", "shin-no-mihashira"],
  },
  "style-kasuga":{
    name:"Kasuga-zukuri", period:"Emerged in the late 8th century; continuing into later periods",
    summary:"A small gabled, tsumairi shrine main hall with a front eave that gives the composition its graceful curves.",
    formationBackground:"It developed through the rites and rebuilding of Kasuga Taisha and spread principally from Nara.",
    structuralFeatures:["Gabled tsumairi construction with a front eave across one bay", "A compact timber frame forming the moya core and eave"],
    spatialFeatures:["The eave above the stair forms the foreground for worship"],
    visualClues:["A curving tsumairi roof, front eave, and vermilion finish"],
    keywords:["tsumairi", "front eave"],
  },
  "style-nagare":{
    name:"Nagare-zukuri", period:"Emerged in the late 8th century; continuing into later periods",
    summary:"Japan's most widespread shrine main-hall form, extending the front slope of a gabled hirairi roof to unite a front eave with the worship space.",
    formationBackground:"It developed as a worship forecourt was added to the front of hirairi main halls and then spread widely among shrines across Japan.",
    structuralFeatures:["Gabled hirairi construction with an extended front roof slope", "Classified by the number of front bays, as in one-bay and three-bay nagare-zukuri"],
    spatialFeatures:["The deep front eave mediates between worshippers and the main sanctuary"],
    visualClues:["An asymmetrical roof profile, a long front slope, and hirairi orientation"],
    keywords:["extended front slope", "hirairi"],
  },
  "style-hachiman":{
    name:"Hachiman-zukuri", period:"Established in the 8th century; continuing into later periods",
    summary:"A composite shrine main-hall form that joins two gabled hirairi buildings, integrating the inner and outer sanctuaries.",
    formationBackground:"It developed at shrines such as Usa Jingū to serve the worship and rites of the Hachiman cult.",
    structuralFeatures:["Two front-to-back buildings joined by an ai-no-ma connecting space", "A gutter set in the valley between the two roofs"],
    spatialFeatures:["The outer and inner sanctuaries serve distinct ritual roles, including the day and night seats of the deity"],
    visualClues:["Two parallel buildings, a central roof valley, and elongated side elevations"],
    keywords:["paired sanctuaries", "ai-no-ma"],
  },
  "style-gongen":{
    name:"Gongen-zukuri", period:"Established from the late 16th to the early 17th century",
    summary:"An early modern shrine composition that joins the main sanctuary and worship hall through a low intermediate bay, such as an ishi-no-ma, to form one complex.",
    formationBackground:"It developed in early modern Tōshōgū and mausoleum architecture; Nikkō Tōshōgū is its leading example, and its name derives from Tōshō Daigongen, the deified Tokugawa Ieyasu.",
    structuralFeatures:["The main sanctuary, ishi-no-ma, and worship hall are linked as volumes of differing floor and roof heights"],
    spatialFeatures:["An axial sequence connects the worship hall to the main sanctuary through the intermediate bay"],
    visualClues:["A composite silhouette with a low roof set between higher front and rear roofs"],
    keywords:["ishi-no-ma", "Tōshōgū"],
  },
};
const PERIOD_BY_ID:Record<string,[string,string]>={
  "style-shinmei":["7世紀以降に実在確認・古式を後世継承","7世纪以后可由资料确认，古式延续至后世"],
  "style-taisha":["7世紀以降に実在確認・古式を後世継承","7世纪以后可由资料确认，古式延续至后世"],
  "style-kasuga":["8世紀後半に成立・後世継承","形成于8世纪后半并延续至后世"],
  "style-nagare":["8世紀後半に成立・後世継承","形成于8世纪后半并延续至后世"],
  "style-hachiman":["8世紀に成立・後世継承","形成于8世纪并延续至后世"],
  "style-gongen":["16世紀末〜17世紀前半に成立","形成于16世纪末至17世纪前半"],
};
const make=(id:string,ja:string,zh:string,summary:[string,string],background:[string,string],structure:[string,string][],space:[string,string][],clues:[string,string][],keywords:[string,string][],buildings:string[],compare:string[]):StyleLearningCard=>({
  id,kind:"style",name:l(ja,zh,ENGLISH_BY_ID[id]?.name),aliases:[],period:l(PERIOD_BY_ID[id]?.[0] ?? "時期未設定",PERIOD_BY_ID[id]?.[1] ?? "时期未设置",ENGLISH_BY_ID[id]?.period),regions:["japan"],summary:l(summary[0],summary[1],ENGLISH_BY_ID[id]?.summary),formationBackground:l(background[0],background[1],ENGLISH_BY_ID[id]?.formationBackground),
  structuralFeatures:structure.map((x,index)=>l(x[0],x[1],ENGLISH_BY_ID[id]?.structuralFeatures[index])),spatialFeatures:space.map((x,index)=>l(x[0],x[1],ENGLISH_BY_ID[id]?.spatialFeatures[index])),visualClues:clues.map((x,index)=>l(x[0],x[1],ENGLISH_BY_ID[id]?.visualClues[index])),keywords:keywords.map((x,index)=>l(x[0],x[1],ENGLISH_BY_ID[id]?.keywords[index])),
  relatedBuildingIds:buildings,relatedPersonIds:[],relatedCardIds:compare,comparisonCardIds:compare,predecessorCardIds:[],successorCardIds:[],examEvidence:[],reviewStatus:"draft",
});
export const SHRINE_STYLE_CARDS:StyleLearningCard[]=[
  make("style-shinmei","神明造","神明造",["穀倉的な高床・切妻・平入を基礎とし、簡素な直線構成を保つ神社本殿形式。","以谷仓式高床、切妻和平入为基础，保持简洁直线构成的神社本殿形式。"],["伊勢神宮の祭祀と式年遷宮によって古式が反復継承された。","伊势神宫祭祀与式年迁宫使古式反复传承。"],[["掘立柱、高床、切妻造・平入。","掘立柱、高床、切妻造与平入。"],["棟持柱が棟を直接支える。","栋持柱直接支撑屋脊。"]],[["正面中央から一室の内陣へ入る単純構成。","由正面中央进入单室内陣的简洁构成。"]],[["千木・鰹木、直線的な萱葺屋根、素木。","千木、鲣木、直线茅葺屋顶与素木。"]],[["平入","平入"],["棟持柱","栋持柱"]],["building-ise-jingu"],["style-taisha","style-kasuga","style-nagare"]),
  make("style-taisha","大社造","大社造",["古代住居・宮殿を思わせる高床、切妻、妻入の神社本殿形式。","具有古代住宅、宫殿意象的高床切妻妻入神社本殿形式。"],["出雲信仰と大国主神の祭祀を背景に、垂直性の強い独自形式として継承された。","以出云信仰和大国主神祭祀为背景，作为强调垂直性的独特形式延续。"],[["切妻造・妻入、高床、中央の心御柱。","切妻造、妻入、高床及中央心御柱。"],["入口階段を正面または側方に設ける。","入口台阶设于正面或侧方。"]],[["内部を中心柱と壁で分節し、神座を奥に置く。","内部以中心柱和墙分隔，神座置于深处。"]],[["妻側正面、急な階段、千木・鰹木。","山墙侧正面、陡峭台阶与千木鲣木。"]],[["妻入","妻入"],["心御柱","心御柱"]],["building-izumo-taisha"],["style-shinmei","style-sumiyoshi"]),
  make("style-kasuga","春日造","春日造",["小規模な切妻妻入本殿の正面に庇を付け、優美な曲線をつくる形式。","在小型切妻妻入本殿正面加设庇，形成优美曲线的形式。"],["春日大社の祭祀と社殿造替を通じて成立し、奈良を中心に広まった。","通过春日大社祭祀与社殿造替形成，并以奈良为中心传播。"],[["切妻造・妻入、正面一間に庇。","切妻造、妻入，正面一间设庇。"],["身舎と庇を小規模な木造架構で構成。","身舍与庇采用小型木构架。"]],[["階段上の庇が参拝前面をつくる。","台阶上方的庇形成参拜前场。"]],[["反りのある妻入屋根、正面庇、朱塗。","起翘妻入屋顶、正面庇与朱漆。"]],[["妻入","妻入"],["正面庇","正面庇"]],["building-kasuga-taisha"],["style-nagare","style-shinmei"]),
  make("style-nagare","流造","流造",["切妻平入屋根の前流れを長く延ばし、正面庇と参拝空間を一体化した最も普及した本殿形式。","将切妻平入屋顶前坡延长，使正面庇与参拜空间一体化的最普及本殿形式。"],["平入本殿に礼拝前面を付加する過程で成立し、全国の神社へ広く普及した。","在平入本殿增设礼拜前场的过程中形成，并广泛传播至全国神社。"],[["切妻造・平入、前面屋根を長く流す。","切妻造、平入，前坡屋面延长。"],["正面柱間数により一間社・三間社流造などに分かれる。","按正面柱间数分为一间社、三间社流造等。"]],[["深い前庇が参拝者と本殿の間を媒介。","深前庇连接参拜者与本殿。"]],[["非対称な屋根断面、長い前流れ、平入。","非对称屋顶剖面、长前坡与平入。"]],[["前流れ","前坡延伸"],["平入","平入"]],["building-ujigami-jinja","building-kamigamo-jinja"],["style-kasuga","style-shinmei"]),
  make("style-hachiman","八幡造","八幡造",["前後二棟の切妻平入社殿を連結し、内殿と外殿を一体化する複合本殿形式。","连接前后两栋切妻平入社殿，使内殿与外殿一体化的复合本殿形式。"],["八幡信仰の礼拝・祭祀に対応し、宇佐神宮などで独自に発達した。","为适应八幡信仰的礼拜与祭祀，在宇佐神宫等地独自发展。"],[["前後二棟を相の間で連結。","前后两栋通过相之间连接。"],["二つの屋根の谷に樋を設ける。","两屋顶谷部设置排水沟。"]],[["外殿と内殿が昼夜の神座など異なる役割を担う。","外殿与内殿承担昼夜神座等不同功能。"]],[["平行する二棟、中央の屋根谷、長い側面。","两栋平行建筑、中央屋谷与狭长侧面。"]],[["前後二殿","前后两殿"],["相の間","相之间"]],["building-usa-jingu","building-iwashimizu-hachimangu"],["style-gongen","style-nagare"]),
  make("style-gongen","権現造","权现造",["本殿と拝殿を石の間などの低い中間部で連結し、一体の複合社殿とする近世神社建築形式。","以石之间等较低中间部连接本殿与拜殿，形成一体化复合社殿的近世神社建筑形式。"],["近世の東照宮や霊廟建築で発達し、日光東照宮が代表例。名称は徳川家康の神号「東照大権現」に由来する。","发展于近世东照宫和灵庙建筑，以日光东照宫为代表，名称源于德川家康神号东照大权现。"],[["本殿・石の間・拝殿を、床高と屋根高の異なる棟として接続する。","连接地面与屋顶高度不同的本殿、石之间和拜殿。"]],[["拝殿から中間部を介して本殿へ軸線的に接続する。","从拜殿经中间部沿轴线连接本殿。"]],[["前後の高い屋根の間に低い屋根が挟まる複合的シルエット。","前后高屋顶之间夹有低屋顶的复合轮廓。"]],[["石の間","石之间"],["東照宮","东照宫"]],["building-nikko-toshogu"],["style-hachiman","style-momoyama"]),
];
