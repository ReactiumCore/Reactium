
import React, { Component, Fragment } from 'react';

const H5 = (props) => {
    let { children = 'Heading 5' } = props;
    return (<h5 {...props}>{children}</h5>);
};

export default H5;
