'use strict';

const _ = require('underscore');

/**
 * Constructor
 * @namespace
 */
const search = {};

search.keyup = function () {
    $('.f-menu-container [data-search]').submit();
};

search.submit = function (e) {
        e.preventDefault();

        let menu = $('.f-menu')[0].__menu;
        let elms = $($(this).data('search'));
        if (elms.length < 1) {
            return;
        }

        let d = $(this).serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            menu.collapse.init();

            return obj;
        }, {});


        if (d.find.length < 1) {
            elms.show();
            menu.collapse.init();
            return;
        }
        else {
            elms.hide();
        }

        let f = String(d.find).toLowerCase();
        elms.each(function () {
            let tags    = String($(this).data('tags'));
            let reg     = new RegExp(f, 'gi');
            let matches = tags.match(reg) || [];
            if (matches.length > 0) {
                $(this).show();
                if ($(this).attr('role') === 'listitem') {
                    $(this).attr('aria-expanded', true);
                }
            }
        });
    };

search.initListeners = () => {
    $(document).on('input', '.f-menu-container [data-search] input', search.keyup);
    $(document).on('submit', '[data-search]', search.submit);
    return search;
};

/**
 * Page load listener
 */
$(function () {
    search.initListeners();
});

module.exports = search;
