import {
  Rect,
  SelectableStrategy,
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
    this.baseStrategy.setSelecting(items);
  }

  setSelected(items: HTMLElement[]): void {
    this.baseStrategy.setSelected(items);
  }

  isSelected(rect: Rect, item: HTMLElement): boolean {
    const isSelected = this.baseStrategy.isSelected(rect, item);

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
    this.baseStrategy.destroy();
    this.baseStrategy = null!;
  }
}
