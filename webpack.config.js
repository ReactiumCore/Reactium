const config = require('./.core/gulp.config');
const webpackConfig = require('./.core/webpack.config')(config);

module.exports = webpackConfig;
