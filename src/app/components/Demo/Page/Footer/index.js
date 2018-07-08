/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from "react";

/**
 * -----------------------------------------------------------------------------
 * React Component: Footer
 * -----------------------------------------------------------------------------
 */

export default class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        };
    }

    componentDidMount() {
        if (this.state.hasOwnProperty("mount")) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps
        }));
    }

    render() {
        return <Fragment>COMPONENT</Fragment>;
    }
}

Footer.defaultProps = {};
