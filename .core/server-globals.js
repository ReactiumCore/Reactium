import path from 'path';
import op from 'object-path';
import _ from 'underscore';
import reactiumBootHooks from './boot-hooks';

global.rootPath = path.resolve(__dirname, '..');

module.exports = async () => {
    const ReactiumBoot = (await import('@atomic-reactor/reactium-sdk-core'))
        .default;
    global.ReactiumBoot = ReactiumBoot;
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

    require('./reactium.log');

    await reactiumBootHooks();
};
