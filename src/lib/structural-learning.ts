export type MechanicsScale = "截面" | "构件" | "系统";

export type MechanicsConcept = {
  slug: string;
  symbol: string;
  name: string;
  nameJa: string;
  category: "输入" | "材料" | "截面" | "内力" | "变形" | "方法";
  unit: string;
  summary: string;
  intuition: string;
  relation: string;
  upstream: string[];
  downstream: string[];
  learned: string[];
};

export type FormulaStep = {
  label: string;
  formula: string;
  reason: string;
  check: string;
};

export type QuestionSubproblem = {
  id: string;
  title: string;
  titleJa: string;
  task: string;
  approach: string;
  steps: { label: string; explanation: string; formula?: string }[];
  answer: string;
  check: string;
  japanese: {
    task: string;
    approach: string;
    answer: string;
    examText: string;
  };
};

export type MechanicsQuestion = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  scale: MechanicsScale;
  accent: "amber" | "blue" | "teal";
  status: "已学完" | "复习中";
  source: string;
  originalImage: string;
  titleJa: string;
  subtitleJa: string;
  coreQuestionJa: string;
  coreQuestion: string;
  model: string;
  givens: string[];
  concepts: string[];
  route: string[];
  formulaSteps: FormulaStep[];
  subproblems: QuestionSubproblem[];
  insight: string;
  firstBlock: string;
  transfer: string;
  examChecklist: string[];
};

export type LearningStage = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  date: string;
  questionSlugs: string[];
  thesis: string;
  gains: { title: string; body: string }[];
  openQuestions: string[];
  next: string[];
};

