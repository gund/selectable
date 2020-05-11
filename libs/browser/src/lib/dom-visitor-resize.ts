import { SelectableVisitor, Selectable } from '@selectable/core';

export class DomSelectableVisitorResize
  implements SelectableVisitor<HTMLElement> {
  onResize?: () => void;

  constructor(
    private listenerOptions: AddEventListenerOptions = { passive: true }
  ) {}

  apply(selectable: Selectable<HTMLElement>): void {
    this.onResize = () => selectable.measureItems();

    window.addEventListener('resize', this.onResize, this.listenerOptions);
  }

  destroy(): void {
    if (this.onResize) {
      window.removeEventListener('resize', this.onResize);

      this.onResize = undefined;
    }
  }
}
