import SDK from '@atomic-reactor/reactium-sdk-core';
import _ from 'underscore';
import op from 'object-path';
import API from '../api';
import User from '../user';

const { Hook, Enums, Cache } = SDK;
Enums.cache.capability = 60000;

const Capability = { User: {}, request: {} };

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

Capability.grant = (capability, role) =>
    API.Actinium.Cloud.run('capability-grant', { capability, role });

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
Capability.revoke = (capability, role) =>
    API.Actinium.Cloud.run('capability-revoke', { capability, role });

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
    API.Actinium.Cloud.run('capability-restrict', { capability, role });

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
    API.Actinium.Cloud.run('capability-unrestrict', { capability, role });

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
Capability.check = async (checks, strict = true) => {
    const isValidUser = await User.hasValidSession();
    if (!isValidUser) return false;

    checks = _.chain([checks])
        .flatten()
        .uniq()
        .value()
        .map(cap => String(cap).toLowerCase());

    const u = User.current(true);
    const caps = await Capability.User.get(u.id);

    const match = _.intersection(caps, checks);

    return strict === true ? match.length === checks.length : match.length > 0;
};

/**
 * @api {Function} Capability.check(capabilities,strict) Capability.check
 * @apiVersion 3.2.1
 * @apiDescription Check a list of capabilities on the current user and return the results as an object with the capabilities as keys and Boolean value.
 * @apiParam {Array} capabilities list of string capabilities to check, returns true if current user is allowed, false if not allowed
 * @apiName Capability.check
 * @apiGroup Reactium.Capability
 */
Capability.checkAll = async checks => {
    checks = _.chain([checks])
        .flatten()
        .uniq()
        .value()
        .map(cap => String(cap).toLowerCase());

    const isValidUser = await User.hasValidSession();

    let results = {};

    if (!isValidUser) {
        results = checks.reduce((obj, cap) => {
            obj[cap] = false;
            return obj;
        }, {});
    } else {
        const u = User.current(true);
        const caps = await Capability.User.get(u.id);

        results = checks.reduce((obj, cap) => {
            obj[cap] = caps.includes(cap);
            return obj;
        }, {});
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

Capability.watch = async () => {
    const valid = await User.hasValidSession();
    if (!valid) return;
};

export default Capability;
