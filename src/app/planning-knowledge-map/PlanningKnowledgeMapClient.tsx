"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { SidebarLayout } from "@/components/layout";
import type { Question } from "@/types/question";
import type { PlanningAnswerRecord } from "@/lib/planning-review";
import { getPlanningEssayAnswer } from "@/lib/planning-essay-answers";
import { PracticeControls, PracticeFilterToggle, needsPractice, useStudyRecords } from "@/components/practice/PracticeControls";

type Props = { questions: Question[]; answerRecords: PlanningAnswerRecord[] };

const TOPICS = [
  [
    "住宅・住区",
    "田園都市、近隣住区、集合住宅、コーポラティブハウス、住戸形式",
  ],
  [
    "医療・福祉",
    "病棟計画、看護単位、高齢者施設、バリアフリー、ユニバーサルデザイン",
  ],
  ["教育・文化施設", "学校、図書館、美術館、劇場・ホール"],
  ["都市・環境心理", "都市計画、歩車分離、領域、パーソナルスペース"],
  ["寸法・歴史的規準", "標準寸法、計画指標、年度に依存する法令"],
] as const;

const ESSAY_EXAMPLES = [
  {
    fileName: "2014_専門2-2_建筑计划_Q6.md",
    title: "开かれた学校",
    related: "开放学校",
    points: [
      "按两条讨论轴作答：空间开放／共享与教育活动的多样化；逐一回到图中的教室、开放空间、公共动线。",
      "每条轴都要写收益与问题：交流和灵活性提高，同时会出现噪声、管理、专注与安全边界问题。",
    ],
  },
  {
    fileName: "2014_専門2-2_建筑计划_Q7.md",
    title: "ユニバーサルデザイン",
    related: "UD",
    points: [
      "定义：不以特定群体为对象的事后补救，而是在一开始就让尽可能多的人公平、独立而安全地使用环境。",
      "七原则应完整列出：公平使用、使用灵活、简单直观、可感知信息、容许错误、低体力负担、适当尺寸与空间。",
    ],
  },
  {
    fileName: "2014_専門2-2_建筑计划_Q8.md",
    title: "超高層集合住宅の問題",
    related: "高层集合住宅",
    points: [
      "从日常生活圈、儿童／高龄者的外出、灾害与避难、电梯依赖、邻里关系、风环境与周边影响中选具体机制说明。",
      "不要把“高”本身当问题；写出高度—到达／管理／灾害条件—生活影响这一因果链。",
    ],
  },
  {
    fileName: "2016_専門2-2_建筑计划_Q6.md",
    title: "郊外大型店舗の駐車場規模",
    related: "停车计划",
    points: [
      "用峰值每小时到达车辆数与平均停留时间估算在场车辆数：必要台数≈峰时到达台数×平均停留时间（小时），并加上安全余量。",
      "检讨峰值日期、公共交通／拼车、员工车、周边道路容量与分期经营；年客流或面积不能直接替代峰时需求。",
    ],
  },
  {
    fileName: "2016_専門2-2_建筑计划_Q7.md",
    title: "消防署・救急病院の立地",
    related: "设施选址",
    points: [
      "核心是服务圈内的响应时间和可达性：接近需求、快速接入主干道路、避开常态拥堵，并考虑灾害时的冗余。",
      "在城市尺度上应靠近人口／事故风险的重心与交通网络节点，而非单纯选地价最低处。",
    ],
  },
  {
    fileName: "2017_専門2-2_建筑计划_Q1.md",
    title: "建筑计划相关书籍",
    related: "理论",
    points: [
      "每本按“作者／问题意识／核心概念／对空间计划的影响”四项写，避免只写书名和年代。",
      "例如《美国大城市的死与生》写街道活力与街道之眼；《城市意象》写路径、边界、区域、节点、地标；《模式语言》写可组合的空间模式。",
    ],
  },
  {
    fileName: "2017_専門2-2_建筑计划_Q2.md",
    title: "西户山小学：改修前后",
    related: "片廊下型／开放学习空间",
    points: [
      "改修前是普通教室沿片廊下排列、功能区分清楚的标准型学校平面；改修后教室、走廊与活动空间的边界更开放、可共享。",
      "成对评价：交流和弹性教学增强；但声环境、视线管理、专注空间与日常运营更难。",
    ],
  },
  {
    fileName: "2018_専門2-2_建筑计划_Q1.md",
    title: "Lighthouse International：視覚障がい者の環境",
    related: "UD／视觉障碍",
    points: [
      "逐张照片指出空间位置，再把可辨识的工夫写成“对象—信息／操作—效果”：高反差、均匀照明、触觉／盲文、清晰边缘、避免障碍。",
      "门牌除文字外可用触觉、声音或电子提示传达房名；答案必须对应题图，图像识别部分不应凭空替代。",
    ],
  },
  {
    fileName: "2018_専門2-2_建筑计划_Q2.md",
    title: "都心オフィスの最適プロポーション",
    related: "办公计划／优化",
    points: [
      "先将屋顶、幕墙与土地的单位面积成本代入各面的成本，再以体积约束 lx·ly·lz=4000 消去一个变量。",
      "对总成本求偏导并令其为零；答案需展示成本函数、约束式、最优尺寸与量纲检查。",
    ],
  },
  {
    fileName: "2019_専門2-2_建筑计划_Q1.md",
    title: "建築用語の対比",
    related: "概念比较",
    points: [
      "每组使用“定义—组织方式／技术—差异”三句：例如 universal space 是可变、均质的大空间；servant space 是服务核心与设备空间。",
      "BIM／CAM、Dymaxion／Tensegrity、Metabolism／Organic、public／common 都要写两端的不同，不可只给其中一端定义。",
    ],
  },
  {
    fileName: "2019_専門2-2_建筑计划_Q2.md",
    title: "家具工場の線形計画",
    related: "数理计划",
    points: [
      "列出约束：6A+3B≤360、5A+5B≤325、A+4B≤200，且A,B≥0；目标为最大化4A+8B。",
      "比较可行域顶点，最优为A=20台、B=45台，最大利润440万元；需画出或代入验证约束。",
    ],
  },
  {
    fileName: "2019_専門2-2_建筑计划_Q4.md",
    title: "図示建築 A・B の説明",
    related: "建筑读图",
    points: [
      "固定顺序：先识别结构与主空间，再写光、动线、构造／细部如何共同形成设计特征。",
      "此题的图像是答案依据；在未补全题图前只提供作答框架，不虚构A、B的名称或特征。",
    ],
  },
  {
    fileName: "2020_専門2-2_建筑计划_Q1.md",
    title: "こもれびの家／旧宮前小学校",
    related: "福祉／学校",
    points: [
      "こもれびの家：从个人房、居间、服务空间和外部空间的关系说明小规模家庭式居住、见守り与私密性的取舍。",
      "旧宫前小学：比较楼层／教室单元、公共活动空间和竖向连接，说明它如何组织年级、共享与日常管理。",
    ],
  },
  {
    fileName: "2020_専門2-2_建筑计划_Q2.md",
    title: "窓口待ち行列",
    related: "数理计划",
    points: [
      "先用总服务能力sμ判断曲线发散位置λ=sμ；服务能力更高的曲线在更右侧发散，多窗口与单窗口的曲线形状也不同。",
      "代入给定的等待时间阈值解λ，并说明当到达率接近总服务能力时等待时间会急增，因此应预留容量。",
    ],
  },
  {
    fileName: "2022_専門2-2_建筑计划_Q2.md",
    title: "公共施設の複合化と最適数",
    related: "设施规划／优化",
    points: [
      "举真实复合设施时写名称、自治体、整合的功能与共享的入口／管理／活动空间。",
      "总成本T=bn+2Pανκ√S·n^(-1/2)，令导数为零得 n*=(Pανκ√S/b)^(2/3)；再代入表中参数并比较A、B、A+B。",
    ],
  },
  {
    fileName: "2023_専門2-2_建筑计划_Q2.md",
    title: "特養 I・II の空間グラフ",
    related: "照护单元／空间图解",
    points: [
      "按题意只把带字母的空间和外部空间转为节点，门／直接连接转为边；以HS为step 0重画并统计层级。",
      "论述必须从步数得出空间组织差异，再联系小单位ユニットケア：较短而清晰的生活单元有助于方向感、交流与见守り。",
    ],
  },
  {
    fileName: "2023_専門2-2_建筑计划_Q4.md",
    title: "京町家・ショップハウス・インスラ",
    related: "都市住宅类型",
    points: [
      "京町家画出狭长敷地上的通り庭、前店、居室、坪庭／后部；说明高地价和临街商业使其成为城市型住宅。",
      "比较shop house时从临街店面、纵深、采光通风、五脚基／骑楼与殖民建筑影响写；与insula区别在于后者是多户集合居住。",
    ],
  },
  {
    fileName: "2024_専門2-2_建筑计划_Q1.md",
    title: "戦前・戦後の公的集合住宅",
    related: "公营集合住宅史",
    points: [
      "按配置与住户两层对比：供给主体和目标人群、住栋布置、入口方式、住户内的食寝分离／设备与居住标准。",
      "不要把四图逐张孤立说明；串成灾前—战后住宅政策、卫生与生活方式、标准化及住区关系的变化。",
    ],
  },
  {
    fileName: "2024_専門2-2_建筑计划_Q2.md",
    title: "住宅地の施設分布分析",
    related: "住区／空间分析",
    points: [
      "先依据fXY(r)的增长速度和形状判读近接、凝集或分散，并将A／B／C与小学校、最寄品店、买回品店的服务圈联系。",
      "不同设施数比较前应按中心设施数或理论随机分布进行归一化，避免“数量多”被误读为“更凝集”。",
    ],
  },
  {
    fileName: "2025_専門2-2_建筑计划_Q1.md",
    title: "病室／美術館の平面比較",
    related: "医疗／文化设施",
    points: [
      "病室：从床位、窗、卫生间、护理观察、私密性与家属停留比较标准和非标准方案，写出照护与环境质量的取舍。",
      "美术馆：用入口、展厅单元、外部空间与游览路径比较世田谷的整体序列和十和田的独立单元／城市性空间。",
    ],
  },
  {
    fileName: "2025_専門2-2_建筑计划_Q2.md",
    title: "3住宅の名称・平面グラフ",
    related: "住宅类型／空间图解",
    points: [
      "先用图上的中庭、通り抜け、DK、外部空间与房间连接识别案例；名称题后必须转为每案的计划特征。",
      "图解题按节点、边、平均step数逐步计算；最后用平均step数解释中心性、回游性、外部空间介入与住户空间层级的差异。",
    ],
  },
  {
    fileName: "2026_専門2-2_建筑计划_Q1.md",
    title: "晴海高層アパート／日野図書館／イブリン・ロウ小学校",
    related: "集合住宅／图书馆／学校",
    points: [
      "晴海：通路层与住户层交替，跳层进入减少走廊与电梯停靠；同时写避难和无障碍的代价。",
      "日野图书馆：连续读地下、1层、2层中的阅览、书库、管理与竖向动线；伊夫林·洛小学：读教室组团、公共空间、采光与开放学习的边界。",
    ],
  },
  {
    fileName: "2026_専門2-2_建筑计划_Q2.md",
    title: "高層建築のエレベータ運行",
    related: "运输计划／数理",
    points: [
      "按到达时刻、等待人数、τ=τ0+αN逐轮列表或画时间轴，不能跳过B初次乘车人数和下一次返回时刻。",
      "结论写成运营知见：微小初始差会造成聚集／交替／不稳定；用分区、目的层控制、群控和发车间隔调节来抑制等待。",
    ],
  },
] as const;

