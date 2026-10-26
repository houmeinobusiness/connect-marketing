# 正式OGP画像の設定・本番反映手順

2026-10-27（日本時間）。最新main `d9780fbc5f06990f95c8dde7ab11b0db838bdd42` から `feature/ogp-v3` を新規作成。

## 変更

- `public/ogp.png`：提供ZIP内の正式PNGを名前だけ変更して配置。1200×630px、656,531 bytes。再生成・圧縮・文言やデザインの編集なし。
- `src/layouts/Layout.astro`：共通headへog:image/secure_url/type/width/height/altとtwitter:card/imageを追加。画像URLはすべて `https://connect-mkt.jp/ogp.png`。トップ・privacyの既存title/description/url/canonicalと本文は維持。
- `scripts/build-rollback.mjs`：新しく生成する復旧用privacyも共通headを使うため、画像を復旧成果物にもコピー。
- 本文・サービス・プロフィール・Tally・privacy原稿・スタイル・依存関係・公開workflow・DNS/CNAMEは変更なし。

PNGのSHA256：`aaa3a4818ea11e2df71c97d1670f08de4dab120ed5fb2e9bfa191141dba87e44`

## 検証

- Astro check：17ファイル、エラー0・警告0・ヒント0。
- 本番用buildと既存の成果物検査に成功。dist/ogp.pngは提供PNGとバイト一致、PNGシグネチャと1200×630pxの寸法を確認。
- トップ・privacyのHTMLで全指定画像メタを確認。同じ種類のメタタグは各1個。画像参照はHTTPS絶対URL、twitter:cardはsummary_large_image。
- 既存のog:title/description/url/canonicalを維持。各ページのcanonicalは / と /privacy/ に対応。
- Layoutの差分が画像メタの追加だけであることを元mainと比較。LP/フォーム/原稿/スタイルは元mainと差分なし。
- 復旧用build成功。新たに生成する復旧privacyから参照するogp.pngも同梱。
- 390px・1440pxで横はみ出しなし。FVから問い合わせへ移動、Tally表示・送信ボタン操作可能状態、privacyリンクと9項目の表示を確認。追加送信はしていない。
- ローカルの画像URLはHTTP 200・Content-Type=image/png。SNS共有を想定したカードをブラウザーで目視確認。
- READMEのOGP未実装の記述を現在の状態へ更新。
- 本番サイトでの画像HTTP応答、各SNSの実カード、キャッシュ更新は本番反映後の確認事項。ここでは本番に反映していない。

## 共有時の画像

提供画像そのもの：

![正式OGP画像](public/ogp.png)

[想定カードのローカルプレビュー](docs/ogp-v3/share-preview.png)を参照。各SNSの実際のトリミングや文字表示を保証するものではない。

## 管理者による本番反映（今回は未実施）

1. PRをレビューし、別途承認後にmainへマージする。
2. 既存workflow **Manual Pages release or rollback** をmainから手動実行し、`operation=release` を選ぶ。今回Pages/DNS/CNAME設定を変える必要はない。`rollback` は選択しない。
3. mainの最新ソースから `npm run build:production` で生成される `lp-v3/dist/` を配信する。以前の `docs/review-08/production-site.zip` はOGP追加前の保管物なので、この変更の公開用には使わない。
4. 成功したrunのSHAとdeploymentを確認し、次のHTTP・画像・メタ検査を実施する。

```sh
curl --fail --silent --show-error --location \
  --dump-header ogp-headers.txt \
  --output ogp.png \
  --write-out '%{http_code} %{content_type} %{url_effective}\n' \
  https://connect-mkt.jp/ogp.png
```

最終応答がHTTP 200、Content-Typeがimage/png、最終URLがHTTPSの画像URLであることを確認する。HTMLの404ページが画像名で返っていないかも、実際のPNGシグネチャ・寸法・画像表示で確認する。

```sh
python - <<'PY'
from pathlib import Path
import struct, hashlib
image = Path('ogp.png').read_bytes()
assert image[:8] == b'\x89PNG\r\n\x1a\n'
assert struct.unpack('>II', image[16:24]) == (1200, 630)
assert hashlib.sha256(image).hexdigest() == 'aaa3a4818ea11e2df71c97d1670f08de4dab120ed5fb2e9bfa191141dba87e44'
print('PNG・寸法・正式画像との一致を確認')
PY
```

5. 本番 `/` と `/privacy/` のページソースで、画像メタ・Twitterカード・canonical・各ページ固有のtitle/descriptionが正しく、重複がないことを再確認する。
6. LPのPC・スマートフォン表示、Tallyの表示、privacyリンクを確認する。OGP設定確認だけで新しい問い合わせデータを送信する必要はない。
7. note・X・LinkedInの投稿作成画面等でURLを入力し、公開投稿せずにプレビューを確認する。SNS側のキャッシュで旧表示が残る場合は反映を待つか、利用可能な再取得機能を使う。LinkedInではPost Inspector等で再取得できる。実表示が確認できるまで「各SNS反映済み」とは扱わない。

## 復旧について

既存の手動rollbackが使う保管ZIPは変更していない。そのZIP内のprivacyはOGP追加前のため、新しい画像を参照せず、欠けた画像URLは発生しない。OGP追加後のソースから `build:rollback` を実行する場合は画像も同梱される。復旧ZIPを更新する作業は、既存のSHA256再生成・検証手順に従う。

main直接push/マージ、本番デプロイ、Pages/DNS/CNAME設定変更は今回未実施。
