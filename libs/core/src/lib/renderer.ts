import { Rect } from './types';

export interface SelectableRenderer {
  setIsSelecting(isSelecting: boolean): void;
  render(selection: Rect): void;
  destroy(): void;
}
