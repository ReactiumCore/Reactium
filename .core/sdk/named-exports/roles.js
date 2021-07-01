import { useRef, useState } from 'react';
import { useAsyncEffect } from '@atomic-reactor/reactium-sdk-core';
import uuid from 'uuid/v4';

/**
 * @api {ReactHook} useRoles(search) useRoles()
 * @apiDescription React hook to get roles object. If search is provided, will retrieve a specific role.
 * @apiParam {String} [search] Name, level or object id of the roles to retrieve. If not provide, an object will all roles will be returned.
 * @apiName useRoles
 * @apiGroup ReactHook
 */
export const useRoles = search => {
    const ref = useRef({});
    const [, update] = useState(uuid());
    const setRoles = roles => {
        ref.current = roles;
        update(uuid());
    };
    const { default: SDK } = require('reactium-core/sdk');

    useAsyncEffect(
        async isMounted => {
            const roles = await SDK.Roles.get(search);
            if (isMounted()) setRoles(roles);
        },
        [search],
    );

    return ref.current;
};
