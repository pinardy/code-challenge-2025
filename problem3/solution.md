# Problem 3: Messy React

Refer to `solution.tsx` for the refactored code.

### Issues

#### Inefficiencies

1. Both `sortedBalances` and `formattedBalances` map over balances separately, causing redundant computations. We can combine the mapping into a single pass for efficiency.

```tsx
const rows = sortedBalances.map((balance: WalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.amount.toFixed()} // do the formatting here immediately
      />
    );
});
```


2. The prices object is used in useMemo but is not a dependency for sorting balances. It could cause unnecessary recomputations

```tsx
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // ...
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // ...
      });
  }, [balances]); // remove prices from dependencies list since it's not used
```

#### Anti-patterns

**1. Complicated conditional checks**

```ts
balances.filter((balance: WalletBalance) => {
  const balancePriority = getPriority(balance.blockchain);
  if (lhsPriority > -99) {
    if (balance.amount <= 0) {
      return true;
    }
  }
  return false;
});
```

We can combine and simplify the multiple nested if statements:

```ts
balances.filter((balance: WalletBalance) => {
  const balancePriority = getPriority(balance.blockchain);
  return lhsPriority > -99 && balance.amount <= 0;
});
```

**2. Missing return value for specific condition**

```ts
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    if (leftPriority > rightPriority) {
        return -1;
    } else if (rightPriority > leftPriority) {
        return 1;
    }
});
```

The above code snippet does not check what happens if both `leftPriority` and `rightPriority` are equal. We should return a value (e.g. `0`) in the case where these two values are equal:

```ts
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    if (leftPriority > rightPriority) {
        return -1;
    } else if (rightPriority > leftPriority) {
        return 1;
    }
    return 0;
});
```

**3. Hard-coded URL**

```tsx
useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    // ...
  }, []);
```

The API URL to fetch is hard-coded within useEffect above. It is recommended to keep the URLs somewhere else such as a configuration file.

```tsx
useEffect(() => {
    const datasource = new Datasource(pricesURL); // import pricesURL from configuration file
    // ...
  }, []);
```

**4. Use of any**

`getPriority` is currently taking in `blockchain` which is of type `any`. Currently `blockchain` also does not exist on type `WalletBalance`. We should properly define the types instead of using `any`.

```tsx
const getPriority = (blockchain: any): number => { // should not use any
	// ...
}
```

We can define create a new enum `Blockchain` and use it as the input parameter type for our function below. Having an enum also helps us to keep track of the list of possible enumerations of blockchain possibilites.

```tsx
enum Blockchain {
  Osmosis,
  Ethereum,
  Arbitrum,
  Zilliqa,
  Neo,
}

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
```