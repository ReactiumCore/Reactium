import SDK from '@atomic-reactor/reactium-sdk-core';
import _ from 'underscore';
import op from 'object-path';
import API from '../api';
import User from '../user';

const { Hook, Cache, Utils } = SDK;

const anonymousCaps = async () => {
    const caps = await Capability.get();
    const granted = cap => {
        const { allowed = [], excluded = [] } = cap;
        return _.without(allowed, ...excluded);
    };

    return _.chain(caps.filter(cap => granted(cap).includes('anonymous')))
        .pluck('group')
        .uniq()
        .compact()
        .value()
        .sort();
};

const update = async (capability, role, action) => {
    const isValidUser = await User.hasValidSession();
    if (!isValidUser) throw new Error('Permission denied');

    action = `capability-${action}`;
    const result = await API.Actinium.Cloud.run(action, { capability, role });

    // Invalidate capability cache
    Capability.clearCache();

    return result;
};

const Registry = Utils.registryFactory(
    'capability',
    'group',
    Utils.Registry.MODES.CLEAN,
);

const Capability = {
    User: {},
    request: {},
};

/**
 * @api {Static} Capability.autosync Capability.autosync
 * @apiVersion 3.1.2
 * @apiGroup Capability
 * @apiName Capability.autosync
 * @apiDescription Time in milliseconds that controls when registered capabilities are propagated to the server.
    If set to `false`, manually push registered capabilities with `Capability.propagate()`. Default: `10000`.
 */
Capability.autosync = 10000;

/**
 * @api {Static} Capability.cache Capability.cache
 * @apiVersion 3.1.2
 * @apiGroup Capability
 * @apiName Capability.cache
 * @apiDescription Time in milliseconds that controls how long to cache capability request results. Default: `60000`.
 */
Capability.cache = 60000;

/**
 * @api {Function} Capability.register(id) Capability.register()
 * @apiVersion 3.1.2
 * @apiGroup Capability
 * @apiName Capability.register()
 * @apiDescription Register a new capability.
 * @apiParam {String} id String value used when checking for the capability.
    This function is limited in scope and regularly shouldn't be used. Server-side capability registration is preferred.
 * @apiExample Example Usage
Capability.register('my-ui.view')
 */
Capability.register = id => {
    Registry.register(id, {});
    if (Capability.autosync !== false) {
        Cache.set(
            'cap_register',
            Date.now(),
            Capability.autosync,
            Capability.propagate,
        );
    }
};

/**
 * @api {Async} Capability.propagate(force) Capability.propagate()
 * @apiVersion 3.1.2
 * @apiGroup Capability
 * @apiName Capability.propagate()
 * @apiDescription Propagate registered capabilities to an Actinium server.
 * @apiParam {Boolean} [force=false] Execute the propagation regardless of if a current propagation operation is under way.
    The resolution of the previous propagation operation will be cancelled.
    If `Capability.autosync` is `true`, this function will be called whenever the autosync is initiated.
 * @apiExample Example Usage
await Capability.propagate();
 */
Capability.propagate = async (force = false) => {
    let req = op.get(Capability.request, 'propagate');

    if (req && force !== true) return req;

    if (req && force === true) {
        req.cancelled = true;
        op.del(Capability.request, 'propagate');
    }

    // Res down what you're allowed to register from the front-end to just the group name.
    const capabilities = _.pluck(Registry.list, 'group');

    // Flush the registry.
    Registry.flush();

    req =
        capabilities.length > 0
            ? API.Actinium.Cloud.run('capability-create-all', { capabilities })
            : Promise.resolve();

    req.retry = 0;
    req.cancelled = false;
    req.propagate = capabilities.length > 0;

    op.set(Capability.request, 'propagate', req);

    return req
        .then(async results => {
            if (req.cancelled === true) return;

            // Clear request
            op.del(Capability.request, 'propagate');

            // Setup next propagation run.
            if (Capability.autosync !== false) {
                Cache.set(
                    'cap_register',
                    Date.now(),
                    Capability.autosync,
                    Capability.propagate,
                );
            }

            if (req.propagate === true) {
                const cacheKey = 'capability_list';
                Cache.set(cacheKey, Object.values(results), Capability.cache);
            }

            Hook.run('capability-propagated', req);

            return results;
        })
        .catch(err => {
            let { propagate, retry = 0 } = req;
            if (
                Capability.autosync !== false &&
                propagate === true &&
                retry < 5
            ) {
                retry += 1;
                req = API.Actinium.Cloud.run('capability-create-all', {
                    capabilities,
                });
                req.retry = retry;
                req.propagate = true;
                op.set(Capability.request, 'propagate', req);
            }

            return err;
        });
};

