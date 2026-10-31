# SEO 監査の結果

このファイルは `npm run seo:audit` が書き出します（手で直さない）。作成日：2026-10-31

- 調べたページ：96（検索結果に出すページ：81）
- ビルドの種類：本番 URL なし（全ページ noindex のビルド）。canonical と index / noindex は、ページの一覧（lib/routes.ts）の設定で代用
- 検索語の割り当て：94 ページ／これから書く題材 43 件／候補 245 件（ほかに、給湯器専門サイトに任せた題材 18 件・候補 94 件、練馬区の太陽光発電・蓄電池のサイトに任せた題材 4 件・候補 51 件）
- **誤り：0 件**／注意：1 件

## 誤り（直すまで公開しない）

ありません。

## 注意（確かめて、必要なら直す）

- title が近いページ（0.87）：/blog/category/exterior-painting「「外壁塗装」のコラム一覧｜住宅設備コラム｜横浜総合住設」と /blog/category/roof-painting「「屋根塗装」のコラム一覧｜住宅設備コラム｜横浜総合住設」

## 検索語の割り当て（どの検索語を、どの URL で取りにいくか）

1つの検索意図は、1つの URL だけが担当します。表の元は `data/seo-keyword-map.ts`（トップ・案内・地域・サービス）、
`data/works.ts` の keyword（施工事例）、記事の frontmatter の keywords（コラム）です。

