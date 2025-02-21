import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ControllerService {
  private readonly buttonClickPrimarySubject = new Subject<void>();
  readonly buttonClickPrimary$ = this.buttonClickPrimarySubject.asObservable();
  private readonly buttonClickSecondarySubject = new ReplaySubject<boolean>(1);
  // private readonly buttonClickSecondarySubject = new BehaviorSubject<boolean>(
  //   false
  // );
  readonly buttonClickSecondary$ =
    this.buttonClickSecondarySubject.asObservable();

  primaryButtonClick() {
    this.buttonClickPrimarySubject.next();
  }
  intiateBehaviorBufferRelease() {
    this.buttonClickSecondarySubject.next(true);
  }
  intiateBehaviorBufferTrigger() {
    this.buttonClickSecondarySubject.next(false);
  }
  constructor() {}
}
