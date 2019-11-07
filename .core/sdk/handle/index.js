import uuid from 'uuid/v4';
import op from 'object-path';

class Handle {
    updated = null;
    handles = {};
    subscriptions = {};

    subscribe(cb) {
        if (typeof cb === 'function') {
            const id = uuid();
            this.subscriptions[id] = cb;
            return () => {
                delete this.subscriptions[id];
            };
        }
    }

    register(id = '', ref) {
        const path = Array.isArray(id) ? id : id.split('.');
        op.set(this.handles, path, ref);
        this._update();
    }

    unregister(id = '') {
        const path = Array.isArray(id) ? id : id.split('.');
        op.del(this.handles, path);
        this._update();
    }

    _update() {
        Object.values(this.subscriptions).forEach(cb => cb());
    }

    get(id = '') {
        const path = Array.isArray(id) ? id : id.split('.');
        return op.get(this.handles, path);
    }

    list() {
        return this.handles;
    }
}

export default new Handle();