| URL | 種類 | 主キーワード | 副キーワード | 検索意図 | 親ページ | 関連サービス | 関連する事例 | 関連する記事 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | トップ | 横浜総合住設 | ヨコジュウ、株式会社横浜総合住設、横浜 総合住宅設備会社 | 会社を名前で探している／戸塚区で、住まいの工事をまとめて頼める会社かどうかを知りたい | — | — | — | — |
| /area | 一覧・案内 | 横浜総合住設 対応エリア | 住宅設備工事 対応エリア 神奈川 東京 | 自分の住んでいる地域に来てもらえるかを知りたい | / | — | — | — |
| /service | 一覧・案内 | 横浜総合住設 事業内容 | 横浜総合住設 サービス一覧、住宅設備工事 種類 | この会社に何を頼めるのかを、一覧で知りたい | / | — | — | — |
| /works | 施工事例一覧 | 横浜総合住設 施工事例 | 住宅設備 施工事例 横浜、横浜総合住設 実績 | この会社が実際にどんな工事をしているのかを、写真で確かめたい | / | — | — | — |
| /blog | コラム一覧 | 住宅設備 コラム | 横浜総合住設 コラム | 設備の選び方・交換の時期・制度について、読みものを探している | / | — | — | — |
| /company | 会社 | 横浜総合住設 会社概要 | 横浜総合住設 所在地、横浜総合住設 戸塚オフィス、横浜総合住設 代表、横浜総合住設 代表挨拶 | 会社の所在地・連絡先・事業内容と、代表の考えを確かめたい | / | — | — | — |
| /business | 案内 | 住宅設備 協力業者 横浜 | 設備工事 協力会社 神奈川、工務店 設備工事 依頼、ハウスメーカー 設備工事 外注 | 工務店・法人として、設備工事を任せられる協力先を探している | / | — | — | — |
| /contact | 案内 | 横浜総合住設 問い合わせ | 横浜総合住設 見積もり 依頼、横浜総合住設 LINE | 見積もり・相談を、電話・LINE・フォームで申し込みたい | / | — | — | — |
| /faq | 案内 | 横浜総合住設 よくある質問 | 住宅設備工事 見積もり 無料 質問 | 見積もり・対応エリア・補助金など、頼む前の疑問を確かめたい | / | — | — | — |
| /flow | 案内 | 住宅設備 工事の流れ | 現地調査 見積もり 流れ、横浜総合住設 工事の流れ | 問い合わせてから工事が終わるまで、何がどの順に進むのかを知りたい | / | — | — | — |
| /privacy | 案内 | 横浜総合住設 プライバシーポリシー |  | 個人情報の取り扱いを確かめたい | / | — | — | — |
| /area/totsuka | 地域 | 戸塚区 住宅設備 | 横浜市戸塚区 住宅設備、戸塚区 住宅設備工事、戸塚区 住宅設備 業者 | 戸塚区で、住宅設備の工事を頼める地元の会社と、この地域の住まいならではの注意点を知りたい | /area | water-heater、ecocute、air-conditioner、exterior-painting、roof-painting、solar、storage-battery、toilet、reform、garden | — | 3 |
| /area/yokohama | 地域 | 横浜市 住宅設備 | 横浜市 住宅設備工事、横浜市 住宅設備 補助制度、横浜市 省エネ設備 ポイント還元 | 横浜市で住宅設備の工事を頼める会社と、市の支援制度を知りたい | /area | ecocute、solar、reform、air-conditioner | — | 2 |
| /service/air-conditioner | サービス | 戸塚区 エアコン工事 | 戸塚区 エアコン取り付け、戸塚区 エアコン交換、横浜市 エアコン工事、エアコン 高所 工事、業務用エアコン 横浜 | 戸塚区・横浜市で、エアコンの取り付け・交換（高所や取り付けにくい場所を含む）を頼める会社を探している | /service | other、water-heater、reform、solar | 6 | 5 |
| /service/demolition | サービス | リフォーム 解体工事 | 内装解体 横浜、戸塚区 解体 リフォーム、キッチン 浴室 解体 撤去、戸塚区 解体工事 | リフォームに伴う解体（内装・設備の撤去）を、工事と合わせて頼みたい。※建物をまるごと壊す解体は対応していないことを、ページの冒頭で伝える | /service | reform、toilet、kitchen-equipment、garden | — | 2 |
| /service/eco-one | サービス | 横浜総合住設 ECO ONE | ヨコジュウ エコワン、ECO ONE 床暖房 つなぎ替え | 横浜総合住設に、ECO ONE（ハイブリッド給湯暖房）の設置を、床暖房や浴室暖房乾燥機とのつなぎ込みまで含めて頼めるかを知りたい | /service | water-heater、ene-farm、solar、storage-battery | — | 5 |
| /service/ecocute | サービス | 横浜総合住設 エコキュート | ヨコジュウ エコキュート、エコキュート 太陽光 同時 設置 | 横浜総合住設に、エコキュートの交換・新設を、基礎・電気の工事や太陽光発電とあわせて頼めるかを知りたい | /service | water-heater、eco-one、solar、storage-battery | — | 4 |
| /service/ene-farm | サービス | 横浜総合住設 エネファーム | エネファーム 撤去 床暖房 つなぎ替え | 横浜総合住設に、エネファームの撤去と、床暖房・浴室乾燥機のつなぎ替えを含めた取り替えを頼めるかを知りたい | /service | water-heater、eco-one、storage-battery、other | — | 4 |
| /service/exterior-painting | サービス | 戸塚区 外壁塗装 | 横浜市戸塚区 外壁塗装、横浜市 外壁塗装、戸塚区 外壁 塗り替え、戸塚区 外壁塗装 見積もり | 戸塚区・横浜市で、外壁の塗り替えを頼める会社と、塗り替えの判断材料を知りたい | /service | roof-painting、solar、reform、garden | 2 | 5 |
| /service/garden | サービス | 戸塚区 外構工事 | 戸塚区 外構、戸塚区 造園、戸塚区 庭木 剪定、戸塚区 ウッドデッキ、横浜市 庭木 伐採 | 戸塚区・横浜市で、庭木の手入れや外構の工事を頼める会社を探している | /service | exterior-painting、reform、demolition、other | 1 | 2 |
| /service/kitchen-equipment | サービス | 戸塚区 ビルトインコンロ 交換 | 戸塚区 レンジフード 交換、横浜市 ガスコンロ 交換、レンジフード 交換 費用、ビルトインコンロ 交換 費用 | 戸塚区・横浜市で、ビルトインコンロやレンジフードの交換を頼める会社を探している | /service | reform、water-heater、toilet、other | 1 | 5 |
| /service/other | サービス | 浴室暖房乾燥機 交換 横浜 | 戸塚区 浴室暖房乾燥機、カップボード 設置 横浜、水栓 交換 戸塚区 | 浴室暖房乾燥機・カップボード・水栓・配線など、専用のページが無い設備の工事を頼めるかを知りたい | /service | water-heater、air-conditioner、reform、window | 2 | 2 |
| /service/reform | サービス | 戸塚区 リフォーム | 横浜市戸塚区 リフォーム会社、戸塚区 キッチンリフォーム、戸塚区 浴室リフォーム、戸塚区 水まわりリフォーム、戸塚区 内装リフォーム | 戸塚区で、水まわりや内装のリフォームをまとめて頼める会社を探している | /service | window、tatami、toilet、kitchen-equipment、demolition、other | 5 | 5 |
| /service/roof-painting | サービス | 戸塚区 屋根塗装 | 横浜市 屋根塗装、戸塚区 屋根 塗り替え、屋根塗装 費用、屋根塗装 時期、スレート屋根 塗装 | 戸塚区・横浜市で、屋根の塗り替えを頼める会社と、塗装が要るかどうかの判断材料を知りたい | /service | exterior-painting、solar、storage-battery、reform | 1 | 5 |
| /service/solar | サービス | 戸塚区 太陽光発電 | 戸塚区 太陽光、横浜市 太陽光発電 設置、戸塚区 太陽光パネル 設置 | 戸塚区・横浜市で、太陽光発電の設置を頼める会社と、屋根の条件・制度を知りたい | /service | storage-battery、exterior-painting、eco-one、water-heater | — | 1 |
| /service/storage-battery | サービス | 戸塚区 蓄電池 | 横浜市 蓄電池 設置、戸塚区 家庭用蓄電池、蓄電池 設置 工事 | 戸塚区・横浜市で、家庭用蓄電池の設置を頼める会社と、選び方・制度を知りたい | /service | solar、eco-one、water-heater、ene-farm | — | 1 |
| /service/tatami | サービス | 戸塚区 畳 張り替え | 横浜市 畳 張り替え、戸塚区 襖 張り替え、戸塚区 畳 表替え、琉球畳 張り替え 横浜 | 戸塚区・横浜市で、畳や襖の張り替え（琉球畳への張り替えを含む）を頼める会社と、張り替えの方法の違いを知りたい | /service | reform、window、air-conditioner、other | 1 | 1 |
| /service/toilet | サービス | 戸塚区 トイレ交換 | 戸塚区 トイレリフォーム、横浜市 トイレ交換、トイレ 交換 費用、トイレ 水漏れ 交換 | 戸塚区・横浜市で、便器の交換やトイレのリフォームを頼める会社を探している | /service | reform、kitchen-equipment、other、water-heater | — | 4 |
| /service/water-heater | サービス | 横浜総合住設 給湯器 | ヨコジュウ 給湯器、給湯器 交換 浴室リフォーム 同時 | 横浜総合住設に、ガス給湯器（エコジョーズを含む）の交換を、ほかの住まいの工事とあわせて頼めるかを知りたい | /service | ecocute、ene-farm、eco-one、kitchen-equipment | 1 | 5 |
| /service/window | サービス | 内窓 設置 戸塚区 | 横浜市 内窓 設置、戸塚区 窓 交換、横浜市 窓 交換、窓リフォーム 戸塚区 | 戸塚区・横浜市で、内窓の設置や窓の取り替えを頼める会社と、内窓と取り替えの違い・使える補助制度を知りたい | /service | reform、tatami、other、air-conditioner | — | 2 |
| /works/service/air-conditioner | サービス別の事例一覧 | エアコン 施工事例 |  | エアコンの工事の実例を、まとめて見たい | /works | air-conditioner | 6 | 4 |
| /works/service/reform | サービス別の事例一覧 | 住宅リフォーム 施工事例 |  | 住宅リフォームの工事の実例を、まとめて見たい | /works | reform | 3 | 4 |
| /works/air-conditioning-pipe-lagging | 施工事例 | 空調配管 ラッキングカバー 施工事例 |  | 「空調配管のラッキングカバー施工」の工事の内容と、施工前後の写真を見たい | /works/service/air-conditioner | air-conditioner | 5 | 3 |
| /works/aircon-ceiling-unit-replacement | 施工事例 | 天井 エアコン 壁掛け 取り替え 施工事例 |  | 「特殊な形のエアコンからの取り替え ── 天井に付いた室内機を、壁掛けに」の工事の内容と、施工前後の写真を見たい | /works/service/air-conditioner | air-conditioner | 5 | 3 |
| /works/aircon-high-place-replacement | 施工事例 | エアコン 高所 取替 施工事例 |  | 「他社で断られた、高所でのエアコン取替」の工事の内容と、施工前後の写真を見たい | /works/service/air-conditioner | air-conditioner | 5 | 3 |
| /works/aircon-replace-decorative-cover | 施工事例 | エアコン 取替 化粧カバー 施工事例 |  | 「エアコン取替工事 ── 配管を化粧テープ仕上げから化粧カバー仕上げへ」の工事の内容と、施工前後の写真を見たい | /works/service/air-conditioner | air-conditioner | 5 | 3 |
| /works/aircon-replace-two-units | 施工事例 | エアコン 2台 取替 施工事例 |  | 「エアコン取替工事（2台）── 室内機・室外機の入れ替え」の工事の内容と、施工前後の写真を見たい | /works/service/air-conditioner | air-conditioner | 5 | 3 |
| /works/attic-wiring | 施工事例 | 屋根裏 配線 施工事例 |  | 「屋根裏に配線を通す工事」の工事の内容と、施工前後の写真を見たい | /works | other | 1 | 1 |
| /works/balcony-high-pressure-washing | 施工事例 | マンション ベランダ 高圧洗浄 施工事例 |  | 「マンションのベランダの高圧洗浄」の工事の内容と、施工前後の写真を見たい | /works | exterior-painting | 1 | 3 |
| /works/bathroom-heater-dryer-rinnai | 施工事例 | リンナイ 浴室暖房乾燥機 交換 施工事例 |  | 「リンナイの浴室暖房乾燥機の施工」の工事の内容と、施工前後の写真を見たい | /works | other、reform | 1 | 3 |
| /works/cupboard-installation | 施工事例 | カップボード 設置 施工事例 |  | 「キッチンのカップボード設置 ── 施工前から完成まで」の工事の内容と、施工前後の写真を見たい | /works/service/reform | reform、kitchen-equipment | 2 | 3 |
| /works/exterior-roof-painting-process | 施工事例 | 外壁塗装 屋根塗装 施工事例 |  | 「外壁塗装・屋根塗装 ── 施工の工程をご紹介」の工事の内容と、施工前後の写真を見たい | /works | exterior-painting、roof-painting | 1 | 3 |
| /works/gas-aircon-replacement | 施工事例 | ガスエアコン 取り替え 施工事例 |  | 「ガスエアコンからの取り替え」の工事の内容と、施工前後の写真を見たい | /works/service/air-conditioner | air-conditioner | 5 | 3 |
| /works/tatami-ryukyu-replacement | 施工事例 | 琉球畳 張り替え 施工事例 |  | 「縁のある畳から、琉球畳への張り替え」の工事の内容と、施工前後の写真を見たい | /works | tatami、reform | — | 2 |
| /works/unit-bath-reform | 施工事例 | ユニットバス リフォーム 施工事例 |  | 「ユニットバスリフォーム ── 壁と天井を外し、新しい浴槽を据えるまで」の工事の内容と、施工前後の写真を見たい | /works/service/reform | reform | 2 | 3 |
| /works/washroom-creation | 施工事例 | 洗面所 新設 施工事例 |  | 「洗面所をつくる工事 ── 木のカウンターと角形の洗面ボウル」の工事の内容と、施工前後の写真を見たい | /works/service/reform | reform | 2 | 3 |
| /works/water-heater-flue-replacement | 施工事例 | 給湯器 煙突 交換 施工事例 |  | 「煙突（排気筒）付きの給湯器の交換」の工事の内容と、施工前後の写真を見たい | /works | water-heater | — | 3 |
| /works/wood-deck-installation | 施工事例 | ウッドデッキ 設置 施工事例 |  | 「ウッドデッキの設置 ── 整地から完成まで」の工事の内容と、施工前後の写真を見たい | /works | garden | — | 1 |
| /blog/aircon-installation-pre-check | コラム | エアコン 取り付け 事前 確認 | エアコン 専用コンセント、エアコン 室外機 置き場所、エアコン 配管穴、エアコン 配管 経路 | エアコンを取り付ける前に確認しておくことを知りたい | /service/air-conditioner | air-conditioner | 3 | 3 |
| /blog/aircon-pipe-lagging-cover | コラム | 空調配管 ラッキング とは | ラッキングカバー、エアコン 配管 保温材、エアコン 配管 化粧カバー 違い | 空調配管のラッキングカバーとは何かを知りたい | /service/air-conditioner | air-conditioner | 3 | 3 |
| /blog/aircon-pipe-tape-or-cover | コラム | エアコン 化粧カバー | エアコン 配管 テープ 劣化、エアコン 化粧カバー 必要、エアコン 配管 カバー 後付け | エアコンの配管の化粧テープと化粧カバーの違いと選び方を知りたい | /service/air-conditioner | air-conditioner | 3 | 3 |
| /blog/aircon-work-refused-high-place | コラム | エアコン 高所 断られた | エアコン 取替 断られた、エアコン 室外機 高所、エアコン 足場、エアコン 交換 相談 | エアコン工事を高所だからと断られたときの対処を知りたい | /service/air-conditioner | air-conditioner | 3 | 3 |
| /blog/bathroom-heater-dryer-replacement | コラム | 浴室暖房乾燥機 交換 目安 | 浴室暖房乾燥機 10年、浴室暖房乾燥機 ガス温水式 電気式、浴室暖房乾燥機 リモコン 交換、浴室暖房乾燥機 交換 確認 | 浴室暖房乾燥機の交換の目安と確認点を知りたい | /service | other、reform | 2 | 3 |
| /blog/builtin-stove-width-60-or-75 | コラム | ビルトインコンロ 60cm 75cm 違い | ビルトインコンロ 幅、ビルトインコンロ 天板、ビルトインコンロ ガスの種類、ビルトインコンロ 交換 確認 | ビルトインコンロの幅60cmと75cmの違いを知りたい | /service/kitchen-equipment | kitchen-equipment | 1 | 3 |
| /blog/cupboard-installation-checkpoints | コラム | カップボード 設置 確認 | カップボード 吊り戸棚 下地、カップボード コンセント、カップボード 搬入、キッチン 収納 リフォーム | カップボードを設置する前の確認点を知りたい | /service/kitchen-equipment | reform、kitchen-equipment | 3 | 3 |
| /blog/ecocute-tank-capacity-choice | コラム | エコキュート 容量 選び方 | エコキュート タンク容量、エコキュート 370リットル、エコキュート 薄型、エコキュート 家族 人数 | エコキュートのタンク容量の選び方を知りたい | /service/ecocute | ecocute | — | 3 |
| /blog/ecojozu-drain-water-yokohama | コラム | エコジョーズ ドレン排水 | エコジョーズ 横浜市、エコジョーズ ドレン 雨水、エコジョーズ 交換 注意 | 横浜市でエコジョーズを設置するときのドレン排水の扱いを知りたい | /area/yokohama | water-heater | 1 | 3 |
| /blog/ene-farm-replacement-checkpoints | コラム | エネファーム 交換 前 確認 | エネファーム 床暖房 交換後、エネファーム 20年 停止、エネファーム 搬出 | エネファームを別の給湯器に取り替える前に確認すべき点を知りたい | /service/ene-farm | ene-farm、water-heater、eco-one | — | 3 |
| /blog/exterior-painting-estimate-reading | コラム | 外壁塗装 見積書 見方 | 外壁塗装 見積もり 一式、外壁塗装 塗料 見積書、外壁塗装 見積もり 比較 | 外壁塗装の見積書の見方を知りたい | /service/exterior-painting | exterior-painting | 2 | 3 |
| /blog/exterior-painting-three-coats | コラム | 外壁塗装 3回塗り | 下塗り 中塗り 上塗り 違い、外壁塗装 工程、外壁塗装 手抜き 見分け方 | 外壁塗装の下塗り・中塗り・上塗りの役割と3回塗りの理由を知りたい | /service/exterior-painting | exterior-painting、roof-painting | 2 | 3 |
| /blog/exterior-wall-chalking-check | コラム | 外壁 チョーキング | 外壁 白い粉、外壁 劣化 サイン、外壁塗装 塗り替え 判断 | 外壁のチョーキングの確かめ方と意味を知りたい | /service/exterior-painting | exterior-painting | 2 | 3 |
| /blog/exterior-wall-crack-repair-needed | コラム | 外壁 ひび割れ 補修 | 外壁 ひび割れ 放置、外壁 ひび 雨水、外壁塗装 下地補修、モルタル外壁 ひび割れ | 外壁のひび割れは補修が必要かを知りたい | /service/exterior-painting | exterior-painting | 2 | 3 |
| /blog/gas-to-ecocute-switch-work | コラム | ガス給湯器 エコキュート 切り替え 工事 | ガス給湯器 エコキュート 交換、エコキュート 基礎 アンカーボルト、エコキュート 200V 電源工事、エコキュート 排水 配管 | ガス給湯器からエコキュートに替える工事の内容を知りたい | /service/ecocute | ecocute、water-heater | — | 3 |
| /blog/kyutou-shoene-2026-outline | コラム | 給湯省エネ2026事業 | 給湯省エネ事業 補助額、給湯省エネ事業 申請 条件、ハイブリッド給湯器 補助金 | 給湯省エネ2026事業の補助額と申請の条件を知りたい | /area/yokohama | ecocute、eco-one、ene-farm | — | 3 |
| /blog/range-hood-deep-or-slim | コラム | レンジフード 深型 薄型 違い | レンジフード 交換 幕板、レンジフード 排気 向き、レンジフード 吊り戸棚、薄型レンジフード 掃除 | レンジフードの深型と薄型の違いを知りたい | /service/kitchen-equipment | kitchen-equipment | 1 | 3 |
| /blog/reform-asbestos-pre-survey | コラム | リフォーム 石綿 事前調査 | アスベスト 事前調査 リフォーム、石綿 事前調査 報告、石綿 事前調査 講習、設備工事 石綿 調査 | リフォームでの石綿の事前調査の決まりを知りたい | /service/demolition | demolition、reform | — | 3 |
| /blog/reform-priority-order | コラム | リフォーム 優先順位 | リフォーム どこから、リフォーム 順番、リフォーム まとめて工事 | リフォームの優先順位の付け方を知りたい | /service/reform | reform | 3 | 3 |
| /blog/roof-and-wall-painting-together | コラム | 屋根 外壁 塗装 同時 | 屋根塗装 外壁塗装 足場、外壁塗装 付帯部、雨どい 破風 塗装 | 屋根と外壁の塗装を同時にする利点を知りたい | /service/roof-painting | roof-painting、exterior-painting | 1 | 3 |
| /blog/roof-color-fading-urgent-or-not | コラム | 屋根 色あせ 塗装 必要 | 屋根 色あせ、スレート屋根 色あせ、屋根 訪問業者 塗装、屋根 点検 | 屋根の色あせは急いで塗装すべきかを知りたい | /service/roof-painting | roof-painting | 1 | 3 |
| /blog/roof-leak-not-fixed-by-painting | コラム | 雨漏り 屋根塗装 直らない | 雨漏り 原因 屋根、屋根 釘 浮き、スレート 割れ 補修、屋根 補修 塗装 順番 | 雨漏りが屋根の塗装で直るのかを知りたい | /service/roof-painting | roof-painting | 1 | 3 |
| /blog/roof-painting-engiri-taspacer | コラム | 屋根塗装 縁切り タスペーサー | 縁切り 屋根、タスペーサー、スレート屋根 雨漏り 塗装、屋根塗装 見積書 | 屋根塗装の縁切りとは何か、なぜ必要かを知りたい | /service/roof-painting | roof-painting | 1 | 3 |
| /blog/stove-and-range-hood-together | コラム | コンロ レンジフード 同時交換 | コンロ 換気扇 連動、レンジフード 交換 注意、ビルトインコンロ 交換 タイミング | コンロとレンジフードを同時に交換する利点を知りたい | /service/kitchen-equipment | kitchen-equipment | 1 | 3 |
| /blog/toilet-drain-position-check | コラム | トイレ 排水芯 | トイレ 交換 排水 位置、床排水 壁排水 見分け方、リフォーム用 便器 | トイレ交換の前に排水芯を確認する方法と合う便器の選び方を知りたい | /service/toilet | toilet、reform | — | 3 |
| /blog/toilet-types-three-kinds | コラム | 便器 種類 違い | 組み合わせ便器、一体型トイレ、タンクレストイレ、トイレ 選び方 | 便器の種類の違いを知りたい | /service/toilet | toilet | — | 3 |
| /blog/totsuka-ecocute-carry-in-route | コラム | エコキュート 搬入経路 | 戸塚区 エコキュート 搬入、エコキュート 基礎 重さ、エコキュート 階段 搬入 | 戸塚区の家にエコキュートを設置できるかどうかの確認点を知りたい | /area/totsuka | ecocute、eco-one | — | 3 |
| /blog/water-heater-capacity-guide | コラム | 給湯器 号数 | 給湯器 20号 24号 違い、給湯器 号数 選び方、給湯器 能力 | 給湯器の号数の意味と自分の家に合う号数の選び方を知りたい | /service/water-heater | water-heater | 1 | 3 |
| /blog/water-heater-replacement-signs | コラム | 給湯器 交換時期 | 給湯器 故障 サイン、給湯器 寿命、給湯器 エラー | 給湯器の交換時期の目安と故障の前ぶれを知りたい | /service/water-heater | water-heater、eco-one | 1 | 3 |
| /blog/wood-deck-foundation-steps | コラム | ウッドデッキ 下地 | ウッドデッキ 束石、ウッドデッキ 防草シート、ウッドデッキ 施工 手順 | ウッドデッキを設置するときの下地づくりの手順と役割を知りたい | /service/garden | garden | 1 | 3 |
| /blog/category/air-conditioner | コラムのカテゴリ | エアコン コラム |  | エアコンについての記事を、まとめて読みたい | /blog | air-conditioner | — | 4 |
| /blog/category/demolition（noindex） | コラムのカテゴリ | 解体 コラム |  | 解体についての記事を、まとめて読みたい | /blog | demolition | — | 1 |
| /blog/category/ecocute（noindex） | コラムのカテゴリ | エコキュート コラム |  | エコキュートについての記事を、まとめて読みたい | /blog | ecocute | — | 2 |
| /blog/category/ene-farm（noindex） | コラムのカテゴリ | エネファーム コラム |  | エネファームについての記事を、まとめて読みたい | /blog | ene-farm | — | 1 |
| /blog/category/exterior-painting | コラムのカテゴリ | 外壁塗装 コラム |  | 外壁塗装についての記事を、まとめて読みたい | /blog | exterior-painting | — | 4 |
| /blog/category/garden（noindex） | コラムのカテゴリ | 造園 コラム |  | 造園についての記事を、まとめて読みたい | /blog | garden | — | 1 |
| /blog/category/housing-equipment（noindex） | コラムのカテゴリ | その他の設備 コラム |  | その他の設備についての記事を、まとめて読みたい | /blog | — | — | 1 |
| /blog/category/kitchen（noindex） | コラムのカテゴリ | キッチン コラム |  | キッチンについての記事を、まとめて読みたい | /blog | kitchen-equipment | — | 2 |
| /blog/category/range-hood（noindex） | コラムのカテゴリ | レンジフード コラム |  | レンジフードについての記事を、まとめて読みたい | /blog | kitchen-equipment | — | 2 |
| /blog/category/reform（noindex） | コラムのカテゴリ | リフォーム コラム |  | リフォームについての記事を、まとめて読みたい | /blog | reform | — | 1 |
| /blog/category/roof-painting | コラムのカテゴリ | 屋根塗装 コラム |  | 屋根塗装についての記事を、まとめて読みたい | /blog | roof-painting | — | 4 |
| /blog/category/subsidy（noindex） | コラムのカテゴリ | 補助金 コラム |  | 補助金についての記事を、まとめて読みたい | /blog | — | — | 1 |
| /blog/category/toilet（noindex） | コラムのカテゴリ | トイレ コラム |  | トイレについての記事を、まとめて読みたい | /blog | toilet | — | 2 |
| /blog/category/totsuka（noindex） | コラムのカテゴリ | 戸塚区 コラム |  | 戸塚区についての記事を、まとめて読みたい | /blog | — | — | 1 |
| /blog/category/water-heater（noindex） | コラムのカテゴリ | 給湯器 コラム |  | 給湯器についての記事を、まとめて読みたい | /blog | water-heater | — | 2 |
| /blog/category/yokohama（noindex） | コラムのカテゴリ | 横浜市 コラム |  | 横浜市についての記事を、まとめて読みたい | /blog | — | — | 1 |

