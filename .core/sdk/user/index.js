import SDK from '@atomic-reactor/reactium-sdk-core';
import _ from 'underscore';
import op from 'object-path';
import Actinium from 'appdir/api';

const { Hook, Enums, Cache, Utils } = SDK;
const User = { Meta: {}, Pref: {}, Role: {}, selected: null };

Enums.cache.sessionValidate = 5000;

/**
 * @api {Asyncronous} User.auth(username,password) User.auth()
 * @apiDescription Authenticate with the Actinium server.
 * @apiName User.auth
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiGroup Reactium.User
 *
 */
User.auth = (username, password) =>
    Actinium.User.logIn(username, password)
        .then(u => u.fetch())
        .then(u => u.toJSON())
        .then(async u => {
            await Hook.run('user.auth', u);
            return u;
        });

/**
 * @api {Function} User.serialize(user) User.serialize()
 * @apiGroup Reactium.User
 * @apiName User.serialize
 * @apiParam {Object} Convert a `Actinium.User` object into a JSON object. If the object is already serialized it is returned.
 * @apiExample Usage:
const u = User.serialize(user);
 */
User.serialize = user => {
    return typeof user.toJSON === 'function' ? user.toJSON() : user;
};

/**
 * @api {Asyncronous} User.login(username,password) User.login()
 * @apiDescription Alias of User.auth()
 * @apiName User.login
 * @apiGroup Reactium.User
 */
User.logIn = User.auth;

/**
 * @api {Asyncronous} User.logOut() User.logOut()
 * @apiDescription Invalidate the current user.
 * @apiName User.logOut
 * @apiGroup Reactium.User
 */
User.logOut = async () => {
    const u = User.current();

    await Hook.run('user.before.logout', u);

    try {
        return Actinium.User.logOut().then(async () => {
            await Hook.run('user.after.logout', u);
            return u;
        });
    } catch (err) {
        return Promise.resolve();
    }
};

/**
 * @api {Asyncronous} User.forgot() User.forgot()
 * @apiGroup Reactium.User
 * @apiName User.forgot
 * @apiDescription Intiates the forgot password routine.
 * @apiParam {String} email The email address associated with a user object.
 * @apiExample Usage:
User.forgot('someone@email.com').then(response => {
    console.log(response);
});
 */
User.forgot = email => Actinium.Cloud.run('password-reset-request', { email });

/**
 * @api {Asyncronous} User.reset() User.reset()
 * @apiGroup Reactium.User
 * @apiName User.reset
 * @apiDescription Reset the user password.
 * @apiParam {String} token The token received from the `User.forgot()` email message.
 * @apiParam {String} password The new password.
 */
User.reset = (token, password) =>
    Actinium.Cloud.run('password-reset', { token, password });

/**
 * @api {Function} User.current(parseObject) User.current()
 * @apiGroup Reactium.User
 * @apiName User.current
 * @apiSuccess {Object} user the current user
 * @apiDescription Retrieve the current authenticated user.
 * @apiParam {Boolean} [parseObject=false] By default the return value is an object. If you need the Actinium.User object instead pass `true`.
 */
User.current = (parseObject = false) => {
    const u = Actinium.User.current();
    return u ? (parseObject === true ? u : u.toJSON()) : null;
};

/**
 * @api {Function} User.isCurrent(user) User.isCurrent()
 * @apiGroup Reactium.User
 * @apiName User.isCurrent
 * @apiParam {Object} The User object to check.
 * @apiExample Usage:
// if signed in as steveMcQu33n this will return true.
const isMe = User.isCurrent({ username: 'steveMcQu33n' });
 */
User.isCurrent = user => {
    const current = User.current();

    if (typeof user.toJSON === 'function') {
        user = user.toJSON();
    }

    if (op.get(user, 'objectId') === op.get(current, 'objectId')) return true;
    if (op.get(user, 'username') === op.get(current, 'username')) return true;
    if (op.get(user, 'email') === op.get(current, 'email')) return true;

    return false;
};

/**
 * @api {Function} User.getSessionToken() User.getSessionToken()
 * @apiDescription If the user is logged in, get the current session token.
 * @apiName User.getSessionToken
 * @apiGroup Reactium.User
 */
User.getSessionToken = () => {
    const u = Actinium.User.current();
    return u ? u.getSessionToken() : false;
};