/**
 * @api {Async} Capability.grant(capability,role) Capability.grant()
 * @apiVersion 3.2.1
 * @apiDescription Add role(s) to the capability allowed list.
 * @apiName Capability.grant
 * @apiGroup Reactium.Capability
 * @apiExample Usage
Capability.grant('taxonomy.update', 'moderator');
Capability.grant('taxonomy.update', ['moderator']);
 */
Capability.grant = (cap, role) => update(cap, role, 'grant');

/**
 * @api {Async} Capability.revoke(capability,role) Capability.revoke()
 * @apiVersion 3.2.1
 * @apiDescription Remove role(s) from the capability allowed list.
 * @apiName Capability.revoke
 * @apiGroup Reactium.Capability
 * @apiExample Usage
Capability.revoke('taxonomy.update', 'moderator');
Capability.revoke('taxonomy.update', ['moderator']);
 */
Capability.revoke = (cap, role) => update(cap, role, 'revoke');

/**
 * @api {Async} Capability.restrict(capability,role) Capability.restrict()
 * @apiVersion 3.2.1
 * @apiDescription Add role(s) to the capability excluded list.
 * @apiName Capability.restrict
 * @apiGroup Reactium.Capability
 * @apiExample Usage
Capability.restrict('taxonomy.update', 'moderator');
Capability.restrict('taxonomy.update', ['moderator']);
 */
Capability.restrict = (cap, role) => update(cap, role, 'restrict');

/**
 * @api {Async} Capability.unrestrict(capability,role) Capability.unrestrict()
 * @apiVersion 3.2.1
 * @apiDescription Remove role(s) from the capability excluded list.
 * @apiName Capability.unrestrict
 * @apiGroup Reactium.Capability
 * @apiExample Usage
Capability.unrestrict('taxonomy.update', 'moderator');
Capability.unrestrict('taxonomy.update', ['moderator']);
 */
Capability.unrestrict = (cap, role) => update(cap, role, 'unrestrict');

/**
 * @api {Async} Capability.get(capability) Capability.get()
 * @apiVersion 3.2.1
 * @apiDescription Get allowed and excluded roles for a capability.
 * @apiName Capability.get
 * @apiGroup Reactium.Capability
 * @apiExample Usage
 import Reactium from 'reactium-core/sdk';
 Capability.get('do-something').then(({allowed = [], excluded = []}) => {
     if (allowed.includes('contributor')) console.log('Contributor allowed to do something');
 })
 */
Capability.get = async (capability, refresh = false) => {
    const cacheKey = 'capabilities_list';
    let caps = Cache.get(cacheKey);

    capability = _.chain([capability])
        .flatten()
        .compact()
        .uniq()
        .value()
        .map(c => String(c).toLowerCase())
        .sort();

    if (!caps || refresh === true) {
        let req = op.get(Capability.request, 'list');

        if (!req) {
            req = API.Actinium.Cloud.run('capability-get')
                .then(caps => {
                    caps = Object.values(caps);
                    Cache.set(cacheKey, caps, Capability.cache);
                    op.del(Capability.request, 'list');
                    return capability.length > 0
                        ? caps.filter(({ group }) => capability.includes(group))
                        : caps;
                })
                .catch(() => op.del(Capability.request, 'list'));

            op.set(Capability.request, 'list', req);
        }

        return req;
    }

    return capability.length > 0
        ? caps.filter(({ group }) => capability.includes(group))
        : caps;
};

