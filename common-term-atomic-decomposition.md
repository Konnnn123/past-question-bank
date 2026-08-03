# Common-Term Atomic Decomposition

Scope: only the 35 `definition_not_atomic` candidates. A split is listed only when a local Specialist 1 question or the local answer index explicitly supports its term. No inference from a broad candidate label is treated as a source fact.

## Results

- `generated_atomic_candidates`: **32**
- `promoted`: **0**
- `rejected`: **16**
- `duplicate`: **9**
- `incompatible_domain`: **23**
- Seed pool: **27 before → 27 after**

No split item passed every gate in this pass, so the seed pool was not changed. Existing RC terms supported by sources were all already present in the 27-term seed pool; all other source-supported splits belong to a different domain.
Because the seed pool remains below 40 (27), candidate repair stops here. The current word-bank mechanism remains limited fact recombination, not a healthy-randomized full mock; the next expansion path is active fact extraction from past questions and authoritative teaching sources.

## Per-candidate decomposition

### 2. Pcaの方式

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | 仓库内没有 Specialist 1 原题或答案项把“Pcaの方式”拆成具体、可唯一作答的术语。 | — | — | — | `rejected` |
### 4. PCaとPCの違い

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | 本地可用的 PCa／PC 详细说明属于 Specialist 2-2；当前范围不能把它当作 Specialist 1 来源。 | — | — | — | `rejected` |
### 11. PCa造の利点

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “利点”是评价集合；本地 Specialist 1 资料未给出能独立归属给 PCa 的单一答案项。 | — | — | — | `rejected` |
### 12. PC造の特徴

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “特徴”是多属性主题；现有来源没有将其拆成可唯一作答且属于当前 RC 题域的术语。 | — | — | — | `rejected` |
### 13. RC造の構造原理と寿命

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “構造原理と寿命”合并了原理与耐久性；本地资料未给出对应的单一答案槽。 | — | — | — | `rejected` |
### 14. RC造の標準的な施工手順

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “施工手順”是顺序性过程；当前来源未提供可脱离步骤上下文的 RC 术语答案。 | — | — | — | `rejected` |
### 15. RC造の分類

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “分類”是上位组织标签，不是原题中可定位的独立答案。 | — | — | — | `rejected` |
### 16. RC配筋の基本

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| 主筋 | RC 断面标注；可读来源未单独展开定义。 | `data/processed_questions/2023_専門1_建筑构法_Q問題3.md:23` — 07198324736_832aa7d13201.jpg) 語群 側板、かぶり厚さ、スランプ、基礎、フィンクトラス、主筋、キングポストトラス、ワーレントラス、隅肉溶接、完全溶け込み溶接、あばら筋、柱、段板、け込み板、突合せ継手、重ね継手、一面せん断、二面せん断、火打ち土台、土台、床梁 | `data/construction-exam-answers.json` → 2023_専門1_建筑构法_Q問題3.md#s01: 図を『基礎・木造床／RC断面／溶接継手／トラス／階段』の5群に分けて読む。RC断面は主筋・あばら筋・かぶり厚さ、溶接は完全溶け込み溶接と隅肉溶接、階段は段板・け込み板・側板、木造床は土台・床梁・火打土台、トラスはキングポスト・フィンク・ワーレンを三角材の配置で判定する。画像書き出しが黒く、各番号への最終割当は未確定。 | 未找到以该术语为实体／值的 Atomic Fact。 | reinforcement_role | rc_construction | 同一 RC 施工／纳まり relation 的未选术语；不得满足该 blank。 | `duplicate` — 与 seed term「主筋」重复，不能新增。 |

| あばら筋 | RC 断面标注；可读来源未单独展开定义。 | `data/processed_questions/2017_専門1_建筑构法_Q3.md:33` — ランプ 2）挽板 3) サンドドレーン 4) クイーンポスト 5) バックドラフト 6) 单板 7) 帶筋 8) ウェブ 9) あばら筋 10) ダイアフラム 【用語群】 直交集成板、合板、コンクリート、鉄筋コンクリート梁、鉄筋コンクリート柱、H形鋼、鋼管、トラス、液状化、火災 (2) 以下の材料の特性値 11)～20)について、それぞれ最も相応しいものを括弧内の選択肢から選びなさい。 <br>`data/processed_questions/2023_専門1_建筑构法_Q問題3.md:23` —  語群 側板、かぶり厚さ、スランプ、基礎、フィンクトラス、主筋、キングポストトラス、ワーレントラス、隅肉溶接、完全溶け込み溶接、あばら筋、柱、段板、け込み板、突合せ継手、重ね継手、一面せん断、二面せん断、火打ち土台、土台、床梁 | `data/construction-exam-answers.json` → 2017_専門1_建筑构法_Q3.md#s09: 鉄筋コンクリート梁<br>`data/construction-exam-answers.json` → 2023_専門1_建筑构法_Q問題3.md#s01: 図を『基礎・木造床／RC断面／溶接継手／トラス／階段』の5群に分けて読む。RC断面は主筋・あばら筋・かぶり厚さ、溶接は完全溶け込み溶接と隅肉溶接、階段は段板・け込み板・側板、木造床は土台・床梁・火打土台、トラスはキングポスト・フィンク・ワーレンを三角材の配置で判定する。画像書き出しが黒く、各番号への最終割当は未確定。 | 未找到以该术语为实体／值的 Atomic Fact。 | reinforcement_role | rc_construction | 同一 RC 施工／纳まり relation 的未选术语；不得满足该 blank。 | `duplicate` — 与 seed term「あばら筋」重复，不能新增。 |

