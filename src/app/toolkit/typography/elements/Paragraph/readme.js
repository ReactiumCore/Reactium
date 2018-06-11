import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * Readme
 * -----------------------------------------------------------------------------
 */
 const content = `
 # Testing
 _does this work?_

 ## Hmmm..
 **Probably not**

 <p>What about this</p>
`;


/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = () => <Markdown>{content}</Markdown>;
export default readme;
