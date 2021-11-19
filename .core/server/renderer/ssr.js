const { fork } = require('child_process');
import op from 'object-path';
import fs from 'fs-extra';
import path from 'path';
import { Hook } from 'reactium-core/sdk';

const app = {};
app.dependencies = global.dependencies;

const simplifyRequest = req => {
    const reqFields = [
        'baseUrl',
        'body',
        'cookies',
        'fresh',
        'hostname',
        'ip',
        'ips',
        'method',
        'originalUrl',
        'params',
        'path',
        'protocol',
        'query',
        'isSSR',
        'renderMode',
        'scripts',
        'headerScripts',
        'styles',
        'appGlobals',
        'appAfterScripts',
        'headTags',
        'appBindings',
    ];

    Hook.run('ssr-request-fields', reqFields);

    return reqFields.reduce((fields, field) => {
        fields[field] = op.get(req, field);
        return fields;
    }, {});
};

const renderer = async (req, res, context) => {
    const [url] = req.originalUrl.split('?');

    try {
        const ssr = fork(path.resolve(__dirname, './ssr-thread.js'));
        const { rendered, context: ssrContext } = await new Promise(
            (resolve, reject) => {
                ssr.send({
                    url,
                    query: op.get(req, 'query', {}),
                    req: simplifyRequest(req),
                    bootHooks: global.bootHooks,
                    appGlobals: req.Server.AppGlobals.list,
                });
                ssr.on('message', resolve);
                ssr.on('error', reject);
            },
        );
        ssr.kill();

        // pass context up
        Object.entries(ssrContext).forEach(([key, value]) =>
            op.set(context, key, value),
        );
        Object.entries(rendered).forEach(([key, value]) =>
            op.set(req, key, value),
        );

        const html = req.template(req);

        // Server Side Generation - Conditionally Caching Routed Components markup
        if (req.ssgPaths) {
            if (
                Array.isArray(req.ssgPaths) &&
                req.ssgPaths.includes(req.originalUrl)
            ) {
                const staticHTMLPath = path.normalize(
                    staticHTML + req.originalUrl,
                );
                fs.ensureDirSync(staticHTMLPath);
                fs.writeFileSync(
                    path.resolve(staticHTMLPath, 'index.html'),
                    html,
                    'utf8',
                );
            }
        }

        return html;
    } catch (error) {
        ERROR('Page data loading error.', error);
    }
};

module.exports = renderer;
