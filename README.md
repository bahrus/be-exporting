# be-exporting

Export JS constants from inline script attributes.

[![NPM version](https://badge.fury.io/js/be-exporting.png)](http://badge.fury.io/js/be-exporting)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-exporting?style=for-the-badge)](https://bundlephobia.com/result?p=be-exporting)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-exporting?compression=gzip">
[![Playwright Tests](https://github.com/bahrus/be-exporting/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-exporting/actions/workflows/CI.yml)

```html
<div be-exporting='of onload.' onload="export const test='hello';"></div>
```

To access the export const symbols:

```JavaScript
const enhancement = await oDiv.beEnhanced.whenResolved('be-exporting');
const {onload} = enhancement;
const {test} = onload;
```

## Viewing Demos Locally

Any web server that can serve static files will do, but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.js.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/ in a modern browser.

## Running Tests

```
> npm run test
```

## Using from ESM Module:

```JavaScript
import 'be-exporting/be-exporting.js';
```

## Using from CDN: