"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout } from "@/components/layout";
import { useExploreLanguage, type ExploreLanguage } from "@/components/ExploreLanguageProvider";

type Copy = Record<ExploreLanguage, string>;
type ExploreItem = { href: string; title: Copy; description: Copy; icon: string };
type ExploreGroup = { title: Copy; description: Copy; items: ExploreItem[] };
type FeaturedEntry = {
  eyebrow: Copy;
  title: Copy;
  description: Copy;
  primary: { href: string; label: Copy };
  secondary: { href: string; label: Copy };
  gradient: string;
};
type LearningPathStep = {
  href: string;
  title: Copy;
  action: Copy;
  doneWhen: Copy;
};
type SubjectLearningPath = {
  id: string;
  icon: string;
  subject: Copy;
  startPage: Copy;
  summary: Copy;
  minimum: Copy;
  note?: Copy;
  accent: string;
  activeAccent: string;
  steps: LearningPathStep[];
};

const subjectLearningPaths: SubjectLearningPath[] = [
  {
    id: "history",
    icon: "🏛️",
    subject: { zh: "建筑史", ja: "建築史", en: "History" },
    startPage: { zh: "固定从「时间轴」开始", ja: "「時間軸」から始める", en: "Always start from Timeline" },
    summary: { zh: "先有时代骨架，再把图片、因果关系和日语论述挂上去。", ja: "時代の骨格をつくり、画像・因果関係・日本語論述を結びます。", en: "Build a chronological skeleton, then attach images, causes, and Japanese writing." },
    minimum: { zh: "只选一个时代看 10 分钟，并说出它前后各是什么。", ja: "一時代だけ10分見て、前後の時代を声に出す。", en: "Study one period for 10 minutes and name what comes before and after." },
    accent: "border-violet-200 bg-violet-50 text-violet-900",
    activeAccent: "border-violet-700 bg-violet-700 text-white",
    steps: [
      { href: "/timeline", title: { zh: "时间轴", ja: "時間軸", en: "Timeline" }, action: { zh: "只看一个时代，找出 3 个代表作品。", ja: "一時代を見て、代表作を3件探す。", en: "Study one period and find three representative works." }, doneWhen: { zh: "能不看页面说出先后顺序。", ja: "ページを見ずに順序を言える。", en: "You can state the order without looking." } },
      { href: "/history/library", title: { zh: "建筑史图片库", ja: "建築史画像ライブラリ", en: "History image library" }, action: { zh: "浏览 10 张同一时代的图片，挑 3 张做遮挡识别。", ja: "同時代の画像を10枚見て、3枚を画像だけで識別する。", en: "Browse ten images from the period and identify three without labels." }, doneWhen: { zh: "能用名称＋时代认出 3 张。", ja: "名称と時代で3件を識別できる。", en: "You can identify three by name and period." } },
      { href: "/history/topics", title: { zh: "专题学习", ja: "テーマ学習", en: "Topic study" }, action: { zh: "选一个问题，把样式、构法和作品连起来。", ja: "一つの問いから、様式・構法・作品を結ぶ。", en: "Use one question to connect style, construction, and works." }, doneWhen: { zh: "能写出 3 句“因为…所以…”。", ja: "「なぜなら〜ため」を3文書ける。", en: "You can write three cause-and-effect sentences." } },
      { href: "/history/essay-framework", title: { zh: "论述框架", ja: "論述フレーム", en: "Essay framework" }, action: { zh: "选一种题型，只写关键词提纲，不要求完整作文。", ja: "一つの出題型を選び、まずキーワードの骨子だけを書く。", en: "Choose one prompt type and draft a keyword outline only." }, doneWhen: { zh: "能在 10 分钟内写出日语提纲。", ja: "10分で日本語の骨子を書ける。", en: "You can draft a Japanese outline in ten minutes." } },
      { href: "/exam/past", title: { zh: "过去问检验", ja: "過去問で確認", en: "Past-question check" }, action: { zh: "筛选建筑史，限时做一组；不会的只标记，不当场补课。", ja: "建築史を絞り、時間を測って一組解く。途中で調べない。", en: "Filter for history and complete one timed set without studying mid-test." }, doneWhen: { zh: "按错误类型知道该返回第 2、3 或 4 步。", ja: "誤りに応じて第2・3・4段階へ戻れる。", en: "Each error clearly sends you back to step 2, 3, or 4." } },
    ],
  },
  {
    id: "planning",
    icon: "🧩",
    subject: { zh: "建筑计划", ja: "建築計画", en: "Planning" },
    startPage: { zh: "固定从「建筑类型」开始", ja: "「建築計画の類型」から始める", en: "Always start from Planning typologies" },
    summary: { zh: "先知道题目在问哪种空间关系，再记案例、图面和数值。", ja: "空間関係の問いを先に捉え、その後に事例・図面・数値を覚えます。", en: "Identify the spatial relationship first, then learn cases, drawings, and values." },
    minimum: { zh: "只选一种设施，读 1 个分析轴和 2 个容易混淆的 Pattern。", ja: "一施設だけ選び、分析軸1つと混同しやすいPattern 2つを読む。", en: "Choose one facility and read one analysis axis plus two confusing patterns." },
    accent: "border-cyan-200 bg-cyan-50 text-cyan-900",
    activeAccent: "border-cyan-700 bg-cyan-700 text-white",
    steps: [
      { href: "/planning-typology", title: { zh: "建筑计划类型", ja: "建築計画の類型", en: "Planning typologies" }, action: { zh: "选一种设施，先读“问题 → Pattern → 案例”的关系。", ja: "一施設を選び、「問い→Pattern→事例」を読む。", en: "Choose one facility and follow question → pattern → case." }, doneWhen: { zh: "能说出 2 组易混类型的区别。", ja: "混同しやすい2組の違いを説明できる。", en: "You can distinguish two commonly confused pairs." } },
      { href: "/planning/library", title: { zh: "计划记忆库", ja: "計画記憶ライブラリ", en: "Planning memory library" }, action: { zh: "只筛选刚学的设施，浏览 10 张案例/数值卡。", ja: "今学んだ施設に絞り、事例・数値カードを10枚見る。", en: "Filter to that facility and browse ten case/value cards." }, doneWhen: { zh: "能口头回忆其中 5 张的识别线索。", ja: "5枚の識別手掛かりを口頭で再生できる。", en: "You can recall the cues for five cards." } },
      { href: "/planning/practice", title: { zh: "三题小练习", ja: "3問ミニ練習", en: "Three-question practice" }, action: { zh: "做一局图片、案例或数值练习；只选一种模式。", ja: "画像・事例・数値から一種類だけ、3問解く。", en: "Do one three-question game in only one mode." }, doneWhen: { zh: "完成 3 题并记录错因，不要求全对。", ja: "3問を終え、誤因を記録する。全問正解は不要。", en: "Finish three and record why errors happened; perfection is not required." } },
      { href: "/exam/mock/planning-full", title: { zh: "计划过去问重建", ja: "計画の過去問再構成", en: "Planning past-question reconstruction" }, action: { zh: "第一次可分段做，第二次再连续限时完成。", ja: "初回は分割し、2回目に連続・時間制限で解く。", en: "Split it on the first attempt; complete it continuously and timed on the second." }, doneWhen: { zh: "能把每个错误归到类型、案例、数值或读题。", ja: "誤りを類型・事例・数値・読解に分類できる。", en: "Every error is classified as typology, case, value, or reading." } },
    ],
  },
  {
    id: "construction",
    icon: "🧱",
    subject: { zh: "建筑构法", ja: "建築構法", en: "Construction" },
    startPage: { zh: "固定从「构法记忆库」开始", ja: "「構法ライブラリ」から始める", en: "Always start from the Construction library" },
    summary: { zh: "先认部材和节点，再做易混辨析，最后把它们放回施工关系。", ja: "部材と納まりを認識し、類似構法を比較してから施工関係へ戻します。", en: "Recognize components and details, distinguish similar systems, then place them in construction context." },
    minimum: { zh: "只选木造、RC 或钢结构中的一个系统，看 5 张图解卡。", ja: "木造・RC・鉄骨から一つ選び、図解カードを5枚見る。", en: "Choose timber, RC, or steel and view five illustrated cards." },
    accent: "border-orange-200 bg-orange-50 text-orange-900",
    activeAccent: "border-orange-700 bg-orange-700 text-white",
    steps: [
      { href: "/construction/library", title: { zh: "构法记忆库", ja: "構法ライブラリ", en: "Construction library" }, action: { zh: "一次只看一个构造系统的 5–10 张图。", ja: "一度に一構造システムの図を5〜10枚だけ見る。", en: "View only 5–10 diagrams from one structural system." }, doneWhen: { zh: "能指出部材名称和它所在的位置。", ja: "部材名と位置を指して説明できる。", en: "You can name the component and point to its location." } },
      { href: "/construction-distinctions", title: { zh: "易混构法辨析", ja: "類似構法の比較", en: "Construction distinctions" }, action: { zh: "选一组易混术语，写“共同点 / 唯一区别”。", ja: "混同しやすい一組について、共通点と決定的差異を書く。", en: "For one confusing pair, write the shared trait and decisive difference." }, doneWhen: { zh: "看到图或语群时能说出判别依据。", ja: "図や語群を見て判別根拠を言える。", en: "You can state the deciding cue from an image or term bank." } },
      { href: "/construction/practice", title: { zh: "三题识图练习", ja: "3問識図練習", en: "Three-question visual practice" }, action: { zh: "只做一局三题；错题回看对应卡片。", ja: "3問だけ解き、誤答したカードへ戻る。", en: "Do only three questions, then revisit the matching cards." }, doneWhen: { zh: "完成 3 题，并能解释每个选项为什么对或错。", ja: "3問を終え、各選択肢の正誤理由を言える。", en: "Finish three and explain why each option is right or wrong." } },
      { href: "/exam/mock/building-construction-full", title: { zh: "RC 构法过去问", ja: "RC構法の過去問", en: "RC construction past question" }, action: { zh: "先不限时完成一组关系语群，再限时重做。", ja: "まず時間無制限で一組、その後に時間を測って再答する。", en: "Complete one relation set untimed, then repeat it timed." }, doneWhen: { zh: "错误能归到部材、顺序、材料性质或日语术语。", ja: "誤りを部材・順序・材料特性・日本語用語に分類できる。", en: "Errors are classified as component, sequence, material property, or Japanese term." } },
    ],
  },
  {
    id: "environment",
    icon: "🌤️",
    subject: { zh: "环境工学", ja: "環境工学", en: "Environment" },
    startPage: { zh: "固定从「重点知识与公式」开始", ja: "「重点知識と公式」から始める", en: "Always start from Key knowledge & formulas" },
    summary: { zh: "先确认公式的条件和单位，再闭卷提取，最后进入计算。", ja: "公式の条件と単位を確認し、想起練習を経て計算へ進みます。", en: "Confirm conditions and units, practice recall, then calculate." },
    minimum: { zh: "只选一个薄弱模块，遮住并默写 1 条公式，核对单位。", ja: "弱い一分野を選び、公式を1本だけ隠して書き、単位を確認する。", en: "Choose one weak module, write one hidden formula, and check its units." },
    accent: "border-emerald-200 bg-emerald-50 text-emerald-900",
    activeAccent: "border-emerald-700 bg-emerald-700 text-white",
    steps: [
      { href: "/environment-knowledge", title: { zh: "重点知识与公式", ja: "重点知識と公式", en: "Key knowledge and formulas" }, action: { zh: "选一个模块，读公式、适用条件和常见错误。", ja: "一分野を選び、公式・適用条件・典型的誤りを読む。", en: "Choose one module and read its formula, conditions, and common errors." }, doneWhen: { zh: "能说出公式、每个量的单位和不能使用的情况。", ja: "公式・各量の単位・使えない条件を言える。", en: "You can state the formula, units, and when it cannot be used." } },
      { href: "/environment-memory", title: { zh: "环境记忆地图", ja: "環境記憶マップ", en: "Environment memory map" }, action: { zh: "遮住答案做 5 张卡，只记录“想不起来”的点。", ja: "答えを隠して5枚行い、想起できない点だけ記録する。", en: "Hide answers for five cards and record only what you could not recall." }, doneWhen: { zh: "5 张里至少 3 张能闭卷说完整。", ja: "5枚中3枚以上を見ずに説明できる。", en: "You can fully recall at least three of five." } },
      { href: "/exam/mock/env-calc", title: { zh: "换气公式小计算", ja: "換気公式ミニ計算", en: "Ventilation mini-calculation" }, action: { zh: "按“列已知量 → 写单位 → 代公式 → 数量级检查”做 1 题。", ja: "既知量→単位→代入→桁確認の順で1問解く。", en: "Solve one using knowns → units → substitution → magnitude check." }, doneWhen: { zh: "不看答案也能写出完整四步。", ja: "解答を見ずに4段階を完了できる。", en: "You can complete all four steps without viewing the answer." } },
      { href: "/exam/past", title: { zh: "环境过去问检验", ja: "環境の過去問確認", en: "Environment past-question check" }, action: { zh: "筛选环境工学，限时做一组综合题。", ja: "環境工学を絞り、総合問題を一組時間内に解く。", en: "Filter for environment and complete one timed mixed set." }, doneWhen: { zh: "能区分是公式没记住、条件看漏还是计算失误。", ja: "公式忘れ・条件の見落とし・計算ミスを区別できる。", en: "You can distinguish recall, condition-reading, and calculation errors." } },
    ],
  },
  {
    id: "structure",
    icon: "⌁",
    subject: { zh: "结构力学", ja: "構造力学", en: "Structural mechanics" },
    startPage: { zh: "固定从「结构力学学习」开始", ja: "「構造力学の学習」から始める", en: "Always start from Structural learning" },
    summary: { zh: "当前站内用三道完整解析题训练“截面 → 构件 → 系统”的受力推理。", ja: "現在は3題の完全解説で「断面→部材→システム」の推論を練習します。", en: "The current site uses three fully worked problems to train section → member → system reasoning." },
    minimum: { zh: "只打开总览，任选一题画受力图；不会算也可以停。", ja: "総覧を開き、一題だけ自由物体図を描く。計算できなくてもよい。", en: "Open the overview and draw one free-body diagram; stopping before calculation is allowed." },
    note: { zh: "站内结构力学目前只整理了 3 道题，不能替代桁架、超静定、屈曲与振动等完整复习。", ja: "構造力学は現在3題のみで、トラス・不静定・座屈・振動などの全範囲を代替しません。", en: "The site currently contains only three mechanics problems; it does not replace full review of trusses, indeterminacy, buckling, or vibration." },
    accent: "border-blue-200 bg-blue-50 text-blue-900",
    activeAccent: "border-blue-700 bg-blue-700 text-white",
    steps: [
      { href: "/structural-learning", title: { zh: "结构力学总览", ja: "構造力学の総覧", en: "Structural overview" }, action: { zh: "先看物理量关系图，再选最接近当前薄弱点的一题。", ja: "物理量マップを見てから、弱点に近い一題を選ぶ。", en: "Review the quantity map, then choose the problem closest to your weakness." }, doneWhen: { zh: "能说出题目属于截面、构件还是系统层级。", ja: "問題が断面・部材・システムのどの層か言える。", en: "You can identify whether it is a section, member, or system problem." } },
      { href: "/structural-learning/questions/composite-beam", title: { zh: "组合梁：先练截面", ja: "合成梁：断面から", en: "Composite beam: section first" }, action: { zh: "照着解析重画中立轴、截面量与应力关系。", ja: "解説に沿って中立軸・断面量・応力関係を描き直す。", en: "Redraw the neutral axis, section properties, and stress relationship." }, doneWhen: { zh: "能解释每个公式为什么在这里出现。", ja: "各公式がなぜ必要か説明できる。", en: "You can explain why every formula appears." } },
      { href: "/structural-learning/questions/tapered-cantilever", title: { zh: "变截面悬臂梁：再练构件", ja: "変断面片持梁：部材へ", en: "Tapered cantilever: member next" }, action: { zh: "按 x 的位置写出 I(x)、M(x)，再判断积分对象。", ja: "位置xで I(x)・M(x)を書き、積分対象を決める。", en: "Write I(x) and M(x), then identify what must be integrated." }, doneWhen: { zh: "不看解析能写出随位置变化的量。", ja: "解説なしで位置に依存する量を書ける。", en: "You can write the position-dependent quantities unaided." } },
      { href: "/structural-learning/questions/thermal-restraint", title: { zh: "温度约束：最后练系统", ja: "温度拘束：システムへ", en: "Thermal restraint: system last" }, action: { zh: "先写自由变形，再用协调条件求约束力。", ja: "自由変形を書き、適合条件から拘束力を求める。", en: "Write free deformation first, then use compatibility for the restraint force." }, doneWhen: { zh: "能独立写出“自由变形＋约束变形＝0”。", ja: "自由変形＋拘束変形＝0を自力で立てられる。", en: "You can independently form free deformation + restrained deformation = 0." } },
      { href: "/exam/past", title: { zh: "过去问定位缺口", ja: "過去問で不足範囲を特定", en: "Use past questions to locate gaps" }, action: { zh: "筛选结构题；遇到站内未覆盖章节，记下章节名和第一处卡点。", ja: "構造を絞り、未収録分野は分野名と最初のつまずきを記録する。", en: "Filter for structures; for uncovered topics, record the topic and first point of failure." }, doneWhen: { zh: "得到下一次应补的明确章节，而不是“结构都不会”。", ja: "「構造が全部苦手」ではなく、次に補う具体的分野が決まる。", en: "You have a specific next topic, not the vague conclusion that all structures are weak." } },
    ],
  },
];

