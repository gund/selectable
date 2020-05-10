import { point, Rect, rect, SelectionItemMeasurer } from '@selectable/core';

export class DomSelectionItemMeasurer
  implements SelectionItemMeasurer<HTMLElement> {
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
