import Test from './index';
import { actions } from 'appdir/app';

export default {
    // Route pattern
    path: ['/', '/test'],

    // Route should be exact
    exact: true,

    // the component to load for this route
    component: Test,

    // load callback should return thunk that uses route params.
    load: params => actions.Test.mount(params),
};
