//------------------------------------------------------------------------------
// node.js starter application for hosting
//------------------------------------------------------------------------------

import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import router from './server/router';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import proxy from 'http-proxy-middleware';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import op from 'object-path';
import _ from 'underscore';
import staticGzip from 'express-static-gzip';
import moment from 'moment';
import SDK from 'reactium-core/sdk';
import { sync as globby } from 'globby';

const { Enums } = SDK;

global.defines = {};
global.rootPath = path.resolve(__dirname, '..');
global.isSSR = 'SSR_MODE' in process.env && process.env.SSR_MODE === 'on';

const apiConfig = SDK.API.ActiniumConfig;
global.parseAppId = apiConfig.parseAppId;
global.actiniumAppId = apiConfig.actiniumAppId;
global.restAPI = apiConfig.restAPI;

// SSR Defines
if (!'defines' in global) {
    global.defines = {};
}
if (fs.existsSync(`${rootPath}/src/app/server/defines.js`)) {
    const defs = require(`${rootPath}/src/app/server/defines.js`);
    Object.keys(defs).forEach(key => {
        if (key !== 'process.env') {
            global.defines[key] = defs[key];
        }
    });
}

const bootup = async () => {
    const app = express();

    let gulpConfig;
    try {
        gulpConfig = require('./gulp.config');
    } catch (err) {
        gulpConfig = { port: { proxy: 3030 } };
    }

    let node_env = process.env.hasOwnProperty('NODE_ENV')
        ? process.env.NODE_ENV
        : 'development';

    // PORT setup:
    let port = gulpConfig.port.proxy;
    let pvar = op.get(process.env, 'PORT_VAR', false);

    if (pvar) {
        port = op.get(process.env, pvar, port);
    } else {
        port = op.get(process.env, 'APP_PORT', port);
        port = op.get(process.env, 'PORT', port);
    }

    port = Number(port);

    const adminURL = process.env.ACTINIUM_ADMIN_URL || false;

    // set app variables
    app.set('x-powered-by', false);

    // include boot DDD artifacts
    globby([
        `${rootPath}/.core/**/reactium-boot.js`,
        `${rootPath}/src/**/reactium-boot.js`,
        `${rootPath}/reactium_modules/**/reactium-boot.js`,
        `${rootPath}/node_modules/**/reactium-plugin/**/reactium-boot.js`,
    ]).map(item => {
        const p = path.normalize(item);
        require(p);
    });

    // express middlewares
    if (process.env.DEBUG === 'on') {
        SDK.Server.Middleware.register('logging', {
            name: 'logging',
            use: morgan('combined'),
            order: Enums.priority.highest,
        });
    }

    SDK.Server.Middleware.register('cors', {
        name: 'cors',
        use: cors(),
        order: Enums.priority.highest,
    });

    if (restAPI) {
        SDK.Server.Middleware.register('api', {
            name: 'api',
            use: proxy('/api', {
                target: restAPI,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '',
                },
                logLevel: process.env.DEBUG === 'on' ? 'debug' : 'error',
                ws: true,
            }),
            order: Enums.priority.highest,
        });
    }

    // parsers
    SDK.Server.Middleware.register('jsonParser', {
        name: 'jsonParser',
        use: bodyParser.json(),
        order: Enums.priority.high,
    });

    SDK.Server.Middleware.register('urlEncoded', {
        name: 'urlEncoded',
        use: bodyParser.urlencoded({ extended: true }),
        order: Enums.priority.high,
    });

    // cookies
    SDK.Server.Middleware.register('cookieParser', {
        name: 'cookieParser',
        use: cookieParser(),
        order: Enums.priority.high,
    });

    SDK.Server.Middleware.register('cookieSession', {
        name: 'cookieSession',
        use: cookieSession({
            name: op.get(process.env, 'COOKIE_SESSION_NAME', 'aljtka4'),
            keys: JSON.parse(
                op.get(
                    process.env,
                    'COOKIE_SESSION_KEYS',
                    JSON.stringify([
                        'Q2FtZXJvbiBSdWxlcw',
                        'vT3GtyZKbnoNSdWxlcw',
                    ]),
                ),
            ),
            order: Enums.priority.high,
        }),
    });

    // development mode
    if (process.env.NODE_ENV === 'development') {
        const webpack = require('webpack');
        const gulpConfig = require('./gulp.config');
        const webpackConfig = require('./webpack.config')(gulpConfig);
        const wpMiddlware = require('webpack-dev-middleware');
        const wpHotMiddlware = require('webpack-hot-middleware');
        const publicPath = `http://localhost:${port}/`;

        // local development overrides for webpack config
        webpackConfig.entry.main = [
            'webpack-hot-middleware/client?path=/__webpack_hmr&quiet=true',
            webpackConfig.entry.main,
        ];
        webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
        webpackConfig.output.publicPath = publicPath;

        const compiler = webpack(webpackConfig);

        SDK.Server.Middleware.register('webpack', {
            name: 'webpack',
            use: wpMiddlware(compiler, {
                serverSideRender: true,
                path: '/',
                publicPath,
            }),
            order: Enums.priority.high,
        });

        SDK.Server.Middleware.register('hmr', {
            name: 'hmr',
            use: wpHotMiddlware(compiler, {
                reload: true,
            }),
            order: Enums.priority.high,
        });
    }

    // serve the static files out of ./public or specified directory
    const staticAssets =
        process.env.PUBLIC_DIRECTORY || path.resolve(process.cwd(), 'public');

    SDK.Server.Middleware.register('static', {
        name: 'static',
        use: staticGzip(staticAssets),
        order: Enums.priority.neutral,
    });

    const reactiumModules = Object.keys(
        op.get(
            require(path.resolve(process.cwd(), 'package.json')),
            'reactiumDependencies',
            {},
        ),
    );

    reactiumModules.forEach(mod => {
        const modStaticPath = path.resolve(
            process.cwd(),
            'reactium_modules',
            mod,
            '_static',
        );
        if (fs.existsSync(modStaticPath)) {
            SDK.Server.Middleware.register(`static.${mod}`, {
                use: staticGzip(modStaticPath),
                order: Enums.priority.neutral,
            });
        }
    });

    // default route handler
    SDK.Server.Middleware.register('router', {
        name: 'router',
        use: router,
        order: Enums.priority.neutral,
    });

    /**
     * @api {Hook} Server.Middleware Server.Middleware
     * @apiName Server.Middleware
     * @apiDescription Used to register or unregister express middleware.
     * @apiParam {Object} Middleware Server express middleware registry object.
     * @apiParam (middleware) {String} name Name of the middleware.
     * @apiParam (middlware) {Function} use the express middleware function.
     * @apiParam (middlware) {Number} order the loading order of the middleware
     * @apiExample reactium-boot.js
     const SDK = require('@atomic-reactor/sdk').default;
     const express = require('express');
     const router = express.Router();
     const axios = require('axios');

     // register a new backend route /foo with express
     router.get('/', (req, res) => {
        res.send('Foo!!')
     });

     SDK.Hook.registerSync('Server.Middleware', Middleware => {
        Middleware.register('foo-page', {
            name: 'foo-page',
            use: router,
            order: SDK.Enums.priority.highest,
        })
     });

     SDK.Hook.registerSync('Server.Middleware', Middleware => {
        const intercept = express.Router();
        intercept.post('/api*', (req, res) => {
            res.json({
                foo: 'bar'
            });
        });

        // check api health every 90 seconds and intercept api if it goes down
        Middleware.register('downapi', {
            name: 'downapi',
            use: async (res, req, next) => {
                try {
                    let healthy = SDK.Cache.get('health-check');
                    if (healthy === undefined) {
                        const response = await axios.get(process.env.REST_API_URI + '/healthcheck');
                        healthy = response.data;
                        SDK.Cache.set('health-check', healthy, 1000 * 90);
                    }
                } catch (error) {
                    console.error(error);
                    SDK.Cache.set('health-check', false, 1000 * 90);
                    healthy = false;
                }

                if (healthy === true) next();
                return intercept(req, req, next);
            },
            order: SDK.Enums.priority.highest,
        })
     });
     * @apiGroup BootHook
     */
    SDK.Hook.runSync('Server.Middleware', SDK.Server.Middleware);
    await SDK.Hook.run('Server.Middleware', SDK.Server.Middleware);

    let middlewares = Object.values(SDK.Server.Middleware.list);

    // Deprecated: Give app an opportunity to change middlewares
    if (fs.existsSync(`${rootPath}/src/app/server/middleware.js`)) {
        console.log(
            `[${moment().format(
                'HH:mm:ss',
            )}] Warning: src/app/server/middleware.js is deprecated. Use express-mw.js DDD artifact instead.`,
        );

        middlewares = require(`${rootPath}/src/app/server/middleware.js`)(
            middlewares,
        );
    }

    _.sortBy(_.compact(middlewares), 'order').forEach(({ use }) => {
        if (Array.isArray(use)) {
            app.use(...use);
        } else {
            app.use(use);
        }
    });

    // start server on the specified port and binding host
    app.listen(port, '0.0.0.0', function() {
        console.log(
            `[${moment().format(
                'HH:mm:ss',
            )}] Reactium Server running on port '${port}'...`,
        );
    });

    // Provide opportunity for ssl server
    if (fs.existsSync(`${rootPath}/src/app/server/ssl.js`)) {
        require(`${rootPath}/src/app/server/ssl.js`)(app);
    }

    if (isSSR) {
        app.dependencies = global.dependencies = require('dependencies').default;
    }
};

bootup();
