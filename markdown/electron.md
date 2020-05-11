# Electron

Out of the box, Reactium comes with the ability to build a basic Electron app.

## Getting Started

Install the necessary tools:

```
$ npm install -g @atomic-reactor/cli
$ npm install -g electron
$ npm install -g gulp
```

Next you'll need to configure Reactium to run Electron by applying some overrides.

#### Gulp Config Overrides

Open the `~/gulp.config.override.js` file and apply the following overrides:

```js
module.exports = config => {
    // Electron configuration
    config.dest.electron = 'build-electron';
    config.dest.static = 'build-electron/app/public';
    config.electron = {
        config: {
            width: 1280,
            height: 1024,
            show: false,
            title: 'App Title',
            backgroundColor: '#000000',
        },
    };

    // Disable auto launch of default browser
    config.open = false;

    return config;
};
```

> _You can apply custom Electron configuration in the `config.electron.config` object._

#### Build the App

From the project root run the following:

```
$ arcli electron-build
```

You should now have a directory in the project root called `build-electron` _(if you haven't changed the name in the gulp config overrides)_. You're free to edit the package.json and add new resources like a different icon or make changes to the Electron setup via the `~/build-electron/main.js` file.

> _**Note:**_ If a file is protected or generated via the `electron-build` command, it will have a loud header telling you so :)

#### App Icon

The app icon can be changed by supplying a new `~/build-electron/resources/icon.png` and `~/build-electron/resources/icon.ico`.

The `icon.png` must be a valid .png file with dimensions of 1024 X 1024 pixels.

#### Run the App for Local Development

```
$ arcli electron-run
```

When prompted, just roll with the default values if you haven't changed them in the gulp config.

> **Alternatively:** _You can run and skip the prompts:_

```
$ arcli electron-run -e cwd/build-electron -u cwd
```

## Build for Distribution

Build the app and change directory to the `build-electron` directory:

```
$ arcli electron-build
$ cd build-electron
```

Test for production:

```
$ npm start
```

Run the dist command:

```
$ npm run dist
```

You should now have a `release` directory inside the `build-electron` directory.
