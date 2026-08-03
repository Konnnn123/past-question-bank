import type { BuildingTypeLearningCard, StyleLearningCard } from "@/types/history-learning-card";

const l = (ja: string, zh: string, en?: string) => ({ ja, zh, ...(en ? { en } : {}) });

// ── 掘立柱建物（建築類型） ──
const typeHottateBashira: BuildingTypeLearningCard = {
  id: "type-hottate-bashira",
  kind: "building-type",
  name: l("掘立柱建物", "掘立柱建筑","Post-in-ground building"),
  aliases: ["掘立柱", "ほったてばしら建物"],
  period: l("弥生〜古墳時代", "弥生至古坟时代","Yayoi to Kofun periods"),
  regions: ["japan"],
  summary: l(
    "地面に直接柱を掘り立てて建てる、日本先史・古代の基本的な建築構法。",
    "将柱子直接埋入地面而建造的日本史前及古代基本建筑构造。"
  ,"A fundamental construction method of prehistoric and ancient Japan in which posts are set directly into the ground."),
  functionalPurpose: l(
    "高床倉庫、住居、祭祀建築など多目的に用いられた日本在来の軸組構法。",
    "作为高床仓库、住宅和祭祀建筑等多用途的日本传统框架构造。"
  ,"A native Japanese post-and-beam method used for raised-floor granaries, dwellings, ritual buildings, and other purposes."),
  structuralFeatures: [
    l("柱を礎石なしで地面に掘り込み、土で固めて固定する。", "柱子无础石直接埋入地面，以土夯实固定。","Posts are excavated directly into the ground without foundation stones and fixed by compacted earth."),
    l("地面に接する柱脚が腐りやすく、建て替え周期が短い。", "柱脚接触地面易腐朽，重建周期短。","Because the post bases contact the ground, they decay readily and require relatively frequent rebuilding."),
    l("梁・桁・垂木で上部架構を構成し、草葺または板葺屋根をかける。", "以梁、桁、椽构成上部构架，覆以草葺或板葺屋顶。","Beams, purlins, and rafters form the upper frame, covered with thatch or board roofing."),
  ],
  spatialFeatures: [
    l("平面は長方形を基本とし、梁間一間〜二間、桁行数間に及ぶ。", "平面基本为长方形，梁跨一间至两间，桁行数间不等。","Plans are basically rectangular, ranging from one to two bays in depth and several bays in length."),
    l("高床式では床を地上から上げて通風・防湿を確保する。", "高床式将地板架空以保证通风防湿。","In raised-floor examples, the floor is elevated to secure ventilation and moisture protection."),
  ],
  evolution: [
    l("弥生時代に水稲農耕とともに普及し、集落の主要建物となる。", "弥生时代随水稻农耕普及，成为聚落主要建筑物。","It became widespread with wet-rice cultivation in the Yayoi period and formed the principal buildings of settlements."),
    l("飛鳥・奈良時代以降、大陸由来の礎石建物に徐々に置き換わる。", "飞鸟奈良时代以后逐渐被大陆传入的础石建筑取代。","From the Asuka and Nara periods onward, it was progressively superseded by continental-derived buildings with foundation stones."),
    l("中世以降も簡易な倉庫等に形式が残存する。", "中世纪以后简易仓库等仍保留该形式。","The form survived in simple structures such as granaries after the medieval period."),
  ],
  comparisonCardIds: ["type-pit-dwelling", "type-moated-settlement"],
  keywords: [l("掘立柱", "掘立柱","Post-in-ground"), l("高床倉庫", "高床仓库","Raised-floor granary"), l("弥生集落", "弥生聚落","Yayoi settlement")],
  relatedBuildingIds: ["building-28264369db88"],
  relatedPersonIds: [],
  relatedCardIds: ["type-pit-dwelling", "type-moated-settlement"],
  examEvidence: [],
  reviewStatus: "draft",
};

