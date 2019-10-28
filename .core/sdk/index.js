import Cache from './cache';
import Enums from './enums';
import Hook from './hook';
import Middleware from './middleware';
import Parse from 'appdir/api';
import Plugin from './plugin';
import Reducer from './reducer';
import Roles from './roles';
import Routing from './routing';
import Setting from './setting';
import User from './user';
import Zone from './zone';

export default {
    ...Parse,
    Cache,
    Enums,
    Hook,
    Middleware,
    Plugin,
    Reducer,
    Roles,
    Routing,
    Setting,
    User,
    Zone,
};
