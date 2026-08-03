import type{StyleLearningCard}from"@/types/history-learning-card";
const l=(ja:string,zh:string,en?:string)=>({ja,zh,...(en?{en}:{})});
type EnglishSupplementaryStyle={name:string;period:string;summary:string;formationBackground:string;structuralFeatures:string[];spatialFeatures:string[];visualClues:string[]};
const ENGLISH_BY_ID:Record<string,EnglishSupplementaryStyle>={
  "style-early-christian":{
    name:"Early Christian Architecture",period:"4th–6th centuries",
    summary:"Architecture that adapted the Roman basilica to Christian liturgy and established the longitudinal church.",
    formationBackground:"After Christianity was legalized, spaces capable of accommodating large congregations became necessary for worship.",
    structuralFeatures:["Timber roofs and colonnades forming the nave and aisles"],
    spatialFeatures:["A longitudinal sequence from atrium and narthex through the nave to the apse, with aisles accommodating congregational movement"],
    visualClues:["Plain exteriors and longitudinal interiors enriched with mosaics"],
  },
  "style-mannerism":{
    name:"Mannerist Architecture",period:"Mid-to-late 16th century",
    summary:"Architecture that deliberately distorted Renaissance rules to produce tension, ambiguity, and intellectual play.",
    formationBackground:"After the completion of the High Renaissance, architects sought an expressive language that manipulated the norms themselves.",
    structuralFeatures:["Deliberate departures from the scale, placement, and supporting relationships of classical elements"],
    spatialFeatures:["Shifted axes, unexpected depth, and contrasts between compression and release create deliberate spatial tension"],
    visualClues:["Broken pediments, colossal orders, and unstable compositions"],
  },
  "style-rococo":{
    name:"Rococo Architecture",period:"First half of the 18th century",
    summary:"An intimate style developed for courtly and domestic interiors, using light curves, pastel colors, mirrors, and asymmetrical ornament.",
    formationBackground:"Court culture shifted from grand absolutist ceremony toward more private salon culture.",
    structuralFeatures:["Conventional masonry rooms and vaults are overlaid with lightweight stucco, gilding, mirrors, and integrated furnishings"],
    spatialFeatures:["Intimate salons, enfilades, curved corners, and mirrors create fluid rooms whose boundaries appear to dissolve"],
    visualClues:["Rocaille curves, gilded ornament, mirrors, and pale colors"],
  },
  "style-historicism":{
    name:"Historicism",period:"19th century",
    summary:"Modern architecture that selected and combined past styles according to program, nation, and religion.",
    formationBackground:"The Industrial Revolution, emerging nation-states, archaeology, and architectural education made historical styles available as selectable design languages.",
    structuralFeatures:["Modern structures such as iron frames wrapped in historical-style envelopes"],
    spatialFeatures:["Modern program and circulation are organized inside ceremonial plans whose spatial hierarchy evokes a selected historical precedent"],
    visualClues:["Gothic Revival, Neo-Renaissance, and eclectic facades"],
  },
  "style-art-deco":{
    name:"Art Deco",period:"1920s–1930s",
    summary:"An urban commercial style combining geometric ornament, luxurious materials, and imagery of the machine age.",
    formationBackground:"It arose from postwar consumer culture, international expositions, high-rise construction, and mass transport.",
    structuralFeatures:["Modern steel or concrete structures combined with ornamental cladding"],
    spatialFeatures:["Axial lobbies, compact high-rise floor plates, and streamlined circulation turn movement through commercial buildings into a staged urban experience"],
    visualClues:["Stepped silhouettes, radiating patterns, streamlining, and metal ornament"],
  },
  "style-expressionism":{
    name:"Expressionist Architecture",period:"1910s–1920s",
    summary:"Avant-garde architecture that expressed emotion and social ideals through sharp, curving, crystalline, or organic forms.",
    formationBackground:"War, revolution, and new materials encouraged anti-rational and symbolic spatial exploration.",
    structuralFeatures:["Brick, concrete, and glass shaped into fluid, unified wholes"],
    spatialFeatures:["Cavernous, crystalline, or dynamically curved interiors use compressed approaches, expanding volumes, and dramatic light to heighten emotion"],
    visualClues:["Sculptural masses, dramatic profiles, and expressive light"],
  },
  "style-international":{
    name:"International Style",period:"1920s–1960s",
    summary:"An international language of modern architecture defined by volume, regular grids, glass skins, and the reduction of ornament.",
    formationBackground:"Modern architecture spread worldwide through exhibitions, publications, corporate practice, and postwar reconstruction.",
    structuralFeatures:["Independent structural frames, free plans, and lightweight curtain walls"],
    spatialFeatures:["Open, flexible interiors, functional zoning, and visual continuity between inside and outside replace enclosed load-bearing rooms"],
    visualClues:["Rectilinear volumes, ribbon windows, glass curtain walls, and reduced ornament"],
  },
  "style-high-tech":{
    name:"High-tech Architecture",period:"From the late 1960s onward",
    summary:"Technology-oriented architecture that externalizes structure, services, production, and maintenance systems as architectural expression.",
    formationBackground:"It was shaped by postwar engineering advances, prefabrication, and criticism of the sealed modernist box.",
    structuralFeatures:["Long-span structures, industrialized joints, and externally expressed services"],
    spatialFeatures:["Services and circulation are pushed toward the perimeter to preserve large, open, adaptable interior floor plates"],
    visualClues:["Exposed pipes and ducts, lightweight steel frames, and adaptable interiors"],
  },
  "style-postmodern":{
    name:"Postmodern Architecture",period:"Late 1960s–1990s",
    summary:"A tendency that criticized modernism's singular formal language and returned historical quotation, signs, context, and multiple meanings to architecture.",
    formationBackground:"It arose from criticism of the homogenized International Style and large-scale urban renewal, together with renewed interest in historic settings and popular culture.",
    structuralFeatures:["Modern structures deliberately overlaid with historical forms and symbolic elements"],
    spatialFeatures:["Legible axes, streets, plazas, and room-like sequences restore hierarchy, context, and multiple readings to modern programs"],
    visualClues:["Articulated masses, ornamental facades, emphasized entrances, and quotations with multiple meanings"],
  },
};
const c=(id:string,ja:string,zh:string,pja:string,pzh:string,s:[string,string],b:[string,string],structure:[string,string][],space:[string,string][],v:[string,string][],prev:string[],next:string[]):StyleLearningCard=>({id,kind:"style",name:l(ja,zh,ENGLISH_BY_ID[id]?.name),aliases:[],period:l(pja,pzh,ENGLISH_BY_ID[id]?.period),regions:["western","global"],summary:l(s[0],s[1],ENGLISH_BY_ID[id]?.summary),formationBackground:l(b[0],b[1],ENGLISH_BY_ID[id]?.formationBackground),structuralFeatures:structure.map((x,index)=>l(x[0],x[1],ENGLISH_BY_ID[id]?.structuralFeatures[index])),spatialFeatures:space.map((x,index)=>l(x[0],x[1],ENGLISH_BY_ID[id]?.spatialFeatures[index])),visualClues:v.map((x,index)=>l(x[0],x[1],ENGLISH_BY_ID[id]?.visualClues[index])),keywords:[],relatedBuildingIds:[],relatedPersonIds:[],relatedCardIds:[...prev,...next],comparisonCardIds:[...prev,...next],predecessorCardIds:prev,successorCardIds:next,examEvidence:[],reviewStatus:"draft"});
export const SUPPLEMENTARY_STYLE_CARDS:StyleLearningCard[]=[
c("style-early-christian","初期キリスト教建築","早期基督教建筑","4〜6世紀","4-6世纪",["ローマのバシリカをキリスト教典礼へ転用し、長軸型教会を確立した建築。","将罗马巴西利卡转用于基督教礼仪并确立长轴教堂的建筑。"],["公認後のキリスト教が多数の会衆を収容する礼拝空間を必要とした。","基督教合法化后需要容纳大量会众的礼拜空间。"],[["木造屋根と列柱で身廊・側廊を構成。","以木屋顶和列柱构成中殿、侧廊。"]],[["アトリウムとナルテックスから身廊を経てアプスへ至る長軸的な礼拝空間。","由前庭、前厅经中殿通向后殿的长轴礼拜空间，侧廊承担会众流线。"]],[["簡素な外観とモザイクをもつ長堂。","简朴外观与马赛克装饰的长堂。"]],["style-roman"],["style-byzantine","style-romanesque"]),
c("style-mannerism","マニエリスム建築","手法主义建筑","16世紀中頃〜後期","16世纪中后期",["ルネサンスの規則を意図的にずらし、緊張・曖昧さ・知的遊戯を生んだ建築。","有意扭曲文艺复兴规则，产生紧张、暧昧和智性游戏的建筑。"],["盛期ルネサンスの完成後、規範そのものを操作する表現が求められた。","盛期文艺复兴完成后，建筑转向操控规范本身。"],[["古典要素の尺度・位置・支持関係を逸脱。","偏离古典构件的尺度、位置和支撑关系。"]],[["軸線のずれ、予期しない奥行き、圧縮と開放の対比によって空間的緊張をつくる。","通过轴线偏移、出人意料的纵深以及压缩与开放的对比制造空间张力。"]],[["破断山花、巨大柱式、不安定な構成。","断裂山花、巨柱式与不稳定构图。"]],["style-renaissance"],["style-baroque"]),
c("style-rococo","ロココ","洛可可","18世紀前半","18世纪前半",["宮廷・邸宅内部に発達した、軽快な曲線、淡色、鏡、非対称装飾による親密な様式。","发展于宫廷和宅邸内部，以轻盈曲线、淡色、镜面和非对称装饰形成亲密氛围。"],["絶対王政の宮廷文化が壮大な儀礼から私的サロン文化へ移った。","宫廷文化由宏大仪式转向私人沙龙。"],[["既存の組積造の室とヴォールトを下地に、軽量な漆喰装飾・鏡・家具を一体化する。","在既有砌体房间与拱顶上整合轻质灰泥装饰、镜面和家具。"]],[["親密なサロン、アンフィラード、曲面隅部と鏡によって境界が溶けるような流動的室内をつくる。","通过亲密沙龙、套间序列、曲面转角和镜面形成边界仿佛消融的流动室内。"]],[["貝殻曲線、金色装飾、鏡、淡色。","贝壳曲线、金色装饰、镜面与淡色。"]],["style-baroque"],["style-neoclassical"]),
c("style-historicism","歴史主義建築","历史主义建筑","19世紀","19世纪",["用途・国家・宗教に応じて過去の様式を選択・混成した近代建築。","依据功能、国家和宗教选择或混合过去样式的近代建筑。"],["産業革命、新興国家、考古学・建築教育の発展により、歴史様式が選択可能な設計言語となった。","工业革命、新国家、考古与建筑教育使历史样式成为可选择的设计语言。"],[["鉄骨など近代構造を歴史様式の外装で包む。","以历史样式外装包裹钢结构等现代结构。"]],[["近代的な用途・動線を、選択した歴史様式を想起させる儀礼的な軸線と空間序列の中に組織する。","把现代功能与流线组织进唤起特定历史样式的仪式轴线和空间序列。"]],[["ゴシック・リヴァイヴァル、ネオ・ルネサンス、折衷的ファサード。","哥特复兴、文艺复兴复兴与折衷立面。"]],["style-neoclassical"],["movement-art-nouveau","movement-modernism"]),
c("style-art-deco","アール・デコ","装饰艺术","1920〜1930年代","20世纪20至30年代",["幾何学的装飾、高級材料、機械時代のイメージを融合した都市商業建築様式。","结合几何装饰、奢华材料与机器时代意象的城市商业样式。"],["戦後の大衆消費文化、万国博覧会、高層建築、大量交通機関の発展を背景とする。","战后消费文化、博览会、高层建筑与大众交通发展。"],[["鉄骨・コンクリート等の近代構造に装飾的表皮を組み合わせる。","现代结构与装饰表皮结合。"]],[["軸線的なロビー、コンパクトな高層基準階、流線的動線によって都市商業空間の移動を演出する。","通过轴线式门厅、紧凑高层标准层和流线型交通组织营造都市商业空间体验。"]],[["階段状シルエット、放射状パターン、流線形と金属装飾。","阶梯轮廓、放射纹、流线与金属装饰。"]],["movement-art-nouveau"],["movement-modernism"]),
c("style-expressionism","表現主義建築","表现主义建筑","1910〜1920年代","20世纪10至20年代",["尖鋭的・曲面的・結晶的または有機的形態によって、感情と社会的理想を表現した前衛建築。","以尖锐、曲面、晶体或有机形态表达情绪与社会理想的先锋建筑。"],["戦争・革命と新素材の登場が、反合理主義的・象徴的な空間探求を促した。","战争、革命和新材料激发反理性、象征性空间探索。"],[["煉瓦・コンクリート・ガラスを流動的で統一された全体として造形する。","砖、混凝土和玻璃被塑造成动态整体。"]],[["洞窟的・結晶的・曲面的な内部を、圧縮された導入、拡張するヴォリューム、劇的な光で構成する。","以压缩入口、扩张体量与戏剧性光线组织洞穴状、晶体状或曲面室内。"]],[["彫刻的マッス、劇的な輪郭と光の演出。","雕塑性体量、强烈轮廓与戏剧性光线。"]],["movement-art-nouveau"],["movement-modernism","movement-constructivism"]),
c("style-international","インターナショナル・スタイル","国际主义风格","1920〜1960年代","20世纪20至60年代",["ヴォリューム、規則的グリッド、ガラスの外皮、装飾排除によって構成された国際的近代建築言語。","由体量、规则网格、玻璃表皮和无装饰构成的国际现代建筑语言。"],["近代建築が展覧会・出版・企業活動・戦後建設を通じて世界的に普及した。","现代主义经展览、出版、企业与战后建设全球传播。"],[["独立した構造骨組み、自由な平面計画、軽量なカーテンウォール。","独立结构框架、自由平面与轻质幕墙。"]],[["開放的で可変な内部、機能別ゾーニング、内外の視覚的連続によって耐力壁に囲まれた室を置き換える。","以开放灵活的内部、功能分区和内外视觉连续取代承重墙围合房间。"]],[["直方体のヴォリューム、連続水平窓、ガラス・カーテンウォールと装飾の排除。","矩形体量、水平窗、玻璃幕墙和少装饰。"]],["movement-modernism","movement-bauhaus"],["style-high-tech","movement-postmodernism"]),
c("style-high-tech","ハイテク建築","高技派建筑","1960年代後半以降","20世纪60年代后半以后",["構造・設備・生産・保守の諸システムを外部に露出させ、それ自体を建築的表現へと転化した技術志向の建築。","外露结构、设备、生产与维护系统并将其转化为建筑表达。"],["戦後の工学技術の進歩、プレファブリケーション（工業化生産）と、閉鎖的モダニズムの箱への批判を背景とする。","战后工程技术、预制化和对封闭现代主义盒子的反思。"],[["大スパン構造、工業化された接合部、設備の外部化。","大跨度结构、预制节点与外置设备。"]],[["設備・コア・動線を周縁へ押し出し、内部に大きく開放された可変性の高い床を確保する。","把设备、核心筒与交通推向外围，在内部保留大面积开放且高度可变的楼面。"]],[["露出した配管・ダクト、軽量な鉄骨フレーム、可変性のある内部空間。","外露管线、轻质骨架与可变内部。"]],["style-international","movement-constructivism"],["contemporary-technology-architecture"]),
c("style-postmodern","ポストモダン建築","后现代建筑","1960年代後半〜1990年代","20世纪60年代后半至90年代",["近代主義の単一的な造形言語を批判し、歴史的引用、記号、文脈、多義性を建築表現へ戻した傾向。","批判现代主义单一造型语言，把历史引用、符号、语境与多义性重新带入建筑表达。"],["画一化した国際様式と大規模都市更新への批判、歴史的環境と大衆文化の再評価を背景とする。","源于对趋同国际风格和大规模都市更新的批评，以及对历史环境与大众文化的重新评价。"],[["近代的な構造に歴史的形態や記号的要素を意図的に重ねる。","在现代结构上有意识地叠加历史形态与符号要素。"]],[["明快な軸線、街路・広場・部屋のような空間序列によって、近代的用途に階層性・文脈・多義性を戻す。","以清晰轴线以及街道、广场、房间式空间序列，为现代功能恢复层级、语境和多义性。"]],[["分節された量塊、装飾的ファサード、強調された入口、複数の意味をもつ引用。","分节体量、装饰性立面、强调入口及具有多重意义的引用。"]],["movement-modernism"],["movement-postmodernism"]),
];
