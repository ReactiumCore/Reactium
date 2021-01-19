import { isBrowserWindow } from '@atomic-reactor/reactium-sdk-core';
import { io } from 'socket.io-client';
import apiConfig from './config';

let Actinium = null;

/**
 * Isomorphic Actinium SDK
 *
 * @see https://reactium.io/docs/guide/using-apis
 */
if (isBrowserWindow()) {
    if (window.actiniumAPIEnabled === true) {
        // [browser]: client side version of parse
        Actinium = require('parse');
    }
} else {
    if (process.env.ACTINIUM_API !== 'off') {
        // [server]: node SDK for parse
        Actinium = require('parse/node');
    }
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
    if (isBrowserWindow()) {
        const { host, protocol } = location;

        // proxied through express
        let ioURL = `${protocol}//${host}${restAPI}`;
        Actinium.liveQueryServerURL = `${
            protocol === 'http:' ? 'ws:' : 'wss:'
        }//${host}${restAPI}`;

        // direct connection (not proxied through express)
        if (/^http/.test(apiConfig.restAPI)) {
            const API = new URL(apiConfig.restAPI);
            ioURL = API.toString();
            API.protocol = API.protocol === 'http:' ? 'ws:' : 'wss:';
            Actinium.liveQueryServerURL = API.toString();
        }

        ioURL = ioURL.replace('/api', '');
        Actinium.IO = io(ioURL, {
            path: '/actinium.io',
            autoConnect: false,
            transports: ['polling'],
        });

        Actinium.LiveQuery.on('open', () => {
            console.log('Actinium LiveQuery connection established');
        });
    }
}

export const api = Actinium;
export const config = apiConfig;
