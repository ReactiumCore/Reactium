const tree = require('directory-tree');
const path = require('path');

const flattenRegistry =
    (registry = {children: []}, manifest = []) => registry.children
        .reduce((manifest, item) => {
            if ( 'children' in item ) {
                return flattenRegistry(item, manifest);
            }
            if ( 'path' in item ) {
                manifest.push(item);
            }
            return manifest;
        }, manifest);

const jsSources = sourcePath => flattenRegistry(tree(sourcePath, {
    extensions: /\.js$/,
    exclude: /.ds_store/i
}));

const find = (searches = [], sourcePath) => {
    const mappings = searches.reduce((mappings, {name}) => {
        mappings[name] = [];
        return mappings;
    }, {});

    return jsSources(sourcePath)
        .map(file => file.path)
        .reduce((mappings, file) => {
            searches.forEach(({name, pattern}) => {
                if ( pattern.test(file) ) {
                    mappings[name].push(file);
                }
            })

            return mappings;
        }, mappings);
}

module.exports = find([
    {
        name: 'entries',
        pattern: /^src\/app\/\w+?\.js$/,
    },
    {
        name: 'allActions',
        pattern: /actions.js$/,
    },
    {
        name: 'allActionTypes',
        pattern: /actionTypes.js$/,
    },
    {
        name: 'allReducers',
        pattern: /reducers.js$/,
    },
    {
        name: 'allInitialStates',
        pattern: /state.js$/,
    },
    {
        name: 'allRoutes',
        pattern: /route.js$/,
    },
    {
        name: 'allServices',
        pattern: /services.js$/,
    },
    {
        name: 'rods',
        pattern: /rod.js$/,
    },
    {
        name: 'layouts',
        pattern: /layout.js$/,
    },
], './src/app');
