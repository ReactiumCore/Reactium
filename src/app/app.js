'use strict';

/**
 * -----------------------------------------------------------------------------
 * Includes
 * -----------------------------------------------------------------------------
 */

import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Router from 'components/Router';
import storeCreator from './storeCreator';

let bindPoints        = [];
const elements        = typeof document !== 'undefined' ? Array.prototype.slice.call(document.querySelectorAll('component')) : [];

export const getComponents = (types) => {
    let cmps = {};

    types = (typeof types === 'string') ? [types] : types;
    types.forEach((cname) => {
        let req, cpath;

        let paths = [
            cname,
            `${cname}/index`,
            `components/${cname}`,
            `components/${cname}/index`,
            `components/common-ui/${cname}`,
            `components/common-ui/${cname}/index`,
        ];

        while (!req && paths.length > 0) {
            cpath = paths.shift();

            try { req = require('appdir/' + cpath); } catch (err) { }
            if (!req) {
                try { req = require(cpath + ''); } catch (err) { }
            }

            if (req) {
                if (req.hasOwnProperty('default')) {
                    req = req.default;
                }
                break;
            }
        }

        if (req) {
            cmps[cname] = req;
        }
    });

    return cmps;
};

if (elements.length > 0) {

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

        // Hydrate the Routed component
        ReactDOM.hydrate(
            <Provider store={store}>
                <Fragment>
                    <Router />
                </Fragment>
            </Provider>,
            document.getElementById('router')
        );
    }
};
