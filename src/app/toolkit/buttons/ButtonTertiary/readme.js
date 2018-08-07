import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * ButtonTertiary Readme
 * -----------------------------------------------------------------------------
 */

const content = `
###### Usage
${'```html'}
<button type='button' class='btn-tertiary'>Tertiary Button</button>
<button type='button' class='btn-tertiary-pill'>Tertiary Pill</button>
<button type='button' class='btn-tertiary-outline'>Tertiary Outline</button>
<button type='button' class='btn-tertiary-outline-pill'>Tertiary Outline Pill</button>
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
