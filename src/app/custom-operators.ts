import {
  MonoTypeOperatorFunction,
  ObservableInput,
  pipe,
  tap,
  Observable,
  switchMap,
  take,
  from,
} from 'rxjs';

type VoidFunc<V> = (v: V) => void;
//custom log operator without using the pipe function from rxjs
export const log: <T>(f?: VoidFunc<T>) => MonoTypeOperatorFunction<T> = (f) => {
  return (value) => {
    return value.pipe(
      tap((v) => {
        if (f) {
          f(v);
        } else {
          console.log(v);
        }
      })
    );
  };
};

//custom log operator using the pipe function from rxjs
// Note that it is different from the pipe method, as this one is an independent function, not a method on the Observable class.
export const log1: <T>(f?: VoidFunc<T>) => MonoTypeOperatorFunction<T> = (
  f
) => {
  return pipe(
    tap((v) => {
      if (f) {
        f(v);
      } else {
        console.log(v);
      }
    })
  );
};

type OperatorFunction<T, R> = (source: Observable<T>) => Observable<R>;

export const bufferUntilTruthy1 = <T>(
  closingNotifier: ObservableInput<boolean>
): OperatorFunction<T, T[]> => {
  return (source: Observable<T>) => {
    return new Observable((destination) => {
      let currentBuffer: T[] = [];

      const sourceSubscription = source
        .pipe(
          tap((value) => {
            currentBuffer.push(value);
          }),
          switchMap(() => {
            return closingNotifier;
          })
        )
        .subscribe({
          next: (value) => {
            if (value) {
              const b = currentBuffer;
              //   currentBuffer.splice(0, currentBuffer.length);
              currentBuffer = [];
              destination.next(b);
            }
          },
          complete: () => {
            destination.next(currentBuffer);
            destination.complete();
          },
        });

      return () => {
        // currentBuffer.splice(0, currentBuffer.length);
        currentBuffer = [];
        sourceSubscription.unsubscribe();
      };
    });
  };
};

export function bufferUntilTruthy<T>(
  closingNotifier: ObservableInput<boolean>
): OperatorFunction<T, T[]> {
  return (source) => {
    return new Observable((destination) => {
      let currentBuffer: T[] = [];

      const sourceSubscription = source
        .pipe(
          tap((value) => {
            currentBuffer.push(value);
          }),
          switchMap(() => {
            // ObservableInput<T> is a broader type that can be an Observable<T>, a Promise<T>, an ArrayLike<T>, or an AsyncIterable<T>. However, only Observable<T> has the pipe method. To ensure closingNotifier has the pipe method, explicitly convert it into an Observable using from(closingNotifier).
            return from(closingNotifier).pipe(take(1));
          })
        )
        .subscribe({
          next: (value) => {
            if (value) {
              const b = currentBuffer;
              //   currentBuffer.splice(0, currentBuffer.length);
              currentBuffer = [];
              destination.next(b);
            }
          },
          complete: () => {
            destination.next(currentBuffer);
            destination.complete();
          },
        });

      return () => {
        // currentBuffer.splice(0, currentBuffer.length);
        currentBuffer = [];
        sourceSubscription.unsubscribe();
      };
    });
  };
}
