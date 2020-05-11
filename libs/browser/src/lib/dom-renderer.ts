import { Rect, SelectableRenderer } from '@selectable/core';

import { DomSelectableUpdateStrategy } from './dom-renderer-strategy';
import { DomSelectableUpdateStrategyReflow } from './dom-renderer-strategy-reflow';

export interface DomSelectableRendererOptions {
  container: HTMLElement;
  updateStrategy?: DomSelectableUpdateStrategy;
  selectionTag?: string;
  selectionClass?: string;
  selectingClass?: string;
}

export class DomSelectableRenderer implements SelectableRenderer {
  protected container = this.options.container;
  protected updateStrategy =
    this.options.updateStrategy || new DomSelectableUpdateStrategyReflow();
  protected selectionTag = this.options.selectionTag || 'div';
  protected selectionClass = this.options.selectionClass || 'selection';
  protected selectingClass = this.options.selectingClass || 'selecting';

  protected selection = this.createSelection();

  protected isSelecting = false;

  constructor(protected options: DomSelectableRendererOptions) {}

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
    this.updateStrategy.initSelection(selection);

    this.initContainer(this.container);
    this.updateStrategy.initContainer(this.container);

    this.container.appendChild(selection);

    return selection;
  }

  protected initSelection(selection: HTMLElement): void {
    selection.classList.add(this.selectionClass);

    selection.style.position = 'absolute';
    selection.style.pointerEvents = 'none';
    selection.style.opacity = '0';
    selection.style.willChange = 'opacity';
  }

  protected initContainer(container: HTMLElement): void {
    container.style.position = 'relative';
    container.style.userSelect = 'none';
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
