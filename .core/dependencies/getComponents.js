import { hookableComponent } from '../sdk/named-exports';

export default (elms = []) =>
    elms.reduce((cmps, { type, path }) => {
        if (path) console.warn('path no longer supported in getComponents');
        cmps[type] = hookableComponent(type);
        return cmps;
    }, {});
