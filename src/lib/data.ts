export const generateRandomStockData = () => {
    const companies = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'NFLX', 'TSLA'];
    return companies.map(symbol => ({
      id: symbol,
      symbol,
      price: Math.random() * 1000 + 100,
      change: Number((Math.random() * 10 - 5).toFixed(2))
    }));
  };