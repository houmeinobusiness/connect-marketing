# GitHub Pages移行・復旧手順（未実施）

対象：houmeinobusiness/connect-marketing / feature/lp-v3。2026-10-25（日本時間）。

この文書は将来の公開担当者用。今回、mainへのマージ、公開、Pages・DNS・CNAME変更、デプロイ権限を持つCIの追加は行っていません。

## 1. 現状と公開判定

- 調査起点：91438ec。main取得値：342b0303f5d61c33d354f1d77b8cd2b91d05efab。
- ルートの旧HTML・en・特典・mcp.json・CNAMEは維持。新LPはlp-v3/dist/へビルドされる。
- site=https://connect-mkt.jp、base=/。LPとprivacyはnoindex,nofollowを維持。
- 既存CIはcheck/buildのみ、contents:read。現在のPages公開元は未確認。GET /repos/houmeinobusiness/connect-marketing/pagesはForbiddenで取得できなかった。main/root配信と断定しない。
- 本番トップ・英語ページ・mcp.jsonをWeb経由で読み取り確認。/mcp・/privacy/・特典のWeb取得は失敗し、HTTPステータスやAPIの稼働を確定できなかった。

### 公開を妨げる必須項目

1. Tallyの公開版にEmail入力欄が存在し、必須・形式検証・同意・1件の正常送信が通ること。初回取得時はEmail入力欄がなかったが、管理者による反映後にtype=email・必須エラー・不正形式拒否・未同意拒否・実送信1件の成功を確認済み。詳細はREVIEW-06.md。
2. 管理者による通知先・通知メール到達の確認。回答受付200と通知到達は別。
3. 同意付近の正式ポリシーリンクと、実際に公開した/privacy/の両方が利用可能なこと。リンク設定だけでは公開先到達を保証しない。
4. 利用するTally等の国外処理・委託・保管・削除・Cookieの実態と必要な対応を管理者が確認。今回未確認の内容を補完しない。
5. 旧en・mcp宣言の扱いを決定し、未確認の旧訴求を新成果物にそのまま残さない。現行コピー処理は両方を保持するため、承認方針に合わせた別修正が必要。
6. Pages現行Source・branch/path・Custom domain・Enforce HTTPS・証明書・直近成功runを管理画面で記録。復旧素材と復旧担当を確保。
7. 公開用robots、canonical、サイトマップの生成方針、URL一覧、公開後テストとロールバックをレビューし、公開承認を得る。

### 公開後に対応可能

- 新しい実績・自主制作デモ、詳細プロフィールの追加（完成・掲載許諾が条件）。
- 英語版の全面制作（初回は承認済み暫定案内で旧訴求を解消しておく）。
- 正式OGP画像の追加・SNS表示調整。現時点はtitle/description/urlのみでog:imageなし。SNS共有を初日から行うなら画像も公開前必須へ繰上げ。
- 継続的なパフォーマンス改善、Search Consoleへのサイトマップ送信、流入分析導入（導入時にプライバシー方針等を再確認）。

## 2. 変更前に確保する復旧素材

1. Settings > Pagesの現在値と成功デプロイのrun URL・SHA・artifact有効期限を記録。DNSは閲覧・記録のみとし、移行で変更しない。
2. 本文書と同梱の `docs/review-06/production-source-342b030.zip` はmainの上記SHAの全5ファイルをgit archiveしたもの。sha256ファイルで検証する。本番配信物と完全一致したことまで保証するものではなく、公開前に現行配信との照合が必要。
3. 現行配信のHTML・assets・CNAMEと最新ソースを別保管。ZIPはmainを変更せず再展開でき、旧サイトはNode依存なしでローカル表示可能。
4. 新LP公開後はTallyが/privacy/にリンクする。旧サイトだけへ戻すとポリシーが消えるため、復旧用成果物は「旧5ファイル＋公開承認済みprivacy/index.html・必要な_astro/とfavicon」を準備し、ローカルで確認する。旧URLファイルの内容を変えない。privacy用アセットは復旧元旧assetsと衝突させない。
5. 初回公開用artifact・復旧artifactとそれぞれのSHA256を外部保管し、有効期限切れでも再アップロードできるようにする。公開前に復旧成果物をローカルでリハーサルする。

## 3. 公開用変更の準備（別の承認作業）

- `src/layouts/Layout.astro` のnoindex,nofollowを正式公開用に変更。全体文字列置換で特典の既存noindexまで消さない。開発環境にはnoindexを維持する仕組みを用意する。
- canonical/og:urlは / と /privacy/ が各自の本番URLであることを確認。古い英語版のhreflangを新LPへ無条件追加しない。
- サイトマップは現在未実装。@astrojs/sitemap導入または静的XML生成で承認済みの / と /privacy/ を含める。旧英語・特典・MCPやnoindexページを自動的に収録しない。robots.txtに本番sitemapのURLを記載する場合も、開発中のnoindexを置き換えるものではない。
- OGP画像を追加する場合は絶対URL・画像サイズ・altを設定し、他のメタ情報と合わせて確認。
- `preserve-legacy.mjs` を承認済みURL方針に合わせる。GitHub Pagesの静的配信では任意のHTTP 301/410やRewriteを実装できない。HTML案内・移動先リンクとHTTPリダイレクトを混同しない。
- npm ci、check、buildを実施し、公開対象がリポジトリルートではなく `lp-v3/dist/` であることを確認する。