const featuredEntries: FeaturedEntry[] = [
  {
    eyebrow: { zh: "NEW · 建筑史探索馆", ja: "NEW · 建築史探索ギャラリー", en: "NEW · Architectural History Gallery" },
    title: { zh: "不想再翻 Anki？从图片开始逛建筑史", ja: "Ankiをめくる代わりに、写真から建築史を歩こう", en: "Tired of flashcards? Start exploring history through images." },
    description: { zh: "用博物馆式卡片墙浏览数百座具体建筑，查看图片、年代与样式，或开始一局十题的看图识建筑。", ja: "数百件の具体的な建築を写真・年代・様式から眺め、10問の画像チャレンジにも挑戦できます。", en: "Browse hundreds of individual buildings through images, periods, and styles—or play a ten-question image challenge." },
    primary: { href: "/history/library", label: { zh: "进入展示库", ja: "ギャラリーを見る", en: "Open gallery" } },
    secondary: { href: "/history/library?mode=quiz", label: { zh: "开始看图挑战", ja: "画像クイズを始める", en: "Start image challenge" } },
    gradient: "from-slate-950 via-violet-950 to-indigo-900",
  },
  {
    eyebrow: { zh: "NEW · 建筑计划记忆库", ja: "NEW · 建築計画の記憶ライブラリ", en: "NEW · Architectural Planning Memory Library" },
    title: { zh: "从图片、案例与数值，重新认识建筑计划", ja: "画像・事例・数値から、建築計画を覚え直そう", en: "Relearn architectural planning through images, cases, and values." },
    description: { zh: "浏览四百余张计划知识卡与原始图面，图片题、案例配对和数值填空则放在独立的趣味练习中。", ja: "400枚以上の計画知識カードと図版を閲覧し、画像当て・事例マッチ・数値クイズにも挑戦できます。", en: "Browse more than 400 planning cards and original images, then try image, case-matching, and numeric games." },
    primary: { href: "/planning/library", label: { zh: "进入记忆库", ja: "記憶ライブラリへ", en: "Open memory library" } },
    secondary: { href: "/planning/practice", label: { zh: "开始趣味练习", ja: "ゲーム練習を始める", en: "Start game practice" } },
    gradient: "from-slate-950 via-cyan-950 to-teal-900",
  },
  {
    eyebrow: { zh: "NEW · 建筑构法记忆库", ja: "NEW · 建築構法の記憶ライブラリ", en: "NEW · Building Construction Memory Library" },
    title: { zh: "从节点、部材和施工图，真正看懂建筑构法", ja: "納まり・部材・施工図から、建築構法を見分けよう", en: "Recognize building construction through details, components, and process diagrams." },
    description: { zh: "浏览198张构法知识卡与140幅原始图解，通过看图识部材和易混构法辨析建立可靠记忆。", ja: "198枚の構法カードと140点の図版を閲覧し、画像識別と紛らわしい構法の比較で記憶を固めます。", en: "Browse 198 construction cards and 140 original images, then practice image recognition and commonly confused systems." },
    primary: { href: "/construction/library", label: { zh: "进入构法库", ja: "構法ライブラリへ", en: "Open construction library" } },
    secondary: { href: "/construction/practice", label: { zh: "开始识图练习", ja: "識図練習を始める", en: "Start visual practice" } },
    gradient: "from-slate-950 via-orange-950 to-amber-900",
  },
];

