export type EnergyMode = "green" | "yellow" | "red";

export type PlanTask = {
  id: string;
  title: string;
  detail: string;
  minutes: number;
};

export type StudyDay = {
  date: string;
  phaseId: string;
  focus: string;
  rest?: boolean;
  tasks: PlanTask[];
};

export type PlanPhase = {
  id: string;
  dates: string;
  start: string;
  end: string;
  title: string;
  goal: string;
  deliverables: string[];
};

export const PLAN_PHASES: PlanPhase[] = [
  {
    id: "baseline",
    dates: "7月31日—8月2日",
    start: "2026-07-31",
    end: "2026-08-02",
    title: "摸清当前起点",
    goal: "用已有真题确认目前能做到哪里，固定答题模板和低刺激学习环境。",
    deliverables: ["五科各选一道已有真题摸底，并写下做不出的原因", "历史、计划、构法各一张答题模板", "8月2日完成起点整理，8月5日完整休息"],
  },
  {
    id: "output",
    dates: "8月3日—9日",
    start: "2026-08-03",
    end: "2026-08-09",
    title: "从看懂到能输出",
    goal: "让所有 1 分输出项先做到有固定框架可写，不追求漂亮。",
    deliverables: ["史/计/构各2篇日语答案，历史与构法各2张图", "环境补湿空气、照明并做3组小计算", "结构完成反力、内力图、桁架、截面各1组", "8月5日休息，8月8日完成90分钟混合模拟"],
  },
  {
    id: "retrieval",
    dates: "8月10日—16日",
    start: "2026-08-10",
    end: "2026-08-16",
    title: "真题题型化与闭卷提取",
    goal: "至少 60% 学习时间处于闭卷状态；错题隔2天、隔7天各重做一次。",
    deliverables: ["史/计/构各3篇日语答案", "环境与结构各4组混合题", "错题在2天、7天后闭卷重做", "8月15日完成半卷模拟"],
  },
  {
    id: "integration",
    dates: "8月17日—23日",
    start: "2026-08-17",
    end: "2026-08-23",
    title: "整卷转换",
    goal: "建立正式做题顺序，整卷完成率达到 70%，记录疲劳与过载出现时间。",
    deliverables: ["修补半卷最常见的5个错误", "完成一次跨科连续输出和一次计时计算组合", "8月22日第一次完整整卷", "只评价完成率、时间、状态与错因"],
  },
  {
    id: "stabilize",
    dates: "8月24日—28日",
    start: "2026-08-24",
    end: "2026-08-28",
    title: "稳定得分",
    goal: "停止大面积新增资料，只修高频错项和短期可转化为分数的内容。",
    deliverables: ["8月25日第二次完整整卷", "8月27日第三次完整整卷", "每科压缩为一张最终清单", "确定时间上限和跳题规则"],
  },
  {
    id: "taper",
    dates: "8月29日—9月1日",
    start: "2026-08-29",
    end: "2026-09-01",
    title: "减量与考试",
    goal: "保持提取通路和作息，不再扩张学习范围。",
    deliverables: ["8月29日完成90–120分钟选段模拟", "8月30日完整休息", "8月31日只看最终单页清单2–3小时", "确认用品、路线与允许携带物"],
  },
];

export const SUBJECT_ALLOCATIONS = [
  { label: "建筑史", hours: 28, target: "比较、论述、图示 1→3", color: "bg-violet-500" },
  { label: "建筑计划", hours: 27, target: "案例判读与日语论述→3", color: "bg-cyan-500" },
  { label: "建筑构法", hours: 26, target: "工序、节点图、过程说明→3", color: "bg-orange-500" },
  { label: "环境工学", hours: 20, target: "湿空气、照明、综合计算3–4", color: "bg-emerald-500" },
  { label: "结构力学", hours: 24, target: "基础题稳定，综合题写出主步骤", color: "bg-blue-500" },
  { label: "整卷与复盘", hours: 24, target: "时间策略、耐力、机动修补", color: "bg-rose-500" },
] as const;

