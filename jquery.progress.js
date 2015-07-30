;(function($) {

    $.stream = {
        iterations: 0,
        maxValue: null,
        stream: null
    };

    $.fn.extend({
        Progress: function(options, arg) {
            if (options && typeof(options) == 'object') {
                options = $.extend({}, $.Progress.defaults, options);
            }

            this.each(function() {
                new $.Progress(this, options, arg );
            });

            return;
        }
    });


    $.Progress = function(elem, option, arg) {
        var options  = option || $.Progress.defaults
            , isInit = $.Progress.init(options)
            , close;

        if(isInit === true) {
            $.stream.stream = $.Progress.connect(options);

            $.stream.stream.onmessage = function(e) {


                if($.stream.iterations == $.stream.maxValue) {
                    $.Progress.grow(elem, options, e.data, function() {
                        $.Progress.finish(elem, options);
                        close = $.Progress.close();
                    });
                } else {
                    $.Progress.grow(elem, options, e.data);
                }

                $.stream.iterations++;
            };
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
        if(!options.url || typeof(options.url) != 'string')
            return 'jQuery.Progress Error: you must provide a string named "url" as an option that contains the URL to fetch.';

        return true;
    };

    /**
     *
     * @param options
     * @returns {*}
     */
    $.Progress.connect = function(options) {
        if(typeof(EventSource) === 'undefined') {
            console.error('jQuery.Progress Error: SSE is not supported.');
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
        if($.stream.iterations == 0) {
            $.stream.maxValue = data;
        } else {
            var percent = Math.round(data / $.stream.maxValue * 100) + '%';
            if(options.percentSelector && typeof(options.percentSelector) == 'string') {
                $(options.percentSelector).text(percent);
            }
            $(elem).animate({
                width: percent
            }, options.animationDuration, callback);
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

    /**
     *
     * @type {{animationDuration: number, classes: {success: string, error: string, pending: string}}}
     */
    $.Progress.defaults = {
        animationDuration: 1000,
        classes: {
            success: 'progress-bar-success',
            error: 'progress-bar-error',
            pending: 'progress-bar-pending'
        }
    };


})(jQuery);
