import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * TextItalic Readme
 * -----------------------------------------------------------------------------
 */

const content = `
###### SCSS
${'```scss'}
em,
.em,
.italic,
.i {
    font-style: italic;
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
