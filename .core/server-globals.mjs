import op from 'object-path';
import _ from 'underscore';
import reactiumBootHooks from './boot-hooks.mjs';
import path from 'node:path';
import { dirname } from '@atomic-reactor/dirname';
import ReactiumBoot from '@atomic-reactor/reactium-sdk-core';

global.ReactiumBoot = ReactiumBoot;

const __dirname = dirname(import.meta.url);

global.rootPath = path.resolve(__dirname, '..');

export default async () => {
    global.defines = {};

    const defaultPort = 3030;
    global.PORT = defaultPort;

    if (process.env.NODE_ENV === 'development') {
        let gulpConfig;
        try {
            gulpConfig = require('./gulp.config');
        } catch (err) {
            gulpConfig = { port: { proxy: PORT } };
        }
        PORT = gulpConfig.port.proxy;
    }

    const PORT_VAR = op.get(process.env, 'PORT_VAR', 'APP_PORT');
    if (PORT_VAR && op.has(process.env, [PORT_VAR])) {
        PORT = op.get(process.env, [PORT_VAR], PORT);
    } else {
        PORT = op.get(process.env, ['PORT'], PORT);
    }

    PORT = parseInt(PORT) || defaultPort;

    global.TLS_PORT = op.get(process.env, 'TLS_PORT', 3443);

    await import('./reactium.log.cjs');

    await reactiumBootHooks();
};
