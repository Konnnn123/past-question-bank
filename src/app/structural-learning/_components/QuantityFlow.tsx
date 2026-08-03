"use client";

import { useState } from "react";

type GraphNode = { id: string; x: number; y: number; w?: number; title: string; symbol: string; detail: string; kind: "input" | "rule" | "quantity" | "result" };
type GraphEdge = { from: string; to: string; label: string };
type QuestionGraph = { id: string; label: string; subtitle: string; nodes: GraphNode[]; edges: GraphEdge[] };

const graphs: QuestionGraph[] = [
  {
    id: "composite", label: "复合材料梁", subtitle: "同一截面先判断状态，再选择完全不同的平衡规则",
    nodes: [
      { id:"given",x:25,y:195,w:145,title:"题目条件",symbol:"几何 · E · σy · Q",detail:"题目给出的材料、截面、荷载和强度条件，是状态判断的入口。",kind:"input" },
      { id:"state",x:215,y:195,w:145,title:"状态分流",symbol:"现在是哪一阶段？",detail:"先判断同材质几何、弹性、全塑性，还是接着面剪切。这里判断错，后面公式即使算对也没有意义。",kind:"rule" },
      { id:"elastic",x:420,y:45,w:145,title:"弹性状态",symbol:"ε 直线 · σ=Eε",detail:"完全粘结使应变连续；不同 E 把同一条应变线转成不同斜率的应力图。",kind:"quantity" },
      { id:"plastic",x:420,y:195,w:145,title:"全塑性状态",symbol:"σ=±σy",detail:"各材料成为矩形降伏应力块，不再用 E 加权图心。",kind:"quantity" },
      { id:"interface",x:420,y:345,w:145,title:"接着面剪切",symbol:"Q · S · I · b",detail:"上下层的轴向合力沿梁长变化，必须由接着面纵向剪应力传递。",kind:"quantity" },
      { id:"elasticBalance",x:635,y:45,w:160,title:"弹性截面平衡",symbol:"Σ∫Eε dA = 0",detail:"纯弯曲无轴力，弹性中立轴由 EA 加权确定。",kind:"rule" },
      { id:"plasticBalance",x:635,y:195,w:160,title:"塑性应力块平衡",symbol:"Σ(±σyA)=P",detail:"纯弯曲时 P=0；轴力与弯矩并存时，代数和等于轴力 P。",kind:"rule" },
      { id:"shearLaw",x:635,y:345,w:160,title:"指定面剪应力",symbol:"τ=QS/(Ib)",detail:"S 必须取接着面一侧的断面一次矩，不能用平均剪应力 Q/A。",kind:"rule" },
      { id:"elasticOut",x:860,y:45,w:170,title:"弹性输出",symbol:"NA · σ · 同时降伏",detail:"得到弹性中立轴、最外缘应力或两种材料同时降伏所需比例。",kind:"result" },
      { id:"plasticOut",x:860,y:195,w:170,title:"塑性输出",symbol:"PNA · Mp · P",detail:"得到塑性中立轴、塑性弯矩或应力块合成的轴力。",kind:"result" },
      { id:"shearOut",x:860,y:345,w:170,title:"接着破坏",symbol:"τ=Fs → Qmax",detail:"令接着面剪应力达到强度 Fs，反求最大剪力。",kind:"result" },
    ],
    edges: [
      {from:"given",to:"state",label:"圈出状态词"},{from:"state",to:"elastic",label:"E / 弹性"},{from:"state",to:"plastic",label:"σy / 全塑性"},{from:"state",to:"interface",label:"Q / 接着面"},
      {from:"elastic",to:"elasticBalance",label:"σ=Eκ(y−yN)"},{from:"plastic",to:"plasticBalance",label:"应力块合力"},{from:"interface",to:"shearLaw",label:"取 S=A′ȳ"},
      {from:"elasticBalance",to:"elasticOut",label:"解 yN / 应力比"},{from:"plasticBalance",to:"plasticOut",label:"解面积 / 合力"},{from:"shearLaw",to:"shearOut",label:"τ=Fs"},
    ],
  },
  {
    id: "tower", label: "变截面悬臂塔", subtitle: "两条局部函数汇合为曲率，再把小段贡献积分成顶部位移",
    nodes: [
      {id:"load",x:25,y:65,w:125,title:"顶部荷载",symbol:"P",detail:"外部水平力，是弯矩函数的来源。",kind:"input"},
      {id:"coordinate",x:25,y:210,w:125,title:"坐标与目标点",symbol:"x=0 顶部",detail:"x 从自由端向固定端；目标是顶部 w(0)。坐标决定力臂和边界检查。",kind:"input"},
      {id:"sectionEnds",x:25,y:355,w:125,title:"截面端点",symbol:"I → αI",detail:"顶部 I、底部 αI，中间按高度线性变化。",kind:"input"},
      {id:"moment",x:220,y:75,w:145,title:"切面平衡",symbol:"M(x)=Px",detail:"在位置 x 切开，只看上方自由体，力臂为 x。",kind:"quantity"},
      {id:"interpolation",x:220,y:345,w:145,title:"线性插值",symbol:"I(x)=I[1+(α−1)x/l]",detail:"用两端值建立任意位置的截面二次矩。",kind:"quantity"},
      {id:"stiffness",x:455,y:345,w:135,title:"局部抗弯刚度",symbol:"EI(x)",detail:"材料 E 与位置相关截面量 I(x) 共同决定局部抗弯能力。",kind:"quantity"},
      {id:"curvature",x:455,y:155,w:150,title:"局部曲率",symbol:"κ(x)=M(x)/EI(x)",detail:"M 越大越弯，EI 越大越不易弯；这是两条局部函数的汇合点。",kind:"rule"},
      {id:"rotation",x:675,y:90,w:130,title:"小段转角",symbol:"dθ=κdx",detail:"曲率乘以小段长度，得到这一段产生的微小转角。",kind:"quantity"},
      {id:"lever",x:675,y:255,w:130,title:"到顶部的力臂",symbol:"x",detail:"小段转动时，它上方到顶部的长度 x 放大为顶部横移。",kind:"quantity"},
      {id:"contribution",x:850,y:165,w:145,title:"顶部位移贡献",symbol:"dw=x·dθ",detail:"明确每一个 dx 小段到底给顶部贡献了多少位移。",kind:"quantity"},
      {id:"integral",x:850,y:345,w:145,title:"全部小段相加",symbol:"w=∫dw",detail:"积分不是新物理，只是把所有小段贡献相加。",kind:"rule"},
      {id:"answer",x:850,y:455,w:145,title:"结果与极限",symbol:"w(α), α→1",detail:"闭式结果必须在 α→1 时回到等截面悬臂 Pl³/(3EI)。",kind:"result"},
    ],
    edges: [
      {from:"load",to:"moment",label:"力 × 力臂"},{from:"coordinate",to:"moment",label:"切面位置 x"},{from:"sectionEnds",to:"interpolation",label:"端点线性插值"},{from:"interpolation",to:"stiffness",label:"×E"},
      {from:"moment",to:"curvature",label:"分子 M(x)"},{from:"stiffness",to:"curvature",label:"分母 EI(x)"},{from:"curvature",to:"rotation",label:"×dx"},{from:"coordinate",to:"lever",label:"小段到顶部距离"},
      {from:"rotation",to:"contribution",label:"×x"},{from:"lever",to:"contribution",label:"位移放大"},{from:"contribution",to:"integral",label:"0→l 累加"},{from:"integral",to:"answer",label:"代换与积分"},
    ],
  },
  {
    id: "thermal", label: "温度约束系统", subtitle: "自由热变形是总预算，杆与约束构件的柔度决定如何分配",
    nodes: [
      {id:"temperature",x:25,y:70,w:130,title:"温度输入",symbol:"α · ΔT · L",detail:"温度图线给 α，初末温度给 ΔT，长度 L 把应变变成位移。",kind:"input"},
      {id:"free",x:215,y:70,w:150,title:"自由热变形",symbol:"ΔLT=αΔTL",detail:"先假想完全没有约束，材料想伸长多少；此时 P=0。",kind:"quantity"},
      {id:"rodData",x:25,y:285,w:130,title:"热杆性质",symbol:"E · A · L",detail:"热杆受约束力后会机械压缩。",kind:"input"},
      {id:"rodFlex",x:215,y:285,w:150,title:"杆的轴向柔度",symbol:"fS=L/(EA)",detail:"单位力使热杆缩短多少。",kind:"quantity"},
      {id:"constraint",x:25,y:440,w:130,title:"约束构件",symbol:"弹簧 k / 柱 EI",detail:"约束不是只有自由或固定；弹簧与柱都具有有限柔度。",kind:"input"},
      {id:"constraintFlex",x:215,y:440,w:150,title:"约束柔度",symbol:"1/k 或 a³/(3EI)",detail:"把弹簧或悬臂柱翻译成与热杆相同的位移/力语言。",kind:"quantity"},
      {id:"compatibility",x:475,y:240,w:175,title:"连接点变形协调",symbol:"ΔLT=P(fS+fC)",detail:"自由热伸长被分配为热杆机械压缩与约束构件位移。两条柔度路径在这里汇合。",kind:"rule"},
      {id:"force",x:715,y:155,w:135,title:"相互作用力",symbol:"P=ΔLT/Σf",detail:"总柔度越小，约束越硬，产生的力越大。",kind:"result"},
      {id:"split",x:715,y:320,w:135,title:"变形分配",symbol:"δi=Pfi",detail:"求出 P 后分别回代，得到杆压缩与连接点位移。",kind:"quantity"},
      {id:"geometry",x:715,y:465,w:135,title:"柱上段刚体运动",symbol:"uA=uB+θB·AB",detail:"荷载点以上无弯矩但会随 B 点平移和转动。",kind:"rule"},
      {id:"checks",x:920,y:260,w:145,title:"结果与检查",symbol:"自由 ↔ 有限 ↔ 固定",detail:"P、实际伸长必须位于自由与完全固定两个极限之间，并回代闭合变形预算。",kind:"result"},
    ],
    edges: [
      {from:"temperature",to:"free",label:"αΔT × L"},{from:"free",to:"compatibility",label:"左侧总预算"},{from:"rodData",to:"rodFlex",label:"L/(EA)"},{from:"constraint",to:"constraintFlex",label:"等效柔度"},
      {from:"rodFlex",to:"compatibility",label:"PfS"},{from:"constraintFlex",to:"compatibility",label:"PfC"},{from:"compatibility",to:"force",label:"解 P"},{from:"force",to:"split",label:"分别乘 fi"},
      {from:"split",to:"geometry",label:"得到 uB、θB"},{from:"force",to:"checks",label:"检查力的范围"},{from:"geometry",to:"checks",label:"得到 uA"},
    ],
  },
];

