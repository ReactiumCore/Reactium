import Hook from '../hook';
import _ from 'underscore';
import op from 'object-path';
import Parse from 'appdir/api';

const User = { Role: {} };

/**
 * ## User Hooks
 * ### user.auth
 * Triggered after the user has successfully authenticated. Parameters: `user`.
 * ### user.before.logout
 * Triggered before the user has been logged out. Parameters: `user`.
 * ### user.after.logout
 * Triggered after the user has successfully logged out. Parameters: `user`.
 * ### user.before.register
 * Triggered before the new user is created. Parameters: `user`.
 * ### user.after.register
 * Triggered after the new user has been created. Parameters: `user`.
 * ### user.find
 * Triggered after successfully finding a user. Parameters: `results`.
 * ### user.can
 * Triggered after the capabilities have been checked for a user. Parameters: `capabilities`, `user`.
 * ### user.role.add
 * Triggered after a user has been added to a role. Parameters: `role`, `user`.
 * ### user.role.remove
 * Triggered after a user has been removed from a role. Parameters: `role`, `user`.
 */

/**
 * @function User.auth(username, password)
 * @description Authenticate with the Actinium server.
 * @param username {String}
 * @param password {String}
 * @returns {Promise}
 */
User.auth = (username, password) =>
    Parse.User.logIn(username, password)
        .then(u => u.fetch())
        .then(u => u.toJSON())
        .then(async u => {
            await Hook.run('user.auth', u);
            return u;
        });

/**
 * @function User.login(username, password)
 * @description Alias of User.auth()
 * @see User.auth()
 */
User.logIn = User.auth;

/**
 * @function User.logOut()
 * @description Invalidate the current user.
 * @returns {Promise}
 */
User.logOut = async () => {
    const u = Uesr.current();

    await Hook.run('user.before.logout', u);

    try {
        return Parse.User.logOut().then(async () => {
            await Hook.run('user.after.logout', u);
            return u;
        });
    } catch (err) {
        return Promise.resolve();
    }
};

/**
 * @function User.current()
 * @description Retrieve the current authenticated user.
 * @returns {Object}
 */
User.current = () => {
    const u = Parse.User.current();
    return u ? u.toJSON() : {};
};

/**
 * @function User.register({...params})
 * @description Asyncronously create a new user.
 * @param params New user object.
 * @prop params.username {String} [required] Unique username used when authenticating.
 * @prop params.password {String} [required] Password used when authenticating.
 * @prop params.confirm {String} [required] Password confirmation.
 * @prop params.email {String} [required] Email address used when resetting password and for system messaging.
 * @returns {Object} The new user object.
 */
User.register = async user => {
    await Hook.run('user.before.register', user);
    const newUser = await Parse.Cloud.run('user-save', user);
    await Hook.run('user.after.register', newUser);
    return newUser;
};

/**
 * @function User.find({ objectId, username, email })
 * @description Asyncronously find a user.
 * @param params Query parameters.
 * @property params.email {String} Search by the email field.
 * @property params.userId {String} Search by the objectId field.
 * @property params.username {String} Search by the username field.
 * @returns {Object} The user object.
 */
User.find = async ({ userId, username, email }) => {
    const current = User.current();

    const u = await Parse.Cloud.run('user-find', {
        objectId: userId,
        username,
        email,
    });

    if (op.get(u, 'objectId') === op.get(current, 'objectId')) {
        await Parse.User.current().fetch();
    }

    if (u) {
        await Hook.run('user.find', u);
    }

    return u;
};

/**
 * @function User.isRole(role, userId)
 * @description Asyncronously find out if a user is a member of a specific role.
 * @param role {String} The role to check for.
 * @param userId {String} [optional] The objectId of the user. If empty the current user is used.
 * @erturns {Boolean}
 */
User.isRole = async (role, userId) => {
    const u = userId ? await User.find({ objectId: userId }) : User.current();

    if (!u) {
        return Promise.reject('invalid userId');
    }

    return op.has(u, ['roles', role]);
};

/**
 * @function User.can(capabilities, userId)
 * @description Asyncronously find out if a user has a set of capabilities.
 * @param capabilities {String|Array} The capabilities to check for. **Note: User must have all of the capabilities you are checking for.
 * @param userId {String} [optional] The objectId of the user. If empty the current user is used.
 * @erturns {Boolean}
 */
User.can = async (caps, userId) => {
    caps = _.isSring(caps) ? String(caps).replace(' ', '') : caps;
    caps = Array.isArray(caps) ? caps : caps.split(',');
    const u = userId ? await User.find({ objectId: userId }) : User.current();

    if (!u) {
        return Promise.reject('invalid userId');
    }

    if (op.has(u, ['roles', 'super-admin'])) {
        return true;
    }

    await Hook.run('user.can', caps, u);

    return (
        _.intersection(caps, op.get(u, 'capabilities', [])).length ===
        caps.length
    );
};

/**
 * @function User.Role.add(role, userId)
 * @description Asyncronously add a user to a role.
 * @param role {String} The role name. Example: 'super-admin'.
 * @param userId {String} [optional] The objectId of the user. If empty the current user is used.
 * @returns {Object} The updated user object.
 */
User.Role.add = async (role, userId) => {
    const u = userId || op.get(User.current(), 'objectId');
    if (!u) {
        return Promise.reject('invalid userId');
    }

    return Parse.Cloud.run('role-user-add', { role, user: u })
        .then(() => User.find({ userId: u }))
        .then(async u => {
            await Hook.run('user.role.add', role, u);
            return u;
        });
};

/**
 * @function User.Role.remove(role, userId)
 * @description Asyncronously remove a user to a role.
 * @param role {String} The role name. Example: 'super-admin'.
 * @param userId {String} [optional] The objectId of the user. If empty the current user is used.
 * @returns {Object} The updated user object.
 */
User.Role.remove = (role, userId) => {
    const u = userId || op.get(User.current(), 'objectId');
    if (!u) {
        return Promise.reject('invalid userId');
    }

    return Parse.Cloud.run('role-user-remove', { role, user: u })
        .then(() => User.find({ userId: u }))
        .then(async u => {
            await Hook.run('user.role.remove', role, u);
            return u;
        });
};

export default User;
