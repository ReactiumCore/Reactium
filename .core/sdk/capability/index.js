import SDK from '@atomic-reactor/reactium-sdk-core';
import _ from 'underscore';
import op from 'object-path';
import Actinium from 'appdir/api';
import User from '../user';

const { Hook, Enums, Cache } = SDK;
Enums.cache.capability = 5000;

const Capability = {};

/**
 * @api {Function} Capability.set(capability,perms) Capability.set()
 * @apiVersion 3.2.1
 * @apiDescription Set permissions on a capability for allowed and excluded roles.
 * @apiName Capability.set
 * @apiGroup Reactium.Capability
 * @apiExample Usage
 import Reactium from 'reactium-core/sdk';

 Capability.set('do-something', {
     allowed: ['contributor'],
     excluded: ['user']
 })
 */
Capability.set = (capability, perms) =>
    Actinium.Cloud.run('capability-edit', {
        capability,
        perms,
    });

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
    capRequest = Actinium.Cloud.run('capability-get', {
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

    checking = Actinium.Cloud.run('capability-check', { capabilities, strict });
    Cache.set(capCheckSignature, checking, Enums.cache.capability);

    return checking;
};

export default Capability;
