enum Blockchain {
  Osmosis,
  Ethereum,
  Arbitrum,
  Zilliqa,
  Neo,
}

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

class Datasource {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Fetch prices from the API.
   * @returns A promise that resolves with the prices as an object.
   * @throws An error if the request fails.
   */
  async getPrices(): Promise<{ [currency: string]: number }> {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching prices:', error);
      throw error;
    }
  }
}

interface Props extends BoxProps {}

const pricesURL = 'https://interview.switcheo.com/prices.json';

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const datasource = new Datasource(pricesURL);
    datasource
      .getPrices()
      .then((prices) => setPrices(prices))
      .catch((error) => console.err(error));
  }, []);

  const getPriority = (blockchain: Blockchain): number => {
    switch (blockchain) {
      case Blockchain.Osmosis:
        return 100;
      case Blockchain.Ethereum:
        return 50;
      case Blockchain.Arbitrum:
        return 30;
      case Blockchain.Zilliqa:
        return 20;
      case Blockchain.Neo:
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return lhsPriority > -99 && balance.amount <= 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

  const rows = sortedBalances.map((balance: WalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.amount.toFixed()}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
