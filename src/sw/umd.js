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
import { skipWaiting, clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
// import {NavigationRoute, registerRoute} from 'workbox-routing';

skipWaiting();

clientsClaim();

console.log('Customizable service worker!');

// This is for static assets. You will need to implement your own precaching
// for dynamic resources
precacheAndRoute(self.__WB_MANIFEST);