### 取り合いを避けるために、譲った検索語

| ページ | 取りにいかない検索語 | 担当のページ |
| --- | --- | --- |
| / | 戸塚区 住宅設備 | /area/totsuka |
| / | 戸塚区 リフォーム | /service/reform |
| / | 戸塚区 給湯器交換 | https://www.yokoju-boiler.com/area/totsuka |
| / | 戸塚区 エアコン工事 | /service/air-conditioner |
| /area/totsuka | 戸塚区 リフォーム | /service/reform |
| /area/totsuka | 戸塚区 給湯器交換 | https://www.yokoju-boiler.com/area/totsuka |
| /area/totsuka | 戸塚区 エコキュート | https://www.yokoju-boiler.com/area/totsuka |
| /area/totsuka | 戸塚区 エアコン工事 | /service/air-conditioner |
| /area/totsuka | 戸塚区 外壁塗装 | /service/exterior-painting |
| /area/yokohama | 横浜市 給湯器交換 | https://www.yokoju-boiler.com/area/yokohama |
| /area/yokohama | 横浜市 外壁塗装 | /service/exterior-painting |
| /area/yokohama | 横浜市 エコキュート | https://www.yokoju-boiler.com/ecocute |
| /service/air-conditioner | エアコン 化粧カバー | /blog/aircon-pipe-tape-or-cover |
| /service/eco-one | ECO ONE 設置 | https://www.yokoju-boiler.com/hybrid |
| /service/eco-one | ハイブリッド給湯器 横浜 | https://www.yokoju-boiler.com/hybrid |
| /service/eco-one | ECO ONE 補助金 | https://www.yokoju-boiler.com/subsidy/eco-one |
| /service/ecocute | 戸塚区 エコキュート | https://www.yokoju-boiler.com/area/totsuka |
| /service/ecocute | 横浜市 エコキュート | https://www.yokoju-boiler.com/ecocute |
| /service/ecocute | エコキュート 交換 | https://www.yokoju-boiler.com/ecocute |
| /service/ecocute | エコキュート 補助金 | https://www.yokoju-boiler.com/subsidy/ecocute |
| /service/ecocute | エコキュート 搬入経路 | /blog/totsuka-ecocute-carry-in-route |
| /service/ecocute | 給湯省エネ2026事業 | /blog/kyutou-shoene-2026-outline |
| /service/ene-farm | エネファーム 交換 | https://www.yokoju-boiler.com/ene-farm |
| /service/ene-farm | エネファーム 補助金 | https://www.yokoju-boiler.com/subsidy/ene-farm |
| /service/exterior-painting | 戸塚区 屋根塗装 | /service/roof-painting |
| /service/exterior-painting | 外壁塗装 3回塗り | /blog/exterior-painting-three-coats |
| /service/other | 戸塚区 住宅設備工事 | /area/totsuka |
| /service/other | 内窓 設置 戸塚区 | /service/window |
| /service/reform | 戸塚区 トイレリフォーム | /service/toilet |
| /service/reform | リフォーム 解体工事 | /service/demolition |
| /service/roof-painting | 戸塚区 外壁塗装 | /service/exterior-painting |
| /service/solar | 練馬区 太陽光発電 | https://www.yokoju-solar.com |
| /service/solar | 練馬区 太陽光 補助金 | https://www.yokoju-solar.com/subsidy |
| /service/solar | 太陽光 屋根 方角 影 | https://www.yokoju-solar.com/solar |
| /service/solar | 太陽光 自家消費 売電 | https://www.yokoju-solar.com/solar |
| /service/storage-battery | 練馬区 蓄電池 | https://www.yokoju-solar.com/battery |
| /service/storage-battery | 家庭用蓄電池 全負荷 特定負荷 | https://www.yokoju-solar.com/battery |
| /service/storage-battery | 既設 太陽光 蓄電池 追加 | https://www.yokoju-solar.com/solar-battery |
| /service/toilet | トイレ 排水芯 | /blog/toilet-drain-position-check |
| /service/water-heater | 戸塚区 給湯器交換 | https://www.yokoju-boiler.com/area/totsuka |
| /service/water-heater | 横浜市 給湯器交換 | https://www.yokoju-boiler.com/area/yokohama |
| /service/water-heater | ガス給湯器 交換 | https://www.yokoju-boiler.com/gas-water-heater |
| /service/water-heater | エコジョーズ 交換 | https://www.yokoju-boiler.com/eco-jozu |
| /service/water-heater | 給湯器 補助金 | https://www.yokoju-boiler.com/subsidy |
| /service/water-heater | ヨコジュウ エコキュート | /service/ecocute |
| /service/water-heater | 横浜総合住設 エネファーム | /service/ene-farm |
| /service/water-heater | 給湯器 交換時期 | /blog/water-heater-replacement-signs |
| /service/water-heater | 給湯器 号数 | /blog/water-heater-capacity-guide |

