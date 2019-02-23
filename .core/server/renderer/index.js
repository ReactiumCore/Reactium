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

const styles = (req, res, includeSheets = [], excludeSheets = []) => {
    let sarr = [];
    const theme = op.get(
        req,
        'query.theme',
        process.env.DEFAULT_THEME || 'style',
    );
    const defaultStylesheet = `${theme}.css`;

    let styles = [];
    let publicDir =
        process.env.PUBLIC_DIRECTORY || path.resolve(process.cwd(), 'public');
    let styleDir = path.normalize(path.join(publicDir, '/assets/style'));
    let includes = [defaultStylesheet].concat(includeSheets);
    let excludes = ['core.css', 'toolkit.css'].concat(excludeSheets);

    if (isToolkit(req.path)) {
        const p = path.normalize(path.join(styleDir, 'core.css'));
        styles.push(
            `<link rel="stylesheet" href="${p.split(publicDir).join('')}">`,
        );
    } else {
        styles = styles.concat(
            fs
                .readdirSync(styleDir)
                .map(item => {
                    const p = path.normalize(path.join(styleDir, item));
                    if (fs.statSync(p).isFile()) {
                        return `<link rel="stylesheet" href="${p
                            .split(publicDir)
                            .join('')}">`;
                    }
                    return false;
                })
                .filter(item => {
                    if (
                        item &&
                        includes.find(search => item.indexOf(search) >= 0)
                    ) {
                        return true;
                    }

                    if (
                        !item ||
                        excludes.find(search => item.indexOf(search) >= 0)
                    ) {
                        return false;
                    }
                }),
        );
    }

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
        .sync(path.resolve(scriptPathBase, 'assets', 'js', '*main.js'))
        .map(script => path.parse(script).base)
        .map(script => `<script src="/assets/js/${script}"></script>`)
        .join('\n');

    if (process.env.NODE_ENV === 'development') {
        const assetsByChunkName = res.locals.webpackStats.toJson()
            .assetsByChunkName;

        scriptTags = Object.values(assetsByChunkName)
            .map(chunk => {
                return normalizeAssets(chunk).filter(path =>
                    path.endsWith('.js'),
                );
            })
            .reduce((files, chunk) => files.concat(chunk), [])
            .filter(file => /main.js$/.test(file))
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

            const { includeSheets, excludeSheets } = localTemplate;

            req.styles = styles(req, res, includeSheets, excludeSheets);

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
