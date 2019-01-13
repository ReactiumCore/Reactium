const normalizeAssets = assets => (Array.isArray(assets) ? assets : [assets]);
const globby = require('globby');
const path = require('path');
const fs = require('fs');
const semver = require('semver');
const op = require('object-path');

const isToolkit = str => {
    let exp = /^\/toolkit/i;
    return exp.test(str);
};

const isMain = str => {
    let exp = /^\/main/i;
    return exp.test(str);
};

const styles = (req, res) => {
    let sarr = [];

    if (isToolkit(req.path)) {
        sarr.push('/assets/style/core.css');
    } else {
        let publicDir =
            process.env.PUBLIC_DIRECTORY ||
            path.resolve(process.cwd(), 'public');
        let styleDir = path.normalize(path.join(publicDir, '/assets/style'));
        let exclude = ['core.css', 'toolkit.css'];

        fs.readdirSync(styleDir).forEach(item => {
            if (exclude.indexOf(item) >= 0) {
                return;
            }
            let p = path.normalize(path.join(styleDir, item));
            if (fs.statSync(p).isFile()) {
                sarr.push(p.split(publicDir).join(''));
            }
        });
    }

    let styles = sarr.map(item => {
        return `<link rel="stylesheet" href="${item}">`;
    });

    return styles.join('\n\t');
};

const prioritize = scriptName => (a, b) => {
    if (a === scriptName) return -1;
    if (b === scriptName) return 1;
    return 0;
};

const scripts = (req, res) => {
    const scriptPathBase =
        process.env.PUBLIC_DIRECTORY || `${process.cwd()}/public`;

    let scriptTags = globby
        .sync(path.resolve(scriptPathBase, 'assets', 'js', '*.js'))
        .map(script => path.parse(script).base)
        .sort(prioritize('vendors.js'))
        .sort(prioritize('polyfill.js'))
        .map(script => `<script src="/assets/js/${script}"></script>`)
        .join('\n');

    if (process.env.NODE_ENV === 'development') {
        const assetsByChunkName = res.locals.webpackStats.toJson()
            .assetsByChunkName;

        scriptTags = Object.values(assetsByChunkName)
            .map(chunk =>
                normalizeAssets(chunk).filter(path => path.endsWith('.js')),
            )
            .reduce((files, chunk) => files.concat(chunk), [])
            .sort(prioritize('vendors.js'))
            .sort(prioritize('polyfill.js'))
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
        renderMode = isSSR ? 'ssr' : 'feo';

    const { semver: coreSemver } = require(`${rootPath}/.core/reactium-config`);
    const coreTemplate = require(`../template/${renderMode}`);

    template = coreTemplate.template;
    if (fs.existsSync(`${rootPath}/src/app/server/template/${renderMode}.js`)) {
        let localTemplate = require(`${rootPath}/src/app/server/template/${renderMode}`);
        let templateVersion = sanitizeTemplateVersion(localTemplate.version);

        // Check to see if local template should be compatible with core
        if (semver.satisfies(templateVersion, coreSemver)) {
            template = localTemplate.template;

            // Accept local styles
            req.styles =
                op.has(localTemplate, 'styles') && !isToolkit(req.path)
                    ? localTemplate.styles(req)
                    : req.styles;
        } else {
            console.warn(
                `${rootPath}/src/app/server/template/${renderMode}.js is out of date, and will not be used. Use 'arcli server template' command to update.`,
            );
        }
    }

    return require(`./${renderMode}`)(template)(req, res, context);
};