export const mechanicsConcepts: MechanicsConcept[] = [
  {
    slug: "load",
    symbol: "P · Q",
    name: "外力与剪力",
    nameJa: "荷重・せん断力",
    category: "输入",
    unit: "N、kN",
    summary: "结构响应的外部起点；切开构件后，外力会被翻译为轴力、剪力和弯矩。",
    intuition: "先分清题目施加的外力 P，与截面内部为了平衡而出现的 Q、N、M。",
    relation: "外部作用 → 截面内力",
    upstream: [],
    downstream: ["moment", "shear-stress"],
    learned: ["tapered-cantilever", "composite-beam"],
  },
  {
    slug: "temperature",
    symbol: "ΔT · α",
    name: "温度输入",
    nameJa: "温度差・線膨張係数",
    category: "输入",
    unit: "K、1/K",
    summary: "温差和线膨胀系数共同决定材料想要发生的自由热应变。",
    intuition: "升温本身不会必然产生应力；只有自由变形受到约束后才产生内力。",
    relation: "εT = αΔT，ΔLT = αΔTL",
    upstream: [],
    downstream: ["strain", "compatibility"],
    learned: ["thermal-restraint"],
  },
  {
    slug: "youngs-modulus",
    symbol: "E",
    name: "杨氏模量",
    nameJa: "ヤング係数",
    category: "材料",
    unit: "N/mm²",
    summary: "描述材料在弹性阶段有多难被拉伸或压缩，不等同于强度。",
    intuition: "相同应变下，E 越大，应力越大；与 A、I 组合后才成为构件刚度。",
    relation: "σ = Eε；EA 抗轴向变形；EI 抗弯曲",
    upstream: ["strain"],
    downstream: ["stress", "flexibility", "curvature"],
    learned: ["composite-beam", "tapered-cantilever", "thermal-restraint"],
  },
  {
    slug: "area",
    symbol: "A",
    name: "截面积",
    nameJa: "断面積",
    category: "截面",
    unit: "L²",
    summary: "轴向受力与材料分配的基础几何量。",
    intuition: "A 表示有多少材料；与 E 组合为 EA 后决定轴向刚度。",
    relation: "σ = N/A；轴向柔度 f = L/(EA)",
    upstream: [],
    downstream: ["flexibility", "stress"],
    learned: ["composite-beam", "thermal-restraint"],
  },
  {
    slug: "second-moment",
    symbol: "I · I(x)",
    name: "截面二次矩",
    nameJa: "断面二次モーメント",
    category: "截面",
    unit: "L⁴",
    summary: "描述面积相对弯曲轴的分布，是截面几何抗弯能力。",
    intuition: "距离被平方，所以把材料放得离中立轴越远，对抗弯越有效。",
    relation: "I = ∫y²dA；κ = M/(EI)",
    upstream: ["area"],
    downstream: ["curvature", "flexibility", "section-modulus"],
    learned: ["composite-beam", "tapered-cantilever", "thermal-restraint"],
  },
  {
    slug: "section-modulus",
    symbol: "S · Ze · Zp",
    name: "截面量家族",
    nameJa: "断面一次・断面係数",
    category: "截面",
    unit: "L³",
    summary: "S 服务于剪应力，Ze 服务于弹性最外缘应力，Zp 服务于全塑性弯矩。",
    intuition: "单位虽然相同，几何定义和使用场景完全不同，不能互换。",
    relation: "τ = QS/(Ib)；σmax = M/Ze；Mp = σyZp",
    upstream: ["area", "second-moment"],
    downstream: ["stress", "shear-stress"],
    learned: ["composite-beam"],
  },
  {
    slug: "moment",
    symbol: "M(x)",
    name: "弯矩",
    nameJa: "曲げモーメント",
    category: "内力",
    unit: "力 × 长度",
    summary: "外力通过力臂在截面上形成的内部合力矩。",
    intuition: "先切开并看自由体，再决定力臂；不要凭梁的外形猜 M(x)。",
    relation: "悬臂塔从自由端量 x 时，M(x) = Px",
    upstream: ["load"],
    downstream: ["curvature", "stress"],
    learned: ["composite-beam", "tapered-cantilever"],
  },
  {
    slug: "stress",
    symbol: "σ",
    name: "正应力",
    nameJa: "垂直応力度",
    category: "内力",
    unit: "N/mm²",
    summary: "材料内部单位面积上的拉压作用，由内力、截面和材料状态共同决定。",
    intuition: "弹性复合梁共享一条应变线，但不同 E 会把它变成不同斜率的应力图。",
    relation: "σ = Eε；弯曲时 σ = My/I",
    upstream: ["youngs-modulus", "strain", "moment", "section-modulus"],
    downstream: [],
    learned: ["composite-beam"],
  },
  {
    slug: "shear-stress",
    symbol: "τ",
    name: "接着面剪应力",
    nameJa: "接着面せん断応力度",
    category: "内力",
    unit: "N/mm²",
    summary: "上下材料存在相对滑动趋势时，界面为了保持共同工作而传递的剪应力。",
    intuition: "目标不是整个截面的平均剪应力，而是指定接着面处的传力需求。",
    relation: "τ = QS/(Ib)",
    upstream: ["load", "section-modulus"],
    downstream: [],
    learned: ["composite-beam"],
  },
  {
    slug: "strain",
    symbol: "ε",
    name: "应变",
    nameJa: "ひずみ",
    category: "变形",
    unit: "无量纲",
    summary: "局部长度变化的比例，是从位移走向应力的桥梁。",
    intuition: "完全粘结并满足平截面假定时，复合材料共享连续的线性应变分布。",
    relation: "ε = ΔL/L；σ = Eε；εT = αΔT",
    upstream: ["temperature"],
    downstream: ["youngs-modulus", "stress"],
    learned: ["composite-beam", "thermal-restraint"],
  },
  {
    slug: "curvature",
    symbol: "κ → θ → w",
    name: "曲率、转角与位移",
    nameJa: "曲率・たわみ角・たわみ",
    category: "变形",
    unit: "1/L、rad、L",
    summary: "曲率描述局部弯曲，沿长度累积后成为转角和整体位移。",
    intuition: "κ 是每一小段弯得多急；积分是在把所有小段的贡献相加。",
    relation: "κ = M/(EI)，θ = ∫κdx，w = ∫θdx",
    upstream: ["moment", "youngs-modulus", "second-moment"],
    downstream: ["compatibility"],
    learned: ["tapered-cantilever", "thermal-restraint"],
  },
  {
    slug: "flexibility",
    symbol: "k ↔ f",
    name: "刚度与柔度",
    nameJa: "剛性・コンプライアンス",
    category: "方法",
    unit: "力/L、L/力",
    summary: "把不同构件翻译为同一种力—位移语言；柔度是单位力产生的位移。",
    intuition: "协调题中位移可以直接相加，因此用 δ = Pf 往往比刚度更直观。",
    relation: "杆 L/(EA)；弹簧 1/k；悬臂柱 a³/(3EI)",
    upstream: ["youngs-modulus", "area", "second-moment"],
    downstream: ["compatibility"],
    learned: ["thermal-restraint"],
  },
  {
    slug: "compatibility",
    symbol: "Σδ",
    name: "变形协调",
    nameJa: "変形の適合条件",
    category: "方法",
    unit: "L",
    summary: "连接在一起的构件必须在共同节点得到一致的实际位移。",
    intuition: "先写材料想发生的自由变形，再看它被各个构件的机械变形分掉多少。",
    relation: "自由热伸长 = P × 各构件柔度之和",
    upstream: ["temperature", "flexibility", "curvature"],
    downstream: [],
    learned: ["thermal-restraint"],
  },
];

