export type ReadingDirection = 'ltr' | 'rtl';
export type ZoomMode = 'fit';
export type ThemeChoice = 'light' | 'dark' | 'system';

export type PageEntry = {
  name: string;
  url: string;
  dataUrl?: string;
};

export type TocItem = {
  title: string;
  page: number;
};

export type RecentEntry = {
  name: string;
  openedAt: number;
  pageCount: number;
  size: number;
};
