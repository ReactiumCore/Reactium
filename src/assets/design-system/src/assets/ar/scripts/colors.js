'use strict';

/**
 * Constructor
 * @namespace
 */
const colors = {};

colors.init = (elms) => {
    elms = elms || $('.color-grid-item');

    elms.each(function () {
        let after     = window.getComputedStyle(this, ':after');
        let before    = window.getComputedStyle(this, ':before');
        let color     = String(after.content).replace(/['"]+/g, '');
        let name      = String(before.content).replace(/['"]+/g, '');
        let html      = `<span>${name}</span><span>${color}</span>`;
        let tags      = [color, color.replace(/\#/g, '')];
        let narray    = name.split('-');

        if (narray.length < 1) {
            narray = [name];
        }

        for (let i = 0; i < narray.length; i++) {
            tags.push(narray[i]);
        }

        $(this).data('tags', tags.join(' '));
        $(this).addClass('clear-content');
        $(this).html(html);
    });
};

/**
 * Page load listener
 */
document.addEventListener("DOMContentLoaded", function () {
    colors.init();
});

/**
 * -----------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------
 */
module.exports = colors;
