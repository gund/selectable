import { DomItemsProviderStrategy } from './dom-items-provider-strategy';

export class DomItemsProviderStrategyClass implements DomItemsProviderStrategy {
  constructor(private name: string = 'item') {}

  query(container: HTMLElement): HTMLElement[] {
    return Array.from(
      container.getElementsByClassName(this.name)
    ) as HTMLElement[];
  }
}
