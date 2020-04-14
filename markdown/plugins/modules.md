# Plugin Module

Plugin modules are extensions to Reactium using the Reactium SDK, built as one or more stand-alone UMD (Universal Module Definition) javascript modules to be delivered to the Reactium CMS admin automatically on bootstrap.

The primary feature of a plugin module is that it will use the Reactium SDK
async `Reactium.Plugin.register()` to register itself when the module loads in the browser.

On bootstrap of the front-end Reactium framework, if this module is loaded in
the base html page immediately after `main.js` and `vendors~main.js` bundles, the
plugin will register itself with Reactium at plugin initialization.

At this point, you may register one or more hooks, provide Redux reducers / middleware, register React components, and more.

## Create

Create a Reactium plugin module with the command:

```bash
arcli plugin module
```

When prompted, provide the name of your module.

e.g. "Customer" module will yield boilerplate files:

```
src/app/components/plugin-src/customer
├── assets
│   └── style
│       └── customer-plugin.scss # src of your modules styles
├── index.js            # most of your code goes here
├── reactium-hooks.js   # local development binding
│                       # (uncommented for dev)
│
├── umd-config.json     # configuration used to generate your module
└── umd.js              # the entry point for generating your module
```

> Scaffold directory structure

## Development

When in development, uncomment the contents of your `reactium-hooks.js` like so:

```js
import Reactium from 'reactium-core/sdk';
Reactium.Hook.register(
    'plugin-dependencies',
    async () => {
        Reactium.Plugin.unregister('customer');

        // make your edits to index.js, not here
        require('./index');
    },
    Reactium.Enums.priority.highest,
);
```

This will unregister the current version of the plugin if present, and allow your local code to override.

## Ejecting

Ejecting the plugin is the process used to build your UMD module javascript and compile your css asset from sass (your plugin's front-end assets), and "publish" the production ready module assets to the back-end API module. Here these assets can be registered for delivery
through the API.

For example:

In the CMS backend, there may be a Customer plugin directory under:
`src/app/customer-plugin`

If this is the first time you have ejected the module, make sure the target directory exists and run:

```bash
$ arcli plugin eject

[ARCLI] > Choose plugin:
  1: customer
[ARCLI] > Target actinium plugin directory: cwd/../actinium/src/app/customer-plugin
[ARCLI] > This path does not have a label, provide one? (Y/N): y
[ARCLI] > Label for target directory: customer-plugin
[ARCLI] > No assets appear for plugin customer. Run build? (Y/N): y
```

Actinium plugin targets are added to your `~/.arcli/config.json`, and will be offered on subsequent ejections.

> ~/.arcli/config.json

```
{
  "actinium-plugins": {
    "customer-plugin": "/path/to/actinium/src/app/customer-plugin"
  }
}
```

After running the above ejection, the target directory of compiled js and css will look like so:

> Backend module target

```
actinium/src/app/customer-plugin
└── plugin-assets
    ├── customer-plugin.css
    └── customer.js
```

## Registering Module

To register your module assets in Actinium, in your node/express plugin module, you can register these assets to make them available for delivery to the browser through
the API.

> Backend customer-plugin.js module

```js
const PLUGIN = {
    ID: 'Customer',
    meta: {},
};

Actinium.Plugin.register(PLUGIN);

// you can also add a logo to appear in plugin manager
Actinium.Plugin.addLogo(
    PLUGIN.ID,
    path.resolve(__dirname, 'plugin-assets/customer.svg'),
);

Actinium.Plugin.addScript(
    PLUGIN.ID,
    path.resolve(__dirname, 'plugin-assets/customer.js'),
);

Actinium.Plugin.addStylesheet(
    PLUGIN.ID,
    path.resolve(__dirname, 'plugin-assets/customer-plugin.css'),
);
```

## Portable CSS Assets

If your plugin module requires images or fonts, you generate a sass partial containing encoded inline assets in a SASS map data structure, by creating a `plugin-assets.json` with keys and relative paths to assets.

In the same directory, Reactium will automatically create a
`_plugin-assets.scss` partial containing a map of the encoded inline assets.

```
src/app/components/plugin-src/customer
├── assets
│   ├── images
│   │   └── bg-image.jpg # the asset I wish to port
│   └── style
│       ├── _plugin-assets.scss
│       ├── customer-plugin.scss
│       └── plugin-assets.json # where I wish _plugin-assets.scss to exist
├── index.js
├── reactium-hooks.js
├── umd-config.json
└── umd.js
```

> Example plugin-assets.json

```json
{
    "bg-image": "../images/bg-image.jpg"
}
```

> Resulting partial \_plugin-assets.scss

```scss
// Generated Data URLs from plugin-assets.json
$assets: (
    'bg-image':
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gxYSUNDX1BST0...',
);
```

Do not modify the partial directly.

Import inline assets into your plugin module's scss file:

> custom-plugin.scss

```scss
@import './plugin-assets';

body {
    background: url(#{map-get($assets, bg-image)});
}
```

In this way, you will not need to worry about the pathing
on your css assets packaged with your module, for example if the css file is published to a CDN.

## Javascript Dependencies

Some framework dependencies are available for import into your plugin module by default, and will be made available to your module from the framework automatically.

A complete and current manifest of these import externals are available in `.core/reactium-config.js` in the `defaultLibraryExternals` constant. To add external dependency configuration in your application to core, implement a `manifest.config.override.js` file in root of your project and modify the `pluginExternals` property:

> manifest.config.override.js

```js
module.exports = manifest => {
    // to add react-spring as a dependency
    // npm install --save react-spring
    manifest.pluginExternals['react-spring'] = {
        externalName: 'react-spring',
        requirePath: 'react-spring',
    };

    return manifest;
};
```

You can also customize the webpack configuration used to generate your plugin module for advanced users.

To do so, implement `umd.webpack.override.js` in the root of your project to provide customized configuration per module. Some
simple setting can be conveniently changed in the `umd-config.js` of your module.

By default, dependencies that are not externalized will be included in your UMD module bundle (may be inefficient / duplicate).

> umd.webpack.override.js

```js
// umdConfig {Object} Contains configuration for each module, providing enough context
// for your webpack config modifications.
// - entry - entry path used for webpack configuration for this module
// - libraryName - can be changed earlier in umd-config.json adjacent to umd.js
// - outputPath - can be changed earlier in umd-config.json (libraryName by default)
// - outputFile - can be changed earlier in umd-config.json (${libraryName}.js by default)
// - externals - external dependency patterns used to generate webpack config
//               can be changed in umd-config.json (externalName properties from manifest config pluginExternals)
// - globalObject - where externals can be found, default 'window'. can be changed in umd-config.json ('this' for service workers)
// - babelPresetEnv - true to use env-preset to include core-js polyfills. can be changed in umd-config.json (true by default)
//
// webpackConfig {Object} return this object as the webpack configuration for the module
module.exports = (umdConfig, webpackConfig) => {
    if (umdConfig.libraryName === 'some-library-name') {
        // modify or replace webpackConfig here
        return webpackConfig;
    }

    return webpackConfig;
};
```
