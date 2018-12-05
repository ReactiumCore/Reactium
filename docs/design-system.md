# Design System

A design system unites product teams around a common visual language. It reduces design debt, accelerates the design process, and builds bridges between teams working in concert to bring products to life.

Reactium ships with the ability to create a Design System for your application elements and components.

Simply fire up the local instance `$ npm run local` and navigate to `http://localhost:3030/toolkit` to view the default elements.

# Atomic Design

Reactium follows the Atomic Design paradigm as outlined by [Brad Frost.](http://bradfrost.com/blog/post/atomic-web-design/)

There are 4 distinct levels in atomic design:

1.  [Atoms](#atoms)
2.  [Molecules](#molecules)
3.  [Organisms](#organisms)
4.  [Templates](templates)

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
$ arcli element create
```

You will be prompted to input the required options if no flags are passed.

```
Usage: element <action> [options]
Manage toolkit elements. Available actions: create | updated | remove.

Options:
  -o, --overwrite [overwrite]      Overwrite existing element.
  -i, --id [id]                    The element ID.
  --name [name]                    The element name.
  --group [group]                  The menu group to add the element to.
  --label [label]                  The menu link text.
  --menu-order [menuOrder]         The menu link index.
  --stylesheet [stylesheet]        Add a stylesheet.
  --documentation [documentation]  Show readme.
  --code [code]                    Show Code view.
  --dna [dna]                      Show DNA info.
  -h, --help                       output usage information
```

# Adding a Theme

Reactium Design System allows for quick switching of themes. Adding a new theme is simple:

```
$ arcli theme
```

You will be prompted to input the required options if no flags are passed.

```
Options:
  -n, --name [name]              Theme Name.
  -s, --stylesheet [stylesheet]  Theme stylesheet.
  -a, --active [active]          Activate the theme.
  -i, --inactive [inactive]      Deactivate the theme.
  -m, --menu-order [menuOrder]   Theme menu order index.
  -N, --new-name [newName]       Rename to.
  -h, --help                     Output usage information.
```

# Customizing the Design System

Knowing that the Design System can be used to express a brand vision, there are a few areas where it can be customized by editing the `~/src/app/toolkit/index.js` file.

> **Beware:** editing the Design System manifest.js file is risky business and should be done with care. It's recommended to backup or commit the working copy of your manifest.js before editing.

## Custom Header

You can change the log, title, and version of the toolkit by editing the `header` properties:

```js
module.exports = {
    ...
    "header": {
        "logo"    : "/assets/images/atomic-reactor-logo.svg",
        "title"   : "Style Guide",
        "version" : "ver 2.0.1"
    },
    ...
};
```

## Customizing the Menu

You can customize the Design System Menu by adding new element groups.

```
$ arcli group create
```

You will be prompted to input the required options if no flags are passed.

```
-o, --overwrite [overwrite]  Overwrite existing group. Beware this will remove all children of the group.
-i, --id [id]                The group ID.
-l, --label [label]          Menu Text.
--menu-order [menuOrder]     Menu order.
-h, --help                   Output usage information
```

## Custom Overview

The Overview page is displayed when you navigate to the `http://localhost:3030/toolkit` page.
You can customize it by either replacing the `required` component or editing the default overview component located at `~/src/app/toolkit/overview/index.js`.

```javascript
module.exports = {
    ...
    "overview": require('appdir/toolkit/overview').default,
    ...
};
```
