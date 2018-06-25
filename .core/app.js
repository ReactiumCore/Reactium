'use strict';

/**
 * -----------------------------------------------------------------------------
 * Includes
 * -----------------------------------------------------------------------------
 */

import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Router from 'reactium-core/components/Router';
import storeCreator from 'reactium-core/storeCreator';

// Placeholder for the bindable elements
const bindPoints = [];

// <Component /> DOM Elements array
const elements = (typeof document !== 'undefined')
    ? Array.prototype.slice.call(document.querySelectorAll('component'))
    : [];

export const getComponents = (elms = []) => {
    let cmps = {};

    // Traverse the Array of bindable elements and require the components for them
    elms.forEach(elm => {

        let req;
        let { type, path } = elm;

        // The path to the component
        path = (!path) ? type : path;

        // Force webpack to include the components we need.
        // The order of this Array is SUPER important.

        // Q: Why?
        // A: As we traverse the array, the first match of the `path` is used as the component.
        //    Keeping this hierarchy insures that user created components
        //    will supercede .core and /toolkit components.
        let paths = [
            () => require(`components/${path}`),
            () => require(`components/${path}/index`),
            () => require(`components/common-ui/${path}`),
            () => require(`components/common-ui/${path}/index`),
            () => require(`toolkit/${path}`),
            () => require(`toolkit/${path}/index`),
            () => require(`reactium-core/components/${path}`),
            () => require(`reactium-core/components/${path}/index`),
            () => require(`reactium-core/components/common-ui/${path}`),
            () => require(`reactium-core/components/common-ui/${paty}/index`),
        ];

        // Aggregate the required components into the `cmps` Object;
        paths.forEach((cmp, i) => {

            // Exit if the component has already been defined
            if (cmps[type]) { return; }

            // Construct the component
            try {

                req = cmp();

                // Check if the component has a .default
                // -> if so: set that as the component constructor
                req = ('default' in req) ? req.default : req;

            } catch (err) {}
        });

        if (req) {
            cmps[type] = req;
        }
    });

    // Output the Components Object
    return cmps;
};

if (elements.length > 0) {

    let types = [];

    let elms = elements.map((elm) => {
        let path = elm.getAttribute('path');
        let type = elm.getAttribute('type');

        types.push(type);

        return { path, type };
    });

    let components = getComponents(elms);

    elements.forEach((elm) => {
        // Get the component type
        let type = elm.getAttribute('type');

        if (!components.hasOwnProperty(type)) {
            return;
        }

        // Get parameters from container element
        let params  = {};
        let exclude = ['type', 'path'];
        Object.entries(elm.attributes).forEach(([key, attr]) => {
            key = String(key).toLowerCase();
            if (exclude.indexOf(key) < 0) { return; }
            params[attr.name] = attr.value;
        });

        // Get the children from the element and pass them to the component
        let children = elm.innerHTML;
        if (children) {
            params['children'] = children;
        }

        // Create the React element and apply parameters
        let cmp = React.createElement(components[type], params);
        bindPoints.push({component: cmp, element: elm});
    });
}

/**
 * -----------------------------------------------------------------------------
 * @function App()
 * @description Scan DOM for <Component> elements and render React components
 * inside of them.
 * -----------------------------------------------------------------------------
 */
export const App = () => {
    require('dependencies').default.init();

    if (typeof document !== 'undefined') {

        // Create the Redux store
        const store = storeCreator();

        // Render the React Components
        if (bindPoints.length > 0) {
            bindPoints.forEach((item) => {
                ReactDOM.render(
                    <Provider store={store}>
                        <Fragment>
                            {item.component}
                        </Fragment>
                    </Provider>,
                    item.element
                );
            });
        }

        // Get the router target DOM Element
        let routerTarget = document.getElementById('router');
        if (routerTarget) { // ensure router DOM Element is on the page

            if ( window && 'ssr' in window && window.ssr ) { // Reactium SSR Mode

                console.log('[Reactium] SSR Mode: Hydrating Reactium.');

                // Hydrate the Routed component
                ReactDOM.hydrate(
                    <Provider store={store}>
                        <Fragment>
                            <Router />
                        </Fragment>
                    </Provider>,
                    routerTarget
                );
            } else { // Reactium FE Mode

                console.log('[Reactium] FE Mode: Binding Reactium.');

                // Bind the Routed component
                ReactDOM.render(
                    <Provider store={store}>
                        <Fragment>
                            <Router />
                        </Fragment>
                    </Provider>,
                    routerTarget
                );
            }
        }
    }
};