// ── 産業革命期の鉄とガラス建築（様式） ──
const styleIndustrialIronGlass: StyleLearningCard = {
  id: "style-industrial-iron-glass",
  kind: "style",
  name: l("産業革命期の鉄とガラス建築", "工业革命时期铁与玻璃建筑","Iron and glass architecture of the Industrial Revolution"),
  aliases: ["鉄骨ガラス建築", "鉄骨建築", "鉄橋", "Iron and Glass Architecture"],
  period: l("18世紀後半〜19世紀", "18世纪后半至19世纪","Late 18th to 19th centuries"),
  regions: ["western", "global"],
  summary: l(
    "産業革命による鋳鉄・錬鉄・ガラスの大量生産を背景に、新構法と大空間を実現した建築・土木技術。",
    "以工业革命带来的铸铁、锻铁和玻璃大规模生产为背景，实现新构造与大空间的建筑与土木工程技术。"
  ,"Architectural and civil-engineering technology that used the mass production of cast iron, wrought iron, and glass during the Industrial Revolution to create new structural systems and large spans."),
  formationBackground: l(
    "製鉄技術の進歩による鉄材の低廉化、板ガラス製造技術の確立、鉄道・博覧会・都市施設の需要増大が背景。",
    "制铁技术进步降低铁材成本、平板玻璃制造技术确立、铁路、博览会和城市设施需求增大为其背景。"
  ,"It arose from cheaper iron made possible by advances in ironmaking, the establishment of plate-glass production, and growing demand from railways, exhibitions, and urban facilities."),
  structuralFeatures: [
    l("鋳鉄・錬鉄の柱梁による骨組み構造で、従来の石造・木造を超える大スパンを実現。", "以铸铁、锻铁柱梁构成框架结构，实现超越传统石造木造的大跨度。","A skeletal system of cast-iron and wrought-iron columns and beams achieves spans beyond conventional masonry and timber construction."),
    l("鉄骨フレームとガラス面の組み合わせで、内部に大量の自然光を導入。", "铁骨架与玻璃面组合引入大量自然光。","Iron frames combined with glazed surfaces admit abundant daylight."),
    l("部材の工場プレファブリケーションと現場組立による短期施工。", "构件工厂预制与现场组装实现短期施工。","Factory prefabrication of components and on-site assembly enabled rapid construction."),
  ],
  spatialFeatures: [
    l("柱の間隔を広げ、柱のない広大な内部空間を実現。", "扩大柱间距，实现无柱的广阔内部空间。","Wider column spacing created vast, unobstructed interiors."),
    l("ガラスによる透明な外皮が内外の視覚的連続性を生む。", "玻璃透明外皮产生内外的视觉连续性。","A transparent glass envelope produces visual continuity between interior and exterior."),
  ],
  visualClues: [
    l("鉄骨の骨組みが外部に表れ、軽快で透明感のある外観。", "铁骨架外露，轻盈且具透明感的外观。","Exposed iron framing gives a light, transparent appearance."),
    l("アーチやドームなど歴史的形態を鉄で再解釈。", "以铁材重新诠释拱券、穹顶等历史形态。","Historical forms such as arches and domes were reinterpreted in iron."),
  ],
  keywords: [l("鋳鉄", "铸铁","Cast iron"), l("錬鉄", "锻铁","Wrought iron"), l("クリスタル・パレス", "水晶宫","Crystal Palace")],
  relatedBuildingIds: ["building-b7685f6d8bea", "building-a2ebd9afe093", "building-f09e9fd36d8e"],
  relatedPersonIds: [],
  relatedCardIds: ["style-neoclassical", "style-historicism", "movement-art-nouveau"],
  comparisonCardIds: ["style-neoclassical", "style-historicism"],
  predecessorCardIds: ["style-neoclassical"],
  successorCardIds: ["movement-art-nouveau", "movement-modernism"],
  examEvidence: [],
  reviewStatus: "draft",
};

// ── クイーン・アン様式 ──
const styleQueenAnne: StyleLearningCard = {
  id: "style-queen-anne",
  kind: "style",
  name: l("クイーン・アン様式", "安妮女王式","Queen Anne style"),
  aliases: ["Queen Anne style", "Queen Anne Revival"],
  period: l("19世紀後半", "19世纪后半","Late 19th century"),
  regions: ["western"],
  summary: l(
    "イギリスを中心に発展した非対称な住宅様式で、多様な材料、張出し窓、装飾的煉瓦積みを特徴とする。",
    "以英国为中心发展，以非对称立面、多样材料、凸窗和装饰性砖砌为特征的住宅样式。"
  ,"An asymmetrical domestic style developed chiefly in Britain, characterized by varied materials, bay windows, and decorative brickwork."),
  formationBackground: l(
    "アーツ・アンド・クラフツ運動、イギリス田園建築の再評価、中産階級郊外住宅の発展を背景に成立。",
    "以工艺美术运动、英国田园建筑再评价和中产阶级郊区住宅发展为背景而成立。"
  ,"It emerged from the Arts and Crafts movement, the reappraisal of English vernacular architecture, and the growth of middle-class suburban housing."),
  structuralFeatures: [
    l("煉瓦・テラコッタ・木のハーフティンバー等の多様な材料を併用。", "并用砖、陶瓦、木材半露明木架等多种材料。","Brick, terracotta, and timber half-timbering are used in combination."),
    l("非対称の平面と複雑な屋根形状（切妻・ドーマー・タレット）。", "非对称平面与复杂屋顶形状（山墙、老虎窗、角塔）。","Asymmetrical plans and complex roof forms with gables, dormers, and turrets."),
  ],
  spatialFeatures: [
    l("張出し窓（ベイウィンドウ）が室内に光と空間的広がりをもたらす。", "凸窗（bay window）为室内带来光线与空间延展。","Bay windows bring light and a sense of spatial expansion to interiors."),
    l("ホールを中心に各室を非対称に配置し、絵画的で親密な内部景観をつくる。", "以门厅为中心非对称布置各室，创造如画且亲密的室内景观。","Rooms are arranged asymmetrically around a hall, creating a picturesque and intimate interior."),
  ],
  visualClues: [
    l("非対称で絵画的なシルエット。", "非对称且如画般的轮廓。","An asymmetrical, picturesque silhouette."),
    l("白塗り木造の張出し窓、装飾煉瓦、タレット。", "白漆木凸窗、装饰砖和角塔。","White-painted timber bay windows, decorative brickwork, and turrets."),
    l("高い煙突と複雑な屋根形状。", "高烟囱与复杂屋顶形状。","Tall chimneys and complex roof forms."),
  ],
  keywords: [l("リチャード・ノーマン・ショウ", "Richard Norman Shaw","Richard Norman Shaw"), l("ベイウィンドウ", "凸窗","Bay window")],
  relatedBuildingIds: ["building-84cc5aacdcd7"],
  relatedPersonIds: [],
  relatedCardIds: ["movement-arts-crafts", "style-historicism", "movement-art-nouveau"],
  comparisonCardIds: ["style-historicism", "movement-arts-crafts"],
  predecessorCardIds: ["style-historicism"],
  successorCardIds: ["movement-art-nouveau"],
  examEvidence: [],
  reviewStatus: "draft",
};

