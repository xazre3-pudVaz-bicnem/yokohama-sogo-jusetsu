# SEO 監査の結果

このファイルは `npm run seo:audit` が書き出します（手で直さない）。作成日：2026-10-09

- 調べたページ：56（検索結果に出すページ：47）
- ビルドの種類：本番 URL なし（全ページ noindex のビルド）。canonical と index / noindex は、ページの一覧（lib/routes.ts）の設定で代用
- 検索語の割り当て：56 ページ／これから書く題材 65 件／候補 390 件
- **誤り：0 件**／注意：2 件

## 誤り（直すまで公開しない）

ありません。

## 注意（確かめて、必要なら直す）

- /blog/wood-deck-foundation-steps … ほかの記事へのリンクが2本未満です（記事が増えたら、関連記事を足す）
- /blog/exterior-painting-three-coats … ほかの記事へのリンクが2本未満です（記事が増えたら、関連記事を足す）

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
| /area/totsuka | 地域 | 戸塚区 住宅設備 | 横浜市戸塚区 住宅設備、戸塚区 住宅設備工事、戸塚区 住宅設備 業者 | 戸塚区で、住宅設備の工事を頼める地元の会社と、この地域の住まいならではの注意点を知りたい | /area | water-heater、ecocute、air-conditioner、exterior-painting、roof-painting、solar、storage-battery、toilet、reform、garden | — | 2 |
| /area/yokohama | 地域 | 横浜市 住宅設備 | 横浜市 住宅設備工事、横浜市 住宅設備 補助制度、横浜市 省エネ設備 ポイント還元 | 横浜市で住宅設備の工事を頼める会社と、市の支援制度を知りたい | /area | ecocute、solar、reform、air-conditioner | — | 2 |
| /service/air-conditioner | サービス | 戸塚区 エアコン工事 | 戸塚区 エアコン取り付け、戸塚区 エアコン交換、横浜市 エアコン工事、エアコン 高所 工事、業務用エアコン 横浜 | 戸塚区・横浜市で、エアコンの取り付け・交換（高所や取り付けにくい場所を含む）を頼める会社を探している | /service | other、water-heater、reform、solar | 4 | 2 |
| /service/demolition | サービス | リフォーム 解体工事 | 内装解体 横浜、戸塚区 解体 リフォーム、キッチン 浴室 解体 撤去、戸塚区 解体工事 | リフォームに伴う解体（内装・設備の撤去）を、工事と合わせて頼みたい。※建物をまるごと壊す解体は対応していないことを、ページの冒頭で伝える | /service | reform、toilet、kitchen-equipment、garden | — | — |
| /service/eco-one | サービス | ECO ONE 設置 | エコワン 交換、ハイブリッド給湯器 横浜、戸塚区 エコワン、ECO ONE 補助金、リンナイ ハイブリッド給湯器 設置 | ECO ONE（ハイブリッド給湯器）の仕組みと、自分の家に向くか、設置を頼める会社を知りたい | /service | water-heater、ene-farm、solar、storage-battery | — | 5 |
| /service/ecocute | サービス | 戸塚区 エコキュート | 戸塚区 エコキュート交換、横浜市 エコキュート、エコキュート 交換、エコキュート 設置場所、エコキュート 費用、エコキュート 故障、エコキュート 補助金 | 戸塚区・横浜市で、エコキュートの交換・新設を頼める会社と、設置できる条件・補助金を知りたい | /service | water-heater、eco-one、solar、storage-battery | — | 2 |
| /service/ene-farm | サービス | エネファーム 交換 | エネファーム 撤去、エネファーム 給湯器 交換、横浜 エネファーム 撤去、戸塚区 エネファーム、エネファーム やめる | エネファームをやめて、別の給湯器に取り替えたい。撤去まで頼める会社を探している | /service | water-heater、eco-one、storage-battery、other | — | 4 |
| /service/exterior-painting | サービス | 戸塚区 外壁塗装 | 横浜市戸塚区 外壁塗装、横浜市 外壁塗装、戸塚区 外壁 塗り替え、戸塚区 外壁塗装 見積もり | 戸塚区・横浜市で、外壁の塗り替えを頼める会社と、塗り替えの判断材料を知りたい | /service | roof-painting、solar、reform、garden | 1 | 2 |
| /service/garden | サービス | 戸塚区 外構工事 | 戸塚区 外構、戸塚区 造園、戸塚区 庭木 剪定、戸塚区 ウッドデッキ、横浜市 庭木 伐採 | 戸塚区・横浜市で、庭木の手入れや外構の工事を頼める会社を探している | /service | exterior-painting、reform、demolition、other | 1 | 2 |
| /service/kitchen-equipment | サービス | 戸塚区 ビルトインコンロ 交換 | 戸塚区 レンジフード 交換、横浜市 ガスコンロ 交換、レンジフード 交換 費用、ビルトインコンロ 交換 費用 | 戸塚区・横浜市で、ビルトインコンロやレンジフードの交換を頼める会社を探している | /service | reform、water-heater、toilet、other | 1 | — |
| /service/other | サービス | 浴室暖房乾燥機 交換 横浜 | 戸塚区 浴室暖房乾燥機、内窓 設置 戸塚区、カップボード 設置 横浜、水栓 交換 戸塚区 | 浴室暖房乾燥機・内窓・水栓など、専用のページが無い設備の工事を頼めるかを知りたい | /service | water-heater、air-conditioner、reform、kitchen-equipment | 1 | 1 |
| /service/reform | サービス | 戸塚区 リフォーム | 横浜市戸塚区 リフォーム会社、戸塚区 キッチンリフォーム、戸塚区 浴室リフォーム、戸塚区 水まわりリフォーム、戸塚区 内装リフォーム | 戸塚区で、水まわりや内装のリフォームをまとめて頼める会社を探している | /service | toilet、kitchen-equipment、demolition、other | 2 | 1 |
| /service/roof-painting | サービス | 戸塚区 屋根塗装 | 横浜市 屋根塗装、戸塚区 屋根 塗り替え、屋根塗装 費用、屋根塗装 時期、スレート屋根 塗装 | 戸塚区・横浜市で、屋根の塗り替えを頼める会社と、塗装が要るかどうかの判断材料を知りたい | /service | exterior-painting、solar、storage-battery、reform | 1 | 1 |
| /service/solar | サービス | 戸塚区 太陽光発電 | 戸塚区 太陽光、横浜市 太陽光発電 設置、戸塚区 太陽光パネル 設置 | 戸塚区・横浜市で、太陽光発電の設置を頼める会社と、屋根の条件・制度を知りたい | /service | storage-battery、exterior-painting、eco-one、water-heater | — | 1 |
| /service/storage-battery | サービス | 戸塚区 蓄電池 | 横浜市 蓄電池 設置、戸塚区 家庭用蓄電池、蓄電池 設置 工事 | 戸塚区・横浜市で、家庭用蓄電池の設置を頼める会社と、選び方・制度を知りたい | /service | solar、eco-one、water-heater、ene-farm | — | 1 |
| /service/toilet | サービス | 戸塚区 トイレ交換 | 戸塚区 トイレリフォーム、横浜市 トイレ交換、トイレ 交換 費用、トイレ 水漏れ 交換 | 戸塚区・横浜市で、便器の交換やトイレのリフォームを頼める会社を探している | /service | reform、kitchen-equipment、other、water-heater | — | 1 |
| /service/water-heater | サービス | 戸塚区 給湯器交換 | 戸塚区 給湯器、横浜市 給湯器交換、ガス給湯器 交換、エコジョーズ 交換、戸塚区 給湯器 交換 費用 | 戸塚区・横浜市で、ガス給湯器（エコジョーズを含む）の交換を頼める会社と、交換の判断材料を知りたい | /service | ecocute、ene-farm、eco-one、kitchen-equipment | — | 5 |
| /works/service/air-conditioner | サービス別の事例一覧 | エアコン 施工事例 |  | エアコンの工事の実例を、まとめて見たい | /works | air-conditioner | 4 | 1 |
| /works/air-conditioning-pipe-lagging | 施工事例 | 空調配管 ラッキングカバー 施工事例 |  | 「空調配管のラッキングカバー施工」の工事の内容と、施工前後の写真を見たい | /works/service/air-conditioner | air-conditioner | 3 | 1 |
| /works/aircon-high-place-replacement | 施工事例 | エアコン 高所 取替 施工事例 |  | 「他社で断られた、高所でのエアコン取替」の工事の内容と、施工前後の写真を見たい | /works/service/air-conditioner | air-conditioner | 3 | 1 |
| /works/aircon-replace-decorative-cover | 施工事例 | エアコン 取替 化粧カバー 施工事例 |  | 「エアコン取替工事 ── 配管を化粧テープ仕上げから化粧カバー仕上げへ」の工事の内容と、施工前後の写真を見たい | /works/service/air-conditioner | air-conditioner | 3 | 1 |
| /works/aircon-replace-two-units | 施工事例 | エアコン 2台 取替 施工事例 |  | 「エアコン取替工事（2台）── 室内機・室外機の入れ替え」の工事の内容と、施工前後の写真を見たい | /works/service/air-conditioner | air-conditioner | 3 | 1 |
| /works/bathroom-heater-dryer-rinnai | 施工事例 | リンナイ 浴室暖房乾燥機 交換 施工事例 |  | 「リンナイの浴室暖房乾燥機の施工」の工事の内容と、施工前後の写真を見たい | /works | other、reform | — | — |
| /works/cupboard-installation | 施工事例 | カップボード 設置 施工事例 |  | 「キッチンのカップボード設置 ── 施工前から完成まで」の工事の内容と、施工前後の写真を見たい | /works | reform、kitchen-equipment | — | — |
| /works/exterior-roof-painting-process | 施工事例 | 外壁塗装 屋根塗装 施工事例 |  | 「外壁塗装・屋根塗装 ── 施工の工程をご紹介」の工事の内容と、施工前後の写真を見たい | /works | exterior-painting、roof-painting | — | 1 |
| /works/wood-deck-installation | 施工事例 | ウッドデッキ 設置 施工事例 |  | 「ウッドデッキの設置 ── 整地から完成まで」の工事の内容と、施工前後の写真を見たい | /works | garden | — | 1 |
| /blog/aircon-pipe-tape-or-cover | コラム | エアコン 化粧カバー | エアコン 配管 テープ 劣化、エアコン 化粧カバー 必要、エアコン 配管 カバー 後付け | エアコンの配管の化粧テープと化粧カバーの違いと選び方を知りたい | /service/air-conditioner | air-conditioner | 3 | 3 |
| /blog/ecojozu-drain-water-yokohama | コラム | エコジョーズ ドレン排水 | エコジョーズ 横浜市、エコジョーズ ドレン 雨水、エコジョーズ 交換 注意 | 横浜市でエコジョーズを設置するときのドレン排水の扱いを知りたい | /area/yokohama | water-heater | — | 3 |
| /blog/ene-farm-replacement-checkpoints | コラム | エネファーム 交換 前 確認 | エネファーム 床暖房 交換後、エネファーム 20年 停止、エネファーム 搬出 | エネファームを別の給湯器に取り替える前に確認すべき点を知りたい | /service/ene-farm | ene-farm、water-heater、eco-one | — | 3 |
| /blog/exterior-painting-three-coats | コラム | 外壁塗装 3回塗り | 下塗り 中塗り 上塗り 違い、外壁塗装 工程、外壁塗装 手抜き 見分け方 | 外壁塗装の下塗り・中塗り・上塗りの役割と3回塗りの理由を知りたい | /service/exterior-painting | exterior-painting、roof-painting | 1 | 1 |
| /blog/kyutou-shoene-2026-outline | コラム | 給湯省エネ2026事業 | 給湯省エネ事業 補助額、給湯省エネ事業 申請 条件、ハイブリッド給湯器 補助金 | 給湯省エネ2026事業の補助額と申請の条件を知りたい | /area/yokohama | ecocute、eco-one、ene-farm | — | 3 |
| /blog/toilet-drain-position-check | コラム | トイレ 排水芯 | トイレ 交換 排水 位置、床排水 壁排水 見分け方、リフォーム用 便器 | トイレ交換の前に排水芯を確認する方法と合う便器の選び方を知りたい | /service/toilet | toilet、reform | — | 3 |
| /blog/totsuka-ecocute-carry-in-route | コラム | エコキュート 搬入経路 | 戸塚区 エコキュート 搬入、エコキュート 基礎 重さ、エコキュート 階段 搬入 | 戸塚区の家にエコキュートを設置できるかどうかの確認点を知りたい | /area/totsuka | ecocute、eco-one | — | 3 |
| /blog/water-heater-capacity-guide | コラム | 給湯器 号数 | 給湯器 20号 24号 違い、給湯器 号数 選び方、給湯器 能力 | 給湯器の号数の意味と自分の家に合う号数の選び方を知りたい | /service/water-heater | water-heater | — | 3 |
| /blog/water-heater-replacement-signs | コラム | 給湯器 交換時期 | 給湯器 故障 サイン、給湯器 寿命、給湯器 エラー | 給湯器の交換時期の目安と故障の前ぶれを知りたい | /service/water-heater | water-heater、eco-one | — | 3 |
| /blog/wood-deck-foundation-steps | コラム | ウッドデッキ 下地 | ウッドデッキ 束石、ウッドデッキ 防草シート、ウッドデッキ 施工 手順 | ウッドデッキを設置するときの下地づくりの手順と役割を知りたい | /service/garden | garden | 1 | 1 |
| /blog/category/air-conditioner（noindex） | コラムのカテゴリ | エアコン コラム |  | エアコンについての記事を、まとめて読みたい | /blog | air-conditioner | — | 1 |
| /blog/category/ene-farm（noindex） | コラムのカテゴリ | エネファーム コラム |  | エネファームについての記事を、まとめて読みたい | /blog | ene-farm | — | 1 |
| /blog/category/exterior-painting（noindex） | コラムのカテゴリ | 外壁塗装 コラム |  | 外壁塗装についての記事を、まとめて読みたい | /blog | exterior-painting | — | 1 |
| /blog/category/garden（noindex） | コラムのカテゴリ | 造園 コラム |  | 造園についての記事を、まとめて読みたい | /blog | garden | — | 1 |
| /blog/category/subsidy（noindex） | コラムのカテゴリ | 補助金 コラム |  | 補助金についての記事を、まとめて読みたい | /blog | — | — | 1 |
| /blog/category/toilet（noindex） | コラムのカテゴリ | トイレ コラム |  | トイレについての記事を、まとめて読みたい | /blog | toilet | — | 1 |
| /blog/category/totsuka（noindex） | コラムのカテゴリ | 戸塚区 コラム |  | 戸塚区についての記事を、まとめて読みたい | /blog | — | — | 1 |
| /blog/category/water-heater（noindex） | コラムのカテゴリ | 給湯器 コラム |  | 給湯器についての記事を、まとめて読みたい | /blog | water-heater | — | 2 |
| /blog/category/yokohama（noindex） | コラムのカテゴリ | 横浜市 コラム |  | 横浜市についての記事を、まとめて読みたい | /blog | — | — | 1 |

