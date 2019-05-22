import { Component, OnInit } from '@angular/core';
import { STOCK_LIST } from './stockList.const';
import { StockService } from './stockService/stock.service';
import { get } from 'lodash';
import { ApiErrorHandlerService } from './apiErrorHandlerService/apiErrorHandler.service';
import { ProgressService } from './progressService/progressService.service';

@Component({
  selector: 'pageHeader',
  providers: [
  ],
  styleUrls: ['./pageHeader.component.scss'],
  templateUrl: './pageHeader.component.html',
})
export class PageHeaderComponent implements OnInit {
  public stockList: Set<string> = new Set<string>();
  public isApiError: boolean = false;
  public isHalt: boolean = false;
  private tempNameToDelete: string;
  constructor(private stockService: StockService,
              private apiErrorHandlerService: ApiErrorHandlerService,
              private progressService: ProgressService) {}

  public ngOnInit(): void {
    this.stockList = STOCK_LIST;
    this.stockService.getStockListObservable()
      .pipe()
      .subscribe(
        (stockData) => {
          const nameToAdd: string = get(stockData, 'symbol', stockData);
          this.stockList.add(nameToAdd);
        }, (errorMsg) => console.log('Error', errorMsg));
    this.apiErrorHandlerSubscription();
    this.workInProgressObservable();
  }

  public stockSelectorClick(stockName: string): void {
    this.stockService.getSpecificStockInfo(stockName);
    this.tempNameToDelete = stockName;
    this.progressService.onProgressChange(true);
  }

  private apiErrorHandlerSubscription(): void {
    this.apiErrorHandlerService.getApiErrorSubscription()
      .pipe()
      .subscribe((isApiError: boolean) => {
        this.isApiError = isApiError;
        this.isHalt = isApiError;
      });
  }

  private workInProgressObservable(): void {
    this.progressService.getWorkInProgressObservable()
      .subscribe((workInProgress) => {
        if (!workInProgress && this.tempNameToDelete) {
          this.stockList.delete(this.tempNameToDelete);
          this.tempNameToDelete = null;
        }
        this.isHalt = workInProgress;
      });
  }
}
