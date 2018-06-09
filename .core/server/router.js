import express from 'express';
import renderer from './renderer';
import fs from 'fs';
import path from 'path';
import httpAuth from 'http-auth';

const router = express.Router();

// Conditional basic auth
const basicAuthFile = path.resolve(process.env.BASIC_AUTH_FILE || '.htpasswd');
if (fs.existsSync(basicAuthFile)) {
    router.use((req, res, next) => {
        if ( req.url !== '/elb-healthcheck' ) {
            let basic    = httpAuth.basic({
                realm    : "Reactium.",
                file     : basicAuthFile
            });

            httpAuth.connect(basic)(req, res, next);
        } else {
            next();
        }
    })
}

router.get('/elb-healthcheck', (req, res) => res.send('Up'));

process.on('unhandledRejection', (reason, p) => {
  console.log('[Reactium] Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

router.get('*', (req, res) => {
    const context = {};

    renderer(req, res, context)
    .then(content => {
        if (context.url) {
            console.log('[Reactium] Redirecting to ', context.url);
            return res.redirect(302, context.url);
        }

        let status = 200;
        if (/^\/404/.test(req.path) || context.notFound ) {
            status = 404;
        }

        res.status(status).send(content);
    })
    .catch(err => {
        console.error('[Reactium] React SSR Error', err);
        res.status(500).send('[Reactium] Internal Server Error');
    });
});

export default router;
