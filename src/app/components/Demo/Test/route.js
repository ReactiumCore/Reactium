import React, { Suspense, lazy } from 'react';
import deps from 'dependencies';

let AsyncTest = import(/* webpackChunkName: "Test" */ './index');
const Test = lazy(() => AsyncTest);
const Component = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Test />
        </Suspense>
    );
};
// import Test from './index';

export default {
    // Route pattern
    path: ['/demo/redux'],

    // Route should be exact
    exact: true,

    // the component to load for this route
    component: Component,

    // load callback should return thunk that uses route params.
    load: params => deps().actions.Test.mount(params),
};
