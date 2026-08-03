export type AssessmentItem = {
  id: string;
  title: string;
  description: string;
  evidence: string;
};

export type AssessmentSection = {
  id: string;
  title: string;
  japaneseTitle: string;
  icon: string;
  color: string;
  scope: string;
  optional?: boolean;
  items: AssessmentItem[];
};

export const EXAM_DATE = "2026-09-01";

export const ASSESSMENT_SCALE = [
  { score: 1, short: "不熟悉", detail: "几乎想不起来，需要从头学习" },
  { score: 2, short: "听说过", detail: "看答案能理解，但不能独立作答" },
  { score: 3, short: "基本会", detail: "普通题能做，但不稳定或容易混淆" },
  { score: 4, short: "较熟练", detail: "多数真题能独立完成，偶有遗漏" },
  { score: 5, short: "已掌握", detail: "能限时、闭卷、用日语准确作答" },
] as const;

export const ASSESSMENT_SECTIONS: AssessmentSection[] = [
  {
    id: "history",
    title: "建筑史",
    japaneseTitle: "建築史",
    icon: "🏛️",
    color: "violet",
    scope: "専門1 的图片识别与语群匹配，以及専門2-2 的比较论述和作图。",
    items: [
      { id: "history-japan-premodern", title: "日本古代—近世建筑", description: "寺院、神社、住宅、城郭与茶室的时代顺序、平面、构造和样式特征。", evidence: "能区分神明造、春日造、寝殿造、书院造等，并举代表实例。" },
      { id: "history-west-pre-modern", title: "西洋古代—近世建筑", description: "古希腊、罗马、早期基督教、罗曼、哥特、文艺复兴、巴洛克与古典主义。", evidence: "看到图像或平面，能说出时代、样式、结构线索和代表建筑。" },
      { id: "history-japan-modern", title: "日本近现代建筑", description: "明治西化、近代主义传入、战后发展及日本建筑师谱系。", evidence: "能把建筑、建筑师、年代、思潮与社会背景连接起来。" },
      { id: "history-modern-global", title: "欧美现代与当代建筑", description: "工艺美术、新艺术、现代主义各流派、后现代及当代重要趋势。", evidence: "能区分相近流派，并列举人物、作品和关键主张。" },
      { id: "history-visual", title: "图片识别与语群匹配", description: "由照片、立面、平面或局部识别建筑名、建筑师、时代、样式和术语。", evidence: "面对陌生裁切图，也能用可见特征判断，而不是只靠熟悉的整图。" },
      { id: "history-comparison", title: "比较与因果解释", description: "从材料、结构、空间、社会与技术背景比较两种样式或两个建筑。", evidence: "能说明“不只是什么，还包括为什么”，并给出具体建筑证据。" },
      { id: "history-essay", title: "日语限字论述", description: "用日语在指定字数内写出定义—背景—特征—实例的完整答案。", evidence: "能闭卷在 15–20 分钟内完成 200–300 字，并自查专有名词。" },
      { id: "history-diagram", title: "图示与标注", description: "用简洁平面、剖面或构造示意支持历史论述。", evidence: "图能表达关键空间/构造差异，标注与正文互相对应。" },
    ],
  },
  {
    id: "planning",
    title: "建筑计划",
    japaneseTitle: "建築計画",
    icon: "📐",
    color: "cyan",
    scope: "専門1 的标准值、案例判断与计算，以及専門2-2 的设施计划和案例论述。",
    items: [
      { id: "planning-housing", title: "住宅与集合住宅", description: "住宅平面史、住户类型、集合形式、生活行为、公共与私密空间。", evidence: "能由平面判断类型，并结合时代、家庭结构与生活方式解释。" },
      { id: "planning-education-culture", title: "教育与文化设施", description: "学校、图书馆、博物馆、美术馆、剧场等的类型、动线和代表案例。", evidence: "能比较不同平面类型的适用条件、优缺点与运营影响。" },
      { id: "planning-health-welfare", title: "医疗与福利设施", description: "医院、病房、养老与照护设施的单元、服务动线和使用者需求。", evidence: "能从患者/住户、访客、工作人员三方解释空间安排。" },
      { id: "planning-office-commercial", title: "办公、商业与住宿设施", description: "办公楼、商店、酒店等的核心、模数、后勤、避难与可变性。", evidence: "能由平面或断面识别类型，并说明其效率和限制。" },
      { id: "planning-dimensions", title: "人体尺度、无障碍与标准值", description: "常考尺寸、面积、容量、坡度、通路与设备数量等基准。", evidence: "不只记数值，也知道适用对象、条件、单位和容易混淆的相邻值。" },
      { id: "planning-zoning", title: "动线、分区与面积计划", description: "功能关系、面积配分、服务圈、邻接、流线分离和弹性。", evidence: "能把文字条件转成关系图或面积表，并解释取舍。" },
      { id: "planning-urban", title: "城市、地域与理论", description: "城市形态、设施配置、景观、保存、重要理论著作与案例。", evidence: "能将理论概念对应到具体空间现象或城市案例。" },
      { id: "planning-calculation", title: "计划类数值计算", description: "电梯交通、停车、规模与容量等典型计算。", evidence: "能独立选公式、统一单位、检查数量级，并在限时内算完。" },
      { id: "planning-case-reading", title: "图面/照片与案例判读", description: "从图像提取组织、动线、结构、采光与使用方式等证据。", evidence: "能按“观察—判断—理由—效果”作答，不凭印象写案例介绍。" },
      { id: "planning-essay", title: "日语比较论述与设计说明", description: "定义概念、比较方案、说明设施计划过程及其社会背景。", evidence: "能在限字内用明确比较轴组织答案，并配合关系图或示意图。" },
    ],
  },
  {
    id: "construction",
    title: "建筑构法",
    japaneseTitle: "建築構法",
    icon: "🧱",
    color: "orange",
    scope: "専門1 的材料数值、语群填空和构法辨析，以及専門2-2 的施工过程说明。",
    items: [
      { id: "construction-timber", title: "木构造与木质材料", description: "传统/现代木构法、接合、壁体、木材与工程木产品。", evidence: "能区分在来、枠组壁、CLT、集成材等的受力、施工与适用场景。" },
      { id: "construction-rc", title: "钢筋混凝土构法", description: "钢筋、模板、配合、浇筑、养护、接头、裂缝与耐久。", evidence: "能按施工顺序解释，并区分相近部材、缺陷、试验和处理方法。" },
      { id: "construction-steel", title: "钢结构构法", description: "钢材、柱梁、螺栓、焊接、节点、耐火与施工精度。", evidence: "能读节点图，说明连接方式、检查项目与常见缺陷。" },
      { id: "construction-ground", title: "地基、基础与地下施工", description: "土质调查、基础类型、桩、山留、排水与地下工程。", evidence: "能根据地盘和施工条件选择工法，并解释风险与监测。" },
      { id: "construction-envelope", title: "外墙、屋面与开口部", description: "幕墙、防水、密封、门窗、玻璃、隔热与变形追随。", evidence: "能从节点说明雨水路径、排水、热桥、接缝与层次关系。" },
      { id: "construction-interior", title: "内装、饰面与设备协调", description: "湿式/干式饰面、地面、吊顶、隔墙及设备和防火区划配合。", evidence: "能辨认常见做法，并说出基层、固定、收口和性能要求。" },
      { id: "construction-properties", title: "材料性质与常考数值", description: "密度、强度、弹性、热膨胀、允许应力等数量级和比较。", evidence: "能选对数值、单位和大小关系，并说明材料差异的原因。" },
      { id: "construction-process", title: "施工顺序、质量与安全", description: "从准备到验收的工序、检查、试验、误差与现场安全。", evidence: "能把零散术语排成正确流程，并指出每一步控制什么。" },
      { id: "construction-wordbank", title: "语群填空与易混术语辨析", description: "由施工情境或定义选择唯一技术术语，排除同域干扰项。", evidence: "能说出两个相似词的判别轴，而不是只背各自定义。" },
      { id: "construction-essay", title: "构造图与日语过程论述", description: "画节点/工序图，比较工法并说明选型、施工和性能。", evidence: "能用编号步骤和图示在限时内写出可施工、可检查的答案。" },
    ],
  },
  {
    id: "environment",
    title: "建筑环境工学",
    japaneseTitle: "建築環境工学",
    icon: "🌤️",
    color: "emerald",
    scope: "専門1 高频数值计算、公式补全、现象—术语匹配和正误判断。",
    items: [
      { id: "environment-thermal", title: "传热、隔热与热负荷", description: "热传导/对流/辐射、热阻与热贯流、周期热、负荷构成。", evidence: "能画热流路径，选公式，处理面积和温差，并判断结果数量级。" },
      { id: "environment-moisture", title: "湿空气与结露", description: "绝对/相对湿度、露点、湿空气线图、表面/内部结露。", evidence: "能从状态变化判断结露位置，并完成湿度相关计算。" },
      { id: "environment-solar", title: "日照、日射与采光", description: "太阳位置、遮阳、日影、昼光率、采光与眩光。", evidence: "能读太阳路径/遮阳图，区分日照与采光指标并正确计算。" },
      { id: "environment-ventilation", title: "通风、换气与室内空气", description: "风力/温差通风、压差、换气量、CO₂稳态收支和污染物。", evidence: "能选有效开口和压力关系，并用单位一致的公式求必要换气量。" },
      { id: "environment-lighting", title: "照明与视觉", description: "光通量、光强、照度、亮度、反射率、照明计算与色彩。", evidence: "能区分物理量、符号与单位，并处理距离平方等关系。" },
      { id: "environment-acoustics", title: "声环境", description: "声压级、合成/衰减、吸声、混响、隔声与噪声评价。", evidence: "能进行 dB 运算和混响计算，并区分吸声与隔声措施。" },
      { id: "environment-energy", title: "空调、被动设计与能源", description: "空调方式、舒适指标、气候响应、节能与环境评价。", evidence: "能把系统或策略与气候、负荷、控制范围和适用条件对应。" },
      { id: "environment-formulas", title: "公式、单位与物理量", description: "核心公式的含义、适用条件、指数、换算和量纲检查。", evidence: "不给公式也能写出；给公式能认出物理量，并通过量纲发现错误。" },
      { id: "environment-phenomena", title: "现象—术语与正误判断", description: "由现象描述识别术语，判断陈述成立的条件与例外。", evidence: "能指出错误陈述具体错在哪个条件，而不只凭语感选答案。" },
      { id: "environment-speed", title: "限时综合计算", description: "在连续小问中快速读取条件、列式、计算、舍入并回查。", evidence: "一组真题能按考试时间完成，且单位、有效数字和抄写错误可控。" },
    ],
  },
  {
    id: "structure",
    title: "结构力学（独立线）",
    japaneseTitle: "構造力学",
    icon: "⌁",
    color: "blue",
    scope: "题库中存在该科过去问，但当前四科正式模拟系统未纳入；若考试需要，请一起评分。",
    optional: true,
    items: [
      { id: "structure-statics", title: "受力图、平衡与支座反力", description: "把结构简化为正确模型，画自由体图并列平衡方程。", evidence: "能独立判断支座、荷载、正负号与反力数目。" },
      { id: "structure-diagrams", title: "轴力、剪力与弯矩图", description: "静定梁、刚架的内力求解及 N/Q/M 图。", evidence: "能由荷载关系快速画图，并用跳跃、斜率和边界条件检查。" },
      { id: "structure-truss", title: "桁架", description: "节点法、截面法、零杆判断及拉压性质。", evidence: "能选择较短解法，并检查整体平衡和杆力符号。" },
      { id: "structure-section", title: "截面性质与应力", description: "形心、截面二次矩、弯曲/剪切/轴向应力。", evidence: "能处理组合截面、平行轴定理、单位次方和应力分布。" },
      { id: "structure-deformation", title: "变形与能量法", description: "曲率、挠度、转角、虚功/单位荷载法和能量。", evidence: "能选择方法、写出 EI 关系，并正确处理分段积分。" },
      { id: "structure-indeterminate", title: "超静定结构", description: "力法、位移法或相容条件下的反力与内力。", evidence: "能识别超静定次数，建立相容条件并解释约束作用。" },
      { id: "structure-buckling", title: "压杆稳定与屈曲", description: "Euler 屈曲、有效长度、细长比和边界条件。", evidence: "能由支承条件选长度系数，算临界荷载并解释参数影响。" },
      { id: "structure-dynamics", title: "振动与地震反应", description: "单自由度、周期、刚度/质量/阻尼及基本地震响应。", evidence: "能读懂模型和谱/响应关系，说明各参数改变后的趋势。" },
      { id: "structure-speed", title: "综合题解题与验算", description: "把多小问串联，管理时间并用物理直觉、量纲和极限情况验算。", evidence: "能在规定时间内写出阅卷可追踪的步骤，而不是只得到数值。" },
    ],
  },
  {
    id: "exam-execution",
    title: "共通应试能力",
    japaneseTitle: "共通試験スキル",
    icon: "⏱️",
    color: "rose",
    scope: "跨学科的日语输出、时间分配、审题和复盘能力，会直接影响知识能否变成分数。",
    items: [
      { id: "exam-japanese", title: "日语读题与专业表达", description: "快速读懂限定词，并准确写出术语、连接词和因果关系。", evidence: "不会因为中文理解正确却用日语表达含糊而丢关键点。" },
      { id: "exam-recall", title: "闭卷提取", description: "不看笔记，从图片、题干或关键词主动提取答案。", evidence: "复习主要靠作答与回忆，而不是反复阅读产生熟悉感。" },
      { id: "exam-timing", title: "整卷时间分配", description: "按分值和强弱项安排做题顺序、跳题点与检查时间。", evidence: "至少完成过两次严格计时整卷，并有稳定的分段时间目标。" },
      { id: "exam-instructions", title: "审题与答案格式", description: "识别“选择、说明、比较、图示、字数、单位、选几题”等要求。", evidence: "能在动笔前圈出任务、对象、限制和所需证据。" },
      { id: "exam-review", title: "错题归因与再测", description: "区分知识缺口、辨析错误、计算失误、表达问题和时间问题。", evidence: "每次错题都有下一次可执行动作，并在间隔后闭卷重做。" },
      { id: "exam-stamina", title: "专注与考试耐力", description: "在真实时段、纸笔和时长下维持稳定输出。", evidence: "整卷后半段的速度、字迹和判断质量不会明显崩溃。" },
    ],
  },
];

export const TOTAL_ASSESSMENT_ITEMS = ASSESSMENT_SECTIONS.reduce(
  (total, section) => total + section.items.length,
  0,
);
