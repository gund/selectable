import { SelectableEventManager } from './event-manager';
import { SelectionEvents } from './events';
import { SelectableItemMeasurer } from './item-measurer';
import { SelectableItemsProvider } from './items-provider';
import { SelectableRenderer } from './renderer';
import { SelectableStrategy } from './strategy';
import { SelectableStrategyDefault } from './strategy-default';
import {
  Point,
  Rect,
  SelectableCleanupCallback,
  SelectableItem,
} from './types';
import { emptyRect } from './util';
import { SelectableVisitor } from './visitor';

export interface SelectableConfig<I> {
  itemsProvider: SelectableItemsProvider<I>;
  itemMeasurer: SelectableItemMeasurer<I>;
  eventManager: SelectableEventManager;
  renderer: SelectableRenderer;
  strategy?: SelectableStrategy<I>;
  visitors?: SelectableVisitor<I>[];
}

export class Selectable<I> {
  private readonly itemsProvider = this.config.itemsProvider;
  private readonly itemMeasurer = this.config.itemMeasurer;
  private readonly eventManager = this.config.eventManager;
  private readonly renderer = this.config.renderer;
  private readonly strategy =
    this.config.strategy || new SelectableStrategyDefault<I>();
  private readonly events = new SelectionEvents<I>();
  private visitors = this.config.visitors || [];
  private disposables: SelectableCleanupCallback[] = [];

  private isSelecting = false;
  private rawSelection: Rect = emptyRect();
  private selection: Rect = emptyRect();
  private items: SelectableItem<I>[] = [];
  private itemRects: Rect[] = [];
  private selectedItems: SelectableItem<I>[] = [];
  private lastSelectedItems: SelectableItem<I>[] = [];

  constructor(private config: SelectableConfig<I>) {
    this.initEvents();
    this.initItems();

    this.visitors.forEach((visitor) => visitor.apply(this));

    this.disposables.push(() => {
      this.resetItems();
      this.strategy.destroy();
      this.renderer.destroy();
      this.events.destroy();
      this.visitors.forEach((visitor) => visitor.destroy());
      this.visitors = [];
    });
  }

  on = this.events.on.bind(this.events);

  measureItems() {
    this.itemRects = this.items.map((item) => this.itemMeasurer.measure(item));
  }

  destroy() {
    this.disposables.forEach((dispose) => dispose());
    this.disposables = [];
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
    this.lastSelectedItems = [];

    this.updateSelection();
    this.updateItems();
    this.render();

    this.strategy.selectionStarted();
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

    this.strategy.selectionEnded();
  }

  private onItems(items: SelectableItem<I>[]) {
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
      this.strategy.setSelected(this.selectedItems);
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