/**
 * @api {Async} Capability.check(capabilities,strict) Capability.check
 * @apiVersion 3.2.1
 * @apiName Capability.check
 * @apiGroup Reactium.Capability
 * @apiDescription Check a list of capabilities on the current user.
 * @apiParam {Array} capabilities list of string capabilities to check, returns true if current user is allowed, false if not allowed
 * @apiParam {Boolean} [strict=true] When true all capabilities must be allowed for user for check to return true, otherwise only one capability is required to get a true value.
 * @apiParam {String} [userID] The Reactium.User id to check.
 */
Capability.check = async (checks, strict = true, userID) => {
    if (!userID) {
        const isValidUser = await User.hasValidSession();
        userID = isValidUser ? User.current(true).id : userID;
    }

    const isSuperAdmin = userID
        ? await User.isRole('super-admin', userID)
        : false;
    if (isSuperAdmin === true) return true;

    checks = _.chain([checks])
        .flatten()
        .uniq()
        .value()
        .map(cap => String(cap).toLowerCase());

    const caps = await Capability.User.get(userID);

    const match = _.intersection(caps, checks);

    return strict === true ? match.length === checks.length : match.length > 0;
};

/**
 * @api {Async} Capability.check(capabilities,strict) Capability.check
 * @apiVersion 3.2.1
 * @apiDescription Retrieve an enumerated list of capabilities for the specified user.
 * @apiParam {Array} capabilities list of string capabilities to check, returns true if current user is allowed, false if not allowed.
 * @apiParam {String} [userID] The Actinium.User id value. If empty the current user is used.
 * @apiName Capability.check
 * @apiGroup Reactium.Capability
 */
Capability.checkAll = async (checks, userID) => {
    if (!userID) {
        const isValidUser = await User.hasValidSession();
        userID = isValidUser ? User.current(true).id : userID;
    }

    if (checks) {
        checks = _.chain([checks])
            .flatten()
            .uniq()
            .value()
            .map(cap => String(cap).toLowerCase());
    } else {
        checks = await Capability.get();
        checks = _.pluck(checks, 'group');
    }

    let results = {};

    const isSuperAdmin = userID
        ? await User.isRole('super-admin', userID)
        : false;

    if (isSuperAdmin) {
        results = checks.reduce((obj, cap) => {
            obj[cap] = true;
            return obj;
        }, {});
    } else {
        const caps = await Capability.User.get(userID);
        results = checks.reduce((obj, cap) => {
            obj[cap] = caps.includes(cap);
            return obj;
        }, {});
    }

    return results;
};

/**
 * @api {Function} Capability.clearCache() Capability.clearCache()
 * @apiVersion 3.1.2
 * @apiGroup Capability
 * @apiName Capability.clearCache()
 * @apiDescription Clear Capability related Cache keys.
 */
Capability.clearCache = () =>
    Cache.keys().forEach(key => {
        if (String(key).startsWith('capability_')) {
            Cache.del(key);
        }
    });

/**
 * @api {Async} Capability.User.get(userID,refresh) Capability.User.get()
 * @apiVersion 3.1.2
 * @apiGroup Capability
 * @apiName Capability.User.get()
 * @apiDescription Return an Array of capability names granted to the user.
 * @apiParam {String} [userID] The Reactium.User id. If empty the User.current id is used.
 * @apiParam {Boolean} [refres=false] Fetch capabilities from the server instead of cache.
 * @apiExample Example Usage
    const canEditArticle = async userID => {
        const caps = await Reactium.Capability.User.get(userID);
        return caps.includes('content.article.update');
    };
 */
Capability.User.get = async (user, refresh = false) => {
    if (!user) {
        const isValidUser = await User.hasValidSession();
        if (!isValidUser) return await anonymousCaps();
        user = User.current(true).id;
    }

    const cacheKey = `capabilities_${user}`;
    let caps = Cache.get(cacheKey);

    if (!caps || refresh === true) {
        let req = op.get(Capability.request, user);

        if (!req) {
            req = API.Actinium.Cloud.run('capability-get-user', { user })
                .then(caps => {
                    Cache.set(cacheKey, caps, Capability.cache);
                    op.del(Capability.request, user);
                    return caps;
                })
                .catch(() => op.del(Capability.request, user));

            op.set(Capability.request, user, req);
        }

        return req;
    }

    return caps;
};

Capability.User.refresh = user => Capability.User.get(user, true);

export default Capability;
