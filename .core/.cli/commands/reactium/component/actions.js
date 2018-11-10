const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const op = require('object-path');
const zip = require('folder-zipper');
const handlebars = require('handlebars').compile;

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    const generate = ({ action, params, props, templateFile, fileName }) => {
        const { cwd } = props;
        const { destination, command, name, overwrite } = params;

        const filepath = path.normalize(path.join(destination, fileName));

        const actionType = overwrite === true ? 'overwritting' : 'creating';

        message(`${actionType} command ${command} ${chalk.cyan(name)}...`);

        fs.ensureDirSync(path.normalize(destination));

        // Template content
        const template = path.normalize(
            `${__dirname}/template/${templateFile}.hbs`
        );
        const content = handlebars(fs.readFileSync(template, 'utf-8'))(params);

        return new Promise((resolve, reject) => {
            fs.writeFile(filepath, content, error => {
                if (error) {
                    reject(error.Error);
                } else {
                    resolve({ action, status: 200 });
                }
            });
        });
    };

    return {
        backup: ({ action, params, props }) => {
            const { cwd } = props;
            const { destination, name } = params;

            message(`backing up ${name} component...`);

            const now = Date.now();
            const backupDir = path.normalize(`${cwd}/.BACKUP/component`);
            const backupZip = path.normalize(`${backupDir}/${now}.${name}.zip`);

            // Create the backup directory
            fs.ensureDirSync(backupDir);

            // Backup the component directory then empty the existing
            return zip(destination, backupZip).then(() => {
                fs.emptyDirSync(destination);
                return { action, status: 200 };
            });
        },

        create: ({ action, params, props }) => {
            const { destination, name } = params;

            message(`creating ${chalk.cyan('name')}...`);

            return new Promise((resolve, reject) => {
                fs.ensureDir(destination, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ action, status: 200 });
                    }
                });
            });
        },

        functional: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'index-functional',
                fileName: 'index.js',
            }),

        class: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'index-class',
                fileName: 'index.js',
            }),

        redux: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'index-redux',
                fileName: 'index.js',
            }),

        subclass: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'index-class',
                fileName: `${params.name}.js`,
            }),

        actions: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'actions',
                fileName: 'actions.js',
            }),

        actionTypes: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'actionTypes',
                fileName: 'actionTypes.js',
            }),

        reducers: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'reducers',
                fileName: 'reducers.js',
            }),

        route: ({ action, params, props }) => {
            if (Array.isArray(params.route)) {
                params.route = JSON.stringify(params.route);
            }

            return generate({
                action,
                params,
                props,
                templateFile: 'route',
                fileName: 'route.js',
            });
        },

        services: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'services',
                fileName: 'services.js',
            }),

        state: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'state',
                fileName: 'state.js',
            }),
    };
};
