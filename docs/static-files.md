# Static Files

By default, Reactium will move any static `.html`, `.css`, and any file inside an `~/assets` directory into the `~/public` directory.
Files inside an `~/assets` directory will be placed in the `~/public/assets` directory. If a file is inside a sub-directory, the sub-directory will be added to the `~/public/assets` directory.

## Static Style Sheets

Reactium will ignore any file inside a `~/style` directory with the exception of `.css` files. All `.css` files will be copied to the `~/public/assets/style` directory by default.

> You can modify this behavior by editing the `gulp.config.js` > `dest` properties.

Given the following component directory:

```
├── Demo
    ├── index.js
    ├── route.js
    └── assets
        ├── images
        │   └── demo
        │       ├── feature-01.png
        │       ├── feature-02.png
        │       ├── feature-03.png
        │       ├── head.png
        │       ├── icon-hotdog.png
        │       └── icon-instagram.png
        └── style
            └── vendor.css
```

All the files in the `assets/images/demo-site` will be copied to the `~/public/assets` directory while the `~/assets/style/vendor.css` file will be copied to `~/public/assets/style`.

> Be sure to namespace asset files or place them in unique sub-directories so that they don't overwrite each other once copied to the destination directory. In the above example, `vendor.css` should be renamed to `demo-vendor.css`
