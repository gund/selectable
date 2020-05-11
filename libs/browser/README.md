# @selectable/browser

> Library that provides selection capabilities to JS ecosystem

This is an extension package for browsers.

See example usage in the [demo app](../../apps/browser-example/src/app/app.element.ts).

Simple use-case:

```ts
import { DomSelectable } from '@selectable/browser';

const selectable = new DomSelectable({
  container: document.querySelector('...'),
});

selectable.on('selected', (items) => console.log('Selected items', items));
```

## Running build

Run `nx build browser` to execute the build the package.

## Running unit tests

Run `ng test browser` to execute the unit tests via [Jest](https://jestjs.io).
