"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ENERGY_MODES,
  PLAN_PHASES,
  STUDY_DAYS,
  SUBJECT_ALLOCATIONS,
  type EnergyMode,
} from "@/lib/month-study-plan";

type DailyRecord = {
  energy?: EnergyMode;
  completed: string[];
  stepCompleted?: Record<string, string[]>;
  hours: string;
  closedBook: string;
  outputs: string;
  note: string;
};

type WeeklyRecord = {
  mockCompletion: string;
  mainErrors: string;
  sensoryTriggers: string;
  nextChanges: string;
};

type StoredPlan = {
  days: Record<string, DailyRecord>;
  weeks: Record<string, WeeklyRecord>;
};

const PLAN_STORAGE_KEY = "past-question-month-study-plan-v1";
const EMPTY_DAY: DailyRecord = { completed: [], hours: "", closedBook: "", outputs: "", note: "" };
const EMPTY_WEEK: WeeklyRecord = { mockCompletion: "", mainErrors: "", sensoryTriggers: "", nextChanges: "" };

function taipeiDateKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function shortDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function daysUntilExam(dateKey: string) {
  const current = new Date(`${dateKey}T00:00:00Z`);
  const exam = new Date("2026-09-01T00:00:00Z");
  return Math.max(0, Math.round((exam.getTime() - current.getTime()) / 86_400_000));
}

function taskGuide(task: { id: string; title: string; detail: string }) {
  if (task.id === "finish-sample" || task.id === "sample") return {
    minimum: "只选1科、1道题，不看答案做10分钟；写下做到哪。做到这里就可以停。",
    steps: ["打开网站的“试题库”，任选最近年份的一道旧真题", "准备纸笔，设10–30分钟计时", "不查资料先做；不会的地方留空或写关键词", "停止后记录用时，以及卡住的具体位置"],
  };
  if (task.id === "error-codes") return {
    minimum: "只选1道错题，写下它最主要属于哪一种原因。",
    steps: ["知识不会：从没学会或概念理解错", "想不起：看答案认识，但闭卷提取不出", "输出障碍：日语、图示或书写组织不出来", "时间/状态：会做但超时，或被疲劳、过载、情绪影响；再写2天后与7天后的日期"],
  };
  if (task.id === "materials") return {
    minimum: "只为1个学科选定一个固定页面，把页面名称写下来。",
    steps: ["先选最容易犹豫的一科", "在网站中选一个固定入口，例如历史记忆库或环境公式页", "把入口名称写进今天备注", "其余科照同样方法各选一个；今天不整理页面内容"],
  };
  if (task.title.includes("休息")) return {
    minimum: "今天不打开学习资料，就是完成任务。",
    steps: ["关闭题库和复习页面", "不补昨天未完成的任务", "优先处理吃饭、睡眠和感官恢复"],
  };
  if (task.title.includes("整卷") || task.title.includes("模拟")) return {
    minimum: "只把试卷、纸笔和计时器放到桌上，先做15分钟；状态不允许时可停止。",
    steps: ["选好要做的卷或题组", "写下开始、结束和跳题时间", "按规定时间作答，不边做边查", "结束后先离开试卷30分钟，再记录完成率和卡点"],
  };
  if (task.title.includes("论述") || task.title.includes("输出") || task.title.includes("答案")) return {
    minimum: "只读1道题，闭卷写3个关键词；不要求写成完整句子。",
    steps: ["圈出题目要求的对象、动作和限制", "用3分钟写关键词或答案骨架", "把关键词扩成一段短答案", "对照资料只补缺失点，再合上资料口述一次"],
  };
  if (task.title.includes("图") || task.title.includes("节点")) return {
    minimum: "只画一个轮廓或轴线，并标出1个关键部位。",
    steps: ["确定要表达的是平面、剖面还是构造顺序", "先画最外层轮廓和主要轴线", "补3个最关键标注", "用一句话写清这张图证明什么"],
  };
  if (task.title.includes("结构") || task.title.includes("计算") || task.title.includes("公式")) return {
    minimum: "只选1题，写出已知量、要求量和可能使用的公式。",
    steps: ["抄下已知量并统一单位", "写出要求的物理量", "选择公式或画受力图", "计算一遍，再用单位、数量级或平衡关系检查"],
  };
  if (task.title.includes("错题") || task.title.includes("重做") || task.title.includes("订正") || task.title.includes("复盘")) return {
    minimum: "只打开1道错题，不看答案重做5分钟，并写一个卡点。",
    steps: ["选今天到期或重复最多的一道错题", "遮住答案重新做", "判断主要是知识、想不起、输出、时间还是状态问题", "能独立做对就记一次成功；否则安排下次重做"],
  };
  if (task.title.includes("清单") || task.title.includes("材料") || task.title.includes("准备") || task.title.includes("环境")) return {
    minimum: "只完成一个最小准备动作，例如打开页面、拿出纸笔或写下一个入口。",
    steps: ["写明这项准备最后应该留下什么", "只处理一科或一种物品", "完成后拍照或写一句记录", "确认明天开始时不需要重新做决定"],
  };
  return {
    minimum: "只打开对应页面，做第一步10分钟；时间到可以停。",
    steps: ["把任务改写成一个具体动作", "设10分钟计时并开始", "只处理一个题目或一个知识点", "写下下一步，让下次能直接继续"],
  };
}

