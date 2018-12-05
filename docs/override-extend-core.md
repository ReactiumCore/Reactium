# Overriding Core

Reactium is built on a core framework. The local development and build configuration
that comes out of the box is meant to be upgradeable, so long as your application was
built off a semver that is minor-version compatible with the current.

Even for larger version steps, we are going to attempt to describe (or automate) much
of the migration from one version of Reactium core to another.

Upgrading core is performed with the CLI, btw:

```sh
$ arcli reactium update
```

With a number of other front-end frameworks, even those based on React, the philosophy is to entirely hide the local development/build configuration from the developer, sometimes with an **eject** feature to get raw configuration / build files.

Our philosophy is to create a strong opinion for building a React application, from application structure, to out of the box capabilities such as routing, plugins, and redux state management, while giving the code maintainer, lead-dev, and ops roles on your team the power to replace, augment, or override behaviors of the build.

## Hacking Core

Should you hack core? Short answer is no.

If you hack on the files in the **.core** directory of your project, those changes potentially make your app incompatible with future versions of the framework, and may prevent you from making simple updates. We don't recommend doing this unless you absolutely have to. If you have a good idea for a general purpose patch to .core, please fork Reactium on github and send us a pull-request. We'll either add your update if appropriate, or give you an alternative that does not require hacking on .core.

That being said, there are a number of build and development overrides built-in to core for your use.

## Override Files

There are a handful of files, that, if they exist in your app's root directory, will automatically be used by core for your build process.

| File (Where)                | Description (How)                                                                                                                                                     | Overrides (What)                                                         | Reason (Why)                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| gulp.config.override.js     | Exports a function that takes core gulp configuration object as a parameter, and returns configuration object used by gulp tasks (and in some cases also by webpack.) | Object returned by .core/gulp.config.js                                  | Need to change build src/dest. Local port config.                                        |
| gulp.tasks.override.js      | Exports a function that takes an object defining core gulp tasks as a parameter, and returns and object whose properties define the tasks run by gulp                 | Gulp tasks defined by .core/gulp.tasks.js                                | Add pre or post build tasks. Replace built in tasks.                                     |
| manifest.config.override.js | Exports a function that takes configuration the manifest-tools use to build src/manifest.js as a parameter, and returns new manifest configuration.                   | Configuration specified by manifest property of .core/reactium-config.js | Add new application dependencies to dependency module. Add new component search context. |
| webpack.override.js         | Exports a function that takes the core webpack configuration as a parameter, and returns an object that will be used for webpack to build the js bundle.              | Configuration object specified by .core/webpack.config.js                | You hate yourself.                                                                       |
| babel.config.js             | **(Required)** Imports babel configuration and exports the configuration used by webpack and babel-node.                                                              | Babel configuration specified by .core/babel.config.js                   | Add babel presets / plugins                                                              |
