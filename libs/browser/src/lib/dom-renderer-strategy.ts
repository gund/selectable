import { Rect } from '@selectable/core';

export interface DomSelectionUpdateStrategy {
  update(element: HTMLElement, selection: Rect): void;
}
