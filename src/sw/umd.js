/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */
import { skipWaiting, clientsClaim, cacheNames } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheOnly } from 'workbox-strategies';
import op from 'object-path';

const SW_VERSION = '1.0.0';

const messageTypes = {
    GET_VERSION: 'GET_VERSION',
};

const customCacheNames = {
    media: 'site-media',
};

// This is for static assets. You will need to implement your own precaching
// for dynamic resources
precacheAndRoute(self.__WB_MANIFEST);

/**
 * Example Dynamic loading of content
 */
// const apiConfig = workerRestAPIConfig;
// const getParseApi = () => {
//     return (url, body = {}, config = {}) => {
//         return fetch(`${apiConfig.restAPI}${url}`, {
//             ...config,
//             method: 'POST',
//             body: JSON.stringify(body),
//             headers: {
//                 ...op.get(config, 'headers', {}),
//                 'X-Parse-Application-Id': apiConfig.actiniumAppId,
//             },
//         });
//     };
// };

// const prefetchMedia = async () => {
//     const api = getParseApi();
//     const mediaRequest = await fetch('/media/all');
//     const files = await mediaRequest.json();
//     const cache = await caches.open(customCacheNames.media);
//     console.log(`Precaching ${customCacheNames.media}`);
//     for (const url of files) {
//         const mediaResponse = await fetch(url, { mode: 'no-cors' });
//         cache.put(url, mediaResponse.clone());
//     }
// };
//
// self.addEventListener('install', event => {
//     event.waitUntil(
//         Promise.all([
//             // Pre-cache media
//             prefetchMedia(),
//         ]),
//     );
// });

self.addEventListener('install', event => {
    skipWaiting();
});

self.addEventListener('activate', event => {
    clientsClaim();
});

self.addEventListener('message', event => {
    if (event.data.type === messageTypes.GET_VERSION) {
        event.ports[0].postMessage(SW_VERSION);
    }
});
