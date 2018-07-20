const normalizeAssets = assets => (Array.isArray(assets) ? assets : [assets]);
const globby = require('globby');
const path = require('path');
const fs = require('fs');
const semver = require('semver');

const isToolkit = str => {
    let exp = /^\/toolkit/i;
    return exp.test(str);
};

const isMain = str => {
    let exp = /^\/main/i;
    return exp.test(str);
};

const styles = (req, res) => {
    let css = isToolkit(req.path) === true ? 'toolkit.css' : 'style.css';
    let styles = [`<link rel="stylesheet" href="/assets/style/${css}">`];

    return styles.join('\n\t');
};

const preferVendors = (a, b) => {
    if (a === 'vendors.js') return -1;
    if (b === 'vendors.js') return 1;
    return 0;
};

const scripts = (req, res) => {
    const scriptPathBase =
        process.env.PUBLIC_DIRECTORY || `${process.cwd()}/public`;

    let scriptTags = globby
        .sync(path.resolve(scriptPathBase, 'assets', 'js', '*.js'))
        .map(script => path.parse(script).base)
        .sort(preferVendors)
        .map(script => `<script src="/assets/js/${script}"></script>`)
        .join('\n');

    if (process.env.NODE_ENV === 'development') {
        const assetsByChunkName = res.locals.webpackStats.toJson()
            .assetsByChunkName;

        scriptTags = Object.values(assetsByChunkName)
            .map(chunk =>
                normalizeAssets(chunk).filter(path => path.endsWith('.js'))
            )
            .reduce((files, chunk) => files.concat(chunk), [])
            .sort(preferVendors)
            .map(path => `<script src="/${path}"></script>`)
            .join('\n');
    }

    return scriptTags;
};

const sanitizeTemplateVersion = version => {
    if (semver.valid(version)) {
        return version;
    }
    return semver.coerce(version);
};

export default (req, res, context) => {
    req.scripts = scripts(req, res);
    req.styles = styles(req, res);

    let template,
        renderMode =
            'SSR_MODE' in process.env && process.env.SSR_MODE === 'on'
                ? 'ssr'
                : 'feo';

    const { semver: coreSemver } = require(`${rootPath}/.core/reactium-config`);
    const coreTemplate = require(`../template/${renderMode}`);

    template = coreTemplate.template;
    if (fs.existsSync(`${rootPath}/src/app/server/template/${renderMode}.js`)) {
        let localTemplate = require(`${rootPath}/src/app/server/template/${renderMode}`);
        let templateVersion = sanitizeTemplateVersion(localTemplate.version);

        // Check to see if local template should be compatible with core
        if (semver.satisfies(templateVersion, coreSemver)) {
            template = localTemplate.template;
        }
    }

    return require(`./${renderMode}`)(template)(req, res, context);
};
