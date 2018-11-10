
const chalk  = require('chalk');
const path   = require('path');
const fs     = require('fs-extra');
const globby = require('globby').sync;


module.exports = (props) => {
    const { cwd } = props;

    let manifest;

    const scan = globby([
        `${cwd}/src/**/toolkit/index.js`,
        `${cwd}/src/**/toolkit/manifest.js`
    ]);

    try {
        const file = scan[0];
        const filecontent = String(fs.readFileSync(file))
        .replace(
            /require(.*?)\.default/gim,
            '`require$1.default`'
        )
        .replace(
            /require(.*?)\n\s+\.default/gi,
            '`require$1.default`'
        )
        .replace(
            /\\"/g,
            '"'
        )
        .replace(
            /\\'/g,
            "'"
        );

        const tmp = path.normalize(`${cwd}/src/app/toolkit/.tmp/toolkit.js`);

        fs.ensureFileSync(tmp);
        fs.writeFileSync(tmp, filecontent);

        manifest = require(tmp);

    } catch (err) {
        manifest = {};
    }

    return manifest;
};
