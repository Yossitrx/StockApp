import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { invoke } from 'lodash';

@Injectable()
export class ApiErrorHandlerService implements OnDestroy {

  public apiErrorHandler$: ReplaySubject<boolean> = new ReplaySubject();

  public resetApiError(): void {
    this.apiErrorHandler$.next(false);
  }

  public getApiErrorSubscription(): ReplaySubject<boolean> {
    if (!this.apiErrorHandler$) {
      this.initApiErrorSubscription();
    }
    return this.apiErrorHandler$;
  }

  public ngOnDestroy(): void {
    invoke(this.apiErrorHandler$, 'unsubscribe');
  }

  private initApiErrorSubscription() {
    this.apiErrorHandler$ = new ReplaySubject<boolean>(1);
  }

}