// ── 龍宮門（様式） ──
const styleRyuguMon: StyleLearningCard = {
  id: "style-ryugu-mon",
  kind: "style",
  name: l("龍宮門", "龙宫门","Rykgkmon gate"),
  aliases: ["龍宮門様式", "りゅうぐうもん"],
  period: l("江戸時代前期", "江户时代前期","Early Edo period"),
  regions: ["japan"],
  summary: l(
    "黄檗宗寺院の三門に見られる、中国明代建築の影響を強く受けた竜宮造りの楼門形式。",
    "见于黄檗宗寺院三门、深受中国明代建筑影响的龙宫造楼门形式。"
  ,"A two-storey temple gate of the Rykgk-zukuri type, found at the sanmon gates of Lbaku Zen temples and strongly influenced by Ming-dynasty Chinese architecture."),
  formationBackground: l(
    "隠元隆琦らがもたらした明代中国の寺院建築が、長崎の崇福寺などを通じて日本に導入された。",
    "隐元隆琦等传来的明代中国寺院建筑，经长崎崇福寺等传入日本。"
  ,"Ming Chinese temple architecture introduced by Yinyuan Longqi and others entered Japan through temples such as Sofuku-ji in Nagasaki."),
  structuralFeatures: [
    l("三間一戸の楼門形式で、上層に唐様の組物と軒反りをもつ。", "三间一户的楼门形式，上层具唐样斗栱与反曲屋檐。","A three-bay, one-opening two-storey gate with Chinese-style bracket complexes and upturned eaves on the upper storey."),
    l("下層中央を通路とし、左右に金剛力士像を安置する。", "下层中央为通道，左右安置金刚力士像。","The centre of the lower storey forms a passage, flanked by NiM guardian statues."),
  ],
  spatialFeatures: [
    l("中国風の曲線的な屋根と日本的木造軸組を融合させる。", "融合中国式曲线屋顶与日本木造框架结构。","It fuses a Chinese-style curving roof with Japanese timber post-and-beam construction."),
    l("楼門として垂直方向のランドマーク性をもつ。", "作为楼门具有垂直方向的地标性。","As a two-storey gate, it acts as a vertical landmark."),
  ],
  visualClues: [
    l("反りの強い曲線屋根と唐破風。", "强烈反曲的曲线屋顶与唐破风。","Strongly upturned curving roofs and karahafu gables."),
    l("中国風の組物、彫刻装飾、朱塗りの柱。", "中国式斗栱、雕刻装饰与朱漆柱。","Chinese-style bracket complexes, carved ornament, and vermilion-painted posts."),
  ],
  keywords: [l("黄檗宗", "黄檗宗","Lbaku Zen"), l("崇福寺", "崇福寺","Sofuku-ji"), l("隠元隆琦", "隐元隆琦","Yinyuan Longqi")],
  relatedBuildingIds: ["building-e66d6c36d41d"],
  relatedPersonIds: [],
  relatedCardIds: ["style-zenshuyo", "style-asuka"],
  comparisonCardIds: ["style-zenshuyo", "style-asuka"],
  predecessorCardIds: [],
  successorCardIds: [],
  examEvidence: [],
  reviewStatus: "draft",
};

// ── 和洋折衷建築（様式） ──
const styleWayoSecchu: StyleLearningCard = {
  id: "style-wayo-secchu",
  kind: "style",
  name: l("和洋折衷建築", "和洋折衷建筑","Japanese-Western eclectic architecture"),
  aliases: ["和洋折衷", "和洋折衷様式"],
  period: l("明治時代", "明治时代","Meiji period"),
  regions: ["japan"],
  summary: l(
    "明治期に日本の伝統的木造技術と西洋の建築様式・材料を折衷した独特の建築。",
    "明治时期融合日本传统木造技术与西洋建筑样式、材料的独特建筑。"
  ,"A distinctive Meiji-period architecture combining traditional Japanese timber techniques with Western architectural styles and materials."),
  formationBackground: l(
    "開国後の居留地建設と西洋人技術者の来日、および日本人による西洋建築受容の初期段階として生まれた。",
    "作为开国后居留地建设、西洋技术人员来日、以及日本人接受西洋建筑初期阶段的产物。"
  ,"It emerged in the early stage of Japan's reception of Western architecture, after the opening of the country, settlement construction, and the arrival of Western engineers."),
  structuralFeatures: [
    l("日本の伝統的木造軸組に、西洋の煉瓦壁やベランダを組み合わせる。", "日本传统木造框架组合西洋砖墙和阳台。","Traditional Japanese timber framing combined with Western brick walls and verandas."),
    l("瓦葺き屋根と洋風の外観を併存させる。", "和瓦屋顶与洋式外观并存。","Japanese tile roofs coexist with Western-style exteriors."),
  ],
  spatialFeatures: [
    l("畳室と椅子式洋室が一棟に共存する。", "和式榻榻米室与洋式座椅室共存于同一建筑。","Tatami rooms and chair-based Western rooms coexist within one building."),
    l("ベランダ・テラスなど半屋外空間を介した内外の接続。", "通过阳台、露台等半室外空间连接内外。","Verandas and terraces form semi-outdoor connections between inside and outside."),
  ],
  visualClues: [
    l("和瓦屋根＋洋式下見板・煉瓦壁＋ベランダの組み合わせ。", "和瓦屋顶+洋式护墙板/砖墙+阳台的组合。","A combination of Japanese tile roofs, Western weatherboard or brick walls, and verandas."),
    l("伝統木製建具と西洋式上げ下げ窓が混在する。", "传统木制门窗与西式上下推拉窗并存。","Traditional wooden fittings mixed with Western double-hung sash windows."),
  ],
  keywords: [l("グラバー邸", "Glover House","Glover House"), l("居留地", "居留地","Foreign settlement"), l("擬洋風", "拟洋风","Pseudo-Western style")],
  relatedBuildingIds: ["building-553af9aa7607"],
  relatedPersonIds: [],
  relatedCardIds: ["style-giyofu", "style-historicism", "style-colonial"],
  comparisonCardIds: ["style-giyofu", "style-historicism"],
  predecessorCardIds: [],
  successorCardIds: ["style-giyofu"],
  examEvidence: [],
  reviewStatus: "draft",
};

