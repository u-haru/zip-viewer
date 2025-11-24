import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: 'Zip Viewer',
      dropHere: 'Drop a ZIP containing images here',
      orClick: 'or click to choose',
      spread: 'Spread',
      direction: 'Reading direction',
      rtl: 'Right to left',
      ltr: 'Left to right',
      zoom: 'Zoom',
      fit: 'Fit',
      fitWidth: 'Fit width',
      fitHeight: 'Fit height',
      actualSize: 'Actual size',
      toc: 'Table of contents',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      next: 'Next',
      prev: 'Prev',
      goTo: 'Go to page',
      keyboardShortcuts: 'Shortcuts',
      loading: 'Loading pages...',
      offlineHint: 'Last opened comic is available offline.',
      thumbnails: 'Thumbnails',
      fullscreenReader: 'Fullscreen Reader',
      jump: 'Jump',
      openZip: 'Open ZIP',
      reader: 'Reader',
      spreadOn: 'Spread: ON',
      spreadOff: 'Spread: OFF',
    },
  },
  ja: {
    translation: {
      title: 'Zip Viewer',
      dropHere: '画像入りZIPをここにドロップ',
      orClick: 'またはクリックして選択',
      spread: '見開き',
      direction: '読書方向',
      rtl: '右→左',
      ltr: '左→右',
      zoom: 'ズーム',
      fit: '全体フィット',
      fitWidth: '幅フィット',
      fitHeight: '高さフィット',
      actualSize: '等倍',
      toc: '目次',
      theme: 'テーマ',
      light: 'ライト',
      dark: 'ダーク',
      system: 'システム',
      next: '次へ',
      prev: '戻る',
      goTo: 'ページ移動',
      keyboardShortcuts: 'ショートカット',
      loading: 'ページを読み込み中...',
      offlineHint: '最後に開いた作品はオフラインでも閲覧できます',
      thumbnails: 'サムネイル',
      fullscreenReader: '全画面リーダー',
      jump: '移動',
      openZip: 'ZIPを開く',
      reader: 'リーダー',
      spreadOn: '見開き: オン',
      spreadOff: '見開き: オフ',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ja',
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
