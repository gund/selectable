import { Selectable, SelectableConfig } from '@selectable/core';

import { DomSelectableEventManagerMouse } from './dom-event-manager-mouse';
import { DomSelectableItemMeasurer } from './dom-item-measurer';
import { DomSelectableItemsProvider } from './dom-items-provider';
import { DomSelectableRenderer } from './dom-renderer';
import { DomSelectableStrategy } from './dom-strategy';
import { DomSelectableVisitorResize } from './dom-visitor-resize';

export interface DomSelectableConfig
  extends Partial<SelectableConfig<HTMLElement>> {
  container: HTMLElement;
  updateOnResize?: boolean;
}

export class DomSelectable extends Selectable<HTMLElement> {
  constructor({
    container,
    updateOnResize = true,
    itemsProvider = new DomSelectableItemsProvider({
      container: container,
    }),
    itemMeasurer = new DomSelectableItemMeasurer(),
    eventManager = new DomSelectableEventManagerMouse({
      container: container,
      updateOnResize,
    }),
    renderer = new DomSelectableRenderer({
      container: container,
    }),
    strategy = new DomSelectableStrategy(),
    visitors = [],
    ...restConfig
  }: DomSelectableConfig) {
    if (updateOnResize) {
      visitors.push(new DomSelectableVisitorResize());
    }

    super({
      ...restConfig,
      itemsProvider,
      itemMeasurer,
      eventManager,
      renderer,
      strategy,
      visitors,
    });
  }
}
