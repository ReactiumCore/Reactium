import apiConfig from './config';

// Isomorphic Parse
let Parse = null;

if ( typeof window !== 'undefined' ) {
    Parse = require('parse');
} else {
    Parse = require('parse/node');
}
if ( Parse ) {
    Parse.initialize(apiConfig.parseAppId);
    Parse.serverURL = apiConfig.restAPI;
}

export default Parse;
