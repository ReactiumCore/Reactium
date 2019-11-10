import Cache from './cache';
import Component from './component';
import Enums from './enums';
import Handle from './handle';
import Hook from './hook';
import i18n from './i18n';
import Middleware from './middleware';
import Parse from 'appdir/api';
import Plugin from './plugin';
import Reducer from './reducer';
import Roles from './roles';
import Routing from './routing';
import Setting from './setting';
import User from './user';
import Utils from './utils';
import Zone from './zone';

export * from './named';

export default {
    ...Parse,
    Cache,
    Component,
    Enums,
    Handle,
    Hook,
    i18n,
    Middleware,
    Plugin,
    Reducer,
    Roles,
    Routing,
    Setting,
    User,
    Utils,
    Zone,
};
