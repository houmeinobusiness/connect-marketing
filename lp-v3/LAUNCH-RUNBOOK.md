# 公開・ロールバック手順（制作指示⑧対応、未公開）

2026-10-25。対象feature/lp-v3。本番公開・mainマージ・Pages/DNS/CNAME変更は今回実施していない。

## 成果物とコマンド

| コマンド | 出力 | 検索設定 |
| --- | --- | --- |
| npm run dev | 開発サーバー | 全ページnoindex |
| npm run build | dist/ | /・/privacy/もnoindex、robots Disallow、空sitemap |
| npm run preview | noindex版を再ビルドして表示 | 直前に本番版を作っていてもnoindexへ戻す |
| npm run build:production | dist/ | /・/privacy/のみindex。en・特典は常にnoindex |
| npm run build:rollback | rollback/ | 旧トップ＋現在のprivacy/CSS等。全HTML noindex |

npmコマンドはlp-v3/内で実行する。本番化条件は明示的な`--mode release`かつ開発サーバーでないこと。標準のAstro buildのproductionモードだけではindexを解除しない。

公開対象：/、/privacy/、/en/、/assets/gifts/8sns-ai-prompt-2026.html、/robots.txt、/sitemap.xml、/_astro/*、/favicon.svg。
インデックス対象は/と/privacy/の2URL。enと特典はnoindex・サイトマップ外。mcp.jsonと/mcpは成果物なし。新たなAPIはない。

## 検証済みファイル

- `docs/review-08/production-site.zip`：ローカルで作成・検証した本番用静的成果物。
- `docs/review-08/rollback-site.zip`：検証した旧サイト復旧用成果物。隣接する.sha256で検証。
- `docs/review-06/production-source-342b030.zip`：旧mainソースの無加工保管版。復旧配信ZIPとは区別する。

復旧配信ZIPは342b030の旧トップを基礎とし、MCP discovery link・MCP紹介セクション・関連リンク・旧JSON-LDを除去。新しい英語案内・既存特典・現在の/privacy/・CSS・faviconを同梱。トップにprivacyと正式Tallyへのリンクを追加。旧トップの一般的な旧サービス説明・旧CTAは一部残るため、緊急時の一時復旧用であり、長期運用の承認を意味しない。CNAMEファイルは復旧ソースに保管したまま、Actions用の成果物へは不要なためコピーしていない。

## 公開前に管理者が行う確認

1. Settings > Pagesで現在のSource、branch/path、Custom domain、HTTPS/証明書、直近成功run/SHAを記録。APIは前回Forbiddenで、現行公開元は未確定。
2. Tallyは継続採用。送信・通知受信は管理者確認済みと報告された。今回提供情報をprivacy第4・6項へ反映済み。管理者の確認とエージェント自身のメール受信確認は区別する。公開後の本番導線テストは引き続き実施する。
3. 特典の権利帰属と旧Google Calendar予約先が現在も提供可能かを所有者が確認。コード上の確認だけでは権利の裏付けや予約可否を保証できない。
4. ZIPとSHA256を別保管する。privacy更新時には復旧ZIPも再生成・再検証し、.sha256を更新する。今回の最終補足原稿で公開用・復旧用ZIPを更新済み。復旧ZIPはGitHub Pages配信物と違い、Git履歴内に保管されるので一般配信しない。
5. github-pages Environmentの公開元をmainのみに制限し、利用可能なら承認者を設定する。承認が必要な設定が自動的に存在するとは想定しない。
6. 特典・MCP利用者の把握とMCP停止告知が必要なら実施。現在の利用者は未確認であり「いない」と確定していない。

## 承認後の初回公開

1. 別途公開承認を取得し、レビューしたfeature/lp-v3をmainへマージする。今回この操作は行わない。公開SHAを記録。
2. Settings > Pages > SourceをGitHub Actionsへ切り替える。Custom domain=connect-mkt.jpとEnforce HTTPSを維持し、DNS・CNAMEを書き換えない。ドメイン設定を一旦削除する操作もしない。
3. Actionsの`Manual Pages release or rollback`をmainから手動実行し、operation=releaseを選ぶ。
4. workflowはnpm ci、check、build:productionと成果物検査を経てlp-v3/distをアップロードし、github-pages環境でdeploy-pagesを実行する。必要な承認を公開担当が行う。
5. 自動push/PRデプロイはない。main以外からの手動実行はjob条件でスキップ。既存check CIはビルド検査のみでwrite権限なし。新しい公開workflowのpages/id-token writeはdeploy jobだけに限定している。
6. 独自ドメインはPages設定で維持する。公式仕様ではActions公開時に既存CNAMEファイルは無視される。ルートのファイル自体は変更していない。

## 公開直後の確認

- /、/privacy/、/en/、特典、CSS、favicon、robots、sitemapのHTTP応答とHTTPSを確認。mcp.jsonは404、未確認APIの稼働宣言がないことを確認。
- /と/privacy/のrobots=index,follow、各自のcanonicalとog:urlを実配信で確認。en/特典はnoindex。サイトマップは公開2URLのみ。
- Tally同意付近のリンクを実際に開き、本番privacy全文へ到達することを確認。
- 本番LPから架空データ1件で送信完了と管理者通知受信を確認し、テストIDを記録・削除する。
- 320/390/768/1440pxで問い合わせ導線・フォームの高さを確認。HTTPS・主要ページ・privacy・フォームに重大障害があれば復旧へ。
- OGPのtitle/description/urlは実装済み。正式なog:imageは未実装でありSNS共有を行う前に別途追加する。

## ロールバック

1. 追加の公開を止め、障害・SHA・runを記録する。DNSやドメイン設定は変更しない。
2. mainの同じ手動workflowでoperation=rollbackを選ぶ。復旧はnpm依存インストールや新LPのビルドを行わず、コミットされた復旧ZIPのSHA256を検証して展開・配信する。新ビルドが壊れていても、保存済み成果物から戻せる。
3. ZIPのチェックに失敗した場合は配信を止め、検証済みの外部保管ZIPとSHA256から復旧する。署名/承認済みのworkflowが使えない場合は管理者が記録した旧Sourceへ戻すか復旧用branchを用意するが、mainのreset/force-pushは行わない。
4. /privacy/、その/_astro/ CSS、正式Tallyリンク、旧トップ、特典、HTTPSを再確認。旧サイトだけの5ファイルへ戻すとprivacyが消えるので、無加工ソースZIPをそのまま配信しない。
5. 復旧中は全HTML noindexとする。原因解消後、公開用設定を再確認してreleaseを実行する。Tally回答はサイトを戻しても消えず、管理者が整理する。

## ローカル復旧リハーサル

```sh
cd lp-v3
npm ci
npm run build:production
npm run build:rollback
sha256sum -c docs/review-08/rollback-site.sha256
python -m zipfile -e docs/review-08/rollback-site.zip ../work/rollback-rehearsal
```

今回は実際にZIPを展開し、元ディレクトリとの全ファイル一致・privacyの本文とCSS・MCP除外を確認。ディレクトリに対するHTTP/browser検証では3構成×4幅を検証した。GitHub上での実デプロイ・設定変更を含む復旧は未実施。

## 公式資料

https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
