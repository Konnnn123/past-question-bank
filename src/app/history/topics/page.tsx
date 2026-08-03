"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useExploreLanguage, type ExploreLanguage } from "@/components/ExploreLanguageProvider";
import { SidebarLayout } from "@/components/layout";
import TopicVisualLessons from "./TopicVisualLessons";

type Copy = Record<ExploreLanguage, string>;
type Topic = {
  id: string;
  number: string;
  title: Copy;
  eyebrow: Copy;
  question: Copy;
  description: Copy;
  image: string;
  imageAlt: Copy;
  accent: string;
  softAccent: string;
  stats: Copy[];
  keywords: Copy[];
  steps: { label: Copy; detail: Copy }[];
};

const c = (zh: string, ja: string, en: string): Copy => ({ zh, ja, en });

const TOPICS: Topic[] = [
  {
    id: "buddhist-styles",
    number: "01",
    eyebrow: c("日本建筑史 · 样式与部材", "日本建築史・様式と部材", "Japanese history · styles and components"),
    title: c("日本佛教建筑样式", "日本仏教建築の様式", "Japanese Buddhist architectural styles"),
    question: c("一套构件语言，如何在寺院之间迁徙、混合与再解释？", "一つの部材言語は、寺院の間をどう移動し、混ざり、読み替えられたのか。", "How did one language of components travel, mix, and change meaning across temples?"),
    description: c("从和样、大佛样、禅宗样到折衷样，不把样式当成标签，而是沿着平面、结构、细部和历史系统理解它们。", "和様・大仏様・禅宗様・折衷様をラベルとしてではなく、平面・構造・細部・歴史制度から読み解きます。", "Read Wayō, Daibutsuyō, Zenshūyō, and Setchūyō through plans, structures, details, and historical systems—not as fixed labels."),
    image: "/architecture-images/2b9e961e469080e7bcf6fd58a99ca7bb.png",
    imageAlt: c("平等院凤凰堂", "平等院鳳凰堂", "Byōdō-in Phoenix Hall"),
    accent: "bg-amber-300",
    softAccent: "bg-amber-50 text-amber-900",
    stats: [c("31页图解", "31ページの図解", "31 illustrated pages"), c("4种核心样式", "4つの主要様式", "4 core styles"), c("识图＋部材", "画像判定＋部材", "Visual ID + components")],
    keywords: [c("和样", "和様", "Wayō"), c("大佛样", "大仏様", "Daibutsuyō"), c("禅宗样", "禅宗様", "Zenshūyō"), c("折衷样", "折衷様", "Setchūyō")],
    steps: [
      { label: c("先建立坐标", "まず座標をつくる", "Build the map"), detail: c("用总时间轴与四样式矩阵拆开时期、空间和构造。", "総時間軸と比較表で時代・空間・構造を分ける。", "Separate period, space, and structure with a timeline and comparison matrix.") },
      { label: c("再追踪部材", "部材を追跡する", "Trace components"), detail: c("比较长押、贯、插肘木、诘组、扇垂木与栈唐户。", "長押・貫・挿肘木・詰組・扇垂木・桟唐戸を比較する。", "Compare nageshi, nuki, inserted brackets, dense bracket sets, fan rafters, and panelled doors.") },
      { label: c("进入具体建筑", "具体的な建築へ", "Enter real buildings"), detail: c("以平等院凤凰堂、净土寺净土堂、东大寺南大门等验证判断。", "平等院鳳凰堂・浄土寺浄土堂・東大寺南大門などで判断を確かめる。", "Test the framework against the Phoenix Hall, Jōdo-ji Jōdo-dō, and Tōdai-ji Nandaimon.") },
      { label: c("最后看混合", "最後に混合を見る", "Read the hybrids"), detail: c("用观心寺与鹤林寺理解折衷不是例外，而是中世现场。", "観心寺と鶴林寺から、折衷が例外ではなく中世の現場だったと理解する。", "Use Kanshin-ji and Kakurin-ji to see hybridity as the medieval norm, not an exception.") },
    ],
  },
  {
    id: "shrine-styles",
    number: "02",
    eyebrow: c("日本建筑史 · 类型与识别", "日本建築史・類型と識別", "Japanese history · typology and recognition"),
    title: c("神社建筑样式", "神社建築の様式", "Shinto shrine architectural styles"),
    question: c("只看入口、屋顶和空间层级，能不能认出一座陌生神社？", "入口・屋根・空間の階層だけで、未知の神社を見分けられるか。", "Can entry, roof, and sacred sequence identify an unfamiliar shrine?"),
    description: c("把九种样式整理成四条谱系，用屋顶轮廓和礼仪空间建立可迁移的识别方法。", "九つの様式を四つの系譜に整理し、屋根の輪郭と祭祀空間から応用できる識別法をつくります。", "Organize nine styles into four families and build a transferable method from roof silhouettes and ritual space."),
    image: "/architecture-images/2bae961e469080f7a76fdbf7c11b5427.png",
    imageAlt: c("春日大社本殿", "春日大社本社本殿", "Kasuga Taisha main sanctuary"),
    accent: "bg-rose-300",
    softAccent: "bg-rose-50 text-rose-900",
    stats: [c("18页图解", "18ページの図解", "18 illustrated pages"), c("9种样式", "9つの様式", "9 styles"), c("30秒识别法", "30秒識別法", "30-second ID")],
    keywords: [c("平入／妻入", "平入／妻入", "Hirairi / tsumairi"), c("屋顶指纹", "屋根の指紋", "Roof fingerprint"), c("神圣序列", "神聖な序列", "Sacred sequence")],
    steps: [
      { label: c("先问从哪边进", "入口方向を見る", "Find the entry"), detail: c("先分平入与妻入，快速缩小样式范围。", "平入と妻入を分け、候補を絞る。", "Separate side-entry from gable-end entry to narrow the field.") },
      { label: c("再看屋顶动作", "屋根の動きを見る", "Read the roof"), detail: c("判断直线、反曲、前坡延长、双屋脊或复合屋顶。", "直線・反り・前流れ・二重棟・複合屋根を判定する。", "Identify straight, curved, extended-front, double-ridge, or composite roofs.") },
      { label: c("读取神圣层级", "神聖空間を読む", "Read sacred layers"), detail: c("区分单室、前后两室、双殿与本殿—连接室—拜殿。", "一室・前後二室・双殿・本殿―中間部―拝殿を区別する。", "Distinguish one chamber, paired chambers, twin halls, and sanctuary–connector–worship hall sequences.") },
      { label: c("用轮廓反复辨析", "輪郭で反復する", "Practice silhouettes"), detail: c("把九种样式放进同一矩阵，用易混项成组练习。", "九様式を一つの表に置き、似た形式を組で練習する。", "Place all nine styles in one matrix and practice confusing pairs together.") },
    ],
  },
  {
    id: "western-churches",
    number: "03",
    eyebrow: c("西洋建筑史 · 空间与结构", "西洋建築史・空間と構造", "Western history · space and structure"),
    title: c("西洋教堂的空间与结构", "西洋教会堂の空間と構造", "Space and structure of Western churches"),
    question: c("看到陌生教堂，如何不靠猜名字也能判断它的空间与结构系统？", "未知の教会堂を、名称当てに頼らず空間と構造からどう判断するか。", "How can an unfamiliar church be read through space and structure without guessing its name?"),
    description: c("先拆开建筑身份、平面类型与时代样式，再沿早期基督教、拜占庭、罗马式、哥特式、文艺复兴和巴洛克追踪变化。", "建物の身分・平面形式・時代様式を分け、初期キリスト教からバロックまで変化を追います。", "Separate building status, plan type, and historical style, then follow change from Early Christian architecture to the Baroque."),
    image: "/architecture-images/commons-speyer-cathedral.jpg",
    imageAlt: c("施派尔主教座堂", "シュパイヤー大聖堂", "Speyer Cathedral"),
    accent: "bg-sky-300",
    softAccent: "bg-sky-50 text-sky-900",
    stats: [c("17页图解", "17ページの図解", "17 illustrated pages"), c("6个历史阶段", "6つの歴史段階", "6 historical stages"), c("哥特式四阶段", "ゴシック4段階", "4 Gothic phases")],
    keywords: [c("平面类型", "平面形式", "Plan type"), c("拱顶系统", "ヴォールト", "Vaulting"), c("墙与窗", "壁と窓", "Wall and window")],
    steps: [
      { label: c("先分三种分类", "三つの分類を分ける", "Separate classifications"), detail: c("建筑身份、平面类型、历史样式不能互相代替。", "建物の身分・平面形式・歴史様式を混同しない。", "Building status, plan type, and historical style are not interchangeable.") },
      { label: c("沿平面理解人流", "平面から動線を読む", "Follow movement"), detail: c("从身廊、翼廊、内阵、周步廊和放射状祭室读取礼仪。", "身廊・翼廊・内陣・周歩廊・放射状祭室から典礼を読む。", "Read ritual movement through nave, transept, choir, ambulatory, and radiating chapels.") },
      { label: c("沿剖面理解结构", "断面から構造を読む", "Read the section"), detail: c("比较木屋顶、穹顶、厚墙石拱顶与哥特骨架。", "木造屋根・ドーム・厚壁石造ヴォールト・ゴシック骨格を比較する。", "Compare timber roofs, domes, heavy masonry vaults, and Gothic skeletons.") },
      { label: c("最后训练陌生图片", "未知画像で練習する", "Test unfamiliar images"), detail: c("同时检查拱、墙窗比例、受力系统与空间方向，避免单线索判断。", "アーチ・壁窓比・構造・空間方向を同時に確認する。", "Check arches, wall-to-window ratio, structure, and spatial direction together.") },
    ],
  },
];

