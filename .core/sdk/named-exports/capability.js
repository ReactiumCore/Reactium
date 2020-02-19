import Capability from '../capability';
import Parse from 'appdir/api';
import { useAsyncEffect } from '@atomic-reactor/reactium-sdk-core';
import { useRef, useState, useEffect } from 'react';
import uuid from 'uuid/v4';
import op from 'object-path';

/**
 * @api {ReactHook} useCapabilityCheck(capabilities,strict) useCapabilityCheck()
 * @apiDescription React hook to check a list of capabilities. Uses Reactium.Capability.check().
 * @apiParam {String} capabilities array of 1 or more capabilities
 * @apiParam {Boolean} [strict=true] when true all capabilities must be allowed for current user
 * @apiName useCapabilityCheck
 * @apiGroup ReactHook
 */
export const useCapabilityCheck = (capabilities = [], strict = true) => {
    const allowedRef = useRef(false);
    const [, update] = useState(uuid());
    const setAllowed = allowed => {
        allowedRef.current = allowed;
        update(uuid());
    };

    useAsyncEffect(
        async isMounted => {
            const allowed = await Capability.check(capabilities);
            if (isMounted()) setAllowed(allowed);
        },
        [capabilities.length, strict],
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
    const [, update] = useState(uuid());
    const updateCapRef = cap => {
        ref.current = cap;
        update(uuid);
    };

    useAsyncEffect(
        async isMounted => {
            const cap = await Capability.get(capability);
            console.log({ cap });
            if (isMounted()) updateCapRef(cap);
        },
        [capability],
    );

    return ref.current;
};
