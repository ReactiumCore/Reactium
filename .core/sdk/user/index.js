import SDK from '@atomic-reactor/reactium-sdk-core';
import _ from 'underscore';
import op from 'object-path';
import Parse from 'appdir/api';

const { Hook, Enums, Cache } = SDK;
const User = { Role: {} };

Enums.cache.sessionValidate = 5000;

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
 * @apiGroup Reactium.User
 * @apiName User.current
 * @apiSuccess {Object} user the current user
 * @apiDescription Retrieve the current authenticated user.
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
 * @api {Function} User.hasValidSession() User.hasValidSession()
 * @apiDescription Check to make sure the current user and associated session are valid.
 * @apiName User.hasValidSession
 * @apiGroup Reactium.User
 */
User.hasValidSession = async () => {
    let request = Cache.get('session-validate');
    if (request) {
        return request;
    }

    request = Parse.Cloud.run('session-validate')
        .then(() => Promise.resolve(true))
        .catch(() => Promise.resolve(false));

    Cache.set('session-validate', request, Enums.cache.sessionValidate);

    return request;
};

/**
 * @api {Function} User.register(params) User.register()
 * @apiDescription Asyncronously create a new user.
 * @apiName User.register
 * @apiParam (params) {String} username Unique username used when authenticating.
 * @apiParam (params) {String} password Password used when authenticating.
 * @apiParam (params) {String} confirm Password confirmation.
 * @apiParam (params) {String} email Email address used when resetting password and for system messaging.
 * @apiSuccess {Promise} user The new user object.
 * @apiGroup Reactium.User
 */
User.register = async user => {
    await Hook.run('user.before.register', user);
    let response = await Parse.Cloud.run('user-save', user);
    await Hook.run('user.after.register', response);
    return response;
};

/**
 * @api {Asyncronous} User.list(params) User.list()
 * @apiGroup Reactium.User
 * @apiName User.list
 * @apiDescription Retrieve a list of `Parse.User` objects. Calls the `user-list` cloud function.
 * @apiParam (params) {String} [role] Filter the results to the specified `Parse.Role` name.
 * @apiParam (params) {String} [search] Search using logical `or`. The query will RegExp compare to the default fields: `username`, `email`, `fname`, `lname`.

_Note:_ You can add or remove fields via the `user-search-fields` hook.
 * @apiParam (params) {Mixed} [objectId] `{String|Array}` Search for a specific objectId or array of objectIds.

 _Note:_ If `search` is specified, this value is ignored.
 * @apiParam (params) {Mixed} [email] `{String|Array}` Search for a specific email address or array of email addresses.

 _Note:_ If `search` is specified, this value is ignored.
 * @apiParam (params) {Mixed} [username] `{String|Array}` Search for a specific username or array of usernames.

 _Note:_ If `search` is specified, this value is ignored.
 * @apiParam (params) {Boolean} [optimize=false] If the count of the results is less than or equal to 1000, all objects will be returned. The page number will be set to 1 and the number of pages will also be 1.
 * @apiParam (params) {Boolean} [refresh=false] By default the results are cached for 90 seconds. You can flush the cache with this parameter.
 * @apiParam (params) {String} [indexBy] Index the results by the specified field and return them as an Object.
 * @apiParam (params) {String} [order] Order the results `ascending` or `descending`.
 * @apiParam (params) {String} [orderBy='username'] Order the results by the specified field.
 * @apiParam (params) {Number} [page=1] The page number of results to return.
 * @apiParam (params) {Number} [limit=20] The number of results to return per page.
 * @apiParam (hooks) {Hook} before-user-list Triggered before the user-list Cloud function is called.
```
Arguments: params:Object
```
 * @apiParam (hooks) {Hook} user-list-response Triggered after the user-list Cloud function is called.
 ```
 Arguments: response:Object, params:Object
 ```
 * @apiExample Usage:
const superAdmins = await User.list({ role: 'super-admin', refresh: true });

const user = await User.list({ objectId: 'tlakQ34VOI' });

const search = await User.list({ search: 'jeff' });
 */
User.list = async params => {
    await Hook.run('before-user-list', params);
    let response = await Parse.Cloud.run('user-list', params);
    await Hook.run('user-list-response', response, params);
    return response;
};

/**
 * @api {Asyncronous} User.save(params) User.save()
 * @apiGroup Reactium.User
 * @apiName User.save
 * @apiDescription Save a `Parse.User` object.
 * @apiParam {Object} params Key value pairs to apply to the `Parse.User` object. Calls the `user-save` cloud function.

_Note:_ Any additional key value pairs will be added to the user object as a new column.

 * @apiParam (params) {String} username The unique username used when signing in.
 * @apiParam (params) {String} email The email address to associate with the user account.
 * @apiParam (params) {String} password The password used when signing in.
 * @apiParam (params) {String} [role] The `Parse.Role` name to add the user to.
 * @apiParam (hooks) {Hook} user-before-save Mutate the `Parse.User` object before save is complete.

```
Arguments:  req:Object:Parse.User
```
 * @apiParam (hooks) {Hook} user-after-save Take action after the `Parse.User` object has been saved.
```
Arguments: req:Object:Parse.User
```
*/
User.save = async params => {
    await Hook.run('before-user-save', params);
    const response = await Parse.Cloud.run('user-save', params);
    await Hook.run('user-save-response', response, params);
    return response;
};

/**
 * @api {Asyncronous} User.trash(params) User.trash()
 * @apiGroup Reactium.User
 * @apiName User.trash
 * @apiDescription Send a single `Parse.User` object to the recycle bin. Calls `user-trash` cloud function.
 * @apiParam {Object} params Object containing parameters for deleting a user.
 * @apiParam (params) {String} objectId The Parse.User objectId.
 * @apiParam (hooks) {Hook} before-user-trash Triggered before the `user-trash` cloud function is run.
```
Arguments: user:Parse.User
```
 * @apiParam (hooks) {Hook} user-trash Triggered after the `user-trash` cloud function is run.
 ```
 Arguments: user:Parse.User
 ```
 */
User.trash = async objectId => {
    const user = await User.retrieve({ objectId });
    await Hook.run('before-user-trash', user);
    await Parse.Cloud.run('user-trash', { objectId });
    await Hook.run('user-trash', user);
    return user;
};

/**
 * @api {Asyncronous} User.retrieve(params,options) User.retrieve()
 * @apiGroup Reactium.User
 * @apiName User.retrieve
 * @apiDescription Retrieve a single `Parse.User` object. Calls the `user-retrieve` cloud function.
 * @apiParam {Object} params Query parameters. See [User.list()](#api-Reactium.User-User.list) for more details.
 * @apiParam (params) {String} [objectId] Retrieve by the objectId field.
 * @apiParam (params) {String} [username] Retrieve by the username field.
 * @apiParam (params) {String} [email] Retrieve by the email address field.
 * @apiParam (hooks) {Hook} before-user-retrieve Triggered before the `user-retrieve` cloud function is called.
```
Arguments: params:Object
```
 * @apiParam (hooks) {Hook} user-retrieve Triggered after the `user-retrieve` cloud function is called.
```
Arguments: user:Object, params:Object
```
 */
User.retrieve = async params => {
    await Hook.run('before-user-retrieve', params);
    const response = await Parse.Cloud.run('user-retrieve', params);
    await Hook.run('user-retrieve', response, params);
    return response;
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
