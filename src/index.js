//------------------------------------------------------------------------------
// node.js starter application for hosting
//------------------------------------------------------------------------------

import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import router from './server/router';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import { globDefineFiles } from './utils';

const app     = express();

let node_env  = (process.env.hasOwnProperty('NODE_ENV')) ? process.env.NODE_ENV : 'development';
let port      = (process.env.hasOwnProperty('APP_PORT')) ? process.env.APP_PORT : '3030';
port          = (node_env === 'production') ? '8080' : port;

// set app variables
app.set('x-powered-by', false);

// apply cross site scripting
app.use(cors());

// parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({name: 'aljtka4', keys: ['Q2FtZXJvbiBSdWxlcw', 'vT3GtyZKbnoNSdWxlcw']}));

// serve the static files out of ./public
app.use(express.static('public'));

// default route handler
app.use(router);

// start server on the specified port and binding host
app.listen(port, '0.0.0.0', function() {
    console.log(`[00:00:00] Server running on port ${port}...`);
});
