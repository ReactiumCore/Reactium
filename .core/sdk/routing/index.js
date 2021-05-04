import SDK, {
    useHookComponent,
    isServerWindow,
    isBrowserWindow,
    isElectronWindow,
} from '@atomic-reactor/reactium-sdk-core';
import uuid from 'uuid/v4';
import _ from 'underscore';
import op from 'object-path';
import { createBrowserHistory, createMemoryHistory } from 'history';
import queryString from 'querystring-browser';
import { matchPath } from 'react-router';
import React from 'react';

const { Hook } = SDK;

const createHistory = isElectronWindow()
    ? createMemoryHistory
    : createBrowserHistory;

const NotFoundWrapper = props => {
    const NotFound = useHookComponent('NotFound');
    return <NotFound {...props} />;
};

const defaultTransitionStates = [
    {
        state: 'EXITING',
        active: 'previous',
    },
    {
        state: 'LOADING',
        active: 'current',
    },
    {
        state: 'ENTERING',
        active: 'current',
    },
    {
        state: 'READY',
        active: 'current',
    },
];

class Routing {
    loaded = false;
    updated = null;
    routesRegistry = new SDK.Utils.Registry(
        'Routing',
        'id',
        SDK.Utils.Registry.MODES.CLEAN,
    );
    routeListeners = new SDK.Utils.Registry(
        'RoutingListeners',
        'id',
        SDK.Utils.Registry.MODES.CLEAN,
    );

    active = 'current';
    currentRoute = null;
    previousRoute = null;
    subscriptions = {};

    constructor() {
        if (isBrowserWindow()) {
            this.historyObj = createHistory();
            this.historyObj.listen(this.setCurrentRoute);
        }
    }

    set history(histObj) {
        this.historyObj = histObj;
    }

    get history() {
        if (!isBrowserWindow()) return {};
        return this.historyObj;
    }

    get routes() {
        return _.sortBy(
            _.sortBy(this.routesRegistry.list, 'path').reverse(),
            'order',
        );
    }

    setCurrentRoute = async location => {
        const previous = this.currentRoute;
        const current = {
            location,
        };

        const matches = this.routes
            .map(route => ({
                route,
                match: matchPath(location.pathname, route),
            }))
            .filter(({ match }) => match);

        let [match] = matches;

        const routeChanged =
            op.get(previous, 'match.route.id') !== op.get(match, 'route.id');
        const pathChanged =
            op.get(previous, 'location.pathname') !==
            op.get(current, 'location.pathname');
        const searchChanged =
            op.get(previous, 'location.search', '') !==
            op.get(current, 'location.search', '');

        const notFound = !match;

        if (!match)
            match = {
                route: this.routes.find(({ id }) => id === 'NotFound'),
                match: undefined,
            };

        op.set(current, 'match', match);
        op.set(current, 'params', op.get(match, 'match.params', {}));
        op.set(
            current,
            'search',
            queryString.parse(
                op.get(current, 'location.search', '').replace(/^\?/, ''),
            ),
        );
        this.changeReasons = {
            routeChanged,
            pathChanged,
            searchChanged,
            notFound,
            transitionStateChanged: false,
        };

        this.currentRoute = current;
        this.previousRoute = previous;
        this.setupTransitions();

        const active =
            this.active === 'current' ? this.currentRoute : this.previousRoute;
        const updates = {
            previous: this.previousRoute,
            current: this.currentRoute,
            active,
            changes: this.changeReasons,
            transitionState: this.transitionState,
            transitionStates: this.transitionStates,
        };
        this.routeListeners.list.forEach(sub => {
            const cb = op.get(sub, 'handler', () => {});
            cb(updates);
        });
    };

    setupTransitions = () => {
        const previousTransitions =
            op.get(this.previousRoute, 'match.route.transitions', false) ===
                true && !isServerWindow();
        const currentTransitions =
            op.get(this.currentRoute, 'match.route.transitions', false) ===
                true && !isServerWindow();
        const currentTransitionStates =
            op.get(
                this.currentRoute,
                'match.route.transitionStates',
                defaultTransitionStates,
            ) || [];

        // set transitionStates on allowed components
        this.transitionStates = (!currentTransitions
            ? []
            : currentTransitionStates
        ).filter(({ active = 'current' }) => {
            return (
                active === 'current' ||
                (active === 'previous' && previousTransitions)
            );
        });

        const [transition, ...transitionStates] = this.transitionStates;
        this.transitionStates = transitionStates;
        this.setTransitionState(transition, false);
    };

