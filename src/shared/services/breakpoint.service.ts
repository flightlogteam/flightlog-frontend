import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import {
  BehaviorSubject,
  distinctUntilChanged,
  Observable,
  ReplaySubject,
} from 'rxjs';

export type BreakPointDevice = 'mobile' | 'tablet' | 'laptop' | 'large';
export const BreakPointConfig: {
  device: BreakPointDevice;
  minWidth: number;
}[] = [
  { device: 'mobile', minWidth: 320 },
  { device: 'tablet', minWidth: 786 },
  { device: 'laptop', minWidth: 1024 },
  { device: 'large', minWidth: 1200 },
];

/**
 * Emits a value when the breakpoint changes. Nothing more nothing less
 **/
export class BreakPointService {
  private breakPointSubject = new ReplaySubject<BreakPointDevice>(1);

  constructor() {
    BreakPointConfig.forEach(config => {
      installMediaQueryWatcher(`(min-width: ${config.minWidth}px)`, match => {
        if (match) {
          this.breakPointSubject.next(config.device);
        }
      });
    });
  }

  /**
   * # Based on a replay-subject
   * - Does not fire immediately, the source has a short debounce
   * */
  get breakpoint$(): Observable<BreakPointDevice> {
    return this.breakPointSubject.asObservable().pipe(distinctUntilChanged());
  }
}

export const breakPointService = new BreakPointService();