| かぶり厚さ | 钢筋表面至混凝土表面的最小尺寸。 | `data/processed_questions/2023_専門1_建筑构法_Q問題3.md:23` — 3年度_建築専門1_公開版_2062812307198324736_832aa7d13201.jpg) 語群 側板、かぶり厚さ、スランプ、基礎、フィンクトラス、主筋、キングポストトラス、ワーレントラス、隅肉溶接、完全溶け込み溶接、あばら筋、柱、段板、け込み板、突合せ継手、重ね継手、一面せん断、二面せん断、火打ち土台、土台、床梁 | `data/construction-exam-answers.json` → 2023_専門1_建筑构法_Q問題3.md#s01: 図を『基礎・木造床／RC断面／溶接継手／トラス／階段』の5群に分けて読む。RC断面は主筋・あばら筋・かぶり厚さ、溶接は完全溶け込み溶接と隅肉溶接、階段は段板・け込み板・側板、木造床は土台・床梁・火打土台、トラスはキングポスト・フィンク・ワーレンを三角材の配置で判定する。画像書き出しが黒く、各番号への最終割当は未確定。 | 未找到以该术语为实体／值的 Atomic Fact。 | cover_dimension | rc_construction | 同一 RC 施工／纳まり relation 的未选术语；不得满足该 blank。 | `duplicate` — 与 seed term「かぶり厚さ」重复，不能新增。 |
### 18. S造鋼材断面の基本

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| ウェブ | H 形钢中连接两端板件的部分。 | `data/processed_questions/2017_専門1_建筑构法_Q3.md:31` — い。 1) スランプ 2）挽板 3) サンドドレーン 4) クイーンポスト 5) バックドラフト 6) 单板 7) 帶筋 8) ウェブ 9) あばら筋 10) ダイアフラム 【用語群】 直交集成板、合板、コンクリート、鉄筋コンクリート梁、鉄筋コンクリート柱、H形鋼、鋼管、トラス、液状化、火災 (2) 以下の材料の特性値 11)～20)について、それぞれ最も相応しいものを括弧内の選択肢か<br>`data/processed_questions/2024_専門1_建筑构法_Q3.md:37` — SB, CLT】と呼ぶ。 ・ H 形鋼の断面で、主に曲げ応力を負担する両端の板をつなぐ部分を【m. フランジ, ブラケット, ダイアフラム, ウェブ】と呼ぶ。 ・ 地下部を上階から下階に向かって施工する工法を【n. 潜函工法, 逆打ち工法, 建て逃げ工法, セルフクライミング工法】と呼ぶ。 ・ 鉄筋コンクリート造の部材において、鉄筋の表面からコンクリートの表面までの最小寸法を【o. 通り, かぶり, 見込<br>`data/processed_questions/2026_専門1_建筑构法_Q3.md:22` — -exams/2026年度_建築専門1_公開版_2062812433992134656_c103c7327270.jpg) 例2 H.形鋼のウェブとフランジ ![image](/past-exams/2026年度_建築専門1_公開版_2062812433992134656_f9e64b495d30.jpg) (1) コンクリート型枠のセパレーターとフォームタイ (2) 内装の巾木と回り縁（廻り縁）  | `data/construction-exam-answers.json` → 2017_専門1_建筑构法_Q3.md#s08: H形鋼<br>`data/construction-exam-answers.json` → 2024_専門1_建筑构法_Q3.md#s01: a 5000 b 800 c 12 d 10⁻⁵ e 10⁻⁵ f 4 g 450 h レトロフィット i 透湿防水 j 豆板 k 留め l NLT m ウェブ n 逆打ち工法 o かぶり p コールドフォーミング q 燃えしろ r 巾木 s まわり縁 t エッジ | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | steel_member | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 steel_member，不能放入当前 RC 躯体施工／纳まり模板。 |
### 26. カーテンウォール・外壁支持の基本

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| マリオン | 幕墙中使用的纵长部件（方立）。 | `data/processed_questions/2015_専門1_建筑构法_Q2.md:33` — (3) けらば (4) 2×4 (ツーバイフォー) 工法 (5) 集成材 (6) DPG (Dot Point Glazing) 構法 (7) マリオン (8) オールケーシング (9) 金輪 (10) 釘接合 【用語群】 ガラス、挽板、単板、煉瓦、杭地業、真束、枠組壁工法、木造軸組構法、引張力、引抜力、切妻、PC鋼棒、開口部、縁、溶接、方立、継手、仕口 <br>`data/processed_questions/2019_専門1_建筑构法_Q3.md:77` — 野地板，キープレート，ベースプレート，デッキプレート，スプライスプレート，母屋，下屋, 無目，垂木，蝶番，スチフナ，セパレーター，フォームタイ，マリオン，ダイアフラム，スパンドレル，スカラップ，ターンバックル<br>`data/processed_questions/2022_専門1_建筑构法_Q3.md:55` — ぶ。 - 地震時に部分的に大きな力が働くのを防ぐため，建物に（T）を設けて，構造的に切り離す。 # 【用語群】 胴縁，山留，幅木，継ぎ手，マリオン，スランプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン | `data/construction-exam-answers.json` → 2019_専門1_建筑构法_Q3.md#s02: k 野地板 l 垂木 m 母屋 n フォームタイ o セパレーター p せき板 q ダイアフラム r スカラップ s マリオン t 無目<br>`data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント<br>`data/construction-exam-answers.json` → 2015_専門1_建筑构法_Q2.md#s02: イングリッシュ・ボンド→煉瓦 キングポスト→真束 けらば→切妻 2×4工法→枠組壁工法 集成材→挽板 DPG（Dot Point Glazing）構法→ガラス マリオン→方立 オールケーシング→杭地業 金輪→継手 釘接合→引抜力 | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | curtain_wall_glazing | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 curtain_wall_glazing，不能放入当前 RC 躯体施工／纳まり模板。 |
### 27. カーテンウォールのファスナー例

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “ファスナー例”未在 Specialist 1 原题中定位到可证明为 curtain-wall fastener 的单一答案。 | — | — | — | `rejected` |
### 28. カーテンウォールの構成部材

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| マリオン | 幕墙中使用的纵长部件（方立）。 | `data/processed_questions/2015_専門1_建筑构法_Q2.md:33` — (3) けらば (4) 2×4 (ツーバイフォー) 工法 (5) 集成材 (6) DPG (Dot Point Glazing) 構法 (7) マリオン (8) オールケーシング (9) 金輪 (10) 釘接合 【用語群】 ガラス、挽板、単板、煉瓦、杭地業、真束、枠組壁工法、木造軸組構法、引張力、引抜力、切妻、PC鋼棒、開口部、縁、溶接、方立、継手、仕口 <br>`data/processed_questions/2019_専門1_建筑构法_Q3.md:77` — 野地板，キープレート，ベースプレート，デッキプレート，スプライスプレート，母屋，下屋, 無目，垂木，蝶番，スチフナ，セパレーター，フォームタイ，マリオン，ダイアフラム，スパンドレル，スカラップ，ターンバックル<br>`data/processed_questions/2022_専門1_建筑构法_Q3.md:55` — ぶ。 - 地震時に部分的に大きな力が働くのを防ぐため，建物に（T）を設けて，構造的に切り離す。 # 【用語群】 胴縁，山留，幅木，継ぎ手，マリオン，スランプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン | `data/construction-exam-answers.json` → 2019_専門1_建筑构法_Q3.md#s02: k 野地板 l 垂木 m 母屋 n フォームタイ o セパレーター p せき板 q ダイアフラム r スカラップ s マリオン t 無目<br>`data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント<br>`data/construction-exam-answers.json` → 2015_専門1_建筑构法_Q2.md#s02: イングリッシュ・ボンド→煉瓦 キングポスト→真束 けらば→切妻 2×4工法→枠組壁工法 集成材→挽板 DPG（Dot Point Glazing）構法→ガラス マリオン→方立 オールケーシング→杭地業 金輪→継手 釘接合→引抜力 | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | curtain_wall_glazing | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 curtain_wall_glazing，不能放入当前 RC 躯体施工／纳まり模板。 |
### 29. カーテンウォールの支持方式

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “支持方式”是关系主题；现有原题只支持部件名，不能推断具体支持方式。 | — | — | — | `rejected` |
### 30. カーテンウォールを用いる目的

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “用いる目的”是解释性命题，不是可作为词库答案的单项术语。 | — | — | — | `rejected` |
### 31. カーテンウォール構成方式

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “構成方式”需要多部件关系；当前资料没有可拆出的唯一答案项。 | — | — | — | `rejected` |
### 39. コンクリート施工不良

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| 豆板 | 混凝土浇筑时的充填不良部位。 | `data/processed_questions/2024_専門1_建筑构法_Q3.md:31` — 、断熱材の室外側に【i. 防水, 透湿, 防湿, 透湿防水】シートを施工するのが一般的である。 ・ コンクリート打設時の充填不良部分を【j. 豆板, 波板, 堰板, しぶ板】と呼ぶ。 ・ 2 部材を直交させる際、45 度ずつ切り欠いて対称に納める加工を【k. 留め, はぎ, さね, 千鳥】加工と呼ぶ。 ・ ツーバイフォー材などを釘や木ネジで接合し大きな断面とした材を【l. NLT, LSB, OSB,  | `data/construction-exam-answers.json` → 2024_専門1_建筑构法_Q3.md#s01: a 5000 b 800 c 12 d 10⁻⁵ e 10⁻⁵ f 4 g 450 h レトロフィット i 透湿防水 j 豆板 k 留め l NLT m ウェブ n 逆打ち工法 o かぶり p コールドフォーミング q 燃えしろ r 巾木 s まわり縁 t エッジ | 未找到以该术语为实体／值的 Atomic Fact。 | construction_defect | rc_construction | 同一 RC 施工／纳まり relation 的未选术语；不得满足该 blank。 | `duplicate` — 与 seed term「豆板」重复，不能新增。 |
### 43. シェル・トラス・膜構造の基本

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “シェル・トラス・膜構造”将不同体系合并；本地 Specialist 1 没有逐项定义来源可安全拆分。 | — | — | — | `rejected` |
### 46. スケルトン・インフィルと工業化

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “スケルトン・インフィルと工業化”是比较／发展主题，不能由题干出现推断出独立定义。 | — | — | — | `rejected` |
### 55. フレッシュコンクリートと打設

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| スランプ | 测量生混凝土流动性的试验指标。 | `data/processed_questions/2013_専門1_建筑构法_Q2.md:47` — る. ・カーテンウォールと並んで代表的な（20）に ALC 版による壁があげられる。 【欄 A】 ヤング係数・線膨張係数・基準強度・剛性・スランプ値・1/5・1/2・1.0・1.5・2・2.5・4・5・8・10・炭素量・酸素量・せん断力・引抜き力・引張力・圧縮力・摩擦力・曲げモーメント・大きい・小さい・本実・留め・矧ぎ・洋小屋・和小屋・耐力壁・帳壁・小舞壁・破れ目地・芋目地・透かし目地・臥梁・まぐさ・幅木・<br>`data/processed_questions/2017_専門1_建筑构法_Q3.md:6` — --- year: 2017 subject: "建筑构法" category: "専門1" tags: - "スランプ" - "比重" - "ヤング係数" - "線膨張係数" question_number: "3" --- ## 【問題 3】 (1)以下の 1) ~10) の用語と最も関連の深い用語を【用語群】の中から 1 つずつ選びなさい。 1) スランプ <br>`data/processed_questions/2022_専門1_建筑构法_Q3.md:55` —  地震時に部分的に大きな力が働くのを防ぐため，建物に（T）を設けて，構造的に切り離す。 # 【用語群】 胴縁，山留，幅木，継ぎ手，マリオン，スランプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン<br>`data/processed_questions/2023_専門1_建筑构法_Q問題3.md:23` — 専門1_公開版_2062812307198324736_832aa7d13201.jpg) 語群 側板、かぶり厚さ、スランプ、基礎、フィンクトラス、主筋、キングポストトラス、ワーレントラス、隅肉溶接、完全溶け込み溶接、あばら筋、柱、段板、け込み板、突合せ継手、重ね継手、一面せん断、二面せん断、火打ち土台、土台、床梁 | `data/construction-exam-answers.json` → 2013_専門1_建筑构法_Q2.md#s11: スランプ値<br>`data/construction-exam-answers.json` → 2013_専門1_建筑构法_Q2.md#s12: 大きい<br>`data/construction-exam-answers.json` → 2014_専門1_建筑构法_Q3.md#s12: スランプフロー試験<br>`data/construction-exam-answers.json` → 2017_専門1_建筑构法_Q3.md#s01: コンクリート<br>`data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント | `data/atomic-facts.json` → fact-6c0300e0f8c2 (appears_in_exam; sourceId: 1783752565140)<br>`data/atomic-facts.json` → fact-3724da7b7853 (appears_in_exam; sourceId: 1783752565140)<br>`data/atomic-facts.json` → fact-95535f822810 (appears_in_exam; sourceId: 1783752565140) | fresh_concrete_property | rc_construction | 同一 RC 施工／纳まり relation 的未选术语；不得满足该 blank。 | `duplicate` — 与 seed term「スランプ」重复，不能新增。 |
### 63. 改修・工業化工法の基本

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “改修・工業化工法”是多个工法类别的上位集合，未找到可独立映射的 Specialist 1 答案。 | — | — | — | `rejected` |
### 64. 開口部・ガラスの基本

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| ガスケット | 固定玻璃并确保水密、气密性的部件。 | `data/processed_questions/2022_専門1_建筑构法_Q3.md:57` — LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン<br>`data/processed_questions/2024_専門1_建筑构法_Q3.md:27` — 800】mm 間隔程度に設置する。 ・ 既存建物のデザインを保存しつつ耐震性能を向上させるために、基礎部などに免震層を設ける工法を免震【h. ガスケット, コルゲート, レトロフィット, ケーソン】工法と呼ぶ。 ・ 木造住宅の外壁に通気構法を採用した場合、断熱材の室外側に【i. 防水, 透湿, 防湿, 透湿防水】シートを施工するのが一般的である。 ・ コンクリート打設時の充填不良部分を【j. 豆板, 波板,  | `data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント<br>`data/construction-exam-answers.json` → 2015_専門1_建筑构法_Q12.md#s01: 帳壁は自重を確実に支持しつつ、層間変位を拘束しないように躯体へ取り付ける。上部は長穴・スライド機構などで層間変位を追従させ、下部または一方の支持点で面外荷重と自重を受ける。パネル周囲には十分なクリアランスを設け、シール材・ガスケットは変形に追従できるものとする。図では、梁・柱、固定点、可動点、層間変位矢印、周囲クリアランスを示す。<br>`data/construction-exam-answers.json` → 2015_専門1_建筑构法_Q13.md#s01: ガラスは方立・無目にガスケットと押縁で固定し、ガラス溝の排水経路を屋外側へ連続させる。石材パネルは見え掛かりの仕上げであり、背後に防水層・水切り・通気排水層を設ける。屋根は外側へ勾配を付け、石材目地から浸入した水も防水層上で排水できる二次防水とする。異種材料の取り合いにはバックアップ材＋シーリングを用い、上端は押え金物・水切りで雨だれを外へ導く。 | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | curtain_wall_glazing | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 curtain_wall_glazing，不能放入当前 RC 躯体施工／纳まり模板。 |
### 65. 開口部の各部の名称

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| 巾木 | 墙与地板交接处的收边部件。 | `data/processed_questions/2024_専門1_建筑构法_Q3.md:47` — 大きくした部分を【q. 燃え止まり, 燃えしろ, 燃え足し, 燃え継ぎ】層と呼ぶ。 ・ 壁と床の見切り材を【r. 胴縁, まわり縁, 木摺, 巾木】、壁と天井の見切り材を【s. 胴縁, まわり縁, 木摺, 巾木】と呼ぶ。 ・ ガラスとサッシがあたらないように設ける距離を【t. デプス, エッジ, スウェイ, ロッキング】クリアランスと呼ぶ。 <br>`data/processed_questions/2026_専門1_建筑构法_Q3.md:29` — 2812433992134656_f9e64b495d30.jpg) (1) コンクリート型枠のセパレーターとフォームタイ (2) 内装の巾木と回り縁（廻り縁） (3) 木造のあり継ぎとかま継ぎ (4) ガラスの合わせガラスと複層ガラス (5) タイルのいも目地と馬目地 (6) 地下工事の山留め壁と切り梁 (7) 瓦葺きの本瓦葺きと桟瓦葺き (8) 木質系材料の CLT と集成材 | `data/construction-exam-answers.json` → 2026_専門1_建筑构法_Q3.md#s02: 巾木は床と壁の取り合いに設け、壁下端を保護し掃除や仕上げを納める部材。回り縁は壁と天井の取り合いに設け、天井仕上げとの境目を納める見切り材。<br>`data/construction-exam-answers.json` → 2024_専門1_建筑构法_Q3.md#s01: a 5000 b 800 c 12 d 10⁻⁵ e 10⁻⁵ f 4 g 450 h レトロフィット i 透湿防水 j 豆板 k 留め l NLT m ウェブ n 逆打ち工法 o かぶり p コールドフォーミング q 燃えしろ r 巾木 s まわり縁 t エッジ | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | interior_or_other | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 interior_or_other，不能放入当前 RC 躯体施工／纳まり模板。 |

| まわり縁 | 墙与天花交接处的收边部件。 | `data/processed_questions/2024_専門1_建筑构法_Q3.md:47` — 炭化を見込んで断面を大きくした部分を【q. 燃え止まり, 燃えしろ, 燃え足し, 燃え継ぎ】層と呼ぶ。 ・ 壁と床の見切り材を【r. 胴縁, まわり縁, 木摺, 巾木】、壁と天井の見切り材を【s. 胴縁, まわり縁, 木摺, 巾木】と呼ぶ。 ・ ガラスとサッシがあたらないように設ける距離を【t. デプス, エッジ, スウェイ, ロッキング】クリアランスと呼ぶ。  | `data/construction-exam-answers.json` → 2024_専門1_建筑构法_Q3.md#s01: a 5000 b 800 c 12 d 10⁻⁵ e 10⁻⁵ f 4 g 450 h レトロフィット i 透湿防水 j 豆板 k 留め l NLT m ウェブ n 逆打ち工法 o かぶり p コールドフォーミング q 燃えしろ r 巾木 s まわり縁 t エッジ | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | interior_or_other | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 interior_or_other，不能放入当前 RC 躯体施工／纳まり模板。 |
### 66. 外壁・防水・雨仕舞の基本

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| 透湿防水 | 木造外墙断热材室外侧所用的透湿防水层属性。 | `data/processed_questions/2024_専門1_建筑构法_Q3.md:29` — ート, レトロフィット, ケーソン】工法と呼ぶ。 ・ 木造住宅の外壁に通気構法を採用した場合、断熱材の室外側に【i. 防水, 透湿, 防湿, 透湿防水】シートを施工するのが一般的である。 ・ コンクリート打設時の充填不良部分を【j. 豆板, 波板, 堰板, しぶ板】と呼ぶ。 ・ 2 部材を直交させる際、45 度ずつ切り欠いて対称に納める加工を【k. 留め, はぎ, さね, 千鳥】加工と呼ぶ。 ・ ツーバイ | `data/construction-exam-answers.json` → 2024_専門1_建筑构法_Q3.md#s01: a 5000 b 800 c 12 d 10⁻⁵ e 10⁻⁵ f 4 g 450 h レトロフィット i 透湿防水 j 豆板 k 留め l NLT m ウェブ n 逆打ち工法 o かぶり p コールドフォーミング q 燃えしろ r 巾木 s まわり縁 t エッジ | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | external_envelope | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 external_envelope，不能放入当前 RC 躯体施工／纳まり模板。 |
### 72. 基礎・地盤・地下工事の基本

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| サウンディング | 户建住宅简易地盘调查的瑞典式试验名称。 | `data/processed_questions/2022_専門1_建筑构法_Q3.md:55` — ，継ぎ手，マリオン，スランプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン | `data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | underground_work | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 underground_work，不能放入当前 RC 躯体施工／纳まり模板。 |

