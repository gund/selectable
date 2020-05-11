import {
  SelectableCleanupCallback,
  SelectableItemsProvider,
  SelectableOnItemsCallback,
} from '@selectable/core';

import { DomItemsProviderStrategy } from './dom-items-provider-strategy';
import { DomItemsProviderStrategyClass } from './dom-items-provider-strategy-class';

export interface DomSelectableItemsProviderOptions {
  container: HTMLElement;
  strategy?: DomItemsProviderStrategy;
}

export class DomSelectableItemsProvider
  implements SelectableItemsProvider<HTMLElement> {
  protected container = this.options.container;
  protected strategy =
    this.options.strategy || new DomItemsProviderStrategyClass();

  protected itemsCallback: SelectableOnItemsCallback<HTMLElement> = () => {};

  constructor(protected options: DomSelectableItemsProviderOptions) {}

  update() {
    this.itemsCallback(this.strategy.query(this.container));
  }

  registerOnItems(
    cb: SelectableOnItemsCallback<HTMLElement>
  ): SelectableCleanupCallback {
    this.itemsCallback = cb;

    this.update();

    return () => {
      this.itemsCallback = null!;
      this.container = null!;
      this.options = null!;
    };
  }
}
