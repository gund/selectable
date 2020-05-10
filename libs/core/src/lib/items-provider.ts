import { SelectionCleanupCallback, SelectionItem } from './types';

export type SelectionOnItemsCallback<T> = (items: SelectionItem<T>[]) => void;

export interface SelectionItemsProvider<T> {
  registerOnItems(cb: SelectionOnItemsCallback<T>): SelectionCleanupCallback;
}
