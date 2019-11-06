import Hook from '../hook';

const Component = {};

/**
 * @api {Function} Component.register(hook,component,order) Register a component to be used with useHookComponent.
 * @apiGroup Reactium.Component
 * @apiName Component.register
 * @apiDescription Register a React component to be used with a specific useHookComponent hook. This must be called before the useHookComponent that defines the hook.
 * @apiParam {String} hook The hook name
 * @apiParam {Mixed} component component(s) to be output by useHookComponent
 * @apiParam {Number} order precedent of this if Component.register is called multiple times (e.g. if you are trying to override core or another plugin)
 * @apiExample Example Usage:
import React from 'react';
import Reactium from 'reactium-core/sdk';

const MyComponent = props => (
    <div>
        {props.value}
    </div>
);
Reactium.Component.register('my-component', MyComponent);
 */
Component.register = (hook, component, order) =>
    Hook.register(
        hook,
        async (...params) => {
            console.log({ params });
            const context = params.pop();
            context.component = component;
        },
        order,
    );

/**
 * @api {Function} Component.unregister(uuid) Alias for Reactium.Hook.unregister.
 * @apiGroup Reactium.Component
 * @apiName Component.unregister
 * @apiDescription Unregister a component used in useHookComponent. This must be performed before useHookComponent is called.
 * @apiParam {String} uuid the registered component hook uuid
 */
Component.unregister = Hook.unregister;

export default Component;
