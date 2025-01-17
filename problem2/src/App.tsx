import { useState, useEffect } from 'react';
import { Container, TextField, Button, MenuItem, Typography, Box, Paper } from '@mui/material';
import { fetchPrices, fetchTokens } from './dao';
import { CurrencyInfo, GitHubFile } from './types';
import ConfirmationDialog from './ConfirmationDialog';

const SwapPage = () => {
  const [tokens, setTokens] = useState<Partial<GitHubFile>[] | null>(null);
  const [prices, setPrices] = useState<CurrencyInfo[] | null>([]);
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isOpenConfirmation, setOpenConfirmation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const prices = await fetchPrices();
      const tokens = await fetchTokens();

      // only show tokens with prices
      const filteredTokens = tokens?.filter((token) =>
        prices?.some((price) => price.currency === token.name?.slice(0, -4)),
      ) as Partial<GitHubFile>[];

      setTokens(filteredTokens);
      setPrices(prices);
    };

    fetchData();
  }, []);

  const handleSwap = () => {
    setOpenConfirmation(true);
  };

  const handleCloseDialog = () => {
    setOpenConfirmation(false);
  };

  useEffect(() => {
    if (fromToken && toToken && prices) {
      // Find the price for each token
      const fromTokenPrice = prices.find(
        (token) => token.currency === fromToken.slice(0, -4),
      )?.price;
      const toTokenPrice = prices.find((token) => token.currency === toToken.slice(0, -4))?.price;

      if (fromTokenPrice && toTokenPrice) {
        // Calculate the exchange rate
        setExchangeRate(toTokenPrice / fromTokenPrice);
      }
    } else {
      setExchangeRate(0);
    }
  }, [fromToken, toToken, prices]);

  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper elevation={3} style={{ padding: 30 }}>
        <Typography variant="h5" gutterBottom align="center">
          Token Swap
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <Box display="flex" justifyContent="space-between">
            <TextField
              select
              fullWidth
              label="Sell"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              margin="normal"
              style={{ marginRight: 8 }}
            >
              {tokens?.map((token) => (
                <MenuItem key={token?.url} value={token.name}>
                  <Box display="flex" alignItems="center">
                    <img
                      src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.name}`}
                      alt={token.name}
                      style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    {token.name?.slice(0, -4)}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Buy"
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              margin="normal"
              style={{ marginLeft: 8 }}
            >
              {tokens?.map((token) => (
                <MenuItem key={token?.url} value={token.name}>
                  <Box display="flex" alignItems="center">
                    <img
                      src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.name}`}
                      alt={token.name}
                      style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    {token.name?.slice(0, -4)}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            style={{ width: 300 }}
            fullWidth
            label="Amount"
            type="number"
            value={amount === 0 ? '' : amount}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!isNaN(value) && value >= 0) {
                setAmount(value);
              }
            }}
            margin="normal"
          />

          {exchangeRate > 0 && (
            <Typography
              variant="body2"
              gutterBottom
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              Exchange Rate: 1 {fromToken.slice(0, -4)} = {exchangeRate.toFixed(6)}{' '}
              {toToken.slice(0, -4)}
            </Typography>
          )}

          <Typography variant="body1" gutterBottom display="flex" justifyContent="center">
            <h2>
              {(amount * exchangeRate).toFixed(6)} {toToken.slice(0, -4)}
            </h2>
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSwap}
            style={{ marginTop: 20 }}
            disabled={!fromToken || !toToken || !amount}
          >
            Swap
          </Button>
        </Box>
      </Paper>
      <ConfirmationDialog
        openDialog={isOpenConfirmation}
        handleCloseDialog={handleCloseDialog}
        amount={amount}
        fromToken={fromToken.slice(0, -4)}
        toToken={toToken.slice(0, -4)}
        exchangeRate={Number(exchangeRate.toFixed(6))}
      />
    </Container>
  );
};

export default SwapPage;
