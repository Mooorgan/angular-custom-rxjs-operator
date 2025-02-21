import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { buffer, from, interval, Subscription, takeUntil } from 'rxjs';
import { bufferUntilTruthy, log, log1 } from './custom-operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControllerService } from './services/controller.service';

@Component({
  selector: 'ng-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly controller = inject(ControllerService);
  private intervalSubscription!: Subscription;

  ngOnInit(): void {}

  intiateBufferRelease() {
    this.controller.primaryButtonClick();
  }

  intiateBehaviorBufferRelease() {
    this.controller.intiateBehaviorBufferRelease();
  }

  intiateBehaviorBufferTrigger() {
    this.controller.intiateBehaviorBufferTrigger();
  }

  unsubscribeInterval() {
    this.intervalSubscription?.unsubscribe();
  }

  subscribeInterval() {
    this.intervalSubscription = interval(2000)
      .pipe(
        // log(),
        // log((v) => {
        //   console.log(`This is the value of ${v}`);
        // }),
        log1(),
        // buffer(this.controller.buttonClickPrimary$),
        // buffer(this.controller.buttonClickSecondary$),
        bufferUntilTruthy(this.controller.buttonClickSecondary$),
        log1((v) => {
          console.log(`After buffer value is:`);
          console.log(v);
        }),
        // log1((v) => {
        //   console.log(`This is the value of ${v}`);
        // }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    // from(this.controller.buttonClickSecondary$)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe(() => {
    //     console.log('Hello from behavior Subject');
    //   });
  }
}
