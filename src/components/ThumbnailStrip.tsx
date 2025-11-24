import { Box, Typography } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useViewerStore } from '../store/viewerStore';
import type { PageEntry } from '../types';

const Thumb = React.forwardRef<
  HTMLButtonElement,
  { page: PageEntry; index: number; active: boolean; onClick: () => void }
>(({ page, index, active, onClick }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    className={clsx(
      'relative overflow-hidden rounded-lg border transition-all',
      active
        ? 'ring-2 ring-primary-500 border-primary-400'
        : 'border-slate-300/70 dark:border-slate-700',
      'hover:-translate-y-0.5'
    )}
    style={{ width: 96, height: 120, flex: '0 0 auto' }}
  >
    <img
      src={page.url}
      alt={page.name}
      className="h-full w-full object-cover"
      loading="lazy"
    />
    <span className="absolute bottom-1 right-2 rounded bg-black/70 px-1 text-xs text-white">
      {index + 1}
    </span>
  </button>
));
Thumb.displayName = 'Thumb';

const ThumbnailStrip = () => {
  const pages = useViewerStore((s) => s.pages);
  const currentIndex = useViewerStore((s) => s.currentIndex);
  const setCurrentIndex = useViewerStore((s) => s.setCurrentIndex);
  const readingDirection = useViewerStore((s) => s.readingDirection);
  const spread = useViewerStore((s) => s.spread);
  const { t } = useTranslation();
  const thumbRefs = React.useRef<Record<number, HTMLButtonElement | null>>({});
  const stripRef = React.useRef<HTMLDivElement | null>(null);

  const highlighted = React.useMemo(() => {
    if (!pages.length) return new Set<number>();
    if (!spread) return new Set([currentIndex]);
    const pair =
      readingDirection === 'rtl'
        ? [currentIndex, currentIndex + 1]
        : [currentIndex, currentIndex + 1];
    return new Set(pair.filter((i) => i >= 0 && i < pages.length));
  }, [pages.length, spread, currentIndex, readingDirection]);

  React.useEffect(() => {
    const node = thumbRefs.current[currentIndex];
    const nextNode = thumbRefs.current[currentIndex + 1];
    const container = stripRef.current;
    if (!node || !container) return;
    const targetLeft = Math.min(
      node.offsetLeft,
      nextNode ? nextNode.offsetLeft : node.offsetLeft
    );
    const nodeWidth = node.clientWidth;
    const nodeLeft = targetLeft;
    const containerWidth = container.clientWidth;
    const targetScroll = nodeLeft - nodeWidth / 2 - containerWidth / 2;
    // container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    // rtlならscrollRightを使う
    if (readingDirection === 'rtl') {
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    } else {
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }, [currentIndex, readingDirection]);

  if (!pages.length) return null;

  const orderedPages = pages;
  const toActualIndex = (displayIndex: number) => displayIndex;

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{ minWidth: 70, alignSelf: 'center', color: 'text.secondary' }}
      >
        {t('thumbnails')}
      </Typography>

      <Box
        className="scrollbar-thin"
        ref={stripRef}
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          py: 1,
          flexDirection: readingDirection === 'rtl' ? 'row-reverse' : 'row',
        }}
      >
        {orderedPages.map((page, idx) => {
          const realIndex = toActualIndex(idx);
          return (
            <Thumb
              key={`${page.name}-${idx}`}
              page={page}
              index={realIndex}
              active={highlighted.has(realIndex)}
              onClick={() => setCurrentIndex(realIndex)}
              ref={(el: HTMLButtonElement | null) => {
                thumbRefs.current[realIndex] = el;
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ThumbnailStrip;
