
import React, { Component, Fragment } from 'react';

const H2 = (props) => {
    let { children = 'Heading 2' } = props;
    return (<h2 {...props}>{children}</h2>);
};

export default H2;
