import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * Colors Readme
 * -----------------------------------------------------------------------------
 */

const content = `
You can apply a ${'`.color`'} or ${'`.bg-color`'} to an element to change it's text and/or background color.


#### Usage
${'```'}
<div class="red">Red Text</div>
<div class="bg-red">Red Background</div>
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
