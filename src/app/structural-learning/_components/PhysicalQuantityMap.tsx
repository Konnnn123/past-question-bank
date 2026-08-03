"use client";

import { useState } from "react";

type Quantity = {
  id: string; symbol: string; name: string; nameJa: string; unit: string;
  category: "外部作用" | "内力" | "材料" | "截面" | "局部响应" | "整体响应" | "系统性质";
  meaning: string; relations: string[];
};

const quantities: Quantity[] = [
  {id:"force",symbol:"P · F",name:"集中力",nameJa:"集中荷重",unit:"N、kN",category:"外部作用",meaning:"外界施加在结构某一点上的推力或拉力。它不是截面内部的应力，而是结构响应的起点。",relations:["通过静力平衡转化为 N、Q、M","在线弹性系统中常满足 P=kδ"]},
  {id:"distributed",symbol:"q(x)",name:"分布荷载",nameJa:"分布荷重",unit:"力/长度",category:"外部作用",meaning:"沿构件长度连续分布的外力，例如自重、风压换算后的线荷载。",relations:["dQ/dx=−q(x)","dM/dx=Q(x)"]},
  {id:"temperature",symbol:"ΔT",name:"温度变化",nameJa:"温度差",unit:"°C 或 K",category:"外部作用",meaning:"材料温度相对初始状态的变化量。温差先产生自由热应变，受到约束后才产生内力。",relations:["εT=αΔT","ΔLT=αΔTL"]},
  {id:"normal-force",symbol:"N",name:"轴力",nameJa:"軸力",unit:"N、kN",category:"内力",meaning:"切开构件后，截面上沿构件轴线方向的内部合力。",relations:["平均正应力 σ=N/A","轴向变形 δ=NL/(EA)"]},
  {id:"shear-force",symbol:"Q · V",name:"剪力",nameJa:"せん断力",unit:"N、kN",category:"内力",meaning:"截面上与构件轴线垂直的内部合力。Q 与 V 是不同教材常用的两种记号。",relations:["dM/dx=Q","梁剪应力 τ=QS/(Ib)"]},
  {id:"moment",symbol:"M",name:"弯矩",nameJa:"曲げモーメント",unit:"力×长度",category:"内力",meaning:"截面内部为了平衡外力矩而形成的合力矩，使构件产生弯曲。",relations:["曲率 κ=M/(EI)","弯曲正应力 σ=My/I=M/Z"]},
  {id:"young",symbol:"E",name:"杨氏模量",nameJa:"ヤング係数",unit:"N/mm²",category:"材料",meaning:"材料在弹性阶段抵抗拉压变形的硬度。E 是刚度性质，不等于材料强度。",relations:["σ=Eε","与 A 组成 EA；与 I 组成 EI"]},
  {id:"thermal-coefficient",symbol:"α",name:"线膨胀系数",nameJa:"線膨張係数",unit:"1/°C",category:"材料",meaning:"温度每变化一度时，材料产生多少自由线应变。",relations:["εT=αΔT","自由状态下不产生应力"]},
  {id:"yield",symbol:"σy",name:"降伏应力",nameJa:"降伏応力度",unit:"N/mm²",category:"材料",meaning:"材料开始产生显著不可恢复塑性变形的应力门槛。",relations:["弹性验算比较 |σ| 与 σy","全塑性应力块取 ±σy"]},
  {id:"shear-strength",symbol:"Fs",name:"剪切破坏强度",nameJa:"せん断破壊強さ",unit:"N/mm²",category:"材料",meaning:"接着面或材料能够承受的剪应力上限。",relations:["令 τ=Fs 可反求破坏荷载"]},
  {id:"area",symbol:"A",name:"截面积",nameJa:"断面積",unit:"L²",category:"截面",meaning:"截面包含的材料数量，是轴向应力和轴向刚度的几何基础。",relations:["σ=N/A","轴向刚度 EA/L"]},
  {id:"second-moment",symbol:"I",name:"截面二次矩",nameJa:"断面二次モーメント",unit:"L⁴",category:"截面",meaning:"面积相对弯曲轴的平方加权分布。材料离轴越远，对 I 的贡献越大。",relations:["κ=M/(EI)","σ=My/I","τ=QS/(Ib)"]},
  {id:"first-moment",symbol:"S",name:"截面一次矩",nameJa:"断面一次モーメント",unit:"L³",category:"截面",meaning:"目标切面一侧部分面积相对中立轴的偏心总量。",relations:["S=A′ȳ","用于 τ=QS/(Ib)"]},
  {id:"section-modulus",symbol:"Z · Ze · Zp",name:"截面系数",nameJa:"断面係数",unit:"L³",category:"截面",meaning:"把截面几何转换成应力或塑性弯矩计算量。Ze 属于弹性，Zp 属于全塑性。",relations:["Ze=I/c，σmax=M/Ze","Mp=σyZp"]},
  {id:"length",symbol:"L · x · b · y",name:"几何长度",nameJa:"長さ・座標",unit:"L",category:"截面",meaning:"L 是构件长度，x 是位置坐标，b 是局部宽度，y 是到中立轴的距离；相同量纲但角色不同。",relations:["力臂决定 M","积分区间与位移放大","b、y 进入截面应力公式"]},
  {id:"normal-stress",symbol:"σ",name:"正应力",nameJa:"垂直応力度",unit:"N/mm²",category:"局部响应",meaning:"材料内部某一点单位面积上的拉压作用。内力是截面合量，应力是截面内的分布量。",relations:["轴向 σ=N/A","弯曲 σ=My/I","弹性 σ=Eε"]},
  {id:"shear-stress",symbol:"τ",name:"剪应力",nameJa:"せん断応力度",unit:"N/mm²",category:"局部响应",meaning:"材料内部某一点抵抗相对滑动的单位面积内力。",relations:["梁中 τ=QS/(Ib)","与 Fs 比较判断接着破坏"]},
  {id:"strain",symbol:"ε",name:"应变",nameJa:"ひずみ",unit:"无量纲",category:"局部响应",meaning:"微小长度变化相对于原长度的比例，是局部变形而不是整体位移。",relations:["ε=δ/L","σ=Eε","热应变 εT=αΔT"]},
  {id:"curvature",symbol:"κ",name:"曲率",nameJa:"曲率",unit:"1/L",category:"局部响应",meaning:"构件在某个位置弯得多急，是弯曲的局部几何响应。",relations:["κ=M/(EI)","κ=dθ/dx≈d²w/dx²"]},
  {id:"axial-rigidity",symbol:"EA",name:"轴向刚度因子",nameJa:"軸剛性因子",unit:"力",category:"系统性质",meaning:"材料硬度 E 与截面面积 A 的组合；构件实际轴向刚度还要除以长度。",relations:["kbar=EA/L","轴向柔度 f=L/(EA)"]},
  {id:"bending-rigidity",symbol:"EI",name:"抗弯刚度",nameJa:"曲げ剛性",unit:"力×L²",category:"系统性质",meaning:"材料硬度和截面几何抗弯能力的组合，决定相同弯矩下的曲率。",relations:["κ=M/(EI)","悬臂端柔度 L³/(3EI)"]},
  {id:"stiffness",symbol:"k",name:"刚度",nameJa:"剛性",unit:"力/L",category:"系统性质",meaning:"让构件或系统产生单位位移所需的力。它取决于材料、截面、长度和边界。",relations:["P=kδ","与柔度互为倒数 k=1/f"]},
  {id:"flexibility",symbol:"f",name:"柔度",nameJa:"コンプライアンス",unit:"L/力",category:"系统性质",meaning:"施加单位力产生的位移，适合在变形协调中把多个构件的位移直接相加。",relations:["δ=Pf","杆 L/(EA)，弹簧 1/k，悬臂 L³/(3EI)"]},
  {id:"displacement",symbol:"δ · u · w",name:"位移与挠度",nameJa:"変位・たわみ",unit:"L",category:"整体响应",meaning:"结构上某一点相对原位置的移动。δ 常表示一般位移，u/w 常区分方向。",relations:["轴向 δ=∫εdx","弯曲位移由曲率积分两次","线弹性系统 δ=Pf"]},
  {id:"rotation",symbol:"θ",name:"转角",nameJa:"たわみ角・回転角",unit:"rad（无量纲）",category:"整体响应",meaning:"构件变形曲线在某点的倾斜程度，是位移的一阶导数。",relations:["θ≈dw/dx","dθ/dx=κ=M/(EI)"]},
];

