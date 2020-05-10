import { SelectionItem, Rect } from './types';

export interface SelectionItemMeasurer<T> {
  measure(item: SelectionItem<T>): Rect;
}
