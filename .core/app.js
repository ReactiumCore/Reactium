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

let bindPoints        = [];
const elements        = typeof document !== 'undefined' ? Array.prototype.slice.call(document.querySelectorAll('component')) : [];

export const getComponents = (types) => {
    let cmps = {};

    types = (typeof types === 'string') ? [types] : types;

    types.forEach((cname) => {
        let req, cpath;

        let paths = [
            () => require(`components/${cname}/index`),
            () => require(`components/common-ui/${cname}/index`),
            () => require(`components/${cname}`),
            () => require(`components/common-ui/${cname}`),
            () => require(`reactium-core/components/${cname}/index`),
            () => require(`reactium-core/components/common-ui/${cname}/index`),
            () => require(`reactium-core/components/${cname}`),
            () => require(`reactium-core/components/common-ui/${cname}`),
        ];

        paths.forEach(path => {
            if (req) return;

            try {
                req = path();
                if ( 'default' in req ) {
                    req = req.default;
                }
            } catch (err) {}
        })

        if (req) {
            cmps[cname] = req;
        }
    });

    return cmps;
};

if ( elements.length > 0) {

    let types = elements.map((elm) => { return elm.getAttribute('type'); });
    let components = getComponents(types);

    elements.forEach((elm) => {
        // Get the component type
        let type = elm.getAttribute('type');

        if (!components.hasOwnProperty(type)) {
            return;
        }

        // Get parameters from container element
        let params = {};
        Object.entries(elm.attributes).forEach(([key, attr]) => {
            if ( key !== 'type') {
                params[attr.name] = attr.value;
            }
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
        const store = storeCreator();
        if (bindPoints.length > 0) {
            // Render the React Components
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

        if ( window && 'ssr' in window && window.ssr ) {
            console.log('SSR Mode: Hydrating Reactium.');

            // Hydrate the Routed component
            ReactDOM.hydrate(
                <Provider store={store}>
                    <Fragment>
                        <Router />
                    </Fragment>
                </Provider>,
                document.getElementById('router')
            );
        } else {
            console.log('FE Mode: Binding Reactium.');

            // Bind the Routed component
            ReactDOM.render(
                <Provider store={store}>
                    <Fragment>
                        <Router />
                    </Fragment>
                </Provider>,
                document.getElementById('router')
            );
        }
    }
};
