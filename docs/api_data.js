define({ "api": [
  {
    "type": "Hook",
    "url": "Hooks",
    "title": "Hooks",
    "name": "Hooks",
    "description": "<p>Here are the standard hooks that fire (in order) on the bootstrap of your Reactium application.</p> <table> <thead> <tr> <th style=\"text-align:left\">Hook</th> <th style=\"text-align:left\">Description</th> </tr> </thead> <tbody> <tr> <td style=\"text-align:left\">init</td> <td style=\"text-align:left\">Called before all other hooks on startup.</td> </tr> <tr> <td style=\"text-align:left\">dependencies-load</td> <td style=\"text-align:left\">Called while application dependencies are loaded.</td> </tr> <tr> <td style=\"text-align:left\">service-worker-init</td> <td style=\"text-align:left\">Called while service worker is loaded.</td> </tr> <tr> <td style=\"text-align:left\">zone-defaults</td> <td style=\"text-align:left\">Called while rendering zone default components are loaded.</td> </tr> <tr> <td style=\"text-align:left\">store-create</td> <td style=\"text-align:left\">Called while Redux store is being created.</td> </tr> <tr> <td style=\"text-align:left\">store-created</td> <td style=\"text-align:left\">Called after Redux store is created.</td> </tr> <tr> <td style=\"text-align:left\">plugin-dependencies</td> <td style=\"text-align:left\">Called before loading runtime plugins.</td> </tr> <tr> <td style=\"text-align:left\">plugin-init</td> <td style=\"text-align:left\">Called to initiate plugin registration.</td> </tr> <tr> <td style=\"text-align:left\">routes-init</td> <td style=\"text-align:left\">Called to initiaze React router</td> </tr> <tr> <td style=\"text-align:left\">register-route</td> <td style=\"text-align:left\">Called for each route that is registered</td> </tr> <tr> <td style=\"text-align:left\">data-loaded</td> <td style=\"text-align:left\">Called on route load to pre-load data</td> </tr> <tr> <td style=\"text-align:left\">plugin-ready</td> <td style=\"text-align:left\">Called after all plugins registration callbacks have completed</td> </tr> <tr> <td style=\"text-align:left\">component-bindings</td> <td style=\"text-align:left\">Called to sibling React components and their DOM element bindings</td> </tr> <tr> <td style=\"text-align:left\">app-bindpoint</td> <td style=\"text-align:left\">Called to define the main application bind point.</td> </tr> <tr> <td style=\"text-align:left\">app-redux-provider</td> <td style=\"text-align:left\">Called to define the Redux provider component</td> </tr> <tr> <td style=\"text-align:left\">app-router</td> <td style=\"text-align:left\">Called to provide the React router component</td> </tr> <tr> <td style=\"text-align:left\">app-ssr-mode</td> <td style=\"text-align:left\">Called to make the application aware of server-side rendering mode</td> </tr> <tr> <td style=\"text-align:left\">app-boot-message</td> <td style=\"text-align:left\">Called to define the javascript console boot message</td> </tr> <tr> <td style=\"text-align:left\">app-ready</td> <td style=\"text-align:left\">Called when the application is being bound or hydrated by ReactDOM</td> </tr> </tbody> </table>",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/reactium-hooks.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "Server.AppBindings",
    "title": "Server.AppBindings",
    "name": "Server.AppBindings",
    "description": "<p>Before index.html template render for SPA template (both Front-end and Server-Side Render). Defines React bind pointes in markup.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>express request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "AppBindings",
            "description": "<p>Server app binding registry object.</p>"
          }
        ],
        "binding": [
          {
            "group": "binding",
            "type": "String",
            "optional": true,
            "field": "component",
            "description": "<p>string name of component to bind directly if possible (must be in a webpack search context in reactium-config)</p>"
          },
          {
            "group": "binding",
            "type": "String",
            "optional": true,
            "field": "markup",
            "description": "<p>ordinary markup that React will use to bind the app.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "reactium-boot.js",
        "content": "ReactiumBoot.Hook.registerSync(\n    'Server.AppBindings',\n    (req, AppBindings) => {\n        // Find the registered component \"DevTools\" and bind it\n        AppBindings.register('DevTools', {\n            component: 'DevTools',\n        });\n\n        // Add ordinary markup for React to bind to\n        AppBindings.register('router', {\n            markup: '<div id=\"router\"></div>',\n        });\n    },\n    ReactiumBoot.Enums.priority.highest,\n    'SERVER-APP-BINDINGS-CORE',\n);",
        "type": "json"
      }
    ],
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/server/renderer/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "Server.AppGlobals",
    "title": "Server.AppGlobals",
    "name": "Server.AppGlobals",
    "description": "<p>Before index.html template render for SPA template (both Front-end and Server-Side Render). Defines window globals to be defined in template. Will also define global for nodejs (useful for Server-Side-Rendering).</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>express request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "AppGlobals",
            "description": "<p>Server app globals registry object.</p>"
          }
        ],
        "global": [
          {
            "group": "global",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The property name that will be added to window (for browser) or global (for nodejs).</p>"
          },
          {
            "group": "global",
            "type": "Mixed",
            "optional": false,
            "field": "value",
            "description": "<p>any javascript value that can be serialized for use in a script tag</p>"
          },
          {
            "group": "global",
            "type": "Mixed",
            "optional": true,
            "field": "serverValue",
            "description": "<p>optional different value for the server global, useful when value should be used differently on the server code</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "reactium-boot.js",
        "content": "// will result in window.environment = 'local' in browser and global.environment = 'local' on nodejs\nReactiumBoot.Hook.registerSync(\n    'Server.AppGlobals',\n    (req, AppGlobals) => {\n        // Find the registered component \"DevTools\" and bind it\n        AppGlobals.register('environment', {\n            name: 'environment',\n            value: 'local',\n        });\n    });",
        "type": "json"
      }
    ],
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/server/renderer/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "Server.AppHeaders",
    "title": "Server.AppHeaders",
    "name": "Server.AppHeaders",
    "description": "<p>Before index.html template render for SPA template (both Front-end and Server-Side Render). Defines html head tags (exluding stylesheet). Use this hook to register/unregister <head> tags as strings. Note: if using Server Side Render and react-helmet, this is often unnecessary to do.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>express request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "AppHeaders",
            "description": "<p>Server app header registry object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "reactium-boot.js",
        "content": "ReactiumBoot.Hook.register('Server.AppHeaders', async (req, AppHeaders) => {\n   // given some data was added to req by express middleware\n   const seo = req.seo;\n   if (seo) {\n       if (seo.canonicalURL) {\n           AppHeaders.register('canonical-url', {\n               header: `<link rel=\"canonical\" href=\"${seo.canonicalURL}\" />`\n           });\n       }\n       if (seo.description) {\n           AppHeaders.register('meta-description', {\n               header: `<meta name=\"description\" content=\"${seo.description}\"/>`\n           });\n       }\n   }\n});",
        "type": "json"
      }
    ],
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/server/renderer/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "Server.AppScripts",
    "title": "Server.AppScripts",
    "name": "Server.AppScripts",
    "description": "<p>Before index.html template render for SPA template (both Front-end and Server-Side Render). Defines javascript files to be loaded.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>express request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "AppScripts",
            "description": "<p>Server app scripts registry object.</p>"
          }
        ],
        "script": [
          {
            "group": "script",
            "type": "Boolean",
            "optional": true,
            "field": "footer",
            "defaultValue": "true",
            "description": "<p>Place the script tag in the footer if true</p>"
          },
          {
            "group": "script",
            "type": "Boolean",
            "optional": true,
            "field": "header",
            "defaultValue": "false",
            "description": "<p>Place the script tag above the body if true</p>"
          },
          {
            "group": "script",
            "type": "String",
            "optional": true,
            "field": "path",
            "description": "<p>the src of the javascript</p>"
          },
          {
            "group": "script",
            "type": "String",
            "optional": true,
            "field": "charset",
            "defaultValue": "UTF-8",
            "description": "<p>charset attribute</p>"
          },
          {
            "group": "script",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>type attribute</p>"
          },
          {
            "group": "script",
            "type": "Boolean",
            "optional": true,
            "field": "defer",
            "defaultValue": "false",
            "description": "<p>Add defer attribute</p>"
          },
          {
            "group": "script",
            "type": "Boolean",
            "optional": true,
            "field": "async",
            "defaultValue": "false",
            "description": "<p>Add async attribute</p>"
          },
          {
            "group": "script",
            "type": "Boolean",
            "optional": true,
            "field": "content",
            "description": "<p>script content</p>"
          },
          {
            "group": "script",
            "type": "Number",
            "optional": true,
            "field": "order",
            "defaultValue": "0",
            "description": "<p>loading order of script</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "reactium-boot.js",
        "content": "ReactiumBoot.Hook.register('Server.AppScripts', async (req, AppScripts) => {\n    AppScripts.register('my-onsite-script', {\n        path: '/assets/js/some-additional.js'\n        footer: true, // load in footer (optional)\n        header: false, // don't load in header (optional)\n        order: 1, // scripts will be ordered by this\n    });\n\n    AppScripts.register('my-csn-script', {\n        path: 'https://cdn.example.com/cdn.loaded.js'\n        header: true, // maybe for an external\n        order: 1, // scripts will be ordered by this\n    });\n});",
        "type": "json"
      }
    ],
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/server/renderer/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "Server.AppSnippets",
    "title": "Server.AppSnippets",
    "name": "Server.AppSnippets",
    "description": "<p>Before index.html template render for SPA template (both Front-end and Server-Side Render). Defines snippets of code to be added to document in their entirety.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>express request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "AppSnippets",
            "description": "<p>Server app snippets registry object.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "reactium-boot.js",
        "content": "     ReactiumBoot.Hook.register('Server.AppSnippets', async (req, AppSnippets) => {\n        AppSnippets.register('ga-tracking', {\n            snippet: `<script>\n(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\nm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\n\nga('create', '', 'auto');\nga('send', 'pageview');\n</script>`,\n          order: 1,\n        })\n     });",
        "type": "json"
      }
    ],
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/server/renderer/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "Server.AppStyleSheets",
    "title": "Server.AppStyleSheets",
    "name": "Server.AppStyleSheets",
    "description": "<p>Before index.html template render for SPA template (both Front-end and Server-Side Render). Defines css files to be loaded.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>express request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "AppStyleSheets",
            "description": "<p>Server app styles registry object.</p>"
          }
        ],
        "stylesheet": [
          {
            "group": "stylesheet",
            "type": "String",
            "optional": true,
            "field": "path",
            "description": "<p>the src of the javascript</p>"
          },
          {
            "group": "stylesheet",
            "type": "Number",
            "optional": true,
            "field": "order",
            "defaultValue": "0",
            "description": "<p>loading order of script</p>"
          },
          {
            "group": "stylesheet",
            "type": "String",
            "optional": true,
            "field": "rel",
            "defaultValue": "stylesheet",
            "description": "<p>the rel attribute</p>"
          },
          {
            "group": "stylesheet",
            "type": "String",
            "optional": true,
            "field": "crossorigin",
            "description": "<p>the crossorigin attribute</p>"
          },
          {
            "group": "stylesheet",
            "type": "String",
            "optional": true,
            "field": "referrerpolicy",
            "description": "<p>the referrerpolicy attribute</p>"
          },
          {
            "group": "stylesheet",
            "type": "String",
            "optional": true,
            "field": "hrefLang",
            "description": "<p>the hreflang attribute</p>"
          },
          {
            "group": "stylesheet",
            "type": "String",
            "optional": true,
            "field": "sizes",
            "description": "<p>the sizes attribute if rel=icon</p>"
          },
          {
            "group": "stylesheet",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>the type attribute</p>"
          },
          {
            "group": "stylesheet",
            "type": "Function",
            "optional": true,
            "field": "when",
            "description": "<p>callback passed the request object, and returns true or false if the css should be included</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "reactium-boot.js",
        "content": "ReactiumBoot.Hook.register('Server.AppStyleSheets', async (req, AppStyleSheets) => {\n    AppStyleSheets.register('my-stylesheet', {\n        path: '/assets/css/some-additional.css'\n    });\n\n    AppStyleSheets.register('my-csn-script', {\n        path: 'https://cdn.example.com/cdn.loaded.css'\n        order: 1, // scripts will be ordered by this\n    });\n});",
        "type": "json"
      }
    ],
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/server/renderer/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "Server.Middleware",
    "title": "Server.Middleware",
    "name": "Server.Middleware",
    "description": "<p>Used to register or unregister express middleware.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "Middleware",
            "description": "<p>Server express middleware registry object.</p>"
          }
        ],
        "middleware": [
          {
            "group": "middleware",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the middleware.</p>"
          }
        ],
        "middlware": [
          {
            "group": "middlware",
            "type": "Function",
            "optional": false,
            "field": "use",
            "description": "<p>the express middleware function.</p>"
          },
          {
            "group": "middlware",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": "<p>the loading order of the middleware</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "reactium-boot.js",
        "content": "const express = require('express');\nconst router = express.Router();\nconst axios = require('axios');\n\n// register a new backend route /foo with express\nrouter.get('/', (req, res) => {\n   res.send('Foo!!')\n});\n\nReactiumBoot.Hook.registerSync('Server.Middleware', Middleware => {\n   Middleware.register('foo-page', {\n       name: 'foo-page',\n       use: router,\n       order: ReactiumBoot.Enums.priority.highest,\n   })\n});\n\nReactiumBoot.Hook.registerSync('Server.Middleware', Middleware => {\n   const intercept = express.Router();\n   intercept.post('/api*', (req, res) => {\n       res.json({\n           foo: 'bar'\n       });\n   });\n\n   // check api health every 90 seconds and intercept api if it goes down\n   Middleware.register('downapi', {\n       name: 'downapi',\n       use: async (res, req, next) => {\n           try {\n               let healthy = ReactiumBoot.Cache.get('health-check');\n               if (healthy === undefined) {\n                   const response = await axios.get(process.env.REST_API_URI + '/healthcheck');\n                   healthy = response.data;\n                   ReactiumBoot.Cache.set('health-check', healthy, 1000 * 90);\n               }\n           } catch (error) {\n               console.error(error);\n               ReactiumBoot.Cache.set('health-check', false, 1000 * 90);\n               healthy = false;\n           }\n\n           if (healthy === true) next();\n           return intercept(req, req, next);\n       },\n       order: ReactiumBoot.Enums.priority.highest,\n   })\n});",
        "type": "json"
      }
    ],
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "Server.ResponseHeaders",
    "title": "Server.ResponseHeaders",
    "name": "Server.ResponseHeaders",
    "description": "<p>On html template responses on server, this hook is called when HTTP headers are added to the response. Both sync and async hook is called.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "responseHeaders",
            "description": "<p>object with key pairs (header name =&gt; header value)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>Node/Express request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "res",
            "description": "<p>Node/Express response object</p>"
          }
        ]
      }
    },
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/server/router.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "Server.ServiceWorkerAllowed",
    "title": "Server.ServiceWorkerAllowed",
    "description": "<p>Called on server-side during service-worker-allowed middleware. Used to define the HTTP response header &quot;Service-Worker-Allowed&quot;. By default, this header will allow the document root, &quot;/&quot;. Both sync and async version called.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "responseHeader",
            "description": "<p>with property 'Service-Worker-Allowed' (case sensitive) and its value.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>Node/Express request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "res",
            "description": "<p>Node/Express response object</p>"
          }
        ]
      }
    },
    "name": "Server.ServiceWorkerAllowed",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "Server.afterApp",
    "title": "Server.afterApp",
    "name": "Server.afterApp",
    "description": "<p>Before index.html template render for SPA template (both Front-end and Server-Side Render). Called after other Server hooks.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>express request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "Server",
            "description": "<p>ReactiumBoot Server object.</p>"
          }
        ]
      }
    },
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/server/renderer/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "Server.beforeApp",
    "title": "Server.beforeApp",
    "name": "Server.beforeApp",
    "description": "<p>Before index.html template render for SPA template (both Front-end and Server-Side Render). Called before other Server hooks.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>express request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "Server",
            "description": "<p>ReactiumBoot Server object.</p>"
          }
        ]
      }
    },
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/server/renderer/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "app-bindpoint",
    "title": "app-bindpoint",
    "name": "app-bindpoint",
    "description": "<p>Called after plugin and routing initialization to define the DOM element used for mounting the Single-Page application (SPA). By default, the application will bind to <code>document.getElementById('router')</code>, but this can be changed with this hook. This is related to the HTML template artifacts left by the server-side <code>Server.AppBindings</code> hook. async only - used in front-end application only</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "context",
            "description": "<p>context.appElement MUST be an HTMLElement where your React appliation will bind to the DOM.</p>"
          }
        ],
        "appElement": [
          {
            "group": "appElement",
            "type": "HTMLElement",
            "optional": false,
            "field": "the",
            "description": "<p>DOM element to bind to - by default <code>document.getElementById('router')</code>.</p>"
          }
        ]
      }
    },
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "app-boot-message",
    "title": "app-boot-message",
    "name": "app-boot-message",
    "description": "<p>Called during application binding, this minor hook will allow you to change the format of the of the front-end Javascript console message indicating application start. async only - used in front-end application only</p>",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "app-ready",
    "title": "app-ready",
    "description": "<p>The final hook run after the front-end application has bee bound or hydrated. After this point, the all hooks are runtime hooks.</p>",
    "name": "app-ready",
    "group": "Hooks",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "ssr",
            "description": "<p>If the app is in server-side rendering mode (SSR) <code>true</code> is passed to the hook.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "app-redux-provider",
    "title": "app-redux-provider",
    "name": "app-redux-provider",
    "description": "<p>Called after app-bindpoint to define the registered Redux Provider component (i.e. <code>Reactium.Component.register('ReduxProvider'...)</code>) for all bind points and the SPA. async only - used in front-end application only</p>",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "app-router",
    "title": "app-router",
    "name": "app-router",
    "description": "<p>Called after app-redux-provider to define the registered Router component (i.e. <code>Reactium.Component.register('Router'...)</code>). After this hook, the ReactDOM bindings will actually take place. async only - used in front-end application only</p>",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "component-bindings",
    "title": "component-bindings",
    "name": "component-bindings",
    "description": "<p>Called after plugin and routing initialization to define element and dynamic component for one-off component bindings to the DOM. e.g. In development mode, used to render Redux Dev tools. async only - used in front-end application only</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "context",
            "description": "<p>context.bindPoints MUST be an array of binding objects after this hook is called</p>"
          }
        ],
        "binding": [
          {
            "group": "binding",
            "type": "HTMLElement",
            "optional": false,
            "field": "the",
            "description": "<p>DOM element to bind to (e.g. document.getElementById('my-element'))</p>"
          },
          {
            "group": "binding",
            "type": "String",
            "optional": false,
            "field": "string",
            "description": "<p>matching a React component module in one of the Reactium built-in webpack contexts (src/app/components or src/app/components/common-ui) e.g. 'DevTools' maps to src/app/components/DevTools</p>"
          }
        ]
      }
    },
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "dependencies-load",
    "title": "dependencies-load",
    "name": "dependencies-load",
    "description": "<p>Called after init to give an application a change to load async dependencies. Many Domain Driven Design (DDD) artifacts from generated src/manifest.js are loaded on this hook async only - used in front-end or isomorphically when running server-side rendering mode (SSR)</p>",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "dependencies-load",
    "title": "dependencies-load",
    "name": "dependencies-load",
    "description": "<p>Called after init to give an application a change to load async dependencies. Many Domain Driven Design (DDD) artifacts from generated src/manifest.js are loaded on this hook async only - used in front-end or isomorphically when running server-side rendering mode (SSR)</p>",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/reactium-hooks.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "init",
    "title": "init",
    "name": "init",
    "description": "<p>Called before all other hooks on Reactium application startup. async only - used in front-end or isomorphically when running server-side rendering mode (SSR)</p>",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "plugin-dependencies",
    "title": "plugin-dependencies",
    "name": "plugin-dependencies",
    "description": "<p>Called to indicate all bootstrap dependencies should now be loaded, but before application routes have been initialized. There are 2 default registered callback in Reactium core on this hook. 1. (Highest Priority): The generated src/manifest.js dependencies are attached to this hook context (as context.deps). 2. (High Priority): <code>plugin-init</code> hook will be invoked, at which point all Reactium.Plugin registrations will be called.</p> <pre><code> Any hooks that registered after Reactium.Plugin will only be useful if they happen to be invoked during the normal runtime operations of the application.  An important exception to this is `routes-init`, which is deferred until after plugins initialize so they may dynamically add routes before Reactium hands off  control to the Router.  async only - used in front-end or isomorphically when running server-side rendering mode (SSR)</code></pre>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "context",
            "description": "<p>Core attaches generated manifest loaded dependencies to context.deps</p>"
          }
        ]
      }
    },
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "plugin-ready",
    "title": "plugin-ready",
    "name": "plugin-ready",
    "description": "<p>Called after all plugin registration callbacks have completed and routes have loaded.</p>",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "register-route",
    "title": "register-route",
    "name": "register-route",
    "description": "<p>Called on boot after routes-init, and during runtime operation of the front-end application, whenever a new route is registered. Can be used to augment a router object before it is registered to the router. async only - used in front-end or isomorphically when running server-side rendering mode (SSR)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "route",
            "description": "<p>the new or updated route, indentified by unique id (route.id)</p>"
          }
        ]
      }
    },
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/sdk/routing/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "routes-init",
    "title": "routes-init",
    "name": "routes-init",
    "description": "<p>Called after plugin-init, to add React Router routes to Reactium.Routing register before the Router component is initialized and finally the application is bound to the DOM. async only - used in front-end or isomorphically when running server-side rendering mode (SSR)</p>",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/sdk/routing/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "sdk-init",
    "title": "sdk-init",
    "name": "sdk-init",
    "description": "<p>Called after reactium-hooks.js DDD artifacts are loaded, to allow the Reactium SDK singleton to be extended before the init hook.</p>",
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "store-create",
    "title": "store-create",
    "name": "store-create",
    "description": "<p>Called after dependencies-load to trigger Redux store creator. async only - used in front-end or isomorphically when running server-side rendering mode (SSR)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": "<p>params.server indicate if is store creation on the server, or in the front-end application</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "context",
            "description": "<p>Core implementation of this hook will create the Redux store and set it to context.store.</p>"
          }
        ]
      }
    },
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "Hook",
    "url": "zone-defaults",
    "title": "zone-defaults",
    "name": "zone-defaults",
    "description": "<p>Called after dependencies-load by Reactium.Zone.init() for loading default component rendering Zone controls and components. async only - used in front-end or isomorphically when running server-side rendering mode (SSR)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "context",
            "description": "<p>used to create initial controls and components. controls.filter for default filtering, controls.sort for default sorting, controls.mapper for default mapping and controls.components for initial registered components. zone.js Domain Driven Design (DDD) artifacts from generated src/manifest.js are registered with Reactium.Zone at this time. See Reactium.Zone SDK for runtime operations.</p>"
          }
        ]
      }
    },
    "group": "Hooks",
    "version": "0.0.0",
    "filename": ".core/app/index.js",
    "groupTitle": "Hooks"
  },
  {
    "type": "ReactHook",
    "url": "useAsyncEffect(cb,dependencies)",
    "title": "useAsyncEffect()",
    "description": "<p>Just like React's built-in <code>useEffect</code>, but can use async/await. If the return is a promise for a function, the function will be used as the unmount callback.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>Just like callback provided as first argument of <code>useEffect</code>, but takes as its own first argument a method to see if the component is mounted. This is useful for deciding if your async response (i.e. one that would attempt to change state) should happen.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "deps",
            "description": "<p>Deps list passed to <code>useEffect</code></p>"
          }
        ]
      }
    },
    "name": "useAsyncEffect",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Reactium Usage",
        "content": "import React, { useState } from 'react';\nimport { useAsyncEffect } from 'reactium-core/sdk';\n\nconst MyComponent = props => {\n    const [show, setShow] = useState(false);\n\n    // change state allowing value to show\n    // asynchrounously, but only if component is still mounted\n    useAsyncEffect(async isMounted => {\n        setShow(false);\n        await new Promise(resolve => setTimeout(resolve, 3000));\n        if (isMounted()) setShow(true);\n\n        // unmount callback\n        return () => {};\n    }, [ props.value ]);\n\n    return (\n        {show && <div>{props.value}</div>}\n    );\n};",
        "type": "json"
      },
      {
        "title": "StandAlone Import",
        "content": "import { useAsyncEffect } from '@atomic-reactor/reactium-sdk-core';",
        "type": "json"
      },
      {
        "title": "Wrong Usage",
        "content": "import React, { useState } from 'react';\nimport { useAsyncEffect } from 'reactium-core/sdk';\n\nconst MyComponent = props => {\n    const [show, setShow] = useState(false);\n\n    // change state allowing value to show\n    // asynchrounously, but only if component is still mounted\n    useAsyncEffect(async isMounted => {\n        // Warning: don't do this, wait until promise resolves to check isMounted()!!\n        if (isMounted()) { // this may be true *before* promise resolves and false *after*\n            setShow(false);\n            await new Promise(resolve => setTimeout(resolve, 3000));\n            setShow(true);\n        }\n\n        // unmount callback\n        return () => {};\n    }, [ props.value ]);\n\n    return (\n        {show && <div>{props.value}</div>}\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/async-effect.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useBreakpoint(width)",
    "title": "useBreakpoint()",
    "description": "<p>Returns string representing the breakpoint size for a given width.</p> <p>When using the out of the box scss styles in Reactium, a grid system is in place, and is defined by an overridable sass map <code>$breakpoints-max</code>, defined by default as:</p> <pre class=\"prettyprint\">$breakpoints-max: ('xs': 640, 'sm': 990, 'md': 1280, 'lg': 1440,'xl': 1600) !default; </code></pre>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "width",
            "description": "<p>the width to check the breakpoint for. Example for the default <code>$breakpoints-max</code> providing a width of 640 or less will return <code>xs</code>, 990 or less will return <code>sm</code> and so on.</p>"
          }
        ]
      }
    },
    "name": "useBreakpoint",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": ".core/sdk/named-exports/window.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useBreakpoints()",
    "title": "useBreakpoints()",
    "description": "<p>Provides an object describing the maximum width for each breakpoint used in the Reactium grid styles. When using the out of the box scss styles in Reactium, a grid system is in place, and is defined by an overridable sass map <code>$breakpoints-max</code>, defined by default as:</p> <pre class=\"prettyprint\">$breakpoints-max: ('xs': 640, 'sm': 990, 'md': 1280, 'lg': 1440,'xl': 1600) !default; </code></pre> <p>These breakpoint maximums are automatically encoded and added to the stylesheet as <code>:after</code> psuedo-element <code>content</code> property, which can be loaded in the browser and used for in browser responsive behavior. Potentially, this can mean only having to manage your responsive breakpoints in one place (the stylesheet).</p>",
    "name": "useBreakpoints",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": ".core/sdk/named-exports/window.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useCapability(capability)",
    "title": "useCapability()",
    "description": "<p>React hook to get capability object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capability",
            "description": "<p>the name/tag of the capability</p>"
          }
        ]
      }
    },
    "name": "useCapability",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": ".core/sdk/named-exports/capability.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useCapabilityCheck(capabilities,strict)",
    "title": "useCapabilityCheck()",
    "description": "<p>React hook to check a list of capabilities. Uses Reactium.Capability.check().</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capabilities",
            "description": "<p>array of 1 or more capabilities</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "strict",
            "defaultValue": "true",
            "description": "<p>when true all capabilities must be allowed for current user</p>"
          }
        ]
      }
    },
    "name": "useCapabilityCheck",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": ".core/sdk/named-exports/capability.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useDerivedState(props,subscriptions,updateAll)",
    "title": "useDerivedState()",
    "description": "<p>Sometimes you would like to derive state from your component props, and also allow either a prop change, or an internal state change either to take effect. This hook will allow you to create a state object from your component props, and subscribe (by array of object-paths) only to those prop changes you would like to see reflected in a rendering updates to your component state. This hook returns an array similar in nature to the return of React's built-in <code>useState()</code> hook (<code>[state,setState]</code>), with some differences.</p> <ol> <li>The initial value coming from props (on first render) will contain all that was present in the props object passed to it. Note that any values that are not present in your component props on first render, or that which are explicitly subscribed to, will not exist in the returned state element.</li> <li>The setState callback can receive whole or partial state objects, and will be merged with the existing state.</li> <li>There is a third element function <code>forceRefresh</code></li> </ol>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "props",
            "description": "<p>the component props</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "subscriptions",
            "description": "<p>Array of string object-paths in your component props you would like to update your component state for. By default, this is empty, and if left empty you will get only the initial props, and no updates. Each selected property is shallow compared with the previous version of that prop (not the current state). Only a change of prop will trigger a prop-based update and rerender.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "updateAll",
            "defaultValue": "false",
            "description": "<p>When true, an update to any subscribed object-path on your props will cause <em>all</em> the props to imprint on your component state.</p>"
          }
        ]
      }
    },
    "version": "0.0.14",
    "name": "useDerivedState",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Returns",
        "content": "// The hook returns an array containing [state, setState, forceRefresh]\nconst [state, setState, forceRefresh] = useDerivedState(props, ['path.to.value1', 'path.to.value2']);",
        "type": "json"
      },
      {
        "title": "Usage",
        "content": "import React from 'react';\nimport { useDerivedState } from 'reactium-core/sdk';\nimport op from 'object-path';\n\nconst MyComponent = props => {\n    const [state, setState] = useDerivedState(props, ['path.to.value1', 'path.to.value2']);\n    const value1 = op.get(state, 'path.to.value1', 'Default value 1');\n    const value2 = op.get(state, 'path.to.value2', 'Default value 2');\n\n    // setState merges this object with previous state\n    const updateValue1 = () => setState({\n        path: {\n            to: {\n                value1: 'foo',\n            }\n        }\n    });\n\n    return (<div>\n        <div>Value 1: {value1}</div>\n        <div>Value 2: {value2}</div>\n        <button onClick={updateValue1}>Update Value 1</button>\n    </div>);\n}\n\nexport default MyComponent;",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/derived-state.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useDocument()",
    "title": "useDocument()",
    "description": "<p>Serves same use-case as <code>useWindow()</code>, but provides context aware <code>document</code> object or <code>undefined</code>, that can be used normally as well as in the <code>react-frame-component</code> within the toolkit.</p>",
    "name": "useDocument",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": ".core/sdk/named-exports/window.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useEventEffect(eventTarget,eventCallbacks,deps)",
    "title": "useEventEffect()",
    "version": "1.0.7",
    "description": "<p>React hook to short hand for addEventListener and removeEventLister for one or more callbacks.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "eventTarget",
            "description": "<p>Some event target object (implementing addEventListener and removeEventLister)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "eventCallbacks",
            "description": "<p>Object keys are event names, and Object values are callbacks to be subscribed/unsubscribed.</p>"
          },
          {
            "group": "Parameter",
            "type": "useEffectDeps",
            "optional": false,
            "field": "deps",
            "description": "<p>consistent with React useEffect deps list.</p>"
          }
        ]
      }
    },
    "name": "useEventEffect",
    "group": "ReactHook",
    "examples": [
      {
        "title": "EventEffectComponent.js",
        "content": "import React, { useState } from 'react';\nimport { useEventEffect } from 'reactium-core/sdk';\n\nconst EventEffectComponent = () => {\n    const [size, setSize] = useState({\n        width: window.innerWidth,\n        height: window.innerHeight,\n    });\n\n    const [online, setOnline] = useState(window.onLine);\n\n    const onResize = e => {\n        setSize({\n            width: window.innerWidth,\n            height: window.innerHeight,\n        });\n    };\n\n    const onNetworkChange = e => {\n        setOnline(window.onLine);\n    };\n\n    useEventEffect(\n        window,\n        {\n            resize: onResize,\n            online: onNetworkChange,\n            offline: onNetworkChange,\n        },\n        [],\n    );\n\n    return (\n        <div className='status'>\n            <span className='status-width'>width: {size.width}</span>\n            <span className='status-height'>height: {size.height}</span>\n            <span className={`status-${online ? 'online' : 'offline'}`}></span>\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/event-handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useEventHandle(handle)",
    "title": "useEventHandle()",
    "description": "<p>React hook to create an imperative handle that is also an implementation of EventTarget. Can be used in conjunction with useImperativeHandle (React built-in) or useRegisterHandle/useHandle (Reactium SDK hooks).</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "handle",
            "description": "<p>Interface for interacting with your component.</p>"
          }
        ]
      }
    },
    "name": "useEventHandle",
    "group": "ReactHook",
    "examples": [
      {
        "title": "EventHandleComponent.js",
        "content": "import React, { useEffect } from 'react';\nimport { useRegisterHandle, useEventHandle } from 'reactium-core/sdk';\n\nconst EventHandleComponent = () => {\n     const [ value, setValue ] = useState(1);\n     const createHandle = () => ({\n         value, setValue,\n     });\n\n     const [ handle, setHandle ] = useEventHandle(createHandle());\n\n     useEffect(() => {\n         setHandle(createHandle());\n     }, [value]);\n\n     useRegisterHandle('EventHandleComponent', () => handle);\n\n     const onClick = () => {\n         if (handle) {\n            setValue(value + 1);\n            handle.dispatchEvent(new CustomEvent('do-something'));\n         }\n     }\n\n     return (<button onClick={onClick}>Click Me ({value})</button>);\n };\n\n export default EventHandleComponent;",
        "type": "json"
      },
      {
        "title": "EventHandleConsumer.js",
        "content": "import React, { useEffect, useState } from 'react';\nimport { useHandle } from 'reactium-core/sdk';\n\nconst EventHandleConsumer = props => {\n    const [state, setState] = useState();\n    const handleEventTarget = useHandle('EventHandleComponent');\n\n    // when 'do-something' event occurs on\n    // EventHandleComponent, this component can react\n    const onDoSomething = e => {\n        setState(e.target.value);\n    };\n\n    useEffect(() => {\n        if (handleEventTarget) {\n            handleEventTarget.addEventListener('do-something', onDoSomething);\n        }\n        return () => handleEventTarget.removeEventListener('do-something', onDoSomething);\n    }, [handleEventTarget]);\n\n    return (\n        <div>\n            value: {state}\n        </div>\n    );\n};\n\nexport default EventHandleConsumer;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/event-handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useEventRefs()",
    "title": "useEventRefs()",
    "version": "1.0.7",
    "group": "ReactHook",
    "name": "useEventRefs",
    "description": "<p>Like useRefs, creates a single reference object that can be managed using the <code>get</code>/<code>set</code>/<code>del</code>/<code>clear</code> functions, however also an EventTarget object. <code>set</code>/<code>del</code>/<code>clear</code> methods dispatch <code>before-set</code>/<code>set</code>, <code>before-del</code>/<code>del</code>, and <code>before-clear</code>/<code>clear</code> events respectively.</p>",
    "examples": [
      {
        "title": "Usage",
        "content": "import React, { useState } from 'react';\nimport { useRefs } from '@atomic-reactor/reactium-sdk-core';\n\nconst MyComponent = () => {\n    const refs = useEventRefs();\n    const [ready, setReady] = useState(false);\n\n    const onChildRefReady = e => {\n        if (e.key === 'my.component') {\n            setReady(refs.get(e.key) !== undefined);\n        }\n    };\n\n    useEffect(() => {\n        refs.addEventListener('set', onChildRefReady);\n        return () => refs.removeEventListener('set', onChildRefReady);\n    }, []);\n\n    return (\n        <MyForwardRefComponent ref={cmp => refs.set('my.component', cmp)} />\n        {ready && <Controller control={refs.get('my.component')} />}\n    );\n};",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/useRefs.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useFocusEffect(container,dependencies)",
    "title": "useFocusEffect()",
    "group": "ReactHook",
    "name": "useFocusEffect",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Element",
            "optional": false,
            "field": "container",
            "description": "<p>The DOM element to search for the 'data-focus' element.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "dependencies",
            "description": "<p>Dependencies list passed to <code>useEffect</code>.</p>"
          }
        ],
        "Returns": [
          {
            "group": "Returns",
            "type": "Boolean",
            "optional": false,
            "field": "focused",
            "description": "<p>If the 'data-focus' element was found.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Reactium Usage",
        "content": "import cn from 'classnames';\nimport React, { useRef } from 'react';\nimport { useFocusEffect } from 'reactium-core/sdk';\n\nconst MyComponent = props => {\n    const containerRef = useRef();\n\n    const [focused] = useFocusEffect(containerRef.current);\n\n    return (\n        <form ref={containerRef}>\n            <input className={cn({ focused })} type='text' data-focus />\n            <button type='submit'>Submit</button>\n        </form>\n    );\n};",
        "type": "json"
      },
      {
        "title": "Returns",
        "content": "{Array} [focused:Element, setFocused:Function]",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/focus-effect.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useFulfilledObject(object,keys)",
    "title": "useFulfilledObject()",
    "name": "useFulfilledObject",
    "group": "ReactHook",
    "description": "<p>Asyncronous React hook that determines if the supplied object has values for the supplied keys. Useful when you have many <code>useEffect</code> calls and need to know if multiple pieces of the state are set and ready for rendering.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>The object to check.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "keys",
            "description": "<p>List of object paths to validate.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "\nimport React, { useEffect, useState } from 'react';\nimport { useFulfilledObject } from 'reactium-core/sdk';\n\nconst MyComponent = () => {\n\n    const [state, setNewState] = useState({});\n    const [updatedState, ready, attempts] = useFulfilledObject(state, ['msg', 'timestamp']);\n\n    const setState = newState => {\n        newState = { ...state, ...newState };\n        setNewState(newState);\n    };\n\n    useEffect(() => {\n        if (!state.msg) {\n            setState({ msg: 'ok'});\n        }\n    }, [state]);\n\n    useEffect(() => {\n        if (!state.timestamp) {\n            setState({ timestamp: Date.now() });\n        }\n    }, [state]);\n\n    const render = () => {\n        return ready !== true ? null : <div>I'm READY!!</div>;\n    };\n\n    return render();\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/fulfilled-object.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useHandle(id,defaultValue)",
    "title": "useHandle()",
    "description": "<p>React hook to subscribe to a specific imperative handle reference. Useful for having one functional component control another.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "defaultValue",
            "description": "<p>the value to use for the handle if it does not exist.</p>"
          }
        ]
      }
    },
    "name": "useHandle",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Counter.js",
        "content": "import React, { useState } from 'react';\nimport { useRegisterHandle } from 'reactium-core/sdk';\n\nconst Counter = ({id = 1}) => {\n    const [count, setCount] = useState(Number(id));\n\n    // id 'counter.1' by default\n    useRegisterHandle(['counter', id], () => ({\n        increment: () => setCount(count + 1),\n    }), [count]);\n\n    return (\n        <div>\n            <h1>Counter {id}</h1>\n            Count: {count}\n        </div>\n    );\n};\n\nexport default Counter;",
        "type": "json"
      },
      {
        "title": "CounterControl.js",
        "content": "import React from 'react';\nimport { useHandle } from 'reactium-core/sdk';\n\nconst noop = () => {};\nconst CounterControl = () => {\n    // Get increment control on handle identified at path 'counter.1'\n    const { increment } = useHandle('counter.1', { increment: noop }});\n\n    return (\n        <div>\n            <h1>CounterControl</h1>\n            <button onClick={increment}>Increment Counter</button>\n        </div>\n    );\n};\n\nexport default CounterControl;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useHookComponent(hookName,defaultComponent,...params)",
    "title": "useHookComponent()",
    "description": "<p>A React hook used to define React component(s) that can be overrided by Reactium plugins, using the <code>Reactium.Component.register()</code> function.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hookName",
            "description": "<p>the unique string used to register component(s).</p>"
          },
          {
            "group": "Parameter",
            "type": "Component",
            "optional": false,
            "field": "defaultComponent",
            "description": "<p>the default React component(s) to be returned by the hook.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "params",
            "description": "<p>variadic list of parameters to be passed to the Reactium hook specified by hookName.</p>"
          }
        ]
      }
    },
    "name": "useHookComponent",
    "group": "ReactHook",
    "examples": [
      {
        "title": "parent.js",
        "content": "import React from 'react';\nimport { useHookComponent } from 'reactium-core/sdk';\n\n// component to be used unless overriden by Reactium.Component.register()\nconst DefaultComponent = () => <div>Default or Placeholder component</div>\n\nexport props => {\n    const MyComponent = useHookComponent('my-component', DefaultComponent);\n    return (\n        <div>\n            <MyComponent {...props} />\n        </div>\n    );\n};",
        "type": "json"
      },
      {
        "title": "reactium-hooks.js",
        "content": "import React from 'react';\nimport Reactium from 'reactium-core/sdk';\n\n// component to be used unless overriden by Reactium.Component.register()\nconst ReplacementComponent = () => <div>My Plugin's Component</div>\n\nReactium.Component.register('my-component', ReplacementComponent);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/component.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useIsContainer(element,container)",
    "title": "useIsContainer()",
    "name": "useIsContainer",
    "group": "ReactHook",
    "description": "<p>React hook that determines if the element is a child of the container. Useful for traversing the DOM to find out if an event or action happened within the specified container.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Node",
            "optional": false,
            "field": "element",
            "description": "<p>The inner most element. Consider this the starting point.</p>"
          },
          {
            "group": "Parameter",
            "type": "Node",
            "optional": false,
            "field": "container",
            "description": "<p>The outer most element. Consider this the destination.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example",
        "content": "import { useIsContainer } from 'reactium-core/sdk';\nimport React, { useEffect, useRef, useState } from 'react';\n\nexport const Dropdown = props => {\n    const container = useRef();\n\n    const [expanded, setExpanded] = useState(props.expanded || false);\n\n    const isContainer = useIsContainer();\n\n    const dismiss = e => {\n        // already dismissed? -> do nothing!\n        if (!expanded) return;\n\n        // e.target is inside container.current? -> do nothing!\n        if (isContainer(e.target, container.current)) return;\n\n        // e.target is outside container.current? -> collapse the menu\n        setExpanded(false);\n    };\n\n    const toggle = () => setExpanded(!expanded);\n\n    useEffect(() => {\n        if (!container.current || typeof window === 'undefined') return;\n\n        window.addEventListener('mousedown', dismiss);\n        window.addEventListener('touchstart', dismiss);\n\n        return () => {\n            window.removeEventListener('mousedown', dismiss);\n            window.removeEventListener('touchstart', dismiss);\n        }\n\n    }, [container.current]);\n\n    return (\n        <div ref={container}>\n            <button onClick={toggle}>Toggle Dropdown</button>\n            {expanded && (\n                <ul>\n                    <li><a href='#item-1' onClick={toggle}>Item 1</a></li>\n                    <li><a href='#item-2' onClick={toggle}>Item 2</a></li>\n                    <li><a href='#item-3' onClick={toggle}>Item 3</a></li>\n                </ul>\n            )}\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/is-container.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useRefs()",
    "title": "useRefs()",
    "group": "ReactHook",
    "name": "useRefs",
    "description": "<p>Creates a single reference object that can be managed using the <code>get</code>/<code>set</code>/<code>del</code>/<code>clear</code> functions.</p>",
    "examples": [
      {
        "title": "Usage",
        "content": "import React, { useEffect, useState } from 'react';\nimport { useRefs } from '@atomic-reactor/reactium-sdk-core';\n\nconst MyComponent = () => {\n    const refs = useRefs();\n    const [state, setState] = useState({ input: null });\n\n    const onClick = () => {\n        const inputElm = refs.get('input');\n        setState({ ...state, input: inputElm.value });\n        inputElm.value = '';\n    };\n\n    return (\n        <div ref={elm => refs.set('container', elm)}>\n            {state.input && <div>{state.input}</div>}\n            <input type='text' ref={elm => refs.set('input', elm)} />\n            <button onClick={onClick}>Update</button>\n        </div>\n    );\n};",
        "type": "json"
      },
      {
        "title": "Proxy Reference Usage",
        "content": "// sometimes you need a forwarded ref to be a ref object from useRef() or React.createRef()\n// You can create proxy factory for the refs to achieve this.\nimport React, { useEffect, useState } from 'react';\nimport { EventForm } from '@atomic-reactor/reactium-ui';\nimport { useRefs } from '@atomic-reactor/reactium-sdk-core';\n\nconst MyComponent = () => {\n   const refs = useRefs();\n   // creates a factory for React.createRef() object to your refs\n   const refProxy = refs.createProxy('form');\n\n   const [state, setState] = useState({});\n\n   const onSubmit = e => {\n       const formRef = refs.get('form');\n       setState({ ...formRef.getValue() });\n   };\n\n   // EventForm expects a reference object, not a callback function\n   // When EventForm references ref.current, it will actually get refs.get('form').\n   // When EventForm sets the ref.current value, it will actually perform refs.set('form', value);\n   return (\n       <EventForm ref={refProxy} onSubmit={onSubmit}>\n           <input type='text' name=\"foo\" />\n           <button type=\"submit\">Submit the Form</button>\n       </EventForm>\n   );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/useRefs.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useRegisterHandle(id,cb,deps)",
    "title": "useRegisterHandle()",
    "description": "<p>React hook to create a new imperative handle reference, similar to <code>useImperativeHandle()</code> except that instead of using <code>React.forwardRef()</code> to attach the handle to a parent compenent ref. A ref is generated for you and is assigned the current value of the callback <code>cb</code>, is registered with <code>Reactium.Handle</code>, and made available to all other components at the object path <code>id</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>Function that returns value to be assigned to the imperative handle reference.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "deps",
            "description": "<p>Array of values to watch for changes. When changed, your reference will be updated by calling <code>cb</code> again. All <code>Reactium.Handle.subscribe()</code> subscribers will be called on updates, and relevant <code>useHandle()</code> hooks will trigger rerenders.</p>"
          }
        ]
      }
    },
    "name": "useRegisterHandle",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useRoles(search)",
    "title": "useRoles()",
    "description": "<p>React hook to get roles object. If search is provided, will retrieve a specific role.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "search",
            "description": "<p>Name, level or object id of the roles to retrieve. If not provide, an object will all roles will be returned.</p>"
          }
        ]
      }
    },
    "name": "useRoles",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": ".core/sdk/named-exports/roles.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useSettingGroup(group)",
    "title": "useSettingGroup()",
    "version": "3.2.1",
    "description": "<p>Get and set a group of Actinium settings.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "group",
            "description": "<p>the setting group id</p>"
          }
        ]
      }
    },
    "name": "useSettingGroup",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Usage",
        "content": "import React from 'react';\nimport { useSettingGroup } from 'reactium-core/sdk';\nimport op from 'object-path';\n\nexport default () => {\n    const { canGet, canSet, settingGroup, setSettingGroup } = useSettingGroup('MySettings');\n\n    // Set MySetting.foo = 'bar' on click\n    return (\n        <div>\n            {canGet && <span>Foo Setting: {op.get(settingGroup, 'foo')}</span>}\n\n            <button disabled={!canSet} onClick={() => setSettingGroup({\n                ...settingGroup,\n                foo: 'bar',\n            })}>Update Setting</button>\n        </div>\n    )\n}",
        "type": "json"
      },
      {
        "title": "Returns",
        "content": "{\n    canGet, // Boolean, if current user is allowed to get this setting group\n    canSet, // Boolean, if current user is allowed to set this setting group\n    settingGroup, // setting group object\n    setSettingGroup, // wrapper around Reactium.Setting.set(), will trigger optimistic update and rerender on response\n}",
        "type": "json"
      }
    ],
    "filename": ".core/sdk/named-exports/setting.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useStatus(initialStatus)",
    "title": "useStatus()",
    "group": "ReactHook",
    "name": "useStatus",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "initialStatus",
            "defaultValue": "pending",
            "description": "<p>The initial status of the hook.</p>"
          }
        ]
      }
    },
    "description": "<p>Synchronously set a status value that can be checked within a function scope without updating the state of the component. Useful when doing asynchronous activities and the next activity depends on a status of some sort from the previous activity.</p> <p>Returns [status:String, setStatus:Function, isStatus:Function, getStatus:Function]</p> <h3>status</h3> <p>The current asynchronous status value. (is accurate once per render)</p> <h3>setStatus(status:String, forceRender:Boolean = false)</h3> <p>Set the status value. If forceRender is true, a rerender will be triggered. <em><strong>Beware:</strong></em> forceRender may have unintended consequence and should be used in last status before re-rendering situations only.</p> <h3>isStatus(statuses:Array)</h3> <p>Check if the current status matches the statuses passed.</p> <h3>getStatus()</h3> <p>Get the synchrounous value of the status. This can matter if you need to set and check the value in the same render cycle.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/useStatus.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useSyncState(initialState)",
    "title": "useSyncState()",
    "description": "<p>Intended to provide an object to get and set state synchrounously, while providing a EventTarget object that can dispatch a 'set' event when the state is updated.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "initialState",
            "description": "<p>The initial state.</p>"
          }
        ]
      }
    },
    "name": "useSyncState",
    "group": "ReactHook",
    "examples": [
      {
        "title": "SimpleExample",
        "content": "import React from 'react';\nimport { useSyncState } from 'reactium-core/sdk';\nexport const SimpleExample = () => {\n    const clickState = useSyncState({ clicks: 1 });\n    const clicks = clickState.get('clicks');\n    return (\n        <div>Clicked {clicks} times <button\n            onClick={() => clickState.set('clicks', clicks + 1)}>Click Me</button>\n        </div>\n    );\n };",
        "type": "json"
      },
      {
        "title": "EventTarget",
        "content": "import React from 'react';\nimport { useSyncState, useRegisterHandle } from 'reactium-core/sdk';\nexport const Clicker = () => {\n    const clickState = useSyncState({ clicks: 1 });\n    const clicks = clickState.get('clicks');\n    useRegisterHandle('ClickState', () => clickState);\n\n    return (\n        <div>Clicked {clicks} times <button\n            onClick={() => clickState.set('clicks', clicks + 1)}>Click Me</button>\n        </div>\n    );\n };",
        "type": "json"
      },
      {
        "title": "Consumer",
        "content": "import React, { useState, useEventEffect } from 'react';\nimport { useHandle } from 'reactium-core/sdk';\n// communicate state with other components\nexport const Listener = () => {\n    const [clicked, setClicked] = useState(false);\n    const handle = useHandle('ClickState')\n    const numClicks = handle.get('clicks');\n\n    const remoteClicked = e => {\n        if (numClicks < e.get('clicks')) {\n            setClicked(true);\n        }\n    };\n\n    useEventEffect(handle, { set: remoteClicked }, []);\n\n    return (\n        <div>Clicker {clicked ? 'unclicked' : 'clicked'}</div>\n    );\n };",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/useSyncState.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useWindow()",
    "title": "useWindow()",
    "description": "<p>React hook which resolves to the browser or electron window when run in normal context or in the Reactium toolkit. Otherwise will return <code>undefined</code>. This is important particularly when you need to inspect the window inside the <code>react-frame-component</code> (<code>FrameContextConsumer</code>) which sandboxes your component withing the toolkit. Your component will automatically be rendered inside the WindowProvider, which will provide the correct <code>window</code> and <code>document</code> objects. See <code>useWindowSize()</code> for the most important use case.</p>",
    "examples": [
      {
        "title": "BrowserComponent.js",
        "content": "import Reactium, { useWindow } from 'reactium-core/sdk';\nimport React, { useEffect } from 'react';\nimport op from 'object-path';\n\nexport default () => {\n    const window = useWindow();\n    const [width, setWidth] = op.get(window, 'innerWidth', 1);\n\n    useEffect(() => {\n        const isBrowser = Reactium.Utils.isWindow(window);\n        const updateWidth = () => setWidth(window.innerWidth);\n\n        // safe for server-side rendering, which has no window\n        // when used in toolkit Frame, will use correct window object\n        if (isBrowser) {\n            window.addEventListener('resize', updateWidth)\n            return () => window.removeEventListener('resize', updateWidth);\n        }\n    }, []);\n};\n\n // import WindowProvider from 'reactium-core/components/WindowProvider';",
        "type": "json"
      }
    ],
    "name": "useWindow",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": ".core/sdk/named-exports/window.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useWindowSize(params)",
    "title": "useWindowSize()",
    "description": "<p>Returns window <code>innerWidth</code> number, <code>innerHeight</code> number, and current <code>breakpoint</code>, and updates on window resizes. When using the out of the box scss styles in Reactium, a grid system is in place, and is defined by an overridable sass map <code>$breakpoints-max</code>, defined by default as:</p> <pre class=\"prettyprint\">$breakpoints-max: ('xs': 640, 'sm': 990, 'md': 1280, 'lg': 1440,'xl': 1600) !default; </code></pre>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "params",
            "description": "<p><code>defaultWidth</code>, <code>defaultHeight</code>, and debounce <code>delay</code> properties.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "params.defaultWidth",
            "defaultValue": "1",
            "description": "<p>Default width returned by the hook when window object is <code>undefined</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "params.defaultHeight",
            "defaultValue": "1",
            "description": "<p>Default height returned by the hook when window object is <code>undefined</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "params.delay",
            "defaultValue": "0",
            "description": "<p>Debounce delay to throttle many window resize events, to prevent unnecessary rerenders of your component using this hook.</p>"
          }
        ]
      }
    },
    "name": "useWindowSize",
    "group": "ReactHook",
    "examples": [
      {
        "title": "ResponsiveComponent.js",
        "content": "import React from 'react';\nimport { useWindowSize } from 'reactium-core/sdk';\n\nconst Mobile = () => {\n   return (\n       <div>I'm a mobile component</div>\n   );\n}\n\nconst Tablet = () => {\n   return (\n       <div>I'm a tablet component</div>\n   );\n}\n\nconst Desktop = () => {\n   return (\n       <div>I'm a desktop component</div>\n   );\n}\n\nexport () => {\n   const { breakpoint } = useWindowSize();\n\n   switch(breakpoint) {\n       case 'xl':\n       case 'lg':\n       return <Desktop />;\n\n       case 'md':\n       return <Tablet />;\n\n       case 'xs':\n       case 'sm':\n       default:\n       return <Mobile />;\n   }\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/sdk/named-exports/window.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useZoneComponents(zone)",
    "title": "useZoneComponents()",
    "description": "<p>A React hook used in the <code>Zone</code> component to determine what components should currently be rendered. Useful to observe a zone in another component. If you want to observe to the zone components without necessarily causing a rerender in your component, use <code>Reactium.Zone.getZoneComponents()</code> (to get a list of components in the zone), alone or in combination with <code>Reactium.Zone.subscribe()</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "dereference",
            "defaultValue": "true",
            "description": "<p>If true, returns the current value of the components in the zone, separate from the reference. Otherwise, returns the ReactiumSyncState object. This can be useful if you wish to use the components value with a non-memoized value.</p>"
          }
        ]
      }
    },
    "name": "useZoneComponents",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Example",
        "content": "import React from 'react';\nimport { useZoneComponents } from 'reactium-core/sdk';\n\nexport props => {\n    const zoneComponents = useZoneComponents('my-zone');\n\n    return (\n        <div>\n            Components in Zone: {zoneComponents.length}\n        </div>\n    );\n};",
        "type": "json"
      },
      {
        "title": "NoDereference",
        "content": "import React from 'react';\nimport { useZoneComponents } from 'reactium-core/sdk';\n\n// Use this method when the zone components are not refreshing smoothly on\n// rendering.\nexport props => {\n    const zoneComponents = useZoneComponents('my-zone', false);\n\n    return (\n        <div>\n            Components in Zone: {zoneComponents.get().length}\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/Zone.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "Object",
    "url": "Cache",
    "title": "Cache",
    "version": "3.0.3",
    "name": "Cache",
    "group": "Reactium.Cache",
    "description": "<p>Cache allows you to easily store application data in memory.</p>",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.clear()",
    "title": "Cache.clear()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.clear",
    "description": "<p>Delete all cached values.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The key to delete. If the value is an <code>{Object}</code> you can use an object path to delete a specific part of the value. The updated value is then returned.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Reactium.Cache.clear();",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.del(key)",
    "title": "Cache.del()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.del",
    "description": "<p>Delete the value for a given key. Returns <code>{Boolean}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The key to delete. If the value is an <code>{Object}</code> you can use an object path to delete a specific part of the value. The updated value is then returned.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Given the cached value: { foo: { bar: 123, blah: 'hahaha' } }\nReactium.Cache.del('foo.bar'); // returns: { blah: 'hahaha' }\nReactium.Cache.del('foo');     // returns: true",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.get(key)",
    "title": "Cache.get()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.get",
    "description": "<p>Retrieves the value for a given key. If the value is not cached <code>null</code> is returned.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>The key to retrieve. If the value is an <code>{Object}</code> you can use an object path for the key. If no key is specified the entire cache is returned.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "default",
            "description": "<p>The default value to return if key is not found.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Given the cached value: { foo: { bar: 123 } }\nReactium.Cache.get('foo.bar'); // returns: 123;\nReactium.Cache.get('foo');     // returns: { bar: 123 }",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.keys()",
    "title": "Cache.keys()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.keys",
    "description": "<p>Returns an array of the cached keys.</p>",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.memsize()",
    "title": "Cache.memsize()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.memsize",
    "description": "<p>Returns the number of entries taking up space in the cache.</p>",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.merge(values)",
    "title": "Cache.merge()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.merge",
    "description": "<p>Merges the supplied values object with the current cache. Any existing entries will remain in cache. Duplicates will be overwritten unless <code>option.skipDuplicates</code> is <code>true</code>. Entries that would have exipired since being merged will expire upon merge but their timeoutCallback will not be invoked. Returns the new size of the cache.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "values",
            "description": "<p>Key value pairs to merge into the cache.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Give the existing cache: { foo: 'bar' }\n\nReactium.Cache.merge({\n    test: {\n        value: 123,\n        expire: 5000,\n    },\n});\n\nReactium.Cache.get()\n// returns: { foo: 'bar', test: 123 }",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.set(key,value,timeout,timeoutCallback)",
    "title": "Cache.set()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.set",
    "description": "<p>Sets the value for a given key. If the value is an <code>{Object}</code> and is already cached, you can use an object path to update a specific part of the value. Returns the cached value.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The key to set. If the key is an object path and the key does not exist, it will be created.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "value",
            "description": "<p>The value to cache.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "timeout",
            "description": "<p>Remove the value in the specified time in milliseconds. If no timeout value specified, the value will remain indefinitely.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": true,
            "field": "timeoutCallback",
            "description": "<p>Function called when the timeout has expired. The timeoutCallback will be passed the key and value as arguments.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// The following are equivalent\nReactium.Cache.set('foo', { bar: 123 });\nReactium.Cache.set('foo.bar', 123);\n\n// Set to expire in 5 seconds\nReactium.Cache.set('error', 'Ivnalid username or password', 5000);\n\n// Set to expire in 5 seconds and use a timeoutCallback\nReactium.Cache.set('foo', { bar: 456 }, 5000, (key, value) => console.log(key, value));",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.size()",
    "title": "Cache.size()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.size",
    "description": "<p>Returns the current number of entries in the cache.</p>",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.subscribe(key,cb)",
    "title": "Cache.subscribe()",
    "group": "Reactium.Cache",
    "name": "Cache.subscribe",
    "description": "<p>Subscribe to cache changes that impact a particular key. Returns an unsubscribe function.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "key",
            "description": "<p>object path of the cache value (array or string)</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>The callback function to call when impacting changes have been made to the subscribed cache. Changes include any set/put, delete, clear, merge, or expiration that <em>may</em> impact the value you care about.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "const foo = Reactium.Cache.get('values.foo');\nReactium.Cache.subscribe('values.foo', ({op, ...params}) => {\nswitch(op) {\n    case 'set': {\n        const { key, value } = params;\n        // do something with new value if applicable\n        // you can see the key that impacted the cache value\n        break;\n    }\n     case 'del': {\n        // the key that was deleted\n        const { key } = params;\n        // do something about the deletion\n        break;\n    }\n     case 'expire': {\n        // do something about expiration (which will have impacted your value for sure)\n        // this will never be called if your value doesn't expire\n        break;\n    }\n     case 'merge': {\n        // complete cache object after merge\n        // may impact you, you'll have to check\n        const { obj } = params;\n        if (op.get(obj, 'values.foo') !== foo) {\n            // do something\n        }\n        break;\n    }\n     default:\n    break;\n}\n});",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Component.register(hook,component,order)",
    "title": "Component.register()",
    "group": "Reactium.Component",
    "name": "Component.register",
    "description": "<p>Register a React component to be used with a specific useHookComponent React hook. This must be called before the useHookComponent that defines the hook.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hook",
            "description": "<p>The hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "component",
            "description": "<p>component(s) to be output by useHookComponent</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": "<p>precedent of this if Component.register is called multiple times (e.g. if you are trying to override core or another plugin)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "reactium-hooks.js",
        "content": "import React from 'react';\nimport Reactium from 'reactium-core/sdk';\n\n// component to be used unless overriden by Reactium.Component.register()\nconst ReplacementComponentA = () => <div>My Plugin's Component</div>\nconst ReplacementComponentB = () => <div>My Alternative Component</div>\n\n// Simple Version\nReactium.Component.register('my-component', ReplacementComponentA);\n\n// Advanced Form using Reactium.Hook SDK\nReactium.Hook.register('my-component', async (...params) => {\n    const context = params.pop(); // context is last argument\n    const [param] = params;\n    if (param === 'test') {\n        context.component = ReplacementComponentA;\n    } else {\n        context.component = ReplacementComponentB;\n    }\n}\n})",
        "type": "json"
      },
      {
        "title": "parent.js",
        "content": "import React from 'react';\nimport { useHookComponent } from 'reactium-core/sdk';\n\n// component to be used unless overriden by Reactium.Component.register()\nconst DefaultComponent = () => <div>Default or Placeholder component</div>\n\nexport props => {\n    const MyComponent = useHookComponent('my-component', DefaultComponent, 'test');\n    return (\n        <div>\n            <MyComponent {...props} />\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/component/index.js",
    "groupTitle": "Reactium.Component"
  },
  {
    "type": "Function",
    "url": "Handle.get(id)",
    "title": "Handle.get()",
    "description": "<p>Get a specific imperative handle reference, by object path (id). If id is full object path to the handle, returns a React reference if it exists, otherwise <code>undefined</code>. If id is partial object path, returns object containing one or more references if the path exists, otherwise 'undefined'.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'</p>"
          }
        ]
      }
    },
    "name": "Handle.get",
    "group": "Reactium.Handle",
    "examples": [
      {
        "title": "CountList.js",
        "content": "import React from 'react';\nimport Counter from './Counter';\nimport CounterControl from './CounterControl';\n const CountList = props => {\n    return (\n        <>\n            <Counter id='1'/>\n            <Counter id='2'/>\n            <CounterControl />\n        </>\n    );\n};\n export default CountList;",
        "type": "json"
      },
      {
        "title": "Counter.js",
        "content": "import React, { useState } from 'react';\nimport { useRegisterHandle } from 'reactium-core/sdk';\n const Counter = ({id = 1}) => {\n    const [count, setCount] = useState(Number(id));\n     // hook form of Handle.register and Handle.unregister\n    // handles ref creation for you\n    useRegisterHandle(['counter', id], () => ({\n        increment: () => setCount(count + 1),\n    }), [count]);\n     return (\n        <div>\n            <h1>Counter {id}</h1>\n            Count: {count}\n        </div>\n    );\n};\n export default Counter;",
        "type": "json"
      },
      {
        "title": "CounterControl.js",
        "content": "import React from 'react';\nimport Reactium from 'reactium-core/sdk';\n const CounterControl = () => {\n   // get object with all handles in the \"counter\" partial path\n    const handles = Reactium.Handle.get('counter');\n     const click = () => {\n       // equivalent to getting handle 'counter.1' and `counter.2` separately\n       // loop through all counters and call increment on click\n        Object.values(handles).forEach(({current}) => current.increment())\n    };\n     return (\n        <div>\n            <h1>CounterControl</h1>\n            <button onClick={click}>Increment All Counters</button>\n        </div>\n    );\n};\n export default CounterControl;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/handle/index.js",
    "groupTitle": "Reactium.Handle"
  },
  {
    "type": "Function",
    "url": "Handle.list()",
    "title": "Handle.list()",
    "description": "<p>Get full object containing all current reference handles.</p>",
    "name": "Handle.list",
    "group": "Reactium.Handle",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/handle/index.js",
    "groupTitle": "Reactium.Handle"
  },
  {
    "type": "Function",
    "url": "Handle.register(id,ref)",
    "title": "Handle.register()",
    "description": "<p>Register an imperative handle reference. See <code>useRegisterHandle()</code> React hook for easier pattern for functional components.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'</p>"
          },
          {
            "group": "Parameter",
            "type": "Ref",
            "optional": false,
            "field": "ref",
            "description": "<p>React reference created with <code>React.createRef()`` or </code>React.useRef()`.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "update",
            "defaultValue": "true",
            "description": "<p>Update <code>useHandle</code> subscribers of this handle id.</p>"
          }
        ]
      }
    },
    "name": "Handle.register",
    "group": "Reactium.Handle",
    "examples": [
      {
        "title": "MyControllableComponent.js",
        "content": "import React, {useEffect, useState, useRef} from 'react';\nimport Reactium from 'reactium-core/sdk';\n// This component is externally controllable on registered handle\n// with id: 'controlled.handle' or ['controlled', 'handle']\nexport default () => {\nconst [count, setCount] = useState(1);\nconst increment = () => setCount(count + 1);\nconst ref = useRef({\n    increment,\n});\n useEffect(() => {\n    Reactium.register('controlled.handle', ref);\n    return () => Reactium.unregister('controlled.handle');\n}, [count]);\n return (<div>Count is {count}</div>);\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/handle/index.js",
    "groupTitle": "Reactium.Handle"
  },
  {
    "type": "Function",
    "url": "Handle.subscribe(cb)",
    "title": "Handle.subscribe()",
    "description": "<p>Subscribe to changes in imperative handle references (registrations and unregistrations). Returns unsubscribe function.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>callback to be called when a handle is registered or unregistered</p>"
          }
        ]
      }
    },
    "name": "Handle.subscribe",
    "group": "Reactium.Handle",
    "examples": [
      {
        "title": "MyComponent.js",
        "content": "import React, {useState, useEffect} from 'react';\nimport Reactium from 'reactium-core/sdk';\nimport op from 'object-path'\nexport default () => {\nconst [handle, updateHandle] = useState(Reactium.Handle.get('path.to.handle'));\nuseEffect(() => Reactium.Handle.subscribe(() => {\n    const h = Reactium.Handle.get('path.to.handle');\n    if (handle.current !== h.current) updateHandle(h);\n}), []);\n const doSomething = () => {\n    if (op.has(handle, 'current.action')) handle.current.action;\n};\n return (<button onClick={doSomething}>Some Action</button>);\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/handle/index.js",
    "groupTitle": "Reactium.Handle"
  },
  {
    "type": "Function",
    "url": "Handle.unregister(id)",
    "title": "Handle.unregister()",
    "description": "<p>Unregister an imperative handle reference. See <code>Handle.register()</code> for example usage.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'</p>"
          }
        ]
      }
    },
    "name": "Handle.unregister",
    "group": "Reactium.Handle",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/handle/index.js",
    "groupTitle": "Reactium.Handle"
  },
  {
    "type": "Objectt",
    "url": "Reactium.Handle",
    "title": "Handle",
    "name": "Reactium.Handle",
    "description": "<p>Similar concept to an imperative handle created when using <code>React.forwardRef()</code> and the <code>useImperativeHandle()</code> React hook. Reactium provides the <code>Reactium.Handle</code> object to manage references created in your components to allow imperative control of your component from outside the component. This is used when you wish to change the internal state of your component from outside using a technique other than changing the component <code>props</code> (i.e. declarative control).</p> <p>This technique makes use of references created with <code>React.createRef()</code> or the <code>useRef()</code> hook for functional components. The developer can then assign the <code>current</code> property of this reference to be an object containing methods or callbacks (i.e. methods that can invoke <code>this.setState()</code> or the update callback returned by <code>useState()</code> hook) that will cause the state of the component to change (and rerender).</p> <p>By registering this &quot;handle reference&quot; on the <code>Reactium.Handle</code> singleton, other distant components can exercise imperative control over your component.</p> <p>For developers that prefer the use of React hooks, Reactium provides two hooks for your use: <code>useRegisterHandle()</code> and <code>useHandle()</code> to register and use these handles respectively.</p>",
    "group": "Reactium.Handle",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/handle/index.js",
    "groupTitle": "Reactium.Handle"
  },
  {
    "type": "Function",
    "url": "Hook.flush(name)",
    "title": "Hook.flush()",
    "name": "Hook.flush",
    "description": "<p>Clear all registered callbacks for a hook.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "defaultValue": "async",
            "description": "<p>'async' or 'sync' hooks</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.list()",
    "title": "Hook.list()",
    "name": "Hook.list",
    "description": "<p>Register a hook callback.</p>",
    "group": "Reactium.Hook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.register(name,callback,order,id)",
    "title": "Hook.register()",
    "name": "Hook.register",
    "description": "<p>Register a hook callback.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>async function (or returning promise) that will be called when the hook is run. The hook callback will receive any parameters provided to Hook.run, followed by a context object (passed by reference to each callback).</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>order of which the callback will be called when this hook is run.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>the unique id. If not provided, a uuid will be generated</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Hook.register('plugin-init', async context => {\n// mutate context object asynchrounously here\n    console.log('Plugins initialized!');\n}, Enums.priority.highest);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.registerSync(name,callback,order,id)",
    "title": "Hook.registerSync()",
    "name": "Hook.registerSync",
    "description": "<p>Register a sync hook callback.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>function returning promise that will be called when the hook is run. The hook callback will receive any parameters provided to Hook.run, followed by a context object (passed by reference to each callback).</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>order of which the callback will be called when this hook is run.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>the unique id. If not provided, a uuid will be generated</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Hook.registerSync('my-sync-hook', context => {\n    // mutate context object synchrounously here\n    console.log('my-sync-hook run!');\n}, Enums.priority.highest);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.run(name,...params)",
    "title": "Hook.run()",
    "name": "Hook.run",
    "description": "<p>Run hook callbacks.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "...params",
            "description": "<p>any number of arbitrary parameters (variadic)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "context",
            "description": "<p>context object passed to each callback (after other variadic parameters)</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.runSync(name,...params)",
    "title": "Hook.runSync()",
    "name": "Hook.runSync",
    "description": "<p>Run hook callbacks sychronously.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "...params",
            "description": "<p>any number of arbitrary parameters (variadic)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "context",
            "description": "<p>context object passed to each callback (after other variadic parameters)</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.unregister(id)",
    "title": "Hook.unregister()",
    "name": "Hook.unregister",
    "description": "<p>Unregister a registered hook callback by id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the unique id provided by Hook.register() or Hook.list()</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Plugin.isActive(ID)",
    "title": "Plugin.isActive()",
    "group": "Reactium.Plugin",
    "name": "Plugin.isActive",
    "description": "<p>Determine if a plugin ID is active.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the plugin id.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Reactium.Plugin.isActive('Media');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/plugin/index.js",
    "groupTitle": "Reactium.Plugin"
  },
  {
    "type": "Function",
    "url": "Plugin.list()",
    "title": "Plugin.list()",
    "group": "Reactium.Plugin",
    "name": "Plugin.list",
    "description": "<p>Return the list of registered plugins.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/plugin/index.js",
    "groupTitle": "Reactium.Plugin"
  },
  {
    "type": "Function",
    "url": "Plugin.register(ID,order)",
    "title": "Plugin.register()",
    "name": "Plugin.register",
    "description": "<p>Register a Reactium plugin.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the plugin id</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>Priority of the plugin initialization respective to other existing plugins.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Plugin",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import Reactium from 'reactium-core/sdk';\n\nconst newReducer = (state = { active: false }, action) => {\n    if (action.type === 'ACTIVATE') {\n        return {\n            ...state,\n            active: true,\n        };\n    }\n    return state;\n};\n\nconst register = async () => {\n    await Reactium.Plugin.register('myPlugin');\n    Reactium.Reducer.register('myPlugin', newReducer);\n};\n\nregister();",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/plugin/index.js",
    "groupTitle": "Reactium.Plugin"
  },
  {
    "type": "Function",
    "url": "Plugin.unregister(ID)",
    "title": "Plugin.unregister()",
    "name": "Plugin.unregister",
    "description": "<p>Unregister a Reactium plugin by unique id. This can only be called prior to the <code>plugin-dependencies</code> hook, or <code>Reactium.Plugin.ready === true</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the plugin id</p>"
          }
        ]
      }
    },
    "group": "Reactium.Plugin",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import Reactium from 'reactium-core/sdk';\n\n// Before Reactium.Plugin.ready\nReactium.Hook.register('plugin-dependencies', () => {\n    // Prevent myPlugin registration callback from occurring\n    Reactium.Plugin.unregister('myPlugin');\n    return Promise.resolve();\n}, Enums.priority.highest)",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/plugin/index.js",
    "groupTitle": "Reactium.Plugin"
  },
  {
    "type": "Function",
    "url": "Prefs.clear(key)",
    "title": "Prefs.clear()",
    "version": "0.0.17",
    "description": "<p>Clear one or more preferences.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>If specified as an object-path, will unset a specific preference path. Otherwise, all preferences will be cleared.</p>"
          }
        ]
      }
    },
    "name": "Prefs.clear",
    "group": "Reactium.Prefs",
    "examples": [
      {
        "title": "Example",
        "content": "import Reactium from 'reactium-core/sdk';\n\nReactium.Prefs.clear();",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/prefs/index.js",
    "groupTitle": "Reactium.Prefs"
  },
  {
    "type": "Function",
    "url": "Prefs.get(key,defaultValue)",
    "title": "Prefs.get()",
    "version": "0.0.17",
    "description": "<p>Get one or more preferences by object path.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>If specified as an object-path, will get a specific preference by this path. Otherwise, all preferences will be returned.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "defaultValue",
            "description": "<p>The value to return if the preference has not been set.</p>"
          }
        ]
      }
    },
    "name": "Prefs.get",
    "group": "Reactium.Prefs",
    "examples": [
      {
        "title": "Example",
        "content": "import Reactium from 'reactium-core/sdk';\n\nconst myPref = Reactium.Prefs.get('my.object.path', { someDefault: 'foo' });",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/prefs/index.js",
    "groupTitle": "Reactium.Prefs"
  },
  {
    "type": "Function",
    "url": "Prefs.set(key,value)",
    "title": "Prefs.set()",
    "version": "0.0.17",
    "description": "<p>Get one or more preferences by object path.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The object-path to use to set the value.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "value",
            "description": "<p>The value to set to the key.</p>"
          }
        ]
      }
    },
    "name": "Prefs.set",
    "group": "Reactium.Prefs",
    "examples": [
      {
        "title": "Example",
        "content": "import Reactium from 'reactium-core/sdk';\n\nReactium.Prefs.set('my.object.path', { value: 'foo' });",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/prefs/index.js",
    "groupTitle": "Reactium.Prefs"
  },
  {
    "type": "Object",
    "url": "Reactium.Pulse.Task",
    "title": "Pulse.Task",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task",
    "description": "<p>Pulse Task object that performs the heavy lifting for the Pulse API.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.ID",
    "title": "Pulse.Task.ID",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.ID",
    "description": "<p>[read-only] The unique ID of the task. Returns: <code>String</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.attempt",
    "title": "Pulse.Task.attempt",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.attempt",
    "description": "<p>[read-only] The current attempt for the active task. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.delay",
    "title": "Pulse.Task.delay",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.attempt",
    "description": "<p>The current attempt for the active task. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.attempts",
    "title": "Pulse.Task.attempts",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.attempts",
    "description": "<p>The number of times a task will retry before it fails. Default: <code>-1</code>. You can set this value after the task has started.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.autostart",
    "title": "Pulse.Task.autostart",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.autostart",
    "description": "<p>[read-only] If the task autastarted upon creation. Default: <code>true</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.complete",
    "title": "Pulse.Task.complete",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.complete",
    "description": "<p>[read-only] Relevant only when the <code>repeat</code> property is higher than 1. Returns: <code>Boolean</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.count",
    "title": "Pulse.Task.count",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.count",
    "description": "<p>[read-only] The current number of times the task has succeeded. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.error",
    "title": "Pulse.Task.error",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.error",
    "description": "<p>[read-only] The current error message if applicable. Returns: <code>string</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.failed",
    "title": "Pulse.Task.failed",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.failed",
    "description": "<p>[read-only] Expresses if the current task has reached the maximum attempts. Returns: <code>Boolean</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.now()",
    "title": "Pulse.Task.now()",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.now",
    "description": "<p>Force run the task without waiting for it's delay. If the task is running this is a <code>noop</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.progress",
    "title": "Pulse.Task.progress",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.progress",
    "description": "<p>[read-only] The current amount of the repeat that has been completed. Relevant only when <code>repeat</code> is higher than 1. Returns: <code>0-1</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.repeat",
    "title": "Pulse.Task.repeat",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.repeat",
    "description": "<p>The current number of times to run the task. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.retry()",
    "title": "Pulse.Task.retry()",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.retry",
    "description": "<p>Force a retry of the task. Useful for when you want to manually handle retries within your callback function.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.start()",
    "title": "Pulse.Task.start()",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.start",
    "description": "<p>Start the task. Useful for when you want manually start a task in your callback function.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.status",
    "title": "Pulse.Task.status",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.status",
    "description": "<p>[read-only] The current status of the task. For comparing the status use the Pulse.ENUMS.STATUS values</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "const task = Pulse.get('MyTask');\nif (task.status === Pulse.ENUMS.STATUS.STOPPED) {\ntask.start();\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.stop()",
    "title": "Pulse.Task.stop()",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.stop",
    "description": "<p>Stop the task</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.timer",
    "title": "Pulse.Task.timer",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.timer",
    "description": "<p>[read-only] The reference to the current setTimeout. This value will change for each task run. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Function",
    "url": "Pulse.get(ID)",
    "title": "Pulse.get()",
    "group": "Reactium.Pulse",
    "name": "Pulse.get",
    "description": "<p>Retrieve a registered task. Returns a <code>Pulse.Task</code> object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The ID of the task.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "const task = Reactium.Pulse.get('MyTask');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.register(ID,callback,options,params)",
    "title": "Pulse.register()",
    "group": "Reactium.Pulse",
    "name": "Pulse.register",
    "description": "<p>Register a new task. The callback function can be any function and supports returning a <code>Promise</code> from the function. If a <code>Promise</code> is rejected, or the callback function returns an <code>Error</code> object or <code>false</code>, a retry will be triggered if possible. In cases where no more retries can be executed, the task will fail.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The unique ID of the task.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>The function to execute when the task is run. The first parameter passed to the callback function will be a reference to the current task object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "options",
            "description": "<p>The <code>Pulse.Task</code> configuration object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "..attempts",
            "defaultValue": "-1",
            "description": "<p>Number of times to retry a task. By default the task will retry indefinitely.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "..autostart",
            "defaultValue": "true",
            "description": "<p>Start the task when it is registered.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "..delay",
            "defaultValue": "1000",
            "description": "<p>Time in milliseconds before the task is run again. The task will not run again until after it's callback has been executed.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "..repeat",
            "defaultValue": "-1",
            "description": "<p>Number of times to repeat the task. Used in determining if the task is complete. A task with -1 as the value will never complete.</p>"
          },
          {
            "group": "Parameter",
            "type": "Arguments",
            "optional": true,
            "field": "params",
            "description": "<p>Additional parameters to pass to the callback function.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "import React, { useEffect } from 'react';\nimport Reactium from 'reactium-core/sdk';\n\nconst MyComponent = () => {\n  const myFunction = (task, ...params) => {\n      // Do something here\n      const result = 1 === 2;\n\n      if (task.failed) { // Attempted the task 5 times\n          console.log('myFunction FAILED after', task.attempts, 'attempts with the following parameters:', ...params);\n      }\n\n      if (task.complete) { // Succeeded 5 times\n          console.log('myFunction COMPLETED after', task.attempts, 'attempts with the following parameters:', ...params);\n      }\n\n      // Trigger a retry because we're returning `false`\n      return result;\n  };\n\n  useEffect(() => {\n      // Register myFunction as a task\n      Reactium.Pulse.register('MyComponent', myFunction, {\n          attempts: 5,\n          delay: 1000,\n          repeat: 5\n      }, 'param 1', 'param 2', 'param 3');\n\n      // Unregister task when the component unmounts\n      return () => Reactium.Pulse.unregister('MyComponent');\n  }, [Reactium.Pulse]);\n\n  return <div>MyComponent</div>;\n};\n\nexport default MyComponent;",
        "type": "json"
      },
      {
        "title": "Persist",
        "content": "// For cases where you want the task to persist even after the component has\n// been unmounted or the route has changed causing a rerender:\n\n\nimport React, { useEffect } from 'react';\nimport Reactium from 'reactium-core/sdk';\n\nconst MyComponent = () => {\n\n  useEffect(() => {\n      Reactium.Pulse.register('MyComponent', MyComponent.staticTask);\n  }, [Reactium.Pulse]);\n\n  return <div>MyComponent</div>\n};\n\nMyComponent.staticTask = (task, ...params) => new Promise((resolve, reject) => {\n  // Perform an async task\n  setTimeout(() => resolve('this is awkward...'), 10000);\n});\n\nexport default MyComponent;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.start(ID)",
    "title": "Pulse.start()",
    "group": "Reactium.Pulse",
    "name": "Pulse.start",
    "description": "<p>Start a registered task if it is stopped.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The task unique ID.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "Reactium.Pulse.start('MyTask');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.startAll()",
    "title": "Pulse.startAll()",
    "group": "Reactium.Pulse",
    "name": "Pulse.startAll",
    "description": "<p>Start all stopped tasks.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "Reactium.Pulse.startAll();",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.stop(ID)",
    "title": "Pulse.stop()",
    "group": "Reactium.Pulse",
    "name": "Pulse.stop",
    "description": "<p>Stop a registered task if it is running.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The task unique ID.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "Reactium.Pulse.stop('MyTask');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.stopAll()",
    "title": "Pulse.stopAll()",
    "group": "Reactium.Pulse",
    "name": "Pulse.stopAll",
    "description": "<p>Stop all running registered tasks.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "Reactium.Pulse.stopAll();",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.unregister(ID)",
    "title": "Pulse.unregister()",
    "group": "Reactium.Pulse",
    "name": "Pulse.unregister",
    "description": "<p>Stop and unregister a task. If the task is running, it's current attempt will resolve before the task is removed.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The task unique ID.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "useEffect(() => {\n   // Register myFunction as a task\n   Reactium.Pulse.register('MyComponent', myFunction, {\n       attempts: 5,\n       delay: 1000,\n       repeat: 5\n   }, 'param 1', 'param 2', 'param 3');\n\n   // Unregister task when the component unmounts\n   return () => Reactium.Pulse.unregister('MyComponent');\n}, [Reactium.Pulse]);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Object",
    "url": "Reactium.Pulse",
    "title": "Pulse",
    "group": "Reactium.Pulse",
    "name": "Reactium.Pulse",
    "description": "<p>Simple interface for creating long or short polls.</p> <h3>Motivation</h3> <p>Often is the case where you find yourself sprinkling <code>setTimeout</code> or <code>setInterval</code> all over your code and before you know it, you have so many or rewrite the same structures over and over with a slight twist here and there. The Pulse API is designed to lighten the load on those situations and give a clean interface to easily create and manage polls.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.reset()",
    "title": "Pulse.Task.reset()",
    "group": "Reactium.Pulse",
    "name": "Reactium.Pulse.Task.reset",
    "description": "<p>Resets the task's attempt count and run count. Useful for catastrophic failures in your callback function.</p>",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Routing.get()",
    "title": "Routing.get()",
    "name": "Routing.get",
    "description": "<p>Get sorted array of all route objects.</p>",
    "group": "Reactium.Routing",
    "version": "0.0.0",
    "filename": ".core/sdk/routing/index.js",
    "groupTitle": "Reactium.Routing"
  },
  {
    "type": "Function",
    "url": "Routing.register(route)",
    "title": "Routing.register()",
    "description": "<p>Dynamically register a new React router route.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "route",
            "description": "<p>object to be used as properties of React Router <code>&lt;Route /&gt;</code> component, including:</p> <ol> <li>path - the routing pattern</li> <li>exact - true/false if the pattern should be matched exactly</li> <li>component - the React component to render on this route</li> <li>order - (special) the priority of this route in the list of routes (which route will resolve first)</li> <li>load - (special) high-order Redux action function (thunk) to run when this route is resolved (should return a promise)</li> <li>... any other property <code>&lt;Route /&gt;</code> component accepts</li> </ol> <h2>Important Note</h2> <p>Unless called in isomorphic javascript (ie. code executed both in browser and in node.js), these routes will not yield Server-Side-Rendered html in SSR mode. The browser will still render the route correctly (will not break the page), however the server will deliver a 404 status code on cold loads of the page (i.e. hard-refresh of the browser).</p>"
          }
        ]
      }
    },
    "name": "Routing.register",
    "group": "Reactium.Routing",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "uuid",
            "description": "<p>unique id of the route</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import React from 'react';\nimport op from 'object-path';\nimport Reactium, { useSelect } from 'reactium-core/sdk';\n\n// A new component subscribing to Redux state.myPlugin.name\nconst HelloYou = () => {\n    const name = useSelect(state => op.get(state, 'myPlugin.name', 'unknown'));\n    return {\n        <div>Hello {name}</div>\n    };\n};\n\n// A Redux-Thunk high-order action function (useful for async actions)\nconst loadAction = (params, search) => (dispatch, getState) => {\n    dispatch({\n        type: 'MY_NAME',\n        name: op.get(params, 'name', 'unknown'),\n    });\n\n    return Promise.resolve();\n};\n\n// Register new routing pattern '/hello-world/:name'\nconst routeId = Reactium.Routing.register({\n    path: '/hello-world/:name',\n    exact: true,\n    component: HelloYou,\n    load: loadAction,\n});\n\n// Register reducer to handle 'MY_NAME' action\nconst myReducer = (state = {name: 'unknown'}, action) => {\n    if (action.type === 'MY_NAME') return {\n        ...state,\n        name: action.name,\n    };\n    return state;\n};\nReactium.Plugin.register('myPlugin').then(() => {\n    Reactium.Reducer.register('myPlugin', myReducer);\n})",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/sdk/routing/index.js",
    "groupTitle": "Reactium.Routing"
  },
  {
    "type": "Function",
    "url": "Routing.unregister(id)",
    "title": "Routing.unregister()",
    "name": "Routing.unregister",
    "description": "<p>Unregister an existing route, by id. Note: You can not unregister the 'NotFound' component. You can only replace it using the registering a NotFound component with Reactium.Component.register().</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the route id</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "update",
            "defaultValue": "true",
            "description": "<p>update subscribers</p>"
          }
        ]
      }
    },
    "group": "Reactium.Routing",
    "version": "0.0.0",
    "filename": ".core/sdk/routing/index.js",
    "groupTitle": "Reactium.Routing"
  },
  {
    "type": "Class",
    "url": "Fullscreen",
    "title": "Fullscreen",
    "group": "Reactium.Utilities",
    "name": "Fullscreen",
    "description": "<p>Cross browser utility for toggling fullscreen mode.</p>",
    "parameter": {
      "fields": {
        "Event": [
          {
            "group": "Event",
            "type": "Event",
            "optional": false,
            "field": "fullscreenchange",
            "description": "<p>Triggered when the browser's fullscreen state changes.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Usage:",
        "content": " // isExpanded()\n Reactium.Utils.Fullscreen.isExpanded();\n\n // isCollapsed()\n Reactium.Utils.Fullscreen.isCollapsed();\n\n // collapse()\n Reactium.Utils.Fullscreen.collapse();\n\n // expand()\n Reactium.Utils.Fullscreen.expand();\n\n // toggle()\n Reactium.Utils.Fullscreen.toggle();\n\n // Event: fullscreenchange\nimport React, { useEffect, useState } from 'react';\nimport Reactium from 'reactium-core/sdk';\n\nconst MyComponent = () => {\n    const [state, setState] = useState(Reactium.Utils.Fullscreen.isExpanded());\n\n    const update = () => {\n        setState(Reactium.Utils.Fullscreen.isExpanded());\n    }\n\n    useEffect(() => {\n        // ssr safety\n        if (typeof document === 'undefined') return;\n\n        // listen for fullscreenchange\n        document.addEventListener('fullscreenchange', update);\n\n        // prevent memory leak\n        return () => {\n            document.removeEventListener('fullscreenchange', update);\n        };\n    });\n\n    return (<div>{state}</div>);\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/named-exports/fullscreen.js",
    "groupTitle": "Reactium.Utilities"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.abbreviatedNumber(number)",
    "title": "Utils.abbreviatedNumber()",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "Utils.abbreviatedNumber",
    "description": "<p>Abbreviate a long number to a string.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "number",
            "description": "<p>The number to abbreviate.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Reactium.Utils.abbreviatedNumber(5000);\n// Returns: 5k\n\nReactium.Utils.abbreviatedNumber(500000);\n// Returns .5m",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.breakpoint(width)",
    "title": "Utils.breakpoint()",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "Utils.breakpoint",
    "description": "<p>Get the breakpoint of a window width.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "width",
            "defaultValue": "window.innerWidth",
            "description": "<p>Custom width to check. Useful if you have a resize event and want to skip the function from looking up the value again. Reactium.Utils.breakpoint(); // Returns: the current window.innerWidth breakpoint.</p> <p>Reactium.Utils.breakpoint(1024); // Returns: sm</p>"
          }
        ]
      }
    },
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.breakpoints()",
    "title": "Utils.breakpoints",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "Utils.breakpoints",
    "description": "<p>Get breakpoints from browser body:after psuedo element or <code>Utils.BREAKPOINTS_DEFAULT</code> if unset or node.</p> <table> <thead> <tr> <th>Breakpoint</th> <th>Range</th> </tr> </thead> <tbody> <tr> <td>xs</td> <td>0 - 640</td> </tr> <tr> <td>sm</td> <td>641 - 990</td> </tr> <tr> <td>md</td> <td>991 - 1280</td> </tr> <tr> <td>lg</td> <td>1281 - 1440</td> </tr> <tr> <td>xl</td> <td>1600+</td> </tr> </tbody> </table>",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Utils.cxFactory",
    "url": "Utils.cxFactory",
    "title": "Utils.cxFactory",
    "description": "<p>Create a CSS classname namespace (prefix) to use on one or more sub-class. Uses the same syntax as the <code>classnames</code> library.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "namespace",
            "description": "<p>the CSS class prefix</p>"
          }
        ]
      }
    },
    "name": "Utils.cxFactory",
    "group": "Reactium.Utils",
    "examples": [
      {
        "title": "Usage:",
        "content": "import Reactium from 'reactium-core/sdk';\nimport React from 'react';\n\nconst MyComponent = props => {\n    const cx = Reactium.Utils.cxFactory('my-component');\n    const { foo } = props;\n\n    return (\n        <div className={cx()}>\n            <div className={cx('sub-1')}>\n                Classes:\n                .my-component-sub-1\n            </div>\n            <div className={cx('sub-2', { bar: foo === 'bar' })}>\n                Classes:\n                .my-component-sub-2\n                .my-component-foo\n            </div>\n        </div>\n    );\n};\n\nMyComponent.defaultProps = {\n    foo: 'bar',\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.isWindow(iframeWindow)",
    "title": "Utils.isWindow()",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "Utils.isWindow",
    "description": "<p>Determine if the window object has been set. Useful when developing for server side rendering.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Window",
            "optional": true,
            "field": "iframeWindow",
            "description": "<p>iframe window reference.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Reactium.Utils.isWindow();\n// Returns: true if executed in a browser.\n// Returns: false if executed in node (server side rendering).",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Utils.registryFactory(name,idField)",
    "title": "Utils.registryFactory()",
    "description": "<p>Creates a new instance of a simple registry object. Useful for creating an SDK registry for allowing plugins to register &quot;things&quot;. e.g. components that will render inside a component, callbacks that will run.</p> <p>More documentation needed:</p> <ul> <li>register method: used to register an object on registry</li> <li>unregister method: used to unregister an object on registry</li> <li>list property: getter for list of registered objects</li> <li>protect method: called to prevent overwriting an id on registry</li> <li>unprotect method: called to again allow overwriting on id</li> </ul>",
    "name": "Utils.registryFactory",
    "group": "Reactium.Utils",
    "examples": [
      {
        "title": "Basic Reactium Usage",
        "content": "import Reactium from 'reactium-core/sdk';\n\n// trivial example of creation of new registry\nconst myRegistryPlugin = async () => {\n    await Reactium.Plugin.register('MyRegistryPlugin', Reactium.Enums.priority.highest);\n\n    // Using Plugin API to extend the SDK\n    // Adds a new registry to the SDK called `MyRegistry`\n    Reactium.MyRegistry = Reactium.Utils.registryFactory('MyRegistry');\n};\nmyRegistryPlugin();\n\n// trivial example of registry usage\nconst anotherPlugin = async () => {\n    await Reactium.Plugin.register('AnotherPlugin');\n\n    // register object with id 'anotherId' on registry\n    Reactium.MyRegistry.register('anotherId', {\n        foo: 'bar',\n    });\n\n    // iterate through registered items\n    Reactium.MyRegistry.list.forEach(item => console.log(item));\n\n    // unregister object with id 'anotherId'\n    Reactium.MyRegistry.unregister('anotherId');\n};\nanotherPlugin();",
        "type": "json"
      },
      {
        "title": "Basic Core Usage",
        "content": "import SDK from '@atomic-reactor/reactium-sdk-core';\nexport default SDK.Utils.registryFactory('MyRegistry');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Utils.splitParts(parts)",
    "title": "Utils.splitParts()",
    "description": "<p>Breaks formatted string (or array of strings), into flat array of parts/nodes, inserting an object in array in the place of <code>%key%</code>. Useful for tokenizing a translation string, and getting an array that can easily be mapped into React components. Returns an object with <code>replace</code> and <code>value</code> methods. Call <code>replace(key,value)</code> method (chaining) as many times as necessary to replace all tokens. Call <code>value()</code> method to get the final array of Part objects. Call <code>reset()</code> to reset the SlipParts object to the original string without replacements for reuse.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "parts",
            "description": "<p>String containing tokens like <code>%key%</code> to be replaced.</p>"
          }
        ],
        "replace": [
          {
            "group": "replace",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>when calling <code>replace(key,value)</code>, the token <code>%${key}%</code> will be replaced with an Part object key-&gt;value pair.</p>"
          },
          {
            "group": "replace",
            "type": "Mixed",
            "optional": false,
            "field": "value",
            "description": "<p>the value to use in the key-&gt;pair replacement</p>"
          }
        ],
        "Part": [
          {
            "group": "Part",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>the key in the keypair</p>"
          },
          {
            "group": "Part",
            "type": "Mixed",
            "optional": false,
            "field": "value",
            "description": "<p>the value in the keypair</p>"
          }
        ]
      }
    },
    "name": "Utils.splitParts",
    "group": "Reactium.Utils",
    "examples": [
      {
        "title": "Usage",
        "content": "import React from 'react';\nimport Reactium, { __ } from 'reactium-core/sdk';\nimport moment from 'moment';\nimport md5 from 'md5';\n\nconst Gravatar = props => {\n    const { email } = props;\n    return (\n        <img\n            className='gravatar'\n            src={`https://www.gravatar.com/avatar/${md5(\n                email.toLowerCase(),\n            )}?size=50`}\n            alt={email}\n        />\n    );\n};\n\nexport default props => {\n    const description = __('%username% updated post %slug% at %time%');\n    const parts = Reactium.Utils.splitParts(description)[\n        ('email', 'slug', 'time')\n    ].forEach(key => parts.replace(key, props[key]));\n\n    return (\n        <span className='by-line'>\n            {parts.value().map(part => {\n                // arbitrary React component possible\n                const { key, value } = part;\n\n                switch (key) {\n                    case 'email': {\n                        return <Gravatar key={key} email={value} />;\n                    }\n                    case 'time': {\n                        return (\n                            <span key={key} className='time'>\n                                {moment(value).fromNow()}\n                            </span>\n                        );\n                    }\n                    default: {\n                        // plain string part\n                        return <span key={key}>{value}</span>;\n                    }\n                }\n            })}\n        </span>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.isBrowserWindow(iframeWindow)",
    "title": "Utils.isBrowserWindow()",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "isBrowserWindow",
    "description": "<p>If global window object exists, and does not have boolean isJSDOM flag, this context may be browser or electron. Use isElectronWindow() to know the latter.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Window",
            "optional": true,
            "field": "iframeWindow",
            "description": "<p>iframe window reference.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import { isBrowserWindow } from 'reactium-core/sdk';\nisBrowserWindow();\n// Returns: true if executed in browser or electron.\n// Returns: false if executed on server.",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.isElectronWindow(iframeWindow)",
    "title": "Utils.isElectronWindow()",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "isElectronWindow",
    "description": "<p>Determine if window is an electron window. Useful for detecting electron usage.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Window",
            "optional": true,
            "field": "iframeWindow",
            "description": "<p>iframe window reference.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import { isElectronWindow } from 'reactium-core/sdk';\nisElectronWindow();\n// Returns: true if executed in electron.\n// Returns: false if executed in node or browser.",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.isServerWindow(iframeWindow)",
    "title": "Utils.isServerWindow()",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "isServerWindow",
    "description": "<p>If global window object exists, and has boolean isJSDOM flag, this context is a JSON window object (not in the browser or electron)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Window",
            "optional": true,
            "field": "iframeWindow",
            "description": "<p>iframe window reference.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import { isServerWindow } from 'reactium-core/sdk';\nisServerWindow();\n// Returns: true if executed in server SSR context.\n// Returns: false if executed in browser or electron.",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/index.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Zone.addComponent(component,capabilities,strict)",
    "title": "Zone.addComponent()",
    "name": "Zone.addComponent",
    "description": "<p>Register a component to a component zone.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "zone",
            "description": "<p>component object, determines what component renders in a zone, what order and additional properties to pass to the component.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "capabilities",
            "description": "<p>list of capabilities to check before adding component to zone. Can also be added as property of zone component object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "strict",
            "defaultValue": "true",
            "description": "<p>true to only add component if all capabilities are allowed, otherwise only one capability is necessary</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "plugin-example.js",
        "content": "import SomeComponent from './path/to/SomeComponent';\nimport Reactium from 'reactium-core/sdk';\n\nReactium.Plugin.register('myPlugin').then(() => {\n    // When the component is initialized, `<SomeComponent>` will render in\n    // `\"zone-1\"`\n    Reactium.Zone.addComponent({\n        // Required - Component to render. May also be a string, if the component\n        // has been registered with Reactium.Component.register().\n        // @type {Component|String}\n        component: SomeComponent,\n\n        // Required - One or more zones this component should render.\n        // @type {String|Array}\n        zone: ['zone-1'],\n\n        // By default components in zone are rendering in ascending order.\n        // @type {Number}\n        order: {{order}},\n\n        // [Optional] - additional search subpaths to use to find the component,\n        // if String provided for component property.\n        // @type {[type]}\n        //\n        // e.g. If component is a string 'TextInput', uncommenting the line below would\n        // look in components/common-ui/form/inputs and components/general to find\n        // the component 'TextInput'\n        // paths: ['common-ui/form/inputs', 'general']\n\n        // [Optional] - Additional params:\n        //\n        // Any arbitrary free-form additional properties you provide below, will be provided as params\n        // to the component when rendered.\n        //\n        // e.g. Below will be provided to the MyComponent, <MyComponent pageType={'home'} />\n        // These can also be used to help sort or filter components, or however you have your\n        // component use params.\n        // @type {Mixed}\n        // pageType: 'home',\n    })\n})",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.addFilter(zone,filter,order)",
    "title": "Zone.addFilter()",
    "name": "Zone.addFilter",
    "description": "<p>Add a component zone filter function, used to filter which components will appear in <code>&lt;Zone /&gt;</code> Returns unique id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone this filter will apply to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filter",
            "description": "<p>the filter function that will be passed each zone component object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>the priority your filter will take in list of filters in this zone</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "reactium-hooks.js",
        "content": "import Reactium from 'reactium-core/sdk';\n\nconst registerPlugin = async () => {\n    await Reactium.Plugin.register('MyVIPView');\n    const permitted = await Reactium.User.can(['vip.view']);\n\n    // Hide this component if current user shouldn't see vip components\n    const filter = component => {\n      return component.type !== 'vip' || !permitted\n    };\n\n    const id = Reactium.Zone.addFilter('zone-1', filter)\n}\nregisterPlugin();",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.addMapper(zone,mapper,order)",
    "title": "Zone.addMapper()",
    "name": "Zone.addMapper",
    "description": "<p>Add a component zone mapping function, used to augment the zone component object before passed to <code>&lt;Zone /&gt;</code>. Returns unique id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone this mapper will apply to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mapper",
            "description": "<p>the mapper function that will be passed each component object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>the priority your mapper will take in list of mappers in this zone</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nimport React from 'react';\nimport VIPBadge from './some/path/Vip';\n// for this zone, if component is of type \"vip\", add a VIPBage component to the component\n// components children property\nconst mapper = (component) => {\n    if (component.type === 'vip')\n    component.children = [\n        <VIPBadge />\n    ];\n    return component;\n};\nconst id = Reactium.Zone.addMapper('zone-1', mapper)",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.addSort(zone,sortBy,reverse,order)",
    "title": "Zone.addSort()",
    "name": "Zone.addSort",
    "description": "<p>Add a component zone sort critera, used to augment the zone component object before passed to <code>&lt;Zone /&gt;</code></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone this sort will apply to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sortBy",
            "defaultValue": "order",
            "description": "<p>zone component object property to sort the list of components by</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "reverse",
            "defaultValue": "false",
            "description": "<p>reverse sort order</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>the priority your sort will take in list of sorts in this zone</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\n\n// sort by zone component.type property\nReactium.Zone.addSort('zone-1', 'type')",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.getZoneComponent(zone,id)",
    "title": "Zone.getZoneComponent()",
    "name": "Zone.getZoneComponent",
    "description": "<p>Get the component from a zone by its id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone name to get components from</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the registered component, specified in the object passed to Zone.addComponent() or returned by it.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.getZoneComponents(zone,raw)",
    "title": "Zone.getZoneComponents()",
    "name": "Zone.getZoneComponents",
    "description": "<p>Get existing registrations for a zone, by default goes through mapping, sorting, filtering. Add raw=true to get unadulterated list, even if they may not be renderable in the Zone. Returns the object used in Zone.addComponent()</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone name to get components from</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "raw",
            "defaultValue": "false",
            "description": "<p>Set to true to get all components, whether or not they are currently filtered, and without mapping or extra sorting.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.hasZoneComponent(zone,id)",
    "title": "Zone.hasZoneComponent()",
    "name": "Zone.hasZoneComponent",
    "description": "<p>Returns true if component with id is present in the zone.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone name to get components from</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the registered component, specified in the object passed to Zone.addComponent() or returned by it.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.removeComponent(ID)",
    "title": "Zone.removeComponent()",
    "name": "Zone.removeComponent",
    "description": "<p>Removes a component added by <code>Zone.addComponent()</code> from a component zone by id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the unique component object id.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.removeFilter(id)",
    "title": "Zone.removeFilter()",
    "name": "Zone.removeFilter",
    "description": "<p>Remove filter functions for a component zone for this component.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the filter to remove</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Zone.removeFilter(filterId);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.removeMapper(id)",
    "title": "Zone.removeMapper()",
    "name": "Zone.removeMapper",
    "description": "<p>Remove mapping functions for a zone..</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the mapper to remove from the zone</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Zone.removeMapper(mapperId);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.removeSort(componentName,zone)",
    "title": "Zone.removeSort()",
    "name": "Zone.removeSort",
    "description": "<p>Remove sort critera for a component zone for this component. This should be called only: //   * @apiParam {String} zone the zone to remove this sort from</p>",
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Zone.removeSort('myPlugin', 'zone-1');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.subscribe(zone,cb)",
    "title": "Zone.subscribe()",
    "name": "Zone.subscribe",
    "description": "<p>Subscribe to components added, removed, or updated in a particular rendering zone. Returns an unsubscribe function. Call this function to unsubscribe from changes.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone to subscribe to</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>a function that will be called when a change occurs to zone.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "useZoneComponents.js",
        "content": "import Reactium from 'reactium-core/sdk';\nimport { useState, useEffect } from 'react';\n\nexport const useZoneComponents = zone => {\n    const [components, updateComponents] = useState(Reactium.Zone.getZoneComponents(zone));\n\n    useEffect(() => Reactium.Zone.subscribe(zone, zoneComponents => {\n        updateComponents(zoneComponents)\n    }), [zone]);\n\n    return components;\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.updateComponent(id,updatedComponent)",
    "title": "Zone.updateComponent()",
    "name": "Zone.updateComponent",
    "description": "<p>Register a component to a component zone.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the unique component object id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "updatedComponent",
            "description": "<p>updated zone component object, will be merged with existing.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Object",
    "url": "Registry",
    "title": "Registry",
    "group": "Reactium",
    "name": "Registry",
    "description": "<p>Reactium uses a number of registry objects used to registering all sorts of objects that will be used elsewhere in the framework. New registry objects are generally instanciated as singletons on the overall SDK.</p> <p>There are many registry objects attached by default to the SDK, and developers can create new ones using <code>Utils.registryFactory()</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "listById",
            "description": "<p>get Object keyed by id of most recent (or highest order) registered objects, filtering out unregistered or banned objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "list",
            "description": "<p>get list of most recent (or highest order) registered objects, filtering out unregistered or banned objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "registered",
            "description": "<p>get list of all historically registrated objects, even duplicates, ordered by order property of object (defaults to 100).</p>"
          },
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "protected",
            "description": "<p>get list of protected registrations ids</p>"
          },
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "unregistered",
            "description": "<p>get list of all existing registered objects ids that have been subsequently unregistered.</p>"
          },
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "banned",
            "description": "<p>get list of all banned objects ids.</p>"
          },
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "mode",
            "description": "<p>get current mode (Default Utils.Registry.MODES.HISTORY)</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "get",
            "description": "<p><code>reg.get(id,defaultValue)</code> pass the identifier of an object get that object from the registry. Optionally provide a default value if the id doesn't exist in the registry.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "isProtected",
            "description": "<p>pass the identifier of an object to see if it has been protected</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "isRegistered",
            "description": "<p>pass the identifier of an object to see if it has been registered</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "isUnRegistered",
            "description": "<p>pass the identifier of an object to see is NOT registered.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "isBanned",
            "description": "<p>pass the identifier of an object to see if it has been banned</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "ban",
            "description": "<p><code>reg.ban(id)</code> pass the identifier of an object to ban. Banned objects can not be registered and will not be show in list. Useful when you have code that needs to preempt the registration of an object from code you do not control. E.g. a plugin is introducing undesireable or disabled functionality</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "cleanup",
            "description": "<p><code>reg.cleanup(id)</code> pass the identifier of an object to be purged from historical registrations (i.e. free up memory) Automatically performed in mode Utils.Registry.CLEAN</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "protect",
            "description": "<p><code>reg.protect(id)</code> pass the identifier of an object to protect. Protected objects can not be overridden or cleaned up.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "register",
            "description": "<p><code>reg.register(id,data)</code> pass an identifier and a data object to register the object. The identifier will be added if it is not already registered (but protected) and not banned.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "unprotect",
            "description": "<p><code>reg.unprotect(id)</code> pass an identifier to unprotect an object</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "unregister",
            "description": "<p><code>reg.unregister(id)</code> pass an identifier to unregister an object. When in HISTORY mode (default), previous registration will be retained, but the object will not be listed. In CLEAN mode, the previous registrations will be removed, unless protected.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "flush",
            "description": "<p><code>reg.flush()</code> clear all registrations. Resets registry to newly constructed state.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "subscribe",
            "description": "<p><code>reg.subscribe(cb,id)</code> Adds a callback to indicate changes to the registry. Callback is called on register, unregister, protect, unprotect, ban, cleanup, and flush. Returns unsubscribe function.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "unsubscribe",
            "description": "<p><code>reg.unsubscribe(id)</code> unsubscribe a subscriber by id</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "unsubscribeAll",
            "description": "<p><code>reg.unsubscribeAll()</code> unsubscribe all subscribers to changes made on the registry</p>"
          }
        ],
        "register": [
          {
            "group": "register",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the data object to be registered</p>"
          },
          {
            "group": "register",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>the object to be registered</p>"
          }
        ],
        "subscribe": [
          {
            "group": "subscribe",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>Callback to be invoked on changes to the registry.</p>"
          },
          {
            "group": "subscribe",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>optional id of the callback, if you want to invoke unsubscribe manually by id, instead of the callback returned from subscribe method</p>"
          }
        ],
        "unsubscribe": [
          {
            "group": "unsubscribe",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the subscriber to unsubscribe</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/utils/registry.js",
    "groupTitle": "Reactium"
  },
  {
    "type": "RegisteredComponent",
    "url": "Zone",
    "title": "Zone",
    "version": "3.1.19",
    "name": "Zone",
    "description": "<p>Component used to identify a &quot;zone&quot; in your application where any arbitrary components will render. Plugin components registered for this zone will dynamically render in the zone. Plugins can be registered statically in Reactium by creating a <code>plugin.js</code> file that exports a component definition (<code>arcli plugin component</code> to generate boilerplate for one), or using the Reactium SDK <code>Reactium.Zone.addComponent()</code> call.</p> <p>See also the Zone SDK for filtering, sorting, or mapping over plugin components for a zone.</p> <p>To generate an exportable plugin module, use the <code>arcli plugin module</code> command.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>Identifier of the zone where plugin components will be rendered.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "passThrough",
            "defaultValue": "false",
            "description": "<p>When true, will provide a <code>components</code> property to children of Zone instead of rendering plugin components directly as siblings. This is useful when you wish to make plugin components available, but take more control over how they render.</p> <p>Example Passthrough Usage: Using the <code>jsx-parser</code> module, components could be provided to a JSXParser component, and the actual render of those components could be dictated by a string of JSX and data context provided by a CMS.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "...params",
            "description": "<p>any number of arbitrary parameters (variadic) can be provided to the Zone, and will be passed automatically as props on your plugin components when they are rendered.</p>"
          }
        ]
      }
    },
    "group": "Registered_Component",
    "examples": [
      {
        "title": "PageHeader.js",
        "content": "import React from 'react';\nimport { useHookComponent } from 'reactium-core/sdk';\n\n// PageHeader is not hard-coded, but adaptable by plugins\nexport default props => {\n    const Zone = useHookComponent('Zone');\n    return (\n        <div class='page-header'>\n            <Zone zone={'page-header'} />\n        </div>\n    );\n};",
        "type": "json"
      },
      {
        "title": "src/app/components/plugin-src/MyHeaderPlugin/index.js",
        "content": "import Reactium from 'reactium-core/sdk';\nimport MyHeaderWidget from './MyHeaderWidget';\n\nconst registerPlugin = async () => {\n    await Reactium.Plugin.register('MyHeaderPlugin');\n    Reactium.Zone.addComponent({\n        id: 'MyHeaderWidget',\n        zone: 'page-header',\n        component: MyHeaderWidget,\n    });\n};\nregisterPlugin();",
        "type": "json"
      },
      {
        "title": "src/app/components/plugin-src/MyHeaderPlugin/MyHeaderWidget.js",
        "content": "import React from 'react';\n\nexport default props => {\n   return (\n       <div class='my-header-widget'>\n           I will end up in the header zone\n       </div>\n   );\n};",
        "type": "json"
      }
    ],
    "filename": "node_modules/@atomic-reactor/reactium-sdk-core/lib/zone/Zone.js",
    "groupTitle": "Registered_Component"
  },
  {
    "type": "Function",
    "url": "__(text)",
    "title": "__()",
    "description": "<p>Wrap this around string literals to make them translateable with gettext Poedit utility. Run <code>arcli i18n</code> to extract strings to <code>src/reactium-translations/template.pot</code> by default.</p>",
    "name": "__",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "StringLiteral",
            "optional": false,
            "field": "text",
            "description": "<p>the text to be translated. Important: this should not be a variable. It must be a string literal, or <code>arcli i18n</code> command will not be able to locate the string. This string may not be an ES6 template literal.</p>"
          }
        ]
      }
    },
    "group": "Translation",
    "examples": [
      {
        "title": "Usage",
        "content": "import React from 'react';\nimport { __ } = 'reactium-core/sdk';\n\nexport default () => {\n    return (\n        <div>{__('My Translatable string.')}</div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/sdk/named-exports/i18n.js",
    "groupTitle": "Translation"
  },
  {
    "type": "Function",
    "url": "_n(singular,plural,count)",
    "title": "_n()",
    "description": "<p>Wrap this around string literals to make them translateable with gettext Poedit utility. Run <code>arcli i18n</code> to extract strings to <code>src/reactium-translations/template.pot</code> by default.</p>",
    "name": "_n",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "StringLiteral",
            "optional": false,
            "field": "singular",
            "description": "<p>the singular form text to be translated. Important: this should not be a variable. It must be a string literal, or <code>arcli i18n</code> command will not be able to locate the string. This string may not be an ES6 template literal.</p>"
          },
          {
            "group": "Parameter",
            "type": "StringLiteral",
            "optional": false,
            "field": "plural",
            "description": "<p>the plural form text to be translated. Important: this should not be a variable. It must be a string literal, or <code>arcli i18n</code> command will not be able to locate the string. This string may not be an ES6 template literal.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "count",
            "description": "<p>the number related to singular or plural string</p>"
          }
        ]
      }
    },
    "group": "Translation",
    "examples": [
      {
        "title": "Usage",
        "content": "import React from 'react';\nimport { _n } = 'reactium-core/sdk';\n\nexport default props => {\n    const count = props.count;\n    // singular / plural translation\n    const label = _n('%s thing', '%s things', count).replace('%s', count);\n    return (\n        <div>{label}</div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": ".core/sdk/named-exports/i18n.js",
    "groupTitle": "Translation"
  }
] });
