import _ from 'underscore';

const Utils = {};

/**
 * @api {Function} Reactium.Utils.isWindow(iframeWindow) Utils.isWindow()
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utilities
 * @apiName Utils.isWindow
 * @apiDescription Determine if the window object has been set. Useful when developing for server side rendering.
 * @apiParam {Window} [iframeWindow] iframe window reference.
 * @apiExample Example Usage:
Reactium.Utils.isWindow();
// Returns: true if executed in a browser.
// Returns: false if executed in node (server side rendering).
 */
Utils.isWindow = (iWindow = window) => {
    return typeof iWindow !== 'undefined';
};

/**
 * @api {Function} Reactium.Utils.isElectron(iframeWindow) Utils.isElectron()
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utilities
 * @apiName Utils.isElectron
 * @apiDescription Determine if window is an electron window. Useful for detecting electron usage.
 * @apiParam {Window} [iframeWindow] iframe window reference.
 * @apiExample Example Usage:
Reactium.Utils.isElectron();
// Returns: true if executed in electron.
// Returns: false if executed in node or browser.
 */
Utils.isElectron = (iWindow = window) => {
    return (
        typeof iWindow !== 'undefined' &&
        iWindow.process &&
        iWindow.process.type
    );
};

Utils.BREAKPOINTS_DEFAULT = {
    xs: 640,
    sm: 990,
    md: 1280,
    lg: 1440,
    xl: 1600,
};

/**
 * @api {Function} Reactium.Utils.breakpoints() Utils.breakpoints
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utilities
 * @apiName Utils.breakpoints
 * @apiDescription Get breakpoints from browser body:after psuedo element or `Utils.BREAKPOINTS_DEFAULT` if unset or node.

| Breakpoint | Range |
| ---------- | ------ |
| xs | 0 - 640 |
| sm | 641 - 990 |
| md | 991 - 1280 |
| lg | 1281 - 1440 |
| xl | 1600+ |
 */
Utils.breakpoints = (iWindow = window, iDocument = document) => {
    try {
        const after = iDocument.querySelector('body');
        const content = iWindow
            .getComputedStyle(after, ':after')
            .getPropertyValue('content');
        return JSON.parse(JSON.parse(content));
    } catch (error) {
        return Utils.BREAKPOINTS_DEFAULT;
    }
};

/**
 * @api {Function} Reactium.Utils.breakpoint(width) Utils.breakpoint()
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utilities
 * @apiName Utils.breakpoint
 * @apiDescription Get the breakpoint of a window width.
 * @apiParam {Number} [width=window.innerWidth] Custom width to check. Useful if you have a resize event and want to skip the function from looking up the value again.
Reactium.Utils.breakpoint();
// Returns: the current window.innerWidth breakpoint.

Reactium.Utils.breakpoint(1024);
// Returns: sm
 */
Utils.breakpoint = (width, iWindow = window, iDocument = document) => {
    width = width ? width : Utils.isWindow(iWindow) ? window.innerWidth : null;

    if (!width) {
        return 'sm';
    }

    const breaks = Utils.breakpoints(iWindow, iDocument);
    const keys = Object.keys(breaks);
    const vals = Object.values(breaks);

    const index = _.sortedIndex(vals, width);

    if (index >= keys.length) {
        return keys.pop();
    }
    if (index <= 0) {
        return keys.shift();
    }

    return keys[index];
};

/**
 * @api {Function} Reactium.Utils.abbreviatedNumber(number) Utils.abbreviatedNumber()
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utilities
 * @apiName Utils.abbreviatedNumber
 * @apiDescription Abbreviate a long number to a string.
 * @apiParam {Number} number The number to abbreviate.
 * @apiExample Example Usage:
Reactium.Utils.abbreviatedNumber(5000);
// Returns: 5k

Reactium.Utils.abbreviatedNumber(500000);
// Returns .5m
 */
Utils.abbreviatedNumber = value => {
    if (!value || value === 0) {
        return;
    }

    const suffixes = ['', 'k', 'm', 'b', 't'];

    let newValue = value;

    if (value >= 1000) {
        const suffixNum = Math.floor(('' + value).length / 3);
        let shortValue = '';

        for (let precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat(
                (suffixNum != 0
                    ? value / Math.pow(1000, suffixNum)
                    : value
                ).toPrecision(precision),
            );
            const dotLessShortValue = (shortValue + '').replace(
                /[^a-zA-Z 0-9]+/g,
                '',
            );
            if (dotLessShortValue.length <= 2) {
                break;
            }
        }

        if (shortValue % 1 != 0) {
            shortValue = shortValue.toFixed(1);
        }
        newValue = shortValue + suffixes[suffixNum];

        newValue = String(newValue).replace('0.', '.');
    }

    return newValue;
};

export default Utils;
