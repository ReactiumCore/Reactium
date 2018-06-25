const normalizeAssets = assets => Array.isArray(assets) ? assets : [assets];
const globby = require('globby');
const path = require('path');

const isToolkit = (path) => {
    let exp = /^\/toolkit/i;
    return exp.test(path);
};

const styles = (req, res) => {
    let css    = (isToolkit(req.path) === true) ? 'toolkit.css' : 'style.css';
    let styles = [
        `<link rel="stylesheet" href="/assets/style/${css}">`
    ];

    return styles.join('\n\t');
};

const preferVendors = (a,b) => {
    if ( a === 'vendors.js' ) return -1;
    if ( b === 'vendors.js' ) return 1;
    return 0;
};


const scripts = res => {

    let scripts = '';

    const scriptPathBase = process.env.PUBLIC_DIRECTORY || `${process.cwd()}/public`;
    scripts = globby
        .sync(path.resolve(scriptPathBase, 'assets', 'js', '*.js'))
        .map(script => path.parse(script).base)
        .sort(preferVendors)
        .map(script => `<script src="/assets/js/${script}"></script>`)
        .join("\n");

    if (process.env.NODE_ENV === 'development') {
        const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;

        const { vendors } = assetsByChunkName;
        scripts = Object.values(assetsByChunkName)
            .map(chunk => normalizeAssets(chunk).filter(path => path.endsWith('.js')))
            .reduce((files, chunk) => files.concat(chunk), [])
            .sort(preferVendors)
            .map(path => `<script src="/${path}"></script>`)
            .join('\n');
    }

    return scripts;
};

export default (req, res, context) => {
    req.scripts = scripts(res);
    req.styles  = styles(req, res);

    if ('SSR_MODE' in process.env && process.env.SSR_MODE === 'on') {
        const ssr = require('./ssr');
        return ssr(req, res, context);
    }

    const feTemplate = require('./fe-only');
    return Promise.resolve(feTemplate(req, res, context));
};
