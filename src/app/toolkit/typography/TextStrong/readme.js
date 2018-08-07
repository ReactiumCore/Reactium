import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * TextStrong Readme
 * -----------------------------------------------------------------------------
 */

const content = `
###### SCSS
${'```scss'}
.b,
.bold,
.strong,
strong {
    font-weight: 600;
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