### 取り合いを避けるために、譲った検索語

| ページ | 取りにいかない検索語 | 担当のページ |
| --- | --- | --- |
| / | 戸塚区 住宅設備 | /area/totsuka |
| / | 戸塚区 リフォーム | /service/reform |
| / | 戸塚区 給湯器交換 | /service/water-heater |
| / | 戸塚区 エアコン工事 | /service/air-conditioner |
| /area/totsuka | 戸塚区 リフォーム | /service/reform |
| /area/totsuka | 戸塚区 給湯器交換 | /service/water-heater |
| /area/totsuka | 戸塚区 エコキュート | /service/ecocute |
| /area/totsuka | 戸塚区 エアコン工事 | /service/air-conditioner |
| /area/totsuka | 戸塚区 外壁塗装 | /service/exterior-painting |
| /area/yokohama | 横浜市 給湯器交換 | /service/water-heater |
| /area/yokohama | 横浜市 外壁塗装 | /service/exterior-painting |
| /area/yokohama | 横浜市 エコキュート | /service/ecocute |
| /service/air-conditioner | エアコン 化粧カバー | /blog/aircon-pipe-tape-or-cover |
| /service/ecocute | エコキュート 搬入経路 | /blog/totsuka-ecocute-carry-in-route |
| /service/ecocute | 給湯省エネ2026事業 | /blog/kyutou-shoene-2026-outline |
| /service/exterior-painting | 戸塚区 屋根塗装 | /service/roof-painting |
| /service/exterior-painting | 外壁塗装 3回塗り | /blog/exterior-painting-three-coats |
| /service/other | 戸塚区 住宅設備工事 | /area/totsuka |
| /service/reform | 戸塚区 トイレリフォーム | /service/toilet |
| /service/reform | リフォーム 解体工事 | /service/demolition |
| /service/roof-painting | 戸塚区 外壁塗装 | /service/exterior-painting |
| /service/toilet | トイレ 排水芯 | /blog/toilet-drain-position-check |
| /service/water-heater | 戸塚区 エコキュート | /service/ecocute |
| /service/water-heater | エネファーム 交換 | /service/ene-farm |
| /service/water-heater | 給湯器 交換時期 | /blog/water-heater-replacement-signs |
| /service/water-heater | 給湯器 号数 | /blog/water-heater-capacity-guide |

