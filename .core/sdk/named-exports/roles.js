import Roles from '../roles';
import { useRef, useState, useEffect } from 'react';

/**
 * @api {ReactHook} useRoles(search) useRoles()
 * @apiDescription React hook to get roles object. If search is provided, will retrieve a specific role.
 * @apiParam {String} [search] Name, level or object id of the roles to retrieve. If not provide, an object will all roles will be returned.
 * @apiName useRoles
 * @apiGroup ReactHook
 */
export const useRoles = search => {
    const ref = useRef({});
    const [stat, update] = useState(1);
    const setRoles = roles => {
        ref.current = roles;
        update(stat + 1);
    };

    useEffect(() => {
        Roles.get(search).then(roles => setRoles(roles));
    }, [search]);

    return ref.current;
};