const nodeFill = { input:"#fff7ed", rule:"#eef2ff", quantity:"#ecfeff", result:"#ecfdf5" };
const nodeStroke = { input:"#fdba74", rule:"#a5b4fc", quantity:"#67e8f9", result:"#6ee7b7" };

function center(node: GraphNode) { return { x: node.x + (node.w ?? 140)/2, y: node.y + 31 }; }

export default function QuestionSolutionFlow({ initialGraphId = "tower", showTabs = true, showHeader = true }: { initialGraphId?: string; showTabs?: boolean; showHeader?: boolean }) {
  const [graphId, setGraphId] = useState(initialGraphId);
  const graph = graphs.find(item => item.id === graphId) ?? graphs[0];
  const [selectedByGraph, setSelectedByGraph] = useState<Record<string,string>>({ tower:"curvature", composite:"state", thermal:"compatibility" });
  const selectedId = selectedByGraph[graph.id] ?? graph.nodes[0].id;
  const selected = graph.nodes.find(node => node.id === selectedId) ?? graph.nodes[0];
  const incoming = graph.edges.filter(edge => edge.to === selected.id);
  const outgoing = graph.edges.filter(edge => edge.from === selected.id);
  const relatedIds = new Set([selected.id, ...incoming.map(e=>e.from), ...outgoing.map(e=>e.to)]);

  return <section id="quantity-map" className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_-50px_rgba(15,23,42,.45)]">
    {showHeader ? <div className="border-b border-slate-100 px-5 py-5 sm:px-7"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Question solution flow</p><h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">从题目条件到答案的解题流</h2><p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500">点击图中节点。橙色箭头表示“这个量从哪里来”，绿色箭头表示“它继续影响什么”；无关路径会自动淡化。</p>
      {showTabs && <div className="mt-5 flex flex-wrap gap-2">{graphs.map(item => <button type="button" key={item.id} onClick={()=>setGraphId(item.id)} className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${graph.id===item.id?"bg-slate-950 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{item.label}</button>)}</div>}
    </div> : null}
    <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-600 sm:px-7"><span className="font-semibold text-slate-900">当前图：</span>{graph.subtitle}</div>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_330px]">
      <div className="overflow-x-auto bg-white p-3 sm:p-5"><svg viewBox="0 0 1050 545" className="min-w-[900px]" role="img" aria-label={`${graph.label}物理量关系图`}>
        <defs><marker id="arrow-gray" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#cbd5e1" /></marker><marker id="arrow-in" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#f59e0b" /></marker><marker id="arrow-out" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#10b981" /></marker></defs>
        {graph.edges.map((edge)=>{const from=graph.nodes.find(n=>n.id===edge.from)!;const to=graph.nodes.find(n=>n.id===edge.to)!;const a=center(from),b=center(to);const isIn=edge.to===selected.id;const isOut=edge.from===selected.id;const related=isIn||isOut;const color=isIn?"#f59e0b":isOut?"#10b981":"#cbd5e1";const opacity=related?1:0.3;const midX=(a.x+b.x)/2,midY=(a.y+b.y)/2;return <g key={`${edge.from}-${edge.to}`} opacity={opacity}><path d={`M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`} fill="none" stroke={color} strokeWidth={related?3:1.5} markerEnd={`url(#${isIn?"arrow-in":isOut?"arrow-out":"arrow-gray"})`} /><rect x={midX-53} y={midY-10} width="106" height="20" rx="10" fill="white" stroke={color} strokeOpacity=".35"/><text x={midX} y={midY+4} textAnchor="middle" fontSize="10" fill={color} fontWeight="600">{edge.label}</text></g>})}
        {graph.nodes.map(node=>{const w=node.w??140;const active=node.id===selected.id;const related=relatedIds.has(node.id);return <g key={node.id} role="button" tabIndex={0} onClick={()=>setSelectedByGraph(prev=>({...prev,[graph.id]:node.id}))} onKeyDown={event=>{if(event.key==="Enter"||event.key===" ")setSelectedByGraph(prev=>({...prev,[graph.id]:node.id}))}} className="cursor-pointer" opacity={related?1:0.38}><rect x={node.x} y={node.y} width={w} height="62" rx="14" fill={active?"#0f172a":nodeFill[node.kind]} stroke={active?"#0f172a":nodeStroke[node.kind]} strokeWidth={active?3:1.5}/><text x={node.x+12} y={node.y+22} fontSize="11" fontWeight="700" fill={active?"white":"#334155"}>{node.title}</text><text x={node.x+12} y={node.y+43} fontSize="10" fontWeight="600" fill={active?"#a7f3d0":"#64748b"}>{node.symbol}</text></g>})}
      </svg></div>
      <aside className="border-t border-slate-100 bg-slate-950 p-6 text-white lg:border-l lg:border-t-0"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Selected node</p><h3 className="mt-2 text-xl font-bold">{selected.title}</h3><p className="mt-1 font-mono text-sm font-semibold text-emerald-300">{selected.symbol}</p><p className="mt-5 text-sm leading-7 text-slate-300">{selected.detail}</p>
        <div className="mt-6 space-y-4"><div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">它从哪里来</p>{incoming.length?<ul className="mt-2 space-y-2">{incoming.map(edge=><li key={`${edge.from}-${edge.to}`} className="text-xs leading-5 text-slate-300"><span className="font-semibold text-white">{graph.nodes.find(n=>n.id===edge.from)?.title}</span><br/>通过：{edge.label}</li>)}</ul>:<p className="mt-2 text-xs text-slate-400">这是题目直接给出的输入。</p>}</div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">它继续影响什么</p>{outgoing.length?<ul className="mt-2 space-y-2">{outgoing.map(edge=><li key={`${edge.from}-${edge.to}`} className="text-xs leading-5 text-slate-300"><span className="font-semibold text-white">{graph.nodes.find(n=>n.id===edge.to)?.title}</span><br/>通过：{edge.label}</li>)}</ul>:<p className="mt-2 text-xs text-slate-400">这是当前解题链的输出。</p>}</div></div>
      </aside>
    </div>
  </section>;
}
