export type LineageLocalizedText = { ja: string; zh: string };

export type LineagePersonRole = "royal" | "warrior" | "patron" | "monk" | "builder";
export type LineageRelationKind = "parent-child" | "family-succession" | "project-succession" | "collaboration";
export type LineageCertainty = "documented" | "traditional";

export interface LineageBuildingLink {
  id: string;
  name: LineageLocalizedText;
  relation: LineageLocalizedText;
  note?: LineageLocalizedText;
  certainty?: LineageCertainty;
}

export interface LineagePerson {
  id: string;
  name: LineageLocalizedText;
  years: string;
  role: LineagePersonRole;
  roleLabel: LineageLocalizedText;
  summary: LineageLocalizedText;
  x: number;
  y: number;
  buildings: LineageBuildingLink[];
}

export interface LineageRelation {
  id: string;
  source: string;
  target: string;
  kind: LineageRelationKind;
  label: LineageLocalizedText;
  note?: LineageLocalizedText;
  certainty?: LineageCertainty;
}

export interface JapanesePersonLineage {
  id: string;
  title: LineageLocalizedText;
  period: LineageLocalizedText;
  description: LineageLocalizedText;
  memoryHook: LineageLocalizedText;
  width: number;
  height: number;
  people: LineagePerson[];
  relations: LineageRelation[];
  sources: { label: LineageLocalizedText; href: string }[];
}

const person = (value: LineagePerson) => value;

