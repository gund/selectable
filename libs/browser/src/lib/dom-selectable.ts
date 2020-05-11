import { Selectable, SelectableConfig } from '@selectable/core';

import { DomSelectableEventManagerMouse } from './dom-event-manager-mouse';
import { DomSelectableItemMeasurer } from './dom-item-measurer';
import { DomSelectableItemsProvider } from './dom-items-provider';
import { DomSelectableRenderer } from './dom-renderer';
import { DomSelectableStrategy } from './dom-strategy';
import { DomSelectableStrategyPlugin } from './dom-strategy-plugin';
import {
  DomSelectableStrategyPluginAdditionOptions,
  DomSelectableStrategyPluginAddition,
  DomSelectableStrategyPluginAdditionModifier,
} from './dom-strategy-plugin-addition';
import { DomSelectableVisitorResize } from './dom-visitor-resize';

export interface DomSelectableConfig
  extends Partial<SelectableConfig<HTMLElement>> {
  container: HTMLElement;
  updateOnResize?: boolean;
  addOnModifier?: DomSelectableStrategyPluginAdditionOptions['modifierKey'];
  plugins?: DomSelectableStrategyPlugin[];
}

export class DomSelectable extends Selectable<HTMLElement> {
  constructor({
    container,
    addOnModifier = DomSelectableStrategyPluginAdditionModifier,
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
    strategy,
    visitors = [],
    plugins = [],
    ...restConfig
  }: DomSelectableConfig) {
    if (updateOnResize) {
      visitors.push(new DomSelectableVisitorResize());
    }

    if (addOnModifier) {
      plugins.push(
        new DomSelectableStrategyPluginAddition({ modifierKey: addOnModifier })
      );
    }

    if (!strategy) {
      strategy = new DomSelectableStrategy({ plugins });
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
