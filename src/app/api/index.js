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
}

export default Parse;
