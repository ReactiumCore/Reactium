'use strict';

const _          = require('underscore');
const config     = require('../../../data/toolkit.json');
const slugify    = require('slugify');

/**
 * -----------------------------------------------------------------------------
 * Constructor
 * -----------------------------------------------------------------------------
 */
const menu = {collapse: {}, settings: {on: {}}};
const prefix    = slugify(config.name.toLowerCase());

menu.toggle = () => {
	$('.f-menu-container').toggleClass('active');
};

menu.click = (e) => {
	e.preventDefault();

	let trg = $(e.currentTarget);
		trg.parents().find('.f-navbar-control').removeClass('active');
		trg.addClass('active');

	// Do search
	let fnd = $('.f-menu-container [data-search] input');
	let arr = fnd.val().split(' ');
	arr = _.without(arr, 'atom', 'molecule', 'organism', 'catalyst', 'templates', 'page');
	arr.push(trg.data('find'));

	arr = _.uniq(arr);
	let str = arr.join(' ');
	str = str.trim();

	fnd.val(str);

	$('.f-menu-container [data-search]').submit();
};

menu.change = () => {
    let url = window.location.href.split('/').pop();


    // Clear any .f-active classes
    $('.f-active').removeClass('f-active');


    // Find .f-menu a elements
    let active = [];
    $('.f-menu a').each(function () {
        let href = $(this).attr('href');
        if (url === href) {
            $(this).addClass('f-active');
            active = $(this);
        }
    });


    // Scroll the menu
    if (active.length > 0) {
        let m = $('.f-menu > ul');
        $(m).animate({
            scrollTop: active.offset().top
        });
    }


    // Scroll the page
    if (window.location.hash) {
        let elm = $(window.location.hash);
        if (elm.length > 0) {
            $('html,body').animate({
                scrollTop: elm.offset().top - 170
            }, 0);
        }
    }
};

menu.mouseover = () => {
    let body = $('body');
        body.addClass('f-menu-open');
};

menu.mouseout = () => {
    let body = $('body');
        body.removeClass('f-menu-open');
};

menu.collapse.add = (id) => {
    let exp       = window.localStorage.getItem(prefix + '-collapsed');
    exp           = (exp) ? JSON.parse(exp) : [];
    exp.push(id);
    exp = JSON.stringify(_.uniq(exp));

    window.localStorage.setItem(prefix + '-collapsed', exp);
};

menu.collapse.remove = (id) => {
    let exp       = window.localStorage.getItem(prefix + '-collapsed');
    exp           = (typeof exp !== 'undefined') ? JSON.parse(exp) : [];
    exp           = JSON.stringify(_.without(exp, id));

    window.localStorage.setItem(prefix + '-collapsed', exp);
};

menu.collapse.toggle = (e) => {
    let target    = $(e.currentTarget).parent();
    let id        = target.attr('id');
    let state     = target.attr('aria-expanded');
    state         = Boolean(state === 'true');

    target.attr('aria-expanded', !state);

    if (id) {
        id = '#' + id;
        if (state === true) {
            menu.collapse.add(id);
        } else {
            menu.collapse.remove(id);
        }
    }
};

menu.collapse.init = () => {
    let exp       = window.localStorage.getItem(prefix + '-collapsed');
    exp           = (exp) ? JSON.parse(exp) : [];

    let active = $('.f-menu .f-active').closest('li[role="listitem"]');

    exp.forEach((item) => {
        let target = $(item);
        if (target.attr('id') === active.attr('id')) { return; }
        target.attr('aria-expanded', false);
    });
};

menu.active = () => {
    menu.change();
};

menu.settings.toggle = function () {
    let d         = $(this).data();
    let target    = $(d.fToggleSettings);
    target.slideToggle(250);
};

menu.settings.on.position = (e) => {
    let me     = $(e.currentTarget);
    let sel    = me.data('selected');
    window.localStorage.setItem(prefix+'-menu', sel);
    setTimeout(function () {
        $('#f-menu-container').removeClass('right left').addClass(sel);
        $('.f-branding').removeClass('right left').addClass(sel);
    }, 300);
};

menu.settings.on.fullscreen = (e) => {
    let me     = $(e.currentTarget);
    let sel    = me.data('selected');
    window.localStorage.setItem(prefix+'-fullscreen', sel);

    if (sel === 'on') {
        $('.f-container').addClass('fullscreen');
    } else {
        $('.f-container').removeClass('fullscreen');
    }
};

menu.settings.on.sticky = (e) => {
    let me     = $(e.currentTarget);
    let sel    = me.data('selected');
    window.localStorage.setItem(prefix+'-sticky', sel);

    if (sel === 'on') {
        $('#f-menu-container').addClass('sticky');
    } else {
        $('#f-menu-container').removeClass('sticky');
    }
};

menu.initListeners = () => {
    $(window).on('hashchange', menu.change).trigger('hashchange');
	$(document).on('click', '.f-navbar-control', menu.click);

	$('.f-menu-container').on('mouseover', menu.mouseover);
    $('.f-menu-container').on('mouseout', menu.mouseout);
    $('[data-f-collapse]').on('click', menu.collapse.toggle);
    $('[data-f-toggle-settings]').on('click', menu.settings.toggle);

    $('[data-btn-group="menu"]').on('select', menu.settings.on.position);

    $('[data-btn-group="fullscreen"]').on('select', menu.settings.on.fullscreen);

    $('[data-btn-group="sticky"]').on('select', menu.settings.on.sticky);
};

menu.init = () => {
    if ($('.f-menu')[0].hasOwnProperty('__menu')) { return; }
    $('.f-menu')[0].__menu = menu;
    menu.initListeners();
    menu.collapse.init();
    $('.f-menu').nanoScroller();

    // Show menu on first run
    let firstRun = window.localStorage.getItem(prefix+'-init');
    if (!firstRun) {
        window.localStorage.setItem(prefix+'-init', true);

        $('#f-menu-container').addClass('active');
        setTimeout(function () {
            $('#f-menu-container').removeClass('active');
        }, 1000);
    }

    // Set menu position: left/right
    let menuPos = window.localStorage.getItem(prefix+'-menu') || config.menu;
    if (menuPos) { $('[data-btn-group="menu"]').fBtnGroup('select', menuPos); }

    // Fullscreen: on/off
    let fullscreen = window.localStorage.getItem(prefix+'-fullscreen') || config.fullscreen;
    if (fullscreen) { $('[data-btn-group="fullscreen"]').fBtnGroup('select', fullscreen); }

    // Sticky: on/off
    let sticky = window.localStorage.getItem(prefix+'-sticky') || config.sticky;
    if (sticky) { $('[data-btn-group="sticky"]').fBtnGroup('select', sticky); }
};

$(function() {
    menu.init();
});


/**
 * -----------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------
 */
module.exports = menu;
