import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private preloaderCompleteSubject = new ReplaySubject<void>(1);

  preloaderComplete$ = this.preloaderCompleteSubject.asObservable();

  notifyPreloaderComplete(): void {
    this.preloaderCompleteSubject.next();
  }
}
