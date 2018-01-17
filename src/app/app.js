'use strict';

/**
 * -----------------------------------------------------------------------------
 * Includes
 * -----------------------------------------------------------------------------
 */

import React from 'react';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { save as lsSave, load as lsLoad, clear as lsClear } from 'redux-localstorage-simple';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import DevTools from 'appdir/components/DevTools';

/**
 * -----------------------------------------------------------------------------
 * @description Redux setup
 * -----------------------------------------------------------------------------
 */
let localizeState     = true;
let initialState      = {};
let bindPoints        = [];
const elements        = Array.prototype.slice.call(document.querySelectorAll('component'));


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

// Utility for importing webpack define plugin defined files
const importDefined = filesObj => Object.keys(filesObj).reduce((loaded, key) => {
    let fileName = filesObj[key];
    if (fileName) {
        let newLoaded = require(fileName + "");
        if ( 'default' in newLoaded ) {
            newLoaded = newLoaded.default;
        }
        loaded = {
            ...loaded,
            [key]: newLoaded,
        };
    }
    return loaded;
}, {});

export const actions = importDefined(allActions);

let importedActionTypes = importDefined(allActionTypes);
export const actionTypes = Object.keys(importedActionTypes).reduce((types, key) => ({
    ...types,
    ...importedActionTypes[key],
}), {});

export const services = importDefined(allServices);

let importedRoutes = importDefined(allRoutes);
export const routes = Object.keys(importedRoutes)
.map(route => importedRoutes[route])
.reduce((rts, route, key) => {
    // Support multiple routable components per route file
    if ( Array.isArray(route) ) {
        return [...rts,
            ...route.map((subRoute, subKey) => ({
                order: 0,
                key: `${key}+${subKey}`,
                ...subRoute,
            }))
        ];
    }

    // Support one routable component
    return [...rts, {
        order: 0,
        key,
        ...route,
    }];
}, [])
.sort((a,b) => a.order - b.order);

export const restHeaders = () => {
    return {};
};

// Make sure initial loaded state matches reducers and that
// the current route will dictate the Router state
const sanitizeInitialState = state => Object.keys(state)
.filter(s => s in allReducers)
.filter(s => s !== 'Router')
.reduce((states, key) => ({
    ...states,
    [key]: state[key],
}), {});

/**
 * -----------------------------------------------------------------------------
 * @function App()
 * @description Scan DOM for <Component> elements and render React components
 * inside of them.
 * -----------------------------------------------------------------------------
 */

export const App = () => {
    if (bindPoints.length > 0) {

        // Load middleware
        let middleWare = [thunk];

        // Load InitialState first from modules
        let importedStates = importDefined(allInitialStates);
        initialState = {
            ...initialState,
            ...sanitizeInitialState(importedStates),
        };

        // Get localized state and apply it
        if (localizeState === true) {
            middleWare.push(lsSave());
            initialState = {
                ...initialState,
                ...sanitizeInitialState(lsLoad()),
            };
        } else {
            lsClear();
        }

        const createStoreWithMiddleware = applyMiddleware(...middleWare)(createStore);

        // Combine all Top-level reducers into one
        let rootReducer = combineReducers(importDefined(allReducers));

        // Add DevTools redux enhancer in development
        let storeEnhancer = process.env.NODE_ENV === 'development' ? DevTools.instrument() : _=>_;

        // Create the store
        const store = createStoreWithMiddleware(rootReducer, initialState, storeEnhancer);

        // Render the React Components
        bindPoints.forEach((item) => {
            ReactDOM.render(
                <Provider store={store}>
                    <div>
                        {item.component}
                    </div>
                </Provider>,
                item.element
            );
        });
    }
};
