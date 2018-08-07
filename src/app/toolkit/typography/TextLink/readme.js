import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * TextLink Readme
 * -----------------------------------------------------------------------------
 */

const content = `
###### SCSS
${'```scss'}
a {
  color: inherit;
  text-decoration: none;
  background-color: transparent;

  &:hover {
    color: inherit;
    text-decoration: underline;
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