## ページごとの一覧

「本文のリンク」は、本文（ヘッダー・フッターを除く）からサイト内へ出しているリンクの行き先の数。「被リンク」は、ほかのページの本文からリンクされている数。

| URL | index | title（全角換算の字数） | description の字数 | h1 | h2 | 構造化データ | 本文のリンク | 被リンク | 画像（alt なし） | 本文の字数 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | ○ | 横浜総合住設｜横浜市戸塚区の住宅設備・リフォーム会社（26） | 105.5 | 横浜市 戸塚区 の住宅設備・リフォーム 株式会社 横浜総合住設 | 11 | （共通のみ） | 38 | 55 | 32（0） | 5454 |
| /area | ○ | 対応エリア｜横浜市戸塚区を中心に神奈川・東京｜横浜総合住設（29） | 87 | 戸塚区を中心に、 横浜市全域・神奈川・東京へ。 | 5 | BreadcrumbList | 4 | 17 | 5（0） | 1094 |
| /area/totsuka | ○ | 横浜市戸塚区の住宅設備・リフォーム｜横浜総合住設（24） | 103 | 横浜市戸塚区の 住宅設備・ リフォーム | 10 | BreadcrumbList、FAQPage | 22 | 21 | 9（0） | 4152 |
| /area/yokohama | ○ | 横浜市の住宅設備・リフォーム｜対応エリアと支援制度（25） | 111 | 横浜市の 住宅設備・ リフォーム | 10 | BreadcrumbList、FAQPage | 16 | 7 | 9（0） | 3897 |
| /blog | ○ | 住宅設備コラム｜交換時期・選び方・費用の考え方｜横浜総合住設（30） | 95 | 住宅設備コラム | 11 | BreadcrumbList、ItemList | 22 | 23 | 14（0） | 1567 |
| /blog/aircon-pipe-tape-or-cover | ○ | エアコンの配管、化粧テープと化粧カバーの違い｜横浜総合住設（29） | 86 | エアコンの 配管、 化粧テープと 化粧カバーの 違い | 11 | BlogPosting、BreadcrumbList、FAQPage | 13 | 8 | 7（0） | 2495 |
| /blog/category/air-conditioner | noindex | 「エアコン」のコラム一覧｜住宅設備コラム｜横浜総合住設（27） | 81.5 | 「 エアコン 」のコラム | 2 | BreadcrumbList、ItemList | 14 | 11 | 5（0） | 464 |
| /blog/category/ene-farm | noindex | 「エネファーム」のコラム一覧｜住宅設備コラム｜横浜総合住設（29） | 79.5 | 「 エネファーム 」のコラム | 2 | BreadcrumbList、ItemList | 14 | 11 | 5（0） | 463 |
| /blog/category/exterior-painting | noindex | 「外壁塗装」のコラム一覧｜住宅設備コラム｜横浜総合住設（27） | 83.5 | 「 外壁塗装 」のコラム | 2 | BreadcrumbList、ItemList | 14 | 12 | 5（0） | 451 |
| /blog/category/garden | noindex | 「造園」のコラム一覧｜住宅設備コラム｜横浜総合住設（25） | 82.5 | 「 造園 」のコラム | 2 | BreadcrumbList、ItemList | 14 | 11 | 5（0） | 442 |
| /blog/category/subsidy | noindex | 「補助金」のコラム一覧｜住宅設備コラム｜横浜総合住設（26） | 83.5 | 「 補助金 」のコラム | 2 | BreadcrumbList、ItemList | 14 | 14 | 5（0） | 478 |
| /blog/category/toilet | noindex | 「トイレ」のコラム一覧｜住宅設備コラム｜横浜総合住設（26） | 83.5 | 「 トイレ 」のコラム | 2 | BreadcrumbList、ItemList | 14 | 11 | 5（0） | 461 |
| /blog/category/totsuka | noindex | 「戸塚区」のコラム一覧｜住宅設備コラム｜横浜総合住設（26） | 74.5 | 「 戸塚区 」のコラム | 2 | BreadcrumbList、ItemList | 14 | 11 | 5（0） | 464 |
| /blog/category/water-heater | noindex | 「給湯器」のコラム一覧｜住宅設備コラム｜横浜総合住設（26） | 83.5 | 「 給湯器 」のコラム | 3 | BreadcrumbList、ItemList | 15 | 13 | 6（0） | 592 |
| /blog/category/yokohama | noindex | 「横浜市」のコラム一覧｜住宅設備コラム｜横浜総合住設（26） | 74.5 | 「 横浜市 」のコラム | 2 | BreadcrumbList、ItemList | 14 | 11 | 5（0） | 455 |
| /blog/ecojozu-drain-water-yokohama | ○ | エコジョーズのドレン排水、横浜市ではどこへ流す？｜横浜総合住設（31） | 84 | エコジョーズの ドレン排水、 横浜市では どこへ 流す？ | 11 | BlogPosting、BreadcrumbList、FAQPage | 11 | 11 | 4（0） | 2598 |
| /blog/ene-farm-replacement-checkpoints | ○ | エネファームから給湯器に替える前に確認する4つのこと（25.5） | 81.5 | エネファームから 給湯器に 替える 前に 確認する 4つの こと | 10 | BlogPosting、BreadcrumbList、FAQPage | 11 | 9 | 4（0） | 2672 |
| /blog/exterior-painting-three-coats | ○ | 外壁塗装の3回塗りとは？下塗り・中塗り・上塗りの役割（25.5） | 75.5 | 外壁塗装の 3回塗りとは？ 下塗り・ 中塗り・ 上塗りの 役割 | 12 | BlogPosting、BreadcrumbList、FAQPage | 10 | 6 | 5（0） | 2320 |
| /blog/kyutou-shoene-2026-outline | ○ | 給湯省エネ2026事業の補助額と、申請の前に知っておくこと（27） | 91 | 給湯省エネ2026事業の 補助額と、 申請の 前に 知って おく こと | 11 | BlogPosting、BreadcrumbList、FAQPage | 12 | 14 | 4（0） | 2809 |
| /blog/toilet-drain-position-check | ○ | トイレ交換の前に確かめる排水芯とは？合う便器の見分け方（27） | 78 | トイレ交換の 前に 確かめる 排水芯とは？ 合う 便器の 見分け方 | 11 | BlogPosting、BreadcrumbList、FAQPage | 10 | 5 | 4（0） | 2436 |
| /blog/totsuka-ecocute-carry-in-route | ○ | エコキュートの搬入経路。戸塚区の高低差のある家で確かめること（30） | 83 | エコキュートの 搬入経路。 戸塚区の 高低差の ある 家で 確かめる こと | 11 | BlogPosting、BreadcrumbList、FAQPage | 11 | 10 | 4（0） | 2683 |
| /blog/water-heater-capacity-guide | ○ | 給湯器の号数とは？16号・20号・24号の違いと選び方｜横浜総合住設（31） | 79 | 給湯器の 号数とは？ 16号・ 20号・ 24号の 違いと 選び方 | 10 | BlogPosting、BreadcrumbList、FAQPage | 9 | 9 | 4（0） | 2320 |
| /blog/water-heater-replacement-signs | ○ | 給湯器の交換時期はいつ？故障の前に出る5つのサイン（24.5） | 85.5 | 給湯器の 交換時期は いつ？ 故障の 前に 出る 5つの サイン | 11 | BlogPosting、BreadcrumbList、FAQPage | 11 | 12 | 4（0） | 2469 |
| /blog/wood-deck-foundation-steps | ○ | ウッドデッキは下地で決まる。整地・防草シート・束石の役割（28） | 76.5 | ウッドデッキは 下地で 決まる。 整地・ 防草シート・ 束石の 役割 | 10 | BlogPosting、BreadcrumbList、FAQPage | 9 | 6 | 5（0） | 2226 |
| /business | ○ | 法人・工務店・ハウスメーカーの方へ｜設備工事の協力先（26） | 111 | 法人・ 工務店・ ハウスメーカーの 方へ | 6 | BreadcrumbList、FAQPage | 4 | 2 | 8（0） | 1961 |
| /company | ○ | 会社案内｜株式会社 横浜総合住設（15.5） | 98.5 | 会社案内 | 7 | BreadcrumbList | 21 | 11 | 9（0） | 2557 |
| /contact | ○ | お問い合わせ・無料見積もり｜横浜総合住設（20） | 112 | お問い合わせ・ 無料見積もり | 1 | BreadcrumbList | 3 | 55 | 4（0） | 1033 |
| /faq | ○ | よくある質問｜見積もり・対応エリア・補助金｜横浜総合住設（28） | 92 | よく ある 質問 | 7 | BreadcrumbList、FAQPage | 17 | 17 | 4（0） | 2184 |
| /flow | ○ | 工事の流れ｜お問い合わせから完了まで｜横浜総合住設（25） | 96 | 工事の 流れ | 10 | BreadcrumbList | 4 | 4 | 12（0） | 1427 |
| /privacy | ○ | プライバシーポリシー｜横浜総合住設（17） | 88.5 | プライバシーポリシー | 11 | BreadcrumbList | 2 | 1 | 2（0） | 1331 |
| /service | ○ | 事業内容・サービス一覧｜住宅設備からリフォームまで（25） | 105.5 | 事業内容・ サービス一覧 | 6 | BreadcrumbList、ItemList | 17 | 18 | 20（0） | 1859 |
| /service/air-conditioner | ○ | 戸塚区のエアコン工事｜取り付け・交換・高所作業｜横浜総合住設（30） | 108 | 横浜市戸塚区の エアコン工事 ── 取り付け・ 交換・ 修理 | 13 | BreadcrumbList、FAQPage、Service | 18 | 15 | 14（0） | 5390 |
| /service/demolition | ○ | リフォームに伴う解体工事｜横浜市戸塚区｜横浜総合住設（26） | 101 | リフォームに 伴う解体工事 | 11 | BreadcrumbList、FAQPage、Service | 11 | 6 | 8（0） | 3019 |
| /service/eco-one | ○ | ECO ONE（エコワン）の設置・交換｜横浜市戸塚区｜横浜総合住設（29.5） | 99 | ECO ONE （エコワン）・ ハイブリッド給湯暖房の 設置 | 11 | BreadcrumbList、FAQPage、Service | 16 | 13 | 8（0） | 4149 |
| /service/ecocute | ○ | 戸塚区のエコキュート交換・設置｜横浜総合住設（22） | 108 | 横浜市戸塚区の エコキュート交換・ 設置 | 12 | BreadcrumbList、FAQPage、Service | 13 | 9 | 8（0） | 6871 |
| /service/ene-farm | ○ | エネファームから給湯器への交換・撤去｜横浜市戸塚区（25） | 103 | エネファームから 給湯器への 交換・ 撤去 | 12 | BreadcrumbList、FAQPage、Service | 15 | 10 | 9（0） | 4496 |
| /service/exterior-painting | ○ | 戸塚区の外壁塗装｜屋根塗装にも対応｜横浜総合住設（24） | 110 | 横浜市戸塚区の 外壁塗装 | 13 | BreadcrumbList、FAQPage、Service | 15 | 11 | 11（0） | 3910 |
| /service/garden | ○ | 戸塚区の造園・外構工事｜剪定・伐採・ウッドデッキ｜横浜総合住設（31） | 91 | 横浜市戸塚区の 造園・ 外構工事 | 12 | BreadcrumbList、FAQPage、Service | 15 | 10 | 12（0） | 2975 |
| /service/kitchen-equipment | ○ | 戸塚区のビルトインコンロ・レンジフード交換｜横浜総合住設（28） | 98 | 横浜市戸塚区の ビルトインコンロ・ レンジフード交換 | 11 | BreadcrumbList、FAQPage、Service | 13 | 10 | 10（0） | 3106 |
| /service/other | ○ | 浴室暖房乾燥機の交換・内窓・水栓の工事｜横浜市戸塚区（26） | 117 | 横浜市戸塚区の 浴室暖房乾燥機の 交換・ 内窓・ 水栓の 工事 | 13 | BreadcrumbList、FAQPage、Service | 14 | 11 | 12（0） | 3860 |
| /service/reform | ○ | 戸塚区の住宅リフォーム｜キッチン・浴室・洗面・内装（25） | 92 | 横浜市戸塚区の 住宅リフォーム | 13 | BreadcrumbList、FAQPage、Service | 15 | 17 | 11（0） | 4854 |
| /service/roof-painting | ○ | 戸塚区の屋根塗装・屋根の塗り替え｜横浜総合住設（23） | 103 | 横浜市戸塚区の 屋根塗装 | 14 | BreadcrumbList、FAQPage、Service | 14 | 8 | 13（0） | 5006 |
| /service/solar | ○ | 戸塚区の太陽光発電の設置工事｜横浜総合住設（21） | 92 | 横浜市戸塚区の 太陽光発電の 設置工事 | 13 | BreadcrumbList、FAQPage、Service | 12 | 12 | 9（0） | 4617 |
| /service/storage-battery | ○ | 戸塚区の家庭用蓄電池の設置工事｜横浜総合住設（22） | 90 | 横浜市戸塚区の 家庭用蓄電池の 設置工事 | 11 | BreadcrumbList、FAQPage、Service | 12 | 10 | 8（0） | 4287 |
| /service/toilet | ○ | 戸塚区のトイレ交換・トイレリフォーム｜横浜総合住設（25） | 84 | 横浜市戸塚区の トイレ交換・ トイレリフォーム | 11 | BreadcrumbList、FAQPage、Service | 12 | 10 | 9（0） | 3623 |
| /service/water-heater | ○ | 戸塚区の給湯器交換・エコジョーズ｜横浜総合住設（23） | 101 | 横浜市戸塚区の 給湯器交換 | 10 | BreadcrumbList、FAQPage、Service | 16 | 19 | 8（0） | 4821 |
| /works | ○ | 施工事例｜エアコン・浴室暖房乾燥機・外壁塗装・ウッドデッキ（29） | 88 | 施工事例 | 3 | BreadcrumbList、ItemList | 12 | 23 | 12（0） | 1158 |
| /works/air-conditioning-pipe-lagging | ○ | 空調配管のラッキングカバー施工｜施工事例｜横浜総合住設（27） | 75 | 空調配管の ラッキングカバー施工 | 9 | Article、BreadcrumbList | 9 | 9 | 13（0） | 1195 |
| /works/aircon-high-place-replacement | ○ | 他社で断られた、高所でのエアコン取替｜施工事例｜横浜総合住設（30） | 64 | 他社で 断られた、 高所での エアコン取替 | 8 | Article、BreadcrumbList | 9 | 14 | 8（0） | 1206 |
| /works/aircon-replace-decorative-cover | ○ | エアコン取替工事｜配管を化粧テープ仕上げから化粧カバー仕上げへ｜施工事例（36） | 62 | エアコン取替工事 ── 配管を 化粧テープ仕上げから 化粧カバー仕上げへ | 8 | Article、BreadcrumbList | 9 | 8 | 12（0） | 1189 |
| /works/aircon-replace-two-units | ○ | エアコン取替工事（2台）── 室内機・室外機の入れ替え｜施工事例（31） | 66.5 | エアコン取替工事 （2台） ── 室内機・ 室外機の 入れ替え | 8 | Article、BreadcrumbList | 9 | 7 | 16（0） | 1231 |
| /works/bathroom-heater-dryer-rinnai | ○ | リンナイの浴室暖房乾燥機の施工｜施工事例｜横浜総合住設（27） | 64 | リンナイの 浴室暖房乾燥機の 施工 | 8 | Article、BreadcrumbList | 8 | 9 | 14（0） | 1183 |
| /works/cupboard-installation | ○ | キッチンのカップボード設置｜施工前から完成まで｜施工事例（28） | 74 | キッチンの カップボード設置 ── 施工前から 完成まで | 8 | Article、BreadcrumbList | 8 | 4 | 13（0） | 1198 |
| /works/exterior-roof-painting-process | ○ | 外壁塗装・屋根塗装｜施工の工程をご紹介｜施工事例｜横浜総合住設（31） | 74 | 外壁塗装・ 屋根塗装 ── 施工の 工程を ご紹介 | 8 | Article、BreadcrumbList | 9 | 10 | 9（0） | 1195 |
| /works/service/air-conditioner | ○ | エアコンの施工事例（4件）｜横浜総合住設（19.5） | 115 | エアコンの 施工事例 | 7 | BreadcrumbList、ItemList | 9 | 6 | 7（0） | 829 |
| /works/wood-deck-installation | ○ | ウッドデッキの設置｜整地から完成まで｜施工事例｜横浜総合住設（30） | 67 | ウッドデッキの 設置 ── 整地から 完成まで | 9 | Article、BreadcrumbList | 8 | 8 | 12（0） | 1210 |

