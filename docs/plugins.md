# Plugin API

Reactium comes with the built-in concept of **plugins.** Plugins are React components
that will be rendered automatically through-out your application when you place plugins **zones**.

Plugins are a helpful pattern for when you do not want to hard-code the composition of your component, often because you can't or shouldn't update the parent component manually, or you want to provide dynamic composition (not just data).

For example, I have an admin UI that specifies a generic layout with a **navigation** zone, a **footer** zone, a content **zone**, and a **sidebar** zone.

```js
import React from 'react';

export default class Template extends React {
    render() {
        return (
            <main>
                <section className='navigation' />

                <section className='content'>{this.props.children}</section>

                <aside className='sidebar' />

                <section className='footer' />
            </main>
        );
    }
}
```

Great, now I have a template that I can use to create a page, and I can pass the children components for the content zone. But wait, what if I want to load different components into the **navigation**, **sidebar**, or **footer** zones.

Well, maybe I'll conditionally load different navigation, different sidebar content, etc. No problem, except anyone who has done this has seen a template component like this get out of hand.

```js
import React from 'react';
import HomeNavigation from 'components/navs/HomeNavigation';
import ArticleNavigation from 'components/navs/ArticleNavigation';
import BlogNavigation from 'components/navs/BlogNavigation';
import HomeSidebar from 'components/sidebars/HomeSidebar';
import ArticleSidebar from 'components/sidebars/ArticleSidebar';
import BlogSidebar from 'components/sidebars/BlogSidebar';
import HomeFooter from 'components/footers/HomeFooter';
import ArticleFooter from 'components/footers/ArticleFooter';
import BlogFooter from 'components/footers/BlogFooter';

export default class Template extends React {
    renderNav() {
        switch (this.props.pageType) {
            case 'home':
                return <HomeNavigation />;
            case 'article':
                return <ArticleNavigation />;
            case 'blog':
                return <BlogNavigation />;
        }
    }

    renderSidebar() {
        switch (this.props.pageType) {
            case 'home':
                return <HomeSidebar />;
            case 'article':
                return <ArticleSidebar />;
            case 'blog':
                return <BlogSidebar />;
        }
    }

    renderFooter() {
        switch (this.props.pageType) {
            case 'home':
                return <HomeFooter />;
            case 'article':
                return <ArticleFooter />;
            case 'blog':
                return <BlogFooter />;
        }
    }

    render() {
        return (
            <main>
                <section className='navigation'>{this.renderNav()}</section>

                <section className='content'>{this.props.children}</section>

                <aside className='sidebar'>{this.renderSidebar()}</aside>

                <section className='footer'>{this.renderFooter()}</section>
            </main>
        );
    }
}
```

> Gah! I don't want this import list to get any longer. Also, this is feeling pretty fragile and inflexible too.

There are patterns to "clean" this up. We can extract these zones into new components, create separate templates, but somewhere there is going to be a bunch of imperative code or I'm going to have to repeat myself.

## Plugin Zones

Enter Reactium **Plugins**. This is where Reactium plugin zones can help make your composition more dynamic, and let you accomplish something like this in a more declarative way.

Let's start by defining plugin zones with the built-in `<Plugins />` component.

```js
import React from 'react';
import { Plugins } from 'reactium-core/components/Plugable';

export default class Template extends React {
    render() {
        return (
            <main>
                <section className='navigation'>
                    <Plugins zone='navigation' />
                </section>

                <section className='content'>
                    <Plugins zone='content-pre' />
                    {this.props.children}
                    <Plugins zone='content-post' />
                </section>

                <aside className='sidebar'>
                    <Plugins zone='sidebar' />
                </aside>

                <section className='footer'>
                    <Plugins zone='footer' />
                </section>
            </main>
        );
    }
}
```

Now that we've defined the zones for our layout, let's add our existing `HomeNavigation` component as a plugin to the `navigation` zone.

Within our `components/HomeNavigation` directory, we will create a **plugin.js** file like so:

