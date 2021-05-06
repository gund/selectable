import {
  Selectable,
  SelectableConfig,
  SelectableStrategyDefault,
  SelectableStrategyPluggable,
} from '@selectable/core';

import { DomSelectableEventManagerMouse } from './dom-event-manager-mouse';
import { DomSelectableItemMeasurer } from './dom-item-measurer';
import { DomSelectableItemsProvider } from './dom-items-provider';
import { DomSelectableRenderer } from './dom-renderer';
import { DomSelectableUpdateStrategy } from './dom-renderer-strategy';
import { DomSelectableStrategy } from './dom-strategy';
import { DomSelectableStrategyPlugin } from './dom-strategy-plugin';
import {
  DomSelectableStrategyPluginAddition,
  DomSelectableStrategyPluginAdditionModifier,
  DomSelectableStrategyPluginAdditionOptions,
} from './dom-strategy-plugin-addition';
import { DomSelectableVisitorResize } from './dom-visitor-resize';

export interface DomSelectableConfig
  extends Partial<SelectableConfig<HTMLElement>> {
  container: HTMLElement;
  updateOnResize?: boolean;
  addOnModifier?: DomSelectableStrategyPluginAdditionOptions['modifierKey'];
  updateStrategy?: DomSelectableUpdateStrategy;
  plugins?: DomSelectableStrategyPlugin[];
}

export class DomSelectable extends Selectable<HTMLElement> {
  constructor({
    container,
    updateStrategy,
    addOnModifier = DomSelectableStrategyPluginAdditionModifier,
    updateOnResize = true,
    itemsProvider = new DomSelectableItemsProvider({
      container: container,
    }),
    itemMeasurer = new DomSelectableItemMeasurer(),
    eventManager = new DomSelectableEventManagerMouse({
      container: container,
    }),
    renderer = new DomSelectableRenderer({
      container: container,
      updateStrategy,
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

    if (plugins.length) {
      strategy = strategy ?? new SelectableStrategyDefault();
      strategy = new SelectableStrategyPluggable({ strategy, plugins });
    }

    strategy = new DomSelectableStrategy({ strategy });

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
