;(function($) {

    $.fn.extend({
        Progress: function(options) {
            if (options && typeof(options) == 'object') {
                options = $.extend({}, $.Progress.defaults, options);
            }

            this.each(function() {
                new $.Progress(this, options);
            });

            return;
        }
    });

    $.stream = {
        iterations: 0,
        maxValue: null,
        stream: null
    };

    $.messages = {
        couldNotEstablishConnection: '[jQuery.Progress] Error: could not establish the connection.',
        urlIsMissing: '[jQuery.Progress] Error: you must provide a string named "url" as an option that contains the URL to fetch.',
        sseNotSupported: '[jQuery.Progress] Error: SSE is not supported.',
        notAnInteger: function(data) {
            return '[jQuery.Progress] Error: the server must send back any positive integer (we received: "' + data + '"). Closing the connection.';
        },
        noDataReceived: '[jQuery.Progress] Error: no data was received from the server. Are you sure the server-side output starts with "data:"?',
    };

    $.Progress = function(elem, option) {

        var options  = option || $.Progress.defaults
            , isInit = $.Progress.init(options)
            , close;

        if(isInit === true) {
            $.stream.stream = $.Progress.connect(options);

            if(typeof($.stream.stream) === 'object') {

                $.Progress.cssTransition(elem, false);       

                $.stream.stream.onmessage = function(e) {

                    if(e.data === null) {
                        console.error($.messages.noDataReceived);
                    }

                    if($.stream.iterations == $.stream.maxValue) {

                        $.Progress.grow(elem, options, e.data, function() {
                            $.Progress.finish(elem, options);
                            close = $.Progress.close();
                            // $.Progress.cssTransition(elem, true);
                        });

                    } else {

                        $.Progress.grow(elem, options, e.data);

                    }

                    $.stream.iterations++;

                };

            } else {
                console.error($.messages.couldNotEstablishConnection);
            }

        } else {
            console.error(isInit);
        }

        return;
    };

    /**
     *
     * @param options
     * @returns {boolean|string}
     */
    $.Progress.init = function(options) {

        if(!options.url || typeof(options.url) != 'string') {
            return $.messages.urlIsMissing;
        }

        return true;
    };

    /**
     *
     * @param options
     * @returns {*}
     */
    $.Progress.connect = function(options) {

        if(typeof(EventSource) === 'undefined') {

            console.error($.messages.sseNotSupported);
            return false;

        }

        return new EventSource(options.url);
    };

    /**
     *
     * @param elem
     * @param options
     * @param data
     * @param callback
     */
    $.Progress.grow = function(elem, options, data, callback) {

        if(parseInt(data) != data) {

            console.error($.messages.notAnInteger(data));
            $.Progress.close();
            return;

        }

        if($.stream.iterations == 0) {
            $.stream.maxValue = data;
        } else {

            options.getData({i: data, total: $.stream.maxValue});
            var percent = Math.round(data / $.stream.maxValue * 100) + '%';
            
            if(options.percentSelector && typeof(options.percentSelector) == 'string') {
                $(options.percentSelector).text(percent);
            }

            $(elem).animate({
                width: percent
            }, options.animationDuration, function() {
                if(callback && typeof(callback) == 'function') callback();

            });

        }
    };


    /**
     *
     * @returns {boolean}
     */
    $.Progress.close = function() {

        if($.stream.stream) {

            $.stream.stream.close();
            return true

        }

        return false;
    };

    /**
     *
     * @param elem
     * @param options
     */
    $.Progress.finish = function(elem, options) {
        $(elem).addClass(options.classes.success);
    };

    $.Progress.cssTransition = function(elem, isActive) {

        var value = (isActive ? 'width 0.6s ease' : 'none');
        $(elem).css({
            '-webkit-transition': value,
            '-o-transition': value,
            'transition': value
        });

    };

    /**
     *
     * @type {{animationDuration: number, classes: {success: string, error: string, pending: string}}}
     */
    $.Progress.defaults = {
        animationDuration: 1000,
        debug: false,
        classes: {
            success: 'progress-bar-success',
            error: 'progress-bar-error',
            pending: 'progress-bar-pending'
        },
        getData: function(data) {
            return data;
        }
    };


})(jQuery);