## ページごとの一覧

「本文のリンク」は、本文（ヘッダー・フッターを除く）からサイト内へ出しているリンクの行き先の数。「被リンク」は、ほかのページの本文からリンクされている数。

| URL | index | title（全角換算の字数） | description の字数 | h1 | h2 | 構造化データ | 本文のリンク | 被リンク | 画像（alt なし） | 本文の字数 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | ○ | 横浜総合住設｜横浜市戸塚区の住宅設備・リフォーム会社（26） | 105.5 | 横浜市 戸塚区 の住宅設備・リフォーム 株式会社 横浜総合住設 | 11 | （共通のみ） | 40 | 95 | 58（0） | 5995 |
| /area | ○ | 対応エリア｜横浜市戸塚区を中心に神奈川・東京｜横浜総合住設（29） | 87 | 戸塚区を中心に、 横浜市全域・神奈川・東京へ。 | 5 | BreadcrumbList | 4 | 19 | 5（0） | 1176 |
| /area/totsuka | ○ | 横浜市戸塚区の住宅設備・リフォーム｜横浜総合住設（24） | 103 | 横浜市戸塚区の 住宅設備・ リフォーム | 10 | BreadcrumbList、FAQPage | 23 | 24 | 9（0） | 4230 |
| /area/yokohama | ○ | 横浜市の住宅設備・リフォーム｜対応エリアと支援制度（25） | 111 | 横浜市の 住宅設備・ リフォーム | 10 | BreadcrumbList、FAQPage | 16 | 7 | 9（0） | 3913 |
| /blog | ○ | 住宅設備コラム｜交換時期・選び方・費用の考え方｜横浜総合住設（30） | 95 | 住宅設備コラム | 13 | BreadcrumbList、ItemList | 33 | 49 | 16（0） | 2055 |
| /blog/aircon-installation-pre-check | ○ | エアコン取り付けの事前確認。穴・コンセント・室外機・配管（28） | 93 | エアコン取り付けの 事前確認。 穴・ コンセント・ 室外機・ 配管 | 11 | BlogPosting、BreadcrumbList、FAQPage | 15 | 13 | 8（0） | 3459 |
| /blog/aircon-pipe-lagging-cover | ○ | 空調配管のラッキングとは。屋外の配管を守る金属のカバー（27） | 90 | 空調配管の ラッキングとは。 屋外の 配管を 守る 金属の カバー | 11 | BlogPosting、BreadcrumbList、FAQPage | 16 | 12 | 8（0） | 3491 |
| /blog/aircon-pipe-tape-or-cover | ○ | エアコンの配管、化粧テープと化粧カバーの違い｜横浜総合住設（29） | 86 | エアコンの 配管、 化粧テープと 化粧カバーの 違い | 11 | BlogPosting、BreadcrumbList、FAQPage | 14 | 8 | 8（0） | 2486 |
| /blog/aircon-work-refused-high-place | ○ | エアコン取替を高所だから断られたら。相談前に確かめること（28） | 90 | エアコン取替を 高所だから 断られたら。 相談前に 確かめる こと | 13 | BlogPosting、BreadcrumbList、FAQPage | 15 | 13 | 8（0） | 3541 |
| /blog/bathroom-heater-dryer-replacement | ○ | 浴室暖房乾燥機の交換目安、リンナイは10年。替える前の確認点（29） | 85 | 浴室暖房乾燥機の 交換目安、 リンナイは 10年。 替える 前の 確認点 | 13 | BlogPosting、BreadcrumbList、FAQPage | 15 | 12 | 8（0） | 3664 |
| /blog/builtin-stove-width-60-or-75 | ○ | ビルトインコンロの60cmと75cmの違い、幅を変えて替えられる条件（30） | 96 | ビルトインコンロの 60cmと 75cmの 違い、 幅を 変えて 替えられる 条件 | 11 | BlogPosting、BreadcrumbList、FAQPage | 11 | 8 | 6（0） | 3218 |
| /blog/category/air-conditioner | ○ | 「エアコン」のコラム一覧｜住宅設備コラム｜横浜総合住設（27） | 81.5 | 「 エアコン 」のコラム | 5 | BreadcrumbList、ItemList | 24 | 23 | 8（0） | 902 |
| /blog/category/demolition | noindex | 「解体」のコラム一覧｜住宅設備コラム｜横浜総合住設（25） | 82.5 | 「 解体 」のコラム | 2 | BreadcrumbList、ItemList | 21 | 20 | 5（0） | 495 |
| /blog/category/ecocute | noindex | 「エコキュート」のコラム一覧｜住宅設備コラム｜横浜総合住設（29） | 86.5 | 「 エコキュート 」のコラム | 3 | BreadcrumbList、ItemList | 22 | 21 | 6（0） | 675 |
| /blog/category/ene-farm | noindex | 「エネファーム」のコラム一覧｜住宅設備コラム｜横浜総合住設（29） | 79.5 | 「 エネファーム 」のコラム | 2 | BreadcrumbList、ItemList | 21 | 20 | 5（0） | 503 |
| /blog/category/exterior-painting | ○ | 「外壁塗装」のコラム一覧｜住宅設備コラム｜横浜総合住設（27） | 83.5 | 「 外壁塗装 」のコラム | 5 | BreadcrumbList、ItemList | 24 | 23 | 8（0） | 889 |
| /blog/category/garden | noindex | 「造園」のコラム一覧｜住宅設備コラム｜横浜総合住設（25） | 82.5 | 「 造園 」のコラム | 2 | BreadcrumbList、ItemList | 21 | 20 | 5（0） | 482 |
| /blog/category/housing-equipment | noindex | 「その他の設備」のコラム一覧｜住宅設備コラム｜横浜総合住設（29） | 84.5 | 「 その他の設備 」のコラム | 2 | BreadcrumbList、ItemList | 21 | 21 | 5（0） | 511 |
| /blog/category/kitchen | noindex | 「キッチン」のコラム一覧｜住宅設備コラム｜横浜総合住設（27） | 84 | 「 キッチン 」のコラム | 3 | BreadcrumbList、ItemList | 22 | 21 | 6（0） | 665 |
| /blog/category/range-hood | noindex | 「レンジフード」のコラム一覧｜住宅設備コラム｜横浜総合住設（29） | 86.5 | 「 レンジフード 」のコラム | 3 | BreadcrumbList、ItemList | 22 | 20 | 6（0） | 680 |
| /blog/category/reform | noindex | 「リフォーム」のコラム一覧｜住宅設備コラム｜横浜総合住設（28） | 80.5 | 「 リフォーム 」のコラム | 2 | BreadcrumbList、ItemList | 21 | 21 | 5（0） | 522 |
| /blog/category/roof-painting | ○ | 「屋根塗装」のコラム一覧｜住宅設備コラム｜横浜総合住設（27） | 84.5 | 「 屋根塗装 」のコラム | 5 | BreadcrumbList、ItemList | 24 | 23 | 8（0） | 926 |
| /blog/category/subsidy | noindex | 「補助金」のコラム一覧｜住宅設備コラム｜横浜総合住設（26） | 83.5 | 「 補助金 」のコラム | 2 | BreadcrumbList、ItemList | 21 | 21 | 5（0） | 518 |
| /blog/category/toilet | noindex | 「トイレ」のコラム一覧｜住宅設備コラム｜横浜総合住設（26） | 83.5 | 「 トイレ 」のコラム | 3 | BreadcrumbList、ItemList | 22 | 21 | 6（0） | 648 |
| /blog/category/totsuka | noindex | 「戸塚区」のコラム一覧｜住宅設備コラム｜横浜総合住設（26） | 74.5 | 「 戸塚区 」のコラム | 2 | BreadcrumbList、ItemList | 21 | 20 | 5（0） | 504 |
| /blog/category/water-heater | noindex | 「給湯器」のコラム一覧｜住宅設備コラム｜横浜総合住設（26） | 83.5 | 「 給湯器 」のコラム | 3 | BreadcrumbList、ItemList | 22 | 22 | 6（0） | 632 |
| /blog/category/yokohama | noindex | 「横浜市」のコラム一覧｜住宅設備コラム｜横浜総合住設（26） | 74.5 | 「 横浜市 」のコラム | 2 | BreadcrumbList、ItemList | 21 | 20 | 5（0） | 495 |
| /blog/cupboard-installation-checkpoints | ○ | カップボード設置前の確認点。壁の下地・コンセント・天井と梁（29） | 88 | カップボード設置前の 確認点。 壁の 下地・ コンセント・ 天井と 梁 | 11 | BlogPosting、BreadcrumbList、FAQPage | 15 | 14 | 9（0） | 3417 |
| /blog/ecocute-tank-capacity-choice | ○ | エコキュートの容量の選び方。家族の人数とお湯の使い方で決める（30） | 97 | エコキュートの 容量の 選び方。 家族の 人数と お湯の 使い方で 決める | 12 | BlogPosting、BreadcrumbList、FAQPage | 11 | 6 | 6（0） | 3859 |
| /blog/ecojozu-drain-water-yokohama | ○ | エコジョーズのドレン排水、横浜市ではどこへ流す？｜横浜総合住設（31） | 84 | エコジョーズの ドレン排水、 横浜市では どこへ 流す？ | 12 | BlogPosting、BreadcrumbList、FAQPage | 13 | 9 | 7（0） | 2835 |
| /blog/ene-farm-replacement-checkpoints | ○ | エネファームから給湯器に替える前に確認する4つのこと（25.5） | 81.5 | エネファームから 給湯器に 替える 前に 確認する 4つの こと | 10 | BlogPosting、BreadcrumbList、FAQPage | 11 | 6 | 8（0） | 2804 |
| /blog/exterior-painting-estimate-reading | ○ | 外壁塗装の見積書の見方、「一式」が多いと比べにくい理由（27） | 95 | 外壁塗装の 見積書の 見方、 「一式」が 多いと 比べに くい理由 | 10 | BlogPosting、BreadcrumbList、FAQPage | 14 | 6 | 7（0） | 3292 |
| /blog/exterior-painting-three-coats | ○ | 外壁塗装の3回塗りとは？下塗り・中塗り・上塗りの役割（25.5） | 75.5 | 外壁塗装の 3回塗りとは？ 下塗り・ 中塗り・ 上塗りの 役割 | 12 | BlogPosting、BreadcrumbList、FAQPage | 13 | 9 | 8（0） | 2477 |
| /blog/exterior-wall-chalking-check | ○ | 外壁を触ると白い粉、チョーキングの確かめ方と塗り替えの判断（29） | 89 | 外壁を 触ると 白い 粉、 チョーキングの 確かめ方と 塗り替えの 判断 | 12 | BlogPosting、BreadcrumbList、FAQPage | 13 | 7 | 7（0） | 3460 |
| /blog/exterior-wall-crack-repair-needed | ○ | 外壁のひび割れ補修は必要か。様子を見てよいひびと補修が要るひび（31） | 85 | 外壁の ひび割れ補修は 必要か。 様子を 見てよい ひびと 補修が 要る ひび | 11 | BlogPosting、BreadcrumbList、FAQPage | 14 | 8 | 7（0） | 3574 |
| /blog/gas-to-ecocute-switch-work | ○ | ガス給湯器からエコキュートへの切り替え工事で行う5つのこと（28.5） | 97 | ガス給湯器から エコキュートへの 切り替え工事で 行う 5つの こと | 13 | BlogPosting、BreadcrumbList、FAQPage | 11 | 10 | 7（0） | 3909 |
| /blog/kyutou-shoene-2026-outline | ○ | 給湯省エネ2026事業の補助額と、申請の前に知っておくこと（27） | 91 | 給湯省エネ2026事業の 補助額と、 申請の 前に 知って おく こと | 11 | BlogPosting、BreadcrumbList、FAQPage | 12 | 10 | 8（0） | 2945 |
| /blog/page/2 | noindex | 住宅設備コラム（2ページ目）｜横浜総合住設（20.5） | 65.5 | 住宅設備コラム 2 ページ目 | 13 | BreadcrumbList、ItemList | 32 | 2 | 16（0） | 1963 |
| /blog/page/3 | noindex | 住宅設備コラム（3ページ目）｜横浜総合住設（20.5） | 65.5 | 住宅設備コラム 3 ページ目 | 7 | BreadcrumbList、ItemList | 26 | 2 | 10（0） | 1124 |
| /blog/range-hood-deep-or-slim | ○ | レンジフードの深型と薄型の違い、替えるときに要る幕板と確認点（30） | 96 | レンジフードの 深型と 薄型の 違い、 替える ときに 要る 幕板と 確認点 | 10 | BlogPosting、BreadcrumbList、FAQPage | 12 | 5 | 6（0） | 3235 |
| /blog/reform-asbestos-pre-survey | ○ | リフォームでも石綿の事前調査は必要。報告が要る工事と調査する人（31） | 90 | リフォームでも 石綿の 事前調査は 必要。 報告が 要る 工事と 調査する 人 | 11 | BlogPosting、BreadcrumbList、FAQPage | 12 | 12 | 6（0） | 3126 |
| /blog/reform-priority-order | ○ | リフォームの優先順位はどう決める？急ぐ工事とあとでよい工事（29） | 103 | リフォームの 優先順位は どう 決める？ 急ぐ 工事と あとで よい 工事 | 11 | BlogPosting、BreadcrumbList、FAQPage | 15 | 18 | 8（0） | 3946 |
| /blog/roof-and-wall-painting-together | ○ | 屋根と外壁の塗装を同時にする利点と、足場を一度で済ませる考え方（31） | 87 | 屋根と 外壁の 塗装を 同時に する 利点と、 足場を 一度で 済ませる 考え方 | 11 | BlogPosting、BreadcrumbList、FAQPage | 12 | 12 | 7（0） | 3209 |
| /blog/roof-color-fading-urgent-or-not | ○ | 屋根の色あせに塗装は必要か。メーカーの説明と急ぐべき傷み（28） | 102 | 屋根の 色あせに 塗装は 必要か。 メーカーの 説明と 急ぐべき傷み | 13 | BlogPosting、BreadcrumbList、FAQPage | 11 | 6 | 6（0） | 3917 |
| /blog/roof-leak-not-fixed-by-painting | ○ | 雨漏りは屋根塗装では直らない。塗る前に入り口を確かめる理由（29） | 92 | 雨漏りは 屋根塗装では 直らない。 塗る 前に 入り口を 確かめる 理由 | 13 | BlogPosting、BreadcrumbList、FAQPage | 12 | 6 | 6（0） | 3899 |
| /blog/roof-painting-engiri-taspacer | ○ | 屋根塗装の縁切りとタスペーサー、スレートの重なり目をふさがない理由（33） | 93 | 屋根塗装の 縁切りと タスペーサー、 スレートの 重なり目を ふさが ない 理由 | 12 | BlogPosting、BreadcrumbList、FAQPage | 12 | 5 | 6（0） | 3295 |
| /blog/stove-and-range-hood-together | ○ | コンロとレンジフードの同時交換、連動機能と工事が一度で済む利点（31） | 101 | コンロと レンジフードの 同時交換、 連動機能と 工事が 一度で 済む利点 | 11 | BlogPosting、BreadcrumbList、FAQPage | 12 | 9 | 6（0） | 3238 |
| /blog/toilet-drain-position-check | ○ | トイレ交換の前に確かめる排水芯とは？合う便器の見分け方（27） | 78 | トイレ交換の 前に 確かめる 排水芯とは？ 合う 便器の 見分け方 | 11 | BlogPosting、BreadcrumbList、FAQPage | 10 | 6 | 6（0） | 2449 |
| /blog/toilet-types-three-kinds | ○ | 便器の種類の違い。組み合わせ・一体型・タンクレスの選び方（28） | 106 | 便器の 種類の 違い。 組み合わせ・ 一体型・ タンクレスの 選び方 | 11 | BlogPosting、BreadcrumbList、FAQPage | 11 | 6 | 5（0） | 3442 |
| /blog/totsuka-ecocute-carry-in-route | ○ | エコキュートの搬入経路。戸塚区の高低差のある家で確かめること（30） | 83 | エコキュートの 搬入経路。 戸塚区の 高低差の ある 家で 確かめる こと | 11 | BlogPosting、BreadcrumbList、FAQPage | 11 | 9 | 7（0） | 2811 |
| /blog/water-heater-capacity-guide | ○ | 給湯器の号数とは？16号・20号・24号の違いと選び方｜横浜総合住設（31） | 79 | 給湯器の 号数とは？ 16号・ 20号・ 24号の 違いと 選び方 | 11 | BlogPosting、BreadcrumbList、FAQPage | 11 | 9 | 7（0） | 2559 |
| /blog/water-heater-replacement-signs | ○ | 給湯器の交換時期はいつ？故障の前に出る5つのサイン（24.5） | 85.5 | 給湯器の 交換時期は いつ？ 故障の 前に 出る 5つの サイン | 12 | BlogPosting、BreadcrumbList、FAQPage | 13 | 11 | 8（0） | 2710 |
| /blog/wood-deck-foundation-steps | ○ | ウッドデッキは下地で決まる。整地・防草シート・束石の役割（28） | 76.5 | ウッドデッキは 下地で 決まる。 整地・ 防草シート・ 束石の 役割 | 10 | BlogPosting、BreadcrumbList、FAQPage | 11 | 4 | 6（0） | 2318 |
| /business | ○ | 法人・工務店・ハウスメーカーの方へ｜設備工事の協力先（26） | 111 | 法人・ 工務店・ ハウスメーカーの 方へ | 6 | BreadcrumbList、FAQPage | 4 | 2 | 8（0） | 1961 |
| /company | ○ | 会社案内｜株式会社 横浜総合住設（15.5） | 98.5 | 会社案内 | 7 | BreadcrumbList | 23 | 31 | 9（0） | 2695 |
| /contact | ○ | お問い合わせ・無料見積もり｜横浜総合住設（20） | 112 | お問い合わせ・ 無料見積もり | 1 | BreadcrumbList | 3 | 95 | 4（0） | 1051 |
| /faq | ○ | よくある質問｜見積もり・対応エリア・補助金｜横浜総合住設（28） | 92 | よく ある 質問 | 7 | BreadcrumbList、FAQPage | 19 | 19 | 4（0） | 2202 |
| /flow | ○ | 工事の流れ｜お問い合わせから完了まで｜横浜総合住設（25） | 96 | 工事の 流れ | 10 | BreadcrumbList | 4 | 11 | 20（0） | 1427 |
| /privacy | ○ | プライバシーポリシー｜横浜総合住設（17） | 88.5 | プライバシーポリシー | 11 | BreadcrumbList | 2 | 1 | 2（0） | 1331 |
| /service | ○ | 事業内容・サービス一覧｜住宅設備からリフォームまで（25） | 105.5 | 事業内容・ サービス一覧 | 6 | BreadcrumbList、ItemList | 19 | 22 | 22（0） | 2020 |
| /service/air-conditioner | ○ | 戸塚区のエアコン工事｜取り付け・交換・高所作業｜横浜総合住設（30） | 108 | 横浜市戸塚区の エアコン工事 ── 取り付け・ 交換・ 修理 | 13 | BreadcrumbList、FAQPage、Service | 21 | 22 | 18（0） | 5501 |
| /service/demolition | ○ | リフォームに伴う解体工事｜横浜市戸塚区｜横浜総合住設（26） | 101 | リフォームに 伴う解体工事 | 11 | BreadcrumbList、FAQPage、Service | 13 | 8 | 12（0） | 3054 |
| /service/eco-one | ○ | ECO ONE（エコワン）の設置・交換｜横浜総合住設（22.5） | 99 | ECO ONE （エコワン）・ ハイブリッド給湯暖房の 設置 | 11 | BreadcrumbList、FAQPage、Service | 16 | 14 | 13（0） | 4301 |
| /service/ecocute | ○ | エコキュート交換・設置｜横浜総合住設（18） | 109 | エコキュート交換・ 設置 | 12 | BreadcrumbList、FAQPage、Service | 15 | 12 | 13（0） | 7090 |
| /service/ene-farm | ○ | エネファームから給湯器への交換・撤去｜横浜総合住設（25） | 109 | エネファームから 給湯器への 交換・ 撤去 | 12 | BreadcrumbList、FAQPage、Service | 15 | 10 | 14（0） | 4664 |
| /service/exterior-painting | ○ | 戸塚区の外壁塗装｜屋根塗装にも対応｜横浜総合住設（24） | 110 | 横浜市戸塚区の 外壁塗装 | 13 | BreadcrumbList、FAQPage、Service | 19 | 19 | 16（0） | 4124 |
| /service/garden | ○ | 戸塚区の造園・外構工事｜剪定・伐採・ウッドデッキ｜横浜総合住設（31） | 91 | 横浜市戸塚区の 造園・ 外構工事 | 12 | BreadcrumbList、FAQPage、Service | 15 | 10 | 16（0） | 2979 |
| /service/kitchen-equipment | ○ | 戸塚区のビルトインコンロ・レンジフード交換｜横浜総合住設（28） | 98 | 横浜市戸塚区の ビルトインコンロ・ レンジフード交換 | 11 | BreadcrumbList、FAQPage、Service | 18 | 15 | 14（0） | 3290 |
| /service/other | ○ | 浴室暖房乾燥機の交換・カップボード・水栓の工事｜横浜市戸塚区（30） | 108 | 横浜市戸塚区の 浴室暖房乾燥機の 交換・ カップボード・ 水栓の 工事 | 11 | BreadcrumbList、FAQPage、Service | 16 | 15 | 17（0） | 2965 |
| /service/reform | ○ | 戸塚区の住宅リフォーム｜キッチン・浴室・洗面・内装（25） | 92 | 横浜市戸塚区の 住宅リフォーム | 13 | BreadcrumbList、FAQPage、Service | 23 | 30 | 19（0） | 5395 |
| /service/roof-painting | ○ | 戸塚区の屋根塗装・屋根の塗り替え｜横浜総合住設（23） | 103 | 横浜市戸塚区の 屋根塗装 | 14 | BreadcrumbList、FAQPage、Service | 18 | 16 | 17（0） | 5183 |
| /service/solar | ○ | 戸塚区の太陽光発電の設置工事｜横浜総合住設（21） | 92 | 横浜市戸塚区の 太陽光発電の 設置工事 | 13 | BreadcrumbList、FAQPage、Service | 12 | 12 | 14（0） | 4788 |
| /service/storage-battery | ○ | 戸塚区の家庭用蓄電池の設置工事｜横浜総合住設（22） | 90 | 横浜市戸塚区の 家庭用蓄電池の 設置工事 | 11 | BreadcrumbList、FAQPage、Service | 12 | 10 | 13（0） | 4459 |
| /service/tatami | ○ | 畳・襖の張り替え｜横浜市戸塚区・琉球畳への張り替えも（26） | 98 | 横浜市戸塚区の 畳・ 襖の 張り替え | 10 | BreadcrumbList、FAQPage、Service | 14 | 7 | 13（0） | 2505 |
| /service/toilet | ○ | 戸塚区のトイレ交換・トイレリフォーム｜横浜総合住設（25） | 84 | 横浜市戸塚区の トイレ交換・ トイレリフォーム | 11 | BreadcrumbList、FAQPage、Service | 15 | 11 | 13（0） | 3758 |
| /service/water-heater | ○ | 給湯器交換（ガス給湯器・エコジョーズ）｜横浜総合住設（26） | 108 | 給湯器交換 （ガス給湯器・ エコジョーズ） | 11 | BreadcrumbList、FAQPage、Service | 18 | 22 | 14（0） | 5100 |
| /service/window | ○ | 内窓の設置・窓の交換｜横浜市戸塚区の窓リフォーム｜横浜総合住設（31） | 93 | 横浜市戸塚区の 内窓の 設置・ 窓の 交換 | 11 | BreadcrumbList、FAQPage、Service | 13 | 7 | 12（0） | 3461 |
| /works | ○ | 施工事例｜エアコン・浴室・畳・外壁塗装・ウッドデッキ（26） | 113 | 施工事例 | 4 | BreadcrumbList、ItemList | 22 | 52 | 20（0） | 1914 |
| /works/air-conditioning-pipe-lagging | ○ | 空調配管のラッキングカバー施工｜施工事例｜横浜総合住設（27） | 75 | 空調配管の ラッキングカバー施工 | 9 | Article、BreadcrumbList | 11 | 8 | 13（0） | 1263 |
| /works/aircon-ceiling-unit-replacement | ○ | 特殊な形のエアコンからの取り替え｜天井に付いた室内機を、壁掛けに｜施工事例（37） | 54 | 特殊な 形の エアコンからの 取り替え ── 天井に 付いた 室内機を、 壁掛けに | 7 | Article、BreadcrumbList | 11 | 18 | 9（0） | 1056 |
| /works/aircon-high-place-replacement | ○ | 他社で断られた、高所でのエアコン取替｜施工事例｜横浜総合住設（30） | 64 | 他社で 断られた、 高所での エアコン取替 | 8 | Article、BreadcrumbList | 11 | 12 | 8（0） | 1274 |
| /works/aircon-replace-decorative-cover | ○ | エアコン取替工事｜配管を化粧テープ仕上げから化粧カバー仕上げへ｜施工事例（36） | 62 | エアコン取替工事 ── 配管を 化粧テープ仕上げから 化粧カバー仕上げへ | 8 | Article、BreadcrumbList | 11 | 6 | 12（0） | 1265 |
| /works/aircon-replace-two-units | ○ | エアコン取替工事（2台）── 室内機・室外機の入れ替え｜施工事例（31） | 66.5 | エアコン取替工事 （2台） ── 室内機・ 室外機の 入れ替え | 8 | Article、BreadcrumbList | 11 | 3 | 16（0） | 1301 |
| /works/attic-wiring | ○ | 屋根裏に配線を通す工事｜施工事例｜横浜総合住設（23） | 83 | 屋根裏に 配線を 通す工事 | 6 | Article、BreadcrumbList | 8 | 4 | 7（0） | 959 |
| /works/balcony-high-pressure-washing | ○ | マンションのベランダの高圧洗浄｜施工事例｜横浜総合住設（27） | 63 | マンションの ベランダの 高圧洗浄 | 7 | Article、BreadcrumbList | 10 | 8 | 9（0） | 1105 |
| /works/bathroom-heater-dryer-rinnai | ○ | リンナイの浴室暖房乾燥機の施工｜施工事例｜横浜総合住設（27） | 64 | リンナイの 浴室暖房乾燥機の 施工 | 9 | Article、BreadcrumbList | 11 | 4 | 14（0） | 1330 |
| /works/cupboard-installation | ○ | キッチンのカップボード設置｜施工前から完成まで｜施工事例（28） | 74 | キッチンの カップボード設置 ── 施工前から 完成まで | 9 | Article、BreadcrumbList | 12 | 11 | 13（0） | 1392 |
| /works/exterior-roof-painting-process | ○ | 外壁塗装・屋根塗装｜施工の工程をご紹介｜施工事例｜横浜総合住設（31） | 74 | 外壁塗装・ 屋根塗装 ── 施工の 工程を ご紹介 | 8 | Article、BreadcrumbList | 11 | 12 | 9（0） | 1279 |
| /works/gas-aircon-replacement | ○ | ガスエアコンからの取り替え｜施工事例｜横浜総合住設（25） | 77 | ガスエアコンからの 取り替え | 8 | Article、BreadcrumbList | 11 | 16 | 10（0） | 1167 |
| /works/service/air-conditioner | ○ | エアコンの施工事例（6件）｜横浜総合住設（19.5） | 121 | エアコンの 施工事例 | 9 | BreadcrumbList、ItemList | 14 | 10 | 9（0） | 1121 |
| /works/service/reform | ○ | 住宅リフォームの施工事例（3件）｜横浜総合住設（22.5） | 110 | 住宅リフォームの 施工事例 | 6 | BreadcrumbList、ItemList | 11 | 5 | 6（0） | 914 |
| /works/tatami-ryukyu-replacement | ○ | 縁のある畳から、琉球畳への張り替え｜施工事例｜横浜総合住設（29） | 63 | 縁の ある 畳から、 琉球畳への 張り替え | 7 | Article、BreadcrumbList | 10 | 16 | 9（0） | 1048 |
| /works/unit-bath-reform | ○ | ユニットバスリフォーム｜壁と天井を外し、新しい浴槽を据えるまで｜施工事例（36） | 82 | ユニットバスリフォーム ── 壁と 天井を 外し、 新しい 浴槽を 据えるまで | 7 | Article、BreadcrumbList | 11 | 9 | 8（0） | 1206 |
| /works/washroom-creation | ○ | 洗面所をつくる工事｜木のカウンターと角形の洗面ボウル｜施工事例（31） | 72 | 洗面所を つくる 工事 ── 木の カウンターと 角形の 洗面ボウル | 7 | Article、BreadcrumbList | 11 | 18 | 8（0） | 1184 |
| /works/water-heater-flue-replacement | ○ | 煙突（排気筒）付きの給湯器の交換｜施工事例｜横浜総合住設（28） | 83 | 煙突 （排気筒） 付きの 給湯器の 交換 | 6 | Article、BreadcrumbList | 10 | 6 | 7（0） | 1004 |
| /works/wood-deck-installation | ○ | ウッドデッキの設置｜整地から完成まで｜施工事例｜横浜総合住設（30） | 67 | ウッドデッキの 設置 ── 整地から 完成まで | 9 | Article、BreadcrumbList | 8 | 4 | 12（0） | 1207 |

