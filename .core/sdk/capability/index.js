import SDK from '@atomic-reactor/reactium-sdk-core';
import _ from 'underscore';
import op from 'object-path';
import API from '../api';
import User from '../user';

const { Hook, Enums, Cache, Utils } = SDK;
Enums.cache.capability = 60000;

const Registry = Utils.registryFactory(
    'capability',
    'group',
    Utils.Registry.MODES.CLEAN,
);

const Capability = {
    autosync: true,
    User: {},
    request: {},
};

const update = async (capability, role, action) => {
    action = `capability-${action}`;
    const result = await API.Actinium.Cloud.run(action, { capability, role });

    // Invalidate capability cache
    Capability.clearCache();

    return result;
};

Capability.register = (id, capability) => {
    Registry.register(id, capability);
    if (Capability.autosync === true) {
        Cache.set('cap_register', Date.now(), 10000, Capability.propagate);
    }
};

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
            if (Capability.autosync === true) {
                Cache.set(
                    'cap_register',
                    Date.now(),
                    10000,
                    Capability.propagate,
                );
            }

            if (req.propagate === true) {
                const cacheKey = 'capability_list';
                Cache.set(
                    cacheKey,
                    Object.values(results),
                    Enums.cache.capability,
                );
            }

            Hook.run('capability-propagated', req);

            return results;
        })
        .catch(err => {
            let { propagate, retry = 0 } = req;
            if (
                Capability.autosync === true &&
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
 * @api {Function} Capability.grant(capability,role) Capability.grant()
 * @apiVersion 3.2.1
 * @apiDescription Add role(s) to the capability allowed list.
 * @apiName Capability.grant
 * @apiGroup Reactium.Capability
 * @apiExample Usage
Capability.grant('taxonomy.update', 'moderator');
Capability.grant('taxonomy.update', ['moderator']);
 */
Capability.grant = (capability, role) => update(capability, role, 'grant');

/**
 * @api {Function} Capability.revoke(capability,role) Capability.revoke()
 * @apiVersion 3.2.1
 * @apiDescription Remove role(s) from the capability allowed list.
 * @apiName Capability.revoke
 * @apiGroup Reactium.Capability
 * @apiExample Usage
Capability.revoke('taxonomy.update', 'moderator');
Capability.revoke('taxonomy.update', ['moderator']);
 */
Capability.revoke = (capability, role) => update(capability, role, 'revoke');

/**
 * @api {Function} Capability.restrict(capability,role) Capability.restrict()
 * @apiVersion 3.2.1
 * @apiDescription Add role(s) to the capability excluded list.
 * @apiName Capability.restrict
 * @apiGroup Reactium.Capability
 * @apiExample Usage
Capability.restrict('taxonomy.update', 'moderator');
Capability.restrict('taxonomy.update', ['moderator']);
 */
Capability.restrict = (capability, role) =>
    update(capability, role, 'restrict');

/**
 * @api {Function} Capability.unrestrict(capability,role) Capability.unrestrict()
 * @apiVersion 3.2.1
 * @apiDescription Remove role(s) from the capability excluded list.
 * @apiName Capability.unrestrict
 * @apiGroup Reactium.Capability
 * @apiExample Usage
Capability.unrestrict('taxonomy.update', 'moderator');
Capability.unrestrict('taxonomy.update', ['moderator']);
 */
Capability.unrestrict = (capability, role) =>
    update(capability, role, 'unrestrict');

/**
 * @api {Function} Capability.get(capability) Capability.get()
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
    const isValidUser = await User.hasValidSession();
    if (!isValidUser) return [];

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
            req = API.Actinium.Cloud.run('capability-get').then(caps => {
                caps = Object.values(caps);
                Cache.set(cacheKey, caps, Enums.cache.capability);
                op.del(Capability.request, 'list');
                return capability.length > 0
                    ? caps.filter(({ group }) => capability.includes(group))
                    : caps;
            });

            op.set(Capability.request, 'list', req);
        }

        return req;
    }

    return capability.length > 0
        ? caps.filter(({ group }) => capability.includes(group))
        : caps;
};

/**
 * @api {Function} Capability.check(capabilities,strict) Capability.check
 * @apiVersion 3.2.1
 * @apiDescription Check a list of capabilities on the current user.
 * @apiParam {Array} capabilities list of string capabilities to check, returns
 true if current user is allowed, false if not allowed
 * @apiParam {Boolean} [strict=true] When true all capabilities must be allowed
 for user for check to return true, otherwise only one capability is required to get a true value.
 * @apiName Capability.check
 * @apiGroup Reactium.Capability
 */
Capability.check = async (checks, strict = true, userID) => {
    const isValidUser = await User.hasValidSession();
    if (!isValidUser) return false;

    const u = User.current(true);
    userID = userID || u.id;

    const isSuperAdmin = await User.isRole('super-admin', userID);
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
 * @api {Function} Capability.check(capabilities,strict) Capability.check
 * @apiVersion 3.2.1
 * @apiDescription Retrieve an enumerated list of capabilities for the specified user.
 * @apiParam {Array} capabilities list of string capabilities to check, returns true if current user is allowed, false if not allowed.
 * @apiParam {String} [userID] The Actinium.User id value. If empty the current user is used.
 * @apiName Capability.check
 * @apiGroup Reactium.Capability
 */
Capability.checkAll = async (checks, userID) => {
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

    const isValidUser = await User.hasValidSession();

    let results = {};

    if (!isValidUser) {
        results = checks.reduce((obj, cap) => {
            obj[cap] = false;
            return obj;
        }, {});
    } else {
        const u = User.current(true);
        userID = userID || u.id;

        const isSuperAdmin = await User.isRole('super-admin', userID);

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
    }

    return results;
};

Capability.User.get = async (user, refresh = false) => {
    const cacheKey = `capabilities_${user}`;
    let caps = Cache.get(cacheKey);

    if (!caps || refresh === true) {
        let req = op.get(Capability.request, user);

        if (!req) {
            req = API.Actinium.Cloud.run('capability-get-user', { user }).then(
                caps => {
                    Cache.set(cacheKey, caps, Enums.cache.capability);
                    op.del(Capability.request, user);
                    return caps;
                },
            );

            op.set(Capability.request, user, req);
        }

        return req;
    }

    return caps;
};

Capability.User.refresh = user => Capability.User.get(user, true);

Capability.clearCache = () =>
    Cache.keys().forEach(key => {
        if (String(key).startsWith('capability_')) {
            Cache.del(key);
        }
    });

export default Capability;
