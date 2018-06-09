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
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        console.log('CLICKED');
    }

    render() {
        return (<a href={`javascript:void(0);`}>Click Me</a>);
    }
}

TextLink.defaultProps = {
    onClick: null,
};