export const ENERGY_MODES: Record<EnergyMode, { label: string; hours: string; description: string; color: string }> = {
  green: { label: "绿色 · 状态稳定", hours: "5–6h", description: "执行完整计划，可以做新知识和限时训练。", color: "border-emerald-300 bg-emerald-50 text-emerald-800" },
  yellow: { label: "黄色 · 负荷偏高", hours: "约3h", description: "只做一个主科＋一个短输出；不做整卷，不新增资料。", color: "border-amber-300 bg-amber-50 text-amber-800" },
  red: { label: "红色 · 过载/强烈情绪", hours: "0–60m", description: "停止计时、论述和新知识；降低刺激，必要时完全停止，次日不补偿。", color: "border-rose-300 bg-rose-50 text-rose-800" },
};

const STUDY_SLOT_FOCUS = ["", "建筑史 × 结构力学", "建筑计划 × 环境工学", "建筑构法 × 建筑史", "结构力学 × 建筑计划", "环境工学 × 建筑构法"];

// 8月5日起以周三为固定恢复日；考前的8月30日仍保留完整休息。
const REST_DATES = new Set(["2026-08-05", "2026-08-12", "2026-08-19", "2026-08-26", "2026-08-30"]);

// 每周仍保留五个常规学习模板：周三休息，周六用于模拟，周日承接第5个模板。
const STUDY_SLOT_BY_WEEKDAY: Partial<Record<number, number>> = { 0: 5, 1: 1, 2: 2, 4: 3, 5: 4 };

const DATE_FOCUS: Record<string, string> = {
  "2026-08-24": "整卷一订正",
  "2026-08-25": "第二次完整整卷",
  "2026-08-27": "第三次完整整卷",
  "2026-08-28": "最后系统复盘",
};

