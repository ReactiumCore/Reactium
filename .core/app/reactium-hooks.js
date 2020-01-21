import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'reactium-core/redux/storeCreator';
import 'reactium-core/components/Router/reactium-hooks';
import deps from 'dependencies';
import Reactium from 'reactium-core/sdk';
import { Provider } from 'react-redux';
import Router from 'reactium-core/components/Router';
import getComponents from 'dependencies/getComponents';
import op from 'object-path';
import _ from 'underscore';

Reactium.Hook.register('init', async () => {
    require('manifest').externals();
});

Reactium.Hook.register(
    'component-bindings',
    async context => {
        // Placeholder for the bindable elements
        const bindPoints = [];

        // <Component /> DOM Elements array
        const elements =
            typeof document !== 'undefined'
                ? Array.prototype.slice.call(
                      document.querySelectorAll('component'),
                  )
                : [];

        if (elements.length > 0) {
            let types = [];

            let elms = elements.map(elm => {
                let path = elm.getAttribute('path');
                let type = elm.getAttribute('type');

                types.push(type);

                return { path, type };
            });

            let components = getComponents(elms);

            elements.forEach(elm => {
                // Get the component type
                let type = elm.getAttribute('type');

                if (!components.hasOwnProperty(type)) {
                    return;
                }

                // Get parameters from container element
                let params = {};
                let exclude = ['type', 'path'];
                Object.entries(elm.attributes).forEach(([key, attr]) => {
                    key = String(key).toLowerCase();
                    if (exclude.indexOf(key) < 0) {
                        return;
                    }
                    params[attr.name] = attr.value;
                });

                // Get the children from the element and pass them to the component
                let children = elm.innerHTML;
                if (children) {
                    params['children'] = children;
                }

                // Create the React element and apply parameters
                let cmp = React.createElement(components[type], params);
                bindPoints.push({ component: cmp, element: elm });
                console.log('Binding components.');
            });
        }

        context.bindPoints = bindPoints;
        return Promise.resolve();
    },
    Reactium.Enums.priority.highest,
);

Reactium.Hook.register(
    'plugin-dependencies',
    context => {
        // Setup plugin registration
        context.deps = deps();

        console.log('Plugin dependencies.');
        return Promise.resolve();
    },
    Reactium.Enums.priority.highest,
);

Reactium.Hook.register(
    'app-bindpoint',
    context => {
        context.appElement = document.getElementById('router');
        return Promise.resolve();
    },
    Reactium.Enums.priority.highest,
);

const getSaneZoneComponents = () => {
    return (
        // allow array of DDD zone components
        _.flatten(_.compact(Object.values(deps().plugins)), true)
            // remove DDD zone components missing zones
            .filter(({ zone }) => {
                if (!zone) return false;
                if (Array.isArray(zone) && zone.length < 1) return false;
                return true;
            })
            // normalize zone property
            .map(component => {
                let { zone } = component;
                if (!Array.isArray(zone)) {
                    zone = [zone];
                }
                return {
                    ...component,
                    zone,
                };
            })
    );
};

Reactium.Hook.register('zone-defaults', async context => {
    op.set(context, 'controls', deps().plugableConfig);
    op.set(context, 'components', getSaneZoneComponents());
    console.log('Initializing Content Zones');
});

Reactium.Hook.register(
    'app-redux-provider',
    context => {
        context.Provider = Provider;
        console.log('Defining Redux Provider.');
        return Promise.resolve();
    },
    Reactium.Enums.priority.highest,
);

Reactium.Hook.register(
    'app-router',
    context => {
        context.Router = Router;
        console.log('Defining Router.');
        return Promise.resolve();
    },
    Reactium.Enums.priority.highest,
);

Reactium.Hook.register(
    'app-ssr-mode',
    context => {
        context.ssr = window && 'ssr' in window && window.ssr;
        return Promise.resolve();
    },
    Reactium.Enums.priority.highest,
);

Reactium.Hook.register(
    'app-boot-message',
    (ssr = false, context) => {
        const mode = ssr ? 'SSR' : 'FE';
        const binding = ssr ? 'Hydrating' : 'Binding';
        context.message = [
            `%c [Reactium] ${mode} Mode: %c⚡💡 %c${binding} Reactium. %c⚡💡 `,
            'font-size: 16px; color: #fff; background-color: #4F82BA',
            'font-size: 16px; color: #F4F19C; background-color: #4F82BA',
            'font-size: 16px; color: #fff; background-color: #4F82BA',
            'font-size: 16px; color: #F4F19C; background-color: #4F82BA',
        ];

        return Promise.resolve();
    },
    Reactium.Enums.priority.highest,
);
