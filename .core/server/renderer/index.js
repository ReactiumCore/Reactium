const globby = require('globby');
const path = require('path');
const fs = require('fs');
const semver = require('semver');
const op = require('object-path');
const _ = require('underscore');
const serialize = require('serialize-javascript');
const SDK = require('reactium-core/sdk').default;

const normalizeAssets = assets => _.flatten([assets]);

const isToolkit = str => {
    return /^\/toolkit/i.test(str);
};

SDK.Hook.registerSync(
    'Server.AppStyleSheets',
    (req, AppStyleSheets) => {
        const theme = op.get(
            req,
            'query.theme',
            process.env.DEFAULT_THEME || 'style',
        );

        const defaultStylesheet = `${theme}.css`;

        let styles = [];
        let publicDir =
            process.env.PUBLIC_DIRECTORY ||
            path.resolve(process.cwd(), 'public');
        let styleDir = path.normalize(path.join(publicDir, '/assets/style'));

        const corePath = path
            .normalize(path.join(styleDir, 'core.css'))
            .split(publicDir)
            .join('');

        const when = (req, itemPath) => {
            const [url] = req.originalUrl.split('?');

            if (isToolkit(url)) {
                if (/core.css$/.test(itemPath)) return true;
                return false;
            }

            const includes = [defaultStylesheet];
            SDK.Hook.runSync('Server.AppStyleSheets.includes', includes);

            const excludes = ['core.css', 'toolkit.css'];
            SDK.Hook.runSync('Server.AppStyleSheets.excludes', excludes);

            const included = Boolean(
                includes.find(search => itemPath.indexOf(search) >= 0),
            );
            const excluded = Boolean(
                excludes.find(search => itemPath.indexOf(search) >= 0),
            );

            return included && !excluded;
        };

        fs.readdirSync(styleDir).forEach(item => {
            const itemPath = path.normalize(path.join(styleDir, item));
            const cssPath = itemPath.split(publicDir).join('');

            AppStyleSheets.register(path.basename(itemPath), {
                path: itemPath.split(publicDir).join(''),
                when,
            });
        });
    },
    SDK.Enums.priority.highest,
);

SDK.Hook.registerSync(
    'Server.AppScripts',
    (req, AppScripts, res) => {
        // Webpack assets
        if (process.env.NODE_ENV === 'development') {
            const assetsByChunkName = res.locals.webpackStats.toJson()
                .assetsByChunkName;

            Object.values(assetsByChunkName).forEach(chunk => {
                _.flatten([
                    normalizeAssets(chunk)
                        .filter(path => path.endsWith('.js'))
                        .filter(path => /main\.js$/.test(path)),
                ]).forEach(path =>
                    AppScripts.register(path, {
                        path: `/${path}`,
                        order: SDK.Enums.priority.highest,
                        footer: true,
                    }),
                );
            });

            return;
        }

        const scriptPathBase =
            process.env.PUBLIC_DIRECTORY || `${process.cwd()}/public`;

        globby
            .sync(
                path
                    .resolve(scriptPathBase, 'assets', 'js', '*main.js')
                    .replace(/\\/g, '/'),
            )
            .map(script => `/assets/js/${path.parse(script).base}`)
            .forEach(path =>
                AppScripts.register(path, {
                    path,
                    order: SDK.Enums.priority.highest,
                    footer: true,
                }),
            );
    },
    SDK.Enums.priority.highest,
);

const sanitizeTemplateVersion = version => {
    if (semver.valid(version)) {
        return version;
    }
    return semver.coerce(version);
};

SDK.Hook.registerSync(
    'Server.beforeApp',
    req => {
        const renderMode = op.get(req, 'renderMode', 'feo');
        const {
            semver: coreSemver,
        } = require(`${rootPath}/.core/reactium-config`);

        if (
            fs.existsSync(
                `${rootPath}/src/app/server/template/${renderMode}.js`,
            )
        ) {
            let localTemplate = require(`${rootPath}/src/app/server/template/${renderMode}`);
            let templateVersion = sanitizeTemplateVersion(
                localTemplate.version,
            );

            // Check to see if local template should be compatible with core
            if (semver.satisfies(templateVersion, coreSemver)) {
                req.template = localTemplate.template;
            } else {
                console.warn(
                    `${rootPath}/src/app/server/template/${renderMode}.js is out of date, and will not be used. Use 'arcli server template' command to update.`,
                );
            }
        }
    },
    SDK.Enums.priority.highest,
);

export default async (req, res, context) => {
    let template,
        renderMode = isSSR ? 'ssr' : 'feo';

    req.isSSR = isSSR;
    req.renderMode = renderMode;
    req.scripts = '';
    req.headerScripts = '';
    req.styles = '';
    req.appGlobals = '';
    req.appAfterScripts = '';
    req.headTags = `<link rel="shortcut icon" type="image/x-icon" href="/assets/images/favicon.ico" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
<meta charSet="utf-8" />`;

    req.appBindings =
        '<Component type="DevTools"></Component><div id="router"></div>';

    const coreTemplate = require(`../template/${renderMode}`);
    req.template = coreTemplate.template;

    // early registration
    SDK.Hook.runSync('Server.beforeApp', req, SDK.Server);

    // register scripts, response is needed for webpack dev server
    SDK.Hook.runSync('Server.AppScripts', req, SDK.Server.AppScripts, res);

    // register script snippets to run after scripts
    SDK.Hook.runSync('Server.AppSnippets', req, SDK.Server.AppSnippets);

    // register stylesheets
    SDK.Hook.runSync('Server.AppStyleSheets', req, SDK.Server.AppStyleSheets);

    // register globals (on window)
    SDK.Hook.runSync('Server.AppGlobals', req, SDK.Server.AppGlobals);

    // useful to unregister
    SDK.Hook.runSync('Server.afterApp', req, SDK.Server);

    // Add scripts and headerScripts
    _.sortBy(Object.values(SDK.Server.AppScripts.list), 'order').forEach(
        ({ path, footer = true, header = false }) => {
            const script = `<script src="${path}"></script>\n`;
            if (footer) {
                req.scripts += script;
                return;
            }

            if (header || !footer) {
                req.headerScripts += script;
            }
        },
    );

    // Add stylesheets
    _.sortBy(Object.values(SDK.Server.AppStyleSheets.list), 'order').forEach(
        ({ path, when = () => true }) => {
            const stylesSheet = `<link rel="stylesheet" href="${path}" />\n`;
            if (when(req, path)) req.styles += stylesSheet;
        },
    );

    // Add application globals
    _.sortBy(Object.values(SDK.Server.AppGlobals.list), 'order').forEach(
        ({ name, value }) => {
            global[name] = value;
            req.appGlobals += `window["${name}"] = ${serialize(value)};\n`;
        },
    );

    // Add entire text script snippets
    _.sortBy(Object.values(SDK.Server.AppSnippets.list), 'order').forEach(
        ({ snippet = '' }) => {
            req.appAfterScripts += `${snippet}\n`;
        },
    );

    return require(`./${renderMode}`)(req, res, context);
};
