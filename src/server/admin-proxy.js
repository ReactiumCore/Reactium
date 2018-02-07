import proxy from 'express-http-proxy';
import { Duplex } from 'stream';

export const adminProxy = (app, port, adminURL) => {
    // translate admin assets back to root of proxied url
    app.use(
        ['/admin/assets/*'],
        proxy(`${adminURL}`, {
            proxyReqOptDecorator: req => {
                req.headers['x-forwarded-host'] = `localhost:${port}`;
                return req;
            },
            proxyReqPathResolver: req => {
                const resolvedPath = `${adminURL.replace(/\/admin/, '')}${req.originalUrl.replace(/\/admin/, '')}`;
                return resolvedPath;
            },
        })
    );

    // proxy admin pages, replacing all assets so they will be proxied by above rule
    app.use(
        ['/admin', '/admin/*'],
        proxy(`${adminURL}`, {
            proxyReqOptDecorator: req => {
                req.headers['x-forwarded-host'] = `localhost:${port}`;
                return req;
            },
            proxyReqPathResolver: req => {
                const resolvedPath = `${adminURL}${req.url}`;
                return resolvedPath;
            },
            userResDecorator: (proxyRes, proxyResData) => {
                return new Promise((resolve, reject) => {
                    let stream = new Duplex;
                    let buffers = [];
                    stream.push(proxyResData);
                    stream.push(null);
                    stream.on('error', reject);
                    stream.on('data', data => buffers.push(data));
                    stream.on('end', () => {
                        let body = buffers.map(buff => buff.toString('utf8')).join('').replace(/\/assets/g, '/admin/assets');
                        resolve(body);
                    })
                })
            },
        })
    )
};
