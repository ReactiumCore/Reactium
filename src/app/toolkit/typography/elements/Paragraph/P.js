import React, { Component, Fragment } from "react";

const P = props => {
    let {
        children = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non orci cursus diam blandit tristique sit amet et nisi. Cras egestas viverra leo et pharetra. Suspendisse sodales velit ac scelerisque pellentesque. Phasellus non tortor vitae erat euismod mattis eget id nulla. Duis orci felis, pellentesque vitae neque maximus, venenatis consectetur nunc. Phasellus tincidunt, nunc ut aliquam congue, risus lectus pellentesque tellus, et ultricies augue nibh at augue. Phasellus fermentum iaculis risus, a blandit nisl lobortis in."
    } = props;

    return <p {...props}>{children}</p>;
};

export default P;