// ── 割拝殿（神社建築形式） ──
const styleWariHaiden: StyleLearningCard = {
  id: "style-wari-haiden",
  kind: "style",
  name: l("割拝殿", "割拜殿","Divided worship hall"),
  aliases: ["わりはいでん"],
  period: l("鎌倉時代以降", "镰仓时代以后","From the Kamakura period onward"),
  regions: ["japan"],
  summary: l(
    "拝殿の中央一間を通路として開放し、左右に分かれた室を設ける独特の神社拝殿形式。",
    "将拜殿中央一间开放为通道、左右分设房间的独特神社拜殿形式。"
  ,"A distinctive shrine worship-hall type in which the central bay is left open as a passage, with enclosed spaces on either side."),
  formationBackground: l(
    "神事における祭礼行列の通過や、神さまの通り道としての機能から、中央間を吹き放ちとした実用的・象徴的な形式として成立した。",
    "因祭礼行列通过和神灵通道的功能需要，将中央间敞开而形成的兼具实用性与象征性的形式。"
  ,"It developed as a practical and symbolic form: the open central bay accommodates festival processions and serves as a passage for the deity."),
  structuralFeatures: [
    l("桁行三間以上、中央一間を通路として開放する。", "桁行三间以上，中央一间开放为通道。","Three or more bays across, with the central bay left open as a passage."),
    l("左右の室は床を張り、神事・参拝の場とする。", "左右室铺设地板，用作祭祀与参拜场所。","The rooms to either side are floored and used for rites and worship."),
  ],
  spatialFeatures: [
    l("中央通路が内外を貫き、拝殿の前後を視覚的・動線的に接続する。", "中央通路贯穿内外，在视觉和动线上连接拜殿前后。","The central passage runs through the building, visually and physically connecting the front and rear of the worship hall."),
    l("左右対称の空間構成により、中央の空虚が象徴的中心となる。", "左右对称的空间构成使中央的空无成为象征性中心。","A symmetrical composition makes the central void the symbolic focus."),
  ],
  visualClues: [
    l("中央一間が吹き放ちとなった左右対称の拝殿ファサード。", "中央一间敞开、左右对称的拜殿立面。","A symmetrical worship-hall fa�ade with the central bay open through."),
    l("切妻または入母屋の屋根が連続し、中央部で分断される独特のシルエット。", "悬山或歇山屋顶连续而在中央断开的独特轮廓。","A distinctive silhouette in which a gabled or hip-and-gable roof is continuous but divided at the centre."),
  ],
  keywords: [l("拝殿", "拜殿","Worship hall"), l("割拝殿", "割拜殿","Divided worship hall"), l("石上神社", "石上神社","Isonokami Shrine")],
  relatedBuildingIds: ["building-f0cdf0370b19"],
  relatedPersonIds: [],
  relatedCardIds: ["style-nagare", "style-kasuga", "style-shinmei"],
  comparisonCardIds: ["style-nagare", "style-kasuga"],
  predecessorCardIds: [],
  successorCardIds: [],
  examEvidence: [],
  reviewStatus: "draft",
};

