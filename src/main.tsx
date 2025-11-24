import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import './index.css';
import './i18n';
import { useViewerStore } from './store/viewerStore';

const Root = () => {
  const themeChoice = useViewerStore((s) => s.theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const mode =
    themeChoice === 'system' ? (prefersDark ? 'dark' : 'light') : themeChoice;

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#3f5efb' },
          background: { default: mode === 'dark' ? '#0f172a' : '#f8fafc' },
        },
        shape: { borderRadius: 12 },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
