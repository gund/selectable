import { Point, SelectionCleanupCallback } from './types';

export type SelectionEventManagerCallback = (point: Point) => void;

export interface SelectionEventManager {
  registerOnStart(cb: SelectionEventManagerCallback): SelectionCleanupCallback;
  registerOnMove(cb: SelectionEventManagerCallback): SelectionCleanupCallback;
  registerOnEnd(cb: SelectionEventManagerCallback): SelectionCleanupCallback;
}
