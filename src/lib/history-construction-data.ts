export type Localized = { ja: string; zh: string; en: string };
const l = (ja: string, zh: string, en: string): Localized => ({ ja, zh, en });

export type CrossTheme = {
  id: string;
  title: Localized;
  eyebrow: Localized;
  principle: Localized;
  loadPath: Localized[];
  historicalSteps: { label: Localized; note: Localized }[];
  spatialResult: Localized;
  historyCards: { id: string; name: Localized }[];
  examples: { name: Localized; buildingId?: string }[];
  exam: { history: Localized; construction: Localized };
  caution?: Localized;
  notionUrl: string;
};

export const HISTORY_CONSTRUCTION_THEMES: CrossTheme[] = [
  {
    id: "timber-roofs",
    title: l("木造・小屋組と屋根", "木构、小屋组与屋顶", "Timber construction, roof framing, and roofs"),
    eyebrow: l("構法から様式を読む", "从构法读样式", "Reading style through construction"),
    principle: l("柱・梁で骨組をつくり、屋根荷重を横架材・柱・基礎へ伝える。小屋組は屋根の形と室内の梁間を決める。", "以柱梁组成骨架，将屋顶荷载经横架材、柱传至基础；小屋组决定屋顶形式和室内的梁间关系。", "Posts and beams form a frame that carries roof loads through horizontal members, posts, and foundations. Roof framing determines the roof form and the span of the interior bays."),
    loadPath: [l("屋根", "屋顶", "Roof"), l("垂木・母屋", "椽、檩", "Rafters and purlins"), l("小屋梁・桁", "屋架梁、桁", "Roof beams and girders"), l("柱・壁", "柱、墙", "Posts and walls"), l("土台・基礎", "土台、基础", "Sill plates and foundations")],
    historicalSteps: [
      { label: l("古代〜中世", "古代至中世", "Ancient to medieval"), note: l("寺社の軸組・組物・垂木が深い軒と木造の表現を支える。", "寺社的轴组、组物与椽子支撑深檐和木构表达。", "Post-and-beam frames, bracket complexes, and rafters in temples and shrines support deep eaves and timber expression.") },
      { label: l("近世", "近世", "Early modern"), note: l("町家・書院・数寄屋で、架構と屋根形状が居住空間の尺度をつくる。", "町家、书院、数寄屋中，架构和屋顶形成居住空间尺度。", "In machiya, shoin, and sukiya buildings, the frame and roof geometry set the scale of domestic space.") },
      { label: l("近代以降", "近代以后", "Modern period onward"), note: l("和小屋・洋小屋・トラスを比較し、木造の大スパン化と工業化へ接続する。", "比较和小屋、洋小屋、桁架，连接木构的大跨度化与工业化。", "Compare Japanese roof framing, Western roof framing, and trusses to connect timber construction with longer spans and industrialization.") },
    ],
    spatialResult: l("深い軒、柱間の反復、屋根下の大空間、またはトラスによる無柱に近い空間。", "深檐、柱间重复、屋顶下的大空间，或由桁架形成的近无柱空间。", "Deep eaves, repeating post bays, large rooms beneath the roof, or near column-free spaces created by trusses."),
    historyCards: [
      { id: "style-wayo", name: l("和様", "和样", "Wayō style") },
      { id: "style-daibutsuyo", name: l("大仏様", "大佛样", "Daibutsuyō style") },
      { id: "style-zenshuyo", name: l("禅宗様", "禅宗样", "Zen style") },
      { id: "style-shoin", name: l("書院造", "书院造", "Shoin style") },
      { id: "style-sukiya", name: l("数寄屋造", "数寄屋造", "Sukiya style") },
    ],
    examples: [{ name: l("法隆寺金堂・五重塔", "法隆寺金堂与五重塔", "Hōryū-ji Main Hall and Five-Story Pagoda"), buildingId: "building-4a300426c168" }, { name: l("東大寺南大門・鐘楼", "东大寺南大门与钟楼", "Tōdai-ji Great South Gate and Bell Tower"), buildingId: "building-aeb9da82ed0e" }, { name: l("グラバー邸", "格拉巴住宅", "Glover Residence"), buildingId: "building-553af9aa7607" }],
    exam: {
      history: l("様式・建築の識別、組物や屋根部材、年代・人物との対応。", "样式和建筑识别、组物与屋顶构件、年代和人物对应。", "Identify styles and buildings, bracket sets and roof members, and their links to periods and people."),
      construction: l("和小屋／洋小屋／扠首組の比較、部材名称、屋根伏・図解、荷重伝達。", "和小屋／洋小屋／扠首组比较、构件名称、屋顶平面与图解、荷载传递。", "Compare Japanese roof framing, Western roof framing, and forked-rafter systems; learn member names, roof plans, diagrams, and load transfer."),
    },
    caution: l("「和小屋」は近世以降の木造構法として整理する。古代寺社の屋根架構と、同じ語で安易に同一視しない。", "“和小屋”应作为近世以后的木构体系理解；不要与古代寺社屋顶架构不加区分地等同。", "Treat Japanese roof framing as an early-modern and later timber system; do not equate it indiscriminately with the roof structures of ancient temples and shrines."),
    notionUrl: "https://app.notion.com/p/399e961e4690815aa40df25487f155e1",
  },
  {
    id: "masonry-spans",
    title: l("組積造・アーチ・ヴォールト・ドーム", "组积造、拱、拱顶与穹顶", "Masonry, arches, vaults, and domes"),
    eyebrow: l("壁から骨組化へ", "从厚墙到骨架化", "From massive walls to structural articulation"),
    principle: l("圧縮に強い石・煉瓦を積み、アーチ、ヴォールト、ドームで開口と大空間をつくる。水平推力を壁・控え壁・飛梁で処理する。", "用耐压的石材和砖砌筑，通过拱、拱顶与穹顶形成开口和大空间；以墙、扶壁、飞扶壁处理侧向推力。", "Compression-resistant stone and brick form openings and large interiors through arches, vaults, and domes. Walls, buttresses, and flying buttresses resist horizontal thrust."),
    loadPath: [l("屋根・ヴォールト", "屋顶、拱顶", "Roof and vault"), l("アーチ・リブ", "拱、肋", "Arches and ribs"), l("柱・壁・扶壁", "柱、墙、扶壁", "Columns, walls, and buttresses"), l("基壇・地盤", "基座、地基", "Plinth and ground")],
    historicalSteps: [
      { label: l("ローマ", "罗马", "Rome"), note: l("アーチ・コンクリート・ドームで内部空間を拡張する。", "借拱、混凝土与穹顶扩大内部空间。", "Arches, concrete, and domes extend interior space.") },
      { label: l("ビザンティン", "拜占庭", "Byzantium"), note: l("ペンデンティブで方形平面とドームを接続する。", "用帆拱连接方形平面和穹顶。", "Pendentives connect a square plan to a dome.") },
      { label: l("ゴシック", "哥特", "Gothic"), note: l("リブ・ヴォールトと飛梁で荷重を集中させ、壁を開く。", "肋拱顶与飞扶壁集中荷载，释放墙面开窗。", "Rib vaults and flying buttresses concentrate loads and free the walls for openings.") },
    ],
    spatialResult: l("厚い壁の量塊性から、上方へ伸びる採光空間と大きな開口へ。", "从厚墙的体量感，转向向上延展、可大面积采光的空间。", "A shift from the mass of thick walls toward vertically rising, light-filled spaces with larger openings."),
    historyCards: [
      { id: "style-roman", name: l("古代ローマ建築", "古罗马建筑", "Ancient Roman architecture") },
      { id: "style-byzantine", name: l("ビザンティン建築", "拜占庭建筑", "Byzantine architecture") },
      { id: "style-romanesque", name: l("ロマネスク建築", "罗马式建筑", "Romanesque architecture") },
      { id: "style-gothic", name: l("ゴシック建築", "哥特式建筑", "Gothic architecture") },
    ],
    examples: [{ name: l("パンテオン", "万神殿", "Pantheon"), buildingId: "building-6e028baa8a9c" }, { name: l("ハギア・ソフィア大聖堂", "圣索菲亚大教堂", "Hagia Sophia"), buildingId: "building-ad7b5b62435c" }, { name: l("サント・シャペル", "圣礼拜堂", "Sainte-Chapelle"), buildingId: "building-d9446d1ef354" }],
    exam: {
      history: l("建築・様式・構成要素の対応、ペンデンティブやリブ・ヴォールトの識別。", "建筑、样式与构成元素对应，识别帆拱和肋拱顶。", "Match buildings, styles, and components; identify pendentives and rib vaults."),
      construction: l("組積造の部材、まぐさ・キーストーン・目地、圧縮と水平推力の理解。", "组积造构件、过梁、拱心石、灰缝，以及受压和侧推力的理解。", "Understand masonry components, lintels, keystones, joints, compression, and horizontal thrust."),
    },
    notionUrl: "https://app.notion.com/p/399e961e469081f0acd1dddf0cf48b6b",
  },
  {
    id: "modern-frame-envelope",
    title: l("鉄・RC・外皮が変えた近現代建築", "铁、RC与外皮改变的近现代建筑", "Modern architecture transformed by steel, reinforced concrete, and envelopes"),
    eyebrow: l("骨組と外皮の分離", "骨架与外皮的分离", "Separating frame and envelope"),
    principle: l("鉄骨・RCの骨組が荷重を担い、外壁は必ずしも耐力壁でなくなる。大スパン、自由な平面、カーテンウォールが可能になる。", "钢与RC骨架承担荷载，外墙不再必然是承重墙，从而实现大跨度、自由平面和幕墙。", "Steel and reinforced-concrete frames carry loads, so external walls need not be load-bearing. This enables long spans, free plans, and curtain walls."),
    loadPath: [l("床・屋根", "楼板、屋顶", "Floors and roof"), l("梁・スラブ", "梁、板", "Beams and slabs"), l("柱・耐力要素", "柱、抗侧力构件", "Columns and lateral-resisting elements"), l("基礎", "基础", "Foundations")],
    historicalSteps: [
      { label: l("産業革命", "工业革命", "Industrial Revolution"), note: l("鉄・ガラスとトラスが駅舎・博覧会建築の大空間を可能にする。", "铁、玻璃与桁架使车站和博览会建筑的大空间成为可能。", "Iron, glass, and trusses make large spaces possible in stations and exhibition buildings.") },
      { label: l("近代主義", "现代主义", "Modernism"), note: l("RC・鉄骨の骨組が自由な平面・立面を支える。", "RC与钢骨架支撑自由平面和立面。", "Reinforced-concrete and steel frames support free plans and elevations.") },
      { label: l("戦後〜現代", "战后到当代", "Postwar to present"), note: l("プレキャスト、シェル、外皮技術が構法そのものを表現にする。", "预制、壳体和外皮技术使构法本身成为表达。", "Precast construction, shells, and envelope technologies make construction itself an expression.") },
    ],
    spatialResult: l("大スパン、柱の後退、自由な平面、透明・軽量な外皮、構造の可視化。", "大跨度、柱后退、自由平面、透明轻质外皮，以及结构的可视化。", "Long spans, recessed columns, free plans, transparent lightweight envelopes, and visible structure."),
    historyCards: [
      { id: "style-industrial-iron-glass", name: l("鉄とガラスの建築", "铁与玻璃建筑", "Iron and glass architecture") },
      { id: "movement-modernism", name: l("近代建築運動・モダニズム", "现代建筑运动／现代主义", "Modern architectural movement / Modernism") },
      { id: "style-international", name: l("インターナショナル・スタイル", "国际主义风格", "International Style") },
      { id: "style-high-tech", name: l("ハイテク建築", "高技派建筑", "High-tech architecture") },
    ],
    examples: [{ name: l("ファグス靴工場", "法古斯鞋楦厂", "Fagus Factory"), buildingId: "building-e005da0846ca" }, { name: l("バウハウス校舎", "包豪斯校舍", "Bauhaus Building"), buildingId: "building-e77b587cf8db" }, { name: l("シドニー・オペラハウス", "悉尼歌剧院", "Sydney Opera House"), buildingId: "building-ae45db9b5282" }],
    exam: {
      history: l("建築家・運動・代表作と、鉄・ガラス、シェル、設備外部化などの対応。", "建筑家、运动、代表作与铁玻璃、壳体、设备外露等对应。", "Match architects, movements, and key works with iron and glass, shells, and externally expressed services."),
      construction: l("S造・RC造・PCa・シェル・カーテンウォールの材料、接合、施工・変位追従の説明。", "钢结构、RC、预制、壳体、幕墙的材料、连接、施工和变形追随说明。", "Explain the materials, connections, construction, and movement accommodation of steel, reinforced concrete, precast, shell, and curtain-wall systems."),
    },
    notionUrl: "https://app.notion.com/p/399e961e469081af8d22c23021c848c5",
  },
  {
    id: "japanese-timber-joints",
    title: l("日本木構：軸組・組物・接合", "日本木构：轴组、组物与连接", "Japanese timber construction: post-and-beam frames, bracket complexes, and joints"),
    eyebrow: l("構造が意匠になる", "结构成为建筑表达", "Structure becomes architectural expression"),
    principle: l("柱と横架材が鉛直荷重を伝え、組物が深い軒の荷重を受ける。継手・仕口は木材を延長・交差接合し、架構の連続性をつくる。", "柱和横架材传递竖向荷载，组物承托深檐荷载；榫卯与接头使木材延长、交接，形成连续架构。", "Posts and horizontal members transfer vertical loads, while bracket complexes support deep eaves. Splices and joinery extend and intersect timbers to create a continuous frame."),
    loadPath: [l("屋根・軒", "屋顶、屋檐", "Roof and eaves"), l("垂木・組物", "椽、组物", "Rafters and bracket complexes"), l("梁・貫", "梁、贯", "Beams and tie beams"), l("柱", "柱", "Posts"), l("礎石・地盤", "础石、地基", "Foundation stones and ground")],
    historicalSteps: [
      { label: l("飛鳥・奈良", "飞鸟、奈良", "Asuka and Nara periods"), note: l("大陸由来の仏教建築の架構を受け入れ、組物・軒の体系を発展させる。", "吸收大陆传入的佛教建筑架构，发展组物与屋檐体系。", "Adopts Buddhist structural systems from the continent and develops bracket-complex and eave systems.") },
      { label: l("鎌倉", "镰仓", "Kamakura period"), note: l("大仏様・禅宗様が新しい架構表現と部材の扱いを持ち込む。", "大佛样、禅宗样带来新的架构表达与构件处理方式。", "Daibutsuyo and Zen styles introduce new structural expressions and ways of treating members.") },
      { label: l("近世〜近代", "近世至近代", "Early modern to modern periods"), note: l("書院・数寄屋・民家で、見せる柱と納める接合の関係が変化する。", "书院、数寄屋、民居中，显露的柱与收口的连接关系发生变化。", "In shoin, sukiya, and vernacular houses, the relationship between exposed posts and concealed joinery changes.") },
    ],
    spatialResult: l("深い軒、反復する柱間、組物の陰影、露出する木部が空間の尺度と表情をつくる。", "深檐、重复柱间、组物阴影与外露木构共同形成空间尺度和表情。", "Deep eaves, repeating bay spacing, the shadows of bracket complexes, and exposed timber give space its scale and character."),
    historyCards: [
      { id: "style-asuka", name: l("飛鳥建築", "飞鸟建筑", "Asuka architecture") },
      { id: "style-wayo", name: l("和様", "和样", "Wayō style") },
      { id: "style-daibutsuyo", name: l("大仏様", "大佛样", "Daibutsuyō style") },
      { id: "style-zenshuyo", name: l("禅宗様", "禅宗样", "Zenshūyō style") },
    ],
    examples: [{ name: l("法隆寺金堂・五重塔", "法隆寺金堂与五重塔", "Hōryū-ji Main Hall and Five-Story Pagoda"), buildingId: "building-4a300426c168" }, { name: l("東大寺南大門・鐘楼", "东大寺南大门与钟楼", "Tōdai-ji Great South Gate and Bell Tower"), buildingId: "building-aeb9da82ed0e" }, { name: l("円覚寺仏殿", "圆觉寺佛殿", "Engaku-ji Buddha Hall"), buildingId: "building-fcca980cbbdc" }],
    exam: {
      history: l("和様・大仏様・禅宗様の識別、建築と部材・時代・人物の対応。", "识别和样、大佛样、禅宗样；建筑与构件、时代、人物的对应。", "Identify Wayō, Daibutsuyō, and Zenshūyō styles, and match buildings with members, periods, and figures."),
      construction: l("柱・梁・貫・継手・仕口の役割、荷重伝達、木造軸組との比較。", "柱、梁、贯、榫卯和接头的作用、荷载传递，以及与现代木构轴组的比较。", "Explain the roles of posts, beams, tie beams, splices, and joinery, load transfer, and comparisons with timber post-and-beam framing."),
    },
    caution: l("伝統建築の組物・仕口と、現代在来軸組の金物接合は、共通する木構の原理と異なる耐震・施工条件を分けて読む。", "传统建筑的组物、榫卯与现代木构的金属连接共享木构原理，但抗震与施工条件不同，应分开理解。", "Traditional bracket complexes and joinery, and metal connections in contemporary conventional timber framing, share timber principles but must be read through different seismic and construction conditions."),
    notionUrl: "https://app.notion.com/p/399e961e469081b5b4d0f3212e630842",
  },
  {
    id: "long-span",
    title: l("大スパン：トラス・シェル・空間架構", "大跨度：桁架、壳体与空间架构", "Long spans: trusses, shells, and space frames"),
    eyebrow: l("荷重を線・面・網で流す", "以线、面、网传递荷载", "Carry loads through lines, surfaces, and networks"),
    principle: l("トラスは三角形の部材で、シェルは曲面で、空間架構は立体的な網で荷重を分散して大スパンをつくる。", "桁架用三角构件、壳体用曲面、空间架构用立体网格分散荷载，从而形成大跨度。", "Trusses use triangular members, shells use curved surfaces, and space frames use three-dimensional networks to distribute loads across long spans."),
    loadPath: [l("屋根面", "屋顶面", "Roof surface"), l("トラス・シェル・網", "桁架、壳体、网格", "Trusses, shells, and networks"), l("支点・リング", "支座、环梁", "Supports and ring beams"), l("柱・基礎", "柱、基础", "Columns and foundations")],
    historicalSteps: [
      { label: l("19世紀", "19世纪", "19th century"), note: l("鉄トラスが駅舎・展示建築の大屋根を可能にする。", "铁桁架使车站与展览建筑的大屋顶成为可能。", "Iron trusses make large roofs possible for stations and exhibition buildings.") },
      { label: l("20世紀中葉", "20世纪中叶", "Mid-20th century"), note: l("RCシェルが薄い曲面と劇的な内部空間を実現する。", "RC壳体实现薄的曲面与富有戏剧性的内部空间。", "Reinforced-concrete shells create thin curved surfaces and dramatic interior spaces.") },
      { label: l("戦後〜現代", "战后到当代", "Postwar to present"), note: l("スペースフレーム・ケーブル・膜が軽量な大空間へ展開する。", "空间网架、索与膜发展为轻量的大空间。", "Space frames, cable structures, and membranes develop into lightweight large-span spaces.") },
    ],
    spatialResult: l("中間柱を減らした集会・展示・交通空間と、屋根そのものが主役になるシルエット。", "减少中间柱的集会、展览、交通空间，以及让屋顶本身成为主角的轮廓。", "Assembly, exhibition, and transport spaces with fewer interior columns, and silhouettes in which the roof itself takes center stage."),
    historyCards: [
      { id: "style-industrial-iron-glass", name: l("鉄とガラスの建築", "铁与玻璃建筑", "Iron and glass architecture") },
      { id: "movement-modernism", name: l("近代建築運動・モダニズム", "现代建筑运动／现代主义", "Modern architectural movement / Modernism") },
      { id: "style-high-tech", name: l("ハイテク建築", "高技派建筑", "High-tech architecture") },
    ],
    examples: [{ name: l("ファグス靴工場", "法古斯鞋楦厂", "Fagus Factory"), buildingId: "building-e005da0846ca" }, { name: l("シドニー・オペラハウス", "悉尼歌剧院", "Sydney Opera House"), buildingId: "building-ae45db9b5282" }],
    exam: {
      history: l("建築家・運動・代表建築の対応と、シェル・トラスなどの視覚的識別。", "建筑家、运动、代表建筑对应，以及壳体、桁架等的视觉识别。", "Match architects, movements, and landmark buildings, and visually identify shells, trusses, and related systems."),
      construction: l("トラス形式、シェル・スペースフレーム・ケーブル構造の構造形式と材料・特徴の説明。", "桁架类型、壳体、空间网架、索结构的结构形式、材料与特征说明。", "Explain truss types and the structural forms, materials, and characteristics of shells, space frames, and cable structures."),
    },
    notionUrl: "https://app.notion.com/p/399e961e469081af8d22c23021c848c5",
  },
];
