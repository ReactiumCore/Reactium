const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        create: ({ action, params, props }) => {
            message(`Creating ${chalk.cyan('templates')}...`);

            const { cwd } = props;
            const { feo, ssr } = params;

            const reactium = require(path.normalize(
                `${cwd}/.core/reactium-config`,
            ));
            const template = {};
            const tmpath = path.normalize(`${cwd}/`);
            const ver = op.get(reactium, 'version', '2.3.15');

            if (feo) {
                template['feo'] = fs.readFileSync(
                    path.normalize(`${cwd}/.core/server/template/feo.js`),
                );
                template['feo'] = String(template.feo).replace(
                    /\%TEMPLATE_VERSION\%/gi,
                    ver,
                );
            }

            if (ssr) {
                template['ssr'] = fs.readFileSync(
                    path.normalize(`${cwd}/.core/server/template/ssr.js`),
                );
                template['ssr'] = String(template.ssr).replace(
                    /\%TEMPLATE_VERSION\%/gi,
                    ver,
                );
            }

            Object.entries(template).forEach(([type, content]) => {
                const p = path.normalize(
                    `${cwd}/src/app/server/template/${type}.js`,
                );

                fs.ensureFileSync(p);
                fs.writeFileSync(p, content);
            });

            return Promise.resolve({ action, status: 200 });
        },
    };
};
