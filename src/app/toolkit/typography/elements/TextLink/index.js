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
        let { onClick } = this.state;
        e.preventDefault();

        if (typeof onClick === 'function') {
            onClick(e);
        } else {
            window.alert('LINK CLICKED');
        }
    }

    render() {
        let { type, label } = this.state;

        switch(type) {
            case 'button': {
                return (<button type={'button'} onClick={this.onClick.bind(this)}>{label}</button>)
            }

            default: {
                return (<a href={'#'} onClick={this.onClick.bind(this)}>{label}</a>);
            }
        }

    }
}

TextLink.defaultProps = {
    type: 'link',
    label: 'Click Me',
    onClick: null,
};
