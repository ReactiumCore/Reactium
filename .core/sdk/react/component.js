import Hook from '../hook';
import { useState, useEffect, useRef } from 'react';
import op from 'object-path';

export const useHookComponent = (
    hook = 'component',
    defaultComponent = () => null,
    ...props
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
            const context = await Hook.run(hook, ...props);
            setComponent(op.get(context, 'component'));
        };
        getComponent();
    }, [component]);

    return component.current;
};
