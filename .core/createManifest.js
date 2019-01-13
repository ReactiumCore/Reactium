const gulpConfig = require('./gulp.config');
const reactiumConfig = require('./reactium-config');
const manifestConfig = require('./manifest.config')(reactiumConfig.manifest);
const regenManifest = require('./manifest/manifest-tools');

// run it
regenManifest({
    manifestFilePath: gulpConfig.src.manifest,
    manifestConfig,
});
