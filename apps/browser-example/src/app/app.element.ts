import './app.element.css';

import { DomSelectable } from '@selectable/browser';
import { Selectable } from '@selectable/core';

export class AppElement extends HTMLElement {
  static observedAttributes = ['items'];

  items = 100;

  private initialRendered = false;
  private selectable?: Selectable<HTMLElement>;

  connectedCallback() {
    this.render(true);
  }

  disconnectedCallback() {
    this.destroySelectable();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'items') {
      this.items = parseInt(newValue, 10);
      this.render();
    }
  }

  private render(initial = false) {
    if (initial && this.initialRendered) {
      return;
    }
    this.initialRendered = true;

    this.destroySelectable();

    this.innerHTML = this.renderHtml();

    const itemsContainer = this.querySelector<HTMLElement>('.items-container');

    if (!itemsContainer) {
      throw new Error(`No items container found in HTML!`);
    }

    this.createSelectable(itemsContainer);
  }

  private renderHtml() {
    const items = new Array(this.items).fill(null);

    return `
      <div class="items-container">
        ${items
          .map((_, i) => `<div class="item">Item ${i + 1}</div>`)
          .join('\n')}
      </div>
    `;
  }

  private createSelectable(container: HTMLElement) {
    this.selectable = new DomSelectable({ container });

    this.selectable.on('selecting', (items) =>
      console.log('Selecting items', items)
    );

    this.selectable.on('selected', (items) =>
      console.log('Selected items', items)
    );
  }

  private destroySelectable() {
    if (this.selectable) {
      this.selectable.destroy();
      this.selectable = undefined;
    }
  }
}

customElements.define('selectable-root', AppElement);
