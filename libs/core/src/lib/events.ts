import { SelectableCleanupCallback, SelectableItem } from './types';

export interface SelectionEventMap<I> {
  selected: SelectableItem<I>[];
  selecting: SelectableItem<I>[];
}

export type SelectionEventHandler<D> = (data: D) => void;

type SelectionListenersMap<I> = {
  [P in keyof SelectionEventMap<I>]?: SelectionEventHandler<
    SelectionEventMap<I>[P]
  >[];
};

export class SelectionEvents<I> {
  private listenersMap: SelectionListenersMap<I> = Object.create(null);

  on<E extends keyof SelectionEventMap<I>>(
    name: E,
    cb: SelectionEventHandler<SelectionEventMap<I>[E]>
  ): SelectableCleanupCallback {
    const listeners = this.listenersMap[name] || (this.listenersMap[name] = []);

    listeners!.push(cb);

    return () => listeners!.splice(listeners!.indexOf(cb), 1);
  }

  emit<E extends keyof SelectionEventMap<I>>(
    name: E,
    data: SelectionEventMap<I>[E]
  ) {
    const listeners = this.listenersMap[name];

    if (!listeners) {
      return;
    }

    listeners.forEach((listener) => listener(data));
  }

  destroy() {
    this.listenersMap = {};
  }
}
