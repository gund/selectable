import { Rect, SelectionRenderer } from '@selectable/core';

import { DomSelectionUpdateStrategy } from './dom-renderer-strategy';
import { DomSelectionUpdateStrategyReflow } from './dom-renderer-strategy-reflow';
import { toPx } from './util';

export interface DomSelectionRendererOptions {
  container: HTMLElement;
  updateStrategy?: DomSelectionUpdateStrategy;
  selectionTag?: string;
  selectionClass?: string;
  selectingClass?: string;
}

export class DomSelectionRenderer implements SelectionRenderer {
  protected container = this.options.container;
  protected updateStrategy =
    this.options.updateStrategy || new DomSelectionUpdateStrategyReflow();
  protected selectionTag = this.options.selectionTag || 'div';
  protected selectionClass = this.options.selectionClass || 'selection';
  protected selectingClass = this.options.selectingClass || 'selecting';

  protected selection = this.createSelection();

  protected isSelecting = false;

  constructor(protected options: DomSelectionRendererOptions) {}

  setIsSelecting(isSelecting: boolean): void {
    if (this.isSelecting === isSelecting) {
      return;
    }

    this.isSelecting = isSelecting;

    this.updateSelection(this.selection);
    this.updateContainer(this.container);
  }

  render(selection: Rect): void {
    this.updateStrategy.update(this.selection, selection);
  }

  destroy(): void {
    this.container.removeChild(this.selection);
    this.selection = null!;
    this.container = null!;
    this.options = null!;
  }

  protected createSelection() {
    const selection = document.createElement(this.selectionTag);

    this.initSelection(selection);
    this.initContainer(this.container);

    this.container.appendChild(selection);

    return selection;
  }

  protected initSelection(selection: HTMLElement): void {
    selection.classList.add(this.selectionClass);

    selection.style.position = 'absolute';
    selection.style.opacity = '0';
    selection.style.pointerEvents = 'none';
  }

  protected initContainer(container: HTMLElement): void {
    container.style.position = 'relative';
  }

  protected updateSelection(selection: HTMLElement): void {
    if (this.isSelecting) {
      selection.style.opacity = '1';
    } else {
      selection.style.opacity = '0';
    }
  }

  protected updateContainer(container: HTMLElement): void {
    if (this.isSelecting) {
      container.classList.add(this.selectingClass);
    } else {
      container.classList.remove(this.selectingClass);
    }
  }
}
