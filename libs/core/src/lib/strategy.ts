import { Rect, SelectableItem } from './types';

export interface SelectableStrategy<I> {
  setSelection(selection: Rect): void;
  isSelected(rect: Rect, item: SelectableItem<I>): boolean;
  reset(): void;
  destroy(): void;
}
