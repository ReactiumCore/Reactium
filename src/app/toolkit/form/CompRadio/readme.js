import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * CompRadio Readme
 * -----------------------------------------------------------------------------
 */

const content = `
###### Usage
${'```html'}
<Radio value={1} name={'my-radio'} text={'Radio 1'} checked />
<Radio value={2} name={'my-radio'} text={'Radio 2'} align={'left'} />
<Radio value={3} name={'my-radio'} text={'Radio 3'} disabled />
${'```'}

###### Default Props
${'```js'}
Radio.defaultProps = {
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
