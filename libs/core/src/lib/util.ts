import { Rect, Point } from './types';

export function emptyPoint(): Point {
  return { x: 0, y: 0 };
}

export function emptyRect(): Rect {
  return {
    start: emptyPoint(),
    end: emptyPoint(),
  };
}

export function point(x: number, y: number): Point {
  return { x, y };
}

export function rect(start: Point, end: Point): Rect {
  return { start, end };
}
