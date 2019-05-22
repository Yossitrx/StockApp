import { Component, OnInit } from '@angular/core';
import { StockService } from '../stockService/stock.service';
import { map as _map } from 'lodash';
import { Stock } from '../stockService/stock.interface';
import { ApiErrorHandlerService } from '../apiErrorHandlerService/apiErrorHandler.service';
import { ProgressService } from '../progressService/progressService.service';

@Component({
  selector: 'userPortfolio',
  providers: [
  ],
  styleUrls: ['./userPortfolio.component.scss'],
  templateUrl: './userPortfolio.component.html',
})

export class UserPortfolioComponent implements OnInit {
  public userStockPortfolio: Set<Stock> = new Set();
  public userPortfolioStockNames: Set<string> = new Set();
  private flag: boolean = false;
  private isHalt: boolean = false;
  constructor(private stockService: StockService,
              private apiErrorHandlerService: ApiErrorHandlerService,
              private progressService: ProgressService) {}

  public ngOnInit(): void {
    this.workInProgressObservable();
    this.stockService.getSingleStockObservable()
      .pipe()
      .subscribe((stockData: Stock[]) => {
        this.userStockPortfolio.add(stockData[0]);
        this.userPortfolioStockNames.add(stockData[0]['symbol']);
        this.updateStockList(stockData[0]['symbol']);
        this.initializeStockPolling();
        this.progressService.onProgressChange(false);
      });
  }

  public updateStockList(stockName: string): void {
    this.stockService.addStockNameToList(stockName);
  }

  public removeStockFromPortfolio(stockToRemove: Stock): void {
    this.userStockPortfolio.delete(stockToRemove);
    this.stockService.removeStockNameFromList(stockToRemove['symbol']);
    if (this.userStockPortfolio.size === 0) {
      this.flag = false;
      this.apiErrorHandlerService.resetApiError();
      this.progressService.onProgressChange(false);
    }
  }

  public progressChange($event): void {
    this.stockService.updateTimer($event.value);
  }

  private setPollingDataToUi(stockUpdatedData: Stock[]): void {
    this.userStockPortfolio.clear();
    this.userPortfolioStockNames.clear();
    _map(stockUpdatedData, (stock: Stock) => {
      this.userStockPortfolio.add(stock);
      this.userPortfolioStockNames.add(stock['symbol']);
    });
  }

  private initializeStockPolling(): void {
    if (!this.flag) {
      this.flag = true;
      this.stockService.getTimerPollingObservable()
        .pipe()
        .subscribe(
          (stockUpdatedData) =>
            this.setPollingDataToUi(stockUpdatedData));
    }
  }

  private workInProgressObservable(): void {
    this.progressService.getWorkInProgressObservable()
      .subscribe((workInProgress) => this.isHalt = workInProgress);
  }
}
