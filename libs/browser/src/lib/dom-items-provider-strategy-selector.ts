import { DomItemsProviderStrategy } from './dom-items-provider-strategy';

export class DomItemsProviderStrategySelector
  implements DomItemsProviderStrategy {
  constructor(private cssSelector: string = '.item') {}

  query(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.cssSelector));
  }
}
