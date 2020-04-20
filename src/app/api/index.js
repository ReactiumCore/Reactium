import apiConfig from './config';

let Actinium = null;

/**
 * Isomorphic Actinium SDK
 *
 * @see https://reactium.io/docs/guide/using-apis
 */
if (typeof window !== 'undefined') {
    // [browser]: client side version of parse
    Actinium = require('parse');
} else {
    // [server]: node SDK for parse
    Actinium = require('parse/node');
}

if (Actinium) {
    if (apiConfig.actiniumAppId) {
        Actinium.initialize(apiConfig.actiniumAppId);
    } else {
        if (apiConfig.parseAppId) {
            Actinium.initialize(apiConfig.parseAppId);
        }
    }

    Actinium.serverURL = apiConfig.restAPI;

    // Configure LiveQuery
    if (typeof window !== 'undefined') {
        const { host } = location;

        // proxied through express
        Actinium.liveQueryServerURL = `ws://${host}${restAPI}`;

        // direct connection (not proxied through express)
        if (/^http/.test(apiConfig.restAPI)) {
            const API = new URL(apiConfig.restAPI);
            API.protocol = 'ws:';
            Actinium.liveQueryServerURL = API.toString();
        }

        Actinium.LiveQuery.on('open', () => {
            console.log('Actinium LiveQuery connection established');
        });
    }
}

export default Actinium;
