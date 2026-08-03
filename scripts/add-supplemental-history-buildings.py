"""Add the reviewed book-index buildings requested for the history card UI."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILDINGS_PATH = ROOT / "data" / "architecture-normalized-candidates.json"
LINKS_PATH = ROOT / "data" / "building-learning-card-links.json"
IMAGE_SOURCES_PATH = ROOT / "data" / "supplemental-building-image-sources.json"
IMAGE_MAP_PATH = ROOT / "data" / "building-image-map.json"


def l(ja: str, zh: str) -> dict[str, str]:
    return {"ja": ja, "zh": zh}


ITEMS = [
    ("building-supplemental-jinaicho", "寺内町", "寺内町", ["じないちょう", "Jinaicho"], "戦国時代～江戸初期", "战国时代至江户初期", "日本各地", "日本各地", ["type-jinaicho", "type-machiya"], [], [], [], "環濠・土塁と限定された出入口をもつ都市的集落。", "设有环壕、土垒与限定出入口的城市聚落。", "寺院を核に町家、商業街、短冊形敷地を編成する。", "以寺院为核心组织町家、商业街和长条宅地。", "浄土真宗寺院を中心に、宗教・防御・商業・居住を統合した自治都市。", "以净土真宗寺院为中心，整合宗教、防御、商业与居住的自治城市。"),
    ("building-supplemental-higashi-sanjo-dono", "東三条殿", "东三条殿", ["とうさんじょうどの", "Higashi Sanjo-dono"], "平安時代", "平安时代", "京都", "京都", [], ["style-shinden"], [], [], "木造軸組・檜皮葺を基本とする貴族住宅。", "以木构架和桧皮屋面为主的贵族住宅。", "寝殿を中心に対屋・渡殿を対称的に結び、南庭と池に開く。", "以寝殿为中心，用对屋与渡殿对称连接，向南庭和水池开放。", "藤原氏の代表的邸宅で、寝殿造の復元研究の基準例。", "藤原氏的代表性宅邸，是寝殿造复原研究的基准案例。"),
    ("building-supplemental-saint-denis", "サン・ドニ修道院教会", "圣丹尼修道院教堂", ["サン・ドニ修道院", "Basilica of Saint-Denis"], "12世紀中葉以降", "12世纪中叶以后", "フランス・サン＝ドニ", "法国圣丹尼", [], ["style-gothic"], [], [], "尖頭アーチ、交差リブ・ヴォールト、放射状祭室。", "尖拱、交叉肋拱与放射状祭室。", "周歩廊と祭室を連続させ、大開口のステンドグラスから光を導く。", "连续组织环廊与祭室，通过大面积彩色玻璃引光。", "修道院長シュジェールによる西正面と内陣の改築は、ゴシック成立の重要な起点。", "院长苏热尔改建西立面和后殿，是哥特式建筑成立的重要起点。"),
    ("building-supplemental-yoshijima-house", "吉島家住宅", "吉岛家住宅", ["Yoshijima House"], "1907年", "1907年", "岐阜県高山市", "岐阜县高山市", ["type-machiya"], [], [], [], "木造軸組と登り梁、大きな吹抜けをもつ高山町家。", "具有木构架、登梁和大型挑空的高山町家。", "通り土間と吹抜けを核に、店舗・座敷・作業を奥行方向に重ねる。", "以通长土间和挑空为核心，沿进深叠置店铺、座敷和作业空间。", "江戸期以来の酒造業者の家を1907年に再建。飛騨町家の構架美を示す。", "1907年重建江户时代以来酿酒商住宅，展现飞骒町家的构架之美。"),
    ("building-supplemental-villa-tugendhat", "トゥーゲントハット邸", "图根哈特别墅", ["Villa Tugendhat"], "1928～1930年", "1928—1930年", "チェコ・ブルノ", "捷克布尔诺", ["type-residence"], [], ["movement-modernism"], ["architect-mies-van-der-rohe"], "鉄骨造。クロームめっき十字形柱が自由な平面を可能にする。", "钢结构；镀铬十字柱实现自由平面。", "オニキス壁と曲面間仕切りで連続空間を緩やかに分節し、大きなガラス面で庭に開く。", "用缟玛瑙墙与曲面隔断柔性分节连续空间，通过大玻璃面向花园开放。", "ミース・ファン・デル・ローエとリリー・ライヒによる近代住宅の代表作。", "密斯·凡·德·罗与莉莉·赖希的现代住宅代表作。"),
    ("building-exam-39a8f4cbeee6", "ラウレンツィアーナ図書館", "拉乌伦齐阿纳图书馆", ["ラウレンツィアーナ図書館", "Laurentian Library", "Biblioteca Medicea Laurenziana"], "1524年以降", "1524年以后", "イタリア・フィレンツェ", "意大利佛罗伦萨", ["type-museum-library"], ["style-mannerism"], [], ["architect-michelangelo"], "石造壁体と木造屋根の図書室。前室では壁付柱と窓を圧縮的に構成する。", "石砌墙体与木屋架阅览室；前室压缩性地组织壁柱与窗。", "狭い前室に流動的な三列階段を押し込み、長大で規則的な閲覧室と対比させる。", "在狭窄前室嵌入流动的三分楼梯，与细长规整的阅览室对比。", "ミケランジェロがメディチ家のために設計。古典要素を意図的に緊張させるマニエリスムの代表。", "米开朗基罗为美第奇家族设计，以故意紧张化的古典要素代表风格主义。"),
    ("building-supplemental-reims-cathedral", "ランス大聖堂", "兰斯大教堂", ["Reims Cathedral", "Cathédrale Notre-Dame de Reims"], "1211年以降", "1211年以后", "フランス・ランス", "法国兰斯", ["type-church"], ["style-gothic"], [], [], "石造。尖頭アーチ、交差リブ・ヴォールト、フライング・バットレス。", "石结构；尖拱、交叉肋拱、飞扶壁。", "ラテン十字形平面、高い身廊、大きな高窓と西正面の彫刻群。", "拉丁十字平面、高耸中殿、大型高窗与西立面雕像群。", "歴代フランス王の戴冠式の舞台で、盛期ゴシックの構造・彫刻を代表する。", "历代法国国王加冕地，代表盛期哥特建筑的结构与雕刻。"),
    ("building-supplemental-notre-dame-raincy", "ル・ランシーのノートル＝ダム教会", "勒雷恩西圣母教堂", ["Notre-Dame du Raincy", "ノートルダム・デュ・ランシー"], "1922～1923年", "1922—1923年", "フランス・ル・ランシー", "法国勒雷恩西", ["type-church"], [], ["movement-modernism"], ["architect-auguste-perret"], "鉄筋コンクリート・ラーメンとプレキャスト格子壁。", "钢筋混凝土框架与预制格子墙。", "細い柱で一体的な会堂をつくり、外周のステンドグラス・スクリーンから均質な光を入れる。", "纤细柱列形成整体会堂，外周彩色玻璃屏引入均质光线。", "オーギュスト・ペレが教会建築の構成をRCで再解釈した「鉄筋コンクリートのサント＝シャペル」。", "奥古斯特·贝雷用钢筋混凝土重新解释教堂类型，被称为“钢筋混凝土的圣礼拜堂”。"),
    ("building-supplemental-yamanashi-culture-hall", "山梨文化会館", "山梨文化会馆", ["山梨放送会館", "Yamanashi Broadcasting and Press Centre"], "1966年", "1966年", "山梨県甲府市", "山梨县甲府市", ["type-office"], [], ["movement-metabolism"], ["architect-kenzo-tange"], "鉄筋コンクリートの円筒コアと鉄骨の大梁・床ユニット。", "钢筋混凝土圆筒核心筒、钢结构大梁与楼板单元。", "動線・設備をコアに集約し、大梁間の床を増減できる成長型空間。", "将交通与设备集约于核心筒，梁间楼板可增减的生长型空间。", "丹下健三が「成長する建築」を実体化したメタボリズムの重要例。", "丹下健三将“生长的建筑”实体化的新陈代谢派重要案例。"),
    ("building-supplemental-nageiredo", "三仏寺奥院投入堂", "三佛寺奥院投入堂", ["投入堂", "Nageiredo"], "平安時代後期", "平安时代后期", "鳥取県東伯郡三朝町", "鸟取县三朝町", ["type-temple"], ["style-wayo"], [], [], "木造、懸造、檜皮葺。岩場の局所に柱を立て、貫と方杖で支える。", "木结构、悬造、桧皮顶；在岩面局部立柱，用贯与斜撑支撑。", "岩窟に食い込む非対称な床と屋根で、山岳修験の場と一体化する。", "非对称地嵌入岩窟，与山岳修验场所融为一体。", "三徳山の断崖に建つ懸造の国宝。地形への応答と修験道の空間性を示す。", "建于三德山断崖的悬造国宝，展现对地形的回应与修验道空间性。"),
    ("building-supplemental-tokyo-station", "東京駅舎", "东京站丸之内站房", ["東京駅丸の内駅舎", "Tokyo Station Marunouchi Building"], "1914年", "1914年", "東京都千代田区", "东京都千代田区", ["type-station"], ["style-historicism"], [], ["architect-kingo-tatsuno"], "鉄骨煉瓦造。辰野式の赤煉瓦壁と白い石材帯、鉄骨屋根を組み合わせる。", "钢骨砖结构；辰野式红砖墙、白色石带与钢屋架。", "約335mの長大な駅舎を南北ドームと中央部で分節し、皇居前の軸線を受ける。", "约335米长的站房由南北穹顶与中央部分节，承接皇宫前轴线。", "辰野金吾設計の中央駅。2012年に創建時の3階建てとドームを復原。", "辰野金吾设计的中央车站；2012年恢复初建时三层体量与穹顶。"),
    ("building-supplemental-washington-dc", "ワシントンDC計画", "华盛顿 DC 规划", ["Washington, D.C.", "L'Enfant Plan"], "1791年以降", "1791年以后", "アメリカ合衆国", "美国", ["type-urban-space"], [], [], [], "格子状道路に幅広い斜交大通りと放射状交差点を重ねる。", "在方格路网上叠加宽阔斜向大道与放射节点。", "国会議事堂、ホワイトハウス、記念碑をモールと視覚軸で関係づける。", "通过国家广场与视觉轴线联系国会、白宫和纪念碑。", "ピエール・シャルル・ランファンによる新首都計画。日常交通の格子と国家的象徴軸を重ねた。", "皮埃尔·查尔斯·朗方的新首都规划，叠加日常交通方格与国家象征轴线。"),
    ("building-supplemental-haussmann-paris", "パリ改造", "奥斯曼巴黎改造", ["オスマンのパリ改造", "Haussmann's renovation of Paris"], "1853～1870年", "1853—1870年", "フランス・パリ", "法国巴黎", ["type-urban-space"], [], [], [], "広幅員の直線大通り、放射状広場、統一された建築線と軲高線。", "宽阔笔直大道、放射广场、统一建筑红线与檐口线。", "ブールバールと街角建築が連続的な都市室をつくり、公園・駅・上下水道を網状に整備する。", "林荫大道与街角建筑形成连续城市空间，系统布置公园、车站与给排水。", "ナポレオン3世の下でセーヌ県知事オスマンが推進。衛生・交通・治安の改善と同時に強制移転も生んだ。", "在拿破仑三世下由奥斯曼推动；改善卫生、交通与治安的同时也导致强制搬迁。"),
    ("building-supplemental-glasgow-school-art", "グラスゴー美術学校", "格拉斯哥艺术学院", ["Glasgow School of Art", "Mackintosh Building"], "1897～1909年", "1897—1909年", "イギリス・グラスゴー", "英国格拉斯哥", ["type-school"], [], ["movement-art-nouveau"], ["architect-charles-rennie-mackintosh"], "重厚な石造外壁と鉄・ガラス、内部の木造架構を組み合わせる。", "结合厚重石墙、铁与玻璃以及室内木构架。", "北側の大窓をもつスタジオ群と、闇と光が交錯する図書室を中庭・階段が結ぶ。", "中庭与楼梯连接北侧大窗画室群和光暗交错的图书馆。", "チャールズ・レニー・マッキントッシュの代表作。アーツ・アンド・クラフツとアール・ヌーヴォー、初期近代の接点。", "查尔斯·雷尼·麦金托什代表作，处于工艺美术、新艺术与早期现代建筑交汇点。"),
    ("building-supplemental-jiyu-gakuen", "自由学園明日館", "自由学园明日馆", ["Jiyu Gakuen Myonichikan"], "1921年", "1921年", "東京都豊島区", "东京都丰岛区", ["type-school"], [], ["movement-modernism"], ["architect-frank-lloyd-wright"], "木造モルタル塗。低い屋根と深い軒が水平性を強調する。", "木结构抹灰；低坡屋顶与深出檐强调水平性。", "中央食堂を軸に教室翼を左右対称に広げ、テラスと庭を連続させる。", "以中央食堂为轴向两侧展开教室翼，连续露台与花园。", "フランク・ロイド・ライトと遠藤新の設計。プレーリー・スタイルを日本の教育空間に応用した。", "由弗兰克·劳埃德·莱特与远藤新设计，将草原风格应用于日本教育空间。"),
]

LINKS = {
    "building-supplemental-jinaicho": ["type-jinaicho", "type-machiya"],
    "building-supplemental-higashi-sanjo-dono": ["style-shinden"],
    "building-supplemental-saint-denis": ["style-gothic"],
    "building-supplemental-yoshijima-house": ["type-machiya"],
    "building-supplemental-villa-tugendhat": ["movement-modernism"],
    "building-exam-39a8f4cbeee6": ["style-mannerism"],
    "building-supplemental-reims-cathedral": ["style-gothic"],
    "building-supplemental-notre-dame-raincy": ["movement-modernism"],
    "building-supplemental-yamanashi-culture-hall": ["movement-metabolism"],
    "building-supplemental-nageiredo": ["style-wayo"],
    "building-supplemental-tokyo-station": ["style-historicism"],
    "building-supplemental-washington-dc": ["type-urban-space"],
    "building-supplemental-haussmann-paris": ["type-urban-space"],
    "building-supplemental-glasgow-school-art": ["movement-art-nouveau"],
    "building-supplemental-jiyu-gakuen": ["architect-frank-lloyd-wright"],
}

URBAN_CASES = [
    ("building-urban-case-imaicho", "今井町", "今井町", "戦国時代～近世", "战国时代至近世", "奈良県橿原市", "奈良县橿原市", "環濠で囲まれた寺内町の街区と、近世町家が高密度に残る。", "环壕围合的寺内町街区中高密度保留近世町家。", "称念寺を核に発達し、環濠・屈曲路・短冊形敷地が歴史的景観をつくる。", "以称念寺为核心发展，环壕、曲折道路与长条宅地构成历史景观。"),
    ("building-urban-case-tondabayashi", "富田林寺内町", "富田林寺内町", "16世紀中葉以降", "16世纪中叶以后", "大阪府富田林市", "大阪府富田林市", "興正寺別院と格子状街路を中心に町家が連なる。", "以兴正寺别院和方格道路为中心，町家连续分布。", "宗教的拠点から商業町へ発展した寺内町。近世の街路と町家景観が残る。", "由宗教据点发展为商业城镇，保留近世道路与町家景观。"),
    ("building-urban-case-canberra", "キャンベラ計画", "堪培拉规划", "1912年以降", "1912年以后", "オーストラリア", "澳大利亚", "三角形の記念軸、放射状道路、湖と地形を統合する。", "整合三角形纪念轴、放射道路、湖泊与地形。", "ウォルター・バーリー・グリフィンとマリオン・マホニーによる新首都計画。", "沃尔特·伯利·格里芬与玛丽昂·马霍尼的新首都规划。"),
    ("building-urban-case-brasilia", "ブラジリア計画", "巴西利亚规划", "1957～1960年", "1957—1960年", "ブラジル", "巴西", "記念軸と曲線的な住宅軸を交差させ、機能別にゾーニングする。", "使纪念轴与曲线住宅轴交叉，按功能分区。", "ルシオ・コスタのパイロット・プランとニーマイヤーの記念建築が一体となった近代首都。", "卢西奥·科斯塔总体规划与尼迈耶纪念建筑结合的现代首都。"),
    ("building-urban-case-ringstrasse", "ウィーンのリングシュトラーセ", "维也纳环城大道", "1857年以降", "1857年以后", "オーストリア・ウィーン", "奥地利维也纳", "撤去した城壁帯を環状大通り、公園、公共建築の帯に転換した。", "将拆除的城墙地带转换为环形大道、公园和公共建筑带。", "市役所、国会議事堂、歌劇場、美術史博物館などを歴史主義様式で配置した。", "沿线以历史主义风格布置市政厅、国会、歌剧院和艺术史博物馆等。"),
    ("building-urban-case-eixample", "バルセロナのエンサンチェ", "巴塞罗那扩展区", "1859年以降", "1859年以后", "スペイン・バルセロナ", "西班牙巴塞罗那", "角を切り落とした八角形街区と均等な格子状道路を反復する。", "重复布置切角八角街块与均等方格道路。", "イルデフォンス・セルダが旧市街外に構想。採光・通風・交通と都市の平等性を目指した。", "伊尔德冯索·塞尔达于旧城外规划，追求采光、通风、交通与城市平等。"),
]

EXAM_EVIDENCE = {
    "building-exam-39a8f4cbeee6": None,  # Preserve the existing reviewed 2013 evidence.
}


def main() -> None:
    data = json.loads(BUILDINGS_PATH.read_text(encoding="utf-8"))
    existing = {item["id"]: item for item in data["buildings"]}
    for item in ITEMS:
        (bid, ja, zh, aliases, pja, pzh, lja, lzh, type_ids, style_ids, movement_ids,
         architect_ids, sja, szh, spja, spzh, hja, hzh) = item
        prior = existing.get(bid, {})
        entity = {
            "id": bid, "name": l(ja, zh), "aliases": aliases,
            "period": l(pja, pzh), "location": l(lja, lzh),
            "regions": ["japan"] if "日本" in lja or "京都" in lja or "東京" in lja or "山梨" in lja or "岐阜" in lja or "鳥取" in lja else (["global"] if "アメリカ" in lja else ["western"]),
            "typeIds": type_ids, "styleIds": style_ids, "movementIds": movement_ids,
            "theoryIds": [], "architectIds": architect_ids, "relatedPersonIds": [],
            "structure": l(sja, szh), "space": l(spja, spzh), "history": l(hja, hzh),
            "imageIds": prior.get("imageIds", []),
            "importance": prior.get("importance", {"academicImportance": 3, "sourceImportance": 2, "examFrequency": 0, "examImportance": 1}),
            "examEvidence": prior.get("examEvidence", []),
            "sources": [source for source in prior.get("sources", []) if source.get("locator") != "book-index-pp394-412"] + [{"kind": "manual", "locator": "book-index-pp394-412", "note": "User-reviewed supplemental history card"}],
            "reviewStatus": "verified", "qualityFlags": [], "mergedSourceIds": prior.get("mergedSourceIds", []),
            "normalizedStyleNames": prior.get("normalizedStyleNames", []), "normalizedPersonNames": prior.get("normalizedPersonNames", []),
            "priorityLevel": "A", "isCoreBuilding": True,
            "coreReason": "書籍索引と過去問の出題思考に基づく追加学習項目",
        }
        if bid in existing:
            idx = data["buildings"].index(existing[bid])
            data["buildings"][idx] = entity
        else:
            data["buildings"].append(entity)

    for bid, ja, zh, pja, pzh, lja, lzh, sja, szh, hja, hzh in URBAN_CASES:
        entity = {
            "id": bid, "name": l(ja, zh), "aliases": [], "period": l(pja, pzh), "location": l(lja, lzh),
            "regions": ["japan"] if bid in {"building-urban-case-imaicho", "building-urban-case-tondabayashi"} else ["global"],
            "typeIds": ["type-urban-space"], "styleIds": [], "movementIds": [], "theoryIds": [], "architectIds": [], "relatedPersonIds": [],
            "structure": l(sja, szh), "space": l(sja, szh), "history": l(hja, hzh), "imageIds": [],
            "importance": {"academicImportance": 3, "sourceImportance": 2, "examFrequency": 0, "examImportance": 1}, "examEvidence": [],
            "sources": [{"kind": "manual", "locator": "urban-planning-case-card", "note": "Representative case linked from the urban-planning section"}],
            "reviewStatus": "verified", "qualityFlags": [], "mergedSourceIds": [], "normalizedStyleNames": [], "normalizedPersonNames": [],
            "priorityLevel": "B", "isCoreBuilding": True, "coreReason": "都市計画分類の代表事例",
        }
        if bid in existing:
            data["buildings"][data["buildings"].index(existing[bid])] = entity
        else:
            data["buildings"].append(entity)
        LINKS[bid] = ["type-jinaicho"] if bid in {"building-urban-case-imaicho", "building-urban-case-tondabayashi"} else ["type-urban-space"]

    data["stats"]["normalizedBuildings"] = len(data["buildings"])
    BUILDINGS_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    links_data = json.loads(LINKS_PATH.read_text(encoding="utf-8"))
    by_id = {item["buildingId"]: item for item in links_data["buildings"]}
    entity_by_id = {item["id"]: item for item in data["buildings"]}
    for bid, card_ids in LINKS.items():
        entity = entity_by_id[bid]
        record = {
            "buildingId": bid, "buildingNameJa": entity["name"]["ja"], "learningCardIds": card_ids,
            "styleIds": entity["styleIds"], "movementIds": entity["movementIds"],
            "architectCardIds": entity["architectIds"], "imageIds": entity["imageIds"],
            "examEvidence": entity["examEvidence"],
        }
        if bid in by_id:
            links_data["buildings"][links_data["buildings"].index(by_id[bid])] = record
        else:
            links_data["buildings"].append(record)
    links_data["stats"]["totalBuildings"] = len(links_data["buildings"])
    LINKS_PATH.write_text(json.dumps(links_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    source_data = json.loads(IMAGE_SOURCES_PATH.read_text(encoding="utf-8"))
    image_map = json.loads(IMAGE_MAP_PATH.read_text(encoding="utf-8"))
    for image in source_data["images"]:
        entity = entity_by_id[image["buildingId"]]
        local_image = ROOT / "public" / "architecture-images" / image["file"]
        if local_image.exists() and local_image.stat().st_size > 10_000:
            image_map[image["buildingId"]] = {
                "nameJa": entity["name"]["ja"], "nameZh": entity["name"]["zh"],
                "imageFiles": [image["file"]],
            }
        else:
            image_map.pop(image["buildingId"], None)
    IMAGE_MAP_PATH.write_text(json.dumps(image_map, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
