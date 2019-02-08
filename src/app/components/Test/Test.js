/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Test
 * -----------------------------------------------------------------------------
 */

export default class Test extends Component {
    constructor(props) {
        super(props);
        this.state = { color: 'red' };
    }
    render() {
        const { color } = this.state;
        return (
            <Fragment>
                <div style={{ color }}>{color}</div>
            </Fragment>
        );
    }
}

Test.defaultProps = {};
