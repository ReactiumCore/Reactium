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

    register(route = {}) {
        route.id = uuid();
        this.routes.push(route);
        this._update();
        return route.id;
    }

    unregister(id) {
        this.routes = this.routes.filter(route => id !== route.id);
        this._update();
    }

    _update() {
        this.updated = moment().format('HH:mm:ss');
        Object.values(this.subscriptions).forEach(cb => cb());
    }

    get() {
        return _.sortBy(this.routes, 'order').concat([
            { id: 'NotFound', component: this.NotFound, order: 1000 },
        ]);
    }
}

const routing = new Routing();

export default routing;
