import fs from 'fs';
import _ from 'underscore';

const ssrStartup = async () => {
    if (global.SSR_STARTED) return;
    global.SSR_STARTED = true;

    await require('./server-globals')();
    DEBUG('SSR/SSG Startup.');
    const { default: deps } = await import('dependencies');
    global.dependencies = deps;

    if (global.useJSDOM && !global.window) {
        // react-side-effect/lib/index.js:85:17 does the opposite of normal
        // it tries to check to see if the DOM is available, and blows up if it
        // does on static render
        // Fixes "You may only call rewind() on the server. Call peek() to read the current state." throw.
        //
        // The condition used for this error is set at file scope of this loaded early, so
        // let's get this in early, before creating global.window with JSDOM.
        require('react-side-effect');

        const jsdom = require('jsdom');
        const { JSDOM } = jsdom;
        const { window } = new JSDOM('<!DOCTYPE html>');
        const { document, navigator, location } = window;

        // build a soft cushy server-side window environment to catch server-unsafe code
        global.window = window;
        global.JSDOM = window;
        global.document = document;
        global.navigator = navigator;
        global.location = location;

        // Important: We'll use this to differential the JSDOM "window" from others.
        global.window.isJSDOM = true;
        DEBUG('SSR: creating JSDOM object as global.window.');
    }

    await deps().loadAll('allHooks');
    await ReactiumBoot.Hook.run('init');
    await ReactiumBoot.Hook.run('dependencies-load');
    await ReactiumBoot.Zone.init();
    await ReactiumBoot.Routing.load();
    await ReactiumBoot.Hook.run('plugin-dependencies');
    global.routes = ReactiumBoot.Routing.get();

    if (!'defines' in global) {
        global.defines = {};
    }

    if (fs.existsSync(`${rootPath}/src/app/server/defines.js`)) {
        const defs = require(`${rootPath}/src/app/server/defines.js`);
        Object.keys(defs).forEach(key => {
            if (key !== 'process.env') {
                global.defines[key] = defs[key];
            }
        });
    }

    await ReactiumBoot.Hook.run('plugin-ready');
    await ReactiumBoot.Hook.run('app-context-provider');
};

module.exports = ssrStartup;
