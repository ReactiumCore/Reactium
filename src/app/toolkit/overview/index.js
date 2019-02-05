import React from 'react';
import Card from 'reactium-core/components/Toolkit/Content/Card';
import Docs from 'reactium-core/components/Toolkit/Content/Docs';
import Markdown from 'reactium-core/components/Toolkit/Markdown';
import { getStore } from 'reactium-core/app';

/**
 * -----------------------------------------------------------------------------
 * Overview
 * Write up something about the style guide or remove all of this and make
 * this a component that shows off something flashy!
 * -----------------------------------------------------------------------------
 */
const content = `
### Overview

Add some content about this design system by editing:

${'```javascript'}
/src/app/toolkit/overview/index.js
${'```'}

Need help on how to create Design System elements?

[Design System Documentation](https://reactium.io/docs/guide/design-system).

#### Code Example
${'```javascript'}
console.log('Put some code here if you want to show some examples of how to do stuff');
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const Comp = () => (
    <Markdown theme={getStore().getState().Toolkit.prefs.codeColor.all}>
        {content}
    </Markdown>
);
const overview = () => {
    return (
        <Card title={'Reactium Style Guide'}>
            <Docs component={Comp} id={'overview'} visible={true} />
        </Card>
    );
};

export default overview;
