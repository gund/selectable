import {
  SelectableStrategyPluginAddition,
  SelectableStrategyPluginAdditionOptions,
  SelectableStrategyPluginAdditionTrigger,
} from '@selectable/core';

import { DomSelectableStrategyPlugin } from './dom-strategy-plugin';

export interface DomSelectableStrategyPluginAdditionOptions {
  /**
   * Modifier keys as specified is HTML Spec
   * @see https://w3c.github.io/uievents-key/#keys-modifier
   */
  modifierKey?: DomSelectableStrategyPluginAdditionModifierKey;
  plugin?: Omit<SelectableStrategyPluginAdditionOptions, 'trigger'>;
}

export type DomSelectableStrategyPluginAdditionModifierKey =
  | 'Control'
  | 'Shift'
  | 'Meta'
  | 'Alt';

export const DomSelectableStrategyPluginAdditionModifier: DomSelectableStrategyPluginAdditionModifierKey =
  'Control';

export class DomSelectableStrategyPluginAddition
  extends SelectableStrategyPluginAddition<HTMLElement>
  implements
    DomSelectableStrategyPlugin,
    SelectableStrategyPluginAdditionTrigger {
  private readonly modifierKey: DomSelectableStrategyPluginAdditionModifierKey;

  private isModifierActive = false;

  constructor(options: DomSelectableStrategyPluginAdditionOptions) {
    super(options.plugin || {});

    this.setTrigger(this);

    this.modifierKey =
      options.modifierKey || DomSelectableStrategyPluginAdditionModifier;

    window.addEventListener('keydown', this.checkModifierKey);
    window.addEventListener('keyup', this.checkModifierKey);
  }

  destroy(): void {
    super.destroy();
    window.removeEventListener('keydown', this.checkModifierKey);
    window.removeEventListener('keyup', this.checkModifierKey);
  }

  isActive(): boolean {
    return this.isModifierActive;
  }

  private checkModifierKey = (event: KeyboardEvent) => {
    if (event.repeat) {
      return;
    }

    this.isModifierActive = event.getModifierState(this.modifierKey);
  };
}
