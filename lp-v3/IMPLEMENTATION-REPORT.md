# Connect Marketing Ver.3.0 初回制作報告

作業日：2026-10-25（日本時間）

## 本番保護とブランチ

- GitHub連携およびgit fetchで開始時のmain最新を確認：`342b0303f5d61c33d354f1d77b8cd2b91d05efab`（Update index.html）。
- GitHubのブランチ検索および `git ls-remote --heads origin` ではmainのみ。既存feature/lp-v3はなく、履歴の上書きなしで新規作成。
- 作業ブランチ：`feature/lp-v3`。
- 既存 `index.html`、`en/`、`assets/`、`mcp.json`、`CNAME` はmainと差分なし。
- Pages設定、DNS、独自ドメインの変更、mainへのコミット・マージ、本番デプロイは実施していない。
- 新CIは `contents: read` のみ。Pages・OIDC権限なし、ビルド・検査のみ。
- 前回調査の別資料はこのスレッドに添付されていないため、今回の指示とチェックアウト内の既存ファイルを根拠に制作。

## 実装

リポジトリルートの本番ページと分離して `lp-v3/` 内に実装。白、ネイビー `#173047`、青緑 `#247F76`、淡いグレー `#F7F9FA` を使用。FVは事業の目的を中心にした概念図、サービスは3カード、代表紹介、5ステップ、問い合わせを実装。過剰なアニメーションや外部CDN依存はなし。

実績セクションに架空の案件・レビュー・成果数値は掲載していない。データは空配列で、完成・掲載許諾の双方がtrueの案件のみ表示する構造。自主制作デモとクライアント案件を区別できる。

フォームは未接続と表示し、fieldsetとボタンを無効化。ブラウザーからの送信・保存は行わない。個人情報方針は未確定と明示。未確認の旧連絡手段へ誘導していない。

SEOは日本語title、description、canonical、OGメタ情報を設定。プレビューはnoindex,nofollow。正式公開時にrobotsとOG画像を要確認。

## 技術構成

- Astro 7.4.2（静的生成）
- Tailwind CSS 4.3.3、@tailwindcss/vite 4.3.3
- TypeScript 5.9.2、@astrojs/check 0.9.4
- 検証環境 Node.js 24.19.0、npm 11.9.0、CI Node.js 24
- package-lock.json管理、直接依存は固定バージョン
- site: `https://connect-mkt.jp`、base: `/`
- 出力先：`lp-v3/dist/`。現行Pagesの配信対象は変更していない。

## 追加ファイル

- `.gitignore`：作業用work/を除外
- `.github/workflows/lp-v3-check.yml`：featureブランチpushとPRの検査・ビルド
- `lp-v3/package.json`、`package-lock.json`：依存関係・開発コマンド
- `lp-v3/astro.config.mjs`、`tsconfig.json`、`.gitignore`：構成
- `lp-v3/src/layouts/Layout.astro`：共通HTML、メタ情報
- `lp-v3/src/components/Header.astro`、`Footer.astro`：ナビゲーション、スマートフォン固定CTA
- `lp-v3/src/components/ProjectList.astro`：公開条件付き実績表示
- `lp-v3/src/data/projects.ts`：実績型・データ構造
- `lp-v3/src/pages/index.astro`：6セクション
- `lp-v3/src/styles/global.css`：Tailwindとレスポンシブスタイル
- `lp-v3/public/favicon.svg`：簡易ファビコン
- `lp-v3/scripts/preserve-legacy.mjs`：旧URLをビルド成果物に保持
- `lp-v3/README.md`：開発・公開前確認
- `lp-v3/IMPLEMENTATION-REPORT.md`：本報告
- `lp-v3/docs/`：PC・スマートフォンの画面キャプチャと検証結果JSON

## 検証結果

- `npm run check`：9ファイル、エラー0、警告0、ヒント0。
- `npm run build`：成功。Astroによる1ページ静的出力と旧URLファイルのコピー成功。
- `npm audit`：全依存関係の既知の脆弱性0件。初期選定版は検査結果に基づき更新済み。
- Chromiumで1440×1000、390×844、320×740を検証。横はみ出しなし、6セクション、h1は1個、ページ内リンク切れなし、コンソールのページエラーなし。CTAの問い合わせ位置への移動成功。
- フォームと送信ボタンの無効状態を確認。
- 旧英語ページ、配布HTML、mcp.jsonはビルド前後のバイト一致を確認。プレビューHTTP応答は各200。
- 1440px・390px・320pxの全画面キャプチャを作成。主要なPC・スマートフォン画面を目視確認。
- 自動検査の実行はローカル。GitHub Actionsの実行結果は別途確認が必要。
- 指定ブランチをGitHubへpush済み。mainへのマージ・本番公開は未実施。

## 既存URLの移行課題

| URL | 今回の対応 | 今後の候補・影響 |
| --- | --- | --- |
| `/` | 既存ルートHTMLを変更せず、新LPを独立構築 | 新LPへの改訂候補。承認後にPagesのビルド成果物配信方式、メタ情報、旧ハッシュリンク等を確認して切替。今回のままでは本番に新LPは表示されない。 |
| `/en/` | 元ファイルとビルド出力を保持 | 旧海外展開・ライセンス事業の訴求がある。新方針に合わせた英語版改訂、当面維持、廃止のいずれかを判断。旧LPの訴求やリンクを新LPにそのまま流用しない。 |
| `/assets/gifts/8sns-ai-prompt-2026.html` | 元ファイルとビルド出力を保持 | 既存配布リンクのため維持候補。内容・権利・現在の事業との関係を確認し、必要なら改訂。廃止は配布済みリンク切れへの対策が必要。 |
| `/mcp.json` | 元ファイルとビルド出力を保持、新LPで紹介しない | JSONには `/mcp` の宣言があるがAPI実稼働は未検証。実装・認証・運用責任を確認するまで稼働中として訴求しない。改訂・廃止は既存利用者への影響確認後に決定。静的JSONの200応答はAPI稼働の証拠にならない。 |

CNAMEは既存リポジトリにそのまま保持。将来のPages公開方法では、独自ドメイン設定と配信成果物内の扱いを別途確認する。

## 未実装・次の作業

1. デザイン・コピーの確認、代表の公開可能な詳細プロフィール・実績の許諾確認。
2. 送信サービスと個人情報方針の決定。迷惑送信対策、入力検証、送信完了・失敗、通知・返信までの動作確認。
3. 英語版、配布ページ、MCP宣言の維持・改訂・廃止判断。
4. OGP画像の用意、noindex解除判断、実端末・複数ブラウザー・キーボード／読み上げ検証。
5. 別途承認された公開作業で、Pages配信方法と切替・復旧手順を設計。本作業では公開しない。
