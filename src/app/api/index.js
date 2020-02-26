import apiConfig from './config';

let Parse = null;

/**
 * Isomorphic Parse SDK
 *
 * @see https://reactium.io/docs/guide/using-apis
 */
if (typeof window !== 'undefined') {
    // [browser]: client side version of parse
    Parse = require('parse');
} else {
    // [server]: node SDK for parse
    Parse = require('parse/node');
}

if (Parse) {
    Parse.initialize(apiConfig.parseAppId);
    Parse.serverURL = apiConfig.restAPI;

    // Configure LiveQuery
    if (typeof window !== 'undefined') {
        const { host } = location;

        // proxied through express
        Parse.liveQueryServerURL = `ws://${host}${restAPI}`;

        // direct connection (not proxied through express)
        if (/^http/.test(apiConfig.restAPI)) {
            const API = new URL(apiConfig.restAPI);
            API.protocol = 'ws:';
            Parse.liveQueryServerURL = API.toString();
        }

        Parse.LiveQuery.on('open', () => {
            console.log('Parse LiveQuery connection established');
        });
    }
}

export default Parse;
