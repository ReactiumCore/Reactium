import SDK from '@atomic-reactor/reactium-sdk-core';
import _ from 'underscore';
import op from 'object-path';
import Parse from 'appdir/api';

const { Hook, Enums, Cache } = SDK;
const User = { Role: {} };

/**
 * @api {Function} User.auth(username,password) User.auth()
 * @apiDescription Authenticate with the Actinium server.
 * @apiName User.auth
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiGroup Reactium.User
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
 * @api {Function} User.login(username,password) User.login()
 * @apiDescription Alias of User.auth()
 * @apiName User.login
 * @apiGroup Reactium.User
 */
User.logIn = User.auth;

/**
 * @api {Function} User.logOut() User.logOut()
 * @apiDescription Invalidate the current user.
 * @apiName User.logOut
 * @apiGroup Reactium.User
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
 * @api {Function} User.current(parseObject) User.current()
 * @apiDescription Retrieve the current authenticated user.
 * @apiName User.current
 * @apiSuccess {Object} user the current user
 * @apiGroup Reactium.User
 * @apiParam {Boolean} [parseObject=false] By default the return value is an object. If you need the Parse.User object instead pass `true`.
 */
User.current = (parseObject = false) => {
    const u = Parse.User.current();
    return u ? (parseObject === true ? u : u.toJSON()) : null;
};

/**
 * @api {Function} User.getSessionToken() User.getSessionToken()
 * @apiDescription If the user is logged in, get the current session token.
 * @apiName User.getSessionToken
 * @apiGroup Reactium.User
 */
User.getSessionToken = () => {
    const u = Parse.User.current();
    return u ? u.getSessionToken() : false;
};

/**
 * @api {Function} hasValidSession() hasValidSession()
 * @apiDescription Check to make sure the current user and associated session are valid.
 * @apiName User.hasValidSession
 * @apiGroup Reactium.User
 */
User.hasValidSession = async () => {
    let valid = Cache.get('session-validate');
    if (typeof valid === 'undefined') {
        try {
            await Parse.Cloud.run('session-validate');
            valid = true;
        } catch (error) {
            // Clear front-end cache as soon as we know session is invalid
            Cache.clear();
            valid = false;
        }
        Cache.set('session-validate', valid, 5000);
    }

    return valid;
};

/**
 * @api {Function} User.register({...params}) User.register()
 * @apiDescription Asyncronously create a new user.
 * @apiName User.register
 * @apiParam {String} username Unique username used when authenticating.
 * @apiParam {String} password Password used when authenticating.
 * @apiParam {String} confirm Password confirmation.
 * @apiParam {String} email Email address used when resetting password and for system messaging.
 * @apiSuccess {Promise} user The new user object.
 * @apiGroup Reactium.User
 */
User.register = async user => {
    await Hook.run('user.before.register', user);
    const newUser = await Parse.Cloud.run('user-save', user);
    await Hook.run('user.after.register', newUser);
    return newUser;
};

/**
 * @api {Function} User.find({userId,username,email}) User.find()
 * @apiDescription Asyncronously find a user.
 * @apiName User.find
 * @apiParam {String} email Search by the email field.
 * @apiParam {String} userId Search by the objectId field.
 * @apiParam {String} username Search by the username field.
 * @apiSuccess {Promise} user The new user object.
 * @apiGroup Reactium.User
 */
User.find = async ({ userId, username, email }) => {
    const current = User.current() || {};

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
 * @api {Function} User.isRole(role,userId) User.isRole()
 * @apiDescription Asyncronously find out if a user is a member of a specific role.
 * @apiName User.isRole
 * @apiParam {String} role The role to check for.
 * @apiGroup Reactium.User
 */
User.isRole = async (role, userId) => {
    const current = User.current() || {};

    userId = userId || op.get(current, 'objectId');
    const u = await User.find({ userId });

    if (!u) {
        return Promise.reject('invalid userId');
    }

    return op.has(u, ['roles', role]);
};

/**
 * @api {Function} User.can(capabilities,strict) User.can()
 * @apiDescription Asyncronously find out if a user has a set of capabilities.
 * @apiName User.can
 * @apiParam {Mixed} capabilities The capability(s) to check for (string or array)
 * @apiParam {Boolean} [strict=true] Compare capabilities where the user must have all capabilities `[true]`, or at least 1 `[false]`.
 * @apiGroup Reactium.User
 */
User.can = async (capabilities = [], strict = true) => {
    const context = await Hook.run('capability-check', capabilities, strict);
    return op.get(context, 'permitted') === true;
};

/**
 * @api {Function} User.Role.add(role,userId) User.Role.add()
 * @apiDescription Asyncronously add a user to a role.
 * @apiName User.Role.add
 * @apiParam {String} role The role name. Example: 'super-admin'.
 * @apiParam {String} [userId] The objectId of the user. If empty the current user is used.
 * @apiSuccess {Promise} user The updated user object.
 * @apiGroup Reactium.User
 */
User.Role.add = async (role, userId) => {
    const current = User.current() || {};

    const u = userId || op.get(current, 'objectId');

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
 * @api {Function} User.Role.remove(role,userId) User.Role.remove()
 * @apiDescription Asyncronously remove a user to a role.
 * @apiName User.Role.remove
 * @apiParam {String} role The role name. Example: 'super-admin'.
 * @apiParam {String} [userId] The objectId of the user. If empty the current user is used.
 * @apiSuccess {Promise} user The updated user object.
 * @apiGroup Reactium.User
 */
User.Role.remove = (role, userId) => {
    const current = User.current() || {};

    const u = userId || op.get(current, 'objectId');

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
