import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * ButtonPrimary Readme
 * -----------------------------------------------------------------------------
 */

const content = `
###### Usage
${'```html'}
<button type='button' class='btn-primary'>Primary Button</button>
<button type='button' class='btn-primary-pill'>Primary Pill</button>
<button type='button' class='btn-primary-outline'>Primary Outline</button>
<button type='button' class='btn-primary-outline-pill'>Primary Outline Pill</button>
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
