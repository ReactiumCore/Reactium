import React from "react";
import Markdown from "reactium-core/components/Toolkit/Markdown";

/**
 * -----------------------------------------------------------------------------
 * Readme
 * -----------------------------------------------------------------------------
 */
const content = `
Import the component:

${"```js"}
import { P } from "../Paragraph";
${"```"}

Usage:
${"```html"}
<P>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</P>
${"```"}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const readme = props => <Markdown {...props}>{content}</Markdown>;
export default readme;
