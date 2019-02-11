/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * Toolkit Element: Theming
 * -----------------------------------------------------------------------------
 */

class Theming extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <button className='test'>BUTTON TEST</button>;
    }
}

// Default properties
Theming.defaultProps = {};

export default Theming;
