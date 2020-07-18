import SDK from '@atomic-reactor/reactium-sdk-core';
import _ from 'underscore';
import op from 'object-path';
import API from '../api';
import ActionSequence from 'action-sequence';

const { Hook, Enums, Cache } = SDK;
const Roles = {};
Enums.cache.roles = 10000;

/**
 * Role Hooks
 * ### role.created
 * Triggered after a role has been created. Parameters: role, roles.
 * ### role.removed
 * Triggered after a role has been removed. Parameters: role, roles.
 */

Roles.get = async search => {
    const cacheKey = `Roles.get-${search}`;
    let rolesRequest = Cache.get(cacheKey);

    if (!rolesRequest) {
        rolesRequest = API.Actinium.Cloud.run('roles');
        Cache.set(cacheKey, rolesRequest, Enums.cache.roles);
    }

    const roles = await rolesRequest;

    return _.chain(
        Object.values(roles).filter(
            ({ name, level, objectId }) =>
                !search ||
                name === search ||
                level === search ||
                objectId === search,
        ),
    )
        .sortBy('level')
        .value()
        .reverse()
        .reduce((obj, item) => {
            const { name } = item;
            delete item.ACL;
            delete item.createdAt;
            delete item.updatedAt;
            obj[name] = item;
            return obj;
        }, {});
};

Roles.create = (roleObj = {}, options = { useMasterKey }) => {
    const { label, level = 1, name, roles, acl } = roleObj;
    const roleArray = [
        {
            label,
            level,
            name,
            roles,
            acl,
        },
    ];

    return ActionSequence({
        context: { updatedRoles: {} },
        actions: {
            create: () =>
                API.Actinium.Cloud.run('role-create', { roleArray }, options),
            roles: async ({ context }) => {
                context.updatedRoles = await Roles.get();
            },
            hook: ({ context }) =>
                Hook.run('role.created', role, context.updatedRoles),
        },
    });
};

Roles.remove = (role, options = { useMasterKey }) =>
    ActionSequence({
        context: { updatedRoles: {} },
        actions: {
            remove: () =>
                API.Actinium.Cloud.run('role-remove', { role }, options),
            roles: async ({ context }) => {
                context.updatedRoles = await Roles.get();
            },
            hook: ({ context }) =>
                Hook.run('role.removed', role, context.updatedRoles),
        },
    });

export default Roles;
