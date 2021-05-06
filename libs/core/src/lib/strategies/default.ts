import { SelectableStrategy } from '../strategy';
import { Rect } from '../types';
import { emptyRect } from '../util';

export class SelectableStrategyDefault<I> implements SelectableStrategy<I> {
  private selection: Rect = emptyRect();

  selectionStarted(): void {
    // Nothing to do here
  }

  selectionEnded(): void {
    // Nothing to do here
  }

  setSelection(selection: Rect): void {
    this.selection = selection;
  }

  setSelecting(items: I[]): void {
    // Nothing to do here
  }

  setSelected(items: I[]): void {
    // Nothing to do here
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
    this.selection = undefined!;
  }
}