function essayType(fileName: string) {
  if (
    /(2016.*Q6|2018.*Q2|2019.*Q2|2020.*Q2|2022.*Q2|2024.*Q2|2026.*Q2)/.test(
      fileName,
    )
  )
    return "数理·运营";
  if (/(2014.*Q7|2017.*Q1|2019.*Q1)/.test(fileName)) return "理论·概念";
  if (/(2014.*Q8|2016.*Q6|2016.*Q7)/.test(fileName)) return "设施·城市";
  return "平面·建筑";
}

function sampleEssayAnswer(fileName: string) {
  const answers: Record<string, string> = {
    "2014_専門2-2_建筑计划_Q6.md":
      "这所学校的“开放”首先表现为教室、走廊与共同活动空间之间的界面被弱化，使不同班级的活动可以向公共空间外溢；其次表现为学习空间可按小组、年级或全校活动灵活组合。这样能增加交流、偶发学习和教师协作，但开放边界也会使噪声互相干扰、视线与安全管理变复杂，因此必须以可关闭的隔断、教师据点和清晰的动线分区来补足。",
    "2014_専門2-2_建筑计划_Q7.md":
      "ユニバーサルデザイン是从规划初期就使尽可能多的年龄、能力和身体条件的人能够公平、独立、安全使用环境的设计思想，而非事后为少数人附加的专用装置。其七原则为：公平使用、使用灵活、使用简单直观、信息容易感知、容许误操作、低体力负担，以及提供适当尺寸和接近／操作空间。",
    "2014_専門2-2_建筑计划_Q8.md":
      "超高层集合住宅的主要问题不在于高度本身，而在于垂直交通把日常生活与地面公共空间拉开。居民对电梯依赖强，停电、火灾或地震时避难和救援困难；儿童与高龄者外出的成本提高，邻里接触也容易减少。高密度集中还会带来风环境、日照、投影及周边基础设施负担。因此设计应同时考虑避难层、备用电源、日常共用空间和与地面的连续联系。",
    "2016_専門2-2_建筑计划_Q7.md":
      "消防署和急救医院的选址应以服务圈内的响应时间为首要标准。基地应接近人口和事故风险较高的区域，并能迅速接入多方向的主干道路，避免铁路道口、常发拥堵点和灾害时易中断的路线。城市尺度上，它们应配置在需求重心与交通网络节点附近，同时通过多点布置或替代路线保证灾害时的冗余，而不能只按地价或用地面积决定。",
    "2017_専門2-2_建筑计划_Q1.md":
      "《没有建筑师的建筑》重视无名建造在气候、材料和生活方式中形成的智慧；《美国大城市的死与生》以混合使用、短街区和“街道之眼”说明城市活力；《城市意象》以路径、边界、区域、节点、地标解释城市可识别性；《向拉斯维加斯学习》讨论符号与传播；《模式语言》则把城镇、建筑和细部归纳为可组合的空间模式。它们共同提示建筑计划不能脱离使用者、日常行为和城市关系。",
    "2017_専門2-2_建筑计划_Q2.md":
      "改修前的西户山小学采用普通教室沿片廊下排列的标准型平面，班级单元明确，教室与走廊的功能边界清楚。改修后，教室、走廊和活动空间之间的界面被打开，形成可共享、可灵活使用的学习空间，并设置教师可接近学生共同活动的据点。其优点是促进年级交流和多样学习；但声环境、视线控制、专注空间和日常管理的难度增加。它反映了学校计划从统一班级单元转向重视学习方式与交流的变化。",
    "2018_専門2-2_建筑计划_Q1.md":
      "Lighthouse International的无障碍计划应针对视觉障碍者的定向、辨识与安全：在转角、门口、楼梯和高差处使用连续扶手、触觉提示、清晰边缘和避免突出的障碍物；在照明上减少眩光并提高必要部位的亮度与对比；在标识上采用大字、高反差、触觉文字和盲文。门牌之外，还可通过语音提示装置或触觉／电子信标在门前传达房间名称。照片与图号的对应须以原题图中标号逐一核对。",
    "2019_専門2-2_建筑计划_Q1.md":
      "Universal space是柱网中可自由分隔、用途可变的主空间；servant space是集中布置设备、交通、储藏等服务功能的核心。BIM是整合建筑信息的数字模型，CAM是把数字数据用于制造与施工控制。Dymaxion强调轻量、高效的整体系统，tensegrity以受拉构件与受压杆的平衡维持形体。Metabolism强调可替换单元和城市成长，organic architecture强调建筑与场所、材料和生活的连续性。Public space面向不特定公众，common space则由特定共同体共享并共同管理。",
    "2019_専門2-2_建筑计划_Q4.md":
      "本题应先从图中识别A、B的结构体系、主要空间和构造细部，再分别说明这些要素如何形成空间与设计特征。例如应写出承重与跨度如何决定平面自由度，采光与开口如何组织室内体验，以及节点、材料和构件表达如何支持整体形象。由于现有数据库缺少可辨认的A、B原图，不能负责任地虚构两建筑的名称或细部；图像补齐后应按上述结构分别写成各五行答案。",
    "2020_専門2-2_建筑计划_Q1.md":
      "こもれびの家以小规模居住单元组织认知症高龄者的日常生活：个人房提供退避与私密，居间和餐厨成为共同生活中心，服务空间与外部空间保持容易到达和可见的关系。短而可辨识的动线有利于方向感、日常交流和职员见守り，同时须避免共同空间过度暴露个人生活。旧宫前小学则应从上下层教室单元、共同活动空间、竖向联系和教师管理据点来说明其如何兼顾年级组织、共享活动与日常管理。",
    "2023_専門2-2_建筑计划_Q2.md":
      "特养I、II的平面不能只比较房间数量，而应把带字母的空间转成节点、把直接连通转成边，再从HS为起点比较各空间的step数。若生活空间围绕较小的单元聚集，居民从居室到居间、卫生和外部空间的step数较短，职员的见守り路径也较清晰；若空间通过长走廊串联，step数会增加，单元边界和日常接触变弱。因此小单位ユニットケア的意义在于以较小、可识别的生活范围兼顾私密、交流和照护效率。",
    "2023_専門2-2_建筑计划_Q4.md":
      "京町家通常建于狭长临街地块，前部为店或接客空间，中间以通り庭连接，居室沿纵深布置，并以坪庭取得采光通风，后部为生活与服务空间。这种“窄间口、深进深”来自城市中心地价高、临街商业价值高的条件。东南亚shop house同样临街营业，但常有骑楼／五脚基等可遮阳避雨的半室外步道，开口、通风和材料也更适应湿热气候，并可见殖民时期的西式立面或构件影响。罗马insula则是多户叠置的集合住宅，与以单一住户为主、纵深发展的町家不同。",
    "2024_専門2-2_建筑计划_Q1.md":
      "战前与战后的公的集合住宅反映了供给制度和生活方式的变化。战前案例常与特定供给主体、职工或低收入者的居住条件相关，住户面积与设备较有限；战后在住宅不足与公共住宅政策下，标准化住栋和住户大量供给，平面逐渐明确食寝分离、卫生设备和家庭单位。比较配置图时还应写出住栋布置、开放空间、入口方式和住区设施如何从单体供给转向以居住环境为对象的计划。",
    "2025_専門2-2_建筑计划_Q1.md":
      "与日本常见的标准多床病室相比，西神户医疗中心的4床病室应从床位与窗、卫生间、护理观察、患者私密性和家属停留的关系来评价：病床周边的个人领域、自然光和视线控制得到改善，但护理效率、设备集中和灵活使用需一并检讨。世田谷美术馆可作为整体连续的展示序列参照；十和田市现代美术馆则以相对独立的展示单元及其间的外部／城市性空间组织参观路径，提供选择和停留，但对导向、管理、气候控制与展览连续性提出较高要求。",
    "2025_専門2-2_建筑计划_Q2.md":
      "三住宅的识别应以图中的中庭、通り抜け、DK、外部空间和房间连接为依据，而不是凭名称猜测。作图时把带字母的空间及外部空间作为节点，把直接连通作为边，再计算从外部起点和最佳中心起点的平均step数。平均step数较小的方案说明核心空间更居中、到达更直接；数值较大的方案通常具有更强的层级、回游或外部空间介入。最后应把数值与每一住宅的生活方式、私密性和动线组织联系起来说明。",
    "2026_専門2-2_建筑计划_Q1.md":
      "晴海高层公寓把通路层与住户层交替设置，住户以跨层方式组织；共用廊道和电梯停靠层因此减少，但到户路径、避难和无障碍处理更复杂。日野市立中央图书馆应从地下、1层、2层的阅览、书库、管理和竖向动线关系说明功能分层与使用者到达。伊夫林·洛小学则要说明教室组团、共同学习空间、采光与户外空间的联系，以及开放学习带来的交流优势和声环境、管理边界问题。",
  };
  const answersJa: Record<string, string> = {
    "2014_専門2-2_建筑计划_Q6.md":
      "この学校における「開かれた学校」の第一の視点は、普通教室と廊下・共用空間の境界を弱め、学級活動をオープンスペースへ展開できるようにした点である。第二の視点は、学級単位に限定せず、小集団・学年・全校など多様な学習集団に対応できる可変的な空間を設けた点である。これにより交流や偶発的な学習、教員間の協働が促される。一方、音の相互干渉、視線と安全の管理、集中できる場所の不足が生じうるため、可動間仕切り、教員コーナー、明快な動線区分などによる補完が必要である。",
    "2014_専門2-2_建筑计划_Q7.md":
      "ユニバーサルデザインとは、特定の人のために後から特別な設備を付加するのではなく、計画の初期段階から、年齢や能力、身体条件にかかわらず、できるだけ多くの人が公平・自立的・安全に利用できる環境をつくる考え方である。七原則は、①公平な利用、②利用における柔軟性、③単純で直感的な利用、④認知できる情報、⑤失敗に対する寛大さ、⑥少ない身体的努力、⑦接近・利用のための十分な大きさと空間、である。",
    "2014_専門2-2_建筑计划_Q8.md":
      "超高層集合住宅の問題は、高さそのものよりも、日常生活と地上の公共空間が垂直動線によって分離される点にある。居住者はエレベーターへの依存が大きく、停電・火災・地震時には避難や救助が困難になる。特に子どもや高齢者は外出の負担が増し、近隣交流も希薄になりやすい。また、高密度化はビル風、日影、眺望阻害、周辺インフラへの負荷を生む。したがって、避難階、非常電源、日常的な共用空間、地上との連続性を一体的に計画する必要がある。",
    "2016_専門2-2_建筑计划_Q7.md":
      "消防署や救急病院の敷地は、サービス圏内への到達時間を最優先に選定すべきである。人口や事故発生リスクの高い地域に近く、複数方向の幹線道路へ速やかに接続できる場所が望ましい。踏切、恒常的な渋滞箇所、災害時に寸断されやすい経路は避ける。都市全体では、需要の重心と交通ネットワークの結節点付近に配置し、複数施設の分散配置や代替経路によって非常時の冗長性を確保する必要がある。地価の安さや敷地面積のみで決定してはならない。",
    "2017_専門2-2_建筑计划_Q1.md":
      "『Architecture Without Architects』は、気候・材料・生活に適応した無名の建築の知恵を評価した。『The Death and Life of Great American Cities』は、用途混合、短い街区、街路の目によって都市の活力を説明した。『The Image of the City』は、パス、エッジ、ディストリクト、ノード、ランドマークから都市のイメージアビリティを論じた。『Learning from Las Vegas』は、都市における記号と情報伝達を再評価した。『A Pattern Language』は、町・建築・細部を相互に組み合わせられるパターンとして体系化した。",
    "2017_専門2-2_建筑计划_Q2.md":
      "改修前の西戸山小学校は、普通教室を片廊下に沿って反復配置した標準的な片廊下型校舎であり、教室と廊下の機能的境界が明確であった。改修後は、教室、廊下、活動空間の境界を開き、学年で共有できる柔軟な学習空間と教員コーナーを形成した。これにより、学年間交流や多様な学習活動が促される反面、騒音、視線、集中場所、管理上の課題が増える。この変化は、一斉授業を前提とする学級・教室単位の計画から、多様な学習方法と交流を重視する計画への転換を示す。",
    "2018_専門2-2_建筑计划_Q1.md":
      "ライトハウス・インターナショナル本部では、視覚障害者の定位、識別、安全を支援する計画が行われている。曲がり角、出入口、階段、段差には連続した手すり、触覚的な手掛かり、明確な縁取りを設け、突出物を避ける。照明はまぶしさを抑え、必要箇所の照度と色彩コントラストを高める。サインは大きな文字、高い明度差、触知文字、点字を併用する。室名を伝える別の方法として、音声案内装置や触覚・電子ビーコンを用いることができる。写真番号と図中記号の対応は、原図を見て個別に確認する。",
    "2019_専門2-2_建筑计划_Q1.md":
      "ユニバーサル・スペースは、均質な構造グリッドの中で用途や間仕切りを変更できる主空間であり、サーバント・スペースは設備、交通、収納などを集約した奉仕空間である。BIMは建築情報を統合するデジタルモデル、CAMはデータを製造・施工へ接続する技術である。ダイマキシオンは軽量で高効率な総合システムを志向し、テンセグリティは引張材と圧縮材の釣合いで形態を成立させる。メタボリズムは交換可能な単位と成長を重視し、有機的建築は場所・材料・生活との連続性を重視する。パブリック・スペースは不特定多数に開かれ、コモン・スペースは特定の共同体が共有・管理する。",
    "2019_専門2-2_建筑计划_Q4.md":
      "A、Bについて、まず図から構造形式、主要空間、採光、動線、構法・ディテールを読み取る。次に、構造とスパンが平面の自由度をどのように決め、開口と光が空間体験をどう組織し、材料と接合部の表現が全体のデザインをどう支えているかを説明する。現データベースではA、Bを識別できる原図が欠けているため、建築名や具体的なディテールを断定することはできない。図版補完後、各建築について上記の順序で五行程度にまとめる。",
    "2020_専門2-2_建筑计划_Q1.md":
      "こもれびの家は、認知症高齢者の生活を小規模な居住単位で構成している。個室は退避とプライバシーを確保し、居間・食堂・台所は共同生活の中心となる。短く理解しやすい動線と、共用空間・外部空間への見通しは、見当識、交流、職員の見守りを支える。一方で、見通しを確保しながら個人領域を過度に露出させない配慮が必要である。旧宮前小学校は、上下階の教室群、共用活動空間、階段などの垂直動線、教員の管理拠点の関係によって、学年単位のまとまりと全校的な交流を両立させている。",
    "2023_専門2-2_建筑计划_Q2.md":
      "特別養護老人ホームI、IIは、室数だけでなく空間の接続関係によって比較する。記号付きの空間をノード、直接接続をエッジとしてグラフ化し、HSをstep 0として各室までのstep数を求める。生活空間が小さな単位を中心に集約される場合、居室から居間、衛生空間、外部空間までのstep数が短く、職員の見守り動線も明快になる。長い廊下で空間を連結する構成ではstep数が増え、生活単位のまとまりが弱い。小単位のユニットケアは、認識しやすい生活圏の中で、プライバシー、交流、介護効率を両立することに意味がある。",
    "2023_専門2-2_建筑计划_Q4.md":
      "京町家は、間口が狭く奥行きの深い敷地に建ち、前部に店、側部に通り庭、奥に居室と坪庭、さらに後部に生活・サービス空間を配置する。都心では地価と街路に面する商業価値が高いため、この細長い形式が成立した。東南アジアのショップハウスも前面を店舗とするが、五脚基などの日射と雨を避ける半屋外歩廊をもち、湿熱気候に対応する通風・開口を備える。立面には植民地期の西洋建築の影響が見られる。ローマのインスラは複数世帯を積層した集合住宅であり、単一世帯を中心に奥行き方向へ展開する町家と異なる。",
    "2024_専門2-2_建筑计划_Q1.md":
      "戦前・戦後の公的集合住宅は、住宅供給制度と生活様式の変化を示している。戦前の事例は特定の供給主体や労働者・低所得者の居住改善と関係し、住戸面積や設備は限定的であった。戦後は深刻な住宅不足と公共住宅政策を背景に、標準化した住棟・住戸が大量供給され、食寝分離、衛生設備、家族単位の生活が平面に明確に表れた。配置図では、住棟の並べ方、入口形式、外部空間、住区施設を比較でき、供給対象が単体住戸から居住環境全体へ広がったことが読み取れる。",
    "2025_専門2-2_建筑计划_Q1.md":
      "西神戸医療センターの4床室は、標準的な多床室と比べて、各病床の窓、衛生設備、看護観察、患者のプライバシー、家族の滞在場所の関係から評価できる。病床周辺の個人領域と自然光を確保しやすい反面、看護動線、設備の集約、病室の可変性を検討する必要がある。世田谷美術館が全体的で連続する展示シークエンスを形成するのに対し、十和田市現代美術館は独立性の高い展示室と、その間の外部・都市的空間によって鑑賞経路を構成する。選択性と滞留を生む一方、案内、管理、環境制御、展示の連続性が課題となる。",
    "2025_専門2-2_建筑计划_Q2.md":
      "住宅I、II、IIIは、中庭、通り抜け、DK、外部空間、各室の接続関係を手掛かりに識別する。記号付き空間と外部空間をノード、直接接続をエッジとしてグラフを作成し、外部を起点とする平均step数を求める。次に外部を除き、平均step数が最小となる中心ノードを選ぶ。平均step数が小さい住宅は中心空間から各室へ直接到達しやすく、数値が大きい住宅は空間の階層、回遊、外部空間の介在が強い。したがって数値を、各住宅の生活様式、プライバシー、動線構成と結び付けて比較する必要がある。住宅名と具体的数値は原図の記号を用いて確定する。",
    "2026_専門2-2_建筑计划_Q1.md":
      "晴海高層アパートは、廊下階と住戸階を交互に設け、住戸をメゾネットとして構成する。共用廊下とエレベーター停止階を削減できる一方、住戸への経路、避難、バリアフリーが複雑になる。日野市立中央図書館は、地下・1階・2階の閲覧、書庫、管理部門を垂直動線で結び、利用者動線と資料・管理動線を階層的に組織している。イブリン・ロウ小学校は、教室群を共用学習空間や外部空間と結び、採光と交流を確保する。開放的な学習を支える反面、音環境と管理境界への配慮が必要である。",
  };
  return (
    answersJa[fileName] ??
    answers[fileName] ??
    "この問題は、完全な図版を確認した上で各設問に答える必要がある。現時点では検証可能な参考答案を作成できない。"
  );
}