| フーチング | 布基础底部加宽的部分。 | `data/processed_questions/2022_専門1_建筑构法_Q3.md:55` — 用語群】 胴縁，山留，幅木，継ぎ手，マリオン，スランプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン | `data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | foundation_work | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `duplicate` — 与 seed term「フーチング」重复，不能新增。 |

| 山留 | 支撑根切侧面的地下施工术语。 | `data/processed_questions/2022_専門1_建筑构法_Q3.md:55` — える壁を（S）壁と呼ぶ。 - 地震時に部分的に大きな力が働くのを防ぐため，建物に（T）を設けて，構造的に切り離す。 # 【用語群】 胴縁，山留，幅木，継ぎ手，マリオン，スランプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，<br>`data/processed_questions/2026_専門1_建筑构法_Q3.md:37` — り縁） (3) 木造のあり継ぎとかま継ぎ (4) ガラスの合わせガラスと複層ガラス (5) タイルのいも目地と馬目地 (6) 地下工事の山留め壁と切り梁 (7) 瓦葺きの本瓦葺きと桟瓦葺き (8) 木質系材料の CLT と集成材 | `data/construction-exam-answers.json` → 2026_専門1_建筑构法_Q3.md#s06: 山留め壁は掘削周囲の土を保持して崩壊や変形を防ぐ壁。切り梁は向かい合う山留め壁の間に渡し、土圧による変形を内側から支える水平材。<br>`data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | underground_work | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 underground_work，不能放入当前 RC 躯体施工／纳まり模板。 |
### 77. 型枠・型枠支保工の構成

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| セパレーター | 保持左右模板间距恒定的部件。 | `data/processed_questions/2019_専門1_建筑构法_Q3.md:77` —  # B 群 せき板，野地板，キープレート，ベースプレート，デッキプレート，スプライスプレート，母屋，下屋, 無目，垂木，蝶番，スチフナ，セパレーター，フォームタイ，マリオン，ダイアフラム，スパンドレル，スカラップ，ターンバックル<br>`data/processed_questions/2026_専門1_建筑构法_Q3.md:27` — s/2026年度_建築専門1_公開版_2062812433992134656_f9e64b495d30.jpg) (1) コンクリート型枠のセパレーターとフォームタイ (2) 内装の巾木と回り縁（廻り縁） (3) 木造のあり継ぎとかま継ぎ (4) ガラスの合わせガラスと複層ガラス (5) タイルのいも目地と馬目地 (6) 地下工事の山留め壁と切り梁 (7) 瓦葺きの本瓦葺きと桟瓦葺き (8) 木質系 | `data/construction-exam-answers.json` → 2026_専門1_建筑构法_Q3.md#s01: セパレーターは左右の型枠の間隔を一定に保つ部材。フォームタイは型枠を外側から締め付け、コンクリート側圧に抵抗して型枠を固定する緊結金物。<br>`data/construction-exam-answers.json` → 2019_専門1_建筑构法_Q3.md#s02: k 野地板 l 垂木 m 母屋 n フォームタイ o セパレーター p せき板 q ダイアフラム r スカラップ s マリオン t 無目 | `data/atomic-facts.json` → fact-5915cefc88e1 (belongs_to; sourceId: 1783752565162)<br>`data/atomic-facts.json` → fact-1c122fae3f48 (appears_in_exam; sourceId: 1783752565162)<br>`data/atomic-facts.json` → fact-133fb8d6f0c0 (appears_in_exam; sourceId: 1783752565162) | formwork_component | rc_construction | 同一 RC 施工／纳まり relation 的未选术语；不得满足该 blank。 | `duplicate` — 与 seed term「セパレーター」重复，不能新增。 |

