
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import H1 from './H1';
import H2 from './H2';
import H3 from './H3';
import H4 from './H4';
import H5 from './H5';
import H6 from './H6';

/**
 * -----------------------------------------------------------------------------
 * React Component: Headings
 * -----------------------------------------------------------------------------
 */

export default class Headings extends Component {
    static dependencies() { return module.children; }
    
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
        let { text } = this.state;
        return (
            <Fragment>
                <H1 />
                <H2 />
                <H3 />
                <H4 />
                <H5 />
                <H6 />
            </Fragment>
        );
    }
}

export {
    H1,
    H2,
    H3,
    H4,
    H5,
    H6
}


Headings.defaultProps = {};
