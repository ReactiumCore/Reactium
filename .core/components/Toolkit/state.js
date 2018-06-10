/**
 Toolkit Initial State
*/

export default {
    // do not persist to local storage (default)
    // see https://www.npmjs.com/package/redux-local-persist
    persist: ['prefs'],
    prefs: {
        code: {
            all: true,
        },
        codeColor: {
            all: 'dark',
        }
    }
};
