# panels.js
![Bower version](https://img.shields.io/bower/v/panels.js.svg?style=flat)
[![npm version](https://img.shields.io/npm/v/panels.js.svg?style=flat)](https://www.npmjs.com/package/panels.js)
[![Build Status](https://travis-ci.org/bcorreia/panels.js.svg?branch=master)](https://travis-ci.org/bcorreia/panels.js)

---
Add templated panels to your layout. ***Panels.js*** can be creatively applied to portfolio websites, e-commerce projects, comparison charts and other.<br />

1. Create semantic templates with Handlebars.js (optional)<br />
1. Listen to load events with Desandro’s imagesloaded.js (optional)<br />
1. Animation performance with Velocity.js (dependency)<br />
1. Responsive
1. jQuery is **not** required

---
## Demo
[**bcorreia.com/panels.js**] (http://bcorreia.com/panels.js)

## Getting Started
You may install panels.js using package managers, or download project [archive](https://github.com/bcorreia/panels.js/archive/master.zip).<br />
Installing via `bower` will bring in the dependencies as well.
```bash
bower install panels.js
npm install panels.js

# panels.min.js           minified version of panels.js
# panels.pkg.min.js       minified with [velocity]
# panels.pkg.all.min.js   minified with [velocity, handlebars, imagesloaded]
```

## Usage
```javascript
var panels = new Panels(document.querySelector('.selector'), {
    // settings
});
```

## Settings
```javascript
handlebars: true,
context: {},
url: '',
stage: {
    fade: true,
    speed: 800
},
panel: {
    classes: '',
    position: 'top',
    stackable: true,
    speed: 600,
    easing: 'easeOutQuad'
},
scroll: {
    offset: 0,
    speed: 600,
    easing: 'easeOutQuad'
},
onInit: function() {},
onBefore: function() {},
onAfter: function() {}
```

| Options | Description | Default | Type
:--- | :--- | ---: | ---:
| `handlebars` | Handlebars templates | `true` | `boolean`
| `context` | Context to compile Handlebars templates | `{}` | `object`
| `url` | URL to which ajax request is sent <sup>**[1]**</sup> | `undefined` | `string`
| &nbsp; | |
| `stage.fade` | Fade in on “imagesloaded” event dispatch | `true` | `boolean`
| `stage.speed` | Fade in speed in milliseconds | `800` | `number`
| &nbsp; | |
| `panel.classes` | CSS class to be added to panel element | `''` | `string`
| `panel.position` | `top`, `between rows` or `DOM node` <sup>**[2]**</sup> | `top` | `str/obj`
| `panel.stackable` | Allow stacking of multiple panels <sup>**[3]**</sup> | `true` | `boolean`
| `panel.speed` | Animation speed in milliseconds | `600` | `number`
| `panel.easing` | Animation easing type | `easeOutQuad` | `string`
| &nbsp; | |
| `scroll.offset` | Scroll top offset | `0` |  `number`
| `scroll.speed` | Scroll speed in milliseconds | `600` | `number`
| `scroll.easing` | Scroll easing type | `easeOutQuad` | `string`

<sup>**[1]**</sup> Use only when `handlebars` is set to `false`.<br />
<sup>**[2]**</sup> Use `top` or `between rows`, or a valid DOM element.<br />
<sup>**[3]**</sup> This option is available only when `panel.position` is set to `top`.

```javascript
/*
Available easing types are:
easeInSine, easeOutSine, easeInOutSine, easeInQuad, easeOutQuad, easeInOutQuad,
easeInCubic, easeOutCubic, easeInOutCubic, easeInQuart, easeOutQuart, easeInOutQuart,
easeInQuint, easeOutQuint, easeInOutQuint, easeInExpo, easeOutExpo, easeInOutExpo.
*/
```

### Callbacks
```javascript
// called after stage-template compiles
onInit: function() {}

// called before animation starts
onBefore: function(event, element) {}   // event: open, close (string)
                                        // element: `.panel`  (DOM node)

// called after animation ends
onAfter: function(event, element) {}    // event: open, close (string)
                                        // element: `.panel`  (DOM node)
```

### Public Methods
```javascript
.open(element, callback);               // @param: stage dom element
                                        // @param: fn triggered after animation ends

.close(element, callback);              // @param: panel dom element
                                        // @param: fn triggered after animation ends

// example
// https://gist.github.com/bcorreia/ed2210b1e11b947187e8
```

### HTML data attribute
```html
<!-- include data-role attributes in your panel template. (optional) -->
data-role="close"             <!-- close panel -->
data-role="previous"          <!-- previous panel -->
data-role="next"              <!-- next panel -->
```

### CSS
```css
/* optional */
.selector                { display: flex; flex-flow: row wrap; … }
.selector .panel         { width: 100%; position: relative; overflow: hidden; }
.selector .on            { … }
.selector .disabled      { … }
```

## Panels.js with Handlebars
> Handlebars provides the power necessary to build semantic templates effectively with no frustration. If you are not familiar with Handlebars, please refer to the [documentation](https://github.com/wycats/handlebars.js) or [tutorial](http://tutorialzine.com/2015/01/learn-handlebars-in-10-minutes/).

### Stage
`.item` class is required.
```html
<script data-role="stage" type="text/x-handlebars-template">
    {{#each items}}
        <figure class="item">
            <!-- be creative -->
        </figure>
    {{/each}}
</script>
```

### Panel
`.panel` class is automatically added to the parent element.
```html
<script data-role="panel" type="text/x-handlebars-template">
    <!-- be creative -->
</script>
```

### Context
The **stage template** uses the same context as the **panel template**.
```javascript
{
    "items": [
        { "key": "value", … },
        { "key": "value", … }
        …
    ]
}
```

## Panels.js without Handlebars
Using Panels.js without Handlebars. [**view gist**](https://gist.github.com/bcorreia/69c8418931e8fdf84042)

## Desandro’s imagesLoaded
***Panels.js*** automatically recognizes the presence of the [imagesLoaded](https://github.com/desandro/imagesloaded) library.<br /> This library is recommended when image(s) are being loaded in your template.

---

## License
This software is free to use under the [MIT license](https://github.com/bcorreia/panels.js/blob/master/license.md).
