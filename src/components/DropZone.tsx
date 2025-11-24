import { CloudUpload } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

export type DropZoneProps = {
  onFiles: (files: File[]) => void;
};

const DropZone = ({ onFiles }: DropZoneProps) => {
  const { t } = useTranslation();
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: onFiles,
    multiple: false,
    accept: { 'application/zip': ['.zip'] },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '1px dashed var(--tw-prose-hr, rgba(148, 163, 184, 0.4))',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        bgcolor: isDragActive ? 'primary.50' : 'background.paper',
        color: 'text.secondary',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
    >
      <input {...getInputProps()} />
      <CloudUpload fontSize="large" color="primary" />
      <Typography variant="h6" mt={1}>
        {t('dropHere')}
      </Typography>
      <Typography variant="body2" mb={2}>
        {t('orClick')}
      </Typography>
      <Button variant="contained" onClick={open}>
        Browse ZIP
      </Button>
    </Box>
  );
};

export default DropZone;
