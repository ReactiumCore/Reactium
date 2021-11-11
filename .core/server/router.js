import express from 'express';
import renderer from './renderer';
import fs from 'fs';
import path from 'path';
import httpAuth from 'http-auth';
import op from 'object-path';
import _ from 'underscore';

const router = express.Router();

// Conditional basic auth
const basicAuthFile = path.resolve(process.env.BASIC_AUTH_FILE || '.htpasswd');
if (fs.existsSync(basicAuthFile)) {
    router.use((req, res, next) => {
        if (req.url !== '/elb-healthcheck') {
            let basic = httpAuth.basic({
                realm: 'Reactium.',
                file: basicAuthFile,
            });

            httpAuth.connect(basic)(req, res, next);
        } else {
            next();
        }
    });
}

router.get('/elb-healthcheck', (req, res) => res.send('Up'));

router.get('/ssg-paths', async (req, res) => {
    if (process.env.SSR_MODE !== 'on') {
        res.status(403).json({
            error: 'You must start server in Server Side Rendering mode.',
        });
        return;
    }

    let paths = [];
    for (let route of ReactiumBoot.Routing.get()) {
        const loadPaths = op.get(
            route,
            'component.loadPaths',
            op.get(route, 'loadPaths'),
        );
        if (typeof loadPaths == 'function') {
            try {
                const routePaths = await loadPaths(route);
                paths = paths.concat(routePaths);
            } catch (error) {
                console.error(
                    'Unable to load Server Side Generation paths for route',
                    { route },
                );
            }
        }
    }

    res.send(_.uniq(paths));
});

process.on('unhandledRejection', (reason, p) => {
    ERROR('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

router.use(async (req, res, next) => {
    const [url] = req.originalUrl.split('?');
    const parsed = path.parse(path.basename(url));

    // Slim down index.html handling to paths that aren't handling a file extension
    if (['', 'htm', 'html'].includes(parsed.ext)) {
        const context = {};

        try {
            const content = await renderer(req, res, context);
            if (context.url) {
                INFO('Redirecting to ', context.url);
                return res.redirect(302, context.url);
            }

            const responseHeaders = {};

            /**
             * @api {Hook} Server.ResponseHeaders Server.ResponseHeaders
             * @apiName Server.ResponseHeaders
             * @apiDescription On html template responses on server, this hook is called
             when HTTP headers are added to the response. Both sync and async hook is called.
             * @apiParam {Object} responseHeaders object with key pairs (header name => header value)
             * @apiParam {Object} req Node/Express request object
             * @apiParam {Object} res Node/Express response object
             * @apiGroup Hooks
             */
            ReactiumBoot.Hook.runSync(
                'Server.ResponseHeaders',
                responseHeaders,
                req,
                res,
            );
            await ReactiumBoot.Hook.run(
                'Server.ResponseHeaders',
                responseHeaders,
                req,
                res,
            );
            Object.entries(responseHeaders).forEach(([key, value]) =>
                res.set(key, value),
            );

            let status = 200;
            if (/^\/404/.test(req.path) || context.notFound) {
                status = 404;
            }

            res.status(status).send(content);
        } catch (err) {
            ERROR('React SSR Error', err);
            res.status(500).send('[Reactium] Internal Server Error');
        }
    } else {
        // let assets naturally 404, or be handled by subsequent middleware
        next();
    }
});

export default router;
