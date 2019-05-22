import { Injectable } from '@angular/core';
import { RawStockData, Stock } from '../stockService/stock.interface';
import { map as _map } from 'lodash';

@Injectable()
export class TransformationServices {

  private static setHumanTimeStep(timestamp: string): string {
    const date = new Date();
    const timestampData = new Date(timestamp);
    const diff = ((date.getTime() - timestampData.getTime()) / 1000) / (60 * 60);
    return `${Math.abs(Math.round(diff))} Hours ago`;
  }

  private static transformPrice(stock): string {
    return `${parseFloat(stock).toFixed(2)}$`;
  }

  private static transformVolume(stock): string {
    return `${parseFloat(stock)}$`;
  }

  public stockEnrichment(stockQuotes: RawStockData[]): Stock[] {
    return _map(stockQuotes, (stock: RawStockData) => {
      return {
        symbol: stock['1. symbol'],
        price: TransformationServices.transformPrice(stock['2. price']),
        volume: TransformationServices.transformVolume(stock['3. volume']),
        timestamp: TransformationServices.setHumanTimeStep(stock['4. timestamp'])
      };
    });
  }
}
