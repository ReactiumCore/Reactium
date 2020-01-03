# Plugin API

Reactium has a number of features that make it a plugable React application framework. Instead of monolithically composed applications
that can only be maintained by one group of developers, with Reactium, it is possible to compose your
application to be extensible with plugin modules. The key features of the Reactium Plugin API provided by the Reactium SDK:

-   Asynchronous Hooks to bind into your application
-   Dynamic Component Rendering Zones
-   Front-end runtime caching for improved data loading
-   Front-end `Pulse` task runner
-   Component registration for easy externalization
-   Imperative handle registration for easy communication between components
-   Helpful SDK features for interacting with the plugable node/express back-end partner of Reactium, `Actinium`.
-   Internal or UMD plugin module development workflow and registration

Many of the [SDK's core features](https://atomic-reactor.github.io/reactium-sdk-core/) can be even be used on non-Reactium projects.

## Component Rendering Zones

Reactium comes with the built-in concept of **zones.** Component zones are just
React components themselves. Component rendering zones are used to dynamically gather components
at runtime designated at that zone, and render them as children.

Zones are a helpful pattern for when you do not want to hard-code the composition of your application, often because you can't or shouldn't update each large component manually, or you want to provide dynamic composition (not just data).

### Scenario

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

### Zone Solution

Enter Reactium **Zone**. This is where Reactium plugin zones can help make your composition more dynamic, and let you accomplish something like this in a more declarative way.

Let's start by defining plugin zones with the SDK's `<Zone />` component.

```js
import React from 'react';
import { Zone } from 'reactium-core/sdk';

export default class Template extends React {
    render() {
        return (
            <main>
                <section className='navigation'>
                    <Zone zone='navigation' />
                </section>

                <section className='content'>
                    <Zone zone='content-pre' />
                    {this.props.children}
                    <Zone zone='content-post' />
                </section>

                <aside className='sidebar'>
                    <Zone zone='sidebar' />
                </aside>

                <section className='footer'>
                    <Zone zone='footer' />
                </section>
            </main>
        );
    }
}
```

Now that we've defined the zones for our layout, let's add our existing `HomeNavigation` component to the `navigation` zone.

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
     * By default components in zone are rendering in ascending order.
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
     * These can also be used to help sort or filter zone components.
     * @type {Mixed}
     */
    pageType: 'home',
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

> (Optional) Again, this just helps speed up your workflow with the CLI when creating new zone components.

For existing components, you can add the `plugin.js` file to register it to a component `Zone`, by using:

```sh
arcli plugin component
```

## Hooks

// TODO: Write Hooks Docs

## Component Registration

// TODO: Write Component Registration Docs

## Handles

// TODO: Write Handles Docs

## Plugin Modules

// TODO: Write Plugin Modules Docs

## Actinium Extensions

// TODO: Write Actinium Extensions Docs