/**
 * @api {Asyncronous} User.hasValidSession() User.hasValidSession()
 * @apiDescription Check to make sure the current user and associated session are valid.
 * @apiName User.hasValidSession
 * @apiGroup Reactium.User
 */
User.hasValidSession = async () => {
    if (!User.current()) return false;

    let request = Cache.get('session-validate');
    if (request) {
        return request;
    }

    request = Actinium.Cloud.run('session-validate')
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
    let response = await Actinium.Cloud.run('user-save', user);
    await Hook.run('user.after.register', response);
    return response;
};

/**
 * @api {Asyncronous} User.list(params) User.list()
 * @apiGroup Reactium.User
 * @apiName User.list
 * @apiDescription Retrieve a list of `Actinium.User` objects. Calls the `user-list` cloud function.
 * @apiParam (params) {String} [role] Filter the results to the specified `Actinium.Role` name.
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
    let response = await Actinium.Cloud.run('user-list', params);
    await Hook.run('user-list-response', response, params);
    return response;
};

/**
 * @api {Asyncronous} User.save(params) User.save()
 * @apiGroup Reactium.User
 * @apiName User.save
 * @apiDescription Save a `Actinium.User` object.
 * @apiParam {Object} params Key value pairs to apply to the `Actinium.User` object. Calls the `user-save` cloud function.

_Note:_ Any additional key value pairs will be added to the user object as a new column.

 * @apiParam (params) {String} username The unique username used when signing in.
 * @apiParam (params) {String} email The email address to associate with the user account.
 * @apiParam (params) {String} password The password used when signing in.
 * @apiParam (params) {String} [role] The `Actinium.Role` name to add the user to.
 * @apiParam (hooks) {Hook} before-user-save Mutate the `Actinium.User` object before save is complete.
```
Arguments:  req:Object:Actinium.User
```
 * @apiParam (hooks) {Hook} user-save-response Take action after the `Actinium.User` object has been saved.
```
Arguments: req:Object:Actinium.User
```
  * @apiParam (hooks) {Hook} user-save-error Take action after the `Actinium.User` returns an error.
```
Arguments: error:Object, params:Object
```
*/
User.save = async params => {
    const exclude = [
        'ACL',
        'capabilities',
        'createdAt',
        'emailVerified',
        'updatedAt',
    ];

    exclude.forEach(field => op.del(params, field));

    await Hook.run('before-user-save', params);

    return Actinium.Cloud.run('user-save', params)
        .then(async response => {
            if (_.isError(response)) {
                await Hook.run('user-save-error', response, params);
                throw new Error(response);
            } else {
                await Hook.run('user-save-response', response, params);
                return response;
            }
        })
        .catch(async err => {
            await Hook.run('user-save-error', err, params);
            return err;
        });
};

/**
 * @api {Asyncronous} User.trash(params) User.trash()
 * @apiGroup Reactium.User
 * @apiName User.trash
 * @apiDescription Send a single `Actinium.User` object to the recycle bin. Calls `user-trash` cloud function.
 * @apiParam {Object} params Object containing parameters for deleting a user.
 * @apiParam (params) {String} objectId The Actinium.User objectId.
 * @apiParam (hooks) {Hook} before-user-trash Triggered before the `user-trash` cloud function is run.
```
Arguments: user:Actinium.User
```
 * @apiParam (hooks) {Hook} user-trash Triggered after the `user-trash` cloud function is run.
 ```
 Arguments: user:Actinium.User
 ```
 */
User.trash = async objectId => {
    const user = await User.retrieve({ objectId });
    await Hook.run('before-user-trash', user);
    await Actinium.Cloud.run('user-trash', { objectId });
    await Hook.run('user-trash', user);
    return user;
};

/**
 * @api {Asyncronous} User.retrieve(params,options) User.retrieve()
 * @apiGroup Reactium.User
 * @apiName User.retrieve
 * @apiDescription Retrieve a single `Actinium.User` object. Calls the `user-retrieve` cloud function.
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
    const response = await Actinium.Cloud.run('user-retrieve', params);
    await Hook.run('user-retrieve', response, params);
    return response;
};

/**
 * @api {Asyncronous} User.isRole(role,objectId) User.isRole()
 * @apiDescription Asyncronously find out if a user is a member of a specific role.
 * @apiName User.isRole
 * @apiParam {String} role The role to check for.
 * @apiParam {String} [objectId] The objectId of the user. If empty, the User.current() object is used.
 * @apiGroup Reactium.User
 */