## 4. GitHub Actionsへの切り替え（承認後のみ）

1. リリース内容を承認し、別途mainへのマージを実施。デプロイ前にmainの正確なSHAを記録する。
2. 将来の公開workflowは手動実行（workflow_dispatch）のみから開始。main以外では実行せず、github-pages Environmentのmain制限・承認者設定（利用可能な場合）を使う。既存check CIにはデプロイ権限を追加しない。
3. Settings > Pages > Build and deployment > SourceをGitHub Actionsへ切り替える。この操作は今回行わない。
4. Custom domain=connect-mkt.jpとHTTPS設定を維持。DNS、CNAMEの値・ファイルを削除・書換えしない。Actions公開ではCNAMEファイルは不要・無視されるが、既存ファイルは復旧用に保持する。独自ドメインはPages設定が管理する。
5. 承認済みmain SHAで下記構成の手動workflowを実行し、環境承認後にdeployを進める。Source切替中も旧サイトが無停止で維持されると断定せず、作業時間帯と担当を確保する。

以下は設計例であり、`.github/workflows/` に設置していない。導入時に公式Actionの版・SHA固定方針を再確認する。

```yaml
name: Publish approved LP
on:
  workflow_dispatch:
permissions:
  contents: read
concurrency:
  group: pages-production
  cancel-in-progress: false
jobs:
  build:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: read
    env:
      ASTRO_TELEMETRY_DISABLED: 1
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: npm
          cache-dependency-path: lp-v3/package-lock.json
      - uses: actions/configure-pages@v5
      - run: npm ci
        working-directory: lp-v3
      - run: npm run check
        working-directory: lp-v3
      - run: npm run build
        working-directory: lp-v3
      # ここに公開robots・必須URL・承認済み旧URL方針の成果物検査を追加
      - uses: actions/upload-pages-artifact@v4
        with:
          path: lp-v3/dist
          retention-days: 7
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

## 5. 公開直後の確認・中止基準

- HTTPSで /、/privacy/、CSS、favicon、サイトマップ、承認済み旧URLが期待どおりに応答することを確認。未知のURLは404とし、すべてをトップへ転送しない。
- ドメイン・証明書・HTTPSリダイレクト・mixed contentを確認。noindex解除は公開対象ページのみを実配信HTMLで確認する。
- canonical/OGP/サイトマップのURLとリンクを確認。320/390/768/1440pxで埋め込み・高さ・相談導線を確認。
- 本番LPから架空データ1件だけで実送信し、Tally回答・完了画面と管理者通知到達を別々に確認。テストIDを記録し、確認後削除。
- Tally同意のポリシーリンクを実際に開き、/privacy/全文へアクセスできることを確認。
- HTTPS不良、主要ページ404、フォーム不能・未同意送信・メール形式未検証、重大な旧訴求の残存、ポリシー欠落があれば公開担当がロールバック判断する。

## 6. ロールバック

1. 進行中の将来デプロイを停止し、追加の公開操作を止める（DNSやドメインを外さない）。障害内容・新旧SHA・runを記録。
2. 第一案：SourceはActionsのまま、事前検証済み復旧artifact（旧サイト＋privacy維持）を同じupload/deploy-pages経由で手動配信する。新LPをrevertしただけでは配信は戻らない。必ず成功したdeploymentと実URLを確認する。
3. artifactが失効している場合は保管ZIP・記録SHAから復旧用ディレクトリを再構成する。旧サイトはビルド不要。外部保管済みprivacy/アセットを加え、ZIPハッシュと内容を確認してから配信する。
4. 第二案：Actions自体が使えない場合、記録済みの以前のSource/branch/pathへ戻す。ただしmainの現在内容が以前と異なる可能性があるため、復旧用ソースbranchとCNAME・privacyを先に確認する。mainをforce-push/resetしない。この設定変更も別途承認された復旧作業でのみ行う。
5. /、旧URL、/privacy/、HTTPSと問い合わせ導線を再確認。Tally回答はサイトを戻しても削除されない。通知・テスト回答の整理は管理者側で行う。

## 根拠・未確認範囲

- GitHub公式：https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- 独自ドメイン：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- 公式にはdeploy jobのpages:write/id-token:write、buildへのneeds、github-pages Environmentが必要。Actions公開では既存CNAMEは不要・無視されると明記されている。
- 現行Pages設定、実際の成功デプロイSHA・DNS・証明書、バックリンク数・利用ログは今回未取得。復旧の最終保証には管理画面の記録とリハーサルが必要。
