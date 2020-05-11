import { Selectable } from './selectable';

export interface SelectableVisitor<I> {
  apply(selectable: Selectable<I>): void;
  destroy(): void;
}
