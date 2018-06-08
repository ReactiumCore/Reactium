
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Search from '../Search';

/**
 * -----------------------------------------------------------------------------
 * React Component: Menu
 * -----------------------------------------------------------------------------
 */

export default class Menu extends Component {
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
            <ul className={'re-toolkit-menu'}>
                <li><Search /></li>
                <li>MENU</li>
            </ul>
        );
    }
}

Menu.defaultProps = {};
