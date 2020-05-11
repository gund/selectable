import {
  Rect,
  SelectableStrategy,
  SelectableStrategyDefault,
} from '@selectable/core';

import { DomSelectableStrategyPlugin } from './dom-strategy-plugin';

export interface DomSelectableStrategyOptions {
  selectedClass?: string;
  strategy?: SelectableStrategy<any>;
  plugins?: DomSelectableStrategyPlugin[];
}

export class DomSelectableStrategy implements SelectableStrategy<HTMLElement> {
  private selectedClass = this.options.selectedClass || 'selected';

  private baseStrategy =
    this.options.strategy || new SelectableStrategyDefault();

  private plugins = this.options.plugins || [];

  constructor(private options: DomSelectableStrategyOptions = {}) {}

  selectionStarted(): void {
    this.baseStrategy.selectionStarted();
  }

  selectionEnded(): void {
    this.baseStrategy.selectionEnded();
  }

  setSelection(selection: Rect): void {
    this.baseStrategy.setSelection(selection);
  }

  setSelecting(items: HTMLElement[]): void {
    this.plugins.forEach((plugin) => plugin.setSelecting(items));
  }

  setSelected(items: HTMLElement[]): void {
    this.plugins.forEach((plugin) => plugin.setSelected(items));
  }

  isSelected(rect: Rect, item: HTMLElement): boolean {
    const isSelected = this.plugins.reduce(
      (selected, plugin) => plugin.isSelected(selected, rect, item),
      this.baseStrategy.isSelected(rect, item)
    );

    if (isSelected) {
      item.classList.add(this.selectedClass);
    } else {
      item.classList.remove(this.selectedClass);
    }

    return isSelected;
  }

  reset(): void {
    this.baseStrategy.reset();
  }

  destroy(): void {
    this.options = null!;

    this.plugins.forEach((plugin) => plugin.destroy());
    this.plugins = [];

    this.baseStrategy.destroy();
    this.baseStrategy = null!;
  }
}
