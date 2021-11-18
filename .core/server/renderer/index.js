const globby = require('globby');
const path = require('path');
const fs = require('fs');
const semver = require('semver');
const op = require('object-path');
const _ = require('underscore');
const serialize = require('serialize-javascript');

const normalizeAssets = assets => _.flatten([assets]);

ReactiumBoot.Hook.registerSync(
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

            const includes = [defaultStylesheet];
            ReactiumBoot.Hook.runSync(
                'Server.AppStyleSheets.includes',
                includes,
            );

            const excludes = ['core.css', 'toolkit.css'];
            ReactiumBoot.Hook.runSync(
                'Server.AppStyleSheets.excludes',
                excludes,
            );

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
    ReactiumBoot.Enums.priority.highest,
    'SERVER-APP-STYLESHEETS-CORE',
);

ReactiumBoot.Hook.registerSync(
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
                        order: ReactiumBoot.Enums.priority.highest,
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
                    order: ReactiumBoot.Enums.priority.highest,
                    footer: true,
                }),
            );
    },
    ReactiumBoot.Enums.priority.highest,
    'SERVER-APP-SCRIPTS-CORE',
);

ReactiumBoot.Hook.registerSync(
    'Server.AppHeaders',
    (req, AppHeaders, res) => {
        AppHeaders.register('shortcut', {
            header:
                '<link rel="shortcut icon" type="image/x-icon" href="/assets/images/favicon.ico" />',
            order: ReactiumBoot.Enums.priority.highest,
        });
        AppHeaders.register('favicon', {
            header:
                '<link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico" />',
            order: ReactiumBoot.Enums.priority.highest,
        });
        AppHeaders.register('viewport', {
            header:
                '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />',
            order: ReactiumBoot.Enums.priority.highest,
        });
        AppHeaders.register('charset', {
            header: '<meta charset="UTF-8" />',
            order: ReactiumBoot.Enums.priority.highest,
        });
    },
    ReactiumBoot.Enums.priority.highest,
    'SERVER-APP-HEADERS-CORE',
);

ReactiumBoot.Hook.registerSync(
    'Server.AppBindings',
    (req, AppBindings) => {
        AppBindings.register('router', {
            template: () => {
                const binding = `<div id="router">${req.content}</div>`;
                return binding;
            },
            requestParams: ['content'],
        });
    },
    ReactiumBoot.Enums.priority.highest,
    'SERVER-APP-BINDINGS-CORE',
);

const sanitizeTemplateVersion = version => {
    if (semver.valid(version)) {
        return version;
    }
    return semver.coerce(version);
};

ReactiumBoot.Hook.registerSync(
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
    ReactiumBoot.Enums.priority.highest,
    'SERVER-BEFORE-APP-CORE-TEMPLATES',
);

ReactiumBoot.Hook.registerSync('Server.AppGlobals', (req, AppGlobals) => {
    AppGlobals.register('actiniumAPIEnabled', {
        name: 'actiniumAPIEnabled',
        value: global.actiniumAPIEnabled,
    });

    if (global.actiniumAPIEnabled) {
        AppGlobals.register('actiniumAppId', {
            name: 'actiniumAppId',
            value: global.actiniumAppId,
        });

        AppGlobals.register('actiniumAPIEnabled', {
            name: 'actiniumAPIEnabled',
            value: global.actiniumAPIEnabled,
        });

        AppGlobals.register('restAPI', {
            name: 'restAPI',
            value: global.actiniumProxyEnabled ? '/api' : global.restAPI,
            serverValue: global.restAPI,
        });
    }
});

