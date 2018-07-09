# Static Sites

You can generate a static site by ensuring your project has a `~/public/index-static.html` file with the minimum markup:

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="./assets/style/style.css">
    </head>
    <body>
        <Component type="DevTools"></Component>
        <div id="router"></div>

        <script>
            window.ssr        = false;
            window.restAPI    = '/api';
            window.parseAppId = 'Actinium';
        </script>
        <script src="./assets/js/vendors.js"></script>
        <script src="./assets/js/main.js"></script>
    </body>
</html>
```

## Generating the Static Site

1.  Run the following command from the project root:

```
$ npm run static
```

2.  When that is complete run a local server with PHP

```
$ php -S localhost:8080 -t dist/
```

3.  Open up your browser and navigate to `http://localhost:8080`

> By default the static site will be output to the `~/dist` directory. You can change this behavior by changing the `gulp.config.js` > `dest.static` value.
