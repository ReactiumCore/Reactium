const { globDefineFiles }   = require('./src/utils');
const rods = globDefineFiles('src/app/components/**/rod.js');
const layouts = globDefineFiles('src/app/components/**/layout.js');

module.exports = Object.keys(rods).map(rod => `import ${rod} from '${rods[rod]}'\n`) +
    Object.keys(layouts).map(layout => `import ${layout} from '${layouts[layout]}'\n`) +
    `export default {\n` +
        `layouts: {\n` +
            Object.keys(layouts).map(layout => `${layout},\n`) +
        `},\n` +
        `rods: {\n` +
            Object.keys(rods).map(rod => `${rod},\n`) +
        `}\n` +
    `}\n`;
