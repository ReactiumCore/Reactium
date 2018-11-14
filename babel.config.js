const config = require('./.core/babel.config');

// @example
//
// To add a module resolver for node and webpack
//
// const path = require('path');
//
// const moduleResolver = config.plugins.find(plugin => plugin[0] === 'module-resolver');
// moduleResolver[1].alias['redux-addons'] = './src/app/redux-addons';

module.exports = config;
