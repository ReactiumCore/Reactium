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

/**
 * @api {Function} Plugin.register(ID,order) Register a Reactium plugin.
 * @apiName Plugin.register
 * @apiDescription Register a Reactium plugin.
 * @apiParam {String} ID the plugin id
 * @apiParam {Integer} [order=Enums.priority.neutral] Priority of the plugin initialization respective to other existing plugins.
 * @apiGroup Plugin
 * @apiExample Example Usage:
import Reactium from 'reactium-core/sdk';

const newReducer = (state = { active: false }, action) => {
    if (action.type === 'ACTIVATE') {
        return {
            ...state,
            active: true,
        };
    }
    return state;
};

const register = async () => {
    await Reactium.Plugin.register('myPlugin');
    Reactium.Reducer.register('myPlugin', newReducer);
};

register();
 */
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

/**
 * @api {Function} Plugin.unregister(ID) Unregister a Reactium plugin.
 * @apiName Plugin.unregister
 * @apiDescription Unregister a Reactium plugin by unique id. This can only be called prior to the `plugin-dependencies` hook, or `Reactium.Plugin.ready === true`.
 * @apiParam {String} ID the plugin id
 * @apiGroup Plugin
 * @apiExample Example Usage:
import Reactium from 'reactium-core/sdk';

// Before Reactium.Plugin.ready
Reactium.Hook.register('plugin-dependencies', () => {
    // Prevent myPlugin registration callback from occurring
    Reactium.Plugin.unregister('myPlugin');
    return Promise.resolve();
}, Enums.priority.highest)
 */
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

/**
 * @api {Function} Plugin.addComponent(plugin) Register a component to a plugin zone.
 * @apiName Plugin.addComponent
 * @apiDescription Register a component to a plugin zone.
 * @apiParam {Object} plugin plugin component, determines what component renders in a zone, what order
 * and additional properties to pass to the component.
 * @apiGroup Plugin
 * @apiExample Example Usage:
import SomeComponent from './path/to/SomeComponent';
import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('myPlugin').then(() => {
    // When the plugin is initialized, `<SomeComponent>` will render in
    // `"zone-1"`
    Reactium.Plugin.addComponent({
        // Required - used as rendering key. Make this unique.
        id: 'someComponent',

        // Required - Component to render. May also be a string, and
        // the component will be looked up in components directory.
        // @type {Component|String}
        component: SomeComponent,

        // Required - One or more zones this component should render.
        // @type {String|Array}
        zone: ['zone-1'],

        // By default plugins in zone are rendering in ascending order.
        // @type {Number}
        order: {{order}},

        // [Optional] - additional search subpaths to use to find the component,
        // if String provided for component property.
        // @type {[type]}
        //
        // e.g. If component is a string 'TextInput', uncommenting the line below would
        // look in components/common-ui/form/inputs and components/general to find
        // the component 'TextInput'
        // paths: ['common-ui/form/inputs', 'general']

        // [Optional] - Additional params:
        //
        // Any arbitrary free-form additional properties you provide below, will be provided as params
        // to the component when rendered.
        //
        // e.g. Below will be provided to the MyComponent, <MyComponent pageType={'home'} />
        // These can also be used to help sort or filter plugins, or however you have your
        // component use params.
        // @type {Mixed}
        // pageType: 'home',
    })
})
 */
Plugin.addComponent = plugin => {
    if (!Plugin.ready) {
        console.error(new Error(prematureCallError('Plugin.addComponent()')));
        return;
    }

    Plugin.redux.store.dispatch(Plugin.deps.actions.Plugable.addPlugin(plugin));
};

/**
 * @api {Function} Plugin.removeComponent(ID) Removes a component added by `Plugin.addComponent()` from a plugin zone by id.
 * @apiName Plugin.removeComponent
 * @apiDescription Removes a component added by `Plugin.addComponent()` from a plugin zone by id.
 * @apiParam {String} ID the unique plugin component id.
 * @apiGroup Plugin
 */
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
