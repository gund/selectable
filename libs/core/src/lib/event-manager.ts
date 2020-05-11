import { Point, SelectableCleanupCallback } from './types';

export type SelectableEventManagerCallback = (point: Point) => void;

export interface SelectableEventManager {
  registerOnStart(
    cb: SelectableEventManagerCallback
  ): SelectableCleanupCallback;
  registerOnMove(cb: SelectableEventManagerCallback): SelectableCleanupCallback;
  registerOnEnd(cb: SelectableEventManagerCallback): SelectableCleanupCallback;
}
