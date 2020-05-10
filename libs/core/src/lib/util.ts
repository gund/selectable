import { Rect, Point } from './types';

export function point(): Point {
  return { x: 0, y: 0 };
}

export function rect(): Rect {
  return {
    start: point(),
    end: point(),
  };
}
