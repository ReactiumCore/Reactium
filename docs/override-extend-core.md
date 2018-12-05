# Overriding Core

Reactium is built on a core framework. The local development and build configuration
that comes out of the box is meant to be upgradeable, so long as your application was
built off a semver that is minor-version compatible with the current.

Even for larger version steps, we are going to attempt to describe (or automate) much
of the migration from one version of Reactium core to another.

Upgrading core is performed with the CLI, btw:

```sh
$ arcli reactium update
```

With a number of other front-end frameworks, even those based on React, the philosophy is to entirely hide the local development/build configuration from the developer, sometimes with an **eject** feature to get raw configuration / build files.

Our philosophy is to create a strong opinion for building a React application, from application structure, to out of the box capabilities such as routing, plugins, and redux state management, while giving the code maintainer, lead-dev, and ops roles on your team the power to replace, augment, or override behaviors of the build.

## Hacking Core

Should you hack core? Short answer is no.

If you hack on the files in the **.core** directory of your project, those changes potentially make your app incompatible with future versions of the framework, and may prevent you from making simple updates. We don't recommend doing this unless you absolutely have to. If you have a good idea for a general purpose patch to .core, please fork Reactium on github and send us a pull-request. We'll either add your update if appropriate, or give you an alternative that does not require hacking on .core.

That being said, there are a number of build and development overrides built-in to core for your use.

## Override Files

There are a handful of files, that, if they exist in your app's root directory, will automatically be used by core for your build process.

| File (Where)                | Description (How)                                                                                                                                                     | Overrides (What)                                                         | Reason (Why)                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| gulp.config.override.js     | Exports a function that takes core gulp configuration object as a parameter, and returns configuration object used by gulp tasks (and in some cases also by webpack.) | Object returned by .core/gulp.config.js                                  | Need to change build src/dest. Local port config.                                        |
| gulp.tasks.override.js      | Exports a function that takes an object defining core gulp tasks as a parameter, and returns and object whose properties define the tasks run by gulp                 | Gulp tasks defined by .core/gulp.tasks.js                                | Add pre or post build tasks. Replace built-in tasks.                                     |
| manifest.config.override.js | Exports a function that takes configuration the manifest-tools use to build src/manifest.js as a parameter, and returns new manifest configuration.                   | Configuration specified by manifest property of .core/reactium-config.js | Add new application dependencies to dependency module. Add new component search context. |
| webpack.override.js         | Exports a function that takes the core webpack configuration as a parameter, and returns an object that will be used for webpack to build the js bundle.              | Configuration object specified by .core/webpack.config.js                | You hate yourself.                                                                       |
| babel.config.js             | **(Required)** Imports babel configuration and exports the configuration used by webpack and babel-node.                                                              | Babel configuration specified by .core/babel.config.js                   | Add babel presets / plugins. Add module alias for both server / transpiled front-end.    |

## Node / Express Overrides

Important to dev-leads, ops and backend devs, there are a number of ways you can change the behavior of the core express server without hacking .core.

### Express Middleware

To add or change the stack of Node / Express middleware for the running server, create a `src/app/server/middleware.js` file, which should export a function taking an array of express middlewares as an argument, and returns the modified list of middlewares.

In this way, you can add/change routing, security configuration, etc to your hearts content.

See `.core/index.js` for built-in middlewares list.

#### Express Middleware Examples

A simple logger:

```js
module.exports = expressMiddlewares => {
    const mySimpleRequestLogger = (req, res, next) => {
        console.log(`SIMPLE LOGGER: REQUEST ${req.path}`);
        next();
    };

    return [
        {
            name: 'mySimpleRequestLogger',
            use: mySimpleRequestLogger,
        },
        ...expressMiddlewares,
    ];
};
```

A health check route handler:

```js
const express = require('express');
const router = express.Router();

const healthy = router.get('/healthcheck', (req, res) => {
    res.status(200).send('ok');
});

module.exports = expressMiddlewares => {
    return [
        {
            name: 'myRouteHandler',
            use: router,
        },
        ...expressMiddlewares,
    ];
};
```

More secure Cross Origin Request Sharing for production:

```js
const cors = require('cors');

module.exports = expressMiddlewares => {
    return expressMiddlewares.map(mw => {
        // no change
        if (nw.name !== 'cors' || !('CORS_ORIGIN' in process.env)) {
            return mw;
        }

        // enforce origin
        return {
            name: 'cors',
            use: cors({
                origin: process.env.CORS_ORIGIN,
            }),
        };
    });
};
```

### Override Express SPA Template

The default templates are good for simple SPAs, but inevitably you will need to provide a different template for rendering your application's index.html.

To do so, copy `.core/server/template/feo.js` and `.core/server/template/ssr.js` to `src/app/server/template` to make modifications to the template served by express for your front-end only and server-side rendered SPA, respectively.