type MapNode = { qid:string; x:number; y:number; w?:number; label?:string };
type MapEdge = { from:number; to:number; formula:string };
type Lane = { id:string; title:string; subtitle:string; color:string; nodes:MapNode[]; edges:MapEdge[] };

const lanes: Lane[] = [
  {id:"axial",title:"轴向作用",subtitle:"外力怎样成为应力、应变与伸长",color:"#2563eb",nodes:[{qid:"force",x:40,y:55},{qid:"normal-force",x:245,y:55},{qid:"normal-stress",x:450,y:55},{qid:"strain",x:655,y:55},{qid:"displacement",x:860,y:55}],edges:[{from:0,to:1,formula:"平衡"},{from:1,to:2,formula:"σ=N/A"},{from:2,to:3,formula:"ε=σ/E"},{from:3,to:4,formula:"δ=∫εdx"}]},
  {id:"bending",title:"弯曲作用",subtitle:"弯矩同时控制截面应力和构件曲率",color:"#7c3aed",nodes:[{qid:"distributed",x:40,y:180},{qid:"moment",x:245,y:180},{qid:"normal-stress",x:450,y:155},{qid:"curvature",x:450,y:225},{qid:"rotation",x:655,y:225},{qid:"displacement",x:860,y:225}],edges:[{from:0,to:1,formula:"dM/dx=Q"},{from:1,to:2,formula:"σ=My/I"},{from:1,to:3,formula:"κ=M/EI"},{from:3,to:4,formula:"θ=∫κdx"},{from:4,to:5,formula:"w=∫θdx"}]},
  {id:"shear",title:"剪切作用",subtitle:"剪力通过截面一次矩变成指定位置的剪应力",color:"#0891b2",nodes:[{qid:"distributed",x:40,y:345},{qid:"shear-force",x:245,y:345},{qid:"shear-stress",x:520,y:345},{qid:"shear-strength",x:790,y:345}],edges:[{from:0,to:1,formula:"dQ/dx=−q"},{from:1,to:2,formula:"τ=QS/(Ib)"},{from:2,to:3,formula:"比较 τ 与 Fs"}]},
  {id:"thermal",title:"温度与约束",subtitle:"温度先产生自由变形，约束再把一部分变形转化为力",color:"#059669",nodes:[{qid:"temperature",x:40,y:480},{qid:"thermal-coefficient",x:210,y:480},{qid:"strain",x:390,y:480},{qid:"displacement",x:570,y:480},{qid:"stiffness",x:750,y:455},{qid:"flexibility",x:750,y:520},{qid:"force",x:930,y:480}],edges:[{from:0,to:2,formula:"εT=αΔT"},{from:1,to:2,formula:"×α"},{from:2,to:3,formula:"ΔLT=εTL"},{from:3,to:4,formula:"约束"},{from:3,to:5,formula:"协调"},{from:4,to:6,formula:"P=kδ"},{from:5,to:6,formula:"δ=Pf"}]},
];

