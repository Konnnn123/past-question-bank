import Image from "next/image";
import type { ExploreLanguage } from "@/components/ExploreLanguageProvider";

type Copy = Record<ExploreLanguage, string>;
const c = (zh: string, ja: string, en: string): Copy => ({ zh, ja, en });

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-black tracking-[0.2em] text-violet-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
    </header>
  );
}

function CaseFigure({ image, name, meta, clue, marker = "①" }: { image: string; name: string; meta: string; clue: string; marker?: string }) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        <Image src={`/architecture-images/${image}`} alt={name} fill unoptimized sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition duration-500 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-amber-300 text-sm font-black text-slate-950 shadow-lg">{marker}</span>
        <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-[10px] font-black tracking-[0.15em] text-amber-200">{meta}</p>
          <h4 className="mt-1 text-lg font-black">{name}</h4>
        </figcaption>
      </div>
      <div className="grid grid-cols-[2.25rem_1fr] gap-3 p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">{marker}</span>
        <div><p className="text-[10px] font-black tracking-widest text-stone-400">LOOK HERE</p><p className="mt-1 text-sm leading-6 text-slate-700">{clue}</p></div>
      </div>
    </figure>
  );
}

function RoofDiagram({ title, subtitle, path, entry }: { title: string; subtitle: string; path: string; entry: "side" | "gable" | "axis" }) {
  const entryX = entry === "gable" ? 150 : entry === "axis" ? 100 : 55;
  return (
    <figure className="rounded-2xl border border-stone-200 bg-white p-4">
      <svg viewBox="0 0 200 115" role="img" aria-label={`${title}: ${subtitle}`} className="h-28 w-full">
        <path d={path} fill="none" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M35 82 H165" fill="none" stroke="#94a3b8" strokeWidth="3" />
        <path d={`M${entryX} 105 V86`} fill="none" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" />
        <path d={`M${entryX - 5} 93 L${entryX} 86 L${entryX + 5} 93`} fill="none" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <figcaption><p className="font-black text-slate-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p></figcaption>
    </figure>
  );
}

function PlanCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <figure className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex min-h-52 items-center justify-center rounded-2xl bg-[#f5f1e8] p-4">{children}</div>
      <figcaption className="mt-4"><p className="font-black text-slate-950">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p></figcaption>
    </figure>
  );
}

