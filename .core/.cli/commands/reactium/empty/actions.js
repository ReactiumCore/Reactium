const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const op = require('object-path');
const handlebars = require('handlebars').compile;

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        style: ({ action, params, props }) => {
            const { style } = params;

            if (style) {
                const { cwd } = props;

                const mainStyleSheet = path.normalize(
                    `${cwd}/src/assets/style/style.scss`,
                );
                const toolkitStyleSheet = path.normalize(
                    `${cwd}/src/assets/style/toolkit.scss`,
                );

                const scssDir = path.normalize(`${cwd}/src/assets/style/_scss`);

                if (fs.existsSync(mainStyleSheet)) {
                    fs.writeFileSync(mainStyleSheet, '\n// Styles\n\n');
                }

                if (fs.existsSync(toolkitStyleSheet)) {
                    fs.writeFileSync(
                        toolkitStyleSheet,
                        '\n// Toolkit Specific Styles\n\n',
                    );
                }

                fs.emptyDirSync(scssDir);
            }

            return Promise.resolve({ action, status: 200 });
        },
        manifest: ({ action, params, props }) => {
            const { toolkit } = params;

            if (toolkit) {
                message(`Updating ${chalk.cyan('toolkit manifest')}...`);

                const { cwd } = props;

                const manifestFile = path.normalize(
                    `${cwd}/src/app/toolkit/index.js`,
                );

                let cont = fs.readFileSync(manifestFile);
                cont = String(cont).replace(
                    /menu: {((.|\n|\r)*)},/,
                    'menu: {},',
                );

                fs.writeFileSync(manifestFile, cont);
            }

            return Promise.resolve({ action, status: 200 });
        },
        empty: ({ action, params, props }) => {
            const { cwd } = props;
            const { demo, font, images, toolkit } = params;

            if (font) {
                message(`Removing ${chalk.cyan('font assets')}...`);

                const fontExcludes = [];
                const fontPath = path.normalize(`${cwd}/src/assets/fonts`);

                fs.readdirSync(fontPath)
                    .filter(file => Boolean(!fontExcludes.includes(file)))
                    .forEach(file =>
                        fs.removeSync(path.normalize(`${fontPath}/${file}`)),
                    );
            }

            if (images) {
                message(`Removing ${chalk.cyan('image assets')}...`);

                const imageExcludes = ['atomic-reactor-logo.svg'];
                const imagePath = path.normalize(`${cwd}/src/assets/images`);

                fs.readdirSync(imagePath)
                    .filter(file => Boolean(!imageExcludes.includes(file)))
                    .forEach(file =>
                        fs.removeSync(path.normalize(`${imagePath}/${file}`)),
                    );
            }

            if (demo) {
                message(`Removing ${chalk.cyan('demo components')}...`);

                const demoPaths = [
                    path.normalize(`${cwd}/src/app/components/Demo`),
                    path.normalize(`${cwd}/src/app/components/common-ui/form`),
                    path.normalize(`${cwd}/src/app/components/common-ui/Icon`),
                ].forEach(p => fs.removeSync(p));
            }

            if (toolkit) {
                message(`Removing ${chalk.cyan('toolkit elements')}...`);

                const toolkitPath = path.normalize(`${cwd}/src/app/toolkit`);
                const toolkitExclude = ['index.js', 'overview'];

                fs.readdirSync(toolkitPath)
                    .filter(file => Boolean(!toolkitExclude.includes(file)))
                    .forEach(file =>
                        fs.removeSync(path.normalize(`${toolkitPath}/${file}`)),
                    );
            }

            return Promise.resolve({ action, status: 200 });
        },
    };
};
