import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useViewerStore } from '../store/viewerStore';
import type { PageEntry } from '../types';

const ViewerCanvas = () => {
  const { t } = useTranslation();
  const pages = useViewerStore((s) => s.pages);
  const currentIndex = useViewerStore((s) => s.currentIndex);
  const spread = useViewerStore((s) => s.spread);
  const readingDirection = useViewerStore((s) => s.readingDirection);
  const gapless = useViewerStore((s) => s.gapless);
  const isLoading = useViewerStore((s) => s.isLoading);
  const next = useViewerStore((s) => s.next);
  const prev = useViewerStore((s) => s.prev);

  const visiblePages: PageEntry[] = React.useMemo(() => {
    if (!pages.length) return [];
    if (!spread) return [pages[currentIndex]];
    if (readingDirection === 'rtl') {
      return [pages[currentIndex + 1], pages[currentIndex]].filter(
        Boolean
      ) as PageEntry[];
    }
    return [pages[currentIndex], pages[currentIndex + 1]].filter(
      Boolean
    ) as PageEntry[];
  }, [pages, currentIndex, spread, readingDirection]);

  if (!pages.length) {
    return (
      <Box className="flex h-full flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300/70 bg-white/60 p-6 text-center shadow-card dark:border-slate-700 dark:bg-slate-800/60">
        <Typography variant="h6" color="text.secondary">
          {t('dropHere')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="relative flex h-full flex-1 select-none items-center justify-center overflow-auto rounded-2xl bg-white/80 shadow-card dark:bg-slate-800">
      {isLoading && (
        <Box className="absolute inset-0 z-20 flex items-start justify-center p-4">
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      )}
      <Box
        className="flex items-center justify-center gap-4 p-4"
        sx={{
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          gap: gapless ? 0 : '1rem',
        }}
      >
        {visiblePages.map((page) => (
          <img
            key={page.url}
            src={page.url}
            alt={page.name}
            className="max-h-[90vh] max-w-full rounded-xl shadow-md"
            style={{ objectFit: 'contain' }}
          />
        ))}
      </Box>
      <Box className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
        <div className="pointer-events-auto">
          <IconButton size="large" color="primary" onClick={prev}>
            <ArrowBackIosNew />
          </IconButton>
        </div>
        <div className="pointer-events-auto">
          <IconButton size="large" color="primary" onClick={next}>
            <ArrowForwardIos />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default ViewerCanvas;