| フォームタイ | 从外侧紧固模板并抵抗侧压的紧结金物。 | `data/processed_questions/2019_専門1_建筑构法_Q3.md:77` — 群 せき板，野地板，キープレート，ベースプレート，デッキプレート，スプライスプレート，母屋，下屋, 無目，垂木，蝶番，スチフナ，セパレーター，フォームタイ，マリオン，ダイアフラム，スパンドレル，スカラップ，ターンバックル<br>`data/processed_questions/2026_専門1_建筑构法_Q3.md:27` — 度_建築専門1_公開版_2062812433992134656_f9e64b495d30.jpg) (1) コンクリート型枠のセパレーターとフォームタイ (2) 内装の巾木と回り縁（廻り縁） (3) 木造のあり継ぎとかま継ぎ (4) ガラスの合わせガラスと複層ガラス (5) タイルのいも目地と馬目地 (6) 地下工事の山留め壁と切り梁 (7) 瓦葺きの本瓦葺きと桟瓦葺き (8) 木質系材料の CLT | `data/construction-exam-answers.json` → 2026_専門1_建筑构法_Q3.md#s01: セパレーターは左右の型枠の間隔を一定に保つ部材。フォームタイは型枠を外側から締め付け、コンクリート側圧に抵抗して型枠を固定する緊結金物。<br>`data/construction-exam-answers.json` → 2019_専門1_建筑构法_Q3.md#s02: k 野地板 l 垂木 m 母屋 n フォームタイ o セパレーター p せき板 q ダイアフラム r スカラップ s マリオン t 無目 | `data/atomic-facts.json` → fact-76cd1970fd83 (belongs_to; sourceId: 1783752565160)<br>`data/atomic-facts.json` → fact-99199e9e1f17 (appears_in_exam; sourceId: 1783752565160)<br>`data/atomic-facts.json` → fact-83c3375d3aa0 (appears_in_exam; sourceId: 1783752565160) | formwork_component | rc_construction | 同一 RC 施工／纳まり relation 的未选术语；不得满足该 blank。 | `duplicate` — 与 seed term「フォームタイ」重复，不能新增。 |
### 84. 在来軸組構法の基本

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| 継ぎ手 | 沿长度方向连接两根木材的部位。 | `data/processed_questions/2022_専門1_建筑构法_Q3.md:55` — ）壁と呼ぶ。 - 地震時に部分的に大きな力が働くのを防ぐため，建物に（T）を設けて，構造的に切り離す。 # 【用語群】 胴縁，山留，幅木，継ぎ手，マリオン，スランプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン | `data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | timber_roof | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 timber_roof，不能放入当前 RC 躯体施工／纳まり模板。 |
### 87. 湿式工法と乾式工法

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “湿式工法と乾式工法”是二分比较；现有资料未提供可进入当前 RC 词库的单一 relation。 | — | — | — | `rejected` |
### 93. 床・天井・内装下地の基本

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| 巾木 | 墙与地板交接处的收边部件。 | `data/processed_questions/2024_専門1_建筑构法_Q3.md:47` — 大きくした部分を【q. 燃え止まり, 燃えしろ, 燃え足し, 燃え継ぎ】層と呼ぶ。 ・ 壁と床の見切り材を【r. 胴縁, まわり縁, 木摺, 巾木】、壁と天井の見切り材を【s. 胴縁, まわり縁, 木摺, 巾木】と呼ぶ。 ・ ガラスとサッシがあたらないように設ける距離を【t. デプス, エッジ, スウェイ, ロッキング】クリアランスと呼ぶ。 <br>`data/processed_questions/2026_専門1_建筑构法_Q3.md:29` — 2812433992134656_f9e64b495d30.jpg) (1) コンクリート型枠のセパレーターとフォームタイ (2) 内装の巾木と回り縁（廻り縁） (3) 木造のあり継ぎとかま継ぎ (4) ガラスの合わせガラスと複層ガラス (5) タイルのいも目地と馬目地 (6) 地下工事の山留め壁と切り梁 (7) 瓦葺きの本瓦葺きと桟瓦葺き (8) 木質系材料の CLT と集成材 | `data/construction-exam-answers.json` → 2026_専門1_建筑构法_Q3.md#s02: 巾木は床と壁の取り合いに設け、壁下端を保護し掃除や仕上げを納める部材。回り縁は壁と天井の取り合いに設け、天井仕上げとの境目を納める見切り材。<br>`data/construction-exam-answers.json` → 2024_専門1_建筑构法_Q3.md#s01: a 5000 b 800 c 12 d 10⁻⁵ e 10⁻⁵ f 4 g 450 h レトロフィット i 透湿防水 j 豆板 k 留め l NLT m ウェブ n 逆打ち工法 o かぶり p コールドフォーミング q 燃えしろ r 巾木 s まわり縁 t エッジ | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | interior_or_other | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 interior_or_other，不能放入当前 RC 躯体施工／纳まり模板。 |