export const mechanicsQuestions: MechanicsQuestion[] = [
  {
    slug: "composite-beam",
    number: "01",
    title: "复合材料矩形梁",
    subtitle: "从共同应变到弹性、塑性与接着面传力",
    scale: "截面",
    accent: "amber",
    status: "已学完",
    source: "《复合材料矩形梁｜整题详细讲解》",
    originalImage: "/structural-learning/originals/composite-beam-original.webp",
    titleJa: "複合材料矩形梁",
    subtitleJa: "共通ひずみから弾性・塑性・接着面の伝力へ",
    coreQuestionJa: "同一断面内で、異なる材料は曲げとせん断をどのように分担するか。",
    coreQuestion: "同一个截面内部，不同材料如何共同承担弯曲与剪切？",
    model: "两层材料完全粘结，弯曲后截面仍保持平面；先根据题目所处状态选择弹性应力分布、全塑性应力块或接着面剪切模型。",
    givens: ["两层材料的几何尺寸", "E₁、E₂ 与降伏应力", "弯矩 M 或剪力 Q", "接着面强度"],
    concepts: ["youngs-modulus", "area", "second-moment", "section-modulus", "strain", "stress", "shear-stress"],
    route: ["判断物理状态", "画共同应变线", "由材料关系得到应力", "用截面平衡定位中立轴", "选择 I / Ze / Zp / S", "检查应力或破坏"],
    formulaSteps: [
      { label: "共同变形", formula: "ε(y) 为直线", reason: "完全粘结且满足平截面假定，两层材料在界面处不能各自变形。", check: "界面处应变连续，但应力可能因 E 不同而跳变。" },
      { label: "弹性材料关系", formula: "σ = Eε", reason: "把同一条应变线转换成每种材料自己的应力分布。", check: "E 越大的材料在相同应变处承担更大应力。" },
      { label: "截面平衡", formula: "∫A σ dA = 0", reason: "纯弯曲截面的拉、压合力必须互相抵消。", check: "弹性中立轴由 E 加权；全塑性中立轴由 σyA 平衡。" },
      { label: "接着面传力", formula: "τ = QS / (Ib)", reason: "上下层具有相对滑动趋势，接着面必须传递纵向剪力。", check: "S 取目标接着面一侧面积对中立轴的一次矩。" },
    ],
    subproblems: [
      {
        id: "1-1", title: "图心、强轴与弱轴", titleJa: "図心・強軸・弱軸", task: "材料①和②材质相同，指出图心 C、通过图心的强轴 X 与弱轴 Y。", approach: "接着面不剥离、不滑动，且材料相同，因此先把两块 a×a 正方形视为一个 a×2a 的整体矩形。", steps: [
          { label: "合并截面", explanation: "整体关于水平接着面和竖直中心线都对称，图心就在接着面中央。" },
          { label: "比较离轴距离", explanation: "绕水平轴弯曲时竖向高度 2a 被三次方利用；绕竖直轴时垂直尺寸只有 a。", formula: "IX/IY = [a(2a)³]/[(2a)a³] = 4" },
        ], answer: "图心 C 位于接着面中央；水平图心轴 X 为强轴，竖直图心轴 Y 为弱轴。", check: "强弱轴看的是垂直于轴的材料分布，不是轴线自身看起来有多长。", japanese: { task: "図心 C、強軸 X、弱軸 Y を示す。", approach: "同材質で完全接着されているため、断面全体を a×2a の長方形として扱う。", answer: "図心 C は接着面中央、水平な X 軸が強軸、鉛直な Y 軸が弱軸である。", examText: "X 軸まわりでは軸に直交する寸法 2a が三乗で効くため、IX=4IY となる。" },
      },
      {
        id: "1-2", title: "I、弹性断面系数与塑性断面系数", titleJa: "I・弾性断面係数・塑性断面係数", task: "用 a 表示强轴 X 关于整体截面的 I、Ze 与 Zp。", approach: "先用整体矩形公式求 I，再分别用最外缘距离和全塑性应力块求 Ze、Zp。", steps: [
          { label: "截面二次矩", explanation: "宽 b=a，高 h=2a。", formula: "I = bh³/12 = a(2a)³/12 = 2a⁴/3" },
          { label: "弹性断面系数", explanation: "中立轴到最外缘距离 c=a。", formula: "Ze = I/c = 2a³/3" },
          { label: "塑性断面系数", explanation: "矩形可用 bh²/4，或把上下两块的面积×力臂相加。", formula: "Zp = a(2a)²/4 = a³" },
        ], answer: "I=2a⁴/3，Ze=2a³/3，Zp=a³。", check: "I 的量纲是 L⁴；Ze、Zp 是 L³。", japanese: { task: "強軸まわりの I、Ze、Zp を a で表す。", approach: "a×2a の長方形として基本公式を順に適用する。", answer: "I=2a⁴/3、Ze=2a³/3、Zp=a³。", examText: "I=bh³/12、Ze=I/c、Zp=bh²/4 より求める。" },
      },
      {
        id: "1-3", title: "接着面发生剪切破坏时的 Qmax", titleJa: "接着面せん断破壊時の Qmax", task: "接着面剪切强度为 Fs，求弹性范围内可承受的最大剪力。", approach: "接着面位于中立轴，梁剪应力不均匀，必须使用指定高度处的剪应力公式，而不是平均值 Q/A。", steps: [
          { label: "取接着面一侧", explanation: "上半块面积 A′=a²，其图心距中立轴 a/2。", formula: "S=A′ȳ=a³/2" },
          { label: "达到接着强度", explanation: "接着面宽度 b=a，代入上一问的 I。", formula: "Fs = Qmax S/(Ib)" },
          { label: "解出剪力", explanation: "整理公式。", formula: "Qmax = Fs·(2a⁴/3)·a /(a³/2) = 4Fsa²/3" },
        ], answer: "Qmax = 4Fsa²/3。", check: "S 是接着面一侧的断面一次矩；答案量纲必须为力。", japanese: { task: "接着面のせん断破壊強さ Fs から最大せん断力 Qmax を求める。", approach: "接着面位置の梁せん断応力度 τ=QS/(Ib) を用いる。", answer: "Qmax=4Fsa²/3。", examText: "S=a²·a/2=a³/2、τ=Fs とおけば Qmax=4Fsa²/3 となる。" },
      },
      {
        id: "2", title: "杨氏模量不同时的弹性中立轴", titleJa: "ヤング係数が異なる場合の弾性中立軸", task: "E₁>E₂ 且仅受强轴弯曲，判断弹性中立轴通过哪里并说明理由。", approach: "平截面假定使应变保持直线，但 σ=Eε 令材料①在相同应变下承担更大应力；纯弯曲轴力合力必须为零。", steps: [
          { label: "写弹性规则", explanation: "弹性中立轴是 E 加权图心。", formula: "yN = Σ(EiAiȳi)/Σ(EiAi)" },
          { label: "判断方向", explanation: "两块面积相同，E₁>E₂，所以加权图心向材料①移动。" },
        ], answer: "弹性中立轴位于材料①内部。", check: "若 E₁=E₂，应退化回接着面。", japanese: { task: "E₁>E₂ のとき弾性中立軸の位置を判定する。", approach: "純曲げでは軸力の合力が 0 であり、弾性中立軸は E 加重図心となる。", answer: "弾性中立軸は材料①内を通る。", examText: "同一ひずみに対して材料①の応力度が大きいため、中立軸は E の大きい材料①側へ移動する。" },
      },
      {
        id: "3", title: "降伏应力不同时的塑性中立轴", titleJa: "降伏応力度が異なる場合の塑性中立軸", task: "σy1>σy2 且仅受强轴弯曲，判断塑性中立轴通过哪里。", approach: "全塑性状态不再使用 E 加权；各区域成为 ±σy 的应力块，以拉压合力平衡确定位置。", steps: [
          { label: "假设在接着面", explanation: "此时两块面积相同，但 σy1a²>σy2a²，拉压合力不平衡。" },
          { label: "移动中立轴", explanation: "为了减小材料①原方向的降伏合力，中立轴必须移入强度更大的材料①。" },
        ], answer: "塑性中立轴位于材料①内部。", check: "塑性中立轴看 σyA，不使用 E。", japanese: { task: "σy1>σy2 のとき塑性中立軸の位置を判定する。", approach: "全塑性状態では ±σy の応力ブロックの合力を釣り合わせる。", answer: "塑性中立軸は材料①内を通る。", examText: "材料①の降伏合力を小さくする必要があるため、塑性中立軸は材料①側へ移動する。" },
      },
      {
        id: "4", title: "两种材料最外缘同时降伏", titleJa: "両材料の最外縁が同時に降伏", task: "E₁=2E₂ 时，求两材料同时在最外缘降伏所需的 σy1/σy2。", approach: "“刚刚同时降伏”之前仍是弹性状态，所以先用弹性中立轴，再由距离比得到应变比，最后乘 E 比得到应力比。", steps: [
          { label: "弹性中立轴", explanation: "E₁=2E₂、面积相同，得到中立轴偏入材料①；PDF 推导给出上下最外缘距离比 5:7。" },
          { label: "应变比", explanation: "平截面假定下应变与到中立轴距离成正比。", formula: "ε₁:ε₂ = 5:7" },
          { label: "应力比", explanation: "再用 σ=Eε。", formula: "σy1/σy2 = (E₁/E₂)(ε₁/ε₂)=2×5/7=10/7" },
        ], answer: "σy1/σy2 = 10/7。", check: "5/7 只是应变比，不能作为最终应力比。", japanese: { task: "E₁=2E₂ のとき、両最外縁が同時降伏する降伏応力度比を求める。", approach: "弾性中立軸から距離比、ひずみ比、応力度比の順に求める。", answer: "σy1/σy2=10/7。", examText: "ε₁/ε₂=5/7、σ=Eε より σy1/σy2=2·5/7=10/7。" },
      },
      {
        id: "5", title: "全塑性状态的轴力与弯矩", titleJa: "全塑性状態の軸力と曲げ", task: "材料①为拉伸侧、塑性中立轴在接着面，求同时作用的轴力 P。", approach: "这次存在外加轴力，所以拉压合力不必相等；两块全塑性应力块的代数和就是 P。", steps: [
          { label: "规定正负", explanation: "取拉伸为正、压缩为负。材料①应力 +σy，材料②应力 −2σy。" },
          { label: "合力代数和", explanation: "两块面积均为 a²。", formula: "P=(+σy)a²+(−2σy)a²=−σya²" },
        ], answer: "P=−σya²，即大小为 σya² 的压缩轴力。", check: "不要把拉力和压力的绝对值直接相加；答案必须注明压缩。", japanese: { task: "塑性中立軸が接着面を通るときの軸力 P を求める。", approach: "引張を正、圧縮を負として応力ブロックの合力を加える。", answer: "P=−σya²、すなわち大きさ σya² の圧縮力。", examText: "P=σya²−2σya²=−σya² であり、軸力は圧縮である。" },
      },
    ],
    insight: "最危险的不是算错，而是把不同状态的规则混用。几何、弹性、全塑性和接着面剪切必须先分流。",
    firstBlock: "一开始容易把 E、降伏应力和不同的截面系数都放进同一个计算过程，没有先判断题目正在讨论哪个物理状态。",
    transfer: "以后看到多材料、接着面、中立轴或降伏，应先问：共享的是什么——应变、应力，还是节点位移？",
    examChecklist: ["先写平截面假定或应力块状态", "中立轴规则与当前状态一致", "I 的高三次方向正确", "S 取接着面一侧", "强度与刚度没有混淆"],
  },
  {
    slug: "tapered-cantilever",
    number: "02",
    title: "变截面悬臂塔",
    subtitle: "把局部曲率沿长度累积为顶部位移",
    scale: "构件",
    accent: "blue",
    status: "已学完",
    source: "《变截面悬臂塔｜结构力学与积分详细复习》",
    originalImage: "/structural-learning/originals/tapered-cantilever-original.webp",
    titleJa: "変断面片持ち塔",
    subtitleJa: "局所曲率を積み上げて頂部変位を求める",
    coreQuestionJa: "断面性能が高さ方向に変化するとき、各微小区間の曲げが頂部たわみにどう寄与するか。",
    coreQuestion: "截面能力沿高度变化时，每一小段的弯曲如何共同形成顶部挠度？",
    model: "从自由端建立坐标 x，顶部 I、底部 αI 之间线性变化；在任意位置切开求 M(x)，再累加局部曲率对顶部的位移贡献。",
    givens: ["顶部集中力 P", "塔高 l", "顶部 I 与底部 αI", "杨氏模量 E"],
    concepts: ["load", "youngs-modulus", "second-moment", "moment", "curvature"],
    route: ["确认坐标方向", "线性插值得到 I(x)", "切面求 M(x)", "建立局部曲率", "写小段顶部位移贡献", "积分并做极限检查"],
    formulaSteps: [
      { label: "截面沿长度变化", formula: "I(x) = I[1 + (α−1)x/l]", reason: "题目给出两端 I 并说明中间线性变化。", check: "代入 x=0 得 I；代入 x=l 得 αI。" },
      { label: "切面平衡", formula: "M(x) = Px", reason: "从自由端到切面的力臂为 x。", check: "M(0)=0；固定端 M(l)=Pl。" },
      { label: "局部弯曲", formula: "dθ = M(x)dx / [EI(x)]", reason: "曲率是转角沿长度的变化率。", check: "M/EI 的单位必须是 1/长度。" },
      { label: "累积顶部位移", formula: "w(0)=∫₀ˡ M(x)x/[EI(x)] dx", reason: "小段转角 dθ 乘以它到塔顶的距离 x，就是该段对顶部位移的贡献。", check: "α→1 时回到 Pl³/(3EI)。" },
    ],
    subproblems: [
      { id: "1", title: "三种基本截面的截面二次矩", titleJa: "三つの基本断面の断面二次モーメント", task: "写出矩形、圆、正三角形关于图示 y 轴的 I。", approach: "I=∫z²dA 衡量面积离目标轴的分布；垂直于目标轴的尺寸进入高次方。", steps: [
        { label: "矩形", explanation: "宽 b、高 h，关于形心水平轴。", formula: "Iy=bh³/12" },
        { label: "圆", explanation: "直径为 b。", formula: "Iy=πb⁴/64" },
        { label: "正三角形", explanation: "由底边轴公式配合平行轴定理。", formula: "Iy=bh³/36" },
      ], answer: "矩形 bh³/12；圆 πb⁴/64；正三角形 bh³/36。", check: "矩形中垂直于目标轴的 h 取三次方。", japanese: { task: "長方形・円・正三角形の y 軸まわりの I を答える。", approach: "断面二次モーメントの基本式を用いる。", answer: "長方形 bh³/12、円 πb⁴/64、正三角形 bh³/36。", examText: "軸に直交する寸法が高次で効くことに注意する。" } },
      { id: "2", title: "建立沿高度变化的 I(x)", titleJa: "高さ方向に変化する I(x)", task: "顶部 I、底部 αI，中间线性变化，写成 x 的函数。", approach: "把任意量从起点值到终点值的总变化乘以已走比例 x/l。", steps: [
        { label: "线性插值", explanation: "起点 I(0)=I，终点 I(l)=αI。", formula: "I(x)=I+(αI−I)x/l=I[1+(α−1)x/l]" },
      ], answer: "I(x)=I[1+(α−1)x/l]。", check: "x=0 得 I；x=l 得 αI。", japanese: { task: "頂部 I、底部 αI の線形変化を x の関数で表す。", approach: "端点間を線形補間する。", answer: "I(x)=I[1+(α−1)x/l]。", examText: "I(0)=I、I(l)=αI を代入して確認する。" } },
      { id: "3", title: "弯矩 M(x) 与弯矩图", titleJa: "曲げモーメント M(x) と M 図", task: "顶部作用水平力 P，求距顶部 x 处的弯矩并画概形。", approach: "在 x 处切开，只看切口以上自由体，P 到切面的力臂就是 x。", steps: [
        { label: "切面平衡", explanation: "弯矩正负依教材约定，大小确定。", formula: "|M(x)|=Px" },
        { label: "画端点", explanation: "顶部为 0，固定端为 Pl，中间线性。" },
      ], answer: "M(x)=Px（或按符号约定写 −Px）；M 图为从 0 到 Pl 的三角形。", check: "顶部有力但力臂为零，所以 M(0)=0。", japanese: { task: "距離 x の断面の曲げモーメントと M 図を求める。", approach: "切断面より上側を自由物体として釣合いをとる。", answer: "|M(x)|=Px。M 図は頂部 0、固定端 Pl の三角形。", examText: "符号は採用する正負規約に従う。" } },
      { id: "4", title: "由局部曲率积分得到顶部挠度", titleJa: "局所曲率から頂部たわみを積分", task: "求顶部水平荷载 P 作用时的顶端挠度 w。", approach: "先把结构力学建模完成，再做无量纲代换和代数积分。每一小段的曲率先产生 dθ，再通过到顶部的距离 x 产生 dw。", steps: [
        { label: "局部贡献", explanation: "曲率×小段长度得到转角增量；转角增量×力臂得到顶部位移贡献。", formula: "dθ=M(x)dx/[EI(x)]，dwtop=x·dθ" },
        { label: "建立积分", explanation: "代入 M(x) 与 I(x)。", formula: "w=P/EI ∫₀ˡ x²/[1+(α−1)x/l] dx" },
        { label: "无量纲代换", explanation: "令 t=x/l、a=α−1，把长度尺度 l³ 提出。", formula: "w=Pl³/EI ∫₀¹ t²/(1+at) dt" },
        { label: "分式拆解", explanation: "先做多项式除法。", formula: "t²/(1+at)=t/a−1/a²+1/[a²(1+at)]" },
        { label: "积分结果", explanation: "第三项产生 ln。", formula: "w=Pl³/EI[1/(2a)−1/a²+ln(1+a)/a³]" },
        { label: "代回 α", explanation: "a=α−1。", formula: "w=Pl³/EI·[α²−4α+3+2lnα]/[2(α−1)³]" },
      ], answer: "w=Pl³/EI·[α²−4α+3+2lnα]/[2(α−1)³]；α→1 时为 Pl³/(3EI)。", check: "量纲为长度；α>1 时应比等截面梁更硬、挠度更小。", japanese: { task: "頂部水平荷重 P による頂部たわみ w を求める。", approach: "各微小区間の曲率による頂部変位への寄与を積分する。", answer: "w=Pl³/EI·[α²−4α+3+2lnα]/[2(α−1)³]。", examText: "w=∫₀ˡM(x)x/[EI(x)]dx とおき、t=x/l で無次元化する。α→1 では Pl³/(3EI) となる。" } },
    ],
    insight: "积分不是最后突然出现的计算技巧，而是把“局部曲率 × 小段 × 到目标点距离”的贡献全部相加。",
    firstBlock: "坐标从自由端开始比较反直觉，容易把固定端边界、力臂 x 与 l−x 写反；积分也曾经像一个没有物理意义的黑箱。",
    transfer: "以后看到 I、荷载或刚度沿长度变化，应先建立局部函数，再决定用积分、虚功或其他方法把局部响应累积为整体结果。",
    examChecklist: ["写清楚坐标原点", "I(x) 做两端检查", "M(x) 来自自由体而非猜测", "积分核每一项都有物理意义", "答案单位为长度", "α→1 做等截面检查"],
  },
  {
    slug: "thermal-restraint",
    number: "03",
    title: "温度应变与弹性约束",
    subtitle: "热杆、弹簧与悬臂柱的变形协调",
    scale: "系统",
    accent: "teal",
    status: "已学完",
    source: "《温度应变・弹簧约束・悬臂柱｜完整解析》",
    originalImage: "/structural-learning/originals/thermal-restraint-original.webp",
    titleJa: "温度ひずみ・ばね拘束・片持ち柱",
    subtitleJa: "自由熱変形を剛性と適合条件で配分する",
    coreQuestionJa: "材料が自由に伸びようとする変形は、有限剛性の複数部材によってどのように配分されるか。",
    coreQuestion: "材料想发生的自由热伸长，被多个有限刚度构件约束后如何分配？",
    model: "先把热杆完全释放，得到自由热伸长；再把杆、弹簧或悬臂柱统一写成柔度，在连接点写位移协调。",
    givens: ["线膨胀系数 α 与温差 ΔT", "热杆 E、A、L", "弹簧刚度 k", "悬臂柱 EI 与接触高度 a"],
    concepts: ["temperature", "strain", "youngs-modulus", "area", "second-moment", "curvature", "flexibility", "compatibility"],
    route: ["先求自由热变形", "判断约束与连接", "把各构件写成柔度", "建立变形协调式", "求约束力 P", "回代分配位移并检查极限"],
    formulaSteps: [
      { label: "自由状态", formula: "ΔLT = αΔTL", reason: "先确定材料在没有任何约束时想增加多少长度。", check: "完全自由时 P=0，但 ΔLT 不为零。" },
      { label: "统一构件语言", formula: "δ = Pf", reason: "杆、弹簧和悬臂柱都能翻译为单位力产生多少位移。", check: "杆 f=L/(EA)；弹簧 f=1/k；柱 f=a³/(3EI)。" },
      { label: "系统协调", formula: "αΔTL = P[L/(EA)+1/k]", reason: "自由热伸长被热杆机械压缩和弹簧变形共同吸收。", check: "换成柱约束时，将 1/k 替换为 a³/(3EI)。" },
      { label: "荷载点以上", formula: "uA = uB + θB·AB", reason: "B 点以上没有弯矩但会继承平移与转角，像刚臂继续放大位移。", check: "不要把无弯矩误解成无位移。" },
    ],
    subproblems: [
      { id: "1", title: "完全自由时的热伸长", titleJa: "完全自由時の熱伸び", task: "材料 S 从 20°C 升到 170°C，求升温后的长度。", approach: "先从温度—线应变图的斜率求 α，再用真正的温差 ΔT，而不是最终温度。", steps: [
        { label: "读取 α", explanation: "升温 100°C 时线应变增加 200×10⁻⁶。", formula: "α=200×10⁻⁶/100=2.0×10⁻⁶ /°C" },
        { label: "自由热应变", explanation: "ΔT=170−20=150°C。", formula: "εT=αΔT=3.0×10⁻⁴" },
        { label: "自由热伸长", explanation: "L=2000 mm。", formula: "ΔLT=εTL=0.60 mm" },
      ], answer: "Lafter=2000.60 mm=2.0006 m（伸长 0.60 mm）。", check: "自由状态 P=0、应力为零，但热应变不为零。", japanese: { task: "20°C から 170°C まで昇温した自由な部材 S の長さを求める。", approach: "図1の勾配から α を求め、自由熱伸びを計算する。", answer: "Lafter=2.0006 m（ΔL=0.60 mm）。", examText: "α=2.0×10⁻⁶/°C、ΔT=150°C より ΔL=αΔTL=0.60 mm。" } },
      { id: "2", title: "完全固定时反求杨氏模量", titleJa: "完全固定時のヤング係数", task: "两端完全固定，升温后产生 600 kN 压力，求 ES。", approach: "实际总伸长为零，因此机械压缩应变的大小等于自由热应变；再由 σ=P/A 与 E=σ/ε 求解。", steps: [
        { label: "热应变被完全压回", explanation: "εtotal=εT+εmech=0。", formula: "|εmech|=3.0×10⁻⁴" },
        { label: "求应力", explanation: "A=0.040 m²。", formula: "σ=P/A=600 kN/0.040 m²=15 MPa" },
        { label: "反求 E", explanation: "使用弹性材料关系。", formula: "ES=σ/ε=15/(3.0×10⁻⁴)=50 GPa" },
      ], answer: "ES=50 GPa=5.0×10⁴ N/mm²。", check: "完全固定是约束力最大的极限状态，实际伸长为零。", japanese: { task: "両端完全固定で 600 kN の圧縮力が生じるとき ES を求める。", approach: "機械ひずみの大きさが自由熱ひずみに等しいことを用いる。", answer: "ES=50 GPa。", examText: "σ=P/A=15 MPa、ε=αΔT=3.0×10⁻⁴ より E=σ/ε=50 GPa。" } },
      { id: "3", title: "弹簧约束下的力与实际伸长", titleJa: "ばね拘束時の力と実伸び", task: "上端通过刚度 5.0×10⁶ kN/m 的弹簧连接，求 S 中的力和长度变化。", approach: "自由热伸长被分成杆的机械压缩与弹簧压缩；两者承受同一个力 P。", steps: [
        { label: "杆轴向刚度", explanation: "统一使用 kN-mm。", formula: "kbar=EA/L=1000 kN/mm" },
        { label: "弹簧刚度", explanation: "单位换算。", formula: "kspring=5000 kN/mm" },
        { label: "协调", explanation: "自由热伸长=杆压缩+弹簧压缩。", formula: "0.60=P/1000+P/5000" },
        { label: "求解与分配", explanation: "P=500 kN；杆机械压缩 0.50 mm，实际仍伸长 0.10 mm。" },
      ], answer: "S 中为 500 kN 压力；实际长度变化 +0.10 mm。", check: "P 必须在自由状态 0 和完全固定 600 kN 之间；实际伸长在 0～0.60 mm。", japanese: { task: "ばね拘束時の部材 S の力と長さ変化を求める。", approach: "自由熱伸びを部材の弾性圧縮とばね圧縮に配分する。", answer: "圧縮力 500 kN、部材 S の実伸び +0.10 mm。", examText: "0.60=P/1000+P/5000 より P=500 kN。実伸びはばね変形と同じ 0.10 mm。" } },
      { id: "4", title: "悬臂柱 B 点受力时的 A 点位移", titleJa: "B 点載荷時の A 点変位", task: "B 点受 30 kN 水平力，求 A 点 X 方向位移。", approach: "只有 CB 段弯曲；AB 段无弯矩但会继承 B 点平移和转角，因此 A 点位移=平移+转动放大。", steps: [
        { label: "中空截面 I", explanation: "外边长 300 mm、内边长 290 mm。", formula: "I=(300⁴−290⁴)/12=8.56×10⁷ mm⁴" },
        { label: "B 点平移", explanation: "CB=a=2000 mm。", formula: "uB=Pa³/(3EI)=0.467 mm" },
        { label: "B 点转角", explanation: "也可用 θB=3uB/(2a)。", formula: "θB=Pa²/(2EI)=3.50×10⁻⁴ rad" },
        { label: "A 点位移", explanation: "AB=1000 mm。", formula: "uA=uB+θB·AB=0.818 mm" },
      ], answer: "uA=+0.82 mm。", check: "AB 无弯矩不等于无位移；它像刚臂随 B 点平移和转动。", japanese: { task: "B 点に 30 kN が作用するとき A 点の X 方向変位を求める。", approach: "CB を長さ 2 m の片持ち梁として解き、AB の剛体回転分を加える。", answer: "uA=+0.82 mm。", examText: "uB=Pa³/(3EI)、θB=Pa²/(2EI)、uA=uB+θB·AB より求める。" } },
      { id: "5", title: "热杆推动悬臂柱", titleJa: "熱膨張部材が片持ち柱を押す場合", task: "S 升温并在 B 点推动柱 C，求 A 点 X 方向位移。", approach: "这是第（3）问与第（4）问的合并：把弹簧柔度换成柱 B 点的弯曲柔度，再写共同节点协调。", steps: [
        { label: "热杆柔度", explanation: "沿用前面 kbar=1000 kN/mm。", formula: "fS=L/(EA)=0.00100 mm/kN" },
        { label: "柱 B 点柔度", explanation: "复用第（4）问 30 kN 产生 0.467 mm。", formula: "fC=uB/P=0.467/30=0.0156 mm/kN" },
        { label: "协调求力", explanation: "自由热伸长=杆压缩+B 点位移。", formula: "0.60=P(fS+fC) ⇒ P=36.2 kN" },
        { label: "B、A 点位移", explanation: "uB=PfC=0.564 mm；本题几何 uA=1.75uB。", formula: "uA=0.987≈0.99 mm" },
      ], answer: "uA=+0.99 mm。", check: "杆压缩 0.0362 mm + B 点位移 0.564 mm = 0.600 mm；A 因转角放大可大于 0.60 mm。", japanese: { task: "部材 S の熱膨張が柱 C を押すとき A 点変位を求める。", approach: "部材 S の軸柔度と柱 B 点の曲げ柔度を直列に扱い、適合条件を立てる。", answer: "uA=+0.99 mm。", examText: "0.60=P[fS+fC] より P=36.2 kN、uB=0.564 mm、uA=1.75uB=0.99 mm。" } },
    ],
    insight: "热杆＋弹簧与热杆＋悬臂柱在数学上是同一题：自由变形等于约束力乘以所有参与构件的柔度之和。",
    firstBlock: "变量突然变多时，容易分别背杆、弹簧和柱的公式，却看不到它们都只是同一连接点协调式里的柔度项。",
    transfer: "以后遇到支座沉降、装配误差、预应变或弹性支承，也可以先找自由变形，再用刚度或柔度写协调。",
    examChecklist: ["第一步写自由热伸长", "自由升温与受约束后的应力分开", "所有柔度单位一致", "协调式方向约定清楚", "结果位于自由与完全固定两个极限之间", "回代检查变形总和"],
  },
];

