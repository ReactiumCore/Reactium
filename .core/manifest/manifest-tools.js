const tree = require('directory-tree');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const op = require('object-path');
const prettier = require('prettier');
const moment = require('moment');
const chalk = require('chalk');
const diff = require('fast-diff');
const hb = require('handlebars');

const flattenRegistry = (registry = { children: [] }, manifest = []) =>
    registry.children.reduce((manifest, item) => {
        if ('children' in item) {
            return flattenRegistry(item, manifest);
        }
        if ('path' in item) {
            manifest.push(item);
        }
        return manifest;
    }, manifest);

const jsSources = sourcePath =>
    flattenRegistry(
        tree(sourcePath, {
            extensions: /\.jsx?$/,
            exclude: [/.ds_store/i, /.core\/.cli\//i, /.cli\//i],
        }),
    );

const find = (searches = [], sourceMappings) => {
    let mappings = searches.reduce((mappings, { name, type }) => {
        mappings[name] = {
            type,
            imports: [],
        };
        return mappings;
    }, {});

    sourceMappings.forEach(sourceMapping => {
        mappings = jsSources(sourceMapping.from)
            .map(file => file.path)
            .reduce((mappings, file) => {
                searches.forEach(({ name, pattern, ignore }) => {
                    if (pattern.test(file) && (!ignore || !ignore.test(file))) {
                        mappings[name].imports.push(
                            file
                                .replace(/\\/g, '/')
                                .replace(sourceMapping.from, sourceMapping.to)
                                .replace(/.jsx?$/, ''),
                        );
                    }
                });

                return mappings;
            }, mappings);
    });

    return mappings;
};

module.exports = function({
    manifestFilePath,
    manifestConfig,
    manifestTemplateFilePath,
    manifestProcessor,
}) {
    const manifest = find(
        manifestConfig.patterns,
        manifestConfig.sourceMappings,
    );

    const template = hb.compile(
        fs.readFileSync(manifestTemplateFilePath, 'utf-8'),
    );

    const fileContents = prettier.format(
        template(
            manifestProcessor({
                manifest,
                contexts: manifestConfig.contexts,
            }),
        ),
        {
            parser: 'babel',
            trailingComma: 'all',
            singleQuote: true,
            tabWidth: 4,
            useTabs: false,
        },
    );

    const manifestHasChanged = () => {
        const prevFileContents = fs.readFileSync(manifestFilePath, 'utf-8');
        const changes = diff(prevFileContents, fileContents).filter(
            ([code, change]) => code !== 0,
        );
        return changes.length > 0;
    };

    // Write Manifest only if it does not exist or has changed
    if (!fs.existsSync(manifestFilePath) || manifestHasChanged()) {
        console.log(
            `[${moment().format('HH:mm:ss')}] Writing  '${chalk.cyan(
                manifestFilePath,
            )}'...`,
        );

        fs.writeFileSync(manifestFilePath, fileContents);
    }
};
