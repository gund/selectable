import { Rect } from './types';

export interface SelectionRenderer {
  render(selection: Rect): void;
  destroy(): void;
}