// ── 入蜻蛉造（神社屋根形式） ──
const styleIriTonboZukuri: StyleLearningCard = {
  id: "style-iri-tonbo-zukuri",
  kind: "style",
  name: l("入蜻蛉造", "入蜻蛉造","Iri-tonbo-zukuri"),
  aliases: ["入蜻蛉造り", "いりとんぼづくり"],
  period: l("古代〜中世", "古代至中世","Ancient to medieval periods"),
  regions: ["japan"],
  summary: l(
    "本殿・幣殿・拝殿・左右の翼殿を十字形に接続し、上空から蜻蛉が本殿へ飛び込む姿に見立てた土佐神社独特の社殿構成。",
    "将本殿、币殿、拜殿及左右翼殿连接成十字形，从上方看如蜻蜓飞向本殿，是土佐神社独特的社殿组合。"
  ,"A distinctive shrine composition at Tosa Shrine, in which the main sanctuary, offering hall, worship hall, and side wings are linked in a cross-like plan resembling a dragonfly flying into the sanctuary when seen from above."),
  formationBackground: l(
    "土佐神社の現社殿は長宗我部元親により1570年に再建された。本殿から拝殿へ延びる中軸と左右翼殿を組み合わせた平面全体を「入蜻蛉」と呼ぶ。一般的な神社屋根形式の名称ではない。",
    "土佐神社现存社殿由长宗我部元亲于1570年重建。由本殿通向拜殿的中轴与左右翼殿组合成的整体平面称为“入蜻蛉”，它不是一般性的神社屋顶形式。"
  ,"The present Tosa Shrine buildings were rebuilt in 1570 by Chosokabe Motochika. The term describes the whole plan formed by the main axis from sanctuary to worship hall and the transverse side wings; it is not a general shrine-roof type."),
  structuralFeatures: [
    l("本殿は入母屋造で、その前方に幣殿・拝殿を軸線上に接続する。", "本殿采用歇山顶，前方沿轴线连接币殿与拜殿。","The main sanctuary has a hip-and-gable roof, with the offering hall and worship hall connected in front on the principal axis."),
    l("拝殿左右に翼殿を張り出し、社殿群全体を十字形に構成する。", "拜殿左右伸出翼殿，使社殿群整体形成十字形。","Side wings project from either side of the worship hall, forming a cross-shaped shrine complex."),
  ],
  spatialFeatures: [
    l("本殿から拝殿まで祭祀動線を連続させ、左右の翼殿を直交させる。", "祭祀动线从本殿连续至拜殿，左右翼殿与其正交。","The ritual route continues from the main sanctuary to the worship hall, while the side wings intersect it at right angles."),
    l("単一建物の内部ではなく、複数社殿の配置関係を示す呼称である。", "该名称描述的是多座社殿的配置关系，而非单体建筑内部。","The term describes the arrangement of several shrine buildings, not the interior of a single building."),
  ],
  visualClues: [
    l("上空から見た十字形平面と、拝殿左右へ延びる翼殿。", "从上方可识别十字形平面及拜殿左右伸出的翼殿。","A cross-shaped plan seen from above, with wings extending to either side of the worship hall."),
    l("屋根一枚の形ではなく、本殿へ飛び込む蜻蛉に見立てた全体配置が識別点。", "识别重点不是单片屋顶，而是整体配置如蜻蜓飞向本殿。","The identifying feature is the overall arrangement likened to a dragonfly flying into the sanctuary, not the form of a single roof."),
  ],
  keywords: [l("土佐神社", "土佐神社","Tosa Shrine"), l("蜻蛉", "蜻蛉","Dragonfly"), l("切妻", "悬山","Gabled roof")],
  relatedBuildingIds: ["building-4be3b9942263"],
  relatedPersonIds: [],
  relatedCardIds: ["style-nagare", "style-kasuga", "style-taisha"],
  comparisonCardIds: ["style-nagare", "style-taisha"],
  predecessorCardIds: [],
  successorCardIds: [],
  examEvidence: [],
  reviewStatus: "draft",
};

// ── 比翼入母屋造（神社屋根形式） ──
const styleHiyokuIrimoyaZukuri: StyleLearningCard = {
  id: "style-hiyoku-irimoya-zukuri",
  kind: "style",
  name: l("比翼入母屋造", "比翼入母屋造","Hiyoku-irimoya-zukuri"),
  aliases: ["比翼入母屋造り", "ひよくいりもやづくり"],
  period: l("室町時代", "室町时代","Muromachi period"),
  regions: ["japan"],
  summary: l(
    "二つの入母屋屋根を前後に並べて一体化した、日本神社建築で最大級の屋根形式。吉備津神社本殿が唯一の完存例。",
    "将两个歇山屋顶前后并列一体化，日本神社建筑中最大级别的屋顶形式。吉备津神社本殿为唯一完整遗存实例。"
  ,"One of the largest roof types in Japanese shrine architecture, formed by integrating two hip-and-gable roofs arranged front to back; the main sanctuary of Kibitsu Shrine is its sole complete surviving example."),
  formationBackground: l(
    "大規模な本殿内部空間を単一の大屋根で覆うのではなく、二つの入母屋を並置することで構造的合理性と記念碑性を両立させた形式。",
    "不采用单一大屋顶覆盖大规模本殿内部空间，而通过两个歇山屋顶的并置，兼顾结构合理性与纪念性。"
  ,"Rather than covering a large sanctuary interior with one enormous roof, the form places two hip-and-gable roofs side by side to combine structural rationality with monumentality."),
  structuralFeatures: [
    l("前後二つの入母屋屋根を棟で連結し、巨大な一体空間を覆う。", "前后两个歇山屋顶以脊相连，覆盖巨大的一体空间。","Two front-to-back hip-and-gable roofs are joined at their ridges to cover one vast unified space."),
    l("各入母屋は独立した小屋組をもち、連結部に構造的工夫を要する。", "各歇山具有独立的屋架结构，连接处需要结构巧思。","Each hip-and-gable roof has its own roof framing, requiring structural ingenuity at the junction."),
  ],
  spatialFeatures: [
    l("前殿・後殿の二室構成を屋根形状がそのまま外部に表現する。", "前殿、后殿的双室构成通过屋顶形状直接表达于外部。","The two-room composition of front and rear sanctuaries is directly expressed by the roof form."),
    l("二重の屋根による内部空間の分節と統合。", "通过双重屋顶实现内部空间的分节与整合。","A double roof both subdivides and unifies the interior."),
  ],
  visualClues: [
    l("前後に連なる二つの入母屋がつくる、巨大で複雑な重層的シルエット。", "前后相连的两个歇山屋顶构成的巨大且复杂的重层轮廓。","The two connected hip-and-gable roofs produce a huge, complex, layered silhouette."),
    l("側面から見ると、「比翼＝二つの翼」のように屋根が重なり合う。", "从侧面看，屋顶如比翼双翅般重叠交错。","From the side, the overlapping roofs resemble paired wings."),
  ],
  keywords: [l("吉備津神社", "吉备津神社","Kibitsu Shrine"), l("比翼", "比翼","Paired wings"), l("入母屋", "歇山","Hip-and-gable roof")],
  relatedBuildingIds: ["building-1dcab5a3e0d9"],
  relatedPersonIds: [],
  relatedCardIds: ["style-nagare", "style-taisha", "style-hachiman"],
  comparisonCardIds: ["style-nagare", "style-taisha"],
  predecessorCardIds: [],
  successorCardIds: [],
  examEvidence: [],
  reviewStatus: "draft",
};

