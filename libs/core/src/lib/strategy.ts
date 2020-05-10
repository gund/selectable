import { Rect, SelectionItem } from './types';

export interface SelectionStrategy<I> {
  setSelection(selection: Rect): void;
  isSelected(rect: Rect, item: SelectionItem<I>): boolean;
  reset(): void;
  destroy(): void;
}
