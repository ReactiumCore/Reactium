# Design System

A design system unites product teams around a common visual language. It reduces design debt, accelerates the design process, and builds bridges between teams working in concert to bring products to life.

![alt text](https://image.ibb.co/fzm3po/design_systems.png "A UI audit collects the many permutations of simple UI elements to illustrate how deep in design debt your team is.")

Reactium comes shipped with the ability to create a Design System of your application elements and components. Simply fire up the local instance and navigate to `http://localhost:3030/toolkit` to view the default elements.


# Atomic Design
Reactium follows the Atomic Design paradigm as outlined by [Brad Frost.](http://bradfrost.com/blog/post/atomic-web-design/)

There are five distinct levels in atomic design:
1. [Atoms](#atoms)
2. [Molecules](#molecules)
3. [Organisms](#organisms)
4. [Templates](templates)
5. [Pages](#pages)

### Atoms
Applied to web interfaces, atoms are our HTML tags, such as a form label, input, or a button.

### Molecules
Molecules are groups of atoms bonded together and are the smallest fundamental units of a compound. A search form maybe a good example of a molecule.

### Organisms
Organisms are groups of molecules joined together to form a relatively complex, distinct section of an interface. A header or mega-nav would be considered an Organism.

### Templates
Templates consist mostly of groups of organisms stitched together to form pages.

### Pages
Pages are specific instances of templates. Here, placeholder content is replaced with real representative content to give an accurate depiction of what a user will ultimately see.


# Creating Elements
Using the [Atomic Reactor CLI](https://www.npmjs.com/package/atomic-reactor-cli) you can easily add new elements and menu items to the Design System.
```
arcli re:kit atom
```

You will be prompted to input the required options if no flags are passed.

> `arcli re:kit --help` for a list of possible flags

```
Usage: re:kit <type> [options]

  Generate Design System element <type> atom | molecule | organism | catalyst | page | template | group | style

  Options:

    --id <id>                    the id of the element.
    -n, --name <name>            the display name of the element.
    -g, --group <group>          the menu group id.
    -i, --index [index]          the menu order index.
    -o, --overwrite [overwrite]  overwrite if the element already exists.
    -h, --hidden [hidden]        whether to display the element in the menu.
    -s, --style [style]          whether to include a .scss file.
    -h, --help                   output usage information.

```


# Adding a Theme
Reactium Design System allows for quick switching of themes. Adding a new theme is simple:
```
arcli re:theme
```

You will be prompted to input the required options if no flags are passed.

```
Usage: re:theme [options]

  Create, remove, or update a Design System theme <action>: add | remove | update

  Options:

    -i, --index [index]        the menu order index.
    -n, --name <name>          the display name of the theme.
    -f, --file <file>          the path to the theme style sheet relative to the `src` directory. Example: /assets/style/style.scss
    -s, --selected [selected]  designate the theme as the default.
    -h, --help                 output usage information
```

# Customizing the Design System
Knowing that the Design System can be used to express a brand vision, there are a few areas where it can be customized by editing the `~/src/app/toolkit/manifest.js` file.

> __Beware:__ editing the Design System manifest.js file is risky business and should be done with care. It's recommended to backup or commit the working copy of your manifest.js before editing.

## Custom Header
You can change the log, title, and version of the toolkit by editing the `header` properties:

```js
module.exports = {
    "header": {
        "logo"    : "/assets/images/atomic-reactor-logo.svg",
        "title"   : "Style Guide",
        "version" : "ver 2.0.1"
    },
    ...
};
```

## Custom Overview
The Overview page is displayed when you navigate to the `http://localhost:3030/toolkit` page.
You can customize it by either replacing the `required()` component or editing the default overview component located at `~/src/app/toolkit/overview/index.js`.

```js
module.exports = {
    "overview": require('appdir/toolkit/overview').default,
    ...
};
```
