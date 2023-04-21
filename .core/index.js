//------------------------------------------------------------------------------
// Reactium Server
//------------------------------------------------------------------------------

import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import op from 'object-path';
import _ from 'underscore';
import staticGzip from 'express-static-gzip';
import chalk from 'chalk';

const globby = require('./globby-patch').sync;

const globals = require('./server-globals');

global.rootPath = path.resolve(__dirname, '..');

global.app = express();

const registeredMiddleware = async () => {
    const { Enums } = ReactiumBoot;

    // express middlewares
    if (LOG_LEVEL >= LOG_LEVELS.INFO) {
        ReactiumBoot.Server.Middleware.register('logging', {
            name: 'logging',
            use: morgan('combined'),
            order: Enums.priority.highest,
        });
    }

    ReactiumBoot.Server.Middleware.register('cors', {
        name: 'cors',
        use: cors(),
        order: Enums.priority.highest,
    });

    // parsers
    ReactiumBoot.Server.Middleware.register('jsonParser', {
        name: 'jsonParser',
        use: bodyParser.json(),
        order: Enums.priority.high,
    });

    ReactiumBoot.Server.Middleware.register('urlEncoded', {
        name: 'urlEncoded',
        use: bodyParser.urlencoded({ extended: true }),
        order: Enums.priority.high,
    });

    // cookies
    ReactiumBoot.Server.Middleware.register('cookieParser', {
        name: 'cookieParser',
        use: cookieParser(),
        order: Enums.priority.high,
    });

    ReactiumBoot.Server.Middleware.register('cookieSession', {
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

    // serve the static files out of ./public or specified directory
    global.staticAssets =
        process.env.PUBLIC_DIRECTORY || path.resolve(process.cwd(), 'public');

    global.staticHTML =
        process.env.PUBLIC_HTML ||
        path.resolve(process.cwd(), 'public/static-html');

    ReactiumBoot.Server.Middleware.register('static', {
        name: 'static',
        use: staticGzip(staticAssets),
        order: Enums.priority.neutral,
    });

    ReactiumBoot.Server.Middleware.register('static-html', {
        name: 'static-html',
        use: staticGzip(staticHTML),
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
            ReactiumBoot.Server.Middleware.register(`static.${mod}`, {
                use: staticGzip(modStaticPath),
                order: Enums.priority.neutral,
            });
        }
    });

    // default route handler
    ReactiumBoot.Server.Middleware.register('service-worker-allowed', {
        name: 'service-worker-allowed',
        use: async (req, res, next) => {
            const responseHeaders = {
                'Service-Worker-Allowed': '/',
            };

            /**
             * @api {Hook} Server.ServiceWorkerAllowed Server.ServiceWorkerAllowed
             * @apiDescription Called on server-side during service-worker-allowed middleware.
             Used to define the HTTP response header "Service-Worker-Allowed".
             By default, this header will allow the document root, "/".
             Both sync and async version called.
             * @apiParam {Object} responseHeader with property 'Service-Worker-Allowed' (case sensitive) and its value.
             * @apiParam {Object} req Node/Express request object
             * @apiParam {Object} res Node/Express response object
             * @apiName Server.ServiceWorkerAllowed
             * @apiGroup Hooks
             */
            ReactiumBoot.Hook.runSync(
                'Server.ServiceWorkerAllowed',
                responseHeaders,
                req,
                res,
            );
            await ReactiumBoot.Hook.run(
                'Server.ServiceWorkerAllowed',
                responseHeaders,
                req,
                res,
            );

            if (op.has(responseHeaders, 'Service-Worker-Allowed')) {
                res.set(
                    'Service-Worker-Allowed',
                    op.get(responseHeaders, 'Service-Worker-Allowed'),
                );
            }

            next();
        },
        order: Enums.priority.high,
    });

    // default route handler
    ReactiumBoot.Server.Middleware.register('router', {
        name: 'router',
        use: require('./server/router').default,
        order: Enums.priority.neutral,
    });
};

const registeredDevMiddleware = () => {
    const { Enums } = ReactiumBoot;

    // set app variables
    app.set('x-powered-by', false);

    // development mode
    if (process.env.NODE_ENV === 'development') {
        const webpack = require('webpack');
        const gulpConfig = require('./gulp.config');
        const webpackConfig = require('./webpack.config')(gulpConfig);
        const wpMiddlware = require('webpack-dev-middleware');
        const wpHotMiddlware = require('webpack-hot-middleware');
        const publicPath = `http://localhost:${PORT}/`;

        // local development overrides for webpack config
        webpackConfig.entry.main = [
            'webpack-hot-middleware/client?path=/__webpack_hmr&quiet=true',
            webpackConfig.entry.main,
        ];
        webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
        webpackConfig.output.publicPath = publicPath;

        const compiler = webpack(webpackConfig);

        ReactiumBoot.Server.Middleware.register('webpack', {
            name: 'webpack',
            use: wpMiddlware(compiler, {
                serverSideRender: true,
                publicPath,
            }),
            order: Enums.priority.high,
        });

        ReactiumBoot.Server.Middleware.register('hmr', {
            name: 'hmr',
            use: wpHotMiddlware(compiler, {
                reload: true,
            }),
            order: Enums.priority.high,
        });
    }
};

const startServer = async () => {
    await registeredMiddleware();
    await registeredDevMiddleware();

    /**
     * @api {Hook} Server.Middleware Server.Middleware
     * @apiName Server.Middleware
     * @apiDescription Used to register or unregister express middleware.
     * @apiParam {Object} Middleware Server express middleware registry object.
     * @apiParam (middleware) {String} name Name of the middleware.
     * @apiParam (middlware) {Function} use the express middleware function.
     * @apiParam (middlware) {Number} order the loading order of the middleware
     * @apiExample reactium-boot.js
     const express = require('express');
     const router = express.Router();
     const axios = require('axios');

     // register a new backend route /foo with express
     router.get('/', (req, res) => {
        res.send('Foo!!')
     });

     ReactiumBoot.Hook.registerSync('Server.Middleware', Middleware => {
        Middleware.register('foo-page', {
            name: 'foo-page',
            use: router,
            order: ReactiumBoot.Enums.priority.highest,
        })
     });

     ReactiumBoot.Hook.registerSync('Server.Middleware', Middleware => {
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
                    let healthy = ReactiumBoot.Cache.get('health-check');
                    if (healthy === undefined) {
                        const response = await axios.get(process.env.REST_API_URI + '/healthcheck');
                        healthy = response.data;
                        ReactiumBoot.Cache.set('health-check', healthy, 1000 * 90);
                    }
                } catch (error) {
                    console.error(error);
                    ReactiumBoot.Cache.set('health-check', false, 1000 * 90);
                    healthy = false;
                }

                if (healthy === true) next();
                return intercept(req, req, next);
            },
            order: ReactiumBoot.Enums.priority.highest,
        })
     });
     * @apiGroup Hooks
     */
    ReactiumBoot.Hook.runSync(
        'Server.Middleware',
        ReactiumBoot.Server.Middleware,
    );
    await ReactiumBoot.Hook.run(
        'Server.Middleware',
        ReactiumBoot.Server.Middleware,
    );

    let middlewares = Object.values(ReactiumBoot.Server.Middleware.list);
    // Deprecated: Give app an opportunity to change middlewares
    if (fs.existsSync(`${rootPath}/src/app/server/middleware.js`)) {
        ERROR(
            'src/app/server/middleware.js has been discontinued. Use reactium-boot.js register to register or deregister express middleware.',
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
    app.listen(PORT, '0.0.0.0', function() {
        BOOT(
            `Reactium Server running ${chalk.red(
                'PLAIN',
            )} on port '${PORT}'...`,
        );
    });

    if (process.env.REACTIUM_TLS_MODE === 'on') {
        const spdy = require('spdy');
        const options = {
            key: fs.readFileSync(
                op.get(
                    process.env,
                    'REACTIUM_TLS_KEY',
                    path.resolve(__dirname, '../src', 'server.key'),
                ),
            ),
            cert: fs.readFileSync(
                op.get(
                    process.env,
                    'REACTIUM_TLS_CERT',
                    path.resolve(__dirname, '../src', 'server.crt'),
                ),
            ),
        };
        await ReactiumBoot.Hook.run('spdy-options', options);

        spdy.createServer(options, app).listen(TLS_PORT, error => {
            if (error) {
                ERROR(error);
                process.exit(1);
            }
            BOOT(
                `Reactium Server running ${chalk.green(
                    'TLS',
                )} on port '${TLS_PORT}'...`,
            );
        });
    }
};

const bootup = async () => {
    const logger = console;
    try {
        await globals();
        await startServer();
    } catch (error) {
        console.error('Error on server startup:', error);
    }
};

bootup();
