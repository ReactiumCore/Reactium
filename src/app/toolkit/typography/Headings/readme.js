import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * Headings Readme
 * -----------------------------------------------------------------------------
 */

const content = `
You can use ${'`.h1, .h2, .h2, .h3, .h4, .h5, .h6`'} on an element to make it appear as a different heading. This is particularlly useful when trying to keep [Semantic Document Structure](https://webaim.org/techniques/semanticstructure/).
${'```html'}
<h2 class='h1'>Heading 2 as a H1</h2>
<span class='h1'>Span as a H1</span>
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
