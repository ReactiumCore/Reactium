
import React, { Component, Fragment } from 'react';

const H4 = (props) => {
    let { children = 'Heading 4' } = props;
    return (<h4 {...props}>{children}</h4>);
};

export default H4;
