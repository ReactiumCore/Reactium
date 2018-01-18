// Utility for importing webpack define plugin defined files
const importDefined = filesObj => Object.keys(filesObj).reduce((loaded, key) => {
    let fileName = filesObj[key];
    if (fileName) {
        let newLoaded = require(fileName + "");
        if ( 'default' in newLoaded ) {
            newLoaded = newLoaded.default;
        }
        loaded = {
            ...loaded,
            [key]: newLoaded,
        };
    }
    return loaded;
}, {});

export default importDefined;
