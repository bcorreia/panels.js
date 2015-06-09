/**
 * panels.js - version 1.7.0
 *
 * https://github.com/bcorreia/panels.js.git
 * Bruno Correia - mail@bcorreia.com
 *
 */
var Panels = (function() {
    'use strict';

    window.Velocity = window.Velocity || $.fn.velocity;
    window.imagesLoaded = window.imagesLoaded || function(arg, callback) { return callback() };

    /**
     * vars: stack, stage and panel
     * @private
     * @type {Object}
     *
     */
    var stack = [],
        stage = {},
        panel = {};

    /**
     * settings: defaults
     * @private
     * @type {Object}
     *
     */
    var settings = {
        defaults: {
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
    };

    /**
     * helper
     * deep extend: merge defaults with options
     * @private
     * @param {Object} default settings
     * @param {Object} options
     * @returns {Object} merged values of default settings and options
     *
     */
    var extend = function(objects) {
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
    };

    /**
     * helper
     * body scroll
     * @type {Object}
     *
     */
    var scroll = function(element, settings) {
        if ( element !== undefined ) {
            Velocity(document.body, 'scroll', {
                duration: settings.speed,
                easing: settings.easing,
                offset: element.getBoundingClientRect().top + window.scrollY - settings.offset
            });
        }
    };

    /**
     * stage.on
     * add class .on
     * @param ø
     * @return class name(s)
     *
     */
    stage.on = function() {
        return this.classList.add('on');
    };

    /**
     * stage.off
     * remove class .on
     * @param ø
     * @return class name(s)
     *
     */
    stage.off = function() {
        return stage.wrapper.querySelector('[data-position="'+ this +'"]').classList.remove('on');
    };

    /**
     * stage.reset
     * remove class .on from all elements
     * @param ø
     * @return empty []
     *
     */
    stage.reset = function() {
        var elements = stage.wrapper.querySelectorAll('.item.on');
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('on');
        };
        return [];
    };

    /**
     * panel.prepare
     * @param {Object} element
     * @param {Object} callback function
     * @return undefined
     *
     */
    panel.prepare = function(element, callback) {
        var template,
            content = document.createElement('div'),
            position = element.getAttribute('data-position');

        content.className = 'panel ' + settings.panel.classes;
        content.setAttribute('data-paired', position);

        // handlebars
        if ( settings.handlebars ) {
            template = Handlebars.compile(document.querySelector('[data-role="panel"]').innerHTML);
            content.innerHTML = template(settings.context.items[position]);
            return this.insert.call(content, element, callback);
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

            xhr.open('get', settings.url + "?" + query, true);
            xhr.send();
            xhr.onload = function() {
                content.innerHTML = xhr.response;
                return this.insert.call(content, element, callback);
            }.bind(this);
        }
    };

    /**
     * panel.insert
     * insert element to document
     * @param {Object} element
     * @param {Object} callback function
     * @return {Object} element
     *
     */
    panel.insert = function(element, callback) {
        var html, placement,
            properties = 'opacity:0; height:0';

        // wrap -inner
        this.innerHTML = '<div class="-inner">' + this.innerHTML + '</div>';

        switch ( settings.panel.position ) {
            case "between rows":
                this.style.cssText = properties;
                placement = panel.placement.call(element);
                html = placement.parentNode.insertBefore(this, placement.nextSibling);
                // referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); insertAfter
            break;

            case "top":
                this.style.cssText = properties;
                html = stage.wrapper.insertBefore(this, stage.wrapper.firstChild);
                // stage.wrapper.insertAdjacentHTML('afterbegin', this.outerHTML) prepend
            break;

            default: // custom
                html = document.body.insertBefore(this, settings.panel.position);
                // stage.wrapper.insertAdjacentHTML('afterbegin', this.outerHTML) prepend
        }

        stack.push(html); // stack
        panel.listeners(html); // add event listener

        if ( settings.panel.position === "top" || settings.panel.position === "between rows" ) {
            panel.seek.call(html); // disable prev and next when applicable
        }

        imagesLoaded(html, function() {
            return callback.call(html);
        }.bind(html));

        // returns element
        return html;
    };

    /**
     * panel.placement
     * find last element on the same row
     * @param ø
     * @return {Object} element
     *
     */
    panel.placement = function() {
        var top = this.getBoundingClientRect().top,
            next = this.nextElementSibling;

        if ( !next.classList.contains('item') ) {
            return this;
        }

        // recursive calls
        return (next.getBoundingClientRect().top === top) ? panel.placement.call(next) : this;
    };

    /**
     * panel.events
     * add event listeners
     * @param ø
     * @return undefined
     *
     */
    panel.listeners = function(html) {
        var elements = html.querySelectorAll('[data-role]');

        if ( elements === null ) {
            return;
        }

        for (var i = 0; i < elements.length ; i++) {
            elements[i].addEventListener('click', function(event) {
                event.preventDefault();

                var event = new Event('click'),
                    position = stack[stack.length -1].getAttribute('data-paired'),
                    element = stage.wrapper.querySelector('[data-position="'+ position +'"]'),
                    previous = element.previousElementSibling,
                    next = element.nextElementSibling;

                while ( next !== null && next.classList.contains('panel') ) {
                    next = next.nextElementSibling;
                }

                switch(this.getAttribute('data-role')) {
                    case "close":
                        Panels.prototype.close(html);
                    break;

                    case "previous":
                        previous.dispatchEvent(event);
                    break;

                    case "next":
                        next.dispatchEvent(event);
                    break;
                }
            });
        };
    };

    /**
     * panel.route
     * @param {Object} function
     * @return callback function
     *
     */
    panel.route = function(callback) {
        if ( !stack.length || (settings.panel.stackable && settings.panel.position === "top") ) {
            return callback();
        }

        // !stackable: close before insert
        if ( stack.length ) {
            var element = stack[stack.length -1];
        }

        Panels.prototype.close(element, function() {
            return callback();
        });
    };

    /**
     * panel.reset
     * @param ø
     * @return undefined
     *
     */
    panel.reset = function() {
        if ( stack.length ) {
            // remove matched elements from the DOM
            stack.forEach(function(element) {
                element.parentNode.removeChild(element); // remove
            });
            stack = []; // reset array
            stage.reset(); // update stage
        }
    };

    /**
     * panel.seek
     * determine previous and next, disable when applicable
     * @param ø
     * @return undefined
     *
     */
    panel.seek = function() {
        var position = this.getAttribute("data-paired"),
            previous =  stage.wrapper.querySelector('[data-position="'+ position +'"]').previousElementSibling,
            next = stage.wrapper.querySelector('[data-position="'+ position +'"]').nextElementSibling;

        while( next !== null && !next.classList.contains('item') ) {
            next = next.nextElementSibling;
        }

        if ( next === null || next.classList.contains('on') ) {
            var element = this.querySelector('[data-role="next"]');
            element && element.classList.add('disabled');
        }

        if ( previous === null || previous.classList.contains('on') || !previous.classList.contains('item') ) {
            var element = this.querySelector('[data-role="previous"]');
            element && element.classList.add('disabled');
        }
    };

    /**
     * Panels: constructor
     * @param {Object} element
     * @param {Object} options
     * @return undefined
     *
     */
    function Panels(element, options) {
        settings = extend(settings.defaults, options || {});

        var event = new Event('init');
        document.addEventListener('init', function() {
            settings.onInit(); // callback fn
        });

        // compile stage template
        if ( settings.handlebars ) {
            var template = Handlebars.compile(document.querySelector('[data-role="stage"]').innerHTML),
                html = template(settings.context);
        }

        // prepend html, set opacity, animate if stage.fade
        if ( settings.stage.fade ) {
            html && element.insertAdjacentHTML('afterbegin', html);
            element.style.opacity = 0;
            imagesLoaded(element, function() {
                document.dispatchEvent(event);
                Velocity(element, { opacity: 1 }, settings.stage.speed, function() {
                    element.removeAttribute('style');
                });
            });
        } else {
            element.insertAdjacentHTML('afterbegin', html);
            document.dispatchEvent(event);
        }

        // set: cache
        stage.items = element.querySelectorAll('.item');
        stage.wrapper = element;

        // enumerate: add data-position attribute elements (pair/position)
        // add click event
        for (var i = 0; i < stage.items.length; i++) {
            stage.items[i].setAttribute('data-position', i);
            stage.items[i].addEventListener('click', function(event) {
                event.preventDefault();
                this.classList.contains('on') || Panels.prototype.open(this);
            }, false);
        };

        return;
    };

    Panels.prototype = {
        constructor: Panels,

        /**
         * open
         * @public
         * @param: {Object} element
         * @return undefined, or callback on animation ends
         *
         */
        open: function(element, callback) {
            stage.on.call(element);

            panel.route(function() {
                var html = panel.prepare(element, function() {
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

                        // callback fn
                        settings.onAfter("open", this);
                        return callback && callback();
                    }.bind(this));
                });

                // callback fn
                settings.onBefore("open", html);
            });
        },

        /**
         * close
         * @param: {Object} panel element
         * @param: {Object} function
         * @return undefined, or callback on animation ends
         *
         */
        close: function(element, callback) {
            var options = { opacity: 0, height: 0 };

            if ( element === undefined ) {
                return;
            }

            Velocity(element, options, settings.panel.speed, settings.panel.easing, function() {
                stage.off.call(element.getAttribute("data-paired")); // update stage
                element.parentNode && element.parentNode.removeChild(element); // remove
                stack.pop();

                // callback fn
                settings.onAfter("close", element);
                return callback && callback();
            });

            // callback fn
            settings.onBefore("close", element);
        }

    }

    window.addEventListener('resize', function() {
        return (settings.panel.position === "between rows" && !navigator.userAgent.match(/Mobi/) ) && panel.reset();
    }, true);

    return Panels;
}());