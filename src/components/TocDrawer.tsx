import { Bookmark, Close } from '@mui/icons-material';
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useViewerStore } from '../store/viewerStore';

export type TocDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const TocDrawer = ({ open, onClose }: TocDrawerProps) => {
  const toc = useViewerStore((s) => s.toc);
  const setCurrentIndex = useViewerStore((s) => s.setCurrentIndex);
  const currentIndex = useViewerStore((s) => s.currentIndex);
  const { t } = useTranslation();
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const scrollPos = React.useRef(0);

  const handleScroll = () => {
    if (listRef.current) scrollPos.current = listRef.current.scrollTop;
  };

  React.useLayoutEffect(() => {
    if (listRef.current) listRef.current.scrollTop = scrollPos.current;
  }, [currentIndex]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 320 } }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1.5 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Bookmark color="primary" />
          <Typography variant="subtitle1">{t('toc')}</Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Stack>
      <List dense sx={{ flex: 1 }} ref={listRef} onScroll={handleScroll}>
        {toc.map((item) => (
          <ListItemButton
            key={`${item.title}-${item.page}`}
            selected={item.page === currentIndex}
            onClick={() => {
              setCurrentIndex(item.page);
              onClose();
            }}
          >
            <ListItemText
              primary={item.title}
              secondary={`#${item.page + 1}`}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default TocDrawer;
