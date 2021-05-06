import {
  SelectableCleanupCallback,
  SelectableEventManager,
  SelectableEventManagerCallback,
} from '@selectable/core';

export interface DomSelectableEventManagerOptions {
  container: HTMLElement;
}

export class DomSelectableEventManagerMouse implements SelectableEventManager {
  protected container = this.options.container;

  constructor(protected options: DomSelectableEventManagerOptions) {}

  registerOnStart(
    cb: SelectableEventManagerCallback
  ): SelectableCleanupCallback {
    this.container.addEventListener('mousedown', cb, { capture: false });

    return () => this.container.removeEventListener('mousedown', cb);
  }

  registerOnMove(
    cb: SelectableEventManagerCallback
  ): SelectableCleanupCallback {
    this.container.addEventListener('mousemove', cb, { capture: false });

    return () => this.container.removeEventListener('mousemove', cb);
  }

  registerOnEnd(cb: SelectableEventManagerCallback): SelectableCleanupCallback {
    this.container.addEventListener('mouseup', cb, { capture: false });

    return () => this.container.removeEventListener('mouseup', cb);
  }
}
