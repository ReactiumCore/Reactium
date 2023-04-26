import chalk from 'chalk';
import fs from 'fs-extra';
import hb from 'handlebars';
import cc from 'camelcase';
import op from 'object-path';
import path from 'node:path';
import { dirname } from '@atomic-reactor/dirname';

const __dirname = dirname(import.meta.url);

const handlebars = hb.compile;

export default spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    let svgs = {};

    return {
        scan: async ({ action, params }) => {
            const { source } = params;

            message(
                `Scanning icon file ${chalk.cyan(path.basename(source))}...`,
            );

            const filePath = path.normalize(source);
            const { icons } = await import(filePath);

            svgs = icons.reduce((obj, item) => {
                const id = cc(op.get(item, 'properties.name'), {
                    pascalCase: true,
                });
                obj[id] = { paths: op.get(item, 'icon.paths'), id };

                return obj;
            }, {});

            return Promise.resolve({ action, status: 200 });
        },

        create: ({ action, params }) => {
            const { destination, name } = params;
            const dir = path.normalize(path.join(destination, 'svg'));

            message(`Creating ${chalk.cyan('icons')}...`);

            // Template content
            const template = path.normalize(`${__dirname}/template/svg.hbs`);

            Object.values(svgs).forEach(({ id, paths }) => {
                const content = handlebars(fs.readFileSync(template, 'utf8'))({
                    name,
                    paths,
                    id,
                });

                const filepath = path.join(dir, `${id}.js`);

                fs.ensureFileSync(filepath);
                fs.writeFileSync(filepath, content);
            });

            return Promise.resolve({ action, status: 200 });
        },

        index: ({ action, params }) => {
            const { destination, name } = params;
            const dir = path.normalize(path.join(destination, name));

            message(`Indexing ${chalk.cyan(name)}...`);

            // Template content
            const template = path.normalize(`${__dirname}/template/index.hbs`);

            const icons = Object.keys(svgs).map(name => {
                return { id: name, path: `./svgs/${name}` };
            });

            const content = handlebars(fs.readFileSync(template, 'utf8'))({
                icons,
            });

            const filepath = path.normalize(path.join(dir, 'index.js'));

            fs.ensureFileSync(filepath);
            fs.writeFileSync(filepath, content);

            return Promise.resolve({ action, status: 200 });
        },
    };
};
