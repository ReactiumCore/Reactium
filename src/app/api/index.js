import Reactium from 'reactium-core/sdk';
import op from 'object-path';

console.log(
    'You imported from appdir/api, which is deprecated. Use the Reactium singleton instead.',
    `import Reactium from 'reactium-core/sdk';

const api = Reactium.API.MyAPI;
`,
);

export default Reactium.API.Actinium;