const PHASE_TASKS: Record<string, Record<number, Array<Omit<PlanTask, "id">>>> = {
  output: {
    1: [
      { title: "建筑史比较框架", detail: "闭卷做2组时代/样式比较，再对照补证据。", minutes: 135 },
      { title: "结构基础", detail: "完成反力与N/Q/M图一组，写出验算依据。", minutes: 105 },
      { title: "历史日语输出", detail: "按定义—特征—原因—实例写1篇200–300字答案。", minutes: 75 },
    ],
    2: [
      { title: "计划设施矩阵", detail: "住宅/教育文化中选一类，整理类型—动线—优缺点—案例。", minutes: 135 },
      { title: "环境薄弱公式", detail: "湿空气或照明：先闭卷列公式，再做1组小计算。", minutes: 105 },
      { title: "计划案例输出", detail: "按观察—判断—使用影响—评价写1篇。", minutes: 75 },
    ],
    3: [
      { title: "构法完整工序", detail: "RC/钢结构/基础中选一项，闭卷重建完整施工流程。", minutes: 135 },
      { title: "历史图示", detail: "画1张平面、剖面或构造示意并标注因果线索。", minutes: 105 },
      { title: "错题与短时图片维持", detail: "图片识别15分钟；错题写明是知识、想不起、日语、时间还是状态问题，再重做。", minutes: 75 },
    ],
    4: [
      { title: "结构基础", detail: "桁架或截面性质一组，保留阅卷可追踪步骤。", minutes: 135 },
      { title: "计划设施矩阵", detail: "医疗福利/办公商业中选一类，整理空间关系与案例。", minutes: 105 },
      { title: "计划短论述", detail: "限时完成1篇，另一颜色补缺后再次口述。", minutes: 75 },
    ],
    5: [
      { title: "环境综合小题", detail: "湿空气、照明与已会公式混合做1组。", minutes: 135 },
      { title: "构法节点与术语", detail: "画1张节点/工序图，并做一组易混术语辨析。", minutes: 105 },
      { title: "本周闭卷回收", detail: "只重做本周暴露的3个最大缺口。", minutes: 75 },
    ],
  },
  retrieval: {
    1: [
      { title: "建筑史真题", detail: "闭卷完成1组语群/识图与1篇比较论述。", minutes: 135 },
      { title: "结构混合题", detail: "反力、内力图、桁架混合，不按章节提示选择方法。", minutes: 105 },
      { title: "重做2天前和7天前的错题", detail: "重做到日期的错题；连续两次正确才移出重点列表。", minutes: 75 },
    ],
    2: [
      { title: "计划真题", detail: "标准值、案例判读和论述混合，至少60%时间闭卷。", minutes: 135 },
      { title: "环境混合计算", detail: "不看章节标题自行选公式、统一单位并验算。", minutes: 105 },
      { title: "日语答案重建", detail: "不抄标准答案，只补缺失句型后重新输出。", minutes: 75 },
    ],
    3: [
      { title: "构法真题", detail: "语群、材料数值与工序说明混合完成。", minutes: 135 },
      { title: "建筑史图示论述", detail: "图与200–300字答案互相对应。", minutes: 105 },
      { title: "重做2天前和7天前的错题", detail: "写明错误属于知识、想不起、日语、时间或状态问题，并安排下次日期。", minutes: 75 },
    ],
    4: [
      { title: "结构进阶混合", detail: "变形、超静定、屈曲中选2类，先判断方法再计算。", minutes: 135 },
      { title: "计划案例输出", detail: "闭卷完成一题图面/照片判读和一题短论述。", minutes: 105 },
      { title: "公式与标准提取", detail: "空白纸写出本周公式、单位和标准值。", minutes: 75 },
    ],
    5: [
      { title: "环境混合计算", detail: "完成一组限时综合题并标记慢点。", minutes: 135 },
      { title: "构法过程说明", detail: "限时画图并用编号步骤写出施工、性能和检查。", minutes: 105 },
      { title: "半卷准备", detail: "确认做题顺序、每段上限和黄色日降级方案。", minutes: 75 },
    ],
  },
  integration: {
    1: [
      { title: "修补半卷最常见的错误", detail: "只处理半卷中出现最多的2个知识、想不起、日语输出或时间问题。", minutes: 135 },
      { title: "结构计时组", detail: "在预设上限内完成，超时立即标记并进入下一题。", minutes: 105 },
      { title: "历史连续输出", detail: "识图后立即写比较答案，练习任务切换。", minutes: 75 },
    ],
    2: [
      { title: "计划限时组", detail: "案例、标准值、计算连续完成，记录每段耗时。", minutes: 135 },
      { title: "环境计时组", detail: "完成综合计算并检查单位和数量级。", minutes: 105 },
      { title: "整卷错题再测", detail: "不看解析重做最关键的3题。", minutes: 75 },
    ],
    3: [
      { title: "跨科连续输出", detail: "历史→计划→构法各一题，中途按正式规则切换。", minutes: 180 },
      { title: "图示与日语修正", detail: "只修影响得分的结构、术语和证据。", minutes: 75 },
      { title: "低输入回收", detail: "短时图片、术语、公式提取，不新增卡片。", minutes: 60 },
    ],
    4: [
      { title: "结构综合题", detail: "完成一题多小问，记录开始疲劳的时间点。", minutes: 150 },
      { title: "计划论述", detail: "限时完成并用四项rubric自评。", minutes: 90 },
      { title: "整卷策略", detail: "写出做题顺序、跳题点和检查时间。", minutes: 75 },
    ],
    5: [
      { title: "环境＋结构计时组合", detail: "连续完成两科计算，模拟后半段注意力。", minutes: 180 },
      { title: "构法短输出", detail: "完成1题过程说明和1张节点图。", minutes: 75 },
      { title: "整卷准备", detail: "布置低刺激环境、用品和恢复安排。", minutes: 60 },
    ],
  },
  stabilize: {
    1: [
      { title: "整卷错题闭卷重做", detail: "只处理第一次整卷中的高价值错题。", minutes: 180 },
      { title: "五科最终清单", detail: "开始压缩公式、案例、工序、比较轴和解题流程。", minutes: 90 },
      { title: "恢复性提取", detail: "低强度口述/空白纸提取，不开新资料。", minutes: 45 },
    ],
    2: [
      { title: "第二次完整整卷", detail: "严格正式时限；记录完成率、各科耗时与状态。", minutes: 240 },
      { title: "考后脱离", detail: "先恢复30分钟，只记录事实，不立即评价自己。", minutes: 30 },
      { title: "快速判断错因", detail: "只判断是知识、想不起、日语、时间或状态问题；详细订正留到明天。", minutes: 45 },
    ],
    3: [
      { title: "恢复性学习", detail: "总量最多4小时：订正第二卷最常见的5个错误。", minutes: 150 },
      { title: "最终清单压缩", detail: "删除低频内容，保留能在考场提取的线索。", minutes: 60 },
      { title: "重做2天前和7天前的错题", detail: "只做今天到日期的项目。", minutes: 30 },
    ],
    4: [
      { title: "第三次完整整卷", detail: "执行最终做题顺序、时间上限和跳题规则。", minutes: 240 },
      { title: "考后恢复", detail: "停止分数反刍，降低光线和信息输入。", minutes: 30 },
      { title: "事实记录", detail: "记录完成率、耗时和过载时间，明天再订正。", minutes: 45 },
    ],
    5: [
      { title: "最后系统复盘", detail: "订正第三卷，只保留反复出现的错误。", minutes: 150 },
      { title: "完成五科单页", detail: "每科一页，另加一页共通时间策略。", minutes: 105 },
      { title: "关闭新增入口", detail: "列出考后再学清单，本月不再打开。", minutes: 60 },
    ],
  },
};

