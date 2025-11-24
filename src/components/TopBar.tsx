import {
  Brightness4,
  DarkMode,
  FileOpen,
  MenuBook,
  Palette,
  WbSunny,
} from '@mui/icons-material';
import {
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useViewerStore } from '../store/viewerStore';

export type TopBarProps = {
  onFileSelect: (files: FileList | null) => void;
  onOpenToc: () => void;
};

const TopBar = ({ onFileSelect, onOpenToc }: TopBarProps) => {
  const { t, i18n } = useTranslation();
  const spread = useViewerStore((s) => s.spread);
  const toggleSpread = useViewerStore((s) => s.toggleSpread);
  const readingDirection = useViewerStore((s) => s.readingDirection);
  const setDirection = useViewerStore((s) => s.setDirection);
  const theme = useViewerStore((s) => s.theme);
  const setTheme = useViewerStore((s) => s.setTheme);
  const locale = useViewerStore((s) => s.locale);
  const setLocale = useViewerStore((s) => s.setLocale);
  const gapless = useViewerStore((s) => s.gapless);
  const toggleGapless = useViewerStore((s) => s.toggleGapless);

  const themeIcon =
    theme === 'dark' ? (
      <DarkMode />
    ) : theme === 'light' ? (
      <WbSunny />
    ) : (
      <Brightness4 />
    );

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      alignItems={{ md: 'center' }}
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <input
          id="file-input"
          type="file"
          accept=".zip"
          hidden
          onChange={(e) => onFileSelect(e.target.files)}
        />
        <Button
          startIcon={<FileOpen />}
          variant="contained"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          {t('openZip')}
        </Button>
        <Button
          size="small"
          variant={spread ? 'contained' : 'outlined'}
          onClick={() => toggleSpread()}
        >
          {t('spread')}
        </Button>
        <Button
          size="small"
          variant={readingDirection === 'rtl' ? 'contained' : 'outlined'}
          color={readingDirection === 'rtl' ? 'primary' : 'inherit'}
          onClick={() =>
            setDirection(readingDirection === 'rtl' ? 'ltr' : 'rtl')
          }
        >
          {readingDirection === 'rtl' ? 'RTL: ON' : 'RTL: OFF'}
        </Button>
        <Tooltip title={t('toc')}>
          <IconButton onClick={onOpenToc} color="primary">
            <MenuBook />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Tooltip title={t('theme')}>
          <IconButton
            onClick={() =>
              setTheme(
                theme === 'dark'
                  ? 'light'
                  : theme === 'light'
                    ? 'system'
                    : 'dark'
              )
            }
            color="primary"
          >
            {themeIcon}
          </IconButton>
        </Tooltip>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="lang">Language</InputLabel>
          <Select
            labelId="lang"
            value={locale}
            label="Language"
            onChange={(e) => {
              const value = e.target.value as 'en' | 'ja';
              i18n.changeLanguage(value);
              setLocale(value);
            }}
          >
            <MenuItem value="ja">日本語</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </FormControl>
        <Divider orientation="vertical" flexItem />
        <Palette color="primary" />
        <Button
          size="small"
          variant={gapless ? 'contained' : 'outlined'}
          onClick={toggleGapless}
        >
          {gapless ? 'No gap' : 'Gap'}
        </Button>
      </Stack>
    </Stack>
  );
};

export default TopBar;
