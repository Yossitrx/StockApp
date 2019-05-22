export const API = {
  // tslint:disable-next-line:max-line-length
  stock: (stockList) =>  `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${stockList}&apikey=MJJOQ69Y676IMJWR`
};
