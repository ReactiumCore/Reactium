/**
 * Created by Cam Tullos on 11/30/17
 */

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Typography
 * -----------------------------------------------------------------------------
 */

export default class Typography extends Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.props);
    }

    onClick(e) {
        let { onClick } = this.state;

        if (typeof onClick === 'function') {
            e.preventDefault();
        }
    }

    render() {
        let { content } = this.state;
        return (
            <Fragment>
                <h3>Custom component instead of the default group list.</h3>
                <br />
                <p>
                    {content}
                </p>
            </Fragment>
        );
    }
}

Typography.defaultProps = {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non orci cursus diam blandit tristique sit amet et nisi. Cras egestas viverra leo et pharetra. Suspendisse sodales velit ac scelerisque pellentesque. Phasellus non tortor vitae erat euismod mattis eget id nulla. Duis orci felis, pellentesque vitae neque maximus, venenatis consectetur nunc. Phasellus tincidunt, nunc ut aliquam congue, risus lectus pellentesque tellus, et ultricies augue nibh at augue. Phasellus fermentum iaculis risus, a blandit nisl lobortis in.'
};
