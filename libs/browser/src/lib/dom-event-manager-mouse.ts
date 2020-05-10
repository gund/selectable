import {
  SelectionCleanupCallback,
  SelectionEventManager,
  SelectionEventManagerCallback,
} from '@selectable/core';

export interface DomSelectionEventManagerOptions {
  container: HTMLElement;
}

export class DomSelectionEventManagerMouse implements SelectionEventManager {
  protected container = this.options.container;

  constructor(protected options: DomSelectionEventManagerOptions) {}

  registerOnStart(cb: SelectionEventManagerCallback): SelectionCleanupCallback {
    this.container.addEventListener('mousedown', cb, { capture: false });

    return () => this.container.removeEventListener('mousedown', cb);
  }

  registerOnMove(cb: SelectionEventManagerCallback): SelectionCleanupCallback {
    this.container.addEventListener('mousemove', cb, { capture: false });

    return () => this.container.removeEventListener('mousemove', cb);
  }

  registerOnEnd(cb: SelectionEventManagerCallback): SelectionCleanupCallback {
    this.container.addEventListener('mouseup', cb, { capture: false });

    return () => this.container.removeEventListener('mouseup', cb);
  }
}
