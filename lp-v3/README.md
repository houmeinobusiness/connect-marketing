# Connect Marketing LP v3

本番を保護する独立Astroプロジェクト。リポジトリルートの既存トップ・CNAME・公開ファイルは変更しません。

## 開発

Node.js 22.23.4以上（検証・CIは24）、npmを使用します。

```sh
cd lp-v3
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Astroのsiteは `https://connect-mkt.jp`、baseは `/`、静的出力は `lp-v3/dist/` です。ルートの旧index.htmlと新LPのエントリーは独立しています。GitHub Pagesの設定・配信対象を変更しない限り、本番には反映されません。

ビルド後に `scripts/preserve-legacy.mjs` が既存の `en/`、`assets/`、`mcp.json` を出力先にコピーします。旧ファイルは互換性のため保持しており、新事業への継承やAPIの稼働を保証するものではありません。CNAMEはコピー・変更しません。

## 公開前の確認

- フォーム送信サービス、個人情報の取り扱い方針、返信・通知先を決定し、実送信を検証する。
- フォームは現在fieldsetごと無効化。送信・保存を行わず、未実装を画面に明示。
- 実績は `src/data/projects.ts` に追加する。完成かつ掲載許諾済みの項目のみ描画する。顧客案件と自主制作デモの区分を明記する。
- プレビュー用の `noindex,nofollow` を公開承認後に見直す。canonicalとOG URLは本番ルートを指定済み。
- 正式なOG画像、個人情報方針、公開可能なプロフィール詳細を確認する。
- 旧英語ページ・配布ページ・MCP宣言の方針を決定し、互換性とリンクを検証する。
- Pages配信方式の移行は別作業。本ブランチのCIは検査・ビルドのみで、Pages書込権限・OIDC権限・デプロイ処理を持たない。

今回、本番公開・mainへのマージ・DNS・Pages設定変更は行いません。
