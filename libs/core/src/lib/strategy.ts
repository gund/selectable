import { Rect, SelectableItem } from './types';

export interface SelectableStrategy<I> {
  selectionStarted(): void;
  selectionEnded(): void;
  setSelection(selection: Rect): void;
  setSelecting(items: SelectableItem<I>[]): void;
  setSelected(items: SelectableItem<I>[]): void;
  isSelected(rect: Rect, item: SelectableItem<I>): boolean;
  reset(): void;
  destroy(): void;
}
