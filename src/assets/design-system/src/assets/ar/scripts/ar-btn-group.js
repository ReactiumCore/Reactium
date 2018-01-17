(function ($) {
    $.fn.fBtnGroup = function() {

        if (typeof arguments[0] === 'string') {
            let elm = $(this);
            let group = elm[0].__fBtnGroup;

            switch(arguments[0]) {
                case 'select':

                    let sel    = arguments[1];
                    sel        = (Array.isArray(arguments[1])) ? arguments[1].join(',') : sel;

                    $(this).data('selected', sel);

                    let sels = sel.split(',');

                    group.elements.each(function () {
                        let s = $(this).val();
                        if (sels.indexOf(s) > -1) {
                            $(this).attr('checked', true);
                            $(this).parent().addClass('checked');
                        } else {
                            $(this).removeAttr('checked');
                            $(this).parent().removeClass('checked');
                        }
                    });

                    elm.trigger('select');
                    break;
            }

            return $(this);
        }

        const on = {
            change: function () {
                let group    = $(this).data('btn-group');
                let elms     = group[0].__fBtnGroup.elements;

                let sel = [];

                elms.each(function () {
                    let act = ($(this).is(':checked') === true) ? 'addClass' : 'removeClass';
                    $(this).parent()[act]('checked');

                    if (act === 'addClass') {
                        sel.push($(this).val());
                    }
                });

                group.data('selected', sel.join(','));
                group.trigger('select');
            }
        };

        const def    = $.extend({target: 'input', selected: 'left', elements: []}, arguments[0]);
        let props    = $.extend({}, def);

        return $(this).each(function () {
            let opts            = {};
            let group           = $(this);
            let d               = group.data();

            for (let p in def) { opts[p] = (d.hasOwnProperty(p)) ? d[p] : props[p]; }

            let elms                = group.find(opts.target);
            opts['elements']        = elms;

            group[0].__fBtnGroup    = opts;

            elms.each(function () { $(this).data('btn-group', group); });

            elms.on('change', on.change);

            $(this).fBtnGroup('select', opts.selected);
        });
    };

    $('[data-btn-group]').fBtnGroup();
}(jQuery));