全ページ共通の構造化データ：Organization（法人）、HomeAndConstructionBusiness（戸塚オフィス）、WebSite。

## コラムのクラスター（カテゴリごとの本数）

「題材」は、すぐに書ける形で決めてあるもの（`lib/blog-generator/topics.ts`）。「候補」は、検索意図だけを洗い出してあるもの（`lib/blog-generator/backlog.ts`）。
給湯器の題材と候補は給湯器専門サイト（https://www.yokoju-boiler.com）、太陽光発電・蓄電池の一般的な題材と候補は練馬区の太陽光発電・蓄電池のサイト（https://www.yokoju-solar.com）の自動投稿が書くので、ここでは数えていません（`data/specialty.ts`）。

| カテゴリ | 親ページ | 公開済み | 題材（未公開） | 候補 | 合計 |
| --- | --- | --- | --- | --- | --- |
| 給湯器 | /service/water-heater | 2 | 0 | 0 | 2 |
| エコキュート | /service/ecocute | 2 | 0 | 0 | 2 |
| エネファーム | /service/ene-farm | 1 | 0 | 0 | 1 |
| ECO ONE | /service/eco-one | 0 | 0 | 0 | 0 |
| エアコン | /service/air-conditioner | 4 | 5 | 26 | 35 |
| トイレ | /service/toilet | 2 | 2 | 27 | 31 |
| キッチン | /service/kitchen-equipment | 2 | 1 | 15 | 18 |
| レンジフード | /service/kitchen-equipment | 2 | 0 | 11 | 13 |
| 外壁塗装 | /service/exterior-painting | 4 | 3 | 26 | 33 |
| 屋根塗装 | /service/roof-painting | 4 | 3 | 24 | 31 |
| 太陽光 | /service/solar | 0 | 0 | 2 | 2 |
| 蓄電池 | /service/storage-battery | 0 | 0 | 1 | 1 |
| リフォーム | /service/reform | 1 | 1 | 27 | 29 |
| 解体 | /service/demolition | 1 | 1 | 13 | 15 |
| 造園 | /service/garden | 1 | 2 | 27 | 30 |
| その他の設備 | /service | 1 | 2 | 22 | 25 |
| 補助金 | /area/yokohama | 1 | 3 | 8 | 12 |
| 横浜市 | /area/yokohama | 1 | 2 | 8 | 11 |
| 戸塚区 | /area/totsuka | 1 | 0 | 8 | 9 |

