const { globDefineFiles } = require('./src/utils');
const {
    allInitialStates,
    allRoutes,
    allActions,
    allActionTypes,
    allServices,
    allReducers,
} = require('./manifest');

const globExports = {
    allInitialStates: globDefineFiles(allInitialStates),
    allRoutes: globDefineFiles(allRoutes),
    allActions: globDefineFiles(allActions),
    allActionTypes: globDefineFiles(allActionTypes),
    allServices: globDefineFiles(allServices),
    allReducers: globDefineFiles(allReducers),
};

module.exports = `export default ${JSON.stringify(globExports)};`;
