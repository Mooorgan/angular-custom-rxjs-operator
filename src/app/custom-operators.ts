import {
  MonoTypeOperatorFunction,
  ObservableInput,
  pipe,
  tap,
  Observable,
  switchMap,
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

// export const bufferUntilValueTruthy: <T>(
//   closingNotifier: ObservableInput<boolean>
// ) =>  OperatorFunction<T, T[]> = <T>(
//   closingNotifier: ObservableInput<boolean>
// ) => {
//   return (source:Observable<T>) => {
//     return new Observable<T>((destination) => {
//       const currentBuffer: T[] = [];

//       const sourceSubscription = source.subscribe({
//         next: (source) => {
//           currentBuffer.push(source);

//         },
//         complete:()=>{
//             destination.next(currentBuffer)
//         }
//       });
//     });
//   };
// };

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
}