    jumpCurrent = () => {
        this.transitionStates = [];
        this.setTransitionState(null);
    };

    nextState = () => {
        if (this.transitionStates.length > 0) {
            const [transition, ...transitionStates] = this.transitionStates;
            this.transitionStates = transitionStates;
            this.setTransitionState(transition);
        }
    };

    setTransitionState = (transition, update = true) => {
        this.active = op.get(transition, 'active', 'current') || 'current';
        this.transitionState = op.get(transition, 'state', 'READY') || 'READY';
        this.changeReasons = {
            routeChanged: false,
            pathChanged: false,
            searchChanged: false,
            notFound: false,
            transitionStateChanged: true,
        };

        const active =
            this.active === 'current' ? this.currentRoute : this.previousRoute;
        const updates = {
            previous: this.previousRoute,
            current: this.currentRoute,
            active,
            changes: this.changeReasons,
            transitionState: this.transitionState,
            transitionStates: this.transitionStates,
        };
        if (update) {
            this.routeListeners.list.forEach(sub => {
                const cb = op.get(sub, 'handler', () => {});
                cb(updates);
            });
        }
    };

    load = async () => {
        if (this.loaded) return;

        /**
         * @api {Hook} routes-init routes-init
         * @apiName routes-init
         * @apiDescription Called after plugin-init, to add React Router routes to Reactium.Routing register before
         the Router component is initialized and finally the application is bound to the DOM.
         async only - used in front-end or isomorphically when running server-side rendering mode (SSR)
         * @apiGroup Hooks
         */
        await Hook.run('routes-init', this.routesRegistry);

        this.routesRegistry.register({
            id: 'NotFound',
            exact: false,
            component: NotFoundWrapper,
            order: SDK.Enums.priority.lowest,
        });

        this.loaded = true;

        if (isBrowserWindow()) {
            this.setCurrentRoute(this.historyObj.location);
        }

        this._update();

        console.log('Initializing routes.');
    };

    subscribe(cb) {
        if (typeof cb === 'function') {
            const id = uuid();
            this.subscriptions[id] = cb;

            // initial callback
            cb();
            return () => {
                delete this.subscriptions[id];
            };
        }
    }

    /**
 * @api {Function} Routing.register(route) Routing.register()
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
 * @apiGroup Reactium.Routing
 * @apiSuccess {String} uuid unique id of the route
 * @apiExample Example Usage:
import React from 'react';
import op from 'object-path';
import Reactium, { useSelect } from 'reactium-core/sdk';

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
    async register(route = {}, update = true) {
        if (!route.id) route.id = uuid();
        if (!route.order) route.order = 0;

        /**
         * @api {Hook} register-route register-route
         * @apiName register-route
         * @apiDescription Called on boot after routes-init, and during runtime operation of the front-end application, whenever
         a new route is registered. Can be used to augment a router object before it is registered to the router.
         async only - used in front-end or isomorphically when running server-side rendering mode (SSR)
         * @apiParam {Object} route the new or updated route, indentified by unique id (route.id)
         * @apiGroup Hooks
         */
        await Hook.run('register-route', route);
        this.routesRegistry.register(route.id, route);
        if (update) this._update();
        return route.id;
    }

    /**
     * @api {Function} Routing.unregister(id) Routing.unregister()
     * @apiName Routing.unregister
     * @apiDescription Unregister an existing route, by id.
     Note: You can not unregister the 'NotFound' component. You can only replace it
     using the registering a NotFound component with Reactium.Component.register().
     * @apiParam {String} id the route id
     * @apiParam {Boolean} [update=true] update subscribers
     * @apiGroup Reactium.Routing
     */
    unregister(id, update = true) {
        this.routesRegistry.unregister(id);
        if (update) this._update();
    }

    _update() {
        this.updated = new Date();
        Object.values(this.subscriptions).forEach(cb => cb());
    }

    /**
     * @api {Function} Routing.get() Routing.get()
     * @apiName Routing.get
     * @apiDescription Get sorted array of all route objects.
     * @apiGroup Reactium.Routing
     */
    get() {
        return this.routes;
    }
}

const routing = new Routing();

export default routing;
