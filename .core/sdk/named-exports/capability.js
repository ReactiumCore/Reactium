import Capability from '../capability';
import Parse from 'appdir/api';
import { useRef, useState, useEffect } from 'react';

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
    const [stat, update] = useState(1);
    const updateAllowed = cap => {
        allowedRef.current = cap;
        update(stat + 1);
    };

    useEffect(() => {
        Capability.check(capabilities).then(cap => updateAllowed(cap));
    }, [capabilities.length, strict]);

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
    const [stat, update] = useState(1);
    const updateCapRef = cap => {
        ref.current = cap;
        update(stat + 1);
    };

    useEffect(() => {
        Capability.get(capability).then(cap => updateCapRef(cap));
    }, [capability]);

    return ref.current;
};
