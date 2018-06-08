
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: Sidebar
 * -----------------------------------------------------------------------------
 */

export default class Sidebar extends Component {
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
        let { closed } = this.state;
        let cls = (closed === true) ? 're-toolkit-sidebar-closed' : '';
        return (
            <aside className={`re-toolkit-sidebar ${cls}`}>
                SIDEBAR
            </aside>
        );
    }
}

Sidebar.defaultProps = {
    closed: false,
};
