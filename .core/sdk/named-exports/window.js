import { Context } from 'reactium-core/components/WindowProvider';
import { useContext, useEffect, useState, useRef } from 'react';
import SDK, { breakpoints, isWindow } from '@atomic-reactor/reactium-sdk-core';
import _ from 'underscore';
import op from 'object-path';

const { Utils } = SDK;

/**
 * @api {ReactHook} useWindow() useWindow()
 * @apiDescription React hook which resolves to the browser or electron window
 when run in normal context or in the Reactium toolkit. Otherwise will return `undefined`.
 This is important particularly when you need to inspect the window inside the `react-frame-component` (`FrameContextConsumer`)
 which sandboxes your component withing the toolkit.
 Your component will automatically be rendered inside the WindowProvider, which will provide the correct `window` and `document`
 objects. See `useWindowSize()` for the most important use case.
 @apiExample BrowserComponent.js
import Reactium, { useWindow } from 'reactium-core/sdk';
import React, { useEffect } from 'react';
import op from 'object-path';

export default () => {
    const window = useWindow();
    const [width, setWidth] = op.get(window, 'innerWidth', 1);

    useEffect(() => {
        const isBrowser = Reactium.Utils.isWindow(window);
        const updateWidth = () => setWidth(window.innerWidth);

        // safe for server-side rendering, which has no window
        // when used in toolkit Frame, will use correct window object
        if (isBrowser) {
            window.addEventListener('resize', updateWidth)
            return () => window.removeEventListener('resize', updateWidth);
        }
    }, []);
};

 // import WindowProvider from 'reactium-core/components/WindowProvider';

 * @apiName useWindow
 * @apiGroup ReactHook
 *
 */
export const useWindow = () => {
    const { iWindow } = useContext(Context);
    return iWindow;
};

/**
 * @api {ReactHook} useDocument() useDocument()
 * @apiDescription Serves same use-case as `useWindow()`, but provides context aware `document` object or `undefined`, that can be
 used normally as well as in the `react-frame-component` within the toolkit.
 * @apiName useDocument
 * @apiGroup ReactHook
 */
export const useDocument = () => {
    const { iDocument } = useContext(Context);
    return iDocument;
};

/**
 * @api {ReactHook} useBreakpoints() useBreakpoints()
 * @apiDescription Provides an object describing the maximum width for each breakpoint used in the Reactium grid styles.
 When using the out of the box scss styles in Reactium, a grid system is in place, and is defined by an
 overridable sass map `$breakpoints-max`, defined by default as:

 ```
 $breakpoints-max: ('xs': 640, 'sm': 990, 'md': 1280, 'lg': 1440,'xl': 1600) !default;
 ```

 These breakpoint maximums are automatically encoded and added to the stylesheet as `:after` psuedo-element `content` property, which can
 be loaded in the browser and used for in browser responsive behavior. Potentially, this can mean only having to manage your
 responsive breakpoints in one place (the stylesheet).
 * @apiName useBreakpoints
 * @apiGroup ReactHook
 *
 */
export const useBreakpoints = () => {
    const iWindow = useWindow();
    const iDocument = useDocument();
    return breakpoints(iWindow, iDocument);
};

/**
 * @api {ReactHook} useBreakpoint(width) useBreakpoint()
 * @apiDescription Returns string representing the breakpoint size for a given width.

 When using the out of the box scss styles in Reactium, a grid system is in place, and is defined by an
 overridable sass map `$breakpoints-max`, defined by default as:

 ```
 $breakpoints-max: ('xs': 640, 'sm': 990, 'md': 1280, 'lg': 1440,'xl': 1600) !default;
 ```
 * @apiParam {Number} width the width to check the breakpoint for. Example for the default `$breakpoints-max`
 providing a width of 640 or less will return `xs`, 990 or less will return `sm` and so on.
 * @apiName useBreakpoint
 * @apiGroup ReactHook
 */
export const useBreakpoint = width => {
    const iWindow = useWindow();
    const iDocument = useDocument();

    return breakpoint(width, iWindow, iDocument);
};

/**
 * @api {ReactHook} useWindowSize(params) useWindowSize()
 * @apiDescription Returns window `innerWidth` number, `innerHeight` number, and current `breakpoint`, and updates on window resizes.
 When using the out of the box scss styles in Reactium, a grid system is in place, and is defined by an
 overridable sass map `$breakpoints-max`, defined by default as:

 ```
 $breakpoints-max: ('xs': 640, 'sm': 990, 'md': 1280, 'lg': 1440,'xl': 1600) !default;
 ```
 * @apiParam {Object} [params] `defaultWidth`, `defaultHeight`, and debounce `delay` properties.
 * @apiParam {Number} [params.defaultWidth=1] Default width returned by the hook when window object is `undefined`.
 * @apiParam {Number} [params.defaultHeight=1] Default height returned by the hook when window object is `undefined`.
 * @apiParam {Number} [params.delay=0] Debounce delay to throttle many window resize events, to prevent unnecessary rerenders of
 your component using this hook.
 * @apiName useWindowSize
 * @apiGroup ReactHook
 * @apiExample ResponsiveComponent.js
 import React from 'react';
 import { useWindowSize } from 'reactium-core/sdk';

 const Mobile = () => {
    return (
        <div>I'm a mobile component</div>
    );
 }

 const Tablet = () => {
    return (
        <div>I'm a tablet component</div>
    );
 }

 const Desktop = () => {
    return (
        <div>I'm a desktop component</div>
    );
 }

 export () => {
    const { breakpoint } = useWindowSize();

    switch(breakpoint) {
        case 'xl':
        case 'lg':
        return <Desktop />;

        case 'md':
        return <Tablet />;

        case 'xs':
        case 'sm':
        default:
        return <Mobile />;
    }
 };
 *
 */
export const useWindowSize = (params = {}) => {
    const iWin = useWindow();
    const iDoc = useWindow();
    const hasWindow = isWindow(iWin);

    let { defaultWidth = 1, defaultHeight = 1, delay = 0 } = params;

    const getSize = () => {
        return hasWindow
            ? {
                  width: iWin.innerWidth,
                  height: iWin.innerHeight,
                  breakpoint: breakpoint(iWin.innerWidth, iWin, iDoc),
              }
            : {
                  width: defaultWidth,
                  height: defaultHeight,
                  breakpoint: breakpoint(defaultWidth),
              };
    };

    const sizeRef = useRef(getSize());
    const [, update] = useState(sizeRef.current);

    const setWindowSize = _.debounce(() => {
        sizeRef.current = { ...sizeRef.current, ...getSize() };
        update(sizeRef.current);
    }, delay);

    const setScrollPosition = _.debounce(() => {
        sizeRef.current = {
            ...sizeRef.current,
            scrollX: iWin.scrollX,
            scrollY: iWin.scrollY,
        };

        update(sizeRef.current);
    }, delay);

    useEffect(() => {
        if (!hasWindow) {
            return;
        }

        iWin.addEventListener('resize', setWindowSize);
        iWin.addEventListener('scroll', setScrollPosition);

        return () => {
            iWin.removeEventListener('resize', setWindowSize);
            iWin.removeEventListener('scroll', setScrollPosition);
        };
    }, [delay, defaultWidth, defaultHeight]);

    return sizeRef.current;
};
