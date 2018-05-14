const manifest = require('rootdir/src/manifest');

const dddReduce = type => (domains = {}, file = '') => {
    const found = file.match(new RegExp(`\/(.+?)\/${type}$`))
    if (found) {
        let [ ,domain ] = found;
        domains[domain] = file;
    }

    return domains;
};

module.exports = {
    allInitialStates: manifest.allInitialStates.reduce(dddReduce('state'), {}),
    allRoutes: manifest.allRoutes.reduce(dddReduce('route'), {}),
    allActions: manifest.allActions.reduce(dddReduce('actions'), {}),
    allActionTypes: manifest.allActionTypes.reduce(dddReduce('actionTypes'), {}),
    allServices: manifest.allServices.reduce(dddReduce('services'), {}),
    allReducers: manifest.allReducers.reduce(dddReduce('reducers'), {}),
};
