import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * ListOrdered Readme
 * -----------------------------------------------------------------------------
 */

const content = `
 ###### SCSS
 ${'```scss'}
 ol {
     margin: 0 0 0 px2rem(20);
     padding: 0;

     li {
         line-height: 2;
         padding: 0;
         margin: 0;
     }
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
