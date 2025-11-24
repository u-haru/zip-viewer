import { ArrowBackIosNew, ArrowForwardIos, Close } from '@mui/icons-material';
import {
  Box,
  Fade,
  IconButton,
  Paper,
  Slider,
  Typography,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useViewerStore } from '../store/viewerStore';
import type { PageEntry } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
};

const ReaderOverlay = ({ open, onClose }: Props) => {
  const currentIndex = useViewerStore((s) => s.currentIndex);
  const spread = useViewerStore((s) => s.spread);
  const readingDirection = useViewerStore((s) => s.readingDirection);
  const gapless = useViewerStore((s) => s.gapless);
  const next = useViewerStore((s) => s.next);
  const prev = useViewerStore((s) => s.prev);
  const toc = useViewerStore((s) => s.toc);
  const setCurrentIndex = useViewerStore((s) => s.setCurrentIndex);
  const setDirection = useViewerStore((s) => s.setDirection);
  const pagesCount = useViewerStore((s) => s.pages.length);
  const pages = useViewerStore((s) => s.pages);
  const { t } = useTranslation();
  const toggleSpread = useViewerStore((s) => s.toggleSpread);

  const [bottomVisible, setBottomVisible] = React.useState(false);
  const tocButtonRefs = React.useRef<Record<number, HTMLButtonElement | null>>(
    {}
  );
  const thumbRefs = React.useRef<Record<number, HTMLImageElement | null>>({});
  const thumbRailRef = React.useRef<HTMLDivElement | null>(null);
  const highlightedThumbs = React.useMemo(() => {
    if (!spread) return new Set([currentIndex]);
    const indices =
      readingDirection === 'rtl'
        ? [currentIndex, currentIndex + 1]
        : [currentIndex, currentIndex + 1];
    return new Set(indices.filter((i) => i >= 0 && i < pagesCount));
  }, [spread, currentIndex, readingDirection, pagesCount]);

  const handleClose = React.useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    }
    onClose();
  }, [onClose]);

  React.useEffect(() => {
    if (!open) return undefined;
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      void el.requestFullscreen().catch(() => undefined);
    }
    const handler = () => {
      if (!document.fullscreenElement) onClose();
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open && document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    }
  }, [open]);

  // lock page scroll while overlay open
  React.useEffect(() => {
    if (!open) return undefined;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [open]);

  React.useEffect(() => {
    const btn = tocButtonRefs.current[currentIndex];
    if (btn) {
      btn.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: 'smooth',
      });
    }
    const container = thumbRailRef.current;
    const thumb = thumbRefs.current[currentIndex];
    if (container && thumb) {
      thumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex]);

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

  if (!open) return null;

  return (
    <Fade in={open}>
      <Box
        className="fixed inset-0 z-[9999] bg-slate-950/90 text-white"
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Box className="flex items-center justify-between px-4 py-2">
          <Typography fontWeight={700}>{t('reader')}</Typography>
          <Box display="flex" gap={1} alignItems="center">
            <Typography variant="body2" sx={{ mr: 1 }}>
              {currentIndex + 1} / {pagesCount}
            </Typography>
            <IconButton
              color={spread ? 'primary' : 'inherit'}
              onClick={toggleSpread}
            >
              {spread ? t('spreadOn') : t('spreadOff')}
            </IconButton>
            <IconButton
              color={readingDirection === 'rtl' ? 'primary' : 'inherit'}
              onClick={() =>
                setDirection(readingDirection === 'rtl' ? 'ltr' : 'rtl')
              }
            >
              {`RTL ${t(readingDirection === 'rtl' ? 'on' : 'off')}`}
            </IconButton>
            <IconButton color="inherit" onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Box className="relative flex flex-1 items-center justify-center overflow-hidden">
          <Box className="absolute inset-0 flex items-center justify-between px-4">
            <IconButton
              size="large"
              color="primary"
              sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'primary.50' } }}
              onClick={prev}
            >
              <ArrowBackIosNew />
            </IconButton>
            <IconButton
              size="large"
              color="primary"
              sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'primary.50' } }}
              onClick={next}
            >
              <ArrowForwardIos />
            </IconButton>
          </Box>

          <Box
            className="flex items-center justify-center gap-4"
            sx={{ flexDirection: 'row', px: 4 }}
          >
            {visiblePages.map((page) => (
              <img
                key={page.url}
                src={page.url}
                alt={page.name}
                className="max-h-[95vh] max-w-[48vw] rounded-xl shadow-2xl"
                style={{
                  objectFit: 'contain',
                  marginInline: gapless ? 0 : '0.5rem',
                }}
              />
            ))}
          </Box>

          {toc.length > 0 && (
            <Box
              className="absolute inset-x-0 bottom-0 pb-2"
              onMouseEnter={() => setBottomVisible(true)}
              onMouseLeave={() => setBottomVisible(false)}
              onMouseMove={() => setBottomVisible(true)}
            >
              <Box className="h-6" />
              <Paper
                elevation={10}
                sx={{
                  mx: 'auto',
                  maxWidth: '1100px',
                  p: 2,
                  bgcolor: 'rgba(15,23,42,0.92)',
                  color: 'white',
                  opacity: bottomVisible ? 1 : 0,
                  pointerEvents: bottomVisible ? 'auto' : 'none',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <Box className="flex flex-col gap-2">
                  <Typography variant="caption">{t('thumbnails')}</Typography>
                  <Box
                    ref={thumbRailRef}
                    className="flex gap-2 overflow-x-auto scrollbar-thin"
                    sx={{
                      maxWidth: '100%',
                      padding: '4px 0',
                      flexDirection:
                        readingDirection === 'rtl' ? 'row-reverse' : 'row',
                    }}
                  >
                    {pages.map((p, idx) => (
                      <button
                        key={p.url}
                        type="button"
                        className="relative overflow-hidden rounded-lg border border-white/30 transition-all"
                        style={{ width: 96, height: 120, flex: '0 0 auto' }}
                        onClick={() => setCurrentIndex(idx)}
                        ref={(el) => {
                          thumbRefs.current[idx] =
                            el as unknown as HTMLImageElement | null;
                        }}
                      >
                        <img
                          src={p.url}
                          alt={p.name}
                          className={`h-full w-full object-cover ${highlightedThumbs.has(idx) ? 'ring-2 ring-primary-400' : ''}`}
                        />
                        <span className="absolute bottom-1 right-2 rounded bg-black/70 px-1 text-xs text-white">
                          {idx + 1}
                        </span>
                        {highlightedThumbs.has(idx) && (
                          <span
                            className="absolute inset-0 bg-primary-500/20"
                            aria-hidden
                          />
                        )}
                      </button>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      direction: readingDirection === 'rtl' ? 'rtl' : 'ltr',
                    }}
                  >
                    <Slider
                      aria-label={typeof t === 'function' ? t('goTo') : 'go to'}
                      min={1}
                      max={pagesCount || 1}
                      value={
                        readingDirection === 'rtl'
                          ? pagesCount - currentIndex
                          : currentIndex + 1
                      }
                      onChange={(_, v) => {
                        const num = v as number;
                        const idx =
                          readingDirection === 'rtl'
                            ? pagesCount - num
                            : num - 1;
                        setCurrentIndex(idx);
                      }}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(v) =>
                        readingDirection === 'rtl' ? pagesCount - v + 1 : v
                      }
                      getAriaValueText={(v) =>
                        `${readingDirection === 'rtl' ? pagesCount - v + 1 : v}`
                      }
                      track={readingDirection === 'rtl' ? 'inverted' : 'normal'}
                      sx={{
                        direction: readingDirection === 'rtl' ? 'rtl' : 'ltr',
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default ReaderOverlay;
