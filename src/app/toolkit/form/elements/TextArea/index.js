
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: TextArea
 * -----------------------------------------------------------------------------
 */

class TextArea extends Component {

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
        return (
                <textarea {...this.state} />
        );
    }
}

// Default properties
TextArea.defaultProps = {
    value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam blandit ipsum tortor, finibus aliquet sem volutpat at. Duis pretium eros sed lacus luctus, non sagittis leo vestibulum. Donec libero sapien, auctor sit amet vulputate a, efficitur ut elit. Etiam feugiat ornare metus, sit amet cursus erat sagittis vitae. Fusce pulvinar cursus neque sed consectetur. In aliquet porttitor lobortis. Praesent tristique, lacus quis consectetur venenatis, ante leo mattis sem, ornare posuere lacus ligula sed risus. Cras nec ullamcorper felis. Vivamus vehicula iaculis urna. In at metus tortor. Sed id felis vitae neque accumsan congue venenatis eget ex. Nam placerat, augue in ullamcorper consectetur, est sapien convallis neque, accumsan laoreet eros libero cursus elit.'
};

export default TextArea;
