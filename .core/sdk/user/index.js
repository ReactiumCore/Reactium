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
 * @api {Function} User.auth(username,password) Authenticate with the Actinium server.
 * @apiDescription Authenticate with the Actinium server.
 * @apiName User.auth
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiGroup User
 *
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
 * @api {Function} User.login(username,password) Alias of User.auth()
 * @apiDescription Alias of User.auth()
 * @apiName User.login
 * @apiGroup User
 */
User.logIn = User.auth;

/**
 * @api {Function} User.logOut() Invalidate the current user.
 * @apiDescription Invalidate the current user.
 * @apiName User.logOut
 * @apiGroup User
 */
User.logOut = async () => {
    const u = User.current();

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

User.forgot = email => Parse.Cloud.run('password-reset-request', { email });

User.reset = (token, password) =>
    Parse.Cloud.run('password-reset', { token, password });

/**
 * @api {Function} User.current() Retrieve the current authenticated user.
 * @apiDescription Retrieve the current authenticated user.
 * @apiName User.current
 * @apiSuccess {Object} user the current user
 * @apiGroup User
 */
User.current = () => {
    const u = Parse.User.current();
    return u ? u.toJSON() : {};
};

/**
 * @api {Function} User.getSessionToken() Get the current session token.
 * @apiDescription If the user is logged in, get the current session token.
 * @apiName User.getSessionToken
 * @apiGroup User
 */
User.getSessionToken = () => {
    const u = Parse.User.current();
    return op.get(u, 'getSessionToken', () => false)();
};

/**
 * @api {Function} User.register({...params}) Asyncronously create a new user.
 * @apiDescription Asyncronously create a new user.
 * @apiName User.register
 * @apiParam {String} username Unique username used when authenticating.
 * @apiParam {String} password Password used when authenticating.
 * @apiParam {String} confirm Password confirmation.
 * @apiParam {String} email Email address used when resetting password and for system messaging.
 * @apiSuccess {Promise} user The new user object.
 * @apiGroup User
 */
User.register = async user => {
    await Hook.run('user.before.register', user);
    const newUser = await Parse.Cloud.run('user-save', user);
    await Hook.run('user.after.register', newUser);
    return newUser;
};

/**
 * @api {Function} User.find({userId,username,email}) Asyncronously find a user.
 * @apiDescription Asyncronously find a user.
 * @apiName User.find
 * @apiParam {String} email Search by the email field.
 * @apiParam {String} userId Search by the objectId field.
 * @apiParam {String} username Search by the username field.
 * @apiSuccess {Promise} user The new user object.
 * @apiGroup User
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
 * @api {Function} User.isRole(role,userId) Asyncronously find out if a user is a member of a specific role.
 * @apiDescription Asyncronously find out if a user is a member of a specific role.
 * @apiName User.isRole
 * @apiParam {String} role The role to check for.
 * @apiGroup User
 */
User.isRole = async (role, userId) => {
    userId = userId || op.get(User.current(), 'objectId');
    const u = await User.find({ userId });

    if (!u) {
        return Promise.reject('invalid userId');
    }

    return op.has(u, ['roles', role]);
};

/**
 * @api {Function} User.can(capabilities,userId) Asyncronously find out if a user has a set of capabilities.
 * @apiDescription Asyncronously find out if a user has a set of capabilities.
 * @apiName User.can
 * @apiParam {Mixed} capabilities The capability(s) to check for (string or array). **Note: User must have all of the capabilities you are checking for.
 * @apiParam {String} [userId] The objectId of the user. If empty the current user is used.
 * @apiParam {Boolean} [strict=false] Compare capabilities where the user must have all capabilities `[true]`, or at least 1 `[false]`.
 * @apiGroup User
 */
User.can = async (caps, userId, strict) => {
    caps = _.isString(caps) ? String(caps).replace(' ', '') : caps;
    caps = Array.isArray(caps) ? caps : caps.split(',');

    userId = userId || op.get(User.current(), 'objectId');

    if (!userId) {
        return Promise.resolve(false);
    }

    const u = await User.find({ userId });

    if (!u) {
        return Promise.resolve(false);
    }

    if (op.has(u, ['roles', 'super-admin'])) {
        return Promise.resolve(true);
    }

    await Hook.run('user.can', caps, u);

    if (strict === true) {
        return Promise.resolve(
            _.intersection(caps, op.get(u, 'capabilities', [])).length ===
                caps.length,
        );
    } else {
        return Promise.resolve(
            _.intersection(caps, op.get(u, 'capabilities', [])).length > 0,
        );
    }
};

/**
 * @api {Function} User.Role.add(role, userId) Asyncronously add a user to a role.
 * @apiDescription Asyncronously add a user to a role.
 * @apiName User.Role.add
 * @apiParam {String} role The role name. Example: 'super-admin'.
 * @apiParam {String} [userId] The objectId of the user. If empty the current user is used.
 * @apiSuccess {Promise} user The updated user object.
 * @apiGroup User
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
 * @api {Function} User.Role.remove(role, userId) Asyncronously remove a user to a role.
 * @apiDescription Asyncronously remove a user to a role.
 * @apiName User.Role.remove
 * @apiParam {String} role The role name. Example: 'super-admin'.
 * @apiParam {String} [userId] The objectId of the user. If empty the current user is used.
 * @apiSuccess {Promise} user The updated user object.
 * @apiGroup User
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
