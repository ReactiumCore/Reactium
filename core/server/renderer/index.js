const normalizeAssets = assets => Array.isArray(assets) ? assets : [assets];

const scripts = res => {
    let scripts =
        '<script src="/assets/js/vendors.js"></script>' +
        '<script src="/assets/js/main.js"></script>';

    if ( process.env.NODE_ENV === 'development' ) {
        const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;
        const { vendors, main } = assetsByChunkName;
        scripts = [ vendors, main ]
            .map(chunk => normalizeAssets(chunk).filter(path => path.endsWith('.js')))
            .reduce((files, chunk) => files.concat(chunk), [])
            .map(path => `<script src="${path}"></script>`)
            .join('\n');
    }
    return scripts;
};

export default (req, res, context) => {
    req.scripts = scripts(res);

    if ( 'SSR_MODE' in process.env && process.env.SSR_MODE === 'on' ) {
        const ssr = require('./ssr');
        return ssr(req, res, context);
    }

    const feTemplate = require('./fe-only');
    return Promise.resolve(feTemplate(req, res, context));
};
