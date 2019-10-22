import Hook from '../hook';
import uuid from 'uuid/v4';
import _ from 'underscore';
import moment from 'moment';

class Routing {
    loaded = false;
    updated = null;
    routes = [];
    NotFound = () => null;
    subscriptions = {};

    load = async () => {
        if (this.loaded) return;
        const { routes = [] } = await Hook.run('routes-init');
        const { NotFound } = await Hook.run('404-component');
        this.loaded = true;
        this.routes = routes.map(route => {
            route.id = uuid();
            return route;
        });

        this.NotFound = NotFound;
        this._update();
        console.log('Initializing routes.');
    };

    subscribe(cb) {
        if (typeof cb === 'function') {
            const id = uuid();
            this.subscriptions[id] = cb;
            return () => {
                delete this.subscriptions[id];
            };
        }
    }

    /**
     * @api {Function} Routing.register(route) Dynamically register a new React router route.
     * @apiDescription Dynamically register a new React router route.
     * @apiParam {Object} route object to be used as properties of React Router `<Route />` component, including:
     1. path - the routing pattern
     2. exact - true/false if the pattern should be matched exactly
     3. component - the React component to render on this route
     4. order - (special) the priority of this route in the list of routes (which route will resolve first)
     5. load - (special) high-order Redux action function (thunk) to run when this route is resolved (should return a promise)
     6. ... any other property `<Route />` component accepts

     ## Important Note

     Unless called in isomorphic javascript (ie. code executed both in browser and in node.js),
     these routes will not yield Server-Side-Rendered html in SSR mode. The browser will still
     render the route correctly (will not break the page), however the server will deliver a 404 status code on
     cold loads of the page (i.e. hard-refresh of the browser).
     * @apiName Routing.register
     * @apiGroup Routing
     * @apiSuccess {String} uuid unique id of the route
     * @apiExample Example Usage:
import React from 'react';
import op from 'object-path';
import Reactium from 'reactium-core/sdk';
import { useSelect } from 'reactium-core/easy-connect';

// A new component subscribing to Redux state.myPlugin.name
const HelloYou = () => {
    const name = useSelect(state => op.get(state, 'myPlugin.name', 'unknown'));
    return {
        <div>Hello {name}</div>
    };
};

// A Redux-Thunk high-order action function (useful for async actions)
const loadAction = (params, search) => (dispatch, getState) => {
    dispatch({
        type: 'MY_NAME',
        name: op.get(params, 'name', 'unknown'),
    });

    return Promise.resolve();
};

// Register new routing pattern '/hello-world/:name'
const routeId = Reactium.Routing.register({
    path: '/hello-world/:name',
    exact: true,
    component: HelloYou,
    load: loadAction,
});

// Register reducer to handle 'MY_NAME' action
const myReducer = (state = {name: 'unknown'}, action) => {
    if (action.type === 'MY_NAME') return {
        ...state,
        name: action.name,
    };
    return state;
};
Reactium.Plugin.register('myPlugin').then(() => {
    Reactium.Reducer.register('myPlugin', myReducer);
})
     */
    register(route = {}) {
        route.id = uuid();
        this.routes.push(route);
        this._update();
        return route.id;
    }

    /**
     * @api {Function} Routing.unregister(id) Unregister an existing route, by id.
     * @apiName Routing.unregister
     * @apiDescription Unregister an existing route, by id.
     Note: You can not unregister the 'NotFound' component. You can only replace it
     using the `404-component` hook.
     * @apiGroup Routing
     */
    unregister(id) {
        this.routes = this.routes.filter(route => id !== route.id);
        this._update();
    }

    _update() {
        this.updated = moment().format('HH:mm:ss');
        Object.values(this.subscriptions).forEach(cb => cb());
    }

    /**
     * @api {Function} Routing.get() Get sorted array of all route objects.
     * @apiName Routing.get
     * @apiDescription Get sorted array of all route objects. This includes the NotFound
     component. If called prior to the `routes-init` hook completion, will contain
     only the NotFound component.
     * @apiGroup Routing
     */
    get() {
        return _.sortBy(this.routes, 'order').concat([
            { id: 'NotFound', component: this.NotFound, order: 1000 },
        ]);
    }
}

const routing = new Routing();

export default routing;