## これから書くコラムの順番

自動投稿が題材を選ぶ順番です（優先度 → 記事の少ないカテゴリ → 題材の並び）。公開済みの記事に見直す理由があるときは、
およそ3割の日が見直しに回るので、日付は前後します。

| 順 | 優先度 | カテゴリ | 主キーワード | 題名の方向 | 親ページ |
| --- | --- | --- | --- | --- | --- |
| 1 | P1 | リフォーム | マンション リフォーム 管理規約 確認 | マンションのリフォーム、最初に確かめる3つのこと | /service/reform |
| 2 | P1 | 造園 | 庭木 剪定 時期 | 庭木の剪定はいつ頼む？落葉樹と常緑樹で違う時期 | /service/garden |
| 3 | P1 | その他の設備 | 住宅設備 10年 点検 | 築10年で見直す住宅設備。給湯器・エアコン・コンロの目安 | /service |
| 4 | P1 | 補助金 | 内窓 補助金 2026 | 内窓の補助金。先進的窓リノベ2026事業の額と条件 | /area/yokohama |
| 5 | P1 | 横浜市 | 横浜グリーンエネルギーパートナーシップ ポイント還元 | 横浜市のポイント還元事業。太陽光・蓄電池・エコキュートの条件 | /area/yokohama |
| 6 | P1 | トイレ | トイレ交換 床 張り替え 同時 | トイレの床は、便器を替えるときに張り替える。同時にする理由 | /service/toilet |
| 7 | P1 | キッチン | ガスコンロ 安全装置 確認 | そのガスコンロ、安全装置は全部の口に付いている？2008年が境目 | /service/kitchen-equipment |
| 8 | P1 | 造園 | 庭 雑草対策 防草シート 砂利 | 草むしりを減らす。防草シートと砂利の敷き方 | /service/garden |
| 9 | P1 | その他の設備 | 内窓 効果 | 内窓を付けると何が変わる？結露・寒さ・音への効き方 | /service |
| 10 | P1 | 補助金 | 住宅設備 補助金 誰が申請 | 補助金は誰が申請する？国・神奈川県・横浜市で違う決まり | /area/yokohama |
| 11 | P1 | 横浜市 | 横浜市 断熱改修 補助 | 横浜市の断熱改修の補助。対象になる工事、ならない工事 | /area/yokohama |
| 12 | P1 | トイレ | タンクレストイレ 設置 条件 | タンクレストイレは、どの家にも付く？水圧と手洗いの確認 | /service/toilet |
| 13 | P1 | 補助金 | みらいエコ住宅2026 リフォーム 条件 | みらいエコ住宅2026事業、給湯器の交換だけでは使えない理由 | /area/yokohama |
| 14 | P1 | エアコン | エアコン 修理 交換 判断 | エアコンは修理か交換か。使った年数と症状で考える | /service/air-conditioner |
| 15 | P1 | 外壁塗装 | 外壁塗装 塗料 種類 | 外壁の塗料の選び方。次の塗り替えをいつにしたいかで決める | /service/exterior-painting |
| 16 | P1 | 屋根塗装 | 太陽光パネル 屋根塗装 順番 | 太陽光パネルを載せる前に、屋根は塗るべき？順番の考え方 | /service/roof-painting |
| 17 | P1 | エアコン | エアコン 室外機 置き方 | エアコンの室外機、置き方は5通り。置き場所で変わる工事の内容 | /service/air-conditioner |
| 18 | P1 | 屋根塗装 | 棟板金 釘 浮き | 屋根のてっぺんの板金の釘が浮いていると言われたら | /service/roof-painting |
| 19 | P1 | 外壁塗装 | 外壁 シーリング 打ち替え 増し打ち | 外壁の目地（シーリング）の打ち替えと増し打ちの違い | /service/exterior-painting |
| 20 | P1 | エアコン | エアコン 処分 横浜市 | 古いエアコンの処分、横浜市では粗大ごみに出せない。引き取りの流れ | /service/air-conditioner |
| 21 | P1 | 屋根塗装 | 屋根 点検 自分で | 屋根に上らずに、屋根の状態を確かめる方法 | /service/roof-painting |
| 22 | P1 | 外壁塗装 | 外壁塗装 付帯部 破風 雨どい | 外壁塗装の「付帯部」とは。破風・軒天・雨どいを一緒に塗る理由 | /service/exterior-painting |
| 23 | P1 | エアコン | エアコン 室内機 水漏れ 原因 | エアコンの室内機から水が落ちる。原因と、連絡の前に見ること | /service/air-conditioner |
| 24 | P2 | 解体 | リフォーム 解体 範囲 | リフォームの解体は、どこまで壊す？取れる壁と取れない壁 | /service/demolition |
| 25 | P2 | エアコン | 業務用エアコン フロン 回収 | 業務用エアコンの入れ替えとフロンの回収。廃棄のときの決まり | /service/air-conditioner |