全ページ共通の構造化データ：Organization（法人）、HomeAndConstructionBusiness（戸塚オフィス）、WebSite。

## コラムのクラスター（カテゴリごとの本数）

「題材」は、すぐに書ける形で決めてあるもの（`lib/blog-generator/topics.ts`）。「候補」は、検索意図だけを洗い出してあるもの（`lib/blog-generator/backlog.ts`）。

| カテゴリ | 親ページ | 公開済み | 題材（未公開） | 候補 | 合計 |
| --- | --- | --- | --- | --- | --- |
| 給湯器 | /service/water-heater | 2 | 7 | 25 | 34 |
| エコキュート | /service/ecocute | 0 | 6 | 26 | 32 |
| エネファーム | /service/ene-farm | 1 | 2 | 17 | 20 |
| ECO ONE | /service/eco-one | 0 | 3 | 17 | 20 |
| エアコン | /service/air-conditioner | 1 | 8 | 26 | 35 |
| トイレ | /service/toilet | 1 | 3 | 27 | 31 |
| キッチン | /service/kitchen-equipment | 0 | 3 | 15 | 18 |
| レンジフード | /service/kitchen-equipment | 0 | 2 | 11 | 13 |
| 外壁塗装 | /service/exterior-painting | 1 | 6 | 26 | 33 |
| 屋根塗装 | /service/roof-painting | 0 | 7 | 24 | 31 |
| 太陽光 | /service/solar | 0 | 2 | 28 | 30 |
| 蓄電池 | /service/storage-battery | 0 | 2 | 28 | 30 |
| リフォーム | /service/reform | 0 | 2 | 28 | 30 |
| 解体 | /service/demolition | 0 | 2 | 13 | 15 |
| 造園 | /service/garden | 1 | 2 | 27 | 30 |
| 住宅設備 | /service | 0 | 3 | 22 | 25 |
| 補助金 | /area/yokohama | 1 | 3 | 11 | 15 |
| 横浜市 | /area/yokohama | 1 | 2 | 9 | 12 |
| 戸塚区 | /area/totsuka | 1 | 0 | 10 | 11 |