export default function HistoryTopicsPage() {
  const { language } = useExploreLanguage();
  const [activeId, setActiveId] = useState(TOPICS[0].id);
  const active = TOPICS.find((topic) => topic.id === activeId) ?? TOPICS[0];
  const t = (value: Copy) => value[language];

  return (
    <SidebarLayout>
      <div className="min-h-full bg-[#f3f0e9] text-slate-950">
        <header className="relative overflow-hidden bg-slate-950 px-5 pb-20 pt-12 text-white sm:px-8 lg:px-12">
          <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-5 -top-16 h-72 w-72 rounded-full border border-white/10" />
          <div className="relative mx-auto max-w-6xl">
            <Link href="/explore" className="text-xs font-bold tracking-[0.2em] text-amber-300 hover:text-amber-200">
              ← {t(c("返回探索", "探索へ戻る", "Back to Explore"))}
            </Link>
            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-end">
              <div>
                <p className="text-sm font-semibold tracking-[0.24em] text-stone-400">TOPIC STUDY · 专题学习</p>
                <h1 className="mt-4 max-w-3xl whitespace-pre-line text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">
                  {t(c("从一个问题出发，\n把散开的知识重新连起来", "一つの問いから、\n散らばった知識を結び直す", "Begin with one question.\nReconnect scattered knowledge."))}
                </h1>
              </div>
              <p className="border-l border-white/20 pl-5 text-sm leading-7 text-stone-300">
                {t(c("专题不按教材章节切割。每一条路径都把时间、样式、构法、人物与具体建筑放在同一个问题里理解。", "教材の章立てではなく、時間・様式・構法・人物・具体的な建築を一つの問いでつなぎます。", "Topics do not follow textbook chapters. Each path connects time, style, construction, people, and buildings through one question."))}
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:px-12">
          <section className="-mt-10 grid gap-4 lg:grid-cols-3" aria-label={t(c("专题列表", "テーマ一覧", "Topic list"))}>
            {TOPICS.map((topic) => {
              const selected = active.id === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setActiveId(topic.id)}
                  aria-pressed={selected}
                  className={`group overflow-hidden rounded-[1.75rem] border bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${selected ? "border-slate-950 ring-2 ring-slate-950/10" : "border-white"}`}
                >
                  <div className="relative h-44 overflow-hidden bg-stone-200">
                    <Image src={topic.image} alt={t(topic.imageAlt)} fill unoptimized loading="eager" sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black text-slate-950 ${topic.accent}`}>{topic.number}</span>
                    {selected && <span className="absolute bottom-4 right-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900">{t(c("正在查看", "表示中", "Viewing"))}</span>}
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-bold tracking-[0.12em] text-stone-500">{t(topic.eyebrow)}</p>
                    <h2 className="mt-2 text-xl font-black leading-snug">{t(topic.title)}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{t(topic.question)}</p>
                  </div>
                </button>
              );
            })}
          </section>

          <section className="mt-14 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-80 bg-slate-900 lg:min-h-[36rem]">
                <Image src={active.image} alt={t(active.imageAlt)} fill unoptimized loading="eager" sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                  <p className="text-xs font-black tracking-[0.2em] text-amber-300">{active.number} · {t(active.eyebrow)}</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight">{t(active.title)}</h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-stone-200">{t(active.description)}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {active.stats.map((stat) => <span key={stat.en} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">{t(stat)}</span>)}
                  </div>
                </div>
              </div>

              <div className="p-7 sm:p-9">
                <p className="text-xs font-black tracking-[0.2em] text-stone-400">{t(c("学习路径", "学習ルート", "LEARNING PATH"))}</p>
                <ol className="mt-6 space-y-5">
                  {active.steps.map((step, index) => (
                    <li key={step.label.en} className="grid grid-cols-[2.5rem_1fr] gap-4">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${active.softAccent}`}>{index + 1}</span>
                      <div className="border-b border-stone-100 pb-5">
                        <h3 className="font-black text-slate-900">{t(step.label)}</h3>
                        <p className="mt-1.5 text-sm leading-6 text-slate-500">{t(step.detail)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-7 flex flex-wrap gap-2">
                  {active.keywords.map((keyword) => <span key={keyword.en} className={`rounded-full px-3 py-1.5 text-xs font-bold ${active.softAccent}`}>{t(keyword)}</span>)}
                </div>
                <a href="#visual-content" className="mt-8 block rounded-2xl bg-slate-950 px-5 py-3.5 text-center text-sm font-bold text-white transition hover:bg-violet-800">
                  {t(c("继续看本页图例与真实案例", "このページの図例と実例を見る", "Continue to diagrams and real cases"))} ↓
                </a>
              </div>
            </div>
          </section>

          <section id="visual-content" className="mt-14 scroll-mt-6 rounded-[2rem] border border-stone-200 bg-[#fbfaf7] p-6 shadow-sm sm:p-9 lg:p-12">
            <TopicVisualLessons topicId={active.id} language={language} />
          </section>

        </main>
      </div>
    </SidebarLayout>
  );
}
