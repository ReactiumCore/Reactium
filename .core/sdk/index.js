import SDK from '@atomic-reactor/reactium-sdk-core';
import i18n from './i18n';
import Middleware from './middleware';
import Actinium from 'appdir/api';
import Reducer from './reducer';
import Roles from './roles';
import Routing from './routing';
import Setting from './setting';
import User from './user';
import Capability from './capability';

export * from '@atomic-reactor/reactium-sdk-core';
export * from './named-exports';

const Reactium = Object.assign(SDK, {
    ...Actinium,
    i18n,
    Middleware,
    Reducer,
    Roles,
    Routing,
    Setting,
    User,
    Capability,
});

export default Reactium;
