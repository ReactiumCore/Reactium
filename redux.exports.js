const { globDefineFiles }   = require('./src/utils');

const globExports = {
    allInitialStates: globDefineFiles('src/app/components/**/state.js'),
    allRoutes: globDefineFiles('src/app/components/**/route.js'),
    allActions: globDefineFiles('src/app/components/**/actions.js'),
    allActionTypes: globDefineFiles('src/app/components/**/actionTypes.js'),
    allServices: globDefineFiles('src/app/components/**/services.js'),
    allReducers: globDefineFiles('src/app/components/**/reducers.js'),
};

module.exports = `export default ${JSON.stringify(globExports)};`;