const REVIEW_TYPES = [
  "住宅·住区",
  "医疗·福祉",
  "教育·文化",
  "都市·环境",
  "尺度·法规",
] as const;
type ReviewType = (typeof REVIEW_TYPES)[number] | "all";

function classifyType(text: string) {
  if (
    /(病院|病室|病床|看護|高齢|介護|福祉|車椅子|バリアフリー|ユニバーサル)/.test(
      text,
    )
  )
    return "医疗·福祉";
  if (/(学校|教室|図書館|劇場|美術館|音楽|ホール|映画)/.test(text))
    return "教育·文化";
  if (
    /(建築基準|都市計画法|法律|容積率|建蔽率|日影|斜線|エネルギー|\b[0-9]+\s*(m|cm|㎡|床|人)\b)/.test(
      text,
    )
  )
    return "尺度·法规";
  if (
    /(住宅|住戸|住区|団地|田園|近隣|ラドバーン|コーポラティブ|コレクティブ|晴海|シーサイド|ハウジング)/.test(
      text,
    )
  )
    return "住宅·住区";
  return "都市·环境";
}

function statusLabel(status: string) {
  if (status === "historical-law-draft") return "按该年度旧制";
  if (status === "concept-pair-draft") return "配对重点";
  return "卡片支持的草案";
}

