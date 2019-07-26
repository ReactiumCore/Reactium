module.exports = config => {
    // Disable code splitting for Electron projects
    config.contexts.components.mode = 'sync';
    config.contexts.common.mode = 'sync';
    config.contexts.toolkit.mode = 'sync';
    config.contexts.core.mode = 'sync';

    return config;
};
