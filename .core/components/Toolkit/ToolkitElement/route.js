import ToolkitElement from './index';
import deps from 'dependencies';

export default {
    path: '/preview/:element',
    exact: true,
    component: ToolkitElement,
    load: (params, search) => deps.actions.ToolkitElement.mount(params, search),
};
