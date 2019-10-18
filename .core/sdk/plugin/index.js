import Hook from '../hook';
import _ from 'underscore';
import Enums from '../enums';

const plugins = {};
const Plugin = {};
const prematureCallError = Enums.Plugin.prematureCallError;

Plugin.ready = false;

Plugin.init = ID => {
    if (!Plugin.ready) {
        console.error(new Error(prematureCallError('Plugin.init()')));
        return;
    }

    if (ID && ID in plugins) {
        plugins[ID].callback();
    } else {
        _.sortBy(Object.values(plugins), 'order').forEach(({ callback }) =>
            callback(),
        );
    }
    return Promise.resolve();
};

Plugin.register = (ID, order = Enums.priority.neutral) => {
    if (ID) {
        return new Promise(resolve => {
            plugins[ID] = {
                callback: resolve,
                order,
            };

            if (Plugin.ready) Plugin.init(ID);
        });
    }

    return Promise.reject(new Error('No ID provided for plugin.'));
};

Plugin.unregister = ID => {
    if (Plugin.ready) {
        console.error(
            new Error(
                'Plugin.unregister() called too late. Reduce the order of your Plugin.register() call.',
            ),
        );
        return;
    }

    if (ID && ID in plugins) {
        delete plugins[ID];
    }
};

Plugin.addComponent = plugin => {
    if (!Plugin.ready) {
        console.error(new Error(prematureCallError('Plugin.addComponent()')));
        return;
    }

    Plugin.redux.store.dispatch(Plugin.deps.actions.Plugable.addPlugin(plugin));
};

Plugin.removeComponent = ID => {
    if (!Plugin.ready) {
        console.error(
            new Error(prematureCallError('Plugin.removeComponent()')),
        );
        return;
    }

    Plugin.redux.store.dispatch(Plugin.deps.actions.Plugable.removePlugin(ID));
};

export default Plugin;

Hook.register('plugin-init', Plugin.init, Enums.priority.highest);

Hook.register(
    'plugin-dependencies',
    ({ deps }) => {
        Plugin.deps = deps;
        Plugin.ready = true;
        Hook.run('plugin-init');
        return Promise.resolve();
    },
    Enums.priority.high,
);

Hook.register(
    'store-created',
    redux => {
        Plugin.redux = redux;
        return Promise.resolve();
    },
    Enums.priority.high,
);