function questionSegments(content: string) {
  const numbered = [...content.matchAll(/^[\s]*[（(](\d{1,2})[）)]/gm)];
  if (numbered.length > 1) {
    return new Map(
      numbered.map((match, index) => [
        `s${String(Number(match[1])).padStart(2, "0")}`,
        content
          .slice(match.index, numbered[index + 1]?.index ?? content.length)
          .trim(),
      ]),
    );
  }

  const firstPrompt = content.indexOf("・");
  const letters = [...content.matchAll(/\[([A-T])\]/g)].filter(
    (match) => (match.index ?? 0) > firstPrompt,
  );
  const latestByLetter = new Map<string, RegExpMatchArray>();
  letters.forEach((match) => latestByLetter.set(match[1], match));
  const uniqueLetters = [...latestByLetter.values()].sort(
    (left, right) => (left.index ?? 0) - (right.index ?? 0),
  );
  return new Map(
    uniqueLetters.map((match, index) => [
      `s${match[1].toLowerCase()}`,
      content
        .slice(match.index, uniqueLetters[index + 1]?.index ?? content.length)
        .trim(),
    ]),
  );
}

function AnswerRow({
  item,
  questionText,
  number,
  source,
}: {
  item: PlanningAnswerRecord["items"][number];
  questionText?: string;
  number: number;
  source?: {
    sourceQuestionId: string;
    sourceHref: string;
    sourceLabel: string;
    subject: string;
    year: number;
    topicTags: string[];
    cognitiveTask: string;
    answerBasis: string;
  };
}) {
  return (
    <article id={`planning-${item.itemId.replace(/[^a-zA-Z0-9_-]/g, "-")}`} className="min-w-0 scroll-mt-24 rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-slate-900 px-1.5 text-xs font-bold text-white">
          {number}
        </span>
        <span className="text-xs font-medium text-slate-500">题目</span>
      </div>
      {questionText ? (
        <div className="prose prose-sm max-w-none break-words [overflow-wrap:anywhere] text-slate-700">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {questionText}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          该小问题干尚未从原题中切分；可在原题页查看。
        </p>
      )}
      <details className="group mt-3 rounded-lg border border-emerald-100 bg-emerald-50/30">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-emerald-800">
          <span>展开答案与依据</span>
          <span className="text-xs text-emerald-500 transition group-open:rotate-90">
            ›
          </span>
        </summary>
        <div className="border-t border-emerald-100 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              {item.choice}
            </span>
            <strong className="text-sm text-slate-900">{item.answer}</strong>
            <span className="text-[11px] text-amber-700">
              {statusLabel(item.reviewStatus)}
            </span>
          </div>
          {item.evidenceCards.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              关联 Anki：{item.evidenceCards.join(" · ")}
            </p>
          )}
        </div>
      </details>
      <PracticeControls questionId={`planning:${item.itemId}`} source={source} compact />
    </article>
  );
}

