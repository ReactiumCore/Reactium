import Test from './index';
import deps from 'dependencies';

export default {
    path: ['/something-new'],
    exact: true,
    component: Test,
    load: (params, search) => deps.actions.Test.mount({ params, search }),
};
