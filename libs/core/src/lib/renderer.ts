import { Rect } from './types';

export interface SelectionRenderer {
  setIsSelecting(isSelecting: boolean): void;
  render(selection: Rect): void;
  destroy(): void;
}