const groups: ExploreGroup[] = [
  {
    title: { zh: "建筑史：沿着时间、关系与作品漫游", ja: "建築史：時間・関係・作品をたどる", en: "Architectural history: explore time, relationships, and works" },
    description: { zh: "同一批历史知识可以从时间、建筑、人物或构法切入。", ja: "同じ歴史知識を、時間・建築・人物・構法から読み解きます。", en: "Approach the same historical knowledge through time, buildings, people, or construction." },
    items: [
      { href: "/history/essay-framework", title: { zh: "専門2-2 论述学习框架", ja: "専門2-2 論述学習フレーム", en: "Specialist 2-2 essay framework" }, description: { zh: "先学题型判断、单体分析与技术史分类，再进入答题练习", ja: "判型・単体分析・技術史分類を学び、答案練習へ進む", en: "Learn classification, building analysis, and technology history before practice." }, icon: "✦" },
      { href: "/history/topics", title: { zh: "专题学习", ja: "テーマ学習", en: "Topic study" }, description: { zh: "从一个问题出发，把时间、样式、构法与具体建筑连成学习路径", ja: "一つの問いから、時間・様式・構法・具体的な建築を学習ルートに結ぶ", en: "Begin with one question and connect time, styles, construction, and buildings into a learning path." }, icon: "◉" },
      { href: "/timeline", title: { zh: "时间轴", ja: "時間軸", en: "Timeline" }, description: { zh: "看建筑与样式如何随时代展开", ja: "建築と様式が時代とともにどう展開したかを見る", en: "See how buildings and styles unfold across periods." }, icon: "📅" },
      { href: "/history/network", title: { zh: "关系网络", ja: "関係ネットワーク", en: "Relationship network" }, description: { zh: "看样式、运动、建筑师和建筑如何相连", ja: "様式・運動・建築家・建築のつながりを見る", en: "Trace links among styles, movements, architects, and buildings." }, icon: "🕸️" },
      { href: "/history/lineage", title: { zh: "日本人物谱系", ja: "日本人物谱系", en: "Japanese people lineages" }, description: { zh: "区分父子、家系传承、发愿与营造角色", ja: "父子・家系継承・発願・造営の役割を分けて読む", en: "Distinguish family ties, patronage, founding, and construction roles." }, icon: "⌘" },
      { href: "/history", title: { zh: "样式与运动卡", ja: "様式と運動のカード", en: "Style and movement cards" }, description: { zh: "系统阅读建筑史的核心学习卡", ja: "建築史の主要学習カードを体系的に読む", en: "Study the core cards for architectural history." }, icon: "🎴" },
      { href: "/architecture-cards", title: { zh: "建筑卡", ja: "建築カード", en: "Building cards" }, description: { zh: "从图片、构造与空间认识具体建筑", ja: "写真・構造・空間から具体的な建築を知る", en: "Learn individual buildings through image, structure, and space." }, icon: "🏛️" },
      { href: "/history-construction", title: { zh: "建筑史 × 构法", ja: "建築史 × 構法", en: "History × construction" }, description: { zh: "从材料和建造方式重新理解历史", ja: "材料とつくり方から歴史を読み直す", en: "Revisit history through materials and construction methods." }, icon: "🔗" },
      { href: "/current-topics", title: { zh: "建筑时事", ja: "建築時事", en: "Current architecture" }, description: { zh: "从近两年新闻回到保护制度、构法与过去问", ja: "直近2年のニュースを保存制度・構法・過去問につなぐ", en: "Connect recent news with heritage systems, construction, and past questions." }, icon: "🗞️" },
    ],
  },
  {
    title: { zh: "其他学科：专题资料与复习工具", ja: "その他の科目：テーマ資料と復習ツール", en: "Other subjects: topic guides and review tools" },
    description: { zh: "集中放置建筑力学、建筑计划、环境工学与建筑构法目前已有的题目解析、类型、公式和辨析资料；内容会随整理逐步补充。", ja: "建築構造力学・建築計画・環境工学・建築構法の問題解説、類型、公式、比較資料をまとめています。", en: "Find problem walkthroughs, typologies, formulas, and comparison materials for structural mechanics, planning, environmental engineering, and construction." },
    items: [
      { href: "/structural-learning", title: { zh: "建筑力学学习", ja: "建築構造力学の学習", en: "Structural mechanics learning" }, description: { zh: "从三道过去问进入原题、逐问解析、物理量关系图与中日双语答案", ja: "3題の過去問から、原問題・設問別解説・物理量の関係図・中日両語の答案を学ぶ", en: "Study original questions, step-by-step solutions, quantity maps, and bilingual answers through three past problems." }, icon: "⌁" },
      { href: "/planning-typology", title: { zh: "建筑计划类型", ja: "建築計画の類型", en: "Planning typologies" }, description: { zh: "从平面类型、代表建筑与答题角度理解建筑计划", ja: "平面類型・代表建築・解答の観点から建築計画を学ぶ", en: "Understand planning through layouts, examples, and exam reasoning." }, icon: "🧩" },
      { href: "/environment-knowledge", title: { zh: "环境工学公式", ja: "環境工学の公式", en: "Environmental engineering formulas" }, description: { zh: "按主题连接核心公式、适用条件与常见错误", ja: "主要公式・適用条件・よくある誤りをテーマごとに結ぶ", en: "Connect key formulas with their conditions and common mistakes." }, icon: "🌤️" },
      { href: "/environment-memory", title: { zh: "环境工学记忆地图", ja: "環境工学の記憶マップ", en: "Environmental engineering memory map" }, description: { zh: "把综合知识档案变成可遮答案、自测与复习的记忆卡", ja: "知識を穴埋め・自己テスト・復習用の記憶カードにする", en: "Turn integrated knowledge into recall, self-test, and review cards." }, icon: "🧠" },
      { href: "/construction-distinctions", title: { zh: "建筑构法辨析", ja: "建築構法の比較", en: "Construction distinctions" }, description: { zh: "按専門1真题证据区分易混构法、材料与部材", ja: "専門1の過去問を根拠に、混同しやすい構法・材料・部材を区別する", en: "Use past-question evidence to distinguish similar methods, materials, and components." }, icon: "🧱" },
    ],
  },
];

