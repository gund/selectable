import { Rect } from '@selectable/core';

import { DomSelectionUpdateStrategy } from './dom-renderer-strategy';
import { toPx } from './util';

export class DomSelectionUpdateStrategyReflow
  implements DomSelectionUpdateStrategy {
  update(element: HTMLElement, selection: Rect): void {
    const width = selection.end.x - selection.start.x;
    const height = selection.end.y - selection.start.y;

    element.style.left = toPx(selection.start.x);
    element.style.top = toPx(selection.start.y);
    element.style.width = toPx(width);
    element.style.height = toPx(height);
  }
}
