# panels.js
![Bower version](https://img.shields.io/bower/v/panels.js.svg?style=flat)
[![npm version](https://img.shields.io/npm/v/panels.js.svg?style=flat)](https://www.npmjs.com/package/panels.js)
[![Build Status](https://travis-ci.org/bcorreia/panels.js.svg?branch=master)](https://travis-ci.org/bcorreia/panels.js)

---
Add ***panels.js*** to your layout. Creatively apply it to portfolio websites, e-commerce, comparison charts and other.<br />

1. Create semantic templates with Handlebars.js \*
1. Animation performance with Velocity.js
1. Responsive
1. jQuery is **not** required

\* optional

---
## Demo
[**bcorreia.com/panels.js**](http://bcorreia.com/panels.js)

## Getting Started
You may install panels.js using package managers, or download project [archive](https://github.com/bcorreia/panels.js/archive/master.zip).<br />
Installing via `bower` will bring in any dependency as well.
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
context: {},
stage: {
    fade: true,
    speed: 800
},
panel: {
    position: 'top',
    classes: '',
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
| `context` | Context to compile Handlebars templates \* | `{}` | `str/obj`
| `stage.fade` | Fade-in on “imagesloaded” event | `true` | `boolean`
| `stage.speed` | Fade-in speed in milliseconds | `800` | `number`
| `panel.position` | `top`, `between rows` or any DOM element | `top` | `str/obj`
| `panel.classes` | Optional CSS classes | `''` | `string`
| `panel.speed` | Animation speed in milliseconds | `600` | `number`
| `panel.easing` | Animation easing type | `easeOutQuad` | `string`
| `scroll.offset` | Scroll top offset | `0` |  `number`
| `scroll.speed` | Scroll speed in milliseconds | `600` | `number`
| `scroll.easing` | Scroll easing type | `easeOutQuad` | `string`

```javascript
/*
Available easing types are:
easeInSine, easeOutSine, easeInOutSine, easeInQuad, easeOutQuad, easeInOutQuad,
easeInCubic, easeOutCubic, easeInOutCubic, easeInQuart, easeOutQuart, easeInOutQuart,
easeInQuint, easeOutQuint, easeInOutQuint, easeInExpo, easeOutExpo, easeInOutExpo.
*/
```
> \* If handlebars.js library is not present, `context` should be a `string`, a path to which an Ajax request is sent.

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

### HTML data-role attribute
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

## Using Panels.js with Handlebars
Panles.js automatically detects and compiles Handlebars templates if present.

### Stage
```html
<script data-role="stage" type="text/x-handlebars-template">
    {{#each items}}
        <figure class="item"> <!-- required class -->
            …
        </figure>
    {{/each}}
</script>
```

### Panel
```html
<script data-role="panel" type="text/x-handlebars-template">
    …
</script>
```

### Context
The context object will be used to render the **stage template** and **panel template**.
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
Using Panels.js without Handlebars: [**view gist**](https://gist.github.com/bcorreia/69c8418931e8fdf84042)

## imagesLoaded
Panels.js automatically detects [imagesLoaded](https://github.com/desandro/imagesloaded) library if present.<br /> This library is recommended when image(s) are being loaded in your templates.

---

## License
This software is free to use under the [MIT license](https://github.com/bcorreia/panels.js/blob/master/license.md).