const randomDestinations = Array.from(new Set([
  ...featuredEntries.flatMap((entry) => [entry.primary.href, entry.secondary.href]),
  ...groups.flatMap((group) => group.items.map((item) => item.href)),
]));

export default function ExplorePage() {
  const { language } = useExploreLanguage();
  const router = useRouter();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [selectedPathId, setSelectedPathId] = useState(subjectLearningPaths[0].id);
  const [pathsExpanded, setPathsExpanded] = useState(false);
  const swipeStartX = useRef<number | null>(null);
  const selectedPath = subjectLearningPaths.find((path) => path.id === selectedPathId) ?? subjectLearningPaths[0];
  const showFeatured = (index: number) => setFeaturedIndex((index + featuredEntries.length) % featuredEntries.length);
  const openRandomDestination = () => {
    const randomValue = window.crypto.getRandomValues(new Uint32Array(1))[0];
    router.push(randomDestinations[randomValue % randomDestinations.length]);
  };

  return (
    <SidebarLayout>
      <div className="min-h-full bg-slate-50 px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-700">
              {{ zh: "探索模式", ja: "探索モード", en: "Explore mode" }[language]}
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              {{ zh: "不知道从哪开始，就按一条固定路径走", ja: "どこから始めるか迷ったら、固定ルートをたどろう", en: "When you do not know where to start, follow one fixed path." }[language]}
            </h1>
            <p className="mt-4 leading-7 text-slate-600">
              {{ zh: "每科只需要记住一个起点。第一次按顺序走；以后直接打开还没完成的那一步，不需要每天从头重读。", ja: "各科で覚える入口は一つだけ。初回は順番に進み、その後は未完了の段階から再開します。毎回最初から読む必要はありません。", en: "Remember only one starting page per subject. Follow the order once, then resume at the first unfinished step instead of restarting every day." }[language]}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/practice"
                className="inline-flex rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-medium text-cyan-800 hover:bg-cyan-50"
              >
                {{ zh: "想按学科做拆分练习？进入练习 →", ja: "科目ごとに練習したい？ 練習へ →", en: "Want subject-based practice? Go to practice →" }[language]}
              </Link>
              <button
                type="button"
                onClick={openRandomDestination}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-800 hover:shadow-lg"
              >
                <span aria-hidden="true">🎲</span>
                {{ zh: "随机漫游 · 抽到什么看什么", ja: "ランダム探索・出たページを見る", en: "Surprise me · Explore a random page" }[language]}
              </button>
            </div>
          </header>
          <section id="subject-paths" className="mt-10 scroll-mt-24 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
                  {{ zh: "五科固定学习路径", ja: "5科目の固定学習ルート", en: "Fixed paths for five subjects" }[language]}
                </p>
                <h2 className="mt-1 text-lg font-black text-slate-950 sm:text-xl">
                  {{ zh: pathsExpanded ? "先选学科，然后只做当前这一步" : "不知道从哪开始时，从这里打开", ja: pathsExpanded ? "科目を選び、今の一段階だけ行う" : "迷ったときは、ここから開く", en: pathsExpanded ? "Choose a subject, then do only the current step" : "Open this when you do not know where to start" }[language]}
                </h2>
              </div>
              <button
                type="button"
                aria-expanded={pathsExpanded}
                aria-controls="subject-path-content"
                onClick={() => setPathsExpanded((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-violet-800"
              >
                {{ zh: pathsExpanded ? "收起路径" : "展开五科路径", ja: pathsExpanded ? "ルートを閉じる" : "5科目ルートを開く", en: pathsExpanded ? "Collapse paths" : "Expand five paths" }[language]}
                <span aria-hidden="true" className={`transition-transform ${pathsExpanded ? "rotate-180" : ""}`}>⌄</span>
              </button>
            </div>

            {pathsExpanded && <div id="subject-path-content">
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                {{ zh: "“完成标准”是进入下一步的条件，不是要求一次做完全部路径。状态差时，只做黄色的最低启动任务也算完成。", ja: "「完了条件」を満たしたら次へ進みます。一度に全ルートを終える必要はありません。調子が悪い日は最低開始タスクだけで完了です。", en: "The completion cue tells you when to advance; you do not need to finish the whole path at once. On a difficult day, the minimum-start task counts." }[language]}
              </p>
              <Link href="/self-assessment" className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-violet-300 hover:text-violet-800">
                {{ zh: "回到月计划", ja: "月間計画へ", en: "Back to monthly plan" }[language]} →
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5" role="tablist" aria-label={{ zh: "选择学科路径", ja: "科目ルートを選択", en: "Choose a subject path" }[language]}>
              {subjectLearningPaths.map((path) => {
                const active = path.id === selectedPath.id;
                return (
                  <button
                    key={path.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="selected-subject-path"
                    onClick={() => setSelectedPathId(path.id)}
                    className={`rounded-2xl border px-3 py-3 text-left transition hover:-translate-y-0.5 ${active ? path.activeAccent : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm"}`}
                  >
                    <span className="mr-2" aria-hidden="true">{path.icon}</span>
                    <span className="text-sm font-bold">{path.subject[language]}</span>
                  </button>
                );
              })}
            </div>

            <article id="selected-subject-path" role="tabpanel" className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              <div className="grid gap-4 border-b border-slate-200 bg-white p-5 lg:grid-cols-[1fr_320px] lg:items-start sm:p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${selectedPath.accent}`}>{selectedPath.icon} {selectedPath.subject[language]}</span>
                    <span className="text-xs font-bold text-slate-500">{selectedPath.startPage[language]}</span>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{selectedPath.summary[language]}</p>
                  {selectedPath.note && <p className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-900">{selectedPath.note[language]}</p>}
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-800">{{ zh: "今天最低完成", ja: "今日の最低ライン", en: "Minimum for today" }[language]}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-amber-950">{selectedPath.minimum[language]}</p>
                </div>
              </div>

              <ol className="grid gap-3 p-4 sm:p-5">
                {selectedPath.steps.map((step, index) => (
                  <li key={step.href}>
                    <Link href={step.href} className="group grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md sm:grid-cols-[44px_1fr_auto] sm:items-center">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-black ${index === 0 ? selectedPath.activeAccent : "border-slate-200 bg-slate-50 text-slate-500"}`}>{index + 1}</span>
                      <span>
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-slate-900">{step.title[language]}</span>
                          {index === 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">{{ zh: "固定入口", ja: "固定入口", en: "START HERE" }[language]}</span>}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-600">{step.action[language]}</span>
                        <span className="mt-2 block text-xs leading-5 text-emerald-800"><b>{{ zh: "做到这里就停：", ja: "ここまでで終了：", en: "Stop when: " }[language]}</b>{step.doneWhen[language]}</span>
                      </span>
                      <span className="text-xs font-black text-violet-700 transition group-hover:translate-x-1">{{ zh: "打开", ja: "開く", en: "Open" }[language]} →</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </article>
            </div>}
          </section>
          <div className="mt-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">{{ zh: "自由探索", ja: "自由探索", en: "Free exploration" }[language]}</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">{{ zh: "有余力时，再从图片或兴趣入口随便逛", ja: "余力があれば、画像や興味のある入口から自由に見る", en: "When you have extra capacity, browse freely from images or interests" }[language]}</h2>
          </div>
          <section
            aria-roledescription="carousel"
            aria-label={{ zh: "探索入口", ja: "探索入口", en: "Featured exploration entries" }[language]}
            className="relative mt-5 overflow-hidden rounded-[2rem] shadow-xl touch-pan-y"
            onPointerDown={(event) => { swipeStartX.current = event.clientX; }}
            onPointerUp={(event) => {
              if (swipeStartX.current === null) return;
              const distance = event.clientX - swipeStartX.current;
              swipeStartX.current = null;
              if (Math.abs(distance) < 50) return;
              showFeatured(featuredIndex + (distance < 0 ? 1 : -1));
            }}
            onPointerCancel={() => { swipeStartX.current = null; }}
          >
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${featuredIndex * 100}%)` }}>
              {featuredEntries.map((entry, index) => (
                <article
                  key={entry.primary.href}
                  aria-hidden={index !== featuredIndex}
                  className={`min-w-full bg-gradient-to-br ${entry.gradient} p-6 pb-16 text-white sm:p-8 sm:pb-16`}
                >
                  <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div className="max-w-2xl">
                      <p className="text-xs font-bold tracking-[0.22em] text-amber-300">{entry.eyebrow[language]}</p>
                      <h2 className="mt-3 text-2xl font-black sm:text-3xl">{entry.title[language]}</h2>
                      <p className="mt-3 leading-7 text-indigo-100">{entry.description[language]}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link tabIndex={index === featuredIndex ? 0 : -1} href={entry.primary.href} className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-lg">
                        {entry.primary.label[language]} →
                      </Link>
                      <Link tabIndex={index === featuredIndex ? 0 : -1} href={entry.secondary.href} className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-lg">
                        {entry.secondary.label[language]} ✦
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <button type="button" onClick={() => showFeatured(featuredIndex - 1)} aria-label={{ zh: "上一个入口", ja: "前の入口", en: "Previous entry" }[language]} className="absolute bottom-4 left-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg font-bold text-white backdrop-blur transition hover:bg-white/25">←</button>
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
              {featuredEntries.map((entry, index) => <button key={entry.primary.href} type="button" onClick={() => showFeatured(index)} aria-label={`${index + 1} / ${featuredEntries.length}`} aria-current={index === featuredIndex ? "true" : undefined} className={`h-2 rounded-full transition-all ${index === featuredIndex ? "w-7 bg-amber-300" : "w-2 bg-white/45 hover:bg-white/70"}`} />)}
            </div>
            <button type="button" onClick={() => showFeatured(featuredIndex + 1)} aria-label={{ zh: "下一个入口", ja: "次の入口", en: "Next entry" }[language]} className="absolute bottom-4 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg font-bold text-white backdrop-blur transition hover:bg-white/25">→</button>
          </section>
          <div className="mt-10 space-y-10">
            {groups.map((group) => (
              <section key={group.title.zh}>
                <h2 className="text-xl font-bold text-slate-900">
                  {group.title[language]}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {group.description[language]}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {group.items.map(({ href, title, description, icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <h3 className="font-bold text-slate-900">{title[language]}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {description[language]}
                          </p>
                          <p className="mt-4 text-xs font-semibold text-cyan-700">
                            {{ zh: "进入探索", ja: "探索する", en: "Explore" }[language]}{" "}
                            <span className="transition group-hover:ml-1">
                              →
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
