import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * TextSub Readme
 * -----------------------------------------------------------------------------
 */

const content = `
###### SCSS
${'```scss'}
sub,
.sub {
  position: relative;
  font-size: 75%;
  line-height: 0;
  vertical-align: baseline;
  bottom: -.5rem;
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
