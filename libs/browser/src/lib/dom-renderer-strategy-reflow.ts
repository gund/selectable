import { Rect } from '@selectable/core';

import { DomSelectableUpdateStrategy } from './dom-renderer-strategy';
import { toPx } from './util';

export class DomSelectableUpdateStrategyReflow
  implements DomSelectableUpdateStrategy {
  update(element: HTMLElement, selection: Rect): void {
    const width = selection.end.x - selection.start.x;
    const height = selection.end.y - selection.start.y;

    element.style.left = toPx(selection.start.x);
    element.style.top = toPx(selection.start.y);
    element.style.width = toPx(width);
    element.style.height = toPx(height);
  }

  initSelection(selection: HTMLElement): void {
    selection.style.left = toPx(0);
    selection.style.top = toPx(0);
    selection.style.width = toPx(0);
    selection.style.height = toPx(0);
  }

  initContainer(container: HTMLElement): void {}
}