const categoryStyle: Record<Quantity["category"],string> = {"外部作用":"border-rose-200 bg-rose-50","内力":"border-blue-200 bg-blue-50","材料":"border-violet-200 bg-violet-50","截面":"border-amber-200 bg-amber-50","局部响应":"border-cyan-200 bg-cyan-50","整体响应":"border-emerald-200 bg-emerald-50","系统性质":"border-indigo-200 bg-indigo-50"};

export default function PhysicalQuantityMap() {
  const [selectedId,setSelectedId]=useState("curvature");
  const [focus,setFocus]=useState("all");
  const selected=quantities.find(item=>item.id===selectedId) ?? quantities[0];
  return <section id="quantity-map" className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_-50px_rgba(15,23,42,.45)]">
    <div className="border-b border-slate-100 px-5 py-6 sm:px-7"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Physical quantity atlas</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">结构力学中的符号，分别在描述什么世界？</h2><p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500">从外部作用开始，结构内部出现 N、Q、M；材料与截面把它们转成 σ、τ、ε、κ；局部响应沿构件累积，最后成为 θ、u、w。点击任何符号查看定义、单位和公式关系。</p><div className="mt-5 flex flex-wrap gap-2">{[{id:"all",label:"全景"},...lanes.map(lane=>({id:lane.id,label:lane.title}))].map(item=><button type="button" key={item.id} onClick={()=>setFocus(item.id)} className={`rounded-xl px-4 py-2 text-xs font-semibold ${focus===item.id?"bg-slate-950 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{item.label}</button>)}</div></div>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-x-auto p-4 sm:p-6"><svg viewBox="0 0 1100 585" className="min-w-[900px]" role="img" aria-label="结构力学物理量关系全景图"><defs><marker id="quantity-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#94a3b8"/></marker></defs>
        {lanes.map((lane,laneIndex)=>{const laneVisible=focus==="all"||focus===lane.id;return <g key={lane.id} opacity={laneVisible?1:0.08}><rect x="8" y={laneIndex*135+18} width="1080" height="118" rx="22" fill={lane.color} opacity=".045"/><text x="25" y={laneIndex*135+40} fontSize="12" fontWeight="700" fill={lane.color}>{lane.title}</text><text x="110" y={laneIndex*135+40} fontSize="10" fill="#94a3b8">{lane.subtitle}</text>{lane.edges.map((edge,index)=>{const a=lane.nodes[edge.from],b=lane.nodes[edge.to],aw=a.w??145;const y1=a.y+31,y2=b.y+31;const x1=a.x+aw,x2=b.x;const mid=(x1+x2)/2;return <g key={`${lane.id}-${index}`}><path d={`M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`} fill="none" stroke="#94a3b8" strokeWidth="1.6" markerEnd="url(#quantity-arrow)"/><rect x={mid-48} y={(y1+y2)/2-10} width="96" height="20" rx="10" fill="white" stroke="#cbd5e1"/><text x={mid} y={(y1+y2)/2+4} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#64748b">{edge.formula}</text></g>})}{lane.nodes.map((node,index)=>{const q=quantities.find(item=>item.id===node.qid)!;const active=q.id===selected.id;const w=node.w??145;return <g key={`${lane.id}-${node.qid}-${index}`} role="button" tabIndex={0} className="cursor-pointer" onClick={()=>setSelectedId(q.id)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" ")setSelectedId(q.id)}}><rect x={node.x} y={node.y} width={w} height="62" rx="14" fill={active?"#0f172a":"white"} stroke={active?"#0f172a":lane.color} strokeWidth={active?3:1.5}/><text x={node.x+12} y={node.y+23} fontSize="13" fontWeight="700" fill={active?"white":"#0f172a"}>{q.symbol}</text><text x={node.x+12} y={node.y+44} fontSize="10.5" fill={active?"#a7f3d0":"#64748b"}>{q.name}</text></g>})}</g>})}
      </svg></div>
      <aside className="border-t border-slate-100 bg-slate-950 p-6 text-white lg:border-l lg:border-t-0"><span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-slate-400">{selected.category}</span><h3 className="mt-5 font-mono text-3xl font-bold">{selected.symbol}</h3><p className="mt-2 text-sm font-semibold text-white">{selected.name} / {selected.nameJa}</p><p className="mt-1 text-xs text-slate-400">单位：{selected.unit}</p><p className="mt-6 text-sm leading-7 text-slate-300">{selected.meaning}</p><div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">它与其他量的关系</p><ul className="mt-3 space-y-3">{selected.relations.map(item=><li key={item} className="flex gap-2 font-mono text-xs leading-5 text-slate-200"><span className="text-emerald-400">→</span>{item}</li>)}</ul></div></aside>
    </div>
    <div className="border-t border-slate-100 px-5 py-7 sm:px-7"><div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Symbol glossary</p><h3 className="mt-1 text-xl font-bold text-slate-950">符号图鉴</h3></div><p className="text-xs text-slate-400">同一个符号必须连同单位、对象和公式一起记忆。</p></div><div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{quantities.map(quantity=><button type="button" key={quantity.id} onClick={()=>setSelectedId(quantity.id)} className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${categoryStyle[quantity.category]} ${selected.id===quantity.id?"ring-2 ring-slate-900 ring-offset-2":""}`}><span className="block font-mono text-base font-bold text-slate-950">{quantity.symbol}</span><span className="mt-1 block text-xs font-semibold text-slate-700">{quantity.name}</span><span className="mt-1 block text-[10px] text-slate-500">{quantity.unit}</span></button>)}</div></div>
  </section>;
}
