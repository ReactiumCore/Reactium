const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const globby = require('globby').sync;
const reader = require('fs-readdir-recursive');

const scan = ({ file, params, props }) => {
    const { cwd } = props;
    const { from } = params;

    const filepath = path.join(cwd, 'src', file);

    const regex = new RegExp(from, 'im');

    // Test the file
    if (regex.test(file)) {
        return true;
    }

    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
        return false;
    } else {
        const fileContent = fs.readFileSync(filepath);
        return regex.test(fileContent);
    }

    return false;
};

module.exports = ({ params, props }) =>
    reader(path.join(props.cwd, 'src'))
        .filter(file => scan({ file, params, props }))
        .map(file => path.join(props.cwd, 'src', file));
