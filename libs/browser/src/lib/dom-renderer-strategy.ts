import { Rect } from '@selectable/core';

export interface DomSelectableUpdateStrategy {
  update(element: HTMLElement, selection: Rect): void;
  initSelection(selection: HTMLElement): void;
  initContainer(container: HTMLElement): void;
}
