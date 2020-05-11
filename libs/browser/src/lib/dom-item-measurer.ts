import { point, Rect, rect, SelectableItemMeasurer } from '@selectable/core';

export class DomSelectableItemMeasurer
  implements SelectableItemMeasurer<HTMLElement> {
  measure(item: HTMLElement): Rect {
    const itemRect = item.getBoundingClientRect();

    const start = point(itemRect.left, itemRect.top);
    const end = point(
      itemRect.left + itemRect.width,
      itemRect.top + itemRect.height
    );

    return rect(start, end);
  }
}
