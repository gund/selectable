export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  start: Point;
  end: Point;
}

// Item is opaque for the Selection
export type SelectableItem<T = unknown> = T;

export type SelectableCleanupCallback = () => void;
