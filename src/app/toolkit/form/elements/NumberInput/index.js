
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: NumberInput
 * -----------------------------------------------------------------------------
 */

class NumberInput extends Component {

    static dependencies() { return module.children; }

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
        this.setState((prevState) => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    render() {
        return (<input {...this.state} />);
    }
}

// Default properties
NumberInput.defaultProps = {
    value: 12345,
};

export default NumberInput;
