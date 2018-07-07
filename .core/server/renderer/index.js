const normalizeAssets = assets => (Array.isArray(assets) ? assets : [assets]);
const globby = require("globby");
const path = require("path");
const fs = require("fs");

const isToolkit = str => {
    let exp = /^\/toolkit/i;
    return exp.test(str);
};

const isMain = str => {
    let exp = /^\/main/i;
    return exp.test(str);
};

const styles = (req, res) => {
    let css = isToolkit(req.path) === true ? "toolkit.css" : "style.css";
    let styles = [`<link rel="stylesheet" href="/assets/style/${css}">`];

    return styles.join("\n\t");
};

const preferVendors = (a, b) => {
    if (a === "vendors.js") return -1;
    if (b === "vendors.js") return 1;
    return 0;
};

const scripts = (req, res) => {
    let scripts = "";

    const scriptPathBase =
        process.env.PUBLIC_DIRECTORY || `${process.cwd()}/public`;
    scripts = globby
        .sync(path.resolve(scriptPathBase, "assets", "js", "*.js"))
        .map(script => path.parse(script).base)
        .sort(preferVendors)
        .map(script => `<script src="/assets/js/${script}"></script>`)
        .join("\n");

    if (process.env.NODE_ENV === "development") {
        const assetsByChunkName = res.locals.webpackStats.toJson()
            .assetsByChunkName;

        const { vendors } = assetsByChunkName;
        scripts = Object.values(assetsByChunkName)
            .map(chunk =>
                normalizeAssets(chunk).filter(path => path.endsWith(".js"))
            )
            .reduce((files, chunk) => files.concat(chunk), [])
            .sort(preferVendors)
            .map(path => `<script src="/${path}"></script>`)
            .join("\n");
    }

    return scripts;
};

export default (req, res, context) => {
    const reactiumConfig = require(`${rootPath}/.core/reactium-config`);

    req.scripts = scripts(req, res);
    req.styles = styles(req, res);

    let { version = "2.1.0" } = reactiumConfig;
    version = Number(version.split(".").join(""));

    let mod, renderer;

    if ("SSR_MODE" in process.env && process.env.SSR_MODE === "on") {
        if (fs.existsSync(`${rootPath}/src/app/server/renderer/ssr.js`)) {
            mod = require(`${rootPath}/src/app/server/renderer/ssr`);
            let { version: v } = mod;
            v = v ? Number(v.split(".").join("")) : version;

            if (version < v) {
                mod = require("./ssr");
            }
        } else {
            mod = require("./ssr");
        }

        renderer = mod.renderer(req, res, context);
    } else {
        if (fs.existsSync(`${rootPath}/src/app/server/renderer/feo.js`)) {
            mod = require(`${rootPath}/src/app/server/renderer/feo`);
            let { version: v } = mod;
            v = v ? Number(v.split(".").join("")) : version;

            if (version < v) {
                mod = require("./feo");
            }
        } else {
            mod = require("./feo");
        }

        renderer = Promise.resolve(mod.renderer(req, res, context));
    }

    return renderer;
};