const Server = {};
Server.AppHeaders = ReactiumBoot.Utils.registryFactory(
    'AppHeaders',
    'name',
    ReactiumBoot.Utils.Registry.MODES.CLEAN,
);
Server.AppScripts = ReactiumBoot.Utils.registryFactory(
    'AppScripts',
    'name',
    ReactiumBoot.Utils.Registry.MODES.CLEAN,
);
Server.AppSnippets = ReactiumBoot.Utils.registryFactory(
    'AppSnippets',
    'name',
    ReactiumBoot.Utils.Registry.MODES.CLEAN,
);
Server.AppStyleSheets = ReactiumBoot.Utils.registryFactory(
    'AppStyleSheets',
    'name',
    ReactiumBoot.Utils.Registry.MODES.CLEAN,
);
Server.AppBindings = ReactiumBoot.Utils.registryFactory(
    'AppBindings',
    'name',
    ReactiumBoot.Utils.Registry.MODES.CLEAN,
);
Server.AppGlobals = ReactiumBoot.Utils.registryFactory(
    'AppGlobals',
    'name',
    ReactiumBoot.Utils.Registry.MODES.CLEAN,
);

export const renderAppBindings = req => {
    let bindingsMarkup = '';
    _.sortBy(Object.values(Server.AppBindings.list), 'order').forEach(
        ({ component, markup, template, requestParams = [] }) => {
            // Reactium App will lookup these components and bind them
            if (component && typeof component === 'string') {
                bindingsMarkup += `<Component type="${component}"></Component>`;
            } else if (markup && typeof markup === 'string') {
                bindingsMarkup += markup;
            } else if (template && typeof template === 'function') {
                const context = {};
                requestParams.forEach(name => {
                    context[name] = req[name] || '';
                });
                bindingsMarkup += template(context);
            }
        },
    );

    return bindingsMarkup;
};

