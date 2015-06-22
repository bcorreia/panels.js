/**
 * panels.js - version 1.8.0
 *
 * https://github.com/bcorreia/panels.js.git
 * Bruno Correia - mail@bcorreia.com
 *
 */
var Panels = (function() {
    'use strict';

    var Velocity = window.Velocity || $.fn.velocity,
        imagesLoaded = window.imagesLoaded || function(arg, callback) { return callback() },
        Handlebars = window.Handlebars || false;

    var defaults = {
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
    };

    /**
     * add '.on' to element
     * @return undefined
     *
     */
    function on() {
        return this.classList.add('on');
    }

    /**
     * remove '.on' from element
     * @return undefined
     *
     */
    function off(position) {
        return this.querySelector('[data-position="'+ position +'"]').classList.remove('on');
    }

    /**
     * remove '.on' from all elements
     * @return undefined
     *
     */
    function reset() {
        var elements = this.querySelectorAll('.item.on');
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('on');
        };
    }

    /**
     * find last element on the same row
     * @return DOM element
     *
     */
    function find() {
        var top = this.getBoundingClientRect().top,
            next = this.nextElementSibling;

        if ( !next.classList.contains('item') ) {
            return this;
        }

        return (next.getBoundingClientRect().top === top) ? find.call(next) : this; // recursive calls
    }

    /**
     * deep extend: merge defaults with options
     * @param {Objects} objects
     * @return {Object} merged values of default settings and options
     *
     */
    function extend(objects) {
        var extended = {};
        var merge = function (obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    if ( Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = extend(extended[prop], obj[prop]);
                    }
                    else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };
        merge(arguments[0]);
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
            merge(obj);
        }
        return extended;
    }

    /**
     * @param DOM element
     * @param {Object} settings
     * @return undefined
     */
    function scroll(element, settings) {
        if ( element !== undefined ) {
            Velocity(document.body, 'scroll', {
                duration: settings.speed,
                easing: settings.easing,
                offset: element.getBoundingClientRect().top + window.scrollY - settings.offset
            });
        }
    }

    var panels = {

        /**
         * init
         * @return undefined
         *
         */
        init: function() {
            var settings = this.settings,
                stage = this.stage,
                items;

            // compile stage template
            if ( Handlebars ) {
                var template = Handlebars.compile(document.querySelector('[data-role="stage"]').innerHTML),
                    html = template(settings.context);
            }

            if ( settings.stage.fade ) {
                html && stage.insertAdjacentHTML('afterbegin', html);
                stage.style.opacity = 0;
                imagesLoaded(stage, function() {
                    settings.onInit(); // callback fn
                    Velocity(stage, { opacity: 1 }, settings.stage.speed, function() {
                        stage.removeAttribute('style');
                    });
                });
            } else {
                html && stage.insertAdjacentHTML('afterbegin', html);
                settings.onInit(); // callback fn
            }

            items = stage.querySelectorAll('.item');

            // enumerate:
            // add data-position attribute to items
            // add event listeners
            for (var i = 0; i < items.length; i++) {
                items[i].setAttribute('data-position', i);
                items[i].addEventListener('click', function(event) {
                    event.preventDefault();
                    event.target.classList.contains('on') || this.open(event.target);
                }.bind(this), false);
            };

            window.addEventListener('resize', function() {
                return (settings.panel.position === "between rows" && !navigator.userAgent.match(/Mobi/) ) && this.reset();
            }.bind(this), true);
        },

        /**
         * @param DOM element '.item'
         * @param callback fn
         * @return DOM element added to document
         *
         */
        prepare: function(element, callback) {
            var settings = this.settings;

            var template,
                panel = document.createElement('div'),
                position = element.getAttribute('data-position');

            panel.className = 'panel ' + settings.panel.classes;
            panel.setAttribute('data-paired', position);

            // handlebars
            if ( Handlebars ) {
                template = Handlebars.compile(document.querySelector('[data-role="panel"]').innerHTML);
                panel.innerHTML = template(settings.context.items[position]);
                return this.insert(panel, element, callback);
            }
            // !handlebars
            else {
                var xhr = new XMLHttpRequest(),
                    json = element.getAttribute('data-query'),
                    n = "n=" + position,
                    query;

                if ( json ) {
                    var obj = JSON.parse(json), arr = [];
                    for ( var prop in obj ) {
                        arr.push( prop + "=" + obj[prop] );
                    }
                    query = arr.join("&");
                }
                // concat
                query = (query && query.length) ? query + "&" + n : n;

                xhr.open('get', settings.context + "?" + query, true);
                xhr.send();
                xhr.onload = function() {
                    panel.innerHTML = xhr.response;
                    return this.insert(panel, element, callback);
                }.bind(this);
            }
        },

        /**
         * insert panel to document
         * @param DOM element '.panel'
         * @param DOM element '.item'
         * @param callback fn
         * @return DOM element added to document
         *
         */
        insert: function(panel, element, callback) {
            var settings = this.settings,
                stage = this.stage,
                stack = this.stack;

            var el, placement, items,
                properties = 'opacity:0; height:0';

            // wrap -inner
            panel.innerHTML = '<div class="-inner">' + panel.innerHTML + '</div>';

            switch ( settings.panel.position ) {
                case "between rows":
                    panel.style.cssText = properties;
                    placement = find.call(element);
                    el = placement.parentNode.insertBefore(panel, placement.nextSibling); // insertAfter
                break;

                case "top":
                    panel.style.cssText = properties;
                    el = stage.insertBefore(panel, stage.firstChild); // prepend
                break;

                default: // custom
                    el = document.body.insertBefore(panel, settings.panel.position); // prepend
            }

            stack.push(el); // stack
            items = panel.querySelectorAll('[data-role]');

            if ( items ) {
                for (var i = 0; i < items.length; i++) {
                    items[i].addEventListener('click', function(event) {
                        event.preventDefault();

                        var evt = new Event('click'),
                            position = stack[stack.length -1].getAttribute('data-paired'),
                            element = stage.querySelector('[data-position="'+ position +'"]'),
                            previous = element.previousElementSibling,
                            next = element.nextElementSibling;

                        while ( next !== null && next.classList.contains('panel') ) {
                            next = next.nextElementSibling;
                        }

                        switch(event.target.getAttribute('data-role')) {
                            case "close":
                                this.close(panel);
                            break;

                            case "previous":
                                previous.dispatchEvent(evt);
                            break;

                            case "next":
                                next.dispatchEvent(evt);
                            break;
                        }
                    }.bind(this));
                }
            }

            if ( settings.panel.position === "top" || settings.panel.position === "between rows" ) {
                this.seek(el); // disable prev and next when applicable
            }

            imagesLoaded(el, function() {
                return callback.call(el);
            }.bind(el));

            return el;
        },

        /**
         * determine previous and next, disable when applicable
         * @param DOM element '.panel'
         * @return undefined
         *
         */
        seek: function(panel) {
            var position = panel.getAttribute("data-paired"),
                previous =  this.stage.querySelector('[data-position="'+ position +'"]').previousElementSibling,
                next = this.stage.querySelector('[data-position="'+ position +'"]').nextElementSibling;

            while( next !== null && !next.classList.contains('item') ) {
                next = next.nextElementSibling;
            }

            if ( next === null || next.classList.contains('on') ) {
                var element = panel.querySelector('[data-role="next"]');
                element && element.classList.add('disabled');
            }

            if ( previous === null || previous.classList.contains('on') || !previous.classList.contains('item') ) {
                var element = panel.querySelector('[data-role="previous"]');
                element && element.classList.add('disabled');
            }
        },

        /**
         * @param DOM element: '.item'
         * @param callback fn
         * @return undefined, or callback on animation ends
         *
         */
        open: function(element, callback) {
            var settings = this.settings,
                stack = this.stack;

            on.call(element);

            var ready = function() {
                var panel = this.prepare(element, function() {
                    var options = { opacity: 1 };

                    if ( settings.panel.position === "top" || settings.panel.position === "between rows" ) {
                        options.height = this.querySelector('.-inner').offsetHeight;
                    }

                    if ( settings.panel.position === "top" ) {
                        scroll(this, settings.scroll); // start scroll before animation
                    }

                    Velocity(this, options, settings.panel.speed, settings.panel.easing, function() {
                        this.style.height = "auto"; // release height

                        if ( settings.panel.position === "between rows" ) {
                            scroll(element, settings.scroll); // scroll after panel has opened
                        }

                        settings.onAfter("open", this); // callback fn
                        return callback && callback();
                    }.bind(this));
                });

                settings.onBefore("open", panel); // callback fn
            }.bind(this);

            if ( stack.length && settings.panel.position !== "top" ) {
                this.close(stack[stack.length -1], function() {
                    ready();
                });
                return;
            }
            return ready();
        },

        /**
         * @param DOM element '.panel'
         * @param callback fn
         * @return undefined, or callback on animation ends
         *
         */
        close: function(element, callback) {
            var settings = this.settings,
                stage = this.stage,
                stack = this.stack;

            if ( element === undefined ) {
                return;
            }

            Velocity(element, { opacity: 0, height: 0 }, settings.panel.speed, settings.panel.easing, function() {
                off.call(stage, element.getAttribute("data-paired"));
                element.parentNode && element.parentNode.removeChild(element); // remove
                stack.pop();

                settings.onAfter("close", element); // callback fn
                return callback && callback();
            });

            settings.onBefore("close", element); // callback fn
        },

        /**
         * reset
         * @return undefined
         *
         */
        reset: function() {
            var stage = this.stage,
                stack = this.stack;

            if ( stack.length ) {
                // remove matched elements from the dom
                stack.forEach(function(element) {
                    element.parentNode.removeChild(element);
                });
                this.stack = []; // reset array
                reset.call(stage);
            }
        }
    }

    /**
     * constructor
     * @param DOM element
     * @param {Object} options
     * @return undefined
     *
     */
    function Panels(stage, options) {
        var settings = extend(defaults, options || {});

        var _ = Object.create(panels, {
            settings: { value: settings },
            stage: { value: stage },
            stack: { value: [], writable: true }
        });
        _.init();

        // alias: public method
        this.open = function(element, callback) {
            panels.open.call(_, element, callback);
        }

        // alias: public method
        this.close = function(element, callback) {
            panels.close.call(_, element, callback);
        }
    };

    return Panels;
}());