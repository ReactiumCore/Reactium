import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * TextSmall Readme
 * -----------------------------------------------------------------------------
 */

const content = `
 ###### SCSS
 ${'```scss'}
 small,
 .small {
    font-size: px2rem(11);
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
