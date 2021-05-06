import { SelectableStrategyPlugin } from '../strategy-plugin';
import { Rect, SelectableItem } from '../types';

export interface SelectableStrategyPluginAdditionTrigger {
  isActive(): boolean;
  destroy(): void;
}

export interface SelectableStrategyPluginAdditionOptions {
  trigger?: SelectableStrategyPluginAdditionTrigger;
}

enum ItemSelection {
  Unselected,
  Selected,
}

export class SelectableStrategyPluginAddition<I>
  implements SelectableStrategyPlugin<I> {
  private trigger = this.options.trigger;

  private readonly lastSelectedItems = new Map<
    SelectableItem<I>,
    ItemSelection
  >();

  constructor(private options: SelectableStrategyPluginAdditionOptions) {}

  setTrigger(trigger: SelectableStrategyPluginAdditionTrigger): void {
    this.trigger = trigger;
  }

  isSelected(currently: boolean, rect: Rect, item: SelectableItem<I>): boolean {
    const currSelected: ItemSelection = +currently;

    if (!this.trigger?.isActive()) {
      this.lastSelectedItems.set(item, currSelected);
      return currently;
    }

    const prevSelected =
      this.lastSelectedItems.get(item) ?? ItemSelection.Unselected;
    const selected = !!(currSelected ^ prevSelected);

    return selected;
  }

  setSelected(items: SelectableItem<I>[]): void {
    this.lastSelectedItems.clear();
    items.forEach((item) =>
      this.lastSelectedItems.set(item, ItemSelection.Selected)
    );
  }

  destroy(): void {
    this.lastSelectedItems.clear();
    this.trigger?.destroy();
    this.trigger = undefined;
  }
}