// ── 折衷様（日本仏教建築） ──
const styleSetchuyo: StyleLearningCard = {
  id: "style-setchuyo",
  kind: "style",
  name: l("折衷様", "折衷样","Eclectic style"),
  aliases: ["せっちゅうよう", "和様折衷"],
  period: l("鎌倉時代中期以降", "镰仓时代中期以后","From the mid-Kamakura period onward"),
  regions: ["japan"],
  summary: l(
    "和様・大仏様・禅宗様の三様式を一つの建築に融合させた、日本中世仏教建築の折衷様式。",
    "将和样、大佛样、禅宗样三种样式融合于同一建筑中的日本中世佛教建筑折衷样式。"
  ,"An eclectic style of medieval Japanese Buddhist architecture that combines Wayo, Daibutsuyo, and Zenshuyo within one building."),
  formationBackground: l(
    "鎌倉中期以降、宋から新様式（大仏様・禅宗様）が伝来した後、在来の和様と新様式を状況に応じて選択・併用する中で自然に成立した。",
    "镰仓中期以后，宋代新样式（大佛样、禅宗样）传入，在实际建设中根据情况选择并用传统和样与新样式，自然形成了折衷样式。"
  ,"After new styles from Song China, Daibutsuyo and Zenshuyo, arrived from the mid-Kamakura period onward, it emerged naturally through selective combinations of those styles with the indigenous Wayo tradition."),
  structuralFeatures: [
    l("和様の疎組と長押、禅宗様の詰組と扇垂木、大仏様の貫と挿肘木を部分的に併用する。", "部分并用和样的疏组与长押、禅宗样的诘组与扇椽、大佛样的贯与插肘木。","Wayo sparse bracket sets and nageshi beams, Zenshuyo dense bracket sets and fanned rafters, and Daibutsuyo penetrating tie beams and inserted elbow brackets are used together in part."),
    l("全体の架構は和様を基調としつつ、細部に新様式の技法を取り入れる。", "整体结构以和样为基调，细部采用新样式技法。","The overall frame is based on Wayo, with new-style techniques introduced in the details."),
  ],
  spatialFeatures: [
    l("和様の水平性を基本としながら、禅宗様の垂直性や大仏様の構造的開放性を部分的に導入。", "以和样的水平性为基础，部分引入禅宗样的垂直性和大佛样的结构性开放性。","Wayo horizontality remains the basis, with selected incorporation of Zenshuyo verticality and Daibutsuyo structural openness."),
    l("内部空間に和様の天井と禅宗様の化粧屋根裏が共存する例が多い。", "内部空间常见和样吊顶与禅宗样露明屋架并存。","Wayo ceilings and Zenshuyo exposed roof framing often coexist in the interior."),
  ],
  visualClues: [
    l("一棟の建築に和様・大仏様・禅宗様の細部が混在する。", "同一建筑中和样、大佛样、禅宗样细部混在。","Details of Wayo, Daibutsuyo, and Zenshuyo appear together in a single building."),
    l("疎組（和様）の柱間にも詰組（禅宗様）が部分的に現れる。", "疏组（和样）的柱间部分出现诘组（禅宗样）。","Dense Zenshuyo bracket sets may appear among the sparse Wayo bracket bays."),
  ],
  keywords: [l("折衷様", "折衷样","Eclectic style"), l("和様", "和样","Wayo"), l("大仏様", "大佛样","Daibutsuyo"), l("禅宗様", "禅宗样","Zenshuyo")],
  relatedBuildingIds: [],
  relatedPersonIds: [],
  relatedCardIds: ["style-wayo", "style-daibutsuyo", "style-zenshuyo"],
  comparisonCardIds: ["style-wayo", "style-daibutsuyo", "style-zenshuyo"],
  predecessorCardIds: ["style-wayo", "style-daibutsuyo", "style-zenshuyo"],
  successorCardIds: [],
  examEvidence: [],
  reviewStatus: "draft",
};

