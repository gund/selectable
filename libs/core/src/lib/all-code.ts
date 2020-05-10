declare global {
  interface ElementEventMap {
    mousedown: MouseEvent;
    mousemove: MouseEvent;
    mouseup: MouseEvent;
    keydown: KeyboardEvent;
    keyup: KeyboardEvent;
  }
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  start: Point;
  end: Point;
}

export interface SelectionOptions {
  itemsSelector: string;
  events?: SelectionEvents;
  conteinerClass?: string;
  selectionClass?: string;
  contrainerSelectingClass?: string;
  itemSelectedClass?: string;
  selectionScaleFactor?: number;
}

export type SelectionSelectedHandler = (items: Element[]) => void;
export type SelectionProgressHandler = (items: Element[]) => void;

export interface SelectionEvents {
  selected?: SelectionSelectedHandler;
  selecting?: SelectionProgressHandler;
}

export function createSelection(
  container: Element,
  {
    itemsSelector,
    events = {},
    conteinerClass = 'with-selection',
    selectionClass = 'selection',
    contrainerSelectingClass = 'selecting',
    itemSelectedClass = 'selected',
    selectionScaleFactor = 0.5, // We render in base size x2
  }: SelectionOptions
) {
  const mouse: Rect = {
    start: { x: -1, y: -1 },
    end: { x: -1, y: -1 },
  };
  const selection: Rect = {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  };
  const selectionElem = document.createElement('div');

  const onSelected = events.selected || noop;
  const onSelecting = events.selecting || noop;

  let isSelecting = false;
  let prevIsSelecting = false;
  let selectingChanged = false;
  let items: Element[] = [];
  let lastItems: Element[] = [];
  let itemRects: Rect[] = [];
  let selectedItemsIndexes: Record<string, boolean> = {};
  let prevSelectedItemsIndexes: Record<string, boolean> = {};
  let lastSelectedItems: Element[] = [];
  let selectedItemsChanged = false;
  let isAdditionMode = false;

  init();

  function init() {
    selectionElem.classList.add(selectionClass);
    container.classList.add(conteinerClass);
    container.appendChild(selectionElem);
    container.addEventListener('mousedown', handleMouseDown, {
      capture: false,
    });
    container.addEventListener('mousemove', handleMouseMove, {
      capture: false,
    });
    container.addEventListener('mouseup', handleMouseUp, {
      capture: false,
    });
    container.addEventListener('keydown', handleKeyDown, {
      capture: false,
    });
    container.addEventListener('keyup', handleKeyUp, {
      capture: false,
    });

    updateItems();
  }

  function handleKeyDown(event: KeyboardEvent) {
    isAdditionMode = event.ctrlKey;
  }

  function handleKeyUp() {
    isAdditionMode = false;
  }

  function handleMouseDown(event: MouseEvent) {
    isSelecting = true;
    prevSelectedItemsIndexes = { ...selectedItemsIndexes };

    mouse.start.x = mouse.end.x = getX(event);
    mouse.start.y = mouse.end.y = getY(event);

    updateSelection();
    updateSelectedItems();
    scheduleRendering();
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isSelecting) {
      return;
    }

    event.preventDefault();

    mouse.end.x = getX(event);
    mouse.end.y = getY(event);

    updateSelection();
    updateSelectedItems();
    scheduleRendering();
  }

  function handleMouseUp() {
    isSelecting = false;

    updateSelection();
    updateSelectedItems();
    scheduleRendering();
  }

  function scheduleRendering() {
    requestAnimationFrame(() => {
      renderSelection();
      renderSelectedItems();
    });
  }

  function updateSelection() {
    selectingChanged = isSelecting !== prevIsSelecting;

    if (selectingChanged) {
      prevIsSelecting = isSelecting;

      if (isSelecting) {
        container.classList.add(contrainerSelectingClass);
      } else {
        container.classList.remove(contrainerSelectingClass);
      }
    }

    const startX = Math.min(mouse.start.x, mouse.end.x);
    const startY = Math.min(mouse.start.y, mouse.end.y);
    const endX = Math.max(mouse.start.x, mouse.end.x);
    const endY = Math.max(mouse.start.y, mouse.end.y);

    selection.start.x = startX;
    selection.start.y = startY;
    selection.end.x = endX;
    selection.end.y = endY;
  }

  function renderSelection() {
    const width = selection.end.x - selection.start.x;
    const height = selection.end.y - selection.start.y;

    const translate = `translate(${toPx(selection.start.x)}, ${toPx(
      selection.start.y
    )})`;
    const scale = `scale(${width * selectionScaleFactor}, ${
      height * selectionScaleFactor
    })`;
    const transform = `${translate} ${scale}`;

    selectionElem.style.transform = transform;
    // selectionElem.style.left = toPx(selection.start.x);
    // selectionElem.style.top = toPx(selection.start.y);
    // selectionElem.style.width = toPx(width);
    // selectionElem.style.height = toPx(height);
  }

  function isSelected(rect: Rect): boolean {
    return areRectsIntersect(rect, selection);
  }

  function isSelectedAdding(rect: Rect, idx: number): boolean {
    return !!(
      Number(prevSelectedItemsIndexes[idx]) ^
      Number(areRectsIntersect(rect, selection))
    );
  }

  function checkSelected() {
    const fn = isAdditionMode ? isSelectedAdding : isSelected;
    return (rect: Rect, idx: number) =>
      (selectedItemsIndexes[idx] = fn(rect, idx));
  }

  function updateSelectedItems() {
    itemRects.forEach(checkSelected());

    const selectedItems = items.filter((_, idx) => selectedItemsIndexes[idx]);
    selectedItemsChanged =
      lastItems !== items || lastSelectedItems.length !== selectedItems.length;
    lastSelectedItems = selectedItems;
    lastItems = items;

    if (isSelecting) {
      if (selectedItemsChanged) {
        onSelecting(selectedItems);
      }
    } else if (selectingChanged) {
      onSelected(selectedItems);
    }
  }

  function renderSelectedItems() {
    items.forEach((item, idx) => {
      if (selectedItemsIndexes[idx]) {
        item.classList.add(itemSelectedClass);
      } else {
        item.classList.remove(itemSelectedClass);
      }
    });
  }

  function updateItems() {
    lastItems = items;
    items = Array.from(container.querySelectorAll(itemsSelector));
    selectedItemsIndexes = {};
    prevSelectedItemsIndexes = {};
    lastSelectedItems = [];

    measureItems();
  }

  function measureItems() {
    itemRects = items.map((item) => {
      const rect = item.getBoundingClientRect();

      const start: Point = {
        x: rect.left,
        y: rect.top,
      };

      const end: Point = {
        x: rect.left + rect.width,
        y: rect.top + rect.height,
      };

      return { start, end } as Rect;
    });

    updateSelectedItems();
    scheduleRendering();
  }

  return { updateItems, measureItems };
}

function getX(event: MouseEvent) {
  return event.pageX;
}

function getY(event: MouseEvent) {
  return event.pageY;
}

function toPx(n: number): string {
  return `${n}px`;
}

function areRectsIntersect(rect1: Rect, rect2: Rect): boolean {
  if (rect1.end.x < rect2.start.x || rect1.start.x > rect2.end.x) {
    return false;
  }

  if (rect1.end.y < rect2.start.y || rect1.start.y > rect2.end.y) {
    return false;
  }

  return true;
}

function noop() {}
