import { SelectionCleanupCallback, SelectionItem } from './types';

export interface SelectionEventMap<I> {
  selected: SelectionItem<I>[];
  selecting: SelectionItem<I>[];
}

export type SelectionEventHandler<D> = (data: D) => void;

type SelectionListenersMap<I> = {
  [P in keyof SelectionEventMap<I>]?: SelectionEventHandler<
    SelectionEventMap<I>[P]
  >[];
};

export class SelectionEvents<I> {
  private readonly listenersMap: SelectionListenersMap<I> = Object.create(null);

  on<E extends keyof SelectionEventMap<I>>(
    name: E,
    cb: SelectionEventHandler<SelectionEventMap<I>[E]>
  ): SelectionCleanupCallback {
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
}
