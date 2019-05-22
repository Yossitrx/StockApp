import { Injectable, OnDestroy } from '@angular/core';
import { interval, ReplaySubject, Subject } from 'rxjs';
import { API } from '../../API.const';
import { first, switchMap, takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { invoke, has } from 'lodash';
import { RawStockData, RawStockResponse, Stock } from './stock.interface';
import { TransformationServices } from '../transformationServices/transformation.services';
import { ApiErrorHandlerService } from '../apiErrorHandlerService/apiErrorHandler.service';

@Injectable()
export class StockService implements OnDestroy {
  public stockDataObservable: ReplaySubject<Stock[]>;
  public timerPollingObservable: ReplaySubject<Stock[]>;
  public stockListObservable: ReplaySubject<string>;
  public stockList: Set<string> = new Set();
  private intervalValue: Subject<number> = new Subject();
  private millisecondsTime: number = 1500;

  constructor(private httpClient: HttpClient,
              private transformationServices: TransformationServices,
              private apiErrorHandlerService: ApiErrorHandlerService) {}

  public getSingleStockObservable(): ReplaySubject<Stock[]> {
    if (!this.stockDataObservable) {
      this.initSingleObservable();
    }
    return this.stockDataObservable;
  }

  public getTimerPollingObservable(): ReplaySubject<Stock[]> {
    this.initTimerPollingObservable();
    return this.timerPollingObservable;
  }

  public getSpecificStockInfo(stockName: string): void {
    this.httpClient.get(API.stock(stockName))
      .pipe(first())
      .subscribe((rawStockRes: RawStockResponse) => {
        has(rawStockRes, 'Note')
          ? this.haltUpdateStockList()
          : this.enrichSingleStockDataAndPublish(rawStockRes);
      }, (error) => this.initError(error));
  }

  public getStockListObservable(): ReplaySubject<string> {
    if (!this.stockListObservable) {
      this.initStockListObservable();
    }
    return this.stockListObservable;
  }

  public updateTimer(newTimeInSeconds: number): void {
    this.millisecondsTime = newTimeInSeconds * 1000;
    this.intervalValue.next(this.millisecondsTime);
  }

  public removeStockNameFromList(stockName: string): void {
    this.stockList.delete(stockName);
    this.stockListObservable.next(stockName);
  }

  public addStockNameToList(stockName): void {
    this.stockList.add(stockName);
  }

  public ngOnDestroy(): void {
    invoke(this.timerPollingObservable, 'unsubscribe');
    invoke(this.stockDataObservable, 'unsubscribe');
    invoke(this.stockListObservable, 'unsubscribe');
  }

  private enrichListStockDataAndPublish(stockRawData): void {
    const stockQuotes = stockRawData['Stock Quotes'];
    this.publishEnrichStockPolling(this.transformationServices.stockEnrichment(stockQuotes));
  }

  private initStockListObservable(): void {
    this.stockListObservable = new ReplaySubject<string>(1);
  }

  private publishEnrichStockPolling(stockQuote: Stock[]): void {
    if (this.timerPollingObservable) {
      this.timerPollingObservable.next(stockQuote);
      this.apiErrorHandlerService.apiErrorHandler$.next(false);
    }
  }

  private haltUpdateStockList(): void {
    this.apiErrorHandlerService.apiErrorHandler$.next(true);
  }

  private updatePollingHandler(): void {
    this.intervalValue
      .pipe(
        switchMap((time: number) => interval(time)),
        takeWhile(() => this.stockList.size > 0))
      .subscribe(() => {
        this.httpClient.get(API.stock([...this.stockList].join(','))).pipe(
          first())
          .subscribe(
            (rawStockRes: RawStockResponse) => {
              has(rawStockRes, 'Note')
                ? this.haltUpdateStockList()
                : this.enrichListStockDataAndPublish(rawStockRes);
            }, (error) => this.initError(error));
      });
    this.intervalValue.next(this.millisecondsTime);
  }

  private enrichSingleStockDataAndPublish(stockRawData: RawStockResponse): void {
    const stockQuotes: RawStockData[] = stockRawData['Stock Quotes'];
    this.publishEnrichStock(this.transformationServices.stockEnrichment(stockQuotes));
  }

  private initTimerPollingObservable(): void {
    if (!this.timerPollingObservable) {
      this.timerPollingObservable = new ReplaySubject<Stock[]>(1);
    }
    this.updatePollingHandler();
  }

  private initSingleObservable(): void {
    this.stockDataObservable = new ReplaySubject<Stock[]>(1);
  }

  private publishEnrichStock(stockQuote: Stock[]): void {
    if (this.stockDataObservable) {
      this.stockDataObservable.next(stockQuote);
      this.apiErrorHandlerService.apiErrorHandler$.next(false);
    }
  }

  private initError(error): void {
    console.log('Server Error', error);
    this.apiErrorHandlerService.apiErrorHandler$.next(true);
  }
}