// ── 黄檗建築（中国明朝様式） ──
const styleObaku: StyleLearningCard = {
  id: "style-obaku",
  kind: "style",
  name: l("黄檗建築", "黄檗建筑","Obaku architecture"),
  aliases: ["黄檗宗建築", "中国明朝様式", "おうばくけんちく"],
  period: l("江戸時代前期", "江户时代前期","Early Edo period"),
  regions: ["japan", "east-asian"],
  summary: l(
    "隠元隆琦らにより伝えられた中国明代後期の寺院建築様式で、長崎崇福寺・宇治萬福寺に代表される。",
    "由隐元隆琦等传入的中国明代后期寺院建筑样式，以长崎崇福寺和宇治万福寺为代表。"
  ,"A late-Ming Chinese temple architecture introduced by Yinyuan Longqi and others, represented by Sofuku-ji in Nagasaki and Manpuku-ji in Uji."),
  formationBackground: l(
    "明末清初の動乱を避けて来日した隠元隆琦ら中国僧が、長崎の唐寺を経て萬福寺を建立し、明代中国の伽藍配置・構法・意匠をそのまま日本に導入した。",
    "因明末清初动乱来日的隐元隆琦等中国僧人，经由长崎唐寺建立万福寺，将明代中国的伽蓝配置、构法与意匠原样引入日本。"
  ,"Chinese monks including Yinyuan Longqi, who came to Japan amid the late-Ming and early-Qing turmoil, established Manpuku-ji after the Chinese temples of Nagasaki and introduced Ming temple layouts, construction, and design directly into Japan."),
  structuralFeatures: [
    l("中国明代の大木架構（抬梁式）を用い、日本の在来軸組とは異なる構成をもつ。", "采用中国明代大木构架（抬梁式），具有与日本传统框架不同的构造体系。","It employs the large timber frame of Ming China, using the tailiang system, unlike the indigenous Japanese timber frame."),
    l("瓦葺きの反り返った大きな屋根と、中国風の細密な組物をもつ。", "具有瓦葺反曲大屋顶和中国式细密斗栱。","Large tiled roofs with upturned eaves and intricate Chinese-style bracket complexes."),
  ],
  spatialFeatures: [
    l("左右対称の厳格な伽藍配置で、軸線上に山門・天王殿・大雄宝殿・法堂を並べる。", "以严格左右对称的伽蓝配置，于轴线上排列山门、天王殿、大雄宝殿、法堂。","A strict symmetrical temple layout places the gate, Hall of Heavenly Kings, Mahavira Hall, and Dharma Hall along the main axis."),
    l("中国明代仏寺の大雄宝殿形式：高床、正面広い柱間、深い軒。", "中国明代佛寺的大雄宝殿形式：高台基、正面宽阔柱间、深远出檐。","The Ming Buddhist Daxiong Baodian type: raised platform, broad front bays, and deep eaves."),
  ],
  visualClues: [
    l("中国風の強い反り返り屋根、朱塗り円柱、精緻な斗栱と彫刻装飾。", "中国式强烈反曲屋顶、朱漆圆柱、精致斗栱与雕刻装饰。","Strongly upturned Chinese roofs, vermilion round columns, intricate bracket complexes, and carved ornament."),
    l("龍宮門や大雄宝殿など、和様・禅宗様とは異なる中国的荘厳さ。", "龙宫门和大雄宝殿等，具有与和样、禅宗样不同的中国式庄严感。","Ryugumon gates and Mahavira halls convey a Chinese monumentality unlike Wayo or Zenshuyo."),
  ],
  keywords: [l("隠元隆琦", "隐元隆琦","Yinyuan Longqi"), l("萬福寺", "万福寺","Manpuku-ji"), l("崇福寺", "崇福寺","Sofuku-ji"), l("黄檗宗", "黄檗宗","Obaku Zen")],
  relatedBuildingIds: ["building-e57f2f2374b2", "building-e66d6c36d41d"],
  relatedPersonIds: [],
  relatedCardIds: ["style-ryugu-mon", "style-zenshuyo", "style-asuka"],
  comparisonCardIds: ["style-zenshuyo", "style-asuka"],
  predecessorCardIds: [],
  successorCardIds: [],
  examEvidence: [],
  reviewStatus: "draft",
};

// ── 寺内町（都市・集落形式） ──
const typeJinaicho: BuildingTypeLearningCard = {
  id: "type-jinaicho",
  kind: "building-type",
  name: l("寺内町", "寺内町","Jinaicho temple town"),
  aliases: ["じないちょう", "寺内町"],
  period: l("戦国時代〜江戸初期", "战国时代至江户初期","Sengoku period to early Edo period"),
  regions: ["japan"],
  summary: l(
    "中世末期、浄土真宗（一向宗）寺院を中心に形成された環濠をもつ宗教的自治集落。",
    "中世末期以净土真宗（一向宗）寺院为中心形成的带环壕的宗教性自治聚落。"
  ,"A religiously autonomous, moated settlement formed around a Jodo Shinshu (Ikko) temple in the late medieval period."),
  functionalPurpose: l(
    "寺院を核とした防御・商業・居住の複合機能をもち、戦国期の自治都市として発展した。戦乱からの防衛と門徒の集住を目的とする。",
    "以寺院为核心兼具防御、商业、居住复合功能，作为战国时期自治城市发展。目的在于防御战乱和集中居住门徒。"
  ,"It combined defensive, commercial, and residential functions around a temple nucleus, developing as an autonomous town in the Sengoku period to protect adherents from warfare and concentrate their residence."),
  structuralFeatures: [
    l("周囲に濠（環濠）を巡らせ、限られた出入口（木戸）から出入りする防御構造。", "周围环绕壕沟，通过有限的出入口（木户）进出的防御结构。","A defensive structure of encircling moats with access through a limited number of gated entrances."),
    l("中心に寺院（道場）を置き、その周囲に門徒の町家を街区単位で整然と配置する。", "中心设寺院（道场），周围以街区为单位整齐配置门徒的町家。","A temple or dojo at the centre, surrounded by orderly blocks of machiya occupied by adherents."),
    l("道路は格子状または寺院を中心とした求心状のパターンをもつ。", "道路呈格子状或以寺院为中心的向心状布局。","Streets follow a grid or a radial pattern centred on the temple."),
  ],
  spatialFeatures: [
    l("寺院境内を中心とした求心的空間構成と、周囲の環濠に囲まれた閉鎖的計画。", "以寺院境内为中心的向心性空间构成与被环壕包围的封闭式规划。","A centripetal spatial composition focused on the temple precinct, enclosed by surrounding moats."),
    l("商業軸としての街路と、居住空間としての短冊形敷地の組合せ。", "作为商业轴的街道与作为居住空间的长条形宅基地的组合。","Commercial streets combine with narrow strip plots used for dwellings."),
  ],
  evolution: [
    l("戦国時代に一向宗（浄土真宗）の布教拠点として各地に形成された。", "战国时代作为一向宗（净土真宗）的传教据点在各地区形成。","It formed in many regions as a missionary base for the Ikko sect (Jodo Shinshu) during the Sengoku period."),
    l("江戸時代に入ると宗教的性格が薄れ、在郷町・陣屋町・宿場町へと転換した例が多い。", "进入江户时代后宗教特征淡化，多转为在乡町、阵屋町和宿场町。","In the Edo period its religious character often faded, and many examples became rural market towns, administrative towns, or post towns."),
    l("大阪（石山本願寺寺内町）は後の大坂城下町の原型となり、都市史的に重要。", "大阪（石山本愿寺寺内町）成为后来大坂城下町的原型，在城市史上极为重要。","The Ishiyama Hongan-ji jinaicho at Osaka became a prototype for the later castle town of Osaka and is important in urban history."),
  ],
  comparisonCardIds: ["type-machiya", "type-moated-settlement"],
  keywords: [l("寺内町", "寺内町","Jinaicho temple town"), l("環濠", "环壕","Encircling moat"), l("一向宗", "一向宗","Ikko sect"), l("自治都市", "自治城市","Autonomous town")],
  relatedBuildingIds: [],
  relatedPersonIds: [],
  relatedCardIds: ["type-machiya", "type-moated-settlement", "type-castle"],
  examEvidence: [],
  reviewStatus: "draft",
};

