import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * ButtonBlock Readme
 * -----------------------------------------------------------------------------
 */

const content = `
By adding ${'`.btn-block`'} to a styled button, you can force the button to display as a block element.

###### Usage
${'```html'}
<button type='button' class='btn-primary-lg btn-block'>Primary Button Block</button>
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