export const JAPANESE_PERSON_LINEAGES: JapanesePersonLineage[] = [
  {
    id: "asuka-nara-buddhism",
    title: { ja: "飛鳥・奈良｜仏教伽藍を動かした人々", zh: "飞鸟—奈良｜推动佛教伽蓝的人物" },
    period: { ja: "6世紀後半〜8世紀", zh: "6世纪后半—8世纪" },
    description: {
      ja: "皇族・政治的後援者・僧侶を分けて読む。人物名が建物に付いていても、全員が設計者という意味ではない。",
      zh: "把皇族、政治施主和僧侣分开阅读。人物与建筑相连，并不表示每个人都是设计者。",
    },
    memoryHook: {
      ja: "発願する人／造営を進める人／信仰対象となる人を区別する。",
      zh: "区分发愿者、推动营造者与后来成为信仰对象的人。",
    },
    width: 1260,
    height: 1040,
    people: [
      person({ id: "soga-no-umako", name: { ja: "蘇我馬子", zh: "苏我马子" }, years: "c.551–626", role: "patron", roleLabel: { ja: "政治的後援者・発願", zh: "政治施主／发愿" }, summary: { ja: "百済からの技術導入を背景に、飛鳥寺の建立を発願。", zh: "在引入百济技术的背景下发愿建立飞鸟寺。" }, x: 24, y: 72, buildings: [
        { id: "building-e9d903f58f2c", name: { ja: "飛鳥寺", zh: "飞鸟寺" }, relation: { ja: "建立を発願", zh: "发愿建立" } },
      ] }),
      person({ id: "emperor-yomei", name: { ja: "用明天皇", zh: "用明天皇" }, years: "?–587", role: "royal", roleLabel: { ja: "皇族・発願", zh: "皇族／发愿" }, summary: { ja: "病気平癒のため寺と薬師像の造立を願い、その遺志が法隆寺創建へ継がれた。", zh: "为病愈发愿建寺造药师像，其遗志后来延续为法隆寺的创建。" }, x: 24, y: 386, buildings: [] }),
      person({ id: "empress-suiko", name: { ja: "推古天皇", zh: "推古天皇" }, years: "554–628", role: "royal", roleLabel: { ja: "天皇・創建伝承", zh: "天皇／创建传承" }, summary: { ja: "聖徳太子とともに用明天皇の遺志を継ぎ、法隆寺を創建したと伝わる。", zh: "相传与圣德太子共同继承用明天皇遗志，创建法隆寺。" }, x: 334, y: 72, buildings: [
        { id: "building-4a300426c168", name: { ja: "法隆寺金堂・五重塔", zh: "法隆寺金堂与五重塔" }, relation: { ja: "創建伝承", zh: "创建传承" }, certainty: "traditional" },
      ] }),
      person({ id: "prince-shotoku", name: { ja: "聖徳太子", zh: "圣德太子" }, years: "574–622", role: "royal", roleLabel: { ja: "皇族・発願／伝承", zh: "皇族／发愿与传承" }, summary: { ja: "用明天皇の子。推古天皇と父の遺志を継ぎ、法隆寺完成に関わったと伝わる。", zh: "用明天皇之子。相传与推古天皇继承父志，参与完成法隆寺。" }, x: 334, y: 386, buildings: [
        { id: "building-4a300426c168", name: { ja: "法隆寺金堂・五重塔", zh: "法隆寺金堂与五重塔" }, relation: { ja: "創建に関与", zh: "参与创建" }, note: { ja: "現存伽藍は670年火災後の再建と考えられる。", zh: "现存伽蓝一般认为是670年火灾后的重建。" }, certainty: "traditional" },
        { id: "building-e46b3040221f", name: { ja: "四天王寺", zh: "四天王寺" }, relation: { ja: "建立伝承", zh: "建立传承" }, certainty: "traditional" },
      ] }),
      person({ id: "emperor-shomu", name: { ja: "聖武天皇", zh: "圣武天皇" }, years: "701–756", role: "royal", roleLabel: { ja: "天皇・国家的発願", zh: "天皇／国家发愿" }, summary: { ja: "盧舎那大仏造立の詔を発し、国家事業として東大寺造営を進めた。", zh: "发布卢舍那大佛造立诏，以国家工程推进东大寺营造。" }, x: 644, y: 72, buildings: [
        { id: "building-977dda23f64f", name: { ja: "東大寺", zh: "东大寺" }, relation: { ja: "大仏造立の詔・国家造営", zh: "大佛造立诏／国家营造" } },
      ] }),
      person({ id: "gyoki", name: { ja: "行基", zh: "行基" }, years: "668–749", role: "monk", roleLabel: { ja: "僧侶・大仏造立への協力", zh: "僧侣／协助造立大佛" }, summary: { ja: "聖武天皇期の東大寺・大仏造立に関わり、東大寺で四聖の一人として尊崇される。", zh: "参与圣武天皇时期的东大寺与大佛造立，在东大寺被尊为四圣之一。" }, x: 644, y: 386, buildings: [
        { id: "building-977dda23f64f", name: { ja: "東大寺", zh: "东大寺" }, relation: { ja: "大仏造立に協力", zh: "协助造立大佛" } },
      ] }),
      person({ id: "gyoshin", name: { ja: "行信", zh: "行信" }, years: "8世紀", role: "monk", roleLabel: { ja: "僧侶・東院建立の発願", zh: "僧侣／发愿建立东院" }, summary: { ja: "聖徳太子の宮跡に、太子供養の伽藍と夢殿を建立することを発願。", zh: "在圣德太子宫殿遗址发愿建立供养太子的东院伽蓝与梦殿。" }, x: 954, y: 72, buildings: [
        { id: "building-ecdbe71ecab9", name: { ja: "法隆寺夢殿", zh: "法隆寺梦殿" }, relation: { ja: "建立を発願", zh: "发愿建立" }, note: { ja: "聖徳太子は設計者ではなく、ここでは信仰対象。", zh: "圣德太子在这里是信仰对象，并非设计者。" } },
      ] }),
      person({ id: "ganjin", name: { ja: "鑑真", zh: "鉴真" }, years: "688–763", role: "monk", roleLabel: { ja: "僧侶・戒律道場の創設", zh: "僧侣／创建戒律道场" }, summary: { ja: "759年に戒律を学ぶ道場を開き、唐招提寺の基礎をつくった。金堂完成は弟子の如宝によるとされる。", zh: "759年开设戒律修行道场，奠定唐招提寺基础；金堂一般认为由弟子如宝促成完成。" }, x: 954, y: 386, buildings: [
        { id: "building-aa2b036d9ced", name: { ja: "唐招提寺金堂", zh: "唐招提寺金堂" }, relation: { ja: "寺院創設の起点", zh: "寺院创建起点" }, note: { ja: "金堂そのものは弟子・如宝の尽力で完成とされる。", zh: "金堂本身一般认为由弟子如宝努力完成。" } },
      ] }),
      person({ id: "nyoho", name: { ja: "如宝", zh: "如宝" }, years: "731–815", role: "monk", roleLabel: { ja: "僧侶・造営継承", zh: "僧侣／继承营造" }, summary: { ja: "鑑真の弟子。師の没後も唐招提寺の造営を進め、金堂完成に尽力したとされる。", zh: "鉴真的弟子，在师父去世后继续推进唐招提寺营造，一般认为对金堂完成贡献很大。" }, x: 954, y: 700, buildings: [
        { id: "building-aa2b036d9ced", name: { ja: "唐招提寺金堂", zh: "唐招提寺金堂" }, relation: { ja: "完成に尽力", zh: "推进完成" } },
      ] }),
    ],
    relations: [
      { id: "yomei-shotoku", source: "emperor-yomei", target: "prince-shotoku", kind: "parent-child", label: { ja: "父子", zh: "父子" }, note: { ja: "発願の遺志を継承", zh: "继承发愿遗志" } },
      { id: "suiko-shotoku", source: "empress-suiko", target: "prince-shotoku", kind: "collaboration", label: { ja: "共同創建", zh: "共同创建" }, certainty: "traditional" },
      { id: "shomu-gyoki", source: "emperor-shomu", target: "gyoki", kind: "collaboration", label: { ja: "造立事業で協働", zh: "共同推动造立" } },
      { id: "ganjin-nyoho", source: "ganjin", target: "nyoho", kind: "project-succession", label: { ja: "師弟・造営継承", zh: "师徒／继承营造" } },
    ],
    sources: [
      { label: { ja: "法隆寺｜伽藍・創建", zh: "法隆寺｜伽蓝与创建" }, href: "https://www.horyuji.or.jp/garan/" },
      { label: { ja: "法隆寺｜夢殿", zh: "法隆寺｜梦殿" }, href: "https://www.horyuji.or.jp/garan/yumedono/" },
      { label: { ja: "東大寺｜歴史", zh: "东大寺｜历史" }, href: "https://www.todaiji.or.jp/history/" },
      { label: { ja: "唐招提寺とは", zh: "唐招提寺简介" }, href: "https://www.toshodaiji.jp/about.html" },
    ],
  },
  {
    id: "heian-fujiwara",
    title: { ja: "平安｜藤原氏の父子と浄土建築", zh: "平安｜藤原氏父子与净土建筑" },
    period: { ja: "10世紀末〜11世紀", zh: "10世纪末—11世纪" },
    description: { ja: "道長から頼通へ、家族の権力・別業・信仰空間が受け継がれる流れを建築と結ぶ。", zh: "把道长到赖通之间的家族权力、别业与信仰空间传承同建筑对应起来。" },
    memoryHook: { ja: "道長＝法成寺、子の頼通＝父から譲られた別業を平等院へ。", zh: "道长＝法成寺；其子赖通＝把从父亲继承的别业改为平等院。" },
    width: 1040,
    height: 430,
    people: [
      person({ id: "fujiwara-no-michinaga", name: { ja: "藤原道長", zh: "藤原道长" }, years: "966–1028", role: "patron", roleLabel: { ja: "公卿・施主", zh: "公卿／施主" }, summary: { ja: "藤原氏全盛期を築き、晩年に法成寺を営んだ。", zh: "建立藤原氏全盛期，晚年营建法成寺。" }, x: 100, y: 100, buildings: [
        { id: "building-4f994bda4b8a", name: { ja: "法成寺", zh: "法成寺" }, relation: { ja: "造営", zh: "营建" } },
      ] }),
      person({ id: "fujiwara-no-yorimichi", name: { ja: "藤原頼通", zh: "藤原赖通" }, years: "992–1074", role: "patron", roleLabel: { ja: "公卿・施主", zh: "公卿／施主" }, summary: { ja: "父道長の別業を譲り受けて平等院を開創し、翌年に阿弥陀堂を建立。", zh: "继承父亲道长的别业后创建平等院，次年建立阿弥陀堂。" }, x: 650, y: 100, buildings: [
        { id: "building-c90fcc3d63b9", name: { ja: "平等院鳳凰堂", zh: "平等院凤凰堂" }, relation: { ja: "開創・阿弥陀堂建立", zh: "创建寺院／建立阿弥陀堂" } },
      ] }),
    ],
    relations: [
      { id: "michinaga-yorimichi", source: "fujiwara-no-michinaga", target: "fujiwara-no-yorimichi", kind: "parent-child", label: { ja: "父子", zh: "父子" }, note: { ja: "別業を譲渡", zh: "别业相传" } },
    ],
    sources: [
      { label: { ja: "平等院｜古今平等院", zh: "平等院｜历史" }, href: "https://www.byodoin.or.jp/learn/history/" },
    ],
  },
  {
    id: "medieval-monks",
    title: { ja: "中世｜僧侶と再建・新様式", zh: "中世｜僧侣、重建与新样式" },
    period: { ja: "12世紀末〜14世紀", zh: "12世纪末—14世纪" },
    description: { ja: "重源から栄西へ続く東大寺復興の大勧進と、夢窓疎石の禅寺・庭園文化を分けて読む。夢窓疎石をこの継承線に結ばないことも重要。", zh: "把重源到荣西的东大寺复兴与大劝进继承，同梦窗疏石的禅寺、庭园文化分开理解；不应把梦窗疏石强行接入这条继承线。" },
    memoryHook: { ja: "重源→栄西＝大勧進と復興事業の継承。夢窓疎石は別系統。", zh: "重源→荣西＝大劝进与复兴事业继承；梦窗疏石属于另一脉络。" },
    width: 1040,
    height: 820,
    people: [
      person({ id: "chogen", name: { ja: "重源", zh: "重源" }, years: "1121–1206", role: "monk", roleLabel: { ja: "僧侶・大勧進", zh: "僧侣／大劝进" }, summary: { ja: "1180年焼失後の東大寺復興を主導。大仏様を用いた復興建築と結びつく。", zh: "主导1180年烧毁后的东大寺复兴，与采用大佛样的复兴建筑相连。" }, x: 100, y: 100, buildings: [
        { id: "building-aeb9da82ed0e", name: { ja: "東大寺南大門", zh: "东大寺南大门" }, relation: { ja: "復興造営を主導", zh: "主导复兴营造" }, note: { ja: "現存鐘楼の直接の再建者は後継の栄西。", zh: "现存钟楼的直接重建者是继任大劝进荣西。" } },
        { id: "building-13b897c12c40", name: { ja: "浄土寺浄土堂", zh: "净土寺净土堂" }, relation: { ja: "大仏様の代表作", zh: "大佛样代表作" } },
      ] }),
      person({ id: "eisai", name: { ja: "栄西", zh: "荣西" }, years: "1141–1215", role: "monk", roleLabel: { ja: "僧侶・後継大勧進", zh: "僧侣／继任大劝进" }, summary: { ja: "重源の後に東大寺大勧進を継ぎ、承元年間に現存鐘楼を再建した。", zh: "在重源之后继任东大寺大劝进，于承元年间重建现存钟楼。" }, x: 100, y: 530, buildings: [
        { id: "building-aeb9da82ed0e", name: { ja: "東大寺鐘楼", zh: "东大寺钟楼" }, relation: { ja: "現存鐘楼を再建", zh: "重建现存钟楼" } },
      ] }),
      person({ id: "muso-soseki", name: { ja: "夢窓疎石", zh: "梦窗疏石" }, years: "1275–1351", role: "monk", roleLabel: { ja: "禅僧・開山", zh: "禅僧／开山" }, summary: { ja: "禅寺の開山・庭園文化に関わる人物。重源の東大寺復興とは別の系統で読む。", zh: "与禅寺开山及庭园文化相关，应与重源的东大寺复兴作为不同脉络理解。" }, x: 650, y: 100, buildings: [
        { id: "building-03bf35081e88", name: { ja: "永保寺開山堂", zh: "永保寺开山堂" }, relation: { ja: "開山を祀る建築", zh: "供奉开山的建筑" }, note: { ja: "建物の設計者という意味ではない。", zh: "并不表示他是建筑设计者。" } },
      ] }),
    ],
    relations: [
      { id: "chogen-eisai", source: "chogen", target: "eisai", kind: "project-succession", label: { ja: "大勧進・復興継承", zh: "继任大劝进／延续复兴" } },
    ],
    sources: [
      { label: { ja: "東大寺｜鎌倉再建", zh: "东大寺｜镰仓重建" }, href: "https://www.todaiji.or.jp/history/" },
      { label: { ja: "東大寺｜鐘楼", zh: "东大寺｜钟楼" }, href: "https://www.todaiji.or.jp/information/shoro/" },
    ],
  },
  {
    id: "muromachi-early-modern",
    title: { ja: "室町・近世初頭｜将軍家と宮家の二つの系譜", zh: "室町—近世初期｜将军家与宫家的两条谱系" },
    period: { ja: "14世紀末〜17世紀", zh: "14世纪末—17世纪" },
    description: { ja: "足利将軍家の北山・東山文化と、八条宮家の桂離宮造営を別レーンで比較する。", zh: "把足利将军家的北山、东山文化与八条宫家的桂离宫营造放在两条独立泳道比较。" },
    memoryHook: { ja: "義満→義教→義政は祖父・父・子。智仁→智忠は父子で桂離宮を継続造営。", zh: "义满→义教→义政为祖父、父、子；智仁→智忠为父子，持续营建桂离宫。" },
    width: 1260,
    height: 720,
    people: [
      person({ id: "ashikaga-yoshimitsu", name: { ja: "足利義満", zh: "足利义满" }, years: "1358–1408", role: "warrior", roleLabel: { ja: "3代将軍・造営主", zh: "三代将军／营建者" }, summary: { ja: "北山殿を造営。後の鹿苑寺・金閣の起点となる。", zh: "营建北山殿，成为后来鹿苑寺与金阁的起点。" }, x: 24, y: 82, buildings: [
        { id: "building-3f0cd8f82548", name: { ja: "鹿苑寺金閣", zh: "鹿苑寺金阁" }, relation: { ja: "北山殿を造営", zh: "营建北山殿" } },
      ] }),
      person({ id: "ashikaga-yoshinori", name: { ja: "足利義教", zh: "足利义教" }, years: "1394–1441", role: "warrior", roleLabel: { ja: "6代将軍・系譜上の中継", zh: "六代将军／谱系中间代" }, summary: { ja: "義満の子、義政の父。建築作品を無理に割り当てず、家系を正確につなぐために表示。", zh: "义满之子、义政之父。不强行附会建筑，仅用于准确呈现家系。" }, x: 334, y: 82, buildings: [] }),
      person({ id: "ashikaga-yoshimasa", name: { ja: "足利義政", zh: "足利义政" }, years: "1436–1490", role: "warrior", roleLabel: { ja: "8代将軍・造営主", zh: "八代将军／营建者" }, summary: { ja: "東山殿を造営し、祖父義満の金閣を参照して観音殿（銀閣）を計画。", zh: "营建东山殿，并参照祖父义满的金阁规划观音殿（银阁）。" }, x: 644, y: 82, buildings: [
        { id: "building-eb6c13c88e03", name: { ja: "慈照寺銀閣", zh: "慈照寺银阁" }, relation: { ja: "東山殿・観音殿を造営", zh: "营建东山殿／观音殿" } },
        { id: "building-7da3f3b68c2e", name: { ja: "慈照寺東求堂", zh: "慈照寺东求堂" }, relation: { ja: "持仏堂として造営", zh: "作为持佛堂营建" } },
      ] }),
      person({ id: "hachijo-toshihito", name: { ja: "八条宮智仁親王", zh: "八条宫智仁亲王" }, years: "1579–1629", role: "royal", roleLabel: { ja: "宮家初代・別業創建", zh: "宫家初代／创建别业" }, summary: { ja: "桂の地に宮家の別業を創建し、桂離宮造営の第一段階を担う。", zh: "在桂创建宫家别业，承担桂离宫营造的第一阶段。" }, x: 280, y: 410, buildings: [
        { id: "building-8ce5697c5787", name: { ja: "桂離宮", zh: "桂离宫" }, relation: { ja: "創建・初期造営", zh: "创建／初期营建" } },
      ] }),
      person({ id: "hachijo-toshitada", name: { ja: "八条宮智忠親王", zh: "八条宫智忠亲王" }, years: "1619–1662", role: "royal", roleLabel: { ja: "宮家2代・増築", zh: "宫家二代／扩建" }, summary: { ja: "父智仁の別業を受け継ぎ、建物と庭園を増築・整備。", zh: "继承父亲智仁的别业，扩建并整备建筑与庭园。" }, x: 700, y: 410, buildings: [
        { id: "building-8ce5697c5787", name: { ja: "桂離宮", zh: "桂离宫" }, relation: { ja: "継承・増築", zh: "继承／扩建" } },
      ] }),
    ],
    relations: [
      { id: "yoshimitsu-yoshinori", source: "ashikaga-yoshimitsu", target: "ashikaga-yoshinori", kind: "parent-child", label: { ja: "父子", zh: "父子" } },
      { id: "yoshinori-yoshimasa", source: "ashikaga-yoshinori", target: "ashikaga-yoshimasa", kind: "parent-child", label: { ja: "父子", zh: "父子" } },
      { id: "toshihito-toshitada", source: "hachijo-toshihito", target: "hachijo-toshitada", kind: "parent-child", label: { ja: "父子・造営継承", zh: "父子／继承营造" } },
      { id: "yoshimitsu-yoshimasa-culture", source: "ashikaga-yoshimitsu", target: "ashikaga-yoshimasa", kind: "family-succession", label: { ja: "北山→東山の文化的参照", zh: "北山→东山的文化参照" }, note: { ja: "直接の父子ではなく祖父と孫。", zh: "并非父子，而是祖父与孙子。" } },
    ],
    sources: [
      { label: { ja: "金閣寺｜鹿苑寺について", zh: "金阁寺｜鹿苑寺简介" }, href: "https://www.shokoku-ji.jp/kinkakuji/about/" },
      { label: { ja: "銀閣寺｜慈照寺について", zh: "银阁寺｜慈照寺简介" }, href: "https://www.shokoku-ji.jp/ginkakuji/about/" },
      { label: { ja: "宮内庁｜桂離宮", zh: "宫内厅｜桂离宫" }, href: "https://kyoto-gosho.kunaicho.go.jp/place/katsura" },
    ],
  },
];
