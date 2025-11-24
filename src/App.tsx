import {
  ArrowBack,
  ArrowForward,
  DarkMode,
  LightMode,
  MenuBook,
  SaveAlt,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  LinearProgress,
  Slider,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { registerSW } from 'virtual:pwa-register';
import DropZone from './components/DropZone';
import ReaderOverlay from './components/ReaderOverlay';
import ThumbnailStrip from './components/ThumbnailStrip';
import TocDrawer from './components/TocDrawer';
import TopBar from './components/TopBar';
import ViewerCanvas from './components/ViewerCanvas';
import useKeyboardNavigation from './hooks/useKeyboardNavigation';
import { useViewerStore } from './store/viewerStore';
import { loadZipFile } from './utils/zip';

const App = () => {
  const pages = useViewerStore((s) => s.pages);
  const currentIndex = useViewerStore((s) => s.currentIndex);
  const setCurrentIndex = useViewerStore((s) => s.setCurrentIndex);
  const next = useViewerStore((s) => s.next);
  const prev = useViewerStore((s) => s.prev);
  const readingDirection = useViewerStore((s) => s.readingDirection);
  const pagesCount = useViewerStore((s) => s.pages.length);
  const setPages = useViewerStore((s) => s.setPages);
  const setLoading = useViewerStore((s) => s.setLoading);
  const isLoading = useViewerStore((s) => s.isLoading);
  const error = useViewerStore((s) => s.error);
  const setError = useViewerStore((s) => s.setError);
  const hydrateFromCache = useViewerStore((s) => s.hydrateFromCache);
  const theme = useViewerStore((s) => s.theme);
  const setTheme = useViewerStore((s) => s.setTheme);
  const { t } = useTranslation();

  const [tocOpen, setTocOpen] = React.useState(false);
  const [pageInput, setPageInput] = React.useState('1');
  const [snack, setSnack] = React.useState(false);
  const [readerOpen, setReaderOpen] = React.useState(false);

  React.useEffect(() => {
    registerSW({ immediate: true });
  }, []);

  useKeyboardNavigation();

  React.useEffect(() => {
    void hydrateFromCache().then((loaded) => {
      if (loaded) setSnack(true);
    });
  }, [hydrateFromCache]);

  React.useEffect(() => setPageInput(String(currentIndex + 1)), [currentIndex]);

  const handleFiles = React.useCallback(
    async (files: File[]) => {
      const [file] = files;
      if (!file) return;
      setLoading(true);
      setError(undefined);
      try {
        const { pages: loadedPages, toc: loadedToc } = await loadZipFile(file);
        setPages(loadedPages, loadedToc, file.name);
      } catch (err) {
        setError((err as Error).message || 'Failed to load ZIP');
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, setPages]
  );

  // global drag & drop
  React.useEffect(() => {
    const prevent = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const fileList = e.dataTransfer?.files;
      if (fileList && fileList.length) {
        void handleFiles(Array.from(fileList));
      }
    };
    window.addEventListener('dragover', prevent);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragover', prevent);
      window.removeEventListener('drop', handleDrop);
    };
  }, [handleFiles]);

  const handleFileSelect = (list: FileList | null) => {
    if (!list?.length) return;
    handleFiles(Array.from(list));
  };

  const handleGoToPage = () => {
    const target = Number(pageInput) - 1;
    if (Number.isNaN(target)) return;
    const clamped = Math.min(Math.max(target, 0), pages.length - 1);
    setCurrentIndex(clamped);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h5" fontWeight={700}>
              {t('title')}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title={theme === 'dark' ? t('light') : t('dark')}>
              <IconButton
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
            <Tooltip title={t('toc')}>
              <IconButton onClick={() => setTocOpen(true)}>
                <MenuBook />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <TopBar
          onFileSelect={handleFileSelect}
          onOpenToc={() => setTocOpen(true)}
        />

        {isLoading && <LinearProgress color="primary" />}

        {!pages.length ? (
          <DropZone onFiles={handleFiles} />
        ) : (
          <Stack spacing={2}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ md: 'center' }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title={t('prev')}>
                  <IconButton size="large" onClick={prev}>
                    <ArrowBack />
                  </IconButton>
                </Tooltip>
                <Typography variant="body2" color="text.secondary">
                  {readingDirection === 'rtl' ? 'RTL' : 'LTR'}
                </Typography>
                <Tooltip title={t('next')}>
                  <IconButton size="large" onClick={next}>
                    <ArrowForward />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                <Typography variant="caption">{t('goTo')}</Typography>
                <TextField
                  size="small"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGoToPage()}
                  sx={{ width: 100 }}
                />
                <Button
                  onClick={handleGoToPage}
                  variant="outlined"
                  size="small"
                >
                  {t('jump')}
                </Button>
                <Box
                  sx={{
                    flex: 1,
                    direction: readingDirection === 'rtl' ? 'rtl' : 'ltr',
                  }}
                >
                  <Slider
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
                        readingDirection === 'rtl' ? pagesCount - num : num - 1;
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
                <Typography variant="body2" color="text.secondary">
                  {currentIndex + 1} / {pages.length}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setReaderOpen(true)}
                >
                  {t('fullscreenReader')}
                </Button>
              </Stack>
            </Stack>

            <ViewerCanvas />
            <ThumbnailStrip />
          </Stack>
        )}
      </Stack>

      <TocDrawer open={tocOpen} onClose={() => setTocOpen(false)} />
      <ReaderOverlay open={readerOpen} onClose={() => setReaderOpen(false)} />

      <Box
        component="footer"
        sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}
      >
        author: u-haru
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(undefined)}
      >
        <Alert severity="error" onClose={() => setError(undefined)}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={snack}
        autoHideDuration={4000}
        onClose={() => setSnack(false)}
      >
        <Alert severity="info" icon={<SaveAlt />}>
          {t('offlineHint')}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
