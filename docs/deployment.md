# Deploying

By default, Reactium builds and runs a Node + Express server for both Server Side Rendering &amp; Front-End Rendering.
If you plan to deploy a static site, simply rename the `~/public/index-static.html` file to `~/public/index.html`.

## Deploying to Heroku

1.  Set up a [Node app on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction).
2.  Set the deploy method to Github.
3.  Manually deploy or turn on Enable Automatic Deploys.

## Deploying to Heroku with Server Side Rendering

If you're planning to use SSR, create an environment variable named: `SSR_MODE` and set it's value to `on`.

```
$ heroku config:set SSR_MODE=on --app your-app-name
```

## Docker Deployment

...

## Deploying to IBM Cloud

...
