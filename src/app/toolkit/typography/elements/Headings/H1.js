
import React, { Component, Fragment } from 'react';

const H1 = (props) => {
    let { children = 'Heading 1' } = props;
    return (<h1 {...props}>{children}</h1>);
};

export default H1;
