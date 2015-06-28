# panels.js
![Bower version](https://img.shields.io/bower/v/panels.js.svg?style=flat)
[![npm version](https://img.shields.io/npm/v/panels.js.svg?style=flat)](https://www.npmjs.com/package/panels.js)
[![Build Status](https://travis-ci.org/bcorreia/panels.js.svg?branch=master)](https://travis-ci.org/bcorreia/panels.js)

---
Add templated panels to your layout.<br />
[**Demo**](http://bcorreia.com/panels.js)

## Getting Started
Installing via `bower` is recommended.
```bash
bower install panels.js
npm install panels.js

# panels.min.js           minified version
# panels.pkg.min.js       minified with [velocity]
# panels.pkg.all.min.js   minified with [velocity, handlebars, imagesloaded]
```

## Usage
> jQuery is **not** required

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
| `context` | context to compile `handlebars` templates| `{}` | `str/obj`
| `stage.fade` | fade-in on `imagesloaded` event | `true` | `boolean`
| `stage.speed` | fade-in speed in milliseconds | `800` | `number`
| `panel.position` | `top`, `between rows` or a dom node | `top` | `str/obj`
| `panel.classes` | optional CSS classes | `''` | `string`
| `panel.speed` | animation speed in milliseconds | `600` | `number`
| `panel.easing` | animation easing type | `easeOutQuad` | `string`
| `scroll.offset` | scroll top offset | `0` |  `number`
| `scroll.speed` | scroll speed in milliseconds | `600` | `number`
| `scroll.easing` | scroll easing type | `easeOutQuad` | `string`

```javascript
// available easing types:
// gist.github.com/bcorreia/8b2892ebad56514a644b
```
> If **Handlebars.js** library is not present, `context` should be a string, a path to which an ajax request is sent.

### Callbacks
```javascript
onInit: function() {}                   // called after stage-template compiles
onBefore: function(event, element) {}   // called before animation starts
onAfter: function(event, element) {}    // called after animation ends

// event: 'open' or 'close' (string)
// element: '.panel' (dom node)
```

### Public Methods
```javascript
.open(element, callback);               // @param: '.item' element
                                        // @param: callback after animation ends

.close(element, callback);              // @param: '.panel' element
                                        // @param: callback after animation ends

// example
// gist.github.com/bcorreia/ed2210b1e11b947187e8
```

### HTML data-role attribute
```html
data-role="close"       <!-- close panel -->
data-role="previous"    <!-- previous panel -->
data-role="next"        <!-- next panel -->

<!-- example -->
<a class="-button" data-role="next" href="#">Next</a>
```

### CSS
Available classes are:
```css
.panel              { … }
.panel .-inner      { … }
.on                 { … } /* active item */
.disabled           { … } /* disabled button */
```

## Handlebars
Panles.js automatically detects and compiles Handlebars templates if present. <br />If you want to use Panels.js without Handlebars, please refer to this [**gist**](https://gist.github.com/bcorreia/69c8418931e8fdf84042).

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
    <!-- your handlebars template -->
</script>
```

### Context
The context object will be used to render the stage-template and panel-template.
```javascript
{
    "items": [
        { "key": "value", … },
        { "key": "value", … }
        …
    ]
}
```

## imagesLoaded
Panels.js automatically detects [imagesLoaded](https://github.com/desandro/imagesloaded) library if present.<br /> This library is recommended when images are being loaded in your templates.

## Velocity
[Velocity.js](https://github.com/julianshapiro/velocity) is the only dependency.<br />
No additional programming is necessary.

---
## License
This software is free to use under the [MIT license](https://github.com/bcorreia/panels.js/blob/master/license.md).
