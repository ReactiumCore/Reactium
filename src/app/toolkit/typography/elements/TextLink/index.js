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
 * React Component: TextLink
 * -----------------------------------------------------------------------------
 */
export default class TextLink extends Component {
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
        return (<a href={'javascript:void(0);'}>Click Me</a>);
    }
}

TextLink.defaultProps = {
    onClick: null,
};
