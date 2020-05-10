import { SelectionEventManager } from './event-manager';
import { SelectionEvents } from './events';
import { SelectionItemMeasurer } from './item-measurer';
import { SelectionItemsProvider } from './items-provider';
import { SelectionRenderer } from './renderer';
import { SelectionStrategy } from './strategy';
import { SelectionStrategyDefault } from './strategy-default';
import { Point, Rect, SelectionCleanupCallback, SelectionItem } from './types';
import { emptyRect } from './util';

export interface SelectionConfig<I> {
  itemsProvider: SelectionItemsProvider<I>;
  itemMeasurer: SelectionItemMeasurer<I>;
  eventManager: SelectionEventManager;
  renderer: SelectionRenderer;
  strategy?: SelectionStrategy<I>;
}

export class Selection<I> {
  private readonly itemsProvider = this.config.itemsProvider;
  private readonly itemMeasurer = this.config.itemMeasurer;
  private readonly eventManager = this.config.eventManager;
  private readonly renderer = this.config.renderer;
  private readonly strategy =
    this.config.strategy || new SelectionStrategyDefault<I>();
  private readonly events = new SelectionEvents<I>();
  private readonly disposables: SelectionCleanupCallback[] = [];

  private isSelecting = false;
  private rawSelection: Rect = emptyRect();
  private selection: Rect = emptyRect();
  private items: SelectionItem<I>[] = [];
  private itemRects: Rect[] = [];
  private selectedItems: SelectionItem<I>[] = [];
  private lastSelectedItems: SelectionItem<I>[] = [];

  constructor(private config: SelectionConfig<I>) {
    this.initEvents();
    this.initItems();
  }

  on = this.events.on.bind(this.events);

  measureItems() {
    this.itemRects = this.items.map((item) => this.itemMeasurer.measure(item));
  }

  destroy() {
    this.resetItems();
    this.strategy.destroy();
    this.renderer.destroy();
    this.disposables.forEach((dispose) => dispose());
  }

  private initEvents() {
    this.disposables.push(
      this.eventManager.registerOnStart(this.onStart.bind(this)),
      this.eventManager.registerOnMove(this.onMove.bind(this)),
      this.eventManager.registerOnEnd(this.onEnd.bind(this))
    );
  }

  private initItems() {
    this.disposables.push(
      this.itemsProvider.registerOnItems(this.onItems.bind(this))
    );
  }

  private onStart(point: Point) {
    this.isSelecting = true;

    this.rawSelection.start.x = this.rawSelection.end.x = point.x;
    this.rawSelection.start.y = this.rawSelection.end.y = point.y;

    this.updateSelection();
    this.updateItems();
    this.render();
  }

  private onMove(point: Point) {
    if (!this.isSelecting) {
      return;
    }

    this.rawSelection.end.x = point.x;
    this.rawSelection.end.y = point.y;

    this.updateSelection();
    this.updateItems();
    this.render();
  }

  private onEnd() {
    this.isSelecting = false;

    this.updateSelection();
    this.updateItems();
    this.render();
  }

  private onItems(items: SelectionItem<I>[]) {
    this.resetItems();
    this.items = items;

    this.measureItems();
  }

  private updateSelection() {
    this.selection.start.x = Math.min(
      this.rawSelection.start.x,
      this.rawSelection.end.x
    );

    this.selection.start.y = Math.min(
      this.rawSelection.start.y,
      this.rawSelection.end.y
    );

    this.selection.end.x = Math.max(
      this.rawSelection.start.x,
      this.rawSelection.end.x
    );

    this.selection.end.y = Math.max(
      this.rawSelection.start.y,
      this.rawSelection.end.y
    );

    this.strategy.setSelection(this.selection);
  }

  private updateItems() {
    this.selectedItems = this.items.filter((item, i) =>
      this.strategy.isSelected(this.itemRects[i], item)
    );

    if (this.isSelecting) {
      const changed =
        this.lastSelectedItems.length !== this.selectedItems.length;

      if (changed) {
        this.events.emit('selecting', this.selectedItems);
      }

      this.lastSelectedItems = this.selectedItems;
    } else {
      this.events.emit('selected', this.selectedItems);
    }
  }

  private render() {
    this.renderer.setIsSelecting(this.isSelecting);
    this.renderer.render(this.selection);
  }

  private resetItems() {
    this.items = [];
    this.itemRects = [];
    this.selectedItems = [];
    this.lastSelectedItems = [];
    this.strategy.reset();
  }
}
