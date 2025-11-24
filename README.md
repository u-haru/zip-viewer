# Zip Viewer

ブラウザだけで画像入りZIP（電子書籍/同人誌/スキャン等）を閲覧できる React + TypeScript 製の SPA です。Tailwind CSS と MUI で UI を構築し、PWA と i18n、ダークモード、キーボード操作をサポートします。

## デモ

- GitHub Pages: https://u-haru.github.io/zip-viewer/

## 推奨環境

- Node.js 20+（LTS）
- npm 10 もしくは pnpm / yarn でも可
- モダンブラウザ: Chrome / Edge / Firefox / Safari (最新版近辺)

## セットアップ

```bash
npm install
npm run dev
```

## 主な機能

- ZIP ファイルからの画像展開（ドラッグ&ドロップ / ファイル選択）
- 右開き・左開き、単ページ・見開き切り替え
- フィット/幅フィット/高さフィット/等倍/任意ズーム、ダブルクリック・Ctrl+ホイール対応
- サムネイルフィルムストリップとページ番号ジャンプ
- toc.json 読み込み & 目次ドロワー
- 最近開いた ZIP の履歴保存、最後に開いた作品をオフライン再閲覧
- ダークモード / システム追従
- 日本語・英語の i18n + 言語自動検出
- PWA (offline cache, installable)
- キーボードショートカット: ←/→, Space/Backspace, +/-, F(フィット), T(見開き), D(読書方向), G(先頭)

## ビルド & 品質チェック

```bash
npm run lint       # ESLint + Prettier
npm run test       # Jest + Testing Library
npm run e2e        # Playwright E2E (dev server を自動起動)
npm run build      # Vite build + tsc --build
```

## デプロイ (GitHub Pages)

- `main` ブランチへ push すると GitHub Actions が `lint` / `test` / `build` を実行し、`gh-pages` ブランチへデプロイします。
- 公開 URL: https://u-haru.github.io/zip-viewer/

## PWA

- `vite-plugin-pwa` で `registerType: autoUpdate`
- アイコン: `public/icons/pwa-192.png`, `public/icons/pwa-512.png`
- `manifest.webmanifest` を同梱

## ディレクトリ構成

```
src/
  App.tsx            # 画面全体のレイアウト/状態連携
  components/        # UI パーツ (ViewerCanvas, DropZone, TocDrawer 等)
  store/             # Zustand のグローバル state
  utils/zip.ts       # JSZip ローダ
  i18n.ts            # 言語初期化
  setupTests.ts      # Jest セットアップ
```

## ライセンス

MIT License
