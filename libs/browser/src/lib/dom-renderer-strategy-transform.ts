import { Rect } from '@selectable/core';

import { DomSelectionUpdateStrategy } from './dom-renderer-strategy';
import { toPx } from './util';

export class DomSelectionUpdateStrategyTransform
  implements DomSelectionUpdateStrategy {
  constructor(private scaleFactor = 1) {}

  update(element: HTMLElement, selection: Rect): void {
    const width = selection.end.x - selection.start.x;
    const height = selection.end.y - selection.start.y;

    const translate = `translate(${toPx(selection.start.x)}, ${toPx(
      selection.start.y
    )})`;

    const scale = `scale(${width * this.scaleFactor}, ${
      height * this.scaleFactor
    })`;

    const transform = `${translate} ${scale}`;

    element.style.transform = transform;
  }
}
