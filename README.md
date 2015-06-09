# panels.js
![Bower version](https://img.shields.io/bower/v/panels.js.svg?style=flat)
[![npm version](https://img.shields.io/npm/v/panels.js.svg?style=flat)](https://www.npmjs.com/package/panels.js)
[![Build Status](https://travis-ci.org/bcorreia/panels.js.svg?branch=master)](https://travis-ci.org/bcorreia/panels.js)

---
**A natural collection of panels.**

Built to display a collection of panels, ***panels.js*** can be creatively applied to e-commerce projects, portfolio websites, visual documentations, comparison charts and other.

1. Animation performance with [velocity.js](https://github.com/julianshapiro/velocity)<br />
1. Coded to leverage [handlebars.js](http://handlebarsjs.com/) (optional)<br />
1. jQuery library is **not** required<br />
1. Responsive

## Demos
[Multiple panels stacked](http://bcorreia.com/projects/panels.js/src/demo-top-stacked.html)<br />
[Single panel between rows](http://bcorreia.com/projects/panels.js/src/demo-between-rows.html)<br />
[Single panel over stage](http://bcorreia.com/projects/panels.js/src/demo-over-stage.html)

## Getting Started
You may install using package managers, or download project [archive](https://github.com/bcorreia/panels.js/archive/master.zip).<br />
Installing via `bower` will bring in the dependencies as well.
```bash
bower install panels.js
npm install panels.js

# panels.min.js             minified version of panels.js
# panels.packaged.min.js    minified with [velocity, handlebars, imagesloaded]
```

## Usage
```javascript
var panels = new Panels(document.querySelector('.selector'), {
    // extend settings
});
```

## Settings
```javascript
{
    handlebars: true,
    context: {},
    url: undefined,
    stage: {
        fade: true,
        speed: 800
    },
    panel: {
        classes: "",
        position: "top",
        stackable: true,
        speed: 600,
        easing: "easeOutQuad"
    },
    scroll: {
        offset: 0,
        speed: 600,
        easing: "easeOutQuad"
    },
    onInit: function() {},
    onBefore: function() {},
    onAfter: function() {}
}
```

| Options | Description | Default | Type
:--- | :--- | ---: | ---:
| `handlebars` | Handlebars templates | `true` | `boolean`
| `context` | Context to compile Handlebars templates | `{}` | `object`
| `url` | URL to which ajax request is sent \* | `undefined` | `string`
| &nbsp; | |
| `stage.fade` | Fade in on “imagesloaded” event dispatch | `true` | `boolean`
| `stage.speed` | Fade in speed in milliseconds | `800` | `number`
| &nbsp; | |
| `panel.classes` | CSS class to be added to panel element | `""` | `string`
| `panel.position` | `top`, `between rows` or `over stage` | `top` | `string`
| `panel.stackable` | Allow stacking of multiple panels \*\* | `true` | `boolean`
| `panel.speed` | Animation speed in milliseconds | `600` | `number`
| `panel.easing` | Animation easing type | `easeOutQuad` | `string`
| &nbsp; | |
| `scroll.offset` | Scroll top offset | `0` |  `number`
| `scroll.speed` | Scroll speed in milliseconds | `600` | `number`
| `scroll.easing` | Scroll easing type | `easeOutQuad` | `string`

\* Use only when `handlebars` is set to `false`.<br />
\*\* This option is available only when `panel.position` is set to `top`.

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
onInit: function() {}                   // called after stage-template compiles

onBefore: function(event, element) {}   // called before animation starts
                                        // event: open, close | element: panel

onAfter: function(event, element) {}    // called after animation ends
                                        // event: open, close | element: panel
```

### Public Methods
```javascript
.close(element, callback);              // @param: `undefined` or panel element
                                        // @param: fn triggered after animation ends

.open(element, callback);               // @param: stage element
                                        // @param: fn triggered after animation ends

// example
var panels = new Panels(document.querySelector('.selector'));
…
panels.open(document.querySelector('figure:nth-child(2)'));
```

### HTML data-attributes
Add data-query attribute to elements within your **stage template**. (optional)
```html
<!-- use when `Handlebars` is set to false -->
data-query='{"key": "value" … }'  <!-- query string to be appended -->
```

Add any of these data-attributes to elements within your **panel template**. (optional)
```html
data-role="close"              <!-- close panel -->
data-role="previous"           <!-- previous -->
data-role="next"               <!-- next -->
```

### CSS
```css
.selector                { display: flex; flex-flow: row wrap; }
.selector .panel         { width: 100%; position: relative; overflow: hidden; }

/* optional classes */
.selector .on            {}
.selector .disabled      {}
```

## With Handlebars
> Handlebars provides the power necessary to build semantic templates effectively with no frustration. If you are not familiar with Handlebars, please refer to the [documentation](https://github.com/wycats/handlebars.js) or [tutorial](http://tutorialzine.com/2015/01/learn-handlebars-in-10-minutes/).

### Stage
`.item` is the only required class.
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

## Without Handlebars

### Stage
`.item` is the only required class.
```html
<div data-role="stage">
    <!-- data-query attribute is optional -->
    <figure class="item" data-query='{ "key": "value" }'>
        <!-- be creative -->
    </figure>
    …
</div>
```

### Panel
> Set `url` path to your server-side script. `?n=number` is automatically appended to the query string.
> The returned HTML is added to the document.

`.panel` class is automatically added to the parent element.
```html
<!-- be creative -->
```

## Dependencies
- [Velocity](https://github.com/julianshapiro/velocity)
- [imagesLoaded](https://github.com/desandro/imagesloaded)
- [Handlebars](http://handlebarsjs.com/) (optional)

## License
This software is free to use under the [MIT license](https://github.com/bcorreia/panels.js/blob/master/license.md).
