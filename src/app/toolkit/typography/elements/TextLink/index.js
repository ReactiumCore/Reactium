/**
 * Created by Cam Tullos on 11/30/17
 */

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: TextLink
 * -----------------------------------------------------------------------------
 */
export default class TextLink extends Component {
    static dependencies() { return module.children; }
    
    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    onClick(e) {
        e.preventDefault();
        window.alert('LINK CLICKED');
    }

    render() {
        return (<a href={'#'} onClick={this.onClick.bind(this)}>Click Me</a>);
    }
}

TextLink.defaultProps = {};
