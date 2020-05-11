import { Rect } from '@selectable/core';

import { DomSelectableUpdateStrategy } from './dom-renderer-strategy';
import { toPx } from './util';

export class DomSelectableUpdateStrategyTransform
  implements DomSelectableUpdateStrategy {
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

  initSelection(selection: HTMLElement): void {
    selection.style.left = toPx(0);
    selection.style.top = toPx(0);
    selection.style.width = toPx(1 / this.scaleFactor);
    selection.style.height = toPx(1 / this.scaleFactor);
    selection.style.transformOrigin = '0 0';
  }

  initContainer(container: HTMLElement): void {}
}