export default function StudyPlanDashboard() {
  const [dayRecords, setDayRecords] = useState<Record<string, DailyRecord>>({});
  const [weekRecords, setWeekRecords] = useState<Record<string, WeeklyRecord>>({});
  const [selectedDate, setSelectedDate] = useState(STUDY_DAYS[0].date);
  const [reviewPhaseId, setReviewPhaseId] = useState(PLAN_PHASES[0].id);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(PLAN_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as StoredPlan;
          setDayRecords(parsed.days ?? {});
          setWeekRecords(parsed.weeks ?? {});
        }
      } catch {
        // Start with an empty record if local data cannot be read.
      }
      const today = taipeiDateKey();
      const boundedToday = STUDY_DAYS.some((day) => day.date === today)
        ? today
        : today < STUDY_DAYS[0].date ? STUDY_DAYS[0].date : STUDY_DAYS[STUDY_DAYS.length - 1].date;
      setSelectedDate(boundedToday);
      const phase = PLAN_PHASES.find((item) => boundedToday >= item.start && boundedToday <= item.end);
      if (phase) setReviewPhaseId(phase.id);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify({ days: dayRecords, weeks: weekRecords } satisfies StoredPlan));
  }, [dayRecords, weekRecords, ready]);

  const selectedDay = STUDY_DAYS.find((day) => day.date === selectedDate) ?? STUDY_DAYS[0];
  const selectedPhase = PLAN_PHASES.find((phase) => phase.id === selectedDay.phaseId) ?? PLAN_PHASES[0];
  const dayRecord = dayRecords[selectedDate] ?? EMPTY_DAY;
  const totalTasks = STUDY_DAYS.reduce((sum, day) => sum + day.tasks.length, 0);
  const completedTasks = Object.values(dayRecords).reduce((sum, record) => sum + (record.completed?.length ?? 0), 0);
  const activeDaysRecorded = Object.values(dayRecords).filter((record) =>
    record.hours || record.energy || record.completed?.length || Object.values(record.stepCompleted ?? {}).some((steps) => steps.length > 0),
  ).length;

  const phaseMetrics = useMemo(() => {
    const phase = PLAN_PHASES.find((item) => item.id === reviewPhaseId) ?? PLAN_PHASES[0];
    const records = STUDY_DAYS.filter((day) => day.phaseId === phase.id).map((day) => dayRecords[day.date]).filter(Boolean);
    const hours = records.reduce((sum, record) => sum + (Number(record.hours) || 0), 0);
    const closedBookValues = records.map((record) => Number(record.closedBook)).filter((value) => Number.isFinite(value) && value > 0);
    const outputs = records.reduce((sum, record) => sum + (Number(record.outputs) || 0), 0);
    return { phase, days: records.length, hours, outputs, closedBook: closedBookValues.length ? Math.round(closedBookValues.reduce((sum, value) => sum + value, 0) / closedBookValues.length) : 0 };
  }, [dayRecords, reviewPhaseId]);

  const updateDay = (patch: Partial<DailyRecord>) => setDayRecords((current) => ({
    ...current,
    [selectedDate]: { ...EMPTY_DAY, ...current[selectedDate], ...patch },
  }));

  const toggleTask = (taskId: string) => {
    const completed = dayRecord.completed ?? [];
    updateDay({ completed: completed.includes(taskId) ? completed.filter((id) => id !== taskId) : [...completed, taskId] });
  };

  const toggleStep = (taskId: string, stepId: string) => {
    const currentByTask = dayRecord.stepCompleted ?? {};
    const currentSteps = currentByTask[taskId] ?? [];
    updateDay({
      stepCompleted: {
        ...currentByTask,
        [taskId]: currentSteps.includes(stepId) ? currentSteps.filter((id) => id !== stepId) : [...currentSteps, stepId],
      },
    });
  };

  const updateWeek = (patch: Partial<WeeklyRecord>) => setWeekRecords((current) => ({
    ...current,
    [reviewPhaseId]: { ...EMPTY_WEEK, ...current[reviewPhaseId], ...patch },
  }));

  const copyProgress = async () => {
    const record = weekRecords[reviewPhaseId] ?? EMPTY_WEEK;
    const text = [
      `# ${phaseMetrics.phase.dates} 学习复盘`,
      `记录天数：${phaseMetrics.days}`,
      `实际学习：${phaseMetrics.hours.toFixed(1)}小时`,
      `平均闭卷比例：${phaseMetrics.closedBook || "未记录"}%`,
      `完成输出：${phaseMetrics.outputs}个`,
      `模拟/真题完成率：${record.mockCompletion || "未填写"}`,
      `主要错误：${record.mainErrors || "未填写"}`,
      `过载触发因素：${record.sensoryTriggers || "未填写"}`,
      `下周最多两项调整：${record.nextChanges || "未填写"}`,
      "请根据这份执行记录，帮我调整下一阶段计划。",
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <header className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 pb-7 pt-20 text-white shadow-xl sm:px-9 sm:py-9">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("open-self-assessment"))}
          className="absolute right-5 top-5 rounded-full bg-amber-300 px-4 py-2 text-xs font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-200 sm:right-8 sm:top-8"
        >
          打开自评表 ↗
        </button>
        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.22em] text-amber-300">9月1日考试 · 32天执行工作台</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">从识别过，走到闭卷、日语输出与整卷稳定</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">约27个有效学习日、149小时。每天最多三个学科；周日完整休息。状态下降时直接切换黄色或红色方案，不在第二天加倍补偿。</p>
            <nav className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
              {[['#today-plan', '今日执行'], ['#calendar', '每日记录'], ['#phases', '五周计划'], ['#weekly-review', '每周复盘']].map(([href, label]) => <a key={href} href={href} className="rounded-full bg-white/10 px-3 py-2 text-slate-200 transition hover:bg-white/20 hover:text-white">{label}</a>)}
            </nav>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:w-72">
            <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-400">距离考试</p><p className="mt-1 text-3xl font-black text-amber-300">{daysUntilExam(selectedDate)}<span className="ml-1 text-sm">天</span></p></div>
            <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-400">已记录</p><p className="mt-1 text-3xl font-black">{activeDaysRecorded}<span className="ml-1 text-sm">天</span></p></div>
          </div>
        </div>
      </header>

      <section id="today-plan" className="mt-6 scroll-mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-bold tracking-[0.18em] text-amber-700">{shortDate(selectedDate)} · {selectedPhase.title}</p><h2 className="mt-2 text-2xl font-black text-slate-950">{selectedDay.focus}</h2><p className="mt-1 text-sm text-slate-500">选择其他日期也可以补记或提前查看，不会改变今天。</p></div>
          <div className="text-right"><p className="text-xs text-slate-400">总任务进度</p><p className="text-xl font-black text-slate-900">{completedTasks} / {totalTasks}</p></div>
        </div>

        {!selectedDay.rest && <div className="mt-6 grid gap-2 md:grid-cols-3">
          {(Object.entries(ENERGY_MODES) as Array<[EnergyMode, (typeof ENERGY_MODES)[EnergyMode]]>).map(([mode, meta]) => {
            const selected = dayRecord.energy === mode;
            return <button key={mode} type="button" onClick={() => updateDay({ energy: mode })} className={`rounded-2xl border p-4 text-left transition ${selected ? `${meta.color} ring-2 ring-offset-2 ring-slate-400` : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"}`}><span className="flex items-center justify-between gap-2"><span className="text-sm font-black">{meta.label}</span><span className="text-xs font-bold">{meta.hours}</span></span><span className="mt-2 block text-xs leading-5 opacity-80">{meta.description}</span></button>;
          })}
        </div>}

        <details open={selectedDay.phaseId === "baseline"} className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4">
          <summary className="cursor-pointer text-sm font-black text-cyan-950">计划里的词看不懂？先看这四个解释</summary>
          <div className="mt-3 grid gap-2 text-xs leading-5 text-cyan-950/75 sm:grid-cols-2">
            <p className="rounded-xl bg-white/70 p-3"><strong className="text-cyan-950">摸底题（原来写“基线题”）</strong><br />不是特殊题，就是从网站试题库选一道已有过去问，不看答案先做10–30分钟，看看目前能做到哪里。</p>
            <p className="rounded-xl bg-white/70 p-3"><strong className="text-cyan-950">错误原因</strong><br />知识不会／看过但想不起／日语或图示写不出／时间不够／疲劳、过载或情绪影响。每题只选最主要的一项。</p>
            <p className="rounded-xl bg-white/70 p-3"><strong className="text-cyan-950">隔2天、隔7天重做</strong><br />今天错的题，两天后遮住答案再做；七天后再做一次。不是今天连续抄三遍。</p>
            <p className="rounded-xl bg-white/70 p-3"><strong className="text-cyan-950">固定学习入口</strong><br />每科只指定一个“开始页面”。以后坐下就打开它，不需要再次搜索、比较或决定从哪里开始。</p>
          </div>
        </details>

        <div className="mt-6 space-y-2">
          {selectedDay.tasks.map((task) => {
            const checked = dayRecord.completed?.includes(task.id);
            const guide = taskGuide(task);
            const expansionKey = `${selectedDate}:${task.id}`;
            const expanded = expandedTasks[expansionKey];
            const taskSteps = dayRecord.stepCompleted?.[task.id] ?? [];
            const minimumDone = taskSteps.includes("minimum");
            return <article key={task.id} className={`rounded-2xl border p-4 transition ${checked ? "border-emerald-200 bg-emerald-50/70" : "border-slate-200 bg-white hover:border-amber-300"}`}>
              <div className="flex items-start gap-3">
                <input aria-label={`完成整个任务：${task.title}`} type="checkbox" checked={Boolean(checked)} onChange={() => toggleTask(task.id)} className="mt-1 h-5 w-5 shrink-0 accent-emerald-600" />
                <div className="min-w-0 flex-1"><h3 className={`text-sm font-bold ${checked ? "text-emerald-900 line-through" : "text-slate-900"}`}>{task.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{task.detail}</p></div>
                {task.minutes > 0 && <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">完整约{task.minutes}m</span>}
              </div>
              <label className={`mt-3 flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${minimumDone ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                <input type="checkbox" checked={minimumDone} onChange={() => toggleStep(task.id, "minimum")} className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600" />
                <span className="text-xs leading-5 text-slate-700"><strong className="text-slate-950">最低完成（做到这里就可以停）</strong><br />{guide.minimum}</span>
              </label>
              <button type="button" onClick={() => setExpandedTasks((current) => ({ ...current, [expansionKey]: !expanded }))} className="mt-3 text-xs font-bold text-violet-700 hover:text-violet-950">{expanded ? "收起小步骤 ↑" : `不知道怎么开始？拆成 ${guide.steps.length + 1} 个小步骤 ↓`}</button>
              {expanded && <div className="mt-3 space-y-2 border-t border-slate-100 pt-3"><p className="text-[11px] font-bold text-slate-400">最低完成以后，下面都属于可选的“继续做”。全部做完后再勾最上方的整个任务。</p>{guide.steps.map((step, index) => {
                const stepId = `step-${index}`;
                const stepDone = taskSteps.includes(stepId);
                return <label key={stepId} className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-xs leading-5 text-slate-600 hover:bg-slate-50"><input type="checkbox" checked={stepDone} onChange={() => toggleStep(task.id, stepId)} className="mt-0.5 h-4 w-4 shrink-0 accent-violet-600" /><span className={stepDone ? "text-slate-400 line-through" : ""}><strong className="mr-1 text-slate-400">{index + 2}.</strong>{step}</span></label>;
              })}</div>}
            </article>;
          })}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-bold text-slate-600">实际学习小时<input inputMode="decimal" value={dayRecord.hours} onChange={(event) => updateDay({ hours: event.target.value })} placeholder="例：5.5" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-amber-400" /></label>
          <label className="text-xs font-bold text-slate-600">闭卷比例 %<input inputMode="numeric" value={dayRecord.closedBook} onChange={(event) => updateDay({ closedBook: event.target.value })} placeholder="例：60" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-amber-400" /></label>
          <label className="text-xs font-bold text-slate-600">完成输出数量<input inputMode="numeric" value={dayRecord.outputs} onChange={(event) => updateDay({ outputs: event.target.value })} placeholder="论述/图/完整题" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-amber-400" /></label>
        </div>
        <label className="mt-4 block text-xs font-bold text-slate-600">一句记录：主要错因、状态或明天第一项任务<textarea rows={2} value={dayRecord.note} onChange={(event) => updateDay({ note: event.target.value })} placeholder="例：看过但想不起；照明单位仍混乱；明天先闭卷重做第3题。" className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal leading-6 outline-none focus:border-amber-400 focus:bg-white" /></label>
      </section>

      <section id="calendar" className="mt-6 scroll-mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold tracking-[0.18em] text-cyan-700">每日记录</p><h2 className="mt-2 text-xl font-black text-slate-950">点击日期查看、执行或补记</h2></div><p className="text-xs text-slate-400">圆点表示已有记录 · 绿色勾表示当天任务全完成</p></div>
        <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-8">
          {STUDY_DAYS.map((day) => {
            const record = dayRecords[day.date];
            const complete = record && record.completed?.length === day.tasks.length;
            const selected = selectedDate === day.date;
            return <button key={day.date} type="button" onClick={() => setSelectedDate(day.date)} className={`relative rounded-xl border px-2 py-3 text-left transition ${selected ? "border-slate-950 bg-slate-950 text-white shadow-md" : day.rest ? "border-slate-100 bg-slate-50 text-slate-400" : "border-slate-200 bg-white text-slate-700 hover:border-amber-300"}`}><span className="block text-xs font-bold">{shortDate(day.date).replace("周", "")}</span><span className="mt-1 block truncate text-[10px] opacity-70">{day.rest ? "休息" : day.focus}</span>{complete ? <span className="absolute right-2 top-2 text-emerald-400">✓</span> : record && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-400" />}</button>;
          })}
        </div>
      </section>

      <section id="phases" className="mt-6 scroll-mt-4">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold tracking-[0.18em] text-violet-700">五周阶段计划</p><h2 className="mt-2 text-2xl font-black text-slate-950">每周只追一个能力变化</h2></div><p className="text-sm text-slate-500">总预算约149小时</p></div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {PLAN_PHASES.map((phase, index) => <article key={phase.id} className={`rounded-3xl border p-5 ${selectedPhase.id === phase.id ? "border-violet-300 bg-violet-50/60" : "border-slate-200 bg-white"}`}><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">{index + 1}</span><div><p className="text-xs font-bold text-violet-700">{phase.dates}</p><h3 className="mt-1 text-lg font-black text-slate-950">{phase.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{phase.goal}</p></div></div><ul className="mt-4 space-y-2 pl-12">{phase.deliverables.map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-slate-500"><span className="text-emerald-500">✓</span><span>{item}</span></li>)}</ul></article>)}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-xl font-black text-slate-950">149小时分配</h2><p className="mt-1 text-sm text-slate-500">已有强项只维持，把时间集中到论述、图示、综合题和整卷。</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{SUBJECT_ALLOCATIONS.map((item) => <div key={item.label} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-900">{item.label}</span><span className="text-lg font-black text-slate-950">{item.hours}h</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className={`h-full ${item.color}`} style={{ width: `${Math.round(item.hours / 28 * 100)}%` }} /></div><p className="mt-2 text-xs leading-5 text-slate-500">{item.target}</p></div>)}</div>
      </section>

      <section id="weekly-review" className="mt-6 scroll-mt-4 rounded-3xl bg-slate-900 p-5 text-white shadow-xl sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.18em] text-amber-300">每周复盘</p><h2 className="mt-2 text-2xl font-black">只记录能改变下周计划的信息</h2></div><button type="button" onClick={copyProgress} className="rounded-full bg-amber-300 px-4 py-2 text-sm font-black text-slate-950 hover:bg-amber-200">{copied ? "已复制 ✓" : "复制本阶段记录给我"}</button></div>
        <div className="mt-5 flex flex-wrap gap-2">{PLAN_PHASES.filter((phase) => phase.id !== "taper").map((phase) => <button key={phase.id} type="button" onClick={() => setReviewPhaseId(phase.id)} className={`rounded-full px-3 py-2 text-xs font-bold transition ${reviewPhaseId === phase.id ? "bg-white text-slate-950" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}>{phase.dates}</button>)}</div>
        <div className="mt-5 grid gap-3 sm:grid-cols-4"><div className="rounded-2xl bg-white/8 p-4"><p className="text-xs text-slate-400">记录天数</p><p className="mt-1 text-2xl font-black">{phaseMetrics.days}</p></div><div className="rounded-2xl bg-white/8 p-4"><p className="text-xs text-slate-400">实际小时</p><p className="mt-1 text-2xl font-black">{phaseMetrics.hours.toFixed(1)}</p></div><div className="rounded-2xl bg-white/8 p-4"><p className="text-xs text-slate-400">平均闭卷</p><p className="mt-1 text-2xl font-black">{phaseMetrics.closedBook || "—"}<span className="text-sm">%</span></p></div><div className="rounded-2xl bg-white/8 p-4"><p className="text-xs text-slate-400">输出数量</p><p className="mt-1 text-2xl font-black">{phaseMetrics.outputs}</p></div></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {([['mockCompletion', '模拟/真题完成率', '例：完成72%，计划部分超时20分钟'], ['mainErrors', '本周主要错误', '只写最高频的知识/提取/输出/时间问题'], ['sensoryTriggers', '过载触发因素与恢复', '例：连续计算90分钟后对声音敏感；安静30分钟恢复'], ['nextChanges', '下周最多两项调整', '例：论述每天提前到上午；结构每题设25分钟上限']] as const).map(([key, label, placeholder]) => <label key={key} className="text-xs font-bold text-slate-300">{label}<textarea rows={3} value={(weekRecords[reviewPhaseId] ?? EMPTY_WEEK)[key]} onChange={(event) => updateWeek({ [key]: event.target.value })} placeholder={placeholder} className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-normal leading-6 text-white outline-none placeholder:text-slate-500 focus:border-amber-300" /></label>)}
        </div>
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-3">
        {(Object.entries(ENERGY_MODES) as Array<[EnergyMode, (typeof ENERGY_MODES)[EnergyMode]]>).map(([mode, meta]) => <article key={mode} className={`rounded-2xl border p-4 ${meta.color}`}><p className="text-sm font-black">{meta.label} · {meta.hours}</p><p className="mt-2 text-xs leading-5 opacity-80">{meta.description}</p></article>)}
      </section>
    </>
  );
}
