
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: Docs
 * -----------------------------------------------------------------------------
 */

export default class Docs extends Component {
    constructor(props) {
        super(props);

        this.cont = null;
        this.state = { ...this.props };
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
        let { component:Component } = this.state;

        return (!Component) ? null : (
            <div ref={(elm) => { this.cont = elm; }} className={'re-toolkit-docs-view'}>
                <div className={'re-toolkit-card-heading thin'}>
                    <h3>Documentation</h3>
                </div>
                <div className={'re-toolkit-card-docs'}>
                    <Component />
                </div>
            </div>
        );
    }
}

Docs.defaultProps = {};
