import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * LinearIcons Readme
 * -----------------------------------------------------------------------------
 */

const content = `
#### Import

${'```jsx'}
import Icon from 'components/common-ui/Icon';
${'```'}
#### Usage
${'```html'}
<Icon.Menu width={18} height={18} />
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
