# Connect Marketing Ver.3.0 レビュー③：モバイル固定CTAの撤去

作業日：2026-10-25（日本時間）

対象：`feature/lp-v3` / `lp-v3/`。開始時は `4fd8fe4`、リモート取得履歴と一致。

## 変更内容

- `src/components/Footer.astro`：`.mobile-cta` のリンク要素と、表示・非表示を制御していたJavaScriptを完全に削除。フッター本体の内容は維持。
- `src/styles/global.css`：固定CTA関連の全4ルール、bodyの60px＋セーフエリア用下部余白、旧footerの105px／35px上書きを削除。body下部余白は0px、フッターは既定の上下34pxに統一。
- `README.md`：現行のCTA構成へ説明を更新。
- `docs/review-03/`：4サイズの全ページ・通常画面キャプチャ、検証結果JSONを追加。
- 新しい固定CTA・フローティングボタンは追加していない。

色・FV図解・全体レイアウトは維持。上部のstickyヘッダーとその相談ボタン、FV内CTA、サービスカード内の3つの問い合わせリンクはそのまま残している。キーボード操作用の「本文へスキップ」リンクも維持。

## 検証結果

| 画面サイズ | 横はみ出し | 下部固定CTA | FV図解へのボタン重なり | 相談リンク | フッター上下余白 |
| --- | --- | --- | --- | --- | --- |
| 320×740px | なし | 要素なし | なし | 5リンク成功 | 34px |
| 390×844px | なし | 要素なし | なし | 5リンク成功 | 34px |
| 768×1024px | なし | 要素なし | なし | 5リンク成功 | 34px |
| 1440×1000px | なし | 要素なし | なし | 5リンク成功 | 34px |

- Chromiumで検証。各サイズでFV、サービス、代表、流れ、問い合わせ、フッターの各位置をスクロールし、固定CTAが出現しないことを確認。
- ヘッダー、FV、サービスカード3枚のリンクをそれぞれクリックし、`#contact` に移動することを確認。
- 390×844pxは全ページ画像だけでなく、実寸の通常画面を撮影。ページ先頭、図解表示中、フッター位置を目視確認。図解表示時は3つのラベル上に別ボタンがないこともブラウザーの重なり判定で確認。
- JavaScriptページエラーなし。ソース・生成CSS／アセットに `.mobile-cta` 残存なし。
- `npm run check`：10ファイル、エラー0・警告0・ヒント0。
- `npm run build`：成功。既存URLのコピーも成功。
- 独立したコードレビューでも、CTA本体・制御JS・関連CSS・専用余白の撤去漏れと、指定範囲外のレイアウト変更がないことを確認。

## キャプチャ

390×844pxの通常画面：

- [ページ先頭](docs/review-03/390-first-view.png)
- [FV図解表示中](docs/review-03/390-diagram-viewport.png)
- [フッター表示中](docs/review-03/390-footer-viewport.png)

| 幅 | 全ページ | 図解表示中の通常画面 |
| --- | --- | --- |
| 320px | [全ページ](docs/review-03/320-full.png) | [通常画面](docs/review-03/320-diagram-viewport.png) |
| 390px | [全ページ](docs/review-03/390-full.png) | [通常画面](docs/review-03/390-diagram-viewport.png) |
| 768px | [全ページ](docs/review-03/768-full.png) | [通常画面](docs/review-03/768-diagram-viewport.png) |
| 1440px | [全ページ](docs/review-03/1440-full.png) | [通常画面](docs/review-03/1440-diagram-viewport.png) |

機械検証の詳細：[results.json](docs/review-03/results.json)

## 維持した制約と残作業

- 問い合わせフォームの全入力・送信ボタンは無効のまま。送信サービス未接続の説明も維持。
- `noindex,nofollow` を維持。
- 既存トップ、英語版、assets、mcp.json、CNAME、CIは今回差分なし。既存の英語ページ・特典HTML・mcp.jsonはビルド出力とのバイト一致も確認。
- mainへのマージ、本番公開、DNS・Pages・CNAME設定変更は実施していない。
- Tallyの正式ID・通知先・個人情報方針、OGP画像等の未完了項目は前回READMEのとおり。今回の撤去作業では変更していない。
- 実端末・Safari等の追加ブラウザー確認は公開前の確認事項。今回の表示検証はChromium。
