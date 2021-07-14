import { useHookComponent } from '@atomic-reactor/reactium-sdk-core';

export const hookableComponent = name => props => {
    const Component = useHookComponent(name);
    return <Component {...props} />;
};