**Important**: replace the `%TEMPLATE_VERSION%` string found in those templates with the version number found in `.core/reactium-config.js` at the time you copy them. Reactium core will use these templates to serve your SPA so long as your src template version string satisfies the `semver` property found in your `.core/reactium.config.js`. You may need to update these templates after major and minor version updates of core.

### Static Build Template

There is an `index-static.html` file provided in the `src/` directory, which can be used to compile a static index.html file when running static build: `npm run static`. This is for Reactium applications that will be served by another web-server (Apache / Nginx / Tomcat etc.), and supports only front-end rendered React (not SSR.)

### Application Defines

Node/Express `global.defines` variables can be set by creating a `src/app/server/defines.js` file that exports a javascript object.

The file will also be used in constructing a webpack defines plugin values as well.

Theoretically, your SSR and FE code could make reference to values specified here.

Contrived `src/app/server/defines.js`:

```js
module.exports = {
    foo: 'bar',
};
```

Isomorphic Define JS somewhere in front-end React code:

```js
let fooValue;
if (typeof window !== 'undefined') {
    fooValue = foo; // webpack define plugin
} else {
    fooValue = defines.foo; // node express global
}
```

### Environment Variables

| Variable (Where) | Values (How)                                                                                                           | Purpose (What)                                                                                                                              | Reason (Why)                                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| SSR_MODE         | Unset (default), OFF, ON                                                                                               | Unset or OFF to serve the React application in front-end only mode. ON to attempt to pre-render the application when serving the React app. | Increase perceptual performance (TTFR), or SEO related paranoia.                                                     |
| PORT             | Unset (default) or Any TCP port appropriate for HTTP protocol (default to 3030 or port.proxy in ./core/gulp.config.js) | For environments where running application is specified by PORT var.                                                                        | Some environments automatically set this value for HTTP                                                              |
| APP_PORT         | Unset (default) or Any TCP port appropriate for HTTP protocol (default to 3030 or port.proxy in ./core/gulp.config.js) | For environments where running application is specified by APP_PORT var.                                                                    | Some environments automatically set this value for HTTP (such as IBM Bluemix)                                        |
| PORT_VAR         | Unset (default) or the string specifying the environment variable where the HTTP port can be found                     | Tells express where to look in environment variable to get the HTTP port setting.                                                           | For environments where neither PORT nor APP_PORT can be set, but other custom variables can be.                      |
| DEBUG            | Unset (default), OFF, ON. Unset or OFF to suppress logging to STDOUT. ON to enable logging.                            | Enable or Disable logging                                                                                                                   | Logging can be helpful for troubleshooting server-side rendering issues. SSR logging can drive front-end devs batty. |
| PUBLIC_DIRECTORY | Unset (default) or full-path to public assets directory (default ./public)                                             | Change the directory that express will serve static assets from (static middleware)                                                         | You have changed the build process to output static assets (js/css/images, etc)                                      |

## Front-End Redux Middleware / Store Enhancers

Two advanced DDD component architecture files that are searched for in front-end manifest construction are `middleware.js` and `enhancer.js`.

When found in a Reactium `src/component` domain, Reactium core will attempt to add them to Redux store construction.

See `.core/storeCreator.js` for built-in Redux middleware and store enhancers.

#### Example Custom Redux Middleware

```js
/**
 * Exports a function taking current list of redux middleware, and returns list of redux middleware to be used for redux store construction. Use with caution: some middleware is used by core.
 *
 * @param  {Array}   [middlewares=[]] current list of redux middlewares
 * @param  {Boolean} [isServer=false] true if code is running in server-side rendering context
 * @return {Array} new list of redux middleware
 */
export default (middlewares = [], isServer = false) => {
    return middlewares.concat([
        {
            order: 0,
            name: 'myActionTypeLogger',
            mw: store => next => action => {
                console.log(`ACTION TYPE DISPATCHED: ${action.type}`);
                next(action);
            },
        },
    ]);
};
```

#### Example Custom Store Enhancer

```js
import DevTools from 'reactium-core/components/DevTools';

/**
 * Exports a function taking current list of redux enhancers, and returns list of redux enhancers to be used for composable stack of storeCreators. Use with extreme caution; you better know what you are doing.
 * (you probably do not need to do this)
 *
 * @param  {Array}   [enhancers=[]] current list of redux enhancers
 * @param  {Boolean} [isServer=false] true if code is running in server-side rendering context
 * @return {Array} new list of redux enhancers
 */
export default (enhancers = [], isServer = false) => {
    return enhancers.map(enhancer => {
        if (enhancer.name !== 'devtools') {
            return enhancer;
        }

        // Enable Redux DevTool in production!!! Wee!
        return {
            name: 'devtools',
            order: -1000,
            enhancer: DevTools.instrument(),
        };
    });
};
```
