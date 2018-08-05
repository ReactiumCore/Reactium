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

class TextLink extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    render() {
        return <Fragment>COMPONENT</Fragment>;
    }
}

// Default properties
TextLink.defaultProps = {};

export default TextLink;