const OVERRIDES: Record<string, Omit<StudyDay, "date">> = {
  "2026-07-31": { phaseId: "baseline", focus: "五科旧真题摸底", tasks: [
    { id: "sample", title: "五科各选一道已有真题摸底", detail: "这不是新的题型：从题库各选一道旧真题，不看答案先做10–30分钟，看看目前能做到哪里。", minutes: 180 },
    { id: "templates", title: "建立三张答题模板", detail: "历史、计划、构法各固定一套答案骨架。", minutes: 90 },
    { id: "environment", title: "固定学习环境", detail: "确定座位、灯光、降噪、桌面和休息方式。", minutes: 45 },
  ] },
  "2026-08-01": { phaseId: "baseline", focus: "完成摸底与降低启动难度", tasks: [
    { id: "finish-sample", title: "继续昨天没做完的五科旧真题摸底", detail: "“摸底题/基线题”就是题库里已有的过去问，不是新题。先不补知识，只记下做到哪里、用了多久。", minutes: 150 },
    { id: "error-codes", title: "给错题写明原因，并安排重做日期", detail: "每题只选一个主要原因：知识不会、看过但想不起、日语写不出、时间不够、当天状态影响。然后安排2天后和7天后重做。", minutes: 90 },
    { id: "materials", title: "给每科固定一个开始学习的页面", detail: "例如建筑史固定从“历史记忆库”开始。每科只选一个页面并记下来，以后不用临时找资料。", minutes: 60 },
  ] },
  "2026-08-02": { phaseId: "baseline", focus: "完成起点整理并进入学习状态", tasks: [
    { id: "finish-baseline", title: "完成剩余的摸底与记录", detail: "只补完还没做的学科；每科写下做到哪里、第一处卡点和实际用时，不在摸底过程中补知识。", minutes: 120 },
    { id: "priority-list", title: "确定本周最先处理的三个缺口", detail: "从低分且高权重项目中只选三个，分别写成“具体章节＋具体动作”，不要写成“整科都不会”。", minutes: 60 },
    { id: "open-paths", title: "实际走一次固定学习路径", detail: "打开探索页的五科学习路径；建筑史和结构力学各完成一次黄色“最低完成”，做完即可停止。", minutes: 90 },
    { id: "prepare-output", title: "准备8月3日的第一项任务", detail: "只打开明天要用的页面、纸和计时器，写下开始后的第一个小动作；不提前学习。", minutes: 30 },
  ] },
  "2026-08-08": { phaseId: "output", focus: "第一次90分钟混合模拟", tasks: [
    { id: "mock", title: "90分钟混合模拟", detail: "覆盖输出与计算；记录开始疲劳或过载的时间。", minutes: 90 },
    { id: "recover", title: "安静恢复", detail: "至少30分钟离开试卷，不立即计算总分。", minutes: 30 },
    { id: "review", title: "模拟订正", detail: "判断每题是知识、想不起、日语、时间或状态问题，选出下周最重要的5个错误。", minutes: 150 },
  ] },
  "2026-08-15": { phaseId: "retrieval", focus: "半卷模拟", tasks: [
    { id: "half-mock", title: "半卷/半时长模拟", detail: "执行预设顺序和跳题点，记录完成率。", minutes: 150 },
    { id: "recover", title: "安静恢复", detail: "30分钟内不讨论分数、不立即重做。", minutes: 30 },
    { id: "review", title: "半卷归因", detail: "找出最常见5个错误及过载触发因素。", minutes: 135 },
  ] },
  "2026-08-22": { phaseId: "integration", focus: "第一次完整整卷", tasks: [
    { id: "full-mock", title: "第一次完整整卷", detail: "严格正式时限；不会也留下公式、图示和关键词。", minutes: 240 },
    { id: "recover", title: "考后恢复", detail: "降低刺激，至少30分钟后再接触试卷。", minutes: 30 },
    { id: "facts", title: "只记录四项事实", detail: "完成率、各科耗时、过载出现时间，以及错误属于知识/想不起/日语/时间/状态中的哪类。", minutes: 45 },
  ] },
  "2026-08-29": { phaseId: "taper", focus: "最后一次选段模拟", tasks: [
    { id: "selected-mock", title: "90–120分钟选段模拟", detail: "只验证时间策略，不追求高强度整卷。", minutes: 105 },
    { id: "logistics", title: "考试物流确认", detail: "用品、路线、时间及允许携带物逐项确认。", minutes: 60 },
    { id: "final-list", title: "最终清单查缺", detail: "只修清单中的明显断点，不添加新页。", minutes: 60 },
  ] },
  "2026-08-31": { phaseId: "taper", focus: "轻量唤醒", tasks: [
    { id: "light-review", title: "五科单页轮转", detail: "史20m、计划30m、构法30m、环境30m、结构30m。", minutes: 140 },
    { id: "timing", title: "时间策略确认", detail: "看一遍做题顺序、上限、跳题和检查规则。", minutes: 20 },
    { id: "stop", title: "按时停止", detail: "不做新题、不做整卷、不熬夜订正。", minutes: 0 },
  ] },
  "2026-09-01": { phaseId: "taper", focus: "考试日", tasks: [
    { id: "single-pages", title: "只看最终单页", detail: "不打开大资料库，不临时扩张范围。", minutes: 30 },
    { id: "exam", title: "执行既定策略", detail: "按顺序、时间上限和跳题规则稳定完成。", minutes: 0 },
  ] },
};