export const learningStages: LearningStage[] = [
  {
    slug: "stage-01-section-to-system",
    number: "01",
    title: "从截面到结构系统",
    subtitle: "用三道过去问建立第一张结构力学地图",
    date: "2026.07",
    questionSlugs: ["composite-beam", "tapered-cantilever", "thermal-restraint"],
    thesis: "三道题不是三个孤岛，而是分别站在截面、构件和系统三个分析尺度上。共同主线是：外部原因经过材料、截面与约束，被翻译成内力和局部变形，再通过积分或协调成为整体结果。",
    gains: [
      { title: "先判断分析尺度", body: "横跨截面看材料分布，沿长度看局部量累积，跨构件看连接点协调。先定位尺度，比先找公式可靠。" },
      { title: "公式是一条有方向的链", body: "每个公式都有输入、输出与适用状态。E、I、M、κ、θ、w 不是平面表格，而是从原因走向结果的路径。" },
      { title: "积分与协调是两种汇总方式", body: "构件题把沿长度的无数小段贡献积分起来；系统题让连接在一起的构件位移彼此相容。" },
      { title: "检查也是解题的一部分", body: "两端值、量纲、等截面极限、自由与完全固定极限，可以在没有标准答案时保护计算。" },
    ],
    openQuestions: ["单位荷载法与这里的“小段贡献”是什么关系？", "不静定结构中的协调与热约束协调如何统一？", "从截面屈服发展到结构塑性铰，需要增加哪一层模型？"],
    next: ["继续从过去问补充梁与骨架的 M/Q 图", "把单位荷载法接到位移计算链", "遇到新题时优先复用已有物理量节点"],
  },
];

export const flowGroups = [
  { label: "外部原因", slugs: ["load", "temperature"] },
  { label: "材料与截面", slugs: ["youngs-modulus", "area", "second-moment", "section-modulus"] },
  { label: "内力与应力", slugs: ["moment", "stress", "shear-stress"] },
  { label: "局部变形", slugs: ["strain", "curvature"] },
  { label: "累积与协调", slugs: ["flexibility", "compatibility"] },
] as const;

export function getMechanicsQuestion(slug: string) {
  return mechanicsQuestions.find((question) => question.slug === slug);
}

export function getMechanicsConcept(slug: string) {
  return mechanicsConcepts.find((concept) => concept.slug === slug);
}

export function getLearningStage(slug: string) {
  return learningStages.find((stage) => stage.slug === slug);
}

export function getQuestionsForConcept(slug: string) {
  return mechanicsQuestions.filter((question) => question.concepts.includes(slug));
}