## これから書くコラムの順番

自動投稿が題材を選ぶ順番です（優先度 → 記事の少ないカテゴリ → 題材の並び）。公開済みの記事に見直す理由があるときは、
およそ3割の日が見直しに回るので、日付は前後します。

| 順 | 優先度 | カテゴリ | 主キーワード | 題名の方向 | 親ページ |
| --- | --- | --- | --- | --- | --- |
| 1 | P0 | エコキュート | エコキュート 容量 選び方 | エコキュートのタンク容量の決め方。家族の人数とお湯の使い方から | /service/ecocute |
| 2 | P0 | キッチン | カップボード 設置 確認 | カップボードを付ける前に。壁の下地・コンセント・寸法の確認 | /service/kitchen-equipment |
| 3 | P0 | 屋根塗装 | 屋根 外壁 塗装 同時 | 屋根と外壁は一緒に塗る？足場が1回で済むという考え方 | /service/roof-painting |
| 4 | P0 | 住宅設備 | 浴室暖房乾燥機 交換 目安 | 浴室暖房乾燥機の交換。10年の目安と、替える前に確かめること | /service |
| 5 | P0 | エコキュート | ガス給湯器 エコキュート 切り替え 工事 | ガス給湯器からエコキュートへ。切り替え工事で行う5つのこと | /service/ecocute |
| 6 | P0 | エネファーム | エネファーム 点検 案内 | エネファームの点検の案内が届いたら。使い続けるか、替えるか | /service/ene-farm |
| 7 | P0 | エアコン | エアコン 高所 断られた | エアコンの取替を「高所だから」と断られたら。相談の前に確かめること | /service/air-conditioner |
| 8 | P0 | 外壁塗装 | 外壁 チョーキング | 外壁を触ると白い粉が付く。チョーキングの確かめ方と塗り替えの判断 | /service/exterior-painting |
| 9 | P0 | 屋根塗装 | 屋根塗装 縁切り タスペーサー | 屋根塗装の縁切りとは。スレート屋根の重なり目をふさがない理由 | /service/roof-painting |
| 10 | P0 | 給湯器 | 給湯器 エラー 対処 | 給湯器にエラーが出たら。業者を呼ぶ前に確かめる3つのこと | /service/water-heater |
| 11 | P0 | エアコン | 空調配管 ラッキング とは | 空調配管のラッキングとは。屋外の配管を守る金属のカバー | /service/air-conditioner |
| 12 | P0 | 外壁塗装 | 外壁塗装 見積書 見方 | 外壁塗装の見積書、どこを見る？「一式」に注意する理由 | /service/exterior-painting |
| 13 | P0 | エコキュート | エコキュート ヒートポンプ 水漏れ 結露 | エコキュートのヒートポンプの下が濡れている。故障かどうかの見分け方 | /service/ecocute |
| 14 | P0 | 屋根塗装 | 雨漏り 屋根塗装 直らない | 雨漏りは屋根を塗っても直らない。先に確かめること | /service/roof-painting |
| 15 | P0 | 給湯器 | エコジョーズとは 従来型 違い | エコジョーズとは。従来型のガス給湯器と違う2つの点 | /service/water-heater |
| 16 | P0 | エコキュート | 電気温水器 エコキュート 交換 | 電気温水器からエコキュートへ。入れ替えで確かめる3つのこと | /service/ecocute |
| 17 | P0 | 屋根塗装 | 屋根 色あせ 塗装 必要 | 屋根の色あせは、すぐ塗らないと危ない？メーカーの説明から考える | /service/roof-painting |
| 18 | P0 | 外壁塗装 | 外壁 ひび割れ 補修 | 外壁のひび割れ。様子を見てよいひびと、補修が要るひび | /service/exterior-painting |
| 19 | P0 | エアコン | エアコン 取り付け 事前 確認 | エアコンを取り付ける前に確かめる4つのこと | /service/air-conditioner |
| 20 | P0 | 給湯器 | 給湯器 水漏れ 対処 | 給湯器の下が濡れている。水漏れのときに最初に確かめること | /service/water-heater |
| 21 | P0 | 給湯器 | マンション 給湯器 交換 注意 | マンションの給湯器交換。パイプスペースと管理規約で確かめること | /service/water-heater |
| 22 | P1 | ECO ONE | ECO ONE エコキュート 違い | ECO ONE とエコキュートの違い。タンクの大きさとお湯切れで比べる | /service/eco-one |
| 23 | P1 | レンジフード | レンジフード 深型 薄型 違い | レンジフードの深型と薄型の違い。替えるときに要る部材 | /service/kitchen-equipment |
| 24 | P1 | 太陽光 | 太陽光 屋根 向き 影 | 太陽光発電に向く屋根、向かない屋根。向きと影の見方 | /service/solar |
| 25 | P1 | 蓄電池 | 蓄電池 全負荷 特定負荷 違い | 蓄電池の全負荷型と特定負荷型。停電のときに何を動かしたいか | /service/storage-battery |
| 26 | P1 | リフォーム | リフォーム 優先順位 | リフォームはどこから手を付ける？優先順位の3つの段階 | /service/reform |
| 27 | P1 | 解体 | リフォーム 石綿 事前調査 | リフォームでも石綿の事前調査は必要？決まりと報告が要る工事 | /service/demolition |
| 28 | P1 | ECO ONE | ECO ONE 停電 | ECO ONE は停電のときに使える？必要な電源と、使えない場合 | /service/eco-one |
| 29 | P1 | トイレ | 便器 種類 違い | 便器は3種類。組み合わせ・一体型・タンクレスの違いと選び方 | /service/toilet |
| 30 | P1 | キッチン | ビルトインコンロ 60cm 75cm 違い | ビルトインコンロの幅、60cmと75cmの違い。替えられる条件 | /service/kitchen-equipment |
| 31 | P1 | レンジフード | コンロ レンジフード 同時交換 | コンロとレンジフードは同時に替える？連動機能と工事の回数 | /service/kitchen-equipment |
| 32 | P1 | 太陽光 | 太陽光 自家消費 売電 2026 | 太陽光の電気は、使うか売るか。2026年度の買取価格から考える | /service/solar |
| 33 | P1 | 蓄電池 | 蓄電池 後付け 太陽光 | いまある太陽光に蓄電池は後付けできる？確かめる3つの点 | /service/storage-battery |
| 34 | P1 | リフォーム | マンション リフォーム 管理規約 確認 | マンションのリフォーム、最初に確かめる3つのこと | /service/reform |
| 35 | P1 | 造園 | 庭木 剪定 時期 | 庭木の剪定はいつ頼む？落葉樹と常緑樹で違う時期 | /service/garden |
| 36 | P1 | 住宅設備 | 住宅設備 10年 点検 | 築10年で見直す住宅設備。給湯器・エアコン・コンロの目安 | /service |
| 37 | P1 | 補助金 | 内窓 補助金 2026 | 内窓の補助金。先進的窓リノベ2026事業の額と条件 | /area/yokohama |
| 38 | P1 | 横浜市 | 横浜グリーンエネルギーパートナーシップ ポイント還元 | 横浜市のポイント還元事業。太陽光・蓄電池・エコキュートの条件 | /area/yokohama |
| 39 | P1 | エネファーム | エネファーム 撤去 床暖房 | エネファームを撤去しても床暖房は使える？熱源機の選び方 | /service/ene-farm |
| 40 | P1 | ECO ONE | ECO ONE 補助金 条件 2026 | ECO ONE に使える補助金。給湯省エネ2026事業の額と確かめる点 | /service/eco-one |
| 41 | P1 | トイレ | トイレ交換 床 張り替え 同時 | トイレの床は、便器を替えるときに張り替える。同時にする理由 | /service/toilet |
| 42 | P1 | キッチン | ガスコンロ 安全装置 確認 | そのガスコンロ、安全装置は全部の口に付いている？2008年が境目 | /service/kitchen-equipment |
| 43 | P1 | 造園 | 庭 雑草対策 防草シート 砂利 | 草むしりを減らす。防草シートと砂利の敷き方 | /service/garden |
| 44 | P1 | 住宅設備 | 内窓 効果 | 内窓を付けると何が変わる？結露・寒さ・音への効き方 | /service |
| 45 | P1 | 補助金 | 住宅設備 補助金 誰が申請 | 補助金は誰が申請する？国・神奈川県・横浜市で違う決まり | /area/yokohama |
| 46 | P1 | 横浜市 | 横浜市 断熱改修 補助 | 横浜市の断熱改修の補助。対象になる工事、ならない工事 | /area/yokohama |
| 47 | P1 | トイレ | タンクレストイレ 設置 条件 | タンクレストイレは、どの家にも付く？水圧と手洗いの確認 | /service/toilet |
| 48 | P1 | 補助金 | みらいエコ住宅2026 リフォーム 条件 | みらいエコ住宅2026事業、給湯器の交換だけでは使えない理由 | /area/yokohama |
| 49 | P1 | エコキュート | エコキュート 仕組み | エコキュートはなぜ空気でお湯が沸くのか。仕組みと2つのユニット | /service/ecocute |
| 50 | P1 | エアコン | エアコン 修理 交換 判断 | エアコンは修理か交換か。使った年数と症状で考える | /service/air-conditioner |
| 51 | P1 | 外壁塗装 | 外壁塗装 塗料 種類 | 外壁の塗料の選び方。次の塗り替えをいつにしたいかで決める | /service/exterior-painting |
| 52 | P1 | 屋根塗装 | 太陽光パネル 屋根塗装 順番 | 太陽光パネルを載せる前に、屋根は塗るべき？順番の考え方 | /service/roof-painting |
| 53 | P1 | エアコン | エアコン 室外機 置き方 | エアコンの室外機、置き方は5通り。置き場所で変わる工事の内容 | /service/air-conditioner |
| 54 | P1 | エコキュート | エコキュート 運転音 近所 | エコキュートの運転音。夜に動く機器の置き場所の決め方 | /service/ecocute |
| 55 | P1 | 屋根塗装 | 棟板金 釘 浮き | 屋根のてっぺんの板金の釘が浮いていると言われたら | /service/roof-painting |
| 56 | P1 | 外壁塗装 | 外壁 シーリング 打ち替え 増し打ち | 外壁の目地（シーリング）の打ち替えと増し打ちの違い | /service/exterior-painting |
| 57 | P1 | 給湯器 | 給湯器 設置タイプ 壁掛け 据置 | 給湯器の設置タイプ（壁掛け・据置・パイプスペース）と交換のときの注意 | /service/water-heater |
| 58 | P1 | エアコン | エアコン 処分 横浜市 | 古いエアコンの処分、横浜市では粗大ごみに出せない。引き取りの流れ | /service/air-conditioner |
| 59 | P1 | 屋根塗装 | 屋根 点検 自分で | 屋根に上らずに、屋根の状態を確かめる方法 | /service/roof-painting |
| 60 | P1 | 外壁塗装 | 外壁塗装 付帯部 破風 雨どい | 外壁塗装の「付帯部」とは。破風・軒天・雨どいを一緒に塗る理由 | /service/exterior-painting |
| 61 | P1 | 給湯器 | 給湯器 オート フルオート 違い | 給湯器のオートとフルオートの違い。追いだき配管で選べる機能が変わる | /service/water-heater |
| 62 | P1 | エアコン | エアコン 室内機 水漏れ 原因 | エアコンの室内機から水が落ちる。原因と、連絡の前に見ること | /service/air-conditioner |
| 63 | P1 | 給湯器 | 給湯器 交換 工事 流れ 当日 | 給湯器の交換工事の当日。取り外しから試運転までの流れ | /service/water-heater |
| 64 | P2 | 解体 | リフォーム 解体 範囲 | リフォームの解体は、どこまで壊す？取れる壁と取れない壁 | /service/demolition |
| 65 | P2 | エアコン | 業務用エアコン フロン 回収 | 業務用エアコンの入れ替えとフロンの回収。廃棄のときの決まり | /service/air-conditioner |