User.isRole = async (role, objectId) => {
    const current = User.current() || {};

    objectId = objectId || op.get(current, 'objectId');
    const u = await User.retrieve({ objectId });

    if (!u) {
        return Promise.reject('invalid user id');
    }

    return op.has(u, ['roles', role]);
};

/**
 * @api {Asyncronous} User.can(capabilities,strict) User.can()
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
 * @api {Function} User.Role.add(role,objectId) User.Role.add()
 * @apiDescription Asyncronously add a user to a role.
 * @apiName User.Role.add
 * @apiParam {String} role The role name. Example: 'super-admin'.
 * @apiParam {String} [objectId] The objectId of the user. If empty the current user is used.
 * @apiSuccess {Promise} user The updated user object.
 * @apiGroup Reactium.User
 */
User.Role.add = async (role, objectId) => {
    const current = User.current() || {};

    const u = objectId || op.get(current, 'objectId');

    if (!u) {
        return Promise.reject('invalid user id');
    }

    return Actinium.Cloud.run('role-user-add', { role, user: u })
        .then(() => User.retrieve({ objectId: u, refresh: true }))
        .then(async u => {
            await Hook.run('user.role.add', role, u);
            return u;
        });
};

/**
 * @api {Function} User.Role.remove(role,objectId) User.Role.remove()
 * @apiDescription Asyncronously remove a user to a role.
 * @apiName User.Role.remove
 * @apiParam {String} role The role name. Example: 'super-admin'.
 * @apiParam {String} [objectId] The objectId of the user. If empty the current user is used.
 * @apiSuccess {Promise} user The updated user object.
 * @apiGroup Reactium.User
 */
User.Role.remove = (role, objectId) => {
    const current = User.current() || {};

    const u = objectId || op.get(current, 'objectId');

    if (!u) {
        return Promise.reject('invalid user id');
    }

    return Actinium.Cloud.run('role-user-remove', { role, user: u })
        .then(() => User.retrieve({ objectId: u, refresh: true }))
        .then(async u => {
            await Hook.run('user.role.remove', role, u);
            return u;
        });
};

/**
 * @api {Asyncronous} User.Meta.update(params) User.Meta.update()
 * @apiGroup Reactium.User
 * @apiName User.Meta.update
 * @apiDescription Mutate the `Actinium.User.meta` object. Calls the `user-meta-update` cloud function.
 * @apiParam {Object} params Object containing parameters for retrieving a user and the key value pair to apply to the user meta object.
 * @apiParam (params) {String} [objectId] Look up the user object by the objectId field. See [User.retrieve()](#api-Reactium.User-User.retrieve).
 * @apiParam (params) {String} [username] Look up the user object by the username field. See [User.retrieve()](#api-Reactium.User-User.retrieve).
 * @apiParam (params) {String} [email] Look up the user object by the email field. See [User.retrieve()](#api-Reactium.User-User.retrieve).
 * @apiParam (hooks) {Hook} before-user-meta-update Triggered before the `user-meta-update` cloud function is called.
```
Arguments: params:Object
```
 * @apiParam (hooks) {Hook} user-meta-update-response Triggered after the `user-meta-update` cloud function is called.
```
Arguments: user:Actinium.user, params:Object
```
 * @apiExample
const updatedUser = await User.Meta.update({ objectId: 'slertjt5wzb', random: 'meta value' });
 */
User.Meta.update = async params => {
    await Hook.run('before-user-meta-update', params);
    const response = await Actinium.Cloud.run('user-meta-update', params);
    await Hook.run('user-meta-update-response', response, params);
    return response;
};

/**
 * @api {Asyncronous} User.Meta.delete(params) User.Meta.delete()
 * @apiGroup Reactium.User
 * @apiName User.Meta.delete
 * @apiDescription Mutate the `Actinium.User.meta` object by deleting a key value pair. Calls the `user-meta-delete` cloud function.
 * @apiParam {Object} params Object containing parameters for retrieving a user and the key value pair to apply to the user meta object.
 * @apiParam (params) {String} [objectId] Look up the user object by the objectId field. See [User.retrieve()](#api-Reactium.User-User.retrieve).
 * @apiParam (params) {String} [username] Look up the user object by the username field. See [User.retrieve()](#api-Reactium.User-User.retrieve).
 * @apiParam (params) {String} [email] Look up the user object by the email field. See [User.retrieve()](#api-Reactium.User-User.retrieve).
 * @apiParam (hooks) {Hook} before-user-meta-delete Triggered before the `user-meta-delete` cloud function is called.
```
Arguments: params:Object
```
 * @apiParam (hooks) {Hook} user-meta-delete-response Triggered after the `user-meta-delete` cloud function is called.
```
Arguments: user:Actinium.user, params:Object
```
 */
