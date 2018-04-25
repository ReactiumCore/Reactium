import RoutesTest from './RoutesTest1';
import RoutesTest2 from './RoutesTest2';
import RoutesTest3 from './RoutesTest3';
import RoutesTest4 from './RoutesTest4';
import { actions } from 'appdir/app';

export default [
    // least-specific route should be heaviest, so it is evaluated last
    {
        path: '/routes-test',
        order: 3,
        exact: true,
        component: RoutesTest,
        load: params => actions.RoutesTest.mount(params),
    },
    // purposefully out of order to demonstrate sort by order
    {
        path: '/routes-test/:param1/:param2',
        order: 1,
        exact: true,
        component: RoutesTest3,
        load: params => actions.RoutesTest.mount(params),
    },
    {
        path: '/routes-test/:param1',
        order: 2,
        exact: true,
        component: RoutesTest2,
        load: params => actions.RoutesTest.mount(params),
    },
     // most specific, should happen first
     // testing default 0
    {
        path: '/routes-test/:param1/:param2/:param3',
        exact: true,
        component: RoutesTest4,
        load: (params, search) => actions.RoutesTest.mount(params, search),
    },
];
