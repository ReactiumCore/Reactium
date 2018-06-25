
import React, { Component, Fragment } from 'react';

const H6 = (props) => {
    let { children = 'Heading 6' } = props;
    return (<h6 {...props}>{children}</h6>);
};

export default H6;
