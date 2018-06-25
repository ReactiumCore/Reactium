import React from 'react';
import Card from 'reactium-core/components/Toolkit/Content/Card';
import Docs from 'reactium-core/components/Toolkit/Content/Docs';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * Overview
 * Write up something about the style guide or remove all of this and make
 * this a component that shows off something flashy!
 * -----------------------------------------------------------------------------
 */
 const content = `
# Style Guide
---------
Add some content about this design system here.

`;
















/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const Comp = () => (<Markdown>{content}</Markdown>);
const overview = () => (
    <Card title={'Atomic Thinking'}>
        <Docs component={Comp} id={'overview'} />
    </Card>
);
export default overview;
