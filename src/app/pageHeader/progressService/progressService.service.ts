import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { invoke } from 'lodash';

@Injectable()
export class ProgressService implements OnDestroy {

  public workInProgress$: ReplaySubject<boolean> = new ReplaySubject();

  public getWorkInProgressObservable(): ReplaySubject<boolean> {
    if (!this.workInProgress$) {
      this.initProgressSubscription();
    }
    return this.workInProgress$;
  }

  public onProgressChange(status: boolean): void {
    this.workInProgress$.next(status);
  }

  public ngOnDestroy(): void {
    invoke(this.workInProgress$, 'unsubscribe');
  }

  private initProgressSubscription(): void {
    this.workInProgress$ = new ReplaySubject<boolean>(1);
  }
}
