
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: Search
 * -----------------------------------------------------------------------------
 */

export default class Search extends Component {
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
            <form className={'re-toolkit-search'}>
                <input type={'text'} placeholder={'search'} />
            </form>
        );
    }
}

Search.defaultProps = {};
