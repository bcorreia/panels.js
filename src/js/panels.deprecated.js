(function($) {
    'use strict';

    /**
     * $.prototype.panels
     * @param {Object} options
     * @return {Object} pub
     *
     */
    $.fn.panels = function(options) {
        var settings = $.extend(true, {}, $.fn.panels.settings, options),
            panels = $(this),
            stack = [],
            stage = { template: $('[data-role="stage"]').html() },
            panel = { template:  $('[data-role="panel"]').html() },
            pub = {};

        if ( settings.handlebars ) {
            // compile stage-template
            var template = Handlebars.compile(stage.template),
                html = template(settings.context);
        }

        // prepend html to the beginning of matched element
        // set opacity, then animate if stage.fade is true
        if ( settings.stage.fade ) {
            panels.prepend(html).css({ opacity: 0 }).imagesLoaded(function() {
                panels.velocity({ opacity: 1 }, settings.stage.speed, function() {
                    panels.removeAttr('style');
                });
            });
        } else {
            panels.prepend(html);
        }

        // cache items
        var items = panels.children(".item");

        // enumerate: add data-position attribute to children elements (pair)
        $.each(items, function(index, element) {
             $(element).attr("data-position", index);
        });

        // callback fn
        // called after stage template has been compiled
        settings.onInit();

        /**
         * panel.prepare
         * @param {Object} element
         * @param {Object} callback function
         * @return undefined
         *
         */
        panel.prepare = function(element, callback) {
            var template,
                position = $(element).data("position"),
                queryObject = { url: settings.url, data: { n: position } },
                content = $("<div />", { class: "panel " + settings.panel.classes, "data-paired": position });

            // handlebars
            if ( settings.handlebars ) {
                template = Handlebars.compile(this.template);
                content.html(template(settings.context.items[position]));
                return this.add.call(content, position, element, callback);
            }
            // !handlebars
            else {
                var query = element.data("query");
                if ( query ) {
                    query = $.param(query);
                    queryObject = { url: settings.url + "?" + query, data: { n: position } };
                }
                $.ajax(queryObject)
                .done(function(data) {
                    content.html(data);
                    return this.add.call(content, position, element, callback);
                }.bind(this));
            }
        };

        /**
         * panel.add
         * prepend/insert element to document
         * @param {Object} element
         * @param {Object} callback function
         * @return {Object} element
         *
         */
        panel.add = function(position, element, callback) {
            this.wrapInner('<div class="panels-wrapper" />');

            switch ( settings.panel.position ) {
                case "between rows":
                    stack.push(this.insertAfter(panel.position.call(element)).css(
                        { opacity: 0, height: 0 }
                    )); // insertAfter
                break;

                case "over stage":
                    stack.push(this.prependTo(panels).css(
                        { opacity: 0 }
                    )); // prependTo
                break;

                default: // "top"
                    stack.push(this.prependTo(panels).css(
                        { opacity: 0, height: 0 }
                    )); // prependTo
            }

            // disable prev and next when applicable
            panel.seek.call(this, position);

            this.imagesLoaded(function() {
                return callback.call(this);
            }.bind(this));

            // returns element
            return this;
        };

        /**
         * panel.position
         * find last element on the same row
         * @param ø
         * @return {Object} element
         *
         */
        panel.position = function() {
            var top = $(this).offset().top;

            if ( !$(this).next().length ) {
                return $(this);
            }

            // recursive calls
            return ($(this).next().offset().top === top) ? panel.position.call($(this).next()) : $(this);
        };

        /**
         * panel.route
         * @param {Object} function
         * @return callback function
         *
         */
        panel.route = function(callback) {
            // over stage option: cannot stack on this mode
            // hide stage elements before add panel
            if ( settings.panel.position === "over stage" ) {
                items.hide();
                return callback();
            }

            // there aren’t any panels open
            if ( !stack.length ) {
                return callback();
            }

            // stackable
            if ( settings.panel.stackable ) {
                return callback();
            }

            // !stackable: close before add
            pub.close(undefined, function() {
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
                $.each(stack, function(index, val) {
                    val.remove();
                });
                stack = []; // reset array
                stage.reset(); // update stage
            }
        };

        /**
         * panel.seek
         * determine previous and next, disable when applicable
         * @param {Number} n
         * @return undefined
         *
         */
        panel.seek = function(position) {

            var previous =  panels.find('[data-position="'+ position +'"]').prev('.item'),
                next = panels.find('[data-position="'+ position +'"]').nextAll('.item')[0];

            // wrap
            next = $(next);

            if ( !previous.length || previous.hasClass("on") ) {
                this.find('[data-role="previous"]').addClass('disabled');
            }

            if ( !next.length || next.hasClass("on") ) {
                this.find('[data-role="next"]').addClass('disabled');
            }
        };

        /**
         * stage.on
         * add class .on to matched element
         * @param {Object} element
         * @return element
         *
         */
        stage.on = function(element) {
            return $(element).addClass("on");
        };

        /**
         * stage.off
         * remove class .on from matched element
         * @param {Number} n
         * @return element
         *
         */
        stage.off = function(n) {
            return this.pair.call(n).removeClass("on");
        };

        /**
         * stage.reset
         * remove class .on from all matched elements
         * @param ø
         * @return empty [array]
         *
         */
        stage.reset = function() {
            return panels.find(".item.on").removeClass('on');
        };

        /**
         * stage.pair
         * find “paired” stage element
         * @param ø
         * @return element
         *
         */
        stage.pair = function() {
            return panels.find('[data-position="'+ this +'"]');
        };

        /**
         * pub.open
         * @param: {Object} element
         * @return undefined, or callback on animation ends
         *
         */
        pub.open = function(element, callback) {

            // update stage
            stage.on(element);

            // wait for callback
            panel.route(function() {
                var html = panel.prepare(element, function() {
                    var options = { opacity: 1 };

                    if ( settings.panel.position === "top" || settings.panel.position === "between rows" ) {
                        options.height = this.find('> .panels-wrapper').outerHeight();
                    }

                    if ( settings.panel.position === "top" ) {
                        util.scroll(this, settings.scroll); // start scroll before animation
                    }

                    $(this).velocity('stop').velocity(options,
                        settings.panel.speed, settings.panel.easing, function() {

                        // release height
                        $(this).css({ height: "auto" });

                        if ( settings.panel.position === "between rows" ) {
                            util.scroll(element, settings.scroll); // scroll after panel has opened
                        }

                        // callback fn(s)
                        // called after animation ends
                        settings.onAfter("open", html);
                        return callback && callback();
                    });
                });

                // callback fn
                // called before animation starts
                settings.onBefore("open", html);
            });
        };

        /**
         * pub.close
         * @param: {Object} panel element (if undefined, last array item is used)
         * @param: {Object} function
         * @return undefined, or callback on animation ends
         *
         */
        pub.close = function(element, callback) {
            var options = { opacity: 0 };

            if ( settings.panel.position === "top" || settings.panel.position === "between rows" ) {
                options.height = 0;
            }

            element = element || (stack.pop());
            if ( !element ) {
                return;
            }

            element.velocity('stop').velocity(options,
                settings.panel.speed, settings.panel.easing, function() {

                stage.off(element.data("paired")); // update stage
                element.remove(); // remove element from document

                if ( settings.panel.position === "over stage" ) {
                    items.removeAttr("style");
                }

                // callback fn
                // called after animation ends
                settings.onAfter("close", element);
                return callback && callback();
            });

            // callback fn
            // called before animation starts
            settings.onBefore("close", element);
        };

        /**
         * util
         * @type {Object}
         *
         */
        var util = {
            scroll: function(element, settings) {
                var element = $(element);

                if ( element.length ) {
                    $('body').velocity('stop').velocity("scroll", {
                        duration: settings.speed, easing: settings.easing, offset: $(element).offset().top
                    });
                }
            }
        };

        /* helpers
        --------------------------------------------- */
        // return last array item
        Array.prototype.last = function() {
            return this[this.length-1];
        };

        /* handlers
        --------------------------------------------- */
        $(window).on('resize', function() {
            return (settings.panel.position === "between rows" && !navigator.userAgent.match(/Mobi/) ) && panel.reset();
        });

        panels
        .on('click', ".item:not('.on')", function(event) { // open
            event.preventDefault();
            pub.open($(this));
        })
        .on('click', '[data-role="close"]', function(event) { // close
            event.preventDefault();
            pub.close($(this).closest('.panel'));
        })
        .on('click', '[data-role="previous"], [data-role="next"]', function(event) { // seek
            event.preventDefault();
            var direction = $(this).data("role"),
                next = stage.pair.call(stack.last().data("paired")).next().not(".panel");

            switch(direction) {
                case "previous":
                    stage.pair.call(stack.last().data("paired")).prev().trigger("click");
                break;

                case "next":
                    next.length ?
                        next.trigger("click") :
                        stack.last().next().trigger("click");
                break;
            }
        });

        // return public methods
        return pub;
    };

    $.fn.panels.settings = {
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
        onInit: $.noop,
        onBefore: $.noop,
        onAfter: $.noop
    };

})(jQuery);