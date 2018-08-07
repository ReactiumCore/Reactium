import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * Paragraph Readme
 * -----------------------------------------------------------------------------
 */

const content = `
###### SCSS
${'```scss'}
p, .p {
    font-family   : Helvetica, Arial, sans-serif;
    font-size     : 16px;
    line-height   : 1.5;
    margin-top    : 0;
    margin-bottom : 15px;
}
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
