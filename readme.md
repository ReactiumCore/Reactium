![](https://image.ibb.co/ee2WaG/atomic_reactor.png)

# Reactium

An opinionated framework for creating React + Redux apps.

[Reactium documentation](https://reactium.io/get-started)

## Quick Start

To run in **front-end only** (no server side rendering) development mode from your project directory for local development:

```
$ npm install
$ npm run local
```

To run in **server side rendering** development mode from your project directory for local development:

```
$ npm install
$ npm run local:ssr
```

## The Approach

Reactium follows Domain Drive Design (DDD) and aims to ease the creation of complex applications by connecting the related pieces of the software into an ever-evolving model.

DDD focuses on three core principles:

-   Focus on the core domain and domain logic.
-   Base complex designs on models of the domain.
-   Constantly collaborate with domain experts, in order to improve the application model and resolve any emerging domain-related issues.

### Advantages of Domain Driven Design

-   **Eases Communication:** With an early emphasis on establishing a common and ubiquitous language related to the domain model of the project, teams will often find communication throughout the entire development life cycle to be much easier. Typically, DDD will require less technical jargon when discussing aspects of the application, since the ubiquitous language established early on will likely define simpler terms to refer to those more technical aspects.
-   **Improves Flexibility:** Since DDD is based around modularity, nearly everything within the domain model will be based on an object and will, therefore, be quite encapsulated. This allows for various components, or even the entire system as a whole, to be altered and improved on a regular, continuous basis.
-   **Emphasizes Domain Over Interface:** Since DDD is the practice of building around the concepts of domain and what the domain experts within the project advise, DDD will often produce applications that are accurately suited for and representative of the domain at hand, as opposed to those applications which emphasize the UI/UX first and foremost. While an obvious balance is required, the focus on domain means that a DDD approach can produce a product that resonates well with the audience associated with that domain.
-   **Encourages Iterative Practices:** DDD practices strongly rely on constant iteration and continuous integration in order to build a malleable project that can adjust itself when necessary. Some organizations may have trouble with these practices, particularly if their past experience is largely tied to less-flexible development models, such as the waterfall model or the like.

## Styling

Reactium takes the approach of **NOT** bundling CSS in JS.

There are a many reasons why, but the most important ones to us are:

-   Traditional styling allows you to declare which style wins very clearly and easily.
-   Bundling the styles as a separate file allow for easy holistic replacement.
-   Easy delivery of the styles to a CDN or other resource management tool.
-   Faster Webpack compilation.

## Reactium Features

-   **Fast Local Development Workflow:** Javascript tooling is hard, laborious, and annoying. We've spent a lot of time working through dozens of _"what if..."_ scenarios to deliver a minimal pain dev workflow!
-   **Built-in Design System:** No need to have a separate design system like Pattern Lab or Storybook. [Learn more](https://github.com/Atomic-Reactor/Reactium/blob/master/docs/design-system.md).
-   **Robust Command Line Interface:** Reactium heavily relies on boiler-plated code to normalize and ease the dev workflow. Creating a component or a design system element can be done with the stroke of a few keys. No need to memorize all the commands either, you can use `--flags` or follow prompts. You can even customize the CLI by replacing or creating your own commands. [Learn more](https://www.npmjs.com/package/atomic-reactor-cli).
-   **Easy Deployment:** Reactium creates a Node server for both front-end and server side rendering making it easy to deploy to the host of your choice. We even have a docker setup included for you dev-opers.
-   **Single Page App or Isolated Component Development:** Build anything from a full website to a single component and package for distribution.
-   **Built-in Redux Support:** Learning Redux can be hard. Sure you might have the basics down but building an application with it can quickly escalate to frustration and nightmares. Our simple Redux pattern makes it super easy to build stateful applications. Learn more about [Redux](https://redux.js.org/).
-   **Built-in React Router Support**: Build routed websites in a single application with no additional setup. Learn more about [React Router](https://reacttraining.com/react-router/web/guides/quick-start)
-   **Plugin Architecture**: Dynamic composition where there's no need to hard code `import` statements through out your codebase. Simply identify "zones" where components can be injected. [Learn more](https://github.com/Atomic-Reactor/Reactium/blob/master/docs/plugins.md).

[More documentation](https://github.com/Atomic-Reactor/Reactium/tree/master/docs).
