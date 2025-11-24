import { get, set as idbSet } from 'idb-keyval';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PageEntry,
  ReadingDirection,
  ThemeChoice,
  TocItem,
} from '../types';
import { getPageBlob } from '../utils/pageCache';

export type ViewerState = {
  pages: PageEntry[];
  toc: TocItem[];
  currentIndex: number;
  readingDirection: ReadingDirection;
  spread: boolean;
  gapless: boolean;
  theme: ThemeChoice;
  locale: 'en' | 'ja';
  isLoading: boolean;
  error?: string;
  setLocale: (loc: 'en' | 'ja') => void;
  setTheme: (theme: ThemeChoice) => void;
  setPages: (pages: PageEntry[], toc?: TocItem[], name?: string) => void;
  setCurrentIndex: (index: number) => void;
  next: () => void;
  prev: () => void;
  toggleSpread: () => void;
  toggleGapless: () => void;
  toggleDirection: () => void;
  setDirection: (dir: ReadingDirection) => void;
  setLoading: (v: boolean) => void;
  setError: (msg?: string) => void;
  hydrateFromCache: () => Promise<boolean>;
};

const clampIndex = (index: number, pages: PageEntry[]) => {
  if (!pages.length) return 0;
  return Math.min(Math.max(index, 0), pages.length - 1);
};

const persistConfig = {
  name: 'zip-viewer-settings',
  partialize: (state: ViewerState) => ({
    readingDirection: state.readingDirection,
    spread: state.spread,
    gapless: state.gapless,
    theme: state.theme,
    locale: state.locale,
  }),
};

export const useViewerStore = create<ViewerState>()(
  persist(
    (set, _getState) => ({
      pages: [],
      toc: [],
      currentIndex: 0,
      readingDirection: 'ltr',
      spread: false,
      gapless: false,
      theme: 'system',
      locale: 'ja',
      isLoading: false,
      error: undefined,
      setLocale: (loc) => set({ locale: loc }),
      setTheme: (theme) => set({ theme }),
      setPages: (pages, toc = [], name) => {
        set({ pages, toc, currentIndex: 0 });
        const persistable = pages.map((p) => ({
          name: p.name,
          cacheKey: p.cacheKey,
          dataUrl: p.dataUrl,
        }));
        void idbSet('last-comic', { pages: persistable, toc, name });
      },
      setCurrentIndex: (index) =>
        set((state) => ({ currentIndex: clampIndex(index, state.pages) })),
      next: () =>
        set((state) => {
          const step = state.spread ? 2 : 1;
          const dir = state.readingDirection === 'rtl' ? -1 : 1;
          return {
            currentIndex: clampIndex(
              state.currentIndex + step * dir,
              state.pages
            ),
          };
        }),
      prev: () =>
        set((state) => {
          const step = state.spread ? 2 : 1;
          const dir = state.readingDirection === 'rtl' ? -1 : 1;
          return {
            currentIndex: clampIndex(
              state.currentIndex - step * dir,
              state.pages
            ),
          };
        }),
      toggleSpread: () => set((state) => ({ spread: !state.spread })),
      toggleGapless: () => set((state) => ({ gapless: !state.gapless })),
      toggleDirection: () =>
        set((state) => ({
          readingDirection: state.readingDirection === 'ltr' ? 'rtl' : 'ltr',
        })),
      setDirection: (dir) => set({ readingDirection: dir }),
      setLoading: (v) => set({ isLoading: v }),
      setError: (msg) => set({ error: msg }),
      hydrateFromCache: async () => {
        if (typeof indexedDB === 'undefined') return false;
        const cached = await get<{
          pages: PageEntry[];
          toc: TocItem[];
          name?: string;
        }>('last-comic');
        if (!cached) return false;
        const hydratedPages: PageEntry[] = [];
        for (const p of cached.pages) {
          let url = '';
          if (p.cacheKey) {
            const blob = await getPageBlob(p.cacheKey);
            if (blob) url = URL.createObjectURL(blob);
          }
          if (!url && p.dataUrl) {
            url = URL.createObjectURL(dataUrlToBlob(p.dataUrl));
          }
          if (!url && p.url) {
            url = p.url;
          }
          if (url) hydratedPages.push({ ...p, url });
        }
        set({ pages: hydratedPages, toc: cached.toc ?? [], currentIndex: 0 });
        return true;
      },
    }),
    persistConfig
  )
);

const dataUrlToBlob = (dataUrl: string) => {
  const arr = dataUrl.split(',');
  const mime = arr[0]?.match(/:(.*?);/)?.[1] ?? 'image/png';
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i += 1) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
};
