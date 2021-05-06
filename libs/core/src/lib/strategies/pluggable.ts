import { isMethodDefined } from '../_util';
import { SelectableStrategy } from '../strategy';
import { SelectableStrategyPlugin } from '../strategy-plugin';
import { Rect, SelectableItem } from '../types';

export interface SelectableStrategyPluggableOptions<I> {
  strategy: SelectableStrategy<I>;
  plugins?: SelectableStrategyPlugin<I>[];
}

export class SelectableStrategyPluggable<I> implements SelectableStrategy<I> {
  protected baseStrategy = this.options.strategy;
  protected plugins = this.options.plugins ?? [];

  private destroyed = false;
  private state = {
    isSelecting: false,
    selection: undefined as Rect | undefined,
    selectingItems: undefined as SelectableItem<I>[] | undefined,
    selectedItems: undefined as SelectableItem<I>[] | undefined,
  };

  constructor(private options: SelectableStrategyPluggableOptions<I>) {}

  selectionStarted(): void {
    this.state.isSelecting = true;
    this.baseStrategy.selectionStarted();
    this.invokePluginsMethod('selectionStarted');
  }

  selectionEnded(): void {
    this.state.isSelecting = false;
    this.baseStrategy.selectionEnded();
    this.invokePluginsMethod('selectionEnded');
  }

  setSelection(selection: Rect): void {
    this.state.selection = selection;
    this.baseStrategy.setSelection(selection);
    this.invokePluginsMethod('setSelection', selection);
  }

  setSelecting(items: SelectableItem<I>[]): void {
    this.state.selectingItems = items;
    this.baseStrategy.setSelecting(items);
    this.invokePluginsMethod('setSelecting', items);
  }

  setSelected(items: SelectableItem<I>[]): void {
    this.state.selectedItems = items;
    this.baseStrategy.setSelected(items);
    this.invokePluginsMethod('setSelected', items);
  }

  isSelected(rect: Rect, item: SelectableItem<I>): boolean {
    return this.plugins.reduce(
      (selected, plugin) =>
        this.invokePluginMethod(plugin, 'isSelected', selected, rect, item) ??
        selected,
      this.baseStrategy.isSelected(rect, item)
    );
  }

  reset(): void {
    this.state.isSelecting = false;
    this.state.selection = undefined;
    this.state.selectedItems = undefined;
    this.state.selectingItems = undefined;
    this.baseStrategy.reset();
    this.invokePluginsMethod('reset');
  }

  destroy(): void {
    this.baseStrategy.destroy();
    this.invokePluginsMethod('destroy');

    this.destroyed = true;
    this.options = undefined!;
    this.baseStrategy = undefined!;
    this.plugins = [];
    this.state = undefined!;
  }

  addPlugin(plugin: SelectableStrategyPlugin<I>): void {
    if (this.destroyed) {
      throw new Error(
        'SelectableStrategyPluggable: Attempted to add plugin to already destroyed strategy!'
      );
    }

    this.plugins.push(plugin);
    this.initPlugin(plugin);
  }

  removePlugin(plugin: SelectableStrategyPlugin<I>): void {
    const idx = this.plugins.indexOf(plugin);

    if (idx === -1) {
      return;
    }

    this.plugins.splice(idx, 1);
  }

  protected invokePluginsMethod<M extends keyof SelectableStrategyPlugin<I>>(
    method: M,
    ...args: Parameters<Exclude<SelectableStrategyPlugin<I>[M], undefined>>
  ): void {
    this.plugins.forEach((plugin) =>
      this.invokePluginMethod(plugin, method, ...args)
    );
  }

  protected invokePluginMethod<M extends keyof SelectableStrategyPlugin<I>>(
    plugin: SelectableStrategyPlugin<I>,
    method: M,
    ...args: Parameters<Exclude<SelectableStrategyPlugin<I>[M], undefined>>
  ):
    | ReturnType<Exclude<SelectableStrategyPlugin<I>[M], undefined>>
    | undefined {
    if (isMethodDefined(plugin, method)) {
      return (plugin[method] as any)(...args);
    }
  }

  private initPlugin(plugin: SelectableStrategyPlugin<I>): void {
    if (this.state.isSelecting) {
      this.invokePluginMethod(plugin, 'selectionStarted');
    }

    if (this.state.selection) {
      this.invokePluginMethod(plugin, 'setSelection', this.state.selection);
    }

    if (this.state.selectingItems) {
      this.invokePluginMethod(
        plugin,
        'setSelecting',
        this.state.selectingItems
      );
    }

    if (this.state.selectedItems) {
      this.invokePluginMethod(plugin, 'setSelected', this.state.selectedItems);
    }
  }
}