function SourceFigure({ src, alt, eyebrow, title, description, source, credit, callouts = [] }: { src: string; alt: string; eyebrow: string; title: string; description: string; source: string; credit: string; callouts?: string[] }) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <div className="relative border-b border-stone-200 bg-[#eeeae1]" style={{ height: "32rem" }}>
        <Image src={src} alt={alt} fill unoptimized loading="eager" sizes="(max-width: 1024px) 100vw, 1100px" className="object-contain p-4 sm:p-7" />
      </div>
      {callouts.length > 0 && <div className="grid gap-px border-b border-stone-200 bg-stone-200 sm:grid-cols-2 xl:grid-cols-4">{callouts.map((item, index) => <div key={item} className="flex gap-3 bg-amber-50 p-4 text-xs font-bold leading-5 text-slate-700"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[10px] text-white">{index + 1}</span><span>{item}</span></div>)}</div>}
      <figcaption className="border-t border-stone-100 p-5">
        <p className="text-[10px] font-black tracking-[0.18em] text-violet-700">{eyebrow}</p>
        <h4 className="mt-2 text-lg font-black text-slate-950">{title}</h4>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <a href={source} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[11px] font-bold text-slate-400 underline decoration-slate-300 underline-offset-4 hover:text-violet-700">{credit}</a>
      </figcaption>
    </figure>
  );
}

type MemberKind = "nageshi" | "nuki" | "sashihijiki" | "tsumegumi" | "sankarado" | "ebikoryo";

function MemberDiagram({ kind, label }: { kind: MemberKind; label: string }) {
  const common = <><path d="M62 22 V154 M178 22 V154" stroke="#5b4636" strokeWidth="16" strokeLinecap="round" /><path d="M30 154 H210" stroke="#9a7b5d" strokeWidth="8" strokeLinecap="round" /></>;
  return (
    <svg viewBox="0 0 240 175" role="img" aria-label={label} className="h-44 w-full rounded-2xl bg-[#f0eadf]">
      {kind === "nageshi" && <>{common}<path d="M40 66 H200" stroke="#d97706" strokeWidth="20" strokeLinecap="round" /><path d="M48 66 H192" stroke="#fbbf24" strokeWidth="5" strokeDasharray="8 6" /><circle cx="62" cy="66" r="7" fill="#7c2d12" /><circle cx="178" cy="66" r="7" fill="#7c2d12" /></>}
      {kind === "nuki" && <>{common}<path d="M25 82 H215" stroke="#d97706" strokeWidth="16" strokeLinecap="round" /><path d="M51 70 L69 70 L62 88Z M167 70 L185 70 L178 88Z" fill="#7c2d12" /><path d="M24 82 H216" stroke="#fef3c7" strokeWidth="3" /></>}
      {kind === "sashihijiki" && <><path d="M120 18 V158" stroke="#5b4636" strokeWidth="20" strokeLinecap="round" />{[52,82,112].map((y, index) => <g key={y}><path d={`M${78 - index * 12} ${y} H${162 + index * 12}`} stroke="#d97706" strokeWidth="14" strokeLinecap="round" /><rect x={106 - index * 3} y={y - 12} width={28 + index * 6} height="12" rx="3" fill="#92400e" /></g>)}<path d="M42 126 H198" stroke="#5b4636" strokeWidth="9" /><path d="M120 34 V132" stroke="#fbbf24" strokeWidth="3" strokeDasharray="5 5" /></>}
      {kind === "tsumegumi" && <>{common}<path d="M28 48 H212" stroke="#5b4636" strokeWidth="8" />{[48,84,120,156,192].map((x) => <g key={x}><rect x={x - 13} y="50" width="26" height="12" rx="3" fill="#92400e" /><path d={`M${x - 22} 70 H${x + 22}`} stroke="#d97706" strokeWidth="10" strokeLinecap="round" /><rect x={x - 10} y="76" width="20" height="10" rx="2" fill="#92400e" /></g>)}</>}
      {kind === "sankarado" && <><rect x="45" y="20" width="150" height="140" rx="4" fill="#fffaf0" stroke="#5b4636" strokeWidth="10" /><path d="M120 22 V158 M48 62 H192 M48 108 H192" stroke="#d97706" strokeWidth="8" /><path d="M76 24 V157 M164 24 V157" stroke="#9a7b5d" strokeWidth="4" /><circle cx="107" cy="86" r="5" fill="#7c2d12" /><circle cx="133" cy="86" r="5" fill="#7c2d12" /></>}
      {kind === "ebikoryo" && <><path d="M54 54 V155 M186 92 V155" stroke="#5b4636" strokeWidth="17" strokeLinecap="round" /><path d="M42 44 H91 M153 82 H200" stroke="#92400e" strokeWidth="13" strokeLinecap="round" /><path d="M72 64 Q120 120 170 91" fill="none" stroke="#d97706" strokeWidth="20" strokeLinecap="round" /><path d="M77 61 Q120 101 165 86" fill="none" stroke="#fbbf24" strokeWidth="4" /></>}
      <text x="120" y="169" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b">{label}</text>
    </svg>
  );
}

function BuddhistLesson({ language }: { language: ExploreLanguage }) {
  const t = (value: Copy) => value[language];
  const timeline = [
    { year: "1053", title: c("平等院凤凰堂", "平等院鳳凰堂", "Phoenix Hall"), note: c("成熟和样＋净土空间", "成熟した和様＋浄土空間", "Mature Wayō + Pure Land space") },
    { year: "1180", title: c("南都烧毁", "南都焼討", "Nara destroyed"), note: c("东大寺复兴成为技术转折", "東大寺復興が技術的転換点に", "Reconstruction becomes a technical turning point") },
    { year: "1192", title: c("净土寺净土堂", "浄土寺浄土堂", "Jōdo-ji Jōdo-dō"), note: c("大佛样也能制造诗意空间", "大仏様が詩的空間を生む", "Daibutsuyō creates poetic space") },
    { year: "13C", title: c("禅院制度扩张", "禅院制度の拡大", "Zen institutions spread"), note: c("伽蓝、日常与部材一起输入", "伽藍・日常・部材が共に伝来", "Compound, daily life, and components arrive together") },
    { year: "14–15C", title: c("折衷成为常态", "折衷が常態化", "Hybridity becomes normal"), note: c("地方佛堂重新组合三套语言", "地方仏堂が三つの言語を再構成", "Regional halls recombine three languages") },
    { year: "1661", title: c("万福寺开创", "萬福寺開創", "Manpuku-ji founded"), note: c("黄檗样带来明代更新", "黄檗様が明代文化を更新", "Ōbaku brings a Ming-period update") },
  ];
  const styles = [
    { name: c("和样", "和様", "Wayō"), hook: c("安静的水平底盘", "静かな水平の基盤", "Quiet horizontal base"), period: c("平安中后期成熟，持续全史", "平安中後期に成熟、全時代に継続", "Mature by late Heian; persists"), structure: c("长押、柱上斗栱", "長押・柱上組物", "Nageshi; brackets over columns"), roof: c("平行垂木、野屋根", "平行垂木・野屋根", "Parallel rafters; hidden roof"), space: c("板地、缘、横向展开", "板敷・縁・横への展開", "Board floor, veranda, lateral spread"), tone: "border-amber-300 bg-amber-50" },
    { name: c("大佛样", "大仏様", "Daibutsuyō"), hook: c("结构肌肉外露", "構造の筋肉が露出", "Structure with exposed muscle"), period: c("12世纪末—13世纪初最典型", "12世紀末〜13世紀初頭が典型", "Most typical c. 1200"), structure: c("贯、插肘木、巨材", "貫・挿肘木・巨材", "Nuki, inserted brackets, massive timber"), roof: c("强直线、角部扇垂木", "強い直線・隅扇垂木", "Strong lines; fan rafters at corners"), space: c("巨大、开放、荷载路径可见", "巨大・開放・荷重経路が可視", "Vast, open, legible load paths"), tone: "border-orange-300 bg-orange-50" },
    { name: c("禅宗样", "禅宗様", "Zenshūyō"), hook: c("檐下高密度系统", "軒下の高密度システム", "Dense system beneath the eaves"), period: c("13世纪以后扩散", "13世紀以後に拡散", "Spreads after the 13th century"), structure: c("贯、台轮、诘组", "貫・台輪・詰組", "Nuki, daiwa, dense brackets"), roof: c("扇垂木、深檐", "扇垂木・深い軒", "Fan rafters; deep eaves"), space: c("轴线化禅院与制度性日常", "軸線的禅院と制度化された日常", "Axial monastery and regulated daily life"), tone: "border-cyan-300 bg-cyan-50" },
    { name: c("折衷样", "折衷様", "Setchūyō"), hook: c("底盘不换，插件叠加", "基盤を保ち、部材を重ねる", "Keep the base; add components"), period: c("13世纪以后，14—15世纪尤多", "13世紀以後、特に14〜15世紀", "After 13th c.; especially 14th–15th"), structure: c("和样基底＋贯与新梁架", "和様基盤＋貫と新しい梁架", "Wayō base + nuki and new beams"), roof: c("多套檐下系统并用", "複数の軒下システムを併用", "Multiple eave systems combined"), space: c("功能平面稳定，细部选择性更新", "機能平面を保ち、細部を選択的に更新", "Stable functional plan; selective detail updates"), tone: "border-violet-300 bg-violet-50" },
  ];
  const members = [
    ["nageshi", "長押 nageshi", c("贴在柱表面，不穿柱；看得到柱与横材的叠压关系。", "柱を貫かず表面に付く。柱と横材の重なりを見る。", "Attached to the post face rather than passing through it; read the overlap.")],
    ["nuki", "貫 nuki", c("横材穿过柱身并用楔锁定；连续横线把柱列联成整体。", "横材が柱身を貫き楔で締結し、柱列を一体化する。", "A rail passes through posts and is wedged, binding the entire row.")],
    ["sashihijiki", "挿肘木 sashihijiki", c("肘木从柱身直接挑出并逐层加长，把深檐荷载送入柱。", "肘木が柱身から段階的に持ち出し、深い軒荷重を柱へ送る。", "Bracket arms project directly from the post in stages, carrying deep eaves inward.")],
    ["tsumegumi", "詰組 tsumegumi", c("斗栱不仅在柱顶，柱间也密排，檐下因此形成连续机械带。", "組物を柱上だけでなく柱間にも密配し、連続する軒下帯をつくる。", "Brackets fill the spaces between columns, creating a continuous mechanical band.")],
    ["sankarado", "桟唐戸 sankarado", c("竖框与横栈构成格状门扇；它是建具，不要误判成主结构。", "縦框と横桟で格子状の扉をつくる。建具であり主構造ではない。", "Stiles and rails form a panelled door; it is joinery, not primary structure.")],
    ["ebikoryo", "海老虹梁 ebikōryō", c("弯梁跨接两处不同高度，常把外侧檐柱与较高主体相连。", "高さの異なる二点を曲梁でつなぎ、外側柱と高い主体を結ぶ。", "A curved beam bridges unequal heights, often joining an outer post to a taller core.")],
  ] as const;
  const cases = [
    { image: "2b9e961e469080e7bcf6fd58a99ca7bb.png", name: c("平等院凤凰堂", "平等院鳳凰堂", "Byōdō-in Phoenix Hall"), meta: c("和样＋净土式 · 1053", "和様＋浄土式・1053", "Wayō + Pure Land · 1053"), clue: c("先看横向展开的翼廊、池水倒影与低缓屋顶；这里要把建筑、庭园和观看方向一起读。", "横に延びる翼廊、池の反射、低い屋根を見る。建築・庭園・視線を一体で読む。", "Read the lateral wings, pond reflection, and low roof together with landscape and viewing direction.") },
    { image: "2bbe961e469080a9857ce7c42034b7b1_0.png", name: c("东大寺南大门", "東大寺南大門", "Tōdai-ji Nandaimon"), meta: c("大佛样 · 1199", "大仏様・1199", "Daibutsuyō · 1199"), clue: c("柱身之间的贯材和层层插出的肘木直接组成立面；结构不是藏在装饰后，而是成为视觉主题。", "柱間の貫と柱身から重なる挿肘木が立面をつくる。構造そのものが視覚主題。", "Penetrating ties and stacked inserted brackets form the façade; structure itself becomes the visual subject.") },
    { image: "2bbe961e46908060b6b5f8367092d342.png", name: c("圆觉寺舍利殿", "円覚寺舎利殿", "Engaku-ji Shariden"), meta: c("禅宗样 · 室町前期", "禅宗様・室町前期", "Zenshūyō · early Muromachi"), clue: c("看柱端粽、密排诘组、扇垂木与栈唐户共同形成的细密机械感，不能只凭火灯窗判断。", "柱端の粽、詰組、扇垂木、桟唐戸がつくる緻密な機械感を見る。火灯窓だけで判断しない。", "Look for tapered post tops, dense brackets, fan rafters, and panelled doors—not the cusped window alone.") },
    { image: "2bbe961e46908015a0fdfae3867a6c64.png", name: c("观心寺金堂", "観心寺金堂", "Kanshin-ji Kondō"), meta: c("折衷样 · 14世纪", "折衷様・14世紀", "Setchūyō · 14th century"), clue: c("整体仍是深进深的密教本堂，但柱脚、门窗和梁架选择性吸收大佛样与禅宗样部材。", "深い密教本堂を基盤に、柱脚・建具・梁架へ大仏様と禅宗様を選択的に導入。", "An esoteric-hall base selectively absorbs Daibutsuyō and Zenshūyō at post bases, doors, and beams.") },
  ];

  return (
    <div className="space-y-16">
      <SectionHeading eyebrow={t(c("PDF 01 · 核心内容", "PDF 01・主要内容", "PDF 01 · CORE CONTENT"))} title={t(c("样式不是建筑的身份证，而是一套可拆装的部材语言", "様式は建築の身分証ではなく、組み替え可能な部材言語", "Styles are not identities—they are recombinable languages of components"))} description={t(c("以下把原讲义中的总时间轴、四样式矩阵、部材图鉴与识图逻辑直接转成网页内容。先看系统如何叠加，再进入单座建筑。", "元資料の総時間軸・四様式比較・部材図鑑・画像判定をウェブ上に再構成しました。まずシステムの重なりを見てから個別建築へ進みます。", "The source timeline, four-style matrix, component atlas, and visual-identification method are rebuilt below for the web. Begin with overlapping systems, then move to individual buildings."))} />

      <section>
        <h3 className="text-lg font-black">{t(c("总时间轴：工具箱不断加料", "総時間軸：道具箱に要素が加わり続ける", "Master timeline: the toolkit keeps expanding"))}</h3>
        <div className="mt-6 overflow-x-auto pb-3">
          <div className="relative grid min-w-[960px] grid-cols-6 gap-4 before:absolute before:left-8 before:right-8 before:top-5 before:h-px before:bg-slate-300">
            {timeline.map((item, index) => (
              <article key={item.year} className="relative pt-12">
                <span className="absolute left-0 top-0 flex h-10 min-w-10 items-center justify-center rounded-full bg-slate-950 px-2 text-xs font-black text-white ring-4 ring-[#f3f0e9]">{item.year}</span>
                <p className="text-sm font-black text-slate-900">{t(item.title)}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{t(item.note)}</p>
                {index < timeline.length - 1 && <span className="sr-only">→</span>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-black">{t(c("四样式速查矩阵", "四様式クイック比較", "Four-style comparison"))}</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {styles.map((style) => (
            <article key={style.name.en} className={`rounded-3xl border p-5 ${style.tone}`}>
              <h4 className="text-2xl font-black">{t(style.name)}</h4>
              <p className="mt-1 text-xs font-bold text-slate-600">{t(style.hook)}</p>
              <dl className="mt-5 space-y-4 text-sm">
                <div><dt className="text-[10px] font-black tracking-widest text-slate-400">PERIOD</dt><dd className="mt-1 leading-5">{t(style.period)}</dd></div>
                <div><dt className="text-[10px] font-black tracking-widest text-slate-400">STRUCTURE</dt><dd className="mt-1 leading-5">{t(style.structure)}</dd></div>
                <div><dt className="text-[10px] font-black tracking-widest text-slate-400">ROOF</dt><dd className="mt-1 leading-5">{t(style.roof)}</dd></div>
                <div><dt className="text-[10px] font-black tracking-widest text-slate-400">SPACE</dt><dd className="mt-1 leading-5">{t(style.space)}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-black tracking-[0.18em] text-violet-700">VISUAL LEGEND</p><h3 className="mt-2 text-lg font-black">{t(c("四种结构语言，先看线条在哪里", "四つの構造言語：線がどこに現れるか", "Four structural languages: follow where the lines appear"))}</h3></div>
          <div className="flex gap-4 text-[11px] font-bold text-slate-500"><span><b className="text-slate-950">━━</b> {t(c("主构件", "主部材", "primary member"))}</span><span><b className="text-rose-600">↑</b> {t(c("入口／观察方向", "入口／視線", "entry / viewing direction"))}</span></div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <RoofDiagram title={t(c("和样", "和様", "Wayō"))} subtitle={t(c("平缓平行线＋柱上斗栱", "緩い平行線＋柱上組物", "Calm parallel lines + brackets over posts"))} path="M28 58 L100 30 L172 58 M40 58 H160 M55 58 V82 M100 58 V82 M145 58 V82" entry="side" />
          <RoofDiagram title={t(c("大佛样", "大仏様", "Daibutsuyō"))} subtitle={t(c("贯穿柱线＋层层挑出", "柱を貫く線＋多段の持出し", "Through-ties + stacked projections"))} path="M25 55 L100 24 L175 55 M45 45 H155 M38 57 H162 M55 42 V82 M100 30 V82 M145 42 V82" entry="side" />
          <RoofDiagram title={t(c("禅宗样", "禅宗様", "Zenshūyō"))} subtitle={t(c("扇形檐线＋柱间密排", "扇形の軒線＋柱間の密配", "Fan-like eaves + dense intercolumnar rhythm"))} path="M25 60 Q100 17 175 60 M35 55 H165 M50 54 V82 M75 47 V82 M100 42 V82 M125 47 V82 M150 54 V82" entry="gable" />
          <RoofDiagram title={t(c("折衷样", "折衷様", "Setchūyō"))} subtitle={t(c("稳定底盘＋局部插件", "安定した基盤＋局部の部材", "Stable base + selective components"))} path="M25 58 L100 28 L175 58 M42 58 H158 M52 58 V82 M100 45 V82 M148 58 V82 M52 68 H148" entry="side" />
        </div>
      </section>

      <section>
        <p className="text-xs font-black tracking-[0.18em] text-violet-700">PLAN LOGIC</p>
        <h3 className="mt-2 text-lg font-black">{t(c("PDF 里的平面不是附录：它解释宗教活动怎样塑造空间", "PDFの平面は付録ではない：宗教行為が空間をどう形づくるか", "Plans are not an appendix: they show how ritual shapes space"))}</h3>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <PlanCard title={t(c("净土式庭园", "浄土式庭園", "Pure Land garden"))} subtitle={t(c("从此岸隔水观看彼岸：池、岛、佛堂和落日方向构成一套完整装置。", "此岸から水越しに彼岸を見る。池・島・仏堂・夕日の方向が一体となる。", "Pond, island, hall, and sunset direction turn viewing into a ritual device."))}>
            <svg viewBox="0 0 280 170" className="w-full" role="img" aria-label={t(c("净土式庭园平面示意", "浄土式庭園平面模式図", "Pure Land garden plan diagram"))}>
              <path d="M18 112 Q70 75 118 105 T262 100 V154 H18Z" fill="#7dd3fc" opacity=".65" />
              <rect x="105" y="20" width="72" height="40" rx="5" fill="#f59e0b" /><path d="M92 60 H190" stroke="#92400e" strokeWidth="4" />
              <circle cx="140" cy="91" r="16" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
              <path d="M140 150 V112" stroke="#e11d48" strokeWidth="4" /><path d="M134 121 L140 112 L146 121" fill="none" stroke="#e11d48" strokeWidth="3" />
              <text x="141" y="45" textAnchor="middle" fontSize="12" fontWeight="700">{t(c("佛堂", "仏堂", "Hall"))}</text><text x="140" y="96" textAnchor="middle" fontSize="10">{t(c("岛", "島", "island"))}</text><text x="140" y="166" textAnchor="middle" fontSize="10">{t(c("此岸／视线", "此岸／視線", "shore / view"))}</text>
            </svg>
          </PlanCard>
          <PlanCard title={t(c("密教本堂", "密教本堂", "Esoteric main hall"))} subtitle={t(c("外阵容纳礼拜者，内阵包围本尊；进深和结界比立面样式更能说明功能。", "外陣は礼拝者、内陣は本尊を囲む。奥行と結界が機能を説明する。", "Outer and inner sancta organize worshippers, icons, depth, and ritual boundaries."))}>
            <svg viewBox="0 0 280 170" className="w-full" role="img" aria-label={t(c("密教本堂平面示意", "密教本堂平面模式図", "Esoteric hall plan diagram"))}>
              <rect x="35" y="20" width="210" height="130" rx="7" fill="#fff" stroke="#0f172a" strokeWidth="4" />
              <rect x="70" y="35" width="140" height="55" rx="4" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
              <rect x="70" y="96" width="140" height="38" rx="4" fill="#c4b5fd" />
              <path d="M140 163 V138" stroke="#e11d48" strokeWidth="4" /><path d="M134 146 L140 138 L146 146" fill="none" stroke="#e11d48" strokeWidth="3" />
              <text x="140" y="66" textAnchor="middle" fontSize="12" fontWeight="700">{t(c("内阵／本尊", "内陣／本尊", "inner sanctum"))}</text><text x="140" y="120" textAnchor="middle" fontSize="12" fontWeight="700">{t(c("外阵", "外陣", "outer sanctum"))}</text><text x="53" y="87" textAnchor="middle" fontSize="10" transform="rotate(-90 53 87)">{t(c("缘", "縁", "veranda"))}</text>
            </svg>
          </PlanCard>
          <PlanCard title={t(c("禅院伽蓝", "禅院伽藍", "Zen monastery compound"))} subtitle={t(c("山门—佛殿—法堂形成主轴，僧堂与库院把修行、饮食和劳动组织在轴线两侧。", "山門―仏殿―法堂が主軸をつくり、僧堂と庫院が修行と日常を両側に配する。", "Gate, Buddha hall, and Dharma hall form the axis; daily monastic functions flank it."))}>
            <svg viewBox="0 0 280 170" className="w-full" role="img" aria-label={t(c("禅院伽蓝平面示意", "禅院伽藍平面模式図", "Zen monastery compound diagram"))}>
              <path d="M140 162 V15" stroke="#94a3b8" strokeWidth="3" strokeDasharray="5 5" />
              {[{ y: 132, label: t(c("山门", "山門", "Gate")) }, { y: 80, label: t(c("佛殿", "仏殿", "Buddha hall")) }, { y: 28, label: t(c("法堂", "法堂", "Dharma hall")) }].map((item) => <g key={item.y}><rect x="103" y={item.y - 14} width="74" height="28" rx="4" fill="#fbbf24" stroke="#92400e" /><text x="140" y={item.y + 4} textAnchor="middle" fontSize="11" fontWeight="700">{item.label}</text></g>)}
              <rect x="18" y="65" width="66" height="36" rx="4" fill="#a5f3fc" /><text x="51" y="87" textAnchor="middle" fontSize="11">{t(c("僧堂", "僧堂", "Monks' hall"))}</text>
              <rect x="196" y="65" width="66" height="36" rx="4" fill="#c4b5fd" /><text x="229" y="87" textAnchor="middle" fontSize="11">{t(c("库院", "庫院", "Kitchen"))}</text>
            </svg>
          </PlanCard>
        </div>
      </section>

      <section className="rounded-[2rem] border border-violet-200 bg-violet-50 p-6 sm:p-8">
        <p className="text-xs font-black tracking-[0.18em] text-violet-700">PEOPLE × TRANSFER</p>
        <h3 className="mt-2 text-xl font-black">{t(c("关键人物不是“名建筑师名单”，而是技术与制度的搬运节点", "重要人物は「建築家名簿」ではなく、技術と制度を運ぶ結節点", "Key figures are transfer nodes for techniques and institutions—not a list of star architects"))}</h3>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["重源 Chōgen · 1121–1206", c("组织东大寺复兴，把宋代见闻、募缘、木材运输与工匠系统连成大佛样工程。", "東大寺復興を組織し、宋代の知識・勧進・木材輸送・工匠を大仏様へ結びつけた。", "Organized Tōdai-ji's rebuilding, joining Song knowledge, fundraising, timber logistics, and craftsmen.")],
            ["栄西 Eisai · 1141–1215", c("以临济禅传播与寺院建立推动禅院制度进入日本；影响不限于某个构件。", "臨済禅の伝播と寺院創設を通じて禅院制度を導入した。影響は単一部材に限られない。", "Advanced Rinzai institutions and monasteries; his significance exceeds any single component.")],
            ["道元 Dōgen · 1200–1253", c("把坐禅、日常规制与僧团空间连在一起，提示“样式”也包括生活制度。", "坐禅・日常規則・僧団空間を結び、様式が生活制度でもあることを示す。", "Linked meditation, daily regulation, and monastic space—style also operates as a way of life.")],
            ["隠元隆琦 Ingen · 1592–1673", c("1654年来日、开创万福寺，把明代禅院文化更新为黄檗样。", "1654年来日し萬福寺を開き、明代禅院文化を黄檗様として更新した。", "Arrived in 1654 and founded Manpuku-ji, bringing a Ming-period renewal through Ōbaku culture.")],
          ].map(([name, detail]) => <article key={name as string} className="rounded-2xl bg-white p-5 shadow-sm"><p className="font-black text-slate-950">{name as string}</p><p className="mt-2 text-xs leading-6 text-slate-600">{t(detail as Copy)}</p></article>)}
        </div>
      </section>

      <section>
        <p className="text-xs font-black tracking-[0.18em] text-violet-700">REAL STRUCTURE</p>
        <h3 className="mt-2 text-lg font-black">{t(c("把抽象构件放回真实节点", "抽象部材を実際の節点へ戻す", "Put abstract members back into a real joint"))}</h3>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <SourceFigure src="/topic-study/todaiji-bracket-detail.jpg" alt={t(c("东大寺南大门插肘木与斗栱细部", "東大寺南大門の挿肘木と組物の細部", "Inserted bracket arms and bracket complex at Tōdai-ji Nandaimon"))} eyebrow="TŌDAI-JI · STRUCTURAL DETAIL" title={t(c("插肘木不是一个符号，而是连续挑出的受力层", "挿肘木は記号ではなく、連続して持ち出す荷重層", "Inserted bracket arms form successive load-bearing projections"))} description={t(c("沿柱身向上看：肘木直接插入柱体，层层向外承接深檐；再横向看贯材如何把柱列绑成整体。", "柱身を上へ追うと、肘木が柱へ直接差し込まれ、深い軒を段階的に支える。次に貫が柱列を結ぶ様子を見る。", "Trace upward: bracket arms enter the post and project in stages beneath the deep eaves. Then read the horizontal ties binding the post row."))} source="https://commons.wikimedia.org/wiki/File:Mutesaki_tokyou.jpg" credit="Urashimataro / 663highland · Wikimedia Commons · CC BY-SA 3.0" />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["01", c("找柱身", "柱身を探す", "Find the post"), c("先确定竖向主构件，避免把装饰层当作全部结构。", "まず垂直主材を確認し、装飾層だけを構造と見なさない。", "Locate the main vertical member before reading ornament.")],
              ["02", c("找插入点", "挿入点を探す", "Find insertion points"), c("观察横向肘木是否直接进入柱身，而不是只坐在柱顶。", "横材が柱頂だけでなく柱身へ直接入るかを見る。", "Check whether horizontal arms enter the post rather than merely sitting on top.")],
              ["03", c("追荷载路径", "荷重経路を追う", "Trace the load path"), c("从深檐向内追到肘木、柱，再落到基础。", "深い軒から肘木・柱・基礎へ荷重を追う。", "Follow the deep eaves inward through brackets, post, and foundation.")],
            ].map(([n, title, detail]) => <article key={n as string} className="rounded-2xl border border-stone-200 bg-white p-4"><span className="text-xs font-black text-violet-700">{n as string}</span><h4 className="mt-2 font-black">{t(title as Copy)}</h4><p className="mt-1 text-xs leading-5 text-slate-500">{t(detail as Copy)}</p></article>)}
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <SourceFigure src="/topic-study/three-step-bracket.svg" alt={t(c("三手先斗栱构成示意", "三手先組物の構成図", "Three-stepped bracket complex diagram"))} eyebrow="DRAWING · 三手先 MITESAKI" title={t(c("先在图解中拆开三层出挑", "図解で三段の持出しを分解する", "Separate the three projecting stages in the drawing"))} description={t(c("从柱顶向外数出三层承托：斗负责转换接触面，肘木向外出挑，最上层承接桁与檐。再与东大寺照片对照各层在真实木构中的遮挡关系。", "柱頂から三段の支持を数える。斗が接触面を変換し、肘木が外へ持ち出し、上段が桁と軒を受ける。", "Count three supporting stages from the post: blocks change bearing surfaces, arms project outward, and the upper stage receives purlins and eaves."))} source="https://commons.wikimedia.org/wiki/File:Mitesaki.svg" credit="Urashimataro · Wikimedia Commons · CC BY-SA 3.0" />
          <SourceFigure src="/topic-study/tsumegumi-kenchoji.jpg" alt={t(c("建长寺佛殿诘组斗栱", "建長寺仏殿の詰組", "Intercolumnar bracket complexes at Kenchō-ji Butsuden"))} eyebrow="SITE PHOTO · 詰組 TSUMEGUMI" title={t(c("柱间被连续斗栱填满", "柱間が連続する組物で満たされる", "Continuous brackets fill the intercolumnar bays"))} description={t(c("先找两根柱，再看它们之间仍然出现多组斗栱。这个“柱间也有、而且连续密排”的证据，比单独看到一组华丽斗栱更能确认禅宗样。", "二本の柱を確認し、その間にも複数の組物が続くことを見る。この密度が禅宗様の強い証拠になる。", "Find two posts, then observe several bracket sets between them. Intercolumnar density is stronger evidence for Zenshūyō than ornament alone."))} source="https://commons.wikimedia.org/wiki/File:Tsumegumi_Butsuden_Kenchouji.jpg" credit="Urashimataro · Wikimedia Commons · CC0" />
        </div>
      </section>

      <section>
        <p className="text-xs font-black tracking-[0.18em] text-violet-700">CASE EVIDENCE</p>
        <h3 className="mt-2 text-lg font-black">{t(c("真实案例：每张图只抓一个决定性证据", "実例：一枚の画像から決定的な証拠を一つ拾う", "Real cases: extract one decisive clue from each image"))}</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cases.map((item, index) => <CaseFigure key={item.image} image={item.image} name={t(item.name)} meta={t(item.meta)} clue={t(item.clue)} marker={`0${index + 1}`} />)}
        </div>
      </section>

      <section className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-amber-300">MEMBER ATLAS · VISUAL</p>
          <h3 className="mt-3 text-2xl font-black">{t(c("每个部材先看“怎样连接”，再记名称", "各部材は名称より先に「どう接合するか」を見る", "See how each member connects before memorizing its name"))}</h3>
          <p className="mt-3 text-sm leading-7 text-stone-300">{t(c("橙色表示要识别的部材，棕色表示被连接的柱、梁或门框。六张图统一比例与配色，可以直接比较“贴附、贯穿、插入、密排、组框、跨接”六种动作。", "橙色は識別対象、茶色は接続される柱・梁・框を示す。同じ配色で六つの接合動作を比較する。", "Orange marks the target member; brown marks posts, beams, or frames. Compare six actions: attach, penetrate, insert, densify, frame, and bridge."))}</p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map(([kind, name, description], index) => (
            <article key={name} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
              <MemberDiagram kind={kind as MemberKind} label={name} />
              <div className="mt-4 grid grid-cols-[2rem_1fr] gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-xs font-black text-slate-950">{index + 1}</span>
                <div><h4 className="font-black text-amber-200">{name}</h4><p className="mt-1.5 text-xs leading-5 text-stone-300">{t(description)}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ShrineLesson({ language }: { language: ExploreLanguage }) {
  const t = (value: Copy) => value[language];
  const families = [
    { label: c("古代直线系 · 平入", "古代直線系・平入", "Ancient rectilinear · hirairi"), styles: [c("神明造", "神明造", "Shinmei-zukuri"), c("流造", "流造", "Nagare-zukuri")], tone: "bg-amber-50 border-amber-300" },
    { label: c("古代直线系 · 妻入", "古代直線系・妻入", "Ancient rectilinear · tsumairi"), styles: [c("大社造", "大社造", "Taisha-zukuri"), c("住吉造", "住吉造", "Sumiyoshi-zukuri"), c("春日造", "春日造", "Kasuga-zukuri")], tone: "bg-rose-50 border-rose-300" },
    { label: c("复合殿系", "複合社殿系", "Paired-hall family"), styles: [c("八幡造", "八幡造", "Hachiman-zukuri"), c("权现造", "権現造", "Gongen-zukuri")], tone: "bg-violet-50 border-violet-300" },
    { label: c("地方化与特殊屋顶", "地域化と特殊屋根", "Regional and exceptional roofs"), styles: [c("日吉造", "日吉造", "Hiyoshi-zukuri"), c("吉备津造", "吉備津造", "Kibitsu-zukuri")], tone: "bg-cyan-50 border-cyan-300" },
  ];
  const styles = [
    [c("神明造", "神明造", "Shinmei"), c("平入", "平入", "hirairi"), c("直线切妻、千木鲣木", "直線切妻・千木鰹木", "straight gable, chigi/katsuogi"), c("单室高床", "一室高床", "single raised chamber")],
    [c("大社造", "大社造", "Taisha"), c("妻入", "妻入", "tsumairi"), c("高大切妻", "高い切妻", "tall gable"), c("方形＋中央柱", "方形＋中央柱", "square + central post")],
    [c("住吉造", "住吉造", "Sumiyoshi"), c("妻入", "妻入", "tsumairi"), c("直线屋顶", "直線屋根", "straight roof"), c("前后两室", "前後二室", "two chambers")],
    [c("流造", "流造", "Nagare"), c("平入", "平入", "hirairi"), c("前坡显著延长", "前流れが長い", "extended front slope"), c("檐下礼拜", "軒下礼拝", "worship beneath eave")],
    [c("春日造", "春日造", "Kasuga"), c("妻入", "妻入", "tsumairi"), c("小型、反曲、向拜", "小型・反り・向拝", "small, curved, front canopy"), c("单室＋前脸", "一室＋前面", "chamber + front face")],
    [c("八幡造", "八幡造", "Hachiman"), c("平入", "平入", "hirairi"), c("M字双屋脊", "M字型の二重棟", "M-shaped twin roof"), c("前殿＋后殿", "前殿＋後殿", "front + rear halls")],
    [c("日吉造", "日吉造", "Hiyoshi"), c("平入", "平入", "hirairi"), c("背面屋顶被截", "背面屋根を切る", "rear roof cut away"), c("三方庇＋下殿", "三方庇＋下殿", "three-sided eaves + lower chamber")],
    [c("吉备津造", "吉備津造", "Kibitsu"), c("平入", "平入", "hirairi"), c("比翼入母屋", "比翼入母屋", "paired hip-and-gable roofs"), c("五层神圣空间", "五段の神聖空間", "five sacred layers")],
    [c("权现造", "権現造", "Gongen"), c("轴线", "軸線", "axial"), c("多个屋顶交叠", "複数屋根の重なり", "overlapping roofs"), c("本殿—石之间—拜殿", "本殿―石の間―拝殿", "sanctuary–connector–worship hall")],
  ] as const;
  const cases = [
    { image: "2bae961e469080bcb5c9ee958d2c5b61.png", name: c("伊势神宫", "伊勢神宮", "Ise Jingū"), meta: c("神明造", "神明造", "Shinmei-zukuri"), clue: c("直线切妻、平入、素木与千木鲣木构成最清楚的古式屋顶标识。", "直線切妻・平入・素木・千木鰹木が古式の屋根標識をつくる。", "Straight gable, hirairi entry, unfinished timber, chigi, and katsuogi define the archaic profile.") },
    { image: "2bae961e4690805c8effc8d15362ac5f_0.png", name: c("出云大社本殿", "出雲大社本殿", "Izumo Taisha"), meta: c("大社造", "大社造", "Taisha-zukuri"), clue: c("从山墙端进入，陡峭高床与高大的切妻轮廓强调垂直性。", "妻側から入り、急な高床と高い切妻が垂直性を強調する。", "Gable-end entry, steep raised floor, and tall gable emphasize verticality.") },
    { image: "2bae961e469080908668cf01ff667dab_0.png", name: c("住吉大社本殿", "住吉大社本殿", "Sumiyoshi Taisha"), meta: c("住吉造", "住吉造", "Sumiyoshi-zukuri"), clue: c("妻入、无反曲的直屋顶以及前后两室，让它像纵向排列的船舱。", "妻入・反りのない直屋根・前後二室が、縦に並ぶ船室のように見える。", "Tsumairi entry, uncurved roof, and two chambers read like cabins arranged in line.") },
    { image: "2bae961e469080589188d6b9602bb42a.png", name: c("宇治上神社本殿", "宇治上神社本殿", "Ujigami Shrine"), meta: c("流造", "流造", "Nagare-zukuri"), clue: c("正面屋面明显向参拜者延长；非对称剖面比装饰更重要。", "正面屋根が参拝者へ長く伸びる。装飾より非対称断面が重要。", "The front roof plane extends toward worshippers; the asymmetric section matters more than ornament.") },
    { image: "2bce961e469080fe8550de157f2c62f2.png", name: c("吉备津神社", "吉備津神社", "Kibitsu Shrine"), meta: c("吉备津造", "吉備津造", "Kibitsu-zukuri"), clue: c("两组入母屋并列连接成比翼屋顶；不要把它误认成普通双殿。", "二組の入母屋が並列接続する比翼屋根。通常の双殿と区別する。", "Two joined hip-and-gable roofs form the paired silhouette; this is more than an ordinary twin hall.") },
    { image: "2e0e961e469080f7aac1ee249f6c7cfd_0.png", name: c("日光东照宫", "日光東照宮", "Nikkō Tōshōgū"), meta: c("权现造", "権現造", "Gongen-zukuri"), clue: c("不要只看华丽装饰；核心是本殿、较低连接室与拜殿组成连续礼仪轴。", "華麗な装飾だけでなく、本殿・低い中間部・拝殿の連続軸を見る。", "Look beyond ornament to the axial sequence of sanctuary, lower connector, and worship hall.") },
  ];

  return (
    <div className="space-y-16">
      <SectionHeading eyebrow={t(c("PDF 02 · 核心内容", "PDF 02・主要内容", "PDF 02 · CORE CONTENT"))} title={t(c("神社侦探：先认构成，再记年代", "神社探偵：構成を見てから年代を覚える", "Shrine detective: identify composition before memorizing dates"))} description={t(c("原讲义最有价值的是一套能迁移到陌生图片的识别顺序：入口方向、屋顶动作、神圣空间层级。下面先用三步筛选，再把九种样式放回四条谱系。", "元資料の核は未知画像にも使える順序です。入口方向、屋根の動き、神聖空間の階層を確認し、九様式を四系統に戻します。", "The source offers a method that transfers to unfamiliar images: entry direction, roof movement, and sacred hierarchy. Use the three filters, then return nine styles to four families."))} />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["1", c("从哪边进？", "どちらから入る？", "Where do you enter?"), c("平入：入口在屋脊长边。妻入：入口在山墙短边。", "平入は棟の長辺、妻入は妻側から入る。", "Hirairi enters on the long side; tsumairi at the gable end.")],
          ["2", c("屋顶怎么动？", "屋根はどう動く？", "What does the roof do?"), c("直线还是反曲？前坡是否加长？一条还是两条屋脊？", "直線か反りか、前流れは長いか、棟は一つか二つか。", "Straight or curved? Extended front slope? One ridge or two?")],
          ["3", c("神域有几层？", "神域は何層ある？", "How many sacred layers?"), c("单室、前后两室、双殿，还是本殿—连接室—拜殿？", "一室、前後二室、双殿、本殿―中間部―拝殿のどれか。", "Single chamber, two chambers, paired halls, or sanctuary–connector–worship hall?")],
        ].map(([number, title, text]) => (
          <article key={number as string} className="rounded-[2rem] bg-slate-950 p-6 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-300 font-black text-slate-950">{number as string}</span>
            <h3 className="mt-6 text-xl font-black">{t(title as Copy)}</h3>
            <p className="mt-3 text-sm leading-7 text-stone-300">{t(text as Copy)}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-black tracking-[0.18em] text-rose-700">ROOF LEGEND</p><h3 className="mt-2 text-lg font-black">{t(c("先遮住名称，只用轮廓和红色入口箭头判断", "名称を隠し、輪郭と赤い入口矢印だけで判断", "Hide the names; judge only from silhouette and the red entry arrow"))}</h3></div>
          <p className="text-xs font-bold text-slate-500"><b className="text-rose-600">↑</b> {t(c("入口方向", "入口方向", "entry direction"))}</p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <RoofDiagram title={t(c("平入单体", "平入単体", "Single hirairi hall"))} subtitle={t(c("神明造：入口在长边", "神明造：入口は長辺", "Shinmei: entry on long side"))} path="M28 60 L100 30 L172 60 M45 60 V82 M100 60 V82 M155 60 V82" entry="side" />
          <RoofDiagram title={t(c("妻入单体", "妻入単体", "Single tsumairi hall"))} subtitle={t(c("大社造／住吉造：入口在山墙", "大社造／住吉造：妻側入口", "Taisha/Sumiyoshi: gable-end entry"))} path="M45 60 L100 22 L155 60 M55 60 V82 M100 60 V82 M145 60 V82" entry="gable" />
          <RoofDiagram title={t(c("前坡延长", "前流れ延長", "Extended front slope"))} subtitle={t(c("流造：屋顶向参拜者伸出", "流造：屋根が参拝者へ伸びる", "Nagare: roof reaches toward worshippers"))} path="M22 66 Q78 22 120 43 Q150 55 180 66 M55 61 V82 M115 45 V82 M160 62 V82" entry="side" />
          <RoofDiagram title={t(c("复合轴线", "複合軸線", "Composite axis"))} subtitle={t(c("权现造：高—低—高三段", "権現造：高―低―高", "Gongen: high–low–high sequence"))} path="M18 58 L55 35 L90 58 M86 68 L110 55 L134 68 M130 58 L165 35 L190 58 M38 58 V82 M72 58 V82 M100 67 V82 M148 58 V82 M180 58 V82" entry="axis" />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-black">{t(c("九种样式，其实是四条理解路径", "九様式は四つの理解ルート", "Nine styles, four paths of understanding"))}</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {families.map((family) => (
            <article key={family.label.en} className={`rounded-3xl border p-5 ${family.tone}`}>
              <p className="text-xs font-black tracking-wider text-slate-500">{t(family.label)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {family.styles.map((style, index) => (
                  <div key={style.en} className="flex items-center gap-2">
                    {index > 0 && <span className="text-slate-300">→</span>}
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm">{t(style)}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs font-black tracking-[0.18em] text-rose-700">PLAN FAMILIES</p>
        <h3 className="mt-2 text-lg font-black">{t(c("屋顶解决“长什么样”，平面回答“神、人和仪式怎样相处”", "屋根は外形を、平面は神・人・儀礼の関係を示す", "Roofs show appearance; plans show relations among deity, people, and ritual"))}</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            [c("单室高床", "一室高床", "Single raised chamber"), c("神明造／大社造／春日造", "神明造／大社造／春日造", "Shinmei / Taisha / Kasuga"), ["本殿"]],
            [c("前后两室", "前後二室", "Front and rear chambers"), c("住吉造：外阵→内阵", "住吉造：外陣→内陣", "Sumiyoshi: outer → inner"), ["外陣", "内陣"]],
            [c("并列双殿", "並列する双殿", "Paired sanctuaries"), c("八幡造：前殿＋樋下＋后殿", "八幡造：前殿＋樋下＋後殿", "Hachiman: front + gutter + rear"), ["前殿", "樋下", "後殿"]],
            [c("轴线复合", "軸線複合", "Axial compound"), c("权现造：拜殿→石之间→本殿", "権現造：拝殿→石の間→本殿", "Gongen: worship → connector → sanctuary"), ["拝殿", "石の間", "本殿"]],
          ].map(([title, subtitle, zones]) => (
            <PlanCard key={(title as Copy).en} title={t(title as Copy)} subtitle={t(subtitle as Copy)}>
              <div className="flex w-full items-stretch justify-center gap-2">
                {(zones as string[]).map((zone, index) => <div key={zone} className={`${zone === "樋下" || zone === "石の間" ? "w-10 bg-rose-200" : "min-w-20 flex-1 bg-amber-200"} flex min-h-24 items-center justify-center rounded-lg border-2 border-slate-800 p-2 text-center text-xs font-black`}><span>{zone}</span>{index < (zones as string[]).length - 1 && <span className="sr-only">→</span>}</div>)}
              </div>
            </PlanCard>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
        <p className="text-xs font-black tracking-[0.18em] text-rose-300">INSTITUTION × SPACE</p>
        <h3 className="mt-2 text-xl font-black">{t(c("这份 PDF 的“关键角色”更多是制度，而不只是个人", "このPDFの重要な主体は、個人より制度である", "The decisive actors in this PDF are often institutions rather than individuals"))}</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            [c("式年迁宫", "式年遷宮", "Periodic rebuilding"), c("通过材料更新、仪式复现和工匠传承延续建筑，而不只保存原物。", "材料更新・儀礼再演・技術継承によって建築を持続させる。", "Continuity through renewed materials, reenacted ritual, and craft transmission.")],
            [c("神佛习合", "神仏習合", "Shinbutsu syncretism"), c("八幡与日吉系统说明神社长期嵌在佛教、山岳与地方权力网络中。", "八幡・日吉は神社が仏教・山岳・地域権力に組み込まれたことを示す。", "Hachiman and Hiyoshi reveal shrines embedded in Buddhist and regional networks.")],
            [c("武家纪念政治", "武家の記念政治", "Warrior memorial politics"), c("权现造把本殿、连接室与拜殿编成一条权力与祭礼轴线。", "権現造は本殿・中間部・拝殿を権力と祭礼の軸へ編成する。", "Gongen compounds turn linked halls into an axis of ritual and authority.")],
            [c("明治重定义", "明治の再定義", "Meiji redefinition"), c("神佛分离、古式复兴与文化财制度共同重写了“正统神社样式”。", "神仏分離・古式復興・文化財制度が「正統」を再定義した。", "Separation, revivalism, and preservation policy redefined what counted as orthodox.")],
          ].map(([title, text]) => <article key={(title as Copy).en} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h4 className="font-black text-rose-200">{t(title as Copy)}</h4><p className="mt-2 text-xs leading-6 text-stone-300">{t(text as Copy)}</p></article>)}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-black">{t(c("九样式识别矩阵", "九様式識別表", "Nine-style recognition matrix"))}</h3>
        <div className="mt-5 overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <div className="hidden grid-cols-[1fr_0.7fr_1.4fr_1.5fr] gap-4 bg-slate-950 px-5 py-3 text-xs font-black text-white md:grid">
            <span>{t(c("样式", "様式", "Style"))}</span><span>{t(c("入口", "入口", "Entry"))}</span><span>{t(c("屋顶指纹", "屋根の指紋", "Roof fingerprint"))}</span><span>{t(c("空间", "空間", "Space"))}</span>
          </div>
          {styles.map(([name, entry, roof, space], index) => (
            <div key={name.en} className={`grid gap-2 px-5 py-4 text-sm md:grid-cols-[1fr_0.7fr_1.4fr_1.5fr] md:gap-4 ${index % 2 ? "bg-stone-50" : "bg-white"}`}>
              <strong>{t(name)}</strong><span className="text-slate-600">{t(entry)}</span><span className="text-slate-600">{t(roof)}</span><span className="text-slate-600">{t(space)}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs font-black tracking-[0.18em] text-rose-700">CASE EVIDENCE</p>
        <h3 className="mt-2 text-lg font-black">{t(c("从抽象屋顶回到真实建筑", "抽象屋根から実在建築へ戻る", "Return from abstract roofs to real buildings"))}</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((item, index) => <CaseFigure key={item.image} image={item.image} name={t(item.name)} meta={t(item.meta)} clue={t(item.clue)} marker={`0${index + 1}`} />)}
        </div>
      </section>
    </div>
  );
}

function WesternLesson({ language }: { language: ExploreLanguage }) {
  const t = (value: Copy) => value[language];
  const periods = [
    { name: c("早期基督教", "初期キリスト教", "Early Christian"), date: "4–6C", hook: c("罗马公共大厅变成纵向礼拜空间", "ローマの公共会堂が縦長礼拝空間へ", "Roman civic hall becomes longitudinal worship"), structure: c("柱列＋轻木屋顶", "列柱＋軽い木造屋根", "Colonnade + light timber roof"), tone: "bg-amber-50 border-amber-300" },
    { name: c("拜占庭", "ビザンティン", "Byzantine"), date: "4–15C", hook: c("神圣空间集中到穹顶下", "聖なる空間をドーム下に集中", "Sacred space gathers beneath a dome"), structure: c("穹顶＋帆拱＋墩柱", "ドーム＋ペンデンティブ＋大墩", "Dome + pendentives + piers"), tone: "bg-yellow-50 border-yellow-300" },
    { name: c("罗马式", "ロマネスク", "Romanesque"), date: "11–12C", hook: c("石拱顶让墙体变厚", "石造ヴォールトで壁が厚くなる", "Stone vaults thicken the walls"), structure: c("半圆拱＋厚墙＋小窗", "半円アーチ＋厚壁＋小窓", "Round arch + thick wall + small windows"), tone: "bg-orange-50 border-orange-300" },
    { name: c("哥特式", "ゴシック", "Gothic"), date: "12C–", hook: c("墙体转化为石造骨架", "壁体が石造骨格へ変わる", "Wall becomes a stone skeleton"), structure: c("尖拱＋肋拱顶＋飞扶壁", "尖頭アーチ＋リブ＋飛梁", "Pointed arch + ribs + flying buttress"), tone: "bg-sky-50 border-sky-300" },
    { name: c("文艺复兴", "ルネサンス", "Renaissance"), date: "15–16C", hook: c("古典秩序重新整理礼拜空间", "古典秩序で礼拝空間を再編", "Classical order reorganizes worship"), structure: c("圆拱＋穹顶＋数学比例", "円形アーチ＋ドーム＋比例", "Round arch + dome + proportion"), tone: "bg-emerald-50 border-emerald-300" },
    { name: c("巴洛克", "バロック", "Baroque"), date: "17–18C", hook: c("几何被压弯并转化为戏剧", "幾何学を曲げて劇場化", "Geometry bends into theater"), structure: c("曲面＋复合空间＋定向光", "曲面＋複合空間＋演出光", "Curves + composite space + directed light"), tone: "bg-rose-50 border-rose-300" },
  ];
  const gothic = [
    [c("早期", "初期", "Early"), c("厚墙、粗墩、四层立面、六分肋", "厚壁・太い墩・四層・六分リブ", "Thick walls, heavy piers, four stories, sexpartite ribs")],
    [c("盛期", "盛期", "High"), c("四分肋稳定开间节奏，飞扶壁成熟", "四分リブでベイが整い、飛梁が成熟", "Quadripartite ribs regularize bays; buttresses mature")],
    [c("辐射式", "レヨナン", "Rayonnant"), c("墙体玻璃化，窗棂从玫瑰窗向外辐射", "壁がガラス化し、窓トレーサリーが放射", "Walls become glass; tracery radiates outward")],
    [c("火焰式", "フランボワイヤン", "Flamboyant"), c("S形窗棂像火焰，视觉运动超过结构表达", "S字形トレーサリーが炎のように動く", "Flame-like S-curves intensify visual motion")],
  ] as const;
  const cases = [
    { image: "124e961e469080c1b5abf300f1fde266_0.png", name: c("圣萨比娜教堂", "サンタ・サビーナ聖堂", "Santa Sabina"), meta: c("早期基督教", "初期キリスト教", "Early Christian"), clue: c("中央身廊高、两侧侧廊低，高差形成高窗；轻木屋顶不需要罗马式厚墙。", "高い身廊と低い側廊の差で高窓をつくる。軽い木造屋根なので厚壁を必要としない。", "A tall nave rises above lower aisles to form clerestories; its light timber roof does not require massive walls.") },
    { image: "124e961e469080ef9625c0e2dfdad6c8.png", name: c("圣索菲亚大教堂", "ハギア・ソフィア大聖堂", "Hagia Sophia"), meta: c("拜占庭", "ビザンティン", "Byzantine"), clue: c("中央大穹顶通过帆拱落到四个巨墩，半穹顶继续向两端扩展空间。", "大ドームがペンデンティブを介して四大墩へ下り、半ドームが両端へ空間を広げる。", "The central dome descends through pendentives to four great piers, while half-domes extend the space.") },
    { image: "commons-speyer-cathedral.jpg", name: c("施派尔主教座堂", "シュパイヤー大聖堂", "Speyer Cathedral"), meta: c("罗马式", "ロマネスク", "Romanesque"), clue: c("厚重墙体、成组小窗与半圆拱形成强烈实体感；屋顶荷载主要由连续石体承担。", "厚い壁、組になった小窓、半円アーチが強い量塊感をつくる。", "Massive walls, grouped small windows, and round arches express a load-bearing masonry body.") },
    { image: "124e961e46908057a0efd7ce3323e167_0.png", name: c("沙特尔主教座堂", "シャルトル大聖堂", "Chartres Cathedral"), meta: c("盛期哥特式", "盛期ゴシック", "High Gothic"), clue: c("尖拱、肋拱顶与飞扶壁协同工作，墙体被释放成大面积彩色玻璃界面。", "尖頭アーチ・リブ・飛梁が協働し、壁面を大きなステンドグラスへ解放する。", "Pointed arches, ribs, and flying buttresses work together to release the wall for stained glass.") },
    { image: "390e961e4690803b86faeed8bb0af1cf.png", name: c("坦比哀多礼拜堂", "テンピエット", "Tempietto"), meta: c("盛期文艺复兴", "盛期ルネサンス", "High Renaissance"), clue: c("集中式圆形平面、古典柱式与清楚比例把纪念性压缩进一个小体量。", "集中式円形平面、古典オーダー、明快な比例が小さな量塊に記念性を凝縮する。", "A centralized circular plan, classical orders, and clear proportion condense monumentality into a small volume.") },
    { image: "390e961e4690809d9a34fe710805d231.png", name: c("圣卡洛教堂", "サン・カルロ・アッレ・クワトロ・フォンターネ", "San Carlo alle Quattro Fontane"), meta: c("巴洛克", "バロック", "Baroque"), clue: c("波动墙面、椭圆穹顶与定向光把稳定几何转化成连续的空间运动。", "波打つ壁、楕円ドーム、方向づけられた光が安定した幾何学を運動へ変える。", "Undulating walls, an oval dome, and directed light turn stable geometry into continuous movement.") },
  ];

  return (
    <div className="space-y-16">
      <SectionHeading eyebrow={t(c("PDF 03 · 核心内容", "PDF 03・主要内容", "PDF 03 · CORE CONTENT"))} title={t(c("先把三种分类拆开，再判断教堂属于哪套系统", "三つの分類を分けてから、教会堂のシステムを判断する", "Separate three classifications before identifying a church system"))} description={t(c("大教堂不是哥特式的同义词，巴西利卡也不是某一个时代。先判断建筑身份、平面类型和历史样式，才能避免被单个尖拱或圆拱误导。", "大聖堂はゴシックの同義語ではなく、バシリカも一時代の名称ではありません。建物の身分、平面形式、歴史様式を順に判断します。", "A cathedral is not synonymous with Gothic, and a basilica is not a single period. Identify building status, plan type, and historical style before trusting one pointed or round arch."))} />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["01", c("建筑身份", "建物の身分", "Building status"), c("谁使用它？承担什么制度功能？", "誰が使い、どんな制度機能を担うか。", "Who uses it, and what institution does it serve?"), c("大教堂／修道院教堂／礼拜堂", "大聖堂／修道院教会堂／礼拝堂", "Cathedral / abbey church / chapel")],
          ["02", c("平面类型", "平面形式", "Plan type"), c("人如何进入、聚集、绕行并接近祭坛？", "人はどう入り、集まり、巡り、祭壇へ近づくか。", "How do people enter, gather, circulate, and approach the altar?"), c("巴西利卡／集中式／拉丁十字", "バシリカ式／集中式／ラテン十字", "Basilican / centralized / Latin cross")],
          ["03", c("历史样式", "歴史様式", "Historical style"), c("屋顶如何支撑？墙与窗是什么比例？", "屋根をどう支え、壁と窓はどんな比率か。", "How is the roof supported, and what is the wall-window ratio?"), c("罗马式／哥特式／文艺复兴／巴洛克", "ロマネスク／ゴシック／ルネサンス／バロック", "Romanesque / Gothic / Renaissance / Baroque")],
        ].map(([number, title, prompt, examples]) => (
          <article key={number as string} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-black tracking-[0.18em] text-violet-600">{number as string}</span>
            <h3 className="mt-3 text-xl font-black">{t(title as Copy)}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t(prompt as Copy)}</p>
            <p className="mt-5 rounded-xl bg-stone-100 px-3 py-2 text-xs font-bold text-slate-500">{t(examples as Copy)}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 rounded-[2rem] bg-slate-950 p-6 text-white lg:grid-cols-[0.8fr_1.2fr] sm:p-8">
        <div>
          <p className="text-xs font-black tracking-[0.2em] text-sky-300">PLAN ANATOMY</p>
          <h3 className="mt-3 text-2xl font-black">{t(c("先看人怎么走", "まず人の動きを見る", "Read how people move first"))}</h3>
          <p className="mt-3 text-sm leading-7 text-stone-300">{t(c("入口沿身廊走向祭坛；翼廊形成横轴；周步廊让朝圣者绕过内阵；放射状祭室处理圣遗物与人流。", "入口から身廊を通って祭壇へ進み、翼廊が横軸をつくり、周歩廊が内陣を避けて巡礼者を導きます。", "The nave leads from entrance to altar; transepts form a cross-axis; the ambulatory routes pilgrims around the choir; radiating chapels distribute relics and movement."))}</p>
        </div>
        <div className="grid min-h-72 grid-cols-[1fr_1.2fr_1fr] grid-rows-[1fr_1.5fr_1fr] gap-2 text-center text-xs font-bold">
          <div className="col-start-2 rounded-xl border border-white/20 bg-white/5 p-3">{t(c("后殿／祭坛", "後陣／祭壇", "Apse / altar"))}</div>
          <div className="col-start-1 row-start-2 rounded-xl border border-sky-300/40 bg-sky-300/10 p-3">{t(c("翼廊", "翼廊", "Transept"))}</div>
          <div className="col-start-2 row-start-2 rounded-xl bg-sky-300 p-3 text-slate-950">{t(c("交叉部", "交差部", "Crossing"))}</div>
          <div className="col-start-3 row-start-2 rounded-xl border border-sky-300/40 bg-sky-300/10 p-3">{t(c("翼廊", "翼廊", "Transept"))}</div>
          <div className="col-start-2 row-start-3 flex flex-col justify-between rounded-xl border border-white/20 bg-white/5 p-3"><span>{t(c("身廊＋侧廊", "身廊＋側廊", "Nave + aisles"))}</span><span className="text-sky-300">↑ {t(c("入口", "入口", "Entrance"))}</span></div>
        </div>
      </section>

      <section>
        <p className="text-xs font-black tracking-[0.18em] text-sky-700">PLAN TYPES</p>
        <h3 className="mt-2 text-lg font-black">{t(c("三种平面不是时代标签，而是组织人流与视觉中心的不同方法", "三つの平面は時代名ではなく、人流と視覚中心を組織する方法", "Three plans are not period labels; they organize movement and visual focus differently"))}</h3>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <PlanCard title={t(c("巴西利卡式", "バシリカ式", "Basilican"))} subtitle={t(c("长轴把入口、身廊和祭坛串联；侧廊分流，高窗由高度差产生。", "長軸が入口・身廊・祭壇を結び、側廊が人流を分け、高窓は高低差から生まれる。", "A long axis links entry, nave, and altar; aisles split circulation and enable clerestories."))}>
            <svg viewBox="0 0 280 170" className="w-full" role="img" aria-label={t(c("巴西利卡式平面", "バシリカ式平面", "Basilican plan"))}>
              <path d="M70 145 V45 Q140 -5 210 45 V145Z" fill="#fff" stroke="#0f172a" strokeWidth="4" /><rect x="95" y="42" width="90" height="103" fill="#bae6fd" />
              <path d="M95 42 V145 M185 42 V145" stroke="#0f172a" strokeWidth="2" strokeDasharray="5 4" /><path d="M140 160 V112" stroke="#e11d48" strokeWidth="4" /><path d="M134 120 L140 112 L146 120" fill="none" stroke="#e11d48" strokeWidth="3" />
              <text x="140" y="88" textAnchor="middle" fontSize="12" fontWeight="700">{t(c("身廊", "身廊", "nave"))}</text><text x="81" y="95" textAnchor="middle" fontSize="10">{t(c("侧廊", "側廊", "aisle"))}</text><text x="199" y="95" textAnchor="middle" fontSize="10">{t(c("侧廊", "側廊", "aisle"))}</text><text x="140" y="28" textAnchor="middle" fontSize="10">{t(c("后殿", "後陣", "apse"))}</text>
            </svg>
          </PlanCard>
          <PlanCard title={t(c("集中式／希腊十字", "集中式／ギリシア十字", "Centralized / Greek cross"))} subtitle={t(c("长度接近的四臂围绕中心，穹顶把视觉与结构重心集中在交叉部。", "ほぼ等長の四腕が中心を囲み、ドームが視覚と構造の重心を交差部へ集める。", "Near-equal arms gather around a crossing where the dome concentrates structure and vision."))}>
            <svg viewBox="0 0 280 170" className="w-full" role="img" aria-label={t(c("集中式平面", "集中式平面", "Centralized plan"))}>
              <path d="M105 15 H175 V50 H235 V120 H175 V155 H105 V120 H45 V50 H105Z" fill="#fff" stroke="#0f172a" strokeWidth="4" /><circle cx="140" cy="85" r="34" fill="#fde68a" stroke="#b45309" strokeWidth="3" />
              <path d="M140 166 V121" stroke="#e11d48" strokeWidth="4" /><path d="M134 130 L140 121 L146 130" fill="none" stroke="#e11d48" strokeWidth="3" /><text x="140" y="90" textAnchor="middle" fontSize="11" fontWeight="700">{t(c("穹顶中心", "ドーム中心", "dome center"))}</text>
            </svg>
          </PlanCard>
          <PlanCard title={t(c("拉丁十字式", "ラテン十字式", "Latin cross"))} subtitle={t(c("纵向身廊明显长于翼廊；交叉部、内阵与后殿建立层层接近祭坛的序列。", "身廊が翼廊より長く、交差部・内陣・後陣が祭壇への段階をつくる。", "The nave exceeds the transept in length, sequencing crossing, choir, and apse toward the altar."))}>
            <svg viewBox="0 0 280 170" className="w-full" role="img" aria-label={t(c("拉丁十字式平面", "ラテン十字式平面", "Latin-cross plan"))}>
              <path d="M105 15 H175 V58 H242 V106 H175 V158 H105 V106 H38 V58 H105Z" fill="#fff" stroke="#0f172a" strokeWidth="4" /><rect x="106" y="59" width="68" height="46" fill="#bae6fd" />
              <path d="M140 169 V107" stroke="#e11d48" strokeWidth="4" /><path d="M134 116 L140 107 L146 116" fill="none" stroke="#e11d48" strokeWidth="3" /><text x="140" y="87" textAnchor="middle" fontSize="11" fontWeight="700">{t(c("交叉部", "交差部", "crossing"))}</text><text x="73" y="87" textAnchor="middle" fontSize="10">{t(c("翼廊", "翼廊", "transept"))}</text><text x="140" y="139" textAnchor="middle" fontSize="10">{t(c("身廊", "身廊", "nave"))}</text>
            </svg>
          </PlanCard>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-black">{t(c("六时期：屋顶、墙、窗与空间如何改变", "六時期：屋根・壁・窓・空間の変化", "Six periods: changing roofs, walls, windows, and space"))}</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {periods.map((period) => (
            <article key={period.name.en} className={`rounded-3xl border p-5 ${period.tone}`}>
              <div className="flex items-start justify-between gap-3"><h4 className="text-xl font-black">{t(period.name)}</h4><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black shadow-sm">{period.date}</span></div>
              <p className="mt-4 text-sm font-bold leading-6">{t(period.hook)}</p>
              <p className="mt-4 border-t border-slate-900/10 pt-3 text-xs leading-5 text-slate-600">{t(period.structure)}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs font-black tracking-[0.18em] text-sky-700">SECTION EVIDENCE</p>
        <h3 className="mt-2 text-lg font-black">{t(c("同一张剖面同时读空间、支撑与侧向推力", "一枚の断面から空間・支持・水平推力を同時に読む", "Read space, support, and lateral thrust in the same section"))}</h3>
        <div className="mt-5 grid gap-8">
          <SourceFigure src="/topic-study/hagia-sophia-section.svg" alt={t(c("圣索菲亚大教堂剖面与平面图", "ハギア・ソフィアの断面と平面", "Hagia Sophia section and ground plan"))} eyebrow="BYZANTINE · DOME SYSTEM" title={t(c("圣索菲亚：穹顶不是盖子，而是连续扩展的空间系统", "ハギア・ソフィア：ドームは蓋ではなく、連続する空間システム", "Hagia Sophia: the dome is a spatial system, not a lid"))} description={t(c("从中央穹顶经帆拱落到四大墩，再看半穹顶如何向东西两端继续分担推力并扩展内部。下方平面帮助对应墩柱位置。", "中央ドームからペンデンティブ、四大墩へ荷重を追い、半ドームが東西へ推力と空間を連続させる様子を見る。", "Trace the central dome through pendentives to four great piers, then see how half-domes extend space and manage thrust east and west."))} source="https://commons.wikimedia.org/wiki/File:Hagia_Sophia_Segment.svg" credit="Ogodej · Wikimedia Commons · CC BY-SA 3.0" callouts={[t(c("中央穹顶：视觉与荷载中心", "中央ドーム：視覚と荷重の中心", "Central dome: visual and load center")), t(c("帆拱：从圆形穹顶过渡到方形柱网", "ペンデンティブ：円から方形柱網へ", "Pendentives: circular dome to square bay")), t(c("四大墩：集中承受竖向荷载与推力", "四大墩：鉛直荷重と推力を受ける", "Four piers: receive loads and thrust")), t(c("半穹顶：向东西两端继续扩展", "半ドーム：東西へ空間を延長", "Half-domes: extend space east and west"))]} />
          <SourceFigure src="/topic-study/notre-dame-section.svg" alt={t(c("巴黎圣母院横剖面结构示意", "ノートルダム・ド・パリ横断面の構造図", "Structural transverse section of Notre-Dame de Paris"))} eyebrow="GOTHIC · THRUST SYSTEM" title={t(c("巴黎圣母院：飞扶壁把拱顶侧推力送到外部", "ノートルダム：飛梁がヴォールトの水平推力を外部へ送る", "Notre-Dame: flying buttresses carry vault thrust outward"))} description={t(c("先找中殿肋拱顶，再沿飞扶壁的弧线把侧向推力追到外侧扶壁；墙因此可减薄并打开高窗。此图为教学信息图，并非测绘或有限元分析。", "身廊のリブ・ヴォールトから飛梁の曲線をたどり、水平推力を外側扶壁へ追う。壁は薄くなり、高窓を開けられる。教育用図解で測量図ではない。", "Follow vault thrust along the flying buttress to the outer pier; the wall can then thin and open for clerestory windows. This is an explanatory infographic, not a measured survey."))} source="https://commons.wikimedia.org/wiki/File:Notre-Dame_de_Paris_composite_transverse_section.svg" credit="HLHJ · Wikimedia Commons · CC BY-SA 4.0" callouts={[t(c("肋拱顶：把面荷载集中到肋与墩", "リブ・ヴォールト：荷重をリブと墩へ集中", "Rib vault: concentrates surface loads")), t(c("高窗：结构骨架释放出的采光面", "高窓：骨格化で開かれた採光面", "Clerestory: glazing freed by the skeleton")), t(c("飞扶壁：跨过侧廊传递侧推力", "飛梁：側廊を越えて水平推力を送る", "Flying buttress: carries thrust over aisles")), t(c("外扶壁：把推力最终导向地面", "外側扶壁：推力を地盤へ流す", "Outer pier: grounds the thrust"))]} />
        </div>
      </section>

      <section>
        <p className="text-xs font-black tracking-[0.18em] text-sky-700">CASE EVIDENCE</p>
        <h3 className="mt-2 text-lg font-black">{t(c("六个阶段，各用一座建筑验证", "六段階を一つずつ実例で確認", "Verify each of the six stages with one building"))}</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((item, index) => <CaseFigure key={item.image} image={item.image} name={t(item.name)} meta={t(item.meta)} clue={t(item.clue)} marker={`0${index + 1}`} />)}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-black">{t(c("法国哥特式四阶段", "フランス・ゴシックの四段階", "Four phases of French Gothic"))}</h3>
        <div className="mt-5 grid gap-1 overflow-hidden rounded-3xl bg-slate-200 md:grid-cols-4">
          {gothic.map(([name, detail], index) => (
            <article key={name.en} className="bg-white p-5">
              <span className="text-4xl font-black text-slate-200">0{index + 1}</span>
              <h4 className="mt-2 font-black text-slate-950">{t(name)}</h4>
              <p className="mt-3 text-xs leading-6 text-slate-500">{t(detail)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function TopicVisualLessons({ topicId, language }: { topicId: string; language: ExploreLanguage }) {
  if (topicId === "shrine-styles") return <ShrineLesson language={language} />;
  if (topicId === "western-churches") return <WesternLesson language={language} />;
  return <BuddhistLesson language={language} />;
}
