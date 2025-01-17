import { Alert, Snackbar } from '@mui/material';

interface ResponseSnackbarProps {
  isOpen: boolean;
  handleCloseSnackbar: () => void;
  severity: SEVERITY;
  message: string;
}

export type SEVERITY = 'error' | 'success' | 'info' | 'warning';

export const ResponseSnackbar = (props: ResponseSnackbarProps) => {
  const { isOpen, handleCloseSnackbar, severity, message } = props;

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
