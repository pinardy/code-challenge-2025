import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import { ResponseSnackbar } from './ResponseSnackbar';

interface ConfirmationDialogProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  amount: number;
  fromToken: string;
  toToken: string;
  exchangeRate: number;
}

const ConfirmationDialog = ({
  openDialog,
  handleCloseDialog,
  amount,
  fromToken,
  toToken,
  exchangeRate,
}: ConfirmationDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSuccess(true);
    setLoading(false);
    handleCloseDialog();
  };

  const handleCloseSnackbar = () => {
    setIsSuccess(false);
  };

  return (
    <>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>You will be swapping:</DialogContentText>
          <br />
          <b>{amount}</b> {fromToken} for <b>{(amount * exchangeRate).toFixed(6)}</b> {toToken}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? 'Swapping...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
      <ResponseSnackbar
        isOpen={isSuccess}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="success"
        message="Token swapped successfully!!"
      />
    </>
  );
};

export default ConfirmationDialog;
