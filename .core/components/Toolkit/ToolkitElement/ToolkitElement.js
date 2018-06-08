
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Test from 'components/Test';


/**
 * -----------------------------------------------------------------------------
 * React Component: ToolkitElement
 * -----------------------------------------------------------------------------
 */

export default class ToolkitElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
        };
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    render() {
        return (
            <Fragment>
                <Test />
            </Fragment>
        );
    }
}

ToolkitElement.defaultProps = {};
