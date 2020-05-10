import { SelectionStrategy } from './strategy';
import { Rect } from './types';
import { emptyRect } from './util';

export class SelectionStrategyDefault<I> implements SelectionStrategy<I> {
  private selection: Rect = emptyRect();

  setSelection(selection: Rect): void {
    this.selection = selection;
  }

  isSelected(rect: Rect): boolean {
    if (
      rect.end.x < this.selection.start.x ||
      rect.start.x > this.selection.end.x
    ) {
      return false;
    }

    if (
      rect.end.y < this.selection.start.y ||
      rect.start.y > this.selection.end.y
    ) {
      return false;
    }

    return true;
  }

  reset(): void {
    // Nothing to reset here
  }

  destroy(): void {
    // Nothing to destroy here
  }
}
