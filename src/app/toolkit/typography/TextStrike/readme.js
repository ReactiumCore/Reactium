import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * TextStrike Readme
 * -----------------------------------------------------------------------------
 */

const content = `
 ###### SCSS
 ${'```scss'}
 strike,
 .strike,
 .strikethrough {
     text-decoration: line-through;
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
