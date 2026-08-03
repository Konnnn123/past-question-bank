"""Add reviewed, genuinely missing building entities from the past-exam triage."""
from __future__ import annotations
import hashlib, json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARCH = ROOT / "data" / "architecture-normalized-candidates.json"

def e(name, aliases, period, location, styles, types, history, *, structure="", space="", frequency=1):
    return {"name": name, "aliases": aliases, "period": period, "location": location,
      "styleIds": styles, "typeIds": types, "history": history, "structure": structure,
      "space": space, "examFrequency": frequency}

ADDITIONS = [
 e("カサ・ミラ", ["Casa Milà", "ラ・ペドレラ"], "1906–1912年", "スペイン・バルセロナ", ["movement-art-nouveau"], ["type-aristocratic-residence"], "アントニ・ガウディがペレ・ミラ夫妻のために設計した集合住宅。波打つ石造ファサード、自由度の高い平面、屋上の換気塔と煙突群で知られる。", structure="石造の外壁を自立的な骨組とし、内部は鉄骨柱・梁によって間仕切りの自由度を確保する。", space="中庭を核に住戸を配置し、屋上を彫刻的な換気塔・階段室の景観として構成する。", frequency=2),
 e("アンコール・ワット", ["Angkor Wat"], "12世紀前半", "カンボジア・シェムリアップ", [], ["type-buddhist-temple"], "スーリヤヴァルマン2世が国家寺院として造営した大規模寺院。ヒンドゥー教ヴィシュヌ神に献じられ、後に仏教寺院として継承された。"),
 e("アーヘン宮廷礼拝堂", ["エクス・ラ・シャペル", "Aachen Palatine Chapel", "アーヘン大聖堂八角堂"], "8世紀末〜9世紀初頭", "ドイツ・アーヘン", ["style-carolingian"], ["type-church"], "カール大帝の宮廷礼拝堂として造営され、アーヘン大聖堂の核となった。八角形の集中式平面とドームをもち、カロリング朝ルネサンスを代表する。"),
 e("オックスフォード大学自然史博物館", ["オックスフォード自然史博物館", "Oxford University Museum of Natural History"], "1854–1860年", "イギリス・オックスフォード", ["style-historicism"], ["type-museum-library"], "トマス・ニューナム・ディーンとベンジャミン・ウッドワードの設計によるヴィクトリア朝のゴシック・リヴァイヴァル建築。科学教育・展示のための中庭型博物館として計画された。"),
 e("サンスーシ宮殿", ["Sanssouci Palace"], "1745–1747年", "ドイツ・ポツダム", ["style-rococo"], ["type-aristocratic-residence"], "プロイセン王フリードリヒ2世の夏の離宮。クノーベルスドルフが設計し、段状のブドウ畑に面する一層のロココ宮殿として知られる。"),
 e("サンティーヴォ・アッラ・サピエンツァ聖堂", ["サンティーヴォ・アッラ・サピエンツァ", "Sant'Ivo alla Sapienza"], "1642–1660年", "イタリア・ローマ", ["style-baroque"], ["type-church"], "フランチェスコ・ボッロミーニ設計。星形・凹凸を組み合わせた集中式平面と、螺旋状のランタンをもつローマ・バロックの代表作。"),
 e("テンピオ・マラテスティアーノ聖堂", ["Tempio Malatestiano", "サン・フランチェスコ聖堂（リミニ）"], "15世紀", "イタリア・リミニ", ["style-renaissance"], ["type-church"], "既存のフランチェスコ会聖堂を、シジスモンド・マラテスタがレオン・バッティスタ・アルベルティに依頼して改装した。古代ローマ凱旋門を想起させるファサードが特徴。"),
 e("ラウレンツィアーナ図書館", ["ラウンレンツィアーナ図書館", "Laurentian Library"], "1524年以降", "イタリア・フィレンツェ", ["style-mannerism"], ["type-museum-library"], "メディチ家の写本図書館としてミケランジェロが設計。前室の劇的な階段と、古典要素を緊張させた壁面構成はマニエリスムを代表する。"),
 e("リヴァプール大聖堂", ["Liverpool Cathedral"], "1904–1978年", "イギリス・リヴァプール", ["style-historicism"], ["type-church"], "ジャイルズ・ギルバート・スコットの設計による大規模な英国国教会大聖堂。20世紀に建設されたゴシック・リヴァイヴァルの代表例。"),
 e("ヴィラ・マダマ", ["Villa Madama"], "1520年代", "イタリア・ローマ", ["style-renaissance"], ["type-aristocratic-residence"], "ラファエロが教皇レオ10世のために構想し、ジュリオ・ロマーノらが工事を継続した郊外ヴィラ。古代ローマの浴場・別荘を参照した建築として重要。"),
 e("今西家住宅", ["今西家書院"], "江戸時代", "日本・奈良県橿原市今井町", [], ["type-machiya"], "今井町に残る近世町家。商業・居住を一体化した町家の構成と、寺内町・環濠集落の歴史的環境を理解する事例。"),
 e("国立西洋美術館", ["国立西洋美術館本館", "National Museum of Western Art"], "1959年", "日本・東京", ["style-international"], ["type-museum-library"], "ル・コルビュジエが設計した日本唯一の実作。ピロティ、自由な平面、モデュロールを用い、無限成長美術館の構想を実現した。", structure="鉄筋コンクリート造。ピロティで主展示階を持ち上げ、中央吹抜けを核に増築可能な構成を採る。", space="中央の吹抜けと回遊動線をもつ展示空間。外周へ拡張できる「無限成長美術館」の原理を採用する。"),
 e("延暦寺根本中堂", ["根本中堂", "比叡山延暦寺根本中堂"], "江戸時代前期（現存建物）", "日本・滋賀県大津市", ["style-wayo"], ["type-buddhist-temple"], "天台宗総本山・延暦寺の中心堂。現存建物は織田信長の焼き討ち後に再建されたもので、内陣・外陣・礼堂を段差で構成する。"),
 e("建長寺仏殿", ["建長寺佛殿", "建長寺大仏殿"], "江戸時代（現存建物）", "日本・神奈川県鎌倉市", ["style-zenshuyo"], ["type-buddhist-temple"], "建長寺の中心的仏殿。現存建物は近世に他寺から移築されたもので、禅宗寺院の仏殿空間と伽藍軸線を学ぶ事例となる。"),
 e("日向別邸", ["旧日向別邸", "旧日向家熱海別邸"], "1936年", "日本・静岡県熱海市", ["movement-modernism"], ["type-aristocratic-residence"], "実業家・日向利兵衛の別邸。地下の洋間をブルーノ・タウトが設計し、桂離宮など日本建築への理解を近代的な室内へ展開した。"),
 e("明王院本堂", ["明王院本堂（福山）"], "1321年", "日本・広島県福山市", ["style-wayo"], ["type-buddhist-temple"], "福山の明王院に残る中世仏堂。五間堂の和様建築として知られ、蓮華王院本堂とは別の建築である。"),
 e("江戸城天守", ["江戸城天守閣"], "17世紀（1657年焼失）", "日本・東京", [], ["type-castle"], "江戸城本丸に建てられた五重の天守。徳川幕府の権威を示したが、明暦の大火で焼失し再建されなかった。"),
 e("法隆寺伝法堂", ["伝法堂"], "奈良時代", "日本・奈良県斑鳩町", ["style-hakuho"], ["type-buddhist-temple"], "橘夫人の邸宅を移築・改造したと伝わる法隆寺東院の堂。住宅建築を仏堂へ転用した構成を示す重要な遺構。"),
 e("當麻寺曼荼羅堂", ["當麻寺本堂", "当麻寺曼荼羅堂", "当麻寺本堂"], "平安時代後期", "日本・奈良県葛城市", ["style-wayo"], ["type-buddhist-temple"], "當麻曼荼羅を本尊として安置する當麻寺の中心堂。本堂とも呼ばれ、礼拝空間と曼荼羅信仰を結びつける寺院建築である。"),
 e("目加田家住宅", ["目加田家"], "江戸時代", "日本", [], ["type-minka"], "近世民家の一例として扱われる住宅。地域的な民家形式、生活・生産空間の構成を比較するための参照事例。"),
 e("神魂神社本殿", ["神魂神社", "Kamosu Shrine"], "16世紀後半", "日本・島根県松江市", ["style-taisha"], ["type-shrine"], "大社造の代表例として知られる神社本殿。古式の高床・切妻妻入の構成を伝え、出雲地方の神社建築を理解する重要な事例。"),
 e("築地ホテル館", ["築地ホテル", "Tsukiji Hotel"], "1868年（1872年焼失）", "日本・東京", ["style-giyofu"], ["type-museum-library"], "清水喜助が設計した初期の洋風ホテル。開港後の東京における西洋建築受容を示す木造擬洋風建築として重要。"),
 e("築地本願寺", ["築地本願寺本堂"], "1934年", "日本・東京", ["style-historicism"], ["type-buddhist-temple"], "伊東忠太設計。本願寺派の寺院をインド・イスラームなどの意匠を参照して表現した鉄筋コンクリート造の仏教寺院。")
]