function EssayExamples({
  questions,
  year,
  reviewType,
}: {
  questions: Question[];
  year: number | "all";
  reviewType: ReviewType;
}) {
  const nonMathExamples = ESSAY_EXAMPLES.filter(
    (example) => essayType(example.fileName) !== "数理·运营",
  );
  const visibleExamples = nonMathExamples.filter(
    (example) =>
      (year === "all" || Number(example.fileName.slice(0, 4)) === year) &&
      (reviewType === "all" ||
        classifyType(`${example.title} ${example.related}`) === reviewType),
  );
  return (
    <section id="essay-examples" className="scroll-mt-24">
      <div className="mb-4">
        <p className="text-sm font-semibold text-violet-700">
          专业 2-2 · 完整题目与日语示范答案
        </p>
        <h3 className="mt-1 text-xl font-bold text-slate-900">
          历年建筑计划 2-2（{visibleExamples.length}／{nonMathExamples.length}{" "}
          题）
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          与专业 1
          共用上方的年份和类型筛选；数理、运筹与计算题已排除。答案按题目的“任选／全答、行数、逐小问”等要求分别组织，不再用一段文字概括整份题目。
        </p>
      </div>
      <div className="space-y-5">
        {visibleExamples.map((example) => {
          const index = questions.findIndex(
            (question) => question.fileName === example.fileName,
          );
          const question = questions[index];
          const structuredAnswer = getPlanningEssayAnswer(example.fileName);
          return (
            <article
              key={example.fileName}
              className="min-w-0 rounded-2xl border border-violet-100 bg-white"
            >
              <div className="border-b border-violet-50 px-5 py-4">
                <p className="text-xs font-semibold text-violet-700">
                  {question?.year} · 专门2-2 · {question?.question_number} ·{" "}
                  {essayType(example.fileName)}
                </p>
                <h4 className="mt-1 font-semibold text-slate-900">
                  {example.title}
                </h4>
                <p className="mt-2 text-xs text-slate-500">
                  关联类型：{example.related}
                </p>
              </div>
              <div className="px-5 py-4">
                {question ? (
                  <div className="prose prose-sm max-w-none break-words [overflow-wrap:anywhere] text-slate-700">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {question.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-rose-600">原题文件未匹配。</p>
                )}
                {structuredAnswer ? (
                  <div className="mt-5 space-y-4">
                    <p className="rounded-lg bg-violet-50 px-4 py-3 text-sm font-medium text-violet-800">
                      作答要求：{structuredAnswer.instruction}
                    </p>
                    {structuredAnswer.sections.map((section) => (
                      <section
                        key={section.id}
                        className="rounded-xl border border-emerald-100 bg-emerald-50/30"
                      >
                        <div className="border-b border-emerald-100 px-4 py-3">
                          <h5
                            lang="ja"
                            className="font-semibold text-slate-900"
                          >
                            {section.title}
                          </h5>
                          <p lang="ja" className="mt-1 text-xs text-slate-500">
                            {section.requirement}
                          </p>
                        </div>
                        <div className="px-4 py-4">
                          <h6 className="text-sm font-semibold text-emerald-800">
                            模範解答（日本語）
                          </h6>
                          <p
                            lang="ja"
                            className="mt-2 text-sm leading-7 text-slate-700"
                          >
                            {section.answerJa}
                          </p>
                          <details className="mt-4 rounded-lg border border-slate-200 bg-white/70">
                            <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-700">
                              答题思路（中文）
                            </summary>
                            <ol className="list-decimal space-y-2 border-t border-slate-200 px-8 py-3 text-sm leading-6 text-slate-600">
                              {section.reasoningZh.map((reason) => (
                                <li key={reason}>{reason}</li>
                              ))}
                            </ol>
                          </details>
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <>
                    <details
                      className="group mt-4 rounded-lg border border-amber-100 bg-amber-50/40"
                      open
                    >
                      <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-amber-800">
                        暂定参考答案（待按小问重写）
                      </summary>
                      <p
                        lang="ja"
                        className="border-t border-amber-100 px-4 py-3 text-sm leading-7 text-slate-700"
                      >
                        {sampleEssayAnswer(example.fileName)}
                      </p>
                    </details>
                    <details className="mt-3 rounded-lg border border-slate-200 bg-slate-50">
                      <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-700">
                        现有整理思路
                      </summary>
                      <ol className="list-decimal space-y-2 border-t border-slate-200 px-8 py-3 text-sm leading-6 text-slate-600">
                        {example.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ol>
                    </details>
                  </>
                )}
                {index >= 0 && (
                  <Link
                    href={`/question/${encodeURIComponent(questions[index].id)}`}
                    className="mt-3 inline-block text-xs font-medium text-violet-700 hover:text-violet-900"
                  >
                    打开原题独立页与图面 →
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ExamRecord({
  record,
  question,
  selectedType,
}: {
  record: PlanningAnswerRecord;
  question?: Question;
  selectedType: ReviewType;
}) {
  if (record.pairingReference?.length) {
    return (
      <section
        id="pairing"
        className="scroll-mt-24 rounded-2xl border border-violet-200 bg-violet-50/40 p-5"
      >
        <div className="mb-4">
          <p className="text-xs font-semibold tracking-wide text-violet-700">
            2025 · 配对重点
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            20 组高频关联
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            先记概念，再用图像补充辨识。
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {record.pairingReference.map((pair) => (
            <details
              key={pair.group1.choice}
              className="group rounded-lg border border-violet-100 bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-800">
                <span>{pair.group1.answer}</span>
                <span className="text-violet-400 transition group-open:rotate-90">
                  ›
                </span>
              </summary>
              <div className="border-t border-violet-100 px-3 py-2 text-sm text-violet-800">
                ↔ {pair.group2.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    );
  }

  const segments = question
    ? questionSegments(question.content)
    : new Map<string, string>();
  const visibleItems = record.items.filter(
    (item) =>
      selectedType === "all" ||
      classifyType(
        `${segments.get(item.itemId.slice(item.itemId.lastIndexOf("#") + 1)) ?? ""} ${item.answer}`,
      ) === selectedType,
  );
  if (visibleItems.length === 0) return null;

  return (
    <section
      id={`year-${question?.year ?? record.questionId}`}
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white"
    >
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold tracking-wide text-emerald-700">
              {question?.year} · {question?.category} ·{" "}
              {question?.question_number}
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              过去问与答案
            </h2>
          </div>
          {question && (
            <Link
              href={`/question/${question.id}`}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
            >
              查看原题页 →
            </Link>
          )}
        </div>
        <p className="mt-2 text-sm text-slate-500">
          每一题下方直接显示对应答案；答案默认折叠。
        </p>
      </div>
      <div className="space-y-4 p-5">
        {visibleItems.map((item, itemIndex) => {
          const segmentKey = item.itemId.slice(
            item.itemId.lastIndexOf("#") + 1,
          );
          return (
            <AnswerRow
              key={item.itemId}
              item={item}
              number={itemIndex + 1}
              questionText={segments.get(segmentKey)}
              source={question ? {
                sourceQuestionId: question.id,
                sourceHref: `/planning-knowledge-map#planning-${item.itemId.replace(/[^a-zA-Z0-9_-]/g, "-")}`,
                sourceLabel: `${question.year} · 専門1 · ${question.question_number} · ${segmentKey.toUpperCase()}`,
                subject: "建筑计划",
                year: question.year,
                topicTags: [classifyType(`${segments.get(segmentKey) ?? ""} ${item.answer}`)],
                cognitiveTask: "在原题给定的设施、案例、制度或空间条件中判断对应答案。",
                answerBasis: `data/planning-exam-answers.json · ${record.fileName} · ${segmentKey}`,
              } : undefined}
            />
          );
        })}
      </div>
      {!!record.questionCards?.length && (
        <details className="border-t border-slate-100 px-5 py-3 text-sm text-slate-600">
          <summary className="cursor-pointer font-medium text-slate-700">
            关联 Anki 知识（{record.questionCards.length}）
          </summary>
          <p className="mt-2 text-xs leading-6 text-slate-500">
            {record.questionCards.join(" · ")}
          </p>
        </details>
      )}
    </section>
  );
}

export default function PlanningKnowledgeMapClient({
  questions,
  answerRecords,
}: Props) {
  const [year, setYear] = useState<number | "all">(2026);
  const [reviewType, setReviewType] = useState<ReviewType>("all");
  const [onlyNeedsPractice, setOnlyNeedsPractice] = useState(false);
  const studyRecords = useStudyRecords();
  const records = useMemo(
    () =>
      answerRecords.filter((record) => {
        if (record.pairingReference) return !onlyNeedsPractice && (year === "all" || year === 2025);
        const question = questions.find(
          (item) => item.fileName === record.fileName,
        );
          return Boolean(question) &&
          (year === "all" || question?.year === year) &&
          (!onlyNeedsPractice || record.items.some((item) => needsPractice(`planning:${item.itemId}`, studyRecords)));
      }),
    [answerRecords, questions, year, onlyNeedsPractice, studyRecords],
  );
  const years = useMemo(
    () =>
      [
        ...new Set(
          answerRecords
            .map(
              (record) =>
                questions.find((item) => item.fileName === record.fileName)
                  ?.year,
            )
            .filter(Boolean) as number[],
        ),
      ].sort((a, b) => b - a),
    [answerRecords, questions],
  );

  const yearFilters = (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => setYear("all")}
        className={`rounded px-2 py-1 text-xs ${year === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
      >
        全部
      </button>
      {years.map((value) => (
        <button
          key={value}
          onClick={() => setYear(value)}
          className={`rounded px-2 py-1 text-xs ${year === value ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
        >
          {value}
        </button>
      ))}
    </div>
  );
  const typeFilters = (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => setReviewType("all")}
        className={`rounded px-2 py-1 text-xs ${reviewType === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
      >
        全部
      </button>
      {REVIEW_TYPES.map((value) => (
        <button
          key={value}
          onClick={() => setReviewType(value)}
          className={`rounded px-2 py-1 text-xs ${reviewType === value ? "bg-violet-700 text-white" : "bg-violet-50 text-violet-700 hover:bg-violet-100"}`}
        >
          {value}
        </button>
      ))}
    </div>
  );

  const sidebar = (
    <div className="space-y-5 pt-1">
      <div>
        <p className="text-xs font-semibold tracking-wide text-slate-500">
          建筑计划复习总览
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          题目在前，答案折叠；Anki 作为答案依据。
        </p>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500">年份筛选</p>
        {yearFilters}
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500">类型筛选</p>
        {typeFilters}
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500">页面跳转</p>
        <div className="space-y-1 text-xs">
          <a
            href="#overview"
            className="block text-slate-600 hover:text-emerald-700"
          >
            复习重点
          </a>
          <a
            href="#essay-examples"
            className="block text-slate-600 hover:text-emerald-700"
          >
            2-2 论述示例
          </a>
          <a
            href="#past-exams"
            className="block text-slate-600 hover:text-emerald-700"
          >
            历年过去问
          </a>
          <a
            href="#pairing"
            className="block text-slate-600 hover:text-emerald-700"
          >
            2025 配对
          </a>
        </div>
      </div>
      <Link
        href="/planning-typology"
        className="block rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-800 hover:bg-violet-100"
      >
        平面类型与答题卡 →
      </Link>
    </div>
  );

  return (
    <SidebarLayout slot={sidebar}>
      <div className="min-h-full min-w-0 overflow-x-hidden bg-slate-50">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur">
          <Link
            href="/practice"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← 返回练习
          </Link>
        </header>
        <main className="mx-auto min-w-0 max-w-5xl space-y-8 px-5 py-8 sm:px-8">
          <section id="overview" className="scroll-mt-24">
            <p className="text-sm font-semibold text-emerald-700">
              建筑计划 · 复习大纲
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              知识地图与过去问答案
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              用主题建立框架，再直接核对历年题目。这里不替代
              Anki；卡片只作为答案的知识依据。
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900">高频知识框架</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {TOPICS.map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <h3 className="font-semibold text-slate-800">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section id="past-exams" className="scroll-mt-24">
            <div className="mb-3">
              <h2 className="text-xl font-bold text-slate-900">历年过去问</h2>
              <p className="mt-1 text-sm text-slate-500">
                下方专业 1 与专业 2-2 共用同一组年份和类型筛选；专业 2-2
                已排除数理题。
              </p>
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                <p className="mb-2 text-xs font-semibold text-slate-500">
                  选择年度
                </p>
                {yearFilters}
                <p className="mb-2 mt-3 text-xs font-semibold text-slate-500">
                  选择类型
                </p>
                {typeFilters}
                <div className="mt-3"><PracticeFilterToggle active={onlyNeedsPractice} onChange={setOnlyNeedsPractice} count={records.length} /></div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                专业 1 · 选择题与答案
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                选择题按上方年份与类型筛选；每一小题下方可展开答案。
              </p>
              <div className="mt-5 space-y-5">
                {records.map((record) => {
                  const index = questions.findIndex(
                    (item) => item.fileName === record.fileName,
                  );
                  return (
                    <ExamRecord
                      key={record.questionId}
                      record={record}
                      question={questions[index]}
                      selectedType={reviewType}
                    />
                  );
                })}
              </div>
            </div>
            <div className="mt-10">
              <EssayExamples
                questions={questions}
                year={year}
                reviewType={reviewType}
              />
            </div>
          </section>
        </main>
      </div>
    </SidebarLayout>
  );
}
