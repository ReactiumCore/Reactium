![](https://image.ibb.co/ee2WaG/atomic_reactor.png)
# Reactium

A framework for creating React + Redux apps.

## Domain Driven Design
Reactium follows the Domain Drive Design and aims to ease the creation of complex applications by connecting the related pieces of the software into an ever-evolving model.

DDD focuses on three core principles:
* Focus on the core domain and domain logic.
* Base complex designs on models of the domain.
* Constantly collaborate with domain experts, in order to improve the application model and resolve any emerging domain-related issues.

### Advantages of DDD
* **Eases Communication:** With an early emphasis on establishing a common and ubiquitous language related to the domain model of the project, teams will often find communication throughout the entire development life cycle to be much easier. Typically, DDD will require less technical jargon when discussing aspects of the application, since the ubiquitous language established early on will likely define simpler terms to refer to those more technical aspects.
* **Improves Flexibility:** Since DDD is based around modularity, nearly everything within the domain model will be based on an object and will, therefore, be quite encapsulated. This allows for various components, or even the entire system as a whole, to be altered and improved on a regular, continuous basis.
* **Emphasizes Domain Over Interface:** Since DDD is the practice of building around the concepts of domain and what the domain experts within the project advise, DDD will often produce applications that are accurately suited for and representative of the domain at hand, as opposed to those applications which emphasize the UI/UX first and foremost. While an obvious balance is required, the focus on domain means that a DDD approach can produce a product that resonates well with the audience associated with that domain.

### Disadvantages
* **Requires Robust Domain Expertise:** Even with the most technically proficient minds working on development, it’s all for naught if there isn’t at least one domain expert on the team that knows the exact ins and outs of the subject area on which the application is intended to apply. In some cases, domain-driven design may require the integration of one or more outside team members who can act as domain experts throughout the development life cycle.
* **Encourages Iterative Practices:** While many would consider this an advantage, it cannot be denied that DDD practices strongly rely on constant iteration and continuous integration in order to build a malleable project that can adjust itself when necessary. Some organizations may have trouble with these practices, particularly if their past experience is largely tied to less-flexible development models, such as the waterfall model or the like.


# Quick Start

From your project directory:
```
$ npm run launch
```

# Development Guide
The intent behind the Reactium Framework is to get you quickly creating React components and applications.
With that in mind, we geared the tooling towards automation and ease of use.


## Components
There are 3 types of components you can create:
* [Functional Components](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#functional-components)
* [Class Components](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#class-components)
* [Redux Class Components](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#redux-class-components)

### Functional Components
Create a Functional Component if your component will not need to worry about application state or events. Functional components accept a single `props` argument and should be very clear and concise in their make-up.
```js
const Hello = (props) => {
    return (
        <div>
          <h1>Hey {props.name}!</h1>
        </div>;
    );
}
```
> The functional style components are nice and simple for purely presentational pieces.

### Class Components
Create a Class Component if your component will need the React Life Cycle Methods or internal state management.
```js
import React, { Component } from 'react';

class Hello extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.props});
  }

  componentDidMount() {
    console.log("Mounted Hello Component");
  }

  render() {
    return (
        <div>
          <h1>Hey {this.state.name}!</h1>
        </div>
    );
  }
}

Hello.defaultProps = {
  name: "Bob"
};

export default Hello;
```

### Redux Class Components
Create a Redux Class Component if your component will need to interact with the application state.
Redux Class Components work just like Class Components accept you will need to map state to properties and map dispatchers to actions via the [react-redux](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) `connect` method.

```js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'appdir/app';

// Map state to properties
const mapStateToProps = (state, props) => {
    return Object.assign({}, state['Test'], props);
};

// Map dispatchers to actions
const mapDispatchToProps = (dispatch, props) => ({
    test: {
        click: () => dispatch(actions.Test.click()),
    }
});

class Test extends Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState((prevState) => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    // Use the above mapped click dispatcher on button click
    onClick() {
        this.props.test.click();
    }

    render() {
        return (
            <div>
                <div>{this.state.msg}</div>
                <button type="button" onClick={this.onClick.bind(this)}>
                    Click Me
                </button>
                <div>{this.state.count || 0}</div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
```

## Component Architecture
Reactium component architecture is pretty simple when it comes to a function or class component.
1. Create the component domain in the `~/src/app/components` directory.
2. Create an `index.js` file with your component code.

When it comes to a Redux Class Component the following architecture is applied:

| File | Description |
|:----|:----|
| [actions.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-actionsjs-file) | List of action functions. See [Redux Actions](https://redux.js.org/docs/basics/Actions.html). Redux [Super Thunk actions](https://github.com/Atomic-Reactor/redux-super-thunk), based on the (https://github.com/gaearon/redux-thunk), are automatically supported. |
| [actionTypes.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-actiontypesjs-file) | List of action filters. See [Redux Actions](https://redux.js.org/docs/basics/Actions.html). |
| [index.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-indexjs-file) | Main component class. |
| [reducers.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-reducersjs-file) | Action handlers. See [Redux Reducers](https://redux.js.org/docs/basics/Reducers.html). |
| [route.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-routejs-file) | Route handler for the component. |
| [services.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-servicesjs-file) | Ajax requests associated with the component. |
| [state.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-statejs-file) | The default state of the component. |

> Don't worry, there's a CLI command that automates component creation.

> **Note:** You will need to restart the build after creating a new component with state, reducers, actions, actionTypes, etc.

### The actions.js File

Reactium aggregates all `action.js` files into the `actions` export of the `app.js` file.

A typical `actions.js` file may look like this:

```js
import { actionTypes } from 'appdir/app';

export default {
    mount: params => (dispatch) => {
        dispatch({type: actionTypes.TEST_MOUNT, data: params});
    },

    click: () => (dispatch) => {
        dispatch({type: actionTypes.TEST_CLICK});
    },
};
```

To access the actions simply import the actions:
```
import { actions } from 'appdir/app';
```

Then use an action by targeting the component domain that created the action:
```js
...
actions.Test.mount({some: "params"});
```

> Q: What's this `appdir` thing all about?

> A: `appdir` is a constant defined in the Webpack configuration that references the `~/src/app` directory. It helps clarify where you're importing something from by eliminating the need to do something like:
> `import { something } from '../../../components/SomeOtherComponent'`.


### The actionTypes.js File
Reactium aggregates all `actionTypes.js` files in the `actionTypes` export of the `app.js` file.

A typical `actionTypes.js` file may look like this:
```js
export default {
    TEST_MOUNT: 'TEST_MOUNT',
    TEST_CLICK: 'TEST_CLICK',
};
```

To access the actionTypes, import them into your component:
```js
import { actionTypes } from 'appdir/app';
```

Usage:
```js
...
dispatch({type: actionTypes.TEST_MOUNT, data: data});
```

### The index.js File
See [Redux Class Components](https://github.com/Atomic-Reactor/Reactium#redux-class-components).

### The reducers.js File
Reactium aggregates all `reducers.js` files into the Redux store using the [react-redux](https://github.com/reactjs/react-redux/tree/master/docs) `combineReducers` method.

A typical `reducers.js` file may look like this:
```js
import { actionTypes } from 'appdir/app';

export default (state = {}, action) => {

    let newState;

    switch (action.type) {

        case actionTypes.TEST_MOUNT:

            newState = Object.assign({}, state, {...action.data});
            return newState;
            break;

        case actionTypes.TEST_CLICK:

            let count = state.count || 0;
            newState = Object.assign({}, state, {count: count + 1});
            return newState;
            break;

        default:
            return state;
    }
};
```

### The route.js File
Reactium aggregates all `route.js` files into a list of routes used to render React Router [`<Route />` components](https://reacttraining.com/react-router/web/api/Route) and observed by the the Reactium `RouteObserver` component.

A route can have any property that is supported by [`<Route />`](https://reacttraining.com/react-router/web/api/Route) (e.g. `path`, `exact`, `strict`, `location`, `component`, `render`, and `children`).

A typical `route.js` file in `MyComponent` may look like this:
```js
// Import your component
import MyComponent from './index';

// Import the aggregated actions (optional)
import { actions } from 'appdir/app';

export default {
    // Make this higher number to have route evaluated later (default 0)
    order: 0,

    // Route pattern that should route to
    path: '/my-component/:paramA/:paramB',

    // Should the Route be exact?
    exact: true,

    // the component to load for this route
    component: MyComponent,

    // (optional) a Redux thunk action to load data for this component
    load: params => actions.MyComponent.mount(params),
};
```

In addition to [`<Route />`](https://reacttraining.com/react-router/web/api/Route) properties, you can also provide a [Redux thunk](https://github.com/gaearon/redux-thunk) action function to the `load` property. The Reactium `RouteObserver` component will automatically dispatch your `load` thunk, passing along route parameters. Use this for asynchronous loading of data on observed route changes.

#### Multi-route Modules
You can also support multiple routes for a module, in one of two methods:
1. provide multiple paths for a single route
```js
import MyComponent from './index';
import { actions } from 'appdir/app';

export default {
    // both of these will resolve to this component
    path: ['/first/path', '/second/path'],
    exact: true,
    component: MyComponent,
};
```
2. provide multiple route objects
```js
import MyComponent from './index';
import { actions } from 'appdir/app';

// export an array of routes
export default [
    {
        order: 1,
        path: '/base-route',
        exact: true,
        component: MyComponent,
        load: params => actions.MyComponent(params)
    },
    {
        order: 0,
        path: '/base-route/:param',
        exact: true,
        component: MyComponent,
        load: params => actions.MyComponent(params)
    },
];
```

### The services.js File
Reactium aggregates all `services.js` files into the `services` export of the `app.js` file.

A typical `services.js` file may look like this:
```js
import axios from 'axios';
import { restHeaders } from "appdir/app";

const restAPI = 'http://demo3914762.mockable.io';

const fetchHello = () => {
    let hdr = restHeaders();
    return axios.get(`${restAPI}/hello`, {headers: hdr}).then(({data}) => data);
};

const fetchGoodBye = () => {
    let hdr = restHeaders();
    return axios.get(`${restAPI}/goodbye`, {headers: hdr}).then(({data}) => data);
};

export default {
    fetchHello,
    fetchGoodBye,
}
```

In your actions.js file you would do something like:
```
import { actionTypes } from 'appdir/app';
import { services } from 'appdir/app';

export default {
    mount: params => (dispatch) => {
        services.Test.fetchHello().then((data) => {
            dispatch({type: actionTypes.TEST_MOUNT, data: data});
        });
    },
}
```

> Reactium uses [axios](https://www.npmjs.com/package/axios) to make XMLHttpRequests from the browser. You can swap that out with whatever you want.

To access the services, import them into your component:
```js
import { services } from 'appdir/app';
```

Usage:
```js
...
services.Test.fetchHello().then((result) => {
    // Do something with the result
});
```


### The state.js File
Reactium aggregates all `state.js` files into the Redux `store` for the application.

A typical `state.js` file may look like this:

```js
export default {
    some: "value",
    another: 1,
};
```

## Creating Components


1. Before creating a component, grab the [Atomic Reactor CLI](https://github.com/Atomic-Reactor/CLI):
```
$ npm i -g atomic-reactor-cli
```

2. Change directory into your project:
```
$ cd /MyAwesome/Project
```

3. Input the new component command:
```
$ arcli re:gen class --open
```

Flags:
```
    -n, --name <name>            The name of the component.
    -o, --overwrite [overwrite]  Overwrite if the component already exists.
    -p, --path [path]            Absolute path to where the component is created. Default ~/src/app/components.
    -c, --component [component]  The parent component when creating a child component.
    -r, --route [route]          The route to associate with the component.
    --open [open]                Open the new file(s) in the default application.
    --no-actions [actions]       Exclude the actions.js file.
    --no-types [types]           Exclude the actionsTypes.js file.
    --no-reducers [reducers]     Exclude the reducers.js file.
    --no-services [services]     Exclude the services.js file.
    --no-router [router]         Exclude the route.js file.
    --no-state [state]           Exclude the state.js file.
    -h, --help                   Output usage information.
```


4. Follow the prompts:
* Name: The name of the component that you wish to create.
* Route: If you're building a `Single Page App` (SPA) and your new component uses the Router class, you'll want to specify the `route` that will navigate to this component.
* Use Redux?: Determines if your new component's state will be managed by [Redux](redux.js.org).

![](https://image.ibb.co/iE8y4b/new_component_class.png)


## Using Components
Now that you've created your first component, it's time to use it.
Open the `~/src/index.html` file and add the component to the layout using the custom element `<Component />`.

```html
<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Reactium</title>
        <meta name="description" content="A framework for creating React + Redux apps using the domain driven design (DDD) paradigm.">
        <link rel="stylesheet" href="/assets/style/style.css">
    </head>
    <body>
        <Component type="Fubar"></Component>
        <script src="/assets/js/main.js"></script>
    </body>
</html>
```

> Alternatively, you can just start using the component in your app like you would any other React component.

Reactium will now scan your markup for the `<Component />` tags and bind the specified `type` to the element.
You can pass initial state to the component via attributes but that's not necessary if you're using Redux for state management.


## The Build Process
![](https://image.ibb.co/jeddNw/reactium_build_process_2.png)

Reactium uses the combination of [Gulp](https://gulpjs.com/), [Webpack 3](https://webpack.js.org/), & [Browsersync](https://browsersync.io/) to build and run the development environment.
> You might ask: Why not use just Webpack or just Gulp?

We identified 4 major requirements for our workflow:
1. [Bundling and transpiling Javascript](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#bundling-and-transpiling-javascript).
2. [Moving assets from one location to another](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#moving-assets).
3. [Sass compilation and optimization](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#sass-compilation-and-optimization).
4. [Hot reload of the development environment](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#hot-reloading).

#### Bundling and Transpiling Javascript
Without a doubt we felt that Webpack was the best solution for this requirement. The deciding factor was Webpack's dependency handling and tree shaking (removing unused modules).

#### Moving Assets
Gulp provides a frictionless and very simple pattern for moving assets. The deciding factor was Gulp's ability to transport multiple file types to multiple destinations with very little setup or additional libraries or configuration.

#### Sass Compilation and Optimization
Gulp's ability to compile Sass is pretty straight forward and doesn't require a lot of configuration. We found that with Webpack, this wasn't obviously clear and took a lot of configuration to get the right set up. Webpack also restricts the delivery of the compiled style sheet to a single destination, making it hard to save the file to multiple directories if needed.

#### Hot Reloading
Browsersync offers a large variety of simple configurations that allows you to serve the development environment locally. The deciding factor was Browsersync's ability to serve from a proxy instead of the application directory. This could come in handy if you need to run a node instance as well as your application within your development environment.

## The Gulp Config
Source paths and destinations should be managed in the `gulp.config.js` file, giving you a single place to alter build behaviors without directly altering Gulp Tasks.

### spa
Determines if this is a Single Page App or not.
If set to `true` all .html routes will be redirected to `index.html`.
If set to a valid url string, routes will be redirected to the specified url.

_**Default:**_ `false`

### env
The environment type: development/production.

_**Default:**_ `development`

### entries
List of files that will be bundled and transpiled by Webpack.

_**Default:**_ `src/app/*.js`

> Top level .js files in the `~/src/app` directory


### browsers
Babel browser support when transpiling.

_**Default:**_ `last 1 version`

> The previous and current version of all major browsers.


### port
List or ports used when running the development environment.

* **port.browsersync:** The port to run Browsersync on. **Default:** `3030`

> If you're running a proxy with Browsersync, you will want to define the port the proxy runs on, then reference it in your serve task.


### cssPreProcessor
Determines which CSS pre-processor to use. Valid values: sass/less.

_**Default:**_ `sass`


### src
List of source locations for the default build task.

* **src.js:** The source location of js files.
* **src.markup:** The source location of html files.
* **src.style:** The source location of .scss or .less files.
* **src.assets:** The source location of asset files such as images, web fonts and other support files.
* **src.includes:** The node modules location that gets included by Webpack. **Default:** `./node_modules`.
* **src.appdir:** The path to the application that gets defined for global usage by Webpack. **Default:** `~/src/app`.
* **src.rootdir:** The root application path that gets defined for global usage by Webpack. **Default:** `~`.

> You can define more source locations and use them for your own tasks.


### watch
List of watch locations for the default defined Gulp tasks.

* **watch.js:** The locations to watch for js file changes.
* **watch.markup:** The locations to watch for html file changes.
* **watch.style:** The locations to watch for `.scss` or `.less` file changes.
* **watch.assets:** The locations to watch for asset files such as images, web fonts, and other support files.

> You can define more watch locations and use them for your own tasks.


### dest
Destination paths for the default defined Gulp tasks.


## The Webpack Config
Reactium only uses Webpack for bundling and transpiling javascript. If you need it to do more, the `webpack.config.js` file is the place to do it.

> The Webpack config receives the [Gulp Config](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-gulp-config) as an argument.


## Gulp Tasks
By default, the following Gulp Tasks are defined:

### scripts
Compiles javascript using Webpack. If `config.env` is `production`, the output files are optimized and minified.

### styles
Compiles `.scss` files into `.css` files by default. If `config.env` is `production`, the output files are optimized and minified.

You can switch this to `.less` by specifying 'less' as the Gulp Config `cssPreProcessor` value.

### assets
Transports asset files such as images, web fonts, and other support files to their corresponding location.

### markup
Transports html files to their corresponding location.

### clean
Removes all files from the `config.dest.dist` directory.

### serve
Runs the development environment via Browsersync.

### build
Runs the `clean`, `assets`, `markup`, `scripts`, and `styles` tasks.

### default
If the `config.env` is `development`, the `build` task is run followed by the `serve`. Otherwise, the `build` task is run.

## Gulp Watch
When the `serve` task is run, the following watches are started:

### style changes
When changes to the `config.watch.style` files are detected, the `styles` task is run.
> Browsersync does a hot reload of the style sheet.

### script changes
When changes to the `config.watch.js` files are detected, the `scripts` task is run.
> Browsersync does a full reload of the page.

### markup changes
When changes to the `config.watch.markup` files are detected, the `markup` task is run.
> Browsersync does a full reload of the page.

### asset changes
When changes to the `config.watch.assets` files are detected, the `assets` task is run.
> Browsersync does a full reload of the page.