function phaseFor(date: string) {
  return PLAN_PHASES.find((phase) => date >= phase.start && date <= phase.end) ?? PLAN_PHASES[0];
}

function makeStudyDays() {
  const days: StudyDay[] = [];
  const cursor = new Date("2026-07-31T00:00:00Z");
  const end = new Date("2026-09-01T00:00:00Z");
  while (cursor <= end) {
    const date = cursor.toISOString().slice(0, 10);
    const override = OVERRIDES[date];
    if (override) {
      days.push({ date, ...override });
    } else {
      const weekday = cursor.getUTCDay();
      const phase = phaseFor(date);
      if (REST_DATES.has(date)) {
        days.push({ date, phaseId: phase.id, focus: "完整休息24小时", rest: true, tasks: [
          { id: "rest", title: "完整休息", detail: "不补卡、不做题、不补偿欠账；只处理生活与恢复。", minutes: 0 },
        ] });
      } else {
        const studySlot = STUDY_SLOT_BY_WEEKDAY[weekday] ?? 1;
        const templates = PHASE_TASKS[phase.id]?.[studySlot] ?? [];
        days.push({
          date,
          phaseId: phase.id,
          focus: DATE_FOCUS[date] ?? STUDY_SLOT_FOCUS[studySlot],
          tasks: templates.map((task, index) => ({ ...task, id: `${phase.id}-${studySlot}-${index}` })),
        });
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

export const STUDY_DAYS = makeStudyDays();
