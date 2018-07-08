/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from "react";

/**
 * -----------------------------------------------------------------------------
 * React Component: Demo
 * -----------------------------------------------------------------------------
 */

export default class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps
        }));
    }

    render() {
        return <Fragment>Demo Landing Page</Fragment>;
    }
}

Demo.defaultProps = {};
