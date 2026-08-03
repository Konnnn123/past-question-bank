type Props = { topicId: string; language?: "zh" | "ja" };

const text = {
  zh: {
    sumTitle: "平面记忆钩子｜2间 × 8间 × 三等分", street: <>街道侧<br />起居・厨房</>, court: <>无顶中庭<br />动线被切断</>, rear: <>后部<br />卧室・卫浴</>,
    sumNote: "这不是精确施工图，而是考试用的概念图：先记住“狭长—三分—中央露天”，再补上下层房间和跨庭动线。",
    expoTitle: "两届万博的比较轴", oldTitle: "塔穿过巨构屋顶", oldBody: "纪念性对象留下，祭典广场大屋顶消失", newTitle: "屋顶本身成为城市", newBody: "环形交通、遮蔽、眺望与会后遗产争论",
    notreTitle: "哥特结构的横向力路径", buttress: "外部扶壁", vault: "高侧墙／肋拱顶", notreLabel: "肋拱、飞扶壁与外部扶壁的概念图", notreBody: "火灾先破坏木屋架，坠落物再威胁石拱顶；拱顶、柱墩与飞扶壁必须被当成一个传力系统检查。",
    flowTitle: "新闻如何变成试题", flow: ["发生了什么", "建筑怎样成立", "制度如何保护", "命题人怎样改写"],
  },
  ja: {
    sumTitle: "平面の記憶フック｜2間 × 8間 × 三等分", street: <>街路側<br />居間・台所</>, court: <>無屋根の中庭<br />動線を分断</>, rear: <>奥側<br />寝室・浴室</>,
    sumNote: "正確な施工図ではなく、試験用の概念図である。まず「細長い―三分割―中央が露天」を記憶し、上下階の諸室と中庭を横切る動線を補う。",
    expoTitle: "二つの万博を比較する軸", oldTitle: "塔が大屋根を貫く", oldBody: "記念体は残り、お祭り広場の大屋根は消失", newTitle: "大屋根そのものが都市になる", newBody: "環状動線、遮蔽、眺望、会期後のレガシー",
    notreTitle: "ゴシック構造の水平力伝達", buttress: "外部控壁", vault: "高側壁・リブヴォールト", notreLabel: "リブヴォールト、フライング・バットレス、外部控壁の概念図", notreBody: "火災はまず木造小屋組を破壊し、落下物が石造ヴォールトを脅かした。ヴォールト、柱、フライング・バットレスを一つの伝力系として調査する必要がある。",
    flowTitle: "ニュースが問題になるまで", flow: ["何が起きたか", "建築はどう成立するか", "制度はどう守るか", "出題者はどう書き換えるか"],
  },
};

export default function TopicConceptDiagram({ topicId, language = "zh" }: Props) {
  const t = text[language];
  if (topicId === "sumiyoshi-row-house") return (
    <figure className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-950 p-6 text-white">
      <figcaption className="mb-5 text-xs font-semibold tracking-[0.2em] text-amber-300">{t.sumTitle}</figcaption>
      <div className="grid min-h-40 grid-cols-3 border-2 border-stone-400">
        <div className="flex items-center justify-center border-r border-stone-500 bg-stone-800 p-4 text-center text-sm">{t.street}</div>
        <div className="relative flex items-center justify-center border-r border-stone-500 bg-sky-950 p-4 text-center text-sm"><span className="absolute right-3 top-3 text-2xl text-amber-300">☀</span>{t.court}</div>
        <div className="flex items-center justify-center bg-stone-800 p-4 text-center text-sm">{t.rear}</div>
      </div><p className="mt-4 text-sm leading-6 text-stone-300">{t.sumNote}</p>
    </figure>
  );
  if (topicId === "expo-1970-2025") return (
    <figure className="rounded-3xl border border-emerald-200 bg-emerald-950 p-6 text-white"><figcaption className="text-xs font-semibold tracking-[0.2em] text-emerald-300">{t.expoTitle}</figcaption><div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center"><div className="rounded-2xl border border-white/15 bg-white/10 p-5"><p className="text-3xl font-black">1970</p><p className="mt-2 font-bold">{t.oldTitle}</p><p className="mt-2 text-sm text-emerald-100">{t.oldBody}</p></div><div className="text-center text-2xl text-emerald-300">→</div><div className="rounded-2xl border border-white/15 bg-white/10 p-5"><p className="text-3xl font-black">2025</p><p className="mt-2 font-bold">{t.newTitle}</p><p className="mt-2 text-sm text-emerald-100">{t.newBody}</p></div></div></figure>
  );
  if (topicId === "notre-dame-reopening") return (
    <figure className="rounded-3xl border border-indigo-200 bg-indigo-950 p-6 text-white"><figcaption className="text-xs font-semibold tracking-[0.2em] text-indigo-300">{t.notreTitle}</figcaption><div className="mt-6 flex items-end justify-center gap-2" aria-label={t.notreLabel}><div className="h-24 w-10 rounded-t-full border-4 border-indigo-300 border-b-0" /><div className="mb-5 h-20 w-20 rounded-t-full border-4 border-indigo-200 border-b-0" /><div className="h-24 w-10 rounded-t-full border-4 border-indigo-300 border-b-0" /></div><div className="mt-3 grid grid-cols-3 text-center text-xs text-indigo-100"><span>{t.buttress}</span><span>{t.vault}</span><span>{t.buttress}</span></div><p className="mt-5 text-sm leading-6 text-indigo-100">{t.notreBody}</p></figure>
  );
  return (
    <figure className="rounded-3xl border border-slate-200 bg-white p-6"><figcaption className="text-xs font-semibold tracking-[0.2em] text-cyan-700">{t.flowTitle}</figcaption><div className="mt-5 grid gap-3 sm:grid-cols-4">{t.flow.map((item, index) => <div key={item} className="relative rounded-2xl bg-slate-100 px-4 py-5 text-center text-sm font-semibold text-slate-700"><span className="mb-2 block text-xs text-slate-400">0{index + 1}</span>{item}</div>)}</div></figure>
  );
}
