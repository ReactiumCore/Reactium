import Hook from '../hook';
import { useState, useEffect, useRef } from 'react';
import op from 'object-path';

/**
 * @api {ReactHook} useHookComponent(hookName,defaultComponent,...params) useHookComponent()
 * @apiDescription A React hook used to define React component(s) that can be overrided by Reactium plugins, using the Reactium.Component.register() function.
 * @apiParam {String} hookName the unique string used to register component(s).
 * @apiParam {Component} defaultComponent the default React component(s) to be returned by the hook.
 * @apiParam {Mixed} params variadic list of parameters to be passed to the Reactium hook specified by hookName.
 * @apiName useHookComponent
 * @apiGroup ReactHook
 * @apiExample parent.js
import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

// component to be used unless overriden by Reactium.Component.register()
const DefaultComponent = () => <div>Default or Placeholder component</div>

export props => {
    const MyComponent = useHookComponent('my-component', DefaultComponent);
    return (
        <div>
            <MyComponent {...props} />
        </div>
    );
};
* @apiExample reactium-hooks.js
import React from 'react';
import Reactium from 'reactium-core/sdk';

// component to be used unless overriden by Reactium.Component.register()
const ReplacementComponent = () => <div>My Plugin's Component</div>

Reactium.Component.register('my-component', ReplacementComponent);
 */
export const useHookComponent = (
    hook = 'component',
    defaultComponent = () => null,
    ...params
) => {
    const component = useRef(defaultComponent);
    const [, update] = useState(component.current);
    const setComponent = newComponent => {
        if (newComponent) {
            component.current = newComponent;
            update(component.current);
        }
    };

    useEffect(() => {
        const getComponent = async () => {
            const context = await Hook.run(hook, ...params);
            setComponent(op.get(context, 'component'));
        };
        getComponent();
    }, [component]);

    return component.current;
};
