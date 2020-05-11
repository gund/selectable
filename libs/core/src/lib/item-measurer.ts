import { SelectableItem, Rect } from './types';

export interface SelectableItemMeasurer<T> {
  measure(item: SelectableItem<T>): Rect;
}
