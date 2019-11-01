import Parse from 'appdir/api';
import Cache from '../cache';
import User from '../user';
import Enums from '../enums';
import _ from 'underscore';
import moment from 'moment';

const Setting = {};

/**
 * @api {Function} Setting.load(autoRefresh) Load all settings, with cache.
 * @apiName Setting.load
 * @apiGroup Setting
 * @apiDescription Load all settings, with cache. When called multiple times in the cache period,
 the result will come from memory cache.
 * @apiParam {Boolean} [autoRefresh=true] when true, settings will be automatically loaded again
 every `Enums.cache.settings` milliseconds. When false, auto reload of settings will not happen.
 * @apiSuccess {Object} settings an object with setting the current user has access to.
 */
Setting.load = async (autoRefresh = true) => {
    const session = User.getSessionToken();

    if (Cache.get('settings.loaded')) {
        const cached = Cache.get('setting');
        return cached;
    }

    const cacheLoadedArgs = [moment().format('HH:mm:ss'), Enums.cache.settings];
    if (autoRefresh) cacheLoadedArgs.push(Setting.load);
    Cache.set('settings.loaded', ...cacheLoadedArgs);

    const settings = await Parse.Cloud.run('settings');
    Object.entries(settings).forEach(([key, value]) => {
        Cache.set(
            _.compact(['setting', key, 'session', session]),
            value,
            Enums.cache.settings,
        );
    });

    return settings;
};

/**
 * @api {Function} Setting.set(key,value) Setting.set()
 * @apiGroup Setting
 * @apiName Setting.set
 * @apiDescription Create or update a setting value. Returns a `{Promise}`.
 * @apiParam {String} key The unique setting key.
 * @apiParam {Mixed} [value] The setting value.
 * @apiParam {Boolean} [public=false] When true, this settings will be readable by anonymous. Useful for global insensitive application settings, such as "site name".
 * @apiExample Example Usage:
Reactium.Setting.set('site', { title: 'My Awesome Site', hostname: 'mysite.com' });
 */
Setting.set = async (key, value, setPublic = false) => {
    const session = User.getSessionToken();
    const setting = await Parse.Cloud.run('setting-set', {
        key,
        value,
        public: setPublic,
    });
    Cache.set(
        _.compact(['setting', key, 'session', session]),
        value,
        Enums.cache.settings,
    );
};

/**
 * @api {Function} Setting.unset(key) Unset a setting value
 * @apiGroup Setting
 * @apiName Setting.unset
 * @apiDescription Unset a setting value. Returns a `{Promise}`.
 * @apiParam {String} key The unique setting key.
 * @apiExample Example Usage:
Reactium.Setting.unset('site.title');
 */
Setting.unset = async key => {
    const session = User.getSessionToken();
    const setting = await Parse.Cloud.run('setting-unset', { key });
    Cache.del(_.compact(['setting', key]), value);
};

/**
 * @api {Function} Setting.get(key,refresh) Gett a setting value.
 * @apiGroup Setting
 * @apiName Setting.get
 * @apiDescription Get a setting value.
 * @apiParam {String} key The unique setting key.
 * @apiParam {Boolean} refresh if true, get a fresh value, even if already cached.
 * @apiExample Example Usage:
Reactium.Setting.get('site.hostname');
 */
Setting.get = async (key, refresh = false) => {
    const session = User.getSessionToken();

    const cached = Cache.get(_.compact(['setting', key, 'session', session]));
    if (cached && !refresh) return cached;
    const { value } = await Parse.Cloud.run('setting-get', { key });

    Cache.set(
        _.compact(['setting', key, 'session', session]),
        value,
        Enums.cache.settings,
    );
    return value;
};

export default Setting;