User.Meta.delete = async params => {
    await Hook.run('before-user-meta-delete', params);
    const response = await Actinium.Cloud.run('user-meta-delete', params);
    await Hook.run('user-meta-delete-response');
    return response;
};

/**
 * @api {Asyncronous} User.Pref.update(params) User.Pref.update()
 * @apiGroup Reactium.User
 * @apiName User.Pref.update
 * @apiDescription Mutate the `Actinium.User.pref` object. Calls the `user-pref-update` cloud function.
 * @apiParam {Object} params Object containing parameters for retrieving a user and the key value pair to apply to the user pref object.
 * @apiParam (params) {String} [objectId] Look up the user object by the objectId field. See [User.retrieve()](#api-Reactium.User-User.retrieve).
 * @apiParam (params) {String} [username] Look up the user object by the username field. See [User.retrieve()](#api-Reactium.User-User.retrieve).
 * @apiParam (params) {String} [email] Look up the user object by the email field. See [User.retrieve()](#api-Reactium.User-User.retrieve).
 * @apiParam (hooks) {Hook} before-user-pref-update Triggered before the `user-pref-update` cloud function is called.
```
Arguments: params:Object
```
 * @apiParam (hooks) {Hook} user-pref-update-response Triggered after the `user-pref-update` cloud function is called.
```
Arguments: user:Actinium.user, params:Object
```
 * @apiExample
const updatedUser = await User.Pref.update({ objectId: 'slertjt5wzb', random: 'pref value' });
 */
User.Pref.update = async params => {
    await Hook.run('before-user-pref-update', params);
    const response = await Actinium.Cloud.run('user-pref-update', params);
    await Hook.run('user-pref-update-response', response, params);
    return response;
};

/**
 * @api {Asyncronous} User.Pref.delete(params) User.Pref.delete()
 * @apiGroup Reactium.User
 * @apiName User.Pref.delete
 * @apiDescription Mutate the `Actinium.User.pref` object by deleting a key value pair. Calls the `user-pref-delete` cloud function.
 * @apiParam {Object} params Object containing parameters for retrieving a user and the key value pair to apply to the user pref object.
 * @apiParam (params) {String} [objectId] Look up the user object by the objectId field. See [User.retrieve()](#api-Reactium.User-User.retrieve).
 * @apiParam (params) {String} [username] Look up the user object by the username field. See [User.retrieve()](#api-Reactium.User-User.retrieve).
 * @apiParam (params) {String} [email] Look up the user object by the email field. See [User.retrieve()](#api-Reactium.User-User.retrieve).
 * @apiParam (hooks) {Hook} before-user-pref-delete Triggered before the `user-pref-delete` cloud function is called.
```
Arguments: params:Object
```
 * @apiParam (hooks) {Hook} user-pref-delete-response Triggered after the `user-pref-delete` cloud function is called.
```
Arguments: user:Actinium.user, params:Object
```
 */
User.Pref.delete = async params => {
    await Hook.run('before-user-pref-delete', params);
    const response = await Actinium.Cloud.run('user-pref-delete', params);
    await Hook.run('user-pref-delete-response');
    return response;
};

// User DirtyEvent, ScrubEvent
User.DirtyEvent = Utils.registryFactory('UserDirtyEvent');
User.DirtyEvent.protect(['change']);
User.DirtyEvent.protected.forEach(id => User.DirtyEvent.register(id));

User.ScrubEvent = Utils.registryFactory('UserScrubEvent');
User.ScrubEvent.protect([
    'loaded',
    'save-success',
    'user-role-add',
    'user-role-remove',
]);
User.ScrubEvent.protected.forEach(id => User.ScrubEvent.register(id));

// User Content Zone registry. Used to register tabs on the user profile page.
User.Content = Utils.registryFactory('UserContent');
User.Content.protect(['admin-user-content', 'admin-user-media'])
    .register('admin-user-content', {
        order: 10,
        tab: { id: 'content', label: 'Content' },
    })
    .register('admin-user-media', {
        order: 20,
        tab: { id: 'media', label: 'Media' },
    });

export default User;
