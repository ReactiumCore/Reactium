
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: TextIput
 * -----------------------------------------------------------------------------
 */

class TextInput extends Component {

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
TextInput.defaultProps = {
    type: 'text',
    value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam blandit ipsum tortor, finibus aliquet sem volutpat at. Duis pretium eros sed lacus luctus, non sagittis leo vestibulum. Donec libero sapien, auctor sit amet vulputate a, efficitur ut elit. Etiam feugiat ornare metus'
};

export default TextInput;
