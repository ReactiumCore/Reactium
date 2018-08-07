import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * TextSuper Readme
 * -----------------------------------------------------------------------------
 */

const content = `
 ###### SCSS
 ${'```scss'}
 sup,
 .sup {
   position: relative;
   font-size: 75%;
   line-height: 0;
   vertical-align: baseline;
   top: -.5rem;
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
