import React from 'react';
import Markdown from 'reactium-core/components/Toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * Readme
 * -----------------------------------------------------------------------------
 */
 const content = `
 # Testing
 _does this work?_

 ## Hmmm..
 **I think so**

 <p>What about inline HTML?</p>

${'`'}
code
${'`'}
${'```js'}
let inlineCode = () => {
    console.log('Whoa dude!');
};
${'```'}

${'```html'}
<html>
    <body>
        <p>Some HTML markup</p>
    </body>
</html>
${'```'}
`;


/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = (props) => <Markdown {...props}>{content}</Markdown>;
export default readme;
