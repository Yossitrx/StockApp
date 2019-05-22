export interface Stock {
  price: string;
  symbol: string;
  timestamp: string;
  volume: string;
}

export interface RawStockData {
  '1. symbol': string;
  '2. price': string;
  '3. volume': string;
  '4. timestamp': string;
}

interface RawMetaData {
  '1. Information': string;
  '2. Notes': string;
  '3. Time Zone': string;
}
export interface RawStockResponse {
  'Meta Data'?: RawMetaData;
  'Stock Quotes'?: RawStockData[];
  'Note'?: string;
}
