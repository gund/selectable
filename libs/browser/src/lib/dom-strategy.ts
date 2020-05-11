import {
  SelectableStrategy,
  Rect,
  SelectableStrategyDefault,
} from '@selectable/core';

export interface DomSelectableStrategyOptions {
  selectedClass?: string;
  strategy?: SelectableStrategy<any>;
}

export class DomSelectableStrategy implements SelectableStrategy<HTMLElement> {
  private selectedClass = this.options.selectedClass || 'selected';

  private baseStrategy =
    this.options.strategy || new SelectableStrategyDefault();

  constructor(private options: DomSelectableStrategyOptions = {}) {}

  setSelection(selection: Rect): void {
    this.baseStrategy.setSelection(selection);
  }

  isSelected(rect: Rect, item: HTMLElement): boolean {
    const selected = this.baseStrategy.isSelected(rect, item);

    if (selected) {
      item.classList.add(this.selectedClass);
    } else {
      item.classList.remove(this.selectedClass);
    }

    return selected;
  }

  reset(): void {
    this.baseStrategy.reset();
  }

  destroy(): void {
    this.baseStrategy.destroy();
  }
}
