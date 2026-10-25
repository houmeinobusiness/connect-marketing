# Connect Marketing LP v3

feature/lp-v3内で制作。本番公開・mainマージ・DNS/CNAME/Pages設定変更は未実施。Node.js 22.23.4以上（CI/検証は24）、Astro 7.4.2、Tailwind 4.3.3。

```sh
cd lp-v3
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

通常build/previewはnoindex。previewは起動前にnoindex版を必ず再生成する。本番用は明示的に `npm run build:production`、復旧用生成はその後に `npm run build:rollback`。いずれもローカル生成のみで公開しない。

site=https://connect-mkt.jp、base=/、成果物dist/。本番用の/と/privacy/のみindex・sitemap収録。改訂enと既存特典は常にnoindex。mcp.jsonはソース保管のみで配信成果物には含めない。root CNAMEは無変更。

## 現在のページ・フォーム

- /：新LP。完成・掲載許諾済み実績のみ表示、0件ならセクションなし。プロフィールはsrc/data/profile.tsで編集。
- /privacy/：提供済み正式原稿9項目。2026年10月25日制定。
- /en/：現在の3サービスを紹介する暫定英語案内。英語対応の保証はしない。
- /assets/gifts/8sns-ai-prompt-2026.html：既存のnote向け配布物を内容・URL・noindexごと維持。
- Tally正式ID EqkyYXをdata-tally-src/公式embed.jsで埋め込み。幅100%・初期900px・dynamicHeight。正式フォームへの代替リンクとprivacyリンクを常時表示。操作は実送信になる。
- モバイル下部固定CTAは撤去済み。相談導線はヘッダー・FV・サービスカード。

Tallyは制作指示⑥でEmail必須・形式・同意・1件の正常送信を再検証済み。通知受信は管理者が確認済みと報告。国外処理・外部サービス・DPAと削除範囲は今回提供された情報をprivacy第4・6項へ反映。管理画面や通知メールをエージェントが直接閲覧したという意味ではない。サービスの個別設定・通信失敗時UX等は従来の検証範囲を参照。テスト回答CM-LPV3-06-20261025と前回⑤の回答は管理者確認後削除する。公開直後には本番privacyへのリンクと送信/通知を再確認する。

## 公開準備と復旧

[最新報告・短い残作業チェック](REVIEW-08.md)、[公開/復旧手順](LAUNCH-RUNBOOK.md)、[旧URL方針](LEGACY-URL-PLAN.md)。

.github/workflows/pages-release.ymlはmainだけからの手動実行。releaseは本番用ビルドを配信、rollbackはSHA256確認済みの保管ZIPを新LP再ビルドなしで配信する。今回はどちらも実行していない。既存check CIは通常/本番/復旧ビルドの検査のみ。

復旧ZIPは旧トップのMCP discovery/紹介ブロック等を除き、現行privacy/CSS・英語案内・特典・正式Tallyリンクを保持。旧ページの残存サービス説明は緊急用のため、長期運用しない。privacyを更新した場合は復旧ZIP・SHA256・表示検証も更新する。

公開前に管理者がPages設定とHTTPSを記録し、Environmentをmain限定・承認付きに整備する。実際の公開は別途承認後。正式OGP画像は未実装で、SNS共有前の残作業。権利帰属・予約先・MCP利用者など外部の未確認事項はREVIEW-08.mdを参照。

以前のREVIEW-02/03/05/06は各時点の履歴資料。現行の検索設定・旧URL・workflowはREVIEW-08.mdと本READMEを優先する。

## 公開前の最終調整

privacy第4・6項を補足し、docs/review-08/の公開用・復旧用ZIPとSHA256も最新原稿へ更新。[最終検証](FINAL-PRELAUNCH.md)を参照。Tallyを継続採用し、フォームID・送信設定は変更していない。
