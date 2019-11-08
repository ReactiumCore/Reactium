import Parse from 'appdir/api';
import Cache from '../cache';
import Hook from '../hook';
import Enums from '../enums';
import _ from 'underscore';
import moment from 'moment';

const Setting = {};

/**
 * @api {Function} Setting.load(autoRefresh) Setting.load()
 * @apiName Setting.load
 * @apiGroup Reactium.Setting
 * @apiDescription Load all settings, with cache. When called multiple times in the cache period,
 the result will come from memory cache.
 * @apiParam {Boolean} [autoRefresh=true] when true, settings will be automatically loaded again
 every `Enums.cache.settings` milliseconds. When false, auto reload of settings will not happen.
 * @apiSuccess {Object} settings an object with setting the current user has access to.
 */
Setting.load = async (autoRefresh = true) => {
    if (Cache.get('settings.loaded')) {
        const cached = Cache.get('setting');
        return cached;
    }

    const cacheLoadedArgs = [moment().format('HH:mm:ss'), Enums.cache.settings];
    if (autoRefresh) cacheLoadedArgs.push(Setting.load);
    Cache.set('settings.loaded', ...cacheLoadedArgs);

    const settings = await Parse.Cloud.run('settings');
    Object.entries(settings).forEach(([group = '', value]) => {
        Cache.set(['setting', group], value, Enums.cache.settings);
    });

    return settings;
};

/**
 * @api {Function} Setting.set(key,value) Setting.set()
 * @apiGroup Reactium.Setting
 * @apiName Setting.set
 * @apiDescription Create or update a setting value. Returns a `{Promise}`.
 * @apiParam {String} key The unique setting key.
 * @apiParam {Mixed} [value] The setting value.
 * @apiParam {Boolean} [public=false] When true, this settings will be readable by anonymous. Useful for global insensitive application settings, such as "site name".
 * @apiExample Example Usage:
Reactium.Setting.set('site', { title: 'My Awesome Site', hostname: 'mysite.com' });
 */
Setting.set = async (key = '', value, setPublic = false) => {
    const settingPath = key.split('.');
    const [group] = settingPath;

    // refresh entire setting group if needed
    Setting.get(group);

    const setting = await Parse.Cloud.run('setting-set', {
        key,
        value,
        public: setPublic,
    });

    Cache.set(['setting'].concat(settingPath), value, Enums.cache.settings);
};

/**
 * @api {Function} Setting.unset(key) Setting.unset()
 * @apiGroup Reactium.Setting
 * @apiName Setting.unset
 * @apiDescription Unset a setting value. Returns a `{Promise}`.
 * @apiParam {String} key The unique setting key.
 * @apiExample Example Usage:
Reactium.Setting.unset('site.title');
 */
Setting.unset = async (key = '') => {
    const setting = await Parse.Cloud.run('setting-unset', { key });
    Cache.del(['setting'].concat(key.split('.')));
};

/**
 * @api {Function} Setting.get(key,defaultValue,refresh) Setting.get()
 * @apiGroup Reactium.Setting
 * @apiName Setting.get
 * @apiDescription Get a setting value.
 * @apiParam {String} key The unique setting key.
 * @apiParam {Mixed} defaultValue The default value if the setting doesn't exist.
 * @apiParam {Boolean} refresh if true, get a fresh value, even if already cached.
 * @apiExample Example Usage:
Reactium.Setting.get('site.hostname');
 */
Setting.get = async (key = '', defaultValue, refresh = false) => {
    const settingPath = key.split('.');
    const [group] = settingPath;
    const cached = Cache.get(['setting'].concat(settingPath));
    if (cached && !refresh) return cached;

    // refresh the whole setting group
    const value = await Parse.Cloud.run('setting-get', { key: group });
    Cache.set(['setting', group], value, Enums.cache.settings);

    return Cache.get(['setting'].concat(settingPath), defaultValue);
};

const clearSettings = async () => {
    Cache.del('setting');
    Cache.del('settings.loaded');
};

Hook.register('user.auth', clearSettings);
Hook.register('user.after.logout', clearSettings);

export default Setting;
