export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  start: Point;
  end: Point;
}

// Item is opaque for the Selection
export type SelectionItem<T = unknown> = T;

export type SelectionCleanupCallback = () => void;