| まわり縁 | 墙与天花交接处的收边部件。 | `data/processed_questions/2024_専門1_建筑构法_Q3.md:47` — 炭化を見込んで断面を大きくした部分を【q. 燃え止まり, 燃えしろ, 燃え足し, 燃え継ぎ】層と呼ぶ。 ・ 壁と床の見切り材を【r. 胴縁, まわり縁, 木摺, 巾木】、壁と天井の見切り材を【s. 胴縁, まわり縁, 木摺, 巾木】と呼ぶ。 ・ ガラスとサッシがあたらないように設ける距離を【t. デプス, エッジ, スウェイ, ロッキング】クリアランスと呼ぶ。  | `data/construction-exam-answers.json` → 2024_専門1_建筑构法_Q3.md#s01: a 5000 b 800 c 12 d 10⁻⁵ e 10⁻⁵ f 4 g 450 h レトロフィット i 透湿防水 j 豆板 k 留め l NLT m ウェブ n 逆打ち工法 o かぶり p コールドフォーミング q 燃えしろ r 巾木 s まわり縁 t エッジ | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | interior_or_other | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 interior_or_other，不能放入当前 RC 躯体施工／纳まり模板。 |
### 94. 床組・壁下地・天井下地

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| — | — | — | — | “床組・壁下地・天井下地”是三个部位集合，原题没有支持将其拆成当前 RC 模板的独立词项。 | — | — | — | `rejected` |
### 97. 組積造・タイル・瓦の基本

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| フレミッシュ | 砖砌中长手与小口交替出现的砌法。 | `data/processed_questions/2022_専門1_建筑构法_Q3.md:57` — チ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン | `data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | masonry | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 masonry，不能放入当前 RC 躯体施工／纳まり模板。 |
### 98. 耐震・制震・免震の違い

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| エクスパンションジョイント | 为防止地震时局部大力而使建筑结构分离的构件。 | `data/processed_questions/2022_専門1_建筑构法_Q3.md:57` — スランプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン | `data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | interior_or_other | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 interior_or_other，不能放入当前 RC 躯体施工／纳まり模板。 |
### 102. 地盤調査・地盤改良・山留め

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| サウンディング | 户建住宅简易地盘调查的瑞典式试验名称。 | `data/processed_questions/2022_専門1_建筑构法_Q3.md:55` — ，継ぎ手，マリオン，スランプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン | `data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | underground_work | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 underground_work，不能放入当前 RC 躯体施工／纳まり模板。 |

| 山留 | 支撑根切侧面的地下施工术语。 | `data/processed_questions/2022_専門1_建筑构法_Q3.md:55` — える壁を（S）壁と呼ぶ。 - 地震時に部分的に大きな力が働くのを防ぐため，建物に（T）を設けて，構造的に切り離す。 # 【用語群】 胴縁，山留，幅木，継ぎ手，マリオン，スランプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，<br>`data/processed_questions/2026_専門1_建筑构法_Q3.md:37` — り縁） (3) 木造のあり継ぎとかま継ぎ (4) ガラスの合わせガラスと複層ガラス (5) タイルのいも目地と馬目地 (6) 地下工事の山留め壁と切り梁 (7) 瓦葺きの本瓦葺きと桟瓦葺き (8) 木質系材料の CLT と集成材 | `data/construction-exam-answers.json` → 2026_専門1_建筑构法_Q3.md#s06: 山留め壁は掘削周囲の土を保持して崩壊や変形を防ぐ壁。切り梁は向かい合う山留め壁の間に渡し、土圧による変形を内側から支える水平材。<br>`data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | underground_work | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 underground_work，不能放入当前 RC 躯体施工／纳まり模板。 |
### 110. 土台・柱・横架材

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| フーチング | 布基础底部加宽的部分。 | `data/processed_questions/2022_専門1_建筑构法_Q3.md:55` — 用語群】 胴縁，山留，幅木，継ぎ手，マリオン，スランプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン | `data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | foundation_work | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `duplicate` — 与 seed term「フーチング」重复，不能新增。 |

| ハンチ | 柱梁接合部的三角形补强部分；原题未限定为 RC。 | `data/processed_questions/2022_専門1_建筑构法_Q3.md:55` — 力が働くのを防ぐため，建物に（T）を設けて，構造的に切り離す。 # 【用語群】 胴縁，山留，幅木，継ぎ手，マリオン，スランプ，シース，ラス，ハンチ，CFT，CLT，ALC，LCC，MPG，SSG，デッキプレート，フーチング，ウェルポイント，サウンディング， エクスパンションジョイント，フレミッシュ，スパンドレル，ガスケット，ブラケット，ダイアフラム，キーストーン | `data/construction-exam-answers.json` → 2022_専門1_建筑构法_Q3.md#s01: A サウンディング B SSG C CFT D ALC E フレミッシュ F シース G フーチング H スランプ I ラス J マリオン K 幅木 L LCC M ガスケット N ブラケット O デッキプレート P キーストーン Q 継ぎ手 R ハンチ S 山留 T エクスパンションジョイント | 未找到以该术语为实体／值的 Atomic Fact。 | joint_reinforcement | interior_or_other | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 interior_or_other，不能放入当前 RC 躯体施工／纳まり模板。 |
### 111. 棟木・母屋・垂木・野地板

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| 棟木 | 小屋组图示标注；可读来源未单独展开定义。 | `data/processed_questions/2016_専門1_建筑构法_Q2.md:38` — 垂木</td><td>b</td><td>鴨居</td><td>c</td><td>小梁</td></tr><tr><td>d</td><td>棟木</td><td>e</td><td>桁</td><td>f</td><td>母屋</td></tr><tr><td>g</td><td>梁</td><td>h</td><td>合掌</td><td>i</td><td>方づえ</td></tr><tr><td>j | `data/construction-exam-answers.json` → 2016_専門1_建筑构法_Q2.md#s02: 1 棟木 2 母屋 3 垂木 4 桁 5 方づえ 6 梁 7 真束 | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | timber_roof | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 timber_roof，不能放入当前 RC 躯体施工／纳まり模板。 |

| 母屋 | 小屋组图示标注；可读来源未单独展开定义。 | `data/processed_questions/2016_専門1_建筑构法_Q2.md:38` — >小梁</td></tr><tr><td>d</td><td>棟木</td><td>e</td><td>桁</td><td>f</td><td>母屋</td></tr><tr><td>g</td><td>梁</td><td>h</td><td>合掌</td><td>i</td><td>方づえ</td></tr><tr><td>j</td><td>真束</td><td>k</td><td>野地</td><td><br>`data/processed_questions/2019_専門1_建筑构法_Q3.md:77` — よる建築構法」、市ヶ谷出版社、2014 年 # B 群 せき板，野地板，キープレート，ベースプレート，デッキプレート，スプライスプレート，母屋，下屋, 無目，垂木，蝶番，スチフナ，セパレーター，フォームタイ，マリオン，ダイアフラム，スパンドレル，スカラップ，ターンバックル | `data/construction-exam-answers.json` → 2019_専門1_建筑构法_Q3.md#s02: k 野地板 l 垂木 m 母屋 n フォームタイ o セパレーター p せき板 q ダイアフラム r スカラップ s マリオン t 無目<br>`data/construction-exam-answers.json` → 2016_専門1_建筑构法_Q2.md#s02: 1 棟木 2 母屋 3 垂木 4 桁 5 方づえ 6 梁 7 真束 | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | timber_roof | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 timber_roof，不能放入当前 RC 躯体施工／纳まり模板。 |

| 垂木 | 小屋组图示标注；可读来源未单独展开定义。 | `data/processed_questions/2014_専門1_建筑构法_Q3.md:35` — の両側にのみ流れをもつ屋根形式。 9) 縦に重ね葺した平瓦の列の間に丸瓦をかぶせ葺する、古代に大陸から伝えられ一般化した瓦葺構法。 10) 垂木のような木材を野地板の上に打ち付け、その間を U 字型に金属板で葺いた金属板葺構法。 (2) 下記の説明文が示す建築材料、試験法等を言い表す用語を答えよ。 11) フレッシュコンクリートにおいて、材料の分離を起こさないで打ち込み、締固め、仕上げるなどの、作業の<br>`data/processed_questions/2016_専門1_建筑构法_Q2.md:38` — 112045744128_b5b799e5a23a.jpg) 表 2 <table><tbody><tr><td>a</td><td>垂木</td><td>b</td><td>鴨居</td><td>c</td><td>小梁</td></tr><tr><td>d</td><td>棟木</td><td>e</td><td>桁</td><td>f</td><td>母屋</td></tr><tr><td>g<br>`data/processed_questions/2018_専門1_建筑构法_Q3.md:36` — ・鉄サッシの詳細・室内側・室外側・杭地業・独立基礎・布基礎・挽き板・大引き・単板・柱・根太・真束・PC 鋼棒・溶接・方立・継手・火打土台・土台・垂木・妻面・梁・繋梁・ガラス・トラス<br>`data/processed_questions/2019_専門1_建筑构法_Q3.md:77` — 谷出版社、2014 年 # B 群 せき板，野地板，キープレート，ベースプレート，デッキプレート，スプライスプレート，母屋，下屋, 無目，垂木，蝶番，スチフナ，セパレーター，フォームタイ，マリオン，ダイアフラム，スパンドレル，スカラップ，ターンバックル | `data/construction-exam-answers.json` → 2019_専門1_建筑构法_Q3.md#s02: k 野地板 l 垂木 m 母屋 n フォームタイ o セパレーター p せき板 q ダイアフラム r スカラップ s マリオン t 無目<br>`data/construction-exam-answers.json` → 2016_専門1_建筑构法_Q2.md#s02: 1 棟木 2 母屋 3 垂木 4 桁 5 方づえ 6 梁 7 真束 | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | timber_roof | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 timber_roof，不能放入当前 RC 躯体施工／纳まり模板。 |

| 野地板 | 小屋组图示标注；可读来源未单独展开定义。 | `data/processed_questions/2014_専門1_建筑构法_Q3.md:35` — もつ屋根形式。 9) 縦に重ね葺した平瓦の列の間に丸瓦をかぶせ葺する、古代に大陸から伝えられ一般化した瓦葺構法。 10) 垂木のような木材を野地板の上に打ち付け、その間を U 字型に金属板で葺いた金属板葺構法。 (2) 下記の説明文が示す建築材料、試験法等を言い表す用語を答えよ。 11) フレッシュコンクリートにおいて、材料の分離を起こさないで打ち込み、締固め、仕上げるなどの、作業のしやすさの程度。 <br>`data/processed_questions/2019_専門1_建筑构法_Q3.md:77` — pg) （カーテンウォール） 出典：松村秀一（他）「3D図解による建築構法」、市ヶ谷出版社、2014 年 # B 群 せき板，野地板，キープレート，ベースプレート，デッキプレート，スプライスプレート，母屋，下屋, 無目，垂木，蝶番，スチフナ，セパレーター，フォームタイ，マリオン，ダイアフラム，スパンドレル，スカラップ，ターンバックル | `data/construction-exam-answers.json` → 2019_専門1_建筑构法_Q3.md#s02: k 野地板 l 垂木 m 母屋 n フォームタイ o セパレーター p せき板 q ダイアフラム r スカラップ s マリオン t 無目 | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | timber_roof | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 timber_roof，不能放入当前 RC 躯体施工／纳まり模板。 |
### 127. 木造小屋組・屋根の基本

| Split term | independent_definition | source_file / source_location / source_excerpt | indexed_answer | Atomic Fact | relation_type | compatible_domain | distractor_constraints | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

| 本瓦葺き | 屋面瓦铺法；原题要求与桟瓦葺き对照说明。 | `data/processed_questions/2026_専門1_建筑构法_Q3.md:39` — ま継ぎ (4) ガラスの合わせガラスと複層ガラス (5) タイルのいも目地と馬目地 (6) 地下工事の山留め壁と切り梁 (7) 瓦葺きの本瓦葺きと桟瓦葺き (8) 木質系材料の CLT と集成材 | `data/construction-exam-answers.json` → 2026_専門1_建筑构法_Q3.md#s07: 本瓦葺きは丸瓦と平瓦を組み合わせて葺く伝統的な工法で重量が大きい。桟瓦葺きは桟のある瓦を瓦桟に掛けて葺く工法で、施工性が高く一般的である。<br>`data/construction-exam-answers.json` → 2014_専門1_建筑构法_Q3.md#s09: 本瓦葺き | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | roofing | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 roofing，不能放入当前 RC 躯体施工／纳まり模板。 |

| 桟瓦葺き | 屋面瓦铺法；原题要求与本瓦葺き对照说明。 | `data/processed_questions/2024_専門1_建筑构法_Q3.md:23` —  \times$ 【e. $10^{-6}$, $10^{-5}$, $10^{-4}$, $10^{-3}$】/K 程度である。 ・ 屋根を桟瓦葺きとする場合の勾配は最低でも【f. 2, 4, 8, 16】寸程度必要である。 ・ ツーバイフォー構法の間柱は一般に【g. 150, 450, 900, 1800】mm 間隔程度に設置する。 ・ 既存建物のデザインを保存しつつ耐震性能を向上させるために、基礎部な<br>`data/processed_questions/2026_専門1_建筑构法_Q3.md:39` — (4) ガラスの合わせガラスと複層ガラス (5) タイルのいも目地と馬目地 (6) 地下工事の山留め壁と切り梁 (7) 瓦葺きの本瓦葺きと桟瓦葺き (8) 木質系材料の CLT と集成材 | `data/construction-exam-answers.json` → 2026_専門1_建筑构法_Q3.md#s07: 本瓦葺きは丸瓦と平瓦を組み合わせて葺く伝統的な工法で重量が大きい。桟瓦葺きは桟のある瓦を瓦桟に掛けて葺く工法で、施工性が高く一般的である。 | 未找到以该术语为实体／值的 Atomic Fact。 | term_definition | roofing | 当前 RC seed pool 不可用；保留至对应题域独立池后，再定义同域 surplus。 | `incompatible_domain` — 来源支持该术语，但 compatible_domain 为 roofing，不能放入当前 RC 躯体施工／纳まり模板。 |

## Deferred compatible-domain registry (not seed-pool facts)

These retain valid evidence as future domain-specific candidates. They must not be mixed into the current RC word bank, and none enables a new generator by itself.

| Term | compatible_domain | Status |
| --- | --- | --- |
| 山留め壁と切り梁 | `underground_work` | 已有 2026 Specialist 1 原题及答案索引定义；当前 RC 词库不兼容，保留为地下工事候选。 |
| カーテンウォール | `curtain_wall_glazing` | E 类：外墙／玻璃题域。 |
| シェル構造 | `long_span_structure` | E 类：大跨度结构题域。 |
| スケルトン・インフィル | `renovation_industrialization` | E 类：改修／工業化题域。 |
| ダイアフラム | `steel_member` | E 类：钢构部件题域。 |
| 高力ボルト接合 | `steel_connection` | E 类：钢构连接题域。 |
| 土台 | `timber_frame` | E 类：木构题域。 |
| 普通ボルト接合 | `steel_connection` | E 类：钢构连接题域。 |
| 方づえ | `timber_frame` | E 类：木构题域。 |
| 洋小屋 | `timber_roof` | E 类：木构屋架题域。 |
| 和小屋 | `timber_roof` | E 类：木构屋架题域。 |
