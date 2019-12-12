import SDK from '@atomic-reactor/reactium-sdk-core';
import i18n from './i18n';
import Middleware from './middleware';
import Parse from 'appdir/api';
import Plugin from './plugin';
import Reducer from './reducer';
import Roles from './roles';
import Routing from './routing';
import Setting from './setting';
import User from './user';
import Zone from './zone';

export * from '@atomic-reactor/reactium-sdk-core';
export * from './named-exports';

export default {
    ...SDK,
    ...Parse,
    i18n,
    Middleware,
    Plugin,
    Reducer,
    Roles,
    Routing,
    Setting,
    User,
    Zone,
};
