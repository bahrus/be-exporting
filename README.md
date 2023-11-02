# be-exporting

```html
<div be-exporting='of onload.' onload="export const test='hello';"></div>
```

To access the export const symbols:

```JavaScript
const enhancement = await oDiv.beEnhanced.whenResolved('be-exporting');
const {onload} = enhancement;
const {test} = onload;
```