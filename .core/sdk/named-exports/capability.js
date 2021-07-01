import { useAsyncEffect } from '@atomic-reactor/reactium-sdk-core';
import { useRef, useState, useEffect } from 'react';
import _ from 'underscore';

/**
 * @api {ReactHook} useCapabilityCheck(capabilities,strict) useCapabilityCheck()
 * @apiDescription React hook to check a list of capabilities. Uses Reactium.Capability.check().
 * @apiParam {String} capabilities array of 1 or more capabilities
 * @apiParam {Boolean} [strict=true] when true all capabilities must be allowed for current user
 * @apiName useCapabilityCheck
 * @apiGroup ReactHook
 */
export const useCapabilityCheck = (capabilities, strict = true) => {
    const allowedRef = useRef(false);
    const [, update] = useState(new Date());
    const caps = _.uniq(_.compact(_.flatten([capabilities])));
    const { default: SDK } = require('reactium-core/sdk');

    useAsyncEffect(
        async isMounted => {
            allowedRef.current = false;
            if (caps.length < 1) {
                allowedRef.current = true;
            } else {
                allowedRef.current = await SDK.Capability.check(caps);
            }

            if (isMounted()) update(new Date());
        },
        [caps.sort().join(''), strict],
    );

    return allowedRef.current;
};

/**
 * @api {ReactHook} useCapability(capability) useCapability()
 * @apiDescription React hook to get capability object.
 * @apiParam {String} capability the name/tag of the capability
 * @apiName useCapability
 * @apiGroup ReactHook
 */
export const useCapability = capability => {
    const ref = useRef({});
    const [, update] = useState(new Date());
    const updateCapRef = cap => {
        ref.current = cap;
        update(new Date());
    };
    const { default: SDK } = require('reactium-core/sdk');

    useAsyncEffect(
        async isMounted => {
            const cap = await SDK.Capability.get(capability);
            if (isMounted()) updateCapRef(cap);
        },
        [capability],
    );

    return ref.current;
};
