import { SelectableStrategy } from './strategy';
import { Rect, SelectableItem } from './types';

export interface SelectableStrategyPlugin<I>
  extends Partial<Omit<SelectableStrategy<I>, 'isSelected'>> {
  isSelected?(currently: boolean, rect: Rect, item: SelectableItem<I>): boolean;
}
