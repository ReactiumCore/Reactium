import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * Theming Readme
 * -----------------------------------------------------------------------------
 */

const content = `
Reactium ships with the ability to create multiple themes and apply them in your Style Guide.

Simply run the following ARCLI command:
${'```'}
$ arcli theme
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
