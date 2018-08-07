import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * ButtonSecondary Readme
 * -----------------------------------------------------------------------------
 */

const content = `
###### Usage
${'```html'}
<button type='button' class='btn-secondary'>Secondary Button</button>
<button type='button' class='btn-secondary-pill'>Secondary Pill</button>
<button type='button' class='btn-secondary-outline'>Secondary Outline</button>
<button type='button' class='btn-secondary-outline-pill'>Secondary Outline Pill</button>
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
