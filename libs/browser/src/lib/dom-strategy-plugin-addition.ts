import { Rect } from '@selectable/core';

import { DomSelectableStrategyPlugin } from './dom-strategy-plugin';

export interface DomSelectableStrategyPluginAdditionOptions {
  /**
   * Modifier keys as specified is HTML Spec
   * @see https://w3c.github.io/uievents-key/#keys-modifier
   */
  modifierKey?: 'Control' | 'Shift' | 'Meta' | 'Alt' | string;
}

export const DomSelectableStrategyPluginAdditionModifier = 'Control';

export class DomSelectableStrategyPluginAddition
  implements DomSelectableStrategyPlugin {
  private readonly modifierKey =
    this.options.modifierKey || DomSelectableStrategyPluginAdditionModifier;

  private isModifierActive = false;
  private lastSelectedItems = new Map<HTMLElement, boolean>();

  constructor(private options: DomSelectableStrategyPluginAdditionOptions) {
    window.addEventListener('keydown', this.checkModifierKey);
    window.addEventListener('keyup', this.checkModifierKey);
  }

  isSelected(currently: boolean, rect: Rect, item: HTMLElement): boolean {
    if (!this.isModifierActive) {
      this.lastSelectedItems.set(item, currently);
      return currently;
    }

    const previously = this.lastSelectedItems.get(item) ?? false;
    const selected = !!(+currently ^ +previously);

    return selected;
  }

  setSelecting(items: HTMLElement[]): void {}

  setSelected(items: HTMLElement[]): void {
    this.lastSelectedItems.clear();
    items.forEach((item) => this.lastSelectedItems.set(item, true));
  }

  destroy(): void {
    this.lastSelectedItems.clear();
    window.removeEventListener('keydown', this.checkModifierKey);
    window.removeEventListener('keyup', this.checkModifierKey);
  }

  private checkModifierKey = (event: KeyboardEvent) => {
    if (event.repeat) {
      return;
    }

    this.isModifierActive = event.getModifierState(this.modifierKey);
  };
}
