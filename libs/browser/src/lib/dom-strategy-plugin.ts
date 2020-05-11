import { Rect } from '@selectable/core';

export interface DomSelectableStrategyPlugin {
  isSelected(currently: boolean, rect: Rect, item: HTMLElement): boolean;
  setSelecting(items: HTMLElement[]): void;
  setSelected(items: HTMLElement[]): void;
  destroy(): void;
}
