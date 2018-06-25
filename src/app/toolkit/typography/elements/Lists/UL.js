
import React, { Component, Fragment } from 'react';

const UL = (props) => {
    let { children } = props;
    return (<ul {...props}>{children}</ul>);
};

export default UL;
