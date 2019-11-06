/**
 * @api {Object} Reactium.Cache Cache
 * @apiVersion 3.0.3
 * @apiName Cache
 * @apiGroup Reactium.Cache
 * @apiDescription Cache allows you to easily store application data in memory.
 */

/**
 * @api {Function} Reactium.Cache.get(key) Cache.get()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.get
 * @apiDescription Retrieves the value for a given key. If the value is not cached `null` is returned.
 *
 * @apiParam {String} [key] The key to retrieve. If the value is an `{Object}` you can use an object path for the key. If no key is specified the entire cache is returned.
 * @apiParam {Mixed} [default] The default value to return if key is not found.
 *
 * @apiExample Example Usage:
 * // Given the cached value: { foo: { bar: 123 } }
 * Reactium.Cache.get('foo.bar'); // returns: 123;
 * Reactium.Cache.get('foo');     // returns: { bar: 123 }
 */

/**
 * @api {Function} Reactium.Cache.set(key,value,timeout,timeoutCallback) Cache.set()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.set
 * @apiDescription Sets the value for a given key. If the value is an `{Object}` and is already cached, you can use an object path to update a specific part of the value. Returns the cached value.
 *
 * @apiParam {String} key The key to set. If the key is an object path and the key does not exist, it will be created.
 * @apiParam {Mixed} value The value to cache.
 * @apiParam {Number} [timeout] Remove the value in the specified time in milliseconds. If no timeout value specified, the value will remain indefinitely.
 * @apiParam {Function} [timeoutCallback] Function called when the timeout has expired. The timeoutCallback will be passed the key and value as arguments.
 *
 * @apiExample Example Usage:
 * // The following are equivalent
 * Reactium.Cache.set('foo', { bar: 123 });
 * Reactium.Cache.set('foo.bar', 123);
 *
 * // Set to expire in 5 seconds
 * Reactium.Cache.set('error', 'Ivnalid username or password', 5000);
 *
 * // Set to expire in 5 seconds and use a timeoutCallback
 * Reactium.Cache.set('foo', { bar: 456 }, 5000, (key, value) => console.log(key, value));
 */

/**
 * @api {Function} Reactium.Cache.del(key) Cache.del()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.del
 * @apiDescription Delete the value for a given key. Returns `{Boolean}`.
 *
 * @apiParam {String} key The key to delete. If the value is an `{Object}` you can use an object path to delete a specific part of the value. The updated value is then returned.
 *
 * @apiExample Example Usage:
 * // Given the cached value: { foo: { bar: 123, blah: 'hahaha' } }
 * Reactium.Cache.del('foo.bar'); // returns: { blah: 'hahaha' }
 * Reactium.Cache.del('foo');     // returns: true
 */

/**
 * @api {Function} Reactium.Cache.clear() Cache.clear()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.clear
 * @apiDescription Delete all cached values.
 *
 * @apiParam {String} key The key to delete. If the value is an `{Object}` you can use an object path to delete a specific part of the value. The updated value is then returned.
 *
 * @apiExample Example Usage:
 * Reactium.Cache.clear();
 */

/**
 * @api {Function} Reactium.Cache.size() Cache.size()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.size
 * @apiDescription Returns the current number of entries in the cache.
 */

/**
 * @api {Function} Reactium.Cache.memsize() Cache.memsize()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.memsize
 * @apiDescription Returns the number of entries taking up space in the cache.
 */

/**
 * @api {Function} Reactium.Cache.merge(values) Cache.merge()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.merge
 * @apiDescription Merges the supplied values object with the current cache. Any existing entries will remain in cache. Duplicates will be overwritten unless `option.skipDuplicates` is `true`. Entries that would have exipired since being merged will expire upon merge but their timeoutCallback will not be invoked. Returns the new size of the cache.
 *
 * @apiParam {Object} values Key value pairs to merge into the cache.
 *
 * @apiExample Example Usage:
 * // Give the existing cache: { foo: 'bar' }
 *
 * Reactium.Cache.merge({
 *     test: {
 *         value: 123,
 *         expire: 5000,
 *     },
 * });
 *
 * Reactium.Cache.get()
 * // returns: { foo: 'bar', test: 123 }
 */

/**
 * @api {Function} Reactium.Cache.keys() Cache.keys()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.keys
 * @apiDescription Returns an array of the cached keys.
 */

import memory from 'memory-cache';
import op from 'object-path';
import moment from 'moment';
import _ from 'underscore';

const getKeyRoot = key => {
    const k = String(key).split('.')[0];
    return k;
};

const getValue = key => {
    const v = memory.get(getKeyRoot(key));
    return v;
};

const cache = {
    ...memory,
};

cache.get = (key, defaultValue) => {
    key = Array.isArray(key) ? key.join('.') : key;

    if (!key) {
        const keys = memory.keys();
        return keys.reduce((obj, key) => {
            obj[key] = memory.get(key);
            return obj;
        }, {});
    }

    const keyArray = String(key).split('.');

    if (keyArray.length > 1) {
        keyArray.shift();
        return op.get(getValue(key), keyArray.join('.'), defaultValue);
    } else {
        return memory.get(key) || defaultValue;
    }
};

cache.put = (key, value, ...args) => {
    key = Array.isArray(key) ? key.join('.') : key;

    let curr = getValue(key);
    const keyRoot = getKeyRoot(key);
    const keyArray = String(key).split('.');

    if (keyArray.length > 1) {
        curr = curr || {};
        keyArray.shift();
        op.set(curr, keyArray.join('.'), value);
        return memory.put(keyRoot, curr, ...args);
    } else {
        return memory.put(key, value, ...args);
    }
};

cache.del = (key, ...args) => {
    key = Array.isArray(key) ? key.join('.') : key;

    let curr = getValue(key);
    if (!curr) {
        return true;
    }

    const keyRoot = getKeyRoot(key);
    const keyArray = String(key).split('.');

    if (keyArray.length > 1) {
        curr = curr || {};
        keyArray.shift();
        op.del(curr, keyArray.join('.'));
        return memory.put(keyRoot, curr, ...args);
    } else {
        return memory.del(key);
    }
};

cache.merge = (values, options) => {
    options = options || { skipDuplicates: false };

    values = Object.keys(values).reduce((obj, key) => {
        const value = values[key];

        const expire = op.get(value, 'expire');

        if (typeof expire === 'number') {
            value.expire = moment(Date.now())
                .add(expire, 'milliseconds')
                .valueOf();
        }

        obj[key] = value;
        return obj;
    }, {});

    return memory.importJson(JSON.stringify(values));
};

cache.set = cache.put;

export default cache;
