const normalizeAssets = assets => Array.isArray(assets) ? assets : [assets];

const isToolkit = (path) => {
    let exp = /^\/toolkit/i;
    return exp.test(path);
};

const scripts = (req, res) => {
    // let js      = (isToolkit(req.path) === true) ? 'toolkit.js' : 'main.js';
    // let scripts = [
    //     `<script src="/assets/js/vendors.js"></script>`,
    //     `<script src="/assets/js/${js}"></script>`
    // ];

    let scripts = [
        `<script src="/assets/js/vendors.js"></script>`,
        `<script src="/assets/js/main.js"></script>`
    ];

    if (process.env.NODE_ENV === 'development') {
        const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;
        const { vendors, main } = assetsByChunkName;
        //const { vendors, main, toolkit } = assetsByChunkName;
        //let chunks = (isToolkit(req.path) === true) ? [ vendors, toolkit ] : [ vendors, main ];
        let chunks = [vendors, main];
        scripts = chunks.map(chunk => normalizeAssets(chunk).filter(path => path.endsWith('.js')))
            .reduce((files, chunk) => files.concat(chunk), [])
            .map(path => `<script src="${path}"></script>`);
    }

    return scripts.join('\n\t');
};

const styles = (req, res) => {
    let css    = (isToolkit(req.path) === true) ? 'toolkit.css' : 'style.css';
    let styles = [
        `<link rel="stylesheet" href="/assets/style/${css}" />`
    ];

    return styles.join('\n\t');
};

export default (req, res, context) => {
    req.scripts = scripts(req, res);
    req.styles  = styles(req, res);

    if ('SSR_MODE' in process.env && process.env.SSR_MODE === 'on') {
        const ssr = require('./ssr');
        return ssr(req, res, context);
    }

    const feTemplate = require('./fe-only');
    return Promise.resolve(feTemplate(req, res, context));
};
