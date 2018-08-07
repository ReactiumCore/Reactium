import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * ButtonSize Readme
 * -----------------------------------------------------------------------------
 */

const content = `
You can adjust the size of a button by adding a size: ${'`xs, sm, md, lg`'}

###### Usage
${'```html'}
<button type='button' class='btn-primary-lg'>Large Primary Button</button>
<button type='button' class='btn-primary-lg-pill'>Large Primary Pill Button</button>
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
