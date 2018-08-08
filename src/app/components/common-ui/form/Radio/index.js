/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Checkbox from 'components/common-ui/form/Checkbox';

/**
 * -----------------------------------------------------------------------------
 * React Component: Radio
 * -----------------------------------------------------------------------------
 */

export default class Radio extends Component {
    constructor(props) {
        super(props);
        this.state = { ...this.props };
    }

    render() {
        return <Checkbox {...this.state} type={'radio'} />;
    }
}
