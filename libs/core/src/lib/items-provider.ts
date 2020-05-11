import { SelectableCleanupCallback, SelectableItem } from './types';

export type SelectableOnItemsCallback<T> = (items: SelectableItem<T>[]) => void;

export interface SelectableItemsProvider<T> {
  registerOnItems(cb: SelectableOnItemsCallback<T>): SelectableCleanupCallback;
}