const styleIslamic: StyleLearningCard = {
  id: "style-islamic",
  kind: "style",
  name: l("イスラーム建築", "伊斯兰建筑","Islamic architecture"),
  aliases: ["Islamic architecture", "イスラム建築"],
  period: l("7世紀以降", "7世纪以后","From the 7th century onward"),
  regions: ["western", "global"],
  summary: l(
    "モスク、宮殿、庭園、都市施設において、幾何学・反復・光・水を組み合わせて発展した広域の建築文化。",
    "在清真寺、宫殿、庭园和城市设施中，通过几何、重复、光与水发展起来的广域建筑文化。"
  ,"A broad architectural culture developed across mosques, palaces, gardens, and urban institutions by combining geometry, repetition, light, and water."),
  formationBackground: l(
    "イスラームの拡大とともに、ビザンツ、ササン、地中海、中央アジアなどの技術・様式を地域ごとに継承・変容した。",
    "随伊斯兰世界扩展，因地制宜地继承并转化拜占庭、萨珊、地中海和中亚等地区的技术与样式。"
  ,"As Islam expanded, it adapted and transformed the techniques and styles of Byzantine, Sasanian, Mediterranean, and Central Asian traditions in different regions."),
  structuralFeatures: [
    l("アーチ、ヴォールト、ドームを組み合わせ、大きな礼拝・集会空間を覆う。", "组合拱券、拱顶与穹顶，覆盖大型礼拜和集会空间。","Arches, vaults, and domes combine to cover large prayer and assembly spaces."),
    l("柱廊、リブ、ムカルナスなどを反復し、構造と装飾を連続させる。", "重复使用柱廊、肋与钟乳体等，使结构与装饰连续。","Repeated colonnades, ribs, and muqarnas create continuity between structure and ornament."),
  ],
  spatialFeatures: [
    l("中庭、泉、水盤、日陰を介して礼拝空間と都市・気候をつなぐ。", "通过庭院、泉水、水池与阴影连接礼拜空间、城市和气候。","Courtyards, fountains, pools, and shade connect prayer spaces with the city and climate."),
    l("反復する柱列やアーチが、方向性と無方向性を併せもつ空間をつくる。", "重复的柱列和拱券营造同时具有方向性与无方向性的空间。","Repeated columns and arches create spaces that are at once directional and non-directional."),
  ],
  visualClues: [
    l("馬蹄形・尖頭・多弁形のアーチ、幾何学文様、書道装飾。", "马蹄形、尖拱、多瓣拱、几何纹样与书法装饰。","Horseshoe, pointed, and multifoil arches; geometric patterns; and calligraphic ornament."),
    l("タイル、漆喰、石材、木材を用いた細密な反復表現。", "以砖瓦、灰泥、石材和木材形成细密的重复表达。","Fine-grained repeated patterns in tile, stucco, stone, and timber."),
  ],
  keywords: [l("モスク", "清真寺","Mosque"), l("中庭", "庭院","Courtyard"), l("馬蹄形アーチ", "马蹄拱","Horseshoe arch")],
  relatedBuildingIds: ["building-core-mezquita"],
  relatedPersonIds: [],
  relatedCardIds: ["style-byzantine", "style-roman"],
  comparisonCardIds: ["style-byzantine", "style-roman"],
  predecessorCardIds: ["style-byzantine"],
  successorCardIds: [],
  examEvidence: [],
  reviewStatus: "draft",
};

export const HISTORY_GAP_CARDS = [
  typeHottateBashira,
  styleIndustrialIronGlass,
  styleQueenAnne,
  styleRyuguMon,
  styleWayoSecchu,
  styleWariHaiden,
  styleIriTonboZukuri,
  styleHiyokuIrimoyaZukuri,
  styleSetchuyo,
  styleObaku,
  typeJinaicho,
  styleIslamic,
];
