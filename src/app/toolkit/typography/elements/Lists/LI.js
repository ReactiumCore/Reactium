
import React, { Component, Fragment } from 'react';

const LI = (props) => {
    let { children = 'List Item' } = props;
    return (<li {...props}>{children}</li>);
};

export default LI;
