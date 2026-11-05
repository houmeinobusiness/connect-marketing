# 2026-11-05 LP改善レビュー（ローカルのみ）

## 根拠と現在地

- [共通事業概要シート](https://docs.google.com/document/d/1pgmj2GklQlWOIeKJsJASiSXtM_AXYlb81piGrjJuw7E/edit)を取得して確認。第01〜04節の事業目的・対象・支援範囲・実務責任と、第09節の次段階「業務内容・対象者・支援範囲の具体化」「公式発信とLPの導線」を適用した。
- 作業開始時のHEADと `git ls-remote origin refs/heads/main` はともに `8ad7c941380bb168b7e7ef7eca89a0559be2fd2c`。作業開始時の差分なし。
- FAQ6問とOrganization／WebSite JSON-LDは既存実装。資料上も11月4日に公開後確認まで完了済みのため、重複実装しない。
- `/workspace`とリポジトリ内にAGENTS.md、適用できる `.agents/skills` は存在しなかった。

## 実装内容

1. 既存サービスの後に、LP・Webページ／広告とページ／問い合わせ後の対応という3つの相談例を追加。顧客実績や成果としては表示しない。
2. 対象者、単発・制作・継続の相談形態、要件確認・範囲合意の進め方を明記。採用支援はWeb導線の支援であることを明確化。
3. 代表紹介を、実務責任と要件・利用環境による対応範囲の確認が伝わる表現へ変更。
4. フッターのnoteリンクを実務記事への案内に変更し、資料と既存JSON-LDにある公式Xリンクを追加。フッターは幅に合わせて折り返す。

ヒーローと既存3サービスを維持し、事業全体の相談窓口として実装。TallyのID・処理、FAQ、構造化データ、検索設定、顧客実績の公開制御は変更していない。顧客名・素材・成果数値を追加していない。

## 検証結果

- Node 24.19.0、既存lockfileのまま依存を導入。最初の `npm ci` は既定キャッシュ `/home/agent/.npm/_cacache` の書き込み先エラーで失敗したが、`npm ci --cache /tmp/cm-npm-cache --no-audit --no-fund` で成功。依存定義・lockfileは無変更。
- `ASTRO_TELEMETRY_DISABLED=1 npm run check`：18ファイル、エラー・警告・ヒント0。
- `npm run build`：成功。preview用noindex、canonical、robots、sitemap、旧MCP宣言除外の既存検査成功。
- `npm run build:production`：成功。本番用index／canonical、2URLのsitemap、旧MCP宣言除外の既存検査成功。ローカル生成のみ。
- `npm run build:rollback`：成功。既存の復旧生成処理を確認。保存済み復旧ZIPは変更していない。
- Chromiumで320／390／768／1440pxを確認。横はみ出しなし、相談例3件、FAQ6問開閉、相談CTAのアンカー移動、Tally代替リンク、privacy表示、トップだけのJSON-LDを確認。JS無効でも相談例表示とFAQ開閉を確認。
- `git diff --check`：成功。

ブラウザ結果は [browser-results.json](browser-results.json)、再現スクリプトは [browser-check.py](browser-check.py)。`lp-v3`で `python -m http.server 4321 --bind 127.0.0.1 --directory dist` を起動してから、Playwright Python導入済み環境で `python docs/review-2026-11-05/browser-check.py` を実行する。スクリプトは `/usr/bin/chromium` を使用する。

スクリーンショット：[390px相談例](consultations-390.png)／[1440px相談例](consultations-1440.png)／[1440pxフッター](footer-1440.png)。相談例のセクション画像は、長いセクションの撮影時に固定ヘッダー等が重ならないよう撮影中だけヘッダーとスキップリンクを非表示にしている。実装のヘッダーは変更していない。

外部リクエストはブラウザ検証で遮断。Tallyの実送信・通知、外部リンク先のライブ動作、Safari、スクリーンリーダーは今回未検証。検索流入や問い合わせの増加を検証したものではない。

## 判断が必要な事項・未実装案

- 初回税込50,000円／通常税込99,800円、初回はLPまたは1ページ、複数ページは別見積もり、という最新指示は把握。ただし一般公開の可否は未決定のため、価格・10社限定・残枠などの表示を追加していない。公開する場合は対象・期間・適用条件も確認する。
- 修正回数、納期、素材の分担、維持費、支払い条件は未決定。広告費・ツール費などを含むかも含め、確定後に料金案内・FAQへ反映する。
- 顧客素材や実績は公開許諾後に追加。自主制作デモの選定・掲載も別途確認する。
- note→LPの逆方向リンクの点検・追記、予約リンクのLP直接掲載、Tally後の返信・日程調整自動化は今回変更していない。
- Search Consoleの検索パフォーマンス基準値・検索表示の継続観察は別途実施。今回の文面変更による検索成果は未検証。

## 運用・公開方法

実際のデプロイ定義は `.github/workflows/pages-release.yml`。main限定の `workflow_dispatch` で `operation=release` を選ぶと、npm ci → check → build:production → distのアップロード → github-pages環境へのデプロイを行う。pushで自動公開する定義ではない。rollbackは既存ZIPのSHA256を検証して配信する。

既存 `README.md` と `LAUNCH-RUNBOOK.md` には初回公開前の履歴表現が残るため、現在の公開状況は概要シートと最新mainを区別して確認する。今後の本番反映はこの差分をレビューし、承認後に別作業として実施する。初回報告時はcommit・push・PR作成・merge・workflow実行・デプロイ・DNS変更を行っていない。その後の依頼に基づき、最終差分を確認し、実装・画像・検証記録をローカルコミットに保存する。push・PR作成・merge・workflow実行・デプロイ・DNS変更は引き続き行わない。
