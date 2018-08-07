import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * TextUnderline Readme
 * -----------------------------------------------------------------------------
 */

const content = `
###### SCSS
${'```scss'}
u,
.u,
.underline {
    text-decoration: underline;
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