```js
import HomeNavigation from './index';

export default {
    /**
     * Required - used as rendering key. Make this unique.
     * @type {String}
     */
    id: 'home-page-main-navigation',

    /**
     * By default plugins in zone are rendering in ascending order.
     * @type {Number}
     */
    order: 0,

    /**
     * One or more zones this component should render.
     * @type {String|Array}
     */
    zone: 'navigation',

    /**
     * Component to render. May also be a string, and
     * the component will be looked up in components directory.
     * @type {Component|String}
     */
    component: HomeNavigation,

    /**
     * (Optional) additional search subpaths to use to find the component,
     * if String provided for component property.
     * @type {[type]}
     *
     * e.g. If component is a string 'TextInput', uncommenting the line below would
     * look in components/common-ui/form/inputs and components/general to find the component 'TextInput'
     */
    // paths: ['common-ui/form/inputs', 'general']

    /**
     * Additional params: (optional)
     *
     * Any additional properties you provide below, will be provided as params to the component when rendered.
     *
     * e.g. Below will be provided to the HomeNavigation, <HomeNavigation pageType="home" />
     * These can also be used to help sort or filter plugins.
     * @type {Mixed}
     */
    pageType: 'home',
};
```

### Advanced Plugins Properties

When you define your `Plugins` zone, you can also optionally provide a `mapper` callback which will be called for each plugin in the zone, a `sort` callback to determine rendering order, and a `filter` callback to disqualify plugins from a zone.

```js
import React from 'react';
import { Plugins } from 'reactium-core/components/Plugable';

export default class Template extends React {
    render() {
        return (
            <main>
                <section className='navigation'>
                    <Plugins
                        zone='navigation'
                        mapper={plugin => {
                            // use mapper to augment plugins in zone
                            return {
                                ...plugin,
                                additionalProp: 'value',
                            };
                        }}
                        sort={(pluginA, pluginB) => {
                            // reverse order
                            return pluginB.order - pluginA.order;
                        }}
                        filter={plugin => {
                            // filter out plugins that aren't for this page type
                            return plugin.pageType === this.props.pageType;
                        }}
                    />
                </section>
                {
                    // snip to shorten example
                }
            </main>
        );
    }
}

Template.defaultProps = {
    pageType: 'home',
};
```

Now that we have a filter on the plugin zone, plugins will only appear when those conditions are met.

### Redux Driven Plugins

If you wish to use application state to determine what plugins are loaded in a zone, you can dispatch core actions to dynamically add / remove / update plugins in a zone.

```js
deps.actions.Plugable.addPlugin(plugin);
```

> Add a dynamic redux plugin

```js
deps.actions.Plugable.updatePlugin(plugin);
```

> Update a redux plugin (must have same id)

```js
deps.actions.Plugable.removePlugin(pluginId);
```

> Remove a redux plugin by id

```js
import deps from 'dependencies';

export default {
    // on loading thunk, dynamically add this
    // components/navs/SecondaryNav to the navigation zone, having it appear only on the home pageType
    // (see custom filter above)
    load: () => dispatch => {
        dispatch(deps.actions.Plugable.addPlugin({
            id: 'my-dynamic-plugin',
            order: -1000,
            component: 'SecondaryNav',
            paths: ['navs']
            zone: ['navigation'],
            pageType: 'home',
        }))
    };
};
```

> Some actions.js file

Imagine the possibilities here, you could load the payload above from a REST service. Imagine the navs were loaded by calling an api endpoint `/api/navs`:

```js
import deps from 'dependencies';
import api from 'appdir/api';

export default {
    load: () => dispatch => {
        return api.get('/api/navs')
            .then(({data: plugins}) => {
                plugins.forEach(plugin => dispatch(deps.actions.Plugable.addPlugin(plugin)))
            })
            .catch(error => {
                const errorId = `error-${new Date()}`;
                dispatch(deps.actions.Plugable.addPlugin({
                    id: errorId,
                    component: 'ErrorMessage',
                    zone: 'errors',
                    error,
                }))

                // clear error after 2 seconds
                setTimeout(() => {
                    dispatch(deps.actions.Plugable.removePlugin(errorId));
                }, 2000)
            })
    };
};
```

### Command Line Help

After you've defined the zones for your layout, you can use the CLI to scan those zones using the command:

```sh
arcli zones scan
```

> (Optional) This isn't strictly necessary, but it will help you use the CLI to create plugin components later.

Alternatively, you can manually register your zones with the cli (helpful for dynamic zones, i.e. zone property is provided by variable).

```sh
arcli zones add -i "navigation" -d "Navigation zone in template"
arcli zones add -i "content-pre" -d "Before Content in template"
arcli zones add -i "content-pre" -d "After Content in template"
arcli zones add -i "sidebar" -d "Sidebar zone in template"
arcli zones add -i "content-pre" -d "Footer zone in template"
```

> (Optional) Again, this just helps speed up your workflow with the CLI when creating new plugins.

For existing components, you can add the `plugin.js` file to register it as a plugin, by using:

```sh
arcli plugins
```
