export type EnvironmentAnswerItem = {
  label: string;
  answer: string;
  note?: string;
  topics: string[];
  segmentKeys?: string[];
};

export type EnvironmentReviewRecord = {
  fileName: string;
  focus: string;
  answers: EnvironmentAnswerItem[];
  subAnswers?: EnvironmentAnswerItem[];
};

const numberedAnswers = (answers: string[], topics: string[] = []): EnvironmentAnswerItem[] => answers.map((answer, index) => ({
  label: `小問 ${String(index + 1).padStart(2, "0")}`,
  answer,
  topics,
  segmentKeys: [`s${String(index + 1).padStart(2, "0")}`],
}));

export const ENVIRONMENT_TOPICS = [
  "伝熱・放射",
  "換気・空気質",
  "採光・照明・色彩",
  "音響",
  "温熱・湿気",
  "日照・日射",
  "設備・省エネ",
] as const;

export const ENVIRONMENT_REVIEW_RECORDS: EnvironmentReviewRecord[] = [
  {
    fileName: "2013_専門1_建筑环境工学_Q4.md",
    focus: "基礎単位・定義・CO₂計算・日影",
    answers: [
      { label: "(1) マンセル", answer: "5YR 3.5/4 = 色相 5YR、明度 3.5、彩度 4。彩度 0 は無彩色、明度 0 は黒。", topics: ["採光・照明・色彩"] },
      { label: "(2) met / clo", answer: "1 met = 58.2 W/m²、1 clo = 0.155 m²·K/W。", topics: ["温熱・湿気"] },
      { label: "(3) 残響時間", answer: "音源停止後、音圧レベルが 60 dB 低下するまでの時間。音響エネルギー密度では初期値の 10⁻⁶。", topics: ["音響"] },
      { label: "(4) 必要換気量", answer: "Q = G/(Cᵢ−Cₒ) = 0.015/(0.001−0.0005) = 30 m³/h・人。", topics: ["換気・空気質"] },
      { label: "(5) 日影", answer: "終日日影は対象日に日の出から日没まで日影となる部分。永久日影は年間を通じて直射日光を受けない部分。", topics: ["日照・日射"] },
    ],
    subAnswers: [
      { label: "(1)", answer: "色相=5YR、明度=3.5、彩度=4。彩度0は無彩色、明度0は黒。", topics: ["採光・照明・色彩"], segmentKeys: ["s01"] },
      { label: "(2)", answer: "1 met=58.2 W/m²、1 clo=0.155 m²·K/W。", topics: ["温熱・湿気"], segmentKeys: ["s02"] },
      { label: "(3)", answer: "音源停止後、音圧レベルが60 dB低下するまでの時間。", topics: ["音響"], segmentKeys: ["s03"] },
      { label: "(4)", answer: "Q=0.015/(0.001−0.0005)=30 m³/(h・人)。", topics: ["換気・空気質"], segmentKeys: ["s04"] },
      { label: "(5)", answer: "終日日影は対象日の終日が日影、永久日影は年間を通じ直射日光を受けない部分。", topics: ["日照・日射"], segmentKeys: ["s05"] },
    ],
  },
  {
    fileName: "2014_専門1_建筑环境工学_Q2.md",
    focus: "○×で問う定義・方向・比例関係",
    answers: [
      { label: "伝熱・結露", answer: "風速が大きいほど表面熱伝達抵抗は小さい。密閉空気層は厚くすれば常に断熱が増すわけではなく、対流が始まる厚さでは注意。防湿層・高気密サッシは冬期の室内側を優先する。", topics: ["伝熱・放射", "温熱・湿気"] },
      { label: "換気", answer: "開口流量は一般に圧力差の平方根に比例。住宅の台所・浴室は第3種換気が基本。CO₂ 0.1% は代表管理値。", topics: ["換気・空気質"] },
      { label: "音響", answer: "音の強さは音圧実効値の2乗に比例。聞きたい音が他音で聞こえにくいのはマスキング。質量則では壁厚2倍で透過損失は約 +6 dB。じゅうたんは主に軽量床衝撃音に有効。", topics: ["音響"] },
      { label: "照明・設備", answer: "輝度の単位は cd/m²。北向き採光は安定した天空光を得やすい。室指数が大きいほど照明率は一般に大きい。圧縮式冷凍機は 圧縮→凝縮→膨張→蒸発。", topics: ["採光・照明・色彩", "設備・省エネ"] },
      { label: "給排水・電気", answer: "クロスコネクションは上水と他系統の誤接続。通気管の主目的は排水管内圧の調整。CEC は小さいほど省エネ。", topics: ["設備・省エネ"] },
    ],
    subAnswers: [
      { label: "01)", answer: "○。同じ絶対湿度なら、気温上昇で飽和水蒸気圧が増え相対湿度は低下する。", topics: ["温熱・湿気"], segmentKeys: ["s01"] },
      { label: "02)", answer: "○。南向き鉛直面は太陽高度の低い冬至に日射を受けやすい。", topics: ["日照・日射"], segmentKeys: ["s02"] },
      { label: "03)", answer: "×。風速が増すと表面熱伝達抵抗は小さくなる。", topics: ["伝熱・放射"], segmentKeys: ["s03"] },
      { label: "04)", answer: "×。空気層が厚すぎると対流が生じ、断熱性が単純に増えない。", topics: ["伝熱・放射"], segmentKeys: ["s04"] },
      { label: "05)", answer: "○。熱容量が大きいほど室温変動には時間遅れが生じる。", topics: ["温熱・湿気"], segmentKeys: ["s05"] },
      { label: "06)", answer: "×。冬季の気密性は室内側を高くする。", topics: ["温熱・湿気"], segmentKeys: ["s06"] },
      { label: "07)", answer: "○。CO₂ の代表的管理値は 0.1%（1000 ppm）。", topics: ["換気・空気質"], segmentKeys: ["s07"] },
      { label: "08)", answer: "×。喫煙の必要換気量は一酸化炭素基準の方が大きい。", topics: ["換気・空気質"], segmentKeys: ["s08"] },
      { label: "09)", answer: "×。開口換気量は圧力差の平方根に比例する。", topics: ["換気・空気質"], segmentKeys: ["s09"] },
      { label: "10)", answer: "○。酸素濃度低下で不完全燃焼・CO発生が増加する。", topics: ["換気・空気質"], segmentKeys: ["s10"] },
      { label: "11)", answer: "○。音の強さは音圧実効値の2乗に比例。", topics: ["音響"], segmentKeys: ["s11"] },
      { label: "12)", answer: "×。これはマスキング。カクテルパーティー効果は聞きたい音を選択して聞き取る現象。", topics: ["音響"], segmentKeys: ["s12"] },
      { label: "13)", answer: "×。同一材料で厚さ2倍なら質量則で約 +6 dB。", topics: ["音響"], segmentKeys: ["s13"] },
      { label: "14)", answer: "×。じゅうたんは主に軽量床衝撃音に有効。", topics: ["音響"], segmentKeys: ["s14"] },
      { label: "15)", answer: "○。多孔質吸音材は高音域で有効。", topics: ["音響"], segmentKeys: ["s15"] },
      { label: "16)", answer: "○。建物が高いほど4時間日影の範囲は広くなる。", topics: ["日照・日射"], segmentKeys: ["s16"] },
      { label: "17)", answer: "×。輝度は cd/m²、光度を見かけの面積で除す。", topics: ["採光・照明・色彩"], segmentKeys: ["s17"] },
      { label: "18)", answer: "○。北向き採光は安定した天空光を得やすい。", topics: ["採光・照明・色彩"], segmentKeys: ["s18"] },
      { label: "19)", answer: "○。室指数が大きいほど一般に照明率は大きい。", topics: ["採光・照明・色彩"], segmentKeys: ["s19"] },
      { label: "20)", answer: "○。色調は明度と彩度を合わせた属性。", topics: ["採光・照明・色彩"], segmentKeys: ["s20"] },
      { label: "21)", answer: "×。床放射暖房は上下温度差を小さくしやすい。", topics: ["温熱・湿気"], segmentKeys: ["s21"] },
      { label: "22)", answer: "×。説明はファンコイルユニット方式。", topics: ["設備・省エネ"], segmentKeys: ["s22"] },
      { label: "23)", answer: "○。圧縮→凝縮→膨張→蒸発の冷凍サイクル。", topics: ["設備・省エネ"], segmentKeys: ["s23"] },
      { label: "24)", answer: "○。住宅の台所・浴室では第3種換気が一般的。", topics: ["換気・空気質"], segmentKeys: ["s24"] },
      { label: "25)", answer: "×。高い静圧を得やすいのは遠心送風機。", topics: ["設備・省エネ"], segmentKeys: ["s25"] },
      { label: "26)", answer: "○。上水と他系統を誤接続するのがクロスコネクション。", topics: ["設備・省エネ"], segmentKeys: ["s26"] },
      { label: "27)", answer: "×。通気管の主目的は排水管内圧の調整。", topics: ["設備・省エネ"], segmentKeys: ["s27"] },
      { label: "28)", answer: "○。CEC は小さいほど省エネルギー性能が高い。", topics: ["設備・省エネ"], segmentKeys: ["s28"] },
      { label: "29)", answer: "○。屋外用キュービクルは屋外設置できる。", topics: ["設備・省エネ"], segmentKeys: ["s29"] },
      { label: "30)", answer: "○。エレベーター計画ではピーク15分間輸送能力を用いる。", topics: ["設備・省エネ"], segmentKeys: ["s30"] },
    ],
  },
  {
    fileName: "2015_専門1_建筑环境工学_Q4.md",
    focus: "選択式の基本用語と設備指標",
    answers: [
      { label: "温熱・伝熱", answer: "熱的中立に近い温冷感の指標は PMV。Q値は貫流熱損失＋換気熱損失を床面積で除す。単一壁の定常伝導熱量は厚さに反比例。", topics: ["温熱・湿気", "伝熱・放射"] },
      { label: "換気・空調", answer: "CO₂ 基準は 1,000 ppm。空気齢は大きいほど新鮮外気が届きにくい。温度差換気の圧力差ゼロ点は中性帯。負荷に応じ送風量を変えるのは VAV。", topics: ["換気・空気質", "設備・省エネ"] },
      { label: "光・日射", answer: "配光曲線は光度分布。蛍光灯は代表的に約100 lm/W。北緯35°では冬至の南鉛直面の日射が大きい。", topics: ["採光・照明・色彩", "日照・日射"] },
      { label: "音響", answer: "感覚量が刺激の対数に比例するのは Weber–Fechner の法則。等音圧なら1000 Hzの方が100 Hzより大きく感じやすい。質量則は周波数と面密度で決まる。", topics: ["音響"] },
      { label: "設備・評価", answer: "ダブルトラップは排水阻害となる。CASBEE は総合環境性能評価、BEMS は運用支援、APF は大きいほど高効率。", topics: ["設備・省エネ"] },
    ],
    subAnswers: [
      { label: "(1)", answer: "PMV（イ）。人体の熱負荷から温冷感を予測する指標。", topics: ["温熱・湿気"], segmentKeys: ["s01"] },
      { label: "(2)", answer: "①+②（ア）。Q値は貫流熱損失と換気熱損失の合計を床面積で除す。", topics: ["伝熱・放射"], segmentKeys: ["s02"] },
      { label: "(3)", answer: "1/2倍（イ）。定常伝導熱量は壁厚に反比例する。", topics: ["伝熱・放射"], segmentKeys: ["s03"] },
      { label: "(4)", answer: "1000 ppm（オ）。", topics: ["換気・空気質"], segmentKeys: ["s04"] },
      { label: "(5)", answer: "空気齢（イ）。値が大きいほど新鮮外気が届きにくい。", topics: ["換気・空気質"], segmentKeys: ["s05"] },
      { label: "(6)", answer: "中性帯（エ）。内外圧力差がゼロとなる高さ。", topics: ["換気・空気質"], segmentKeys: ["s06"] },
      { label: "(7)", answer: "VAV（イ）。負荷に応じ主に送風量を変える。", topics: ["設備・省エネ"], segmentKeys: ["s07"] },
      { label: "(8)", answer: "明るい（ア）。色相・彩度は同じで、明度 7 の方が 6 より高い。", topics: ["採光・照明・色彩"], segmentKeys: ["s08"] },
      { label: "(9)", answer: "光度（ウ）。配光曲線は各方向への光度分布。", topics: ["採光・照明・色彩"], segmentKeys: ["s09"] },
      { label: "(10)", answer: "100 lm/W 程度（エ）。", topics: ["採光・照明・色彩"], segmentKeys: ["s10"] },
      { label: "(11)", answer: "③＞②＞④＞①（エ）。北緯35°では冬至の南鉛直面の日射が大きい。", topics: ["日照・日射"], segmentKeys: ["s11"] },
      { label: "(12)", answer: "ウェーバー・フェヒナーの法則（エ）。感覚量は刺激量の対数に比例。", topics: ["音響"], segmentKeys: ["s12"] },
      { label: "(13)", answer: "1000 Hz の方がより大きく感じる（イ）。", topics: ["音響"], segmentKeys: ["s13"] },
      { label: "(14)", answer: "入射音の周波数と面密度（オ）。質量則による。", topics: ["音響"], segmentKeys: ["s14"] },
      { label: "(15)", answer: "ダブルトラップ（エ）。排水の流れを阻害する。", topics: ["設備・省エネ"], segmentKeys: ["s15"] },
      { label: "(16)", answer: "排水管（ウ）。勾配が必要で、床下空間の制約となりやすい。", topics: ["設備・省エネ"], segmentKeys: ["s16"] },
      { label: "(17)", answer: "55 ℃（ウ）。レジオネラ対策と効率の両面からの基準値。", topics: ["設備・省エネ"], segmentKeys: ["s17"] },
      { label: "(18)", answer: "CASBEE（ア）。日本で開発された建築環境性能評価。", topics: ["設備・省エネ"], segmentKeys: ["s18"] },
      { label: "(19)", answer: "BEMS（イ）。設備の省エネ制御・運用支援を行う。", topics: ["設備・省エネ"], segmentKeys: ["s19"] },
      { label: "(20)", answer: "APF（オ）。通年エネルギー消費効率。", topics: ["設備・省エネ"], segmentKeys: ["s20"] },
    ],
  },
  {
    fileName: "2016_専門1_建筑环境工学_Q3.md",
    focus: "比例関係とオフィス環境基準",
    answers: [
      { label: "比例関係", answer: "熱伝導抵抗∝1/λ、黒体放射∝T⁴、必要換気量∝1/ΔC、残響時間∝室容積、点音源の音圧∝1/r、均等拡散面の照度∝輝度、動圧・ダクト損失はおおむね風速²。", topics: ["伝熱・放射", "換気・空気質", "採光・照明・色彩", "音響"] },
      { label: "オフィス基準", answer: "粉じんは 0.15 g/m³ ではなく 0.15 mg/m³。換気量は人当たり 10 m³/h では不足。温度・湿度・気流・照度・需要率は現行基準と設問条件を照合する。", topics: ["換気・空気質", "設備・省エネ"] },
      { label: "用語", answer: "都市部が高温となるのはヒートアイランド。温熱6要素の人体側は代謝量と着衣量。上昇気流による換気は煙突効果。単層壁の特定周波数での遮音低下はコインシデンス効果。", topics: ["温熱・湿気", "換気・空気質", "音響"] },
    ],
    subAnswers: numberedAnswers([
      "−1（熱伝導比抵抗は熱伝導率に反比例）。", "4（黒体放射は絶対温度の4乗）。", "−1（必要換気量は濃度差に反比例）。", "0（温度差換気量は温度差の平方根に比例）。", "1（残響時間は室容積に比例）。", "−1（点音源の音圧は距離に反比例）。", "1（均等拡散面では照度と輝度は比例）。", "0（マンセル明度と反射率は単純なべき関係でない）。", "2（ダクト摩擦損失は概ね風速の2乗）。", "1（有効電力は力率に比例）。",
      "○。27℃・55%は管理基準範囲。", "○。気流0.3m/s以下は基準範囲。", "×。粉じん基準は0.15 g/m³でなく0.15 mg/m³。", "×。低音対策にローパーティションは有効でない。", "○。壁面はやや低明度・低彩度が望ましい。", "○。机上作業では鉛直面照度を高くする。", "×。10 m³/h・人は不足。", "×。エアフローウィンドーでもペリメーター空調は必要。", "○。100 L/日・人は計画値として妥当。", "×。需要率20%は低すぎる。",
      "ヒートアイランド。", "着衣量。", "煙突効果。", "マスキング効果。", "コインシデンス効果。", "等時間日影線。", "COP。", "全熱交換器。", "雑排水。", "燃料電池。",
    ]),
  },
  {
    fileName: "2017_専門1_建筑环境工学_Q4.md",
    focus: "指数減衰を一つの式で横断する",
    answers: [
      { label: "微分方程式", answer: "−dP/dt = kP、一般解 P = Ce⁻ᵏᵗ。", topics: ["換気・空気質"] },
      { label: "光・残響", answer: "ガラス厚を t₀ から 2t₀ にすると透過率比は e⁻ᵏᵗ⁰。残響の名称は Sabine（または条件により Eyring）の残響式。", topics: ["採光・照明・色彩", "音響"] },
      { label: "換気", answer: "定常温度差 ΔT = q/(ρcₚQ)。発生のない汚染物濃度を e⁻² にする時間は t = 2V/Q。", topics: ["換気・空気質", "温熱・湿気"] },
    ],
    subAnswers: [
      { label: "(1)", answer: "−dP/dt=kP。", topics: ["換気・空気質"], segmentKeys: ["s01"] },
      { label: "(2)", answer: "P=Ce⁻ᵏᵗ。", topics: ["換気・空気質"], segmentKeys: ["s02"] },
      { label: "(3)", answer: "透過光の比は e⁻ᵏᵗ⁰。", topics: ["採光・照明・色彩"], segmentKeys: ["s03"] },
      { label: "(4)", answer: "Sabine の残響式。", topics: ["音響"], segmentKeys: ["s04"] },
      { label: "(5)", answer: "ΔT=q/(ρCpQ)。", topics: ["換気・空気質"], segmentKeys: ["s05"] },
      { label: "(6)", answer: "t=2V/Q。", topics: ["換気・空気質"], segmentKeys: ["s06"] },
    ],
  },
  {
    fileName: "2018_専門1_建筑环境工学_Q2.md",
    focus: "計算の基本形",
    answers: [
      { label: "照明・音響", answer: "点光源直下照度 E=I/r² より 25 lx。音圧1.2倍のレベル差は 20log₁₀1.2 ≈ +1.6 dB。", topics: ["採光・照明・色彩", "音響"] },
      { label: "伝熱", answer: "R=1/10+0.18/1.5+1/10=0.32、q=15/0.32≈46.9 W/m²。", topics: ["伝熱・放射"] },
      { label: "温熱・換気", answer: "温熱環境4要素は空気温度・湿度・気流速度・平均放射温度。CO₂は Q=G/(Cᵢ−Cₒ) を使う。風力換気は Cp差からΔpを出し、有効開口面積と組み合わせる。", topics: ["温熱・湿気", "換気・空気質"] },
    ],
    subAnswers: [
      { label: "(1)", answer: "E=I/r²=100/2²=25 lx。", topics: ["採光・照明・色彩"], segmentKeys: ["s01"] },
      { label: "(2)", answer: "20log₁₀1.2≈+1.6 dB。", topics: ["音響"], segmentKeys: ["s02"] },
      { label: "(3)", answer: "R=1/10+0.18/1.5+1/10=0.32、q=15/0.32≈46.9 W/m²。", topics: ["伝熱・放射"], segmentKeys: ["s03"] },
      { label: "(4)", answer: "空気温度、相対湿度、気流速度、平均放射温度。", topics: ["温熱・湿気"], segmentKeys: ["s04"] },
      { label: "(5)", answer: "Δp=0.5×1.2×4²×(0.6−(−0.4))=9.6 Pa。有効面積0.707 m²よりQ≈2.8 m³/s。", topics: ["換気・空気質"], segmentKeys: ["s05"] },
      { label: "(6)", answer: "Q=4×0.02/(0.001−0.0004)=約133 m³/h。", topics: ["換気・空気質"], segmentKeys: ["s06"] },
    ],
  },
  {
    fileName: "2019_専門1_建筑环境工学_Q2.md",
    focus: "判断問題と湿り空気",
    answers: [
      { label: "視覚・換気", answer: "暗所で視感度ピークが短波長側に移るのは Purkinje 現象。高空気質室は正圧。空気余命が小さいほど排気へ到達しやすい。直列開口では小さい開口の拡大が有効。", topics: ["採光・照明・色彩", "換気・空気質"] },
      { label: "伝熱・湿気", answer: "表面抵抗を含むためU値は壁厚に単純反比例しない。冬期の防湿層は断熱材の室内側。作用温度は湿度を直接含まず、空気温度・平均放射温度・気流の影響を受ける。露点は乾球30℃・RH50%で約18℃。", topics: ["伝熱・放射", "温熱・湿気"] },
      { label: "音響・設備", answer: "同強度の2音の合成は+3 dB。室温と等価温冷感を与える仮想環境温度はET。水撃はウォーターハンマー、発電排熱利用はコージェネレーション。", topics: ["音響", "設備・省エネ"] },
    ],
    subAnswers: [
      { label: "1)", answer: "×。感覚量は刺激量の対数に比例する。", topics: ["音響"], segmentKeys: ["s01"] },
      { label: "2)", answer: "○。暗所では短波長側へ視感度ピークが移る（Purkinje現象）。", topics: ["採光・照明・色彩"], segmentKeys: ["s02"] },
      { label: "3)", answer: "○。明度8は明度4より明るい。", topics: ["採光・照明・色彩"], segmentKeys: ["s03"] },
      { label: "4)", answer: "○。高空気質室は正圧で外部からの汚染流入を抑える。", topics: ["換気・空気質"], segmentKeys: ["s04"] },
      { label: "5)", answer: "○。空気余命が小さいほど排気まで早く、新鮮空気が届きやすい。", topics: ["換気・空気質"], segmentKeys: ["s05"] },
      { label: "6)", answer: "○。同条件なら自然換気量は風速に比例する。", topics: ["換気・空気質"], segmentKeys: ["s06"] },
      { label: "7)", answer: "×。直列開口では小さいBを大きくする方が有効。", topics: ["換気・空気質"], segmentKeys: ["s07"] },
      { label: "8)", answer: "○。表面抵抗も含むためU値は厚さの単純な逆比例より大きい。", topics: ["伝熱・放射"], segmentKeys: ["s08"] },
      { label: "9)", answer: "×。冬季の防湿層は断熱材の室内側。", topics: ["温熱・湿気"], segmentKeys: ["s09"] },
      { label: "10)", answer: "×。作用温度は湿度を直接の要素に含まない。", topics: ["温熱・湿気"], segmentKeys: ["s10"] },
      { label: "(2)-1", answer: "4。Stefan–Boltzmann則。", topics: ["伝熱・放射"], segmentKeys: ["s11"] },
      { label: "(2)-2", answer: "約18 ℃。", topics: ["温熱・湿気"], segmentKeys: ["s12"] },
      { label: "(2)-3", answer: "60 dB。等ラウドネス曲線による。", topics: ["音響"], segmentKeys: ["s13"] },
      { label: "(2)-4", answer: "+3 dB。", topics: ["音響"], segmentKeys: ["s14"] },
      { label: "(2)-5", answer: "2乗。", topics: ["設備・省エネ"], segmentKeys: ["s15"] },
      { label: "(3)-1", answer: "ET（有効温度）。", topics: ["温熱・湿気"], segmentKeys: ["s16"] },
      { label: "(3)-2", answer: "コインシデンス効果。", topics: ["音響"], segmentKeys: ["s17"] },
      { label: "(3)-3", answer: "エンタルピー。", topics: ["温熱・湿気"], segmentKeys: ["s18"] },
      { label: "(3)-4", answer: "ウォーターハンマー（水撃）。", topics: ["設備・省エネ"], segmentKeys: ["s19"] },
      { label: "(3)-5", answer: "コージェネレーション。", topics: ["設備・省エネ"], segmentKeys: ["s20"] },
    ],
  },
  {
    fileName: "2020_専門1_建筑环境工学_Q2.md",
    focus: "最新基準を含む○×と計算",
    answers: [
      { label: "正誤の軸", answer: "UAは外皮総熱損失/外皮総面積。SC値は小さいほど遮蔽効果が高い。温度差換気は高低差が大きいほど増える。暗順応は明順応より長い。COPは大きいほど高効率。", topics: ["伝熱・放射", "換気・空気質", "採光・照明・色彩", "設備・省エネ"] },
      { label: "計算", answer: "U=1/(1/9+0.15/1.5+1/23)≈3.9 W/(m²·K)。CO₂必要換気量は 60/(0.001−0.0004)=100 m³/h。昼光率5%×5000 lx=250 lx。質量則で厚さ2倍は+6 dB。", topics: ["伝熱・放射", "換気・空気質", "採光・照明・色彩", "音響"] },
      { label: "温熱6要素", answer: "環境側：空気温度・相対湿度・気流速度・平均放射温度。人体側：代謝量・着衣量。", topics: ["温熱・湿気"] },
    ],
    subAnswers: numberedAnswers([
      "×。UAは外皮総熱損失を外皮面積で除す。", "○。", "×。SCは小さいほど遮蔽効果が高い。", "×。防湿層は室内側。", "○。", "×。高低差が大きいほど増える。", "○。", "○。", "○。", "×。これは光束、光度の単位はcd。", "○。", "○。", "○。", "×。A特性は低音を補正し高音優勢では概ね同程度。", "×。COPは大きいほど高効率。", "×。ダブルトラップは排水阻害。", "×。LEDは一般に100 lm/W以上も多い。", "○。", "×。削減値の組合せが不適切。", "×。現行基準は一次エネルギー換算。",
      "空気温度・相対湿度・気流速度・平均放射温度・代謝量・着衣量。", "約3.9 W/(m²·K)。", "100 m³/h。", "250 lx。", "6 dB。",
    ]),
  },
  {
    fileName: "2022_専門1_建筑环境工学_Q2.md",
    focus: "現象名と式の意味",
    answers: [
      { label: "語群", answer: "レンジフード=局所換気、窓結露=露点温度、熱と水蒸気の相似=Lewisの関係、縮流部の静圧低下=Bernoulli、粗いダクト=Moody線図、音の回り込み=回折、高層の冬期流入=煙突効果。", topics: ["換気・空気質", "温熱・湿気", "音響"] },
      { label: "式", answer: "相対湿度=100f/fₛ、動圧=ρv²/2、伝導熱流束=λΔθ/δ、音圧レベル=20log₁₀(p/p₀)、黒体放射=σT⁴、点音源強度=W/(4πr²)。", topics: ["伝熱・放射", "換気・空気質", "音響"] },
    ],
    subAnswers: numberedAnswers([
      "局所換気。", "露点温度。", "ルイスの関係。", "ベルヌーイの定理。", "ムーディ線図。", "形態係数。", "回折。", "煙突効果。", "セービンの式。", "カクテルパーティー効果。", "ピストンフロー。", "ブーガの式。", "代謝量。", "ウェーバー・フェヒナーの法則。", "ウィーンの変位則。", "熱電対。",
      "相対湿度、Y=100。", "動圧、Y=2。", "伝導熱流束、Y=−1。", "音圧レベル、Y=20。", "放射熱流束、Y=4。", "音響インテンシティ、Y=−2。",
    ]),
  },
  {
    fileName: "2023_専門1_建筑环境工学_Q問題2.md",
    focus: "CO₂・遮音・表面温度・配管現象",
    answers: [
      { label: "計算", answer: "CO₂定常値=400 ppm+0.02/30=約1067 ppm。隣室音圧は R=L₁−L₂+10log(S/A₂) を変形して求める。点光源照度は150/3²≈16.7 lx。", topics: ["換気・空気質", "音響", "採光・照明・色彩"] },
      { label: "伝熱・設備", answer: "壁体は総熱抵抗→熱流→両表面温度の順。ウォーターハンマーは流速急変の圧力波、キャビテーションは低圧部の気泡発生・崩壊。", topics: ["伝熱・放射", "設備・省エネ"] },
    ],
    subAnswers: numberedAnswers(["約1067 ppm。", "隣室音圧レベルは50 dB。", "屋外側約2.9℃、室内側約17.1℃。", "約16.7 lx。", "水撃=流速急変による圧力波、キャビテーション=低圧部の気泡発生・崩壊。"]),
  },
  {
    fileName: "2024_専門1_建筑环境工学_Q2.md",
    focus: "複合計算と誤文修正",
    answers: [
      { label: "計算", answer: "光束法：E=(20台×2灯×3000×0.65×0.7)/100=546 lx。5dBの独立音源4個は11dB。平行面放射は絶対温度を使う。CO₂は Q=nV=500 m³/h、C=400 ppm+0.16/500=720 ppm。", topics: ["採光・照明・色彩", "音響", "伝熱・放射", "換気・空気質"] },
      { label: "誤文の典型", answer: "Purkinje現象、加法混色=RGB、室モードとフラッターエコーは別、永久日影と終日日影は別、露点温度は湿球温度ではない、PMVの放射要素は大気圧ではなく平均放射温度。", topics: ["採光・照明・色彩", "音響", "日照・日射", "温熱・湿気"] },
      { label: "制度値", answer: "F☆☆☆☆は発散速度0.005 mg/(m²·h)以下で面積制限なし。第二種換気は正圧。", topics: ["換気・空気質", "設備・省エネ"] },
    ],
    subAnswers: numberedAnswers(["546 lx。", "11 dB。", "64 W/m²。", "約38 W/m²。", "約4.5 m³/s。", "720 ppm。", "Purkinje現象。", "○。", "×。加法混色の三原色はRGB。", "○。", "○。", "×。これは室モード。", "×。これは終日日影。", "○。", "○。", "×。水蒸気が飽和する温度は露点温度。", "○。", "×。F☆☆☆☆は0.005 mg/(m²·h)以下。", "×。PMVの放射要素は平均放射温度。", "×。これは雨温図。", "○。"]),
  },
  {
    fileName: "2025_専門1_建筑环境工学_Q2.md",
    focus: "指標の定義と多層壁",
    answers: [
      { label: "音響・測光", answer: "Wとrをともに2倍にするとIは1/2、pは1/√2、Lpは3 dB低下して57 dB。測光量の順序は光束→照度／光束発散度／光度→輝度。", topics: ["音響", "採光・照明・色彩"] },
      { label: "伝熱・換気", answer: "RC150mm壁のU≈4.62、室内側にGW50mm追加でU≈0.79 W/(m²·K)、面積50m²・温度差20Kなら熱貫流量≈790 W。CO₂必要換気量は0.018/0.0006=30 m³/(h・人)。", topics: ["伝熱・放射", "換気・空気質"] },
      { label: "換気方式", answer: "第一種=給気・排気とも送風機、熱交換器。第二種=給気のみ送風機で正圧、手術室等。第三種=排気のみ送風機で負圧、トイレ等。", topics: ["換気・空気質"] },
    ],
    subAnswers: numberedAnswers(["a=W₀/(4πr²)、b=0.5、c=2、d=1/√2、e=3、f=57 dB。", "g=光束、h=照度、i=光束発散度、j=光度、k=輝度。", "n≈4.62、o≈0.79 W/(m²·K)、p≈790 W。", "q=30 m³/(h・人)。", "第1種: 給気・排気を送風機、熱交換機。第2種:給気のみ・正圧・手術室。第3種:排気のみ・負圧・トイレ。"]),
  },
  {
    fileName: "2026_専門1_建筑环境工学_Q2.md",
    focus: "数値感覚・単位・基準値",
    answers: [
      { label: "選択の核", answer: "大気CO₂≈0.04%、空気/普通コンクリートの熱伝導率比≈0.01、Kirchhoffより吸収率0.8なら放射率0.8、立位リラックスは約1.2 met。", topics: ["伝熱・放射", "温熱・湿気"] },
      { label: "音・光", answer: "残響時間後の音響エネルギー密度は10⁻⁶。3 octave上は周波数8倍。主として住居地域の夜間騒音基準は45 dB。900nmは可視域外で比視感度0。", topics: ["音響", "採光・照明・色彩"] },
      { label: "透過・流体", answer: "同一ガラス2枚の総合透過率はτ²/(1−ρ²)。面積半減で流速2倍、動圧は4倍；水・初速2m/sなら動圧変化は6kPa。", topics: ["採光・照明・色彩", "換気・空気質"] },
    ],
    subAnswers: [
      { label: "(1)", answer: "大気中の CO₂ 濃度は約 0.04%（400 ppm）。", topics: ["換気・空気質"], segmentKeys: ["s01"] },
      { label: "(2)", answer: "空気／普通コンクリートの熱伝導率比は約 0.01。", topics: ["伝熱・放射"], segmentKeys: ["s02"] },
      { label: "(3)", answer: "Kirchhoff の法則より、吸収率 0.8 なら放射率も 0.8。", topics: ["伝熱・放射"], segmentKeys: ["s03"] },
      { label: "(4)", answer: "立位でリラックスした成人男性は約 1.2 met。", topics: ["温熱・湿気"], segmentKeys: ["s04"] },
      { label: "(5)", answer: "残響時間後の音響エネルギー密度は初期値の 10⁻⁶。", topics: ["音響"], segmentKeys: ["s05"] },
      { label: "(6)", answer: "3 octave 上では周波数は 2³ = 8 倍。", topics: ["音響"], segmentKeys: ["s06"] },
      { label: "(7)", answer: "主として住居の用に供される地域の夜間騒音基準は 45 dB。", topics: ["音響"], segmentKeys: ["s07"] },
      { label: "(8)", answer: "900 nm は可視域外なので比視感度は 0。", topics: ["採光・照明・色彩"], segmentKeys: ["s08"] },
      { label: "(9)", answer: "単板の透過率は τ=1−0.1−0.2=0.7。総合透過率は τ²/(1−ρ²)=0.49/0.96≈0.51、したがって⑤。", topics: ["採光・照明・色彩"], segmentKeys: ["s09"] },
      { label: "(10)", answer: "断面積半減で流速は 2 倍、動圧は 4 倍。水・初速 2 m/s なら動圧変化は 6 kPa。", topics: ["換気・空気質"], segmentKeys: ["s10"] },
    ],
  },
];