export default async (req, res, context) => {
    let template,
        renderMode = isSSR ? 'ssr' : 'feo';

    req.Server = Server;

    req.isSSR = isSSR;
    req.renderMode = renderMode;
    req.scripts = '';
    req.headerScripts = '';
    req.styles = '';
    req.appGlobals = '';
    req.appAfterScripts = '';
    req.headTags = '';
    req.appBindings = '';

    const coreTemplate = require(`../template/${renderMode}`);
    req.template = coreTemplate.template;

    /**
     * @api {Hook} Server.beforeApp Server.beforeApp
     * @apiName Server.beforeApp
     * @apiDescription Before index.html template render for SPA template (both Front-end and Server-Side Render). Called before other Server hooks.
     * @apiParam {Object} req express request object
     * @apiParam {Object} Server ReactiumBoot Server object.
     * @apiGroup Hooks
     */
    ReactiumBoot.Hook.runSync('Server.beforeApp', req, Server);
    await ReactiumBoot.Hook.run('Server.beforeApp', req, Server);

    /**
     * @api {Hook} Server.AppGlobals Server.AppGlobals
     * @apiName Server.AppGlobals
     * @apiDescription Before index.html template render for SPA template (both Front-end and Server-Side Render). Defines window globals to be defined in template. Will also define
     global for nodejs (useful for Server-Side-Rendering).
     * @apiParam {Object} req express request object
     * @apiParam {Object} AppGlobals Server app globals registry object.
     * @apiParam (global) {String} name The property name that will be added to window (for browser) or global (for nodejs).
     * @apiParam (global) {Mixed} value any javascript value that can be serialized for use in a script tag
     * @apiParam (global) {Mixed} [serverValue] optional different value for the server global, useful when value should be used differently on the server code
     * @apiExample reactium-boot.js
     // will result in window.environment = 'local' in browser and global.environment = 'local' on nodejs
     ReactiumBoot.Hook.registerSync(
         'Server.AppGlobals',
         (req, AppGlobals) => {
             // Find the registered component "DevTools" and bind it
             AppGlobals.register('environment', {
                 name: 'environment',
                 value: 'local',
             });
         });
     * @apiGroup Hooks
     */
    ReactiumBoot.Hook.runSync('Server.AppGlobals', req, Server.AppGlobals);
    await ReactiumBoot.Hook.run('Server.AppGlobals', req, Server.AppGlobals);

    // Add application globals
    _.sortBy(Object.values(Server.AppGlobals.list), 'order').forEach(
        ({ name, value, serverValue }) => {
            global[name] =
                typeof serverValue !== 'undefined' ? serverValue : value;
            req.appGlobals += `window["${name}"] = ${serialize(value)};\n`;
        },
    );

    /**
     * @api {Hook} Server.AppHeaders Server.AppHeaders
     * @apiName Server.AppHeaders
     * @apiDescription Before index.html template render for SPA template (both Front-end and Server-Side Render). Defines html head tags (exluding stylesheet).
     Use this hook to register/unregister <head> tags as strings. Note: if using Server Side Render and react-helmet, this is often unnecessary to do.
     * @apiParam {Object} req express request object
     * @apiParam {Object} AppHeaders Server app header registry object.
     * @apiExample reactium-boot.js
     ReactiumBoot.Hook.register('Server.AppHeaders', async (req, AppHeaders) => {
        // given some data was added to req by express middleware
        const seo = req.seo;
        if (seo) {
            if (seo.canonicalURL) {
                AppHeaders.register('canonical-url', {
                    header: `<link rel="canonical" href="${seo.canonicalURL}" />`
                });
            }
            if (seo.description) {
                AppHeaders.register('meta-description', {
                    header: `<meta name="description" content="${seo.description}"/>`
                });
            }
        }
     });
     * @apiGroup Hooks
     */
    ReactiumBoot.Hook.runSync('Server.AppHeaders', req, Server.AppHeaders, res);
    await ReactiumBoot.Hook.run(
        'Server.AppHeaders',
        req,
        Server.AppHeaders,
        res,
    );

    // Add header tags
    _.sortBy(Object.values(Server.AppHeaders.list), 'order').forEach(
        ({ header = '' }) => {
            req.headTags += header;
        },
    );

    /**
     * @api {Hook} Server.AppScripts Server.AppScripts
     * @apiName Server.AppScripts
     * @apiDescription Before index.html template render for SPA template (both Front-end and Server-Side Render). Defines javascript files to be loaded.
     * @apiParam {Object} req express request object
     * @apiParam {Object} AppScripts Server app scripts registry object.
     * @apiParam (script) {Boolean} [footer=true] Place the script tag in the footer if true
     * @apiParam (script) {Boolean} [header=false] Place the script tag above the body if true
     * @apiParam (script) {String} [path] the src of the javascript
     * @apiParam (script) {String} [charset=UTF-8] charset attribute
     * @apiParam (script) {String} [type] type attribute
     * @apiParam (script) {Boolean} [defer=false] Add defer attribute
     * @apiParam (script) {Boolean} [async=false] Add async attribute
     * @apiParam (script) {Boolean} [content] script content
     * @apiParam (script) {Number} [order=0] loading order of script
     * @apiExample reactium-boot.js
     ReactiumBoot.Hook.register('Server.AppScripts', async (req, AppScripts) => {
         AppScripts.register('my-onsite-script', {
             path: '/assets/js/some-additional.js'
             footer: true, // load in footer (optional)
             header: false, // don't load in header (optional)
             order: 1, // scripts will be ordered by this
         });

         AppScripts.register('my-csn-script', {
             path: 'https://cdn.example.com/cdn.loaded.js'
             header: true, // maybe for an external
             order: 1, // scripts will be ordered by this
         });
     });
     * @apiGroup Hooks
     */
    ReactiumBoot.Hook.runSync('Server.AppScripts', req, Server.AppScripts, res);
    await ReactiumBoot.Hook.run(
        'Server.AppScripts',
        req,
        Server.AppScripts,
        res,
    );

    // Add scripts and headerScripts
    _.sortBy(Object.values(Server.AppScripts.list), 'order').forEach(
        ({
            path,
            footer = true,
            header = false,
            charset = 'UTF-8',
            type,
            defer = false,
            async = false,
            content,
        }) => {
            const attributes = {
                charset: typeof charset === 'string' && `charset="${charset}"`,
                defer: defer === true && 'defer',
                type: typeof type === 'string' && `type="${type}"`,
                src: typeof path === 'string' && `src="${path}"`,
                async: async === true && 'async',
            };

            content =
                typeof content === 'string'
                    ? `//<![CDATA[\n${content}//]]>\n`
                    : '';

            const script = `<script ${_.compact(Object.values(attributes)).join(
                ' ',
            )}>${content}</script>\n`;
            if (footer) {
                req.scripts += script;
                return;
            }

            if (header || !footer) {
                req.headerScripts += script;
            }
        },
    );

    /**
     * @api {Hook} Server.AppStyleSheets Server.AppStyleSheets
     * @apiName Server.AppStyleSheets
     * @apiDescription Before index.html template render for SPA template (both Front-end and Server-Side Render). Defines css files to be loaded.
     * @apiParam {Object} req express request object
     * @apiParam {Object} AppStyleSheets Server app styles registry object.
     * @apiParam (stylesheet) {String} [href] the src of the stylesheet or resource
     * @apiParam (stylesheet) {Number} [order=0] loading order of stylesheet or resource
     * @apiParam (stylesheet) {String} [rel=stylesheet] the rel attribute
     * @apiParam (stylesheet) {String} [crossorigin] the crossorigin attribute
     * @apiParam (stylesheet) {String} [referrerpolicy] the referrerpolicy attribute
     * @apiParam (stylesheet) {String} [hrefLang] the hreflang attribute
     * @apiParam (stylesheet) {String} [sizes] the sizes attribute if rel=icon
     * @apiParam (stylesheet) {String} [type] the type attribute
     * @apiParam (stylesheet) {Function} [when] callback passed the request object, and returns true or false if the css should be included
     * @apiExample reactium-boot.js
     ReactiumBoot.Hook.register('Server.AppStyleSheets', async (req, AppStyleSheets) => {
         AppStyleSheets.register('my-stylesheet', {
             href: '/assets/css/some-additional.css'
         });

         AppStyleSheets.register('my-csn-script', {
             href: 'https://cdn.example.com/cdn.loaded.css'
             order: 1, // scripts will be ordered by this
         });
     });
     * @apiGroup Hooks
     */
    ReactiumBoot.Hook.runSync(
        'Server.AppStyleSheets',
        req,
        Server.AppStyleSheets,
    );
    await ReactiumBoot.Hook.run(
        'Server.AppStyleSheets',
        req,
        Server.AppStyleSheets,
    );

    // Add stylesheets
    _.sortBy(Object.values(Server.AppStyleSheets.list), 'order').forEach(
        ({
            path,
            href,
            rel = 'stylesheet',
            crossorigin,
            referrerpolicy,
            hrefLang,
            media,
            sizes,
            type,
            when = () => true,
        }) => {
            const hrefPath = path || href;
            const attributes = {
                rel:
                    typeof rel === 'string' &&
                    [
                        'alternate',
                        'author',
                        'dns-prefetch',
                        'help',
                        'icon',
                        'license',
                        'next',
                        'pingback',
                        'preconnect',
                        'prefetch',
                        'preload',
                        'prerender',
                        'prev',
                        'search',
                        'stylesheet',
                    ].includes(rel) &&
                    `rel="${rel}"`,
                crossorigin:
                    typeof crossorigin === 'string' &&
                    ['anonymous', 'use-credentials'].includes(crossorigin) &&
                    `crossorigin="${crossorigin}"`,
                referrerpolicy:
                    typeof referrerpolicy === 'string' &&
                    [
                        'no-referrer',
                        'no-referrer-when-downgrade',
                        'origin',
                        'origin-when-cross-origin',
                        'unsafe-url',
                    ].includes(referrerpolicy) &&
                    `referrerpolicy="${referrerpolicy}"`,
                href: typeof hrefPath === 'string' && `href="${hrefPath}"`,
                hrefLang:
                    typeof hrefLang === 'string' && `hreflang="${hrefLang}"`,
                media: typeof media === 'string' && `media="${media}"`,
                sizes:
                    typeof sizes === 'string' &&
                    rel === 'icon' &&
                    `sizes="${media}"`,
                type: typeof type === 'string' && `type="${type}"`,
            };

            const stylesSheet = `<link ${_.compact(
                Object.values(attributes),
            ).join(' ')} />\n`;
            if (when(req, hrefPath)) req.styles += stylesSheet;
        },
    );

    /**
     * @api {Hook} Server.AppBindings Server.AppBindings
     * @apiName Server.AppBindings
     * @apiDescription Before index.html template render for SPA template (both Front-end and Server-Side Render). Defines React bind pointes in markup.
     * @apiParam {Object} req express request object
     * @apiParam {Object} AppBindings Server app binding registry object.
     * @apiParam (binding) {String} [component] string name of component to bind directly if possible (must be in a webpack search context in reactium-config)
     * @apiParam (binding) {String} [markup] ordinary markup that React will use to bind the app.
     * @apiExample reactium-boot.js
     ReactiumBoot.Hook.registerSync(
         'Server.AppBindings',
         (req, AppBindings) => {
             // Find the registered component "DevTools" and bind it
             AppBindings.register('DevTools', {
                 component: 'DevTools',
             });

             // Add ordinary markup for React to bind to
             AppBindings.register('router', {
                 markup: '<div id="router"></div>',
             });
         },
         ReactiumBoot.Enums.priority.highest,
         'SERVER-APP-BINDINGS-CORE',
     );
     * @apiGroup Hooks
     */
    ReactiumBoot.Hook.runSync('Server.AppBindings', req, Server.AppBindings);
    await ReactiumBoot.Hook.run('Server.AppBindings', req, Server.AppBindings);
    req.appBindings = renderAppBindings(req);

    /**
     * @api {Hook} Server.AppSnippets Server.AppSnippets
     * @apiName Server.AppSnippets
     * @apiDescription Before index.html template render for SPA template (both Front-end and Server-Side Render). Defines snippets of code to be added to document in their entirety.
     * @apiParam {Object} req express request object
     * @apiParam {Object} AppSnippets Server app snippets registry object.
     * @apiExample reactium-boot.js
     ReactiumBoot.Hook.register('Server.AppSnippets', async (req, AppSnippets) => {
        AppSnippets.register('ga-tracking', {
            snippet: `<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', '', 'auto');
ga('send', 'pageview');
</script>`,
          order: 1,
        })
     });
     * @apiGroup Hooks
     */
    ReactiumBoot.Hook.runSync('Server.AppSnippets', req, Server.AppSnippets);
    await ReactiumBoot.Hook.run('Server.AppSnippets', req, Server.AppSnippets);

    // Add entire text script snippets
    _.sortBy(Object.values(Server.AppSnippets.list), 'order').forEach(
        ({ snippet = '' }) => {
            req.appAfterScripts += `${snippet}\n`;
        },
    );

    /**
     * @api {Hook} Server.afterApp Server.afterApp
     * @apiName Server.afterApp
     * @apiDescription Before index.html template render for SPA template (both Front-end and Server-Side Render). Called after other Server hooks.
     * @apiParam {Object} req express request object
     * @apiParam {Object} Server ReactiumBoot Server object.
     * @apiGroup Hooks
     */
    ReactiumBoot.Hook.runSync('Server.afterApp', req, Server);
    await ReactiumBoot.Hook.run('Server.afterApp', req, Server);

    return require(`./${renderMode}`)(req, res, context);
};
