import { History, RestartAlt } from '@mui/icons-material';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useViewerStore } from '../store/viewerStore';

export type RecentListProps = {
  onSelect: (name: string) => void;
};

const RecentList = ({ onSelect }: RecentListProps) => {
  const recent = useViewerStore((s) => s.recent);
  const setCurrentIndex = useViewerStore((s) => s.setCurrentIndex);
  if (!recent.length) return null;

  return (
    <Box className="rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-card dark:border-slate-700 dark:bg-slate-800/70">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <History fontSize="small" />
          <Typography variant="subtitle2">Recently opened</Typography>
        </Stack>
        <IconButton size="small" onClick={() => setCurrentIndex(0)}>
          <RestartAlt fontSize="small" />
        </IconButton>
      </Stack>
      <List dense>
        {recent.map((item) => (
          <ListItem
            key={item.name}
            disablePadding
            secondaryAction={
              <Typography variant="caption">
                {new Date(item.openedAt).toLocaleString()}
              </Typography>
            }
          >
            <ListItemButton onClick={() => onSelect(item.name)}>
              <ListItemText
                primary={item.name}
                secondary={`${item.pageCount} pages • ${(item.size / 1024 / 1024).toFixed(1)} MB`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RecentList;
