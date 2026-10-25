# 公開前最終調整

2026-10-25（日本時間）。起点e5c912d、feature/lp-v3内で実施。

## 調整と確認

- Tally EqkyYXを維持。Googleフォーム・Notionフォームへ変更していない。送信・通知受信は管理者から確認済みと報告された。エージェント自身が通知メールを閲覧したという意味ではない。
- privacy第4項：ベルギー所在事業者のTally、案内に基づくベルギー（EU）ホスティング・Google Cloud Platform等・DPAの適用確認を、今回提供された確定情報として反映。既存の委託監督・国外取り扱いの文を整理し、重複を避けた。
- 第6項：削除時に通知メール・エクスポート等の関連データも確認すること、Tally側のバックアップ等はサービス規定に従うことを追記。契約に至らなかった問い合わせは対応終了後原則1年を目安に削除する方針を維持。
- その他の原稿・制定日・フォーム実装は維持。未提供の法的評価・サービス条件を追加していない。

## 最終検証結果

| 確認 | 結果 |
| --- | --- |
| Astro check | 17ファイル、エラー0・警告0・ヒント0 |
| 本番用build | 成功。/と/privacy/はindex,follow、canonical/OG URL整合、sitemapは2URL |
| 通常build | noindex版として成功。開発・preview設定を維持 |
| privacy表示 | 390px・1440pxで9項目、横はみ出しなし、補足原稿を表示 |
| Tallyポリシーリンク | 公開フォームからhttps://connect-mkt.jp/privacy/を再取得確認。Email欄も維持 |
| 実際の本番privacy到達 | 本番公開していないため、公開後の確認対象 |
| 英語/特典/MCP | 既存方針を維持。英語・特典noindex、特典バイト一致、mcp.json成果物なし |
| 公開用/復旧用ZIP | 再生成・SHA256更新・両ZIPを展開して元ディレクトリと全ファイル一致 |
| ZIP内privacy | 両方にベルギー/EU・GCP・DPA・通知メール/エクスポート・バックアップ・原則1年を確認 |
| privacy/CSS | ZIP内のprivacy本文はrobots指定以外で一致。必要CSSも存在 |
| 公開workflow | 手動main限定・github-pages Environment・release/rollback選択を再確認。未実行 |

公開用ZIPはindex設定、復旧用ZIPは一時復旧のためnoindex設定。最新ZIPとSHA256はworkflowが参照している `docs/review-08/` の同じパスで更新した。古い原稿のZIPをworkflowが参照し続ける状態ではない。

新しい実送信はしていない。通知確認済みという管理者報告を記録し、前回のテストを繰り返して回答を増やしていない。現時点の本番サイトに変更はない。

## 更新ファイル

src/pages/privacy.astro、README.md、LAUNCH-RUNBOOK.md、FINAL-PRELAUNCH.md、docs/review-08/の公開用/復旧用ZIP・SHA256・検証JSON、docs/final-prelaunch/の画面・最終検証JSON。

## 管理者の公開操作

1. 現行PagesのSource・独自ドメイン・HTTPS・成功runを記録し、最新ZIP/チェックサムを外部保管。github-pages Environmentをmain限定・利用可能なら承認者付きにする。
2. 別途公開承認後、feature/lp-v3をmainへマージし、Pages SourceをGitHub Actionsへ切り替える。connect-mkt.jpとHTTPSを維持。DNS/CNAMEは変更しない。
3. mainから `Manual Pages release or rollback` をoperation=releaseで手動実行する。
4. 公開直後にHTTPS、privacy（Tallyリンクからの実到達）、問い合わせ送信と通知、主要URLと検索設定を確認する。問題時はoperation=rollbackで最新privacyを保持したZIPを配信する。

[公開・復旧手順](LAUNCH-RUNBOOK.md)、[ZIP検証](docs/final-prelaunch/archive-results.json)、[表示・Tallyリンク検証](docs/final-prelaunch/browser-results.json)。

[390px privacy](docs/final-prelaunch/privacy-390.png)、[PC privacy](docs/final-prelaunch/privacy-1440.png)。

今回はmainマージ・Pages設定変更・DNS/CNAME変更・本番デプロイを実施していない。
