import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * Blockquote Readme
 * -----------------------------------------------------------------------------
 */

const content = `
###### SCSS
${'```scss'}
blockquote {
    padding          : px2rem(20);
    margin           : px2rem(20) 0;
    background-color : $color-grey-light;
    font-family      : 'Montserrat', sans-serif;
    border-radius    : 0 px2rem(50) px2rem(50) 0;
    border-left      : 5px solid $color-grey;
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
