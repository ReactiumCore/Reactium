const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const handlebars = require('handlebars').compile;

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        create: async ({ action, params, props }) => {
            const { cwd } = props;
            const { plugin } = params;
            const pluginPath = path.resolve(
                cwd,
                'src/app/components/plugin-src/',
                plugin,
            );
            message(`Creating ${chalk.cyan(`plugin ${plugin}`)}...`);

            fs.ensureDirSync(pluginPath);

            message('Writing index.js');
            const index = handlebars(
                fs.readFileSync(
                    path.resolve(__dirname, 'template/index.hbs'),
                    'utf8',
                ),
            );
            fs.writeFileSync(
                path.resolve(pluginPath, 'index.js'),
                index({ NAME: plugin }),
                'utf8',
            );

            message('Writing reactium-hooks.js');
            const hooks = handlebars(
                fs.readFileSync(
                    path.resolve(__dirname, 'template/reactium-hooks.hbs'),
                    'utf8',
                ),
            );
            fs.writeFileSync(
                path.resolve(pluginPath, 'reactium-hooks.js'),
                hooks({ NAME: plugin }),
                'utf8',
            );

            message('Writing reactium-hooks.json');
            const hooksJson = fs.readFileSync(
                path.resolve(__dirname, 'template/reactium-hooks.json'),
                'utf8',
            );
            fs.writeFileSync(
                path.resolve(pluginPath, 'reactium-hooks.json'),
                hooksJson,
                'utf8',
            );

            message('Writing umd.js');
            const umd = handlebars(
                fs.readFileSync(
                    path.resolve(__dirname, 'template/umd.hbs'),
                    'utf8',
                ),
            );
            fs.writeFileSync(
                path.resolve(pluginPath, 'umd.js'),
                umd({ NAME: plugin }),
                'utf8',
            );

            message('Writing umd-config.json');
            const config = handlebars(
                fs.readFileSync(
                    path.resolve(__dirname, 'template/umd-config.hbs'),
                    'utf8',
                ),
            );
            fs.writeFileSync(
                path.resolve(pluginPath, 'umd-config.json'),
                config({ NAME: plugin }),
                'utf8',
            );

            fs.ensureDirSync(path.resolve(pluginPath, 'assets/style'));
            message(`${plugin}-plugin.scss`);
            const style = handlebars(
                fs.readFileSync(
                    path.resolve(__dirname, 'template/style.hbs'),
                    'utf8',
                ),
            );
            fs.writeFileSync(
                path.resolve(
                    pluginPath,
                    'assets/style',
                    `${plugin}-plugin.scss`,
                ),
                style({ NAME: plugin }),
                'utf8',
            );

            message('Writing reactium-boot.js');
            const bootJs = handlebars(
                fs.readFileSync(
                    path.resolve(__dirname, 'template/reactium-boot.hbs'),
                    'utf8',
                ),
            );

            fs.writeFileSync(
                path.resolve(pluginPath, 'reactium-boot.js'),
                bootJs({ FILENAME: `/assets/style/${plugin}-plugin.css` }),
                'utf8',
            );
        },
    };
};
