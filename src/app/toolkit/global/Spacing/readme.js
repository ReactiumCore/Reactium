import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * Spacing Readme
 * -----------------------------------------------------------------------------
 */

const content = `
# Your Documentation Here

Be sure to use [markdown ](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to format the text.

I suppose you could also use HTML but come on.. do you _REALLY_ need to?
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
