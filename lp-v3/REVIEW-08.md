# 制作指示⑧ 完了報告

2026-10-25（日本時間）。開始45cdbc6、feature/lp-v3内で作業。本番公開はしていない。

## 実装結果

- /en/は旧海外事業とMCP宣言を除去し、Web/LP制作改善・広告/Webマーケティング・メール/MA/業務自動化の簡潔な英語案内へ改訂。日本語公式サイト・問い合わせ・privacyへリンクし、英語対応を保証する表現はない。常にnoindex。
- 特典はURL・内容・既存noindexを維持。配布物はページ内のプロンプトで、別のダウンロード先はない。コピー操作を実ブラウザーで確認。フォーム/データの不審送信や明白な第三者有料素材の転載は掲載コードから特定されなかった。権利証跡までは未取得。外部予約先の取得は失敗し、予約可否は未検証。8大SNSと7フォーマット表記の違いは軽微な将来整理事項。権利帰属・予約提供条件は所有者の確認を残す。
- MCP実API・既存利用者は確認できないため、新LP成果物から除外。root mcp.jsonは旧ソースとして保持するが、コピー処理から除外し、古いビルドの残骸も削除。新成果物内のmcp.json/discovery/active宣言を自動検査。mcp.jsonの原本ファイルは変更していない。
- 開発用と本番用ビルドを分離。通常build/previewはnoindex、本番build:productionの/と/privacy/のみindex。開発サーバーはreleaseモード指定でもDEV判定でnoindex。
- robots.txt/sitemap.xmlを静的生成。公開sitemapは/と/privacy/のみ。en・特典はnoindex/サイトマップ除外。プレビューは全Disallow・空sitemap。
- mainだけから手動実行するGitHub Pages公開/復旧workflowを準備。push/PRによる自動デプロイはない。今回workflowを実行していない。
- 検証済み本番ZIPと、旧トップ＋現行privacyを保持した復旧ZIPをSHA256付きで作成。復旧workflowは新LPを再ビルドせず保存ZIPを展開する。

## 検証

- Astro check：17ファイル、エラー0・警告0・ヒント0。
- 通常buildとbuild:production成功。index設定・canonical/OG URL・sitemap対象・robots・MCP除外を成果物から検査して成功。
- 復旧build成功。privacy本文・CSSファイル・正式Tallyリンク・MCP除外を確認。ZIPを展開して全ファイル一致も確認。
- 本番/プレビュー/復旧の3構成×320/390/768/1440pxでHTTP・ブラウザー検証。privacyは9項目とCSS表示成功、英語案内は横はみ出しなし・noindex。LPの5つの相談リンクは全幅で成功。復旧トップのデザイン全面改修や旧CTA全機能の保証は対象外。
- 本番用フォーム表示：390pxで1014px、1440pxで924pxへ自動高さ調整。今回は追加の実送信をしていない。前回⑥で正常送信と形式/同意検証を確認済みだが、通知受信は管理者確認待ち。
- mcp.jsonは3構成すべてでHTTP 404。新規API・架空の稼働statusなし。
- 特典コピー後のクリップボード内容が掲載プロンプトと一致し、コピー完了表示を確認。配布HTMLは元ファイルとバイト一致。
- workflow YAML構造を検査し、手動/main限定・Environment指定・deployだけwrite権限を確認。GitHub Actions上での実行は未検証。

## 公開対象と検索設定

| URL | 開発・プレビュー | 本番用成果物 |
| --- | --- | --- |
| / | noindex | index、sitemap収録 |
| /privacy/ | noindex | index、sitemap収録 |
| /en/ | noindex | noindex、sitemap外 |
| /assets/gifts/8sns-ai-prompt-2026.html | 既存noindex | 既存noindex、sitemap外 |
| /mcp.json、/mcp | なし | なし・404 |

本番用成果物をローカルに生成しただけで、現在の本番サイトのrobots/noindexは変更していない。通常npm run previewはnoindex版を再ビルドして表示する。

## 主な変更ファイル

- en/index.html：暫定英語案内
- lp-v3/src/lib/indexing.ts、src/layouts/Layout.astro：検索設定のモード分離
- src/pages/robots.txt.ts、sitemap.xml.ts：静的生成
- package.json：公開用/復旧/プレビューコマンド
- scripts/preserve-legacy.mjs、verify-output.mjs、build-rollback.mjs：選択コピー・成果物検査・復旧生成
- .github/workflows/lp-v3-check.yml：通常/本番/復旧ビルド検査
- .github/workflows/pages-release.yml：未実行の手動main限定公開/ZIP復旧
- README.md、LAUNCH-RUNBOOK.md、LEGACY-URL-PLAN.md：現仕様への更新
- docs/review-08/：画面・検証JSON・公開/復旧ZIP・SHA256

## 残作業：公開開始前のチェックリスト

- [ ] 管理者が通知受信、Tallyの国外処理・委託・保存/削除・スパム対策等を確認。
- [ ] 特典の権利帰属と旧予約先の提供可否を所有者が確認。既存MCP利用者が判明した場合は公開を止め移行方法を調整。
- [ ] 現行Pages Source/Custom domain/HTTPS/成功runを記録し、ZIPを外部保管。公開Environmentのmain制限・承認者を設定。
- [ ] リリース内容を承認し、別途mainへマージ、SourceをActionsへ切替、手動releaseを実施。
- [ ] 公開直後にHTTPS・公開/非公開URL・本番privacyのTallyリンク・フォーム送信と通知を確認。

正式OGP画像は未実装。既存title/description/urlは整合確認済み。SNS共有前に画像を追加する。

## 証跡

[公開・復旧手順](LAUNCH-RUNBOOK.md)、[3構成のブラウザー検証](docs/review-08/browser-results.json)、[ZIP検証](docs/review-08/artifact-verification.json)

[本番用ZIP](docs/review-08/production-site.zip)、[復旧用ZIP](docs/review-08/rollback-site.zip)

[390px問い合わせ](docs/review-08/production-390-contact.png)、[PC問い合わせ](docs/review-08/production-1440-contact.png)、[復旧privacy](docs/review-08/rollback-390-privacy.png)

mainへのマージ、本番デプロイ、Pages/DNS/CNAME設定変更は未実施。root index.html・mcp.json・CNAME・特典元ファイルは変更していない。
