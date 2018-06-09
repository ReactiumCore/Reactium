//------------------------------------------------------------------------------
// node.js starter application for hosting
//------------------------------------------------------------------------------

import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import router from './server/router';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import apiConfig from 'appdir/api/config';
import path from 'path';

const app     = express();

let node_env  = (process.env.hasOwnProperty('NODE_ENV')) ? process.env.NODE_ENV : 'development';
let port      = (process.env.hasOwnProperty('APP_PORT')) ? process.env.APP_PORT : '3030';
port          = (node_env === 'production') ? '8080' : port;

global.parseAppId = apiConfig.parseAppId;
global.restAPI    = apiConfig.restAPI;

const adminURL    = process.env.ACTINIUM_ADMIN_URL || false;

// set app variables
app.set('x-powered-by', false);

// logging
if (process.env.DEBUG !== 'off') {
    app.use(morgan('combined'));
}

// apply cross site scripting
app.use(cors());

// Proxy /api
app.use(
    ['/api', '/api/*'],
    proxy(`${restAPI}`, {
        proxyReqOptDecorator: req => {
            req.headers['x-forwarded-host'] = `localhost:${port}`;
            return req;
        },
        proxyReqPathResolver: req => {
            const resolvedPath = `${restAPI}${req.url}`;
            return resolvedPath;
        },
    })
);

// parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({name: 'aljtka4', keys: ['Q2FtZXJvbiBSdWxlcw', 'vT3GtyZKbnoNSdWxlcw']}));

// development mode
if ( process.env.NODE_ENV === 'development' ) {
    const webpack        = require('webpack');
    const gulpConfig     = require('../gulp.config')();
    const webpackConfig  = require('../webpack.config')(gulpConfig);
    const wpMiddlware    = require('webpack-dev-middleware');
    const wpHotMiddlware = require('webpack-hot-middleware');

    webpackConfig.entry.main = ['webpack-hot-middleware/client?http://localhost:3030', webpackConfig.entry.main];
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compiler = webpack(webpackConfig);

    app.use(wpMiddlware(compiler, {
        serverSideRender: true,
    }));

    app.use(wpHotMiddlware(compiler, {
        reload: true,
    }));
}

// serve the static files out of ./public or specified directory
const staticAssets = process.env.PUBLIC_DIRECTORY || path.resolve(process.cwd(), 'public');
app.use(express.static(staticAssets));

// default route handler
app.use(router);

// start server on the specified port and binding host
app.listen(port, '0.0.0.0', function() {
    app.dependencies.init();

    console.log(`[00:00:00] [Reactium] Server running on port ${port}...`);
});

app.dependencies = global.dependencies = require('dependencies').default;