def main() -> None:
    data = json.loads(ARCH.read_text(encoding="utf-8"))
    existing = {b["name"]["ja"] for b in data["buildings"]}
    for building in data["buildings"]:
        if building["name"]["ja"] == "カサ・ミラ":
            building["styleIds"] = []
            building["movementIds"] = ["movement-art-nouveau"]
        if building["name"]["ja"] == "サンティーヴォ・アッラ・サピエンツァ聖堂":
            building["aliases"] = sorted(set(building.get("aliases", []) + ["サンティーヴォ・アッラ・サピエンツァ"]))
        if building["name"]["ja"] == "アンコール・ワット":
            building["typeIds"] = ["type-southeast-asian-temple"]
    added = []
    for row in ADDITIONS:
        if row["name"] in existing:
            continue
        bid = "building-exam-" + hashlib.sha1(row["name"].encode("utf-8")).hexdigest()[:12]
        data["buildings"].append({
          "id": bid, "name": {"ja": row["name"], "zh": ""}, "aliases": row["aliases"],
          "period": {"ja": row["period"], "zh": ""}, "location": {"ja": row["location"], "zh": ""},
          "regions": ["japan"] if row["location"].startswith("日本") else ["western"],
          "typeIds": row["typeIds"], "styleIds": row["styleIds"], "movementIds": [], "theoryIds": [],
          "architectIds": [], "relatedPersonIds": [], "structure": {"ja": row["structure"], "zh": ""},
          "space": {"ja": row["space"], "zh": ""}, "history": {"ja": row["history"], "zh": ""},
          "imageIds": [], "importance": {"academicImportance": 2, "sourceImportance": 2, "examFrequency": row["examFrequency"], "examImportance": 2 if row["examFrequency"] >= 2 else 1},
          "examEvidence": [], "sources": [{"kind": "manual", "locator": "past-exam-candidate-review", "note": "Reviewed candidate added from past-exam word-bank triage"}],
          "reviewStatus": "verified", "qualityFlags": [], "mergedSourceIds": [], "normalizedStyleNames": [], "normalizedPersonNames": [],
          "priorityLevel": "B" if row["examFrequency"] >= 1 else "normal", "isCoreBuilding": False,
          "coreReason": "過去問の語群・本文から確認した建築候補を名称確認後に追加"})
        added.append(row["name"])
    ARCH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print({"added": len(added)})

if __name__ == "__main__": main()
