import SDK from '@atomic-reactor/reactium-sdk-core';
import _ from 'underscore';
import op from 'object-path';
import API from '../api';
import User from '../user';

const { Hook, Enums, Cache } = SDK;
Enums.cache.capability = 5000;

const Capability = {};

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
Capability.get = capability => {
    const caps = _.chain([capability])
        .flatten()
        .uniq()
        .value()
        .sort();
    const cacheKey = `capRequest-${capability.join('-').replace(/\./g, '_')}`;
    let capRequest = Cache.get(cacheKey);

    if (capRequest) return capRequest;
    capRequest = API.Actinium.Cloud.run('capability-get', {
        capability,
    });

    Cache.set(cacheKey, capRequest, Enums.cache.capability);
    return capRequest;
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
Capability.check = async (capabilities = [], strict = true) => {
    capabilities = _.compact(_.flatten([capabilities]));

    // null request
    if (capabilities.length < 1) {
        return true;
    }

    const valid = await User.hasValidSession();
    if (!valid) return false;

    // Prevent Rapid Duplicate Cap Checks from reaching server
    const capCheckSignature = capabilities
        .sort()
        .concat([strict ? 'strict' : 'loose'])
        .join('-')
        .replace(/\./g, '_');

    let checking = Cache.get(capCheckSignature);
    if (checking) return checking;

    checking = API.Actinium.Cloud.run('capability-check', {
        capabilities,
        strict,
    });
    Cache.set(capCheckSignature, checking, Enums.cache.capability);

    return checking;
};

export default Capability;
