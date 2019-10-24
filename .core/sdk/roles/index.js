import Hook from '../hook';
import _ from 'underscore';
import op from 'object-path';
import Parse from 'appdir/api';
import ActionSequence from 'action-sequence';

const Roles = {};

/**
 * Role Hooks
 * ### role.created
 * Triggered after a role has been created. Parameters: role, roles.
 * ### role.removed
 * Triggered after a role has been removed. Parameters: role, roles.
 */

Roles.get = async search => {
    const roles = await Parse.Cloud.run('roles');

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
                Parse.Cloud.run('role-create', { roleArray }, options),
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
            remove: () => Parse.Cloud.run('role-remove', { role }, options),
            roles: async ({ context }) => {
                context.updatedRoles = await Roles.get();
            },
            hook: ({ context }) =>
                Hook.run('role.removed', role, context.updatedRoles),
        },
    });

export default Roles;
