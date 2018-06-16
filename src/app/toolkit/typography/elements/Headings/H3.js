
import React, { Component, Fragment } from 'react';

const H3 = (props) => {
    let { children = 'Heading 3' } = props;
    return (<h3 {...props}>{children}</h3>);
};

export default H3;
