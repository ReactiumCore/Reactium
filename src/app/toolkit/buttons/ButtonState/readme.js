import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * ButtonState Readme
 * -----------------------------------------------------------------------------
 */

const content = `
For ${'`<button>`'} elements you can just set the ${'`disabled`'} attribute to make a styled button appear disabled.

${'```html'}
<button type='button' disabled class='btn-primary'>Disabled Primary Button</button>
<a href='/go/somewhere' class='btn-primary disabled'>Disabled Primary Link</a>
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
