import Roles from '../roles';
import Parse from 'appdir/api';
import { useRef, useState, useEffect } from 'react';

/**
 * @api {ReactHook} useCapability(capability) useCapability()
 * @apiDescription React hook to get roles object. If search is provided, will retrieve a specific role.
 * @apiParam {String} capability the name/tag of the capability
 * @apiName useCapability
 * @apiGroup ReactHook
 */
export const useCapability = capability => {
    const ref = useRef({});
    const [stat, update] = useState(1);
    const setRoles = cap => {
        ref.current = cap;
        update(stat + 1);
    };

    useEffect(() => {
        Parse.Cloud.run('capability-get', { capability }).then(cap =>
            setCapability(cap),
        );
    }, [capability]);

    return ref.current;
};
