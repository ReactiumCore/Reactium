import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * CompCheckbox Readme
 * -----------------------------------------------------------------------------
 */

const content = `
###### Usage
${'```html'}
<Checkbox value={1} name={'my-checkbox'} text={'Checkbox 1'} checked />
<Checkbox value={2} name={'my-checkbox'} text={'Checkbox 2'} align={'left'} />
<Checkbox value={3} name={'my-checkbox'} text={'Checkbox 3'} disabled />
${'```'}

###### Default Props
${'```js'}
Checkbox.defaultProps = {
    align    : 'right',
    checked  : false,
    disabled : false,
    id       : null,
    name     : null,
    text     : null,
    value    : null,
};
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
