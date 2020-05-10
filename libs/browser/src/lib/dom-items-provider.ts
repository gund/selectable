import {
  SelectionCleanupCallback,
  SelectionItemsProvider,
  SelectionOnItemsCallback,
} from '@selectable/core';

import { DomItemsProviderStrategy } from './dom-items-provider-strategy';
import { DomItemsProviderStrategyClass } from './dom-items-provider-strategy-class';

export interface DomSelectionItemsProviderOptions {
  container: HTMLElement;
  strategy?: DomItemsProviderStrategy;
}

export class DomSelectionItemsProvider
  implements SelectionItemsProvider<HTMLElement> {
  protected container = this.options.container;
  protected strategy =
    this.options.strategy || new DomItemsProviderStrategyClass();

  protected itemsCallback: SelectionOnItemsCallback<HTMLElement> = () => {};

  constructor(protected options: DomSelectionItemsProviderOptions) {}

  update() {
    this.itemsCallback(this.strategy.query(this.container));
  }

  registerOnItems(
    cb: SelectionOnItemsCallback<HTMLElement>
  ): SelectionCleanupCallback {
    this.itemsCallback = cb;

    this.update();

    return () => {
      this.itemsCallback = null!;
      this.container = null!;
      this.options = null!;
    };
  }
}
