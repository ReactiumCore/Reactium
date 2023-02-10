import path from 'path';
import op from 'object-path';
import _ from 'underscore';
import bootHooks from './boot-hooks';

const globby = require('./globby-patch').sync;

global.rootPath = path.resolve(__dirname, '..');

const reactiumBootHooks = require('./boot-hooks');

const apiConfig = async () => {
    if (ReactiumBoot.API && ReactiumBoot.API.ActiniumConfig) {
        const apiConfig = ReactiumBoot.API.ActiniumConfig;

        global.parseAppId = apiConfig.parseAppId;
        global.actiniumAppId = apiConfig.actiniumAppId;
        global.restAPI = apiConfig.restAPI;
    }
};

module.exports = async () => {
    const ReactiumBoot = (await import('reactium-core/sdk')).default;
    global.ReactiumBoot = ReactiumBoot;
    global.defines = {};
    global.actiniumAPIEnabled = process.env.ACTINIUM_API !== 'off';
    global.actiniumProxyEnabled = process.env.PROXY_ACTINIUM_API !== 'off';

    const defaultPort = 3030;
    global.PORT = defaultPort;
    let node_env = process.env.hasOwnProperty('NODE_ENV')
        ? process.env.NODE_ENV
        : 'development';

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

    require('./reactium.log');

    await reactiumBootHooks();

    await apiConfig();
};
