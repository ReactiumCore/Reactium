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
import apiConfig from 'appdir/api/config';
import path from 'path';
import fs from 'fs';
import op from 'object-path';

global.defines = {};
global.rootPath = path.resolve(__dirname, '..');
global.parseAppId = apiConfig.parseAppId;
global.restAPI = apiConfig.restAPI;
global.isSSR = 'SSR_MODE' in process.env && process.env.SSR_MODE === 'on';

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

// express middlewares
let middlewares = [
    process.env.DEBUG === 'on'
        ? {
              name: 'logging',
              use: morgan('combined'),
          }
        : false,
    {
        name: 'cors',
        use: cors(),
    },
    {
        name: 'placeholder',
        use: require('./server/middleware/placeholder'),
    },
    {
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
    },
    // parsers
    {
        name: 'jsonParser',
        use: bodyParser.json(),
    },
    {
        name: 'urlEncoded',
        use: bodyParser.urlencoded({ extended: true }),
    },

    // cookies
    {
        name: 'cookieParser',
        use: cookieParser(),
    },
    {
        name: 'cookieSession',
        use: cookieSession({
            name: 'aljtka4',
            keys: ['Q2FtZXJvbiBSdWxlcw', 'vT3GtyZKbnoNSdWxlcw'],
        }),
    },
];

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
        `webpack-hot-middleware/client?path=/__webpack_hmr&quiet=true`,
        webpackConfig.entry.main,
    ];
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.output.publicPath = publicPath;

    const compiler = webpack(webpackConfig);

    middlewares.push({
        name: 'webpack',
        use: wpMiddlware(compiler, {
            serverSideRender: true,
            path: '/',
            publicPath,
        }),
    });
    middlewares.push({
        name: 'hmr',
        use: wpHotMiddlware(compiler, {
            reload: true,
        }),
    });
}

// serve the static files out of ./public or specified directory
const staticAssets =
    process.env.PUBLIC_DIRECTORY || path.resolve(process.cwd(), 'public');

middlewares.push({
    name: 'static',
    use: express.static(staticAssets),
});

// default route handler
middlewares.push({
    name: 'router',
    use: router,
});

// Give app an opportunity to change middlewares
if (fs.existsSync(`${rootPath}/src/app/server/middleware.js`)) {
    middlewares = require(`${rootPath}/src/app/server/middleware.js`)(
        middlewares,
    );
}

middlewares
    .filter(_ => _)
    .sort(({ order: aOrder = 0 }, { order: bOrder = 0 }) => bOrder - aOrder)
    .forEach(({ use }) => {
        if (Array.isArray(use)) {
            app.use(...use);
        } else {
            app.use(use);
        }
    });

// start server on the specified port and binding host
app.listen(port, '0.0.0.0', function() {
    if (isSSR) {
        app.dependencies.init();
    }

    console.log(`[00:00:00] Reactium Server running on port '${port}'...`);
});

// Provide opportunity for ssl server
if (fs.existsSync(`${rootPath}/src/app/server/ssl.js`)) {
    require(`${rootPath}/src/app/server/ssl.js`)(app);
}

if (isSSR) {
    app.dependencies = global.dependencies = require('dependencies').default;
}
