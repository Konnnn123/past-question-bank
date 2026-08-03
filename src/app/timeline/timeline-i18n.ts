export type TimelineLanguage = "ja" | "zh" | "en";

export const UI = {
  ja: { title: "建築史タイムライン", back: "探索に戻る", timeline: "時代軸", both: "日欧", western: "西洋", japan: "日本", exam: "過去問", previous: "前へ", next: "次へ", social: "社会", architecture: "建築", comparison: "地域比較", overview: "時代の概要", noSelection: "時代を選択してください", noBuildings: "該当する建築データはありません", buildings: "代表建築", details: "詳細", notes: "資料注", imageUnavailable: "画像なし" },
  zh: { title: "建筑史时间轴", back: "返回探索", timeline: "时代轴", both: "日欧", western: "西洋", japan: "日本", exam: "真题", previous: "上一项", next: "下一项", social: "社会", architecture: "建筑", comparison: "地区比较", overview: "时代概览", noSelection: "请选择时代", noBuildings: "没有对应的建筑数据", buildings: "代表建筑", details: "详情", notes: "资料注释", imageUnavailable: "暂无图像" },
  en: { title: "Architectural History Timeline", back: "Back to Explore", timeline: "Timeline", both: "Both", western: "Western", japan: "Japan", exam: "Exam questions", previous: "Previous", next: "Next", social: "Society", architecture: "Architecture", comparison: "Regional comparison", overview: "Era overview", noSelection: "Select an era", noBuildings: "No building records are available for this region.", buildings: "Representative buildings", details: "Details", notes: "Notes", imageUnavailable: "Image unavailable" },
} as const;

export function pick<T extends { ja: string; zh: string; en: string }>(lang: TimelineLanguage, value: T) {
  return value[lang];
}
